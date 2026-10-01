"use client";

import { FolderOpen, Lock, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useMemo } from "react";

import { useProfile } from "@/components/providers/profile-provider";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { useGetCategory } from "../categories/hooks/use-get-category";
import type { ActiveCategory } from "../categories/types/category.types";
import { ItemEditor } from "./components/item-editor";
import { useGetItemById } from "./hooks/use-get-item-by-id";

const CATALOGUE_PREFIX = "/catalogue-management";

/** Only allow in-app catalogue paths as a return target. */
export function safeReturnTo(from?: string | null) {
  if (!from) return undefined;
  return from.startsWith(CATALOGUE_PREFIX) && !from.startsWith("//") ? from : undefined;
}

export function ItemEditorSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-5 w-72 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
      <div className="h-24 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800/60" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <div className="h-72 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800/60" />
          <div className="h-56 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800/60" />
        </div>
        <div className="h-96 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800/60" />
      </div>
    </div>
  );
}

function EditorMessage({
  icon,
  title,
  description,
  actionLabel,
  href,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  href: string;
}) {
  const router = useRouter();
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-center">
      <div className="text-slate-300">{icon}</div>
      <h2 className="text-2xl font-bold tracking-tight text-slate-700 dark:text-slate-200">
        {title}
      </h2>
      <p className="max-w-sm text-sm text-slate-500">{description}</p>
      <Button onClick={() => router.push(href)} variant="outline" className="mt-2 rounded-xl px-6">
        {actionLabel}
      </Button>
    </div>
  );
}

function ReadOnlyNotice({ href }: { href: string }) {
  return (
    <EditorMessage
      icon={<Lock className="h-14 w-14" />}
      title="Catalogue is read-only"
      description="Verify your bank details to add or edit items."
      actionLabel="Go back"
      href={href}
    />
  );
}

export function CreateItemPage({ categoryId }: { categoryId: string }) {
  const { needsBankVerification } = useProfile();
  const { data: category, isLoading } = useGetCategory(categoryId);
  const workspaceHref = ROUTES.ADMIN.CATALOGUE_MANAGEMENT.CATEGORY_WORKSPACE(categoryId);

  const activeCategory = useMemo<ActiveCategory | null>(
    () =>
      category
        ? {
            id: category.id,
            categoryName: category.categoryName,
            categoryIcon: category.categoryIconUrl || category.categoryIcon,
            currencySymbol: category.currencySymbol,
          }
        : null,
    [category],
  );

  if (needsBankVerification) return <ReadOnlyNotice href={workspaceHref} />;
  if (isLoading) return <ItemEditorSkeleton />;
  if (!activeCategory) {
    return (
      <EditorMessage
        icon={<FolderOpen className="h-16 w-16" />}
        title="Category not available"
        description="This category doesn't exist or doesn't belong to your store, so items can't be added to it."
        actionLabel="Back to Categories"
        href={ROUTES.ADMIN.CATALOGUE_MANAGEMENT.CATEGORIES}
      />
    );
  }

  return (
    <ItemEditor
      key={activeCategory.id}
      mode="create"
      category={activeCategory}
      returnTo={workspaceHref}
    />
  );
}

export function EditItemPage({ itemId, from }: { itemId: string; from?: string }) {
  const { needsBankVerification } = useProfile();
  const { data: response, isFetchedAfterMount } = useGetItemById(itemId);
  const item = response?.data;
  const returnTo = safeReturnTo(from) ?? ROUTES.ADMIN.CATALOGUE_MANAGEMENT.ITEM_DETAILS(itemId);

  if (needsBankVerification) return <ReadOnlyNotice href={returnTo} />;
  // Always edit fresh data, never a stale cached copy
  if (!isFetchedAfterMount) return <ItemEditorSkeleton />;
  if (!item) {
    return (
      <EditorMessage
        icon={<Package className="h-16 w-16" />}
        title="Item not found"
        description="This item doesn't exist, was deleted, or doesn't belong to your store."
        actionLabel="Back to Items"
        href={ROUTES.ADMIN.CATALOGUE_MANAGEMENT.ITEMS}
      />
    );
  }

  return <ItemEditor key={item.id} mode="edit" item={item} returnTo={returnTo} />;
}
