'use client';

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteMember, createMember, updateMember } from "@/app/members/actions";
import { Search, Pencil, Plus } from "lucide-react";
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

interface Member {
    id: number;
    name: string;
    phone: string | null;
    address: string | null;
    createdAt: Date | null;
}

export function MembersList({ initialMembers }: { initialMembers: Member[] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentMember, setCurrentMember] = useState<Member | null>(null);

    const filteredMembers = initialMembers.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.phone && member.phone.includes(searchTerm)) ||
        member.id.toString().includes(searchTerm)
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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari Nama, ID, atau No. HP..."
                        className="pl-9 bg-white border-border text-foreground max-w-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button onClick={handleCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" /> Add New Member
                </Button>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="bg-white border-border sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-foreground">
                            {isEditing ? "Edit Member" : "Add New Member"}
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
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-foreground">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="John Doe"
                                required
                                defaultValue={isEditing ? currentMember?.name : ""}
                                className="bg-white border-border text-foreground"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-foreground">Phone</Label>
                            <Input
                                id="phone"
                                name="phone"
                                placeholder="08123456789"
                                defaultValue={isEditing ? currentMember?.phone || "" : ""}
                                className="bg-white border-border text-foreground"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address" className="text-foreground">Address</Label>
                            <Input
                                id="address"
                                name="address"
                                placeholder="Jl. Sudirman No. 123"
                                defaultValue={isEditing ? currentMember?.address || "" : ""}
                                className="bg-white border-border text-foreground"
                            />
                        </div>
                        <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-2">
                            {isEditing ? "Update Member" : "Save Member"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="rounded-lg border border-border overflow-hidden bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                            <TableHead className="text-muted-foreground w-[80px]">ID</TableHead>
                            <TableHead className="text-muted-foreground w-[200px]">Name</TableHead>
                            <TableHead className="text-muted-foreground w-[150px]">Phone</TableHead>
                            <TableHead className="text-muted-foreground">Address</TableHead>
                            <TableHead className="text-muted-foreground w-[150px]">Joined Date</TableHead>
                            <TableHead className="text-right text-muted-foreground w-[100px]">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredMembers.map((member) => (
                            <TableRow key={member.id}>
                                <TableCell className="font-medium text-foreground">{member.id}</TableCell>
                                <TableCell className="text-foreground font-medium">{member.name}</TableCell>
                                <TableCell className="text-foreground">{member.phone || "-"}</TableCell>
                                <TableCell className="text-foreground truncate max-w-[200px]" title={member.address || ""}>{member.address || "-"}</TableCell>
                                <TableCell className="text-foreground">{member.createdAt ? new Date(member.createdAt).toLocaleDateString() : "-"}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 h-8 w-8 p-0"
                                        onClick={() => handleEdit(member)}
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
                                    {searchTerm ? "Tidak ada anggota yang cocok, coba kata kunci lain." : "Belum ada data anggota. Silakan tambahkan anggota baru."}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
