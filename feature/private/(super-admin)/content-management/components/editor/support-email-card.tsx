"use client";

import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SupportEmailCardProps {
  contactEmail: string;
  onContactEmailChange: (value: string) => void;
  onSaveEmail: () => void;
  isSaving: boolean;
  isPending: boolean;
}

const inputClass =
  "h-11 rounded-xl border-gray-200/80 bg-gray-50/50 text-sm transition-colors hover:border-gray-300 hover:bg-gray-50 focus-visible:border-primary focus-visible:bg-white focus-visible:ring-primary/20";

export function SupportEmailCard({
  contactEmail,
  onContactEmailChange,
  onSaveEmail,
  isSaving,
  isPending,
}: SupportEmailCardProps) {
  return (
    <Card className="rounded-2xl border-slate-200/80 shadow-xs">
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shadow-xs">
              <Mail className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Customer Support &amp; Compliance Email
              </h3>
              <p className="text-xs text-slate-500">
                Displayed to mobile &amp; web users: &quot;Questions? {contactEmail}&quot;
              </p>
            </div>
          </div>

          <div className="flex w-full items-center gap-2 sm:max-w-md">
            <Input
              value={contactEmail}
              onChange={(e) => onContactEmailChange(e.target.value)}
              placeholder="e.g. compliance@foodremit.com"
              className={cn(inputClass, "w-full")}
            />
            <Button
              type="button"
              variant="outline"
              className="h-11 shrink-0 rounded-xl border-slate-300 font-semibold"
              disabled={isSaving || isPending}
              isLoading={isSaving}
              onClick={onSaveEmail}
            >
              Save Email
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
