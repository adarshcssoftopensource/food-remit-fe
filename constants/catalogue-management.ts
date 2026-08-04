import { Box, CheckCircle, Package, Tag, XCircle } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

export type CatalogueStatus = "Active" | "Inactive";

export type DepartmentData = {
  id: string;
  name: string;
  icon?: string;
  country: string;
  createdBy: string;
  createdOn: string;
  editedOn: string;
  status: CatalogueStatus;
};

export type CategoryData = {
  id: string;
  name: string;
  icon?: string;
  departmentId: string;
  departmentName: string;
  country: string;
  city: string;
  createdBy: string;
  createdOn: string;
  editedOn: string;
  status: CatalogueStatus;
};

export type ItemData = {
  id: string;
  productName: string;
  storeName: string;
  icon?: string;
  categoryId: string;
  categoryName: string;
  departmentId: string;
  departmentName: string;
  country: string;
  createdBy: string;
  createdOn: string;
  editedOn: string;
  status: CatalogueStatus;

  // New switches
  availability: boolean;
  adminShare: boolean;
  discountAvailability: boolean;

  // New form fields
  description?: string;
  upcCode?: string;
  productInfo?: string;
  productInfoImage?: string;
  nutritionInfo?: string;
  nutritionInfoImage?: string;
  discountPercentage?: number;
  baseQuantity?: number;
  unit?: string;
};

// ─── Mock Data — Departments ──────────────────────────────────────────────────

export const MOCK_DEPARTMENTS: DepartmentData[] = [
  {
    id: "dept-001",
    name: "Produce",
    country: "United States",
    createdBy: "Store Manager",
    createdOn: "2026-07-31 16:39:25",
    editedOn: "2026-07-31 04:52:30",
    status: "Active",
  },
  {
    id: "dept-002",
    name: "Beverages",
    country: "United States",
    createdBy: "Store Manager",
    createdOn: "2026-07-31 16:39:25",
    editedOn: "2026-07-31 04:54:40",
    status: "Active",
  },
  {
    id: "dept-003",
    name: "Fruits",
    country: "United States",
    createdBy: "Store Manager",
    createdOn: "2026-02-19 16:37:54",
    editedOn: "2026-06-06 02:43:40",
    status: "Active",
  },
  {
    id: "dept-004",
    name: "Departmental Items",
    country: "United States",
    createdBy: "Store Manager",
    createdOn: "2026-02-19 11:12:54",
    editedOn: "2026-07-31 04:56:54",
    status: "Inactive",
  },
  {
    id: "dept-005",
    name: "Bakery & Snacks",
    country: "United States",
    createdBy: "Store Manager",
    createdOn: "2026-02-19 11:09:17",
    editedOn: "2026-07-31 04:57:03",
    status: "Active",
  },
  {
    id: "dept-006",
    name: "Dairy & Eggs",
    country: "Canada",
    createdBy: "Admin",
    createdOn: "2026-03-10 08:20:00",
    editedOn: "2026-07-20 10:10:00",
    status: "Active",
  },
  {
    id: "dept-007",
    name: "Meat & Seafood",
    country: "Canada",
    createdBy: "Admin",
    createdOn: "2026-03-11 09:00:00",
    editedOn: "2026-07-21 11:00:00",
    status: "Inactive",
  },
  {
    id: "dept-008",
    name: "Frozen Foods",
    country: "United Kingdom",
    createdBy: "Store Manager",
    createdOn: "2026-04-01 12:00:00",
    editedOn: "2026-07-22 14:00:00",
    status: "Active",
  },
  {
    id: "dept-009",
    name: "Personal Care",
    country: "United Kingdom",
    createdBy: "Store Manager",
    createdOn: "2026-04-15 13:00:00",
    editedOn: "2026-07-23 15:00:00",
    status: "Active",
  },
  {
    id: "dept-010",
    name: "Household",
    country: "Australia",
    createdBy: "Admin",
    createdOn: "2026-05-01 10:00:00",
    editedOn: "2026-07-25 09:00:00",
    status: "Active",
  },
];

// ─── Mock Data — Categories ───────────────────────────────────────────────────

