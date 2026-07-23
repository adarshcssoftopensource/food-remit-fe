import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger size="lg" variant="secondary" className="mb-2" />

          <div className="mr-4 hidden md:block"></div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
