"use client";

import type { BentoTile as BentoTileData } from "@/types/bento";
import { useDraggable } from "@dnd-kit/core";
import { ConfirmButton } from "react-confirm-action";
import { getGridPlacementClassName, getGridPlacementVariables } from "@/lib/tiles/grid-layout";
import { getTileDisplayName } from "@/lib/tiles/get-tile-display-name";
import { BentoTileView } from "./BentoTileView";

type BentoTileProps = {
  tile: BentoTileData;
  disabled?: boolean;
  isDragging?: boolean;
  isSwapTarget?: boolean;
  isPushTarget?: boolean;
  onEdit: (tile: BentoTileData) => void;
  onDelete: (id: string) => void;
};

export function BentoTile({
  tile,
  disabled,
  isDragging = false,
  isSwapTarget = false,
  isPushTarget = false,
  onEdit,
  onDelete,
}: BentoTileProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging: isDraggableActive,
  } = useDraggable({
    id: tile.id,
    disabled,
  });

  const dragging = isDragging || isDraggableActive;

  function getTargetClass(): string {
    if (isSwapTarget) {
      return "ring-2 ring-blue-400 ring-offset-2 ring-offset-neutral-950";
    }
    if (isPushTarget) {
      return "ring-2 ring-amber-400 ring-offset-2 ring-offset-neutral-950";
    }
    return "";
  }

  const tileName = getTileDisplayName(tile);

  return (
    <div
      ref={setNodeRef}
      style={getGridPlacementVariables(tile)}
      className={`${getGridPlacementClassName()} ${dragging ? "z-20 opacity-40" : ""} ${getTargetClass()} transition-shadow`}
    >
      <BentoTileView tile={tile} applyGridSize={false} className="h-full">
        <div className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-xl bg-neutral-950/80 p-1 backdrop-blur-sm">
          <button
            type="button"
            disabled={disabled}
            {...attributes}
            {...listeners}
            className="
      cursor-grab rounded-lg px-2 py-1
      text-sm text-neutral-400
      hover:bg-neutral-800 hover:text-white
      active:cursor-grabbing
    "
            aria-label={`Move ${tileName}`}
          >
            ⠿
          </button>

          <button
            type="button"
            disabled={disabled}
            onClick={() => onEdit(tile)}
            className="rounded-lg px-2 py-1 text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white"
            aria-label={`Edit ${tileName}`}
          >
            Edit
          </button>

          <ConfirmButton
            action={() => onDelete(tile.id)}
            confirmText="Confirm?"
            pendingText="Deleting..."
            timeout={3000}
            disabled={disabled}
            className="rounded-lg px-2 py-1 text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white"
            aria-label={`Delete ${tileName}`}
          >
            Delete
          </ConfirmButton>
        </div>
      </BentoTileView>
    </div>
  );
}
