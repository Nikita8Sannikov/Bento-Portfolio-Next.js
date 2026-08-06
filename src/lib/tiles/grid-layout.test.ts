import {
  describe,
  expect,
  it,
} from "vitest";

import {
  canPlace,
  computeAutoLayoutFromOrder,
  findFirstFit,
  findTileAtCell,
  getOccupiedCells,
  getTileSpan,
  resolveDropAction,
  resolveDropPosition,
  tilesHaveSameSpan,
} from "./grid-layout";

describe("grid-layout", () => {
  it("returns tile spans for bento sizes", () => {
    expect(
      getTileSpan({ type: "text", size: "wide" }),
    ).toEqual({ colSpan: 2, rowSpan: 1 });

    expect(
      getTileSpan({ type: "map", size: "square" }),
    ).toEqual({ colSpan: 1, rowSpan: 2 });
  });

  it("auto-layouts tiles in order without overlap", () => {
    const layout = computeAutoLayoutFromOrder([
      { id: "wide", type: "text", size: "wide" },
      { id: "square", type: "text", size: "square" },
      { id: "location", type: "map", size: "wide" },
      { id: "github", type: "link", size: "square" },
    ]);

    expect(layout.get("wide")).toEqual({ gridCol: 1, gridRow: 1 });
    expect(layout.get("square")).toEqual({ gridCol: 3, gridRow: 1 });
    expect(layout.get("location")).toEqual({ gridCol: 1, gridRow: 2 });
    expect(layout.get("github")).toEqual({ gridCol: 3, gridRow: 2 });
  });

  it("detects occupied cells and valid placement", () => {
    const tiles = [
      {
        id: "wide",
        type: "text" as const,
        size: "wide" as const,
        gridCol: 1,
        gridRow: 1,
      },
    ];

    const occupied = getOccupiedCells(tiles);

    expect(
      canPlace(1, 1, 1, 1, occupied),
    ).toBe(false);
    expect(
      canPlace(3, 1, 1, 1, occupied),
    ).toBe(true);
  });

  it("finds first fit for a new tile", () => {
    const occupied = getOccupiedCells([
      {
        id: "wide",
        type: "text",
        size: "wide",
        gridCol: 1,
        gridRow: 1,
      },
    ]);

    expect(
      findFirstFit(1, 1, occupied),
    ).toEqual({ gridCol: 3, gridRow: 1 });
  });

  it("shifts wide tile left when dropped near the right edge", () => {
    const occupied = getOccupiedCells([
      {
        id: "wide",
        type: "text",
        size: "wide",
        gridCol: 1,
        gridRow: 1,
      },
    ]);

    expect(
      resolveDropPosition(3, 2, 2, 1, occupied),
    ).toEqual({ gridCol: 2, gridRow: 2 });
  });

  it("finds tile at a specific cell", () => {
    const tiles = [
      { id: "wide", type: "text" as const, size: "wide" as const, gridCol: 1, gridRow: 1 },
      { id: "square", type: "text" as const, size: "square" as const, gridCol: 3, gridRow: 1 },
    ];

    expect(findTileAtCell(tiles, 1, 1)?.id).toBe("wide");
    expect(findTileAtCell(tiles, 2, 1)?.id).toBe("wide");
    expect(findTileAtCell(tiles, 3, 1)?.id).toBe("square");
    expect(findTileAtCell(tiles, 1, 2)).toBe(null);
  });

  it("compares tile spans correctly", () => {
    expect(
      tilesHaveSameSpan(
        { type: "text", size: "square" },
        { type: "link", size: "square" },
      ),
    ).toBe(true);

    expect(
      tilesHaveSameSpan(
        { type: "text", size: "square" },
        { type: "text", size: "wide" },
      ),
    ).toBe(false);

    expect(
      tilesHaveSameSpan(
        { type: "map", size: "square" },
        { type: "text", size: "tall" },
      ),
    ).toBe(true);
  });

  it("returns place action for empty cell", () => {
    const tiles = [
      { id: "a", type: "text" as const, size: "square" as const, gridCol: 1, gridRow: 1 },
    ];

    const action = resolveDropAction(tiles[0], 3, 1, tiles);

    expect(action).toEqual({
      type: "place",
      gridCol: 3,
      gridRow: 1,
    });
  });

  it("returns swap action for same-size tiles", () => {
    const tiles = [
      { id: "a", type: "text" as const, size: "square" as const, gridCol: 1, gridRow: 1 },
      { id: "b", type: "link" as const, size: "square" as const, gridCol: 3, gridRow: 1 },
    ];

    const action = resolveDropAction(tiles[0], 3, 1, tiles);

    expect(action).toEqual({
      type: "swap",
      gridCol: 3,
      gridRow: 1,
      targetTileId: "b",
    });
  });

  it("returns push action for different-size tiles", () => {
    const tiles = [
      { id: "wide", type: "text" as const, size: "wide" as const, gridCol: 1, gridRow: 1 },
      { id: "square", type: "text" as const, size: "square" as const, gridCol: 3, gridRow: 1 },
    ];

    const action = resolveDropAction(tiles[1], 1, 1, tiles);

    expect(action?.type).toBe("push");
    if (action?.type === "push") {
      expect(action.targetTileId).toBe("wide");
      expect(action.pushTo.gridRow).toBeGreaterThanOrEqual(1);
    }
  });
});
