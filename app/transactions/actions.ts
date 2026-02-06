'use server';

import { revalidatePath } from "next/cache";
import { differenceInCalendarDays } from "date-fns";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { books, transactions } from "@/db/schema";

export async function borrowBook(memberId: number, bookId: number, dueDate: string) {
    const book = await db.query.books.findFirst({
        where: eq(books.id, bookId),
    });

    if (!book || book.stock < 1) {
        return { error: "Book out of stock or not found." };
    }

    try {
        await db.transaction(async (tx) => {
            await tx.insert(transactions).values({
                memberId,
                bookId,
                borrowDate: new Date().toISOString().split('T')[0],
                dueDate: dueDate,
                status: "BORROWED",
            });

            await tx.update(books)
                .set({ stock: book.stock - 1 })
                .where(eq(books.id, bookId));
        });

        revalidatePath("/");
        revalidatePath("/books");
        return { success: true };
    } catch (error) {
        return { error: "Failed to process borrowing." };
    }
}

export async function returnBook(transactionId: number) {
    const transaction = await db.query.transactions.findFirst({
        where: eq(transactions.id, transactionId),
    });

    if (!transaction) return { error: "Transaction not found." };
    if (transaction.returnDate) return { error: "Already returned." };

    const today = new Date();
    const due = new Date(transaction.dueDate);
    const daysLate = differenceInCalendarDays(today, due);
    const fineAmount = daysLate > 0 ? daysLate * 500 : 0;

    try {
        await db.transaction(async (tx) => {
            await tx.update(transactions)
                .set({
                    returnDate: today.toISOString().split('T')[0],
                    status: "RETURNED",
                    fineAmount: fineAmount,
                })
                .where(eq(transactions.id, transactionId));

            const bookRes = await tx.select().from(books).where(eq(books.id, transaction.bookId)).limit(1);
            const book = bookRes[0];

            if (book) {
                await tx.update(books)
                    .set({ stock: book.stock + 1 })
                    .where(eq(books.id, transaction.bookId));
            }
        });

        revalidatePath("/");
        return { success: true, fine: fineAmount };
    } catch (error) {
        return { error: "Failed to return book." };
    }
}
