import { FormTextField } from "../form-text-field";
import { fieldError } from "./field-utils";

type FieldsProps = {
  control: any;
  errors: any;
};

export function JoinFields({ control, errors }: FieldsProps) {
  return (
    <>
      <FormTextField
        control={control}
        name="eyebrow"
        label="Eyebrow"
        error={fieldError(errors, "eyebrow")}
      />
      <FormTextField
        control={control}
        name="title"
        label="Title"
        multiline
        error={fieldError(errors, "title")}
      />
      <FormTextField
        control={control}
        name="description"
        label="Description"
        multiline
        rows={4}
        error={fieldError(errors, "description")}
      />
    </>
  );
}
