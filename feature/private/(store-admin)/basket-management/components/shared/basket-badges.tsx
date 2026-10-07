import { cn } from "@/lib/utils";

import { BASKET_STATUS_META, BASKET_TYPE_MAP } from "../../constants/basket.constants";
import type { BasketStatus, BasketType } from "../../types/basket.types";

export function BasketStatusBadge({
  status,
  className,
}: {
  status: BasketStatus;
  className?: string;
}) {
  const meta = BASKET_STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold ring-1 ring-inset",
        meta.className,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", meta.dotClassName)} />
      {meta.label}
    </span>
  );
}

export function BasketTypeBadge({
  type,
  short,
  className,
}: {
  type: BasketType;
  /** Drop the trailing "Basket" word, e.g. "Family" */
  short?: boolean;
  className?: string;
}) {
  const meta = BASKET_TYPE_MAP[type];
  const label = short ? meta.label.replace(/ Basket$/, "") : meta.label;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold whitespace-nowrap ring-1 ring-inset",
        meta.badgeClassName,
        className,
      )}
    >
      {label}
    </span>
  );
}
