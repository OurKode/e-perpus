import { db } from "@/lib/db";
import { books, members } from "@/db/schema";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { gt } from "drizzle-orm";
import { BorrowForm } from "./borrow-form";

export default async function BorrowPage() {
    const session = await auth();
    if (!session) redirect("/login");

    // Fetch available books and members
    const availableBooks = await db.select().from(books).where(gt(books.stock, 0));
    const allMembers = await db.select().from(members);

    return (
        <div className="p-8 flex items-start justify-center min-h-[calc(100vh-4rem)]">
            <BorrowForm members={allMembers} books={availableBooks} />
        </div>
    );
}
