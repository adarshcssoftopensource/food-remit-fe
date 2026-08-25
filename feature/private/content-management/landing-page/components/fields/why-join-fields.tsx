import { StringArrayFields } from "../array-fields";
import { FormTextField } from "../form-text-field";
import { fieldError } from "./field-utils";

type FieldsProps = {
  control: any;
  setValue?: any;
  errors: any;
};

export function WhyJoinFields({ control, setValue, errors }: FieldsProps) {
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
      <FormTextField
        control={control}
        name="highlight"
        label="Highlight"
        multiline
        error={fieldError(errors, "highlight")}
      />
      <StringArrayFields
        control={control}
        setValue={setValue}
        name="points"
        title="Points"
        error={fieldError(errors, "points")}
      />
    </>
  );
}
