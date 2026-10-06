"use client";

import { ArrowLeft, FileText, Salad } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ROUTES } from "@/config/routes";
import { CategoryPickerDialog } from "../../../categories/components/category-picker-dialog";
import type { ActiveCategory } from "../../../categories/types/category.types";
import {
  getInitialInfoImage,
  getInitialNutritionImage,
  getInitialProductImages,
  type ItemSubmitMode,
  useItemForm,
} from "../../../hooks/useItemForm";
import type { ItemData } from "../../types/item.types";
import { BasicInfoSection } from "./basic-info-section";
import { EditorFooter } from "./editor-footer";
import { EditorHeader } from "./editor-header";
import { InfoWithImageSection } from "./info-with-image-section";
import { InventorySection } from "./inventory-section";
import { PackOptionsSection } from "./pack-options-section";
import { ProductImagesSection } from "./product-images-section";

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

export function ItemEditor(props: ItemEditorProps) {
  const router = useRouter();
  const isEditing = props.mode === "edit";
  const item = isEditing ? props.item : null;

  const initialCategory: ActiveCategory | null =
    props.category ??
    (item?.category
      ? {
          id: item.category.id,
          categoryName: item.category.categoryName,
          categoryIcon: item.category.categoryIcon,
        }
      : null);
  const [category, setCategory] = useState<ActiveCategory | null>(initialCategory);

  const workspaceHref = category
    ? ROUTES.ADMIN.CATALOGUE_MANAGEMENT.CATEGORY_WORKSPACE(category.id)
    : ROUTES.ADMIN.CATALOGUE_MANAGEMENT.ITEMS;
  const returnTo = props.returnTo || workspaceHref;
  const cameFromItems = returnTo.startsWith(ROUTES.ADMIN.CATALOGUE_MANAGEMENT.ITEMS);
  const backLabel =
    returnTo === ROUTES.ADMIN.CATALOGUE_MANAGEMENT.ITEMS
      ? "Back to Items"
      : cameFromItems
        ? "Back to item"
        : `Back to ${category?.categoryName ?? "category"}`;
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

  return (
    <div className="space-y-6 pb-4">
      <PageHeader
        breadcrumbs={[
          { label: "Catalogue Management" },
          ...(cameFromItems
            ? [{ label: "Items", href: ROUTES.ADMIN.CATALOGUE_MANAGEMENT.ITEMS }]
            : [
                { label: "Categories", href: ROUTES.ADMIN.CATALOGUE_MANAGEMENT.CATEGORIES },
                ...(category ? [{ label: category.categoryName, href: workspaceHref }] : []),
              ]),
          { label: isEditing ? `Edit ${item?.productName ?? "item"}` : "Add item" },
        ]}
      />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => leave(returnTo)}
        className="-mt-2 h-8 gap-1.5 rounded-lg px-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </Button>

      <EditorHeader
        isEditing={isEditing}
        savedCount={savedCount}
        category={category}
        onChangeCategory={() => setPickerOpen(true)}
      />

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
              <BasicInfoSection autoFocus={!isEditing} />
              <PackOptionsSection currencySymbol={currencySymbol} disabled={isSubmitting} />
              <div className="grid gap-6 xl:grid-cols-2">
                <InfoWithImageSection
                  kind="product"
                  icon={<FileText className="h-4 w-4" />}
                  title="Product information"
                  description="Ingredients, origin or storage notes."
                  placeholder="Add product information"
                  uploadLabel="Upload info image"
                  uploadHint="One supporting image"
                  initialImages={initialInfoImage}
                />
                <InfoWithImageSection
                  kind="nutrition"
                  icon={<Salad className="h-4 w-4" />}
                  title="Nutrition information"
                  description="Nutrition facts per serving."
                  placeholder="Add nutrition information"
                  uploadLabel="Upload nutrition image"
                  uploadHint="One nutrition label"
                  initialImages={initialNutritionImage}
                />
              </div>
            </div>

            <aside className="min-w-0 space-y-6 lg:sticky lg:top-4">
              <ProductImagesSection initialImages={initialProductImages} />
              <InventorySection />
            </aside>
          </div>

          <EditorFooter
            isEditing={isEditing}
            isDirty={isDirty}
            isSubmitting={isSubmitting}
            savedCount={savedCount}
            onCancel={() => leave(returnTo)}
            onSaveAndAddAnother={() => submit("createAnother")}
          />
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

      {category && (
        <CategoryPickerDialog
          open={pickerOpen}
          onOpenChange={setPickerOpen}
          activeCategoryId={category.id}
          title={isEditing ? "Move item to another category" : "Add item to another category"}
          description={
            isEditing
              ? "The item will be moved when you save changes."
              : "New items will be saved in the category you pick."
          }
          onSelect={(next) => {
            setPickerOpen(false);
            if (next.id !== category.id) {
              if (isEditing) {
                setCategory(next);
                form.setValue("categoryId" as any, next.id, { shouldDirty: true });
              } else {
                leave(ROUTES.ADMIN.CATALOGUE_MANAGEMENT.NEW_ITEM(next.id));
              }
            }
          }}
        />
      )}
    </div>
  );
}