export const MOCK_CATEGORIES: CategoryData[] = [
  {
    id: "cat-001",
    name: "Fruits",
    departmentId: "dept-001",
    departmentName: "Produce",
    country: "United States",
    city: "Abbeville",
    createdBy: "Store Manager",
    createdOn: "2026-07-31 16:39:25",
    editedOn: "2026-07-31 05:00:00",
    status: "Active",
  },
  {
    id: "cat-002",
    name: "Soft Drinks",
    departmentId: "dept-002",
    departmentName: "Beverages",
    country: "United States",
    city: "Abbeville",
    createdBy: "Store Manager",
    createdOn: "2026-07-31 16:39:25",
    editedOn: "2026-07-31 05:05:00",
    status: "Active",
  },
  {
    id: "cat-003",
    name: "Desserts",
    departmentId: "dept-003",
    departmentName: "Fruits",
    country: "United States",
    city: "Abbeville",
    createdBy: "Store Manager",
    createdOn: "2026-02-19 16:41:14",
    editedOn: "2026-07-01 06:00:00",
    status: "Active",
  },
  {
    id: "cat-004",
    name: "Desserts",
    departmentId: "dept-003",
    departmentName: "Fruits",
    country: "United States",
    city: "Acworth",
    createdBy: "Store Manager",
    createdOn: "2026-02-19 16:37:54",
    editedOn: "2026-07-10 07:00:00",
    status: "Inactive",
  },
  {
    id: "cat-005",
    name: "Fresh Fruits",
    departmentId: "dept-003",
    departmentName: "Fruits",
    country: "United States",
    city: "Abbeville",
    createdBy: "Store Manager",
    createdOn: "2026-02-19 11:42:36",
    editedOn: "2026-07-15 08:00:00",
    status: "Active",
  },
  {
    id: "cat-006",
    name: "Energy Drinks",
    departmentId: "dept-002",
    departmentName: "Beverages",
    country: "Canada",
    city: "Toronto",
    createdBy: "Admin",
    createdOn: "2026-03-20 10:00:00",
    editedOn: "2026-07-20 10:00:00",
    status: "Active",
  },
  {
    id: "cat-007",
    name: "Croissants",
    departmentId: "dept-005",
    departmentName: "Bakery & Snacks",
    country: "United Kingdom",
    city: "London",
    createdBy: "Store Manager",
    createdOn: "2026-04-05 09:00:00",
    editedOn: "2026-07-22 09:00:00",
    status: "Active",
  },
  {
    id: "cat-008",
    name: "Chips & Crisps",
    departmentId: "dept-005",
    departmentName: "Bakery & Snacks",
    country: "United Kingdom",
    city: "Birmingham",
    createdBy: "Store Manager",
    createdOn: "2026-04-10 11:00:00",
    editedOn: "2026-07-23 11:00:00",
    status: "Inactive",
  },
];

// ─── Mock Data — Items ────────────────────────────────────────────────────────

