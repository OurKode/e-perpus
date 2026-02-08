import "dotenv/config";
import { sql } from "drizzle-orm";
import { db } from "../lib/db";

async function main() {
    console.log("Dropping members table...");
    try {
        // Drop the table to force clean slate for migration
        await db.run(sql`DROP TABLE IF EXISTS members;`);
        // Also drop the conflicting index if it exists separately (though table drop should handle it)
        await db.run(sql`DROP INDEX IF EXISTS members_nis_nisn_unique;`);
        console.log("Members table dropped successfully.");
    } catch (error) {
        console.error("Error dropping table:", error);
    }
}

main();
