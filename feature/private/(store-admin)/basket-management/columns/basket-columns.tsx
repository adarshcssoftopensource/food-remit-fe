"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { AlertTriangle, Eye, Pencil, Rocket, Trash2 } from "lucide-react";
import Link from "next/link";

import { DataTableRowActions } from "@/components/common/data-table/data-table-row-actions";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ROUTES } from "@/config/routes";

import { BasketStatusBadge, BasketTypeBadge } from "../components/shared/basket-badges";
import { BasketImage } from "../components/shared/basket-image";
import { formatHouseholdSize } from "../constants/basket.constants";
import type { Basket } from "../types/basket.types";
import { formatMoney } from "../utils/basket-format";

interface BasketColumnHandlers {
  onEdit: (basket: Basket) => void;
  onView: (basket: Basket) => void;
  onDelete: (basket: Basket) => void;
  onToggleStatus: (basket: Basket, active: boolean) => void;
  pendingStatusId?: string | null;
}

export function getBasketColumns({
  onEdit,
  onView,
  onDelete,
  onToggleStatus,
  pendingStatusId,
}: BasketColumnHandlers): ColumnDef<Basket>[] {
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
            className="group flex min-w-56 items-center gap-3"
          >
            <BasketImage
              image={basket.image}
              basketType={basket.basketType}
              alt={basket.name}
              sizes="48px"
              className="size-12 shrink-0 rounded-xl ring-1 ring-slate-100 dark:ring-slate-800"
            />
            <div className="min-w-0">
              <p className="group-hover:text-primary truncate font-semibold text-slate-900 transition-colors dark:text-white">
                {basket.name}
              </p>
              <p className="text-muted-foreground max-w-64 truncate text-xs">
                {basket.shortDescription || "No short description"}
              </p>
            </div>
          </Link>
        );
      },
    },
    {
      id: "basketType",
      header: "Type",
      enableSorting: false,
      cell: ({ row }) => <BasketTypeBadge type={row.original.basketType} short />,
    },
    {
      id: "householdSize",
      header: "Serves",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="text-sm whitespace-nowrap text-slate-600 dark:text-slate-300">
          {formatHouseholdSize(row.original.householdSize)}
        </span>
      ),
    },
    {
      id: "items",
      header: "Items",
      enableSorting: false,
      cell: ({ row }) => {
        const basket = row.original;
        return (
          <div className="flex items-center gap-1.5 text-sm whitespace-nowrap">
            <span className="font-semibold">{basket.itemCount}</span>
            <span className="text-muted-foreground text-xs">({basket.totalUnits} units)</span>
            {basket.hasUnavailableItems && (
              <Tooltip>
                <TooltipTrigger
                  render={<span />}
                  className="text-amber-500"
                  aria-label="Contains unavailable items"
                >
                  <AlertTriangle className="size-3.5" />
                </TooltipTrigger>
                <TooltipContent>Some items are no longer available</TooltipContent>
              </Tooltip>
            )}
          </div>
        );
      },
    },
    {
      id: "price",
      accessorKey: "price",
      header: "Customer Price",
      cell: ({ row }) => (
        <div className="whitespace-nowrap">
          <p className="flex items-baseline gap-1.5 tabular-nums">
            <span
              className={
                row.original.discountAmount > 0
                  ? "font-bold text-rose-600"
                  : "font-bold text-slate-900 dark:text-white"
              }
            >
              {formatMoney(row.original.price, row.original.currencySymbol)}
            </span>
            {row.original.discountAmount > 0 && (
              <span className="text-[11px] text-slate-400 line-through">
                {formatMoney(row.original.originalPrice, row.original.currencySymbol)}
              </span>
            )}
          </p>
          <p className="text-muted-foreground text-[11px] tabular-nums">
            {row.original.discountAmount > 0
              ? `${row.original.discountedItemCount} discounted items`
              : `Your price ${formatMoney(row.original.vendorPrice, row.original.currencySymbol)}`}
          </p>
        </div>
      ),
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const basket = row.original;
        if (basket.status === "DRAFT") return <BasketStatusBadge status="DRAFT" />;
        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={basket.status === "ACTIVE"}
              disabled={pendingStatusId === basket.id}
              onCheckedChange={(checked) => onToggleStatus(basket, checked)}
              aria-label={basket.status === "ACTIVE" ? "Hide basket" : "Show basket"}
            />
            <BasketStatusBadge status={basket.status} />
          </div>
        );
      },
    },
    {
      id: "updatedAt",
      accessorKey: "updatedAt",
      header: "Last Updated",
      cell: ({ row }) => (
        <span className="text-sm whitespace-nowrap text-slate-600 dark:text-slate-300">
          {format(new Date(row.original.updatedAt), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => {
        const basket = row.original;
        return (
          <DataTableRowActions
            items={[
              {
                label: "View details",
                icon: <Eye className="size-4" />,
                onClick: () => onView(basket),
              },
              {
                label: basket.status === "DRAFT" ? "Continue & publish" : "Edit basket",
                icon:
                  basket.status === "DRAFT" ? (
                    <Rocket className="size-4" />
                  ) : (
                    <Pencil className="size-4" />
                  ),
                onClick: () => onEdit(basket),
              },
              {
                label: "Delete",
                icon: <Trash2 className="size-4" />,
                variant: "destructive",
                onClick: () => onDelete(basket),
              },
            ]}
          />
        );
      },
    },
  ];
}
