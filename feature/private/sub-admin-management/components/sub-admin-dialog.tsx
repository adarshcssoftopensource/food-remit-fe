"use client";

import { successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useCreateSubAdmin } from "../hooks/use-create-sub-admin";
import { useSubAdminPermissions } from "../hooks/use-sub-admin-permissions";
import { useUpdateSubAdmin } from "../hooks/use-update-sub-admin";
import { type SubAdminFormValues } from "../schema/sub-admin.schema";
import type { SubAdminData } from "../types/sub-admin.types";
import { SubAdminForm } from "./sub-admin-form";

interface SubAdminDialogProps {
  mode?: "add" | "edit";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  admin?: SubAdminData | null;
}

export function SubAdminDialog({
  mode = "add",
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  admin = null,
}: SubAdminDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const onOpenChange = isControlled ? controlledOnOpenChange! : setInternalOpen;

  const { data: permissionsResponse, isLoading: isPermissionsLoading } =
    useSubAdminPermissions(open);

  const { mutateAsync: createSubAdmin, isPending: isCreatingSubAdmin } = useCreateSubAdmin();

  const { mutateAsync: updateSubAdmin, isPending: isUpdatingSubAdmin } = useUpdateSubAdmin(
    admin?.id ?? "",
  );

  const handleSubmit = async (values: SubAdminFormValues) => {
    try {
      const rawPhone = values.phone;
      const localNumber = rawPhone.slice(rawPhone.length - 10);
      const countryCode = rawPhone.slice(0, rawPhone.length - 10);

      if (mode === "add") {
        const response = await createSubAdmin({
          name: values.name,
          countryCode,
          email: values.email,
          phoneNumber: localNumber,
          permissions: values.permissions.map((key) => ({ key })),
        });

        successToast({ title: response.message || "Sub Admin added successfully" });
      } else if (mode === "edit" && admin) {
        const response = await updateSubAdmin({
          name: values.name,
          countryCode,
          email: values.email,
          phoneNumber: localNumber,
          permissions: values.permissions.map((key) => ({ key })),
        });

        successToast({ title: response.message || "Sub Admin updated successfully" });
      }

      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  const buildInitialPhone = (): string => {
    if (!admin?.contactNumber) return "";
    return admin.contactNumber.replace(/^\+/, "").replace(/\s+/g, "");
  };

  const initialValues: Partial<SubAdminFormValues> | undefined =
    mode === "edit" && admin
      ? {
          name: admin.userName,
          email: admin.email,
          phone: buildInitialPhone(),
          permissions: admin.permissions.map((permission) => permission.key),
        }
      : undefined;

  const isSubmitting = mode === "add" ? isCreatingSubAdmin : isUpdatingSubAdmin;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {mode === "add" && (
        <DialogTrigger render={<Button />}>
          <Plus className="mr-2 h-4 w-4" />
          Add Sub-Admin
        </DialogTrigger>
      )}
      <DialogContent className="w-full max-w-4xl">
        <DialogHeader className="rounded-t-3xl border-b px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <div className="flex-1">
              <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">
                {mode === "add" ? "Add Sub Admin" : "Edit Sub Admin"}
              </DialogTitle>

              {mode === "add" && (
                <DialogDescription className="mt-1 text-sm text-slate-600">
                  Create a new sub-admin account and assign permissions for dashboard access.
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>
        <SubAdminForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitLabel={mode}
          isSubmitting={isSubmitting}
          permissions={permissionsResponse?.data ?? []}
          isPermissionsLoading={isPermissionsLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
