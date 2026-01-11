"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function getAdminDashboard() {
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

        // Vérifier que l'utilisateur est admin
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true },
        });

        if (!user || user.role !== "ADMIN") {
            return {
                error: "Accès refusé. Cette page est réservée aux administrateurs.",
            };
        }

        // Récupérer tous les bureaux avec leurs résultats et arrondissements
        const bureaux = await prisma.bureauVote.findMany({
            include: {
                arrondissement: true,
                resultat: true,
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        // Calculer les totaux
        const resultats = bureaux
            .map((b) => b.resultat)
            .filter((r) => r !== null) as Array<{
            totalVotes: number;
            votesCandidat: number;
        }>;

        const totalVotes = resultats.reduce(
            (sum, r) => sum + r.totalVotes,
            0
        );
        const totalVotesCandidat = resultats.reduce(
            (sum, r) => sum + r.votesCandidat,
            0
        );
        const pourcentageGlobal =
            totalVotes > 0 ? (totalVotesCandidat / totalVotes) * 100 : 0;

        // Formater les données pour l'affichage
        const bureauxFormatted = bureaux.map((bureau) => ({
            id: bureau.id,
            arrondissement: bureau.arrondissement.nom,
            centreVote: bureau.centreVote,
            codeBureau: bureau.codeBureau,
            statut: bureau.resultat ? "soumis" : "non soumis",
            totalVotes: bureau.resultat?.totalVotes ?? null,
            votesCandidat: bureau.resultat?.votesCandidat ?? null,
            pvImageUrl: bureau.resultat?.pvImageUrl ?? null,
            pourcentage:
                bureau.resultat && bureau.resultat.totalVotes > 0
                    ? (bureau.resultat.votesCandidat /
                          bureau.resultat.totalVotes) *
                      100
                    : null,
        }));

        return {
            success: true,
            data: {
                totaux: {
                    totalVotes,
                    totalVotesCandidat,
                    pourcentageGlobal: Math.round(pourcentageGlobal * 100) / 100,
                },
                bureaux: bureauxFormatted,
            },
        };
    } catch (error) {
        console.error("Erreur lors de la récupération:", error);
        return {
            error: "Une erreur est survenue lors de la récupération des données.",
        };
    }
}

