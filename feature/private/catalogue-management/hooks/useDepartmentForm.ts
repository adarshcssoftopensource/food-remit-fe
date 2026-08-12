import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { DepartmentData } from "../departments/types/department.types";
import { useCreateDepartment } from "../departments/hooks/use-create-department";
import { useUpdateDepartment } from "../departments/hooks/use-update-department";

const departmentSchema = z.object({
  countryId: z.string().min(1, "Country is required"),
  departmentName: z.string().min(2, "Department name must be at least 2 characters"),
  iconFile: z.array(z.instanceof(File)).optional(),
});

export type DepartmentFormValues = z.infer<typeof departmentSchema>;

export function useDepartmentForm(
  open: boolean,
  department: DepartmentData | null | undefined,
  onOpenChange: (open: boolean) => void,
  onSubmitCallback?: (values: DepartmentFormValues) => void,
) {
  const { mutateAsync: createDepartment, isPending: isCreating } = useCreateDepartment();
  const { mutateAsync: updateDepartment, isPending: isUpdating } = useUpdateDepartment(
    department?.id ?? "",
  );

  const isSubmitting = isCreating || isUpdating;

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      countryId: department?.countryId ?? "",
      departmentName: department?.departmentName ?? "",
      iconFile: [],
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        countryId: department?.countryId ?? "",
        departmentName: department?.departmentName ?? "",
        iconFile: [],
      });
    }
  }, [open, department, form]);

  const handleSubmit = async (values: DepartmentFormValues) => {
    try {
      // Build form data since there might be an iconFile
      const formData = new FormData();
      formData.append("countryId", values.countryId);
      formData.append("departmentName", values.departmentName);

      if (values.iconFile && values.iconFile.length > 0) {
        formData.append("departmentIcon", values.iconFile[0]);
      }

      if (department) {
        await updateDepartment(formData as any);
        toast.success("Department updated successfully");
      } else {
        await createDepartment(formData as any);
        toast.success("Department created successfully");
      }

      onSubmitCallback?.(values);
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to save department");
    }
  };

  return {
    form,
    isSubmitting,
    handleSubmit: form.handleSubmit(handleSubmit),
  };
}
