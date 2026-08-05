import {
    describe,
    expect,
    it,
  } from "vitest";
  
  import {
    bentoTileSchema,
    bentoTilesSchema,
  } from "@/types/bento";
  
  describe("bentoTileSchema", () => {
    it("accepts a valid text tile", () => {
      const result = bentoTileSchema.safeParse({
        id: "tile-1",
        type: "text",
        size: "square",
        title: "About me",
        text: "Fullstack developer",
      });
  
      expect(result.success).toBe(true);
    });
  
    it("rejects an empty title", () => {
      const result = bentoTileSchema.safeParse({
        id: "tile-1",
        type: "text",
        size: "square",
        title: "",
        text: "Fullstack developer",
      });
  
      expect(result.success).toBe(false);
    });
  
    it("accepts a valid map tile", () => {
      const result = bentoTileSchema.safeParse({
        id: "tile-map",
        type: "map",
        size: "wide",
        title: "Location",
        latitude: 45.2671,
        longitude: 19.8335,
        label: "Novi Sad",
      });
  
      expect(result.success).toBe(true);
    });
  
    it("rejects invalid latitude", () => {
      const result = bentoTileSchema.safeParse({
        id: "tile-map",
        type: "map",
        size: "wide",
        title: "Location",
        latitude: 120,
        longitude: 19.8335,
        label: "Unknown",
      });
  
      expect(result.success).toBe(false);
    });
  });
  
  describe("bentoTilesSchema", () => {
    it("accepts an array of valid tiles", () => {
      const result = bentoTilesSchema.safeParse([
        {
          id: "tile-1",
          type: "text",
          size: "square",
          title: "About",
          text: "Developer",
        },
        {
          id: "tile-2",
          type: "link",
          size: "wide",
          title: "GitHub",
          url: "https://github.com",
          description: "My projects",
        },
      ]);
  
      expect(result.success).toBe(true);
    });
  });