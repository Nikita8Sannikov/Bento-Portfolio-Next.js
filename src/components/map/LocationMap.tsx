"use client";

import { useEffect, useRef } from "react";
import { Map, Marker } from "maplibre-gl";

import { getEnglishMapStyle } from "@/lib/map/map-style";
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

    let cancelled = false;
    let map: Map | null = null;
    let marker: Marker | null = null;
    let resizeObserver: ResizeObserver | null = null;

    configureMapLibre();

    void getEnglishMapStyle()
      .then((style) => {
        if (cancelled || !containerRef.current) {
          return;
        }

        map = new Map({
          container,
          style,
          center: [longitude, latitude],
          zoom: 11,
          interactive: false,
          attributionControl: {
            compact: true,
          },
        });

        marker = new Marker().setLngLat([longitude, latitude]).addTo(map);

        resizeObserver = new ResizeObserver(() => {
          map?.resize();
        });

        resizeObserver.observe(container);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          console.error("Failed to initialize location map", error);
        }
      });

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      marker?.remove();
      map?.remove();
    };
  }, [latitude, longitude]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        ref={containerRef}
        className="h-full w-full"
        aria-label={`Map showing ${label}`}
      />
    </div>
  );
}
