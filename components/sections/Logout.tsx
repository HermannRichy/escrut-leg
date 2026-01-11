"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Logout() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await authClient.signOut();
            toast.success("Déconnexion réussie");
            router.push("/");
            router.refresh();
        } catch (error) {
            toast.error("Erreur lors de la déconnexion");
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">Se déconnecter</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Confirmer la déconnexion
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Voulez-vous vraiment vous déconnecter ? Vous devrez vous
                        reconnecter pour accéder à nouveau à votre compte.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>
                        Se déconnecter
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
