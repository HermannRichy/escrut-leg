import { checkUserRole } from "@/app/actions/check-user-role";
import { redirect } from "next/navigation";
import AdminRegister from "@/components/sections/AdminRegister";

export default async function AdminRegisterPage() {
    const result = await checkUserRole();

    if (result.error) {
        redirect("/");
    }

    // Vérifier que l'utilisateur est admin
    if (result.role !== "ADMIN") {
        redirect("/dashboard");
    }

    return (
        <main className="container mx-auto py-8 px-4">
            <AdminRegister />
        </main>
    );
}

