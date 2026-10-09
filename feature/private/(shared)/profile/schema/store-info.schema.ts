import * as z from "zod";

export const storeInfoSchema = z
  .object({
    storeImage: z.any().optional(),
    storeName: z.string().min(1, "Store name is required"),
    storePhoneCode: z.string().min(1, "Country code is required"),
    storePhoneNumber: z.string().min(1, "Phone number is required"),
    storeAddress: z.string().optional(),
    address2: z.string().optional(),
    storeCountry: z.string().optional(),
    storeState: z.string().optional(),
    storeCity: z.string().optional(),
    storeZipCode: z.string().optional(),
    sameDayDelivery: z.boolean().optional(),
    orderProcessingTime: z.string().optional(),
    perishableProducts: z.boolean().optional(),
    refrigeratedProducts: z.boolean().optional(),
    frozenProducts: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.sameDayDelivery && !data.orderProcessingTime?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["orderProcessingTime"],
        message: "Please select an estimated processing time.",
      });
    }
  });

export type StoreInfoValues = z.infer<typeof storeInfoSchema>;
