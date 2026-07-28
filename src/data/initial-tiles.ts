import type { BentoTile } from "@/types/bento";

export const initialTiles: BentoTile[] = [
  {
    id: "about",
    type: "text",
    size: "wide",
    title: "About me",
  },
  {
    id: "project",
    type: "image",
    size: "square",
    title: "Featured project",
  },
  {
    id: "location",
    type: "map",
    size: "tall",
    title: "Novi Sad, Serbia",
  },
];
