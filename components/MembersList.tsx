'use client';

import { useState, useRef } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteMember, createMember, updateMember } from "@/app/(dashboard)/(content)/members/actions";
import { Search, Pencil, Plus, Printer } from "lucide-react";
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
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

interface Member {
    id: number;
    nis: string;
    name: string;
    class: string | null;
    address: string | null;
    createdAt: Date | null;
}

export function MembersList({ initialMembers }: { initialMembers: Member[] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentMember, setCurrentMember] = useState<Member | null>(null);
    const [memberToPrint, setMemberToPrint] = useState<Member | null>(null);

    const filteredMembers = initialMembers.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.nis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.class && member.class.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleCreate = () => {
        setIsEditing(false);
        setCurrentMember(null);
        setIsOpen(true);
    };

    const handleEdit = (member: Member) => {
        setIsEditing(true);
        setCurrentMember(member);
        setIsOpen(true);
    };

    const handlePrint = (member: Member) => {
        setMemberToPrint(member);
        // Allow state to update and DOM to render before printing
        setTimeout(() => {
            window.print();
        }, 100);
    };

    return (
        <div className="space-y-6">
            <style jsx global>{`
                @media print {
                    @page {
                        margin: 0;
                        size: auto;
                    }
                    body * {
                        visibility: hidden;
                    }
                    #printable-card, #printable-card * {
                        visibility: visible;
                    }
                    #printable-card {
                        position: fixed;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%, -50%);
                        z-index: 9999;
                        width: 85.6mm;
                        height: 54mm;
                        visibility: visible !important;
                        display: block !important;
                    }
                }
            `}</style>

            <div className="flex items-center justify-between print:hidden">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari Nama, NIS, atau Kelas..."
                        className="pl-9 bg-white border-border text-foreground max-w-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button onClick={handleCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" /> Tambah Anggota
                </Button>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="bg-white border-border sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-foreground">
                            {isEditing ? "Edit Anggota" : "Tambah Anggota Baru"}
                        </DialogTitle>
                    </DialogHeader>
                    <form
                        key={isEditing ? currentMember?.id : "create"}
                        action={async (formData) => {
                            if (isEditing && currentMember) {
                                await updateMember(currentMember.id, formData);
                            } else {
                                await createMember(formData);
                            }
                            setIsOpen(false);
                        }}
                        className="space-y-4"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="nis" className="text-foreground">NIS/NISN</Label>
                                <Input
                                    id="nis"
                                    name="nis"
                                    placeholder="12345"
                                    required
                                    defaultValue={isEditing ? currentMember?.nis : ""}
                                    className="bg-white border-border text-foreground"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="class" className="text-foreground">Kelas</Label>
                                <Input
                                    id="class"
                                    name="class"
                                    placeholder="VII-A"
                                    defaultValue={isEditing ? currentMember?.class || "" : ""}
                                    className="bg-white border-border text-foreground"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-foreground">Nama Lengkap</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Nama Siswa"
                                required
                                defaultValue={isEditing ? currentMember?.name : ""}
                                className="bg-white border-border text-foreground"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address" className="text-foreground">Alamat</Label>
                            <Input
                                id="address"
                                name="address"
                                placeholder="Alamat Lengkap"
                                defaultValue={isEditing ? currentMember?.address || "" : ""}
                                className="bg-white border-border text-foreground"
                            />
                        </div>
                        <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-2">
                            {isEditing ? "Update Data" : "Simpan Data"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="rounded-lg border border-border overflow-hidden bg-white shadow-sm print:hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                            <TableHead className="text-muted-foreground w-[100px]">NIS/NISN</TableHead>
                            <TableHead className="text-muted-foreground w-[200px]">Nama</TableHead>
                            <TableHead className="text-muted-foreground w-[80px]">Kelas</TableHead>
                            <TableHead className="text-muted-foreground">Alamat</TableHead>
                            <TableHead className="text-muted-foreground w-[150px]">Tanggal Gabung</TableHead>
                            <TableHead className="text-right text-muted-foreground w-[150px]">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredMembers.map((member) => (
                            <TableRow key={member.id}>
                                <TableCell className="font-medium text-foreground">{member.nis}</TableCell>
                                <TableCell className="text-foreground font-medium">{member.name}</TableCell>
                                <TableCell className="text-foreground">{member.class || "-"}</TableCell>
                                <TableCell className="text-foreground truncate max-w-[200px]" title={member.address || ""}>{member.address || "-"}</TableCell>
                                <TableCell className="text-foreground">{member.createdAt ? new Date(member.createdAt).toLocaleDateString("id-ID") : "-"}</TableCell>
                                <TableCell className="text-right space-x-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 h-8 w-8 p-0"
                                        onClick={() => handlePrint(member)}
                                        title="Cetak Kartu"
                                    >
                                        <Printer className="h-4 w-4" />
                                        <span className="sr-only">Cetak Kartu</span>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 h-8 w-8 p-0"
                                        onClick={() => handleEdit(member)}
                                        title="Edit"
                                    >
                                        <Pencil className="h-4 w-4" />
                                        <span className="sr-only">Edit</span>
                                    </Button>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                                                title="Hapus"
                                            >
                                                <span className="sr-only">Delete</span>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="h-4 w-4"
                                                >
                                                    <path d="M3 6h18" />
                                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                                </svg>
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="bg-white border-border">
                                            <AlertDialogHeader>
                                                <AlertDialogTitle className="text-foreground">Hapus Anggota?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Tindakan ini tidak dapat dibatalkan. Data anggota <strong>{member.name}</strong> akan dihapus permanen.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel className="border-border text-foreground hover:bg-muted">Batal</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={async () => await deleteMember(member.id)}
                                                    className="bg-red-600 text-white hover:bg-red-700 border-red-600"
                                                >
                                                    Hapus
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredMembers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                    {searchTerm ? "Data tidak ditemukan." : "Belum ada data anggota."}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Hidden Printable Card */}
            {memberToPrint && (
                <div id="printable-card" className="hidden print:block bg-white border border-gray-200 overflow-hidden shadow-none print:shadow-none" style={{ width: '85.6mm', height: '54mm' }}>
                    {/* Header */}
                    <div className="bg-[#064E3B] text-white h-[14mm] flex flex-col items-center justify-center print-color-adjust-exact" style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}>
                        <h1 className="text-[10pt] font-bold tracking-wide uppercase leading-tight">KARTU ANGGOTA PERPUSTAKAAN</h1>
                        <h2 className="text-[8pt] font-medium opacity-90">MTs AISYIYAH</h2>
                    </div>

                    {/* Body */}
                    <div className="p-4 flex gap-4 h-[calc(54mm-14mm)] items-center relative">
                        {/* Watermark */}
                        <div className="absolute inset-0 bg-[#064E3B] opacity-[0.03] pointer-events-none z-0"></div>

                        {/* Photo Placeholder */}
                        <div className="w-[24mm] h-[30mm] bg-white border border-gray-400 flex flex-col items-center justify-center text-center flex-shrink-0 z-10">
                            <span className="text-[6pt] text-gray-400">FOTO</span>
                            <span className="text-[6pt] text-gray-400">3x4</span>
                        </div>

                        {/* Details */}
                        <div className="flex-1 space-y-1.5 z-10 text-[#064E3B]">
                            <div className="text-[8pt]">
                                <span className="font-semibold block text-[7pt] opacity-70 uppercase tracking-wider">NIS / NISN</span>
                                <span className="font-bold text-[10pt]">{memberToPrint.nis}</span>
                            </div>
                            <div className="text-[9pt]">
                                <span className="font-bold block text-[11pt] text-black/90 leading-tight">{memberToPrint.name}</span>
                            </div>
                            <div className="text-[8pt] flex gap-4">
                                <div>
                                    <span className="font-semibold block text-[7pt] opacity-70 uppercase tracking-wider">Kelas</span>
                                    <span className="font-medium">{memberToPrint.class || "-"}</span>
                                </div>
                            </div>
                            <div className="text-[8pt] pt-1 border-t border-emerald-100 mt-1">
                                <span className="block text-[7pt] opacity-70 italic truncate max-w-[45mm]">{memberToPrint.address || "Alamat tidak tersedia"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
