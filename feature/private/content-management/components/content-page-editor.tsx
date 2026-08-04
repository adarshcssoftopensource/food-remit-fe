"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Save } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { PageHeader } from "@/components/common/page-header";
import { successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CONTENT_PAGES, type ContentPageKey } from "@/constants/content-management";
import { useState } from "react";
import { contentPageSchema, type ContentPageFormValues } from "../schema/content.schema";

type ContentPageEditorProps = {
  pageKey: ContentPageKey;
};

export function ContentPageEditor({ pageKey }: ContentPageEditorProps) {
  const seed = CONTENT_PAGES[pageKey];
  const [pageData, setPageData] = useState(seed);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ContentPageFormValues>({
    resolver: zodResolver(contentPageSchema),
    defaultValues: {
      title: seed.title,
      description: seed.description,
    },
    mode: "onChange",
  });

  const onSubmit = async (values: ContentPageFormValues) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const updated = {
        ...pageData,
        title: values.title.trim(),
        description: values.description.trim(),
        updatedAt: new Date().toISOString().slice(0, 19).replace("T", " "),
      };
      setPageData(updated);
      successToast({ title: `${pageData.label} updated successfully` });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Content Management"
        description={`Update the ${pageData.label} content shown across the platform.`}
      />

      <Card className="overflow-hidden rounded-2xl border border-slate-200/80 shadow-sm">
        <CardHeader className="border-b bg-linear-to-r from-slate-50 via-orange-50/60 to-amber-50/40 py-5">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-xl">
              <FileText className="size-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-900">{pageData.label}</CardTitle>
              <p className="text-muted-foreground mt-0.5 text-sm">
                Last updated: {pageData.updatedAt}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6 p-6">
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <div className="grid gap-2 sm:grid-cols-[140px_1fr] sm:items-center">
                    <FieldLabel className="text-sm font-semibold text-slate-700">
                      Title <span className="text-red-500">*</span>
                    </FieldLabel>
                    <div>
                      <Input
                        {...field}
                        className="h-11 rounded-xl border-slate-200 bg-slate-50/80"
                        placeholder="Enter title"
                      />
                      {errors.title ? (
                        <p className="mt-1 text-xs font-medium text-red-500">
                          {errors.title.message}
                        </p>
                      ) : null}
                    </div>
                  </div>
                )}
              />

              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <div className="grid gap-2 sm:grid-cols-[140px_1fr] sm:items-start">
                    <FieldLabel className="pt-2 text-sm font-semibold text-slate-700">
                      Description <span className="text-red-500">*</span>
                    </FieldLabel>
                    <div>
                      <Textarea
                        {...field}
                        rows={4}
                        className="resize-y rounded-xl border-slate-200 bg-slate-50/80 text-sm leading-relaxed"
                        placeholder="Enter description"
                      />
                      {errors.description ? (
                        <p className="mt-1 text-xs font-medium text-red-500">
                          {errors.description.message}
                        </p>
                      ) : null}
                    </div>
                  </div>
                )}
              />
            </div>

            <div className="flex justify-start border-t bg-slate-50/80 px-6 py-4">
              <Button
                type="submit"
                isLoading={isSubmitting}
                className="h-11 min-w-32 rounded-xl px-8 font-semibold"
              >
                <Save className="mr-2 size-4" />
                Update
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
