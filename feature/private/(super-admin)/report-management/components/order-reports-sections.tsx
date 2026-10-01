"use client";

import { FileSpreadsheet, Loader2, Store, TableProperties } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetStores } from "@/feature/private/(super-admin)/store-management/hooks/use-get-stores";

const FOOD_TYPE_OPTIONS = [
  { label: "All Food Types", value: "All" },
  { label: "Food Sent", value: "1" },
  { label: "Food Requested", value: "2" },
  { label: "Food Received", value: "3" },
];

interface OrderReportFilterFieldsProps {
  isStoreScoped: boolean;
  draftStoreId: string;
  onDraftStoreIdChange: (storeId: string) => void;
  storesList: ReturnType<typeof useGetStores>["data"];
  draftFoodType: string;
  onDraftFoodTypeChange: (foodType: string) => void;
}

export function OrderReportFilterFields({
  isStoreScoped,
  draftStoreId,
  onDraftStoreIdChange,
  storesList,
  draftFoodType,
  onDraftFoodTypeChange,
}: OrderReportFilterFieldsProps) {
  return (
    <>
      {!isStoreScoped && (
        <div className="min-w-36 flex-1 space-y-1.5 sm:min-w-44">
          <Label className="block truncate text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Store
          </Label>
          <Select value={draftStoreId} onValueChange={(v) => onDraftStoreIdChange(v ?? "all")}>
            <SelectTrigger className="h-10 rounded-xl">
              <SelectValue placeholder="All Stores">
                {draftStoreId === "all"
                  ? "All Stores"
                  : storesList?.find((s) => s.id === draftStoreId)?.storeName || "Selected Store"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Stores</SelectItem>
                {storesList?.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.storeName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="min-w-36 flex-1 space-y-1.5 sm:min-w-44">
        <Label className="block truncate text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          Food Type
        </Label>
        <Select value={draftFoodType} onValueChange={(v) => onDraftFoodTypeChange(v ?? "All")}>
          <SelectTrigger className="h-10 rounded-xl">
            <SelectValue placeholder="Select Food Type">
              {FOOD_TYPE_OPTIONS.find((opt) => opt.value === draftFoodType)?.label}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {FOOD_TYPE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}

interface OrderReportsTableHeaderProps {
  title: string;
  isStoreScoped: boolean;
  userStoreName?: string;
  total: number;
  isFetching: boolean;
  isExporting: boolean;
  isLoading: boolean;
  onExport: () => void;
}

export function OrderReportsTableHeader({
  title,
  isStoreScoped,
  userStoreName,
  total,
  isFetching,
  isExporting,
  isLoading,
  onExport,
}: OrderReportsTableHeaderProps) {
  return (
    <>
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 text-primary ring-primary/20 flex size-10 items-center justify-center rounded-xl ring-1">
          <TableProperties className="h-5 w-5" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              {title}
            </CardTitle>
            {isStoreScoped && userStoreName && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <Store className="size-3.5" />
                {userStoreName}
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-xs">
            {total} total {total === 1 ? "entry" : "entries"} found
            {isFetching && <span className="text-primary ml-2 font-semibold">(Updating...)</span>}
          </p>
        </div>
      </div>

      <Button
        disabled={isExporting || isLoading}
        onClick={onExport}
        className="h-9 gap-2 rounded-full bg-emerald-600 px-4 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700 disabled:opacity-50"
      >
        {isExporting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <FileSpreadsheet className="size-4" />
        )}
        <span>Export Excel</span>
      </Button>
    </>
  );
}
