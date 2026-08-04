import { z } from "zod";

export const geocodingResultSchema = z.object({
  id: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  label: z.string().min(1),
});

export const geocodingResultsSchema = z.array(
  geocodingResultSchema,
);

export type GeocodingResult = z.infer<
  typeof geocodingResultSchema
>;