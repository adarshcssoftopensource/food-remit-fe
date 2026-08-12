import { format } from "date-fns";

export interface BaseListArgs {
  page?: number;
  limit?: number;
  search?: string;
  fromDate?: Date | null;
  toDate?: Date | null;
  status?: string | null;
  sortBy?: string | null;
  sortOrder?: string | null;
}

const MAX_LIMIT = 100;

export function buildQueryString(args: BaseListArgs | Record<string, unknown>): string {
  const params = new URLSearchParams();

  Object.entries(args as Record<string, unknown>).forEach(([key, val]) => {
    if (val === undefined || val === null || val === "") return;

    if (key === "limit" && typeof val === "number") {
      params.set("limit", String(Math.min(val, MAX_LIMIT)));
    } else if (key === "fromDate" && val instanceof Date) {
      params.set("fromDate", format(val, "yyyy-MM-dd"));
    } else if (key === "toDate" && val instanceof Date) {
      params.set("toDate", format(val, "yyyy-MM-dd"));
    } else if (typeof val === "string") {
      const trimmed = val.trim();
      if (trimmed) params.set(key, trimmed);
    } else if (typeof val === "number" || typeof val === "boolean") {
      params.set(key, String(val));
    }
  });

  return params.toString();
}

export function buildUrl(baseUrl: string, args: BaseListArgs | Record<string, unknown>): string {
  const qs = buildQueryString(args);
  return qs ? `${baseUrl}?${qs}` : baseUrl;
}

export function buildCacheKey(
  prefix: string,
  args: BaseListArgs | Record<string, unknown>,
): string[] {
  const entries = Object.entries(args as Record<string, unknown>)
    .filter(([_, v]) => v !== undefined && v !== null && v !== "")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => {
      if (v instanceof Date) return `${k}:${format(v, "yyyy-MM-dd")}`;
      return `${k}:${String(v).trim()}`;
    });

  return [prefix, ...entries];
}
