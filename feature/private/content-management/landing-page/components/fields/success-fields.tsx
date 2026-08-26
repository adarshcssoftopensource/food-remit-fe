import { StringArrayFields } from "../array-fields";
import { FormTextField } from "../form-text-field";
import { fieldError } from "./field-utils";

type FieldsProps = {
  control: any;
  setValue?: any;
  errors: any;
};

export function SuccessFields({ control, setValue, errors }: FieldsProps) {
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
      <StringArrayFields
        control={control}
        setValue={setValue}
        name="investments"
        title="Investments"
        error={fieldError(errors, "investments")}
      />
    </>
  );
}
