"use client";

import { Plus, Trash2 } from "lucide-react";
import { useRef } from "react";
import { useFieldArray } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormTextField } from "../form-text-field";
import { fieldError } from "./field-utils";
import { ImageUpload } from "@/components/common/image-upload";

type FieldsProps = {
  control: any;
  errors: any;
  setValue: any;
};

export function TestimonialsFields({ control, errors, setValue }: FieldsProps) {
  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleAdd = () => {
    append({ quote: "", name: "", role: "", image: "" });
  };

  return (
    <div className="space-y-6">
      <FormTextField
        control={control}
        name="title"
        label="Title"
        error={fieldError(errors, "title")}
      />
      <FormTextField
        control={control}
        name="subtitle"
        label="Subtitle"
        multiline
        error={fieldError(errors, "subtitle")}
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-700">Testimonials</p>
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

        {fieldError(errors, "items") ? (
          <p className="text-xs font-medium text-red-500">{fieldError(errors, "items")}</p>
        ) : null}

        {fields.map((row: any, index) => (
          <div
            key={row.id}
            ref={(el) => {
              rowRefs.current[index] = el;
            }}
            className="space-y-4 rounded-2xl border border-slate-200/80 bg-slate-50/40 p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold tracking-wide text-slate-500 uppercase">
                Testimonial {index + 1}
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

            <FormTextField
              control={control}
              name={`items.${index}.quote`}
              label="Quote"
              multiline
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormTextField control={control} name={`items.${index}.name`} label="Name" />
              <FormTextField control={control} name={`items.${index}.role`} label="Role" />
            </div>

            <div className="pt-2">
              <p className="mb-2 text-sm font-medium text-slate-700">Profile Image</p>
              <ImageUpload
                maxFiles={1}
                initialImages={row.image ? [row.image] : []}
                onAllImagesChange={(images) => {
                  if (images.length > 0) {
                    if (images[0].file) {
                      setValue(`items.${index}.imageFile`, images[0].file, { shouldDirty: true });
                    }
                  } else {
                    setValue(`items.${index}.imageFile`, null, { shouldDirty: true });
                    setValue(`items.${index}.image`, "", { shouldDirty: true });
                  }
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
