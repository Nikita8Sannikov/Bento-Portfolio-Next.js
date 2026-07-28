import { BentoTile, TileSize, TileType } from "@/types/bento";
import { useState } from "react";

type AddTileFormProps = {
  onCreate: (tile: BentoTile) => void;
  onCancel: () => void;
};

const tileTypes: TileType[] = [
    "text",
    "image",
    "link",
    "map",
  ];
  
  const tileSizes: TileSize[] = [
    "square",
    "wide",
    "tall",
  ];

export function AddTileForm({ onCreate, onCancel }: AddTileFormProps) {
  const [type, setType] = useState<TileType>("text");
  const [size, setSize] = useState<TileSize>("square");
  const [title, setTitle] = useState("");

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    const newTile: BentoTile = {
      id: crypto.randomUUID(),
      type,
      size,
      title: trimmedTitle,
    };

    onCreate(newTile);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 rounded-3xl border border-neutral-800 bg-neutral-900 p-6"
    >
      <div>
        <p className="text-sm text-neutral-400">Create title</p>
        <h2 className="mt-1 text-2xl font-semibold">Add new tile</h2>
      </div>

      <fieldset className="mb-6">
        <legend className="mb-3 font-medium">Type</legend>
        <div className="flex flex-wrap gap-2">
          {tileTypes.map((tileType) => (
            <button
              key={tileType}
              type="button"
              onClick={() => setType(tileType)}
              className={
                type === tileType
                  ? "rounded-xl bg-white px-4 py-2 text-black"
                  : "rounded-xl border border-neutral-700 px-4 py-2 text-neutral-300"
              }
            >
              {tileType}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mb-6">
        <legend className="mb-3 font-medium">Size</legend>

        <div className="flex flex-wrap gap-2">
          {tileSizes.map((tileSize) => (
            <button
              key={tileSize}
              type="button"
              onClick={() => setSize(tileSize)}
              className={
                size === tileSize
                  ? "rounded-xl bg-white px-4 py-2 text-black"
                  : "rounded-xl border border-neutral-700 px-4 py-2 text-neutral-300"
              }
            >
              {tileSize}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mb-6">
        <label htmlFor="tile-title" className="mb-2 block font-medium">
          Title
        </label>

        <input
          id="tile-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="About me"
          className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 outline-none focus:border-neutral-400"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-neutral-700 px-4 py-2 text-neutral-300"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={!title.trim()}
          className="rounded-xl bg-white px-4 py-2 font-medium text-black disabled:cursor-not-allowed disabled:opacity-40"
        >
          Create tile
        </button>
      </div>
    </form>
  );
}
