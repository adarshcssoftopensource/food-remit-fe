import { ChangePasswordForm } from "@/feature/public/change-password/components/change-password-form";
import { Suspense } from "react";

function page() {
  return (
    <div className="w-full max-w-140">
      <Suspense
        fallback={
          <div className="bg-background flex items-center justify-center py-16">
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
  );
}

export default page;
