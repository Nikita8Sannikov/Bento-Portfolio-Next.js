import type { Tile } from "@/generated/prisma/client";
import {
  bentoTileSchema,
  type BentoTile,
} from "@/types/bento";

function isJsonObject(
    value: unknown,
  ): value is Record<string, unknown> {
    return (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value)
    );
  }
  
  export function mapDatabaseTile(
    databaseTile: Tile,
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
      ...databaseTile.content,
    };
  
    return bentoTileSchema.parse(candidate);
  }