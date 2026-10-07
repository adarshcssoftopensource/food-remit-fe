import {
  createPackSizeOptionRow,
  type PackSizeOptionRow,
} from "@/components/common/pack-size-options";
import {
  ITEM_LIMITS,
  ITEM_NUMBER_MAX,
  ITEM_NUMBER_MESSAGE,
  ITEM_NUMBER_PATTERN,
  UPC_MESSAGE,
  UPC_PATTERN,
} from "@/lib/catalogue/item-rules";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import type { ActiveCategory } from "../categories/types/category.types";
import { useCreateItem } from "../items/hooks/use-create-item";
import { useUpdateItem } from "../items/hooks/use-update-item";
import { ItemData } from "../items/types/item.types";

type NumberRule = {
  label: string;
  required?: boolean;
  integer?: boolean;
  min: number;
  /** `min` itself is not allowed (e.g. price must be greater than 0) */
  exclusiveMin?: boolean;
  max: number;
  decimals?: number;
};

/**
 * Number fields are kept as strings in the form (empty = not provided) and
 * validated here so every field, optional or required, rejects negatives.
 */
function numberField(rule: NumberRule) {
  return z
    .string()
    .trim()
    .optional()
    .superRefine((raw, ctx) => {
      const value = raw ?? "";
      const fail = (message: string) => ctx.addIssue({ code: "custom", message });
      if (!value) {
        if (rule.required) fail(`${rule.label} is required`);
        return;
      }
      if (!/^\d+(\.\d+)?$/.test(value)) {
        fail(value.startsWith("-") ? `${rule.label} cannot be negative` : "Enter a valid number");
        return;
      }
      const num = Number(value);
      if (rule.integer && !Number.isInteger(num)) return fail("Enter a whole number");
      if (rule.exclusiveMin ? num <= rule.min : num < rule.min) {
        return fail(
          rule.exclusiveMin
            ? `${rule.label} must be greater than ${rule.min}`
            : `${rule.label} must be at least ${rule.min}`,
        );
      }
      if (num > rule.max) return fail(`${rule.label} cannot exceed ${rule.max.toLocaleString()}`);
      if (rule.decimals !== undefined && (value.split(".")[1]?.length ?? 0) > rule.decimals) {
        fail(`Use at most ${rule.decimals} decimal places`);
      }
    });
}

const packOptionSchema = z.object({
  key: z.string(),
  id: z.string().optional(),
  optionName: z
    .string()
    .trim()
    .max(ITEM_LIMITS.optionNameMax, `Keep it under ${ITEM_LIMITS.optionNameMax} characters`),
  quantityPerPack: numberField({
    label: "Quantity",
    integer: true,
    min: 1,
    max: ITEM_LIMITS.maxQuantity,
  }),
  netWeight: numberField({
    label: "Net weight",
    min: 0,
    exclusiveMin: true,
    max: ITEM_LIMITS.maxNetWeight,
    decimals: 3,
  }),
  weightUnit: z.string(),
  price: numberField({
    label: "Price",
    required: true,
    min: 0,
    exclusiveMin: true,
    max: ITEM_LIMITS.maxPrice,
    decimals: 2,
  }),
  _isSingleReadOnly: z.boolean().optional(),
});

const optionalText = (label: string) =>
  z
    .string()
    .max(ITEM_LIMITS.textMax, `${label} must be ${ITEM_LIMITS.textMax} characters or fewer`)
    .optional();

