"use client";

import {
  ArrowLeftRight,
  Boxes,
  CheckCircle2,
  FileText,
  FolderOpen,
  ImageIcon,
  Package2,
  PackagePlus,
  Salad,
  Save,
  Warehouse,
  Wand2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useMemo, useState } from "react";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { ImageUpload } from "@/components/common/image-upload";
import { NumericInput } from "@/components/common/numeric-input";
import {
  PackSizeOptionsField,
  type PackSizeOptionErrors,
} from "@/components/common/pack-size-options-field";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ROUTES } from "@/config/routes";
import { ITEM_LIMITS, ITEM_NUMBER_MAX } from "@/lib/catalogue/item-rules";
import { cn } from "@/lib/utils";
import { generateUpcCode } from "@/lib/utils/generate-upc";
import { CategoryPickerDialog } from "../../categories/components/category-picker-dialog";
import type { ActiveCategory } from "../../categories/types/category.types";
import {
  getInitialInfoImage,
  getInitialNutritionImage,
  getInitialProductImages,
  type ItemSubmitMode,
  useItemForm,
} from "../../hooks/useItemForm";
import type { ItemData } from "../types/item.types";

type ItemEditorProps =
  | {
      mode: "create";
      category: ActiveCategory;
      item?: never;
      returnTo?: string;
    }
  | {
      mode: "edit";
      item: ItemData;
      category?: ActiveCategory | null;
      returnTo?: string;
    };

const labelClass = "text-[13px] font-semibold text-slate-700 dark:text-slate-200";
const textareaClass = "resize-y rounded-xl shadow-none";

function Optional() {
  return <span className="ml-1 text-xs font-normal text-slate-400">(optional)</span>;
}

function Required() {
  return <span className="text-destructive ml-0.5">*</span>;
}

