import "server-only";

import { prisma } from "@/lib/prisma";
import { mapDatabaseTile } from "@/lib/tiles/map-database-tile";
import type { BentoTile } from "@/types/bento";

export async function getTiles(): Promise<BentoTile[]> {
  const databaseTiles = await prisma.tile.findMany({
    orderBy: {
      position: "asc",
    },
  });

  return databaseTiles.map(mapDatabaseTile);
}