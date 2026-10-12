"use client";

import { Check, ImageIcon, LayoutTemplate, Loader2, Trash2, UploadCloud } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { errorToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  BASKET_IMAGE_ACCEPT,
  BASKET_IMAGE_MAX_BYTES,
  BASKET_TYPE_MAP,
} from "../../../../../../../constants/basket.constants";
import { useUploadBasketImage } from "../../../hooks/use-upload-basket-image";
import type { BasketFormValues } from "../../../schema/basket-form.schema";
import { BasketImage } from "../../shared/basket-image";
import { SectionCard } from "../section-card";

type ImageSource = "template" | "upload";

function SourceOption({
  selected,
  icon,
  title,
  description,
  onSelect,
}: {
  selected: boolean;
  icon: ReactNode;
  title: string;
  description: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "flex w-full items-start gap-3 rounded-2xl border-2 p-3.5 text-left transition-all",
        selected
          ? "border-primary bg-emerald-50/60 shadow-sm dark:bg-emerald-950/20"
          : "border-slate-200/80 hover:border-emerald-300 dark:border-slate-800",
      )}
    >
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-xl",
          selected ? "bg-primary text-white" : "bg-slate-100 text-slate-500 dark:bg-slate-800",
        )}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold text-slate-900 dark:text-white">{title}</span>
        <span className="text-muted-foreground block text-xs">{description}</span>
      </span>
      <span
        className={cn(
          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2",
          selected ? "bg-primary border-primary" : "border-slate-300",
        )}
      >
        {selected && <Check className="size-3 text-white" strokeWidth={3.5} />}
      </span>
    </button>
  );
}

export function ImageSection() {
  const { control, setValue } = useFormContext<BasketFormValues>();
  const [image, basketType, name] = useWatch({
    control,
    name: ["image", "basketType", "name"],
  });
  const [source, setSource] = useState<ImageSource>(image ? "upload" : "template");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = useUploadBasketImage();

  const type = basketType ?? "CUSTOM";
  const templateLabel = BASKET_TYPE_MAP[type].label;
  const opts = { shouldDirty: true };

  const keepTemplateImage = () => {
    setSource("template");
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
      step={5}
      title="Basket Image"
      description="Keep the image of the template you selected, or upload your own. The selected image is shown to customers."
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div className="min-w-0 space-y-3">
          <div
            role="radiogroup"
            aria-label="Basket image source"
            className="grid gap-3 sm:grid-cols-2"
          >
            <SourceOption
              selected={source === "template"}
              icon={<LayoutTemplate className="size-4" />}
              title="Keep template image"
              description={`Use the ${templateLabel} image selected in step 1.`}
              onSelect={keepTemplateImage}
            />
            <SourceOption
              selected={source === "upload"}
              icon={<UploadCloud className="size-4" />}
              title="Upload your own image"
              description="Use a photo of your own basket."
              onSelect={() => setSource("upload")}
            />
          </div>

          {source === "upload" && (
            <div>
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
                    previewable={false}
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
                        onClick={keepTemplateImage}
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
                Until you upload one, the template image is used.
              </p>
            </div>
          )}
        </div>

        <div className="h-fit rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-slate-800">
          <p className="mb-2 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            Primary image
          </p>
          <BasketImage
            image={image}
            basketType={type}
            alt={name || "Basket image"}
            sizes="220px"
            previewable={false}
            className="aspect-4/3 w-full rounded-xl"
          />
          <p className="mt-2 truncate text-xs font-semibold">{name || "Basket name"}</p>
          <p className="text-muted-foreground text-[11px]">
            {image ? "Your uploaded image" : `${templateLabel} template image`}
          </p>
        </div>
      </div>
    </SectionCard>
  );
}
