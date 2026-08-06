import type { CSSProperties } from "react";

import type { BentoTile } from "@/types/bento";

export const GRID_COLS = 3;
export const GRID_ROW_HEIGHT_PX = 192;
export const GRID_GAP_PX = 16;

export type TileSpan = {
  colSpan: number;
  rowSpan: number;
};

export type GridCell = {
  gridCol: number;
  gridRow: number;
};

export type LayoutTile = Pick<
  BentoTile,
  "id" | "type" | "size" | "gridCol" | "gridRow"
>;

export type DropAction =
  | { type: "place"; gridCol: number; gridRow: number }
  | { type: "swap"; gridCol: number; gridRow: number; targetTileId: string }
  | {
      type: "push";
      gridCol: number;
      gridRow: number;
      targetTileId: string;
      pushTo: GridCell;
    };

function cellKey(col: number, row: number): string {
  return `${col},${row}`;
}

export function getTileSpan(
  tile: Pick<BentoTile, "type" | "size">,
): TileSpan {
  if (tile.type === "map") {
    if (tile.size === "square") {
      return { colSpan: 1, rowSpan: 2 };
    }

    if (tile.size === "tall") {
      return { colSpan: 1, rowSpan: 3 };
    }
  }

  switch (tile.size) {
    case "square":
      return { colSpan: 1, rowSpan: 1 };
    case "wide":
      return { colSpan: 2, rowSpan: 1 };
    case "tall":
      return { colSpan: 1, rowSpan: 2 };
    default:
      return { colSpan: 1, rowSpan: 1 };
  }
}

export function getEffectiveSpan(
  tile: Pick<BentoTile, "type" | "size">,
  gridCols: number,
): TileSpan {
  const span = getTileSpan(tile);

  return {
    colSpan: Math.min(span.colSpan, gridCols),
    rowSpan: span.rowSpan,
  };
}

export function getOccupiedCells(
  tiles: LayoutTile[],
  excludeId?: string,
): Set<string> {
  const cells = new Set<string>();

  for (const tile of tiles) {
    if (excludeId && tile.id === excludeId) {
      continue;
    }

    const { colSpan, rowSpan } = getTileSpan(tile);

    for (let col = tile.gridCol; col < tile.gridCol + colSpan; col++) {
      for (let row = tile.gridRow; row < tile.gridRow + rowSpan; row++) {
        cells.add(cellKey(col, row));
      }
    }
  }

  return cells;
}

export function canPlace(
  gridCol: number,
  gridRow: number,
  colSpan: number,
  rowSpan: number,
  occupied: Set<string>,
  gridCols = GRID_COLS,
): boolean {
  if (gridCol < 1 || gridRow < 1) {
    return false;
  }

  if (gridCol + colSpan - 1 > gridCols) {
    return false;
  }

  for (let col = gridCol; col < gridCol + colSpan; col++) {
    for (let row = gridRow; row < gridRow + rowSpan; row++) {
      if (occupied.has(cellKey(col, row))) {
        return false;
      }
    }
  }

  return true;
}

export function findFirstFit(
  colSpan: number,
  rowSpan: number,
  occupied: Set<string>,
  gridCols = GRID_COLS,
): GridCell {
  let row = 1;

  while (true) {
    for (let col = 1; col <= gridCols - colSpan + 1; col++) {
      if (canPlace(col, row, colSpan, rowSpan, occupied, gridCols)) {
        return { gridCol: col, gridRow: row };
      }
    }

    row += 1;
  }
}

export function computeAutoLayoutFromOrder(
  tiles: Array<Pick<BentoTile, "id" | "type" | "size">>,
): Map<string, GridCell> {
  const occupied = new Set<string>();
  const layout = new Map<string, GridCell>();

  for (const tile of tiles) {
    const { colSpan, rowSpan } = getTileSpan(tile);
    const cell = findFirstFit(colSpan, rowSpan, occupied);
    layout.set(tile.id, cell);

    for (let col = cell.gridCol; col < cell.gridCol + colSpan; col++) {
      for (let row = cell.gridRow; row < cell.gridRow + rowSpan; row++) {
        occupied.add(cellKey(col, row));
      }
    }
  }

  return layout;
}

export function resolveDropPosition(
  targetCol: number,
  targetRow: number,
  colSpan: number,
  rowSpan: number,
  occupied: Set<string>,
  gridCols = GRID_COLS,
): GridCell | null {
  if (
    canPlace(targetCol, targetRow, colSpan, rowSpan, occupied, gridCols)
  ) {
    return { gridCol: targetCol, gridRow: targetRow };
  }

  for (let col = targetCol; col >= 1; col--) {
    if (canPlace(col, targetRow, colSpan, rowSpan, occupied, gridCols)) {
      return { gridCol: col, gridRow: targetRow };
    }
  }

  return null;
}

export function getGridPlacementStyle(tile: BentoTile): CSSProperties {
  const { colSpan, rowSpan } = getTileSpan(tile);

  return {
    gridColumn: `${tile.gridCol} / span ${colSpan}`,
    gridRow: `${tile.gridRow} / span ${rowSpan}`,
  };
}

export function getGridPlacementClassName(): string {
  return "max-md:col-auto max-md:row-auto md:[grid-column:var(--tile-gc)] md:[grid-row:var(--tile-gr)]";
}

