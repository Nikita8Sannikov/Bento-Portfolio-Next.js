"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";

import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import { restrictToParentElement } from "@dnd-kit/modifiers";

import { BentoTile } from "@/components/bento/BentoTile";
import type { BentoTile as BentoTileData } from "@/types/bento";

// import type { BentoTile as BentoTileData } from "@/types/bento";
// import { BentoTile } from "@/components/bento/BentoTile";

// type BentoGridProps = {
//   tiles: BentoTileData[];
//   onEditTile: (tile: BentoTileData) => void;
//   onDeleteTile: (id: string) => void;
// };

// export function BentoGrid({ tiles, onEditTile, onDeleteTile }: BentoGridProps) {
//   return (
//     <section className="grid auto-rows-[12rem] grid-cols-1 gap-4 md:grid-cols-4">
//       {tiles.map((tile) => (
//         <BentoTile key={tile.id} tile={tile} onEdit={onEditTile} onDelete={onDeleteTile} />
//       ))}
//     </section>
//   );
// }


type BentoGridProps = {
  tiles: BentoTileData[];
  onReorderTiles: (tiles: BentoTileData[]) => void;
  onEditTile: (tile: BentoTileData) => void;
  onDeleteTile: (id: string) => void;
};

export function BentoGrid({
  tiles,
  onReorderTiles,
  onEditTile,
  onDeleteTile,
}: BentoGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = tiles.findIndex(
      (tile) => tile.id === active.id,
    );

    const newIndex = tiles.findIndex(
      (tile) => tile.id === over.id,
    );

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    onReorderTiles(
      arrayMove(tiles, oldIndex, newIndex),
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToParentElement]}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={tiles.map((tile) => tile.id)}
        strategy={rectSortingStrategy}
      >
        <section className="grid auto-rows-[12rem] grid-cols-1 gap-4 md:grid-cols-4">
          {tiles.map((tile) => (
            <BentoTile
              key={tile.id}
              tile={tile}
              onEdit={onEditTile}
              onDelete={onDeleteTile}
            />
          ))}
        </section>
      </SortableContext>
    </DndContext>
  );
}