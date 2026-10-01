/**
 * Shared item validation rules. Keep in sync with the API's
 * `src/admin/items/item-rules.ts` so the form, API and CSV import agree.
 */
export const ITEM_LIMITS = {
  productNameMin: 2,
  productNameMax: 150,
  textMax: 5000,
  optionNameMax: 80,
  maxOptions: 20,
  maxPrice: 1_000_000,
  maxQuantity: 1_000_000,
  maxNetWeight: 100_000,
  maxImages: 5,
  maxCsvRows: 2000,
} as const;

export const WEIGHT_UNITS = [
  "g",
  "kg",
  "mg",
  "lb",
  "oz",
  "ml",
  "ltr",
  "pcs",
  "dozen",
  "pack",
  "box",
  "bottle",
  "can",
  "bag",
  "set",
  "pair",
] as const;

export const UPC_PATTERN = /^\d{8,14}$/;
export const UPC_MESSAGE = "UPC / barcode must be 8 to 14 digits";

export const ITEM_NUMBER_MAX = 50;
export const ITEM_NUMBER_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._\-/]*$/;
export const ITEM_NUMBER_MESSAGE =
  "Use letters, numbers, dot, dash, underscore or slash (no spaces), starting with a letter or number";
