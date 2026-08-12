import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { CategoryData } from "../categories/types/category.types";
import { useCreateCategory } from "../categories/hooks/use-create-category";
import { useUpdateCategory } from "../categories/hooks/use-update-category";

const categorySchema = z.object({
  countryId: z.string().min(1, "Country is required"),
  departmentId: z.string().min(1, "Department is required"),
  categoryName: z.string().min(2, "Category name must be at least 2 characters"),
  iconFile: z.array(z.instanceof(File)).optional(),
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
      countryId: (category?.department as any)?.countryId ?? "",
      departmentId: category?.department?.id ?? "",
      categoryName: category?.categoryName ?? "",
      iconFile: [],
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        countryId: (category?.department as any)?.countryId ?? "",
        departmentId: category?.department?.id ?? "",
        categoryName: category?.categoryName ?? "",
        iconFile: [],
      });
    }
  }, [open, category, form]);

  const handleSubmit = async (values: CategoryFormValues) => {
    try {
      const formData = new FormData();
      formData.append("departmentId", values.departmentId);
      formData.append("categoryName", values.categoryName);

      if (values.iconFile && values.iconFile.length > 0) {
        formData.append("categoryIcon", values.iconFile[0]);
      }

      if (category) {
        await updateCategory(formData as any);
        toast.success("Category updated successfully");
      } else {
        await createCategory(formData as any);
        toast.success("Category created successfully");
      }

      onSubmitCallback?.(values);
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to save category");
    }
  };

  return {
    form,
    isSubmitting,
    handleSubmit: form.handleSubmit(handleSubmit),
  };
}
