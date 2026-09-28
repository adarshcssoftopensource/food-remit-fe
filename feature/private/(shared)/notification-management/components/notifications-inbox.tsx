"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  CheckCheck,
  Inbox,
  Trash2,
  ShoppingBag,
  Handshake,
  Check,
  Loader2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { OrderNotificationCard } from "./order-notification-card";

import { DataTablePagination } from "@/components/common/data-table/data-table-pagination";
import { NoDataFound } from "@/components/common/no-data-found";
import { PageHeader } from "@/components/common/page-header";
import { successToast } from "@/components/toaster";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import apiClient from "@/lib/api/client";
import { NOTIFICATION_ENDPOINTS } from "@/lib/api/endpoints/notification.endpoints";
import { cn } from "@/lib/utils";
import { useGetWebNotifications } from "../hooks/use-get-notifications";

function formatWhen(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function NotificationsInbox() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [status, setStatus] = useState<"all" | "unread" | "read">("all");

  const { data, isLoading, isFetching } = useGetWebNotifications({
    page,
    limit,
    status,
  });

  const items = data?.data || [];
  const pagination = data?.pagination || {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  };
  const unreadCount = data?.count ?? 0;

  const readOneMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.patch(NOTIFICATION_ENDPOINTS.READ_ONE(id));
      return res.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.NOTIFICATIONS });
      void queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.NOTIFICATION_COUNT });
    },
  });

  const readAllMutation = useMutation({
    mutationFn: async () => {
      const res = await apiClient.patch(NOTIFICATION_ENDPOINTS.READ_ALL);
      return res.data;
    },
    onSuccess: () => {
      successToast({ description: "All notifications marked as read." });
      void queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.NOTIFICATIONS });
      void queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.NOTIFICATION_COUNT });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(NOTIFICATION_ENDPOINTS.DELETE_ONE(id));
      return res.data;
    },
    onSuccess: () => {
      successToast({ description: "Notification deleted." });
      void queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.NOTIFICATIONS });
      void queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.NOTIFICATION_COUNT });
    },
  });

  const showingLabel = useMemo(() => {
    if (!pagination.total) return "0 notifications";
    const from = (pagination.page - 1) * pagination.limit + 1;
    const to = Math.min(pagination.page * pagination.limit, pagination.total);
    return `${from}–${to} of ${pagination.total}`;
  }, [pagination]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Your admin inbox — every announcement sent to your account."
        action={
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <Badge className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-xs">
                {unreadCount} unread
              </Badge>
            )}
            <Button
              type="button"
              variant="outline"
              disabled={unreadCount === 0 || readAllMutation.isPending}
              isLoading={readAllMutation.isPending}
              onClick={() => readAllMutation.mutate()}
              className={cn(
                "h-10 rounded-xl font-semibold transition-all duration-200",
                unreadCount > 0
                  ? "border-emerald-300 bg-emerald-50/70 text-emerald-800 shadow-2xs hover:border-emerald-400 hover:bg-emerald-100/80 active:scale-98"
                  : "border-slate-200 text-slate-400 opacity-60",
              )}
            >
              <CheckCheck className="mr-2 size-4 text-emerald-600" />
              Mark all read
            </Button>
          </div>
        }
      />

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Inbox className="size-4 text-emerald-600" />
          <span>{showingLabel}</span>
          {isFetching && !isLoading && <span className="text-xs text-slate-400">Refreshing…</span>}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value as "all" | "unread" | "read");
              setPage(1);
            }}
          >
            <SelectTrigger className="h-10 w-36 rounded-xl capitalize">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="read">Read</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        {isLoading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="h-20 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="py-16">
            <NoDataFound title="No notifications yet" />
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {items.map((item) => {
              const isMarkingThis =
                readOneMutation.isPending && readOneMutation.variables === item.id;
              const isDeletingThis =
                deleteMutation.isPending && deleteMutation.variables === item.id;

              return (
                <li
                  key={item.id}
                  className={cn(
                    "group relative px-5 py-4 transition-colors",
                    item.isRead ? "bg-white" : "bg-emerald-50/40",
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl ring-1 transition-all duration-200",
                        item.isRead
                          ? "bg-slate-100 text-slate-500 ring-slate-200/80"
                          : "bg-emerald-100 text-emerald-700 shadow-xs ring-emerald-300",
                      )}
                    >
                      {item.title.toLowerCase().includes("partner") ||
                      item.message.includes("Partner Lead") ? (
                        <Handshake className="size-4" />
                      ) : item.title.toLowerCase().includes("order") ||
                        item.message.includes("Order Reference:") ? (
                        <ShoppingBag className="size-4" />
                      ) : (
                        <Bell className="size-4" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {item.title}
                          </h3>
                          {!item.isRead ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase shadow-xs">
                              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                              New
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100/90 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-800/80">
                              <Check className="size-2.5 text-slate-400" />
                              Read
                            </span>
                          )}
                        </div>

                        {/* Action buttons toolbar */}
                        <div className="flex items-center gap-2">
                          {!item.isRead && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={isMarkingThis || isDeletingThis}
                              onClick={() => readOneMutation.mutate(item.id)}
                              className="h-8 rounded-lg border-emerald-200/90 bg-emerald-50/80 px-3 text-xs font-semibold text-emerald-700 shadow-2xs transition-all hover:border-emerald-300 hover:bg-emerald-100 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/60"
                            >
                              {isMarkingThis ? (
                                <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                              ) : (
                                <Check className="mr-1.5 size-3.5 text-emerald-600" />
                              )}
                              Mark as read
                            </Button>
                          )}

                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            disabled={isDeletingThis || isMarkingThis}
                            onClick={() => deleteMutation.mutate(item.id)}
                            className="size-8 rounded-lg border-slate-200/80 bg-white text-slate-400 shadow-2xs transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-red-900/60 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                            title="Delete notification"
                            aria-label="Delete notification"
                          >
                            {isDeletingThis ? (
                              <Loader2 className="size-3.5 animate-spin text-red-500" />
                            ) : (
                              <Trash2 className="size-3.5" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <OrderNotificationCard message={item.message} isRead={item.isRead} />

                      <p className="mt-2 text-xs text-slate-400">
                        {formatWhen(item.createdAt || item.addedOn)}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="mt-4">
        <DataTablePagination
          currentPage={page}
          totalPages={pagination.totalPages}
          rowsPerPage={limit}
          onPageChange={setPage}
          onRowsPerPageChange={setLimit}
        />
      </div>
    </div>
  );
}
