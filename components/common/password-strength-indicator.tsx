import { PASSWORD_CRITERIA } from "@/constants/password";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle } from "lucide-react";

type PasswordStrengthIndicatorProps = {
  password: string;
  className?: string;
};

export function PasswordStrengthIndicator({ password, className }: PasswordStrengthIndicatorProps) {
  if (!password) return null;

  return (
    <div className={cn("mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4", className)}>
      <p className="mb-3 text-sm font-semibold text-slate-700">Password Requirements</p>

      <div className="space-y-2">
        {PASSWORD_CRITERIA.map((item) => {
          const met = item.test(password);

          return (
            <div key={item.label} className="flex items-center gap-2">
              {met ? (
                <CheckCircle2 className="size-4 text-green-600" />
              ) : (
                <XCircle className="size-4 text-red-500" />
              )}

              <span
                className={cn("text-sm font-medium", met ? "text-green-700" : "text-slate-500")}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
