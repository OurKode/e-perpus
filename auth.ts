import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { authConfig } from "@/auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;

                    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
                    const user = result[0];

                    if (!user) return null;

                    // Note: In production, use bcrypt/argon2 compare here.
                    // For MVP as requested: simple comparison
                    if (password === user.password) {
                        return {
                            id: String(user.id),
                            email: user.email,
                            name: user.email
                        };
                    }
                }
                return null;
            },
        }),
    ],
});
