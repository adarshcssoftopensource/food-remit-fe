"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { faqSchema, type FaqFormValues } from "../schema/content.schema";

type FaqFormProps = {
  initialValues?: Partial<FaqFormValues>;
  onSubmit: (values: FaqFormValues) => void;
  submitLabel?: string;
  isSubmitting?: boolean;
};

const inputClass =
  "h-12 rounded-xl border-gray-200/80 bg-gray-50/50 text-sm transition-colors hover:border-gray-300 hover:bg-gray-50 focus-visible:border-primary focus-visible:bg-white focus-visible:ring-primary/20";

export function FaqForm({
  initialValues,
  onSubmit,
  submitLabel = "Add",
  isSubmitting = false,
}: FaqFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FaqFormValues>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question: initialValues?.question ?? "",
      answer: initialValues?.answer ?? "",
    },
    mode: "onChange",
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <div className="space-y-5 p-6">
        <Controller
          name="question"
          control={control}
          render={({ field }) => (
            <div className="space-y-1.5">
              <FieldLabel className="text-sm font-semibold">
                Question <span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                {...field}
                placeholder="Enter Question"
                className={cn(inputClass, errors.question && "border-red-400 bg-red-50")}
              />
              {errors.question ? (
                <p className="text-xs font-medium text-red-500">{errors.question.message}</p>
              ) : null}
            </div>
          )}
        />

        <Controller
          name="answer"
          control={control}
          render={({ field }) => (
            <div className="space-y-1.5">
              <FieldLabel className="text-sm font-semibold">
                Answer <span className="text-red-500">*</span>
              </FieldLabel>
              <Textarea
                {...field}
                rows={5}
                placeholder="Enter Answer"
                className={cn(
                  "focus-visible:border-primary focus-visible:ring-primary/20 rounded-xl border-gray-200/80 bg-gray-50/50 text-sm",
                  errors.answer && "border-red-400 bg-red-50",
                )}
              />
              {errors.answer ? (
                <p className="text-xs font-medium text-red-500">{errors.answer.message}</p>
              ) : null}
            </div>
          )}
        />
      </div>

      <div className="sticky bottom-0 z-10 flex justify-end gap-2 border-t border-slate-100 bg-white/95 px-6 py-4 backdrop-blur">
        <Button
          type="submit"
          isLoading={isSubmitting}
          className="h-11 min-w-36 rounded-xl px-10 font-semibold"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
