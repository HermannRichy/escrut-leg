"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import ImageViewer from "../admin/image-viewer";

interface Bureau {
    id: string;
    arrondissement: {
        nom: string;
    };
    centreVote: string;
    codeBureau: string;
    resultat: {
        pvImageUrl: string;
    } | null;
}

interface BureauxPageClientProps {
    bureaux: Bureau[];
}

export function BureauxPageClient({ bureaux }: BureauxPageClientProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleRefresh = () => {
        startTransition(() => {
            router.refresh();
        });
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Gestion des bureaux de vote</CardTitle>
                        <CardDescription>
                            Liste de tous les bureaux de vote existants
                        </CardDescription>
                    </div>
                    <Button
                        onClick={handleRefresh}
                        disabled={isPending}
                        variant="outline"
                        size="sm"
                    >
                        <RefreshCw
                            className={`h-4 w-4 mr-2 ${
                                isPending ? "animate-spin" : ""
                            }`}
                        />
                        Actualiser
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {bureaux.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        Aucun bureau de vote enregistré pour le moment.
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Arrondissement</TableHead>
                                <TableHead>Centre de vote</TableHead>
                                <TableHead>Code bureau</TableHead>
                                <TableHead>Photo PV</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bureaux.map((bureau) => (
                                <TableRow key={bureau.id}>
                                    <TableCell className="font-medium">
                                        {bureau.arrondissement.nom}
                                    </TableCell>
                                    <TableCell>{bureau.centreVote}</TableCell>
                                    <TableCell>{bureau.codeBureau}</TableCell>
                                    <TableCell>
                                        {bureau.resultat?.pvImageUrl ? (
                                            <ImageViewer
                                                imageUrl={
                                                    bureau.resultat.pvImageUrl
                                                }
                                                bureauCode={bureau.codeBureau}
                                            />
                                        ) : (
                                            <span className="text-muted-foreground">
                                                -
                                            </span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}

