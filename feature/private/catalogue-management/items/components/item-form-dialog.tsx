"use client";

import { Boxes, ImageIcon, Layers3, Package2, Save, Wrench } from "lucide-react";
import { generateUpcCode } from "@/lib/utils/generate-upc";

import { ImageUpload } from "@/components/common/image-upload";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ItemData } from "../types/item.types";
import { ItemFormValues, useItemForm } from "../../hooks/useItemForm";
import { CountrySelect } from "@/components/common/country-select";
import { DepartmentSelect } from "@/components/common/department-select";
import { CategorySelect } from "@/components/common/category-select";

interface ItemFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: ItemData | null;
  onSubmit?: (values: ItemFormValues) => void;
}

export function ItemFormDialog({ open, onOpenChange, item, onSubmit }: ItemFormDialogProps) {
  const isEditing = !!item;
  const { form, isSubmitting, handleSubmit } = useItemForm(open, item, onOpenChange, onSubmit);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-1rem)] max-w-6xl overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-0 shadow-[0_30px_90px_-25px_rgba(15,23,42,0.3)] sm:w-[calc(100%-2rem)] dark:border-slate-800 dark:bg-slate-950">
        <DialogHeader className="border-b border-slate-100 px-5 py-5 sm:px-7 dark:border-slate-800">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary ring-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1">
              <Package2 className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <DialogTitle className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                  {isEditing ? "Edit Item" : "Create Item"}
                </DialogTitle>

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:bg-slate-800 dark:text-slate-400">
                  Catalogue
                </span>
              </div>

              <DialogDescription className="mt-1.5 max-w-2xl text-sm leading-5 text-slate-500 dark:text-slate-400">
                {isEditing
                  ? "Update the item information, media, quantity and catalogue classification."
                  : "Add a new item with its product details, media, quantity and catalogue classification."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
            <ScrollArea className="max-h-[calc(100vh-190px)] overflow-auto">
              <div className="px-5 py-6 sm:px-7 lg:px-8">
                <div className="grid w-full gap-6 lg:grid-cols-2 lg:gap-8">
                  <div className="w-full space-y-6">
                    <section className="rounded-2xl border border-slate-200/80 bg-slate-50/40 p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900/30">
                      <div className="mb-5 flex items-center gap-3">
                        <div className="text-primary flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-slate-700">
                          <Package2 className="h-4 w-4" />
                        </div>

                        <div>
                          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            Basic Information
                          </h3>

                          <p className="text-[11px] text-slate-400">Core details about this item</p>
                        </div>
                      </div>

                      <div className="space-y-5">
                        <FormField
                          control={form.control}
                          name="productName"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel className="text-xs font-bold tracking-wide text-slate-600 uppercase dark:text-slate-300">
                                Item Name <span className="text-destructive">*</span>
                              </FormLabel>

                              <FormControl>
                                <Input
                                  placeholder="e.g. Organic Almond Milk"
                                  className="h-11 rounded-xl border-slate-200 bg-white shadow-none dark:border-slate-700 dark:bg-slate-950"
                                  {...field}
                                />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel className="text-xs font-bold tracking-wide text-slate-600 uppercase dark:text-slate-300">
                                Description <span className="text-destructive">*</span>
                              </FormLabel>

                              <FormControl>
                                <Textarea
                                  placeholder="Add a short description of the item..."
                                  className="min-h-23.75 resize-none rounded-xl border-slate-200 bg-white shadow-none dark:border-slate-700 dark:bg-slate-950"
                                  {...field}
                                />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="upcCode"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel className="text-xs font-bold tracking-wide text-slate-600 uppercase dark:text-slate-300">
                                UPC Code
                              </FormLabel>

                              <div className="flex gap-2">
                                <FormControl>
                                  <Input
                                    placeholder="Enter UPC code"
                                    className="h-11 rounded-xl border-slate-200 bg-white shadow-none dark:border-slate-700 dark:bg-slate-950"
                                    {...field}
                                  />
                                </FormControl>

                                <Button
                                  type="button"
                                  size="icon"
                                  title="Generate random UPC code"
                                  className="h-11 w-11 shrink-0 rounded-xl bg-emerald-500 shadow-sm hover:bg-emerald-600"
                                  onClick={() => field.onChange(generateUpcCode())}
                                >
                                  <Wrench className="h-4 w-4 text-white" />
                                </Button>
                              </div>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </section>

                    <section className="rounded-2xl border border-slate-200/80 bg-slate-50/40 p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900/30">
                      <div className="mb-5 flex items-center gap-3">
                        <div className="text-primary flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-slate-700">
                          <ImageIcon className="h-4 w-4" />
                        </div>

                        <div>
                          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            Product Media
                          </h3>

                          <p className="text-[11px] text-slate-400">Upload images for the item</p>
                        </div>
                      </div>

                      <div className="space-y-5">
                        <FormField
                          control={form.control}
                          name="productImageFile"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel className="text-xs font-bold tracking-wide text-slate-600 uppercase dark:text-slate-300">
                                Product Image <span className="text-destructive">*</span>
                              </FormLabel>

                              <FormControl>
                                <div className="rounded-xl border border-dashed border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-950">
                                  <ImageUpload
                                    maxFiles={5}
                                    value={field.value}
                                    onChange={field.onChange}
                                    label="Upload product image"
                                    hint="Click to browse or drag & drop"
                                  />
                                </div>
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="productInfoImageFile"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <div className="flex items-center justify-between">
                                <FormLabel className="text-xs font-bold tracking-wide text-slate-600 uppercase dark:text-slate-300">
                                  Product Info Image
                                </FormLabel>

                                <span className="text-[10px] font-medium text-slate-400">
                                  Optional
                                </span>
                              </div>

                              <FormControl>
                                <div className="rounded-xl border border-dashed border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-950">
                                  <ImageUpload
                                    maxFiles={1}
                                    value={field.value}
                                    onChange={field.onChange}
                                    label="Upload info image"
                                    hint="Optional supporting image"
                                  />
                                </div>
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </section>
                  </div>

                  <div className="space-y-6">
                    <section className="rounded-2xl border border-slate-200/80 bg-slate-50/40 p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900/30">
                      <div className="mb-5 flex items-center gap-3">
                        <div className="text-primary flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-slate-700">
                          <Boxes className="h-4 w-4" />
                        </div>

                        <div>
                          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            Inventory & Pricing
                          </h3>

                          <p className="text-[11px] text-slate-400">
                            Quantity, unit and discount settings
                          </p>
                        </div>
                      </div>

                      <div className="space-y-5">
                        <FormField
                          control={form.control}
                          name="discountPercentage"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel className="text-xs font-bold tracking-wide text-slate-600 uppercase dark:text-slate-300">
                                Discount (%)
                              </FormLabel>

                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  className="h-11 rounded-xl border-slate-200 bg-white shadow-none dark:border-slate-700 dark:bg-slate-950"
                                  {...field}
                                />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name="baseQuantity"
                            render={({ field }) => (
                              <FormItem className="space-y-2">
                                <FormLabel className="text-xs font-bold tracking-wide text-slate-600 uppercase dark:text-slate-300">
                                  Base Quantity <span className="text-destructive">*</span>
                                </FormLabel>

                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="0"
                                    className="h-11 rounded-xl border-slate-200 bg-white shadow-none dark:border-slate-700 dark:bg-slate-950"
                                    {...field}
                                  />
                                </FormControl>

                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="unit"
                            render={({ field }) => (
                              <FormItem className="space-y-2">
                                <FormLabel className="text-xs font-bold tracking-wide text-slate-600 uppercase dark:text-slate-300">
                                  Unit <span className="text-destructive">*</span>
                                </FormLabel>

                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="h-11 w-full rounded-xl border-slate-200 bg-white shadow-none dark:border-slate-700 dark:bg-slate-950">
                                      <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                  </FormControl>

                                  <SelectContent>
                                    <SelectItem value="kg">Kg</SelectItem>
                                    <SelectItem value="g">g</SelectItem>
                                    <SelectItem value="piece">Piece</SelectItem>
                                    <SelectItem value="pack">Pack</SelectItem>
                                    <SelectItem value="l">Litre</SelectItem>
                                    <SelectItem value="ml">ml</SelectItem>
                                  </SelectContent>
                                </Select>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </section>

                    <section className="rounded-2xl border border-slate-200/80 bg-slate-50/40 p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900/30">
                      <div className="mb-5 flex items-center gap-3">
                        <div className="text-primary flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-slate-700">
                          <Layers3 className="h-4 w-4" />
                        </div>

                        <div>
                          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            Classification
                          </h3>

                          <p className="text-[11px] text-slate-400">
                            Organize this item in the catalogue
                          </p>
                        </div>
                      </div>

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
                                onValueChange={(val) => {
                                  field.onChange(val);
                                  form.setValue("departmentId", "");
                                  form.setValue("categoryId", "");
                                }}
                                placeholder="Select country"
                              />

                              <FormMessage />
                            </FormItem>
                          )}
                        />

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
                                onValueChange={(val) => {
                                  field.onChange(val);
                                  form.setValue("categoryId", "");
                                }}
                                placeholder="Select department"
                                disabled={!form.watch("countryId")}
                              />

                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="categoryId"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel className="text-xs font-bold tracking-wide text-slate-600 uppercase dark:text-slate-300">
                                Category <span className="text-destructive">*</span>
                              </FormLabel>

                              <CategorySelect
                                departmentId={form.watch("departmentId")}
                                value={field.value}
                                onValueChange={field.onChange}
                                placeholder="Select category"
                                disabled={!form.watch("departmentId")}
                              />

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </section>

                    <div className="border-primary/15 bg-primary/3 dark:bg-primary/5 rounded-2xl border p-4 sm:p-5">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                          <Save className="h-4 w-4" />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                            Ready to {isEditing ? "save changes" : "create item"}?
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                            Review the required fields before submitting this item to the catalogue.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <section className="mt-6 w-full rounded-2xl border border-slate-200/80 bg-slate-50/40 p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900/30">
                  <div className="mb-5">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      Additional Information
                    </h3>

                    <p className="mt-0.5 text-[11px] text-slate-400">
                      Product and nutrition details
                    </p>
                  </div>

                  <div className="space-y-5">
                    <FormField
                      control={form.control}
                      name="productInfo"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-xs font-bold tracking-wide text-slate-600 uppercase dark:text-slate-300">
                            Product Information <span className="text-destructive">*</span>
                          </FormLabel>

                          <FormControl>
                            <Textarea
                              placeholder="Add product information..."
                              className="min-h-22.5 resize-none rounded-xl border-slate-200 bg-white shadow-none dark:border-slate-700 dark:bg-slate-950"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nutritionInfo"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-xs font-bold tracking-wide text-slate-600 uppercase dark:text-slate-300">
                            Nutrition Information
                          </FormLabel>

                          <FormControl>
                            <Textarea
                              placeholder="Add nutrition information..."
                              className="min-h-22.5 resize-none rounded-xl border-slate-200 bg-white shadow-none dark:border-slate-700 dark:bg-slate-950"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nutritionInfoImageFile"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <div className="flex items-center justify-between">
                            <FormLabel className="text-xs font-bold tracking-wide text-slate-600 uppercase dark:text-slate-300">
                              Nutrition Info Image
                            </FormLabel>

                            <span className="text-[10px] font-medium text-slate-400">Optional</span>
                          </div>

                          <FormControl>
                            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-950">
                              <ImageUpload
                                maxFiles={1}
                                value={field.value}
                                onChange={field.onChange}
                                label="Upload nutrition image"
                                hint="Optional nutrition reference"
                              />
                            </div>
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </section>
              </div>
            </ScrollArea>

            <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-white/95 px-5 py-4 backdrop-blur sm:px-7 dark:border-slate-800 dark:bg-slate-950/95">
              <p className="hidden text-xs text-slate-400 sm:block">
                <span className="text-destructive">*</span> Required fields
              </p>

              <div className="ml-auto flex items-center gap-3">
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
                  isLoading={isSubmitting}
                  className="h-10 min-w-36.25 rounded-xl px-5 font-semibold shadow-sm"
                >
                  {!isSubmitting && <Save className="mr-2 h-4 w-4" />}
                  {isEditing ? "Update Item" : "Create Item"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
