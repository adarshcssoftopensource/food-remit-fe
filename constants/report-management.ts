export type StoreReportRow = {
  id: string;
  storeName: string;
  country: string;
  state: string;
  city: string;
  address: string;
  totalOrder: number;
  phone: string;
  image?: string;
  manager: {
    name: string;
    email: string;
    phone: string;
    address: string;
    country: string;
    state: string;
    city: string;
    zipCode: string;
  };
  earnings: {
    totalSales: string;
    totalMarkup: string;
    totalProcessing: string;
    totalCommission: string;
    totalItemTax: string;
    refundedAmount: string;
  };
};

export type StoreTransactionRow = {
  id: string;
  transactionNo: string;
  senderName: string;
  senderPhone: string;
  senderCountry: string;
  senderState: string;
  senderCity: string;
  receiverName: string;
  receiverCountry: string;
  receiverState: string;
  receiverCity: string;
  totalSales: string;
  platformEarning: string;
  totalItemTax: string;
  totalProcessingFees: string;
  refundedAmount: string;
  date: string;
};

export type CustomerReportRow = {
  id: string;
  firstName: string;
  email: string;
  phoneNumber: string;
  ordersSent: number;
  ordersRequested: number;
  country: string;
  city: string;
};

export type OrderReportRow = {
  id: string;
  referenceNumber: string;
  senderName: string;
  receiverName: string;
  storeName: string;
  status: string;
  handedOverBy: string;
  foodType: string;
};

export type CouponReportRow = {
  id: string;
  coupons: string;
  couponCode: string;
  createdBy: string;
  createdOn: string;
  availableCount: number;
  usedCount: number;
  discount: string;
};

export const REPORT_COUNTRY_OPTIONS = [
  { label: "All", value: "All" },
  { label: "United States", value: "United States" },
  { label: "India", value: "India" },
] as const;

export const REPORT_CITY_OPTIONS = [
  { label: "All", value: "All" },
  { label: "Abboussie", value: "Abboussie" },
  { label: "Columbus", value: "Columbus" },
] as const;

export const REPORT_FOOD_TYPE_OPTIONS = [
  { label: "All Food Types", value: "All" },
  { label: "Grocery", value: "Grocery" },
  { label: "Restaurant", value: "Restaurant" },
] as const;

export type ReportSectionKey =
  "store-report" | "customer-report" | "orders-report" | "coupons-report";

export const REPORT_SECTION_META: Record<
  ReportSectionKey,
  { title: string; description: string; searchKey: string }
> = {
  "store-report": {
    title: "Store Reports",
    description: "Review store performance and order activity.",
    searchKey: "storeName",
  },
  "customer-report": {
    title: "Customer Reports",
    description: "Browse customer order activity reports.",
    searchKey: "firstName",
  },
  "orders-report": {
    title: "Order Reports",
    description: "Track order report records across stores.",
    searchKey: "referenceNumber",
  },
  "coupons-report": {
    title: "Coupons Reports",
    description: "Monitor coupon usage and availability.",
    searchKey: "couponCode",
  },
};

export const MOCK_STORE_REPORTS: StoreReportRow[] = [
  {
    id: "store-001",
    storeName: "24/7 Store.",
    country: "United States",
    state: "Chandigarh",
    city: "Abboussie",
    address: "beirut-lebad, abboussie, United States, 123556",
    totalOrder: 12,
    phone: "9312480319",
    manager: {
      name: "NICKY HILLS N",
      email: "nicky12@yopmail.com",
      phone: "931480319",
      address: "beirut-lebad",
      country: "United States",
      state: "Chandigarh",
      city: "Abboussie",
      zipCode: "123556",
    },
    earnings: {
      totalSales: "0 USD",
      totalMarkup: "0 USD",
      totalProcessing: "0 USD",
      totalCommission: "0 USD",
      totalItemTax: "0 USD",
      refundedAmount: "0 USD",
    },
  },
  {
    id: "store-002",
    storeName: "La Petite Épicerie",
    country: "United States",
    state: "Ohio",
    city: "Columbus",
    address: "2300 S Hamilton Road, Columbus, United States",
    totalOrder: 8,
    phone: "6145550199",
    manager: {
      name: "James Clark",
      email: "james.clark@yopmail.com",
      phone: "6145550100",
      address: "2300 S Hamilton Road",
      country: "United States",
      state: "Ohio",
      city: "Columbus",
      zipCode: "43232",
    },
    earnings: {
      totalSales: "0 USD",
      totalMarkup: "0 USD",
      totalProcessing: "0 USD",
      totalCommission: "0 USD",
      totalItemTax: "0 USD",
      refundedAmount: "0 USD",
    },
  },
];
