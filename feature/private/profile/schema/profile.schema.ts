import { getFullPhoneError } from "@/lib/phone";
import { z } from "zod";

export const getProfileDetailsSchema = (isStoreAdmin: boolean) =>
  z.object({
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

    address: z.string().max(200, "Maximum 200 characters are allowed").optional(),
    country: isStoreAdmin ? z.string().min(1, "Country is required") : z.string().optional(),
    state: isStoreAdmin ? z.string().min(1, "State is required") : z.string().optional(),
    city: isStoreAdmin ? z.string().min(1, "City is required") : z.string().optional(),
    zipCode: isStoreAdmin ? z.string().min(1, "Zipcode is required") : z.string().optional(),
    image: z.any().optional(),
  });

export type ProfileDetailsValues = z.infer<ReturnType<typeof getProfileDetailsSchema>>;
