"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    ClipboardList,
    PlusCircle,
    Shield,
    BarChart3,
} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from "@/components/ui/sidebar";
import { SidebarHeaderWithUser } from "@/components/sidebar-header";

const links = [
    { title: "Vue d'ensemble", href: "/dashboard", icon: Home },
    { title: "Bureaux", href: "/dashboard/bureaux", icon: ClipboardList },
    { title: "Soumettre", href: "/dashboard/add", icon: PlusCircle },
    { title: "Admin", href: "/dashboard/admin", icon: Shield },
    { title: "Créer délégué", href: "/dashboard/admin/register", icon: PlusCircle },
];

export function AppSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar collapsible="icon">
            <SidebarHeaderWithUser />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {links.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.href}
                                    >
                                        <Link href={item.href}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarSeparator />
                <SidebarGroup>
                    <SidebarGroupLabel>Rapports</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/dashboard/admin">
                                        <BarChart3 />
                                        <span>Statistiques</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
