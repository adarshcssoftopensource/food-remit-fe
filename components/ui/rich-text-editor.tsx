"use client";

import dynamic from "next/dynamic";
import * as React from "react";
import "react-quill-new/dist/quill.snow.css";
import { cn } from "@/lib/utils";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="h-14 w-full animate-pulse rounded-xl border border-slate-200 bg-slate-50/70" />
  ),
});

export type RichTextEditorPreset = "minimal" | "compact" | "standard" | "full";

export type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  hasError?: boolean;
  minHeight?: "50px" | "60px" | "100px" | "140px" | "180px" | "220px";
  preset?: RichTextEditorPreset;
};

const MINIMAL_TOOLBAR = [["bold", "italic", "underline"], ["clean"]];

const COMPACT_TOOLBAR = [
  ["bold", "italic", "underline"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link", "clean"],
];

const STANDARD_TOOLBAR = [
  [{ header: [2, 3, false] }],
  ["bold", "italic", "underline"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link", "clean"],
];

const FULL_TOOLBAR = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["blockquote", "link", "clean"],
];

/**
 * Strips HTML tags, decodes entities and returns clean plain text.
 */
export function getPlainText(html?: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Returns plain text character count from an HTML string.
 */
export function getHtmlTextLength(html?: string): number {
  return getPlainText(html).length;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write content here...",
  className,
  hasError = false,
  minHeight = "140px",
  preset = "standard",
}: RichTextEditorProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const modules = React.useMemo(() => {
    const toolbar =
      preset === "minimal"
        ? MINIMAL_TOOLBAR
        : preset === "compact"
          ? COMPACT_TOOLBAR
          : preset === "full"
            ? FULL_TOOLBAR
            : STANDARD_TOOLBAR;
    return { toolbar };
  }, [preset]);

  // Clean up duplicate toolbars that Quill may attach during re-renders
  React.useEffect(() => {
    if (containerRef.current) {
      const toolbars = containerRef.current.querySelectorAll(".ql-toolbar");
      if (toolbars.length > 1) {
        for (let i = 1; i < toolbars.length; i++) {
          toolbars[i]?.remove();
        }
      }
    }
  });

  const minHeightClass =
    minHeight === "50px"
      ? "[&_.ql-editor]:min-h-[50px] [&_.ql-editor]:py-1.5"
      : minHeight === "60px"
        ? "[&_.ql-editor]:min-h-[60px] [&_.ql-editor]:py-2"
        : minHeight === "100px"
          ? "[&_.ql-editor]:min-h-[100px]"
          : minHeight === "180px"
            ? "[&_.ql-editor]:min-h-[180px]"
            : minHeight === "220px"
              ? "[&_.ql-editor]:min-h-[220px]"
              : "[&_.ql-editor]:min-h-[140px]";

  const handleQuillChange = (content: string) => {
    // Suppress spurious onChange on initial mount when value is empty and Quill produces empty paragraph
    if (!value && getPlainText(content) === "") {
      return;
    }
    onChange(content);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "rich-text-editor overflow-hidden rounded-xl border bg-white transition-all",
        hasError
          ? "border-red-400 ring-2 ring-red-100"
          : "border-slate-200/90 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/20 hover:border-slate-300",
        "[&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-none [&_.ql-toolbar]:border-slate-100 [&_.ql-toolbar]:bg-slate-50/70 [&_.ql-toolbar]:px-2.5 [&_.ql-toolbar]:py-1.5",
        "[&_.ql-container]:border-none [&_.ql-container]:font-sans [&_.ql-container]:text-sm",
        "[&_.ql-editor]:px-3 [&_.ql-editor]:py-2 [&_.ql-editor]:leading-relaxed [&_.ql-editor]:text-slate-800",
        "[&_.ql-editor.ql-blank::before]:left-3 [&_.ql-editor.ql-blank::before]:font-normal [&_.ql-editor.ql-blank::before]:text-slate-400 [&_.ql-editor.ql-blank::before]:not-italic",
        minHeightClass,
        className,
      )}
    >
      <ReactQuill
        theme="snow"
        value={value}
        onChange={handleQuillChange}
        modules={modules}
        placeholder={placeholder}
      />
    </div>
  );
}
