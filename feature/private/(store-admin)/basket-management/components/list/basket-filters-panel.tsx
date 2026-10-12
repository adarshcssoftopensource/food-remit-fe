"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";

import { NumericInput } from "@/components/common/numeric-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  BASKET_TYPE_MAP,
  BASKET_TYPE_OPTIONS,
  HOUSEHOLD_SIZE_OPTIONS,
} from "../../../../../../constants/basket.constants";
import type { BasketAdvancedFilters } from "../../types/basket.types";

export const EMPTY_BASKET_FILTERS: BasketAdvancedFilters = {
  basketType: "",
  itemSearch: "",
  categoryId: "",
  minPrice: "",
  maxPrice: "",
  priceBasis: "customer",
  householdSize: "",
  availabilityMode: "",
  discounted: "",
};

/** Number of filters currently narrowing the list */
export function countActiveFilters(filters: BasketAdvancedFilters): number {
  const keys: (keyof BasketAdvancedFilters)[] = [
    "basketType",
    "itemSearch",
    "categoryId",
    "householdSize",
    "availabilityMode",
    "discounted",
  ];
  const priceSet = filters.minPrice !== "" || filters.maxPrice !== "";
  return keys.filter((k) => String(filters[k]).trim() !== "").length + (priceSet ? 1 : 0);
}

const ANY = "__any__";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <span className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">{label}</span>
      {children}
    </label>
  );
}

function OptionSelect({
  value,
  onChange,
  anyLabel,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  anyLabel: string;
  options: { value: string; label: string }[];
}) {
  const selected = options.find((o) => o.value === value);
  return (
    <Select value={value || ANY} onValueChange={(v) => onChange(!v || v === ANY ? "" : String(v))}>
      <SelectTrigger className="h-10 w-full rounded-xl">
        <SelectValue>{selected?.label ?? anyLabel}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ANY}>{anyLabel}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

interface BasketFiltersPanelProps {
  filters: BasketAdvancedFilters;
  onChange: (filters: BasketAdvancedFilters) => void;
  categories: { id: string; categoryName: string }[];
  currencySymbol?: string;
}

export function BasketFiltersPanel({
  filters,
  onChange,
  categories,
  currencySymbol,
}: BasketFiltersPanelProps) {
  const set = <K extends keyof BasketAdvancedFilters>(key: K, value: BasketAdvancedFilters[K]) =>
    onChange({ ...filters, [key]: value });
  const active = countActiveFilters(filters);

  return (
    <div className="space-y-4 border-b border-slate-100 bg-slate-50/60 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/40">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Field label="Contains item">
          <Input
            value={filters.itemSearch}
            onChange={(e) => set("itemSearch", e.target.value)}
            placeholder="e.g. Rice, Bread, Soap"
            className="h-10 rounded-xl bg-white dark:bg-slate-950"
          />
        </Field>

        <Field label="Item category">
          <OptionSelect
            value={filters.categoryId}
            onChange={(v) => set("categoryId", v)}
            anyLabel="Any category"
            options={categories.map((c) => ({ value: c.id, label: c.categoryName }))}
          />
        </Field>

        <Field label="Price range">
          <div className="flex items-center gap-2">
            <NumericInput
              value={filters.minPrice}
              onValueChange={(v) => set("minPrice", v)}
              decimals={2}
              placeholder={`Min${currencySymbol ? ` ${currencySymbol}` : ""}`}
              className="h-10 min-w-0 rounded-xl bg-white tabular-nums dark:bg-slate-950"
            />
            <span className="text-slate-400">–</span>
            <NumericInput
              value={filters.maxPrice}
              onValueChange={(v) => set("maxPrice", v)}
              decimals={2}
              placeholder={`Max${currencySymbol ? ` ${currencySymbol}` : ""}`}
              className="h-10 min-w-0 rounded-xl bg-white tabular-nums dark:bg-slate-950"
            />
          </div>
        </Field>

        <Field label="Price applies to">
          <OptionSelect
            value={filters.priceBasis === "customer" ? "" : filters.priceBasis}
            onChange={(v) => set("priceBasis", v === "vendor" ? "vendor" : "customer")}
            anyLabel="Customer price"
            options={[{ value: "vendor", label: "Vendor basket price" }]}
          />
        </Field>

        <Field label="Template">
          <OptionSelect
            value={filters.basketType}
            onChange={(v) => set("basketType", v as BasketAdvancedFilters["basketType"])}
            anyLabel="Any template"
            options={BASKET_TYPE_OPTIONS.map((o) => ({
              value: o.value,
              label: BASKET_TYPE_MAP[o.value].label,
            }))}
          />
        </Field>

        <Field label="Household size">
          <OptionSelect
            value={filters.householdSize}
            onChange={(v) => set("householdSize", v)}
            anyLabel="Any size"
            options={HOUSEHOLD_SIZE_OPTIONS}
          />
        </Field>

        <Field label="Availability">
          <OptionSelect
            value={filters.availabilityMode}
            onChange={(v) =>
              set("availabilityMode", v as BasketAdvancedFilters["availabilityMode"])
            }
            anyLabel="Any availability"
            options={[
              { value: "STORE_HOURS", label: "Store hours" },
              { value: "CUSTOM", label: "Custom schedule" },
            ]}
          />
        </Field>

        <Field label="Basket pricing">
          <OptionSelect
            value={filters.discounted}
            onChange={(v) => set("discounted", v as BasketAdvancedFilters["discounted"])}
            anyLabel="Any pricing"
            options={[
              { value: "true", label: "Discount or manual price" },
              { value: "false", label: "Items total" },
            ]}
          />
        </Field>
      </div>

      {active > 0 && (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange(EMPTY_BASKET_FILTERS)}
            className="h-9 rounded-xl text-slate-600"
          >
            <X className="size-4" /> Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
