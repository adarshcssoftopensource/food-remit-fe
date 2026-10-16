"use client";

import { ImageLightbox } from "@/components/common/image-lightbox";
import { PageHeader } from "@/components/common/page-header";
import { ROUTES } from "@/config/routes";
import { CategoryPickerDialog } from "./components/category-picker-dialog";
import { useCategoryWorkspace } from "./hooks/use-category-workspace";
import { CategoryNotAvailable, WorkspaceSkeleton } from "./workspace/workspace-feedback-states";
import { WorkspaceCategoryIdentity } from "./workspace/workspace-category-identity";
import { WorkspaceCategoryActions } from "./workspace/workspace-category-actions";
import { EmptyCategoryCard } from "./workspace/empty-category-card";
import { WorkspaceItemsSection } from "./workspace/workspace-items-section";

interface CategoryItemsWorkspaceProps {
  id: string;
}

export function CategoryItemsWorkspace({ id }: CategoryItemsWorkspaceProps) {
  const {
    category,
    activeCategory,
    isCategoryLoading,
    canWrite,
    isStoreScoped,
    isStoreManager,
    isOpeningEditor,
    pickerOpen,
    setPickerOpen,
    lightboxSrc,
    setLightboxSrc,
    openAddItem,
    exitCategory,
    switchCategory,
    search,
    setSearch,
    debouncedSearch,
    setPage,
    setLimit,
    statusTab,
    setStatusTab,
    items,
    pagination,
    stats,
    columns,
    getRowClassName,
    isItemsLoading,
    isFetching,
  } = useCategoryWorkspace(id);

  if (isCategoryLoading) {
    return <WorkspaceSkeleton />;
  }

  if (!category || !activeCategory) {
    return <CategoryNotAvailable onExit={exitCategory} />;
  }

  const isEmptyCategory = !isItemsLoading && stats.total === 0 && !debouncedSearch;

  return (
    <div className="space-y-6">
      <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />

      <PageHeader
        breadcrumbs={[
          { label: "Catalogue Management" },
          { label: "Categories", href: ROUTES.ADMIN.CATALOGUE_MANAGEMENT.CATEGORIES },
          { label: category.categoryName },
        ]}
      />

      <section className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-xs backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85">
        <div className="from-primary/15 via-primary/5 pointer-events-none absolute inset-y-0 left-0 w-2/3 bg-linear-to-r to-transparent" />
        <div className="bg-primary/10 pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full blur-3xl" />

        <div className="relative flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <WorkspaceCategoryIdentity
            category={category}
            icon={activeCategory.categoryIcon}
            totalItems={stats.total}
            onZoom={setLightboxSrc}
          />

          <WorkspaceCategoryActions
            category={category}
            canWrite={canWrite}
            isStoreManager={isStoreManager}
            isOpeningEditor={isOpeningEditor}
            onExit={exitCategory}
            onChangeCategory={() => setPickerOpen(true)}
            onAddItem={openAddItem}
          />
        </div>
      </section>

      {isEmptyCategory ? (
        <EmptyCategoryCard
          categoryName={category.categoryName}
          canWrite={canWrite}
          isOpeningEditor={isOpeningEditor}
          onAddItem={openAddItem}
        />
      ) : (
        <WorkspaceItemsSection
          categoryName={category.categoryName}
          stats={stats}
          statusTab={statusTab}
          onStatusTabChange={(tab) => {
            setStatusTab(tab);
            setPage(1);
          }}
          isStatusLoading={isItemsLoading || isFetching}
          pagination={pagination}
          debouncedSearch={debouncedSearch}
          columns={columns}
          items={items}
          search={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          isItemsLoading={isItemsLoading}
          isStoreScoped={isStoreScoped}
          onPageChange={setPage}
          onRowsPerPageChange={(value) => {
            setLimit(value);
            setPage(1);
          }}
          getRowClassName={getRowClassName}
        />
      )}

      <CategoryPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        activeCategoryId={category.id}
        title="Change Category"
        description="Switch to another category. New items will be added to the category you pick."
        onSelect={(next) => {
          setPickerOpen(false);
          if (next.id !== category.id) {
            switchCategory(next.id);
          }
        }}
      />
    </div>
  );
}
