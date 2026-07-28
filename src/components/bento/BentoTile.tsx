import type { BentoTile as BentoTileData } from "@/types/bento";

type BentoTileProps = {
  tile: BentoTileData;
};

export function BentoTile( {tile}: BentoTileProps) {
    return (
        <article className="min-h-48 rounded-3xl border border-neutral-800 bg-neutral-900 p-6">
            <p className="text-sm text-neutral-400">{tile.type}</p>
            <h2 className="mt-2 text-xl font-semibold">{tile.title}</h2>
        </article>
    )
}

