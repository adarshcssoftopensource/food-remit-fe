"use client";

import { format, parse, startOfToday } from "date-fns";
import { CalendarDays, CalendarRange, Info, Store } from "lucide-react";
import type { ReactNode } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { DatePicker } from "@/components/ui/date-picker";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

import { BASKET_WEEKDAYS } from "../../../../../../../constants/basket.constants";
import { ALL_WEEKDAYS, type BasketFormValues } from "../../../schema/basket-form.schema";
import { SectionCard } from "../section-card";

const DATE_FORMAT = "yyyy-MM-dd";
const toDate = (value: string | null) =>
  value ? parse(value, DATE_FORMAT, new Date()) : undefined;
const toKey = (date?: Date) => (date ? format(date, DATE_FORMAT) : null);

function ModeOption({
  active,
  onSelect,
  icon,
  title,
  description,
  trailing,
  children,
}: {
  active: boolean;
  onSelect: () => void;
  icon: ReactNode;
  title: string;
  description: string;
  trailing?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border-2 p-4 transition-all",
        active
          ? "border-primary bg-emerald-50/50 shadow-sm dark:bg-emerald-950/20"
          : "border-slate-200/80 hover:border-emerald-200 dark:border-slate-800",
      )}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          role="radio"
          aria-checked={active}
          onClick={onSelect}
          className="flex min-w-0 flex-1 items-start gap-3 text-left"
        >
          <span
            className={cn(
              "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
              active ? "border-primary" : "border-slate-300",
            )}
          >
            {active && <span className="bg-primary size-2.5 rounded-full" />}
          </span>
          <span className="min-w-0">
            <span className="flex items-center gap-1.5 text-sm font-bold text-slate-900 dark:text-white">
              {icon}
              {title}
            </span>
            <span className="text-muted-foreground mt-0.5 block text-xs">{description}</span>
          </span>
        </button>
        {trailing}
      </div>
      {children}
    </div>
  );
}

export function AvailabilitySection({ hasIssue }: { hasIssue?: boolean }) {
  const { control, setValue, getValues } = useFormContext<BasketFormValues>();
  const [mode, from, until, days] = useWatch({
    control,
    name: ["availabilityMode", "availableFrom", "availableUntil", "availableDays"],
  });
  const opts = { shouldDirty: true };
  const isCustom = mode === "CUSTOM";

  const setMode = (next: BasketFormValues["availabilityMode"]) => {
    setValue("availabilityMode", next, opts);
    if (next === "CUSTOM" && getValues("availableDays").length === 0) {
      setValue("availableDays", ALL_WEEKDAYS, opts);
    }
  };

  const toggleDay = (day: string) => {
    const current = getValues("availableDays");
    const next = current.includes(day) ? current.filter((d) => d !== day) : [...current, day];
    setValue(
      "availableDays",
      ALL_WEEKDAYS.filter((d) => next.includes(d)),
      opts,
    );
  };

  const fromDate = toDate(from);
  const untilDate = toDate(until);

  return (
    <SectionCard
      id="availability"
      step={5}
      title="Basket Availability"
      description="Choose when this basket is available for customers to order."
      hasIssue={hasIssue}
    >
      <div role="radiogroup" aria-label="Basket availability" className="grid gap-3 lg:grid-cols-2">
        <ModeOption
          active={!isCustom}
          onSelect={() => setMode("STORE_HOURS")}
          icon={<Store className="text-primary size-4" />}
          title="Follow store operating hours"
          description="Basket will follow your store's regular opening hours."
          trailing={
            <Switch
              checked={!isCustom}
              onCheckedChange={(checked) => setMode(checked ? "STORE_HOURS" : "CUSTOM")}
              aria-label="Follow store operating hours"
            />
          }
        />

        <ModeOption
          active={isCustom}
          onSelect={() => setMode("CUSTOM")}
          icon={<CalendarRange className="text-primary size-4" />}
          title="Custom basket schedule"
          description="Set specific dates and days for this basket, e.g. a Christmas basket."
        >
          <div
            className={cn(
              "mt-4 space-y-3 pl-8 transition-opacity",
              !isCustom && "pointer-events-none opacity-50",
            )}
            aria-disabled={!isCustom}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <CalendarDays className="size-3.5" /> Start Date
                </p>
                <DatePicker
                  date={fromDate}
                  setDate={(d) => setValue("availableFrom", toKey(d), opts)}
                  minDate={startOfToday()}
                  maxDate={untilDate}
                  placeholder="Select start date"
                />
              </div>
              <div className="space-y-1">
                <p className="flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <CalendarDays className="size-3.5" /> End Date
                </p>
                <DatePicker
                  date={untilDate}
                  setDate={(d) => setValue("availableUntil", toKey(d), opts)}
                  minDate={fromDate ?? startOfToday()}
                  placeholder="Select end date"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Select available days
              </p>
              <div className="flex flex-wrap gap-1.5">
                {BASKET_WEEKDAYS.map((day) => {
                  const selected = days.includes(day.value);
                  return (
                    <button
                      key={day.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleDay(day.value)}
                      className={cn(
                        "h-8 min-w-12 rounded-full px-3 text-xs font-semibold transition-all",
                        selected
                          ? "bg-primary text-white shadow-sm shadow-emerald-600/20"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400",
                      )}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </ModeOption>
      </div>

      <p className="text-muted-foreground mt-3 flex items-start gap-1.5 text-xs">
        <Info className="mt-px size-3.5 shrink-0" />A custom schedule never extends beyond your
        store&apos;s opening hours. Orders are only fulfilled when the store is open.
      </p>
    </SectionCard>
  );
}
