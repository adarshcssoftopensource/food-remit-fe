"use client";

import * as React from "react";
import {
  DAYS_OF_WEEK,
  formatScheduleSummary,
  type DailyScheduleItem,
} from "../store-schedule-utils";

export type SchedulePreset = "all" | "weekdays" | "weekends";
export type ScheduleTimeField = "openTime" | "closeTime";

const EMPTY_DAYS_OPEN: string[] = [];

export interface UseStoreScheduleParams {
  daysOpen?: string[];
  dailySchedule?: DailyScheduleItem[];
  onChange: (schedule: {
    daysOpen: string[];
    hoursOfOperation: string;
    dailySchedule: DailyScheduleItem[];
  }) => void;
  error?: string;
  disabled?: boolean;
}

export function useStoreSchedule({
  daysOpen = EMPTY_DAYS_OPEN,
  dailySchedule,
  onChange,
  error,
  disabled = false,
}: UseStoreScheduleParams) {
  const [isCopied, setIsCopied] = React.useState(false);
  const previousTimesRef = React.useRef<Record<string, { open: string; close: string }>>({});

  // Initialize internal state from dailySchedule or fallback to defaults
  const scheduleItems = React.useMemo<DailyScheduleItem[]>(() => {
    if (dailySchedule && Array.isArray(dailySchedule) && dailySchedule.length === 7) {
      return dailySchedule;
    }

    const defaultOpen = "00:00";
    const defaultClose = "00:00";

    return DAYS_OF_WEEK.map((day) => {
      const isOpen = daysOpen.length > 0 ? daysOpen.includes(day) : true;
      return {
        day,
        isOpen,
        openTime: defaultOpen,
        closeTime: defaultClose,
      };
    });
  }, [dailySchedule, daysOpen]);

  const updateSchedule = (newItems: DailyScheduleItem[]) => {
    const updatedDaysOpen = newItems.filter((item) => item.isOpen).map((item) => item.day);
    const summary = formatScheduleSummary(newItems);
    onChange({
      daysOpen: updatedDaysOpen,
      hoursOfOperation: summary,
      dailySchedule: newItems,
    });
  };

  const handleToggleDay = (dayName: string) => {
    if (disabled) return;
    const next = scheduleItems.map((item) => {
      if (item.day === dayName) {
        return {
          ...item,
          isOpen: !item.isOpen,
          openTime: item.openTime || "00:00",
          closeTime: item.closeTime || "00:00",
        };
      }
      return item;
    });
    updateSchedule(next);
  };

  const handleTimeChange = (dayName: string, field: ScheduleTimeField, newTime: string) => {
    if (disabled) return;
    const next = scheduleItems.map((item) => {
      if (item.day === dayName) {
        return { ...item, [field]: newTime };
      }
      return item;
    });
    updateSchedule(next);
  };

  const handleToggle24Hours = (dayName: string) => {
    if (disabled) return;
    const next = scheduleItems.map((item) => {
      if (item.day === dayName) {
        const is24H = item.openTime === "24H";
        if (!is24H) {
          previousTimesRef.current[dayName] = { open: item.openTime, close: item.closeTime };
          return {
            ...item,
            openTime: "24H",
            closeTime: "24H",
          };
        } else {
          const prev = previousTimesRef.current[dayName];
          return {
            ...item,
            openTime: prev?.open && prev.open !== "24H" ? prev.open : "00:00",
            closeTime: prev?.close && prev.close !== "24H" ? prev.close : "00:00",
          };
        }
      }
      return item;
    });
    updateSchedule(next);
  };

  // Find first open day with valid opening and closing hours (not 24H)
  const sourceDayWithHours = scheduleItems.find(
    (item) =>
      item.isOpen &&
      item.openTime &&
      item.openTime !== "00:00" &&
      item.openTime !== "24H" &&
      item.closeTime &&
      item.closeTime !== "00:00" &&
      item.closeTime !== "24H",
  );

  const canCopyToAll = Boolean(sourceDayWithHours);

  // Copy configured day hours to all other open days
  const handleCopyHoursToAllOpen = () => {
    if (disabled || !sourceDayWithHours) return;
    const next = scheduleItems.map((item) => {
      if (item.isOpen) {
        return {
          ...item,
          openTime: sourceDayWithHours.openTime,
          closeTime: sourceDayWithHours.closeTime,
        };
      }
      return item;
    });
    updateSchedule(next);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Preset button actions
  const applyPreset = (preset: SchedulePreset) => {
    if (disabled) return;
    const next = scheduleItems.map((item) => {
      let isOpen = item.isOpen;
      if (preset === "all") isOpen = true;
      if (preset === "weekdays") {
        isOpen = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(item.day);
      }
      if (preset === "weekends") {
        isOpen = ["Saturday", "Sunday"].includes(item.day);
      }
      return {
        ...item,
        isOpen,
        openTime: item.openTime || "00:00",
        closeTime: item.closeTime || "00:00",
      };
    });
    updateSchedule(next);
  };

  const openCount = scheduleItems.filter((i) => i.isOpen).length;

  const allOpenDaysConfigured = React.useMemo(() => {
    const openItems = scheduleItems.filter((i) => i.isOpen);
    if (openItems.length === 0) return false;
    return openItems.every(
      (item) =>
        item.openTime === "24H" || // 24-hour days are always configured
        (item.openTime &&
          item.closeTime &&
          item.openTime !== "00:00" &&
          item.closeTime !== "00:00"),
    );
  }, [scheduleItems]);

  const displayError = allOpenDaysConfigured ? undefined : error;

  return {
    scheduleItems,
    openCount,
    isCopied,
    canCopyToAll,
    sourceDayWithHours,
    displayError,
    handleToggleDay,
    handleTimeChange,
    handleToggle24Hours,
    handleCopyHoursToAllOpen,
    applyPreset,
  };
}
