"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ImageViewer from "./image-viewer";
import { RefreshCw } from "lucide-react";

interface Totaux {
    totalVotes: number;
    totalVotesCandidat: number;
    pourcentageGlobal: number;
}

interface Bureau {
    id: string;
    arrondissement: string;
    centreVote: string;
    codeBureau: string;
    statut: string;
    totalVotes: number | null;
    votesCandidat: number | null;
    pvImageUrl: string | null;
    pourcentage: number | null;
}

interface AdminDashboardClientProps {
    totaux: Totaux;
    bureaux: Bureau[];
}

export function AdminDashboardClient({
    totaux,
    bureaux,
}: AdminDashboardClientProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleRefresh = () => {
        startTransition(() => {
            router.refresh();
        });
    };

    return (
        <div className="space-y-6">
            {/* Vue globale avec les totaux */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Vue globale</CardTitle>
                            <CardDescription>
                                Statistiques cumulées de tous les bureaux
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Total votes cumulés
                            </p>
                            <p className="text-3xl font-bold">
                                {totaux.totalVotes.toLocaleString()}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Total votes candidat cumulés
                            </p>
                            <p className="text-3xl font-bold">
                                {totaux.totalVotesCandidat.toLocaleString()}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                                % global
                            </p>
                            <p className="text-3xl font-bold">
                                {totaux.pourcentageGlobal.toFixed(2)}%
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Liste des bureaux */}
            <Card>
                <CardHeader>
                    <CardTitle>Liste des bureaux</CardTitle>
                    <CardDescription>
                        Statut et résultats de chaque bureau de vote
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {bureaux.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Aucun bureau de vote enregistré.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Arrondissement</TableHead>
                                    <TableHead>Centre de vote</TableHead>
                                    <TableHead>Code bureau</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead>Total votes</TableHead>
                                    <TableHead>Votes candidat</TableHead>
                                    <TableHead>%</TableHead>
                                    <TableHead>Photo</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bureaux.map((bureau) => (
                                    <TableRow key={bureau.id}>
                                        <TableCell className="font-medium">
                                            {bureau.arrondissement}
                                        </TableCell>
                                        <TableCell>
                                            {bureau.centreVote}
                                        </TableCell>
                                        <TableCell>
                                            {bureau.codeBureau}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    bureau.statut === "soumis"
                                                        ? "default"
                                                        : "outline"
                                                }
                                            >
                                                {bureau.statut === "soumis"
                                                    ? "Soumis"
                                                    : "Non soumis"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {bureau.totalVotes !== null
                                                ? bureau.totalVotes.toLocaleString()
                                                : "-"}
                                        </TableCell>
                                        <TableCell>
                                            {bureau.votesCandidat !== null
                                                ? bureau.votesCandidat.toLocaleString()
                                                : "-"}
                                        </TableCell>
                                        <TableCell>
                                            {bureau.pourcentage !== null
                                                ? `${bureau.pourcentage.toFixed(2)}%`
                                                : "-"}
                                        </TableCell>
                                        <TableCell>
                                            {bureau.pvImageUrl ? (
                                                <ImageViewer
                                                    imageUrl={bureau.pvImageUrl}
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
        </div>
    );
}

