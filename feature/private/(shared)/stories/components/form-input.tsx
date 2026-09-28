import { FieldError, FieldLabel } from "@/components/ui/field";

export function FormInput({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel className="text-sm font-semibold">{label}</FieldLabel>
      {children}
      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}
