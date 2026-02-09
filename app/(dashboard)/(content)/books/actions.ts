'use server';

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { books } from "@/db/schema";

const bookSchema = z.object({
    code: z.string().min(1),
    title: z.string().min(1),
    author: z.string().optional(),
    publisher: z.string().optional(),
    publishedYear: z.coerce.number().optional(),
    isbn: z.string().optional(),
    totalPages: z.coerce.number().optional(),
    dimensions: z.string().optional(),
    edition: z.string().optional(),
    stock: z.coerce.number().min(0),
    location: z.string().optional(),
});

export async function createBook(formData: FormData) {
    const input = Object.fromEntries(formData.entries());
    const validation = bookSchema.safeParse(input);

    if (!validation.success) {
        return { error: "Invalid input" };
    }

    try {
        await db.insert(books).values({
            code: validation.data.code,
            title: validation.data.title,
            author: validation.data.author || "",
            publisher: validation.data.publisher || "",
            publishedYear: validation.data.publishedYear || null,
            isbn: validation.data.isbn || "",
            totalPages: validation.data.totalPages || null,
            dimensions: validation.data.dimensions || "",
            edition: validation.data.edition || "",
            stock: validation.data.stock,
            location: validation.data.location || "",
        });

        revalidatePath("/books");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        return { error: "Failed to create book. Code might be unique." };
    }
}

export async function deleteBook(id: number) {
    try {
        await db.delete(books).where(eq(books.id, id));
        revalidatePath("/books");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        return { error: "Failed to delete book." };
    }
}

export async function updateBook(id: number, formData: FormData) {
    const input = Object.fromEntries(formData.entries());
    const validation = bookSchema.safeParse(input);

    if (!validation.success) {
        return { error: "Invalid input" };
    }

    try {
        await db.update(books)
            .set({
                code: validation.data.code,
                title: validation.data.title,
                author: validation.data.author || "",
                publisher: validation.data.publisher || "",
                publishedYear: validation.data.publishedYear || null,
                isbn: validation.data.isbn || "",
                totalPages: validation.data.totalPages || null,
                dimensions: validation.data.dimensions || "",
                edition: validation.data.edition || "",
                stock: validation.data.stock,
                location: validation.data.location || "",
            })
            .where(eq(books.id, id));

        revalidatePath("/books");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        return { error: "Failed to update book. Code might be duplicate." };
    }
}
