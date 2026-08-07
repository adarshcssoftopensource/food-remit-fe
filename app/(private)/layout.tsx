import { AppSidebar } from "@/components/app-sidebar";
import { AppTopBar } from "@/components/app-topbar";
import { ProfileProvider } from "@/components/providers/profile-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProfileProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <AppTopBar />
          <div className="flex flex-1 flex-col gap-4 p-3 md:p-5">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </ProfileProvider>
  );
}
