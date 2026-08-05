import {
    describe,
    expect,
    it,
  } from "vitest";
  
import { mapDatabaseTile } from "./map-database-tile";

describe("mapDatabaseTile", () => {
  it("maps an image database tile", () => {
    const result = mapDatabaseTile({
          id: "image-1",
          type: "image",
          size: "wide",
          title: "Blue bird",
          position: 0,
          portfolioId: "portfolio_nikita",
  
          content: {
            imageUrl:
              "http://localhost:9000/portfolio-images/tiles/bird.jpg",
            alt: "Blue bird",
          },
  
          createdAt: new Date(),
          updatedAt: new Date(),
        });
  
      expect(result).toEqual({
        id: "image-1",
        type: "image",
        size: "wide",
        title: "Blue bird",
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
          position: 1,
          portfolioId: "portfolio_nikita",
  
          content: {
            latitude: "not-a-number",
            longitude: 19.8335,
            label: "Novi Sad",
          },
  
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ).toThrow();
    });
  });