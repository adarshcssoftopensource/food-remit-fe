"use client";

import { Bell } from "lucide-react";
import Link from "next/link";

import { ROUTES } from "@/config/routes";
import { useApiQuery } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { NOTIFICATION_ENDPOINTS } from "@/lib/api/endpoints/notification.endpoints";
import { cn } from "@/lib/utils";

type NotificationCountResponse = {
  status: boolean;
  data?: { notificationCount?: number };
};

export function NotificationBell({ className }: { className?: string }) {
  const { data } = useApiQuery<NotificationCountResponse>(
    API_CACHE_KEYS.NOTIFICATION_COUNT,
    NOTIFICATION_ENDPOINTS.COUNT,
    {
      refetchInterval: 5000,
      refetchOnWindowFocus: true,
    },
  );

  const count = Number(data?.data?.notificationCount || 0);
  const displayCount = count > 99 ? "99+" : String(count);

  return (
    <Link
      href={ROUTES.ADMIN.NOTIFICATIONS}
      aria-label={count > 0 ? `${count} unread notifications` : "Notifications"}
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center rounded-xl",
        "text-slate-600 dark:text-slate-400",
        "hover:bg-slate-100/80 hover:text-slate-900 dark:hover:bg-slate-800/80 dark:hover:text-slate-100",
        "transition-all duration-200",
        className,
      )}
    >
      <Bell className="h-5 w-5" />
      {count > 0 && (
        <span
          className={cn(
            "absolute -top-0.5 -right-0.5",
            "flex h-5 min-w-5 items-center justify-center",
            "rounded-full",
            "bg-linear-to-r from-emerald-600 to-teal-600",
            "px-1",
            "text-[10px] font-bold text-white",
            "shadow-xs",
            "ring-2 ring-white dark:ring-slate-950",
            "animate-in fade-in zoom-in-50 duration-200",
          )}
        >
          {displayCount}
        </span>
      )}
    </Link>
  );
}
