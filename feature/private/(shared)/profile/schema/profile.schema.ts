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

    email: z.string().trim().optional(),
    contactNumber: z.string().optional(),

    address: z.string().max(200, "Maximum 200 characters are allowed").optional(),
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    zipCode: z.string().optional(),
    image: z.any().optional(),
  });

export type ProfileDetailsValues = z.infer<ReturnType<typeof getProfileDetailsSchema>>;
