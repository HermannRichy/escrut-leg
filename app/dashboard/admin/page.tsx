import { getAdminDashboard } from "@/app/actions/get-admin-dashboard";
import { AdminDashboardClient } from "./page-client";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
    const result = await getAdminDashboard();

    if (result.error) {
        if (result.error.includes("Accès refusé")) {
            redirect("/dashboard");
        }
        return (
            <main className="container mx-auto py-8 px-4">
                <div className="text-center text-destructive">
                    {result.error}
                </div>
            </main>
        );
    }

    if (!result.data) {
        return (
            <main className="container mx-auto py-8 px-4">
                <div className="text-center text-muted-foreground">
                    Aucune donnée disponible.
                </div>
            </main>
        );
    }

    const { totaux, bureaux } = result.data;

    return (
        <main className="container mx-auto py-8 px-4">
            <AdminDashboardClient totaux={totaux} bureaux={bureaux} />
        </main>
    );
}

