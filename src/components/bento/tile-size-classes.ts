import type { BentoTile, TileSize } from "@/types/bento";

export const tileSizeClasses: Record<TileSize, string> = {
  square: "md:col-span-1 md:row-span-1",
  wide: "md:col-span-2 md:row-span-1",
  tall: "md:col-span-1 md:row-span-2",
};

export function getTileSizeClass(tile: Pick<BentoTile, "type" | "size">) {

  if (tile.type === "map") {

    if (tile.size === "square") {

      return "md:col-span-1 md:row-span-2";

    }



    if (tile.size === "tall") {

      return "md:col-span-1 md:row-span-3";

    }

  }

  return tileSizeClasses[tile.size];
}