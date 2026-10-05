"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { EmployeeFormValues } from "@/feature/private/(store-admin)/employee-management/schema/employee.schema";
import { type Employee } from "@/feature/private/(store-admin)/employee-management/types/employee-management";
import { useState } from "react";
import { useCreateEmployee } from "../hooks/use-create-employee";
import { useEmployeeDialogForm } from "../hooks/use-employee-dialog-form";
import { useUpdateEmployee } from "../hooks/use-update-employee";
import {
  EmployeeContactSection,
  EmployeeDialogFooter,
  EmployeeDialogHeader,
  EmployeeImageField,
  EmployeeLocationSection,
  EmployeePersonalDetailsSection,
} from "./employee-dialog-sections";

interface EmployeeDialogProps {
  employee?: Employee;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

function buildEmployeeFormData(data: EmployeeFormValues) {
  const formData = new FormData();
  formData.append("firstName", data.firstName);
  formData.append("lastName", data.lastName);
  formData.append("email", data.email);
  if (data.phoneNumber) formData.append("phoneNumber", data.phoneNumber);
  if (data.countryCode) formData.append("countryCode", data.countryCode);
  if (data.address) formData.append("address", data.address);
  if (data.city) formData.append("city", data.city);
  if (data.state) formData.append("state", data.state);
  if (data.zipCode) formData.append("zipCode", data.zipCode);
  if (data.country) formData.append("country", data.country);
  if (data.accountStatus) formData.append("accountStatus", data.accountStatus);

  if (data.image instanceof File) {
    formData.append("image", data.image);
  } else if (typeof data.image === "string") {
    formData.append("image", data.image);
  }
  return formData;
}

export function EmployeeDialog({
  employee,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  trigger,
}: EmployeeDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = setControlledOpen || setInternalOpen;

  const isEdit = !!employee;

  const { mutate: createEmployee, isPending: isCreating } = useCreateEmployee();
  const { mutate: updateEmployee, isPending: isUpdating } = useUpdateEmployee(employee?.id || "");

  const isPending = isCreating || isUpdating;
  const { form, phoneIso, setPhoneIso, targetCountryIso, targetCountryName } =
    useEmployeeDialogForm(open, employee);

  const onSubmit = (data: EmployeeFormValues) => {
    const formData = buildEmployeeFormData(data);

    if (isEdit && employee) {
      updateEmployee(formData, {
        onSuccess: () => setOpen(false),
      });
    } else {
      createEmployee(formData, {
        onSuccess: () => setOpen(false),
      });
    }
  };

  const handlePlaceSelect = (place: any) => {
    form.setValue("address", place.streetAddress || place.name || "", {
      shouldValidate: true,
      shouldDirty: true,
    });
    form.setValue("city", place.city || "", {
      shouldValidate: true,
      shouldDirty: true,
    });
    form.setValue("state", place.state || "", {
      shouldValidate: true,
      shouldDirty: true,
    });
    form.setValue("zipCode", place.postalCode || "", {
      shouldValidate: true,
      shouldDirty: true,
    });
    form.setValue("country", place.country || "", {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger>{trigger}</DialogTrigger>}
      <DialogContent className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl p-0">
        <EmployeeDialogHeader isEdit={isEdit} />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex min-h-0 flex-1 flex-col bg-slate-50/50"
          >
            <div className="flex-1 overflow-y-auto p-4">
              <div className="mx-auto max-w-3xl space-y-6">
                <EmployeeImageField form={form} />
                <EmployeePersonalDetailsSection form={form} />
                <EmployeeContactSection
                  form={form}
                  isEdit={isEdit}
                  phoneIso={phoneIso}
                  targetCountryIso={targetCountryIso}
                  setPhoneIso={setPhoneIso}
                />
                <EmployeeLocationSection
                  form={form}
                  targetCountryIso={targetCountryIso}
                  targetCountryName={targetCountryName}
                  onPlaceSelect={handlePlaceSelect}
                />
              </div>
            </div>

            <EmployeeDialogFooter
              isPending={isPending}
              isEdit={isEdit}
              onCancel={() => setOpen(false)}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
