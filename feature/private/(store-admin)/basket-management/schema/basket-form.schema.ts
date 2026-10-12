import { z } from "zod";

import {
  BASKET_DESCRIPTION_MAX,
  BASKET_DISCOUNT_PERCENT_MAX,
  BASKET_ITEM_QUANTITY_MAX,
  BASKET_NAME_MAX,
  BASKET_WEEKDAYS,
} from "../../../../../constants/basket.constants";
import type {
  BasketDetail,
  BasketItemInfo,
  BasketPricingMode,
  BasketPricingTotals,
  BasketType,
  CatalogueItem,
  CatalogueVariant,
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

/** Catalogue prices captured when an item is added, used until server pricing arrives */
export type SelectedBasketItem = {
  itemId: string;
  itemOptionId: string | null;
  optionName: string | null;
  quantity: number;
  /** Pass the item's catalogue discount into this basket */
  applyItemDiscount: boolean;
  item: BasketItemInfo & {
    vendorPrice?: number;
    /** Catalogue discount the item offers */
    discountPercent?: number;
    discountedVendorPrice?: number;
    /** Known when added from the catalogue, so the variant can be switched in place */
    variants?: CatalogueVariant[];
  };
};

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

/** Unit price after an item discount, rounded the same way as the API */
export const discountedPrice = (unitPrice: number, discountPercent: number) =>
  round2(unitPrice - round2((unitPrice * discountPercent) / 100));

/** Same key the API uses for pricing lines */
export const basketLineKey = (line: { itemId: string; itemOptionId?: string | null }) =>
  `${line.itemId}:${line.itemOptionId ?? ""}`;

/** Basket line for a catalogue product, using the variant's size and prices when given */
export function selectionFromCatalogue(
  item: CatalogueItem,
  variant: CatalogueVariant | null | undefined,
  quantity = 1,
  applyItemDiscount = false,
): SelectedBasketItem {
  if (!variant) {
    return {
      itemId: item.id,
      itemOptionId: null,
      optionName: null,
      quantity,
      applyItemDiscount,
      item,
    };
  }
  return {
    itemId: item.id,
    itemOptionId: variant.id,
    optionName: variant.optionName,
    quantity,
    applyItemDiscount,
    item: {
      ...item,
      netWeight: variant.netWeight,
      weightUnit: variant.weightUnit,
      itemsPerPack: variant.quantityPerPack,
      stockQuantity: variant.stockQuantity,
      optionName: variant.optionName,
      variantCount: item.variants.length,
      vendorPrice: variant.vendorPrice,
      discountPercent: variant.discountPercent,
      discountedVendorPrice: variant.discountedVendorPrice,
    },
  };
}

/** Draft-level shape; publish completeness is checked by `getPublishIssues` */
export const basketFormSchema = z.object({
  basketType: z.enum(BASKET_TYPES).nullable(),
  name: z.string().trim().max(BASKET_NAME_MAX, `Keep the name under ${BASKET_NAME_MAX} characters`),
  description: z
    .string()
    .trim()
    .max(BASKET_DESCRIPTION_MAX, `Keep the description under ${BASKET_DESCRIPTION_MAX} characters`),
  /** Preserved from earlier versions; not edited in the builder */
  shortDescription: z.string(),
  householdSize: z.string(),
  image: z.string().nullable(),
  pricingMode: z.enum(["STANDARD", "DISCOUNT_PERCENT", "MANUAL_PRICE"]),
  vendorDiscountPercent: z
    .number()
    .min(0, "Discount can't be negative")
    .max(BASKET_DISCOUNT_PERCENT_MAX, `Discount can be up to ${BASKET_DISCOUNT_PERCENT_MAX}%`)
    .nullable(),
  manualVendorPrice: z.number().min(0, "Price can't be negative").nullable(),
  availabilityMode: z.enum(["STORE_HOURS", "CUSTOM"]),
  availableFrom: z.string().nullable(),
  availableUntil: z.string().nullable(),
  availableDays: z.array(z.enum(BASKET_WEEKDAYS.map((d) => d.value) as [string, ...string[]])),
  items: z
    .array(
      z.object({
        itemId: z.string(),
        itemOptionId: z.string().nullable(),
        optionName: z.string().nullable(),
        quantity: z.number().int().min(1).max(BASKET_ITEM_QUANTITY_MAX),
        applyItemDiscount: z.boolean(),
        item: z.custom<SelectedBasketItem["item"]>(),
      }),
    )
    .max(100, "A basket can contain up to 100 different items"),
});

export type BasketFormValues = z.input<typeof basketFormSchema>;

export const ALL_WEEKDAYS = BASKET_WEEKDAYS.map((d) => d.value);

export const EMPTY_BASKET_FORM: BasketFormValues = {
  basketType: null,
  name: "",
  description: "",
  shortDescription: "",
  householdSize: "",
  image: null,
  pricingMode: "STANDARD",
  vendorDiscountPercent: null,
  manualVendorPrice: null,
  availabilityMode: "STORE_HOURS",
  availableFrom: null,
  availableUntil: null,
  availableDays: [],
  items: [],
};

export function basketToFormValues(basket: BasketDetail): BasketFormValues {
  return {
    basketType: basket.basketType,
    name: basket.name,
    description: basket.description ?? "",
    shortDescription: basket.shortDescription ?? "",
    householdSize: basket.householdSize ?? "",
    image: basket.image,
    pricingMode: basket.pricingMode,
    vendorDiscountPercent: basket.vendorDiscountPercent,
    manualVendorPrice: basket.manualVendorPrice,
    availabilityMode: basket.availabilityMode,
    availableFrom: basket.availableFrom,
    availableUntil: basket.availableUntil,
    availableDays: basket.availableDays,
    items: basket.items
      .filter((line) => line.item)
      .map((line) => ({
        itemId: line.itemId,
        itemOptionId: line.itemOptionId,
        optionName: line.optionName,
        quantity: line.quantity,
        applyItemDiscount: line.applyItemDiscount,
        item: {
          ...line.item!,
          vendorPrice: line.pricing?.vendorUnitPrice,
          discountPercent: line.pricing?.itemDiscountPercent ?? line.item!.itemDiscountPercent,
          discountedVendorPrice: line.pricing
            ? discountedPrice(line.pricing.vendorUnitPrice, line.pricing.itemDiscountPercent)
            : undefined,
        },
      })),
  };
}

export function formValuesToPayload(
  values: BasketFormValues,
  options: { storeId?: string; publish?: boolean },
): UpsertBasketPayload {
  const custom = values.availabilityMode === "CUSTOM";
  return {
    storeId: options.storeId,
    name: values.name.trim(),
    description: values.description.trim() || undefined,
    shortDescription: values.shortDescription.trim() || undefined,
    basketType: values.basketType ?? "CUSTOM",
    householdSize: values.householdSize || undefined,
    image: values.image,
    ...pricingOptionsOf(values),
    availabilityMode: values.availabilityMode,
    availableFrom: custom ? values.availableFrom : null,
    availableUntil: custom ? values.availableUntil : null,
    availableDays: custom ? values.availableDays : [],
    items: values.items.map(toItemInput),
    publish: options.publish,
  };
}

export const toItemInput = ({
  itemId,
  itemOptionId,
  optionName,
  quantity,
  applyItemDiscount,
}: Pick<
  SelectedBasketItem,
  "itemId" | "itemOptionId" | "optionName" | "quantity" | "applyItemDiscount"
>) => ({
  itemId,
  itemOptionId,
  optionName,
  quantity,
  applyItemDiscount: Boolean(applyItemDiscount),
});

/** Discount % and manual price are independent; either, both or neither may be set */
export function pricingOptionsOf(
  values: Pick<BasketFormValues, "vendorDiscountPercent" | "manualVendorPrice">,
) {
  const vendorDiscountPercent =
    Number(values.vendorDiscountPercent) > 0 ? Number(values.vendorDiscountPercent) : null;
  const manualVendorPrice =
    Number(values.manualVendorPrice) > 0 ? Number(values.manualVendorPrice) : null;
  const pricingMode: BasketPricingMode = manualVendorPrice
    ? "MANUAL_PRICE"
    : vendorDiscountPercent
      ? "DISCOUNT_PERCENT"
      : "STANDARD";
  return { pricingMode, vendorDiscountPercent, manualVendorPrice };
}

export type BasketSectionId =
  "template" | "information" | "contents" | "pricing" | "availability" | "image" | "summary";

export interface PublishIssue {
  section: BasketSectionId;
  field?: "name" | "description" | "householdSize" | "availableFrom" | "availableDays";
  message: string;
}

const todayKey = () => {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

/** Everything still missing before the basket can be published (mirrors the API rules) */
export function getPublishIssues(
  values: BasketFormValues,
  pricing?: Pick<BasketPricingTotals, "hasUnavailableItems">,
): PublishIssue[] {
  const issues: PublishIssue[] = [];
  if (!values.basketType) {
    issues.push({ section: "template", message: "Choose a basket template" });
  }
  if (values.basketType === "CUSTOM" && !values.householdSize.trim()) {
    issues.push({
      section: "template",
      field: "householdSize",
      message: "Choose how many people the basket is for",
    });
  }
  if (values.name.trim().length < 2) {
    issues.push({ section: "information", field: "name", message: "Add a basket name" });
  }
  if (!values.description.trim()) {
    issues.push({
      section: "information",
      field: "description",
      message: "Add a basket description",
    });
  }
  if (!values.items.length) {
    issues.push({ section: "contents", message: "Add at least one item" });
  } else if (pricing?.hasUnavailableItems) {
    issues.push({ section: "contents", message: "Remove unavailable items" });
  }
  if (values.availabilityMode === "CUSTOM") {
    const { availableFrom: from, availableUntil: until } = values;
    if (!from || !until) {
      issues.push({
        section: "availability",
        field: "availableFrom",
        message: "Set a start and end date for the custom schedule",
      });
    } else if (from > until) {
      issues.push({
        section: "availability",
        field: "availableFrom",
        message: "End date must be on or after the start date",
      });
    } else if (until < todayKey()) {
      issues.push({
        section: "availability",
        field: "availableFrom",
        message: "Custom schedule has already ended",
      });
    }
    if (!values.availableDays.length) {
      issues.push({
        section: "availability",
        field: "availableDays",
        message: "Select at least one available day",
      });
    }
  }
  return issues;
}
