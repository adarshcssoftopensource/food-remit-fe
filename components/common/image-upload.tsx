"use client";

import { ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState, useId } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { toast } from "sonner";

interface Preview {
  file?: File;
  url: string;
}

export interface ImageUploadProps {
  value?: File[];
  onChange?: (files: File[]) => void;
  onAllImagesChange?: (images: Preview[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  className?: string;
  label?: string;
  hint?: string;
  initialImages?: string[];
  id?: string;
}

export const ImageUpload = forwardRef<HTMLInputElement, ImageUploadProps>(
  (
    {
      onChange,
      onAllImagesChange,
      accept = "image/png,image/jpeg,image/webp",
      multiple = true,
      maxFiles = 5,
      className,
      label = "Upload images",
      hint = "PNG, JPG or WEBP",
      initialImages = [],
      id,
    },
    ref,
  ) => {
    const defaultId = useId();
    const inputId = id || defaultId;
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => inputRef.current!, []);

    const [images, setImages] = useState<Preview[]>(() => initialImages.map((url) => ({ url })));

    const initialImagesStr = initialImages.join(",");

    useEffect(() => {
      const initial = initialImagesStr ? initialImagesStr.split(",").map((url) => ({ url })) : [];
      setImages(initial);
      onAllImagesChange?.(initial);
    }, [initialImagesStr]);

    useEffect(() => {
      return () => {
        images.forEach((img) => {
          if (img.file) URL.revokeObjectURL(img.url);
        });
      };
    }, [images]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files ?? []);

      if (!files.length) return;

      const MAX_SIZE = 5 * 1024 * 1024; // 5MB
      const validFiles = files.filter((f) => f.size <= MAX_SIZE);

      if (validFiles.length < files.length) {
        toast.error("Image size must be less than 5MB");
      }

      if (!validFiles.length) {
        event.target.value = "";
        return;
      }

      setImages((prev) => {
        const next = maxFiles === 1 ? [] : [...prev];
        const existing = new Set(
          next.map((i) => (i.file ? `${i.file.name}-${i.file.size}` : i.url)),
        );

        validFiles.forEach((file) => {
          const key = `${file.name}-${file.size}`;

          if (!existing.has(key)) {
            next.push({
              file,
              url: URL.createObjectURL(file),
            });
          }
        });

        const finalImages = next.slice(0, maxFiles);
        onChange?.(finalImages.map((i) => i.file).filter(Boolean) as File[]);
        onAllImagesChange?.(finalImages);

        return finalImages;
      });

      event.target.value = "";
    };

    const removeImage = (index: number) => {
      setImages((prev) => {
        const removed = prev[index];

        if (removed) {
          URL.revokeObjectURL(removed.url);
        }

        const next = prev.filter((_, i) => i !== index);
        onChange?.(next.map((i) => i.file).filter(Boolean) as File[]);
        onAllImagesChange?.(next);

        return next;
      });

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    };

    return (
      <div className={cn("space-y-3", className)}>
        {images.length < maxFiles && (
          <label
            htmlFor={inputId}
            className="border-primary/25 hover:border-primary hover:bg-primary/5 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed p-4 transition"
          >
            <span className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
              <ImageIcon className="h-5 w-5" />
            </span>

            <div>
              <p className="font-medium">{label}</p>
              <p className="text-muted-foreground text-xs">{hint}</p>
            </div>

            <input
              id={inputId}
              ref={inputRef}
              type="file"
              accept={accept}
              multiple={multiple}
              className="hidden"
              onChange={handleChange}
            />
          </label>
        )}

        {!!images.length && (
          <div className="flex flex-wrap gap-2">
            {images.map((image, index) => (
              <div
                key={image.url}
                className="group relative h-20 w-20 overflow-hidden rounded-lg border"
              >
                <Image
                  src={image.url}
                  alt={image.file?.name || "Image"}
                  fill
                  className="object-cover"
                />

                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 h-5 w-5 rounded-full p-0 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X size={22} className="text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <p className="text-muted-foreground text-xs">
          {images.length}/{maxFiles} images selected
        </p>
      </div>
    );
  },
);

ImageUpload.displayName = "ImageUpload";
