"use client";

import { ImageUpload } from "@/components/common/image-upload";
import { successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, Upload } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { TutorialFormValues, tutorialSchema } from "../schema/tutorial.schema";

import { FlashImageData } from "../hooks/use-get-flash-images";
import { useCreateFlashImage } from "../hooks/use-create-flash-image";
import { useUpdateFlashImage } from "../hooks/use-update-flash-image";
import { useQueryClient } from "@tanstack/react-query";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";

interface FlashImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tutorial?: FlashImageData | null;
}

export function FlashImageDialog({ open, onOpenChange, tutorial }: FlashImageDialogProps) {
  const queryClient = useQueryClient();
  const { mutateAsync: updateFlashImage } = useUpdateFlashImage(tutorial?.id || "");
  const { mutateAsync: createFlashImage } = useCreateFlashImage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TutorialFormValues>({
    resolver: zodResolver(tutorialSchema),
    defaultValues: {
      title: tutorial?.title || "",
      description: tutorial?.description || "",
      image: tutorial?.imageUrl || "",
      isActive: tutorial ? tutorial.isActive : true,
    },
    mode: "onChange",
  });

  const handleImageUpload = (files: File[]) => {
    setUploadedFiles(files);
    if (files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue("image", reader.result as string, { shouldValidate: true });
      };
      reader.readAsDataURL(files[0]);
    } else {
      setValue("image", "", { shouldValidate: true });
    }
  };

  const onSubmit = async (values: TutorialFormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("isActive", values.isActive.toString());
      if (uploadedFiles[0]) {
        formData.append("image", uploadedFiles[0]);
      }

      if (tutorial) {
        await updateFlashImage(formData);
        successToast({ title: "Flash image updated successfully" });
      } else {
        await createFlashImage(formData);
        successToast({ title: "Flash image created successfully" });
      }
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.FLASH_IMAGES });
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl">
        <DialogHeader className="border-border/60 rounded-t-3xl border-b px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="border-primary/20 bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-2xl border">
              <BookOpen className="h-6 w-6" />
            </div>

            <div className="flex-1">
              <DialogTitle className="text-foreground text-xl font-bold tracking-tight">
                {tutorial ? "Edit Flash Image" : "Add Flash Image"}
              </DialogTitle>

              <DialogDescription className="text-muted-foreground mt-1 text-sm">
                {tutorial
                  ? "Update flash image and description for the app onboarding experience."
                  : "Add a new flash image for the app onboarding experience."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
          <div className="space-y-2">
            <FieldLabel className="text-foreground text-sm font-semibold">
              Tutorial Image <span className="text-destructive">*</span>
            </FieldLabel>

            <ImageUpload
              value={uploadedFiles}
              onChange={handleImageUpload}
              initialImages={tutorial?.imageUrl ? [tutorial.imageUrl] : []}
              multiple={false}
              maxFiles={1}
              className="w-full"
              label="Upload flash image"
              hint="PNG, JPG or WEBP"
            />
            {errors.image && <p className="text-destructive text-xs">{errors.image.message}</p>}
          </div>

          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <FieldLabel className="text-foreground text-sm font-semibold">
                  Title <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  placeholder="Enter tutorial title"
                  className={cn(
                    "border-border/80 bg-background/80 h-11 rounded-xl",
                    "focus-visible:border-primary focus-visible:ring-primary/20",
                    errors.title && "border-destructive",
                  )}
                />
                {errors.title && <p className="text-destructive text-xs">{errors.title.message}</p>}
              </div>
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <FieldLabel className="text-foreground text-sm font-semibold">
                  Description <span className="text-destructive">*</span>
                </FieldLabel>
                <Textarea
                  {...field}
                  placeholder="Enter tutorial description"
                  rows={4}
                  className={cn(
                    "border-border/80 bg-background/80 resize-none rounded-xl",
                    "focus-visible:border-primary focus-visible:ring-primary/20",
                    errors.description && "border-destructive",
                  )}
                />
                {errors.description && (
                  <p className="text-destructive text-xs">{errors.description.message}</p>
                )}
              </div>
            )}
          />

          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <div className="border-border/80 bg-muted/30 flex items-center justify-between rounded-xl border p-4">
                <div className="space-y-0.5">
                  <FieldLabel className="text-foreground text-sm font-semibold">Status</FieldLabel>
                  <p className="text-muted-foreground text-xs">
                    Make this flash image visible on the mobile app.
                  </p>
                </div>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </div>
            )}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-11 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-xl"
            >
              <Upload className="mr-2 h-4 w-4" />
              {tutorial ? "Update Tutorial" : "Add Tutorial"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
