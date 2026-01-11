// prisma/seed.ts
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Les 133 bureaux (extrait de tes données)
const bureauxData = [
    // KOUARFA (24 bureaux) - 2661 à 2684
    {
        id: 2661,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "KOUARFA",
        centre: "BOUYAGNINDI",
        bureau: "EPP BOUYAGNINDI",
        code: "PV01",
    },
    {
        id: 2662,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "KOUARFA",
        centre: "BOUYAGNINDI",
        bureau: "EPP BOUYAGNINDI",
        code: "PV02",
    },
    {
        id: 2663,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "KOUARFA",
        centre: "KOUARFA",
        bureau: "BUREAU ARRONDISSEMENT",
        code: "PV01",
    },
    {
        id: 2664,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "KOUARFA",
        centre: "KOUARFA",
        bureau: "CEG KOUARFA",
        code: "PV01",
    },
    {
        id: 2665,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "KOUARFA",
        centre: "KOUARFA",
        bureau: "EP PRIVEE NOUVELLE ARCHE",
        code: "PV01",
    },
    {
        id: 2666,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "KOUARFA",
        centre: "KOUARFA",
        bureau: "EPP KOUARFA",
        code: "PV01",
    },
    {
        id: 2667,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "KOUARFA",
        centre: "KOUARFA",
        bureau: "EPP KOUARFA",
        code: "PV02",
    },
    {
        id: 2668,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "KOUARFA",
        centre: "KOUBA",
        bureau: "EPP KOUBA",
        code: "PV01",
    },
    {
        id: 2669,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "KOUARFA",
        centre: "KOUBA",
        bureau: "EPP KOUBA",
        code: "PV02",
    },
    {
        id: 2670,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "KOUARFA",
        centre: "KOUBA",
        bureau: "MAISON DES JEUNES",
        code: "PV01",
    },
    {
        id: 2671,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "KOUARFA",
        centre: "MOUNOUMBORIFA",
        bureau: "EPP MOUNOUBORIFA",
        code: "PV01",
    },
    {
        id: 2672,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "KOUARFA",
        centre: "PEPERKOU",
        bureau: "EPP PEPERKOU",
        code: "PV01",
    },
    {
        id: 2673,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "KOUARFA",
        centre: "PEPERKOU",
        bureau: "EPP PEPERKOU",
        code: "PV02",
    },
    {
        id: 2674,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "KOUARFA",
        centre: "TAKISSARI",
        bureau: "EPP TAKISSARI",
        code: "PV01",
    },
    {
        id: 2675,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "KOUARFA",
        centre: "TAKISSARI",
        bureau: "EPP TAKISSARI",
        code: "PV02",
    },
    {
        id: 2676,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "KOUARFA",
        centre: "TAMPOBRE",
        bureau: "EPP TAMPOBRE 1",
        code: "PV01",
    },
    {
        id: 2677,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "KOUARFA",
        centre: "TAMPOBRE",
        bureau: "EPP TAMPOBRE 1",
        code: "PV02",
    },
    {
        id: 2678,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "KOUARFA",
        centre: "TAMPOBRE",
        bureau: "EPP TAMPOBRE 1",
        code: "PV03",
    },
    {
        id: 2679,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "KOUARFA",
        centre: "TANDAFA",
        bureau: "EPP TANDAFA",
        code: "PV01",
    },
    {
        id: 2680,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "KOUARFA",
        centre: "TANDAFA",
        bureau: "EPP TANDAFA",
        code: "PV02",
    },
    {
        id: 2681,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "KOUARFA",
        centre: "TANKOKONA",
        bureau: "EPP TANKOKONA",
        code: "PV01",
    },
    {
        id: 2682,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "KOUARFA",
        centre: "TCHOUNDEKOU",
        bureau: "EPP TCHOUNDEKOU",
        code: "PV01",
    },
    {
        id: 2683,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "KOUARFA",
        centre: "WABOU",
        bureau: "EPP WABOU",
        code: "PV01",
    },
    {
        id: 2684,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "KOUARFA",
        centre: "WABOU",
        bureau: "EPP WABOU",
        code: "PV02",
    },

    // TAMPEGRE (20 bureaux) - 2685 à 2704
    {
        id: 2685,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TAMPEGRE",
        centre: "BATITAMOU",
        bureau: "EPP BATITAMOU",
        code: "PV01",
    },
    {
        id: 2686,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TAMPEGRE",
        centre: "DIKOKORE",
        bureau: "EPP DIKOKORE",
        code: "PV01",
    },
    {
        id: 2687,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TAMPEGRE",
        centre: "KOKOTA",
        bureau: "EPP KOKOTA",
        code: "PV01",
    },
    {
        id: 2688,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TAMPEGRE",
        centre: "MAKO",
        bureau: "EPP MAKO",
        code: "PV01",
    },
    {
        id: 2689,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TAMPEGRE",
        centre: "NABAGA",
        bureau: "EPP NABAGA",
        code: "PV01",
    },
    {
        id: 2690,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TAMPEGRE",
        centre: "NABAGA",
        bureau: "EPP NABAGA",
        code: "PV02",
    },
    {
        id: 2691,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TAMPEGRE",
        centre: "TAMPEGRE",
        bureau: "BUREAU ARRONDISSEMENT",
        code: "PV01",
    },
    {
        id: 2692,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TAMPEGRE",
        centre: "TAMPEGRE",
        bureau: "EPP TAMPEGRE II",
        code: "PV01",
    },
    {
        id: 2693,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TAMPEGRE",
        centre: "TAMPEGRE",
        bureau: "EPP TAMPEGRE II",
        code: "PV02",
    },
    {
        id: 2694,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TAMPEGRE",
        centre: "TAMPEGRE",
        bureau: "EPP TAMPEGRE II",
        code: "PV03",
    },
    {
        id: 2695,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TAMPEGRE",
        centre: "TAMPEGRE",
        bureau: "MAISON DES JEUNES",
        code: "PV01",
    },
    {
        id: 2696,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TAMPEGRE",
        centre: "TANTOUGOU",
        bureau: "EPP TANTOUGOU",
        code: "PV01",
    },
    {
        id: 2697,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TAMPEGRE",
        centre: "TANTOUGOU",
        bureau: "EPP TANTOUGOU",
        code: "PV02",
    },
    {
        id: 2698,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TAMPEGRE",
        centre: "TCHANHORTA",
        bureau: "EPP DITAPO",
        code: "PV01",
    },
    {
        id: 2699,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TAMPEGRE",
        centre: "TCHANHORTA",
        bureau: "EPP TCHANHORTA",
        code: "PV01",
    },
    {
        id: 2700,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TAMPEGRE",
        centre: "WANSOKOU",
        bureau: "EPP MAKO",
        code: "PV01",
    },
    {
        id: 2701,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TAMPEGRE",
        centre: "WANSOKOU",
        bureau: "EPP TANTAGA II",
        code: "PV01",
    },
    {
        id: 2702,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TAMPEGRE",
        centre: "WANSOKOU",
        bureau: "EPP WANSOKOU",
        code: "PV01",
    },
    {
        id: 2703,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TAMPEGRE",
        centre: "WANSOKOU",
        bureau: "MAISON DES JEUNES",
        code: "PV01",
    },
    {
        id: 2704,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TAMPEGRE",
        centre: "WANSOKOU",
        bureau: "MAISON DES JEUNES",
        code: "PV02",
    },

    // TOUKOUNTOUNA (29 bureaux) - 2705 à 2733
    {
        id: 2705,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TOUKOUNTOUNA",
        centre: "BORIBANSIFA",
        bureau: "EPP BORIBANSIFA",
        code: "PV01",
    },
    {
        id: 2706,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TOUKOUNTOUNA",
        centre: "BORIBANSIFA",
        bureau: "EPP BORIBANSIFA",
        code: "PV02",
    },
    {
        id: 2707,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TOUKOUNTOUNA",
        centre: "BORIBANSIFA",
        bureau: "EPP YINRIBOUNDE",
        code: "PV01",
    },
    {
        id: 2708,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TOUKOUNTOUNA",
        centre: "DATAKOU",
        bureau: "EPP DATAKOU",
        code: "PV01",
    },
    {
        id: 2709,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TOUKOUNTOUNA",
        centre: "FATIYA",
        bureau: "EPP FATIYA",
        code: "PV01",
    },
    {
        id: 2710,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TOUKOUNTOUNA",
        centre: "FATIYA",
        bureau: "EPP FATIYA",
        code: "PV02",
    },
    {
        id: 2711,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TOUKOUNTOUNA",
        centre: "FATIYA",
        bureau: "EPP TCHATIBOYA",
        code: "PV01",
    },
    {
        id: 2712,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TOUKOUNTOUNA",
        centre: "KOKOKOU",
        bureau: "EPP KOKOKOU",
        code: "PV01",
    },
    {
        id: 2713,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TOUKOUNTOUNA",
        centre: "KPENTIKOU",
        bureau: "EPP KPENTIKOU/G/B",
        code: "PV01",
    },
    {
        id: 2714,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TOUKOUNTOUNA",
        centre: "KPENTIKOU",
        bureau: "EPP TOUCOUNTOUNA C",
        code: "PV01",
    },
    {
        id: 2715,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TOUKOUNTOUNA",
        centre: "KPENTIKOU",
        bureau: "EPP TOUCOUNTOUNA C",
        code: "PV02",
    },
    {
        id: 2716,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TOUKOUNTOUNA",
        centre: "KPENTIKOU",
        bureau: "MAISON DES JEUNES",
        code: "PV01",
    },
    {
        id: 2717,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TOUKOUNTOUNA",
        centre: "KPENTIKOU",
        bureau: "MAISON DES JEUNES",
        code: "PV02",
    },
    {
        id: 2718,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TOUKOUNTOUNA",
        centre: "MOUSSOUNTINGOU",
        bureau: "EPP MOUSSOUTINGOU",
        code: "PV01",
    },
    {
        id: 2719,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TOUKOUNTOUNA",
        centre: "MOUSSOUNTINGOU",
        bureau: "EPP MOUSSOUTINGOU",
        code: "PV02",
    },
    {
        id: 2720,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TOUKOUNTOUNA",
        centre: "MOUSSOUNTINGOU",
        bureau: "EPP PORKOU",
        code: "PV01",
    },
    {
        id: 2721,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TOUKOUNTOUNA",
        centre: "TAMPATOU",
        bureau: "EPP TAMPARTOU",
        code: "PV01",
    },
    {
        id: 2722,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TOUKOUNTOUNA",
        centre: "TAMPATOU",
        bureau: "EPP TAMPARTOU",
        code: "PV02",
    },
    {
        id: 2723,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TOUKOUNTOUNA",
        centre: "TCHAKALAKOU",
        bureau: "EPP TCHAKALAKOU",
        code: "PV01",
    },
    {
        id: 2724,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TOUKOUNTOUNA",
        centre: "TCHAKALAKOU",
        bureau: "EPP TCHAKALAKOU",
        code: "PV02",
    },
    {
        id: 2725,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TOUKOUNTOUNA",
        centre: "TECTIBAYAOU",
        bureau: "EPP KOKOBRE",
        code: "PV01",
    },
    {
        id: 2726,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TOUKOUNTOUNA",
        centre: "TECTIBAYAOU",
        bureau: "EPP TECTIBAYAOU",
        code: "PV01",
    },
    {
        id: 2727,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TOUKOUNTOUNA",
        centre: "TOUKOUNTOUNA",
        bureau: "CEG TOUCOUNTOUNA/BATIMENT .A",
        code: "PV01",
    },
    {
        id: 2728,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TOUKOUNTOUNA",
        centre: "TOUKOUNTOUNA",
        bureau: "CEG TOUCOUNTOUNA/BATIMENT .A",
        code: "PV02",
    },
    {
        id: 2729,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TOUKOUNTOUNA",
        centre: "TOUKOUNTOUNA",
        bureau: "CEG TOUCOUNTOUNA/BATIMENT .A",
        code: "PV03",
    },
    {
        id: 2730,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TOUKOUNTOUNA",
        centre: "TOUKOUNTOUNA",
        bureau: "CEG TOUCOUNTOUNA/BATIMENT .A",
        code: "PV04",
    },
    {
        id: 2731,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TOUKOUNTOUNA",
        centre: "TOUKOUNTOUNA",
        bureau: "CEG TOUCOUNTOUNA/BATIMENT .A",
        code: "PV05",
    },
    {
        id: 2732,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TOUKOUNTOUNA",
        centre: "TOUKOUNTOUNA",
        bureau: "CEG TOUCOUNTOUNA/BATIMENT .A",
        code: "PV06",
    },
    {
        id: 2733,
        departement: "ATACORA",
        arrondissement: "TOUKOUNTOUNA",
        village: "TOUKOUNTOUNA",
        centre: "TOUKOUNTOUNA",
        bureau: "EPP TCHAKIFAKA",
        code: "PV01",
    },
];

