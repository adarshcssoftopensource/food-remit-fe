import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-xl border border-slate-200/80 bg-white/70 px-3 py-1.5 text-sm text-slate-900 shadow-xs backdrop-blur-md transition-all outline-none",
        "placeholder:text-slate-400",
        "hover:border-slate-300",
        "focus-visible:border-emerald-500 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-emerald-500/20",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-red-500 aria-invalid:ring-red-500/20",
        "dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-700 dark:focus-visible:border-emerald-500 dark:focus-visible:bg-slate-900",
        className,
      )}
      onKeyDown={(e) => {
        const value = e.currentTarget.value;
        if (e.key === " " && value.length === 0) {
          e.preventDefault();
        }
      }}
      {...props}
    />
  );
}

export { Input };
