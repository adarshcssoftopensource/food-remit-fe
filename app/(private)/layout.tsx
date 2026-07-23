import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background/95 border-border/50 sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b px-4 shadow-sm backdrop-blur-sm">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors" />
          <div className="bg-border/60 h-4 w-px" />
          <div className="flex-1" />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-5">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
