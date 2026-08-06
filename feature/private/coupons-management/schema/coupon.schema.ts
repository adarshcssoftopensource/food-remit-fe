import { z } from "zod";

export const couponSchema = z.object({
  couponName: z.string().min(3, "Coupon name is required"),
  discount: z
    .number()
    .min(1, "Discount must be at least 1%")
    .max(100, "Discount can be at most 100%"),
  description: z.string().min(10, "Description is required"),
  minOrderValue: z.number().min(0, "Minimum order value must be 0 or more"),
  maxUsers: z.number().min(1, "Maximum number of users must be at least 1"),
});

export type CouponFormValues = z.infer<typeof couponSchema>;
