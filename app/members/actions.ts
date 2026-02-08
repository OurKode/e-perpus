'use server';

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { members } from "@/db/schema";

const memberSchema = z.object({
    nis: z.string().min(1, "NIS/NISN is required"),
    name: z.string().min(1, "Name is required"),
    class: z.string().optional(),
    address: z.string().optional(),
});

export async function createMember(formData: FormData) {
    const input = Object.fromEntries(formData.entries());
    const validation = memberSchema.safeParse(input);

    if (!validation.success) {
        return { error: "Invalid input" };
    }

    try {
        await db.insert(members).values({
            nis: validation.data.nis,
            name: validation.data.name,
            class: validation.data.class || "",
            address: validation.data.address || "",
        });

        revalidatePath("/members");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        // Check for unique constraint violation on NIS usually
        return { error: "Failed to create member. NIS/NISN might already exist." };
    }
}

export async function deleteMember(id: number) {
    try {
        await db.delete(members).where(eq(members.id, id));
        revalidatePath("/members");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        return { error: "Failed to delete member." };
    }
}

export async function updateMember(id: number, formData: FormData) {
    const input = Object.fromEntries(formData.entries());
    const validation = memberSchema.safeParse(input);

    if (!validation.success) {
        return { error: "Invalid input" };
    }

    try {
        await db.update(members)
            .set({
                nis: validation.data.nis,
                name: validation.data.name,
                class: validation.data.class || "",
                address: validation.data.address || "",
            })
            .where(eq(members.id, id));

        revalidatePath("/members");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        return { error: "Failed to update member." };
    }
}
