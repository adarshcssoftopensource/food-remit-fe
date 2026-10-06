"use client";

import { Check, Sparkles, Store } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DEFAULT_STORE_IMAGES,
  getDefaultStoreImageForBusinessType,
  type DefaultStoreImage,
} from "@/constants/default-store-images";
import { cn } from "@/lib/utils";

interface DefaultStoreImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedImageUrl?: string | null;
  businessType?: string | null;
  onSelectImage: (imageUrl: string, businessType?: string) => void;
}

export function DefaultStoreImageDialog({
  open,
  onOpenChange,
  selectedImageUrl,
  businessType,
  onSelectImage,
}: DefaultStoreImageDialogProps) {
  const [tempSelected, setTempSelected] = useState<string | null>(selectedImageUrl ?? null);

  const isOther = businessType === "Other";
  const recommended = isOther ? undefined : getDefaultStoreImageForBusinessType(businessType);

  function handleSelect(img: DefaultStoreImage) {
    setTempSelected(img.imageUrl);
    onSelectImage(img.imageUrl, img.businessType);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-full max-w-4xl overflow-hidden p-0 sm:rounded-2xl">
        <DialogHeader className="border-b border-slate-100 bg-linear-to-r from-emerald-50/50 via-white to-slate-50 p-6 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
              <Store className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900">
                Default Store Images Library
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Choose a representative storefront image for your store (
                {DEFAULT_STORE_IMAGES.length} business types available). Selecting an image also
                updates your Business Type.
              </DialogDescription>
            </div>
          </div>

          {recommended && (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-200/80 bg-emerald-50/70 px-3.5 py-2 text-xs text-emerald-900">
              <div className="flex items-center gap-1.5 font-medium">
                <Sparkles className="size-4 shrink-0 text-emerald-600" />
                <span>
                  Recommended for your Business Type ({businessType}):{" "}
                  <strong className="font-semibold text-emerald-950">{recommended.label}</strong>
                </span>
              </div>
              {selectedImageUrl !== recommended.imageUrl && (
                <button
                  type="button"
                  onClick={() => handleSelect(recommended)}
                  className="cursor-pointer font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-800"
                >
                  Use Recommended
                </button>
              )}
            </div>
          )}
        </DialogHeader>

        {/* Scrollable Grid of 9 Default Images */}
        <div className="max-h-[calc(90vh-190px)] overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DEFAULT_STORE_IMAGES.map((item) => {
              const isSelected = (selectedImageUrl || tempSelected) === item.imageUrl;
              const isRecommended = recommended?.id === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={cn(
                    "group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border transition-all duration-200",
                    "hover:-translate-y-0.5 hover:shadow-md",
                    isSelected
                      ? "border-emerald-600 bg-emerald-50/20 shadow-sm ring-2 ring-emerald-600/30"
                      : "border-slate-200 bg-white hover:border-emerald-300",
                  )}
                >
                  {/* Image container */}
                  <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={item.imageUrl}
                      alt={item.label}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      unoptimized
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Gradient Overlay for badges */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-black/20" />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 right-2.5 left-2.5 flex items-center justify-between gap-1.5">
                      {isRecommended ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/90 px-2 py-0.5 text-[11px] font-semibold text-white shadow-xs backdrop-blur-xs">
                          <Sparkles className="size-3" />
                          Recommended
                        </span>
                      ) : (
                        <span />
                      )}

                      {isSelected && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-700 px-2 py-0.5 text-[11px] font-semibold text-white shadow-xs">
                          <Check className="size-3 stroke-3" />
                          Selected
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="flex flex-1 flex-col justify-between p-3.5">
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700">
                          {item.label}
                        </h4>
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs">
                      <span
                        className={cn(
                          "font-semibold",
                          isSelected
                            ? "text-emerald-700"
                            : "text-slate-400 group-hover:text-emerald-600",
                        )}
                      >
                        {isSelected ? "Active Store Picture" : "Click to select"}
                      </span>
                      <div
                        className={cn(
                          "flex size-5 items-center justify-center rounded-full border transition-colors",
                          isSelected
                            ? "border-emerald-600 bg-emerald-600 text-white"
                            : "border-slate-300 bg-white group-hover:border-emerald-400",
                        )}
                      >
                        {isSelected && <Check className="size-3 stroke-3" />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <DialogFooter className="border-t border-slate-100 bg-slate-50/60 px-6 py-3 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl text-xs font-semibold"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
