import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
    try {
        // Vérifier l'authentification
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json(
                { error: "Aucun fichier fourni" },
                { status: 400 }
            );
        }

        // Vérifier le type de fichier (images uniquement)
        if (!file.type.startsWith("image/")) {
            return NextResponse.json(
                { error: "Le fichier doit être une image" },
                { status: 400 }
            );
        }

        // Vérifier la taille (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json(
                { error: "Le fichier est trop volumineux (max 10MB)" },
                { status: 400 }
            );
        }

        // Upload vers Vercel Blob
        const blob = await put(`pv/${Date.now()}-${file.name}`, file, {
            access: "public",
        });

        return NextResponse.json({ url: blob.url });
    } catch (error) {
        console.error("Erreur lors de l'upload:", error);
        return NextResponse.json(
            { error: "Erreur lors de l'upload du fichier" },
            { status: 500 }
        );
    }
}

