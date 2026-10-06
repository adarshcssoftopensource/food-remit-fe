import { z } from "zod";
import { validateRemarkQuality } from "@/lib/utils/text-sanitizer";

export const updateLeadStatusSchema = z.object({
  status: z.string().min(1, "Status is required"),
  remark: z
    .string()
    .min(1, "Remark is required")
    .superRefine((val, ctx) => {
      const result = validateRemarkQuality(val);
      if (!result.isValid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: result.error || "Please enter a valid remark",
        });
      }
    }),
});

export type UpdateLeadStatusValues = z.infer<typeof updateLeadStatusSchema>;
