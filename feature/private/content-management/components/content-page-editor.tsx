"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, PencilLine, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

import { PageHeader } from "@/components/common/page-header";
import { successToast } from "@/components/toaster";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useGetContentPage } from "../hooks/use-get-content-page";
import { useUpdateContentPage } from "../hooks/use-update-content-page";
import { contentPageSchema, type ContentPageFormValues } from "../schema/content.schema";
import { CONTENT_PAGE_LABELS, type ContentPageKey } from "../types";
import { ContentPageSkeleton } from "./content-page-skeleton";

type ContentPageEditorProps = {
  pageKey: ContentPageKey;
};

const inputClass =
  "h-12 rounded-xl border-gray-200/80 bg-gray-50/50 text-sm transition-colors hover:border-gray-300 hover:bg-gray-50 focus-visible:border-primary focus-visible:bg-white focus-visible:ring-primary/20";

export function ContentPageEditor({ pageKey }: ContentPageEditorProps) {
  const label = CONTENT_PAGE_LABELS[pageKey];
  const { data, isLoading, isError } = useGetContentPage(pageKey);
  const updateMutation = useUpdateContentPage(pageKey);
  const [editOpen, setEditOpen] = useState(false);

  const page = data?.data;

  return (
    <div className="space-y-6">
      <PageHeader
        title={label}
        description={`Manage ${label.toLowerCase()} content shown across the platform.`}
        action={
          <Button
            type="button"
            className="h-11 rounded-xl font-semibold"
            disabled={!page || isLoading}
            onClick={() => setEditOpen(true)}
          >
            <PencilLine className="mr-2 size-4" />
            {page?.title || page?.description ? `Edit ${label}` : `Add ${label}`}
          </Button>
        }
      />

      {isLoading && <ContentPageSkeleton />}

      {isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-sm font-medium text-red-600">
          Failed to load {label}.
        </div>
      ) : null}

      {page ? (
        <Card className="overflow-hidden rounded-2xl border-slate-200/80 pt-0 shadow-sm">
          <CardHeader className="from-primary/8 border-b bg-linear-to-r via-emerald-50/40 to-transparent py-5">
            <div className="flex items-center gap-3">
              <div className="bg-primary/15 text-primary flex size-11 items-center justify-center rounded-xl">
                <FileText className="size-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">
                  {page.title || label}
                </CardTitle>
                <p className="text-muted-foreground mt-0.5 text-sm">
                  {page.title || page.description
                    ? `Last updated: ${new Date(page.updatedAt).toLocaleString()}`
                    : "No content yet - add it from the button above."}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[min(52vh,520px)]">
              <div className="space-y-4 p-6">
                {page.title || page.description ? (
                  <>
                    <div>
                      <p className="text-xs font-bold tracking-wide text-slate-400 uppercase">
                        Title
                      </p>
                      <p className="mt-1 text-base font-semibold text-slate-900">
                        {page.title || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold tracking-wide text-slate-400 uppercase">
                        Description
                      </p>
                      <div className="mt-2 overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] transition-colors hover:bg-slate-50 dark:border-slate-800/80 dark:bg-slate-900/40">
                        <ReactQuill
                          value={page.description || ""}
                          readOnly={true}
                          theme="snow"
                          modules={{ toolbar: false }}
                          className="[&_.ql-container]:bg-transparent [&_.ql-container.ql-snow]:border-0! [&_.ql-editor]:p-0!"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="py-10 text-center text-sm text-slate-500">
                    Nothing added yet. Click &quot;Add {label}&quot; to create content.
                  </p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      ) : null}

      <EditContentPageDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        label={label}
        defaultValues={{
          title: page?.title ?? "",
          description: page?.description ?? "",
        }}
        isSubmitting={updateMutation.isPending}
        onSubmit={async (values) => {
          await updateMutation.mutateAsync(values);
          successToast({ title: `${label} updated successfully` });
          setEditOpen(false);
        }}
      />
    </div>
  );
}

type EditDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  label: string;
  defaultValues: ContentPageFormValues;
  isSubmitting: boolean;
  onSubmit: (values: ContentPageFormValues) => Promise<void>;
};

function EditContentPageDialog({
  open,
  onOpenChange,
  label,
  defaultValues,
  isSubmitting,
  onSubmit,
}: EditDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContentPageFormValues>({
    resolver: zodResolver(contentPageSchema),
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    if (open) reset(defaultValues);
  }, [open, defaultValues, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 overflow-hidden border-0 p-0 shadow-2xl sm:max-h-[90vh]">
        <div className="max-h-[90vh] overflow-y-auto overscroll-contain">
          <DialogHeader className="from-primary/10 border-b bg-linear-to-r via-emerald-50/60 to-transparent p-6 pb-5">
            <DialogTitle className="flex items-center justify-center gap-3 text-2xl font-bold text-slate-900">
              <div className="bg-primary/15 text-primary flex size-12 items-center justify-center rounded-2xl shadow-sm">
                <PencilLine className="size-5" />
              </div>
              <span>Edit {label}</span>
            </DialogTitle>
            <DialogDescription className="mt-2 text-center text-sm text-slate-500">
              Update title and description. Changes save to the database.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="bg-white">
            <div className="space-y-5 p-6">
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-1.5">
                    <FieldLabel className="text-sm font-semibold">
                      Title <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      className={cn(inputClass, errors.title && "border-red-400 bg-red-50")}
                      placeholder="Enter title"
                    />
                    {errors.title ? (
                      <p className="text-xs font-medium text-red-500">{errors.title.message}</p>
                    ) : null}
                  </div>
                )}
              />
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-1.5">
                    <FieldLabel className="text-sm font-semibold">
                      Description <span className="text-red-500">*</span>
                    </FieldLabel>
                    <ReactQuill
                      theme="snow"
                      value={field.value}
                      onChange={field.onChange}
                      className={cn(
                        "rounded-xl bg-white [&_.ql-container]:rounded-b-xl [&_.ql-editor]:min-h-50 [&_.ql-toolbar]:rounded-t-xl",
                        errors.description &&
                          "[&_.ql-container]:border-red-400 [&_.ql-toolbar]:border-red-400",
                      )}
                      modules={{
                        toolbar: [
                          [{ header: [1, 2, 3, false] }],
                          ["bold", "italic", "underline", "strike", "blockquote"],
                          [
                            { list: "ordered" },
                            { list: "bullet" },
                            { indent: "-1" },
                            { indent: "+1" },
                          ],
                          ["link", "clean"],
                        ],
                      }}
                    />
                    {errors.description ? (
                      <p className="text-xs font-medium text-red-500">
                        {errors.description.message}
                      </p>
                    ) : null}
                  </div>
                )}
              />
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50/80 px-6 py-4">
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
                className="h-11 min-w-32 rounded-xl font-semibold"
              >
                <Save className="mr-2 size-4" />
                Update
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
