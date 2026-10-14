import { z } from "zod";

const preprocessNumber = (val: unknown, fallback?: number) => {
  if (val === "" || val === null || val === undefined) return fallback;
  const num = Number(val);
  return Number.isNaN(num) ? undefined : num;
};

export const couponSchema = z
  .object({
    couponName: z.string().min(3, "Coupon name is required (min 3 chars)"),
    couponCode: z.string().optional(),
    discount: z.preprocess(
      (val) => preprocessNumber(val),
      z
        .number({ message: "Discount rate is required" })
        .min(1, "Discount must be at least 1%")
        .max(100, "Discount cannot exceed 100%"),
    ),
    description: z.string().optional(),
    minOrderValue: z.preprocess(
      (val) => preprocessNumber(val),
      z
        .number({ message: "Minimum order amount is required" })
        .min(1, "Minimum order amount must be at least $1")
        .max(100000, "Minimum order amount cannot exceed $100,000"),
    ),
    maxUsers: z.preprocess(
      (val) => preprocessNumber(val),
      z
        .number({ message: "Maximum number of users must be at least 1" })
        .min(1, "Maximum number of users must be at least 1")
        .max(1000000, "Maximum number of users cannot exceed 1,000,000"),
    ),
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
