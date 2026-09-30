import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useCreateCategory } from "../categories/hooks/use-create-category";
import { useUpdateCategory } from "../categories/hooks/use-update-category";
import { CategoryData } from "../categories/types/category.types";

const categorySchema = z.object({
  countryId: z.string().min(1, "Country is required"),
  cityId: z.string().optional(),
  categoryName: z.string().min(2, "Category name must be at least 2 characters"),
  iconFile: z.array(z.instanceof(File)).optional(),
  hasExistingIcon: z.boolean().optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

export function useCategoryForm(
  open: boolean,
  category: CategoryData | null | undefined,
  onOpenChange: (open: boolean) => void,
  onSubmitCallback?: (values: CategoryFormValues) => void,
) {
  const { mutateAsync: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutateAsync: updateCategory, isPending: isUpdating } = useUpdateCategory(
    category?.id ?? "",
  );

  const isSubmitting = isCreating || isUpdating;

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      countryId: category?.countryId ?? (category?.department as any)?.countryId ?? "",
      cityId: category?.cityId ?? (category?.department as any)?.cityId ?? "",
      categoryName: category?.categoryName ?? "",
      iconFile: [],
      hasExistingIcon: !!(category?.categoryIcon || category?.categoryIconUrl),
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        countryId: category?.countryId ?? (category?.department as any)?.countryId ?? "",
        cityId: category?.cityId ?? (category?.department as any)?.cityId ?? "",
        categoryName: category?.categoryName ?? "",
        iconFile: [],
        hasExistingIcon: !!(category?.categoryIcon || category?.categoryIconUrl),
      });
    }
  }, [open, category, form]);

  const handleSubmit = async (values: CategoryFormValues) => {
    try {
      const formData = new FormData();
      formData.append("categoryName", values.categoryName);
      formData.append("countryId", values.countryId);
      if (values.cityId) {
        formData.append("cityId", values.cityId);
      }

      if (values.iconFile && values.iconFile.length > 0) {
        formData.append("categoryIcon", values.iconFile[0]);
      }

      if (category) {
        const response = (await updateCategory(formData as any)) as {
          status?: boolean | string;
          message?: string;
        };
        if (response?.status === false) {
          toast.error(response.message || "Failed to update category");
          return;
        }
        toast.success(response?.message || "Category updated successfully");
      } else {
        const response = (await createCategory(formData as any)) as {
          status?: boolean | string;
          message?: string;
        };
        if (response?.status === false) {
          toast.error(response.message || "Failed to create category");
          return;
        }
        toast.success(response?.message || "Category created successfully");
      }

      onSubmitCallback?.(values);
      onOpenChange(false);
    } catch {
      // Axios interceptor already shows the error toast — avoid duplicates
    }
  };

  return {
    form,
    isSubmitting,
    handleSubmit: form.handleSubmit(handleSubmit),
  };
}
