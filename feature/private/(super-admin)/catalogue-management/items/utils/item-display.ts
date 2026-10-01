import type { ItemData, ItemOptionData } from "../types/item.types";

const toNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const formatAmount = (value: number) =>
  value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export function getItemPrimaryImage(item: ItemData): string | null {
  return (
    item.productImageUrls?.[0] ||
    item.productImageUrl ||
    (item.productImage?.startsWith("http") ? item.productImage.split(",")[0]?.trim() : null) ||
    null
  );
}

export function getItemCurrencySymbol(item: ItemData): string {
  return item.pricing?.currencySymbol || item.placements?.[0]?.currencySymbol || "";
}

export function formatPrice(value: unknown, currencySymbol = ""): string {
  const num = toNumber(value);
  return num === null ? "—" : `${currencySymbol}${formatAmount(num)}`;
}

/** Options in display order; the first one is the default / base price. */
export function getItemOptions(item: ItemData): ItemOptionData[] {
  const options = Array.isArray(item.options) ? [...item.options] : [];
  return options.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

/** Human readable pack size, e.g. "6 × 1 ltr", "500 g", "12 pcs". */
export function formatPackSize(option: {
  quantityPerPack?: number | string | null;
  netWeight?: number | string | null;
  weightUnit?: string | null;
}): string {
  const qty = toNumber(option.quantityPerPack);
  const weight = toNumber(option.netWeight);
  const unit = option.weightUnit?.trim() || "";
  const weightText = weight !== null ? `${formatAmount(weight)}${unit ? ` ${unit}` : ""}` : "";

  if (qty !== null && qty > 1) {
    if (weightText) return `${qty} × ${weightText}`;
    return `${qty} ${unit || "items"}`;
  }
  if (weightText) return weightText;
  if (qty !== null && unit) return `${qty} ${unit}`;
  return "";
}

export type ItemPriceSummary = {
  min: number | null;
  max: number | null;
  label: string;
};

export function getItemPriceSummary(item: ItemData): ItemPriceSummary {
  const symbol = getItemCurrencySymbol(item);
  const prices = getItemOptions(item)
    .map((opt) => toNumber(opt.price))
    .filter((price): price is number => price !== null);
  if (prices.length === 0) {
    const fallback = toNumber(item.placements?.[0]?.price);
    return {
      min: fallback,
      max: fallback,
      label: fallback === null ? "—" : formatPrice(fallback, symbol),
    };
  }
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return {
    min,
    max,
    label:
      min === max
        ? formatPrice(min, symbol)
        : `${formatPrice(min, symbol)} – ${formatPrice(max, symbol)}`,
  };
}
