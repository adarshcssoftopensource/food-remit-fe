"use client";

import { Control, Controller, FieldErrors } from "react-hook-form";
import Image from "next/image";

import { FieldLabel } from "@/components/ui/field";
import { ImageUpload } from "@/components/common/image-upload";
import { Button } from "@/components/ui/button";
import { getDefaultStoreImageForBusinessType } from "@/constants/default-store-images";
import type { StoreInfoValues } from "../../schema/store-info.schema";

export interface StoreFieldsProps {
  control: Control<StoreInfoValues>;
  errors: FieldErrors<StoreInfoValues>;
}

export interface StoreImageFieldProps extends StoreFieldsProps {
  needsBankVerification: boolean;
  isEmployee: boolean;
  businessType?: string | null;
}

export function StoreImageField({
  control,
  errors,
  needsBankVerification,
  isEmployee,
  businessType,
}: StoreImageFieldProps) {
  const defaultImageInfo =
    businessType && businessType !== "Other"
      ? getDefaultStoreImageForBusinessType(businessType)
      : undefined;

  const defaultImageUrl = defaultImageInfo?.imageUrl || "/default-store.svg";
  const defaultLabel = defaultImageInfo?.label || "Default Store";

  return (
    <Controller
      name="storeImage"
      control={control}
      render={({ field }) => {
        const hasNoImage = !field.value || (Array.isArray(field.value) && field.value.length === 0);

        return (
          <div className="flex flex-col gap-2">
            <FieldLabel className="text-sm font-semibold">
              Store Image <span className="text-red-500">*</span>
            </FieldLabel>
            <ImageUpload
              value={field.value && typeof field.value !== "string" ? [field.value as File] : []}
              onChange={(files) => field.onChange(files[0] || null)}
              onAllImagesChange={(all) => {
                if (all.length === 0) field.onChange(null);
              }}
              initialImages={typeof field.value === "string" && field.value ? [field.value] : []}
              maxFiles={1}
              multiple={false}
              label="Upload store image"
              hint="PNG, JPG or WEBP"
              accept="image/jpeg,image/png,image/webp"
              disabled={needsBankVerification || isEmployee}
            />

            {hasNoImage && (
              <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-slate-50/80 p-2.5 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
                <div className="flex items-center gap-2.5">
                  <Image
                    src={defaultImageUrl}
                    alt={defaultLabel}
                    height={20}
                    width={20}
                    className="size-9 shrink-0 rounded-lg border border-slate-200 object-cover dark:border-slate-700"
                  />
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      Default {defaultLabel} Image
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Will be saved automatically if no custom image is uploaded.
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => field.onChange(defaultImageUrl)}
                  disabled={needsBankVerification || isEmployee}
                  className="h-8 shrink-0 rounded-lg text-xs font-semibold"
                >
                  Use Default
                </Button>
              </div>
            )}

            {errors.storeImage && (
              <p className="text-xs font-medium text-red-500">
                {errors.storeImage.message as string}
              </p>
            )}
            {isEmployee && (
              <p className="text-[11px] text-slate-400">
                Only store managers can update the store image.
              </p>
            )}
          </div>
        );
      }}
    />
  );
}
