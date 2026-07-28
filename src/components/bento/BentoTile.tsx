import type { BentoTile as BentoTileData, TileSize } from "@/types/bento";

type BentoTileProps = {
  tile: BentoTileData;
};

const sizeClasses: Record<TileSize, string> = {
  square: "md:col-span-1 md:row-span-1",
  wide: "md:col-span-2 md:row-span-1",
  tall: "md:col-span-1 md:row-span-2",
};

export function BentoTile({ tile }: BentoTileProps) {
  const sizeClass = sizeClasses[tile.size];

  return (
    <article
      className={`min-h-48 rounded-3xl border border-neutral-800 bg-neutral-900 p-6 ${sizeClass}`}
    >
      <p className="text-sm text-neutral-400">{tile.type}</p>
      <h2 className="mt-2 text-xl font-semibold">{tile.title}</h2>
    </article>
  );
}
