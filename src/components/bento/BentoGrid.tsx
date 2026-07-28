import type { BentoTile as BentoTileData } from "@/types/bento";
import { BentoTile } from "@/components/bento/BentoTile";

type BentoGridProps = {
  tiles: BentoTileData[];
  onDeleteTile: (id: string) => void;
};

export function BentoGrid({ tiles, onDeleteTile }: BentoGridProps) {
  return (
    <section className="grid auto-rows-[12rem] grid-cols-1 gap-4 md:grid-cols-4">
      {tiles.map((tile) => (
        <BentoTile key={tile.id} tile={tile} onDelete={onDeleteTile} />
      ))}
    </section>
  );
}
