import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CategoryData } from "@/constants/catalogue-management";

const categorySchema = z.object({
  country: z.string().min(1, "Country is required"),
  departmentId: z.string().min(1, "Department is required"),
  name: z.string().min(2, "Category name must be at least 2 characters"),
  iconFile: z.array(z.instanceof(File)).optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

export function useCategoryForm(
  open: boolean,
  category: CategoryData | null | undefined,
  onOpenChange: (open: boolean) => void,
  onSubmitCallback?: (values: CategoryFormValues) => void,
) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      country: category?.country ?? "",
      departmentId: category?.departmentId ?? "",
      name: category?.name ?? "",
      iconFile: [],
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        country: category?.country ?? "",
        departmentId: category?.departmentId ?? "",
        name: category?.name ?? "",
        iconFile: [],
      });
    }
  }, [open, category, form]);

  const handleSubmit = async (values: CategoryFormValues) => {
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
