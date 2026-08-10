import type {
  ExpressionSpecification,
  StyleSpecification,
} from "maplibre-gl";

const OPEN_FREE_MAP_LIBERTY_STYLE_URL =
  "https://tiles.openfreemap.org/styles/liberty";

const ENGLISH_TEXT_FIELD: ExpressionSpecification = [
  "coalesce",
  ["get", "name:en"],
  ["get", "name_en"],
  ["get", "name:latin"],
  ["get", "name"],
];

let cachedEnglishStyle: StyleSpecification | null = null;
let englishStylePromise: Promise<StyleSpecification> | null = null;

function isRefOnlyTextField(textField: unknown): boolean {
  return (
    Array.isArray(textField) &&
    textField.length === 2 &&
    textField[0] === "to-string" &&
    Array.isArray(textField[1]) &&
    textField[1][0] === "get" &&
    textField[1][1] === "ref"
  );
}

function applyEnglishLabels(style: StyleSpecification): StyleSpecification {
  const layers = style.layers?.map((layer) => {
    if (layer.type !== "symbol") {
      return layer;
    }

    const textField = layer.layout?.["text-field"];

    if (textField == null || isRefOnlyTextField(textField)) {
      return layer;
    }

    return {
      ...layer,
      layout: {
        ...layer.layout,
        "text-field": ENGLISH_TEXT_FIELD,
      },
    };
  });

  return {
    ...style,
    layers,
  };
}

export async function getEnglishMapStyle(): Promise<StyleSpecification> {
  if (cachedEnglishStyle) {
    return cachedEnglishStyle;
  }

  if (!englishStylePromise) {
    englishStylePromise = fetch(OPEN_FREE_MAP_LIBERTY_STYLE_URL)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to load map style: ${response.status} ${response.statusText}`,
          );
        }

        const style = (await response.json()) as StyleSpecification;
        const englishStyle = applyEnglishLabels(style);

        cachedEnglishStyle = englishStyle;

        return englishStyle;
      })
      .catch((error: unknown) => {
        englishStylePromise = null;
        throw error;
      });
  }

  return englishStylePromise;
}
