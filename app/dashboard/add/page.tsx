"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { submitResultat } from "@/app/actions/submit-resultat";
import { getResultat } from "@/app/actions/get-resultat";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Schéma de base pour la validation
const createResultatSchema = (hasExistingResultat: boolean) =>
    z
        .object({
            totalVotes: z
                .number({
                    message: "Le total des votes doit être un nombre.",
                })
                .int("Le total des votes doit être un nombre entier.")
                .min(0, "Le total des votes doit être positif.")
                .refine((val) => !isNaN(val), {
                    message: "Le total des votes est requis.",
                }),
            votesCandidat: z
                .number({
                    message:
                        "Le nombre de votes du candidat doit être un nombre.",
                })
                .int(
                    "Le nombre de votes du candidat doit être un nombre entier."
                )
                .min(0, "Le nombre de votes du candidat doit être positif.")
                .refine((val) => !isNaN(val), {
                    message: "Le nombre de votes du candidat est requis.",
                }),
            pvImage: z
                .instanceof(File, {
                    message: "Veuillez sélectionner une image du PV.",
                })
                .refine(
                    (file) => file.size <= 10 * 1024 * 1024,
                    "L'image ne doit pas dépasser 10MB."
                )
                .refine(
                    (file) => file.type.startsWith("image/"),
                    "Le fichier doit être une image."
                )
                .optional(),
        })
        .refine((data) => data.votesCandidat <= data.totalVotes, {
            message:
                "Le nombre de votes du candidat ne peut pas être supérieur au total des votes.",
            path: ["votesCandidat"],
        })
        .refine((data) => data.pvImage !== undefined || hasExistingResultat, {
            message: "Veuillez sélectionner une image du PV.",
            path: ["pvImage"],
        });

type ResultatValues = z.infer<ReturnType<typeof createResultatSchema>>;

