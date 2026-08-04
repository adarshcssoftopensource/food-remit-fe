import { z } from "zod";

export const assignCityManagerSchema = z.object({
  country: z.string().min(1, "Please select a country"),
  cityManagerId: z.string().min(1, "Please select a city manager"),
});

export type AssignCityManagerFormValues = z.infer<typeof assignCityManagerSchema>;
