"use client";

import { Check, ImagePlus, Sparkles, Store, Upload, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { errorToast } from "@/components/toaster";
import { FieldLabel } from "@/components/ui/field";
import {
  DEFAULT_STORE_IMAGES,
  getDefaultStoreImageForBusinessType,
  type DefaultStoreImage,
} from "@/constants/default-store-images";
import { cn } from "@/lib/utils";
import type { PartnerLeadFormState } from "../../hooks/use-partner-lead-form";
import { getFilePreviewUrl } from "../../utils/file-preview-url";
import { DefaultStoreImageDialog } from "./default-store-image-dialog";

type StoreImageFieldProps = Pick<PartnerLeadFormState, "control" | "watch" | "setValue">;

export function StoreImageField({ control, watch, setValue }: StoreImageFieldProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const businessType = watch("businessType");
  const isOther = businessType === "Other";

  const recommendedImage = isOther ? undefined : getDefaultStoreImageForBusinessType(businessType);

  return (
    <Controller
      name="storeLogo"
      control={control}
      render={({ field }) => {
        const logoFile = field.value instanceof File ? field.value : null;
        const isCustomFile = !!logoFile;

        // Effective display URL
        let activeUrl: string | null = null;
        let activeDefaultItem: DefaultStoreImage | undefined;

        if (isCustomFile) {
          activeUrl = getFilePreviewUrl(logoFile);
        } else if (
          typeof field.value === "string" &&
          field.value.trim() &&
          field.value !== "/default-store.svg" &&
          !isOther
        ) {
          activeUrl = field.value.trim();
          activeDefaultItem = DEFAULT_STORE_IMAGES.find((img) => img.imageUrl === activeUrl);
        } else if (recommendedImage) {
          activeUrl = recommendedImage.imageUrl;
          activeDefaultItem = recommendedImage;
        } else {
          // In "Other" or initial state, use the generic default store image
          activeUrl = "/default-store.svg";
        }

        const isMatchingRecommended =
          recommendedImage && activeDefaultItem?.id === recommendedImage.id;

        function handleFileSelect(file: File) {
          if (file.size > 5 * 1024 * 1024) {
            errorToast({
              title: "Image Too Large",
              description: "Image size must be less than 5MB",
            });
            return;
          }
          field.onChange(file);
        }

        function handleSelectDefault(imageUrl: string, newBusinessType?: string) {
          field.onChange(imageUrl);
          const targetType =
            newBusinessType ||
            DEFAULT_STORE_IMAGES.find((img) => img.imageUrl === imageUrl)?.businessType;
          if (targetType) {
            setValue("businessType", targetType, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }
        }

        function handleResetToRecommended() {
          if (isOther) {
            field.onChange("/default-store.svg");
          } else if (recommendedImage) {
            field.onChange(recommendedImage.imageUrl);
          } else {
            field.onChange("/default-store.svg");
          }
        }

        return (
          <div className="flex flex-col gap-2 xl:col-span-2">
            <div className="flex items-center justify-between">
              <FieldLabel className="block text-xs font-semibold text-slate-700">
                Store Image &amp; Logo{" "}
                <span className="font-normal text-slate-400">
                  (Custom logo or selectable from 9 default store images)
                </span>
              </FieldLabel>
              {recommendedImage && !isCustomFile && !isMatchingRecommended && (
                <button
                  type="button"
                  onClick={handleResetToRecommended}
                  className="cursor-pointer text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                >
                  Reset to Recommended ({recommendedImage.label})
                </button>
              )}
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 transition-all duration-200 hover:border-emerald-500/40 sm:p-5">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                {/* Active Image Preview Box */}
                <div
                  onClick={() => setDialogOpen(true)}
                  className="group relative flex size-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-xs transition-all duration-200 hover:border-emerald-500 hover:shadow-md sm:size-28"
                  title="Click to browse default store images"
                >
                  <Image
                    src={activeUrl || "/default-store.svg"}
                    alt="Active Store Image"
                    fill
                    sizes="112px"
                    unoptimized
                    className={cn(
                      "transition-transform duration-300 group-hover:scale-105",
                      isCustomFile || activeUrl === "/default-store.svg"
                        ? "object-contain p-2"
                        : "object-cover",
                    )}
                  />
                  <div className="backdrop-blur-2xs absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-slate-800 shadow-xs">
                      Change
                    </span>
                  </div>
                </div>

                {/* Info & Status Badges */}
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {isCustomFile ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                        <Check className="size-3.5 stroke-3 text-emerald-600" />
                        Custom Logo Uploaded
                      </span>
                    ) : isOther || !activeDefaultItem ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs">
                        <Store className="size-3.5 text-emerald-600" />
                        Default Store Picture
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs">
                        <Store className="size-3.5 text-emerald-600" />
                        Default Image: {activeDefaultItem.label}
                      </span>
                    )}

                    {isMatchingRecommended && !isCustomFile && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/80 bg-emerald-100/70 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                        <Sparkles className="size-3 text-emerald-600" />
                        Recommended for {businessType}
                      </span>
                    )}

                    {logoFile && (
                      <span className="max-w-55 truncate text-xs text-slate-500">
                        {logoFile.name} ({(logoFile.size / 1024).toFixed(0)} KB)
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500">
                    {isCustomFile
                      ? "Custom store logo will be displayed on your store profile and customer storefront."
                      : isOther
                        ? "Using generic default store picture for Other business type. You can also pick a specific storefront image below or upload your custom logo."
                        : "Representative storefront image for your business. Selecting an image also automatically updates your Business Type above."}
                  </p>

                  {/* Actions Row */}
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    {/* Browse 9 Defaults Dialog Trigger */}
                    <button
                      type="button"
                      onClick={() => setDialogOpen(true)}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-emerald-600/30 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 shadow-2xs transition hover:bg-emerald-100 hover:text-emerald-950"
                    >
                      <ImagePlus className="size-3.5 text-emerald-600" />
                      <span>Browse 9 Default Images</span>
                    </button>

                    {/* Custom Logo Upload Input */}
                    <label
                      htmlFor="vendorStoreLogoInput"
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:text-emerald-700"
                    >
                      <Upload className="size-3.5 text-emerald-600" />
                      <span>{isCustomFile ? "Change Custom Logo" : "Upload Custom Logo"}</span>
                    </label>
                    <input
                      id="vendorStoreLogoInput"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(file);
                        e.target.value = "";
                      }}
                    />

                    {/* Reset/Remove Custom Upload button */}
                    {isCustomFile && (
                      <button
                        type="button"
                        onClick={handleResetToRecommended}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        <X className="size-3.5" />
                        <span>Use Default Image</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick-switch default images strip */}
              <div className="border-t border-slate-200/60 pt-3">
                <div className="flex items-center justify-between pb-2">
                  <span className="text-[11px] font-semibold text-slate-600">
                    Quick Select Default Store Image (Auto-syncs Business Type):
                  </span>
                  <button
                    type="button"
                    onClick={() => setDialogOpen(true)}
                    className="cursor-pointer text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                  >
                    View All (9) in Gallery &rarr;
                  </button>
                </div>

                <div className="flex gap-2 overflow-x-auto pt-0.5 pb-1.5">
                  {DEFAULT_STORE_IMAGES.map((img) => {
                    const isSelected = !isCustomFile && activeUrl === img.imageUrl;
                    const isRec = recommendedImage?.id === img.id;

                    return (
                      <button
                        key={img.id}
                        type="button"
                        onClick={() => handleSelectDefault(img.imageUrl, img.businessType)}
                        className={cn(
                          "group relative flex shrink-0 cursor-pointer items-center gap-2 rounded-xl border px-2.5 py-1.5 text-left transition-all",
                          isSelected
                            ? "border-emerald-600 bg-white shadow-xs ring-2 ring-emerald-600/30"
                            : "border-slate-200 bg-white/80 hover:border-emerald-300 hover:bg-white",
                        )}
                        title={img.label}
                      >
                        <div className="relative size-7 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                          <Image
                            src={img.imageUrl}
                            alt={img.label}
                            fill
                            sizes="28px"
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span
                            className={cn(
                              "text-xs leading-tight font-semibold whitespace-nowrap",
                              isSelected
                                ? "text-emerald-800"
                                : "text-slate-700 group-hover:text-emerald-700",
                            )}
                          >
                            {img.label}
                          </span>
                          {isRec && (
                            <span className="text-[9px] font-medium text-emerald-600">
                              Recommended
                            </span>
                          )}
                        </div>
                        {isSelected && (
                          <div className="flex size-4 items-center justify-center rounded-full bg-emerald-600 text-white">
                            <Check className="size-2.5 stroke-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Dialog for the full 9 images */}
            <DefaultStoreImageDialog
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              selectedImageUrl={!isCustomFile ? activeUrl : null}
              businessType={businessType}
              onSelectImage={handleSelectDefault}
            />
          </div>
        );
      }}
    />
  );
}
