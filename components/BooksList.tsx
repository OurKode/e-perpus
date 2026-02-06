'use client';

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteBook, createBook, updateBook } from "@/app/books/actions";
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

interface Book {
    id: number;
    code: string;
    title: string;
    stock: number;
    location: string | null;
}

export function BooksList({ initialBooks }: { initialBooks: Book[] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentBook, setCurrentBook] = useState<Book | null>(null);

    const filteredBooks = initialBooks.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreate = () => {
        setIsEditing(false);
        setCurrentBook(null);
        setIsOpen(true);
    };

    const handleEdit = (book: Book) => {
        setIsEditing(true);
        setCurrentBook(book);
        setIsOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari Judul atau Kode Buku..."
                        className="pl-9 bg-white border-border text-foreground max-w-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button onClick={handleCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" /> Add New Book
                </Button>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="bg-white border-border">
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
                        <div className="space-y-2">
                            <Label htmlFor="code" className="text-foreground">Code</Label>
                            <Input
                                id="code"
                                name="code"
                                placeholder="BK-001"
                                required
                                defaultValue={isEditing ? currentBook?.code : ""}
                                className="bg-white border-border text-foreground"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-foreground">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="Book Title"
                                required
                                defaultValue={isEditing ? currentBook?.title : ""}
                                className="bg-white border-border text-foreground"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="stock" className="text-foreground">Stock</Label>
                            <Input
                                id="stock"
                                name="stock"
                                type="number"
                                min="0"
                                required
                                defaultValue={isEditing ? currentBook?.stock : 1}
                                className="bg-white border-border text-foreground"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location" className="text-foreground">Location</Label>
                            <Input
                                id="location"
                                name="location"
                                placeholder="Shelf A1"
                                defaultValue={isEditing ? currentBook?.location || "" : ""}
                                className="bg-white border-border text-foreground"
                            />
                        </div>
                        <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                            {isEditing ? "Update Book" : "Save Book"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="rounded-lg border border-border overflow-hidden bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                            <TableHead className="text-muted-foreground">Code</TableHead>
                            <TableHead className="text-muted-foreground">Title</TableHead>
                            <TableHead className="text-muted-foreground">Stock</TableHead>
                            <TableHead className="text-muted-foreground">Location</TableHead>
                            <TableHead className="text-right text-muted-foreground">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredBooks.map((book) => (
                            <TableRow key={book.id}>
                                <TableCell className="font-medium text-foreground">{book.code}</TableCell>
                                <TableCell className="text-foreground">{book.title}</TableCell>
                                <TableCell className="text-foreground">{book.stock}</TableCell>
                                <TableCell className="text-foreground">{book.location}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                        onClick={() => handleEdit(book)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                        <span className="sr-only">Edit</span>
                                    </Button>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                Delete
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="bg-white border-border">
                                            <AlertDialogHeader>
                                                <AlertDialogTitle className="text-foreground">Hapus Buku?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Tindakan ini tidak dapat dibatalkan. Buku akan dihapus permanen dari database.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel className="border-border text-foreground hover:bg-muted">Batal</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={async () => await deleteBook(book.id)}
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
                                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
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
