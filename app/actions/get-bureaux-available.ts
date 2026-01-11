"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function getBureauxAvailable() {
    try {
        // Vérifier l'authentification et le rôle admin
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return {
                error: "Non autorisé. Veuillez vous connecter.",
            };
        }

        // Vérifier que l'utilisateur est admin
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true },
        });

        if (!user || user.role !== "ADMIN") {
            return {
                error: "Accès refusé. Cette action est réservée aux administrateurs.",
            };
        }

        // Récupérer tous les bureaux sans délégué assigné
        const bureaux = await prisma.bureauVote.findMany({
            where: {
                delegueId: null,
            },
            include: {
                arrondissement: true,
            },
            orderBy: {
                codeBureau: "asc",
            },
        });

        return {
            success: true,
            bureaux: bureaux.map((bureau) => ({
                id: bureau.id,
                label: `${bureau.codeBureau} - ${bureau.centreVote} (${bureau.arrondissement.nom})`,
                codeBureau: bureau.codeBureau,
                centreVote: bureau.centreVote,
                arrondissement: bureau.arrondissement.nom,
            })),
        };
    } catch (error) {
        console.error("Erreur lors de la récupération:", error);
        return {
            error: "Une erreur est survenue lors de la récupération des bureaux.",
        };
    }
}

