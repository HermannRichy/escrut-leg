"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

// Types de retour typés
export type CreateUserResult =
    | { success: true; userId: string }
    | { error: string; fieldErrors?: Record<string, string[]> };

type BetterAuthResult =
    | { error: { message: string } }
    | { token: string | null; user: any };

export async function createUser(
    name: string,
    email: string,
    password: string,
    bureauId?: string
): Promise<CreateUserResult> {
    try {
        // 1. Vérifier l'authentification admin
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return {
                error: "Non autorisé. Veuillez vous connecter.",
            };
        }

        const adminUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true },
        });

        if (!adminUser || adminUser.role !== "ADMIN") {
            return {
                error: "Accès refusé. Cette action est réservée aux administrateurs.",
            };
        }

        // 2. Vérifier si email existe déjà
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return {
                error: "Cet email est déjà utilisé.",
            };
        }

        // 3. Vérifier le bureau si fourni
        let bureau = null;
        if (bureauId) {
            bureau = await prisma.bureauVote.findUnique({
                where: { id: bureauId },
                include: { delegue: true },
            });

            if (!bureau) {
                return {
                    error: "Le bureau de vote sélectionné n'existe pas.",
                };
            }

            if (bureau.delegue) {
                return {
                    error: "Ce bureau de vote est déjà assigné à un délégué.",
                };
            }
        }

        // 4. ✅ Créer l'utilisateur via Better Auth (CÔTÉ SERVEUR)
        const authResult = await auth.api.signUpEmail({
            body: {
                name,
                email,
                password,
            },
        });

        if (authResult && "error" in authResult) {
            const errorMessage =
                "message" in (authResult.error as any)
                    ? (authResult.error as any).message
                    : "Échec Better Auth";

            return { error: errorMessage };
        }

        // 5. Récupérer l'utilisateur créé (via email unique)
        const newUser = await prisma.user.findUnique({
            where: { email },
        });

        if (!newUser) {
            console.error("User not found after Better Auth creation");
            return {
                error: "Utilisateur non trouvé après création via Better Auth.",
            };
        }

        // 6. Assigner bureau + role DÉLÉGUÉ si bureau fourni
        if (bureauId && bureau) {
            await prisma.$transaction([
                // Mettre à jour l'utilisateur
                prisma.user.update({
                    where: { id: newUser.id },
                    data: {
                        bureauId: bureauId,
                        role: "DELEGUE", // Role par défaut pour les délégués créés par admin
                    },
                }),
                // Assigner au bureau
                prisma.bureauVote.update({
                    where: { id: bureauId },
                    data: {
                        delegueId: newUser.id,
                    },
                }),
            ]);
        } else {
            // User sans bureau → juste role DÉLÉGUÉ
            await prisma.user.update({
                where: { id: newUser.id },
                data: {
                    role: "DELEGUE",
                },
            });
        }

        console.log(
            `✅ User créé: ${newUser.id} (${email}) ${
                bureauId ? `→ Bureau ${bureauId}` : ""
            }`
        );

        return {
            success: true,
            userId: newUser.id,
        };
    } catch (error: any) {
        console.error("Erreur createUser:", error);

        // Prisma unique constraint violation
        if (error.code === "P2002") {
            return {
                error: "Cet email est déjà utilisé par un autre compte.",
            };
        }

        // Better Auth erreurs spécifiques
        if (error.status === 422) {
            return {
                error: "Données invalides. Vérifiez votre saisie.",
            };
        }

        return {
            error: "Une erreur inattendue est survenue lors de la création.",
        };
    }
}
