export type CouponStatus = "All" | "Active" | "Inactive";

export type CouponRow = {
  couponName: string;
  couponCode: string;
  discount: number;
  createdBy: string;
  createdName: string;
  createdOn: string;
  createdAt: Date;
  availableCount: number;
  redeemedCoupons: number;
  status: "Active" | "Inactive";
  minOrderValue: number;
  maxUsers: number;
  description: string;
};

export const INITIAL_COUPONS: CouponRow[] = [
  {
    couponName: "Spring Feast",
    couponCode: "SPRING50",
    discount: 50,
    createdBy: "Rohit",
    createdName: "Admin Team",
    createdOn: "04/08/2026",
    createdAt: new Date("2026-08-04"),
    availableCount: 150,
    redeemedCoupons: 88,
    status: "Active",
    minOrderValue: 499,
    maxUsers: 500,
    description: "Half-price coupon for orders over ₹499.",
  },
];
