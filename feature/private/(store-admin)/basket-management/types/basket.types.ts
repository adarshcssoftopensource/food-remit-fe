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

export type BasketPricingMode = "STANDARD" | "DISCOUNT_PERCENT" | "MANUAL_PRICE";

export type BasketAvailabilityMode = "STORE_HOURS" | "CUSTOM";

export interface BasketPricingTotals {
  currency: string;
  currencySymbol: string;
  /** Platform markup rate */
  markupPercent: number;
  /** Weighted markup rate of the basket's items */
  effectiveMarkupPercent: number;
  taxPercent: number;
  commissionPercent: number;
  itemCount: number;
  totalUnits: number;
  categoryNames: string[];
  itemsRegularTotal: number;
  itemDiscountAmount: number;
  discountedItemCount: number;
  /** Basket subtotal (vendor items total, after item discounts) */
  itemsVendorTotal: number;
  customerItemsTotal: number;
  pricingMode: BasketPricingMode;
  vendorDiscountPercent: number;
  vendorDiscountAmount: number;
  vendorBasketPrice: number;
  markupAmount: number;
  customerPrice: number;
  customerOriginalPrice: number;
  customerSavings: number;
  savingsPercent: number;
  estimatedTax: number;
  processingFee: number;
  estimatedCustomerTotal: number;
  commissionAmount: number;
  estimatedPayout: number;
  hasUnavailableItems: boolean;
  pricingError: string | null;
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
  libraryImage: string | null;
  isDefaultImage: boolean;
  defaultImagePath: string;
  status: BasketStatus;
  publishedAt: string | null;
  scheduledInactiveAt: string | null;
  pricingMode: BasketPricingMode;
  vendorDiscountPercent: number | null;
  manualVendorPrice: number | null;
  availabilityMode: BasketAvailabilityMode;
  /** YYYY-MM-DD */
  availableFrom: string | null;
  availableUntil: string | null;
  availableDays: string[];
  /** Vendor basket price (after vendor discount / manual price) */
  vendorPrice: number;
  /** Final customer basket price */
  price: number;
  /** Customer price before any discount */
  originalPrice: number;
  savings: number;
  savingsPercent: number;
  vendorDiscountAmount: number;
  itemDiscountAmount: number;
  discountedItemCount: number;
  categoryNames: string[];
  isPublishable: boolean;
  missingRequirements: string[];
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

export interface BasketPricingOptions {
  pricingMode: BasketPricingMode;
  vendorDiscountPercent?: number | null;
  manualVendorPrice?: number | null;
}

export interface UpsertBasketPayload extends BasketPricingOptions {
  storeId?: string;
  name?: string;
  shortDescription?: string;
  description?: string;
  basketType: BasketType;
  householdSize?: string;
  image?: string | null;
  libraryImage?: string | null;
  availabilityMode: BasketAvailabilityMode;
  availableFrom?: string | null;
  availableUntil?: string | null;
  availableDays?: string[];
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
