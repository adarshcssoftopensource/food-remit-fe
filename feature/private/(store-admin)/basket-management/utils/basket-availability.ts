import { format, parse } from "date-fns";

import { BASKET_WEEKDAYS } from "../../../../../constants/basket.constants";
import type { BasketAvailabilityMode } from "../types/basket.types";

interface AvailabilityInput {
  availabilityMode?: BasketAvailabilityMode;
  availableFrom?: string | null;
  availableUntil?: string | null;
  availableDays?: string[];
}

const formatDay = (value: string) => format(parse(value, "yyyy-MM-dd", new Date()), "MMM d, yyyy");

/** e.g. "Mon–Fri" or "Mon, Wed, Sat" or "Every day" */
export function formatWeekdays(days: string[] = []): string {
  if (days.length === 7) return "Every day";
  if (!days.length) return "No days selected";
  const indexes = BASKET_WEEKDAYS.map((d, i) => (days.includes(d.value) ? i : -1)).filter(
    (i) => i >= 0,
  );
  const consecutive = indexes.every((v, i) => i === 0 || v === (indexes[i - 1] ?? -2) + 1);
  const label = (i: number) => BASKET_WEEKDAYS[i]?.label ?? "";
  if (consecutive && indexes.length > 2) {
    return `${label(indexes[0] ?? 0)}–${label(indexes[indexes.length - 1] ?? 0)}`;
  }
  return indexes.map(label).join(", ");
}

/** Short label: "Store hours" or "Dec 15, 2026 – Dec 26, 2026" */
export function formatAvailability(input: AvailabilityInput): string {
  if (input.availabilityMode !== "CUSTOM") return "Store hours";
  if (!input.availableFrom || !input.availableUntil) return "Custom schedule (dates not set)";
  return `${formatDay(input.availableFrom)} – ${formatDay(input.availableUntil)}`;
}

/** Long label including weekdays */
export function describeAvailability(input: AvailabilityInput): string {
  if (input.availabilityMode !== "CUSTOM") return "Follows store operating hours";
  return `${formatAvailability(input)} · ${formatWeekdays(input.availableDays)}`;
}
