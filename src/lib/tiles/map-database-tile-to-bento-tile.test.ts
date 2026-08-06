import {
    describe,
    expect,
    it,
  } from "vitest";
  
import { mapDatabaseTile, mapDatabaseTiles } from "./map-database-tile";

describe("mapDatabaseTile", () => {
  it("maps an image database tile", () => {
    const result = mapDatabaseTile({
          id: "image-1",
          type: "image",
          size: "wide",
          title: "Blue bird",
          gridCol: 1,
          gridRow: 1,
          content: {
            imageUrl:
              "http://localhost:9000/portfolio-images/tiles/bird.jpg",
            alt: "Blue bird",
          },
        });
  
      expect(result).toEqual({
        id: "image-1",
        type: "image",
        size: "wide",
        title: "Blue bird",
        gridCol: 1,
        gridRow: 1,
        imageUrl:
          "http://localhost:9000/portfolio-images/tiles/bird.jpg",
        alt: "Blue bird",
      });
    });
  
    it("throws for invalid database content", () => {
    expect(() =>
      mapDatabaseTile({
          id: "map-1",
          type: "map",
          size: "square",
          title: "Location",
          gridCol: 1,
          gridRow: 2,
          content: {
            latitude: "not-a-number",
            longitude: 19.8335,
            label: "Novi Sad",
          },
        }),
      ).toThrow();
    });

    it("falls back to auto layout when grid coordinates are missing", () => {
      const tiles = mapDatabaseTiles([
        {
          id: "wide",
          type: "text",
          size: "wide",
          title: "About",
          position: 0,
          content: { text: "About me" },
        },
        {
          id: "square",
          type: "text",
          size: "square",
          title: "Note",
          position: 1,
          content: { text: "Note" },
        },
      ]);

      expect(tiles[0]).toMatchObject({
        id: "wide",
        gridCol: 1,
        gridRow: 1,
      });
      expect(tiles[1]).toMatchObject({
        id: "square",
        gridCol: 3,
        gridRow: 1,
      });
    });
  });