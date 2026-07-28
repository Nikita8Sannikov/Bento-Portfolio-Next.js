import { TextTile } from "@/types/bento"

type TextTileContentProps = {
    tile: TextTile
}

export function TextTileContent({tile}: TextTileContentProps) {
    return <p className="text-neutral-300">{tile.text}</p>
}
