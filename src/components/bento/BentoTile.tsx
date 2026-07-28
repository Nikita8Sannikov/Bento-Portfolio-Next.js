import type { BentoTile as BentoTileData, TileSize } from "@/types/bento";
import { assertNever } from "@/utils/assert-never";

type BentoTileProps = {
  tile: BentoTileData;
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
      return <p className="text-neutral-300">{tile.text}</p>;

    case "image":
      return (
        <div>
          <p className="text-neutral-300">Image: {tile.imageUrl}</p>

          <p className="mt-2 text-sm text-neutral-500">Alt: {tile.alt}</p>
        </div>
      );

    case "link":
      return (
        <div>
          <p className="text-neutral-300">{tile.description}</p>

          <a
            href={tile.url}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block underline"
          >
            Open link
          </a>
        </div>
      );

    case "map":
      return (
        <div>
          <p className="text-neutral-300">{tile.label}</p>

          <p className="mt-2 text-sm text-neutral-500">
            {tile.latitude}, {tile.longitude}
          </p>
        </div>
      );

    default:
      return assertNever(tile);
  }
}

export function BentoTile({ tile, onDelete }: BentoTileProps) {
  const sizeClass = sizeClasses[tile.size];

  return (
    <article
      className={`relative min-h-48 overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900 p-6 ${sizeClass}`}
    >
      <button
        type="button"
        onClick={() => onDelete(tile.id)}
        className="absolute right-4 top-4 rounded-lg px-2 py-1 text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white"
        aria-label={`Delete ${tile.title}`}
      >
        Delete
      </button>
      <p className="text-sm uppercase tracking-wide text-neutral-400">
        {tile.type}
      </p>
      <h2 className="mt-2 pr-16 text-xl font-semibold">{tile.title}</h2>

      <div className="mt-4">{renderTileContent(tile)}</div>
    </article>
  );
}
