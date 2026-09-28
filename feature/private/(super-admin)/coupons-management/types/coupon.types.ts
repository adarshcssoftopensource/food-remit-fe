export interface CouponItem {
  id: string;
  couponCode: string;
  couponName: string;
  discount: number;
  discountType: string;
  description?: string | null;
  minOrderValue: number;
  maxUsers?: number | null;
  availableCount: number;
  redeemedCoupons: number;
  status: "Active" | "Inactive" | "Expired" | "Scheduled" | string;
  rawStatus: number;
  isGlobal: boolean;
  storeId?: string | null;
  storeName: string;
  store?: {
    id: string;
    storeName: string;
    storeImage?: string | null;
    city?: string | null;
    country?: string | null;
  } | null;
  startDate: string;
  endDate: string;
  createdBy: string;
  createdName: string;
  createdAt: string;
}

export interface CouponStats {
  totalCoupons: number;
  activeCount: number;
  inactiveCount: number;
  redeemedCoupons: number;
}

export interface CouponsApiResponse {
  status: boolean;
  message?: string;
  data: CouponItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: CouponStats;
}

export interface QueryCouponsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
  storeId?: string;
  fromDate?: string;
  toDate?: string;
}
