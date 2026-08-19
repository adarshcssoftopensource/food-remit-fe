import { z } from "zod";

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
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number is too long")
    .regex(/^\d{10,15}$/, "Enter a valid phone number"),

  permissions: z.array(z.string()).min(1, "Select at least one permission"),
});

export type SubAdminFormValues = z.infer<typeof subAdminSchema>;
