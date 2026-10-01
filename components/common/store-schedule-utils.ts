export interface DailyScheduleItem {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const DAY_ABBR: Record<string, string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

export const DEFAULT_WEEKLY_SCHEDULE: DailyScheduleItem[] = [
  { day: "Monday", isOpen: true, openTime: "00:00", closeTime: "00:00" },
  { day: "Tuesday", isOpen: true, openTime: "00:00", closeTime: "00:00" },
  { day: "Wednesday", isOpen: true, openTime: "00:00", closeTime: "00:00" },
  { day: "Thursday", isOpen: true, openTime: "00:00", closeTime: "00:00" },
  { day: "Friday", isOpen: true, openTime: "00:00", closeTime: "00:00" },
  { day: "Saturday", isOpen: true, openTime: "00:00", closeTime: "00:00" },
  { day: "Sunday", isOpen: true, openTime: "00:00", closeTime: "00:00" },
];

export function formatScheduleSummary(schedule: DailyScheduleItem[]): string {
  const openDays = schedule.filter(
    (d) =>
      d.isOpen &&
      d.openTime &&
      d.closeTime &&
      (d.openTime === "24H" || // 24-hour day
        (d.openTime !== "00:00" && d.closeTime !== "00:00")),
  );

  if (openDays.length === 0) return "";

  // If some open days are still not selected, do not show incomplete summary
  const totalOpenDays = schedule.filter((d) => d.isOpen);
  if (openDays.length < totalOpenDays.length) {
    return "";
  }

  // Group days with identical operating hours
  const groups: { timeKey: string; days: string[] }[] = [];
  for (const item of openDays) {
    const timeKey =
      item.openTime === "24H" ? "Open 24 Hours" : `${item.openTime} - ${item.closeTime}`;
    const existing = groups.find((g) => g.timeKey === timeKey);
    if (existing) {
      existing.days.push(item.day);
    } else {
      groups.push({ timeKey, days: [item.day] });
    }
  }

  const formatDaysList = (days: string[]) => {
    const sorted = [...days].sort(
      (a, b) => DAYS_OF_WEEK.indexOf(a as any) - DAYS_OF_WEEK.indexOf(b as any),
    );
    if (sorted.length === 7) return "Mon - Sun";
    if (sorted.length === 5 && sorted[0] === "Monday" && sorted[4] === "Friday") return "Mon - Fri";
    if (sorted.length === 2 && sorted[0] === "Saturday" && sorted[1] === "Sunday")
      return "Sat - Sun";

    const indices = sorted.map((d) => DAYS_OF_WEEK.indexOf(d as any));
    let isConsecutive = true;
    for (let i = 1; i < indices.length; i++) {
      const prev = indices[i - 1];
      const curr = indices[i];
      if (prev === undefined || curr === undefined || curr !== prev + 1) {
        isConsecutive = false;
        break;
      }
    }

    const firstDay = sorted[0];
    const lastDay = sorted[sorted.length - 1];
    if (isConsecutive && sorted.length >= 3 && firstDay && lastDay) {
      return `${DAY_ABBR[firstDay]} - ${DAY_ABBR[lastDay]}`;
    }

    return sorted.map((d) => DAY_ABBR[d] || d).join(", ");
  };

  return groups.map((g) => `${formatDaysList(g.days)}: ${g.timeKey}`).join(", ");
}

export function parseTimeToMinutes(timeStr: string, isCloseTime: boolean = false): number {
  if (!timeStr || timeStr === "00:00") return 0;
  if (timeStr === "24H") return 1440;
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match || !match[1] || !match[2] || !match[3]) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3].toUpperCase();
  if (ampm === "PM" && hours < 12) hours += 12;
  if (ampm === "AM" && hours === 12) hours = 0;

  const totalMins = hours * 60 + minutes;
  // If 12:00 AM is selected as the close time, treat it as midnight at the end of the day (1440 mins)
  if (isCloseTime && totalMins === 0) {
    return 1440;
  }
  return totalMins;
}
