import { AppTopBar } from "@/components/app-topbar";
import { ProfileProvider } from "@/components/providers/profile-provider";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Suspense } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ImpersonationBanner } from "@/components/common/impersonation-banner";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProfileProvider>
      <SidebarProvider className="brand-mesh-canvas min-h-screen">
        <Suspense fallback={null}>
          <AppSidebar />
        </Suspense>
        <SidebarInset className="relative bg-transparent">
          <ImpersonationBanner />
          <AppTopBar />
          <div className="relative z-10 flex flex-1 flex-col gap-5 p-4 md:p-6 lg:p-7">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProfileProvider>
  );
}
