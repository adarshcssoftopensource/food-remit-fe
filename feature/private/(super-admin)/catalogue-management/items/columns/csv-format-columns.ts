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
    name: "quantityOnHand",
    aliases: "Quantity On Hand, stockQuantity",
    required: false,
    note: "Whole number, 0 or more. Blank = 0 (saved as inactive).",
  },
  { name: "discountPercent", required: false, note: "0 to 100." },
  { name: "isPerishable", required: false, note: "yes / no (blank = no)." },
  {
    name: "productImage",
    required: false,
    note: `Optional. Up to ${ITEM_LIMITS.maxImages} images separated by commas — file names from "Upload images" (single files or a ZIP) and/or public https:// links, e.g. "milk-front.png, https://example.com/milk-back.jpg". Links are downloaded and saved during import.`,
  },
  { name: "productInfo", required: false, note: "Optional text." },
  {
    name: "productInfoImage",
    required: false,
    note: "Optional. One uploaded file name or public image link.",
  },
  { name: "nutritionInfo", required: false, note: "Optional text." },
  {
    name: "nutritionInfoImage",
    required: false,
    note: "Optional. One uploaded file name or public image link.",
  },
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
