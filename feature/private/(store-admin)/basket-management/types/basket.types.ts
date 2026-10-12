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
  /** Variant (item option) of this line; null for single-option items */
  optionName: string | null;
  /** Number of variants the product has; 0 when it has a single option */
  variantCount: number;
  /** Catalogue discount the item offers (0 when it has none) */
  itemDiscountPercent: number;
}

export interface BasketPricingLine {
  itemId: string;
  itemOptionId: string | null;
  optionName: string | null;
  /** `${itemId}:${itemOptionId}` — identifies a line, since one product can appear once per variant */
  lineKey: string;
  quantity: number;
  isAvailable: boolean;
  unavailableReason: string | null;
  /** Vendor's regular unit price */
  vendorUnitPrice: number;
  /** Catalogue discount the item offers, whether or not this basket applies it */
  itemDiscountPercent: number;
  applyItemDiscount: boolean;
  /** Item discount applied in this basket (0 unless opted in) */
  discountPercent: number;
  discountUnitAmount: number;
  discountedUnitPrice: number;
  /** Regular price × quantity */
  vendorLineTotal: number;
  discountLineTotal: number;
  /** Line total that counts towards the basket subtotal */
  discountedLineTotal: number;
}

export type BasketPricingMode = "STANDARD" | "DISCOUNT_PERCENT" | "MANUAL_PRICE";

export type BasketAvailabilityMode = "STORE_HOURS" | "CUSTOM";

export interface BasketPricingTotals {
  currency: string;
  currencySymbol: string;
  /** Food Remit markup rate, applied once to the vendor basket price */
  markupPercent: number;
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
  itemOptionId: string | null;
  optionName: string | null;
  quantity: number;
  applyItemDiscount: boolean;
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

export interface CataloguePrices {
  vendorPrice: number;
  discountPercent: number;
  /** Vendor price if the item discount is applied */
  discountedVendorPrice: number;
  isAvailable: boolean;
}

/** A sellable size / pack of a product, each with its own price */
export interface CatalogueVariant extends CataloguePrices {
  id: string;
  optionName: string;
  netWeight: number | null;
  weightUnit: string | null;
  quantityPerPack: number | null;
  stockQuantity: number;
}

export interface CatalogueItem extends BasketItemInfo, CataloguePrices {
  /** Empty when the product has a single option */
  variants: CatalogueVariant[];
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
  itemOptionId?: string | null;
  optionName?: string | null;
  quantity: number;
  applyItemDiscount?: boolean;
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
