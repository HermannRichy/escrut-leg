import { ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Logout from "@/components/sections/Logout";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <SidebarProvider>
            <div className="flex h-screen w-full overflow-hidden">
                <AppSidebar />
                <SidebarInset className="flex-1 flex flex-col overflow-hidden">
                    <header className="sticky top-0 z-10 flex items-center gap-2 border-b bg-background/80 px-4 py-3 backdrop-blur shrink-0">
                        <SidebarTrigger />
                        <div className="text-sm text-muted-foreground">
                            Tableau de bord
                        </div>
                        <div className="ml-auto">
                            <Logout />
                        </div>
                    </header>
                    <main className="flex-1 overflow-y-auto p-4 md:p-6">
                        {children}
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
