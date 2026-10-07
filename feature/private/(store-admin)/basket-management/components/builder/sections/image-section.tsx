"use client";

import { Check, ImageIcon, Loader2, Sparkles, Trash2, UploadCloud } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { errorToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import {
  BASKET_IMAGE_ACCEPT,
  BASKET_IMAGE_MAX_BYTES,
  BASKET_LIBRARY_IMAGES,
  getLibraryImage,
  templateImageKey,
} from "../../../../../../../constants/basket.constants";
import { useUploadBasketImage } from "../../../hooks/use-upload-basket-image";
import type { BasketFormValues } from "../../../schema/basket-form.schema";
import { BasketImage } from "../../shared/basket-image";
import { SectionCard } from "../section-card";

type ImageTab = "library" | "upload";

export function ImageSection() {
  const { control, setValue } = useFormContext<BasketFormValues>();
  const [image, libraryImage, basketType, name] = useWatch({
    control,
    name: ["image", "libraryImage", "basketType", "name"],
  });
  const [tab, setTab] = useState<ImageTab>(image ? "upload" : "library");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = useUploadBasketImage();

  const type = basketType ?? "CUSTOM";
  const activeLibraryKey = libraryImage ?? templateImageKey(type);
  const opts = { shouldDirty: true };

  const chooseLibrary = (key: string) => {
    setValue("libraryImage", key === templateImageKey(type) ? null : key, opts);
    setValue("image", null, opts);
  };

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
    setValue("image", url, opts);
  };

  return (
    <SectionCard
      id="image"
      step={6}
      title="Basket Image"
      description="Choose from our food basket images or upload your own. The selected image is shown to customers."
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_220px]">
        <Tabs value={tab} onValueChange={(v) => setTab(v as ImageTab)} className="min-w-0">
          <TabsList className="w-full sm:w-fit">
            <TabsTrigger value="library" className="flex-1 sm:flex-none">
              <Sparkles className="size-4" /> Food Remit: Template Images
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex-1 sm:flex-none">
              <UploadCloud className="size-4" /> Upload Your Own Image
            </TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="pt-2">
            <div
              role="radiogroup"
              aria-label="Food Remit basket images"
              className="grid grid-cols-2 gap-3 sm:grid-cols-4"
            >
              {BASKET_LIBRARY_IMAGES.map((option) => {
                const selected = !image && activeLibraryKey === option.key;
                return (
                  <button
                    key={option.key}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => chooseLibrary(option.key)}
                    className={cn(
                      "group relative overflow-hidden rounded-xl border-2 text-left transition-all",
                      selected
                        ? "border-primary shadow-md shadow-emerald-600/15"
                        : "border-slate-200/80 hover:border-emerald-300 dark:border-slate-800",
                    )}
                  >
                    <span className="relative block aspect-4/3 w-full bg-slate-50">
                      <Image
                        src={getLibraryImage(option.key)}
                        alt={option.label}
                        fill
                        sizes="(max-width: 640px) 50vw, 200px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </span>
                    <span
                      className={cn(
                        "absolute top-2 left-2 flex size-5 items-center justify-center rounded-full border-2 shadow-sm",
                        selected ? "bg-primary border-white" : "border-slate-300 bg-white/90",
                      )}
                    >
                      {selected && <Check className="size-3 text-white" strokeWidth={3.5} />}
                    </span>
                    <span className="block truncate px-2 py-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="upload" className="pt-2">
            <div
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
              className={cn(
                "flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors sm:flex-row sm:text-left",
                isDragging || image
                  ? "border-primary bg-emerald-50/50 dark:bg-emerald-950/20"
                  : "border-slate-300 dark:border-slate-700",
              )}
            >
              {image ? (
                <BasketImage
                  image={image}
                  basketType={type}
                  alt="Uploaded basket image"
                  sizes="160px"
                  className="aspect-4/3 w-36 shrink-0 rounded-xl"
                />
              ) : (
                <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                  {upload.isPending ? (
                    <Loader2 className="text-primary size-7 animate-spin" />
                  ) : (
                    <ImageIcon className="size-7" />
                  )}
                </span>
              )}
              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-sm font-bold">
                  {image ? "Your image is the primary basket image" : "Upload your own image"}
                </p>
                <p className="text-muted-foreground text-xs">
                  Drag & drop or choose a file · JPG, PNG or WEBP · Max 5MB
                </p>
                <div className="flex flex-wrap justify-center gap-2 pt-1.5 sm:justify-start">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => inputRef.current?.click()}
                    disabled={upload.isPending}
                    className="h-9 rounded-xl"
                  >
                    {upload.isPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <UploadCloud className="size-4" />
                    )}
                    {image ? "Replace image" : "Choose File"}
                  </Button>
                  {image && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setValue("image", null, opts)}
                      className="h-9 rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                    >
                      <Trash2 className="size-4" /> Remove
                    </Button>
                  )}
                </div>
              </div>
              <input
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
            <p className="text-muted-foreground mt-2 text-xs">
              The image represents the basket and doesn&apos;t need to show every item inside it.
            </p>
          </TabsContent>
        </Tabs>

        <div className="h-fit rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-slate-800">
          <p className="mb-2 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            Primary image
          </p>
          <BasketImage
            image={image}
            libraryImage={libraryImage}
            basketType={type}
            alt={name || "Basket image"}
            sizes="220px"
            className="aspect-4/3 w-full rounded-xl"
          />
          <p className="mt-2 truncate text-xs font-semibold">{name || "Basket name"}</p>
          <p className="text-muted-foreground text-[11px]">
            {image ? "Your uploaded image" : "Food Remit template image"}
          </p>
        </div>
      </div>
    </SectionCard>
  );
}
