import { LocationMap } from "@/components/map/LocationMap";
import type { MapTile } from "@/types/bento";

type MapTileContentProps = {
  tile: MapTile;
};

export function MapTileContent({
  tile,
}: MapTileContentProps) {
  const heightClass = {
    square: "h-32",
    wide: "h-20",
    tall: "h-70",
  }[tile.size];

  return (
    <div
      className={`w-full overflow-hidden rounded-2xl ${heightClass}`}
    >
      <LocationMap
        latitude={tile.latitude}
        longitude={tile.longitude}
        label={tile.label}
      />
    </div>
  );
}