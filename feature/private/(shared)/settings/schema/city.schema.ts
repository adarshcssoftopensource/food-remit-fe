import { findWorldCity } from "@/lib/world-locations";
import { z } from "zod/v3";

export const citySchema = z
  .object({
    countryId: z.string().min(1, "Please select a country"),
    countryIsoCode: z.string().optional(),
    cityName: z.string().min(1, "Please select a city"),
  })
  .superRefine((data, ctx) => {
    if (!data.countryIsoCode) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cityName"],
        message: "Select a country with a valid city list first",
      });
      return;
    }

    if (!findWorldCity(data.countryIsoCode, data.cityName)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cityName"],
        message: "Please select a city from the list",
      });
    }
  });

export type CityFormValues = z.infer<typeof citySchema>;
