export type ItemStatus = "ACTIVE" | "INACTIVE";

export interface ItemPlacementData {
  id?: string;
  countryId: string;
  departmentId: string;
  categoryId: string;
  price: number;
  currency?: string | null;
  currencySymbol?: string | null;
  country?: { id: string; name: string; countryCode?: string | null };
  department?: {
    id: string;
    departmentName: string;
    displayName?: string | null;
  };
  category?: { id: string; categoryName: string };
}

export interface ItemPricingData {
  basePrice: number;
  taxPercent: number;
  taxAmount: number;
  taxLabel?: string;
  netPriceIncludingTax: number;
  discountPercent: number;
  discountAmount: number;
  priceAfterDiscount: number;
  commissionPercent: number;
  commissionAmount: number;
  totalPriceIncludingCommission: number;
  grandTotal: number;
  /** Item line total (no processing fee) */
  itemTotal?: number;
  /** Shown for reference — charged once per order */
  processingFeeAmount: number;
  processingFeeScope: "per_order";
  countryId?: string | null;
  countryName?: string | null;
  currency: string;
  currencySymbol: string;
  adminShareEnabled: boolean;
  discountEnabled: boolean;
}

export interface ItemData {
  id: string;
  productName: string;
  description?: string | null;
  productInfo?: string | null;
  nutritionInfo?: string | null;
  upcCode?: string | null;
  baseQuantity?: number | null;
  unit?: string | null;
  discountPercentage?: number | null;

  productImage?: string | null;
  productImages?: string[];
  productInfoImage?: string | null;
  nutritionInfoImage?: string | null;

  productImageUrl?: string | null;
  productImageUrls?: string[];
  productInfoImageUrl?: string | null;
  nutritionInfoImageUrl?: string | null;

  status: ItemStatus;
  adminShare: boolean;
  discountAvailability: boolean;

  countryId: string;
  departmentId: string;
  categoryId: string;
  placements?: ItemPlacementData[];

  country?: { id: string; name: string };
  department?: { id: string; departmentName: string };
  category?: { id: string; categoryName: string };

  createdBy?: string | null;
  isGlobal?: boolean;
  scopeType?: "global" | "city";
  scopeLabel?: string | null;
  departmentDisplayName?: string | null;

  pricing?: ItemPricingData | null;
  pricingCountry?: {
    id: string;
    name: string;
    countryCode?: string | null;
  } | null;
  hasPriceForCountry?: boolean;
  productId?: string;
  barcodeValue?: string;
  barcodeImage?: string | null;
  qrCodeImage?: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface UseGetItemsArgs {
  search?: string;
  countryId?: string;
  departmentId?: string;
  categoryId?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface GetItemsResponse {
  message: string;
  stats: {
    total: number;
    active: number;
    inactive: number;
  };
  data: ItemData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateItemPayload {
  countryId: string;
  departmentId: string;
  categoryId: string;
  placements: Array<{
    countryId: string;
    departmentId: string;
    categoryId: string;
    price: number;
  }>;
  productName: string;
  description?: string;
  productInfo?: string;
  nutritionInfo?: string;
  upcCode?: string;
  baseQuantity?: number;
  unit?: string;
  discountPercentage?: number;
  status?: ItemStatus;
  productImageFile?: File | string | null;
  productInfoImageFile?: File | string | null;
  nutritionInfoImageFile?: File | string | null;
}

export type UpdateItemPayload = Partial<CreateItemPayload>;
