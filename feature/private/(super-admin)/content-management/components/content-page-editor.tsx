"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { PageHeader } from "@/components/common/page-header";
import { errorToast, successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import { getPlainText } from "@/components/ui/rich-text-editor";
import { Plus, Save } from "lucide-react";
import { useState } from "react";

import { useGetContentPage } from "../hooks/use-get-content-page";
import { useAddSection, useDeleteSection, useEditSection } from "../hooks/use-section-api";
import { useUpdateContentPage } from "../hooks/use-update-content-page";
import {
  CONTENT_PAGE_LABELS,
  type ContentPageData,
  type ContentPageKey,
  type ContentPageSection,
  type FaqLanguageCode,
} from "../types";
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
  const updateMutation = useUpdateContentPage(pageKey);
  const addSectionMutation = useAddSection(pageKey);
  const editSectionMutation = useEditSection(pageKey);
  const deleteSectionMutation = useDeleteSection(pageKey);

  const [sections, setSections] = useState<ContentPageSection[]>(() =>
    Array.isArray(page.sections) && page.sections.length > 0 ? page.sections : [],
  );
  const [contactEmail, setContactEmail] = useState<string>(
    () => page.contactEmail || "compliance@foodremit.com",
  );
  const [title, setTitle] = useState<string>(() => page.title || defaultLabel);
  const [description, setDescription] = useState<string>(() => page.description || "");
  const [isEmailSaving, setIsEmailSaving] = useState<boolean>(false);

  // Section modal state
  const [sectionDialogOpen, setSectionDialogOpen] = useState<boolean>(false);
  const [dialogKey, setDialogKey] = useState<number>(0);
  const [editingSection, setEditingSection] = useState<ContentPageSection | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | undefined>(undefined);
  const [isSectionSubmitting, setIsSectionSubmitting] = useState<boolean>(false);

  // Delete section confirmation modal state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [sectionToDelete, setSectionToDelete] = useState<ContentPageSection | null>(null);
  const [sectionToDeleteIndex, setSectionToDeleteIndex] = useState<number | null>(null);

  // Title edit modal state
  const [titleDialogOpen, setTitleDialogOpen] = useState<boolean>(false);
  const [tempTitle, setTempTitle] = useState<string>("");

  // Admin section preview language
  const [adminViewLang, setAdminViewLang] = useState<FaqLanguageCode>("en");

  const compileDescription = (secList: ContentPageSection[]) => {
    return secList.length > 0
      ? secList
          .map((s) => {
            const desc = (s.description || "").trim();
            const formattedDesc = desc.startsWith("<") ? desc : `<p>${desc}</p>`;
            return `<h3>${s.title}</h3>\n${formattedDesc}`;
          })
          .join("\n")
      : description || "";
  };

  const handleOpenAddSection = () => {
    setEditingSection(null);
    setEditingIndex(undefined);
    setDialogKey((prev) => prev + 1);
    setSectionDialogOpen(true);
  };

  const handleOpenEditSection = (sec: ContentPageSection, idx: number) => {
    setEditingSection(sec);
    setEditingIndex(idx);
    setDialogKey((prev) => prev + 1);
    setSectionDialogOpen(true);
  };

  const handleSaveSection = async (
    savedSection: ContentPageSection,
    options?: { keepOpen?: boolean },
  ) => {
    setIsSectionSubmitting(true);
    try {
      if (editingIndex !== undefined && editingSection?.id) {
        const res = await editSectionMutation.mutateAsync({
          sectionId: editingSection.id,
          section: savedSection,
        });

        if (res?.data?.sections) {
          setSections(res.data.sections);
        } else {
          setSections((prev) => {
            const next = [...prev];
            next[editingIndex] = savedSection;
            return next;
          });
        }
        successToast({ title: "Section updated successfully" });
      } else {
        const res = await addSectionMutation.mutateAsync(savedSection);
        if (res?.data?.sections) {
          setSections(res.data.sections);
        } else {
          setSections((prev) => [...prev, savedSection]);
        }
        successToast({ title: "Section added successfully" });
      }

      if (!options?.keepOpen) {
        setSectionDialogOpen(false);
        setEditingSection(null);
        setEditingIndex(undefined);
      }
    } catch {
      errorToast({
        title: "Failed to save section",
        description: "Please check your network connection and try again.",
      });
      throw new Error("Failed to save section");
    } finally {
      setIsSectionSubmitting(false);
    }
  };

  const handlePromptDeleteSection = (sec: ContentPageSection, idx: number) => {
    setSectionToDelete(sec);
    setSectionToDeleteIndex(idx);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDeleteSection = async () => {
    if (sectionToDeleteIndex === null) return;
    const target = sectionToDelete || sections[sectionToDeleteIndex];
    if (!target) return;

    try {
      if (target.id) {
        const res = await deleteSectionMutation.mutateAsync(target.id);
        if (res?.data?.sections) {
          setSections(res.data.sections);
        } else {
          setSections((prev) => prev.filter((_, i) => i !== sectionToDeleteIndex));
        }
      } else {
        const remaining = sections.filter((_, i) => i !== sectionToDeleteIndex);
        await updateMutation.mutateAsync({
          title: title.trim() || defaultLabel,
          description: compileDescription(remaining),
          contactEmail: contactEmail.trim(),
          supportEmail: contactEmail.trim(),
          sections: remaining,
        });
        setSections(remaining);
      }

      setDeleteDialogOpen(false);
      setSectionToDelete(null);
      setSectionToDeleteIndex(null);
      successToast({ title: "Section deleted successfully" });
    } catch {
      errorToast({
        title: "Failed to delete section",
        description: "Please check your network connection and try again.",
      });
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const current = sections[index];
    const prevItem = sections[index - 1];
    if (!current || !prevItem) return;

    const next = [...sections];
    next[index - 1] = current;
    next[index] = prevItem;
    setSections(next);

    try {
      await updateMutation.mutateAsync({
        title: title.trim() || defaultLabel,
        description: compileDescription(next),
        contactEmail: contactEmail.trim(),
        supportEmail: contactEmail.trim(),
        sections: next,
      });
      successToast({ title: "Section order updated" });
    } catch {
      errorToast({ title: "Failed to update section order" });
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index >= sections.length - 1) return;
    const current = sections[index];
    const nextItem = sections[index + 1];
    if (!current || !nextItem) return;

    const next = [...sections];
    next[index + 1] = current;
    next[index] = nextItem;
    setSections(next);

    try {
      await updateMutation.mutateAsync({
        title: title.trim() || defaultLabel,
        description: compileDescription(next),
        contactEmail: contactEmail.trim(),
        supportEmail: contactEmail.trim(),
        sections: next,
      });
      successToast({ title: "Section order updated" });
    } catch {
      errorToast({ title: "Failed to update section order" });
    }
  };

  const handleSaveEmail = async () => {
    setIsEmailSaving(true);
    try {
      await updateMutation.mutateAsync({
        title: title.trim() || defaultLabel,
        description: compileDescription(sections),
        contactEmail: contactEmail.trim(),
        supportEmail: contactEmail.trim(),
        sections,
      });
      successToast({ title: "Customer support email updated" });
    } catch {
      errorToast({ title: "Failed to update customer support email" });
    } finally {
      setIsEmailSaving(false);
    }
  };

  const handleSaveAll = async () => {
    try {
      const compiledHtml = compileDescription(sections);

      const payload = {
        title: title.trim() || defaultLabel,
        description: compiledHtml,
        contactEmail: contactEmail.trim(),
        supportEmail: contactEmail.trim(),
        sections,
      };

      await updateMutation.mutateAsync(payload);
      successToast({ title: `${title || defaultLabel} saved successfully` });
    } catch {
      errorToast({
        title: "Failed to save content",
        description: "Please check your network and try again.",
      });
    }
  };

  const isPolicyPage =
    pageKey === "terms-of-use" || pageKey === "privacy-policy" || sections.length > 0;

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
              disabled={updateMutation.isPending}
              isLoading={updateMutation.isPending}
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
        isPending={updateMutation.isPending}
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
          isPending={updateMutation.isPending}
        />
      ) : (
        <SinglePageContentCard
          title={title}
          defaultLabel={defaultLabel}
          description={description}
          updatedAt={page.updatedAt}
          onDescriptionChange={setDescription}
          onOpenEditTitle={() => {
            setTitleDialogOpen(true);
            setTempTitle(title);
          }}
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
        isLoading={deleteSectionMutation.isPending || updateMutation.isPending}
        onConfirm={handleConfirmDeleteSection}
      />

      <EditTitleDialog
        open={titleDialogOpen}
        tempTitle={tempTitle}
        onOpenChange={setTitleDialogOpen}
        onTempTitleChange={setTempTitle}
        onApplyTitle={async () => {
          const newTitle = tempTitle.trim() || defaultLabel;
          setTitle(newTitle);
          setTitleDialogOpen(false);
          try {
            await updateMutation.mutateAsync({
              title: newTitle,
              description: compileDescription(sections),
              contactEmail: contactEmail.trim(),
              supportEmail: contactEmail.trim(),
              sections,
            });
            successToast({ title: "Page title updated successfully" });
          } catch {
            errorToast({ title: "Failed to update page title" });
          }
        }}
      />
    </>
  );
}
