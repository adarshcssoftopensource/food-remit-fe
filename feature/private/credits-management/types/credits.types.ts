export interface CreditsItem {
  id: string;
  itemId: string;
  itemName: string;
  unit: string;
  quantity: number;
  price: number;
  subtotal: number;
  inStock: boolean;
  productPicture?: string;
  barcode?: string;
}

export interface CreditsCustomer {
  id?: string;
  name: string;
  email: string;
  phoneNumber: string;
  avatar?: string | null;
  address?: string;
}

export interface CreditsStore {
  id?: string;
  name: string;
  country: string;
  city: string;
  address: string;
  fullAddress?: string;
  image?: string | null;
  storeTaxPercent?: string;
  commissionPercent?: string;
}

export interface CreditsData {
  id: string;
  orderId: string;
  referenceNumber: string;
  date: string;
  orderDate: string;
  customer: CreditsCustomer;
  receiver: CreditsCustomer;
  store: CreditsStore;
  unmarkedItemsCount: number;
  unmarkedItems: CreditsItem[];
  currency: string;
  refundValue: string;
  refundValueNumeric: number;
  totalPaid: string;
  totalPaidNumeric: number;
  actualCustomerPaid: string;
  status: "Pending" | "Completed";
  refundStatus: string;
  paymentMethod: string;
  cardLast4: string;
  stripeChargeId?: string | null;

  // Compatibility fields
  receiverName?: string;
  storeName?: string;
  country?: string;
}

export interface CreditsSummary {
  totalCredits: number;
  pendingCredits: number;
  completedCredits: number;
  totalPendingRefund: string;
  totalRefunded: string;
}

export interface CreditsFinancials {
  totalCustomerPaid: string;
  totalCustomerPaidVal: number;
  unmarkedItemsBaseTotal: string;
  markupPercent: string;
  refundedMarkup: string;
  taxPercent: string;
  refundedTax: string;
  totalRefundCustomer: string;
  totalRefundCustomerVal: number;
  actualRetainedAmount: string;
  isFeeRefundable?: boolean;
  recordedFee?: number | null;
  cancellationPolicy?: string;
}

export interface CreditTransaction {
  id?: string;
  currency: string;
  paymentMethod: string;
  cardLast4: string;
  cardBrand?: string;
  cardFunding?: string;
  expMonth?: string;
  expYear?: string;
  bankName?: string;
  stripeChargeId?: string | null;
  refundAmount: number;
  refundStatus: string;
}

export interface CreditDetailData {
  orderId: string;
  referenceNumber: string;
  orderDate: string;
  orderStatus: number;
  currency: string;
  customer: CreditsCustomer;
  receiver: CreditsCustomer;
  store: CreditsStore;
  financials: CreditsFinancials;
  transaction: CreditTransaction;
  status: "Pending" | "Completed";
  unmarkedItems: CreditsItem[];
  allItems: CreditsItem[];
}

export interface CreditsPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetCreditsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
  countryId?: string;
  cityId?: string;
  storeId?: string;
  fromDate?: string;
  toDate?: string;
}

export interface CreditsListResponse {
  message: string;
  status: boolean;
  data: CreditsData[];
  summary: CreditsSummary;
  pagination: CreditsPagination;
}

export interface CreditDetailResponse {
  message: string;
  status: boolean;
  data: CreditDetailData;
}

// ---------------------------------------------------------------------------
// Component Prop Types
// ---------------------------------------------------------------------------

export interface CreditConfirmPayProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  amount: string;
  customerName: string;
  referenceNumber?: string;
  storeName?: string;
  isPending: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
}

export interface CreditPartiesCardProps {
  customer: CreditsCustomer;
  store: CreditsStore;
  onImageClick?: (url: string) => void;
}

export interface CreditFinancialBreakdownProps {
  financials: CreditsFinancials;
}

export interface CreditPaymentCardProps {
  transaction: CreditTransaction;
  customerName: string;
  currency?: string;
}

export interface CreditUnmarkedItemsProps {
  items: CreditsItem[];
  currency: string;
  onImageClick: (url: string) => void;
}

export interface CreditColumnsOptions {
  onViewDetails: (orderId: string) => void;
  onPayRefund: (credit: CreditsData) => void;
  isSuperAdmin: boolean;
}

export type CardNetwork = "visa" | "mastercard" | "amex" | "rupay" | "discover";

export interface CardStyleConfig {
  name: string;
  gradient: string;
  glow: string;
  tier: string;
  logo: React.ReactNode;
  bankName: string;
  textColor: string;
  hologramColor: string;
}
