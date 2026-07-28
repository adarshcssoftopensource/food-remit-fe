"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRY_CODES, PERMISSIONS_LIST } from "@/constants/sub-admin-management";
import { FormInput } from "@/feature/private/stories/components/form-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { subAdminSchema, type SubAdminFormValues } from "../schema/sub-admin.schema";

interface SubAdminFormProps {
  initialValues?: Partial<SubAdminFormValues>;
  onSubmit: (values: SubAdminFormValues) => void;
  submitLabel?: string;
  isSubmitting?: boolean;
}

export function SubAdminForm({
  initialValues,
  onSubmit,
  submitLabel = "Submit",
  isSubmitting = false,
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
      phoneCode: initialValues?.phoneCode || "",
      phoneNumber: initialValues?.phoneNumber || "",
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
                    placeholder="Enter sub admin name"
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
                    placeholder="Enter email address"
                    className="h-12 rounded-xl bg-gray-50"
                  />
                </FormInput>
              )}
            />

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Phone Number</Label>

              <div className="flex gap-3">
                <Controller
                  name="phoneCode"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-12! w-36 rounded-xl bg-gray-50">
                        <SelectValue placeholder="+91" />
                      </SelectTrigger>

                      <SelectContent>
                        {COUNTRY_CODES.map((code) => (
                          <SelectItem key={code.value} value={code.value}>
                            {code.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Phone number"
                      className="h-12 rounded-xl bg-gray-50"
                    />
                  )}
                />
              </div>

              {(errors.phoneCode || errors.phoneNumber) && (
                <p className="text-destructive text-sm">
                  {errors.phoneCode?.message || errors.phoneNumber?.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Permission */}
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
                <div className="grid gap-3 p-6 sm:grid-cols-2">
                  {PERMISSIONS_LIST.map((permission) => {
                    const active = field.value.includes(permission);

                    return (
                      <label
                        key={permission}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                          active ? "border-primary bg-primary/5" : "hover:bg-muted"
                        } `}
                      >
                        <Checkbox
                          checked={active}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              field.onChange([...field.value, permission]);
                            } else {
                              field.onChange(field.value.filter((x) => x !== permission));
                            }
                          }}
                        />

                        <span className="text-sm font-medium">{permission}</span>
                      </label>
                    );
                  })}

                  {errors.permissions && (
                    <p className="text-destructive col-span-full text-sm">
                      {errors.permissions.message}
                    </p>
                  )}
                </div>
              )}
            />
          </ScrollArea>
        </div>
      </div>

      <div className="flex justify-end border-t bg-gray-50 px-6 py-5">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 rounded-xl px-10 font-semibold shadow-sm"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
