"use client";

import { AddressAutocompleteInput } from "@/components/common/address-autocomplete-input";
import { ImageUpload } from "@/components/common/image-upload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import PhoneInputComponent from "@/components/ui/phone-input";
import {
  EmployeeFormSchema,
  EmployeeFormValues,
} from "@/feature/private/employee-management/schema/employee.schema";
import { type Employee } from "@/feature/private/employee-management/types/employee-management";
import { zodResolver } from "@hookform/resolvers/zod";
import { Contact, MapPin, Save, UserCircle, UserPen, UserPlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useCreateEmployee } from "../hooks/use-create-employee";
import { useUpdateEmployee } from "../hooks/use-update-employee";

interface EmployeeDialogProps {
  employee?: Employee;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
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

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(EmployeeFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      countryCode: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      accountStatus: "ACTIVE",
    },
  });

  useEffect(() => {
    if (open) {
      if (isEdit && employee) {
        form.reset({
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          phoneNumber: employee.phoneNumber || "",
          countryCode: employee.countryCode || "",
          address: employee.address || "",
          city: employee.city || "",
          state: employee.state || "",
          zipCode: employee.zipCode || "",
          image: employee.image || undefined,
          accountStatus: employee.accountStatus,
        });
      } else {
        form.reset({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          countryCode: "",
          address: "",
          city: "",
          state: "",
          zipCode: "",
          accountStatus: "ACTIVE",
        });
      }
    }
  }, [open, employee, isEdit, form]);

  const onSubmit = (data: EmployeeFormValues) => {
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
    if (data.accountStatus) formData.append("accountStatus", data.accountStatus);

    if (data.image instanceof File) {
      formData.append("image", data.image);
    } else if (typeof data.image === "string") {
      formData.append("image", data.image);
    }

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
    form.setValue("address", place.streetAddress || place.name || "");
    form.setValue("city", place.city || "");
    form.setValue("state", place.state || "");
    form.setValue("zipCode", place.postalCode || "");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger>{trigger}</DialogTrigger>}
      <DialogContent className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl p-0">
        <DialogHeader className="shrink-0 border-b bg-linear-to-r from-slate-50 via-slate-100 to-slate-50 px-6 py-6">
          <div className="flex flex-col items-center text-center">
            <DialogTitle className="flex gap-6 text-2xl font-bold tracking-tight text-slate-800">
              {isEdit ? (
                <UserPen className="h-7 w-7" strokeWidth={2.2} />
              ) : (
                <UserPlus className="h-7 w-7" strokeWidth={2.2} />
              )}

              {isEdit ? "Edit Employee" : "Add New Employee"}
            </DialogTitle>

            <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">
              {isEdit
                ? "Update the employee's profile, contact details, and permissions."
                : "Create a new employee profile and provide them access to your organization."}
            </p>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex min-h-0 flex-1 flex-col bg-slate-50/50"
          >
            <div className="flex-1 overflow-y-auto p-4">
              <div className="mx-auto max-w-3xl space-y-6">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="w-full">
                          <ImageUpload
                            maxFiles={1}
                            onChange={(files) => field.onChange(files[0] || undefined)}
                            initialImages={
                              field.value
                                ? field.value instanceof File
                                  ? [URL.createObjectURL(field.value)]
                                  : [field.value as string]
                                : []
                            }
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50">
                      <UserCircle className="size-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-800">Personal Details</h3>
                      <p className="text-xs text-slate-500">Employee&apos;s core identity</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-slate-700">
                            First Name <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John"
                              className="h-11 rounded-xl bg-slate-50"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-slate-700">
                            Last Name <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Doe"
                              className="h-11 rounded-xl bg-slate-50"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50">
                      <Contact className="size-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-800">Contact Information</h3>
                      <p className="text-xs text-slate-500">How to reach this employee</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-slate-700">
                            Email <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="john@example.com"
                              className="h-11 rounded-xl bg-slate-50"
                              disabled={isEdit}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-slate-700">
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <PhoneInputComponent
                              value={(form.watch("countryCode") || "") + (field.value || "")}
                              onChange={(val, data) => {
                                if (data && data.dialCode) {
                                  const dialCode = data.dialCode;
                                  let nationalNumber = val;
                                  if (val.startsWith(dialCode)) {
                                    nationalNumber = val.slice(dialCode.length);
                                  }
                                  form.setValue("countryCode", "+" + dialCode, {
                                    shouldValidate: true,
                                  });
                                  field.onChange(nationalNumber);
                                } else {
                                  field.onChange(val);
                                }
                              }}
                              error={
                                !!form.formState.errors.phoneNumber ||
                                !!form.formState.errors.countryCode
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-violet-50">
                      <MapPin className="size-5 text-violet-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-800">Location</h3>
                      <p className="text-xs text-slate-500">Employee residential address</p>
                    </div>
                  </div>
                  <div className="space-y-6 p-6">
                    <div className="w-full">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold text-slate-700">Address</FormLabel>
                            <FormControl className="w-full">
                              <AddressAutocompleteInput
                                value={field.value || ""}
                                onChange={field.onChange}
                                onPlaceSelect={handlePlaceSelect}
                                placeholder="Search for an address"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold text-slate-700">City</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="City"
                                className="h-11 rounded-xl bg-slate-50"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold text-slate-700">State</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="State"
                                className="h-11 rounded-xl bg-slate-50"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold text-slate-700">Zip Code</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Zip Code"
                                className="h-11 rounded-xl bg-slate-50"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 z-10 flex justify-center border-t bg-white px-6 py-4 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
              <div className="flex gap-4">
                <Button
                  variant="destructive"
                  className="h-12 rounded-xl px-8 text-base font-medium transition-transform hover:scale-[1.02]"
                  onClick={() => setOpen(false)}
                >
                  <X size={16} /> Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="h-12 rounded-xl px-12 text-base font-semibold shadow-md transition-all hover:scale-[1.02]"
                >
                  <Save size={16} />
                  {isPending
                    ? isEdit
                      ? "Updating..."
                      : "Adding..."
                    : isEdit
                      ? "Update Employee"
                      : "Add Employee"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
