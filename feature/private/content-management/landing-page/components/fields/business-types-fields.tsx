import { StringArrayFields } from "../array-fields";
import { FormTextField } from "../form-text-field";
import { fieldError } from "./field-utils";

type FieldsProps = {
  control: any;
  setValue?: any;
  errors: any;
};

export function BusinessTypesFields({ control, setValue, errors }: FieldsProps) {
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
        error={fieldError(errors, "description")}
      />
      <StringArrayFields
        control={control}
        setValue={setValue}
        name="types"
        title="Types"
        error={fieldError(errors, "types")}
      />
    </>
  );
}
