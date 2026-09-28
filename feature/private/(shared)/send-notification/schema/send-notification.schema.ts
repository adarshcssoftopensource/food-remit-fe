import { z } from "zod/v3";

export const sendNotificationSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(200, "Title is too long"),
    message: z.string().min(1, "Message is required").max(5000, "Message is too long"),
    role: z.string().min(1, "Please select a role"),
    targetMode: z.enum(["all", "selected"]),
    recipientIds: z.array(z.string()),
    sendEmail: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.targetMode === "selected" && data.recipientIds.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select at least one recipient",
        path: ["recipientIds"],
      });
    }
  });

export type SendNotificationFormValues = z.infer<typeof sendNotificationSchema>;
