import { ROUTES } from "@/config/routes";
import { DashboardData } from "@/feature/private/dashboard/types/dashboard.types";

export const DEFAULT_DASHBOARD_DATA: DashboardData = {
  overviewStats: {
    foodSent: { today: 0, thisWeek: 0, thisMonth: 0, thisYear: 0, total: 0 },
    foodRequested: { today: 0, thisWeek: 0, thisMonth: 0, thisYear: 0, total: 0 },
    registeredUsers: {
      users: 0,
      activeUsers: 0,
      inactiveUsers: 0,
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
      thisYear: 0,
      philanthropists: 0,
      foundations: 0,
    },
  },
  managementStats: {
    countryManager: 0,
    cityManager: 0,
    storeManager: 0,
    employees: 0,
    subAdmins: 0,
  },
  financialStats: {
    amountCollectedToday: "0 USD",
    itemsSentToday: 0,
  },
  salesOverview: {
    salesGraph: "0 USD",
    newUsers: 0,
    totalOrders: 0,
  },
  storesSummary: {
    totalStores: 0,
    newStoreListings: [],
  },
  recentTickets: [],
  recentOrdersRequested: [],
  recentlyPlacedOrders: [],
  trendingOrders: [],
};

export const DASHBOARD_ROUTES = {
  USERS: ROUTES.ADMIN.USERS_MANAGEMENT,
  COUNTRY_MANAGERS: ROUTES.ADMIN.COUNTRY_MANAGEMENT.LIST,
  CITY_MANAGERS: ROUTES.ADMIN.CITY_MANAGEMENT.LIST,
  STORE_MANAGERS: ROUTES.ADMIN.STORE_MANAGEMENT.ROOT,
  SUB_ADMINS: ROUTES.ADMIN.SUB_ADMIN_MANAGEMENT.ROOT,
  TICKETS: ROUTES.ADMIN.TICKET_MANAGEMENT.ACTIVE_REQUESTS,
  CATALOGUE_ITEMS: ROUTES.ADMIN.CATALOGUE_MANAGEMENT.ITEMS,
  STORES: ROUTES.ADMIN.STORE_MANAGEMENT.ROOT,
};

export const DEFAULT_MONTHLY_REVENUE = [
  { label: "Week 1", percentage: 0 },
  { label: "Week 2", percentage: 0 },
  { label: "Week 3", percentage: 0 },
  { label: "Week 4", percentage: 0 },
];

export const ACCENT_BORDER_MAP = {
  emerald: "before:bg-emerald-500",
  indigo: "before:bg-indigo-500",
  amber: "before:bg-amber-500",
  rose: "before:bg-rose-500",
  cyan: "before:bg-cyan-500",
  violet: "before:bg-violet-500",
  none: "",
};

export const ACCENT_GLOW_MAP = {
  emerald: "from-emerald-500/10 via-transparent to-transparent border-t-emerald-500/40",
  indigo: "from-indigo-500/10 via-transparent to-transparent border-t-indigo-500/40",
  amber: "from-amber-500/10 via-transparent to-transparent border-t-amber-500/40",
  rose: "from-rose-500/10 via-transparent to-transparent border-t-rose-500/40",
  cyan: "from-cyan-500/10 via-transparent to-transparent border-t-cyan-500/40",
  violet: "from-violet-500/10 via-transparent to-transparent border-t-violet-500/40",
};

export const STATUS_CONFIG_MAP: Record<
  string,
  {
    bg: string;
    text: string;
    border: string;
    dot: string;
    label: string;
  }
> = {
  // Order statuses
  completed: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200/80 dark:border-emerald-800/60",
    dot: "bg-emerald-500",
    label: "Completed",
  },
  paid: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200/80 dark:border-emerald-800/60",
    dot: "bg-emerald-500",
    label: "Paid",
  },
  requested: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200/80 dark:border-amber-800/60",
    dot: "bg-amber-500",
    label: "Requested",
  },
  "in progress": {
    bg: "bg-sky-50 dark:bg-sky-950/40",
    text: "text-sky-700 dark:text-sky-400",
    border: "border-sky-200/80 dark:border-sky-800/60",
    dot: "bg-sky-500",
    label: "In Progress",
  },
  pending: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200/80 dark:border-amber-800/60",
    dot: "bg-amber-500",
    label: "Pending",
  },
  failed: {
    bg: "bg-rose-50 dark:bg-rose-950/40",
    text: "text-rose-700 dark:text-rose-400",
    border: "border-rose-200/80 dark:border-rose-800/60",
    dot: "bg-rose-500",
    label: "Failed",
  },
  active: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200/80 dark:border-emerald-800/60",
    dot: "bg-emerald-500",
    label: "Active",
  },
  inactive: {
    bg: "bg-slate-100 dark:bg-slate-800/60",
    text: "text-slate-600 dark:text-slate-400",
    border: "border-slate-200 dark:border-slate-700",
    dot: "bg-slate-400",
    label: "Inactive",
  },
};
