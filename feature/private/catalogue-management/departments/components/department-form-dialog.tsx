"use client";

import { Building2, Globe2, Loader2, MapPin } from "lucide-react";

import { CitySelect } from "@/components/common/city-select";
import { CountrySelect } from "@/components/common/country-select";
import { ImageUpload } from "@/components/common/image-upload";
import { useProfile } from "@/components/providers/profile-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { DepartmentFormValues, useDepartmentForm } from "../../hooks/useDepartmentForm";
import type { DepartmentData } from "../types/department.types";

interface DepartmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department?: DepartmentData | null;
  onSubmit?: (values: DepartmentFormValues) => void;
}

export function DepartmentFormDialog({
  open,
  onOpenChange,
  department,
  onSubmit,
}: DepartmentFormDialogProps) {
  const isEditing = !!department;
  const { profile, isSuperAdmin } = useProfile();
  const role = profile?.role || "";
  const isCityManager = role === "city_manager";
  const isStoreScoped = role === "store_manager" || role === "employee";
  const isGlobalCreator = isSuperAdmin || role === "sub_admin" || role === "country_manager";

  const { form, isSubmitting, handleSubmit } = useDepartmentForm(
    open,
    department,
    onOpenChange,
    onSubmit,
  );

  const countryId = form.watch("countryId");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-xl! overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-0 sm:w-full">
        <div className="from-primary/10 via-primary to-primary/10 absolute inset-x-0 top-0 z-20 h-0.5" />

        <DialogHeader className="border-b border-slate-100 bg-linear-to-br from-slate-50 via-white to-white px-6 py-6 sm:px-7 dark:border-slate-800 dark:from-slate-900/80 dark:via-slate-950 dark:to-slate-950">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary ring-primary/10 relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1">
              <Building2 className="h-5.5 w-5.5" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <DialogTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {isEditing ? "Edit Department" : "Create Department"}
                </DialogTitle>

                <span className="bg-primary/10 text-primary rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase">
                  {isEditing ? "Edit Record" : "New Record"}
                </span>
              </div>

              <DialogDescription className="mt-1.5 max-w-xl text-sm leading-5 text-slate-500 dark:text-slate-400">
                {isEditing
                  ? "Update the department information and keep your organization directory current."
                  : "Create a new department and add it to your organization directory."}
              </DialogDescription>

              <div className="mt-3">
                {isGlobalCreator ? (
                  <p className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 px-2.5 py-1 text-[11px] font-semibold text-sky-700 ring-1 ring-sky-500/20">
                    <Globe2 className="h-3 w-3" />
                    Creates as Global (All Cities) unless a city is selected
                  </p>
                ) : isStoreScoped ? (
                  <p className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-800 ring-1 ring-amber-500/20">
                    <MapPin className="h-3 w-3" />
                    Scoped to your store city — not global
                  </p>
                ) : isCityManager ? (
                  <p className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-800 ring-1 ring-amber-500/20">
                    <MapPin className="h-3 w-3" />
                    City scoped — select your assigned city
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="flex max-h-[calc(92vh-130px)] flex-col">
            <div className="overflow-y-auto px-6 py-6 sm:px-7">
              <div className="space-y-5">
                <FormField
                  control={form.control}
                  name="countryId"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-bold tracking-wide text-slate-600 uppercase dark:text-slate-300">
                        Country <span className="text-destructive">*</span>
                      </FormLabel>

                      <CountrySelect
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue("cityId", "");
                        }}
                        valueKey="id"
                        placeholder="Select country"
                        className="h-11 w-full rounded-xl border-slate-200 bg-slate-50/50 px-3.5 text-sm font-medium shadow-none transition-colors hover:bg-white focus:bg-white dark:border-slate-700 dark:bg-slate-900/50 dark:hover:bg-slate-900"
                      />

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {(isCityManager || isGlobalCreator) && (
                  <FormField
                    control={form.control}
                    name="cityId"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-xs font-bold tracking-wide text-slate-600 uppercase dark:text-slate-300">
                          City {isCityManager && <span className="text-destructive">*</span>}
                          {isGlobalCreator && (
                            <span className="ml-1 font-medium text-slate-400 normal-case">
                              (optional — leave empty for Global)
                            </span>
                          )}
                        </FormLabel>

                        <CitySelect
                          value={field.value || (isGlobalCreator ? "all" : "")}
                          onValueChange={(value) =>
                            field.onChange(value === "all" || value === "All" ? "" : value)
                          }
                          countryId={countryId}
                          includeAll={isGlobalCreator}
                          allLabel="Global (All Cities)"
                          placeholder={isCityManager ? "Select city" : "Global (All Cities)"}
                          className="h-11 w-full rounded-xl border-slate-200 bg-slate-50/50 px-3.5 text-sm font-medium shadow-none"
                        />

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="departmentName"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-bold tracking-wide text-slate-600 uppercase dark:text-slate-300">
                        Department Name <span className="text-destructive">*</span>
                      </FormLabel>

                      <FormControl>
                        <Input
                          placeholder="e.g. Fresh Produce"
                          className="h-11 rounded-xl border-slate-200 bg-slate-50/50 px-3.5 text-sm font-medium shadow-none transition-colors placeholder:text-slate-400 hover:bg-white focus:bg-white dark:border-slate-700 dark:bg-slate-900/50 dark:hover:bg-slate-900"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="iconFile"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-xs font-bold tracking-wide text-slate-600 uppercase dark:text-slate-300">
                          Department Icon <span className="text-destructive">*</span>
                        </FormLabel>

                        <span className="text-[10px] font-medium text-slate-400">
                          PNG / JPG / WEBP
                        </span>
                      </div>

                      <FormControl>
                        <div className="hover:border-primary/40 hover:bg-primary/2 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-2 transition-colors dark:border-slate-700 dark:bg-slate-900/40">
                          <ImageUpload
                            maxFiles={1}
                            multiple={false}
                            value={field.value}
                            onChange={(files) => {
                              field.onChange(files);
                              if (files.length > 0) {
                                form.setValue("hasExistingIcon", false);
                              }
                            }}
                            onAllImagesChange={(all) => {
                              form.setValue("hasExistingIcon", all.length > 0);
                            }}
                            label="Upload department logo"
                            hint="Click to browse or drag & drop"
                            initialImages={
                              department?.departmentIconUrl || department?.departmentIcon
                                ? [department.departmentIconUrl || department.departmentIcon!]
                                : []
                            }
                          />
                        </div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4 sm:px-7 dark:border-slate-800 dark:bg-slate-900/40">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="h-10 rounded-xl border-slate-200 bg-white px-5 font-semibold text-slate-600 shadow-none hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-10 rounded-xl px-5 font-semibold shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>{isEditing ? "Update Department" : "Create Department"}</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
