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

export function buildQueryString(args: BaseListArgs): string {
  const params = new URLSearchParams();

  if (args.page) params.set("page", String(args.page));
  if (args.limit) params.set("limit", String(Math.min(args.limit, MAX_LIMIT)));
  if (args.search?.trim()) params.set("search", args.search.trim());
  if (args.fromDate) params.set("from", format(args.fromDate, "yyyy-MM-dd"));
  if (args.toDate) params.set("to", format(args.toDate, "yyyy-MM-dd"));
  if (args.status) params.set("status", args.status);
  if (args.sortBy) params.set("sortBy", args.sortBy);
  if (args.sortOrder) params.set("sortOrder", args.sortOrder);

  return params.toString();
}

export function buildUrl(baseUrl: string, args: BaseListArgs): string {
  const qs = buildQueryString(args);
  return qs ? `${baseUrl}?${qs}` : baseUrl;
}

export function buildCacheKey(prefix: string, args: BaseListArgs): string[] {
  return [
    prefix,
    String(args.page ?? 1),
    String(Math.min(args.limit ?? MAX_LIMIT, MAX_LIMIT)),
    args.search?.trim() ?? "",
    args.fromDate ? format(args.fromDate, "yyyy-MM-dd") : "",
    args.toDate ? format(args.toDate, "yyyy-MM-dd") : "",
    args.status ?? "",
    args.sortBy ?? "",
    args.sortOrder ?? "",
  ];
}
