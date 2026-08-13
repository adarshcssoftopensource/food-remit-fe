"use client";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface PhoneInputComponentProps {
  value: string;
  onChange: (value: string, data?: any) => void;
  onBlur?: () => void;
  error?: boolean;
  disabled?: boolean;
}

export function PhoneInputComponent({
  value,
  onChange,
  onBlur,
  error,
  disabled,
}: PhoneInputComponentProps) {
  return (
    <div
      className={`rounded-xl border bg-gray-50/50 transition-colors ${
        error
          ? "border-red-400 bg-red-50 focus-within:border-red-400"
          : "border-gray-200/80 focus-within:border-[#1B3A8C] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(27,58,140,0.1)]"
      } ${disabled ? "pointer-events-none cursor-not-allowed opacity-60" : ""}`}
    >
      <PhoneInput
        country="in"
        value={value}
        onChange={(val, data) => onChange(val, data)}
        onBlur={onBlur}
        disabled={disabled}
        enableSearch
        searchPlaceholder="Search country..."
        searchStyle={{
          width: "calc(100% - 16px)",
          margin: "0 8px 4px",
          padding: "6px 10px",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          fontSize: "13px",
          outline: "none",
        }}
        containerStyle={{
          width: "100%",
          background: "transparent",
          position: "relative",
        }}
        inputStyle={{
          width: "100%",
          height: "48px",
          border: "none",
          borderRadius: "12px",
          background: "transparent",
          fontSize: "14px",
          paddingLeft: "56px",
          outline: "none",
          boxShadow: "none",
          color: "#1e293b",
        }}
        buttonStyle={{
          border: "none",
          borderRadius: "12px 0 0 12px",
          background: "transparent",
          borderRight: "1px solid #e2e8f0",
          paddingInline: "10px",
        }}
        dropdownStyle={{
          position: "absolute",
          borderRadius: "12px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.14)",
          border: "1px solid #e2e8f0",
          zIndex: 99999,
          maxHeight: "260px",
          overflowY: "auto",
          background: "#fff",
        }}
      />
    </div>
  );
}
export default PhoneInputComponent;
