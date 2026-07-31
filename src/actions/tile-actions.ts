"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { BentoTile, bentoTileSchema, bentoTilesSchema } from "@/types/bento";
import { requireAdmin } from "@/lib/auth/require-admin";

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

function revalidateTilePages() {
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteTileAction(tileId: string): Promise<void> {
  await requireAdmin();

  await prisma.tile.delete({
    where: {
      id: tileId,
    },
  });

  revalidateTilePages();
}

export async function createTileAction(input: BentoTile): Promise<void> {
  await requireAdmin();

  const tile = bentoTileSchema.parse(input);

  const lastTile = await prisma.tile.findFirst({
    orderBy: {
      position: "desc",
    },
    select: {
      position: true,
    },
  });

  const position = lastTile ? lastTile.position + 1 : 0;

  await prisma.tile.create({
    data: {
      id: tile.id,
      type: tile.type,
      size: tile.size,
      title: tile.title,
      position,
      content: getTileContent(tile),
    },
  });

  revalidateTilePages();
}

export async function updateTileAction(input: BentoTile): Promise<void> {
  await requireAdmin();

  const tile = bentoTileSchema.parse(input);

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

  revalidateTilePages();
}

export async function reorderTilesAction(input: BentoTile[]): Promise<void> {
  await requireAdmin();

  const tiles = bentoTilesSchema.parse(input);

  await prisma.$transaction(
    tiles.map((tile, position) =>
      prisma.tile.update({
        where: {
          id: tile.id,
        },
        data: {
          position,
        },
      }),
    ),
  );

  revalidateTilePages();
}
