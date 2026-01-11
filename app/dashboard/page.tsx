import { checkUserRole } from "@/app/actions/check-user-role";
import { redirect } from "next/navigation";
import Logout from "@/components/sections/Logout";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
    const result = await checkUserRole();

    if (result.error) {
        redirect("/");
    }

    // Rediriger les admins vers le dashboard admin
    if (result.role === "ADMIN") {
        redirect("/dashboard/admin");
    }

    // Page pour les délégués
    return (
        <main className="container mx-auto py-8 px-4">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Tableau de bord</CardTitle>
                        <CardDescription>
                            Bienvenue sur votre tableau de bord
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col gap-4">
                            <Link href="/dashboard/add">
                                <Button className="w-full" variant="default">
                                    Soumettre/Modifier les résultats
                                </Button>
                            </Link>
                        </div>
                        <div className="pt-4 border-t">
                            <Logout />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
