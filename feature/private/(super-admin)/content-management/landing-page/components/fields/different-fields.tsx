import { ObjectArrayFields } from "../array-fields";
import { FormTextField } from "../form-text-field";
import { fieldError } from "./field-utils";

type FieldsProps = {
  control: any;
  errors: any;
};

export function DifferentFields({ control, errors }: FieldsProps) {
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
        title="Differentiators"
        emptyItem={{ unlike: "", point: "" }}
        fields={[
          { key: "unlike", label: "Unlike…" },
          { key: "point", label: "Point", multiline: true },
        ]}
        error={fieldError(errors, "items")}
      />
    </>
  );
}
