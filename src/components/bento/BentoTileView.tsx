import { ImageTileContent } from "@/components/bento/content/ImageTileContent";
import { LinkTileContent } from "@/components/bento/content/LinkTileContent";
import { MapTileContent } from "@/components/bento/content/MapTileContent";
import { TextTileContent } from "@/components/bento/content/TextTileContent";
import type { BentoTile } from "@/types/bento";
import { assertNever } from "@/utils/assert-never";

import { getTileSizeClass } from "./tile-size-classes";

type BentoTileViewProps = {
  tile: BentoTile;
  className?: string;
  children?: React.ReactNode;
  applyGridSize?: boolean;
  linkable?: boolean;
};

function isVisualTile(tile: BentoTile): tile is BentoTile & { type: "image" | "map" } {
  return tile.type === "image" || tile.type === "map";
}

function renderTileContent(tile: BentoTile, linkable: boolean) {
  switch (tile.type) {
    case "text":
      return <TextTileContent tile={tile} />;
    case "image":
      return <ImageTileContent tile={tile} linkable={linkable} />;
    case "link":
      return <LinkTileContent tile={tile} />;

    case "map":
      return <MapTileContent tile={tile} />;

    default:
      return assertNever(tile);
  }
}

export function BentoTileView({
  tile,
  className = "",
  children,
  applyGridSize = true,
  linkable = false,
}: BentoTileViewProps) {
  const sizeClass = applyGridSize ? getTileSizeClass(tile) : "";
  const visual = isVisualTile(tile);
  const hasTitle = Boolean(tile.title.trim());
  const reserveActionsSpace = Boolean(children);

  return (
    <article
      className={`
        relative flex min-h-48 flex-col overflow-hidden rounded-3xl
        border border-neutral-800 bg-neutral-900
        ${visual ? "p-0" : "p-6"}
        ${sizeClass}
        ${className}
      `}
    >
      {children}

      {hasTitle && (
        <header
          className={`shrink-0 ${reserveActionsSpace ? "pr-28" : ""} ${visual ? "px-4 py-3" : "mb-4"}`}
        >
          <h2
            title={tile.title}
            className={`line-clamp-2 font-semibold leading-snug ${visual ? "text-lg" : "text-xl"}`}
          >
            {tile.title}
          </h2>
        </header>
      )}

      <div className={visual ? "h-full min-h-0 flex-1" : "min-h-0 flex-1"}>
        {renderTileContent(tile, linkable)}
      </div>
    </article>
  );
}
