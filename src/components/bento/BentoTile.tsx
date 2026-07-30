import type { BentoTile as BentoTileData } from "@/types/bento";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BentoTileView } from "./BentoTileView";
import { tileSizeClasses } from "./tile-size-classes";

type BentoTileProps = {
  tile: BentoTileData;
  onEdit: (tile: BentoTileData) => void;
  onDelete: (id: string) => void;
};

export function BentoTile({ tile, onEdit, onDelete }: BentoTileProps) {
  const sizeClass = tileSizeClasses[tile.size];
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: tile.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${sizeClass}  ${isDragging ? "z-20 opacity-60" : ""}`}
    >
      <BentoTileView tile={tile} applyGridSize={false} className="h-full">
        <div className="absolute right-4 top-4 z-10  items-center flex gap-2">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="
      cursor-grab rounded-lg px-2 py-1
      text-sm text-neutral-400
      hover:bg-neutral-800 hover:text-white
      active:cursor-grabbing
    "
            aria-label={`Move ${tile.title}`}
          >
            ⠿
          </button>

          <button
            type="button"
            onClick={() => onEdit(tile)}
            className="rounded-lg px-2 py-1 text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white"
            aria-label={`Edit ${tile.title}`}
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(tile.id)}
            className="rounded-lg px-2 py-1 text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white"
            aria-label={`Delete ${tile.title}`}
          >
            Delete
          </button>
        </div>
      </BentoTileView>
    </div>
  );
}
