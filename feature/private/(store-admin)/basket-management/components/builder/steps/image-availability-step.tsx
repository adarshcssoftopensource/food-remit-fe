"use client";

import {
  CalendarClock,
  Check,
  ImageIcon,
  Loader2,
  Sparkles,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { errorToast } from "@/components/toaster";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

import {
  BASKET_IMAGE_ACCEPT,
  BASKET_IMAGE_MAX_BYTES,
  BASKET_TYPE_MAP,
  formatHouseholdSize,
} from "../../../../../../../constants/basket.constants";
import { useUploadBasketImage } from "../../../hooks/use-upload-basket-image";
import type { BasketFormValues } from "../../../schema/basket-form.schema";
import { formatMoney } from "../../../utils/basket-format";
import { BasketImage } from "../../shared/basket-image";
import { PriceStack } from "../../shared/price-display";
import { StepHeader } from "../step-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ImageAvailabilityStepProps {
  customerPrice?: number;
  originalPrice?: number;
  currencySymbol?: string;
  isPublished: boolean;
}

export function ImageAvailabilityStep({
  customerPrice,
  originalPrice,
  currencySymbol,
  isPublished,
}: ImageAvailabilityStepProps) {
  const { control, setValue } = useFormContext<BasketFormValues>();
  const [image, basketType, name, householdSize, isActive] = useWatch({
    control,
    name: ["image", "basketType", "name", "householdSize", "isActive"],
  });
  const type = basketType ?? "CUSTOM";
  const upload = useUploadBasketImage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = async (file?: File) => {
    if (!file) return;
    if (!BASKET_IMAGE_ACCEPT.split(",").includes(file.type)) {
      errorToast({ description: "Please upload a JPG, PNG or WEBP image." });
      return;
    }
    if (file.size > BASKET_IMAGE_MAX_BYTES) {
      errorToast({ description: "Image must be 5 MB or smaller." });
      return;
    }
    const url = await upload.mutateAsync(file);
    setValue("image", url, { shouldDirty: true });
  };

  const useDefault = () => setValue("image", null, { shouldDirty: true });

  return (
    <div className="space-y-6">
      <StepHeader
        step={6}
        icon={ImageIcon}
        title="Image & availability"
        description="Choose how your basket looks to customers and whether it goes live when published."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-5">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Basket image</p>
            <div className="grid gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={useDefault}
                aria-pressed={!image}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border-2 p-2.5 text-left transition-all",
                  !image
                    ? "border-primary bg-primary/5 shadow-md shadow-emerald-600/10"
                    : "border-slate-200 hover:border-emerald-300 dark:border-slate-800",
                )}
              >
                <BasketImage
                  basketType={type}
                  alt="Default basket image"
                  sizes="128px"
                  className="aspect-4/3 w-24 shrink-0 rounded-xl"
                />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-sm font-bold">
                    <Sparkles className="text-primary size-4" /> Food Remit image
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    Ready-made image for {BASKET_TYPE_MAP[type].label}
                  </p>
                </div>
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full border-2",
                    !image ? "border-primary bg-primary text-white" : "border-slate-300",
                  )}
                >
                  {!image && <Check className="size-3" strokeWidth={3} />}
                </span>
              </button>

              <div
                className={cn(
                  "flex items-center gap-3 rounded-2xl border-2 p-2.5 transition-all",
                  image
                    ? "border-primary bg-primary/5 shadow-md shadow-emerald-600/10"
                    : "border-dashed border-slate-300 hover:border-emerald-300 dark:border-slate-700",
                  isDragging && "border-primary bg-primary/5",
                )}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  void handleFile(e.dataTransfer.files?.[0]);
                }}
              >
                {image ? (
                  <BasketImage
                    image={image}
                    basketType={type}
                    alt="Custom basket image"
                    sizes="128px"
                    className="aspect-4/3 w-24 shrink-0 rounded-xl"
                  />
                ) : (
                  <Button
                    type="button"
                    variant={"ghost"}
                    onClick={() => inputRef.current?.click()}
                    disabled={upload.isPending}
                    className="flex aspect-4/3 w-24 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600 dark:bg-slate-800"
                    aria-label="Upload image"
                  >
                    {upload.isPending ? (
                      <Loader2 className="text-primary size-6 animate-spin" />
                    ) : (
                      <UploadCloud className="size-6" />
                    )}
                  </Button>
                )}
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-sm font-bold">
                    <ImageIcon className="text-primary size-4" /> Your own image
                  </p>
                  {image ? (
                    <div className="mt-1 flex items-center gap-1">
                      <Button
                        type="button"
                        variant={"ghost"}
                        onClick={() => inputRef.current?.click()}
                        disabled={upload.isPending}
                        className="text-primary rounded-lg px-2 py-1 text-xs font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                      >
                        {upload.isPending ? "Uploading…" : "Change"}
                      </Button>
                      <Button
                        type="button"
                        variant={"ghost"}
                        onClick={useDefault}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      >
                        <Trash2 className="size-3.5" /> Remove
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant={"ghost"}
                      onClick={() => inputRef.current?.click()}
                      disabled={upload.isPending}
                      className="mt-0.5 text-left text-xs text-slate-500"
                    >
                      {upload.isPending ? (
                        "Uploading…"
                      ) : (
                        <>
                          <span className="text-primary font-semibold">Click to upload</span> or
                          drag & drop
                          <span className="block text-[11px] text-slate-400">
                            JPG, PNG, WEBP · max 5 MB
                          </span>
                        </>
                      )}
                    </Button>
                  )}
                </div>
                <Input
                  ref={inputRef}
                  type="file"
                  accept={BASKET_IMAGE_ACCEPT}
                  className="hidden"
                  onChange={(e) => {
                    void handleFile(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </div>
            </div>
            <p className="text-muted-foreground text-xs">
              The image represents the basket and doesn&apos;t need to show every item inside it.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Availability</p>
            <div className="rounded-2xl border border-slate-200/80 p-4 dark:border-slate-800">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold">
                    {isPublished ? "Visible to customers" : "Make active when published"}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {isActive
                      ? "Customers can find and buy this basket as soon as it is published."
                      : "The basket will be published but hidden. You can activate it anytime."}
                  </p>
                </div>
                <Switch
                  checked={isActive}
                  onCheckedChange={(checked) =>
                    setValue("isActive", checked, { shouldDirty: true })
                  }
                  aria-label="Basket active"
                />
              </div>
              <div className="mt-3 flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-xs text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                <CalendarClock className="mt-0.5 size-4 shrink-0" />
                Customer pickup and delivery always follow your store&apos;s operating schedule.
              </div>
            </div>
          </div>
        </div>

        {/* Storefront preview */}
        <div className="mx-auto h-fit w-full max-w-70 rounded-3xl bg-linear-to-b from-slate-100 to-slate-50 p-3.5 ring-1 ring-slate-200/70 lg:sticky lg:top-24 dark:from-slate-900 dark:to-slate-950 dark:ring-slate-800">
          <p className="mb-3 text-center text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            How customers will see it
          </p>
          <div className="overflow-hidden rounded-2xl bg-white shadow-xl shadow-slate-900/10 dark:bg-slate-900">
            <div className="relative">
              <BasketImage
                image={image}
                basketType={type}
                alt={name || "Basket"}
                sizes="280px"
                className="aspect-16/10 w-full"
              />
              {originalPrice !== undefined &&
                customerPrice !== undefined &&
                originalPrice - customerPrice > 0.004 && (
                  <span className="absolute top-2.5 left-2.5 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white shadow">
                    Save {formatMoney(originalPrice - customerPrice, currencySymbol)}
                  </span>
                )}
            </div>
            <div className="space-y-1 p-3.5">
              <p className="truncate font-bold">{name || "Basket name"}</p>
              <p className="text-primary text-xs font-semibold">
                {householdSize
                  ? `For ${formatHouseholdSize(householdSize)}`
                  : BASKET_TYPE_MAP[type].label}
              </p>
              <div className="flex items-end justify-between pt-1.5">
                <PriceStack
                  price={customerPrice}
                  originalPrice={originalPrice}
                  currencySymbol={currencySymbol}
                  size="lg"
                  align="left"
                />
                <span className="bg-primary rounded-xl px-3 py-2 text-xs font-semibold text-white">
                  Add to cart
                </span>
              </div>
            </div>
          </div>
          <p className="mt-3 text-center text-[11px] text-slate-400">
            Taxes and fees are added at checkout
          </p>
        </div>
      </div>
    </div>
  );
}
