"use client";

import * as React from "react";
import { AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { sanitizeText, validateRemarkQuality } from "@/lib/utils/text-sanitizer";

export interface SanitizedTextareaProps extends React.ComponentProps<"textarea"> {
  label?: React.ReactNode;
  subLabel?: React.ReactNode;
  required?: boolean;
  minChars?: number;
  maxChars?: number;
  minWords?: number;
  showCharCount?: boolean;
  showWordCount?: boolean;
  showHealthBadge?: boolean;
  autoSanitizeOnBlur?: boolean;
  error?: string;
  helperText?: React.ReactNode;
  onValidationChange?: (isValid: boolean, error?: string) => void;
}

export const SanitizedTextarea = React.forwardRef<HTMLTextAreaElement, SanitizedTextareaProps>(
  (
    {
      className,
      label,
      subLabel,
      required = false,
      maxChars = 600,
      showCharCount = true,
      showWordCount = false,
      showHealthBadge = true,
      autoSanitizeOnBlur = true,
      error: externalError,
      helperText,
      value,
      defaultValue,
      onChange,
      onBlur,
      onKeyDown,
      disabled,
      placeholder = "Type your professional remark or notes here...",
      id,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const [internalValue, setInternalValue] = React.useState<string>(
      (value as string) || (defaultValue as string) || "",
    );

    React.useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value as string);
      }
    }, [value]);

    const text = (value !== undefined ? (value as string) : internalValue) || "";
    const charCount = text.length;

    // Word count calculation
    const wordCount = React.useMemo(() => {
      return text.trim() ? text.trim().split(/\s+/).length : 0;
    }, [text]);

    // Live Quality Check
    const qualityStatus = React.useMemo(() => {
      if (!text.trim()) {
        return { isFilled: false, isValid: true, error: undefined };
      }
      const res = validateRemarkQuality(text);
      return {
        isFilled: true,
        isValid: res.isValid,
        error: res.error,
      };
    }, [text]);

    // Active error priority: external form error first, then live validator error
    const displayError =
      externalError || (qualityStatus.isFilled ? qualityStatus.error : undefined);
    const isPassing = qualityStatus.isFilled && qualityStatus.isValid && !externalError;

    // Character count severity styling
    const isNearLimit = charCount >= maxChars * 0.9;
    const isOverLimit = charCount > maxChars;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (value === undefined) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      if (autoSanitizeOnBlur && e.target.value) {
        const clean = sanitizeText(e.target.value);
        if (clean !== e.target.value) {
          e.target.value = clean;
          handleChange(e);
        }
      }
      onBlur?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Prevent leading empty space
      if (e.key === " " && e.currentTarget.value.length === 0) {
        e.preventDefault();
        return;
      }
      onKeyDown?.(e);
    };

    return (
      <div className="flex w-full flex-col gap-1.5">
        {/* Label Header */}
        {(label || subLabel) && (
          <div className="flex items-center justify-between text-sm font-bold text-slate-700 dark:text-slate-200">
            {label ? (
              <label htmlFor={inputId} className="flex cursor-pointer items-center gap-1">
                <span>{label}</span>
                {required && <span className="font-bold text-red-500">*</span>}
              </label>
            ) : (
              <span />
            )}
            {subLabel && <div className="text-xs font-semibold text-slate-500">{subLabel}</div>}
          </div>
        )}

        {/* Textarea Container */}
        <div className="group relative">
          <textarea
            ref={ref}
            id={inputId}
            value={value}
            defaultValue={defaultValue}
            disabled={disabled}
            placeholder={placeholder}
            maxLength={maxChars}
            aria-invalid={!!displayError}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={cn(
              "min-h-28 w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-sm font-medium text-slate-900 transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 hover:bg-slate-50 focus-visible:border-blue-600 focus-visible:bg-white focus-visible:shadow-[0_0_0_4px_rgba(37,99,235,0.08)] focus-visible:outline-none dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-700 dark:hover:bg-slate-900 dark:focus-visible:border-blue-500",
              displayError &&
                "border-rose-400 bg-rose-50/40 text-rose-950 hover:border-rose-400 hover:bg-rose-50/60 focus-visible:border-rose-500 focus-visible:shadow-[0_0_0_4px_rgba(244,63,94,0.12)] dark:border-rose-500/50 dark:bg-rose-950/20 dark:text-rose-200",
              isPassing &&
                "focus-visible:border-emerald-600 focus-visible:shadow-[0_0_0_4px_rgba(16,185,129,0.1)]",
              disabled && "cursor-not-allowed bg-slate-100 opacity-50 dark:bg-slate-800",
              className,
            )}
            {...props}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] leading-tight">
          <div className="flex min-w-50 flex-1 items-center gap-1.5">
            {displayError ? (
              <div className="animate-in fade-in flex items-center gap-1 font-semibold text-rose-600 duration-200 dark:text-rose-400">
                <AlertCircle className="size-3.5 shrink-0" />
                <span>{displayError}</span>
              </div>
            ) : isPassing ? (
              <div className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-3.5 shrink-0" />
                <span>Verified business remark</span>
              </div>
            ) : showHealthBadge ? (
              <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
                <ShieldCheck className="size-3.5 shrink-0 text-slate-400" />
                <span>Filtered for spam, gibberish & profanity</span>
              </div>
            ) : helperText ? (
              <div className="text-slate-400 dark:text-slate-500">{helperText}</div>
            ) : null}
          </div>

          {(showCharCount || showWordCount) && (
            <div
              className={cn(
                "flex items-center gap-1.5 font-medium text-slate-400 tabular-nums transition-colors dark:text-slate-500",
                isNearLimit && "font-semibold text-amber-500 dark:text-amber-400",
                isOverLimit && "font-bold text-rose-500 dark:text-rose-400",
              )}
            >
              {showWordCount && (
                <span>
                  {wordCount} {wordCount === 1 ? "word" : "words"} •
                </span>
              )}
              {showCharCount && (
                <span>
                  {charCount}/{maxChars}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
);

SanitizedTextarea.displayName = "SanitizedTextarea";
