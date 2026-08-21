import { findWorldCountryByName } from "@/lib/world-locations";
import { z } from "zod/v3";

export const countrySchema = z.object({
  countryName: z
    .string()
    .min(1, "Please select a country")
    .refine((name) => Boolean(findWorldCountryByName(name)), {
      message: "Please select a country from the list",
    }),
});

export type CountryFormValues = z.infer<typeof countrySchema>;
