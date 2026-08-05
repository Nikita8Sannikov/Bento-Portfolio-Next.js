import type { BentoTile } from "@/types/bento";

export type PortfolioData = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  isPublished: boolean;
  tiles: BentoTile[];
};