import { UserCheck, Users, UserX } from "lucide-react";

export type UserData = {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  userType: string;
  email: string;
  contactNumber: string;
  registeredOn: string;
  country: string;
  state: string;
  city: string;
  status: "Active" | "Inactive";
  image?: string;
};

export type OrderData = {
  orderId: string;
  orderDate: string;
  receiverName?: string;
  senderName?: string;
  storeName: string;
  cost: number;
  status: "Pending" | "Completed" | "Cancelled" | "Processing";
};

export const MOCK_USERS_DATA: UserData[] = [
  {
    id: "etQjGL7iuN483",
    firstName: "User",
    lastName: "Test",
    userName: "testuserxos",
    userType: "Normal",
    email: "foodremitxos@yopmail.com",
    contactNumber: "8146660065",
    registeredOn: "2026-07-17 09:56:55",
    country: "India",
    state: "Punjab",
    city: "Sahibzada Ajit Singh Nagar",
    status: "Active",
  },
  {
    id: "etQjGL7iuN484",
    firstName: "User",
    lastName: "Xo",
    userName: "userxo",
    userType: "Normal",
    email: "foodremitxo@yopmail.com",
    contactNumber: "827993817",
    registeredOn: "2026-07-17 09:53:38",
    country: "India",
    state: "Punjab",
    city: "Sahibzada Ajit Singh Nagar",
    status: "Active",
  },
  {
    id: "etQjGL7iuN485",
    firstName: "Shiv",
    lastName: "Kumar",
    userName: "shivKumar",
    userType: "Normal",
    email: "shiv@yopmail.com",
    contactNumber: "8427961133",
    registeredOn: "2026-07-24 05:51:37",
    country: "India",
    state: "Punjab",
    city: "Sahibzada Ajit Singh Nagar",
    status: "Active",
  },
  {
    id: "etQjGL7iuN486",
    firstName: "Vansh",
    lastName: "Arora",
    userName: "vansharora",
    userType: "Normal",
    email: "vansh@yopmail.com",
    contactNumber: "6239666975",
    registeredOn: "2026-07-17 09:47:28",
    country: "India",
    state: "Punjab",
    city: "Sahibzada Ajit Singh Nagar",
    status: "Inactive",
  },
  {
    id: "etQjGL7iuN487",
    firstName: "Kevin",
    lastName: "Singh",
    userName: "kavin",
    userType: "Normal",
    email: "kevin@yopmail.com",
    contactNumber: "9592701163",
    registeredOn: "2026-07-14 01:07:04",
    country: "India",
    state: "Punjab",
    city: "Sahibzada Ajit Singh Nagar",
    status: "Active",
  },
  {
    id: "etQjGL7iuN488",
    firstName: "Sachin",
    lastName: "Yadav",
    userName: "yadavsachin",
    userType: "Normal",
    email: "sachin@mailinator.com",
    contactNumber: "7087920183",
    registeredOn: "2026-07-03 07:20:40",
    country: "India",
    state: "Punjab",
    city: "Sahibzada Ajit Singh Nagar",
    status: "Active",
  },
  {
    id: "etQjGL7iuN489",
    firstName: "Alvin",
    lastName: "Mathew",
    userName: "alvin",
    userType: "Normal",
    email: "alvin@yopmail.com",
    contactNumber: "9592701164",
    registeredOn: "2026-07-22 00:21:16",
    country: "India",
    state: "Punjab",
    city: "Sahibzada Ajit Singh Nagar",
    status: "Active",
  },
  {
    id: "etQjGL7iuN490",
    firstName: "Rohit",
    lastName: "Dad",
    userName: "Rohitdad",
    userType: "Normal",
    email: "rohit@yopmail.com",
    contactNumber: "9779318152",
    registeredOn: "2026-05-06 02:04:13",
    country: "India",
    state: "Punjab",
    city: "Sahibzada Ajit Singh Nagar",
    status: "Inactive",
  },
  {
    id: "etQjGL7iuN491",
    firstName: "Test",
    lastName: "Gf",
    userName: "testusergf",
    userType: "Normal",
    email: "testusergf@yopmail.com",
    contactNumber: "7896616238",
    registeredOn: "2026-05-05 10:44:13",
    country: "India",
    state: "Punjab",
    city: "Sahibzada Ajit Singh Nagar",
    status: "Active",
  },
  {
    id: "etQjGL7iuN492",
    firstName: "Jenna",
    lastName: "Cee",
    userName: "Jennacee",
    userType: "Normal",
    email: "jenna@yopmail.com",
    contactNumber: "9989819087",
    registeredOn: "2026-07-17 10:08:02",
    country: "Philippines",
    state: "Calabarzon",
    city: "General Trias",
    status: "Active",
  },
];

export const USER_STATUS_OPTIONS = [
  { label: "All Users", value: "All Users" },
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
];

export const MOCK_REQUESTED_ORDERS: Record<string, OrderData[]> = {};
export const MOCK_SENT_ORDERS: Record<string, OrderData[]> = {};
export const MOCK_RECEIVED_ORDERS: Record<string, OrderData[]> = {};

export const STAT_CONFIG = [
  { key: "total", label: "Total Users", Icon: Users, color: "text-primary", bg: "bg-primary/10" },
  {
    key: "active",
    label: "Active Users",
    Icon: UserCheck,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  { key: "inactive", label: "Inactive Users", Icon: UserX, color: "text-red-500", bg: "bg-red-50" },
] as const;

export const USER_MANAGEMENT_VIEW_TABS = [
  { value: "profile", label: "Profile" },
  { value: "requested", label: "Requested Orders" },
  { value: "sent", label: "Sent Orders" },
  { value: "received", label: "Received Orders" },
] as const;

export const USER_MANAGEMENT_STATUS_STYLES: Record<OrderData["status"], string> = {
  Completed: "bg-green-100 text-green-700 border-green-200",
  Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Processing: "bg-blue-100 text-blue-700 border-blue-200",
  Cancelled: "bg-red-100 text-red-700 border-red-200",
};
