export function FormFieldError({ message }: { message?: string }) {
  return message ? <p className="mt-1 text-xs font-medium text-red-500">{message}</p> : null;
}
