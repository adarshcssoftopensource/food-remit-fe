import { ImageIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { ImageUpload } from "@/components/common/image-upload";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { ITEM_LIMITS } from "@/lib/catalogue/item-rules";
import type { ItemFormValues } from "../../../hooks/useItemForm";
import { ImageDropZone, Required, Section } from "./editor-primitives";

export function ProductImagesSection({ initialImages }: { initialImages: string[] }) {
  const form = useFormContext<ItemFormValues>();

  return (
    <Section
      icon={<ImageIcon className="h-4 w-4" />}
      title={
        <>
          Product images
          <Required />
        </>
      }
      description={`Up to ${ITEM_LIMITS.maxImages} images · PNG, JPG or WEBP. The first image is the cover.`}
    >
      <FormField
        control={form.control}
        name="productImageFile"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <ImageDropZone>
                <ImageUpload
                  maxFiles={ITEM_LIMITS.maxImages}
                  multiple
                  value={field.value}
                  onChange={field.onChange}
                  onAllImagesChange={(all) => {
                    form.setValue(
                      "existingProductImages",
                      all.filter((i) => !i.file).map((i) => i.url),
                    );
                    form.setValue(
                      "productImageFile",
                      all.filter((i) => !!i.file).map((i) => i.file!),
                      { shouldValidate: form.formState.isSubmitted },
                    );
                  }}
                  label="Upload product images"
                  hint={`PNG, JPG or WEBP · up to ${ITEM_LIMITS.maxImages}`}
                  initialImages={initialImages}
                />
              </ImageDropZone>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Section>
  );
}
