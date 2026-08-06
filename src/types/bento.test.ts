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
        gridCol: 1,
        gridRow: 1,
        text: "Fullstack developer",
      });
  
      expect(result.success).toBe(true);
    });
  
    it("accepts a text tile without title", () => {
      const result = bentoTileSchema.safeParse({
        id: "tile-1",
        type: "text",
        size: "square",
        title: "",
        gridCol: 1,
        gridRow: 1,
        text: "Fullstack developer",
      });

      expect(result.success).toBe(true);
    });

    it("accepts a link tile without title", () => {
      const result = bentoTileSchema.safeParse({
        id: "tile-link",
        type: "link",
        size: "wide",
        title: "",
        gridCol: 1,
        gridRow: 2,
        url: "https://github.com",
        description: "My projects",
      });

      expect(result.success).toBe(true);
    });

    it("accepts a link tile without description", () => {
      const result = bentoTileSchema.safeParse({
        id: "tile-link-no-desc",
        type: "link",
        size: "wide",
        title: "GitHub",
        gridCol: 1,
        gridRow: 2,
        url: "https://github.com",
        description: "",
      });

      expect(result.success).toBe(true);
    });

    it("accepts an image tile without title", () => {
      const result = bentoTileSchema.safeParse({
        id: "tile-image",
        type: "image",
        size: "square",
        title: "",
        gridCol: 1,
        gridRow: 1,
        imageUrl: "https://example.com/photo.jpg",
        alt: "Project screenshot",
      });

      expect(result.success).toBe(true);
    });

    it("accepts a map tile without title", () => {
      const result = bentoTileSchema.safeParse({
        id: "tile-map-empty-title",
        type: "map",
        size: "wide",
        title: "",
        gridCol: 1,
        gridRow: 2,
        latitude: 45.2671,
        longitude: 19.8335,
        label: "Novi Sad",
      });

      expect(result.success).toBe(true);
    });

    it("accepts a valid map tile", () => {
      const result = bentoTileSchema.safeParse({
        id: "tile-map",
        type: "map",
        size: "wide",
        title: "Location",
        gridCol: 1,
        gridRow: 2,
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
        gridCol: 1,
        gridRow: 2,
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
          gridCol: 1,
          gridRow: 1,
          text: "Developer",
        },
        {
          id: "tile-2",
          type: "link",
          size: "wide",
          title: "GitHub",
          gridCol: 1,
          gridRow: 2,
          url: "https://github.com",
          description: "My projects",
        },
      ]);
  
      expect(result.success).toBe(true);
    });
  });