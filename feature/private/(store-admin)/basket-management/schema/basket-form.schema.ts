import { z } from "zod";

import {
  BASKET_DESCRIPTION_MAX,
  BASKET_ITEM_QUANTITY_MAX,
  BASKET_NAME_MAX,
  BASKET_SHORT_DESCRIPTION_MAX,
} from "../../../../../constants/basket.constants";
import type {
  BasketDetail,
  BasketItemInfo,
  BasketType,
  UpsertBasketPayload,
} from "../types/basket.types";

const BASKET_TYPES = [
  "BASIC",
  "FAMILY",
  "LARGE_FAMILY",
  "MONTHLY_ESSENTIALS",
  "SEASONAL",
  "CUSTOM",
] as const satisfies readonly BasketType[];

export type SelectedBasketItem = {
  itemId: string;
  quantity: number;
  item: BasketItemInfo & { vendorPrice?: number };
};

export const basketFormSchema = z.object({
  basketType: z
    .enum(BASKET_TYPES, { message: "Choose a basket type to continue" })
    .nullable()
    .refine((value) => value !== null, "Choose a basket type to continue"),
  name: z
    .string()
    .trim()
    .min(2, "Basket name must be at least 2 characters")
    .max(BASKET_NAME_MAX, `Keep the name under ${BASKET_NAME_MAX} characters`),
  shortDescription: z
    .string()
    .trim()
    .max(BASKET_SHORT_DESCRIPTION_MAX, `Max ${BASKET_SHORT_DESCRIPTION_MAX} characters`),
  description: z
    .string()
    .trim()
    .max(BASKET_DESCRIPTION_MAX, `Max ${BASKET_DESCRIPTION_MAX} characters`),
  householdSize: z.string(),
  image: z.string().nullable(),
  isActive: z.boolean(),
  items: z
    .array(
      z.object({
        itemId: z.string(),
        quantity: z.number().int().min(1).max(BASKET_ITEM_QUANTITY_MAX),
        item: z.custom<SelectedBasketItem["item"]>(),
      }),
    )
    .max(100, "A basket can contain up to 100 different items"),
});

export type BasketFormValues = z.input<typeof basketFormSchema>;

export const EMPTY_BASKET_FORM: BasketFormValues = {
  basketType: null,
  name: "",
  shortDescription: "",
  description: "",
  householdSize: "",
  image: null,
  isActive: true,
  items: [],
};

export function basketToFormValues(basket: BasketDetail): BasketFormValues {
  return {
    basketType: basket.basketType,
    name: basket.name,
    shortDescription: basket.shortDescription ?? "",
    description: basket.description ?? "",
    householdSize: basket.householdSize ?? "",
    image: basket.image,
    isActive: basket.status !== "INACTIVE",
    items: basket.items
      .filter((line) => line.item)
      .map((line) => ({
        itemId: line.itemId,
        quantity: line.quantity,
        item: { ...line.item!, vendorPrice: line.pricing?.vendorUnitPrice },
      })),
  };
}

export function formValuesToPayload(
  values: BasketFormValues,
  options: { storeId?: string; publish?: boolean },
): UpsertBasketPayload {
  return {
    storeId: options.storeId,
    name: values.name.trim(),
    shortDescription: values.shortDescription.trim() || undefined,
    description: values.description.trim() || undefined,
    basketType: values.basketType ?? "CUSTOM",
    householdSize: values.householdSize || undefined,
    image: values.image,
    isActive: values.isActive,
    items: values.items.map(({ itemId, quantity }) => ({ itemId, quantity })),
    publish: options.publish,
  };
}
