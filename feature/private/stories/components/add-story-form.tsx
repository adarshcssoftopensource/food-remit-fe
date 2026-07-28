"use client";

import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Plus, Trash2, Users, BookOpen } from "lucide-react";
import { ImageUpload } from "@/components/common/image-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { successToast } from "@/components/toaster";
import { addStorySchema, type AddStoryFormValues } from "../schema/add-story.schema";
import { FormInput } from "./form-input";
import { inputClassName } from "@/constants/stories-management";
import { ReferenceCard } from "./reference-card";
import { FormActions } from "./form-actions";

export function AddStoryForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddStoryFormValues>({
    resolver: zodResolver(addStorySchema),
    defaultValues: {
      storyName: "",
      description: "",
      location: "",
      familyName: "",
      familyEmail: "",
      familyNumber: "",
      familyLocation: "",
      referenceOne: { name: "", email: "", number: "" },
      referenceTwo: { name: "", email: "", number: "" },
      requestedItems: [{ productName: "", unit: "", quantity: 1 }],
    },
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({ control, name: "requestedItems" });

  const onSubmit = async (_values: AddStoryFormValues) => {
    successToast({ title: "Story published", description: "Your story is ready for review." });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <Card className="overflow-hidden rounded-2xl shadow-sm">
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-xl">
              <BookOpen className="size-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Story details</CardTitle>
              <CardDescription>Tell us about the family and the support they need.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-5 pt-6">
          <Controller
            name="storyName"
            control={control}
            render={({ field }) => (
              <FormInput label="Story name" error={errors.storyName?.message}>
                <Input
                  {...field}
                  placeholder="Enter a clear story title"
                  aria-invalid={!!errors.storyName}
                  className={inputClassName}
                />
              </FormInput>
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <FormInput label="Description" error={errors.description?.message}>
                <Textarea
                  {...field}
                  placeholder="Describe the family's situation, needs, and impact…"
                  aria-invalid={!!errors.description}
                  className="focus-visible:border-primary focus-visible:bg-background min-h-32 rounded-lg border-gray-200 bg-gray-50/60"
                />
              </FormInput>
            )}
          />

          <Controller
            name="images"
            control={control}
            render={({ field: { onChange }, fieldState }) => (
              <div className="flex flex-col gap-1.5">
                <FieldLabel className="text-sm font-semibold">Images</FieldLabel>
                <ImageUpload
                  onChange={onChange}
                  label="Upload story images"
                  hint="PNG, JPG, or WEBP files"
                  multiple
                />
                {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
              </div>
            )}
          />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <ReferenceCard
          title="Reference 1"
          prefix="referenceOne"
          control={control}
          errors={errors.referenceOne}
        />
        <ReferenceCard
          title="Reference 2"
          prefix="referenceTwo"
          control={control}
          errors={errors.referenceTwo}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="text-primary size-5" /> Location
            </CardTitle>
            <CardDescription>Where this request will be supported.</CardDescription>
          </CardHeader>
          <CardContent>
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <FormInput label="Location" error={errors.location?.message}>
                  <Input
                    {...field}
                    placeholder="City, state or address"
                    aria-invalid={!!errors.location}
                    className={inputClassName}
                  />
                </FormInput>
              )}
            />
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="text-primary size-5" /> Family details
            </CardTitle>
            <CardDescription>Primary contact for this request.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Controller
              name="familyName"
              control={control}
              render={({ field }) => (
                <FormInput label="Name" error={errors.familyName?.message}>
                  <Input
                    {...field}
                    placeholder="Full name"
                    aria-invalid={!!errors.familyName}
                    className={inputClassName}
                  />
                </FormInput>
              )}
            />
            <Controller
              name="familyEmail"
              control={control}
              render={({ field }) => (
                <FormInput label="Email" error={errors.familyEmail?.message}>
                  <Input
                    {...field}
                    type="email"
                    placeholder="name@email.com"
                    aria-invalid={!!errors.familyEmail}
                    className={inputClassName}
                  />
                </FormInput>
              )}
            />
            <Controller
              name="familyNumber"
              control={control}
              render={({ field }) => (
                <FormInput label="Contact number" error={errors.familyNumber?.message}>
                  <Input
                    {...field}
                    inputMode="tel"
                    placeholder="Contact number"
                    aria-invalid={!!errors.familyNumber}
                    className={inputClassName}
                  />
                </FormInput>
              )}
            />
            <Controller
              name="familyLocation"
              control={control}
              render={({ field }) => (
                <FormInput label="Location" error={errors.familyLocation?.message}>
                  <Input
                    {...field}
                    placeholder="Family location"
                    aria-invalid={!!errors.familyLocation}
                    className={inputClassName}
                  />
                </FormInput>
              )}
            />
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Requested items</CardTitle>
            <CardDescription>Add the products or funds requested for this story.</CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ productName: "", unit: "", quantity: 1 })}
          >
            <Plus /> Add item
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="bg-muted/30 grid items-start gap-3 rounded-xl border p-4 md:grid-cols-[1fr_12rem_9rem_auto]"
            >
              <Controller
                name={`requestedItems.${index}.productName`}
                control={control}
                render={({ fieldState, field: f }) => (
                  <FormInput label="Product name" error={fieldState.error?.message}>
                    <Input
                      {...f}
                      placeholder="Product name"
                      aria-invalid={!!fieldState.error}
                      className={inputClassName}
                    />
                  </FormInput>
                )}
              />

              <Controller
                name={`requestedItems.${index}.unit`}
                control={control}
                render={({ field: selectField, fieldState }) => (
                  <div className="flex flex-col gap-1.5">
                    <FieldLabel className="text-sm font-semibold">Unit</FieldLabel>
                    <Select
                      value={selectField.value || undefined}
                      onValueChange={(value) => selectField.onChange(value ?? "")}
                    >
                      <SelectTrigger
                        aria-invalid={!!fieldState.error}
                        className="h-11 w-full rounded-lg border-gray-200 bg-gray-50/60"
                      >
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="piece">Piece</SelectItem>
                        <SelectItem value="pack">Pack</SelectItem>
                        <SelectItem value="kg">Kilogram</SelectItem>
                        <SelectItem value="litre">Litre</SelectItem>
                        <SelectItem value="amount">Amount</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                  </div>
                )}
              />

              <Controller
                name={`requestedItems.${index}.quantity`}
                control={control}
                render={({ field: f, fieldState }) => (
                  <FormInput label="Quantity" error={fieldState.error?.message}>
                    <Input
                      {...f}
                      type="number"
                      min="1"
                      aria-invalid={!!fieldState.error}
                      className={inputClassName}
                    />
                  </FormInput>
                )}
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={fields.length === 1}
                onClick={() => remove(index)}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive mt-7"
              >
                <Trash2 />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <FormActions />
    </form>
  );
}
