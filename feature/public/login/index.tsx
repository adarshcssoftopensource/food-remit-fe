import { AuthWrapper } from "@/components/auth-wrapper";
import { LoginForm } from "./components/login-form";

export default function LoginPage() {
  return (
    <AuthWrapper>
      <div className="w-full max-w-110 px-4">
        <LoginForm />
      </div>
    </AuthWrapper>
  );
}
