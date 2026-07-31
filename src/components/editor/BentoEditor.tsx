"use client";

import { useState } from "react";
import { BentoGrid } from "../bento/BentoGrid";
import { TileForm } from "./TileForm";
import { Modal } from "../ui/Modal";
import { BentoTile } from "@/types/bento";

type BentoEditorProps = {
  initialTiles: BentoTile[];
};

type TileFormState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; tile: BentoTile };

export function BentoEditor({ initialTiles }: BentoEditorProps) {
  const [tiles, setTiles] = useState<BentoTile[]>(initialTiles);
  const [formState, setFormState] = useState<TileFormState>({ mode: "closed" });

  function handleReorderTiles(reorderedTiles: BentoTile[]) {
    setTiles(reorderedTiles);
  }

  function handleEditTile(tile: BentoTile) {
    setFormState({
      mode: "edit",
      tile,
    });
  }

  function handleDeleteTile(id: string) {
    setTiles((currentTiles) => currentTiles.filter((tile) => tile.id !== id));
  }

  function handleCloseForm() {
    setFormState({
      mode: "closed",
    });
  }

  function handleSubmitTile(tile: BentoTile) {
    if (formState.mode === "edit") {
      setTiles((currentTiles) =>
        currentTiles.map((currentTile) =>
          currentTile.id === tile.id ? tile : currentTile,
        ),
      );
    }

    if (formState.mode === "create") {
      setTiles((currentTiles) => [...currentTiles, tile]);
    }

    handleCloseForm();
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
            setFormState({
              mode: "create",
            })
          }
          className="rounded-xl bg-white px-4 py-2 font-medium text-black"
        >
          Add tile
        </button>
      </header>

      {formState.mode !== "closed" && (
        <Modal
          title={
            formState.mode === "edit"
              ? `Edit “${formState.tile.title}”`
              : "Add new tile"
          }
          onClose={handleCloseForm}
        >
          <TileForm
            key={formState.mode === "edit" ? formState.tile.id : "create"}
            initialTile={formState.mode === "edit" ? formState.tile : undefined}
            onSubmit={handleSubmitTile}
            onCancel={handleCloseForm}
          />
        </Modal>
      )}

      <BentoGrid
        tiles={tiles}
        onReorderTiles={handleReorderTiles}
        onEditTile={handleEditTile}
        onDeleteTile={handleDeleteTile}
      />
    </>
  );
}
