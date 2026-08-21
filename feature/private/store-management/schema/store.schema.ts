import { getSplitPhoneError } from "@/lib/phone";
import { z } from "zod/v3";

export const storeSchema = z
  .object({
    storeImage: z
      .any()
      .refine(
        (val) =>
          val !== null &&
          val !== undefined &&
          val !== "" &&
          (!Array.isArray(val) || val.length > 0),
        { message: "Store image is required" },
      ),
    storeName: z.string().min(2, "Store name must be at least 2 characters"),
    storePhoneCode: z.string().min(1, "Phone code is required"),
    storePhoneNumber: z.string().min(1, "Store phone number is required"),
    storeAddress: z.string().min(3, "Store address is required"),
    address2: z.string().optional(),
    storeCountry: z.string().min(1, "Country is required"),
    storeCity: z.string().min(1, "City is required"),
    storeTax: z.coerce.number().min(0).max(100).optional(),
    foodRemitCommission: z.coerce.number().min(0).max(100).optional(),

    managerImage: z.any().optional(),
    managerFirstName: z.string().min(1, "First name is required"),
    managerLastName: z.string().min(1, "Last name is required"),
    managerEmail: z.string().min(1, "Email is required").email("Invalid email address"),
    managerPhoneCode: z.string().min(1, "Phone code is required"),
    managerPhoneNumber: z.string().min(1, "Manager phone number is required"),
    managerAddress: z.string().min(3, "Manager address is required"),
    managerCountry: z.string().min(1, "Country is required"),
    managerState: z.string().min(1, "State is required"),
    managerCity: z.string().min(1, "City is required"),
    managerZipCode: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const storePhoneError = getSplitPhoneError(data.storePhoneCode, data.storePhoneNumber);
    if (storePhoneError) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["storePhoneNumber"],
        message: storePhoneError,
      });
    }

    const managerPhoneError = getSplitPhoneError(data.managerPhoneCode, data.managerPhoneNumber);
    if (managerPhoneError) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["managerPhoneNumber"],
        message: managerPhoneError,
      });
    }
  });

export type StoreFormValues = z.infer<typeof storeSchema>;
