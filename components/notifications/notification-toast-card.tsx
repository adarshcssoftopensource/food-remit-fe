"use client";

import { Bell, ShoppingBag, ArrowRight, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/routes";

interface NotificationToastCardProps {
  toastId: string | number;
  title: string;
  message: string;
}

export function NotificationToastCard({ toastId, title, message }: NotificationToastCardProps) {
  const router = useRouter();

  const isOrderNotification =
    title.toLowerCase().includes("order") ||
    message.toLowerCase().includes("order") ||
    title.includes("🛒");

  const handleView = () => {
    toast.dismiss(toastId);
    router.push(ROUTES.ADMIN.NOTIFICATIONS);
  };

  const handleDismiss = () => {
    toast.dismiss(toastId);
  };

  return (
    <div className="animate-in fade-in slide-in-from-top-4 w-[380px] max-w-[calc(100vw-32px)] overflow-hidden rounded-2xl border border-emerald-200/80 bg-white shadow-2xl shadow-emerald-950/15 backdrop-blur-md transition-all duration-200 dark:border-emerald-900/50 dark:bg-slate-900 dark:shadow-black/50">
      {/* Brand Accent Bar at the top */}
      <div className="h-1.5 w-full bg-linear-to-r from-emerald-500 via-teal-400 to-emerald-600" />

      <div className="p-4">
        {/* Header Row: Category Badge, Time, and Close Button */}
        <div className="mb-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/60 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold tracking-wider text-emerald-700 uppercase dark:border-emerald-800/60 dark:bg-emerald-950/70 dark:text-emerald-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              {isOrderNotification ? "New Order" : "Notification"}
            </span>
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
              Just now
            </span>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            className="flex h-6 w-6 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Dismiss notification"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Content Body: Icon + Title & Message */}
        <div onClick={handleView} className="group/content flex cursor-pointer items-start gap-3">
          {/* Glowing Brand Icon */}
          <div className="relative mt-0.5 shrink-0 transition-transform group-hover/content:scale-105">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-600/25">
              {isOrderNotification ? (
                <ShoppingBag className="h-5 w-5" />
              ) : (
                <Bell className="h-5 w-5" />
              )}
            </div>
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            </span>
          </div>

          {/* Texts */}
          <div className="min-w-0 flex-1">
            <h4 className="line-clamp-1 text-[13px] leading-snug font-bold text-slate-900 transition-colors group-hover/content:text-emerald-600 dark:text-slate-100">
              {title || "New Notification"}
            </h4>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {message || "You have received a new notification."}
            </p>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="mt-3.5 flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800/80">
          <button
            type="button"
            onClick={handleDismiss}
            className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          >
            Dismiss
          </button>
          <button
            type="button"
            onClick={handleView}
            className="inline-flex items-center gap-1.5 rounded-lg bg-linear-to-r from-emerald-600 to-teal-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm shadow-emerald-600/30 transition-all hover:from-emerald-700 hover:to-teal-700 active:scale-95"
          >
            <span>View Inbox</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
