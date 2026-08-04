import { LocationMap } from "@/components/map/LocationMap";
import type { MapTile } from "@/types/bento";

type MapTileContentProps = {
  tile: MapTile;
};

export function MapTileContent({
  tile,
}: MapTileContentProps) {
  return (
    <div className="h-full min-h-0 overflow-hidden rounded-2xl">
      <LocationMap
        latitude={tile.latitude}
        longitude={tile.longitude}
        label={tile.label}
      />
    </div>
  );
}