import type { ReactNode } from "react";
import { useFormContext } from "react-hook-form";

import { ImageUpload } from "@/components/common/image-upload";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ITEM_LIMITS } from "@/lib/catalogue/item-rules";
import { cn } from "@/lib/utils";
import type { ItemFormValues } from "../../../hooks/useItemForm";
import { ImageDropZone, Optional, Section, textareaClass } from "./editor-primitives";

const FIELDS = {
  product: {
    text: "productInfo",
    imageFile: "productInfoImageFile",
    existingImage: "existingProductInfoImage",
  },
  nutrition: {
    text: "nutritionInfo",
    imageFile: "nutritionInfoImageFile",
    existingImage: "existingNutritionInfoImage",
  },
} as const;

type InfoWithImageSectionProps = {
  kind: keyof typeof FIELDS;
  icon: ReactNode;
  title: string;
  description: string;
  placeholder: string;
  uploadLabel: string;
  uploadHint: string;
  initialImages: string[];
};

export function InfoWithImageSection({
  kind,
  icon,
  title,
  description,
  placeholder,
  uploadLabel,
  uploadHint,
  initialImages,
}: InfoWithImageSectionProps) {
  const form = useFormContext<ItemFormValues>();
  const names = FIELDS[kind];

  return (
    <Section
      icon={icon}
      title={
        <>
          {title}
          <Optional />
        </>
      }
      description={description}
    >
      <div className="space-y-4">
        <FormField
          control={form.control}
          name={names.text}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder={placeholder}
                  className={cn("min-h-24", textareaClass)}
                  maxLength={ITEM_LIMITS.textMax}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={names.imageFile}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ImageDropZone>
                  <ImageUpload
                    maxFiles={1}
                    value={field.value}
                    onChange={field.onChange}
                    onAllImagesChange={(all) => {
                      form.setValue(names.existingImage, all.find((i) => !i.file)?.url || null);
                      form.setValue(
                        names.imageFile,
                        all.filter((i) => !!i.file).map((i) => i.file!),
                      );
                    }}
                    label={uploadLabel}
                    hint={uploadHint}
                    initialImages={initialImages}
                  />
                </ImageDropZone>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Section>
  );
}
