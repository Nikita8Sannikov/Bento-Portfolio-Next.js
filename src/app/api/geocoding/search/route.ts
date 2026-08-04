import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/require-admin";
import {
  geocodingResultSchema,
  geocodingResultsSchema,
  type GeocodingResult,
} from "@/types/geocoding";

const querySchema = z.string().trim().min(2).max(200);

const nominatimResultSchema = z.object({
    place_id: z.union([
      z.number(),
      z.string(),
    ]),
    lat: z.string(),
    lon: z.string(),
    display_name: z.string(),
  });

const nominatimResponseSchema = z.array(
  nominatimResultSchema,
);

export async function GET(request: Request) {
  await requireAdmin();

  const url = new URL(request.url);

  const queryResult = querySchema.safeParse(
    url.searchParams.get("q"),
  );

  if (!queryResult.success) {
    return NextResponse.json(
      {
        error: "Enter at least two characters",
      },
      {
        status: 400,
      },
    );
  }

  const contactEmail =
    process.env.GEOCODING_CONTACT_EMAIL;

  if (!contactEmail) {
    throw new Error(
      "GEOCODING_CONTACT_EMAIL is not configured",
    );
  }

  const searchUrl = new URL(
    "https://nominatim.openstreetmap.org/search",
  );

  searchUrl.searchParams.set("q", queryResult.data);
  searchUrl.searchParams.set("format", "jsonv2");
  searchUrl.searchParams.set("limit", "5");
  searchUrl.searchParams.set("addressdetails", "1");

  const response = await fetch(searchUrl, {
    headers: {
      "User-Agent":
        `BentoPortfolio/1.0 (${contactEmail})`,
      "Accept-Language": "en",
    },

    next: {
      revalidate: 86400,
    },
  });

  if (!response.ok) {
    return NextResponse.json(
      {
        error: "Geocoding service is unavailable",
      },
      {
        status: 502,
      },
    );
  }

  const rawData: unknown = await response.json();

  const parseResult =
    nominatimResponseSchema.safeParse(rawData);

  if (!parseResult.success) {
    console.error(
      "Invalid geocoding response:",
      parseResult.error,
    );

    return NextResponse.json(
      {
        error: "Invalid geocoding response",
      },
      {
        status: 502,
      },
    );
  }

  const firstResult = parseResult.data[0];

  if (!firstResult) {
    return NextResponse.json(
      {
        error: "Location not found",
      },
      {
        status: 404,
      },
    );
  }

  const results = parseResult.data.map((item) => ({
    id: String(item.place_id),
    latitude: Number(item.lat),
    longitude: Number(item.lon),
    label: item.display_name,
  }));
  
  if (results.length === 0) {
    return NextResponse.json(
      {
        error: "Location not found",
      },
      {
        status: 404,
      },
    );
  }
  
  return NextResponse.json(
    geocodingResultsSchema.parse(results),
  );
}