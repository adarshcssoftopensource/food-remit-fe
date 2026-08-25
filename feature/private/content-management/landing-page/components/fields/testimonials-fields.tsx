import { ObjectArrayFields } from "../array-fields";
import { FormTextField } from "../form-text-field";
import { fieldError } from "./field-utils";

type FieldsProps = {
  control: any;
  errors: any;
};

export function TestimonialsFields({ control, errors }: FieldsProps) {
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
        title="Testimonials"
        emptyItem={{ quote: "", name: "", role: "" }}
        fields={[
          { key: "quote", label: "Quote", multiline: true },
          { key: "name", label: "Name" },
          { key: "role", label: "Role" },
        ]}
        error={fieldError(errors, "items")}
      />
    </>
  );
}
