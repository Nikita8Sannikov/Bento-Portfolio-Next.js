import type { StyleSpecification } from "maplibre-gl";

export const openStreetMapStyle: StyleSpecification = {
  version: 8,

  sources: {
    "openstreetmap-tiles": {
      type: "raster",
      tiles: [
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      minzoom: 0,
      maxzoom: 19,
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
    },
  },

  layers: [
    {
      id: "openstreetmap-layer",
      type: "raster",
      source: "openstreetmap-tiles",
    },
  ],
};