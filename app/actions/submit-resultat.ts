"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function submitResultat(
    totalVotes: number,
    votesCandidat: number,
    pvImageUrl: string
) {
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
            include: { bureau: true },
        });

        if (!user || !user.bureauId) {
            return {
                error: "Aucun bureau de vote associé à votre compte.",
            };
        }

        // Validation : votesCandidat ≤ totalVotes
        if (votesCandidat > totalVotes) {
            return {
                error: "Le nombre de votes du candidat ne peut pas être supérieur au total des votes.",
            };
        }

        // Validation : nombres positifs
        if (totalVotes < 0 || votesCandidat < 0) {
            return {
                error: "Les nombres de votes doivent être positifs.",
            };
        }

        // Créer ou mettre à jour le résultat (écrasable)
        const resultat = await prisma.resultat.upsert({
            where: { bureauId: user.bureauId },
            update: {
                totalVotes,
                votesCandidat,
                pvImageUrl,
                updatedAt: new Date(),
            },
            create: {
                bureauId: user.bureauId,
                totalVotes,
                votesCandidat,
                pvImageUrl,
            },
        });

        revalidatePath("/dashboard/add");

        return {
            success: true,
            data: resultat,
        };
    } catch (error) {
        console.error("Erreur lors de la soumission:", error);
        return {
            error: "Une erreur est survenue lors de la soumission des résultats.",
        };
    }
}

