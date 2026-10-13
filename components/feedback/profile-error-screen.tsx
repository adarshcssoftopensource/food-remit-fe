"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw, ShieldAlert, LogOut } from "lucide-react";
import { useLogout } from "@/hooks/use-logout";

interface ProfileErrorScreenProps {
  errorMessage: string;
  onRetry: () => void;
}

export function ProfileErrorScreen({ errorMessage, onRetry }: ProfileErrorScreenProps) {
  const { handleLogout, isPending: isLoggingOut } = useLogout();
  const isNetworkError = errorMessage?.toLowerCase().includes("network");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <h2 className="mt-6 text-xl font-bold tracking-tight text-slate-900">
          Failed to Load Workspace
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          {errorMessage || "There was an error retrieving your session profile."}
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Button
            onClick={onRetry}
            className="flex h-11 items-center justify-center gap-2 rounded-xl font-semibold shadow-sm"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>

          {!isNetworkError && (
            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              variant="outline"
              className="flex h-11 items-center justify-center gap-2 rounded-xl font-semibold text-slate-600 shadow-sm hover:text-slate-900"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
