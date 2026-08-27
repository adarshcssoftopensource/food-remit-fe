import { z } from "zod/v3";

export const EmployeeFormSchema = z.object({
  firstName: z.string().min(1, "First Name is required").max(50),
  lastName: z.string().min(1, "Last Name is required").max(50),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phoneNumber: z.string().optional(),
  countryCode: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  image: z.union([z.instanceof(File), z.string()]).optional(),
  accountStatus: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export type EmployeeFormValues = z.infer<typeof EmployeeFormSchema>;