export const MOCK_ITEMS: ItemData[] = [
  {
    id: "item-001",
    productName: "cupcake",
    storeName: "24/7 Store.",
    categoryId: "cat-003",
    categoryName: "Deserts",
    departmentId: "dept-003",
    departmentName: "Fruits",
    country: "United States",
    createdBy: "Store Manager",
    createdOn: "2026-05-06 02:45:16",
    editedOn: "2026-05-06 02:45:16",
    status: "Active",
    availability: true,
    adminShare: true,
    discountAvailability: true,
  },
  {
    id: "item-002",
    productName: "doughnut",
    storeName: "24/7 Store.",
    categoryId: "cat-003",
    categoryName: "Deserts",
    departmentId: "dept-003",
    departmentName: "Fruits",
    country: "United States",
    createdBy: "Store Manager",
    createdOn: "2026-02-19 16:41:14",
    editedOn: "2026-02-19 16:41:14",
    status: "Active",
    availability: true,
    adminShare: true,
    discountAvailability: true,
  },
  {
    id: "item-003",
    productName: "pudding",
    storeName: "24/7 Store.",
    categoryId: "cat-003",
    categoryName: "Deserts",
    departmentId: "dept-003",
    departmentName: "Fruits",
    country: "United States",
    createdBy: "Store Manager",
    createdOn: "2026-02-19 16:41:14",
    editedOn: "2026-02-19 16:41:14",
    status: "Active",
    availability: true,
    adminShare: true,
    discountAvailability: true,
  },
  {
    id: "item-004",
    productName: "waffles",
    storeName: "24/7 Store.",
    categoryId: "cat-003",
    categoryName: "Deserts",
    departmentId: "dept-003",
    departmentName: "Fruits",
    country: "United States",
    createdBy: "Store Manager",
    createdOn: "2026-02-19 16:41:14",
    editedOn: "2026-02-19 16:41:14",
    status: "Active",
    availability: true,
    adminShare: true,
    discountAvailability: true,
  },
  {
    id: "item-005",
    productName: "brownies",
    storeName: "24/7 Store.",
    categoryId: "cat-003",
    categoryName: "Deserts",
    departmentId: "dept-003",
    departmentName: "Fruits",
    country: "United States",
    createdBy: "Store Manager",
    createdOn: "2026-02-19 16:41:14",
    editedOn: "2026-02-19 16:41:14",
    status: "Active",
    availability: true,
    adminShare: true,
    discountAvailability: false,
  },
  {
    id: "item-006",
    productName: "red velvet cake",
    storeName: "24/7 Store.",
    categoryId: "cat-003",
    categoryName: "Deserts",
    departmentId: "dept-003",
    departmentName: "Fruits",
    country: "United States",
    createdBy: "Store Manager",
    createdOn: "2026-02-19 16:41:14",
    editedOn: "2026-02-19 16:41:14",
    status: "Active",
    availability: true,
    adminShare: true,
    discountAvailability: false,
  },
  {
    id: "item-007",
    productName: "drybread",
    storeName: "24/7 Store.",
    categoryId: "cat-003",
    categoryName: "Deserts",
    departmentId: "dept-003",
    departmentName: "Fruits",
    country: "United States",
    createdBy: "Store Manager",
    createdOn: "2026-02-19 16:41:14",
    editedOn: "2026-02-19 16:41:14",
    status: "Active",
    availability: true,
    adminShare: true,
    discountAvailability: false,
  },
  {
    id: "item-008",
    productName: "muffin",
    storeName: "24/7 Store.",
    categoryId: "cat-003",
    categoryName: "Deserts",
    departmentId: "dept-003",
    departmentName: "Fruits",
    country: "United States",
    createdBy: "Store Manager",
    createdOn: "2026-02-19 16:41:14",
    editedOn: "2026-02-19 16:41:14",
    status: "Active",
    availability: true,
    adminShare: true,
    discountAvailability: true,
  },
];

// ─── Filter & Select Options ──────────────────────────────────────────────────

export const CATALOGUE_STATUS_OPTIONS = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
] as const;

export const CATALOGUE_COUNTRY_OPTIONS = [
  { label: "All Countries", value: "all" },
  { label: "United States", value: "United States" },
  { label: "Canada", value: "Canada" },
  { label: "United Kingdom", value: "United Kingdom" },
  { label: "Australia", value: "Australia" },
];

export const CATALOGUE_DEPARTMENT_OPTIONS = [
  { label: "All Departments", value: "all" },
  ...MOCK_DEPARTMENTS.map((d) => ({ label: d.name, value: d.id })),
];

export const CATALOGUE_CATEGORY_OPTIONS = [
  { label: "All Categories", value: "all" },
  ...MOCK_CATEGORIES.map((c) => ({ label: c.name, value: c.id })),
];

// ─── Stat Configs ─────────────────────────────────────────────────────────────

export const DEPARTMENT_STAT_CONFIG = [
  {
    key: "total" as const,
    label: "Total Departments",
    Icon: Box,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    key: "active" as const,
    label: "Active",
    Icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    key: "inactive" as const,
    label: "Inactive",
    Icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-50",
  },
];

export const CATEGORY_STAT_CONFIG = [
  {
    key: "total" as const,
    label: "Total Categories",
    Icon: Tag,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    key: "active" as const,
    label: "Active",
    Icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    key: "inactive" as const,
    label: "Inactive",
    Icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-50",
  },
];

export const ITEM_STAT_CONFIG = [
  {
    key: "total" as const,
    label: "Total Items",
    Icon: Package,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    key: "active" as const,
    label: "Active",
    Icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    key: "inactive" as const,
    label: "Inactive",
    Icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-50",
  },
];

// ─── Status Style Map ─────────────────────────────────────────────────────────

export const CATALOGUE_STATUS_STYLES: Record<CatalogueStatus, string> = {
  Active: "bg-green-100 text-green-700 border-green-200",
  Inactive: "bg-red-100 text-red-700 border-red-200",
};
