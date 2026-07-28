import { MapTile } from "@/types/bento"

type MapTileContentProps = {
    tile: MapTile
}

export function MapTileContent({tile}: MapTileContentProps) {
    const mapUrl = `https://www.openstreetmap.org/?mlat=${tile.latitude}&mlon=${tile.longitude}#map=12/${tile.latitude}/${tile.longitude}`
    
    return (
        <div className="flex h-full flex-col">
        <div className="flex flex-1 items-center justify-center rounded-2xl bg-neutral-800">
          <span
            className="text-5xl"
            role="img"
            aria-label="Location"
          >
            📍
          </span>
        </div>
  
        <div className="mt-4">
          <p className="font-medium text-neutral-200">
            {tile.label}
          </p>
  
          <p className="mt-1 text-sm text-neutral-500">
            {tile.latitude}, {tile.longitude}
          </p>
  
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm text-neutral-300 underline decoration-neutral-600 underline-offset-4 hover:text-white"
          >
            Open map
          </a>
        </div>
      </div>
    )

}