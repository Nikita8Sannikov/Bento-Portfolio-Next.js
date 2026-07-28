import { LinkTile } from "@/types/bento";

type LinkTileContentProps = {
    tile: LinkTile
}
export function LinkTileContent({tile}: LinkTileContentProps) {
    return (
        <div className="flex h-full flex-col">
          <p className="text-neutral-300">{tile.description}</p>
    
          <a
            href={tile.url}
            target="_blank"
  rel="noopener noreferrer"
        className="mt-auto inline-flex w-fit items-center gap-2 rounded-xl border border-neutral-700 px-4 py-2 transition hover:border-neutral-500 hover:bg-neutral-800"
          >
            Open link
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      );
}


