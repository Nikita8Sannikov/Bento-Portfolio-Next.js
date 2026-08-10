import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/require-admin";
import { geocodingResultsSchema } from "@/types/geocoding";

const querySchema = z.string().trim().min(2).max(200);

const photonPropertiesSchema = z.object({
  osm_id: z.union([z.number(), z.string()]).optional(),
  name: z.string().optional(),
  street: z.string().optional(),
  housenumber: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  county: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postcode: z.string().optional(),
});

const photonFeatureSchema = z.object({
  geometry: z.object({
    coordinates: z.tuple([z.number(), z.number()]),
  }),
  properties: photonPropertiesSchema,
});

const photonResponseSchema = z.object({
  features: z.array(photonFeatureSchema),
});

function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

function buildLabel(
  properties: z.infer<typeof photonPropertiesSchema>,
): string | null {
  const streetLine = [properties.street, properties.housenumber]
    .filter(Boolean)
    .join(" ");

  const parts = [
    streetLine || properties.name,
    properties.district,
    properties.city,
    properties.county,
    properties.state,
    properties.postcode,
    properties.country,
  ].filter((part, index, all) => {
    if (!part) {
      return false;
    }

    return all.indexOf(part) === index;
  });

  if (parts.length === 0) {
    return null;
  }

  return parts.join(", ");
}

export async function GET(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return jsonError("Unauthorized", 401);
  }

  const url = new URL(request.url);

  const queryResult = querySchema.safeParse(url.searchParams.get("q"));

  if (!queryResult.success) {
    return jsonError("Enter at least two characters", 400);
  }

  const contactEmail = process.env.GEOCODING_CONTACT_EMAIL;

  if (!contactEmail) {
    console.error("GEOCODING_CONTACT_EMAIL is not configured");

    return jsonError("Geocoding is not configured", 500);
  }

  const searchUrl = new URL("https://photon.komoot.io/api/");

  searchUrl.searchParams.set("q", queryResult.data);
  searchUrl.searchParams.set("limit", "5");
  searchUrl.searchParams.set("lang", "en");

  let response: Response;

  try {
    response = await fetch(searchUrl, {
      headers: {
        "User-Agent": `BentoPortfolio/1.0 (${contactEmail})`,
        Accept: "application/json",
      },
      cache: "no-store",
    });
  } catch (error) {
    console.error("Photon request failed:", error);

    return jsonError("Geocoding service is unavailable", 502);
  }

  if (!response.ok) {
    console.error(
      "Photon returned non-OK status:",
      response.status,
      await response.text().catch(() => ""),
    );

    return jsonError("Geocoding service is unavailable", 502);
  }

  const responseText = await response.text();

  if (!responseText.trim()) {
    console.error("Photon returned an empty body");

    return jsonError("Geocoding service is unavailable", 502);
  }

  let rawData: unknown;

  try {
    rawData = JSON.parse(responseText) as unknown;
  } catch (error) {
    console.error("Photon returned invalid JSON:", error, responseText);

    return jsonError("Invalid geocoding response", 502);
  }

  const parseResult = photonResponseSchema.safeParse(rawData);

  if (!parseResult.success) {
    console.error("Invalid geocoding response:", parseResult.error);

    return jsonError("Invalid geocoding response", 502);
  }

  const results = parseResult.data.features.flatMap((feature, index) => {
    const [longitude, latitude] = feature.geometry.coordinates;
    const label = buildLabel(feature.properties);

    if (!label || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return [];
    }

    return [
      {
        id: String(feature.properties.osm_id ?? index),
        latitude,
        longitude,
        label,
      },
    ];
  });

  if (results.length === 0) {
    return jsonError("Location not found", 404);
  }

  return NextResponse.json(geocodingResultsSchema.parse(results));
}
