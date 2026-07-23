import { AuthWrapper } from "@/components/auth-wrapper";
import { ChangePasswordForm } from "./components/change-password-form";

export default function ChangePasswordPage() {
  return (
    <AuthWrapper>
      <div className="w-full max-w-140 px-4">
        <ChangePasswordForm />
      </div>
    </AuthWrapper>
  );
}
