"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

export function ServiceHoursDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" className="w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent hover:border-l-4 hover:border-accent-foreground transition-all duration-200 rounded-none rounded-r-lg pl-3">
                    <Clock className="mr-2 h-4 w-4" />
                    Info Jam Pelayanan
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-serif text-center mb-2">Jam Pelayanan Perpustakaan</DialogTitle>
                    <DialogDescription className="text-center">
                        Jadwal operasional perpustakaan kami.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                        <h3 className="font-semibold text-emerald-800 mb-2 flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            Senin - Kamis
                        </h3>
                        <p className="text-emerald-700">08:00 WIB - 15:00 WIB</p>
                    </div>

                    <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                        <h3 className="font-semibold text-emerald-800 mb-2 flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            Jumat
                        </h3>
                        <p className="text-emerald-700">08:00 WIB - 11:30 WIB</p>
                        <p className="text-emerald-700 text-sm mt-1">(Istirahat Sholat Jumat)</p>
                    </div>

                    <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                        <h3 className="font-semibold text-emerald-800 mb-2 flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            Sabtu
                        </h3>
                        <p className="text-emerald-700">08:00 WIB - 13:00 WIB</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
