"use client";

import { bentoTilesSchema, type BentoTile } from "@/types/bento";
import { useEffect, useState } from "react";
import { BentoGrid } from "../bento/BentoGrid";
import { TileForm } from "./TileForm";
import { Modal } from "../ui/Modal";

const STORAGE_KEY = "bento-portfolio-tiles";

type BentoEditorProps = {
  initialTiles: BentoTile[];
};

type TileFormState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; tile: BentoTile };

function loadTilesFromStorage(fallbackTiles: BentoTile[]): BentoTile[] {
  const savedTiles = localStorage.getItem(STORAGE_KEY);

  if (!savedTiles) {
    return fallbackTiles;
  }

  try {
    const parsedValue: unknown = JSON.parse(savedTiles);

    const result = bentoTilesSchema.safeParse(parsedValue);

    if (!result.success) {
      console.error("Invalid tiles in localStorage:", result.error);

      localStorage.removeItem(STORAGE_KEY);

      return fallbackTiles;
    }

    return result.data;
  } catch (error) {
    console.error("Failed to parse saved tiles:", error);
    localStorage.removeItem(STORAGE_KEY);
    return fallbackTiles;
  }
}

export function BentoEditor({ initialTiles }: BentoEditorProps) {
  const [tiles, setTiles] = useState<BentoTile[]>(() =>
    loadTilesFromStorage(initialTiles),
  );
  const [formState, setFormState] = useState<TileFormState>({ mode: "closed" });

  function handleReorderTiles(reorderedTiles: BentoTile[]) {
    setTiles(reorderedTiles);
  }

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tiles));
  }, [tiles]);

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

  function handleResetTiles() {
    setTiles(initialTiles);
    localStorage.removeItem(STORAGE_KEY);
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
          onClick={handleResetTiles}
          className="
      rounded-xl border border-neutral-700
      px-4 py-2 text-neutral-300
      hover:bg-neutral-900 hover:text-white
    "
        >
          Reset
        </button>

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
