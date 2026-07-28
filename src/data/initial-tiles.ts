import type { BentoTile } from "@/types/bento";

export const initialTiles: BentoTile[] = [
{
    id: "about",
    type: "text",
    size: "wide",
    title: "About me",
    text: "Fullstack developer working with TypeScript, React and Node.js.",
  },
  {
    id: "project",
    type: "image",
    size: "tall",
    title: "Featured project",
    imageUrl: "/placeholder-project.jpg",
    alt: "Featured project preview",
  },
  {
    id: "location",
    type: "map",
    size: "square",
    title: "Location",
    latitude: 45.2671,
    longitude: 19.8335,
    label: "Novi Sad, Serbia",
  },
  {
    id: "github",
    type: "link",
    size: "wide",
    title: "GitHub",
    url: "https://github.com/nikita8sannikov",
    description: "My projects and source code",
  },
];
