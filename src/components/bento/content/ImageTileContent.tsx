import Image from "next/image";
import { ImageTile } from "@/types/bento";

type ImageTileContentProps = {
  tile: ImageTile;
};
export function ImageTileContent({ tile }: ImageTileContentProps) {
    const isLocalImage = tile.imageUrl.startsWith("/");

  return (
<div className="relative h-full min-h-32 overflow-hidden rounded-2xl bg-neutral-800">
      {isLocalImage ? (
        <Image
          src={tile.imageUrl}
          alt={tile.alt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      ) : (
        <img
          src={tile.imageUrl}
          alt={tile.alt}
          className="h-full w-full object-cover"
        />
      )}
    </div>
  )
}
