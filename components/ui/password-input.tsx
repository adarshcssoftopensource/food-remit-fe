"use client";

import * as React from "react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface PasswordInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  toggleId?: string;
  leftIcon?: React.ReactNode;
  isInvalid?: boolean;
}

function PasswordInput({
  id,
  toggleId,
  leftIcon,
  isInvalid,
  className,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      {leftIcon && (
        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
          {leftIcon}
        </span>
      )}

      <Input
        {...props}
        id={id}
        type={visible ? "text" : "password"}
        aria-invalid={isInvalid}
        className={cn(
          "h-12 rounded-xl border-gray-200/80 bg-gray-50/50 text-sm transition-all duration-300 placeholder:text-gray-400/80",
          "hover:border-gray-300 hover:bg-gray-50",
          "focus-visible:border-[#1B3A8C] focus-visible:bg-white focus-visible:shadow-[0_0_0_4px_rgba(27,58,140,0.1)] focus-visible:ring-[#1B3A8C]/20",
          leftIcon ? "pl-10" : "pl-3",
          "pr-11",
          isInvalid &&
            "border-red-400 bg-red-50 focus-visible:border-red-400 focus-visible:shadow-[0_0_0_4px_rgba(248,113,113,0.1)] focus-visible:ring-red-400/15",
          className,
        )}
      />

      <button
        type="button"
        id={toggleId ?? (id ? `${id}-toggle` : undefined)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-controls={id}
        onClick={() => setVisible((v) => !v)}
        className="hover:text-primary absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded text-gray-400 transition-colors focus-visible:ring-2 focus-visible:ring-[#1B3A8C]/40 focus-visible:outline-none"
      >
        {visible ? (
          <EyeOff className="size-4" aria-hidden />
        ) : (
          <Eye className="size-4" aria-hidden />
        )}
      </button>
    </div>
  );
}

export { PasswordInput };
