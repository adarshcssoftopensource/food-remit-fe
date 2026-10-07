export type BasketStatus = "DRAFT" | "ACTIVE" | "INACTIVE";

export type BasketType =
  "BASIC" | "FAMILY" | "LARGE_FAMILY" | "MONTHLY_ESSENTIALS" | "SEASONAL" | "CUSTOM";

export interface BasketItemInfo {
  id: string;
  productName: string;
  productImageUrl: string | null;
  unit: string | null;
  netWeight: number | null;
  weightUnit: string | null;
  itemsPerPack: number | null;
  stockQuantity: number;
  status: "ACTIVE" | "INACTIVE";
  category: { id: string; categoryName: string } | null;
}

export interface BasketPricingLine {
  itemId: string;
  quantity: number;
  isAvailable: boolean;
  unavailableReason: string | null;
  /** Vendor's regular unit price (before item discount) */
  vendorUnitPrice: number;
  discountPercent: number;
  discountUnitAmount: number;
  discountedUnitPrice: number;
  /** 0 when Food Remit markup is disabled for the item */
  markupPercent: number;
  markupUnitAmount: number;
  customerOriginalUnitPrice: number;
  customerUnitPrice: number;
  taxUnitAmount: number;
  commissionUnitAmount: number;
  payoutUnitAmount: number;
  vendorLineTotal: number;
  discountLineTotal: number;
  discountedLineTotal: number;
  markupLineTotal: number;
  customerOriginalLineTotal: number;
  customerLineTotal: number;
  taxLineTotal: number;
  commissionLineTotal: number;
  payoutLineTotal: number;
}

export interface BasketPricingTotals {
  currency: string;
  currencySymbol: string;
  markupPercent: number;
  taxPercent: number;
  commissionPercent: number;
  itemCount: number;
  totalUnits: number;
  vendorSubtotal: number;
  discountAmount: number;
  discountedItemCount: number;
  discountedSubtotal: number;
  markupAmount: number;
  customerOriginalPrice: number;
  customerPrice: number;
  customerSavings: number;
  estimatedTax: number;
  processingFee: number;
  estimatedCustomerTotal: number;
  commissionAmount: number;
  estimatedPayout: number;
  hasUnavailableItems: boolean;
}

export interface BasketPricingPreview extends BasketPricingTotals {
  lines: (BasketPricingLine & { item: BasketItemInfo | null })[];
}

export interface Basket {
  id: string;
  storeId: string | null;
  store: { id: string; storeName: string } | null;
  countryId: string;
  name: string;
  shortDescription: string | null;
  description: string | null;
  basketType: BasketType;
  householdSize: string | null;
  image: string | null;
  isDefaultImage: boolean;
  defaultImagePath: string;
  status: BasketStatus;
  publishedAt: string | null;
  vendorPrice: number;
  price: number;
  /** Basket price before item discounts */
  originalPrice: number;
  discountAmount: number;
  discountedItemCount: number;
  currency: string;
  currencySymbol: string;
  itemCount: number;
  totalUnits: number;
  hasUnavailableItems: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BasketLineItem {
  id: string;
  itemId: string;
  quantity: number;
  sortOrder: number;
  item: BasketItemInfo | null;
  pricing: BasketPricingLine | null;
}

export interface BasketDetail extends Basket {
  pricing: BasketPricingTotals;
  items: BasketLineItem[];
}

export interface BasketStats {
  total: number;
  active: number;
  draft: number;
  inactive: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetBasketsResponse {
  message: string;
  store: { id: string; storeName: string };
  stats: BasketStats;
  data: Basket[];
  pagination: Pagination;
}

export interface GetBasketResponse {
  message: string;
  data: BasketDetail;
}

export interface BasketStore {
  id: string;
  storeName: string;
  storeImage: string | null;
  city: string | null;
  status: string | null;
}

export interface CatalogueItem extends BasketItemInfo {
  vendorPrice: number;
  discountPercent: number;
  discountedVendorPrice: number;
  customerOriginalPrice: number;
  customerPrice: number;
  isAvailable: boolean;
}

export interface GetCatalogueResponse {
  message: string;
  currency: string;
  currencySymbol: string;
  categories: { id: string; categoryName: string }[];
  data: CatalogueItem[];
  pagination: Pagination;
}

export interface BasketItemInput {
  itemId: string;
  quantity: number;
}

export interface UpsertBasketPayload {
  storeId?: string;
  name: string;
  shortDescription?: string;
  description?: string;
  basketType: BasketType;
  householdSize?: string;
  image?: string | null;
  isActive?: boolean;
  items: BasketItemInput[];
  publish?: boolean;
}

export interface BasketListParams {
  storeId?: string;
  page?: number;
  limit?: number;
  search?: string;
  status?: BasketStatus;
  basketType?: BasketType;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
