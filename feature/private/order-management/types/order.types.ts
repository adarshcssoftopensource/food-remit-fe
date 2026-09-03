export interface OrderDataItem {
  itemId?: string;
  itemName?: string;
  productBarcode?: string;
  upcCode?: string;
  productPicture?: string;
  price?: string | number;
  quantity?: number;
  unit?: string;
  taxStatus?: string;
  discountedItemPrice?: string | number;
  type?: number;
  inStock?: boolean;
}

export interface OrderData {
  id: string;
  refrenceNumber?: string;
  userId?: string;
  recieverId?: string;
  storeId?: string;
  orderType?: number;
  orderStatus: number;
  addedOn?: string;
  addedOnTimestamp?: string;
  createdAt: string;
  updatedAt: string;
  items?: OrderDataItem[];
  transactions?: Record<string, unknown>[];
  userName?: string;
  recieverName?: string;
  storeName?: string;
  price?: string;
  totalTax?: string;
  processingFee?: string;
  totalItemTax?: string;
  qrCode?: string;
  time?: string;
  modeOfPayment?: string;
  foodType?: string;
  recurring?: string;
  senderPhoneNumber?: string;
  senderAddress?: string;
  receiverPhoneNumber?: string;
  receiverAddress?: string;
  storeAddress?: string;
  customerPayment?: {
    vendorBaseSubtotal?: string;
    itemMarkupPercent?: string;
    itemMarkupAmount?: string;
    merchandiseSubtotal: string;
    storeTaxPercent: string;
    storeTax: string;
    processingFee: string;
    totalCustomerPaid: string;
    paymentMethod: string;
    paymentStatus: string;
    refundAmount?: string;
    actualRetainedAmount?: string;
  };
  foodRemitEarnings?: {
    markupPercent: string;
    markupAmount: string;
    commissionPercent: string;
    commissionAmount: string;
    processingFee: string;
    totalFoodRemitRevenue: string;
    cancellationStatus?: string;
    refundDeduction?: string;
    actualRevenue?: string;
  };
  vendorSettlement?: {
    vendorBaseAmount: string;
    commissionPercent: string;
    commissionAmount: string;
    govtTax?: string;
    creditCardFee?: string;
    vendorProceeds: string;
    totalVendorSettlement?: string;
    settlementStatus?: string;
    refundDeduction?: string;
    actualVendorEarnings?: string;
    inStockItemsCount?: number;
    totalItemsCount?: number;
  };
  customerSignature?: string;
  identityProf?: string;
}
