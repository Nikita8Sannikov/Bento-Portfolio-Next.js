"use client";

import type { BentoTile } from "@/types/bento";
import { useState } from "react";
import { BentoGrid } from "../bento/BentoGrid";
import { AddTileForm } from "./AddTileForm";

type BentoEditorProps = {
  initialTiles: BentoTile[];
};

export function BentoEditor({ initialTiles }: BentoEditorProps) {
  const [tiles, setTiles] = useState<BentoTile[]>(initialTiles);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

function handleCreateTile(tile: BentoTile) {
    setTiles((currentTiles) => [
      ...currentTiles,
      tile,
    ]);

    setIsAddFormOpen(false);
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
          onClick={() =>
            setIsAddFormOpen((currentValue) => !currentValue)
          }
          className="rounded-xl bg-white px-4 py-2 font-medium text-black"
        >
          {isAddFormOpen ? "Close form" : "Add tile"}
        </button>
      </header>


      {isAddFormOpen && (
        <AddTileForm
          onCreate={handleCreateTile}
          onCancel={() => setIsAddFormOpen(false)}
        />
      )}

      <BentoGrid tiles={tiles} onDeleteTile={handleDeleteTile} />
    </>
  );
}
