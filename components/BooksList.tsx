'use client';

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteBook, createBook, updateBook } from "@/app/(dashboard)/(content)/books/actions";
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
    DialogTrigger,
} from "@/components/ui/dialog";
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700'] });

interface Book {
    id: number;
    code: string;
    title: string;
    stock: number;
    location: string | null;
    author: string | null;
    publisher: string | null;
    publishedYear: number | null;
    isbn: string | null;
    totalPages: number | null;
    dimensions: string | null;
    edition: string | null;
}

export function BooksList({ initialBooks }: { initialBooks: Book[] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentBook, setCurrentBook] = useState<Book | null>(null);
    const [detailBook, setDetailBook] = useState<Book | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const filteredBooks = initialBooks.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreate = () => {
        setIsEditing(false);
        setCurrentBook(null);
        setIsOpen(true);
    };

    const handleEdit = (e: React.MouseEvent, book: Book) => {
        e.stopPropagation();
        setIsEditing(true);
        setCurrentBook(book);
        setIsOpen(true);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const handleRowClick = (book: Book) => {
        setDetailBook(book);
        setIsDetailOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari Judul atau Kode Buku..."
                        className="pl-9 bg-white border-border text-foreground w-[400px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button onClick={handleCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" /> Add New Book
                </Button>
            </div>

            {/* Add/Edit Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="bg-white border-border sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-foreground">
                            {isEditing ? "Edit Book" : "Add New Book"}
                        </DialogTitle>
                    </DialogHeader>
                    <form
                        key={isEditing ? currentBook?.id : "create"}
                        action={async (formData) => {
                            if (isEditing && currentBook) {
                                await updateBook(currentBook.id, formData);
                            } else {
                                await createBook(formData);
                            }
                            setIsOpen(false);
                        }}
                        className="space-y-4"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="code" className="text-foreground">Code</Label>
                                <Input id="code" name="code" placeholder="BK-001" required defaultValue={isEditing ? currentBook?.code : ""} className="bg-white border-border text-foreground" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="isbn" className="text-foreground">ISBN</Label>
                                <Input id="isbn" name="isbn" placeholder="978-..." defaultValue={isEditing ? currentBook?.isbn || "" : ""} className="bg-white border-border text-foreground" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-foreground">Title</Label>
                            <Input id="title" name="title" placeholder="Book Title" required defaultValue={isEditing ? currentBook?.title : ""} className="bg-white border-border text-foreground" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="author" className="text-foreground">Author</Label>
                                <Input id="author" name="author" placeholder="Author Name" defaultValue={isEditing ? currentBook?.author || "" : ""} className="bg-white border-border text-foreground" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="publisher" className="text-foreground">Publisher</Label>
                                <Input id="publisher" name="publisher" placeholder="Publisher Name" defaultValue={isEditing ? currentBook?.publisher || "" : ""} className="bg-white border-border text-foreground" />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="publishedYear" className="text-foreground">Year</Label>
                                <Input id="publishedYear" name="publishedYear" type="number" placeholder="2024" defaultValue={isEditing ? currentBook?.publishedYear || "" : ""} className="bg-white border-border text-foreground" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stock" className="text-foreground">Stock</Label>
                                <Input id="stock" name="stock" type="number" min="0" required defaultValue={isEditing ? currentBook?.stock : 1} className="bg-white border-border text-foreground" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location" className="text-foreground">Location</Label>
                                <Input id="location" name="location" placeholder="Shelf A1" defaultValue={isEditing ? currentBook?.location || "" : ""} className="bg-white border-border text-foreground" />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="totalPages" className="text-foreground">Pages</Label>
                                <Input id="totalPages" name="totalPages" type="number" placeholder="150" defaultValue={isEditing ? currentBook?.totalPages || "" : ""} className="bg-white border-border text-foreground" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dimensions" className="text-foreground">Dimensions</Label>
                                <Input id="dimensions" name="dimensions" placeholder="14x20cm" defaultValue={isEditing ? currentBook?.dimensions || "" : ""} className="bg-white border-border text-foreground" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edition" className="text-foreground">Edition</Label>
                                <Input id="edition" name="edition" placeholder="First Edition" defaultValue={isEditing ? currentBook?.edition || "" : ""} className="bg-white border-border text-foreground" />
                            </div>
                        </div>

                        <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-4">
                            {isEditing ? "Update Book" : "Save Book"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Detail Popup Modal */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="bg-white border-border sm:max-w-[700px] p-0 overflow-hidden shadow-2xl shadow-emerald-900/10">
                    <div className="p-6 bg-white">
                        <DialogHeader className="mb-6">
                            <DialogTitle className={`text-emerald-800 text-lg font-bold border-b-2 border-emerald-100 pb-2 mb-2 inline-block w-fit ${playfair.className}`}>Detail Buku</DialogTitle>
                            <h2 className="text-3xl font-bold text-foreground mt-1 leading-tight text-emerald-950">{detailBook?.title}</h2>
                        </DialogHeader>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                            {/* Section A: Identitas & Admin */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-emerald-700 uppercase tracking-wider text-xs border-b border-emerald-50 pb-1 mb-3">Identitas Utama</h3>
                                <div>
                                    <Label className="text-emerald-600 font-medium block mb-1">Penulis</Label>
                                    <p className="font-bold text-emerald-950 text-base">{detailBook?.author || "-"}</p>
                                </div>
                                <div>
                                    <Label className="text-emerald-600 font-medium block mb-1">Penerbit</Label>
                                    <p className="font-bold text-emerald-950 text-base">{detailBook?.publisher || "-"}</p>
                                </div>
                                <div>
                                    <Label className="text-emerald-600 font-medium block mb-1">Tahun Terbit</Label>
                                    <p className="font-bold text-emerald-950 text-base">{detailBook?.publishedYear || "-"}</p>
                                </div>
                                <div>
                                    <Label className="text-emerald-600 font-medium block mb-1">ISBN</Label>
                                    <p className="font-bold text-emerald-950 font-mono text-base tracking-wide">{detailBook?.isbn || "-"}</p>
                                </div>
                            </div>

                            {/* Section B: Data Fisik */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-emerald-700 uppercase tracking-wider text-xs border-b border-emerald-50 pb-1 mb-3">Data Fisik & Admin</h3>
                                <div>
                                    <Label className="text-emerald-600 font-medium block mb-1">Tebal Halaman</Label>
                                    <p className="font-bold text-emerald-950">{detailBook?.totalPages ? `${detailBook.totalPages} Halaman` : "-"}</p>
                                </div>
                                <div>
                                    <Label className="text-emerald-600 font-medium block mb-1">Dimensi</Label>
                                    <p className="font-bold text-emerald-950">{detailBook?.dimensions || "-"}</p>
                                </div>
                                <div>
                                    <Label className="text-emerald-600 font-medium block mb-1">Edisi/Cetakan</Label>
                                    <p className="font-bold text-emerald-950">{detailBook?.edition || "-"}</p>
                                </div>
                                <div className="flex gap-6 mt-4 pt-4 border-t border-emerald-50">
                                    <div>
                                        <Label className="text-emerald-600 font-medium block mb-1">Lokasi Rak</Label>
                                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                            {detailBook?.location || "-"}
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-emerald-600 font-medium block mb-1">Stok</Label>
                                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                            {detailBook?.stock} Eks.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-emerald-50/50 px-6 py-4 flex justify-end">
                        <Button
                            variant="outline"
                            onClick={() => setIsDetailOpen(false)}
                            className="bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 font-medium"
                        >
                            Tutup
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <div className="rounded-lg border border-border overflow-hidden bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                            <TableHead className="text-muted-foreground w-[100px]">Code</TableHead>
                            <TableHead className="text-muted-foreground">Title</TableHead>
                            <TableHead className="text-muted-foreground">Author</TableHead>
                            <TableHead className="text-muted-foreground w-[80px]">Stock</TableHead>
                            <TableHead className="text-muted-foreground w-[100px]">Location</TableHead>
                            <TableHead className="text-right text-muted-foreground w-[150px]">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredBooks.map((book) => (
                            <TableRow
                                key={book.id}
                                className="cursor-pointer hover:bg-emerald-50/50 transition-colors"
                                onClick={() => handleRowClick(book)}
                            >
                                <TableCell className="font-medium text-foreground">{book.code}</TableCell>
                                <TableCell className="text-foreground font-medium">{book.title}</TableCell>
                                <TableCell className="text-foreground text-sm text-muted-foreground">{book.author || "-"}</TableCell>
                                <TableCell className="text-foreground">{book.stock}</TableCell>
                                <TableCell className="text-foreground">{book.location}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 h-8 w-8 p-0"
                                        onClick={(e) => handleEdit(e, book)}
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
                                                onClick={handleDeleteClick}
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
                                        <AlertDialogContent className="bg-white border-border" onClick={(e) => e.stopPropagation()}>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle className="text-foreground">Hapus Buku?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Tindakan ini tidak dapat dibatalkan. Buku <strong>{book.title}</strong> akan dihapus permanen dari database.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel className="border-border text-foreground hover:bg-muted" onClick={(e) => e.stopPropagation()}>Batal</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        await deleteBook(book.id);
                                                    }}
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
                        {filteredBooks.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                    {searchTerm ? "Tidak ada buku yang cocok, coba kata kunci lain." : "Belum ada data buku. Silakan tambahkan buku baru."}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
