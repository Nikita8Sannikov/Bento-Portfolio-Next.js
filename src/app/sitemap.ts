import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const portfolios =
    await prisma.portfolio.findMany({
      where: {
        isPublished: true,
      },

      select: {
        slug: true,
        updatedAt: true,
      },

      orderBy: {
        updatedAt: "desc",
      },
    });

  return portfolios.map((portfolio) => ({
    url: `${siteConfig.url}/${portfolio.slug}`,
    lastModified: portfolio.updatedAt,
    changeFrequency: "weekly",
    priority: 1,
  }));
}