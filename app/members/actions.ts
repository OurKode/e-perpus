'use server';

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { members } from "@/db/schema";

const memberSchema = z.object({
    name: z.string().min(1),
    phone: z.string().optional(),
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
            name: validation.data.name,
            phone: validation.data.phone || "",
            address: validation.data.address || "",
        });

        revalidatePath("/members");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        return { error: "Failed to create member." };
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
                name: validation.data.name,
                phone: validation.data.phone || "",
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
