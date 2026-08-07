import { z } from "zod/v3";

export const amountLimitSchema = z.object({
  countryName: z.string().min(1, "Country name is required"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid amount"),
});

export type AmountLimitFormValues = z.infer<typeof amountLimitSchema>;
