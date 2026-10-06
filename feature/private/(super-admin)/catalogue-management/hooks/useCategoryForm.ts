import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ROUTES } from "@/config/routes";
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
  const router = useRouter();
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
    let createdId: string | undefined;
    try {
      const formData = new FormData();
      formData.append("categoryName", values.categoryName);
      formData.append("countryId", values.countryId);
      if (values.cityId) {
        formData.append("cityId", values.cityId);
      }

      if (values.iconFile && values.iconFile[0]) {
        formData.append("categoryIcon", values.iconFile[0]);
      } else if (values.hasExistingIcon && category) {
        const existingUrl = category.categoryIcon || category.categoryIconUrl;
        if (existingUrl) {
          formData.append("categoryIcon", existingUrl);
        }
      } else if (!values.hasExistingIcon) {
        // Explicitly send a flag to delete the image on the backend
        formData.append("categoryIcon", "DELETE_IMAGE");
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
          data?: { id?: string };
        };
        if (response?.status === false) {
          toast.error(response.message || "Failed to create category");
          return;
        }
        toast.success(response?.message || "Category created successfully");
        createdId = response?.data?.id;
      }

      onSubmitCallback?.(values);
      onOpenChange(false);
      if (createdId) {
        router.push(ROUTES.ADMIN.CATALOGUE_MANAGEMENT.CATEGORY_WORKSPACE(createdId));
      }
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
