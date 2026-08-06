"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/require-admin";
import {
  canPlace,
  findFirstFit,
  getOccupiedCells,
  getTileSpan,
} from "@/lib/tiles/grid-layout";
import { prisma } from "@/lib/prisma";
import {
  bentoTileSchema,
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
        ...(tile.url ? { url: tile.url } : {}),
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

type PortfolioLayoutTile = {
  id: string;
  type: BentoTile["type"];
  size: BentoTile["size"];
  gridCol: number;
  gridRow: number;
};

async function getPortfolioLayoutTiles(
  portfolioId: string,
): Promise<PortfolioLayoutTile[]> {
  return prisma.tile.findMany({
    where: {
      portfolioId,
    },

    select: {
      id: true,
      type: true,
      size: true,
      gridCol: true,
      gridRow: true,
    },
  });
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

  const existingTiles =
    await getPortfolioLayoutTiles(portfolioId);

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

  const { colSpan, rowSpan } = getTileSpan(tile);
  const occupied = getOccupiedCells(existingTiles);
  const { gridCol, gridRow } = findFirstFit(
    colSpan,
    rowSpan,
    occupied,
  );

  await prisma.tile.create({
    data: {
      id: tile.id,
      portfolioId,

      type: tile.type,
      size: tile.size,
      title: tile.title,
      position,
      gridCol,
      gridRow,

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
        gridCol: true,
        gridRow: true,
      },
    });

  if (!existingTile) {
    throw new Error(
      "Tile not found in this portfolio.",
    );
  }

  const layoutTiles =
    await getPortfolioLayoutTiles(portfolioId);

  const occupied = getOccupiedCells(
    layoutTiles,
    tile.id,
  );

  const { colSpan, rowSpan } = getTileSpan(tile);
  let gridCol = existingTile.gridCol;
  let gridRow = existingTile.gridRow;

  if (
    !canPlace(
      gridCol,
      gridRow,
      colSpan,
      rowSpan,
      occupied,
    )
  ) {
    const nextFit = findFirstFit(
      colSpan,
      rowSpan,
      occupied,
    );
    gridCol = nextFit.gridCol;
    gridRow = nextFit.gridRow;
  }

  await prisma.tile.update({
    where: {
      id: tile.id,
    },

    data: {
      type: tile.type,
      size: tile.size,
      title: tile.title,
      gridCol,
      gridRow,
      content: getTileContent(tile),
    },
  });

  revalidateTilePages(portfolioSlug);
}

export async function updateTileLayoutAction(
  input: {
    id: string;
    gridCol: number;
    gridRow: number;
  },
  portfolioId: string,
): Promise<void> {
  await requireAdmin();

  const portfolioSlug =
    await getPortfolioSlug(portfolioId);

  const layoutTiles =
    await getPortfolioLayoutTiles(portfolioId);

  const tile = layoutTiles.find(
    (layoutTile) => layoutTile.id === input.id,
  );

  if (!tile) {
    throw new Error(
      "Tile not found in this portfolio.",
    );
  }

  const occupied = getOccupiedCells(
    layoutTiles,
    input.id,
  );

  const { colSpan, rowSpan } = getTileSpan(tile);

  if (
    !canPlace(
      input.gridCol,
      input.gridRow,
      colSpan,
      rowSpan,
      occupied,
    )
  ) {
    throw new Error(
      "Invalid tile placement.",
    );
  }

  await prisma.tile.update({
    where: {
      id: input.id,
    },

    data: {
      gridCol: input.gridCol,
      gridRow: input.gridRow,
    },
  });

  revalidateTilePages(portfolioSlug);
}

export async function updateTilesLayoutAction(
  updates: Array<{
    id: string;
    gridCol: number;
    gridRow: number;
  }>,
  portfolioId: string,
): Promise<void> {
  await requireAdmin();

  if (updates.length === 0) {
    return;
  }

  const portfolioSlug =
    await getPortfolioSlug(portfolioId);

  const layoutTiles =
    await getPortfolioLayoutTiles(portfolioId);

  const tileIds = new Set(
    layoutTiles.map((tile) => tile.id),
  );

  for (const update of updates) {
    if (!tileIds.has(update.id)) {
      throw new Error(
        `Tile ${update.id} not found in this portfolio.`,
      );
    }
  }

  await prisma.$transaction(
    updates.map((update) =>
      prisma.tile.update({
        where: {
          id: update.id,
        },
        data: {
          gridCol: update.gridCol,
          gridRow: update.gridRow,
        },
      }),
    ),
  );

  revalidateTilePages(portfolioSlug);
}
