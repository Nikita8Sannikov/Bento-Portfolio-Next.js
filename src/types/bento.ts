import { z } from "zod";

export const tileSizeSchema = z.enum([
  "square",
  "wide",
  "tall",
]);

const baseTileSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1),
  size: tileSizeSchema,
  gridCol: z.number().int().min(1).max(3),
  gridRow: z.number().int().min(1),
});

export const textTileSchema = baseTileSchema.extend({
  type: z.literal("text"),
  text: z.string(),
});

export const imageTileSchema = baseTileSchema.extend({
  type: z.literal("image"),
  imageUrl: z.string().trim().min(1),
  alt: z.string().trim().min(1),
});

export const linkTileSchema = baseTileSchema.extend({
  type: z.literal("link"),
  url: z.url(),
  description: z.string(),
});

export const mapTileSchema = baseTileSchema.extend({
  type: z.literal("map"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  label: z.string().trim().min(1),
});

// export type BentoTile = TextTile | ImageTile | LinkTile | MapTile;
export const bentoTileSchema = z.discriminatedUnion("type", [
  textTileSchema,
  imageTileSchema,
  linkTileSchema,
  mapTileSchema,
]);

export const bentoTilesSchema = z.array(bentoTileSchema);

export type TileSize = z.infer<typeof tileSizeSchema>;

export type TextTile = z.infer<typeof textTileSchema>;
export type ImageTile = z.infer<typeof imageTileSchema>;
export type LinkTile = z.infer<typeof linkTileSchema>;
export type MapTile = z.infer<typeof mapTileSchema>;

export type BentoTile = z.infer<typeof bentoTileSchema>;
export type TileType = BentoTile["type"];
