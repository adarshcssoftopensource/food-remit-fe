import { ROUTES } from "@/config/routes";
import type { DashboardData } from "../types/dashboard.types";

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
  SENT_ORDERS: ROUTES.ADMIN.ORDER_MANAGEMENT.SENT_ORDERS,
  REQUESTED_ORDERS: ROUTES.ADMIN.ORDER_MANAGEMENT.REQUESTED_ORDERS,
  COMPLETED_ORDERS: ROUTES.ADMIN.ORDER_MANAGEMENT.COMPLETED_ORDERS,
  ORDER_HISTORY: ROUTES.ADMIN.ORDER_MANAGEMENT.HISTORY,
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
