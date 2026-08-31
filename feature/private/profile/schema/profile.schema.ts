import { getFullPhoneError } from "@/lib/phone";
import { z } from "zod";

export const profileDetailsSchema = z.object({
  firstName: z
    .string()
    .min(2, "Minimum 2 characters are required")
    .max(50, "Maximum 50 characters are allowed"),
  lastName: z
    .string()
    .min(2, "Minimum 2 characters are required")
    .max(50, "Maximum 50 characters are allowed"),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .max(100, "Maximum 100 characters are allowed")
    .email("Invalid email address"),

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
