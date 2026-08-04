import { CheckCircle2, MapPin, Store, TrendingUp } from "lucide-react";

export type StoreStatus = "Active" | "Inactive";

export type StoreData = {
  id: string;
  storeImage: string;
  storeName: string;
  storeAddress: string;
  address2?: string;
  storeCountry: string;
  storeState: string;
  storeCity: string;
  storeZipCode: string;
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

export const MOCK_STORES_DATA: StoreData[] = [
  {
    id: "STR001",
    storeImage: "",
    storeName: "La Moutard",
    storeAddress: "1212 Sinclair Rd",
    address2: "",
    storeCountry: "United States",
    storeState: "Ohio",
    storeCity: "Canal Winchester",
    storeZipCode: "43229",
    storePhoneCode: "+1",
    storePhoneNumber: "6146336777",
    storeTax: 0.0,
    foodRemitCommission: 7.5,
    status: "Active",
    createdAt: "2026-06-10 09:00:00",
    managerImage: "",
    managerFirstName: "John",
    managerLastName: "Sylvester",
    managerEmail: "Eliseendenga@gmail.com",
    managerPhoneCode: "+1",
    managerPhoneNumber: "6146336777",
    managerAddress: "1212 Sinclair Rd",
    managerCountry: "United States",
    managerState: "Ohio",
    managerCity: "Carrollton",
    managerZipCode: "43332",
  },
  {
    id: "STR002",
    storeImage: "",
    storeName: "La Petite Épicerie",
    storeAddress: "2300 S Hamilton Road",
    address2: "",
    storeCountry: "United States",
    storeState: "Ohio",
    storeCity: "Columbus",
    storeZipCode: "43232",
    storePhoneCode: "+1",
    storePhoneNumber: "6142893456",
    storeTax: 0.0,
    foodRemitCommission: 7.0,
    status: "Active",
    createdAt: "2026-06-15 10:30:00",
    managerImage: "",
    managerFirstName: "Marie",
    managerLastName: "Dupont",
    managerEmail: "marie.dupont@lapetite.com",
    managerPhoneCode: "+1",
    managerPhoneNumber: "6142893456",
    managerAddress: "2300 S Hamilton Road",
    managerCountry: "United States",
    managerState: "Ohio",
    managerCity: "Columbus",
    managerZipCode: "43232",
  },
  {
    id: "STR003",
    storeImage: "",
    storeName: "Kalsang",
    storeAddress: "47 W 13th St, New York, NY 10011, USA",
    address2: "Suite 5",
    storeCountry: "United States",
    storeState: "Acton",
    storeCity: "Acton",
    storeZipCode: "10011",
    storePhoneCode: "+1",
    storePhoneNumber: "2125559876",
    storeTax: 6.0,
    foodRemitCommission: 10.0,
    status: "Active",
    createdAt: "2026-07-01 14:22:00",
    managerImage: "",
    managerFirstName: "Tenzing",
    managerLastName: "Norbu",
    managerEmail: "tenzing@kalsang.com",
    managerPhoneCode: "+1",
    managerPhoneNumber: "2125559876",
    managerAddress: "47 W 13th St",
    managerCountry: "United States",
    managerState: "New York",
    managerCity: "New York",
    managerZipCode: "10011",
  },
  {
    id: "STR004",
    storeImage: "",
    storeName: "Gressary Store",
    storeAddress: "usa",
    address2: "",
    storeCountry: "United States",
    storeState: "punjab",
    storeCity: "Alabaster",
    storeZipCode: "35007",
    storePhoneCode: "+1",
    storePhoneNumber: "2056781234",
    storeTax: 10.0,
    foodRemitCommission: 7.5,
    status: "Active",
    createdAt: "2026-07-10 08:45:00",
    managerImage: "",
    managerFirstName: "Rajan",
    managerLastName: "Sharma",
    managerEmail: "rajan@gressary.com",
    managerPhoneCode: "+1",
    managerPhoneNumber: "2056781234",
    managerAddress: "usa",
    managerCountry: "United States",
    managerState: "Alabama",
    managerCity: "Alabaster",
    managerZipCode: "35007",
  },
  {
    id: "STR005",
    storeImage: "",
    storeName: "Imported Items Store",
    storeAddress: "E300, Phase 8A, Industrial Area Sector 75",
    address2: "",
    storeCountry: "United States",
    storeState: "Texas",
    storeCity: "Airmont",
    storeZipCode: "78201",
    storePhoneCode: "+1",
    storePhoneNumber: "2107654321",
    storeTax: 8.0,
    foodRemitCommission: 0.0,
    status: "Inactive",
    createdAt: "2026-07-18 11:00:00",
    managerImage: "",
    managerFirstName: "Carlos",
    managerLastName: "Rivera",
    managerEmail: "carlos@importeditems.com",
    managerPhoneCode: "+1",
    managerPhoneNumber: "2107654321",
    managerAddress: "E300, Phase 8A, Industrial Area Sector 75",
    managerCountry: "United States",
    managerState: "Texas",
    managerCity: "San Antonio",
    managerZipCode: "78201",
  },
  {
    id: "STR006",
    storeImage: "",
    storeName: "Fresh Harvest Market",
    storeAddress: "550 Blossom Hill Rd",
    address2: "Unit A",
    storeCountry: "United States",
    storeState: "California",
    storeCity: "San Jose",
    storeZipCode: "95123",
    storePhoneCode: "+1",
    storePhoneNumber: "4081234567",
    storeTax: 5.5,
    foodRemitCommission: 8.0,
    status: "Active",
    createdAt: "2026-07-22 13:15:00",
    managerImage: "",
    managerFirstName: "Emily",
    managerLastName: "Chen",
    managerEmail: "emily@freshharvest.com",
    managerPhoneCode: "+1",
    managerPhoneNumber: "4081234567",
    managerAddress: "550 Blossom Hill Rd",
    managerCountry: "United States",
    managerState: "California",
    managerCity: "San Jose",
    managerZipCode: "95123",
  },
];

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

export const STORE_COUNTRY_OPTIONS = [
  { label: "All Countries", value: "All Countries" },
  { label: "United States", value: "United States" },
  { label: "Canada", value: "Canada" },
  { label: "United Kingdom", value: "United Kingdom" },
];

export const STORE_CITY_OPTIONS = [
  { label: "All Cities", value: "All Cities" },
  { label: "Canal Winchester", value: "Canal Winchester" },
  { label: "Columbus", value: "Columbus" },
  { label: "Acton", value: "Acton" },
  { label: "Alabaster", value: "Alabaster" },
  { label: "Airmont", value: "Airmont" },
  { label: "San Jose", value: "San Jose" },
];

export const COUNTRY_PHONE_CODES = [
  { label: "+1 (US/CA)", value: "+1" },
  { label: "+44 (UK)", value: "+44" },
  { label: "+91 (IN)", value: "+91" },
  { label: "+61 (AU)", value: "+61" },
  { label: "+49 (DE)", value: "+49" },
  { label: "+33 (FR)", value: "+33" },
];

export const COUNTRY_SELECT_OPTIONS = [
  { label: "United States", value: "United States" },
  { label: "Canada", value: "Canada" },
  { label: "United Kingdom", value: "United Kingdom" },
  { label: "Australia", value: "Australia" },
  { label: "Germany", value: "Germany" },
  { label: "France", value: "France" },
  { label: "India", value: "India" },
];

export const CITY_SELECT_OPTIONS: Record<string, string[]> = {
  "United States": [
    "Canal Winchester",
    "Columbus",
    "New York",
    "Alabaster",
    "Airmont",
    "San Jose",
    "Los Angeles",
    "Chicago",
    "Houston",
  ],
  Canada: ["Toronto", "Vancouver", "Montreal", "Calgary"],
  "United Kingdom": ["London", "Manchester", "Birmingham", "Leeds"],
  Australia: ["Sydney", "Melbourne", "Brisbane", "Perth"],
  Germany: ["Berlin", "Munich", "Hamburg", "Frankfurt"],
  France: ["Paris", "Lyon", "Marseille", "Toulouse"],
  India: ["Mumbai", "Delhi", "Bangalore", "Chennai"],
};
