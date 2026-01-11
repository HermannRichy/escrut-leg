"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Eye } from "lucide-react";

interface ImageViewerProps {
    imageUrl: string;
    bureauCode: string;
}

export default function ImageViewer({
    imageUrl,
    bureauCode,
}: ImageViewerProps) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Voir
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        Photo du PV - {bureauCode}
                    </DialogTitle>
                </DialogHeader>
                <div className="mt-4 flex justify-center">
                    <Image
                        src={imageUrl}
                        alt={`PV du bureau ${bureauCode}`}
                        width={1400}
                        height={1000}
                        className="rounded-md border object-contain w-full h-auto max-h-[80vh]"
                        unoptimized
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}

