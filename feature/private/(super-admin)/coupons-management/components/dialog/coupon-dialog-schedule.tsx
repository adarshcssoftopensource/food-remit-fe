"use client";

import { format, parseISO } from "date-fns";
import { Calendar, Clock } from "lucide-react";
import { type Control, Controller, type FieldErrors } from "react-hook-form";

import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import type { CouponFormValues } from "../../schema/coupon.schema";

type ScheduleSectionProps = {
  control: Control<CouponFormValues>;
  errors: FieldErrors<CouponFormValues>;
  durationText: string | null;
};

export function CouponDialogScheduleSection({
  control,
  errors,
  durationText,
}: ScheduleSectionProps) {
  return (
    <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <Calendar className="size-3.5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              Validity Period & Scheduling
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Enforces when the coupon automatically starts and expires
            </p>
          </div>
        </div>

        {durationText && (
          <span className="hidden items-center gap-1 rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 sm:inline-flex dark:border-emerald-800/60 dark:bg-emerald-950/60 dark:text-emerald-300">
            <Clock className="size-3" />
            {durationText}
          </span>
        )}
      </div>

      <div className="grid gap-3 pt-1 sm:grid-cols-2">
        {/* Start Window */}
        <ScheduleWindow
          control={control}
          dateName="startDate"
          timeName="startTime"
          dotClassName="size-2 rounded-full bg-emerald-500"
          title="Starts Applying From"
          badgeClassName="text-[10px] font-medium text-emerald-600 dark:text-emerald-400"
          badgeText="Live from"
          errorMessage={errors.startDate?.message}
          hasError={Boolean(errors.startDate)}
        />

        {/* End Window */}
        <ScheduleWindow
          control={control}
          dateName="endDate"
          timeName="endTime"
          dotClassName="size-2 rounded-full bg-rose-500"
          title="Expires & Ends On"
          badgeClassName="text-[10px] font-medium text-rose-600 dark:text-rose-400"
          badgeText="Expires at"
          errorMessage={errors.endDate?.message}
          hasError={Boolean(errors.endDate)}
        />
      </div>
    </div>
  );
}

type ScheduleWindowProps = {
  control: Control<CouponFormValues>;
  dateName: "startDate" | "endDate";
  timeName: "startTime" | "endTime";
  dotClassName: string;
  title: string;
  badgeClassName: string;
  badgeText: string;
  hasError: boolean;
  errorMessage?: string;
};

function ScheduleWindow({
  control,
  dateName,
  timeName,
  dotClassName,
  title,
  badgeClassName,
  badgeText,
  hasError,
  errorMessage,
}: ScheduleWindowProps) {
  return (
    <div className="space-y-2 rounded-xl border border-slate-200/90 bg-white p-3 shadow-2xs dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className={dotClassName} />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{title}</span>
        </div>
        <span className={badgeClassName}>{badgeText}</span>
      </div>
      <div className="grid grid-cols-5 gap-2">
        <div className="col-span-3">
          <Controller
            name={dateName}
            control={control}
            render={({ field }) => (
              <div>
                <span className="mb-1 block text-[10px] font-medium text-slate-400">Date</span>
                <DatePicker
                  date={field.value ? parseISO(field.value) : undefined}
                  setDate={(newDate) => {
                    if (newDate) {
                      field.onChange(format(newDate, "yyyy-MM-dd"));
                    }
                  }}
                  placeholder="Select date"
                  className="h-10 rounded-xl text-xs"
                />
              </div>
            )}
          />
        </div>
        <div className="col-span-2">
          <Controller
            name={timeName}
            control={control}
            render={({ field }) => (
              <div>
                <span className="mb-1 block text-[10px] font-medium text-slate-400">Time</span>
                <TimePicker
                  value={field.value}
                  onChange={(val) => field.onChange(val)}
                  placeholder="Time"
                  className="h-10 rounded-xl text-xs"
                />
              </div>
            )}
          />
        </div>
      </div>
      {hasError && <p className="text-xs text-rose-500">{errorMessage}</p>}
    </div>
  );
}
