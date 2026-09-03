import z from "zod/v3";

export const markupSchema = z.object({
  markupPercentage: z
    .string()
    .min(1, "Markup percentage is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0 && parseFloat(val) <= 100, {
      message: "Please enter a valid percentage between 0 and 100",
    }),
  isFeeRefundable: z.boolean().default(true),
});

export type MarkupFormValues = z.infer<typeof markupSchema>;
