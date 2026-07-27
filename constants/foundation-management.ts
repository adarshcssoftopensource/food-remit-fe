import { Building2, Clock, CheckCircle2 } from "lucide-react";

export type FoundationData = {
  id: string;
  foundationId: string;
  foundationName: string;
  foundationEmail: string;
  website: string;
  address: string;
  country: string;
  city: string;
  orgType: string;
  storiesAdded: number;
  registeredOn: string;
  status: "Active" | "Pending" | "Rejected";
};

export const MOCK_FOUNDATIONS_DATA: FoundationData[] = [
  {
    id: "FND001",
    foundationId: "FND-2026-001",
    foundationName: "Global Foundation for Change",
    foundationEmail: "contact@globalfoundation.com",
    website: "https://www.globalfoundation.com",
    address: "123 Charity Lane",
    country: "India",
    city: "Mumbai",
    orgType: "NGO",
    storiesAdded: 45,
    registeredOn: "2026-06-15 10:30:00",
    status: "Active",
  },
  {
    id: "FND002",
    foundationId: "FND-2026-002",
    foundationName: "Hope for Tomorrow",
    foundationEmail: "info@hopefuture.org",
    website: "https://www.hopefuture.org",
    address: "456 Help Street",
    country: "India",
    city: "Delhi",
    orgType: "Charity",
    storiesAdded: 32,
    registeredOn: "2026-07-01 14:22:15",
    status: "Active",
  },
  {
    id: "FND003",
    foundationId: "FND-2026-003",
    foundationName: "Community Care Foundation",
    foundationEmail: "admin@communitycare.org",
    website: "https://www.communitycare.org",
    address: "789 Support Avenue",
    country: "India",
    city: "Bangalore",
    orgType: "Non-Profit",
    storiesAdded: 28,
    registeredOn: "2026-07-10 09:15:42",
    status: "Active",
  },
  {
    id: "FND004",
    foundationId: "FND-2026-004",
    foundationName: "Helping Hands Initiative",
    foundationEmail: "contact@helpinghands.org",
    website: "https://www.helpinghands.org",
    address: "321 Kindness Road",
    country: "India",
    city: "Pune",
    orgType: "NGO",
    storiesAdded: 15,
    registeredOn: "2026-07-18 11:45:30",
    status: "Active",
  },
  {
    id: "FND005",
    foundationId: "FND-2026-005",
    foundationName: "Social Impact Network",
    foundationEmail: "support@socialimpact.org",
    website: "https://www.socialimpact.org",
    address: "654 Change Drive",
    country: "India",
    city: "Kolkata",
    orgType: "Charity",
    storiesAdded: 52,
    registeredOn: "2026-05-20 16:28:00",
    status: "Active",
  },
];

export const MOCK_FOUNDATION_REQUESTS: FoundationData[] = [
  {
    id: "REQ001",
    foundationId: "REQ-2026-001",
    foundationName: "Unity for Good",
    foundationEmail: "org@unityforgood.com",
    website: "https://www.unityforgood.com",
    address: "555 Unity Plaza",
    country: "India",
    city: "Chennai",
    orgType: "NGO",
    storiesAdded: 0,
    registeredOn: "2026-07-25 13:10:22",
    status: "Pending",
  },
  {
    id: "REQ002",
    foundationId: "REQ-2026-002",
    foundationName: "Better World Foundation",
    foundationEmail: "info@betterworld.org",
    website: "https://www.betterworld.org",
    address: "888 Progress Lane",
    country: "India",
    city: "Hyderabad",
    orgType: "Non-Profit",
    storiesAdded: 0,
    registeredOn: "2026-07-22 08:50:45",
    status: "Pending",
  },
  {
    id: "REQ003",
    foundationId: "REQ-2026-003",
    foundationName: "Positive Change Alliance",
    foundationEmail: "hello@positivechange.org",
    website: "https://www.positivechange.org",
    address: "222 Hope Boulevard",
    country: "India",
    city: "Ahmedabad",
    orgType: "Charity",
    storiesAdded: 0,
    registeredOn: "2026-07-20 15:33:18",
    status: "Pending",
  },
];

export const COUNTRY_OPTIONS = [
  { label: "All Countries", value: "All Countries" },
  { label: "USA", value: "USA" },
  { label: "Canada", value: "Canada" },
];

export const CITY_OPTIONS = [
  { label: "All Cities", value: "All Cities" },
  { label: "Mumbai", value: "Mumbai" },
  { label: "Delhi", value: "Delhi" },
];

export const FOUNDATION_STATS_CONFIG = [
  {
    key: "total",
    label: "Total Foundations",
    Icon: Building2,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    key: "active",
    label: "Registered Foundations",
    Icon: CheckCircle2,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    key: "pending",
    label: "Foundation Requests",
    Icon: Clock,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
] as const;

export const FOUNDATION_STATUS_STYLES: Record<FoundationData["status"], string> = {
  Active: "bg-green-100 text-green-700 border-green-200",
  Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Rejected: "bg-red-100 text-red-700 border-red-200",
};

export const FOUNDATION_TABS = [
  { value: "registered", label: "Registered Foundations" },
  { value: "requests", label: "Foundation Requests" },
] as const;
