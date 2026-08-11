import { Building2, Users, CheckCircle, MailOpen } from "lucide-react";

export const PARTNER_LEAD_STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "REGISTRATION_INVITED",
  "REGISTRATION_STARTED",
  "APPROVED",
  "NOT_QUALIFIED",
] as const;

export const STATS_CONFIG = [
  { key: "total", label: "Total Leads", Icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
  {
    key: "new",
    label: "New Leads",
    Icon: Building2,
    color: "text-emerald-600",
    bg: "bg-emerald-100",
  },
  {
    key: "contacted",
    label: "Contacted",
    Icon: MailOpen,
    color: "text-amber-600",
    bg: "bg-amber-100",
  },
  {
    key: "approved",
    label: "Approved",
    Icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-100",
  },
] as const;

export const getStatusColor = (status: string) => {
  switch (status) {
    case "NEW":
      return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100";
    case "CONTACTED":
      return "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100";
    case "QUALIFIED":
      return "bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100";
    case "REGISTRATION_INVITED":
      return "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100";
    case "REGISTRATION_STARTED":
      return "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100";
    case "APPROVED":
      return "bg-green-50 text-green-700 border-green-200 hover:bg-green-100";
    case "NOT_QUALIFIED":
      return "bg-red-50 text-red-700 border-red-200 hover:bg-red-100";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100";
  }
};
