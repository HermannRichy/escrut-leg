"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function getCurrentUser() {
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
            select: {
                name: true,
                email: true,
                image: true,
                role: true,
            },
        });

        if (!user) {
            return {
                error: "Utilisateur non trouvé.",
            };
        }

        return {
            success: true,
            user: {
                name: user.name,
                email: user.email,
                image: user.image,
                role: user.role,
            },
        };
    } catch (error) {
        console.error("Erreur lors de la récupération:", error);
        return {
            error: "Une erreur est survenue.",
        };
    }
}

