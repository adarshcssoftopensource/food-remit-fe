"use client";

import { useProfile } from "@/components/providers/profile-provider";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { Landmark } from "lucide-react";
import Link from "next/link";

export function BankVerificationBanner() {
  const { needsBankVerification } = useProfile();

  if (!needsBankVerification) return null;

  return (
    <div className="sticky top-0 z-50 flex w-full flex-col gap-2 border-b border-amber-300/70 bg-linear-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-white shadow-md sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-2.5 sm:items-center">
        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/15 sm:mt-0">
          <Landmark className="size-4" />
        </div>
        <div>
          <p className="text-sm font-bold tracking-tight">
            Please complete Bank Account Verification
          </p>
          <p className="text-xs text-white/90">
            You can view listings only. Create, edit, and delete are locked until you verify your
            bank account.
          </p>
        </div>
      </div>
      <Link
        href={`${ROUTES.ADMIN.PROFILE}?tab=store#bank-verification-section`}
        className="shrink-0"
        onClick={(e) => {
          const element = document.getElementById("bank-verification-section");
          if (element) {
            e.preventDefault();
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          } else {
            // It might take time to render the tab content, poll for it
            let attempts = 0;
            const interval = setInterval(() => {
              const el = document.getElementById("bank-verification-section");
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
                clearInterval(interval);
              }
              attempts++;
              if (attempts > 10) clearInterval(interval);
            }, 100);
          }
        }}
      >
        <Button
          size="sm"
          variant={"outline"}
          className="h-9 w-full rounded-xl border-0 bg-white px-4 text-xs font-bold text-amber-800 shadow-sm hover:bg-amber-50 sm:w-auto"
        >
          Verify Bank Account
        </Button>
      </Link>
    </div>
  );
}
