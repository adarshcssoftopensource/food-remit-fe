"use client";

import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";

import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const inputClass =
  "h-12 rounded-xl border-gray-200/80 bg-gray-50/50 text-sm transition-colors placeholder:text-gray-400/80 hover:border-gray-300 hover:bg-gray-50 focus-visible:border-primary focus-visible:bg-white focus-visible:ring-primary/20";

const textareaClass =
  "rounded-xl border-gray-200/80 bg-gray-50/50 text-sm transition-colors placeholder:text-gray-400/80 hover:border-gray-300 hover:bg-gray-50 focus-visible:border-primary focus-visible:bg-white focus-visible:ring-primary/20";

type FieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  error?: string;
  multiline?: boolean;
  rows?: number;
  inputRef?: (el: HTMLInputElement | HTMLTextAreaElement | null) => void;
};

export function FormTextField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  error,
  multiline,
  rows = 3,
  inputRef,
}: FieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error: fieldError } }) => {
        const errorMessage = error || (fieldError?.message as string | undefined);
        return (
          <div className="flex flex-col gap-1.5">
            <FieldLabel className="text-sm font-semibold text-slate-700">
              {label} <span className="text-red-500">*</span>
            </FieldLabel>
            {multiline ? (
              <Textarea
                {...field}
                value={field.value ?? ""}
                rows={rows}
                placeholder={placeholder}
                aria-invalid={!!errorMessage}
                className={cn(textareaClass, errorMessage && "border-red-400 bg-red-50")}
                ref={inputRef as any}
              />
            ) : (
              <Input
                {...field}
                value={field.value ?? ""}
                placeholder={placeholder}
                aria-invalid={!!errorMessage}
                className={cn(inputClass, errorMessage && "border-red-400 bg-red-50")}
                ref={inputRef as any}
              />
            )}
            {errorMessage ? (
              <p className="text-xs font-medium text-red-500">{errorMessage}</p>
            ) : null}
          </div>
        );
      }}
    />
  );
}
