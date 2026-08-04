import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ItemData } from "@/constants/catalogue-management";

const itemSchema = z.object({
  productName: z.string().min(2, "Item name must be at least 2 characters"),
  description: z.string().min(1, "Description is required"),
  upcCode: z.string().min(1, "UPC Code is required"),
  productInfo: z.string().min(1, "Product information is required"),
  nutritionInfo: z.string().optional(),
  discountPercentage: z.string().optional(),
  baseQuantity: z.string().min(1, "Base quantity is required"),
  unit: z.string().min(1, "Unit is required"),
  country: z.string().min(1, "Country is required"),
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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      country: item?.country ?? "",
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
        country: item?.country ?? "",
        departmentId: item?.departmentId ?? "",
        categoryId: item?.categoryId ?? "",
        productImageFile: [],
        productInfoImageFile: [],
        nutritionInfoImageFile: [],
      });
    }
  }, [open, item, form]);

  const handleSubmit = async (values: ItemFormValues) => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    onSubmitCallback?.(values);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return {
    form,
    isSubmitting,
    handleSubmit: form.handleSubmit(handleSubmit),
  };
}
