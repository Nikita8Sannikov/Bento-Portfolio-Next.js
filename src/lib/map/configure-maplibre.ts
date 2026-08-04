"use client";

import { setWorkerUrl } from "maplibre-gl";

let isConfigured = false;

export function configureMapLibre() {
  if (isConfigured) {
    return;
  }

  setWorkerUrl(
    "/maplibre/maplibre-gl-worker.mjs",
  );

  isConfigured = true;
}