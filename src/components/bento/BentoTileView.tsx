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
};

function renderTileContent(tile: BentoTile) {
  switch (tile.type) {
    case "text":
      return <TextTileContent tile={tile} />;

    case "image":
      return <ImageTileContent tile={tile} />;

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
}: BentoTileViewProps) {
  const sizeClass = applyGridSize ? getTileSizeClass(tile) : "";

  return (
    <article
      className={`
        relative flex min-h-48 flex-col overflow-hidden rounded-3xl
        border border-neutral-800 bg-neutral-900 p-6
        ${sizeClass}
        ${className}
      `}
    >
      {children}

      <header className="mb-4 pr-28">
        <p className="text-sm uppercase tracking-wide text-neutral-400">
          {tile.type}
        </p>
        <h2 className="mt-2 pr-16 text-xl font-semibold">{tile.title}</h2>
      </header>

      <div className="min-h-0 flex-1">{renderTileContent(tile)}</div>
    </article>
  );
}
