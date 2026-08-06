import { BentoTile, TileSize, TileType } from "@/types/bento";
import {
  GeocodingResult,
  geocodingResultSchema,
  geocodingResultsSchema,
} from "@/types/geocoding";
import { useCallback, useState } from "react";
import { MapPicker } from "../map/MapPicker";

type TileFormProps = {
  initialTile?: BentoTile;
  onSubmit: (tile: BentoTile) => void;
  onCancel: () => void;
};

const tileTypes: TileType[] = ["text", "image", "link", "map"];

const tileSizes: TileSize[] = ["square", "wide", "tall"];

export function TileForm({ initialTile, onSubmit, onCancel }: TileFormProps) {
  const [type, setType] = useState<TileType>(initialTile?.type ?? "text");
  const [size, setSize] = useState<TileSize>(initialTile?.size ?? "square");
  const [title, setTitle] = useState(initialTile?.title ?? "");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationResults, setLocationResults] = useState<GeocodingResult[]>([]);

  const [locationQuery, setLocationQuery] = useState(
    initialTile?.type === "map" ? initialTile.label : "",
  );
  const [text, setText] = useState(
    initialTile?.type === "text" ? initialTile.text : "",
  );
  const [imageUrl, setImageUrl] = useState(
    initialTile?.type === "image" ? initialTile.imageUrl : "",
  );
  const [alt, setAlt] = useState(
    initialTile?.type === "image" ? initialTile.alt : "",
  );
  const [url, setUrl] = useState(
    initialTile?.type === "link" ? initialTile.url : "",
  );
  const [description, setDescription] = useState(
    initialTile?.type === "link" ? initialTile.description : "",
  );
  const [latitude, setLatitude] = useState(
    initialTile?.type === "map" ? initialTile.latitude : "",
  );
  const [longitude, setLongitude] = useState(
    initialTile?.type === "map" ? initialTile.longitude : "",
  );
  const [label, setLabel] = useState(
    initialTile?.type === "map" ? initialTile.label : "",
  );

  const handleCoordinatesChange = useCallback(
    (coordinates: { latitude: number; longitude: number }) => {
      setLatitude(String(coordinates.latitude));
      setLongitude(String(coordinates.longitude));
    },
    [],
  );

  async function handleLocationSearch() {
    const query = locationQuery.trim();
    setLocationResults([]);

    if (query.length < 2) {
      setLocationError("Введите название города.");

      return;
    }

    setLocationError(null);
    setIsSearchingLocation(true);

    try {
      const response = await fetch(
        `/api/geocoding/search?q=${encodeURIComponent(query)}`,
      );

      const result: unknown = await response.json();

      if (!response.ok) {
        const message =
          typeof result === "object" &&
          result !== null &&
          "error" in result &&
          typeof result.error === "string"
            ? result.error
            : "Location search failed";

        throw new Error(message);
      }

      const parsedResult = geocodingResultsSchema.safeParse(result);

      if (!parsedResult.success) {
        throw new Error("Invalid geocoding response");
      }

      setLocationResults(parsedResult.data);
    } catch (error) {
      console.error("Failed to search location:", error);

      setLocationError(
        error instanceof Error ? error.message : "Не удалось найти город.",
      );
    } finally {
      setIsSearchingLocation(false);
    }
  }

  function handleSelectLocation(result: GeocodingResult) {
    setLatitude(result.latitude);
    setLongitude(result.longitude);
    setLabel(result.label);
    setLocationQuery(result.label);
    setLocationResults([]);
  }

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploadError(null);
    setIsUploadingImage(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/uploads/images", {
        method: "POST",
        body: formData,
      });

      const result: unknown = await response.json();

      if (
        !response.ok ||
        typeof result !== "object" ||
        result === null ||
        !("imageUrl" in result) ||
        typeof result.imageUrl !== "string"
      ) {
        throw new Error("Image upload failed");
      }

      setImageUrl(result.imageUrl);
    } catch (error) {
      console.error("Failed to upload image:", error);

      setUploadError("Не удалось загрузить изображение.");
    } finally {
      setIsUploadingImage(false);
    }
  }

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    if (type === "text" && !text.trim()) {
      return;
    }

    if (type === "image" && (!imageUrl.trim() || !alt.trim())) {
      return;
    }

    if (type === "link" && (!url.trim() || !description.trim())) {
      return;
    }

    if (type === "map") {
      const parsedLatitude = Number(latitude);
      const parsedLongitude = Number(longitude);

      if (
        !label.trim() ||
        String(latitude).trim() === "" ||
        String(longitude).trim() === "" ||
        Number.isNaN(parsedLatitude) ||
        Number.isNaN(parsedLongitude)
      ) {
        return;
      }
    }

    const baseTile = {
      id: initialTile?.id ?? crypto.randomUUID(),
      title: trimmedTitle,
      size,
      gridCol: initialTile?.gridCol ?? 1,
      gridRow: initialTile?.gridRow ?? 1,
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

    onSubmit(newTile);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 rounded-3xl border border-neutral-800 bg-neutral-900 p-6"
    >
      <div>
        <p className="text-sm text-neutral-400">
          {initialTile ? "Edit title" : "Create title"}
        </p>
        <h2 className="mt-1 text-2xl font-semibold">
          {initialTile ? `Editing "${initialTile.title}"` : "Add new tile"}
        </h2>
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
            <label className="block">
              <span className="mb-2 block text-sm text-neutral-300">
                Upload image
              </span>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                disabled={isUploadingImage}
                onChange={handleImageUpload}
                className="
      block w-full text-sm text-neutral-400
      file:mr-4 file:rounded-lg file:border-0
      file:bg-white file:px-4 file:py-2
      file:font-medium file:text-black
      disabled:opacity-50
    "
              />
            </label>
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
            {isUploadingImage && (
              <p className="text-sm text-neutral-400">Uploading image...</p>
            )}

            {uploadError && (
              <p role="alert" className="text-sm text-red-400">
                {uploadError}
              </p>
            )}
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

        {/* {type === "map" && (
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
        )} */}
        {type === "map" && (
          <div className="space-y-5">
            <div>
              <label
                htmlFor="location-query"
                className="mb-2 block text-sm text-neutral-300"
              >
                City or location
              </label>

              <div className="flex gap-2">
                <input
                  id="location-query"
                  type="search"
                  value={locationQuery}
                  onChange={(event) => setLocationQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      void handleLocationSearch();
                    }
                  }}
                  placeholder="Novi Sad"
                  className="
            min-w-0 flex-1 rounded-xl
            border border-neutral-700
            bg-neutral-950 px-4 py-3
            text-white placeholder:text-neutral-600
          "
                />
                {locationResults.length > 0 && (
                  <ul
                    className="
    mt-2 overflow-hidden rounded-xl
    border border-neutral-700
    bg-neutral-950
  "
                  >
                    {locationResults.map((result) => (
                      <li key={result.id}>
                        <button
                          type="button"
                          onClick={() => handleSelectLocation(result)}
                          className="
            block w-full border-b border-neutral-800
            px-4 py-3 text-left text-sm
            text-neutral-200
            last:border-b-0
            hover:bg-neutral-900
          "
                        >
                          {result.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <button
                  type="button"
                  disabled={isSearchingLocation}
                  onClick={() => void handleLocationSearch()}
                  className="
            rounded-xl border border-neutral-700
            px-4 py-3 text-sm
            hover:border-neutral-500
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
                >
                  {isSearchingLocation ? "Finding..." : "Find"}
                </button>
              </div>

              {locationError && (
                <p role="alert" className="mt-2 text-sm text-red-400">
                  {locationError}
                </p>
              )}
            </div>

            <MapPicker
              latitude={Number(latitude)}
              longitude={Number(longitude)}
              onCoordinatesChange={handleCoordinatesChange}
            />

            <p className="text-sm text-neutral-400">
              Click the map or drag the marker to choose a more precise
              position.
            </p>

            <label className="block">
              <span className="mb-2 block text-sm text-neutral-300">
                Display label
              </span>

              <input
                type="text"
                value={label}
                onChange={(event) => setLabel(event.target.value)}
                required
                placeholder="Novi Sad, Serbia"
                className="
          w-full rounded-xl border
          border-neutral-700 bg-neutral-950
          px-4 py-3 text-white
          placeholder:text-neutral-600
        "
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-2 block text-sm text-neutral-300">
                  Latitude
                </span>

                <input
                  type="number"
                  value={latitude}
                  onChange={(event) => setLatitude(event.target.value)}
                  min={-90}
                  max={90}
                  step="any"
                  required
                  className="
            w-full rounded-xl border
            border-neutral-700 bg-neutral-950
            px-4 py-3 text-white
          "
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-neutral-300">
                  Longitude
                </span>

                <input
                  type="number"
                  value={longitude}
                  onChange={(event) => Number(event.target.value)}
                  min={-180}
                  max={180}
                  step="any"
                  required
                  className="
            w-full rounded-xl border
            border-neutral-700 bg-neutral-950
            px-4 py-3 text-white
          "
                />
              </label>
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
          disabled={isUploadingImage}
          className="
    rounded-xl bg-white px-4 py-2 text-black
    disabled:cursor-not-allowed
    disabled:opacity-50
  "
        >
          {isUploadingImage
            ? "Uploading image..."
            : initialTile
              ? "Save changes"
              : "Create tile"}
        </button>
      </div>
    </form>
  );
}
