"use client";

import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragMoveEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useRef, useState } from "react";

import { BentoTile } from "@/components/bento/BentoTile";
import { BentoTileView } from "@/components/bento/BentoTileView";
import {
  type DropAction,
  getEffectiveSpan,
  getGridColsForWidth,
  getGridRowCount,
  getTileSpan,
  pointerToGridCell,
  resolveDropAction,
  sortTilesForMobile,
} from "@/lib/tiles/grid-layout";
import type { BentoTile as BentoTileData } from "@/types/bento";

type LayoutUpdate = {
  id: string;
  gridCol: number;
  gridRow: number;
};

type BentoGridProps = {
  tiles: BentoTileData[];
  disabled?: boolean;
  onLayoutChange: (updates: LayoutUpdate[]) => void;
  onEditTile: (tile: BentoTileData) => void;
  onDeleteTile: (id: string) => void;
};

type PreviewState = {
  action: DropAction;
  colSpan: number;
  rowSpan: number;
} | null;

export function BentoGrid({
  tiles,
  onLayoutChange,
  onEditTile,
  disabled = false,
  onDeleteTile,
}: BentoGridProps) {
  const gridRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [preview, setPreview] = useState<PreviewState>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
  );

  const activeTile = activeId
    ? tiles.find((tile) => tile.id === activeId)
    : null;

  function updatePreviewFromPointer(
    pointerX: number,
    pointerY: number,
    tileId: string,
  ) {
    if (!gridRef.current) {
      return;
    }

    const containerRect = gridRef.current.getBoundingClientRect();
    const gridCols = getGridColsForWidth(containerRect.width);
    const tile = tiles.find((currentTile) => currentTile.id === tileId);

    if (!tile) {
      return;
    }

    const { colSpan, rowSpan } = getEffectiveSpan(tile, gridCols);
    const targetCell = pointerToGridCell(
      pointerX,
      pointerY,
      containerRect,
      gridCols,
    );

    const action = resolveDropAction(
      tile,
      targetCell.gridCol,
      targetCell.gridRow,
      tiles,
      gridCols,
    );

    if (!action) {
      setPreview(null);
      return;
    }

    setPreview({
      action,
      colSpan,
      rowSpan,
    });
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
    setPreview(null);
  }

  function getPointerCoordinates(
    event: DragMoveEvent | DragEndEvent,
  ): { x: number; y: number } | null {
    const activatorEvent = event.activatorEvent;

    if (activatorEvent instanceof MouseEvent) {
      return {
        x: activatorEvent.clientX + (event.delta?.x ?? 0),
        y: activatorEvent.clientY + (event.delta?.y ?? 0),
      };
    }

    if (activatorEvent instanceof TouchEvent && activatorEvent.touches[0]) {
      return {
        x: activatorEvent.touches[0].clientX + (event.delta?.x ?? 0),
        y: activatorEvent.touches[0].clientY + (event.delta?.y ?? 0),
      };
    }

    return null;
  }

  function handleDragMove(event: DragMoveEvent) {
    const pointer = getPointerCoordinates(event);

    if (!pointer) {
      return;
    }

    updatePreviewFromPointer(
      pointer.x,
      pointer.y,
      String(event.active.id),
    );
  }

  function handleDragEnd(event: DragEndEvent) {
    const tileId = String(event.active.id);
    const draggedTile = tiles.find((tile) => tile.id === tileId);

    if (preview && draggedTile) {
      const { action } = preview;
      const updates: LayoutUpdate[] = [];

      if (action.type === "place") {
        updates.push({
          id: tileId,
          gridCol: action.gridCol,
          gridRow: action.gridRow,
        });
      } else if (action.type === "swap") {
        updates.push({
          id: tileId,
          gridCol: action.gridCol,
          gridRow: action.gridRow,
        });
        updates.push({
          id: action.targetTileId,
          gridCol: draggedTile.gridCol,
          gridRow: draggedTile.gridRow,
        });
      } else if (action.type === "push") {
        updates.push({
          id: tileId,
          gridCol: action.gridCol,
          gridRow: action.gridRow,
        });
        updates.push({
          id: action.targetTileId,
          gridCol: action.pushTo.gridCol,
          gridRow: action.pushTo.gridRow,
        });
      }

      if (updates.length > 0) {
        onLayoutChange(updates);
      }
    }

    setActiveId(null);
    setPreview(null);
  }

  function handleDragCancel() {
    setActiveId(null);
    setPreview(null);
  }

  const sortedTiles = sortTilesForMobile(tiles);
  const rowCount = getGridRowCount(tiles);

  const swapTargetId =
    preview?.action.type === "swap" ? preview.action.targetTileId : null;
  const pushTargetId =
    preview?.action.type === "push" ? preview.action.targetTileId : null;

  function getPreviewBorderClass(): string {
    if (!preview) return "";

    switch (preview.action.type) {
      case "place":
        return "border-white/40 bg-white/10";
      case "swap":
        return "border-blue-400/60 bg-blue-500/20";
      case "push":
        return "border-amber-400/60 bg-amber-500/20";
      default:
        return "border-white/40 bg-white/10";
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <section
        ref={gridRef}
        className="relative grid auto-rows-[12rem] grid-cols-1 gap-4 md:grid-cols-3"
        style={{
          gridTemplateRows: `repeat(${rowCount}, 12rem)`,
        }}
      >
        {sortedTiles.map((tile) => (
          <BentoTile
            key={tile.id}
            tile={tile}
            disabled={disabled}
            isDragging={activeId === tile.id}
            isSwapTarget={swapTargetId === tile.id}
            isPushTarget={pushTargetId === tile.id}
            onEdit={onEditTile}
            onDelete={onDeleteTile}
          />
        ))}

        {preview && (
          <div
            className={`pointer-events-none rounded-3xl border-2 border-dashed ${getPreviewBorderClass()} max-md:hidden md:[grid-column:var(--preview-gc)] md:[grid-row:var(--preview-gr)]`}
            style={
              {
                "--preview-gc": `${preview.action.gridCol} / span ${preview.colSpan}`,
                "--preview-gr": `${preview.action.gridRow} / span ${preview.rowSpan}`,
              } as React.CSSProperties
            }
          />
        )}

        {preview?.action.type === "push" && (
          <div
            className="pointer-events-none rounded-3xl border-2 border-dashed border-amber-400/40 bg-amber-500/10 max-md:hidden md:[grid-column:var(--push-gc)] md:[grid-row:var(--push-gr)]"
            style={
              {
                "--push-gc": `${preview.action.pushTo.gridCol} / span ${getPushTargetSpan().colSpan}`,
                "--push-gr": `${preview.action.pushTo.gridRow} / span ${getPushTargetSpan().rowSpan}`,
              } as React.CSSProperties
            }
          />
        )}
      </section>

      <DragOverlay dropAnimation={null}>
        {activeTile ? (
          <BentoTileView
            tile={activeTile}
            applyGridSize={false}
            className="h-48 w-full cursor-grabbing shadow-2xl"
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );

  function getPushTargetSpan() {
    const action = preview?.action;

    if (action?.type !== "push") {
      return { colSpan: 1, rowSpan: 1 };
    }

    const targetTile = tiles.find(
      (tile) => tile.id === action.targetTileId,
    );

    if (!targetTile) {
      return { colSpan: 1, rowSpan: 1 };
    }

    return getTileSpan(targetTile);
  }
}
