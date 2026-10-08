"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  AlertTriangle,
  CalendarClock,
  Eye,
  EyeOff,
  FilePen,
  Pencil,
  Rocket,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { DataTableRowActions } from "@/components/common/data-table/data-table-row-actions";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";

import { BASKET_STATUS_META } from "../../../../../constants/basket.constants";
import { BasketStatusBadge } from "../components/shared/basket-badges";
import { BasketImage } from "../components/shared/basket-image";
import type { Basket } from "../types/basket.types";
import { describeAvailability } from "../utils/basket-availability";
import { formatMoney } from "../utils/basket-format";

export interface BasketColumnHandlers {
  onView: (basket: Basket) => void;
  onEdit: (basket: Basket) => void;
  onDelete: (basket: Basket) => void;
  onPublish: (basket: Basket) => void;
  onSetInactive: (basket: Basket) => void;
  onScheduleInactive: (basket: Basket) => void;
  onReactivate: (basket: Basket) => void;
  onToggleStatus?: (basket: Basket, newStatus: "ACTIVE" | "INACTIVE") => Promise<void> | void;
  pendingId?: string | null;
}

const formatDateTime = (value: string) => format(new Date(value), "MMM d, yyyy · HH:mm");

function BasketStatusToggle({
  basket,
  pendingId,
  handlers,
}: {
  basket: Basket;
  pendingId?: string | null;
  handlers: BasketColumnHandlers;
}) {
  const isActuallyActive = basket.status === "ACTIVE";
  const [optimisticActive, setOptimisticActive] = useState(isActuallyActive);
  const [prevStatus, setPrevStatus] = useState(basket.status);

  if (prevStatus !== basket.status) {
    setPrevStatus(basket.status);
    setOptimisticActive(isActuallyActive);
  }

  if (basket.status === "DRAFT") return null;

  const isPending = pendingId === basket.id;
  const blocked = !optimisticActive && !basket.isPublishable;

  const handleCheckedChange = async (checked: boolean) => {
    if (blocked || isPending) return;
    const nextStatus = checked ? "ACTIVE" : "INACTIVE";
    setOptimisticActive(checked);
    try {
      if (handlers.onToggleStatus) {
        await handlers.onToggleStatus(basket, nextStatus);
      } else if (checked) {
        handlers.onReactivate(basket);
      } else {
        handlers.onSetInactive(basket);
      }
    } catch {
      setOptimisticActive(!checked);
    }
  };

  const toggle = (
    <Switch
      checked={optimisticActive}
      disabled={isPending || blocked}
      onCheckedChange={handleCheckedChange}
      aria-label={optimisticActive ? "Set basket inactive" : "Reactivate basket"}
      className="cursor-pointer data-[state=checked]:bg-emerald-600"
    />
  );

  if (!blocked) return toggle;

  return (
    <Tooltip>
      <TooltipTrigger render={<span className="inline-flex" />}>{toggle}</TooltipTrigger>
      <TooltipContent className="max-w-60">
        Update the basket before reactivating: {basket.missingRequirements.join(", ")}
      </TooltipContent>
    </Tooltip>
  );
}

export function getBasketColumns(handlers: BasketColumnHandlers): ColumnDef<Basket>[] {
  const { pendingId } = handlers;
  return [
    {
      id: "name",
      accessorKey: "name",
      header: "Basket",
      cell: ({ row }) => {
        const basket = row.original;
        return (
          <Link
            href={ROUTES.ADMIN.BASKETS.DETAILS(basket.id)}
            className="group flex min-w-60 items-center gap-3"
          >
            <BasketImage
              image={basket.image}
              libraryImage={basket.libraryImage}
              basketType={basket.basketType}
              alt={basket.name}
              sizes="112px"
              className="size-14 shrink-0 rounded-xl ring-1 ring-slate-100 dark:ring-slate-800"
            />
            <div className="min-w-0">
              <p className="group-hover:text-primary flex items-center gap-1.5 truncate font-semibold text-slate-900 transition-colors dark:text-white">
                {basket.name || "Untitled basket"}
                {basket.hasUnavailableItems && (
                  <AlertTriangle
                    className="size-3.5 shrink-0 text-amber-500"
                    aria-label="Contains unavailable items"
                  />
                )}
              </p>
              <p className="text-muted-foreground line-clamp-2 max-w-72 text-xs">
                {basket.description || basket.shortDescription || "No description yet"}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-400">
                {basket.itemCount} items · {formatMoney(basket.price, basket.currencySymbol)}
                {basket.savingsPercent > 0 && (
                  <span className="ml-1 font-semibold text-rose-600">
                    ({basket.savingsPercent}% off)
                  </span>
                )}
              </p>
            </div>
          </Link>
        );
      },
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <BasketStatusBadge status={row.original.status} />,
    },
    {
      id: "availability",
      header: "Availability",
      enableSorting: false,
      cell: ({ row }) => {
        const basket = row.original;
        const visible = basket.status === "ACTIVE";
        return (
          <div className="min-w-44 space-y-0.5">
            <p
              className={cn(
                "flex items-center gap-1.5 text-sm font-semibold whitespace-nowrap",
                visible ? "text-emerald-700 dark:text-emerald-400" : "text-slate-500",
              )}
            >
              {visible ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
              {BASKET_STATUS_META[basket.status].visibility}
            </p>
            {basket.status !== "DRAFT" && (
              <p className="text-muted-foreground text-[11px]">{describeAvailability(basket)}</p>
            )}
            {basket.status === "ACTIVE" && basket.scheduledInactiveAt && (
              <p className="flex items-center gap-1 text-[11px] font-medium text-amber-700 dark:text-amber-400">
                <CalendarClock className="size-3" />
                Inactive from {formatDateTime(basket.scheduledInactiveAt)}
              </p>
            )}
          </div>
        );
      },
    },
    {
      id: "updatedAt",
      accessorKey: "updatedAt",
      header: "Updated On",
      cell: ({ row }) => (
        <span className="text-sm whitespace-nowrap text-slate-600 dark:text-slate-300">
          {format(new Date(row.original.updatedAt), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => {
        const basket = row.original;
        const isDraft = basket.status === "DRAFT";
        return (
          <div className="flex items-center gap-2">
            <BasketStatusToggle basket={basket} pendingId={pendingId} handlers={handlers} />
            <DataTableRowActions
              className="w-52"
              items={[
                {
                  label: "View details",
                  icon: <Eye className="size-4" />,
                  onClick: () => handlers.onView(basket),
                },
                {
                  label: isDraft ? "Edit draft" : "Edit basket",
                  icon: isDraft ? <FilePen className="size-4" /> : <Pencil className="size-4" />,
                  onClick: () => handlers.onEdit(basket),
                },
                {
                  label: basket.isPublishable ? "Publish" : "Publish (incomplete)",
                  icon: <Rocket className="size-4" />,
                  onClick: () => handlers.onPublish(basket),
                  disabled: !basket.isPublishable || pendingId === basket.id,
                  hidden: !isDraft,
                },
                {
                  label: basket.scheduledInactiveAt
                    ? "Edit inactive schedule"
                    : "Schedule inactive",
                  icon: <CalendarClock className="size-4" />,
                  onClick: () => handlers.onScheduleInactive(basket),
                  hidden: basket.status !== "ACTIVE",
                },
                {
                  label: "Delete",
                  icon: <Trash2 className="size-4" />,
                  variant: "destructive",
                  onClick: () => handlers.onDelete(basket),
                },
              ]}
            />
          </div>
        );
      },
    },
  ];
}
