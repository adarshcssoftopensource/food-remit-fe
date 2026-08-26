import { ObjectArrayFields } from "../array-fields";
import { FormTextField } from "../form-text-field";
import { fieldError } from "./field-utils";

type FieldsProps = {
  control: any;
  errors: any;
};

export function FaqFields({ control, errors }: FieldsProps) {
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
        title="FAQs"
        emptyItem={{ question: "", answer: "" }}
        fields={[
          { key: "question", label: "Question" },
          { key: "answer", label: "Answer", multiline: true },
        ]}
        error={fieldError(errors, "items")}
      />
    </>
  );
}
