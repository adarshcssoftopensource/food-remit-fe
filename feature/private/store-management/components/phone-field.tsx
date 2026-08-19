import { Label } from "@/components/ui/label";
import PhoneInputComponent from "@/components/ui/phone-input";

export function PhoneField({
  codeValue,
  onCodeChange,
  numberValue,
  onNumberChange,
  codeError,
  numberError,
  label,
  required,
  disabled,
}: {
  codeValue: string;
  onCodeChange: (v: string) => void;
  numberValue: string;
  onNumberChange: (v: string) => void;
  codeError?: string;
  numberError?: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </Label>
      <PhoneInputComponent
        value={(codeValue || "") + (numberValue || "")}
        onChange={(val, data) => {
          if (data && data.dialCode) {
            const dialCode = data.dialCode;
            let nationalNumber = val;
            if (val.startsWith(dialCode)) {
              nationalNumber = val.slice(dialCode.length);
            }
            onCodeChange("+" + dialCode);
            onNumberChange(nationalNumber);
          } else {
            onNumberChange(val);
          }
        }}
        disabled={disabled}
        error={!!(codeError || numberError)}
      />
      {(codeError || numberError) && (
        <p className="text-xs font-medium text-red-500">{codeError || numberError}</p>
      )}
    </div>
  );
}
