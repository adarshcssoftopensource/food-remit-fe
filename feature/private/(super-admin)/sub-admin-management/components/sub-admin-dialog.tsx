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
import { resolveFromValue } from "@/components/ui/phone-input";
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
      const { country, nationalNumber: localNumber } = resolveFromValue(values.phone);
      const countryCode = country ? `+${country.dialCode}` : "";

      if (mode === "add") {
        const response = await createSubAdmin({
          name: values.name,
          countryCode,
          email: values.email,
          phoneNumber: localNumber,
          permissions: values.permissions.map((key) => ({ key })),
          isCoAdmin: values.isCoAdmin,
        });

        successToast({ title: response.message || "Sub Admin added successfully" });
      } else if (mode === "edit" && admin) {
        const response = await updateSubAdmin({
          name: values.name,
          countryCode,
          email: values.email,
          phoneNumber: localNumber,
          permissions: values.permissions.map((key) => ({ key })),
          isCoAdmin: values.isCoAdmin,
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
          isCoAdmin: admin.role === "CO_ADMIN",
        }
      : undefined;

  const isSubmitting = mode === "add" ? isCreatingSubAdmin : isUpdatingSubAdmin;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {mode === "add" && (
        <DialogTrigger
          render={
            <Button className="rounded-xl px-4 font-semibold shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          }
        />
      )}

      <DialogContent className="max-h-[92vh] max-w-4xl! overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-0 sm:w-full">
        <div className="from-primary/10 via-primary to-primary/10 absolute inset-x-0 top-0 z-20 h-0.5" />

        <DialogHeader className="border-b border-slate-100 bg-linear-to-br from-slate-50 via-white to-white px-6 py-6 sm:px-7 dark:border-slate-800 dark:from-slate-900/80 dark:via-slate-950 dark:to-slate-950">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary ring-primary/10 relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1">
              <ShieldCheck className="h-5.5 w-5.5" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <DialogTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {mode === "add" ? "Add" : "Edit Sub/Co Admin"}
                </DialogTitle>
              </div>

              <DialogDescription className="mt-1.5 max-w-xl text-sm leading-5 text-slate-500 dark:text-slate-400">
                {mode === "add"
                  ? "Create a new sub/co-admin account and configure dashboard permissions."
                  : "Update account details and manage dashboard permissions."}
              </DialogDescription>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-emerald-200/70 bg-emerald-50/70 px-3.5 py-2.5 dark:border-emerald-500/10 dark:bg-emerald-500/5">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />

            <p className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
              Permissions control what this account can access in the dashboard.
            </p>
          </div>
        </DialogHeader>

        <div className="max-h-[calc(92vh-190px)] overflow-y-auto">
          <div className="px-3 py-3">
            <SubAdminForm
              mode={mode}
              initialValues={initialValues}
              onSubmit={handleSubmit}
              submitLabel={mode}
              isSubmitting={isSubmitting}
              permissions={permissionsResponse?.data ?? []}
              isPermissionsLoading={isPermissionsLoading}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
