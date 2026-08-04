import { z } from "zod";

export const countryManagerSchema = z.object({
  image: z.array(z.instanceof(File)).optional(),
  firstName: z.string().trim().min(2, "First name must be at least 2 characters."),
  lastName: z.string().trim().min(2, "Last name must be at least 2 characters."),
  email: z.string().trim().email("Enter a valid email address."),
  phoneCode: z.string().min(1, "Select country code."),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^\d{7,15}$/, "Phone number must be 7 to 15 digits."),
  address1: z.string().trim().min(3, "Address 1 is required."),
  address2: z.string().trim().optional(),
  residentialCountry: z.string().min(1, "Select residential country."),
  state: z.string().min(1, "Select state."),
  city: z.string().min(1, "Select city."),
  zipcode: z.string().trim().min(3, "Zipcode is required."),
  assignedCountry: z.string().min(1, "Select assigned country."),
});

export type CountryManagerFormValues = z.infer<typeof countryManagerSchema>;
