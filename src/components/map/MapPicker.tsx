"use client";

import { useEffect, useRef } from "react";
import {
  Map,
  Marker,
  NavigationControl,
  type MapMouseEvent,
} from "maplibre-gl";
import { getEnglishMapStyle } from "@/lib/map/map-style";
import { configureMapLibre } from "@/lib/map/configure-maplibre";

type Coordinates = {
  latitude: number;
  longitude: number;
};

type MapPickerProps = Coordinates & {
  onCoordinatesChange: (coordinates: Coordinates) => void;
};

function toValidCoordinate(value: number, fallback: number) {
  return Number.isFinite(value) ? value : fallback;
}

export function MapPicker({
  latitude,
  longitude,
  onCoordinatesChange,
}: MapPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onCoordinatesChangeRef = useRef(onCoordinatesChange);
  const coordinatesRef = useRef({
    latitude: toValidCoordinate(latitude, 0),
    longitude: toValidCoordinate(longitude, 0),
  });

  const mapRef = useRef<Map | null>(null);
  const markerRef = useRef<Marker | null>(null);

  useEffect(() => {
    onCoordinatesChangeRef.current = onCoordinatesChange;
  }, [onCoordinatesChange]);

  useEffect(() => {
    coordinatesRef.current = {
      latitude: toValidCoordinate(latitude, 0),
      longitude: toValidCoordinate(longitude, 0),
    };
  }, [latitude, longitude]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || mapRef.current) {
      return;
    }

    let cancelled = false;
    let firstFrame = 0;
    let resizeObserver: ResizeObserver | null = null;
    let map: Map | null = null;
    let marker: Marker | null = null;
    let resizeMap: (() => void) | null = null;

    configureMapLibre();

    void getEnglishMapStyle()
      .then((style) => {
        if (cancelled || !containerRef.current) {
          return;
        }

        const {
          latitude: initialLatitude,
          longitude: initialLongitude,
        } = coordinatesRef.current;

        map = new Map({
          container,
          style,
          center: [initialLongitude, initialLatitude],
          zoom: 12,
        });

        marker = new Marker({
          draggable: true,
        })
          .setLngLat([initialLongitude, initialLatitude])
          .addTo(map);

        map.addControl(new NavigationControl(), "top-right");

        marker.on("dragend", () => {
          const position = marker?.getLngLat();

          if (!position) {
            return;
          }

          onCoordinatesChangeRef.current({
            latitude: position.lat,
            longitude: position.lng,
          });
        });

        map.on("click", (event: MapMouseEvent) => {
          const coordinates = {
            latitude: event.lngLat.lat,
            longitude: event.lngLat.lng,
          };

          marker?.setLngLat([coordinates.longitude, coordinates.latitude]);

          onCoordinatesChangeRef.current(coordinates);
        });

        resizeMap = () => {
          map?.resize();
        };

        firstFrame = requestAnimationFrame(() => {
          resizeMap?.();

          requestAnimationFrame(() => {
            resizeMap?.();
          });
        });

        map.once("load", resizeMap);
        map.once("idle", resizeMap);

        resizeObserver = new ResizeObserver(() => {
          resizeMap?.();
        });

        resizeObserver.observe(container);

        mapRef.current = map;
        markerRef.current = marker;
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          console.error("Failed to initialize map picker", error);
        }
      });

    return () => {
      cancelled = true;

      cancelAnimationFrame(firstFrame);
      resizeObserver?.disconnect();

      if (map && resizeMap) {
        map.off("load", resizeMap);
        map.off("idle", resizeMap);
      }

      marker?.remove();
      map?.remove();

      markerRef.current = null;
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const marker = markerRef.current;

    if (!map || !marker) {
      return;
    }

    const nextLatitude = toValidCoordinate(latitude, 0);
    const nextLongitude = toValidCoordinate(longitude, 0);

    marker.setLngLat([nextLongitude, nextLatitude]);

    map.flyTo({
      center: [nextLongitude, nextLatitude],
      zoom: Math.max(map.getZoom(), 11),
      essential: true,
    });
  }, [latitude, longitude]);

  return (
    <div className="relative h-80 w-full overflow-hidden rounded-2xl border border-neutral-700">
      <div
        ref={containerRef}
        className="h-full w-full"
        aria-label="Choose location on map"
      />
    </div>
  );
}
