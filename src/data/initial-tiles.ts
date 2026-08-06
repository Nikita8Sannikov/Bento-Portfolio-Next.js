import type { BentoTile } from "@/types/bento";

export const initialTiles: BentoTile[] = [
  {
    id: "about",
    type: "text",
    size: "wide",
    title: "About me",
    gridCol: 1,
    gridRow: 1,
    text: "Fullstack developer working with TypeScript, React and Node.js.",
  },
  {
    id: "project",
    type: "image",
    size: "tall",
    title: "Featured project",
    gridCol: 3,
    gridRow: 1,
    imageUrl: "/placeholder-project.jpg",
    alt: "Featured project preview",
  },
  {
    id: "location",
    type: "map",
    size: "square",
    title: "Location",
    gridCol: 1,
    gridRow: 2,
    latitude: 45.2671,
    longitude: 19.8335,
    label: "Novi Sad, Serbia",
  },
  {
    id: "github",
    type: "link",
    size: "wide",
    title: "GitHub",
    gridCol: 2,
    gridRow: 3,
    url: "https://github.com/nikita8sannikov",
    description: "My projects and source code",
  },
];
