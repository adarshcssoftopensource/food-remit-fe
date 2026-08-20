import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useCreateItem } from "../items/hooks/use-create-item";
import { useUpdateItem } from "../items/hooks/use-update-item";
import { ItemData } from "../items/types/item.types";

const itemSchema = z
  .object({
    productName: z.string().min(2, "Item name must be at least 2 characters"),
    description: z.string().min(1, "Description is required"),
    upcCode: z.string().optional(),
    productInfo: z.string().min(1, "Product information is required"),
    nutritionInfo: z.string().optional(),
    discountPercentage: z.string().optional(),
    baseQuantity: z.string().min(1, "Base quantity is required"),
    unit: z.string().min(1, "Unit is required"),
    countryId: z.string().min(1, "Country is required"),
    departmentId: z.string().min(1, "Department is required"),
    categoryId: z.string().min(1, "Category is required"),
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
  });

export type ItemFormValues = z.infer<typeof itemSchema>;

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
    if (
      (currentItem as any)?.productImageUrls &&
      (currentItem as any).productImageUrls.length > 0
    ) {
      return (currentItem as any).productImageUrls as string[];
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
    return (currentItem as any)?.productInfoImageUrl || currentItem?.productInfoImage || "";
  };

  const getInitialNutritionImage = (currentItem?: ItemData | null) => {
    return (currentItem as any)?.nutritionInfoImageUrl || currentItem?.nutritionInfoImage || "";
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
      discountPercentage: item?.discountPercentage?.toString() ?? "",
      baseQuantity: item?.baseQuantity?.toString() ?? "",
      unit: item?.unit ?? "",
      countryId: item?.countryId ?? "",
      departmentId: item?.departmentId ?? "",
      categoryId: item?.categoryId ?? "",
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
          discountPercentage: item?.discountPercentage?.toString() ?? "",
          baseQuantity: item?.baseQuantity?.toString() ?? "",
          unit: item?.unit ?? "",
          countryId: item?.countryId ?? "",
          departmentId: item?.departmentId ?? "",
          categoryId: item?.categoryId ?? "",
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
      const formData = new FormData();
      formData.append("countryId", values.countryId);
      formData.append("departmentId", values.departmentId);
      formData.append("categoryId", values.categoryId);
      formData.append("productName", values.productName);
      formData.append("description", values.description);
      if (values.upcCode) formData.append("upcCode", values.upcCode);
      formData.append("productInfo", values.productInfo);
      if (values.nutritionInfo) formData.append("nutritionInfo", values.nutritionInfo);
      if (values.discountPercentage)
        formData.append("discountPercentage", values.discountPercentage);
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
