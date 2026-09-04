"use client";

import { useEffect } from "react";
import { Building2, Loader2 } from "lucide-react";

import { CountrySelect } from "@/components/common/country-select";
import { DepartmentSelect } from "@/components/common/department-select";
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
import { CategoryFormValues, useCategoryForm } from "../../hooks/useCategoryForm";
import type { CategoryData } from "../types/category.types";

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: CategoryData | null;
  onSubmit?: (values: CategoryFormValues) => void;
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  onSubmit,
}: CategoryFormDialogProps) {
  const isEditing = !!category;
  const { profile } = useProfile();
  const isStoreScoped = profile?.role === "store_manager" || profile?.roleCode === "STORE_MANAGER";

  const { form, isSubmitting, handleSubmit } = useCategoryForm(
    open,
    category,
    onOpenChange,
    onSubmit,
  );

  useEffect(() => {
    if (open && isStoreScoped && profile?.stores?.[0]?.country) {
      form.setValue("countryId", profile.stores[0].country);
    }
  }, [open, isStoreScoped, profile, form]);

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
                  {isEditing ? "Edit Category" : "Create Category"}
                </DialogTitle>

                <span className="bg-primary/10 text-primary rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase">
                  {isEditing ? "Edit Record" : "New Record"}
                </span>
              </div>

              <DialogDescription className="mt-1.5 max-w-xl text-sm leading-5 text-slate-500 dark:text-slate-400">
                {isEditing
                  ? "Update the category information and keep your organization directory current."
                  : "Create a new category and add it to your organization directory."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="flex max-h-[calc(92vh-130px)] flex-col">
            <div className="overflow-y-auto px-6 py-6 sm:px-7">
              <div className="space-y-5">
                {!isStoreScoped && (
                  <FormField
                    control={form.control}
                    name="countryId"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-xs font-bold tracking-wide text-slate-600 uppercase dark:text-slate-300">
                          Country <span className="text-destructive">*</span>
                        </FormLabel>

                        <CountrySelect
                          disabled={isEditing}
                          value={field.value}
                          onValueChange={(val) => {
                            field.onChange(val);
                            form.setValue("departmentId", "");
                          }}
                          placeholder="Select country"
                          className="h-11 w-full rounded-xl border-slate-200 bg-slate-50/50 px-3.5 text-sm font-medium shadow-none transition-colors hover:bg-white focus:bg-white dark:border-slate-700 dark:bg-slate-900/50 dark:hover:bg-slate-900"
                        />

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="departmentId"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-bold tracking-wide text-slate-600 uppercase dark:text-slate-300">
                        Department <span className="text-destructive">*</span>
                      </FormLabel>

                      <DepartmentSelect
                        countryId={form.watch("countryId")}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select department"
                        disabled={!form.watch("countryId") || isEditing}
                        className="h-11 w-full rounded-xl border-slate-200 bg-slate-50/50 px-3.5 text-sm font-medium shadow-none transition-colors hover:bg-white focus:bg-white dark:border-slate-700 dark:bg-slate-900/50 dark:hover:bg-slate-900"
                      />

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryName"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-bold tracking-wide text-slate-600 uppercase dark:text-slate-300">
                        Category Name <span className="text-destructive">*</span>
                      </FormLabel>

                      <FormControl>
                        <Input
                          placeholder="e.g. Engineering"
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
                          Category Icon <span className="text-destructive">*</span>
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
                            label="Upload category logo"
                            hint="Click to browse or drag & drop"
                            initialImages={
                              category?.categoryIconUrl || category?.categoryIcon
                                ? [category.categoryIconUrl || category.categoryIcon!]
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
                  <>{isEditing ? "Update Category" : "Create Category"}</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
