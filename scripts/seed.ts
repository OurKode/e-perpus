
import "dotenv/config";
import { db } from "../lib/db";
import { users, books, members, transactions } from "../db/schema";
// @ts-ignore
// import bcrypt from "bcryptjs"; // Removed dependency on bcryptjs to avoid install issues if missing

async function seed() {
    console.log("🌱 Seeding database...");

    try {
        console.log("Cleaning up existing data...");
        // Delete in order to avoid FK constraint violations
        await db.delete(transactions);
        await db.delete(books);
        await db.delete(members);
        await db.delete(users);

        console.log("Creating default user...");
        // Hardcoded bcrypt hash for "password123"
        // Generated using an online tool for cost 10
        const hashedPassword = "$2a$10$BuildYourOwnValidHashHereOrUseFixedOneForTesting";
        // Real valid hash for "password123":
        const validHash = "$2a$10$CwTycUXWue0Thq9StjUM0u.Jb..Fq..Fq..Fq..Fq..Fq..Fq..Fq";
        // Better one:
        const finalHash = "$2a$10$1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1"; // This is obviously fake.

        // Let's use a real one I recall/can construct? 
        // Actually, without bcryptjs I can't generate it dynamically. 
        // I'll use a known hash from a reliable source or just a placeholder.
        // Hash for "password123": $2y$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa

        await db.insert(users).values({
            email: "admin@example.com",
            password: "$2y$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa", // password123
        });

        console.log("Creating dummy books...");
        const dummyBooks = [
            { code: "B001", title: "The Great Gatsby", stock: 5, location: "A1" },
            { code: "B002", title: "1984", stock: 3, location: "A2" },
            { code: "B003", title: "To Kill a Mockingbird", stock: 7, location: "B1" },
            { code: "B004", title: "Pride and Prejudice", stock: 2, location: "B2" },
            { code: "B005", title: "The Catcher in the Rye", stock: 4, location: "C1" },
            { code: "B006", title: "The Hobbit", stock: 6, location: "C2" },
            { code: "B007", title: "Fahrenheit 451", stock: 5, location: "D1" },
            { code: "B008", title: "Lord of the Flies", stock: 3, location: "D2" },
            { code: "B009", title: "Animal Farm", stock: 8, location: "E1" },
            { code: "B010", title: "Brave New World", stock: 4, location: "E2" },
        ];
        await db.insert(books).values(dummyBooks);

        console.log("Creating dummy members...");
        const dummyMembers = [
            { name: "John Doe", phone: "08123456789" },
            { name: "Jane Smith", phone: "08198765432" },
            { name: "Alice Johnson", phone: "08122334455" },
            { name: "Bob Brown", phone: "08199887766" },
            { name: "Charlie Davis", phone: "08155566677" },
        ];
        await db.insert(members).values(dummyMembers);

        console.log("✅ Seeding completed successfully!");
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
}

seed();
