"use client";

import { useState, useTransition } from "react";
import { BentoGrid } from "../bento/BentoGrid";
import { PortfolioProfileEditor } from "./PortfolioProfileEditor";
import { TileForm } from "./TileForm";
import { Modal } from "../ui/Modal";
import { PortfolioShell } from "../portfolio/PortfolioShell";
import { BentoTile } from "@/types/bento";
import type { PortfolioData } from "@/types/portfolio";
import {
  createTileAction,
  deleteTileAction,
  updateTileAction,
  updateTilesLayoutAction,
} from "@/actions/tile-actions";
import { placeNewTile } from "@/lib/tiles/grid-layout";
import { getTileDisplayName } from "@/lib/tiles/get-tile-display-name";

type BentoEditorProps = {
  initialTiles: BentoTile[];
  portfolio: Pick<
    PortfolioData,
    "id" | "title" | "position" | "description" | "avatarUrl"
  >;
};

type TileFormState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; tile: BentoTile };

export function BentoEditor({ initialTiles, portfolio }: BentoEditorProps) {
  const [tiles, setTiles] = useState<BentoTile[]>(initialTiles);
  const [formState, setFormState] = useState<TileFormState>({ mode: "closed" });
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleLayoutChange(
    updates: Array<{ id: string; gridCol: number; gridRow: number }>,
  ) {
    if (isPending || updates.length === 0) {
      return;
    }

    const previousTiles = tiles;

    const hasChanges = updates.some((update) => {
      const tile = tiles.find((t) => t.id === update.id);
      return (
        tile &&
        (tile.gridCol !== update.gridCol || tile.gridRow !== update.gridRow)
      );
    });

    if (!hasChanges) {
      return;
    }

    const updateMap = new Map(
      updates.map((update) => [update.id, update]),
    );

    const nextTiles = tiles.map((tile) => {
      const update = updateMap.get(tile.id);
      if (update) {
        return { ...tile, gridCol: update.gridCol, gridRow: update.gridRow };
      }
      return tile;
    });

    setErrorMessage(null);
    setTiles(nextTiles);

    startTransition(async () => {
      try {
        await updateTilesLayoutAction(updates, portfolio.id);
      } catch (error) {
        console.error("Failed to update tile layout:", error);

        setTiles(previousTiles);
        setErrorMessage("Failed to save tile positions");
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
        await deleteTileAction(portfolio.id, id);
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
    const existingTile = isEditing
      ? tiles.find((currentTile) => currentTile.id === tile.id)
      : undefined;

    const tileToSave = isEditing
      ? {
          ...tile,
          gridCol: existingTile?.gridCol ?? 1,
          gridRow: existingTile?.gridRow ?? 1,
        }
      : placeNewTile(tile, tiles);

    setErrorMessage(null);

    if (isEditing) {
      setTiles((currentTiles) =>
        currentTiles.map((currentTile) =>
          currentTile.id === tileToSave.id ? tileToSave : currentTile,
        ),
      );
    } else {
      setTiles((currentTiles) => [...currentTiles, tileToSave]);
    }

    handleCloseForm();

    startTransition(async () => {
      try {
        if (isEditing) {
          await updateTileAction(tileToSave, portfolio.id);
        } else {
          await createTileAction(tileToSave, portfolio.id);
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
    <PortfolioShell
      sidebar={<PortfolioProfileEditor portfolio={portfolio} />}
    >
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-neutral-500">{tiles.length} tiles</p>

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
      </div>

      {formState.mode !== "closed" && (
        <Modal
          title={
            formState.mode === "edit"
              ? `Edit “${getTileDisplayName(formState.tile)}”`
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
        onLayoutChange={handleLayoutChange}
        onEditTile={handleEditTile}
        onDeleteTile={handleDeleteTile}
      />
    </PortfolioShell>
  );
}
