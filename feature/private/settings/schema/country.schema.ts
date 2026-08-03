import { z } from "zod/v3";

export const countrySchema = z.object({
  countryName: z
    .string()
    .min(1, "Country name is required")
    .min(2, "Country name must be at least 2 characters")
    .max(100, "Country name must not exceed 100 characters"),
});

export type CountryFormValues = z.infer<typeof countrySchema>;
