import { AppSidebar } from "@/components/app-sidebar";
import { AppTopBar } from "@/components/app-topbar";
import { ProfileProvider } from "@/components/providers/profile-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProfileProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-background relative">
          {/* Subtle branded ambient glows matching Food Remit logo (Navy + Emerald) */}
          <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
            {/* Top-Right Navy/Blue ambient glow */}
            <div className="absolute -top-24 right-0 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(14,42,75,0.07)_0%,transparent_70%)] blur-2xl dark:bg-[radial-gradient(circle,rgba(59,130,246,0.12)_0%,transparent_70%)]" />
            {/* Top-Left Emerald Green ambient glow */}
            <div className="absolute -top-20 left-10 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.08)_0%,transparent_70%)] blur-2xl dark:bg-[radial-gradient(circle,rgba(16,185,129,0.14)_0%,transparent_70%)]" />
            {/* Bottom-Center subtle blend */}
            <div className="absolute -bottom-28 left-1/3 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(14,42,75,0.04)_0%,transparent_70%)] blur-3xl dark:bg-[radial-gradient(circle,rgba(16,185,129,0.06)_0%,transparent_70%)]" />
            {/* Micro dot matrix pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(14,42,75,0.08)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_90%_70%_at_50%_0%,#000_70%,transparent_100%)] [background-size:24px_24px] opacity-60 dark:bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] dark:opacity-30" />
          </div>

          <AppTopBar />
          <div className="relative z-10 flex flex-1 flex-col gap-4 p-3 md:p-5">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </ProfileProvider>
  );
}
