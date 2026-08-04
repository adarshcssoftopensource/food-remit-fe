import { Globe2, MapPin, ShieldCheck, Users } from "lucide-react";

export type CountryManagerStatus = "Active" | "Inactive";

export type CountryManagerData = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneCode: string;
  phoneNumber: string;
  address1: string;
  address2?: string;
  residentialCountry: string;
  state: string;
  city: string;
  zipcode: string;
  assignedCountry: string;
  assignedCityManagers: string[];
  createdAt: string;
  status: CountryManagerStatus;
  avatar?: string;
};

export const COUNTRY_MANAGER_COUNTRY_OPTIONS = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
];

export const COUNTRY_MANAGER_STATE_OPTIONS: Record<string, string[]> = {
  India: ["Maharashtra", "Gujarat", "Delhi", "Karnataka"],
  "United States": ["California", "Texas", "New York", "Florida"],
  "United Kingdom": ["England", "Scotland", "Wales"],
  Canada: ["Ontario", "Quebec", "Alberta"],
};

export const COUNTRY_MANAGER_CITY_OPTIONS: Record<string, string[]> = {
  Maharashtra: ["Mumbai", "Pune", "Nagpur"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara"],
  Delhi: ["New Delhi", "Dwarka", "Rohini"],
  Karnataka: ["Bengaluru", "Mysuru", "Hubli"],
  California: ["Alamo", "San Diego", "Los Angeles"],
  Texas: ["Austin", "Houston", "Dallas"],
  "New York": ["New York City", "Buffalo", "Albany"],
  Florida: ["Miami", "Orlando", "Tampa"],
  England: ["London", "Manchester", "Birmingham"],
  Scotland: ["Edinburgh", "Glasgow"],
  Wales: ["Cardiff", "Swansea"],
  Ontario: ["Toronto", "Ottawa"],
  Quebec: ["Montreal", "Quebec City"],
  Alberta: ["Calgary", "Edmonton"],
};

export const COUNTRY_MANAGER_PHONE_CODES = [
  { value: "91", label: "+91 (India)" },
  { value: "1", label: "+1 (USA/Canada)" },
  { value: "44", label: "+44 (UK)" },
];

export const COUNTRY_MANAGER_STATUS_OPTIONS = [
  { label: "All", value: "All" },
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
] as const;

export const COUNTRY_MANAGER_STATS_CONFIG = [
  {
    key: "total" as const,
    label: "Total Managers",
    Icon: Users,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    key: "active" as const,
    label: "Active Managers",
    Icon: ShieldCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    key: "countries" as const,
    label: "Assigned Countries",
    Icon: Globe2,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    key: "cities" as const,
    label: "Avg. City Managers",
    Icon: MapPin,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
];

export const MOCK_COUNTRY_MANAGERS: CountryManagerData[] = [
  {
    id: "cm-001",
    userId: "1",
    firstName: "Tin-ho",
    lastName: "Tin",
    email: "tin@yopmail.com",
    phoneCode: "91",
    phoneNumber: "7894564567",
    address1: "1452",
    address2: "gk",
    residentialCountry: "United States",
    state: "California",
    city: "Alamo",
    zipcode: "94507",
    assignedCountry: "India",
    assignedCityManagers: ["Lina Tina"],
    createdAt: "2026-01-27 05:29:06",
    status: "Active",
  },
  {
    id: "cm-002",
    userId: "2",
    firstName: "Nick",
    lastName: "Hill",
    email: "nick@yopmail.com",
    phoneCode: "1",
    phoneNumber: "8658854585",
    address1: "2300 S Hamilton Road",
    address2: "",
    residentialCountry: "United States",
    state: "Texas",
    city: "Austin",
    zipcode: "73301",
    assignedCountry: "United States",
    assignedCityManagers: ["James Clark", "Olivia Wills"],
    createdAt: "2026-01-08 06:00:19",
    status: "Active",
  },
  {
    id: "cm-003",
    userId: "3",
    firstName: "Rohan",
    lastName: "Verma",
    email: "rohan.verma@yopmail.com",
    phoneCode: "91",
    phoneNumber: "9876543210",
    address1: "Link Road, Andheri",
    address2: "Near Metro Station",
    residentialCountry: "India",
    state: "Maharashtra",
    city: "Mumbai",
    zipcode: "400053",
    assignedCountry: "Canada",
    assignedCityManagers: ["Noah Kent"],
    createdAt: "2026-02-11 10:15:00",
    status: "Inactive",
  },
];
