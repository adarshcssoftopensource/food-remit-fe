import { z } from "zod";

export const couponSchema = z
  .object({
    couponName: z.string().min(3, "Coupon name is required (min 3 chars)"),
    couponCode: z.string().optional(),
    discount: z
      .number()
      .min(1, "Discount must be at least 1%")
      .max(100, "Discount can be at most 100%"),
    description: z.string().optional(),
    minOrderValue: z.number().min(0, "Minimum order value must be 0 or more"),
    maxUsers: z.number().min(1, "Maximum number of users must be at least 1"),
    scope: z.enum(["global", "store"]),
    storeId: z.string().optional(),
    startDate: z.string().min(1, "Start date is required"),
    startTime: z.string().min(1, "Start time is required"),
    endDate: z.string().min(1, "End date is required"),
    endTime: z.string().min(1, "End time is required"),
  })
  .refine(
    (data) => {
      if (data.scope === "store" && !data.storeId) {
        return false;
      }
      return true;
    },
    {
      message: "Please select a store for store-specific coupon",
      path: ["storeId"],
    },
  )
  .refine(
    (data) => {
      try {
        const start = new Date(`${data.startDate}T${data.startTime}:00`);
        const end = new Date(`${data.endDate}T${data.endTime}:00`);
        return end > start;
      } catch {
        return false;
      }
    },
    {
      message: "End date and time must be after start date and time",
      path: ["endDate"],
    },
  );

export type CouponFormValues = z.infer<typeof couponSchema>;
