"use client";

import {
  addDays,
  differenceInCalendarDays,
  format,
  isAfter,
  isBefore,
  isSameDay,
  parse,
  startOfToday,
  startOfWeek,
} from "date-fns";
import {
  CalendarCheck2,
  CalendarDays,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Eye,
  Info,
  Store,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { DatePicker } from "@/components/ui/date-picker";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

import { BASKET_WEEKDAYS } from "../../../../../../../constants/basket.constants";
import { ALL_WEEKDAYS, type BasketFormValues } from "../../../schema/basket-form.schema";
import { describeAvailability } from "../../../utils/basket-availability";
import { SectionCard } from "../section-card";

const DATE_FORMAT = "yyyy-MM-dd";
const toDate = (value: string | null) =>
  value ? parse(value, DATE_FORMAT, new Date()) : undefined;
const toKey = (date?: Date) => (date ? format(date, DATE_FORMAT) : null);

const PREVIEW_WEEKS = 4;
const weekdayKey = (date: Date) => format(date, "EEE").toUpperCase();

function AvailabilityPreview({
  isCustom,
  from,
  until,
  days,
  onPick,
}: {
  isCustom: boolean;
  from?: Date;
  until?: Date;
  days: string[];
  onPick: (date: Date) => void;
}) {
  const today = startOfToday();
  const firstWeek = startOfWeek(today, { weekStartsOn: 1 });
  const [gridStart, setGridStart] = useState(() =>
    startOfWeek(isCustom && from && isAfter(from, today) ? from : today, { weekStartsOn: 1 }),
  );
  const [hovered, setHovered] = useState<Date | null>(null);
  const cells = Array.from({ length: PREVIEW_WEEKS * 7 }, (_, i) => addDays(gridStart, i));
  const picking = isCustom && Boolean(from) && !until;
  const rangeEnd = picking && hovered && from && !isBefore(hovered, from) ? hovered : until;

  const inRange = (date: Date) =>
    Boolean(isCustom && from && rangeEnd && !isBefore(date, from) && !isAfter(date, rangeEnd));
  const isEndpoint = (date: Date) =>
    Boolean(
      isCustom && ((from && isSameDay(date, from)) || (rangeEnd && isSameDay(date, rangeEnd))),
    );

  const totalDays =
    isCustom && from && until && !isAfter(from, until)
      ? Array.from({ length: differenceInCalendarDays(until, from) + 1 }, (_, i) =>
          addDays(from, i),
        ).filter((d) => !isBefore(d, today) && days.includes(weekdayKey(d))).length
      : null;

  const hint = !isCustom
    ? "Tap a date to set a custom schedule instead"
    : !from
      ? "Tap a start date"
      : picking
        ? "Now tap the end date"
        : "Tap a date to start a new range";

  const shift = (weeks: number) => setGridStart((d) => addDays(d, weeks * 7));

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
      <p className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-slate-500 uppercase">
        <Eye className="size-3.5" /> What customers see
      </p>
      <div className="mt-3 flex items-start gap-3 rounded-xl bg-white p-3 shadow-xs ring-1 ring-slate-200/70 dark:bg-slate-950 dark:ring-slate-800">
        <span className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
          {isCustom ? <CalendarRange className="size-5" /> : <Store className="size-5" />}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            {isCustom ? "Custom schedule" : "Store operating hours"}
          </p>
          <p className="text-muted-foreground text-xs">
            {describeAvailability({
              availabilityMode: isCustom ? "CUSTOM" : "STORE_HOURS",
              availableFrom: from ? format(from, DATE_FORMAT) : null,
              availableUntil: until ? format(until, DATE_FORMAT) : null,
              availableDays: days,
            })}
          </p>
          {totalDays !== null && (
            <p className="text-primary mt-1 text-xs font-bold">
              {totalDays} {totalDays === 1 ? "day" : "days"} available
            </p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => shift(-PREVIEW_WEEKS)}
            disabled={!isAfter(gridStart, firstWeek)}
            className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-white hover:text-slate-900 disabled:pointer-events-none disabled:opacity-30 dark:hover:bg-slate-800"
            aria-label="Previous weeks"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            {format(gridStart, "MMM d")} –{" "}
            {format(addDays(gridStart, PREVIEW_WEEKS * 7 - 1), "MMM d, yyyy")}
          </span>
          <button
            type="button"
            onClick={() => shift(PREVIEW_WEEKS)}
            className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-white hover:text-slate-900 dark:hover:bg-slate-800"
            aria-label="Next weeks"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center" onMouseLeave={() => setHovered(null)}>
          {BASKET_WEEKDAYS.map((d) => (
            <span key={d.value} className="pb-1 text-[10px] font-semibold text-slate-400 uppercase">
              {d.label.slice(0, 2)}
            </span>
          ))}
          {cells.map((date) => {
            const past = isBefore(date, today);
            const endpoint = isEndpoint(date);
            const ranged = inRange(date);
            const dayOn = days.includes(weekdayKey(date));
            const available = !past && (isCustom ? ranged && dayOn && !picking : true);
            return (
              <button
                key={date.toISOString()}
                type="button"
                disabled={past}
                onClick={() => onPick(date)}
                onMouseEnter={() => setHovered(date)}
                title={format(date, "EEE, MMM d")}
                aria-label={format(date, "EEEE, MMMM d, yyyy")}
                aria-pressed={endpoint}
                className={cn(
                  "flex aspect-square items-center justify-center rounded-lg text-xs font-semibold tabular-nums transition-all",
                  past && "cursor-not-allowed text-slate-300 dark:text-slate-700",
                  !past && "hover:ring-primary/50 cursor-pointer hover:ring-2",
                  !past &&
                    !available &&
                    !ranged &&
                    "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
                  available && "bg-primary text-white shadow-sm shadow-emerald-600/20",
                  !available &&
                    ranged &&
                    "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
                  endpoint &&
                    "ring-2 ring-emerald-700 ring-offset-1 dark:ring-emerald-400 dark:ring-offset-slate-900",
                  isSameDay(date, today) &&
                    !endpoint &&
                    "underline decoration-2 underline-offset-2",
                )}
              >
                {format(date, "d")}
              </button>
            );
          })}
        </div>
        <p
          className={cn(
            "mt-2 text-center text-[11px] font-semibold",
            picking ? "text-primary animate-pulse" : "text-slate-500",
          )}
        >
          {hint}
        </p>
      </div>

      <p className="text-muted-foreground mt-auto flex items-start gap-1.5 pt-4 text-[11px] leading-snug">
        <CalendarCheck2 className="mt-px size-3.5 shrink-0" />
        {isCustom
          ? "Within these days, customers can order only while your store is open."
          : "Customers can order whenever your store is open, on every open day."}
      </p>
    </div>
  );
}

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

  const pickDate = (date: Date) => {
    const key = toKey(date);
    if (!isCustom) setMode("CUSTOM");
    if (!isCustom || !from || until || !key) {
      setValue("availableFrom", key, opts);
      setValue("availableUntil", null, opts);
    } else if (key < from) {
      setValue("availableFrom", key, opts);
    } else {
      setValue("availableUntil", key, opts);
    }
  };

  const fromDate = toDate(from);
  const untilDate = toDate(until);

  return (
    <SectionCard
      id="availability"
      step={4}
      title="Basket Availability"
      description="Choose when this basket is available for customers to order."
      hasIssue={hasIssue}
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        <div className="space-y-3">
          <div role="radiogroup" aria-label="Basket availability" className="space-y-3">
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

          <p className="flex items-start gap-2 rounded-xl bg-sky-50/80 p-3 text-xs text-slate-600 dark:bg-sky-950/20 dark:text-slate-300">
            <Info className="mt-px size-4 shrink-0 text-sky-600" />
            <span>
              <strong className="text-slate-800 dark:text-slate-100">Seasonal baskets:</strong> use
              a custom schedule for holiday baskets, e.g. a Christmas Basket from Dec 15 to Dec 26.
              A custom schedule never extends beyond your store&apos;s opening hours.
            </span>
          </p>
        </div>
        <AvailabilityPreview
          isCustom={isCustom}
          from={fromDate}
          until={untilDate}
          days={days}
          onPick={pickDate}
        />
      </div>
    </SectionCard>
  );
}
