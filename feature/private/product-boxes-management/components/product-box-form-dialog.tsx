import { zodResolver } from "@hookform/resolvers/zod";
import { Boxes, ImageIcon, Package2, Save } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { ProductBox } from "../types/product-box.types";

const productBoxSchemaBase = z.object({
  title: z.string().min(2, "Box title must be at least 2 characters"),
  price: z.string().min(1, "Price is required"),
  imageFile: z.array(z.instanceof(File)).optional(),
  existingImage: z.string().nullable().optional(),
  status: z.boolean().default(true),
});

const productBoxSchema = productBoxSchemaBase.superRefine((data, ctx) => {
  const hasExisting = !!data.existingImage;
  const hasNew = (data.imageFile?.length || 0) > 0;

  if (!hasExisting && !hasNew) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["imageFile"],
      message: "Box image is required",
    });
  }

  const price = Number(data.price);
  if (Number.isNaN(price) || price < 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["price"],
      message: "Please enter a valid positive price",
    });
  }
});

type ProductBoxFormValues = z.infer<typeof productBoxSchemaBase>;

interface ProductBoxFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormData) => void;
  isSubmitting?: boolean;
  initialData?: ProductBox | null;
}

export function ProductBoxFormDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  initialData,
}: ProductBoxFormDialogProps) {
  const isEditing = !!initialData;

  const initialImages = useMemo(() => {
    if (!open) return [];
    if (initialData?.image) return [initialData.image];
    return [];
  }, [open, initialData]);

  const form = useForm<ProductBoxFormValues>({
    resolver: zodResolver(productBoxSchema) as any,
    mode: "onSubmit",
    defaultValues: {
      title: initialData?.title || "",
      price: initialData?.price?.toString() || "",
      imageFile: [],
      existingImage: initialData?.image || null,
      status: initialData?.status ?? true,
    },
  });

  useEffect(() => {
    if (open) {
      form.clearErrors();
      form.reset({
        title: initialData?.title || "",
        price: initialData?.price?.toString() || "",
        imageFile: [],
        existingImage: initialData?.image || null,
        status: initialData?.status ?? true,
      });
    }
  }, [open, initialData, form]);

  const handleSubmit = (values: ProductBoxFormValues) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("price", values.price);
    formData.append("status", values.status.toString());

    if (values.imageFile && values.imageFile.length > 0) {
      formData.append("image", values.imageFile[0]);
    } else if (isEditing) {
      if (initialData?.image && !values.existingImage) {
        formData.append("image", "");
      }
    }

    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-1rem)] max-w-2xl overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-0 shadow-[0_30px_90px_-25px_rgba(15,23,42,0.3)] sm:w-[calc(100%-2rem)] dark:border-slate-800 dark:bg-slate-950">
        <DialogHeader className="border-b border-slate-100 px-5 py-5 sm:px-7 dark:border-slate-800">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary ring-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1">
              <Package2 className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <DialogTitle className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                  {isEditing ? "Edit Product Box" : "Create Product Box"}
                </DialogTitle>

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:bg-slate-800 dark:text-slate-400">
                  Product Boxes
                </span>
              </div>

              <DialogDescription className="mt-1.5 max-w-2xl text-sm leading-5 text-slate-500 dark:text-slate-400">
                {isEditing
                  ? "Update the product box title, pricing, and visual presentation."
                  : "Add a new product box bundle with title, price and visual presentation."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit as any)}
            className="flex min-h-0 flex-1 flex-col"
          >
            <ScrollArea className="max-h-[calc(100vh-190px)] overflow-auto">
              <div className="px-5 py-6 sm:px-7">
                <div className="grid w-full gap-6">
                  <section className="rounded-2xl border border-slate-200/80 bg-slate-50/40 p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900/30">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="text-primary flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-slate-700">
                        <Boxes className="h-4 w-4" />
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                          Basic Information
                        </h3>
                        <p className="text-[11px] text-slate-400">Core details about this box</p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <FormField
                        control={form.control as any}
                        name="title"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-xs font-bold tracking-wide text-slate-600 uppercase dark:text-slate-300">
                              Box Title <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Premium Meat Box"
                                className="h-11 rounded-xl border-slate-200 bg-white shadow-none dark:border-slate-700 dark:bg-slate-950"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control as any}
                        name="price"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-xs font-bold tracking-wide text-slate-600 uppercase dark:text-slate-300">
                              Box Price <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                className="h-11 rounded-xl border-slate-200 bg-white shadow-none dark:border-slate-700 dark:bg-slate-950"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control as any}
                        name="status"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                            <div className="space-y-0.5">
                              <FormLabel className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                Box Availability
                              </FormLabel>
                              <FormDescription className="text-[11px] text-slate-400">
                                Toggle to make this box available for customers.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="data-[state=checked]:bg-emerald-500"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </section>

                  <section className="h-full rounded-2xl border border-slate-200/80 bg-slate-50/40 p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900/30">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="text-primary flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-slate-700">
                        <ImageIcon className="h-4 w-4" />
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                          Box Image
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          Upload a cover image for the box
                        </p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <FormField
                        control={form.control as any}
                        name="imageFile"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <div className="flex items-center justify-between">
                              <FormLabel className="text-xs font-bold tracking-wide text-slate-600 uppercase dark:text-slate-300">
                                Cover Image <span className="text-destructive">*</span>
                              </FormLabel>
                              <span className="text-[10px] font-medium text-slate-400">
                                Max 1 image
                              </span>
                            </div>

                            <FormControl>
                              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-950">
                                <ImageUpload
                                  maxFiles={1}
                                  multiple={false}
                                  value={field.value}
                                  onChange={(files) => {
                                    field.onChange(files);
                                  }}
                                  onAllImagesChange={(all) => {
                                    const existing = all.find((i) => !i.file)?.url || null;
                                    form.setValue("existingImage", existing, {
                                      shouldValidate: !!form.formState.isSubmitted,
                                    });
                                  }}
                                  label="Upload box image"
                                  hint="PNG, JPG or WEBP (Max 5MB)"
                                  initialImages={initialImages}
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
                  {isEditing ? "Update Box" : "Create Box"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
