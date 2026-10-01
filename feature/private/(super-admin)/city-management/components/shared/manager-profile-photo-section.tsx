"use client";

import { UserRound } from "lucide-react";
import { Controller, useFormContext, type FieldErrors } from "react-hook-form";

import { ImageUpload } from "@/components/common/image-upload";
import { FormFieldError } from "./form-field-error";
import { type ManagerFormBaseValues } from "./manager-form.types";
import { SectionShell } from "./section-shell";

type ManagerProfilePhotoSectionProps = {
  subtitle: string;
  previewImageUrl?: string;
  errors: FieldErrors<ManagerFormBaseValues>;
};

export function ManagerProfilePhotoSection({
  subtitle,
  previewImageUrl,
  errors,
}: ManagerProfilePhotoSectionProps) {
  const { control } = useFormContext<ManagerFormBaseValues>();

  return (
    <SectionShell
      icon={UserRound}
      title="Profile Photo"
      subtitle={subtitle}
      accent="bg-primary/10 text-primary"
    >
      <Controller
        name="image"
        control={control}
        render={({ field }) => (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="min-w-0 flex-1">
              <ImageUpload
                value={field.value}
                onChange={field.onChange}
                multiple={false}
                maxFiles={1}
                label={"Upload manager photo"}
                hint="PNG, JPG or WEBP"
                initialImages={previewImageUrl ? [previewImageUrl] : []}
              />
              <FormFieldError message={errors.image?.message as string | undefined} />
            </div>
          </div>
        )}
      />
    </SectionShell>
  );
}
