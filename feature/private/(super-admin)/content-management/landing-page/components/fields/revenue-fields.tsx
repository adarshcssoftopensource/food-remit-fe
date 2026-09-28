import { Controller } from "react-hook-form";

import { FieldLabel } from "@/components/ui/field";
import { FormTextField } from "../form-text-field";
import { MarketsCountryPicker } from "../markets-country-picker";
import { fieldError } from "./field-utils";

type FieldsProps = {
  control: any;
  errors: any;
};

export function RevenueFields({ control, errors }: FieldsProps) {
  return (
    <>
      <FormTextField
        control={control}
        name="title"
        label="Title"
        error={fieldError(errors, "title")}
      />
      <FormTextField
        control={control}
        name="subtitle"
        label="Subtitle"
        multiline
        error={fieldError(errors, "subtitle")}
      />
      <FormTextField
        control={control}
        name="description"
        label="Description"
        multiline
        rows={4}
        error={fieldError(errors, "description")}
      />
      <Controller
        name="markets"
        control={control}
        render={({ field }) => (
          <div className="space-y-1.5">
            <FieldLabel className="text-sm font-semibold text-slate-700">
              Markets (all world countries)
            </FieldLabel>
            <MarketsCountryPicker
              markets={Array.isArray(field.value) ? field.value : []}
              onChange={field.onChange}
            />
          </div>
        )}
      />
    </>
  );
}
