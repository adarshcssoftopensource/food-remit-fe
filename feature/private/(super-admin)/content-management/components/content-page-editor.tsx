"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { PageHeader } from "@/components/common/page-header";
import { errorToast, successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { formatDateTime } from "@/lib/date";
import { cn } from "@/lib/utils";
import { FileText, Globe, Mail, PencilLine, Plus, Save, Trash2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useState, useSyncExternalStore } from "react";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

import { getPlainText, RichTextPreview } from "@/components/ui/rich-text-editor";
import {
  DataTableRowActions,
  type DataTableRowActionItem,
} from "@/components/common/data-table/data-table-row-actions";

import { useGetContentPage } from "../hooks/use-get-content-page";
import { useAddSection, useDeleteSection, useEditSection } from "../hooks/use-section-api";
import { useUpdateContentPage } from "../hooks/use-update-content-page";
import {
  CONTENT_PAGE_LABELS,
  FAQ_SUPPORTED_LANGUAGES,
  type ContentPageData,
  type ContentPageKey,
  type ContentPageSection,
  type FaqLanguageCode,
} from "../types";
import { ContentPageSkeleton } from "./content-page-skeleton";
import { SectionDialog } from "./section-dialog";

type ContentPageEditorProps = {
  pageKey: ContentPageKey;
};

const inputClass =
  "h-11 rounded-xl border-gray-200/80 bg-gray-50/50 text-sm transition-colors hover:border-gray-300 hover:bg-gray-50 focus-visible:border-primary focus-visible:bg-white focus-visible:ring-primary/20";

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

  // Initialize state directly from props — no useEffect calling setState needed!
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

  // Section actions
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

  // Add / Edit Section via API
  const handleSaveSection = async (
    savedSection: ContentPageSection,
    options?: { keepOpen?: boolean },
  ) => {
    setIsSectionSubmitting(true);
    try {
      if (editingIndex !== undefined && editingSection?.id) {
        // Edit by API
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
        // Add by API
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

  // Prompt delete dialog
  const handlePromptDeleteSection = (sec: ContentPageSection, idx: number) => {
    setSectionToDelete(sec);
    setSectionToDeleteIndex(idx);
    setDeleteDialogOpen(true);
  };

  // Confirm delete via API
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

  // Save Support Email via API
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

  // Save All Changes (manual backup button)
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

      {/* Support / Compliance Email Banner Card */}
      <Card className="rounded-2xl border-slate-200/80 shadow-xs">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shadow-xs">
                <Mail className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Customer Support &amp; Compliance Email
                </h3>
                <p className="text-xs text-slate-500">
                  Displayed to mobile &amp; web users: &quot;Questions? {contactEmail}&quot;
                </p>
              </div>
            </div>

            <div className="flex w-full items-center gap-2 sm:max-w-md">
              <Input
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="e.g. compliance@foodremit.com"
                className={cn(inputClass, "w-full")}
              />
              <Button
                type="button"
                variant="outline"
                className="h-11 shrink-0 rounded-xl border-slate-300 font-semibold"
                disabled={isEmailSaving || updateMutation.isPending}
                isLoading={isEmailSaving}
                onClick={handleSaveEmail}
              >
                Save Email
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isPolicyPage ? (
        /* Full-width Multilingual Policy Sections Manager */
        <Card className="rounded-2xl border-slate-200/80 shadow-xs">
          <CardHeader className="border-b border-slate-100 bg-linear-to-r from-emerald-50/40 to-transparent py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
                  <FileText className="size-4" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900">
                    Policy Sections
                  </CardTitle>
                  <p className="text-xs text-slate-500">
                    {sections.length} {sections.length === 1 ? "section" : "sections"} configured
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Admin View Language Selector */}
                <div className="flex items-center gap-1 rounded-xl border border-slate-200/90 bg-slate-50/80 p-1 text-xs">
                  <span className="px-2 text-[11px] font-medium text-slate-400">Sorted by:</span>
                  {FAQ_SUPPORTED_LANGUAGES.map((lang) => {
                    const isActive = adminViewLang === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => setAdminViewLang(lang.code)}
                        className={cn(
                          "cursor-pointer rounded-lg px-2.5 py-1 text-xs font-semibold transition-all duration-150",
                          isActive
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-2xs",
                        )}
                        title={lang.fullName}
                      >
                        {lang.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-5">
            {sections.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
                <p className="text-sm font-semibold text-slate-700">No sections added yet</p>
                <p className="mt-1 text-xs text-slate-500">
                  Click &quot;Add Section&quot; to configure your first multilingual clause.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-4 rounded-xl"
                  onClick={handleOpenAddSection}
                >
                  <Plus className="mr-1.5 size-4" /> Add Section
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {sections.map((sec, idx) => {
                  const titleTrans = sec.titleTranslations || {};
                  const descTrans = sec.descriptionTranslations || {};

                  const displayTitle =
                    adminViewLang === "en"
                      ? titleTrans.en || sec.title || `Section ${idx + 1}`
                      : titleTrans[adminViewLang] ||
                        titleTrans.en ||
                        sec.title ||
                        `Section ${idx + 1}`;

                  const displayDesc =
                    adminViewLang === "en"
                      ? descTrans.en || sec.description || ""
                      : descTrans[adminViewLang] || descTrans.en || sec.description || "";

                  const actionItems: DataTableRowActionItem[] = [
                    {
                      label: "Edit Section",
                      icon: <PencilLine className="size-4" />,
                      onClick: () => handleOpenEditSection(sec, idx),
                    },
                    {
                      label: "Delete Section",
                      icon: <Trash2 className="size-4" />,
                      onClick: () => handlePromptDeleteSection(sec, idx),
                      variant: "destructive",
                    },
                  ];

                  const completedCount = FAQ_SUPPORTED_LANGUAGES.filter((lang) => {
                    const hasT = Boolean(titleTrans[lang.code]?.trim());
                    const hasD = Boolean(descTrans[lang.code]?.trim());
                    return hasT && hasD;
                  }).length;

                  return (
                    <div
                      key={sec.id || idx}
                      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 transition-all duration-200 hover:border-emerald-200/90 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 flex-1 items-start gap-3">
                            {/* Section Index Badge */}
                            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-xs font-bold text-emerald-700 shadow-2xs ring-1 ring-emerald-200/60 dark:bg-emerald-950/50 dark:text-emerald-400">
                              {idx + 1}
                            </div>

                            <div className="min-w-0 flex-1">
                              <RichTextPreview
                                html={displayTitle || `Section ${idx + 1}`}
                                lineClamp={1}
                                className="text-sm font-semibold text-slate-900 transition-colors group-hover:text-emerald-950 dark:text-white"
                              />
                            </div>
                          </div>

                          {/* Action Menu (Three Dots) */}
                          <div className="shrink-0">
                            <DataTableRowActions items={actionItems} />
                          </div>
                        </div>

                        {/* Description Preview */}
                        <RichTextPreview
                          html={displayDesc}
                          fallback="—"
                          lineClamp={3}
                          className="mt-2.5 min-h-[3rem] text-xs leading-relaxed text-slate-500 dark:text-slate-400"
                        />
                      </div>

                      {/* 5-Language Translation Status Badges */}
                      <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3.5 dark:border-slate-800">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Globe className="size-3.5 text-slate-400" />
                          <span className="text-[11px] font-medium text-slate-500">
                            Translations
                          </span>
                          <span
                            className={cn(
                              "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                              completedCount === FAQ_SUPPORTED_LANGUAGES.length
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                                : "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
                            )}
                          >
                            {completedCount}/{FAQ_SUPPORTED_LANGUAGES.length}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          {FAQ_SUPPORTED_LANGUAGES.map((lang) => {
                            const hasT = Boolean(titleTrans[lang.code]?.trim());
                            const hasD = Boolean(descTrans[lang.code]?.trim());
                            const isOk = hasT && hasD;

                            return (
                              <span
                                key={lang.code}
                                title={`${lang.fullName}: ${isOk ? "Completed" : "Missing"}`}
                                className={cn(
                                  "inline-flex size-6 items-center justify-center rounded-md text-[10px] font-bold uppercase transition-colors",
                                  isOk
                                    ? "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300"
                                    : "bg-slate-100 text-slate-400 opacity-60",
                                )}
                              >
                                {lang.code}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        /* Fallback Standard Quill Editor for non-section pages (like About Us) */
        <Card className="overflow-hidden rounded-2xl border-slate-200/80 shadow-xs">
          <CardHeader className="border-b border-slate-100 bg-linear-to-r from-emerald-50/40 to-transparent py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
                  <FileText className="size-4" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900">
                    {title || defaultLabel} Content
                  </CardTitle>
                  <p className="text-xs text-slate-500">
                    <LastUpdatedText updatedAt={page.updatedAt} />
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-xl text-xs font-semibold"
                onClick={() => {
                  setTitleDialogOpen(true);
                  setTempTitle(title);
                }}
              >
                <PencilLine className="mr-1.5 size-3.5" /> Edit Title
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="space-y-1.5">
              <FieldLabel className="text-xs font-semibold text-slate-800">
                Page Description
              </FieldLabel>
              <ReactQuill
                theme="snow"
                value={description}
                onChange={(val) => {
                  setDescription(val);
                }}
                className="rounded-xl bg-white [&_.ql-container]:rounded-b-xl [&_.ql-editor]:min-h-65 [&_.ql-toolbar]:rounded-t-xl"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Multilingual Section Add/Edit Dialog */}
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

      {/* Proper Alert Modal for Deleting Section */}
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

      {/* Edit Title Dialog */}
      <Dialog open={titleDialogOpen} onOpenChange={setTitleDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle>Edit Page Title</DialogTitle>
            <DialogDescription>
              Update the title displayed at the top of this content page.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <FieldLabel className="text-xs font-semibold">Title</FieldLabel>
              <Input
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                placeholder="Enter page title"
                className={inputClass}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => setTitleDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={async () => {
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
              >
                Apply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

const subscribeNoop = () => () => {};

function LastUpdatedText({ updatedAt }: { updatedAt: string }) {
  const formatted = useSyncExternalStore(
    subscribeNoop,
    () => formatDateTime(updatedAt),
    () => "",
  );
  return <>{`Last updated: ${formatted}`}</>;
}
