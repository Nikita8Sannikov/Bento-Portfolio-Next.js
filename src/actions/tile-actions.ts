"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/prisma";
import {
  bentoTileSchema,
  bentoTilesSchema,
  type BentoTile,
} from "@/types/bento";

function getTileContent(tile: BentoTile) {
  switch (tile.type) {
    case "text":
      return {
        text: tile.text,
      };

    case "image":
      return {
        imageUrl: tile.imageUrl,
        alt: tile.alt,
      };

    case "link":
      return {
        url: tile.url,
        description: tile.description,
      };

    case "map":
      return {
        latitude: tile.latitude,
        longitude: tile.longitude,
        label: tile.label,
      };
  }
}

async function getPortfolioSlug(
  portfolioId: string,
): Promise<string> {
  const portfolio =
    await prisma.portfolio.findUnique({
      where: {
        id: portfolioId,
      },

      select: {
        slug: true,
      },
    });

  if (!portfolio) {
    throw new Error(
      "Portfolio not found.",
    );
  }

  return portfolio.slug;
}

function revalidateTilePages(
  portfolioSlug: string,
) {
  revalidatePath(`/${portfolioSlug}`);
  revalidatePath("/admin");
}

export async function deleteTileAction(
  portfolioId: string,
  tileId: string,
): Promise<void> {
  await requireAdmin();

  const portfolioSlug =
    await getPortfolioSlug(portfolioId);

  const existingTile =
    await prisma.tile.findFirst({
      where: {
        id: tileId,
        portfolioId,
      },

      select: {
        id: true,
      },
    });

  if (!existingTile) {
    throw new Error(
      "Tile not found in this portfolio.",
    );
  }

  await prisma.tile.delete({
    where: {
      id: tileId,
    },
  });

  revalidateTilePages(portfolioSlug);
}

export async function createTileAction(
  input: BentoTile,
  portfolioId: string,
): Promise<void> {
  await requireAdmin();

  const tile =
    bentoTileSchema.parse(input);

  const portfolioSlug =
    await getPortfolioSlug(portfolioId);

  const lastTile =
    await prisma.tile.findFirst({
      where: {
        portfolioId,
      },

      orderBy: {
        position: "desc",
      },

      select: {
        position: true,
      },
    });

  const position =
    lastTile === null
      ? 0
      : lastTile.position + 1;

  await prisma.tile.create({
    data: {
      id: tile.id,
      portfolioId,

      type: tile.type,
      size: tile.size,
      title: tile.title,
      position,

      content: getTileContent(tile),
    },
  });

  revalidateTilePages(portfolioSlug);
}

export async function updateTileAction(
  input: BentoTile,
  portfolioId: string,
): Promise<void> {
  await requireAdmin();

  const tile =
    bentoTileSchema.parse(input);

  const portfolioSlug =
    await getPortfolioSlug(portfolioId);

  const existingTile =
    await prisma.tile.findFirst({
      where: {
        id: tile.id,
        portfolioId,
      },

      select: {
        id: true,
      },
    });

  if (!existingTile) {
    throw new Error(
      "Tile not found in this portfolio.",
    );
  }

  await prisma.tile.update({
    where: {
      id: tile.id,
    },

    data: {
      type: tile.type,
      size: tile.size,
      title: tile.title,
      content: getTileContent(tile),
    },
  });

  revalidateTilePages(portfolioSlug);
}

export async function reorderTilesAction(
  input: BentoTile[],
  portfolioId: string,
): Promise<void> {
  await requireAdmin();

  const tiles =
    bentoTilesSchema.parse(input);

  const portfolioSlug =
    await getPortfolioSlug(portfolioId);

  const currentTiles =
    await prisma.tile.findMany({
      where: {
        portfolioId,
      },

      select: {
        id: true,
        position: true,
      },
    });

  const requestedIds = new Set(
    tiles.map((tile) => tile.id),
  );

  const currentIds = new Set(
    currentTiles.map((tile) => tile.id),
  );

  const containsExactlyPortfolioTiles =
    requestedIds.size === tiles.length &&
    requestedIds.size === currentIds.size &&
    [...requestedIds].every((id) =>
      currentIds.has(id),
    );

  if (!containsExactlyPortfolioTiles) {
    throw new Error(
      "Invalid tile order for this portfolio.",
    );
  }

  const maxPosition = currentTiles.reduce(
    (maximum, tile) =>
      Math.max(maximum, tile.position),
    -1,
  );

  const temporaryOffset =
    maxPosition + currentTiles.length + 1;

  await prisma.$transaction(
    async (transaction) => {
      await transaction.tile.updateMany({
        where: {
          portfolioId,
        },

        data: {
          position: {
            increment: temporaryOffset,
          },
        },
      });

      for (
        let position = 0;
        position < tiles.length;
        position += 1
      ) {
        const tile = tiles[position];

        await transaction.tile.update({
          where: {
            id: tile.id,
          },

          data: {
            position,
          },
        });
      }
    },
  );

  revalidateTilePages(portfolioSlug);
}