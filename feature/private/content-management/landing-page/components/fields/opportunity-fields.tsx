import { ObjectArrayFields } from "../array-fields";
import { FormTextField } from "../form-text-field";
import { fieldError } from "./field-utils";

type FieldsProps = {
  control: any;
  errors: any;
};

export function OpportunityFields({ control, errors }: FieldsProps) {
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
        name="stories"
        title="Stories"
        emptyItem={{ from: "", habit: "", for: "" }}
        fields={[
          { key: "from", label: "From city" },
          { key: "habit", label: "Habit" },
          { key: "for", label: "For" },
        ]}
        error={fieldError(errors, "stories")}
      />
      <FormTextField
        control={control}
        name="closing"
        label="Closing line"
        multiline
        error={fieldError(errors, "closing")}
      />
    </>
  );
}
