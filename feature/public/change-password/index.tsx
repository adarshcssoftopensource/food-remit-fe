import { AuthWrapper } from "@/components/auth-wrapper";
import { ChangePasswordForm } from "./components/change-password-form";
import { Suspense } from "react";

export default function ChangePasswordPage() {
  return (
    <AuthWrapper>
      <div className="w-full max-w-140 px-4">
        <Suspense
          fallback={
            <div className="bg-background flex min-h-screen items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="border-primary h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" />
                <p className="animate-pulse text-sm font-medium">Loading secure portal...</p>
              </div>
            </div>
          }
        >
          <ChangePasswordForm />
        </Suspense>
      </div>
    </AuthWrapper>
  );
}
