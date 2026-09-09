import { getFullPhoneError } from "@/lib/phone";
import { z } from "zod/v3";

const NAME_REGEX = /^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF\s'-]+$/;
const LOCATION_TEXT_REGEX = /^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF\s.'-]+$/;

export const partnerLeadSchema = z
  .object({
    businessName: z
      .string()
      .trim()
      .min(2, "Business name must be at least 2 characters")
      .max(100, "Business name cannot exceed 100 characters"),
    businessType: z.string().min(1, "Please select a business type"),
    otherBusinessType: z.string().optional(),
    locationsCount: z.string().min(1, "Please select number of locations"),
    hasBusinessAccount: z.boolean().optional(),
    country: z.string().min(1, "Please select a country"),
    businessCity: z
      .string()
      .trim()
      .max(60, "City cannot exceed 60 characters")
      .refine((val) => !val || LOCATION_TEXT_REGEX.test(val), {
        message: "City can only contain letters, spaces, hyphens, and periods",
      })
      .optional()
      .or(z.literal("")),
    stateProvinceRegion: z
      .string()
      .trim()
      .max(60, "State / Province cannot exceed 60 characters")
      .refine((val) => !val || LOCATION_TEXT_REGEX.test(val), {
        message: "State / Province can only contain letters, spaces, hyphens, and periods",
      })
      .optional()
      .or(z.literal("")),

    firstName: z
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name cannot exceed 50 characters")
      .refine((val) => NAME_REGEX.test(val), {
        message: "First name can only contain letters, spaces, hyphens, and apostrophes",
      }),
    lastName: z
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name cannot exceed 50 characters")
      .refine((val) => NAME_REGEX.test(val), {
        message: "Last name can only contain letters, spaces, hyphens, and apostrophes",
      }),
    jobTitle: z
      .string()
      .trim()
      .max(100, "Job title cannot exceed 100 characters")
      .optional()
      .or(z.literal("")),
    businessEmail: z
      .string()
      .trim()
      .min(1, "Business email is required")
      .max(100, "Business email cannot exceed 100 characters")
      .email("Please enter a valid business email address"),
    phoneNumber: z
      .string()
      .min(1, "Phone number is required")
      .superRefine((value, ctx) => {
        const error = getFullPhoneError(value);
        if (error) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: error });
        }
      }),

    workPreferences: z.array(z.string()),
    otherWorkPreference: z.string().optional(),
    inventoryManagement: z.string().optional(),
    websiteOrSocial: z
      .string()
      .refine((value) => !value || /^https?:\/\/.+\..+/.test(value), {
        message: "Please enter a valid URL",
      })
      .optional(),
    additionalNotes: z.string().optional(),

    agreeToContact: z.boolean().refine((val) => val === true, {
      message: "You must agree to be contacted by Food Remit to proceed",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.businessType === "Other") {
      const otherTrimmed = data.otherBusinessType?.trim() || "";
      if (otherTrimmed.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["otherBusinessType"],
          message: "Please specify your business type (at least 2 characters)",
        });
      } else if (otherTrimmed.length > 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["otherBusinessType"],
          message: "Specified business type cannot exceed 100 characters",
        });
      }
    }

    if (data.workPreferences.includes("Other")) {
      const otherPrefTrimmed = data.otherWorkPreference?.trim() || "";
      if (otherPrefTrimmed.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["otherWorkPreference"],
          message: "Please specify your other work preference (at least 2 characters)",
        });
      } else if (otherPrefTrimmed.length > 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["otherWorkPreference"],
          message: "Specified preference cannot exceed 100 characters",
        });
      }
    }
  });

export type PartnerLeadFormValues = z.infer<typeof partnerLeadSchema>;