const itemSchema = z
  .object({
    productName: z
      .string()
      .trim()
      .min(ITEM_LIMITS.productNameMin, "Item name must be at least 2 characters")
      .max(ITEM_LIMITS.productNameMax, `Keep it under ${ITEM_LIMITS.productNameMax} characters`),
    description: optionalText("Description"),
    itemNumber: z
      .string()
      .trim()
      .max(ITEM_NUMBER_MAX, `Keep it under ${ITEM_NUMBER_MAX} characters`)
      .refine((value) => value === "" || ITEM_NUMBER_PATTERN.test(value), ITEM_NUMBER_MESSAGE)
      .optional(),
    upcCode: z
      .string()
      .trim()
      .refine((value) => value === "" || UPC_PATTERN.test(value), UPC_MESSAGE)
      .optional(),
    productInfo: optionalText("Product information"),
    nutritionInfo: optionalText("Nutrition information"),
    discountPercentage: numberField({ label: "Discount", min: 0, max: 100, decimals: 2 }),
    quantityOnHand: numberField({
      label: "Quantity on hand",
      required: true,
      integer: true,
      min: 0,
      max: ITEM_LIMITS.maxQuantity,
    }),
    isPerishable: z.boolean(),
    options: z
      .array(packOptionSchema)
      .min(1, "Add at least one pack / size option")
      .max(ITEM_LIMITS.maxOptions, `Add at most ${ITEM_LIMITS.maxOptions} pack / size options`),
    productImageFile: z.array(z.instanceof(File)).optional(),
    productInfoImageFile: z.array(z.instanceof(File)).optional(),
    nutritionInfoImageFile: z.array(z.instanceof(File)).optional(),
    existingProductImages: z.array(z.string()).optional(),
    existingProductInfoImage: z.string().nullable().optional(),
    existingNutritionInfoImage: z.string().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    const totalImages =
      (data.existingProductImages?.length || 0) + (data.productImageFile?.length || 0);

    if (totalImages === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["productImageFile"],
        message: "Add at least one product image",
      });
    }
    if (totalImages > ITEM_LIMITS.maxImages) {
      ctx.addIssue({
        code: "custom",
        path: ["productImageFile"],
        message: `Add at most ${ITEM_LIMITS.maxImages} product images`,
      });
    }

    const isMultipleEnabled =
      data.options.length > 1 ||
      (data.options.length === 1 && data.options[0]?._isSingleReadOnly === false);

    const seen = new Set<string>();
    data.options.forEach((opt, index) => {
      const name = opt.optionName.trim().toLowerCase();

      // Require option name ONLY when multiple pack / size options is enabled
      if (isMultipleEnabled && !name) {
        ctx.addIssue({
          code: "custom",
          path: ["options", index, "optionName"],
          message: "Option name is required",
        });
      }

      if (name) {
        if (seen.has(name)) {
          ctx.addIssue({
            code: "custom",
            path: ["options", index, "optionName"],
            message: "Each option needs a different name",
          });
        }
        seen.add(name);
      }

      if (opt.netWeight && !opt.weightUnit) {
        ctx.addIssue({
          code: "custom",
          path: ["options", index, "weightUnit"],
          message: "Pick a unit",
        });
      }
    });
  });

export type ItemFormValues = z.infer<typeof itemSchema>;
export type ItemSubmitMode = "close" | "createAnother";

function toInputString(value: number | string | null | undefined) {
  return value === null || value === undefined ? "" : String(value);
}

function mapItemOptions(item?: ItemData | null): PackSizeOptionRow[] {
  if (item && Array.isArray(item.options) && item.options.length > 0) {
    const isSingle = item.options.length === 1;
    return item.options.map((opt) =>
      createPackSizeOptionRow({
        id: opt.id,
        optionName: opt.optionName || "",
        quantityPerPack: toInputString(opt.quantityPerPack),
        netWeight: toInputString(opt.netWeight),
        weightUnit: opt.weightUnit || "",
        price: toInputString(opt.price),
        _isSingleReadOnly: isSingle,
      }),
    );
  }

  if (item) {
    // Legacy items stored pack details on the item and price on the placement
    const unit = item.weightUnit || item.unit || "";
    const netWeight = toInputString(item.netWeight);
    return [
      createPackSizeOptionRow({
        optionName: netWeight ? `${netWeight}${unit ? ` ${unit}` : ""}` : "Standard",
        quantityPerPack: toInputString(item.itemsPerPack),
        netWeight,
        weightUnit: unit,
        price: toInputString(item.placements?.[0]?.price),
        _isSingleReadOnly: true,
      }),
    ];
  }

  return [createPackSizeOptionRow({ _isSingleReadOnly: true })];
}

export function getInitialProductImages(item?: ItemData | null) {
  if (item?.productImageUrls && item.productImageUrls.length > 0) return item.productImageUrls;
  if (item?.productImageUrl) return [item.productImageUrl];
  if (item?.productImages && item.productImages.length > 0) return item.productImages;
  return [];
}

export function getInitialInfoImage(item?: ItemData | null) {
  return item?.productInfoImageUrl || item?.productInfoImage || "";
}

export function getInitialNutritionImage(item?: ItemData | null) {
  return item?.nutritionInfoImageUrl || item?.nutritionInfoImage || "";
}

function buildDefaultValues(item?: ItemData | null): ItemFormValues {
  const quantity = item?.quantityOnHand ?? item?.stockQuantity;
  return {
    productName: item?.productName ?? "",
    description: item?.description ?? "",
    itemNumber: item?.itemNumber ?? "",
    upcCode: item?.upcCode ?? "",
    productInfo: item?.productInfo ?? "",
    nutritionInfo: item?.nutritionInfo ?? "",
    discountPercentage: item?.discountPercentage ? String(item.discountPercentage) : "",
    quantityOnHand: quantity !== null && quantity !== undefined ? String(quantity) : "",
    isPerishable: item?.isPerishable ?? false,
    options: mapItemOptions(item),
    productImageFile: [],
    productInfoImageFile: [],
    nutritionInfoImageFile: [],
    existingProductImages: getInitialProductImages(item),
    existingProductInfoImage: getInitialInfoImage(item) || null,
    existingNutritionInfoImage: getInitialNutritionImage(item) || null,
  };
}

