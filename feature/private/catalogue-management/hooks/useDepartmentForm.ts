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
    storeId: z.string().optional(),
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

interface ProfileStore {
  id: string;
  storeName: string;
  city: string;
  country: string;
}

export interface DepartmentFormProfile {
  role?: string;
  roleCode?: string;
  stores?: ProfileStore[];
}

export function useDepartmentForm(
  open: boolean,
  department: DepartmentData | null | undefined,
  onOpenChange: (open: boolean) => void,
  onSubmitCallback?: (values: DepartmentFormValues) => void,
  profile?: DepartmentFormProfile | null,
) {
  const { mutateAsync: createDepartment, isPending: isCreating } = useCreateDepartment();
  const { mutateAsync: updateDepartment, isPending: isUpdating } = useUpdateDepartment(
    department?.id ?? "",
  );

  const isSubmitting = isCreating || isUpdating;

  const role = profile?.role || "";
  const roleCode = profile?.roleCode || "";
  const isStoreScoped =
    role === "store_manager" ||
    role === "employee" ||
    roleCode === "STORE_MANAGER" ||
    roleCode === "EMPLOYEE";

  // For Store Managers, auto-resolve country and store from their first assigned store
  const storeManagerStore = isStoreScoped && profile?.stores?.length ? profile.stores[0] : null;
  const autoCountryId = storeManagerStore?.country || "";
  const autoStoreId = storeManagerStore?.id || "";

  const getDefaultValues = (dep: DepartmentData | null | undefined) => ({
    countryId: dep?.country?.id ?? (isStoreScoped ? autoCountryId : ""),
    cityIds:
      dep?.cities && dep.cities.length > 0
        ? dep.cities.map((c) => c.id)
        : dep?.cityId || dep?.city?.id
          ? [dep.cityId || dep.city?.id]
          : [],
    storeId: dep?.storeId || dep?.store?.id || (isStoreScoped ? autoStoreId : ""),
    departmentName: dep?.departmentName ?? "",
    iconFile: [],
    hasExistingIcon: !!(dep?.departmentIcon || dep?.departmentIconUrl),
  });

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    mode: "onChange",
    defaultValues: getDefaultValues(department),
  });

  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues(department));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, department]);

  const handleSubmit = async (values: DepartmentFormValues) => {
    try {
      const formData = new FormData();
      formData.append("countryId", values.countryId);
      formData.append("departmentName", values.departmentName);

      if (isStoreScoped) {
        // Store Manager: backend auto-assigns their store's city — never send cityIds
        if (values.storeId) {
          formData.append("storeId", values.storeId);
        }
      } else {
        // Non-store roles: always send cityIds so backend knows when to clear
        if (values.cityIds && values.cityIds.length > 0) {
          formData.append("cityIds", JSON.stringify(values.cityIds));
        } else {
          formData.append("cityIds", JSON.stringify([]));
        }
        if (values.storeId) {
          formData.append("storeId", values.storeId);
        }
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
    isStoreScoped,
    storeManagerStore,
    handleSubmit: form.handleSubmit(handleSubmit),
  };
}
