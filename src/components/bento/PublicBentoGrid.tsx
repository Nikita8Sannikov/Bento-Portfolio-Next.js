import { BentoTileView } from "@/components/bento/BentoTileView";
import {
  getGridPlacementClassName,
  getGridPlacementVariables,
  getGridRowCount,
  sortTilesForMobile,
} from "@/lib/tiles/grid-layout";
import type { BentoTile } from "@/types/bento";

type PublicBentoGridProps = {
  tiles: BentoTile[];
};

export function PublicBentoGrid({
  tiles,
}: PublicBentoGridProps) {
  const sortedTiles = sortTilesForMobile(tiles);
  const rowCount = getGridRowCount(tiles);

  return (
    <section
      className="grid auto-rows-[12rem] grid-cols-1 gap-4 md:grid-cols-3"
      style={{
        gridTemplateRows: `repeat(${rowCount}, 12rem)`,
      }}
    >
      {sortedTiles.map((tile) => (
        <div
          key={tile.id}
          style={getGridPlacementVariables(tile)}
          className={getGridPlacementClassName()}
        >
          <BentoTileView tile={tile} applyGridSize={false} className="h-full" />
        </div>
      ))}
    </section>
  );
}
