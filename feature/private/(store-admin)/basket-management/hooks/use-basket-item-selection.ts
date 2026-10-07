import { useCallback } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { BASKET_ITEM_QUANTITY_MAX } from "../constants/basket.constants";
import type { BasketFormValues, SelectedBasketItem } from "../schema/basket-form.schema";
import type { CatalogueItem } from "../types/basket.types";

/** Add / remove / re-quantify the items held in the basket builder form */
export function useBasketItemSelection() {
  const { control, getValues, setValue } = useFormContext<BasketFormValues>();
  const items = useWatch({ control, name: "items" }) as SelectedBasketItem[];

  const commit = useCallback(
    (next: SelectedBasketItem[]) =>
      setValue("items", next, { shouldDirty: true, shouldValidate: true }),
    [setValue],
  );

  const add = useCallback(
    (item: CatalogueItem) => {
      const current = getValues("items") as SelectedBasketItem[];
      if (current.some((i) => i.itemId === item.id)) return;
      commit([...current, { itemId: item.id, quantity: 1, item }]);
    },
    [commit, getValues],
  );

  const remove = useCallback(
    (itemId: string) =>
      commit((getValues("items") as SelectedBasketItem[]).filter((i) => i.itemId !== itemId)),
    [commit, getValues],
  );

  const setQuantity = useCallback(
    (itemId: string, quantity: number) =>
      commit(
        (getValues("items") as SelectedBasketItem[]).map((i) =>
          i.itemId === itemId
            ? { ...i, quantity: Math.min(BASKET_ITEM_QUANTITY_MAX, Math.max(1, quantity)) }
            : i,
        ),
      ),
    [commit, getValues],
  );

  const clear = useCallback(() => commit([]), [commit]);

  return { items, add, remove, setQuantity, clear };
}
