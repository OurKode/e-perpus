"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { returnBook } from "@/app/(dashboard)/transactions/actions";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

export function ReturnButton({ transactionId }: { transactionId: number }) {
    const [isPending, startTransition] = useTransition();
    const [successData, setSuccessData] = useState<{ fine: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleReturn = () => {
        startTransition(async () => {
            const result = await returnBook(transactionId);
            if (result.error) {
                setError(result.error);
            } else if (result.success) {
                setSuccessData({ fine: result.fine || 0 });
            }
        });
    };

    return (
        <>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={isPending}
                        className="text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100 font-medium"
                    >
                        {isPending ? "Proses..." : "Kembalikan"}
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white border-border">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-foreground">Konfirmasi Pengembalian</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin memproses pengembalian buku ini? Stok akan ditambahkan kembali.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-border text-foreground hover:bg-muted">Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleReturn}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            Ya, Kembalikan
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={!!successData} onOpenChange={(open) => !open && setSuccessData(null)}>
                <DialogContent className="bg-white border-border sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-foreground text-center text-xl font-serif">Pengembalian Berhasil</DialogTitle>
                        <DialogDescription className="text-center">
                            Buku telah dikembalikan ke stok.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center py-6 space-y-2">
                        <div className="text-sm text-muted-foreground uppercase tracking-widest">Denda Keterlambatan</div>
                        <div className="text-4xl font-bold text-emerald-600">
                            Rp {successData?.fine.toLocaleString()}
                        </div>
                        {successData?.fine === 0 && (
                            <div className="text-sm text-emerald-600 font-medium">Tepat Waktu!</div>
                        )}
                    </div>
                    <DialogFooter className="sm:justify-center">
                        <Button
                            type="button"
                            className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[120px]"
                            onClick={() => setSuccessData(null)}
                        >
                            Tutup
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {error && (
                <Dialog open={!!error} onOpenChange={() => setError(null)}>
                    <DialogContent className="bg-white border-red-200">
                        <DialogHeader>
                            <DialogTitle className="text-red-700">Terjadi Kesalahan</DialogTitle>
                            <DialogDescription>{error}</DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}
