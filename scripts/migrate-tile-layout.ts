import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";
import { computeAutoLayoutFromOrder } from "../src/lib/tiles/grid-layout";

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

async function main() {
  const portfolios = await prisma.portfolio.findMany({
    include: {
      tiles: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  for (const portfolio of portfolios) {
    const layout = computeAutoLayoutFromOrder(portfolio.tiles);

    for (const tile of portfolio.tiles) {
      const cell = layout.get(tile.id);

      if (!cell) {
        continue;
      }

      await prisma.tile.update({
        where: {
          id: tile.id,
        },

        data: {
          gridCol: cell.gridCol,
          gridRow: cell.gridRow,
        },
      });
    }

    console.log(
      `Updated layout for ${portfolio.slug} (${portfolio.tiles.length} tiles)`,
    );
  }
}

main()
  .catch((error: unknown) => {
    console.error("Failed to migrate tile layout:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
