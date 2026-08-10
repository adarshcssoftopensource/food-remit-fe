import { z } from "zod/v3";

export const BUSINESS_TYPES = [
  "Independent Grocery Store",
  "Supermarket",
  "Restaurant",
  "Convenience Store",
  "Specialty / Ethnic Grocery Store",
  "Wholesale Distributor",
  "Retail Chain",
  "Franchise",
  "Food Manufacturer",
  "Other",
] as const;

export const NUMBER_OF_LOCATIONS_OPTIONS = [
  "1 Location",
  "2–5 Locations",
  "6–20 Locations",
  "21–100 Locations",
  "100+ Locations",
] as const;

export const WORK_PREFERENCES_OPTIONS = [
  "Sell products through the Food Remit marketplace",
  "Receive customer orders for pickup",
  "Receive customer orders for delivery",
  "Add multiple store locations",
  "Integrate our existing product catalog or POS system",
  "Learn more about becoming a Food Remit partner",
  "Other",
] as const;

export const INVENTORY_MANAGEMENT_OPTIONS = [
  "Manually",
  "POS System",
  "E-commerce Platform",
  "ERP / Inventory System",
  "Spreadsheet / CSV",
  "API / Custom System",
  "Not Sure",
] as const;

export const COUNTRY_OPTIONS = [
  "United States",
  "Canada",
  "United Kingdom",
  "Mexico",
  "Jamaica",
  "Dominican Republic",
  "Philippines",
  "India",
  "Ghana",
  "Nigeria",
  "Other",
] as const;

export const partnerLeadSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  businessType: z.string().min(1, "Please select a business type"),
  numberOfLocations: z.string().min(1, "Please select number of locations"),
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
  phoneNumber: z.string().min(5, "Please enter a valid phone number"),

  workPreferences: z.array(z.string()),
  inventoryManagement: z.string().optional(),
  websiteOrSocial: z.string().optional(),
  additionalNotes: z.string().optional(),

  agreeToContact: z.boolean().refine((val) => val === true, {
    message: "You must agree to be contacted by Food Remit to proceed",
  }),
});

export type PartnerLeadFormValues = z.infer<typeof partnerLeadSchema>;
