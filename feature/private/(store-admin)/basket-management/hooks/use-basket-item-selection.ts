import { useCallback } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { BASKET_ITEM_QUANTITY_MAX } from "../../../../../constants/basket.constants";
import {
  basketLineKey,
  selectionFromCatalogue,
  type BasketFormValues,
  type SelectedBasketItem,
} from "../schema/basket-form.schema";
import type { CatalogueItem, CatalogueVariant } from "../types/basket.types";

const clampQuantity = (quantity: number) =>
  Math.min(BASKET_ITEM_QUANTITY_MAX, Math.max(1, quantity));

/** A catalogue product to add, with the chosen variant for multi-variant products */
export interface CataloguePick {
  item: CatalogueItem;
  variant: CatalogueVariant | null;
}

/**
 * Add / remove / re-quantify the lines held in the basket builder form.
 * Lines are keyed by product + variant, so two sizes of one product are separate lines.
 */
export function useBasketItemSelection() {
  const { control, getValues, setValue } = useFormContext<BasketFormValues>();
  const items = useWatch({ control, name: "items" }) as SelectedBasketItem[];

  const current = useCallback(() => getValues("items") as SelectedBasketItem[], [getValues]);

  const commit = useCallback(
    (next: SelectedBasketItem[]) =>
      setValue("items", next, { shouldDirty: true, shouldValidate: true }),
    [setValue],
  );

  /** Adds lines with quantity 1, skipping ones already in the basket */
  const addMany = useCallback(
    (picks: CataloguePick[]) => {
      const existing = new Set(current().map(basketLineKey));
      const fresh: SelectedBasketItem[] = [];
      for (const { item, variant } of picks) {
        const line = selectionFromCatalogue(item, variant);
        const key = basketLineKey(line);
        if (existing.has(key)) continue;
        existing.add(key);
        fresh.push(line);
      }
      if (fresh.length) commit([...current(), ...fresh]);
      return fresh.length;
    },
    [commit, current],
  );

  const removeMany = useCallback(
    (lineKeys: string[]) => {
      const keys = new Set(lineKeys);
      commit(current().filter((i) => !keys.has(basketLineKey(i))));
    },
    [commit, current],
  );

  const setQuantity = useCallback(
    (lineKey: string, quantity: number) =>
      commit(
        current().map((i) =>
          basketLineKey(i) === lineKey ? { ...i, quantity: clampQuantity(quantity) } : i,
        ),
      ),
    [commit, current],
  );

  /** Switches a line to another variant; merges into that variant's line if it's already added */
  const setVariant = useCallback(
    (lineKey: string, variant: CatalogueVariant) => {
      const lines = current();
      const source = lines.find((i) => basketLineKey(i) === lineKey);
      const variants = source?.item.variants;
      if (!source || !variants?.length) return;
      const next = selectionFromCatalogue(
        { ...source.item, variants } as CatalogueItem,
        variant,
        source.quantity,
      );
      const nextKey = basketLineKey(next);
      if (nextKey === lineKey) return;
      const target = lines.find((i) => basketLineKey(i) === nextKey);
      commit(
        target
          ? lines
              .filter((i) => basketLineKey(i) !== lineKey)
              .map((i) =>
                i === target ? { ...i, quantity: clampQuantity(i.quantity + source.quantity) } : i,
              )
          : lines.map((i) => (i === source ? next : i)),
      );
    },
    [commit, current],
  );

  return { items, addMany, removeMany, setQuantity, setVariant };
}
