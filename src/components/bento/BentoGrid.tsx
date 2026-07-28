import type { BentoTile as BentoTileData } from "@/types/bento";
import { BentoTile } from "@/components/bento/BentoTile";

type BentoGridProps = {
  tiles: BentoTileData[];
};

export function BentoGrid({ tiles }: BentoGridProps) {
  return (
    <section className="grid auto-rows-[12rem] grid-cols-1 gap-4 md:grid-cols-4">
      {tiles.map((tile) => (
        <BentoTile key={tile.id} tile={tile} />
      ))}
    </section>
  );
}
