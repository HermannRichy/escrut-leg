import prisma from "@/lib/prisma";
import { BureauxPageClient } from "./page-client";

export default async function BureauxPage() {
    const bureaux = await prisma.bureauVote.findMany({
        include: {
            arrondissement: true,
            resultat: {
                select: {
                    pvImageUrl: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <main className="container mx-auto py-8 px-4">
            <BureauxPageClient bureaux={bureaux} />
        </main>
    );
}

