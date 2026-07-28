import type { BentoTile as BentoTileData, TileSize } from "@/types/bento";

type BentoTileProps = {
  tile: BentoTileData;
  onDelete: (id: string) => void;
};

const sizeClasses: Record<TileSize, string> = {
  square: "md:col-span-1 md:row-span-1",
  wide: "md:col-span-2 md:row-span-1",
  tall: "md:col-span-1 md:row-span-2",
};

export function BentoTile({ tile, onDelete }: BentoTileProps) {
  const sizeClass = sizeClasses[tile.size];

  return (
    <article
      className={`min-h-48 rounded-3xl border border-neutral-800 bg-neutral-900 p-6 ${sizeClass}`}
    >
      <button
        type="button"
        onClick={() => onDelete(tile.id)}
        className="absolute right-4 top-4 rounded-lg px-2 py-1 text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white"
        aria-label={`Delete ${tile.title}`}
      >
        Delete
      </button>
      <p className="text-sm text-neutral-400">{tile.type}</p>
      <h2 className="mt-2 text-xl font-semibold">{tile.title}</h2>
    </article>
  );
}
