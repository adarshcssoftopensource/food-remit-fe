import type { ItemStats, OrderItem } from "./order-items-table";
import type {
  CustomerPaymentData,
  FoodRemitEarningsData,
  VendorSettlementData,
} from "./order-financial-breakdown";

export interface FinancialDetails {
  markup: string;
  markupVal: number;
  processingFee: string;
  processingFeeVal: number;
  commissionEarnings: string;
  commissionEarningsVal: number;
  refundedAmount: string;
  refundedAmountVal: number;
  itemTax: string;
  itemTaxVal: number;
  totalAmount: string;
  totalAmountVal: number;
}

export interface OrderDetailResponse {
  order: {
    id: string;
    refrenceNumber: string;
    orderDate: string;
    currency: string;
    transactionAmount: number;
    formattedPrice: string;
    paymentMode: string;
    foodType: string;
    orderType: number;
    orderStatus: number;
    statusLabel: string;
    handedOverBy?: string;
    recurringOrderType: number;
    comment: string;
    customerSignature: string | null;
    markup?: string;
    markupVal?: number;
    processingFee?: string;
    processingFeeVal?: number;
    commissionEarnings?: string;
    commissionEarningsVal?: number;
    refundedAmount?: string;
    refundedAmountVal?: number;
    itemTax?: string;
    itemTaxVal?: number;
  };
  sender: {
    firstName: string;
    lastName: string;
    fullName: string;
    phoneNumber: string;
    countryCode: string;
    fullPhone: string;
    address?: string;
    city: string;
    state?: string;
    country: string;
    zipCode?: string;
    fullAddress: string;
    profileImage?: string | null;
  };
  receiver: {
    firstName: string;
    lastName: string;
    fullName: string;
    phoneNumber: string;
    countryCode: string;
    fullPhone: string;
    address?: string;
    city: string;
    state?: string;
    country: string;
    zipCode?: string;
    fullAddress: string;
    customerSignature: string | null;
    profileImage?: string | null;
  };
  store: {
    id: string;
    storeName: string;
    storeAddress: string;
  };
  financials?: FinancialDetails;
  customerPayment?: CustomerPaymentData;
  foodRemitEarnings?: FoodRemitEarningsData;
  vendorSettlement?: VendorSettlementData;
  orderItems: OrderItem[];
  itemStats?: ItemStats;
}
