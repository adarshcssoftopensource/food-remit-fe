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

  // Compatibility fields with legacy columns
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
  transaction: {
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
  };
  status: "Pending" | "Completed";
  unmarkedItems: CreditsItem[];
  allItems: CreditsItem[];
}
