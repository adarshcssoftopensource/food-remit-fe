import { ObjectArrayFields } from "../array-fields";
import { FormTextField } from "../form-text-field";
import { fieldError } from "./field-utils";

type FieldsProps = {
  control: any;
  errors: any;
};

export function BenefitsFields({ control, errors }: FieldsProps) {
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
      <ObjectArrayFields
        control={control}
        name="items"
        title="Benefits"
        emptyItem={{ title: "", description: "" }}
        fields={[
          { key: "title", label: "Title" },
          { key: "description", label: "Description", multiline: true },
        ]}
        error={fieldError(errors, "items")}
      />
    </>
  );
}
