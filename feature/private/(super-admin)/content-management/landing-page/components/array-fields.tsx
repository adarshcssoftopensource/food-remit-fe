"use client";

import { Plus, Trash2 } from "lucide-react";
import { useRef } from "react";
import { useFieldArray, useWatch, type Control, type UseFormSetValue } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FormTextField } from "./form-text-field";

type ObjectArrayFieldsProps = {
  control: Control<any>;
  name: string;
  title: string;
  emptyItem: Record<string, string>;
  fields: { key: string; label: string; multiline?: boolean }[];
  error?: string;
};

export function ObjectArrayFields({
  control,
  name,
  title,
  emptyItem,
  fields,
  error,
}: ObjectArrayFieldsProps) {
  const { fields: rows, append, remove } = useFieldArray({ control, name: name as never });
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleAdd = () => {
    append(emptyItem as never);
    setTimeout(() => {
      const newIndex = rows.length;
      const newRow = rowRefs.current[newIndex];
      if (newRow) {
        newRow.scrollIntoView({ behavior: "smooth", block: "center" });
        const firstInput = newRow.querySelector("input, textarea") as
          HTMLInputElement | HTMLTextAreaElement | null;
        if (firstInput) {
          firstInput.focus();
        }
      }
    }, 100);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700">{title}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-primary/30 text-primary hover:bg-primary/10 h-9 rounded-xl"
          onClick={handleAdd}
        >
          <Plus className="mr-1.5 size-4" />
          Add
        </Button>
      </div>
      {error ? <p className="text-xs font-medium text-red-500">{error}</p> : null}
      {rows.map((row, index) => (
        <div
          key={row.id}
          ref={(el) => {
            rowRefs.current[index] = el;
          }}
          className="space-y-3 rounded-2xl border border-slate-200/80 bg-slate-50/40 p-4"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold tracking-wide text-slate-500 uppercase">
              {title} {index + 1}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 rounded-lg text-slate-400 hover:text-red-500"
              onClick={() => remove(index)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
          {fields.map((field) => (
            <FormTextField
              key={field.key}
              control={control}
              name={`${name}.${index}.${field.key}` as never}
              label={field.label}
              multiline={field.multiline}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

type StringArrayFieldsProps = {
  control: Control<any>;
  // kept for API compatibility — internally we use useFieldArray now
  setValue?: UseFormSetValue<any>;
  name: string;
  title: string;
  placeholder?: string;
  error?: string;
};

export function StringArrayFields({
  control,
  name,
  title,
  placeholder = "Enter item",
  error,
}: StringArrayFieldsProps) {
  // Use useFieldArray so RHF properly tracks dirty state on append/remove.
  // Strings are registered as { value: string } objects and unwrapped for display.
  const { fields, append, remove } = useFieldArray({ control, name: name as never });
  const rowRefs = useRef<(HTMLInputElement | HTMLTextAreaElement | null)[]>([]);

  const handleAdd = () => {
    append({ value: "" } as never);
    setTimeout(() => {
      const newIndex = fields.length;
      const newInput = rowRefs.current[newIndex];
      if (newInput) {
        newInput.scrollIntoView({ behavior: "smooth", block: "center" });
        newInput.focus();
      }
    }, 100);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <FieldLabel className="text-sm font-semibold text-slate-700">{title}</FieldLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-primary/30 text-primary hover:bg-primary/10 h-9 rounded-xl"
          onClick={handleAdd}
        >
          <Plus className="mr-1.5 size-4" />
          Add
        </Button>
      </div>
      {error ? <p className="text-xs font-medium text-red-500">{error}</p> : null}
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2">
          <div className="flex-1">
            <FormTextField
              control={control}
              name={`${name}.${index}.value` as never}
              label={`${title} ${index + 1}`}
              placeholder={placeholder}
              inputRef={(el: HTMLInputElement | HTMLTextAreaElement | null) => {
                rowRefs.current[index] = el;
              }}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="mt-7 size-12 shrink-0 rounded-xl"
            onClick={() => remove(index)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
      {fields.length === 0 ? (
        <Input
          disabled
          placeholder={placeholder}
          className={cn("h-12 rounded-xl border-dashed bg-slate-50")}
        />
      ) : null}
    </div>
  );
}
