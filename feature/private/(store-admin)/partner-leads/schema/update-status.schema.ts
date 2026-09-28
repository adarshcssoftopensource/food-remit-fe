import { z } from "zod";

export const updateLeadStatusSchema = z.object({
  status: z.string().min(1, "Status is required"),
  remark: z.string().min(3, "Please provide a more descriptive remark (at least 3 characters)"),
});

export type UpdateLeadStatusValues = z.infer<typeof updateLeadStatusSchema>;
