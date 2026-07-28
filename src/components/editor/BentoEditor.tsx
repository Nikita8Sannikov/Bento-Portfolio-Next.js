"use client";

import type { BentoTile } from "@/types/bento";
import { useState } from "react";
import { BentoGrid } from "../bento/BentoGrid";

type BentoEditorProps = {
  initialTiles: BentoTile[];
};

export function BentoEditor({ initialTiles }: BentoEditorProps) {
  const [tiles, setTiles] = useState<BentoTile[]>(initialTiles);

  function handleAddTile() {
    const newTile: BentoTile = {
      id: crypto.randomUUID(),
      type: "text",
      size: "square",
      title: "New tile",
    };

    setTiles((currentTiles) => [...currentTiles, newTile]);
  }

  function handleDeleteTile(id: string) {
    setTiles((currentTiles) => currentTiles.filter((tile) => tile.id !== id));
  }

  return (
    <>
      <header className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-400">Bento Portfolio</p>
          <h1 className="text-3xl font-bold">Portfolio editor</h1>
          <p className="mt-2 text-sm text-neutral-500">{tiles.length} tiles</p>
        </div>

        <button
          type="button"
          onClick={handleAddTile}
          className="rounded-xl bg-white px-4 py-2 font-medium text-black"
        >
          Add tile
        </button>
      </header>

      <BentoGrid tiles={tiles} onDeleteTile={handleDeleteTile} />
    </>
  );
}
