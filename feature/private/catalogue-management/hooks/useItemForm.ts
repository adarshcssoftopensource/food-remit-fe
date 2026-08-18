import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { ItemData } from "../items/types/item.types";
import { useCreateItem } from "../items/hooks/use-create-item";
import { useUpdateItem } from "../items/hooks/use-update-item";

const itemSchema = z.object({
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
  productImageFile: z.array(z.instanceof(File)).optional(),
  productInfoImageFile: z.array(z.instanceof(File)).optional(),
  nutritionInfoImageFile: z.array(z.instanceof(File)).optional(),
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

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
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
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
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
      });
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

      if (values.productImageFile && values.productImageFile.length > 0) {
        formData.append("productImageFile", values.productImageFile[0]);
      }
      if (values.productInfoImageFile && values.productInfoImageFile.length > 0) {
        formData.append("productInfoImageFile", values.productInfoImageFile[0]);
      }
      if (values.nutritionInfoImageFile && values.nutritionInfoImageFile.length > 0) {
        formData.append("nutritionInfoImageFile", values.nutritionInfoImageFile[0]);
      }

      if (item) {
        await updateItem(formData as any);
        toast.success("Item updated successfully");
      } else {
        await createItem(formData as any);
        toast.success("Item created successfully");
      }

      onSubmitCallback?.(values);
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to save item");
    }
  };

  return {
    form,
    isSubmitting,
    handleSubmit: form.handleSubmit(handleSubmit),
  };
}
