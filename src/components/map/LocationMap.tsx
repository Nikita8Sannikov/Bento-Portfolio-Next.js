"use client";

import { useEffect, useRef } from "react";
import { Map, Marker } from "maplibre-gl";

import { openStreetMapStyle } from "@/lib/map/map-style";
import { configureMapLibre } from "@/lib/map/configure-maplibre";

type LocationMapProps = {
  latitude: number;
  longitude: number;
  label: string;
};

export function LocationMap({ latitude, longitude, label }: LocationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    configureMapLibre();

    const map = new Map({
      container,
      style: openStreetMapStyle,
      center: [longitude, latitude],
      zoom: 11,
      interactive: false,
      attributionControl: {
        compact: true,
      },
    });

    const marker = new Marker().setLngLat([longitude, latitude]).addTo(map);

    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      marker.remove();
      map.remove();
    };
  }, [latitude, longitude]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        ref={containerRef}
        className="h-full w-full"
        aria-label={`Map showing ${label}`}
      />

      {/* <div
        className="
          pointer-events-none absolute
          bottom-3 left-3 right-3 z-10
          rounded-lg bg-black/75
          px-3 py-2 text-sm text-white
        "
      >
        {label}
      </div> */}
    </div>
  );
}
