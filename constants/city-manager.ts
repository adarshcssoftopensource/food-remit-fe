import { Building2, MapPin, ShieldCheck, Users } from "lucide-react";

export type CityManagerStatus = "Active" | "Inactive";

export type CityManagerData = {
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
  country: string;
  assignedCities: string[];
  createdAt: string;
  status: CityManagerStatus;
  avatar?: string;
};

export const CITY_MANAGER_COUNTRY_OPTIONS = ["India", "United States", "United Kingdom", "Canada"];

export const CITY_MANAGER_STATE_OPTIONS: Record<string, string[]> = {
  India: ["Maharashtra", "Gujarat", "Delhi", "Karnataka"],
  "United States": ["Alabama", "California", "Texas", "New York", "Florida"],
  "United Kingdom": ["England", "Scotland", "Wales"],
  Canada: ["Ontario", "Quebec", "Alberta"],
};

export const CITY_MANAGER_CITY_OPTIONS: Record<string, string[]> = {
  Maharashtra: ["Mumbai", "Pune", "Nagpur"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara"],
  Delhi: ["New Delhi", "Dwarka", "Rohini"],
  Karnataka: ["Bengaluru", "Mysuru", "Hubli"],
  Alabama: ["Arab", "Acton", "Acworth", "Ada", "Airmont", "Birmingham"],
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

export const CITY_MANAGER_ASSIGNABLE_CITIES: Record<string, string[]> = {
  India: ["Mumbai", "Pune", "Ahmedabad", "Bengaluru", "New Delhi", "Surat"],
  "United States": [
    "Acton",
    "Acworth",
    "Ada",
    "Airmont",
    "Arab",
    "Austin",
    "Houston",
    "Miami",
    "Alamo",
    "Columbus",
  ],
  "United Kingdom": ["London", "Manchester", "Birmingham", "Edinburgh", "Cardiff"],
  Canada: ["Toronto", "Ottawa", "Montreal", "Calgary", "Edmonton"],
};

export const CITY_MANAGER_PHONE_CODES = [
  { value: "91", label: "+91 (India)" },
  { value: "1", label: "+1 (USA/Canada)" },
  { value: "44", label: "+44 (UK)" },
];

export const CITY_MANAGER_STATUS_OPTIONS = [
  { label: "All", value: "All" },
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
] as const;

export const CITY_MANAGER_STATS_CONFIG = [
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
    key: "cities" as const,
    label: "Assigned Cities",
    Icon: MapPin,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    key: "countries" as const,
    label: "Countries Covered",
    Icon: Building2,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
];

export const MOCK_CITY_MANAGERS: CityManagerData[] = [
  {
    id: "cym-001",
    userId: "1",
    firstName: "michel",
    lastName: "hill",
    email: "ks996814@gmail.com",
    phoneCode: "1",
    phoneNumber: "9568524512",
    address1: "Test",
    address2: "asSSsgJHSSgshj SJSj jabdsad",
    residentialCountry: "United States",
    state: "Alabama",
    city: "Arab",
    zipcode: "153265",
    country: "United States",
    assignedCities: ["Acton", "Acworth", "Ada", "Airmont"],
    createdAt: "2026-02-17 10:58:38",
    status: "Active",
  },
  {
    id: "cym-002",
    userId: "2",
    firstName: "Ashish",
    lastName: "Pal",
    email: "ashish@yopmail.com",
    phoneCode: "91",
    phoneNumber: "7894561230",
    address1: "Sector 18",
    address2: "Near Metro",
    residentialCountry: "India",
    state: "Delhi",
    city: "New Delhi",
    zipcode: "110001",
    country: "India",
    assignedCities: ["Mumbai", "Pune", "Ahmedabad"],
    createdAt: "2026-02-05 08:20:11",
    status: "Active",
  },
  {
    id: "cym-003",
    userId: "3",
    firstName: "Priya",
    lastName: "Shah",
    email: "priya.shah@yopmail.com",
    phoneCode: "91",
    phoneNumber: "9988776655",
    address1: "SG Highway",
    address2: "",
    residentialCountry: "India",
    state: "Gujarat",
    city: "Ahmedabad",
    zipcode: "380015",
    country: "India",
    assignedCities: ["Surat", "Vadodara"],
    createdAt: "2026-01-22 14:05:00",
    status: "Active",
  },
  {
    id: "cym-004",
    userId: "4",
    firstName: "James",
    lastName: "Clark",
    email: "james.clark@yopmail.com",
    phoneCode: "1",
    phoneNumber: "8658854585",
    address1: "47 W 13th St",
    address2: "NY",
    residentialCountry: "United States",
    state: "New York",
    city: "New York City",
    zipcode: "10011",
    country: "United States",
    assignedCities: ["Austin", "Houston"],
    createdAt: "2026-01-10 09:30:22",
    status: "Active",
  },
  {
    id: "cym-005",
    userId: "5",
    firstName: "Noah",
    lastName: "Kent",
    email: "noah.kent@yopmail.com",
    phoneCode: "44",
    phoneNumber: "7700900123",
    address1: "Baker Street",
    address2: "Apt 12",
    residentialCountry: "United Kingdom",
    state: "England",
    city: "London",
    zipcode: "NW1",
    country: "United Kingdom",
    assignedCities: ["London", "Manchester"],
    createdAt: "2025-12-18 16:40:00",
    status: "Inactive",
  },
];
