import { FormTextField } from "../form-text-field";
import { fieldError } from "./field-utils";

type FieldsProps = {
  control: any;
  errors: any;
};

export function FooterFields({ control, errors }: FieldsProps) {
  return (
    <>
      <FormTextField
        control={control}
        name="tagline"
        label="Tagline"
        multiline
        error={fieldError(errors, "tagline")}
      />
      <FormTextField
        control={control}
        name="copyright"
        label="Copyright"
        error={fieldError(errors, "copyright")}
      />
    </>
  );
}
