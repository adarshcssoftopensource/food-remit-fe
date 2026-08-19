"use client";

import { NoDataFound } from "@/components/common/no-data-found";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInputComponent } from "@/components/ui/phone-input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormInput } from "@/feature/private/stories/components/form-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { subAdminSchema, type SubAdminFormValues } from "../schema/sub-admin.schema";
import { type SubAdminPermission } from "../types/sub-admin.types";
import { PermissionsSkeleton } from "./permissions-skeleton";

interface SubAdminFormProps {
  initialValues?: Partial<SubAdminFormValues>;
  onSubmit: (values: SubAdminFormValues) => void;
  submitLabel?: string;
  isSubmitting?: boolean;
  permissions?: SubAdminPermission[];
  isPermissionsLoading?: boolean;
}

export function SubAdminForm({
  initialValues,
  onSubmit,
  submitLabel = "Submit",
  isSubmitting = false,
  permissions = [],
  isPermissionsLoading = false,
}: SubAdminFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SubAdminFormValues>({
    resolver: zodResolver(subAdminSchema),
    defaultValues: {
      name: initialValues?.name || "",
      email: initialValues?.email || "",
      phone: initialValues?.phone || "",
      permissions: initialValues?.permissions || [],
    },
    mode: "onBlur",
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <div className="grid gap-8 p-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="rounded-2xl border shadow-sm">
          <div className="border-b px-6 py-5">
            <h3 className="text-xl font-semibold">Personal Details</h3>
            <p className="text-muted-foreground text-sm">Add basic information of the sub admin.</p>
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

        <div className="rounded-2xl border bg-white shadow-sm">
          <div className="border-b px-6 py-5">
            <h3 className="text-xl font-semibold">Permissions</h3>
            <p className="text-muted-foreground text-sm">Select modules this admin can access.</p>
          </div>

          <ScrollArea className="max-h-[40vh] overflow-auto">
            <Controller
              name="permissions"
              control={control}
              render={({ field }) => (
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
                              checked={active}
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
              )}
            />
          </ScrollArea>

          {errors.permissions && (
            <p className="text-destructive col-span-full ml-2 p-2 text-sm">
              {errors.permissions.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end border-t bg-gray-50 px-6 py-5">
        <Button
          type="submit"
          disabled={isSubmitting || isPermissionsLoading}
          isLoading={isSubmitting}
          className="h-11 rounded-xl px-10 font-semibold shadow-sm"
        >
          {submitLabel === "add" ? "Add Sub Admin" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
