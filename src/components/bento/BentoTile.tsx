
import type { BentoTile as BentoTileData, TileSize } from "@/types/bento";
import { assertNever } from "@/utils/assert-never";
import { TextTileContent } from "./content/TextTileContent";
import { LinkTileContent } from "./content/LinkTileContent";
import { MapTileContent } from "./content/MapTileContent";
import { ImageTileContent } from "./content/ImageTileContent";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type BentoTileProps = {
  tile: BentoTileData;
  onEdit: (tile: BentoTileData) => void;
  onDelete: (id: string) => void;
};

const sizeClasses: Record<TileSize, string> = {
  square: "md:col-span-1 md:row-span-1",
  wide: "md:col-span-2 md:row-span-1",
  tall: "md:col-span-1 md:row-span-2",
};

function renderTileContent(tile: BentoTileData) {
  switch (tile.type) {
    case "text":
      return <TextTileContent tile={tile} />;

    case "image":
      return <ImageTileContent tile={tile} />;

    case "link":
      return <LinkTileContent tile={tile} />;

    case "map":
      return <MapTileContent tile={tile} />;

    default:
      return assertNever(tile);
  }
}

export function BentoTile({ tile, onEdit, onDelete }: BentoTileProps) {
  const sizeClass = sizeClasses[tile.size];
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
    <article
      ref={setNodeRef}
      style={style}
      className={`relative min-h-48 overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900 p-6 ${sizeClass}  ${isDragging ? "z-20 opacity-60" : ""}`}
    >
      <div className="absolute right-4 top-4 z-10 flex gap-2">
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
      <p className="text-sm uppercase tracking-wide text-neutral-400">
        {tile.type}
      </p>
      <h2 className="mt-2 pr-16 text-xl font-semibold">{tile.title}</h2>

      <div className="mt-4">{renderTileContent(tile)}</div>
    </article>
  );
}
