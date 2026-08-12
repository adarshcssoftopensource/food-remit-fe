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

// ─── Filter & Select Options ──────────────────────────────────────────────────
export const CATALOGUE_STATUS_OPTIONS = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
] as const;

export const CATALOGUE_DEPARTMENT_OPTIONS = [{ label: "All Departments", value: "all" }];

export const CATALOGUE_CATEGORY_OPTIONS = [{ label: "All Categories", value: "all" }];

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
