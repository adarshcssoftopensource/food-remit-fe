import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DepartmentData } from "@/constants/catalogue-management";

const departmentSchema = z.object({
  country: z.string().min(1, "Country is required"),
  name: z.string().min(2, "Department name must be at least 2 characters"),
  iconFile: z.array(z.instanceof(File)).optional(),
});

export type DepartmentFormValues = z.infer<typeof departmentSchema>;

export function useDepartmentForm(
  open: boolean,
  department: DepartmentData | null | undefined,
  onOpenChange: (open: boolean) => void,
  onSubmitCallback?: (values: DepartmentFormValues) => void,
) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      country: department?.country ?? "",
      name: department?.name ?? "",
      iconFile: [],
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        country: department?.country ?? "",
        name: department?.name ?? "",
        iconFile: [],
      });
    }
  }, [open, department, form]);

  const handleSubmit = async (values: DepartmentFormValues) => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600)); // Simulate API
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
