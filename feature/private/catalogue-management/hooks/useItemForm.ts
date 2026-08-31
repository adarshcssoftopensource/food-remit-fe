import type { ItemPlacementRow } from "@/components/common/item-placements-field";
import { resolveCurrencyDisplay } from "@/lib/currency";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useCreateItem } from "../items/hooks/use-create-item";
import { useUpdateItem } from "../items/hooks/use-update-item";
import { ItemData } from "../items/types/item.types";

const placementSchema = z.object({
  key: z.string(),
  countryId: z.string().min(1),
  departmentId: z.string().min(1),
  categoryId: z.string().min(1),
  price: z.string().min(1, "Price is required"),
  currency: z.string(),
  currencySymbol: z.string(),
  countryName: z.string(),
  departmentName: z.string(),
  categoryName: z.string(),
});

const itemSchema = z
  .object({
    productName: z.string().min(2, "Item name must be at least 2 characters"),
    description: z.string().min(1, "Description is required"),
    upcCode: z.string().optional(),
    productInfo: z.string().min(1, "Product information is required"),
    nutritionInfo: z.string().optional(),
    discountPercentage: z
      .string()
      .optional()
      .refine(
        (val) =>
          !val ||
          val.trim() === "" ||
          (!isNaN(parseFloat(val)) && parseFloat(val) >= 0 && parseFloat(val) <= 100),
        {
          message: "Please enter a valid percentage between 0 and 100",
        },
      ),

    baseQuantity: z.string().min(1, "Base quantity is required"),
    unit: z.string().min(1, "Unit is required"),
    placements: z.array(placementSchema).min(1, "Add at least one country price"),
    productImageFile: z
      .array(z.instanceof(File))
      .max(5, "Maximum 5 product images allowed")
      .optional(),
    productInfoImageFile: z.array(z.instanceof(File)).optional(),
    nutritionInfoImageFile: z.array(z.instanceof(File)).optional(),
    existingProductImages: z.array(z.string()).optional(),
    existingProductInfoImage: z.string().nullable().optional(),
    existingNutritionInfoImage: z.string().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    const existingCount = data.existingProductImages?.length || 0;
    const newFilesCount = data.productImageFile?.length || 0;
    const totalCount = existingCount + newFilesCount;

    if (totalCount === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["productImageFile"],
        message: "Product image is required (at least 1 image)",
      });
    }
    if (totalCount > 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["productImageFile"],
        message: "Maximum 5 product images allowed",
      });
    }

    data.placements.forEach((row) => {
      const price = Number(row.price);
      if (!row.price.trim() || Number.isNaN(price) || price < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["placements"],
          message: "Enter a valid price for every country row",
        });
      }
    });
  });

export type ItemFormValues = z.infer<typeof itemSchema>;

function mapItemPlacements(item?: ItemData | null): ItemPlacementRow[] {
  if (!item) return [];

  if (item.placements && item.placements.length > 0) {
    return item.placements.map((placement, index) => {
      const currencyMeta = resolveCurrencyDisplay({
        currency: placement.currency,
        countryName: placement.country?.name,
      });
      return {
        key: placement.id || `existing-${index}`,
        countryId: placement.countryId,
        departmentId: placement.departmentId,
        categoryId: placement.categoryId,
        price: String(placement.price ?? ""),
        currency: placement.currency || currencyMeta.code,
        currencySymbol: placement.currencySymbol || currencyMeta.symbol,
        countryName: placement.country?.name || "Country",
        departmentName:
          placement.department?.displayName || placement.department?.departmentName || "Department",
        categoryName: placement.category?.categoryName || "Category",
      };
    });
  }

  if (item.countryId && item.departmentId && item.categoryId) {
    const currencyMeta = resolveCurrencyDisplay({
      countryName: item.country?.name,
    });
    return [
      {
        key: `legacy-${item.id}`,
        countryId: item.countryId,
        departmentId: item.departmentId,
        categoryId: item.categoryId,
        price: "",
        currency: currencyMeta.code,
        currencySymbol: currencyMeta.symbol,
        countryName: item.country?.name || "Country",
        departmentName:
          item.departmentDisplayName || item.department?.departmentName || "Department",
        categoryName: item.category?.categoryName || "Category",
      },
    ];
  }

  return [];
}

