"use client";

import type { SortingState } from "@tanstack/react-table";
import { CircleHelp, CreditCard, Layers, ShoppingBag, Store, User } from "lucide-react";
import { useMemo, useState } from "react";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { DataTable } from "@/components/common/data-table/data-table";
import { PageHeader } from "@/components/common/page-header";
import { successToast } from "@/components/toaster";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";
import { useDebounce } from "@/lib/debounce";
import { cn } from "@/lib/utils";
import { getFaqColumns } from "./columns/faq-columns";
import { AddFaqDialog } from "./components/add-faq-dialog";
import { EditFaqDialog } from "./components/edit-faq-dialog";
import { FaqSkeleton } from "./components/faq-skeleton";
import { useCreateFaq, useDeleteFaq, useGetFaqs, useUpdateFaq } from "./hooks/use-faq-api";
import { FAQ_STATIC_CATEGORIES, type FaqCategoryKey, type FaqData } from "./types";

const CATEGORY_TABS = [
  { key: "all", label: "All Categories", icon: Layers },
  ...FAQ_STATIC_CATEGORIES.map((c) => ({
    key: c.key,
    label: c.label,
    icon:
      c.key === "order"
        ? ShoppingBag
        : c.key === "payments"
          ? CreditCard
          : c.key === "account"
            ? User
            : c.key === "pickup"
              ? Store
              : CircleHelp,
  })),
];

export function FaqManagementPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);

  const sortBy = sorting[0]?.id;
  const sortOrder = sorting[0] ? (sorting[0].desc ? "desc" : "asc") : undefined;

  const { data, isLoading, isError } = useGetFaqs(
    debouncedSearch || undefined,
    sortBy,
    sortOrder,
    page,
    limit,
    selectedCategory === "all" ? undefined : selectedCategory,
  );
  const createFaq = useCreateFaq();
  const updateFaq = useUpdateFaq();
  const deleteFaq = useDeleteFaq();

  const faqs = data?.data ?? [];
  const pagination = data?.pagination ?? {
    page: 1,
    limit,
    total: faqs.length,
    totalPages: 1,
  };

  const [editingFaq, setEditingFaq] = useState<FaqData | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deletingFaq, setDeletingFaq] = useState<FaqData | null>(null);

  const columns = useMemo(
    () =>
      getFaqColumns({
        onEdit: (faq) => {
          setEditingFaq(faq);
          setIsEditOpen(true);
        },
        onDelete: (faq) => setDeletingFaq(faq),
      }),
    [],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="FAQ"
        description="Manage frequently asked questions with category grouping and languages."
        action={
          <AddFaqDialog
            onSubmit={async (values) => {
              await createFaq.mutateAsync(values);
            }}
          />
        }
      />

      {/* Category Filter Pills (5 categories + All) */}
      <div className="flex flex-wrap items-center gap-2">
        {CATEGORY_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = selectedCategory === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setSelectedCategory(tab.key);
                setPage(1);
              }}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all outline-none sm:text-sm",
                isActive
                  ? "bg-emerald-600 text-white shadow-md ring-2 shadow-emerald-600/20 ring-emerald-600/20"
                  : "border border-slate-200/90 bg-white text-slate-600 shadow-2xs hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <Icon className="size-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <FaqSkeleton />
      ) : (
        <Card className="overflow-hidden rounded-2xl border-slate-200/80 pt-0 shadow-sm">
          <CardHeader className="from-primary/8 border-b bg-linear-to-r via-emerald-50/40 to-transparent py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/15 text-primary flex size-10 items-center justify-center rounded-xl">
                  <CircleHelp className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold">
                    {selectedCategory === "all"
                      ? "All Frequently Asked Questions"
                      : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} FAQs`}
                  </CardTitle>
                  <p className="text-muted-foreground mt-0.5 text-sm">
                    {`${pagination.total} FAQ${pagination.total !== 1 ? "s" : ""} found`}
                    {selectedCategory !== "all" ? ` in ${selectedCategory}` : ""}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {isError ? (
              <p className="py-8 text-center text-sm font-medium text-red-600">
                Failed to load FAQs.
              </p>
            ) : (
              <DataTable
                columns={columns}
                data={faqs}
                loading={false}
                searchKey="question"
                searchValue={searchValue}
                onSearchChange={(val) => {
                  setSearchValue(val);
                  setPage(1);
                }}
                onSortingChange={(next) => {
                  setSorting(next);
                  setPage(1);
                }}
                manualSorting
                manualFiltering
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                rowsPerPage={pagination.limit}
                onPageChange={setPage}
                onRowsPerPageChange={(newLimit) => {
                  setLimit(newLimit);
                  setPage(1);
                }}
              />
            )}
          </CardContent>
        </Card>
      )}

      <EditFaqDialog
        faq={editingFaq}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSubmit={async (id, values) => {
          await updateFaq.mutateAsync({ id, values });
        }}
      />

      <ConfirmationDialog
        open={!!deletingFaq}
        onOpenChange={(open) => !open && setDeletingFaq(null)}
        title="Delete FAQ"
        description="Are you sure you want to delete this FAQ? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="destructive"
        isLoading={deleteFaq.isPending}
        onConfirm={async () => {
          if (!deletingFaq) return;
          await deleteFaq.mutateAsync(deletingFaq.id);
          successToast({ title: "FAQ deleted successfully" });
          setDeletingFaq(null);
        }}
        onCancel={() => setDeletingFaq(null)}
      />
    </div>
  );
}
