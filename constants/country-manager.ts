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
