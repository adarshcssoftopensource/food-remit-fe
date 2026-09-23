import { ProfilePage } from "@/feature/private/profile";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ProfilePage />
    </Suspense>
  );
}
