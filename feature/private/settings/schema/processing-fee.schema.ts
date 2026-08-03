import z from "zod/v3";

export const processingFeeSchema = z.object({
  processingFee: z
    .string()
    .min(1, "Processing fee is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
      message: "Please enter a valid amount",
    }),
});

export type ProcessingFeeFormValues = z.infer<typeof processingFeeSchema>;
