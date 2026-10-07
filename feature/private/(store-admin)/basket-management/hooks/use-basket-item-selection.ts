import { useCallback } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { BASKET_ITEM_QUANTITY_MAX } from "../../../../../constants/basket.constants";
import type { BasketFormValues, SelectedBasketItem } from "../schema/basket-form.schema";
import type { CatalogueItem } from "../types/basket.types";

/** Add / remove / re-quantify the items held in the basket builder form */
export function useBasketItemSelection() {
  const { control, getValues, setValue } = useFormContext<BasketFormValues>();
  const items = useWatch({ control, name: "items" }) as SelectedBasketItem[];

  const current = useCallback(() => getValues("items") as SelectedBasketItem[], [getValues]);

  const commit = useCallback(
    (next: SelectedBasketItem[]) =>
      setValue("items", next, { shouldDirty: true, shouldValidate: true }),
    [setValue],
  );

  /** Adds catalogue items with quantity 1, skipping ones already in the basket */
  const addMany = useCallback(
    (toAdd: CatalogueItem[]) => {
      const existing = new Set(current().map((i) => i.itemId));
      const fresh = toAdd
        .filter((item) => !existing.has(item.id))
        .map((item) => ({ itemId: item.id, quantity: 1, item }));
      if (fresh.length) commit([...current(), ...fresh]);
      return fresh.length;
    },
    [commit, current],
  );

  const removeMany = useCallback(
    (itemIds: string[]) => {
      const ids = new Set(itemIds);
      commit(current().filter((i) => !ids.has(i.itemId)));
    },
    [commit, current],
  );

  const setQuantity = useCallback(
    (itemId: string, quantity: number) =>
      commit(
        current().map((i) =>
          i.itemId === itemId
            ? { ...i, quantity: Math.min(BASKET_ITEM_QUANTITY_MAX, Math.max(1, quantity)) }
            : i,
        ),
      ),
    [commit, current],
  );

  return { items, addMany, removeMany, setQuantity };
}
