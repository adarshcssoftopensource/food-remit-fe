"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SmartNumberInputProps {
  value: number | undefined;
  onChange: (val: number | undefined) => void;
  onBlur?: () => void;
  min?: number;
  max?: number;
  step?: number | "any";
  placeholder?: string;
  className?: string;
  id?: string;
  name?: string;
}

export function SmartNumberInput({
  value,
  onChange,
  onBlur,
  placeholder = "0",
  className,
  id,
  name,
}: SmartNumberInputProps) {
  // When editing, we store the user's typed string.
  // When not editing (blurred), editingText is null and displayValue derives directly from `value`.
  // This avoids calling setState in an effect and eliminates cascading renders.
  const [editingText, setEditingText] = useState<string | null>(null);

  const displayValue =
    editingText !== null
      ? editingText
      : value === undefined || value === null
        ? "0"
        : String(value);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (value === 0 || value === undefined || value === null || displayValue === "0") {
      setEditingText("");
      onChange(undefined);
    } else {
      setEditingText(String(value));
      e.currentTarget.select();
    }
  };

  const handleClick = () => {
    if (displayValue === "0" || value === 0 || value === undefined || value === null) {
      setEditingText("");
      onChange(undefined);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, "");
    setEditingText(raw);
    if (raw === "") {
      onChange(undefined);
    } else {
      const num = Number(raw);
      onChange(isNaN(num) ? undefined : num);
    }
  };

  const handleBlur = () => {
    const current = editingText;
    setEditingText(null);
    onBlur?.();

    if (current === "" || current === null || current === undefined) {
      onChange(0);
    } else {
      const num = Number(current);
      if (!isNaN(num)) {
        onChange(num);
      } else {
        onChange(0);
      }
    }
  };

  return (
    <Input
      id={id}
      name={name}
      type="text"
      inputMode="decimal"
      placeholder={placeholder}
      value={displayValue}
      onFocus={handleFocus}
      onClick={handleClick}
      onChange={handleChange}
      onBlur={handleBlur}
      className={cn("h-11 w-full rounded-xl text-xs font-bold", className)}
    />
  );
}
