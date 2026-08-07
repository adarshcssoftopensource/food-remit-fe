"use client";

import "react-phone-input-2/lib/style.css";

import { NoDataFound } from "@/components/common/no-data-found";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormInput } from "@/feature/private/stories/components/form-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
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

                  <div
                    className={`rounded-xl border bg-gray-50 transition-colors focus-within:border-slate-400 ${
                      errors.phone ? "border-destructive" : "border-input"
                    }`}
                  >
                    <PhoneInput
                      country="in"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      onBlur={field.onBlur}
                      enableSearch
                      searchPlaceholder="Search country..."
                      searchStyle={{
                        width: "calc(100% - 16px)",
                        margin: "0 8px 4px",
                        padding: "6px 10px",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        fontSize: "13px",
                        outline: "none",
                      }}
                      containerStyle={{
                        width: "100%",
                        background: "transparent",
                        position: "relative",
                      }}
                      inputStyle={{
                        width: "100%",
                        height: "48px",
                        border: "none",
                        borderRadius: "12px",
                        background: "transparent",
                        fontSize: "14px",
                        paddingLeft: "56px",
                        outline: "none",
                        boxShadow: "none",
                      }}
                      buttonStyle={{
                        border: "none",
                        borderRadius: "12px 0 0 12px",
                        background: "transparent",
                        borderRight: "1px solid #e2e8f0",
                        paddingInline: "10px",
                      }}
                      dropdownStyle={{
                        position: "fixed",
                        borderRadius: "12px",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.14)",
                        border: "1px solid #e2e8f0",
                        zIndex: 99999,
                        maxHeight: "260px",
                        overflowY: "auto",
                        background: "#fff",
                      }}
                    />
                  </div>

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
