export type TileSize = "square" | "wide" | "tall";

type BaseTile = {
  id: string;
  title: string;
  size: TileSize;
};


export type TextTile = BaseTile & {
  type: "text";
  text: string;
};

export type ImageTile = BaseTile & {
  type: "image";
  imageUrl: string;
  alt: string;
};

export type LinkTile = BaseTile & {
  type: "link";
  url: string;
  description: string;
};

export type MapTile = BaseTile & {
  type: "map";
  latitude: number;
  longitude: number;
  label: string;
};

export type BentoTile =
  | TextTile
  | ImageTile
  | LinkTile
  | MapTile;

export type TileType = BentoTile["type"];