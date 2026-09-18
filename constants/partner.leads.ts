import { CircleCheck, CircleX, Clock3, Users, type LucideIcon } from "lucide-react";

export const PARTNER_LEAD_STATUSES = [
  "PENDING",
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "REGISTRATION_INVITED",
  "REGISTRATION_STARTED",
  "APPROVED",
  "REJECTED",
  "NOT_QUALIFIED",
] as const;

/** Statuses that can still move through the pending/general-inquiry pipeline */
export const PARTNER_LEAD_MUTABLE_STATUSES = [
  "PENDING",
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "REGISTRATION_INVITED",
  "REGISTRATION_STARTED",
  "APPROVED",
  "REJECTED",
] as const;

export const TERMINAL_LEAD_STATUSES = ["APPROVED", "REJECTED", "NOT_QUALIFIED"] as const;

export const isTerminalLeadStatus = (status?: string | null) =>
  !!status && (TERMINAL_LEAD_STATUSES as readonly string[]).includes(status);

export type PartnerLeadPipelineTab = {
  value: "pending" | "approved" | "rejected";
  label: string;
  description: string;
  Icon: LucideIcon;
  countKey: "pendingBucket" | "approved" | "rejectedBucket";
  /** Soft surface when selected */
  activePanel: string;
  /** Icon chip colors */
  iconWrap: string;
  iconColor: string;
  /** Count badge */
  badge: string;
  /** Left accent bar / ring */
  accent: string;
};

export const PARTNER_LEAD_PIPELINE_TABS: PartnerLeadPipelineTab[] = [
  {
    value: "pending",
    label: "Pending",
    description: "General inquiries in review",
    Icon: Clock3,
    countKey: "pendingBucket",
    activePanel:
      "border-amber-300 bg-amber-50 ring-1 ring-amber-200/80 dark:border-amber-500/40 dark:bg-amber-500/10 dark:ring-amber-500/20",
    iconWrap: "bg-amber-100 dark:bg-amber-500/20",
    iconColor: "text-amber-700 dark:text-amber-400",
    badge: "bg-amber-500 text-white",
    accent: "bg-amber-500",
  },
  {
    value: "approved",
    label: "Approved",
    description: "Converted into stores",
    Icon: CircleCheck,
    countKey: "approved",
    activePanel:
      "border-emerald-300 bg-emerald-50 ring-1 ring-emerald-200/80 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:ring-emerald-500/20",
    iconWrap: "bg-emerald-100 dark:bg-emerald-500/20",
    iconColor: "text-emerald-700 dark:text-emerald-400",
    badge: "bg-emerald-600 text-white",
    accent: "bg-emerald-600",
  },
  {
    value: "rejected",
    label: "Rejected",
    description: "Declined requests",
    Icon: CircleX,
    countKey: "rejectedBucket",
    activePanel:
      "border-rose-300 bg-rose-50 ring-1 ring-rose-200/80 dark:border-rose-500/40 dark:bg-rose-500/10 dark:ring-rose-500/20",
    iconWrap: "bg-rose-100 dark:bg-rose-500/20",
    iconColor: "text-rose-700 dark:text-rose-400",
    badge: "bg-rose-600 text-white",
    accent: "bg-rose-600",
  },
];

export const STATS_CONFIG = [
  {
    key: "total",
    label: "Total Leads",
    Icon: Users,
    color: "text-slate-700",
    bg: "bg-slate-100",
  },
  {
    key: "pendingBucket",
    label: "Pending",
    Icon: Clock3,
    color: "text-amber-600",
    bg: "bg-amber-100",
    pipeline: "pending" as const,
  },
  {
    key: "approved",
    label: "Approved",
    Icon: CircleCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-100",
    pipeline: "approved" as const,
  },
  {
    key: "rejectedBucket",
    label: "Rejected",
    Icon: CircleX,
    color: "text-rose-600",
    bg: "bg-rose-100",
    pipeline: "rejected" as const,
  },
] as const;

export const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100";
    case "NEW":
      return "bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100";
    case "CONTACTED":
      return "bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100";
    case "QUALIFIED":
      return "bg-violet-50 text-violet-800 border-violet-200 hover:bg-violet-100";
    case "REGISTRATION_INVITED":
      return "bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100";
    case "REGISTRATION_STARTED":
      return "bg-cyan-50 text-cyan-800 border-cyan-200 hover:bg-cyan-100";
    case "APPROVED":
      return "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100";
    case "REJECTED":
    case "NOT_QUALIFIED":
      return "bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100";
  }
};
