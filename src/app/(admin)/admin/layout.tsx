import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "./_components/admin-sidebar";
import { AdminHeader } from "./_components/admin-header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AdminHeader />
        <div className="flex flex-1 flex-col gap-4 pt-0 bg-background">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
