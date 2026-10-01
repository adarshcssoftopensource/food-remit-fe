"use client";

import Image from "next/image";
import {
  ClipboardList,
  FileSpreadsheet,
  Globe,
  MapPin,
  Maximize2,
  Phone,
  ShoppingBag,
  Store,
  TableProperties,
  User,
} from "lucide-react";

import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { StoreReportRow } from "@/constants/report-management";

const FOOD_TYPE_OPTIONS = [
  { label: "All Food Types", value: "All" },
  { label: "Food Sent", value: "1" },
  { label: "Food Requested", value: "2" },
  { label: "Food Received", value: "3" },
];

interface StoreReportBannerProps {
  store: StoreReportRow;
  totalOrdersCount: number;
  onImageClick: (url: string) => void;
}

export function StoreReportBanner({
  store,
  totalOrdersCount,
  onImageClick,
}: StoreReportBannerProps) {
  const storeLocation = [store.city, store.state, store.country].filter(Boolean).join(", ");

  return (
    <Card className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="grid items-stretch gap-6 md:grid-cols-12">
        <div className="flex flex-col md:col-span-5">
          <button
            type="button"
            disabled={!store.image}
            onClick={() => store.image && onImageClick(store.image)}
            className={`group relative h-52 min-h-[200px] w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 md:h-full dark:border-slate-800 dark:bg-slate-800 ${
              store.image ? "cursor-pointer" : ""
            }`}
          >
            {store.image ? (
              <>
                <Image
                  src={store.image}
                  fill
                  sizes="(min-width: 768px) 42vw, 100vw"
                  alt={store.storeName}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100">
                  <div className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/25 px-4 py-2 text-xs font-bold text-white shadow-lg">
                    <Maximize2 className="size-4" />
                    <span>Click to Maximize</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400">
                <Store className="size-14" />
              </div>
            )}
          </button>
        </div>

        <div className="flex flex-col justify-between space-y-4 md:col-span-7">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                  {store.storeName}
                </h2>
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  #{store.id.slice(-6).toUpperCase()}
                </span>
              </div>
              <StatusBadge
                status={store.status || "Active"}
                className="rounded-full px-3 py-0.5 text-xs font-bold"
              />
            </div>

            <div className="mt-3.5 grid gap-2.5 text-xs text-slate-600 sm:grid-cols-2 dark:text-slate-400">
              <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 dark:border-slate-800/60 dark:bg-slate-800/40">
                <MapPin className="mt-0.5 size-4 shrink-0 text-orange-500" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    Store Address
                  </p>
                  <p className="line-clamp-2 font-semibold text-slate-800 dark:text-slate-200">
                    {store.address || "No address provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 dark:border-slate-800/60 dark:bg-slate-800/40">
                <Phone className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    Contact Phone
                  </p>
                  <p className="truncate font-mono font-semibold text-slate-800 dark:text-slate-200">
                    {store.phone || "-"}
                  </p>
                </div>
              </div>

              {storeLocation && (
                <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 dark:border-slate-800/60 dark:bg-slate-800/40">
                  <Globe className="mt-0.5 size-4 shrink-0 text-blue-500" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      City / Country
                    </p>
                    <p className="truncate font-semibold text-slate-800 dark:text-slate-200">
                      {storeLocation}
                    </p>
                  </div>
                </div>
              )}

              {store.manager?.name && (
                <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 dark:border-slate-800/60 dark:bg-slate-800/40">
                  <User className="mt-0.5 size-4 shrink-0 text-purple-500" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      Manager
                    </p>
                    <p className="truncate font-semibold text-slate-800 dark:text-slate-200">
                      {store.manager.name}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200/70 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400">
              <ShoppingBag className="size-3.5" />
              <span>Total Revenue: {store.earnings?.totalSales || "$0.00"}</span>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-blue-200/70 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-400">
              <ClipboardList className="size-3.5" />
              <span>Total Orders: {totalOrdersCount}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export interface StoreManagerRow {
  label: string;
  value?: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function StoreManagerOverviewCard({ managerRows }: { managerRows: StoreManagerRow[] }) {
  return (
    <Card className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <CardHeader className="border-b border-slate-100 p-0 pb-3 dark:border-slate-800">
        <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
          Store Manager & Financial Overview
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 pt-3">
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {managerRows.map((row) => {
            const Icon = row.icon;
            return (
              <div
                key={row.label}
                className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 dark:border-slate-800/80 dark:bg-slate-800/50"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400">
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                    {row.label}
                  </p>
                  <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-200">
                    {row.value || "-"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

interface StoreOrdersCardHeaderProps {
  totalOrdersCount: number;
  isOrdersFetching: boolean;
  foodType: string;
  onFoodTypeChange: (val: string | null) => void;
  isExporting: boolean;
  onExport: () => void;
}

export function StoreOrdersCardHeader({
  totalOrdersCount,
  isOrdersFetching,
  foodType,
  onFoodTypeChange,
  isExporting,
  onExport,
}: StoreOrdersCardHeaderProps) {
  return (
    <CardHeader className="flex flex-col gap-3 border-b border-slate-100 p-0 pb-3 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
      <div className="flex items-center gap-2.5">
        <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
          <TableProperties className="size-5" />
        </div>
        <div>
          <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
            Store Orders
          </CardTitle>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {totalOrdersCount} total {totalOrdersCount === 1 ? "order" : "orders"} found
            {isOrdersFetching && (
              <span className="ml-1.5 font-semibold text-emerald-600">(Updating...)</span>
            )}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select value={foodType} onValueChange={onFoodTypeChange}>
          <SelectTrigger className="h-9 w-37.5 rounded-xl text-xs font-medium">
            <SelectValue placeholder="Food Type" />
          </SelectTrigger>
          <SelectContent>
            {FOOD_TYPE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          disabled={isExporting}
          isLoading={isExporting}
          onClick={onExport}
          className="h-9 gap-2 rounded-xl bg-emerald-600 px-4 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700"
        >
          <FileSpreadsheet className="size-4" />
          <span>Export Excel</span>
        </Button>
      </div>
    </CardHeader>
  );
}
