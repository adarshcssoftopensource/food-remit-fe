"use client";

import { Package2, Save, Wrench } from "lucide-react";

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
import {
  CATALOGUE_CATEGORY_OPTIONS,
  CATALOGUE_COUNTRY_OPTIONS,
  CATALOGUE_DEPARTMENT_OPTIONS,
  ItemData,
} from "@/constants/catalogue-management";
import { ItemFormValues, useItemForm } from "../../hooks/useItemForm";

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
      <DialogContent className="max-w-5xl rounded-3xl p-0 shadow-2xl">
        <DialogHeader className="bg-muted/20 rounded-3xl border-b px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-11 w-11 items-center justify-center rounded-xl">
              <Package2 className="text-primary h-5 w-5" />
            </div>

            <div className="space-y-1">
              <DialogTitle className="text-2xl font-bold tracking-tight">
                {isEditing ? "Edit Item" : "Create Item"}
              </DialogTitle>

              <DialogDescription className="text-muted-foreground text-sm">
                {isEditing
                  ? "Update the item details and save your changes."
                  : "Enter the required information to create a new item."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <ScrollArea className={"max-h-[80vh] overflow-y-auto"}>
            <form onSubmit={handleSubmit} className="px-8 pt-6 pb-8">
              <div className="grid grid-cols-1 gap-x-12 gap-y-6 md:grid-cols-2">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="productName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Name <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter Item Name"
                            className="h-11 rounded-lg border-gray-200"
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
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Description <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Add Description"
                            className="min-h-[80px] resize-none rounded-lg border-gray-200"
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
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          UPC Code <span className="text-destructive">*</span>
                        </FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input
                              placeholder="Item UPC Code"
                              className="h-11 flex-1 rounded-lg border-gray-200"
                              {...field}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            size="icon"
                            className="h-11 w-11 shrink-0 rounded-lg bg-emerald-500 hover:bg-emerald-600"
                          >
                            <Wrench className="h-5 w-5 text-white" />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="productImageFile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Product Image <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <ImageUpload
                            maxFiles={1}
                            value={field.value}
                            onChange={field.onChange}
                            label="Choose file"
                            hint="Max 1 image"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="productInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Product Information <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Add Product Info"
                            className="min-h-[80px] resize-none rounded-lg border-gray-200"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="productInfoImageFile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">Product Info Image</FormLabel>
                        <FormControl>
                          <ImageUpload
                            maxFiles={1}
                            value={field.value}
                            onChange={field.onChange}
                            label="Choose file"
                            hint="Optional info image"
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
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Nutrition Information
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Add Nutrition Info"
                            className="min-h-[80px] resize-none rounded-lg border-gray-200"
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
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Nutrition Info Image
                        </FormLabel>
                        <FormControl>
                          <ImageUpload
                            maxFiles={1}
                            value={field.value}
                            onChange={field.onChange}
                            label="Choose file"
                            hint="Optional nutrition image"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="discountPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">Discount (%)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Add Discount Percentage"
                            className="h-11 rounded-lg border-gray-200"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="baseQuantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold">
                            Base Quantity <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Base Quantity"
                              className="h-11 rounded-lg border-gray-200"
                              type="number"
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
                        <FormItem>
                          <FormLabel className="text-sm font-semibold">
                            Select Unit <span className="text-destructive">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11 w-full rounded-lg border-gray-200">
                                <SelectValue placeholder="Select Unit" />
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

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Country <span className="text-destructive">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 w-full rounded-lg border-gray-200">
                              <SelectValue placeholder="Select Country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CATALOGUE_COUNTRY_OPTIONS.filter((o) => o.value !== "all").map(
                              (opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="departmentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Department <span className="text-destructive">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 w-full rounded-lg border-gray-200">
                              <SelectValue placeholder="Select Department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CATALOGUE_DEPARTMENT_OPTIONS.filter((o) => o.value !== "all").map(
                              (opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Category <span className="text-destructive">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 w-full rounded-lg border-gray-200">
                              <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CATALOGUE_CATEGORY_OPTIONS.filter((o) => o.value !== "all").map(
                              (opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-center pt-8">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      isLoading={isSubmitting}
                      className="h-12 w-40 rounded-xl"
                    >
                      <Save size={20} />
                      {isEditing ? "Update Item" : "Submit Item"}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </ScrollArea>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