function buildFormData(
  values: ItemFormValues,
  item: ItemData | null | undefined,
  categoryId: string | undefined,
) {
  const formData = new FormData();
  if (categoryId) formData.append("categoryId", categoryId);

  formData.append(
    "options",
    JSON.stringify(
      values.options.map((opt) => ({
        ...(opt.id ? { id: opt.id } : {}),
        optionName: opt.optionName.trim() || "Standard",
        quantityPerPack: opt.quantityPerPack ? Number(opt.quantityPerPack) : null,
        netWeight: opt.netWeight ? Number(opt.netWeight) : null,
        weightUnit: opt.weightUnit || null,
        price: Number(opt.price),
      })),
    ),
  );

  formData.append("productName", values.productName.trim());
  formData.append("description", values.description?.trim() || "");
  formData.append("productInfo", values.productInfo?.trim() || "");
  formData.append("nutritionInfo", values.nutritionInfo?.trim() || "");
  formData.append("upcCode", values.upcCode?.trim() || "");
  formData.append("itemNumber", values.itemNumber?.trim() || "");

  const pct = values.discountPercentage ? Number(values.discountPercentage) : 0;
  formData.append("discountPercentage", String(pct));
  formData.append("discountAvailability", pct > 0 ? "true" : "false");

  formData.append("quantityOnHand", values.quantityOnHand || "0");
  formData.append("isPerishable", values.isPerishable ? "true" : "false");

  if (item && values.existingProductImages !== undefined) {
    formData.append("existingProductImages", JSON.stringify(values.existingProductImages));
  }
  values.productImageFile?.forEach((file) => formData.append("productImageFile", file));

  if (values.productInfoImageFile && values.productInfoImageFile[0]) {
    formData.append("productInfoImageFile", values.productInfoImageFile[0]);
  } else if (item && getInitialInfoImage(item) && !values.existingProductInfoImage) {
    formData.append("productInfoImage", "");
  }

  if (values.nutritionInfoImageFile && values.nutritionInfoImageFile[0]) {
    formData.append("nutritionInfoImageFile", values.nutritionInfoImageFile[0]);
  } else if (item && getInitialNutritionImage(item) && !values.existingNutritionInfoImage) {
    formData.append("nutritionInfoImage", "");
  }

  return formData;
}

interface UseItemFormArgs {
  /** Item being edited. Omit when creating. */
  item?: ItemData | null;
  /** Active category the new item is created in. Required when creating. */
  category?: ActiveCategory | null;
  onSaved?: (mode: ItemSubmitMode) => void;
}

export function useItemForm({ item, category, onSaved }: UseItemFormArgs) {
  const { mutateAsync: createItem, isPending: isCreating } = useCreateItem();
  const { mutateAsync: updateItem, isPending: isUpdating } = useUpdateItem(item?.id ?? "");
  const isSubmitting = isCreating || isUpdating;

  /** Changes on every reset so uncontrolled children (image pickers) remount clean */
  const [formKey, setFormKey] = useState(0);
  const [savedCount, setSavedCount] = useState(0);

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    mode: "onTouched",
    defaultValues: buildDefaultValues(item),
  });

  const submitValues = async (values: ItemFormValues, mode: ItemSubmitMode) => {
    const categoryId = category?.id;
    if (!item && !categoryId) {
      toast.error("Select a category before adding items.");
      return;
    }

    const formData = buildFormData(values, item, categoryId);

    try {
      const response = (await (item
        ? updateItem(formData as unknown as Parameters<typeof updateItem>[0])
        : createItem(formData as unknown as Parameters<typeof createItem>[0]))) as {
        status?: boolean | string;
        message?: string;
      };

      if (response?.status === false) {
        toast.error(response.message || `Couldn't ${item ? "update" : "create"} the item`);
        return;
      }

      toast.success(
        item
          ? `"${values.productName.trim()}" updated`
          : `"${values.productName.trim()}" added to ${category?.categoryName}`,
      );

      if (!item && mode === "createAnother") {
        setSavedCount((count) => count + 1);
        form.reset(buildDefaultValues(null));
        setFormKey((key) => key + 1);
      } else {
        form.reset(values);
      }
      onSaved?.(mode);
    } catch {
      // Axios interceptor already shows the error toast — avoid duplicate messages (WEB-0008)
    }
  };

  const submit = (mode: ItemSubmitMode) =>
    form.handleSubmit(
      (values) => submitValues(values, mode),
      () => toast.error("Please fix the highlighted fields before saving."),
    )();

  return { form, formKey, savedCount, isSubmitting, submit };
}
