"use client";

import { NoDataFound } from "@/components/common/no-data-found";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInputComponent } from "@/components/ui/phone-input";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShieldCheck } from "lucide-react";
import { FormInput } from "@/feature/private/stories/components/form-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { subAdminSchema, type SubAdminFormValues } from "../schema/sub-admin.schema";
import { type SubAdminPermission } from "../types/sub-admin.types";
import { PermissionsSkeleton } from "./permissions-skeleton";
import { Checkbox } from "@/components/ui/checkbox";

interface SubAdminFormProps {
  initialValues?: Partial<SubAdminFormValues>;
  onSubmit: (values: SubAdminFormValues) => void;
  submitLabel?: string;
  isSubmitting?: boolean;
  permissions?: SubAdminPermission[];
  isPermissionsLoading?: boolean;
  mode: "add" | "edit";
}

export function SubAdminForm({
  initialValues,
  onSubmit,
  submitLabel = "Submit",
  isSubmitting = false,
  permissions = [],
  isPermissionsLoading = false,
  mode,
}: SubAdminFormProps) {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SubAdminFormValues>({
    resolver: zodResolver(subAdminSchema),
    defaultValues: {
      name: initialValues?.name || "",
      email: initialValues?.email || "",
      phone: initialValues?.phone || "",
      permissions: initialValues?.permissions || [],
      isCoAdmin: initialValues?.isCoAdmin || false,
    },
    mode: "onChange",
  });

  const isCoAdmin = useWatch({ control, name: "isCoAdmin" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <div className="grid gap-8 px-3 pb-6">
        <Controller
          name="isCoAdmin"
          control={control}
          render={({ field }) => (
            <div className="border-primary/20 bg-primary/10 hover:bg-primary/15 dark:border-primary/10 dark:bg-primary/5 flex items-center justify-between gap-4 rounded-xl border px-5 py-3 shadow-sm transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-sm">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-primary dark:text-primary text-[15px] font-bold">
                    Co-Admin Account
                  </span>
                  <span className="text-primary/80 dark:text-primary/80 text-[13px] font-medium">
                    Grant full system access
                  </span>
                </div>
              </div>

              <Switch
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  if (checked) {
                    setValue(
                      "permissions",
                      permissions.map((p) => p.key),
                      { shouldValidate: true },
                    );
                  } else {
                    setValue("permissions", [], { shouldValidate: true });
                  }
                }}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          )}
        />
      </div>

      <div className="grid gap-8 px-3 pb-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="rounded-2xl border shadow-sm">
          <div className="border-b px-6 py-5">
            <h3 className="text-xl font-semibold">Personal Details</h3>
            <p className="text-muted-foreground text-sm">
              Add basic information of the sub/co admin.
            </p>
          </div>

          <div className="space-y-5 p-6">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <FormInput label="Full Name" error={errors.name?.message}>
                  <Input
                    {...field}
                    placeholder="Enter full name"
                    className="h-12 rounded-xl bg-gray-50"
                  />
                </FormInput>
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <FormInput label="Email Address" error={errors.email?.message}>
                  <Input
                    {...field}
                    disabled={mode === "edit"}
                    type="email"
                    placeholder="user@example.com"
                    className="h-12 rounded-xl bg-gray-50"
                  />
                </FormInput>
              )}
            />

            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    Phone Number
                    <span className="text-destructive ml-0.5">*</span>
                  </Label>

                  <PhoneInputComponent
                    value={field.value}
                    disabled={mode === "edit"}
                    onChange={(value) => field.onChange(value)}
                    onBlur={field.onBlur}
                    error={!!errors.phone}
                  />

                  {errors.phone && (
                    <p className="text-destructive text-sm">{errors.phone.message}</p>
                  )}
                </div>
              )}
            />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-6 py-5">
              <h3 className="text-xl font-semibold">Permissions</h3>
              <p className="text-muted-foreground text-sm">Select modules this admin can access.</p>
            </div>

            <div className="custom-scrollbar max-h-[40vh] overflow-auto">
              <Controller
                name="permissions"
                control={control}
                render={({ field }) => {
                  return (
                    <>
                      {isPermissionsLoading ? (
                        <PermissionsSkeleton />
                      ) : permissions.length === 0 ? (
                        <NoDataFound title="No permissions available." />
                      ) : (
                        <div className="grid gap-3 p-6 sm:grid-cols-2">
                          {permissions.map((permission) => {
                            const active = field.value.includes(permission.key);

                            return (
                              <label
                                key={permission.key}
                                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                                  active ? "border-primary bg-primary/5" : "hover:bg-muted"
                                } `}
                              >
                                <Checkbox
                                  checked={active || isCoAdmin}
                                  disabled={isCoAdmin}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange([...field.value, permission.key]);
                                    } else {
                                      field.onChange(
                                        field.value.filter((key) => key !== permission.key),
                                      );
                                    }
                                  }}
                                />

                                <span className="text-sm font-medium">{permission.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </>
                  );
                }}
              />
            </div>

            {errors.permissions && (
              <p className="text-destructive col-span-full ml-2 p-2 text-sm">
                {errors.permissions.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end border-t bg-gray-50 px-6 py-5">
        <Button
          type="submit"
          disabled={isSubmitting || isPermissionsLoading}
          isLoading={isSubmitting}
          className="h-11 rounded-xl px-10 font-semibold shadow-sm"
        >
          {submitLabel === "add" ? "Add Sub/Co Admin" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
