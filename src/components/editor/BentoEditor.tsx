"use client";

import { useState, useTransition } from "react";
import { BentoGrid } from "../bento/BentoGrid";
import { TileForm } from "./TileForm";
import { Modal } from "../ui/Modal";
import { BentoTile } from "@/types/bento";
import {
  createTileAction,
  deleteTileAction,
  reorderTilesAction,
  updateTileAction,
} from "@/actions/tile-actions";

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
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleReorderTiles(reorderedTiles: BentoTile[]) {
    if (isPending) {
      return;
    }

    const previousTiles = tiles;

    setErrorMessage(null);
    setTiles(reorderedTiles);

    startTransition(async () => {
      try {
        await reorderTilesAction(reorderedTiles);
        // setIsReordering(true);
      } catch (error) {
        console.error("Failed to reorder tiles:", error);

        setTiles(previousTiles);
        setErrorMessage("Failed to save new order");
      }
    });
  }

  function handleEditTile(tile: BentoTile) {
    setFormState({
      mode: "edit",
      tile,
    });
  }

  function handleDeleteTile(id: string) {
    const previousTiles = tiles;

    setErrorMessage(null);

    setTiles((currentTiles) => currentTiles.filter((tile) => tile.id !== id));

    startTransition(async () => {
      try {
        await deleteTileAction(id);
      } catch (e) {
        console.error("Failed to delete tile:", e);

        setTiles(previousTiles);
        setErrorMessage("Failed to delete tile.");
      }
    });
  }

  function handleCloseForm() {
    setFormState({
      mode: "closed",
    });
  }

  function handleSaveTile(tile: BentoTile) {
    const previousTiles = tiles;
    const previousFormState = formState;
    const isEditing = formState.mode === "edit";

    setErrorMessage(null);

    if (isEditing) {
      setTiles((currentTiles) =>
        currentTiles.map((currentTile) =>
          currentTile.id === tile.id ? tile : currentTile,
        ),
      );
    } else {
      setTiles((currentTiles) => [...currentTiles, tile]);
    }

    handleCloseForm();

    startTransition(async () => {
      try {
        if (isEditing) {
          await updateTileAction(tile);
        } else {
          await createTileAction(tile);
        }
      } catch (error) {
        console.error("Failed to save tile:", error);

        setTiles(previousTiles);
        setFormState(previousFormState);

        setErrorMessage(
          isEditing ? "Failed to save changes:" : "Failed to create tile:",
        );
      }
    });
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
          disabled={isPending}
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
            onSubmit={handleSaveTile}
            onCancel={handleCloseForm}
          />
        </Modal>
      )}

      <div className="mb-4 min-h-6">
        {isPending && (
          <p className="text-sm text-neutral-400">Saving changes...</p>
        )}

        {errorMessage && (
          <p role="alert" className="text-sm text-red-400">
            {errorMessage}
          </p>
        )}
      </div>

      <BentoGrid
        tiles={tiles}
        disabled={isPending}
        onReorderTiles={handleReorderTiles}
        onEditTile={handleEditTile}
        onDeleteTile={handleDeleteTile}
      />
    </>
  );
}
