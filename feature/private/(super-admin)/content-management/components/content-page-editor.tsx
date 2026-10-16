"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { getPlainText } from "@/components/ui/rich-text-editor";
import { Plus, Save } from "lucide-react";

import { useGetContentPage } from "../hooks/use-get-content-page";
import { useContentPageManager } from "../hooks/use-content-page-manager";
import { CONTENT_PAGE_LABELS, type ContentPageData, type ContentPageKey } from "../types";
import { ContentPageSkeleton } from "./content-page-skeleton";
import { SectionDialog } from "./section-dialog";
import { SupportEmailCard } from "./editor/support-email-card";
import { PolicySectionsCard } from "./editor/policy-sections-card";
import { SinglePageContentCard } from "./editor/single-page-content-card";
import { EditTitleDialog } from "./editor/edit-title-dialog";

type ContentPageEditorProps = {
  pageKey: ContentPageKey;
};

export function ContentPageEditor({ pageKey }: ContentPageEditorProps) {
  const defaultLabel = CONTENT_PAGE_LABELS[pageKey];
  const { data, isLoading, isError } = useGetContentPage(pageKey);

  const page = data?.data;

  return (
    <div className="space-y-6">
      {isLoading && <ContentPageSkeleton />}

      {isError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-sm font-medium text-red-600">
          Failed to load {defaultLabel}.
        </div>
      )}

      {page && (
        <ContentPageManager
          key={pageKey}
          page={page}
          pageKey={pageKey}
          defaultLabel={defaultLabel}
        />
      )}
    </div>
  );
}

type ContentPageManagerProps = {
  page: ContentPageData;
  pageKey: ContentPageKey;
  defaultLabel: string;
};

function ContentPageManager({ page, pageKey, defaultLabel }: ContentPageManagerProps) {
  const {
    sections,
    contactEmail,
    setContactEmail,
    title,
    description,
    setDescription,
    isEmailSaving,
    isPending,
    isPolicyPage,
    adminViewLang,
    setAdminViewLang,
    sectionDialogOpen,
    setSectionDialogOpen,
    dialogKey,
    editingSection,
    setEditingSection,
    editingIndex,
    setEditingIndex,
    isSectionSubmitting,
    handleOpenAddSection,
    handleOpenEditSection,
    handleSaveSection,
    deleteDialogOpen,
    setDeleteDialogOpen,
    sectionToDelete,
    sectionToDeleteIndex,
    isDeletePending,
    handlePromptDeleteSection,
    handleConfirmDeleteSection,
    titleDialogOpen,
    setTitleDialogOpen,
    tempTitle,
    setTempTitle,
    handleOpenEditTitle,
    handleApplyTitle,
    handleMoveUp,
    handleMoveDown,
    handleSaveEmail,
    handleSaveAll,
  } = useContentPageManager({ page, pageKey, defaultLabel });

  return (
    <>
      <PageHeader
        title={title || defaultLabel}
        description={`Manage ${defaultLabel.toLowerCase()} content, multilingual translation and customer support email.`}
        action={
          <div className="flex items-center gap-2.5">
            {isPolicyPage && (
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl border-slate-300 font-semibold"
                onClick={handleOpenAddSection}
              >
                <Plus className="mr-2 size-4 text-emerald-600" />
                Add Section
              </Button>
            )}

            <Button
              type="button"
              className="bg-primary hover:bg-primary/90 h-11 min-w-32 rounded-xl font-semibold text-white shadow-xs transition-all"
              disabled={isPending}
              isLoading={isPending}
              onClick={handleSaveAll}
            >
              <Save className="mr-2 size-4" />
              Save All
            </Button>
          </div>
        }
      />

      <SupportEmailCard
        contactEmail={contactEmail}
        onContactEmailChange={setContactEmail}
        onSaveEmail={handleSaveEmail}
        isSaving={isEmailSaving}
        isPending={isPending}
      />

      {isPolicyPage ? (
        <PolicySectionsCard
          sections={sections}
          adminViewLang={adminViewLang}
          onAdminViewLangChange={setAdminViewLang}
          onOpenAddSection={handleOpenAddSection}
          onOpenEditSection={handleOpenEditSection}
          onPromptDeleteSection={handlePromptDeleteSection}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
          isPending={isPending}
        />
      ) : (
        <SinglePageContentCard
          title={title}
          defaultLabel={defaultLabel}
          description={description}
          updatedAt={page.updatedAt}
          onDescriptionChange={setDescription}
          onOpenEditTitle={handleOpenEditTitle}
        />
      )}

      {sectionDialogOpen && (
        <SectionDialog
          key={dialogKey}
          open={sectionDialogOpen}
          onOpenChange={(open) => {
            setSectionDialogOpen(open);
            if (!open) {
              setEditingSection(null);
              setEditingIndex(undefined);
            }
          }}
          section={editingSection}
          sectionIndex={editingIndex}
          onSave={handleSaveSection}
          isSubmitting={isSectionSubmitting}
        />
      )}

      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Section"
        description={`Are you sure you want to delete Section ${(sectionToDeleteIndex ?? 0) + 1}${
          getPlainText(sectionToDelete?.titleTranslations?.en || sectionToDelete?.title)
            ? `: "${getPlainText(sectionToDelete?.titleTranslations?.en || sectionToDelete?.title)}"`
            : ""
        }? This will permanently remove this clause from ${defaultLabel}.`}
        confirmLabel="Delete Section"
        cancelLabel="Cancel"
        variant="destructive"
        isLoading={isDeletePending}
        onConfirm={handleConfirmDeleteSection}
      />

      <EditTitleDialog
        open={titleDialogOpen}
        tempTitle={tempTitle}
        onOpenChange={setTitleDialogOpen}
        onTempTitleChange={setTempTitle}
        onApplyTitle={handleApplyTitle}
      />
    </>
  );
}
