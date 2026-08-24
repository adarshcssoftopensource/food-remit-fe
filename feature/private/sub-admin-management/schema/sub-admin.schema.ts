import { z } from "zod";
import { getFullPhoneError } from "@/lib/phone";

export const subAdminSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, or apostrophes"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address (e.g. user@example.com)"),

  phone: z
    .string()
    .min(1, "Phone number is required")
    .superRefine((value, ctx) => {
      const error = getFullPhoneError(value);
      if (error) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: error });
      }
    }),

  permissions: z.array(z.string()).min(1, "Select at least one permission"),
});

export type SubAdminFormValues = z.infer<typeof subAdminSchema>;
