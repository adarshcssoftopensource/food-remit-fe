"use client";

import { FilePenLine } from "lucide-react";
import { useState } from "react";

import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent } from "@/components/ui/card";

import { SectionEditor } from "./components/section-editor";
import { SectionNav } from "./components/section-nav";
import { useLandingCms } from "./hooks/use-landing-cms";
import type { LandingSectionKey } from "./types";

export function LandingPageCmsPage() {
  const [activeSection, setActiveSection] = useState<LandingSectionKey>("hero");
  const { content, isLoading, isError, isSaving, saveSection } = useLandingCms();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Landing Page"
        description="Edit vendor landing sections. Navbar and Become a Vendor Partner stay system-controlled."
      />

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-10 text-center text-sm text-slate-500 shadow-sm">
          Loading landing content…
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50/80 p-10 text-center text-sm font-medium text-red-600">
          Failed to load landing page content.
        </div>
      ) : null}

      {content ? (
        <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
          <SectionNav activeSection={activeSection} onSelect={setActiveSection} />

          <Card className="flex min-h-0 flex-col overflow-hidden rounded-2xl border-slate-200/80 bg-white/95 shadow-sm">
            <div className="from-primary/6 shrink-0 border-b border-slate-100 bg-linear-to-r via-transparent to-emerald-50/40 px-5 py-3.5">
              <div className="flex items-center gap-2.5">
                <div className="bg-primary/12 text-primary flex size-8 items-center justify-center rounded-lg">
                  <FilePenLine className="size-4" />
                </div>
                <p className="text-sm font-semibold text-slate-800">Section editor</p>
              </div>
            </div>
            <CardContent className="min-h-0 flex-1 p-5 sm:p-6">
              <SectionEditor
                key={activeSection}
                section={activeSection}
                initialData={content[activeSection]}
                isSaving={isSaving}
                onSave={(data, image) => saveSection(activeSection, data, image)}
              />
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
