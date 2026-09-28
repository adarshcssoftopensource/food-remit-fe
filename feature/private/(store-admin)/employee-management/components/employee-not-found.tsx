"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, User } from "lucide-react";

interface EmployeeNotFoundProps {
  onBack: () => void;
}

export function EmployeeNotFound({ onBack }: EmployeeNotFoundProps) {
  return (
    <div className="flex min-h-100 flex-col items-center justify-center space-y-4 rounded-3xl border border-dashed border-slate-200 bg-white/50 px-4 text-center dark:border-slate-800 dark:bg-slate-900/50">
      <div className="flex size-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
        <User className="size-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Employee not found</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        The employee you are looking for does not exist or has been removed.
      </p>
      <Button onClick={onBack} variant="outline">
        <ArrowLeft className="mr-2 size-4" /> Go Back
      </Button>
    </div>
  );
}
