import { getFullPhoneError } from "@/lib/phone";
import { z } from "zod";

export const profileDetailsSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  email: z.string().email("Invalid email address"),
  contactNumber: z
    .string()
    .min(1, "Contact Number is required")
    .superRefine((value, ctx) => {
      const error = getFullPhoneError(value);
      if (error) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: error });
      }
    }),
});

export type ProfileDetailsValues = z.infer<typeof profileDetailsSchema>;
