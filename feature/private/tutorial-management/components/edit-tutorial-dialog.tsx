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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, Upload } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { TutorialFormValues, tutorialSchema } from "../schema/tutorial.schema";

interface EditTutorialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tutorial: {
    id: number;
    title: string;
    description: string;
    image: string;
  };
}

export function EditTutorialDialog({ open, onOpenChange, tutorial }: EditTutorialDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(tutorial.image);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TutorialFormValues>({
    resolver: zodResolver(tutorialSchema),
    defaultValues: {
      title: tutorial.title,
      description: tutorial.description,
      image: tutorial.image,
    },
    mode: "onChange",
  });

  const handleImageUpload = (files: File[]) => {
    setUploadedFiles(files);
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setValue("image", reader.result as string);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const onSubmit = async (values: TutorialFormValues) => {
    setIsSubmitting(true);
    try {
      console.log("Tutorial Updated:", values);
      successToast({ title: "Tutorial updated successfully" });
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
        <DialogHeader className="rounded-t-3xl border-b px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border">
              <BookOpen className="h-6 w-6" />
            </div>

            <div className="flex-1">
              <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">
                Edit Tutorial
              </DialogTitle>

              <DialogDescription className="mt-1 text-sm text-slate-600">
                Update tutorial image and description for the app onboarding experience.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
          <div className="space-y-2">
            <FieldLabel className="text-sm font-semibold text-gray-700">
              Tutorial Image <span className="text-red-500">*</span>
            </FieldLabel>

            <ImageUpload
              value={uploadedFiles}
              onChange={handleImageUpload}
              multiple={false}
              maxFiles={1}
              className="w-full"
              label="Upload tutorial image"
              hint="PNG, JPG or WEBP"
            />
          </div>

          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <FieldLabel className="text-sm font-semibold text-gray-700">
                  Title <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  placeholder="Enter tutorial title"
                  className={cn(
                    "h-12 rounded-xl border-gray-200 bg-gray-50",
                    "focus:bg-white focus-visible:border-[#1B3A8C]",
                    errors.title && "border-red-400",
                  )}
                />
                {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
              </div>
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <FieldLabel className="text-sm font-semibold text-gray-700">
                  Description <span className="text-red-500">*</span>
                </FieldLabel>
                <Textarea
                  {...field}
                  placeholder="Enter tutorial description"
                  rows={4}
                  className={cn(
                    "resize-none rounded-xl border-gray-200 bg-gray-50",
                    "focus:bg-white focus-visible:border-[#1B3A8C]",
                    errors.description && "border-red-400",
                  )}
                />
                {errors.description && (
                  <p className="text-xs text-red-500">{errors.description.message}</p>
                )}
              </div>
            )}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-12 rounded-xl"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="h-12 rounded-xl">
              <Upload className="mr-2 h-4 w-4" />
              Update Tutorial
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
