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
  Users,
  CheckCircle2,
  Clock,
  Filter,
  RotateCcw,
  Plus,
  MoreHorizontal,
  Search,
  Store,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

type Vendor = {
  id: string;
  name: string;
  contactEmail: string;
  phone: string;
  storesCount: number;
  status: "ACTIVE" | "PENDING" | "SUSPENDED";
  registrationDate: string;
};

const mockVendors: Vendor[] = [
  {
    id: "1",
    name: "Fresh Farms Inc.",
    contactEmail: "contact@freshfarms.com",
    phone: "+63 912 345 6789",
    storesCount: 4,
    status: "ACTIVE",
    registrationDate: "2023-05-12",
  },
  {
    id: "2",
    name: "Metro Grocers",
    contactEmail: "admin@metrogrocers.ph",
    phone: "+63 987 654 3210",
    storesCount: 12,
    status: "ACTIVE",
    registrationDate: "2023-06-20",
  },
  {
    id: "3",
    name: "Organic Valley",
    contactEmail: "hello@organicvalley.com",
    phone: "+63 945 123 9876",
    storesCount: 1,
    status: "PENDING",
    registrationDate: "2023-08-01",
  },
  {
    id: "4",
    name: "Daily Needs Market",
    contactEmail: "info@dailyneeds.com",
    phone: "+63 911 222 3333",
    storesCount: 3,
    status: "SUSPENDED",
    registrationDate: "2022-11-05",
  },
  {
    id: "5",
    name: "Sunshine Supermart",
    contactEmail: "support@sunshine.ph",
    phone: "+63 999 888 7777",
    storesCount: 7,
    status: "ACTIVE",
    registrationDate: "2023-01-15",
  },
];

const columns: ColumnDef<Vendor>[] = [
  {
    accessorKey: "name",
    header: "Vendor Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 font-bold text-indigo-600 dark:bg-slate-800">
          {row.original.name.charAt(0)}
        </div>
        <div>
          <p className="font-bold text-slate-900 dark:text-white">{row.original.name}</p>
          <p className="text-xs text-slate-500">{row.original.contactEmail}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
        {row.original.phone}
      </span>
    ),
  },
  {
    accessorKey: "storesCount",
    header: "Stores",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Store className="h-4 w-4 text-slate-400" />
        <span className="font-bold">{row.original.storesCount}</span>
      </div>
    ),
  },
  {
    accessorKey: "registrationDate",
    header: "Registration Date",
    cell: ({ row }) => (
      <span className="text-sm text-slate-500">
        {new Date(row.original.registrationDate).toLocaleDateString()}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const config = {
        ACTIVE: { color: "text-emerald-700 bg-emerald-50 border-emerald-200", icon: CheckCircle2 },
        PENDING: { color: "text-amber-700 bg-amber-50 border-amber-200", icon: Clock },
        SUSPENDED: { color: "text-red-700 bg-red-50 border-red-200", icon: RotateCcw },
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

export function VendorsManagement() {
  const [search, setSearch] = useState("");

  const totalVendors = 154;
  const activeVendors = 142;
  const pendingVendors = 12;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Vendors
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage platform vendors, their global accounts, and access permissions.
          </p>
        </div>
        <Button className="flex items-center gap-2 rounded-full bg-indigo-600 px-6 text-white hover:bg-indigo-700">
          <Plus className="h-4 w-4" /> Add Vendor
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex items-start justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-500 uppercase">
              <span className="h-2 w-2 rounded-full bg-indigo-500"></span> TOTAL VENDORS
            </p>
            <p className="mt-3 text-4xl font-black text-indigo-600">{totalVendors}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-indigo-100 bg-indigo-50 text-indigo-600">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-start justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-500 uppercase">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span> ACTIVE ACCOUNTS
            </p>
            <p className="mt-3 text-4xl font-black text-emerald-600">{activeVendors}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-start justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-500 uppercase">
              <span className="h-2 w-2 rounded-full bg-amber-500"></span> PENDING APPROVAL
            </p>
            <p className="mt-3 text-4xl font-black text-amber-600">{pendingVendors}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-100 bg-amber-50 text-amber-600">
            <Clock className="h-5 w-5" />
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
              <p className="text-sm font-semibold">Filter Vendors</p>
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
                placeholder="Search vendors by name or email..."
                className="bg-white pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="pl-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Sort By
            </label>
            <Select defaultValue="newest">
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Newest" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name_asc">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="text-card-foreground overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:bg-slate-900">
        <div className="flex items-center gap-3 border-b border-slate-50 p-6 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg leading-none font-bold tracking-tight">Vendor Directory</h3>
            </div>
            <p className="mt-1.5 text-xs text-slate-500">{totalVendors} vendors found</p>
          </div>
        </div>
        <div className="p-6">
          <DataTable columns={columns} data={mockVendors} loading={false} hidePagination={true} />
        </div>
      </div>
    </div>
  );
}
