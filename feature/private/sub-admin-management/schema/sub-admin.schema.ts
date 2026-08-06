import { z } from "zod";

export const subAdminSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name is too long"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phoneCode: z.string().min(1, "Country code is required"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[0-9]{7,15}$/, "Invalid phone number"),
  address: z
    .string()
    .min(3, "Address must be at least 3 characters")
    .max(200, "Address is too long"),
  permissions: z.array(z.string()).min(1, "Select at least one permission"),
});

export type SubAdminFormValues = z.infer<typeof subAdminSchema>;
