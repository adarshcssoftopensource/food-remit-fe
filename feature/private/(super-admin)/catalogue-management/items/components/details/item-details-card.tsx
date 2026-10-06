"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/config/routes";
import { formatDate } from "@/lib/date";
import {
  Barcode,
  Boxes,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  FolderOpen,
  Hash,
  Leaf,
  MapPin,
  Percent,
  QrCode,
  Scale,
  Tag,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import type { ItemData } from "../../types/item.types";
import { formatPackSize, getItemOptions, getItemPriceSummary } from "../../utils/item-display";
import { InfoCard } from "./info-card";

function IdentifierTile({
  icon,
  label,
  value,
  emptyText,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
  emptyText: string;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(`${label} copied`);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy to the clipboard");
    }
  };

  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-dashed border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900/40">
      <div className="text-primary bg-primary/10 flex size-9 shrink-0 items-center justify-center rounded-lg">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium tracking-wider text-slate-400 uppercase">{label}</p>
        {value ? (
          <p className="truncate font-mono text-sm font-semibold text-slate-900 dark:text-white">
            {value}
          </p>
        ) : (
          <p className="text-sm text-slate-400">{emptyText}</p>
        )}
      </div>
      {value ? (
        <button
          type="button"
          onClick={copy}
          aria-label={`Copy ${label}`}
          className="hover:text-primary hover:bg-primary/10 rounded-md p-1.5 text-slate-400 transition-colors"
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </button>
      ) : null}
    </div>
  );
}

interface ItemDetailsCardProps {
  item: ItemData;
}

type CategoryWithLocation = {
  city?: { name?: string | null } | null;
  store?: { storeName?: string | null; city?: string | null } | null;
};

