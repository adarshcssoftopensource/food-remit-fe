"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { FileText, PencilLine } from "lucide-react";
import "react-quill-new/dist/quill.snow.css";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldLabel } from "@/components/ui/field";
import { formatDateTime } from "@/lib/date";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const subscribeNoop = () => () => {};

export function LastUpdatedText({ updatedAt }: { updatedAt?: string }) {
  const formatted = useSyncExternalStore(
    subscribeNoop,
    () => (updatedAt ? formatDateTime(updatedAt) : ""),
    () => "",
  );
  return formatted ? <>{`Last updated: ${formatted}`}</> : null;
}

interface SinglePageContentCardProps {
  title: string;
  defaultLabel: string;
  description: string;
  updatedAt?: string;
  onDescriptionChange: (val: string) => void;
  onOpenEditTitle: () => void;
}

export function SinglePageContentCard({
  title,
  defaultLabel,
  description,
  updatedAt,
  onDescriptionChange,
  onOpenEditTitle,
}: SinglePageContentCardProps) {
  return (
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
                <LastUpdatedText updatedAt={updatedAt} />
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-xl text-xs font-semibold"
            onClick={onOpenEditTitle}
          >
            <PencilLine className="mr-1.5 size-3.5" /> Edit Title
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <div className="space-y-1.5">
          <FieldLabel className="text-xs font-semibold text-slate-800">Page Description</FieldLabel>
          <ReactQuill
            theme="snow"
            value={description}
            onChange={onDescriptionChange}
            className="rounded-xl bg-white [&_.ql-container]:rounded-b-xl [&_.ql-editor]:min-h-65 [&_.ql-toolbar]:rounded-t-xl"
          />
        </div>
      </CardContent>
    </Card>
  );
}
