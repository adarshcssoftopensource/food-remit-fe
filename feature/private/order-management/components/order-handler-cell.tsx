"use client";

import { ImageLightbox } from "@/components/common/image-lightbox";
import { getInitials } from "@/lib/get-initials";
import { useState } from "react";
import { OrderData } from "../types/order.types";
import { formatRelativeTime, ORDER_STATUS } from "../utils/order-workflow";

/**
 * Shows who started or was assigned the order.
 * Client rule: Start records who started; Assign shows the designated employee.
 * Manager/Super Admin Start → "Started by [their name]" (no employee assignee).
 */
export function OrderHandlerCell({ order }: { order: OrderData }) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const assignedName = order.assignedEmployeeName;
  const startedName = order.startedByName;
  const name = assignedName || startedName;
  if (!name) {
    return <span className="text-slate-400">—</span>;
  }

  const image = order.assignedEmployeeImage || order.startedByImage;
  const when = order.assignedAt || order.startedAt;
  const relative = formatRelativeTime(when);
  const isCompleted =
    order.orderStatus === ORDER_STATUS.COMPLETED || order.orderStatus === ORDER_STATUS.CLOSED;

  // Prefer "Assigned" when an employee was designated; otherwise "Started"
  const verb = isCompleted ? "Completed" : assignedName ? "Assigned" : "Started";

  return (
    <>
      <div className="flex items-center gap-2.5">
        {image ? (
          <button
            type="button"
            onClick={() => setLightboxSrc(image)}
            className="size-8 shrink-0 overflow-hidden rounded-full ring-offset-2 transition hover:ring-2 hover:ring-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            title="View photo"
          >
            <img src={image} alt={name} className="size-8 object-cover" />
          </button>
        ) : (
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-600">
            {getInitials(name)}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">{name}</p>
          {relative && (
            <p className="text-[11px] text-slate-500">
              {verb} {relative}
            </p>
          )}
        </div>
      </div>
      <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} alt={name} />
    </>
  );
}
