"use client";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { LogoutButton } from "./logout-button";

interface AccessDeniedScreenProps {
  hasDashboardAccess: boolean;
}

export function AccessDeniedScreen({ hasDashboardAccess }: AccessDeniedScreenProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-8 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
        <ShieldAlert className="h-8 w-8" />
      </div>

      <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">Access Denied</h1>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        You do not have the required permissions to view this page. If you believe this is an error,
        please contact your System Administrator.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        {hasDashboardAccess ? (
          <>
            <Button
              onClick={() => router.push(ROUTES.ADMIN.DASHBOARD)}
              className="h-11 rounded-xl px-6 font-semibold shadow-sm"
            >
              Go to Dashboard
            </Button>

            <Button
              variant="outline"
              onClick={() => router.back()}
              className="h-11 rounded-xl px-6 font-semibold text-slate-600"
            >
              Go Back
            </Button>

            <LogoutButton />
          </>
        ) : (
          <LogoutButton />
        )}
      </div>
    </div>
  );
}
