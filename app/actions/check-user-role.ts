"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function checkUserRole() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return {
                error: "Non autorisé. Veuillez vous connecter.",
            };
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true },
        });

        if (!user) {
            return {
                error: "Utilisateur non trouvé.",
            };
        }

        return {
            success: true,
            role: user.role,
        };
    } catch (error) {
        console.error("Erreur lors de la vérification:", error);
        return {
            error: "Une erreur est survenue.",
        };
    }
}

