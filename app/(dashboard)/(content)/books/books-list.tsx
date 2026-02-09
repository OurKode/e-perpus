"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { deleteBook } from "./actions";
import { books } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

type Book = InferSelectModel<typeof books>;

export function BooksList({ initialBooks }: { initialBooks: Book[] }) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredBooks = initialBooks.filter((book) =>
        book.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <div className="flex w-full max-w-sm items-center space-x-2">
                <Input
                    placeholder="Search by code or title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm bg-white"
                />
            </div>
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
                                <TableCell className="text-foreground">{book.location || "-"}</TableCell>
                                <TableCell className="text-right">
                                    <form action={async () => {
                                        await deleteBook(book.id);
                                    }}>
                                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                            Delete
                                        </Button>
                                    </form>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredBooks.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                    No books found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
