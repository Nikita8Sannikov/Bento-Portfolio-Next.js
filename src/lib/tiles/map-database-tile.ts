import type { Tile } from "@/generated/prisma/client";
import {
  bentoTileSchema,
  type BentoTile,
} from "@/types/bento";

import { computeAutoLayoutFromOrder } from "./grid-layout";

function isJsonObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

type DatabaseTileInput = Pick<
  Tile,
  "id" | "type" | "size" | "title" | "content"
> & {
  gridCol?: number | null;
  gridRow?: number | null;
};

export function mapDatabaseTile(
  databaseTile: DatabaseTileInput,
): BentoTile {
  if (!isJsonObject(databaseTile.content)) {
    throw new Error(
      `Tile "${databaseTile.id}" has invalid content`,
    );
  }

  const candidate = {
    id: databaseTile.id,
    type: databaseTile.type,
    size: databaseTile.size,
    title: databaseTile.title,
    gridCol: databaseTile.gridCol ?? 1,
    gridRow: databaseTile.gridRow ?? 1,
    ...databaseTile.content,
  };

  return bentoTileSchema.parse(candidate);
}

export function mapDatabaseTiles(
  databaseTiles: Array<
    Pick<Tile, "id" | "type" | "size" | "title" | "position" | "content"> & {
      gridCol?: number | null;
      gridRow?: number | null;
    }
  >,
): BentoTile[] {
  const sortedTiles = [...databaseTiles].sort(
    (left, right) => left.position - right.position,
  );

  const needsAutoLayout = sortedTiles.some(
    (tile) => tile.gridCol == null || tile.gridRow == null,
  );

  const autoLayout = needsAutoLayout
    ? computeAutoLayoutFromOrder(sortedTiles)
    : null;

  return sortedTiles.map((databaseTile) => {
    const layout = autoLayout?.get(databaseTile.id);

    return mapDatabaseTile({
      ...databaseTile,
      gridCol: databaseTile.gridCol ?? layout?.gridCol ?? 1,
      gridRow: databaseTile.gridRow ?? layout?.gridRow ?? 1,
    });
  });
}
