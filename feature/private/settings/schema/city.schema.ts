import { z } from "zod/v3";

export const citySchema = z.object({
  countryId: z.string().min(1, "Please select a country"),
  cityName: z
    .string()
    .min(1, "City name is required")
    .min(2, "City name must be at least 2 characters")
    .max(100, "City name must not exceed 100 characters"),
});

export type CityFormValues = z.infer<typeof citySchema>;
