import { getFullPhoneError } from "@/lib/phone";
import { z } from "zod/v3";

export const partnerLeadSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  businessType: z.string().min(1, "Please select a business type"),
  locationsCount: z.string().min(1, "Please select number of locations"),
  country: z.string().min(1, "Please select a country"),
  businessCity: z.string().optional(),
  stateProvinceRegion: z.string().optional(),

  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  jobTitle: z.string().optional(),
  businessEmail: z
    .string()
    .min(1, "Business email is required")
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
  inventoryManagement: z.string().optional(),
  websiteOrSocial: z.string().optional(),
  additionalNotes: z.string().optional(),

  agreeToContact: z.boolean().refine((val) => val === true, {
    message: "You must agree to be contacted by Food Remit to proceed",
  }),
});

export type PartnerLeadFormValues = z.infer<typeof partnerLeadSchema>;
