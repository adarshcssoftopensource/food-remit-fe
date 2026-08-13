import { CheckCircle2, MapPin, Store, TrendingUp } from "lucide-react";

export type StoreStatus = "Active" | "Inactive";

export type StoreData = {
  id: string;
  storeImage: string;
  storeName: string;
  storeAddress: string;
  address2?: string;
  storeCountry: string;
  storeCity: string;
  storePhoneCode: string;
  storePhoneNumber: string;
  storeTax: number;
  foodRemitCommission: number;
  status: StoreStatus;
  createdAt: string;
  managerImage: string;
  managerFirstName: string;
  managerLastName: string;
  managerEmail: string;
  managerPhoneCode: string;
  managerPhoneNumber: string;
  managerAddress: string;
  managerCountry: string;
  managerState: string;
  managerCity: string;
  managerZipCode: string;
};

export const STORE_STAT_CONFIG = [
  {
    key: "total" as const,
    label: "Total Stores",
    Icon: Store,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    key: "active" as const,
    label: "Active Stores",
    Icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    key: "inactive" as const,
    label: "Inactive Stores",
    Icon: TrendingUp,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    key: "cities" as const,
    label: "Cities Covered",
    Icon: MapPin,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
] as const;

export const STORE_STATUS_STYLES: Record<StoreStatus, string> = {
  Active: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Inactive: "bg-red-100 text-red-700 border-red-200",
};

export const STORE_STATUS_OPTIONS = [
  { label: "All Statuses", value: "All" },
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
];
