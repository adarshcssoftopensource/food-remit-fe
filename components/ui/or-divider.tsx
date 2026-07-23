import React from "react";

interface OrDividerProps {
  text?: string;
  className?: string;
}

const OrDivider: React.FC<OrDividerProps> = ({ text = "or", className = "" }) => {
  return (
    <div className={`relative my-2 ${className}`}>
      <div className="absolute inset-0 flex items-center">
        <span className="border-gray-150 w-full border-t" />
      </div>
      <div className="relative flex justify-center">
        <span className="px-3 text-xs font-medium">{text}</span>
      </div>
    </div>
  );
};

export default OrDivider;