export function useItemForm(
  open: boolean,
  item: ItemData | null | undefined,
  onOpenChange: (open: boolean) => void,
  onSubmitCallback?: (values: ItemFormValues) => void,
) {
  const { mutateAsync: createItem, isPending: isCreating } = useCreateItem();
  const { mutateAsync: updateItem, isPending: isUpdating } = useUpdateItem(item?.id ?? "");

  const isSubmitting = isCreating || isUpdating;

  const getInitialImages = (currentItem?: ItemData | null) => {
    if (currentItem?.productImageUrls && currentItem.productImageUrls.length > 0) {
      return currentItem.productImageUrls;
    }
    if (currentItem?.productImageUrl) {
      return [currentItem.productImageUrl];
    }
    if (currentItem?.productImages && currentItem.productImages.length > 0) {
      return currentItem.productImages;
    }
    return [];
  };

  const getInitialInfoImage = (currentItem?: ItemData | null) => {
    return currentItem?.productInfoImageUrl || currentItem?.productInfoImage || "";
  };

  const getInitialNutritionImage = (currentItem?: ItemData | null) => {
    return currentItem?.nutritionInfoImageUrl || currentItem?.nutritionInfoImage || "";
  };

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    mode: "onSubmit",
    defaultValues: {
      productName: item?.productName ?? "",
      description: item?.description ?? "",
      upcCode: item?.upcCode ?? "",
      productInfo: item?.productInfo ?? "",
      nutritionInfo: item?.nutritionInfo ?? "",
      discountPercentage:
        item?.discountPercentage !== null && item?.discountPercentage !== undefined
          ? item.discountPercentage.toString()
          : "0",
      baseQuantity: item?.baseQuantity?.toString() ?? "",
      unit: item?.unit ?? "",
      placements: mapItemPlacements(item),
      productImageFile: [],
      productInfoImageFile: [],
      nutritionInfoImageFile: [],
      existingProductImages: getInitialImages(item),
      existingProductInfoImage: getInitialInfoImage(item),
      existingNutritionInfoImage: getInitialNutritionImage(item),
    },
  });

  useEffect(() => {
    if (open) {
      form.clearErrors();
      form.reset(
        {
          productName: item?.productName ?? "",
          description: item?.description ?? "",
          upcCode: item?.upcCode ?? "",
          productInfo: item?.productInfo ?? "",
          nutritionInfo: item?.nutritionInfo ?? "",
          discountPercentage:
            item?.discountPercentage !== null && item?.discountPercentage !== undefined
              ? item.discountPercentage.toString()
              : "0",
          baseQuantity: item?.baseQuantity?.toString() ?? "",
          unit: item?.unit ?? "",
          placements: mapItemPlacements(item),
          productImageFile: [],
          productInfoImageFile: [],
          nutritionInfoImageFile: [],
          existingProductImages: getInitialImages(item),
          existingProductInfoImage: getInitialInfoImage(item),
          existingNutritionInfoImage: getInitialNutritionImage(item),
        },
        { keepErrors: false },
      );
    }
  }, [open, item, form]);

  const handleSubmit = async (values: ItemFormValues) => {
    try {
      const placements = Array.isArray(values.placements) ? values.placements : [];
      if (placements.length === 0) {
        toast.error("Add at least one country price");
        return;
      }

      const primary = placements[0];
      if (!primary?.countryId || !primary?.departmentId || !primary?.categoryId) {
        toast.error("Each placement needs country, department and category");
        return;
      }

      const formData = new FormData();
      formData.append("countryId", primary.countryId);
      formData.append("departmentId", primary.departmentId);
      formData.append("categoryId", primary.categoryId);
      formData.append(
        "placements",
        JSON.stringify(
          placements.map((row) => ({
            countryId: row.countryId,
            departmentId: row.departmentId,
            categoryId: row.categoryId,
            price: Number(row.price),
          })),
        ),
      );
      formData.append("productName", values.productName);
      formData.append("description", values.description);
      if (values.upcCode) formData.append("upcCode", values.upcCode);
      formData.append("productInfo", values.productInfo);
      if (values.nutritionInfo) formData.append("nutritionInfo", values.nutritionInfo);
      if (values.discountPercentage !== undefined && values.discountPercentage !== "") {
        formData.append("discountPercentage", values.discountPercentage);
        const pct = Number(values.discountPercentage);
        formData.append("discountAvailability", !Number.isNaN(pct) && pct > 0 ? "true" : "false");
      } else if (item) {
        formData.append("discountPercentage", "0");
        formData.append("discountAvailability", "false");
      }
      formData.append("baseQuantity", values.baseQuantity);
      formData.append("unit", values.unit);

      if (item && values.existingProductImages !== undefined) {
        formData.append("existingProductImages", JSON.stringify(values.existingProductImages));
      }

      if (values.productImageFile && values.productImageFile.length > 0) {
        values.productImageFile.forEach((file) => {
          formData.append("productImageFile", file);
        });
      }

      if (values.productInfoImageFile && values.productInfoImageFile.length > 0) {
        formData.append("productInfoImageFile", values.productInfoImageFile[0]);
      } else if (item) {
        const hadInitialInfo = !!getInitialInfoImage(item);
        if (hadInitialInfo && !values.existingProductInfoImage) {
          formData.append("productInfoImage", "");
        }
      }

      if (values.nutritionInfoImageFile && values.nutritionInfoImageFile.length > 0) {
        formData.append("nutritionInfoImageFile", values.nutritionInfoImageFile[0]);
      } else if (item) {
        const hadInitialNutrition = !!getInitialNutritionImage(item);
        if (hadInitialNutrition && !values.existingNutritionInfoImage) {
          formData.append("nutritionInfoImage", "");
        }
      }

      if (item) {
        const response = (await updateItem(formData as any)) as {
          status?: boolean | string;
          message?: string;
        };
        if (response?.status === false) {
          toast.error(response.message || "Failed to update item");
          return;
        }
        toast.success(response?.message || "Item updated successfully");
      } else {
        const response = (await createItem(formData as any)) as {
          status?: boolean | string;
          message?: string;
        };
        if (response?.status === false) {
          toast.error(response.message || "Failed to create item");
          return;
        }
        toast.success(response?.message || "Item created successfully");
      }

      onSubmitCallback?.(values);
      onOpenChange(false);
    } catch {
      // Axios interceptor already shows the error toast — avoid duplicate messages (WEB-0008)
    }
  };

  return {
    form,
    isSubmitting,
    handleSubmit: form.handleSubmit(handleSubmit),
  };
}
