"use client";

import { Plus, Star, Trash2 } from "lucide-react";

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
import { ITEM_LIMITS, WEIGHT_UNITS } from "@/lib/catalogue/item-rules";
import { cn } from "@/lib/utils";

export type PackSizeOptionRow = {
  key: string;
  id?: string;
  optionName: string;
  quantityPerPack?: string;
  netWeight?: string;
  weightUnit: string;
  price?: string;
};

export type PackSizeOptionErrors = Partial<Record<keyof PackSizeOptionRow, string>>;

export function createPackSizeOptionRow(
  overrides: Partial<PackSizeOptionRow> = {},
): PackSizeOptionRow {
  return {
    key: `pack-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    optionName: "",
    quantityPerPack: "",
    netWeight: "",
    weightUnit: "",
    price: "",
    ...overrides,
  };
}

type PackSizeOptionsFieldProps = {
  value: PackSizeOptionRow[];
  onChange: (rows: PackSizeOptionRow[]) => void;
  currencySymbol?: string | null;
  rowErrors?: Array<PackSizeOptionErrors | undefined>;
  disabled?: boolean;
  className?: string;
};

const NO_UNIT = "__none__";
const GRID =
  "md:grid md:grid-cols-[2.25rem_minmax(0,2.4fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,1.3fr)_4.75rem] md:items-start md:gap-3";
const fieldClass = "h-10 rounded-lg shadow-none";
const mobileLabelClass = "mb-1.5 block text-[11px] font-semibold text-slate-500 md:hidden";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-destructive mt-1 text-[11px] leading-4">{message}</p>;
}

export function PackSizeOptionsField({
  value,
  onChange,
  currencySymbol,
  rowErrors,
  disabled,
  className,
}: PackSizeOptionsFieldProps) {
  const rows = Array.isArray(value) ? value : [];
  const canAdd = rows.length < ITEM_LIMITS.maxOptions;

  const updateRow = (key: string, field: keyof PackSizeOptionRow, fieldValue: string) => {
    onChange(rows.map((row) => (row.key === key ? { ...row, [field]: fieldValue } : row)));
  };

  const removeRow = (key: string) => onChange(rows.filter((row) => row.key !== key));

  const makeDefault = (key: string) => {
    const row = rows.find((r) => r.key === key);
    if (!row) return;
    onChange([row, ...rows.filter((r) => r.key !== key)]);
  };

  const pricePadding = currencySymbol ? (currencySymbol.length > 1 ? "pl-11" : "pl-7") : "";

  return (
    <div className={cn("space-y-3", className)}>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div
          className={cn(
            "hidden border-b border-slate-100 bg-slate-50/80 px-3 py-2.5 text-[11px] font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400",
            GRID,
          )}
        >
          <span className="text-center">#</span>
          <span>
            Option name <span className="text-destructive">*</span>
          </span>
          <span>Qty per pack</span>
          <span>Net weight</span>
          <span>Unit</span>
          <span>
            Price <span className="text-destructive">*</span>
          </span>
          <span className="sr-only">Actions</span>
        </div>

        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {rows.map((row, index) => {
            const errors = rowErrors?.[index];
            const isDefault = index === 0;
            const units =
              row.weightUnit && !(WEIGHT_UNITS as readonly string[]).includes(row.weightUnit)
                ? [row.weightUnit, ...WEIGHT_UNITS]
                : [...WEIGHT_UNITS];

            return (
              <li
                key={row.key}
                className={cn(
                  "grid grid-cols-2 gap-3 p-3 transition-colors",
                  GRID,
                  isDefault && "bg-primary/3",
                )}
              >
                <div className="col-span-2 flex items-center justify-between md:col-span-1 md:block md:pt-2">
                  <span
                    title={isDefault ? "Default option — sets the item's base price" : undefined}
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold md:mx-auto",
                      isDefault
                        ? "bg-primary text-white"
                        : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
                    )}
                  >
                    {index + 1}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 md:hidden">
                    {isDefault ? "Default option" : `Option ${index + 1}`}
                  </span>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className={mobileLabelClass}>Option name *</label>
                  <Input
                    value={row.optionName}
                    onChange={(e) => updateRow(row.key, "optionName", e.target.value)}
                    maxLength={ITEM_LIMITS.optionNameMax}
                    placeholder="e.g. 1 Litre Bottle"
                    disabled={disabled}
                    aria-invalid={!!errors?.optionName}
                    aria-label={`Option ${index + 1} name`}
                    className={fieldClass}
                  />
                  <FieldError message={errors?.optionName} />
                </div>

                <div>
                  <label className={mobileLabelClass}>Qty per pack</label>
                  <NumericInput
                    value={row.quantityPerPack}
                    onValueChange={(v) => updateRow(row.key, "quantityPerPack", v)}
                    placeholder="1"
                    disabled={disabled}
                    aria-invalid={!!errors?.quantityPerPack}
                    aria-label={`Option ${index + 1} quantity per pack`}
                    className={fieldClass}
                  />
                  <FieldError message={errors?.quantityPerPack} />
                </div>

                <div>
                  <label className={mobileLabelClass}>Net weight</label>
                  <NumericInput
                    decimals={3}
                    value={row.netWeight}
                    onValueChange={(v) => updateRow(row.key, "netWeight", v)}
                    placeholder="0"
                    disabled={disabled}
                    aria-invalid={!!errors?.netWeight}
                    aria-label={`Option ${index + 1} net weight`}
                    className={fieldClass}
                  />
                  <FieldError message={errors?.netWeight} />
                </div>

                <div>
                  <label className={mobileLabelClass}>Unit</label>
                  <Select
                    value={row.weightUnit || NO_UNIT}
                    onValueChange={(val) =>
                      updateRow(row.key, "weightUnit", !val || val === NO_UNIT ? "" : String(val))
                    }
                    disabled={disabled}
                  >
                    <SelectTrigger
                      aria-invalid={!!errors?.weightUnit}
                      aria-label={`Option ${index + 1} unit`}
                      className={cn(fieldClass, "w-full")}
                    >
                      <SelectValue placeholder="Unit">
                        {(val: string) => (!val || val === NO_UNIT ? "—" : val)}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NO_UNIT}>No unit</SelectItem>
                      {units.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError message={errors?.weightUnit} />
                </div>

                <div>
                  <label className={mobileLabelClass}>Price *</label>
                  <div className="relative">
                    {currencySymbol && (
                      <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-semibold text-slate-400">
                        {currencySymbol}
                      </span>
                    )}
                    <NumericInput
                      decimals={2}
                      value={row.price}
                      onValueChange={(v) => updateRow(row.key, "price", v)}
                      placeholder="0.00"
                      disabled={disabled}
                      aria-invalid={!!errors?.price}
                      aria-label={`Option ${index + 1} price`}
                      className={cn(fieldClass, "font-semibold tabular-nums", pricePadding)}
                    />
                  </div>
                  <FieldError message={errors?.price} />
                </div>

                <div className="col-span-2 flex items-center justify-end gap-1 md:col-span-1 md:pt-0">
                  {!isDefault && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => makeDefault(row.key)}
                      disabled={disabled}
                      title="Make this the default option"
                      aria-label={`Make option ${index + 1} the default`}
                      className="h-10 w-9 text-slate-400 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-950/30"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRow(row.key)}
                    disabled={disabled || rows.length <= 1}
                    title={rows.length <= 1 ? "At least one pack / size is required" : "Remove"}
                    aria-label={`Remove option ${index + 1}`}
                    className="h-10 w-9 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30 dark:hover:bg-red-950/30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-[11px] leading-4 text-slate-500">
          <span className="bg-primary flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white">
            1
          </span>
          The first option is the default and sets the item&apos;s base price. Use
          <Star className="h-3 w-3" /> to change it.
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => onChange([...rows, createPackSizeOptionRow()])}
          disabled={disabled || !canAdd}
          className="hover:border-primary/40 hover:bg-primary/5 hover:text-primary h-9 shrink-0 rounded-lg border-dashed font-semibold"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Add pack / size
        </Button>
      </div>
    </div>
  );
}
