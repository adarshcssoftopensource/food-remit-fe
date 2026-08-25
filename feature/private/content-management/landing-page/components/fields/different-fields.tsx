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