export function ItemDetailsCard({ item }: ItemDetailsCardProps) {
  const quantityOnHand = item.quantityOnHand ?? item.stockQuantity;
  const categoryMeta = item.category as CategoryWithLocation | undefined;
  const options = getItemOptions(item);
  const hasPackOptions = options.length > 0;
  const defaultOption = options[0];
  const priceSummary = getItemPriceSummary(item);
  const categoryId = item.category?.id || item.categoryId;
  const storeName = item.storeName || item.store?.storeName || categoryMeta?.store?.storeName;
  const discount = Number(item.discountPercentage) || 0;

  return (
    <Card className="flex h-full flex-col rounded-2xl border-0 bg-white shadow-xl shadow-slate-200/40 lg:col-span-2 dark:bg-slate-950 dark:shadow-none">
      <CardHeader className="shrink-0 border-b border-slate-100/80 px-6 py-4 dark:border-slate-800/80">
        <CardTitle className="flex items-center gap-3 text-base font-bold text-slate-900 dark:text-white">
          <div className="h-4 w-1.5 rounded-full bg-orange-500" />
          Information Overview
          {quantityOnHand !== null &&
            quantityOnHand !== undefined &&
            (quantityOnHand <= 0 ? (
              <span className="rounded-md bg-red-100 px-2 py-1 text-[10px] font-bold tracking-wider text-red-600 uppercase dark:bg-red-500/20 dark:text-red-400">
                Out of Stock
              </span>
            ) : quantityOnHand <= 5 ? (
              <span className="rounded-md bg-amber-100 px-2 py-1 text-[10px] font-bold tracking-wider text-amber-700 uppercase dark:bg-amber-500/20 dark:text-amber-400">
                Low Stock
              </span>
            ) : null)}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-between gap-5 p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <IdentifierTile
            icon={<Hash className="size-4" />}
            label="Item number / SKU"
            value={item.itemNumber}
            emptyText="Not set — add one when editing"
          />
          <IdentifierTile
            icon={<Barcode className="size-4" />}
            label="UPC / barcode"
            value={item.upcCode}
            emptyText="No barcode"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <InfoCard
            icon={<FolderOpen className="h-4 w-4 text-purple-500" />}
            label="Category"
            value={item.category?.categoryName || "-"}
            href={
              categoryId
                ? ROUTES.ADMIN.CATALOGUE_MANAGEMENT.CATEGORY_WORKSPACE(categoryId)
                : undefined
            }
          />
          {storeName && (
            <InfoCard
              icon={<Building2 className="h-4 w-4 text-indigo-500" />}
              label="Store"
              value={storeName}
            />
          )}
          <InfoCard
            icon={<MapPin className="h-4 w-4 text-sky-500" />}
            label="City / Country"
            value={
              [categoryMeta?.city?.name || categoryMeta?.store?.city, item.country?.name]
                .filter(Boolean)
                .join(", ") || "-"
            }
          />
          <InfoCard
            icon={<Tag className="h-4 w-4 text-emerald-500" />}
            label={priceSummary.min !== priceSummary.max ? "Price range" : "Base price"}
            value={priceSummary.label}
          />
          {defaultOption && (
            <InfoCard
              icon={<Boxes className="h-4 w-4 text-orange-500" />}
              label={options.length > 1 ? `Default pack (of ${options.length})` : "Pack / size"}
              value={[defaultOption.optionName, formatPackSize(defaultOption)]
                .filter(Boolean)
                .join(" · ")}
            />
          )}
          <InfoCard
            icon={<Boxes className="h-4 w-4 text-slate-500" />}
            label="Quantity on hand"
            value={
              quantityOnHand !== null && quantityOnHand !== undefined
                ? quantityOnHand.toLocaleString()
                : "-"
            }
          />
          {!hasPackOptions && (
            <>
              <InfoCard
                icon={<Scale className="h-4 w-4 text-emerald-500" />}
                label="Quantity per pack"
                value={item.itemsPerPack ? String(item.itemsPerPack) : "-"}
              />
              <InfoCard
                icon={<Scale className="h-4 w-4 text-slate-500" />}
                label="Net weight"
                value={
                  item.netWeight !== null && item.netWeight !== undefined
                    ? `${item.netWeight} ${item.weightUnit || item.unit || ""}`.trim()
                    : "-"
                }
              />
            </>
          )}
          <InfoCard
            icon={<Leaf className="h-4 w-4 text-green-500" />}
            label="Perishable"
            value={item.isPerishable ? "Yes — short pickup window" : "No"}
          />
          <InfoCard
            icon={<Percent className="h-4 w-4 text-rose-500" />}
            label="Discount"
            value={discount > 0 ? `${discount}% off` : "No discount"}
          />
          {item.pricing && (
            <InfoCard
              icon={<Percent className="h-4 w-4 text-amber-500" />}
              label="Store commission"
              value={`${item.pricing.commissionPercent.toFixed(2)}%`}
            />
          )}
          <InfoCard
            icon={<Calendar className="h-4 w-4 text-slate-400" />}
            label="Added on"
            value={formatDate(item.createdAt)}
          />
          <InfoCard
            icon={<Clock className="h-4 w-4 text-slate-400" />}
            label="Modified on"
            value={formatDate(item.updatedAt)}
          />
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-linear-to-br from-slate-50 via-slate-50/70 to-orange-50/30 p-4 sm:p-5 dark:border-slate-800 dark:from-slate-900/80 dark:to-slate-900/40">
          <div className="flex flex-col items-center gap-5 sm:flex-row">
            {/* Left QR Code Container */}
            <div className="relative flex shrink-0 flex-col items-center justify-center rounded-xl bg-white p-3.5 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-950 dark:ring-slate-800">
              {item.qrCodeImage || item.barcodeImage ? (
                <Image
                  src={item.qrCodeImage || item.barcodeImage!}
                  alt="Product QR code"
                  height={120}
                  width={120}
                  className="size-28 rounded-md object-contain sm:size-32"
                />
              ) : (
                <div className="flex size-28 items-center justify-center text-xs text-slate-400">
                  QR Unavailable
                </div>
              )}
            </div>

            {/* Right Details & Info */}
            <div className="flex min-w-0 flex-1 flex-col space-y-2 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                  Scanner Verified
                </span>
              </div>

              <div>
                <h4 className="flex items-center justify-center gap-2 text-sm font-extrabold text-slate-900 sm:justify-start dark:text-white">
                  <QrCode className="size-4 text-orange-500" />
                  <span>Item Digital QR Code</span>
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  Scan this QR code with the Food Remit Mobile App to quickly verify product details
                  and order stock.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
