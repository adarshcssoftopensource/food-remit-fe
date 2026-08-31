"use client";

import { DataTable } from "@/components/common/data-table/data-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Store,
  CheckCircle2,
  XCircle,
  Filter,
  RotateCcw,
  Plus,
  MoreHorizontal,
  Search,
  MapPin,
  User,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

type VendorStore = {
  id: string;
  storeName: string;
  vendorName: string;
  location: string;
  managerName: string;
  status: "ACTIVE" | "INACTIVE";
};

const mockStores: VendorStore[] = [
  {
    id: "1",
    storeName: "Fresh Farms - Manila",
    vendorName: "Fresh Farms Inc.",
    location: "Manila, PH",
    managerName: "Juan Dela Cruz",
    status: "ACTIVE",
  },
  {
    id: "2",
    storeName: "Fresh Farms - Cebu",
    vendorName: "Fresh Farms Inc.",
    location: "Cebu City, PH",
    managerName: "Maria Santos",
    status: "ACTIVE",
  },
  {
    id: "3",
    storeName: "Metro Grocers Makati",
    vendorName: "Metro Grocers",
    location: "Makati, PH",
    managerName: "Carlos Reyes",
    status: "ACTIVE",
  },
  {
    id: "4",
    storeName: "Daily Needs Market QC",
    vendorName: "Daily Needs Market",
    location: "Quezon City, PH",
    managerName: "Unassigned",
    status: "INACTIVE",
  },
  {
    id: "5",
    storeName: "Sunshine Davao",
    vendorName: "Sunshine Supermart",
    location: "Davao City, PH",
    managerName: "Anna Lim",
    status: "ACTIVE",
  },
];

const columns: ColumnDef<VendorStore>[] = [
  {
    accessorKey: "storeName",
    header: "Store Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-slate-800">
          <Store className="h-5 w-5" />
        </div>
        <div>
          <p className="font-bold text-slate-900 dark:text-white">{row.original.storeName}</p>
          <p className="text-xs text-slate-500">{row.original.vendorName}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-slate-400" />
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {row.original.location}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "managerName",
    header: "Store Manager",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-slate-400" />
        <span
          className={`text-sm font-medium ${row.original.managerName === "Unassigned" ? "text-red-500 italic" : "text-slate-600 dark:text-slate-400"}`}
        >
          {row.original.managerName}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const config = {
        ACTIVE: { color: "text-emerald-700 bg-emerald-50 border-emerald-200", icon: CheckCircle2 },
        INACTIVE: { color: "text-slate-700 bg-slate-50 border-slate-200", icon: XCircle },
      }[status];
      const Icon = config.icon;
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold tracking-wider uppercase ${config.color}`}
        >
          <Icon className="h-3 w-3" /> {status}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: () => (
      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-700">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    ),
  },
];

export function VendorAccountsManagement() {
  const [search, setSearch] = useState("");

  const totalStores = 450;
  const activeStores = 412;
  const inactiveStores = 38;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Vendor Stores
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage individual physical or digital store locations belonging to vendors.
          </p>
        </div>
        <Button className="flex items-center gap-2 rounded-full bg-purple-600 px-6 text-white hover:bg-purple-700">
          <Plus className="h-4 w-4" /> Add Store
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex items-start justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-500 uppercase">
              <span className="h-2 w-2 rounded-full bg-purple-500"></span> TOTAL STORES
            </p>
            <p className="mt-3 text-4xl font-black text-purple-600">{totalStores}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-purple-100 bg-purple-50 text-purple-600">
            <Store className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-start justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-500 uppercase">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span> ACTIVE STORES
            </p>
            <p className="mt-3 text-4xl font-black text-emerald-600">{activeStores}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-start justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-500 uppercase">
              <span className="h-2 w-2 rounded-full bg-slate-400"></span> INACTIVE / SUSPENDED
            </p>
            <p className="mt-3 text-4xl font-black text-slate-600">{inactiveStores}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600">
            <XCircle className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600 dark:bg-slate-800">
              <Filter className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold">Filter Stores</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="flex gap-2 text-slate-400 hover:text-slate-600"
          >
            <RotateCcw className="h-3 w-3" /> Reset Filters
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-1 md:col-span-2">
            <label className="pl-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Search
            </label>
            <div className="relative">
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by store name or vendor..."
                className="bg-white pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="pl-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Location
            </label>
            <Select defaultValue="all">
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="pl-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Status
            </label>
            <Select defaultValue="all">
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="text-card-foreground overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:bg-slate-900">
        <div className="flex items-center gap-3 border-b border-slate-50 p-6 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 text-purple-600">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg leading-none font-bold tracking-tight">Stores Directory</h3>
            </div>
            <p className="mt-1.5 text-xs text-slate-500">{totalStores} stores found</p>
          </div>
        </div>
        <div className="p-6">
          <DataTable columns={columns} data={mockStores} loading={false} hidePagination={true} />
        </div>
      </div>
    </div>
  );
}
