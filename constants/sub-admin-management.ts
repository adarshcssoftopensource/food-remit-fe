import { Shield, ShieldCheck, ShieldOff, UserCog } from "lucide-react";

export type SubAdminPermission =
  | "Country Management"
  | "Donation Logs"
  | "Philanthropist Management"
  | "Credit Management"
  | "Catalogue Management"
  | "Content Management"
  | "Foundation Management"
  | "Stories Management"
  | "Users Management"
  | "Sub Admin Management"
  | "Payment Settings";

export type SubAdminData = {
  id: string;
  userId: string;
  userName: string;
  email: string;
  contactNumber: string;
  status: "Active" | "Inactive";
  createdAt: string;
  permissions: SubAdminPermission[];
};

export const MOCK_SUB_ADMINS: SubAdminData[] = [
  {
    id: "sa-001",
    userId: "12",
    userName: "eBooks",
    email: "pai@yopmail.com",
    contactNumber: "93 768378358434",
    status: "Active",
    createdAt: "2026-06-10 10:30:00",
    permissions: [
      "Country Management",
      "Donation Logs",
      "Philanthropist Management",
      "Credit Management",
      "Catalogue Management",
      "Content Management",
      "Foundation Management",
    ],
  },
  {
    id: "sa-002",
    userId: "13",
    userName: "subadmin",
    email: "subadmin@yopmail.com",
    contactNumber: "93 9595959585",
    status: "Active",
    createdAt: "2026-06-12 08:15:00",
    permissions: ["Country Management", "Donation Logs", "Users Management", "Stories Management"],
  },
  {
    id: "sa-003",
    userId: "14",
    userName: "jack",
    email: "jack123@yopmail.com",
    contactNumber: "91 9875339902",
    status: "Active",
    createdAt: "2026-06-15 14:00:00",
    permissions: [
      "Philanthropist Management",
      "Credit Management",
      "Payment Settings",
      "Content Management",
    ],
  },
  {
    id: "sa-004",
    userId: "15",
    userName: "sub-admin-ashish",
    email: "subashish@yopmail.com",
    contactNumber: "91 9882456871",
    status: "Inactive",
    createdAt: "2026-06-18 09:45:00",
    permissions: ["Country Management", "Foundation Management", "Stories Management"],
  },
  {
    id: "sa-005",
    userId: "16",
    userName: "subSolutionLink",
    email: "paimon@gmail.com",
    contactNumber: "213 12345554464",
    status: "Active",
    createdAt: "2026-06-20 11:20:00",
    permissions: [
      "Country Management",
      "Donation Logs",
      "Philanthropist Management",
      "Credit Management",
      "Catalogue Management",
      "Content Management",
      "Foundation Management",
      "Stories Management",
      "Users Management",
      "Payment Settings",
    ],
  },
  {
    id: "sa-006",
    userId: "17",
    userName: "adminRohan",
    email: "rohan@yopmail.com",
    contactNumber: "91 8800112233",
    status: "Active",
    createdAt: "2026-06-22 13:00:00",
    permissions: ["Users Management", "Sub Admin Management", "Payment Settings"],
  },
  {
    id: "sa-007",
    userId: "18",
    userName: "nitaSuperAdmin",
    email: "nita@yopmail.com",
    contactNumber: "91 7799334455",
    status: "Inactive",
    createdAt: "2026-07-01 16:30:00",
    permissions: ["Catalogue Management", "Donation Logs"],
  },
];

export const SUB_ADMIN_STAT_CONFIG = [
  {
    key: "total" as const,
    label: "Total Sub Admins",
    Icon: UserCog,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    key: "active" as const,
    label: "Active",
    Icon: ShieldCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    key: "inactive" as const,
    label: "Inactive",
    Icon: ShieldOff,
    color: "text-red-500",
    bg: "bg-red-50",
  },
  {
    key: "permissions" as const,
    label: "Avg. Permissions",
    Icon: Shield,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
];

export const SUB_ADMIN_STATUS_OPTIONS = [
  { label: "All", value: "All" },
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
] as const;
