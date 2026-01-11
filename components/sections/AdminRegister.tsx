"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createUser, type CreateUserResult } from "@/app/actions/create-user";
import { getBureauxAvailable } from "@/app/actions/get-bureaux-available";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const registerSchema = z
    .object({
        name: z.string().min(2, "Le nom est requis."),
        email: z.string().email("Email invalide."),
        password: z.string().min(6, "Mot de passe trop court."),
        confirmPassword: z.string(),
        bureauId: z.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Les mots de passe ne correspondent pas.",
        path: ["confirmPassword"],
    });

type RegisterValues = z.infer<typeof registerSchema>;

export default function AdminRegister() {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);
    const [bureaux, setBureaux] = useState<
        Array<{
            id: string;
            label: string;
            codeBureau: string;
            centreVote: string;
            arrondissement: string;
        }>
    >([]);
    const [isLoadingBureaux, setIsLoadingBureaux] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
    } = useForm<RegisterValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            bureauId: undefined,
        },
    });

    const bureauId = watch("bureauId");

    useEffect(() => {
        const loadBureaux = async () => {
            try {
                const result = await getBureauxAvailable();
                if (result.success && result.bureaux) {
                    setBureaux(result.bureaux);
                } else if (result.error) {
                    toast.error("Erreur", {
                        description: result.error,
                    });
                }
            } catch (error) {
                console.error("Erreur lors du chargement des bureaux:", error);
            } finally {
                setIsLoadingBureaux(false);
            }
        };

        loadBureaux();
    }, []);

    const onSubmit = async (data: RegisterValues) => {
        setServerError(null);

        try {
            const result = await createUser(
                data.name,
                data.email,
                data.password,
                data.bureauId
            );

            if ("error" in result) {
                setServerError(result.error as string);
                toast.error("Création de compte échouée", {
                    description: result.error as string,
                });
                return;
            }

            toast.success("Compte créé avec succès", {
                description:
                    "Le délégué a été créé et le bureau lui a été assigné.",
            });

            // Réinitialiser le formulaire
            setValue("name", "");
            setValue("email", "");
            setValue("password", "");
            setValue("confirmPassword", "");
            setValue("bureauId", undefined);

            // Recharger les bureaux disponibles
            const bureauxResult = await getBureauxAvailable();
            if (bureauxResult.success && bureauxResult.bureaux) {
                setBureaux(bureauxResult.bureaux);
            }

            router.refresh();
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
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Créer un compte délégué</CardTitle>
                <CardDescription>
                    Créez un nouveau compte pour un délégué et assignez-lui un
                    bureau de vote
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-6"
                    noValidate
                >
                    {serverError && (
                        <p className="rounded-md border border-destructive/50 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                            {serverError}
                        </p>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="name" className="text-sm font-medium">
                            Nom complet
                        </label>
                        <Input
                            id="name"
                            type="text"
                            autoComplete="name"
                            placeholder="Hermann Richy"
                            aria-invalid={!!errors.name}
                            {...register("name")}
                        />
                        {errors.name && (
                            <p className="text-xs text-destructive">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="email" className="text-sm font-medium">
                            Adresse email
                        </label>
                        <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder="vous@example.com"
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
                        <Input
                            id="password"
                            type="password"
                            autoComplete="new-password"
                            placeholder="Votre mot de passe"
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
                        <Input
                            id="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            placeholder="Confirmez votre mot de passe"
                            aria-invalid={!!errors.confirmPassword}
                            {...register("confirmPassword")}
                        />
                        {errors.confirmPassword && (
                            <p className="text-xs text-destructive">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label
                            htmlFor="bureauId"
                            className="text-sm font-medium"
                        >
                            Bureau de vote (optionnel)
                        </label>
                        {isLoadingBureaux ? (
                            <div className="text-sm text-muted-foreground">
                                Chargement des bureaux...
                            </div>
                        ) : (
                            <Select
                                value={bureauId || "none"}
                                onValueChange={(value) => {
                                    // ✅ Gère "none" → undefined correctement
                                    setValue(
                                        "bureauId",
                                        value === "none" ? undefined : value
                                    );
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Sélectionner un bureau (optionnel)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">
                                        Aucun bureau
                                    </SelectItem>
                                    {bureaux.map((bureau) => (
                                        <SelectItem
                                            key={bureau.id}
                                            value={bureau.id}
                                        >
                                            {bureau.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                        {bureaux.length === 0 && !isLoadingBureaux && (
                            <p className="text-xs text-muted-foreground">
                                Tous les bureaux sont déjà assignés.
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full"
                    >
                        {isSubmitting
                            ? "Création du compte..."
                            : "Créer le compte"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
