import "server-only";

import { prisma } from "@/lib/prisma";
import { mapDatabaseTiles } from "@/lib/tiles/map-database-tile";
import type { PortfolioData } from "@/types/portfolio";

type GetPortfolioOptions = {
  publishedOnly?: boolean;
};

export async function getPortfolioBySlug(
  slug: string,
  options: GetPortfolioOptions = {},
): Promise<PortfolioData | null> {
  const portfolio = await prisma.portfolio.findFirst({
    where: {
      slug,

      ...(options.publishedOnly
        ? {
            isPublished: true,
          }
        : {}),
    },

    include: {
      tiles: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!portfolio) {
    return null;
  }

  return {
    id: portfolio.id,
    slug: portfolio.slug,
    title: portfolio.title,
    description: portfolio.description,
    position: portfolio.position,
    avatarUrl: portfolio.avatarUrl,
    isPublished: portfolio.isPublished,

    tiles: mapDatabaseTiles(portfolio.tiles),
  };
}