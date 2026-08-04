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

export function MapPicker({
  latitude,
  longitude,
  onCoordinatesChange,
}: MapPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const mapRef = useRef<Map | null>(null);
  const markerRef = useRef<Marker | null>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || mapRef.current) {
      return;
    }

    configureMapLibre();

    const map = new Map({
      container,
      style: openStreetMapStyle,
      center: [longitude, latitude],
      zoom: 12,
    });

    const marker = new Marker({
      draggable: true,
    })
      .setLngLat([longitude, latitude])
      .addTo(map);

    map.addControl(new NavigationControl(), "top-right");

    marker.on("dragend", () => {
      const position = marker.getLngLat();

      onCoordinatesChange({
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

      onCoordinatesChange(coordinates);
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
  }, [onCoordinatesChange, latitude, longitude]);

  useEffect(() => {
    const map = mapRef.current;
    const marker = markerRef.current;

    if (!map || !marker) {
      return;
    }

    marker.setLngLat([longitude, latitude]);

    map.flyTo({
      center: [longitude, latitude],
      zoom: Math.max(map.getZoom(), 11),
      essential: true,
    });
  }, [latitude, longitude]);

  return (
    <div
      ref={containerRef}
      className="
        h-80 w-full overflow-hidden
        rounded-2xl border border-neutral-700
      "
      aria-label="Choose location on map"
    />
  );
}
