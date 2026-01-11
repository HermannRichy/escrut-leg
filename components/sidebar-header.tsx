"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/app/actions/get-current-user";
import {
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function SidebarHeaderWithUser() {
    const [user, setUser] = useState<{
        name: string;
        email: string;
        image: string | null;
        role: string;
    } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const result = await getCurrentUser();
                if (result.success && result.user) {
                    setUser(result.user);
                }
            } catch (error) {
                console.error(
                    "Erreur lors du chargement de l'utilisateur:",
                    error
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    if (isLoading) {
        return (
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <div className="flex items-center gap-2 px-2 py-1.5 w-full">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <div className="flex flex-col items-start gap-1 flex-1">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
        );
    }

    if (!user) {
        return (
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <User />
                            <span>Utilisateur</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
        );
    }

    const { name, email, image, role } = user;

    // Obtenir les initiales du nom
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        size="lg"
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground w-full"
                    >
                        <Avatar className="h-8 w-8 shrink-0">
                            {image && <AvatarImage src={image} alt={name} />}
                            <AvatarFallback className="text-xs">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start gap-0.5 min-w-0 flex-1 text-left overflow-hidden">
                            <span className="text-sm font-semibold truncate w-full">
                                {name}
                            </span>
                            <Badge
                                variant="secondary"
                                className="text-xs mt-0.5 shrink-0"
                            >
                                {role === "ADMIN"
                                    ? "Administrateur"
                                    : "Délégué"}
                            </Badge>
                        </div>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>
    );
}
