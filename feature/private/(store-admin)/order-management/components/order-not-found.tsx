"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Package } from "lucide-react";

interface OrderNotFoundProps {
  onBack: () => void;
}

export function OrderNotFound({ onBack }: OrderNotFoundProps) {
  return (
    <div className="flex h-64 flex-col items-center justify-center space-y-4">
      <Package className="size-12 text-slate-300" />
      <h2 className="text-xl font-semibold text-slate-700">Order Not Found</h2>
      <Button variant="outline" onClick={onBack}>
        <ArrowLeft className="mr-2 size-4" /> Go Back
      </Button>
    </div>
  );
}
