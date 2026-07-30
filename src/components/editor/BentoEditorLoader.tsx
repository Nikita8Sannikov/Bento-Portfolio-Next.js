"use client";

import dynamic from "next/dynamic";

import type { BentoTile } from "@/types/bento";

const BentoEditor = dynamic(
  () =>
    import("@/components/editor/BentoEditor").then(
      (module) => module.BentoEditor,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="grid auto-rows-[12rem] grid-cols-1 gap-4 md:grid-cols-4">
        <div className="animate-pulse rounded-3xl bg-neutral-900 md:col-span-2" />
        <div className="animate-pulse rounded-3xl bg-neutral-900" />
        <div className="animate-pulse rounded-3xl bg-neutral-900" />
      </div>
    ),
  },
);

type BentoEditorLoaderProps = {
  initialTiles: BentoTile[];
};

export function BentoEditorLoader({
  initialTiles,
}: BentoEditorLoaderProps) {
  return <BentoEditor initialTiles={initialTiles} />;
}