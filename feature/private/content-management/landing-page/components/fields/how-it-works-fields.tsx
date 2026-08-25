import { ObjectArrayFields } from "../array-fields";
import { FormTextField } from "../form-text-field";
import { fieldError } from "./field-utils";

type FieldsProps = {
  control: any;
  errors: any;
};

export function HowItWorksFields({ control, errors }: FieldsProps) {
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
      <ObjectArrayFields
        control={control}
        name="steps"
        title="Steps"
        emptyItem={{ step: "", title: "", description: "" }}
        fields={[
          { key: "step", label: "Step number" },
          { key: "title", label: "Title" },
          { key: "description", label: "Description", multiline: true },
        ]}
        error={fieldError(errors, "steps")}
      />
    </>
  );
}
