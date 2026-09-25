import { getFullPhoneError } from "@/lib/phone";
import { z } from "zod/v3";

const NAME_REGEX = /^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF\s'-]+$/;
const LOCATION_TEXT_REGEX = /^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF\s.'-]+$/;

function parseTimeToMinutes(timeStr: string, isCloseTime: boolean = false): number {
  if (!timeStr || timeStr === "00:00") return 0;
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3].toUpperCase();
  if (ampm === "PM" && hours < 12) hours += 12;
  if (ampm === "AM" && hours === 12) hours = 0;

  const totalMins = hours * 60 + minutes;
  if (isCloseTime && totalMins === 0) {
    return 1440;
  }
  return totalMins;
}

export const partnerLeadSchema = z
  .object({
    businessName: z
      .string()
      .trim()
      .min(2, "Business name must be at least 2 characters")
      .max(100, "Business name cannot exceed 100 characters"),
    businessType: z.string().min(1, "Please select a business type"),
    otherBusinessType: z.string().optional(),
    storeLogo: z.any().optional(),
    profileImage: z.any().optional(),
    locationsCount: z.string().optional(),
    locations: z
      .array(
        z
          .object({
            address: z.string().min(1, "Address is required"),
            daysOpen: z.array(z.string()).min(1, "At least one day must be selected"),
            hoursOfOperation: z.string().optional().or(z.literal("")),
            phone: z.string().optional(),
            storePhoneNumber: z.string().optional(),
            dailySchedule: z
              .array(
                z.object({
                  day: z.string(),
                  isOpen: z.boolean(),
                  openTime: z.string(),
                  closeTime: z.string(),
                }),
              )
              .optional(),
          })
          .superRefine((loc, ctx) => {
            if (loc.dailySchedule && loc.dailySchedule.length > 0) {
              const openDays = loc.dailySchedule.filter((d) => d.isOpen);
              if (openDays.length === 0) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  path: ["daysOpen"],
                  message: "At least one day must be marked as open",
                });
                return;
              }
              const invalidDays = openDays.filter(
                (d) =>
                  d.openTime !== "24H" && // 24H days are always valid
                  (!d.openTime?.trim() ||
                    !d.closeTime?.trim() ||
                    d.openTime === "00:00" ||
                    d.closeTime === "00:00"),
              );
              if (invalidDays.length > 0) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  path: ["hoursOfOperation"],
                  message:
                    invalidDays.length === 1
                      ? `Please select opening and closing times for ${invalidDays[0].day}`
                      : `Please select opening and closing times for all open days`,
                });
                return;
              }

              const sequencedDays = openDays.filter(
                (d) =>
                  d.openTime !== "24H" && // 24H days have no sequence issue
                  parseTimeToMinutes(d.closeTime, true) < parseTimeToMinutes(d.openTime, false),
              );
              if (sequencedDays.length > 0) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  path: ["hoursOfOperation"],
                  message:
                    sequencedDays.length === 1
                      ? `Closing time must be after opening time on ${sequencedDays[0].day}`
                      : `Closing time must be after opening time on all open days`,
                });
                return;
              }
            } else if (!loc.hoursOfOperation?.trim()) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["hoursOfOperation"],
                message: "Please select opening and closing times",
              });
            }
          }),
      )
      .optional(),
    hasBusinessAccount: z.boolean().optional(),
    country: z.string().min(1, "Please select a country"),
    businessCity: z
      .string()
      .trim()
      .min(1, "Business City is required")
      .max(60, "City cannot exceed 60 characters")
      .refine((val) => !val || LOCATION_TEXT_REGEX.test(val), {
        message: "City can only contain letters, spaces, hyphens, and periods",
      }),
    stateProvinceRegion: z
      .string()
      .trim()
      .max(60, "State / Province cannot exceed 60 characters")
      .refine((val) => !val || LOCATION_TEXT_REGEX.test(val), {
        message: "State / Province can only contain letters, spaces, hyphens, and periods",
      })
      .optional()
      .or(z.literal("")),
    zipCode: z
      .string()
      .trim()
      .max(20, "Zip code cannot exceed 20 characters")
      .optional()
      .or(z.literal("")),
    storePhoneNumber: z
      .string()
      .min(1, "Store phone number is required")
      .superRefine((value, ctx) => {
        const error = getFullPhoneError(value);
        if (error) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: error });
        }
      }),

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

    languages: z.array(z.string()).min(1, "At least one language is required"),

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
    currency: z.string().optional(),

    agreeToContact: z.boolean().refine((val) => val === true, {
      message: "You must agree to be contacted by Food Remit to proceed",
    }),

    veriffSessionId: z.string().optional(),
    kycStatus: z.string().optional(),
    plaidItemId: z.string().optional(),
    plaidAccountId: z.string().optional(),
    bankStatus: z.string().optional(),
    bankInstitutionName: z.string().optional(),
    bankAccountName: z.string().optional(),
    bankAccountMask: z.string().optional(),

    additionalDocuments: z
      .array(
        z.object({
          rawFile: z.any().optional(),
          file: z.string().optional(),
          url: z.string().optional(),
          name: z.string().min(1, "File name is required"),
          size: z.number().max(5 * 1024 * 1024, "File size cannot exceed 5MB"),
          mimeType: z.string(),
        }),
      )
      .min(1, "Please upload at least 1 supporting document")
      .max(10, "Maximum 10 supporting documents allowed"),
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
