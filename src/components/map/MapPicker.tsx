"use client";

import { useEffect, useRef } from "react";
import {
  Map,
  Marker,
  NavigationControl,
  type MapMouseEvent,
} from "maplibre-gl";
import { openStreetMapStyle } from "@/lib/map/map-style";
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
  const initialCenterRef = useRef({
    latitude: toValidCoordinate(latitude, 0),
    longitude: toValidCoordinate(longitude, 0),
  });

  const mapRef = useRef<Map | null>(null);
  const markerRef = useRef<Marker | null>(null);

  useEffect(() => {
    onCoordinatesChangeRef.current = onCoordinatesChange;
  }, [onCoordinatesChange]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || mapRef.current) {
      return;
    }

    const { latitude: initialLatitude, longitude: initialLongitude } =
      initialCenterRef.current;

    configureMapLibre();

    const map = new Map({
      container,
      style: openStreetMapStyle,
      center: [initialLongitude, initialLatitude],
      zoom: 12,
    });

    const marker = new Marker({
      draggable: true,
    })
      .setLngLat([initialLongitude, initialLatitude])
      .addTo(map);

    map.addControl(new NavigationControl(), "top-right");

    marker.on("dragend", () => {
      const position = marker.getLngLat();

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

      marker.setLngLat([coordinates.longitude, coordinates.latitude]);

      onCoordinatesChangeRef.current(coordinates);
    });

    function resizeMap() {
      map.resize();
    }

    const firstFrame = requestAnimationFrame(() => {
      resizeMap();

      requestAnimationFrame(() => {
        resizeMap();
      });
    });

    map.once("load", resizeMap);
    map.once("idle", resizeMap);

    const resizeObserver = new ResizeObserver(() => {
      resizeMap();
    });

    resizeObserver.observe(container);

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      cancelAnimationFrame(firstFrame);

      resizeObserver.disconnect();

      map.off("load", resizeMap);
      map.off("idle", resizeMap);

      marker.remove();
      map.remove();

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
