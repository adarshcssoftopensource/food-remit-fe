import { FormTextField } from "../form-text-field";
import { fieldError } from "./field-utils";

type FieldsProps = {
  control: any;
  errors: any;
};

export function HeroFields({ control, errors }: FieldsProps) {
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
        error={fieldError(errors, "description")}
      />
      <FormTextField
        control={control}
        name="ctaLabel"
        label="CTA label"
        error={fieldError(errors, "ctaLabel")}
      />
    </>
  );
}
