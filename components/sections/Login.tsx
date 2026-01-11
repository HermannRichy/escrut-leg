"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const loginSchema = z.object({
    email: z
        .string()
        .min(1, "L'email est requis.")
        .email("Adresse email invalide."),
    password: z
        .string()
        .min(6, "Le mot de passe doit contenir au moins 6 caractères."),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function Login() {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginValues) => {
        setServerError(null);

        try {
            const res = await authClient.signIn.email({
                email: data.email,
                password: data.password,
            });

            if (res.error) {
                const message =
                    res.error.message ??
                    "Échec de la connexion. Vérifiez vos identifiants.";

                setServerError(message);
                toast.error("Connexion échouée", {
                    description: message,
                });
                return;
            }

            toast.success("Connexion réussie", {
                description: "Redirection vers votre tableau de bord…",
            });

            router.push("/dashboard");
        } catch (err) {
            const message =
                "Une erreur inattendue est survenue. Veuillez réessayer plus tard.";
            setServerError(message);
            toast.error("Erreur serveur", {
                description: message,
            });
        }
    };

    return (
        <section className="mx-auto min-h-screen flex justify-center items-center max-w-md flex-col gap-6 px-4 py-8">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-6"
                noValidate
            >
                <header className="space-y-2">
                    <h1 className="text-2xl font-semibold">
                        Bienvenue sur eScrut
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Plateforme de suivi de scrutin en ligne sécurisée et
                        transparente
                    </p>
                </header>

                {serverError && (
                    <p className="rounded-md border border-destructive/50 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                        {serverError}
                    </p>
                )}

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="email" className="text-sm font-medium">
                            Adresse email
                        </label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder="vous@example.com"
                            className="h-10 rounded-md border px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            aria-invalid={!!errors.email}
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="text-xs text-destructive">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label
                            htmlFor="password"
                            className="text-sm font-medium"
                        >
                            Mot de passe
                        </label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            placeholder="Votre mot de passe"
                            className="h-10 rounded-md border px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            aria-invalid={!!errors.password}
                            {...register("password")}
                        />
                        {errors.password && (
                            <p className="text-xs text-destructive">
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSubmitting ? "Connexion..." : "Se connecter"}
                </button>
            </form>
        </section>
    );
}
