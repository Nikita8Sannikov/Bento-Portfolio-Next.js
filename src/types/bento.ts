export type TileSize = "square" | "wide" | "tall";

export type TileType = "text" | "image" | "link" | "map";

export type BentoTile = {
  id: string;
  type: TileType;
  size: TileSize;
  title: string;
};