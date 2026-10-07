"use client";

import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
  "aria-label"?: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled,
  size = "md",
  className,
  "aria-label": ariaLabel = "Quantity",
}: QuantityStepperProps) {
  const clamp = (next: number) => Math.min(max, Math.max(min, next));
  const buttonClass = cn(
    "flex items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-white hover:text-primary disabled:pointer-events-none disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-700",
    size === "sm" ? "size-7" : "size-8",
  );

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-xl bg-slate-100 p-0.5 ring-1 ring-slate-200/70 dark:bg-slate-800 dark:ring-slate-700",
        className,
      )}
    >
      <button
        type="button"
        className={buttonClass}
        onClick={() => onChange(clamp(value - 1))}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
      >
        <Minus className="size-3.5" strokeWidth={2.5} />
      </button>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, "");
          if (digits) onChange(clamp(Number(digits)));
        }}
        className={cn(
          "bg-transparent text-center font-bold text-slate-900 tabular-nums outline-none dark:text-white",
          size === "sm" ? "w-7 text-xs" : "w-9 text-sm",
        )}
      />
      <button
        type="button"
        className={buttonClass}
        onClick={() => onChange(clamp(value + 1))}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
      >
        <Plus className="size-3.5" strokeWidth={2.5} />
      </button>
    </div>
  );
}
