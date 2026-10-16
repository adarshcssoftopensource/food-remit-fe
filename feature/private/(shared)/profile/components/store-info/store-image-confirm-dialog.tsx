"use client";

import Image from "next/image";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getDefaultStoreImageForBusinessType } from "@/constants/default-store-images";

interface StoreImageConfirmDialogProps {
  open: boolean;
  pendingBusinessType: string | null;
  currentStoreImage: any;
  onOpenChange: (open: boolean) => void;
  onConfirmUseRecommended: () => void;
  onConfirmKeepExisting: () => void;
}

export function StoreImageConfirmDialog({
  open,
  pendingBusinessType,
  currentStoreImage,
  onOpenChange,
  onConfirmUseRecommended,
  onConfirmKeepExisting,
}: StoreImageConfirmDialogProps) {
  const isOther = pendingBusinessType === "Other";
  const recommended = isOther
    ? { imageUrl: "/default-store.svg", label: "Default Store Placeholder" }
    : pendingBusinessType
      ? getDefaultStoreImageForBusinessType(pendingBusinessType)
      : null;

  const currentDisplayUrl =
    typeof currentStoreImage === "string" && currentStoreImage.trim()
      ? currentStoreImage
      : currentStoreImage instanceof File
        ? URL.createObjectURL(currentStoreImage)
        : "/default-store.svg";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg overflow-hidden rounded-2xl p-0">
        <DialogHeader className="border-b border-slate-100 bg-linear-to-r from-emerald-50/60 via-white to-slate-50 p-6 pb-4 dark:border-slate-800 dark:from-slate-900 dark:to-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
              <Sparkles className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Update Storefront Image?
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                You selected{" "}
                <strong className="font-semibold text-emerald-700 dark:text-emerald-400">
                  &quot;{pendingBusinessType}&quot;
                </strong>
                .
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 p-6">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            {isOther ? (
              <span>
                You selected <strong>Other</strong> business type. Would you like to switch to the
                standard default store image, keep your existing image, or upload a custom image?
              </span>
            ) : (
              <span>
                We found a recommended storefront image for <strong>{pendingBusinessType}</strong>.
                Would you like to change your store image to this recommended image or keep your
                existing image?
              </span>
            )}
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {recommended && (
              <div
                onClick={onConfirmUseRecommended}
                className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-emerald-300 bg-emerald-50/30 p-3 shadow-xs transition hover:border-emerald-600 hover:shadow-md dark:border-emerald-800 dark:bg-emerald-950/20"
              >
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                  <Image
                    src={recommended.imageUrl}
                    alt={recommended.label}
                    fill
                    unoptimized
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                    {isOther ? "Default" : "Recommended"}
                  </div>
                </div>
                <p className="mt-2.5 text-xs font-bold text-slate-900 dark:text-slate-100">
                  {recommended.label}
                </p>
                <p className="line-clamp-1 text-[11px] text-slate-500 dark:text-slate-400">
                  {isOther ? "System default placeholder" : "Category preset image"}
                </p>
                <Button
                  type="button"
                  size="sm"
                  onClick={onConfirmUseRecommended}
                  className="mt-3 h-8 w-full rounded-lg bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  {isOther ? "Use Default Image" : "Change Image"}
                </Button>
              </div>
            )}

            <div
              onClick={onConfirmKeepExisting}
              className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-xs transition hover:border-slate-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                <Image
                  src={currentDisplayUrl}
                  alt="Current store image"
                  fill
                  unoptimized
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute top-2 right-2 rounded-full bg-slate-700/80 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                  Existing
                </div>
              </div>
              <p className="mt-2.5 text-xs font-bold text-slate-900 dark:text-slate-100">
                Existing Image
              </p>
              <p className="line-clamp-1 text-[11px] text-slate-500 dark:text-slate-400">
                Retain current image
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onConfirmKeepExisting}
                className="mt-3 h-8 w-full rounded-lg text-xs font-semibold"
              >
                Keep Existing
              </Button>
            </div>
          </div>

          {isOther && (
            <div className="rounded-xl border border-amber-200/80 bg-amber-50/70 p-2.5 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
              💡 <strong>Custom Image:</strong> You can also upload your own store logo or photo
              anytime in the Store Image section below.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