export default function AddResultatPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(
        null
    );
    const [existingResultat, setExistingResultat] = useState<{
        totalVotes: number;
        votesCandidat: number;
        pvImageUrl: string;
    } | null>(null);
    const [submittedResultat, setSubmittedResultat] = useState<{
        totalVotes: number;
        votesCandidat: number;
        pvImageUrl: string;
    } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const hasExistingResultat = existingResultat !== null;
    const resultatSchema = createResultatSchema(hasExistingResultat);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset,
    } = useForm<ResultatValues>({
        resolver: zodResolver(resultatSchema),
        defaultValues: {
            totalVotes: undefined,
            votesCandidat: undefined,
        },
    });

    // Charger le résultat existant au montage
    useEffect(() => {
        const loadResultat = async () => {
            setIsLoading(true);
            try {
                const result = await getResultat();
                if (result.error) {
                    toast.error("Erreur", {
                        description: result.error,
                    });
                } else if (result.data) {
                    setExistingResultat({
                        totalVotes: result.data.totalVotes,
                        votesCandidat: result.data.votesCandidat,
                        pvImageUrl: result.data.pvImageUrl,
                    });
                    // Pré-remplir le formulaire
                    reset({
                        totalVotes: result.data.totalVotes,
                        votesCandidat: result.data.votesCandidat,
                    });
                    setUploadedImageUrl(result.data.pvImageUrl);
                }
            } catch (error) {
                console.error("Erreur lors du chargement:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadResultat();
    }, [reset]);

    const totalVotes = watch("totalVotes");
    const votesCandidat = watch("votesCandidat");
    const pvImage = watch("pvImage");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue("pvImage", file, { shouldValidate: true });
            // Prévisualisation locale
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImageUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data: ResultatValues) => {
        setIsSubmitting(true);

        try {
            let imageUrl = existingResultat?.pvImageUrl;

            // Si une nouvelle image est fournie, l'uploader
            if (data.pvImage) {
                const formData = new FormData();
                formData.append("file", data.pvImage);

                const uploadResponse = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!uploadResponse.ok) {
                    const errorData = await uploadResponse.json();
                    throw new Error(
                        errorData.error || "Erreur lors de l'upload"
                    );
                }

                const { url } = await uploadResponse.json();
                imageUrl = url;
            }

            // Si aucune image n'existe et aucune nouvelle n'est fournie
            if (!imageUrl) {
                toast.error("Erreur", {
                    description: "Veuillez sélectionner une image du PV.",
                });
                setIsSubmitting(false);
                return;
            }

            // Soumettre ou mettre à jour les résultats
            const result = await submitResultat(
                data.totalVotes,
                data.votesCandidat,
                imageUrl
            );

            if (result.error) {
                toast.error("Erreur", {
                    description: result.error,
                });
                return;
            }

            // Mettre à jour le résultat existant
            const updatedResultat = {
                totalVotes: data.totalVotes,
                votesCandidat: data.votesCandidat,
                pvImageUrl: imageUrl,
            };
            setExistingResultat(updatedResultat);
            setSubmittedResultat(updatedResultat);

            toast.success(
                hasExistingResultat
                    ? "Résultats modifiés avec succès"
                    : "Résultats soumis avec succès",
                {
                    description: "Les résultats ont été enregistrés.",
                }
            );

            // Réinitialiser le formulaire (garder les valeurs mais réinitialiser l'image)
            setValue("pvImage", undefined as any);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            // Garder l'image actuelle affichée
            setUploadedImageUrl(imageUrl);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Une erreur est survenue lors de la soumission.";
            toast.error("Erreur", {
                description: message,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <main className="container mx-auto py-8 px-4 max-w-2xl">
                <Card>
                    <CardContent className="py-8">
                        <div className="text-center text-muted-foreground">
                            Chargement...
                        </div>
                    </CardContent>
                </Card>
            </main>
        );
    }

    return (
        <main className="container mx-auto py-8 px-4 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle>
                        {hasExistingResultat
                            ? "Modifier les résultats"
                            : "Soumission des résultats"}
                    </CardTitle>
                    <CardDescription>
                        {hasExistingResultat
                            ? "Modifiez les résultats de vote de votre bureau"
                            : "Enregistrez les résultats de vote de votre bureau"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col gap-6"
                        noValidate
                    >
                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor="totalVotes"
                                className="text-sm font-medium"
                            >
                                Total des votes
                            </label>
                            <Input
                                id="totalVotes"
                                type="number"
                                placeholder="0"
                                aria-invalid={!!errors.totalVotes}
                                {...register("totalVotes", {
                                    valueAsNumber: true,
                                })}
                            />
                            {errors.totalVotes && (
                                <p className="text-xs text-destructive">
                                    {errors.totalVotes.message}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor="votesCandidat"
                                className="text-sm font-medium"
                            >
                                Votes du candidat
                            </label>
                            <Input
                                id="votesCandidat"
                                type="number"
                                placeholder="0"
                                aria-invalid={!!errors.votesCandidat}
                                {...register("votesCandidat", {
                                    valueAsNumber: true,
                                })}
                            />
                            {errors.votesCandidat && (
                                <p className="text-xs text-destructive">
                                    {errors.votesCandidat.message}
                                </p>
                            )}
                            {totalVotes !== undefined &&
                                votesCandidat !== undefined &&
                                votesCandidat > totalVotes && (
                                    <p className="text-xs text-muted-foreground">
                                        Le nombre de votes du candidat ne peut
                                        pas être supérieur au total des votes.
                                    </p>
                                )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor="pvImage"
                                className="text-sm font-medium"
                            >
                                Photo du PV
                            </label>
                            <Input
                                id="pvImage"
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                aria-invalid={!!errors.pvImage}
                                onChange={handleFileChange}
                            />
                            {errors.pvImage && (
                                <p className="text-xs text-destructive">
                                    {errors.pvImage.message}
                                </p>
                            )}
                            {uploadedImageUrl && (
                                <div className="mt-2 rounded-md border p-2">
                                    <p className="text-xs text-muted-foreground mb-2">
                                        {hasExistingResultat && !pvImage
                                            ? "Image actuelle (sélectionnez une nouvelle image pour la remplacer)"
                                            : "Aperçu"}
                                    </p>
                                    <Image
                                        src={uploadedImageUrl}
                                        alt={
                                            hasExistingResultat && !pvImage
                                                ? "Image actuelle du PV"
                                                : "Aperçu du PV"
                                        }
                                        width={400}
                                        height={300}
                                        className="rounded-md object-contain max-h-64 w-auto"
                                    />
                                </div>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full"
                        >
                            {isSubmitting
                                ? hasExistingResultat
                                    ? "Modification..."
                                    : "Soumission..."
                                : hasExistingResultat
                                ? "Modifier"
                                : "Soumettre"}
                        </Button>
                    </form>

                    {submittedResultat && (
                        <div className="mt-8 rounded-md border p-6 space-y-4">
                            <h3 className="text-lg font-semibold">
                                Résultats soumis
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Total des votes
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {submittedResultat.totalVotes}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Votes du candidat
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {submittedResultat.votesCandidat}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-2">
                                    Photo du PV
                                </p>
                                <Image
                                    src={submittedResultat.pvImageUrl}
                                    alt="PV soumis"
                                    width={600}
                                    height={400}
                                    className="rounded-md border object-contain max-h-96 w-auto"
                                />
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </main>
    );
}
