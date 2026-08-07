import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import {
  PrismaClient,
  TileSize,
  TileType,
} from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

const tiles = [
  {
    id: "about",
    type: TileType.text,
    size: TileSize.wide,
    title: "About me",
    position: 0,
    gridCol: 1,
    gridRow: 1,
    content: {
      text: "I build web applications and API integrations using TypeScript, React, Next.js and Node.js.",
    },
  },
  {
    id: "project",
    type: TileType.image,
    size: TileSize.square,
    title: "Featured project",
    position: 1,
    gridCol: 3,
    gridRow: 1,
    content: {
      imageUrl: "/placeholder-project.jpg",
      alt: "Featured project preview",
    },
  },
  {
    id: "github",
    type: TileType.link,
    size: TileSize.square,
    title: "GitHub",
    position: 3,
    gridCol: 3,
    gridRow: 2,
    content: {
      url: "https://github.com/Nikita8Sannikov",
      description: "My projects and open-source work",
    },
  },
  {
    id: "location",
    type: TileType.map,
    size: TileSize.wide,
    title: "Location",
    position: 2,
    gridCol: 1,
    gridRow: 2,
    content: {
      latitude: 45.2671,
      longitude: 19.8335,
      label: "Novi Sad, Serbia",
    },
  },
];

async function main() {
  const portfolio = await prisma.portfolio.upsert({
    where: {
      slug: "nikita",
    },

    update: {
      title: "Nikita",
      position: "Fullstack Developer",
      description:
        "I build web applications and API integrations using TypeScript, React, Next.js and Node.js.",
      isPublished: true,
    },

    create: {
      id: "portfolio_nikita",
      slug: "nikita",
      title: "Nikita",
      position: "Fullstack Developer",
      description:
        "I build web applications and API integrations using TypeScript, React, Next.js and Node.js.",
      isPublished: true,
    },
  });

  await prisma.tile.deleteMany({
    where: {
      portfolioId: portfolio.id,
    },
  });

  await prisma.tile.createMany({
    data: tiles.map((tile) => ({
      ...tile,
      portfolioId: portfolio.id,
    })),
  });
  console.log(`Seeded ${tiles.length} tiles`);
}

main()
  .catch((error: unknown) => {
    console.error("Failed to seed database:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