async function main() {
    console.log("🚀 Seed COMPLET - EMAILS UNIQUES...");

    // 1. RESET COMPLET
    await prisma.resultat.deleteMany();
    await prisma.bureauVote.deleteMany();
    await prisma.arrondissement.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany({
        where: { role: { in: ["ADMIN", "DELEGUE"] } },
    });
    console.log("🗑️ Tables vidées");

    // 2. ADMIN (unique)
    console.log("👑 Création ADMIN...");
    const adminEmail = "admin@escrut.bj";
    const adminPassword = "Admin2026!";

    await auth.api.signUpEmail({
        body: {
            email: adminEmail,
            name: "Administrateur eScrut",
            password: adminPassword,
        },
    });
    const adminUser = await prisma.user.findUnique({
        where: { email: adminEmail },
    });
    if (adminUser) {
        await prisma.user.update({
            where: { id: adminUser.id },
            data: { role: "ADMIN" },
        });
    }
    console.log(`✅ ADMIN: ${adminEmail} / ${adminPassword}`);

    // 3. DÉLÉGUÉS (133 UNIQUES)
    console.log("🏛️ Création 133 délégués...");
    let successCount = 0;

    for (const [index, item] of bureauxData.entries()) {
        try {
            // Email UNIQUE par ID global (2661-2733)
            const delegateEmail = `delegue-${item.id}@escrut.bj`;
            const delegateName = `Délégué ${item.arrondissement} ${item.code}`;
            const delegatePassword = `D${item.id}g2026!`; // UNIQUE par ID

            // 3.1 Arrondissement
            const arrondissement = await prisma.arrondissement.upsert({
                where: { nom: item.arrondissement },
                update: {},
                create: { nom: item.arrondissement },
            });

            // 3.2 Bureau
            const bureau = await prisma.bureauVote.create({
                data: {
                    arrondissementId: arrondissement.id,
                    villageQuartier: item.village,
                    centreVote: item.centre,
                    codeBureau: item.code,
                },
            });

            // 3.3 Délégué Better Auth
            await auth.api.signUpEmail({
                body: {
                    email: delegateEmail,
                    name: delegateName,
                    password: delegatePassword,
                },
            });

            // 3.4 Lier relations
            const delegateUser = await prisma.user.findUnique({
                where: { email: delegateEmail },
            });
            if (delegateUser) {
                await prisma.$transaction([
                    prisma.user.update({
                        where: { id: delegateUser.id },
                        data: { role: "DELEGUE", bureauId: bureau.id },
                    }),
                    prisma.bureauVote.update({
                        where: { id: bureau.id },
                        data: { delegueId: delegateUser.id },
                    }),
                ]);
                successCount++;
                console.log(
                    `✅ ${successCount}/133 ${delegateEmail} → ${item.code}`
                );
            }
        } catch (error) {
            console.error(`❌ ERREUR ${item.id}:`, error);
        }
    }

    console.log("\n🎉 SEED TERMINÉ !");
    console.log(`👑 1 Admin: admin@escrut.bj / Admin2026!`);
    console.log(`🏛️ ${successCount}/73 Délégués créés`);
}

main()
    .catch((e) => {
        console.error("❌ ERREUR:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
