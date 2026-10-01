"use client";

import { Controller, type Control, type UseFieldArrayReturn } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
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
import { inputClassName } from "@/constants/stories-management";
import type { AddStoryFormValues } from "../schema/add-story.schema";
import { FormInput } from "./form-input";

type RequestedItemsCardProps = {
  control: Control<AddStoryFormValues>;
} & Pick<UseFieldArrayReturn<AddStoryFormValues, "requestedItems">, "fields" | "append" | "remove">;

export function RequestedItemsCard({ control, fields, append, remove }: RequestedItemsCardProps) {
  return (
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
              aria-label="Remove item"
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
  );
}
