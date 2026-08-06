import type { BentoTile } from "@/types/bento";

export type PortfolioData = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  position: string | null;
  avatarUrl: string | null;
  isPublished: boolean;
  tiles: BentoTile[];
};