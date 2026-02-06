import { db } from "@/lib/db";
import { books } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BooksList } from "@/components/BooksList";
import { createBook } from "./actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function BooksPage() {
    const session = await auth();
    if (!session) redirect("/login");

    const allBooks = await db.select().from(books);

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-foreground font-serif">Books Management</h1>
            </div>

            <BooksList initialBooks={allBooks} />
        </div>
    );
}
