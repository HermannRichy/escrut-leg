"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const registerSchema = z
    .object({
        name: z.string().min(2, "Le nom est requis."), // Nom complet avec espaces
        email: z.string().email("Email invalide."),
        password: z.string().min(6, "Mot de passe trop court."),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Les mots de passe ne correspondent pas.",
    });

type RegisterValues = z.infer<typeof registerSchema>;

export default function Register() {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: RegisterValues) => {
        setServerError(null);

        try {
            const res = await authClient.signUp.email({
                name: data.name,
                email: data.email,
                password: data.password,
            });

            if (res.error) {
                const message =
                    res.error.message ??
                    "Échec de la création de compte. Veuillez vérifier les informations saisies.";
                setServerError(message);
                toast.error("Création de compte échouée", {
                    description: message,
                });
                return;
            }

            toast.success("Compte créé avec succès", {
                description:
                    "Vous allez être redirigé vers la page de connexion.",
            });

            router.push("/");
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
                        Créer un compte eScrut
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Rejoignez la plateforme de suivi de scrutin en ligne
                        sécurisée et transparente.
                    </p>
                </header>

                {serverError && (
                    <p className="rounded-md border border-destructive/50 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                        {serverError}
                    </p>
                )}

                <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-sm font-medium">
                        Nom complet
                    </label>
                    <input
                        id="name"
                        type="text"
                        autoComplete="name"
                        placeholder="Hermann Richy"
                        className="h-10 rounded-md border px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        aria-invalid={!!errors.name}
                        {...register("name")}
                    />
                    {errors.name && (
                        <p className="text-xs text-destructive">
                            {errors.name.message}
                        </p>
                    )}
                </div>

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
                            autoComplete="new-password"
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

                    <div className="flex flex-col gap-1.5">
                        <label
                            htmlFor="confirmPassword"
                            className="text-sm font-medium"
                        >
                            Confirmer le mot de passe
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            placeholder="Confirmez votre mot de passe"
                            className="h-10 rounded-md border px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            aria-invalid={!!errors.confirmPassword}
                            {...register("confirmPassword")}
                        />
                        {errors.confirmPassword && (
                            <p className="text-xs text-destructive">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSubmitting ? "Création du compte..." : "Créer un compte"}
                </button>
            </form>
        </section>
    );
}
