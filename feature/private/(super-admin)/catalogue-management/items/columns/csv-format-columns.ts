import { ITEM_LIMITS, WEIGHT_UNITS } from "@/lib/catalogue/item-rules";

export type CsvColumn = {
  name: string;
  aliases?: string;
  required: boolean | "category";
  note: string;
};

export const CSV_COLUMNS: CsvColumn[] = [
  {
    name: "categoryName",
    required: "category",
    note: "Matched to your store's categories by name; created automatically if it doesn't exist.",
  },
  {
    name: "itemNumber",
    aliases: "sku, itemCode",
    required: false,
    note: "Your own code for the item. Rows with the same item number become one item with several packs. Re-importing a number updates that item.",
  },
  {
    name: "itemName",
    aliases: "productName",
    required: true,
    note: `${ITEM_LIMITS.productNameMin}–${ITEM_LIMITS.productNameMax} characters.`,
  },
  { name: "description", required: false, note: "Optional text." },
  {
    name: "upcEan",
    aliases: "upcCode, barcode",
    required: false,
    note: "8 to 14 digits. Format the column as Text in Excel so barcodes aren't turned into 4.8E+12.",
  },
  {
    name: "stockQuantity",
    aliases: "quantityOnHand",
    required: false,
    note: "Quantity on hand for the item. Whole number, 0 or more. Blank = 0 (saved as inactive).",
  },
  { name: "discountPercent", required: false, note: "0 to 100." },
  { name: "isPerishable", required: false, note: "yes / no (blank = no)." },
  {
    name: "productImage",
    required: false,
    note: `Optional — you can add images later. Up to ${ITEM_LIMITS.maxImages} filenames or URLs, separated by commas.`,
  },
  { name: "productInfo", required: false, note: "Optional text." },
  { name: "productInfoImage", required: false, note: "Optional. One filename or URL." },
  { name: "nutritionInfo", required: false, note: "Optional text." },
  { name: "nutritionInfoImage", required: false, note: "Optional. One filename or URL." },
  {
    name: "optionName",
    required: false,
    note: 'Pack / size name, e.g. "Single" or "6 Pack". Built from weight / quantity if blank.',
  },
  { name: "quantityPerPack", required: false, note: "Whole number, 1 or more." },
  { name: "netWeight", required: false, note: "Greater than 0. Needs a weightUnit." },
  {
    name: "weightUnit",
    required: false,
    note: `${WEIGHT_UNITS.join(", ")} (any case; litre, kgs, pieces… also work).`,
  },
  {
    name: "price",
    required: true,
    note: "Price of this pack. Greater than 0, up to 2 decimals. The item's first pack is its base price.",
  },
];
