"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck, Inbox, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { NoDataFound } from "@/components/common/no-data-found";
import { PageHeader } from "@/components/common/page-header";
import { DataTablePagination } from "@/components/common/data-table/data-table-pagination";
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
  const [limit, setLimit] = useState(6);
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
              <Badge className="rounded-lg px-2.5 py-1">{unreadCount} unread</Badge>
            )}
            <Button
              type="button"
              variant="outline"
              disabled={unreadCount === 0 || readAllMutation.isPending}
              isLoading={readAllMutation.isPending}
              onClick={() => readAllMutation.mutate()}
              className="h-10 rounded-xl"
            >
              <CheckCheck className="mr-2 size-4" />
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
            {items.map((item) => (
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
                      "mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl ring-1",
                      item.isRead
                        ? "bg-slate-100 text-slate-500 ring-slate-200"
                        : "bg-emerald-100 text-emerald-700 ring-emerald-200",
                    )}
                  >
                    <Bell className="size-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-sm font-semibold text-slate-900">
                        {item.title}
                      </h3>
                      {!item.isRead && (
                        <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
                          New
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm leading-relaxed whitespace-pre-wrap text-slate-600">
                      {item.message}
                    </p>
                    <p className="mt-2 text-xs text-slate-400">
                      {formatWhen(item.createdAt || item.addedOn)}
                    </p>
                  </div>

                  {!item.isRead && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="shrink-0 rounded-lg text-xs"
                      disabled={readOneMutation.isPending}
                      onClick={() => readOneMutation.mutate(item.id)}
                    >
                      Mark read
                    </Button>
                  )}

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    disabled={deleteMutation.isPending}
                    onClick={() => deleteMutation.mutate(item.id)}
                    aria-label="Delete notification"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </li>
            ))}
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
