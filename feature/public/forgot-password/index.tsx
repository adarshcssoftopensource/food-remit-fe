import { AuthWrapper } from "@/components/auth-wrapper";
import { ForgotPasswordForm } from "./components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthWrapper>
      <div className="w-full max-w-110 px-4">
        <ForgotPasswordForm />
      </div>
    </AuthWrapper>
  );
}
