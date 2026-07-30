import { BentoTileView } from "@/components/bento/BentoTileView";
import type { BentoTile } from "@/types/bento";

type PublicBentoGridProps = {
  tiles: BentoTile[];
};

export function PublicBentoGrid({
  tiles,
}: PublicBentoGridProps) {
  return (
    <section className="grid auto-rows-[12rem] grid-cols-1 gap-4 md:grid-cols-4">
      {tiles.map((tile) => (
        <BentoTileView
          key={tile.id}
          tile={tile}
        />
      ))}
    </section>
  );
}