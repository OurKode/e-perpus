import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../db/schema";

const dbUrl = process.env.TURSO_DATABASE_URL!;
const authToken = process.env.TURSO_AUTH_TOKEN;

const client = createClient({
    url: dbUrl,
    authToken: authToken,
});

export const db = drizzle(client, { schema });
