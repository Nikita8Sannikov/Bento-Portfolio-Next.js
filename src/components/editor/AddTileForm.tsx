import { BentoTile, TileSize, TileType } from "@/types/bento";
import { useState } from "react";

type AddTileFormProps = {
  onCreate: (tile: BentoTile) => void;
  onCancel: () => void;
};

const tileTypes: TileType[] = ["text", "image", "link", "map"];

const tileSizes: TileSize[] = ["square", "wide", "tall"];

export function AddTileForm({ onCreate, onCancel }: AddTileFormProps) {
  const [type, setType] = useState<TileType>("text");
  const [size, setSize] = useState<TileSize>("square");
  const [title, setTitle] = useState("");

  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [label, setLabel] = useState("");

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    if (type === "text" && !text.trim()) {
        return;
      }
      
      if (
        type === "image" &&
        (!imageUrl.trim() || !alt.trim())
      ) {
        return;
      }
      
      if (
        type === "link" &&
        (!url.trim() || !description.trim())
      ) {
        return;
      }
      
      if (type === "map") {
        const parsedLatitude = Number(latitude);
        const parsedLongitude = Number(longitude);
      
        if (
          !label.trim() ||
          latitude.trim() === "" ||
          longitude.trim() === "" ||
          Number.isNaN(parsedLatitude) ||
          Number.isNaN(parsedLongitude)
        ) {
          return;
        }
      }

    const baseTile = {
      id: crypto.randomUUID(),
      title: trimmedTitle,
      size,
    };

    let newTile: BentoTile;

    switch (type) {
      case "text":
        newTile = {
          ...baseTile,
          type: "text",
          text: text.trim(),
        };
        break;

      case "image":
        newTile = {
          ...baseTile,
          type: "image",
          imageUrl: imageUrl.trim(),
          alt: alt.trim(),
        };
        break;

      case "link":
        newTile = {
          ...baseTile,
          type: "link",
          url: url.trim(),
          description: description.trim(),
        };
        break;

      case "map":
        newTile = {
          ...baseTile,
          type: "map",
          latitude: Number(latitude),
          longitude: Number(longitude),
          label: label.trim(),
        };
        break;
    }

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
        
        {type === "text" && (
          <div className="mb-6">
            <label htmlFor="tile-text" className="mb-2 block font-medium">
              Text
            </label>

            <textarea
              id="tile-text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Tell something about yourself"
              className="min-h-32 w-full resize-none rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 outline-none focus:border-neutral-400"
            />
          </div>
        )}

        {type === "image" && (
          <div className="mb-6 space-y-4">
            <div>
              <label
                htmlFor="tile-image-url"
                className="mb-2 block font-medium"
              >
                Image URL
              </label>

              <input
                id="tile-image-url"
                type="url"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 outline-none focus:border-neutral-400"
              />
            </div>

            <div>
              <label
                htmlFor="tile-image-alt"
                className="mb-2 block font-medium"
              >
                Alternative text
              </label>

              <input
                id="tile-image-alt"
                type="text"
                value={alt}
                onChange={(event) => setAlt(event.target.value)}
                placeholder="Project dashboard screenshot"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 outline-none focus:border-neutral-400"
              />
            </div>
          </div>
        )}

        {type === "link" && (
          <div className="mb-6 space-y-4">
            <div>
              <label htmlFor="tile-url" className="mb-2 block font-medium">
                URL
              </label>

              <input
                id="tile-url"
                type="url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://github.com/username"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 outline-none focus:border-neutral-400"
              />
            </div>

            <div>
              <label
                htmlFor="tile-description"
                className="mb-2 block font-medium"
              >
                Description
              </label>

              <textarea
                id="tile-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="My GitHub profile"
                className="min-h-24 w-full resize-none rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 outline-none focus:border-neutral-400"
              />
            </div>
          </div>
        )}

        {type === "map" && (
          <div className="mb-6 space-y-4">
            <div>
              <label
                htmlFor="tile-map-label"
                className="mb-2 block font-medium"
              >
                Location label
              </label>

              <input
                id="tile-map-label"
                type="text"
                value={label}
                onChange={(event) => setLabel(event.target.value)}
                placeholder="Novi Sad, Serbia"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 outline-none focus:border-neutral-400"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="tile-latitude"
                  className="mb-2 block font-medium"
                >
                  Latitude
                </label>

                <input
                  id="tile-latitude"
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(event) => setLatitude(event.target.value)}
                  placeholder="45.2671"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 outline-none focus:border-neutral-400"
                />
              </div>

              <div>
                <label
                  htmlFor="tile-longitude"
                  className="mb-2 block font-medium"
                >
                  Longitude
                </label>

                <input
                  id="tile-longitude"
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(event) => setLongitude(event.target.value)}
                  placeholder="19.8335"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 outline-none focus:border-neutral-400"
                />
              </div>
            </div>
          </div>
        )}
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