function Section({
  icon,
  title,
  description,
  aside,
  children,
}: {
  icon: ReactNode;
  title: ReactNode;
  description?: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900/70">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <div className="flex min-w-0 items-start gap-3">
          <div className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
            {icon}
          </div>
          <div className="min-w-0">
            <h2 className="text-[15px] font-bold text-slate-900 dark:text-white">{title}</h2>
            {description && (
              <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                {description}
              </p>
            )}
          </div>
        </div>
        {aside}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

function ImageDropZone({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-2 dark:border-slate-700 dark:bg-slate-950/40">
      {children}
    </div>
  );
}

export function ItemEditor(props: ItemEditorProps) {
  const router = useRouter();
  const isEditing = props.mode === "edit";
  const item = isEditing ? props.item : null;

  const category: ActiveCategory | null =
    props.category ??
    (item?.category ? { id: item.category.id, categoryName: item.category.categoryName } : null);
  const workspaceHref = category
    ? ROUTES.ADMIN.CATALOGUE_MANAGEMENT.CATEGORY_WORKSPACE(category.id)
    : ROUTES.ADMIN.CATALOGUE_MANAGEMENT.ITEMS;
  const returnTo = props.returnTo || workspaceHref;
  const currencySymbol =
    category?.currencySymbol ||
    item?.pricing?.currencySymbol ||
    item?.placements?.[0]?.currencySymbol ||
    null;

  const { form, formKey, savedCount, isSubmitting, submit } = useItemForm({
    item,
    category,
    onSaved: (mode: ItemSubmitMode) => {
      if (!isEditing && mode === "createAnother") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      router.push(returnTo);
    },
  });

  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const isDirty = form.formState.isDirty;

  useEffect(() => {
    if (!isDirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);

  const leave = (href: string) => {
    if (isDirty && !isSubmitting) setPendingHref(href);
    else router.push(href);
  };

  const initialProductImages = useMemo(
    () => getInitialProductImages(item),
    // formKey: remount pickers with a clean slate after "Save & Add Another"
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [item, formKey],
  );
  const initialInfoImage = useMemo(() => {
    const src = getInitialInfoImage(item);
    return src ? [src] : [];
  }, [item]);
  const initialNutritionImage = useMemo(() => {
    const src = getInitialNutritionImage(item);
    return src ? [src] : [];
  }, [item]);

  const optionErrors = form.formState.errors.options;
  const optionRowErrors = Array.isArray(optionErrors)
    ? (optionErrors as Array<Record<string, { message?: string }> | undefined>).map((row) =>
        row
          ? (Object.fromEntries(
              Object.entries(row).map(([key, err]) => [key, err?.message]),
            ) as PackSizeOptionErrors)
          : undefined,
      )
    : undefined;
  const optionRootError =
    (optionErrors as { message?: string } | undefined)?.message ??
    (optionErrors as { root?: { message?: string } } | undefined)?.root?.message;

  const categoryName = category?.categoryName ?? "—";
  const title = isEditing ? "Edit item" : "Add item";

  return (
    <div className="space-y-6 pb-4">
      <PageHeader
        breadcrumbs={[
          { label: "Catalogue Management" },
          { label: "Categories", href: ROUTES.ADMIN.CATALOGUE_MANAGEMENT.CATEGORIES },
          ...(category ? [{ label: category.categoryName, href: workspaceHref }] : []),
          { label: isEditing ? `Edit ${item?.productName ?? "item"}` : "Add item" },
        ]}
      />

      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900/70">
        <div className="flex min-w-0 items-center gap-4">
          <div className="bg-primary/10 text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
            {isEditing ? <Package2 className="h-6 w-6" /> : <PackagePlus className="h-6 w-6" />}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                {title}
              </h1>
              {savedCount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {savedCount} added this session
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {isEditing
                ? "Update details, pack / size pricing, stock and images."
                : `New items are saved in ${categoryName}. Use "Save & add another" to keep adding to this category.`}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 py-2 pr-2 pl-3 dark:border-slate-700 dark:bg-slate-950/50">
          <div className="bg-primary/10 text-primary relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg">
            {category?.categoryIcon ? (
              <Image
                src={category.categoryIcon}
                alt={categoryName}
                fill
                sizes="36px"
                className="object-cover"
              />
            ) : (
              <FolderOpen className="h-4 w-4" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-slate-500">Category</p>
            <p className="max-w-48 truncate text-sm font-bold text-slate-900 dark:text-white">
              {categoryName}
            </p>
          </div>
          {!isEditing && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setPickerOpen(true)}
              className="text-primary hover:text-primary ml-1 h-8 gap-1.5 rounded-lg px-2.5 text-xs font-semibold"
            >
              <ArrowLeftRight className="h-3.5 w-3.5" />
              Change
            </Button>
          )}
        </div>
      </div>

      <Form {...form}>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            submit("close");
          }}
        >
          <div
            key={formKey}
            className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]"
          >
            <div className="min-w-0 space-y-6">
              <Section
                icon={<Package2 className="h-4 w-4" />}
                title="Basic information"
                description="What customers see first."
              >
                <div className="space-y-5">
                  <FormField
                    control={form.control}
                    name="productName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>
                          Item name
                          <Required />
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Organic Almond Milk"
                            maxLength={ITEM_LIMITS.productNameMax}
                            autoFocus={!isEditing}
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
                        <FormLabel className={labelClass}>
                          Description
                          <Optional />
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="A short description of the item"
                            className={cn("min-h-24", textareaClass)}
                            maxLength={ITEM_LIMITS.textMax}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="itemNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>
                            Item number / SKU
                            <Optional />
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. MILK-001"
                              maxLength={ITEM_NUMBER_MAX}
                              autoComplete="off"
                              spellCheck={false}
                              className="font-mono placeholder:font-sans"
                              {...field}
                            />
                          </FormControl>
                          <p className="text-muted-foreground text-[11px]">
                            Your own code for this item. CSV rows with the same item number update
                            it.
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="upcCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>
                            UPC / barcode
                            <Optional />
                          </FormLabel>
                          <div className="flex gap-2">
                            <FormControl>
                              <NumericInput
                                placeholder="8 to 14 digits"
                                maxLength={14}
                                value={field.value}
                                onValueChange={field.onChange}
                                onBlur={field.onBlur}
                                name={field.name}
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() =>
                                form.setValue("upcCode", generateUpcCode(), {
                                  shouldDirty: true,
                                  shouldValidate: true,
                                })
                              }
                              className="h-10 shrink-0 gap-1.5 rounded-xl"
                            >
                              <Wand2 className="h-4 w-4" />
                              Generate
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </Section>

              <Section
                icon={<Boxes className="h-4 w-4" />}
                title={
                  <>
                    Pack / Size &amp; price options
                    <Required />
                  </>
                }
                description="Each pack or size a customer can buy, with its own price."
                aside={
                  currencySymbol ? (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      Prices in {currencySymbol}
                    </span>
                  ) : null
                }
              >
                <FormField
                  control={form.control}
                  name="options"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <PackSizeOptionsField
                          value={field.value}
                          onChange={field.onChange}
                          currencySymbol={currencySymbol}
                          rowErrors={optionRowErrors}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      {optionRootError && (
                        <p className="text-destructive text-xs font-medium">{optionRootError}</p>
                      )}
                    </FormItem>
                  )}
                />
              </Section>

              <div className="grid gap-6 xl:grid-cols-2">
                <Section
                  icon={<FileText className="h-4 w-4" />}
                  title={
                    <>
                      Product information
                      <Optional />
                    </>
                  }
                  description="Ingredients, origin or storage notes."
                >
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="productInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Add product information"
                              className={cn("min-h-24", textareaClass)}
                              maxLength={ITEM_LIMITS.textMax}
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
                          <FormControl>
                            <ImageDropZone>
                              <ImageUpload
                                maxFiles={1}
                                value={field.value}
                                onChange={field.onChange}
                                onAllImagesChange={(all) => {
                                  form.setValue(
                                    "existingProductInfoImage",
                                    all.find((i) => !i.file)?.url || null,
                                  );
                                  form.setValue(
                                    "productInfoImageFile",
                                    all.filter((i) => !!i.file).map((i) => i.file!),
                                  );
                                }}
                                label="Upload info image"
                                hint="One supporting image"
                                initialImages={initialInfoImage}
                              />
                            </ImageDropZone>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Section>

                <Section
                  icon={<Salad className="h-4 w-4" />}
                  title={
                    <>
                      Nutrition information
                      <Optional />
                    </>
                  }
                  description="Nutrition facts per serving."
                >
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="nutritionInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Add nutrition information"
                              className={cn("min-h-24", textareaClass)}
                              maxLength={ITEM_LIMITS.textMax}
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
                          <FormControl>
                            <ImageDropZone>
                              <ImageUpload
                                maxFiles={1}
                                value={field.value}
                                onChange={field.onChange}
                                onAllImagesChange={(all) => {
                                  form.setValue(
                                    "existingNutritionInfoImage",
                                    all.find((i) => !i.file)?.url || null,
                                  );
                                  form.setValue(
                                    "nutritionInfoImageFile",
                                    all.filter((i) => !!i.file).map((i) => i.file!),
                                  );
                                }}
                                label="Upload nutrition image"
                                hint="One nutrition label"
                                initialImages={initialNutritionImage}
                              />
                            </ImageDropZone>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Section>
              </div>
            </div>

            <aside className="min-w-0 space-y-6 lg:sticky lg:top-4">
              <Section
                icon={<ImageIcon className="h-4 w-4" />}
                title={
                  <>
                    Product images
                    <Required />
                  </>
                }
                description={`Up to ${ITEM_LIMITS.maxImages} images · PNG, JPG or WEBP. The first image is the cover.`}
              >
                <FormField
                  control={form.control}
                  name="productImageFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageDropZone>
                          <ImageUpload
                            maxFiles={ITEM_LIMITS.maxImages}
                            multiple
                            value={field.value}
                            onChange={field.onChange}
                            onAllImagesChange={(all) => {
                              form.setValue(
                                "existingProductImages",
                                all.filter((i) => !i.file).map((i) => i.url),
                              );
                              form.setValue(
                                "productImageFile",
                                all.filter((i) => !!i.file).map((i) => i.file!),
                                { shouldValidate: form.formState.isSubmitted },
                              );
                            }}
                            label="Upload product images"
                            hint={`PNG, JPG or WEBP · up to ${ITEM_LIMITS.maxImages}`}
                            initialImages={initialProductImages}
                          />
                        </ImageDropZone>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Section>

              <Section
                icon={<Warehouse className="h-4 w-4" />}
                title="Inventory"
                description="Stock and offers for this item."
              >
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="quantityOnHand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>
                            Quantity on hand
                            <Required />
                          </FormLabel>
                          <FormControl>
                            <NumericInput
                              placeholder="0"
                              value={field.value}
                              onValueChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="discountPercentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>
                            Discount
                            <Optional />
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <NumericInput
                                decimals={2}
                                placeholder="0"
                                value={field.value}
                                onValueChange={field.onChange}
                                onBlur={field.onBlur}
                                name={field.name}
                                className="pr-8"
                              />
                              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-slate-400">
                                %
                              </span>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <p className="-mt-2 text-xs leading-5 text-slate-500">
                    Items with 0 on hand are saved as inactive until restocked.
                  </p>

                  <FormField
                    control={form.control}
                    name="isPerishable"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-700">
                        <div className="space-y-0.5">
                          <FormLabel className={labelClass}>Perishable item</FormLabel>
                          <FormDescription className="text-xs leading-5">
                            Uses the shorter pickup reminder schedule.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </Section>
            </aside>
          </div>

          <div className="sticky bottom-0 z-20 mt-6 flex flex-col-reverse gap-3 rounded-2xl border border-slate-200/80 bg-white/95 p-3 shadow-[0_-8px_30px_-12px_rgba(15,23,42,0.18)] backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-5 dark:border-slate-800 dark:bg-slate-950/95">
            <p className="hidden text-xs text-slate-500 sm:block">
              <span className="text-destructive">*</span> Required ·{" "}
              {isDirty ? "Unsaved changes" : "No unsaved changes"}
            </p>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => leave(returnTo)}
                disabled={isSubmitting}
                className="h-10 rounded-xl px-5"
              >
                {savedCount > 0 ? "Done" : "Cancel"}
              </Button>
              {!isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => submit("createAnother")}
                  disabled={isSubmitting}
                  className="border-primary/30 text-primary hover:bg-primary/5 hover:text-primary h-10 rounded-xl px-5"
                >
                  <PackagePlus className="mr-2 h-4 w-4" />
                  Save &amp; add another
                </Button>
              )}
              <Button
                type="submit"
                disabled={isSubmitting}
                isLoading={isSubmitting}
                className="h-10 min-w-36 rounded-xl px-5"
              >
                {!isSubmitting && <Save className="mr-2 h-4 w-4" />}
                {isEditing ? "Save changes" : "Save item"}
              </Button>
            </div>
          </div>
        </form>
      </Form>

      <ConfirmationDialog
        open={!!pendingHref}
        onOpenChange={(open) => !open && setPendingHref(null)}
        title="Discard unsaved changes?"
        description="You have changes that haven't been saved. If you leave now they will be lost."
        confirmLabel="Discard changes"
        cancelLabel="Keep editing"
        variant="destructive"
        onConfirm={() => {
          const href = pendingHref;
          setPendingHref(null);
          if (href) router.push(href);
        }}
      />

      {!isEditing && category && (
        <CategoryPickerDialog
          open={pickerOpen}
          onOpenChange={setPickerOpen}
          activeCategoryId={category.id}
          title="Add item to another category"
          description="New items will be saved in the category you pick."
          onSelect={(next) => {
            setPickerOpen(false);
            if (next.id !== category.id) {
              leave(ROUTES.ADMIN.CATALOGUE_MANAGEMENT.NEW_ITEM(next.id));
            }
          }}
        />
      )}
    </div>
  );
}
