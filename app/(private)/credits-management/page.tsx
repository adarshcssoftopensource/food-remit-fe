import { Metadata } from "next";
import { Suspense } from "react";
import { CreditsManagement } from "@/feature/private/credits-management";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Credits Management | Food Remit",
  description: "Manage out-of-stock item refunds and settlement payouts.",
};

export default function CreditsManagementPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="text-primary size-8 animate-spin" />
        </div>
      }
    >
      <CreditsManagement />
    </Suspense>
  );
}
