import { z } from "zod/v3";

export const sendNotificationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  userRole: z.string().min(1, "User Role is required"),
  message: z.string().min(1, "Message is required"),
});

export type SendNotificationFormValues = z.infer<typeof sendNotificationSchema>;
