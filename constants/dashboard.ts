import { HandPlatter, Package, Users } from "lucide-react";

export const DASHBOARD_TABS = [
  { id: "all", label: "All Over Statistics" },
  { id: "individual", label: "Individual Philanthropists Statistics" },
  { id: "foundation", label: "Foundation Philanthropists Statistics" },
  { id: "stories", label: "Stories And Credits Statistics" },
];

export const OVERVIEW_STATS = {
  foodSent: {
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    thisYear: 0,
  },
  foodRequested: {
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    thisYear: 0,
  },
  registeredUsers: {
    users: 0,
    activeUsers: 0,
    inactiveUsers: 0,
  },
};

export const MANAGEMENT_STATS = [
  { title: "Country Manager", value: "0" },
  { title: "City Manager", value: "0" },
  { title: "Store Manager", value: "0" },
  { title: "Employees", value: "0" },
];

export const FINANCIAL_STATS = [
  { title: "Amount Collected Today", value: "0 USD" },
  { title: "Count of Items Sent Today", value: "0" },
];

export const SALES_OVERVIEW = [
  { title: "Sells Graph", value: "0 USD" },
  { title: "New Users", value: "0" },
  { title: "Total Orders", value: "0" },
];

export type Order = {
  id: string;
  customerName: string;
  location: string;
  status: "Paid" | "Pending" | "Failed";
  deliveredTime: string;
  price: string;
};

export const TRENDING_ORDERS = [
  {
    id: 1,
    name: "Doughnut",
    price: "8.80 USD",
    orders: 4,
    color: "bg-pink-100",
    iconColor: "text-pink-500",
  },
  {
    id: 2,
    name: "Waffles",
    price: "8.80 USD",
    orders: 2,
    color: "bg-amber-100",
    iconColor: "text-amber-500",
  },
  {
    id: 3,
    name: "Pudding",
    price: "8.80 USD",
    orders: 2,
    color: "bg-orange-100",
    iconColor: "text-orange-500",
  },
  {
    id: 4,
    name: "Stawberry",
    price: "22.00 USD",
    orders: 1,
    color: "bg-red-100",
    iconColor: "text-red-500",
  },
];

export const MONTHLY_REVENUE = [
  { label: "week 1", percentage: 0 },
  { label: "week 2", percentage: 0 },
  { label: "week 3", percentage: 0 },
  { label: "week 4", percentage: 0 },
];

export const STORE_LISTINGS = [
  {
    id: 1,
    name: "La Petite Épicerie",
    country: "United States",
    city: "Columbus",
    address: "2300 S Hamilton Road",
    color: "bg-slate-200",
  },
  {
    id: 2,
    name: "Kalsang",
    country: "United States",
    city: "Acton",
    address: "47 W 13th St, New York, NY 10011, USA",
    color: "bg-amber-900",
  },
  {
    id: 3,
    name: "Grocessary Store..",
    country: "United States",
    city: "Alabaster",
    address: "usa",
    color: "bg-emerald-800",
  },
];

export const OVERVIEW_CARDS = [
  {
    title: "Food Sent",
    icon: Package,
    color: "bg-emerald-50 text-emerald-600",
    stats: [
      { label: "Today", value: OVERVIEW_STATS.foodSent.today },
      { label: "Week", value: OVERVIEW_STATS.foodSent.thisWeek },
      { label: "Month", value: OVERVIEW_STATS.foodSent.thisMonth },
      { label: "Year", value: OVERVIEW_STATS.foodSent.thisYear },
    ],
  },
  {
    title: "Food Requested",
    icon: HandPlatter,
    color: "bg-blue-50 text-blue-600",
    stats: [
      { label: "Today", value: OVERVIEW_STATS.foodRequested.today },
      { label: "Week", value: OVERVIEW_STATS.foodRequested.thisWeek },
      { label: "Month", value: OVERVIEW_STATS.foodRequested.thisMonth },
      { label: "Year", value: OVERVIEW_STATS.foodRequested.thisYear },
    ],
  },
  {
    title: "Registered Users",
    icon: Users,
    color: "bg-violet-50 text-violet-600",
    stats: [
      { label: "Users", value: OVERVIEW_STATS.registeredUsers.users },
      { label: "Active", value: OVERVIEW_STATS.registeredUsers.activeUsers },
      { label: "Inactive", value: OVERVIEW_STATS.registeredUsers.inactiveUsers },
    ],
  },
];
