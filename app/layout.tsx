import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "eScrut",
    description:
        "Plateforme de suivi du scrutin en ligne. Centralisation et visualisation des résultats avec preuves (PV).",

    openGraph: {
        title: "eScrut | Suivi du scrutin",
        description:
            "Plateforme de suivi du scrutin en ligne avec centralisation des procès-verbaux et visualisation des résultats.",
        type: "website",
        locale: "fr_FR",
        images: [
            {
                url: "/og-img.jpeg",
                width: 1200,
                height: 630,
                alt: "eScrut – Suivi du scrutin",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: "eScrut | Suivi du scrutin",
        description:
            "Plateforme de suivi du scrutin en ligne avec preuves et visualisation des résultats.",
        images: ["/og-img.jpeg"],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
