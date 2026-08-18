export interface RegisteredUsersStats {
  users: number;
  activeUsers: number;
  inactiveUsers: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  thisYear: number;
  philanthropists: number;
  foundations: number;
}

export interface FoodVolumeStats {
  today: number;
  thisWeek: number;
  thisMonth: number;
  thisYear: number;
  total: number;
}

export interface DashboardOverviewStats {
  foodSent: FoodVolumeStats;
  foodRequested: FoodVolumeStats;
  registeredUsers: RegisteredUsersStats;
}

export interface DashboardManagementStats {
  countryManager: number;
  cityManager: number;
  storeManager: number;
  employees: number;
  subAdmins?: number;
}

export interface DashboardFinancialStats {
  amountCollectedToday: string;
  itemsSentToday: number;
}

export interface DashboardSalesOverview {
  salesGraph: string;
  newUsers: number;
  totalOrders: number;
}

export interface DashboardStoreListing {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  storeImage?: string | null;
  storeImageUrl?: string | null;
  status: string;
  addedOn?: string | null;
  addedOnTimestamp?: string | null;
}

export interface DashboardStoresSummary {
  totalStores: number;
  newStoreListings: DashboardStoreListing[];
}

export interface DashboardTicketItem {
  id: string;
  subject: string;
  description?: string | null;
  status: string;
  addedOn?: string | null;
  addedOnTimestamp?: string | null;
}

export interface DashboardOrderRequested {
  orderId: string;
  customerName: string;
  location: string;
  orderStatus: string;
  deliveredTime: string;
  price: string;
}

export interface DashboardRecentlyPlacedOrder {
  id: string;
  customerName: string;
  location: string;
  status: string;
  deliveredTime: string;
  price: string;
}

export interface DashboardTrendingOrder {
  id: string;
  name: string;
  orders: number;
  price: string;
  productImage?: string | null;
  productImageUrl?: string | null;
  color?: string;
  iconColor?: string;
}

export interface DashboardData {
  overviewStats: DashboardOverviewStats;
  managementStats: DashboardManagementStats;
  financialStats: DashboardFinancialStats;
  salesOverview: DashboardSalesOverview;
  storesSummary: DashboardStoresSummary;
  recentTickets: DashboardTicketItem[];
  recentOrdersRequested: DashboardOrderRequested[];
  recentlyPlacedOrders: DashboardRecentlyPlacedOrder[];
  trendingOrders: DashboardTrendingOrder[];
}

export interface DashboardStatsApiResponse {
  message: string;
  status: boolean;
  data: DashboardData;
  error: Record<string, unknown>;
}

export interface DashboardFiltersState {
  countryId?: string;
  cityId?: string;
}
