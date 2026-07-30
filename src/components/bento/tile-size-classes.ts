import type { TileSize } from "@/types/bento";

export const tileSizeClasses: Record<TileSize, string> = {
  square: "md:col-span-1 md:row-span-1",
  wide: "md:col-span-2 md:row-span-1",
  tall: "md:col-span-1 md:row-span-2",
};