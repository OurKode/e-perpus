'use server';

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    telp: z.coerce.number().optional(),
    address: z.string().optional(),
});

export async function updateProfile(formData: FormData) {
    const session = await auth();
    if (!session?.user?.email) redirect("/login");

    const name = formData.get("name") as string;
    const telp = formData.get("telp");
    const address = formData.get("address") as string;

    const validatedFields = profileSchema.safeParse({
        name,
        telp: telp ? Number(telp) : undefined,
        address
    });

    if (!validatedFields.success) {
        return { error: "Invalid fields" };
    }

    try {
        await db.update(users)
            .set({
                name: validatedFields.data.name,
                telp: validatedFields.data.telp,
                address: validatedFields.data.address,
            })
            .where(eq(users.email, session.user.email));

        revalidatePath("/profile");
        revalidatePath("/");
        return { success: "Profile updated successfully" };
    } catch (error) {
        return { error: "Failed to update profile" };
    }
}
