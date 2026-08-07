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

  const handleSubmit = async (values: SubAdminFormValues) => {
    try {
      if (mode === "add") {
        const response = await createSubAdmin({
          name: values.name,
          countryCode: values.phoneCode,
          email: values.email,
          phoneNumber: values.phoneNumber,
          permission: values.permissions.map((key) => ({ key })),
        });

        successToast({ title: response.message || "Sub Admin added successfully" });
      }

      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  const initialValues: Partial<SubAdminFormValues> | undefined =
    mode === "edit" && admin
      ? {
          name: admin.userName,
          email: admin.email,
          phoneCode: admin.contactNumber?.split(" ")?.[0] || "",
          phoneNumber: admin.contactNumber || "",
          permissions: admin.permissions.map((permission) => permission.key),
        }
      : undefined;

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
          isSubmitting={isCreatingSubAdmin}
          permissions={permissionsResponse?.data ?? []}
          isPermissionsLoading={isPermissionsLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