export function getGridPlacementVariables(tile: BentoTile): CSSProperties {
  const { colSpan, rowSpan } = getTileSpan(tile);

  return {
    "--tile-gc": `${tile.gridCol} / span ${colSpan}`,
    "--tile-gr": `${tile.gridRow} / span ${rowSpan}`,
  } as CSSProperties;
}

export function getGridRowCount(tiles: LayoutTile[]): number {
  let maxRow = 0;

  for (const tile of tiles) {
    const { rowSpan } = getTileSpan(tile);
    maxRow = Math.max(maxRow, tile.gridRow + rowSpan - 1);
  }

  return maxRow;
}

export function getGridColsForWidth(width: number): number {
  return width >= 768 ? GRID_COLS : 1;
}

export function pointerToGridCell(
  pointerX: number,
  pointerY: number,
  containerRect: DOMRect,
  gridCols: number,
): GridCell {
  const x = pointerX - containerRect.left;
  const y = pointerY - containerRect.top;

  const colWidth =
    (containerRect.width - GRID_GAP_PX * (gridCols - 1)) / gridCols;

  const gridCol = Math.min(
    gridCols,
    Math.max(1, Math.floor(x / (colWidth + GRID_GAP_PX)) + 1),
  );

  const gridRow = Math.max(
    1,
    Math.floor(y / (GRID_ROW_HEIGHT_PX + GRID_GAP_PX)) + 1,
  );

  return { gridCol, gridRow };
}

export function sortTilesForMobile(tiles: BentoTile[]): BentoTile[] {
  return [...tiles].sort(
    (left, right) =>
      left.gridRow - right.gridRow || left.gridCol - right.gridCol,
  );
}

export function findTileAtCell(
  tiles: LayoutTile[],
  gridCol: number,
  gridRow: number,
  excludeId?: string,
): LayoutTile | null {
  for (const tile of tiles) {
    if (excludeId && tile.id === excludeId) {
      continue;
    }

    const { colSpan, rowSpan } = getTileSpan(tile);

    if (
      gridCol >= tile.gridCol &&
      gridCol < tile.gridCol + colSpan &&
      gridRow >= tile.gridRow &&
      gridRow < tile.gridRow + rowSpan
    ) {
      return tile;
    }
  }

  return null;
}

export function tilesHaveSameSpan(
  a: Pick<BentoTile, "type" | "size">,
  b: Pick<BentoTile, "type" | "size">,
): boolean {
  const spanA = getTileSpan(a);
  const spanB = getTileSpan(b);

  return spanA.colSpan === spanB.colSpan && spanA.rowSpan === spanB.rowSpan;
}

export function resolveDropAction(
  draggedTile: LayoutTile,
  targetCol: number,
  targetRow: number,
  allTiles: LayoutTile[],
  gridCols = GRID_COLS,
): DropAction | null {
  const { colSpan, rowSpan } = getTileSpan(draggedTile);

  if (targetCol < 1 || targetRow < 1) {
    return null;
  }

  if (targetCol + colSpan - 1 > gridCols) {
    return null;
  }

  const occupiedWithoutDragged = getOccupiedCells(allTiles, draggedTile.id);

  if (canPlace(targetCol, targetRow, colSpan, rowSpan, occupiedWithoutDragged, gridCols)) {
    return { type: "place", gridCol: targetCol, gridRow: targetRow };
  }

  const targetTile = findTileAtCell(allTiles, targetCol, targetRow, draggedTile.id);

  if (!targetTile) {
    return null;
  }

  if (tilesHaveSameSpan(draggedTile, targetTile)) {
    return {
      type: "swap",
      gridCol: targetTile.gridCol,
      gridRow: targetTile.gridRow,
      targetTileId: targetTile.id,
    };
  }

  const occupiedWithoutBoth = getOccupiedCells(
    allTiles,
    draggedTile.id,
  );

  for (const key of getOccupiedCellsForTile(targetTile)) {
    occupiedWithoutBoth.delete(key);
  }

  for (let col = targetCol; col < targetCol + colSpan; col++) {
    for (let row = targetRow; row < targetRow + rowSpan; row++) {
      occupiedWithoutBoth.add(cellKey(col, row));
    }
  }

  const { colSpan: targetColSpan, rowSpan: targetRowSpan } = getTileSpan(targetTile);
  const pushTo = findFirstFit(targetColSpan, targetRowSpan, occupiedWithoutBoth, gridCols);

  return {
    type: "push",
    gridCol: targetCol,
    gridRow: targetRow,
    targetTileId: targetTile.id,
    pushTo,
  };
}

function getOccupiedCellsForTile(tile: LayoutTile): string[] {
  const { colSpan, rowSpan } = getTileSpan(tile);
  const cells: string[] = [];

  for (let col = tile.gridCol; col < tile.gridCol + colSpan; col++) {
    for (let row = tile.gridRow; row < tile.gridRow + rowSpan; row++) {
      cells.push(cellKey(col, row));
    }
  }

  return cells;
}

export function placeNewTile(
  tile: Omit<BentoTile, "gridCol" | "gridRow">,
  existingTiles: BentoTile[],
): BentoTile {
  const { colSpan, rowSpan } = getTileSpan(tile);
  const occupied = getOccupiedCells(existingTiles);
  const { gridCol, gridRow } = findFirstFit(colSpan, rowSpan, occupied);

  return {
    ...tile,
    gridCol,
    gridRow,
  } as BentoTile;
}
