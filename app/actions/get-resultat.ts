"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function getResultat() {
    try {
        // Vérifier l'authentification
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return {
                error: "Non autorisé. Veuillez vous connecter.",
            };
        }

        // Récupérer l'utilisateur avec son bureau
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { bureauId: true },
        });

        if (!user || !user.bureauId) {
            return {
                error: "Aucun bureau de vote associé à votre compte.",
            };
        }

        // Récupérer le résultat existant
        const resultat = await prisma.resultat.findUnique({
            where: { bureauId: user.bureauId },
        });

        if (!resultat) {
            return {
                success: true,
                data: null,
            };
        }

        return {
            success: true,
            data: resultat,
        };
    } catch (error) {
        console.error("Erreur lors de la récupération:", error);
        return {
            error: "Une erreur est survenue lors de la récupération des résultats.",
        };
    }
}

