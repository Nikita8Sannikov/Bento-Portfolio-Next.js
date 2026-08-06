import Image from "next/image";
import { ImageTile } from "@/types/bento";

type ImageTileContentProps = {
  tile: ImageTile;
  linkable?: boolean;
};

function ImageElement({ tile }: { tile: ImageTile }) {
  const isLocalImage = tile.imageUrl.startsWith("/");

  if (isLocalImage) {
    return (
      <Image
        src={tile.imageUrl}
        alt={tile.alt}
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover"
        loading="eager"
      />
    );
  }

  return (
    <img
      src={tile.imageUrl}
      alt={tile.alt}
      className="h-full w-full object-cover"
    />
  );
}

export function ImageTileContent({
  tile,
  linkable = false,
}: ImageTileContentProps) {
  const imageBlock = (
    <div className="relative h-full min-h-32 overflow-hidden bg-neutral-800">
      <ImageElement tile={tile} />
    </div>
  );

  if (linkable && tile.url) {
    const linkLabel = tile.title.trim() || tile.alt;

    return (
      <a
        href={tile.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full cursor-pointer transition hover:opacity-90"
        aria-label={`Open link for ${linkLabel}`}
      >
        {imageBlock}
      </a>
    );
  }

  return imageBlock;
}
