import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useCreateDepartment } from "../departments/hooks/use-create-department";
import { useUpdateDepartment } from "../departments/hooks/use-update-department";
import { DepartmentData } from "../departments/types/department.types";

const departmentSchema = z
  .object({
    countryId: z.string().min(1, "Country is required"),
    cityIds: z.array(z.string()).optional(),
    departmentName: z
      .string()
      .min(2, "Department name must be at least 2 characters")
      .max(50, "Department name must not exceed 50 characters"),
    iconFile: z.array(z.instanceof(File)).optional(),
    hasExistingIcon: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.hasExistingIcon && (!data.iconFile || data.iconFile.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["iconFile"],
        message: "Department logo is required",
      });
    }
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
    mode: "onChange",
    defaultValues: {
      countryId: department?.country?.id ?? "",
      cityIds:
        department?.cityId || department?.city?.id
          ? [department.cityId || department.city?.id]
          : [],
      departmentName: department?.departmentName ?? "",
      iconFile: [],
      hasExistingIcon: !!(department?.departmentIcon || department?.departmentIconUrl),
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        countryId: department?.country?.id ?? "",
        cityIds:
          department?.cityId || department?.city?.id
            ? [department.cityId || department.city?.id]
            : [],
        departmentName: department?.departmentName ?? "",
        iconFile: [],
        hasExistingIcon: !!(department?.departmentIcon || department?.departmentIconUrl),
      });
    }
  }, [open, department, form]);

  const handleSubmit = async (values: DepartmentFormValues) => {
    try {
      const formData = new FormData();
      formData.append("countryId", values.countryId);
      formData.append("departmentName", values.departmentName);

      if (values.cityIds && values.cityIds.length > 0) {
        values.cityIds.forEach((cityId) => {
          formData.append("cityIds[]", cityId);
        });
      }

      if (values.iconFile && values.iconFile.length > 0) {
        formData.append("departmentIcon", values.iconFile[0]);
      }

      if (department) {
        const response = (await updateDepartment(formData as any)) as {
          status?: boolean | string;
          message?: string;
        };
        if (response?.status === false) {
          toast.error(response.message || "Failed to update department");
          return;
        }
        toast.success(response?.message || "Department updated successfully");
      } else {
        const response = (await createDepartment(formData as any)) as {
          status?: boolean | string;
          message?: string;
        };
        if (response?.status === false) {
          toast.error(response.message || "Failed to create department");
          return;
        }
        toast.success(response?.message || "Department created successfully");
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
