"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import Image from "next/image";
import { ImageIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Preview {
  file: File;
  url: string;
}

export interface ImageUploadProps {
  value?: File[];
  onChange?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  className?: string;
  label?: string;
  hint?: string;
}

export const ImageUpload = forwardRef<HTMLInputElement, ImageUploadProps>(
  (
    {
      onChange,
      accept = "image/png,image/jpeg,image/webp",
      multiple = true,
      maxFiles = 5,
      className,
      label = "Upload images",
      hint = "PNG, JPG or WEBP",
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => inputRef.current!, []);

    const [images, setImages] = useState<Preview[]>([]);

    useEffect(() => {
      return () => {
        images.forEach((img) => URL.revokeObjectURL(img.url));
      };
    }, [images]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files ?? []);

      if (!files.length) return;

      setImages((prev) => {
        const existing = new Set(prev.map((i) => `${i.file.name}-${i.file.size}`));

        const next = [...prev];

        files.forEach((file) => {
          const key = `${file.name}-${file.size}`;

          if (!existing.has(key)) {
            next.push({
              file,
              url: URL.createObjectURL(file),
            });
          }
        });

        const finalImages = next.slice(0, maxFiles);
        onChange?.(finalImages.map((i) => i.file));

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
        onChange?.(next.map((i) => i.file));

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
            htmlFor="image-upload"
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
              id="image-upload"
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
                <Image src={image.url} alt={image.file.name} fill className="object-cover" />

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
