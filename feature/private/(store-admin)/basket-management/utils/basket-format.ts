import type { BasketItemInfo } from "../types/basket.types";

export function formatMoney(value: number | null | undefined, currencySymbol = "$"): string {
  const amount = Number(value ?? 0);
  return `${currencySymbol}${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** e.g. "5 lb", "6 × 1 ltr", "12 pcs" */
export function formatItemSize(
  item: Pick<BasketItemInfo, "netWeight" | "weightUnit" | "itemsPerPack" | "unit">,
): string {
  const weight = item.netWeight
    ? `${item.netWeight}${item.weightUnit ? ` ${item.weightUnit}` : ""}`
    : "";
  if (item.itemsPerPack && item.itemsPerPack > 1) {
    return weight
      ? `${item.itemsPerPack} × ${weight}`
      : `${item.itemsPerPack} ${item.unit || "pcs"}`;
  }
  return weight || item.unit || "";
}
