import type { BentoTile, TileSize } from "@/types/bento";

export const tileSizeClasses: Record<TileSize, string> = {
  square: "md:col-span-1 md:row-span-1",
  wide: "md:col-span-2 md:row-span-1",
  tall: "md:col-span-1 md:row-span-2",
};

export function getTileSizeClass(
  tile: Pick<BentoTile, "type" | "size">,
) {
  if (tile.type === "map" && tile.size === "square") {
    return "md:col-span-1  md:row-span-2";
  }

  return tileSizeClasses[tile.size];
}