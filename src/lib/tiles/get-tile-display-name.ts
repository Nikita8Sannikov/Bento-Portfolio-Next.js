import type { BentoTile } from "@/types/bento";

export function getTileDisplayName(tile: BentoTile): string {
  if (tile.title.trim()) {
    return tile.title;
  }

  switch (tile.type) {
    case "image":
      return tile.alt || "Image";
    case "map":
      return tile.label || "Map";
    case "text":
      return tile.text.trim().slice(0, 40) || "Text";
    case "link":
      return tile.description.trim() || tile.url;
    default:
      return tile.type;
  }
}
