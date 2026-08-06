"use client";

import dynamic from "next/dynamic";

import type { BentoTile } from "@/types/bento";
import type { PortfolioData } from "@/types/portfolio";

const BentoEditor = dynamic(
  () =>
    import("@/components/editor/BentoEditor").then(
      (module) => module.BentoEditor,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        <div className="mb-8 lg:col-span-1 lg:mb-0">
          <div className="aspect-square animate-pulse rounded-2xl bg-neutral-900" />
        </div>
        <div className="grid auto-rows-[12rem] grid-cols-1 gap-4 md:grid-cols-3 lg:col-span-3">
          <div className="animate-pulse rounded-3xl bg-neutral-900 md:col-span-2" />
          <div className="animate-pulse rounded-3xl bg-neutral-900" />
          <div className="animate-pulse rounded-3xl bg-neutral-900" />
        </div>
      </div>
    ),
  },
);

type BentoEditorLoaderProps = {
  portfolio: Pick<
    PortfolioData,
    "id" | "title" | "position" | "description" | "avatarUrl"
  >;
  initialTiles: BentoTile[];
};

export function BentoEditorLoader({
  portfolio,
  initialTiles,
}: BentoEditorLoaderProps) {
  return (
    <BentoEditor portfolio={portfolio} initialTiles={initialTiles} />
  );
}
