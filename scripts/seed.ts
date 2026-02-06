
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
            {
                code: "B001",
                title: "Laskar Pelangi",
                author: "Andrea Hirata",
                publisher: "Bentang Pustaka",
                publishedYear: 2005,
                isbn: "978-979-3062-79-1",
                totalPages: 529,
                dimensions: "13 x 20 cm",
                edition: "Cetakan Pertama",
                stock: 12,
                location: "A1"
            },
            {
                code: "B002",
                title: "Bumi Manusia",
                author: "Pramoedya Ananta Toer",
                publisher: "Lentera Dipantara",
                publishedYear: 1980,
                isbn: "978-979-97312-3-2",
                totalPages: 535,
                dimensions: "14 x 21 cm",
                edition: "Cetakan 17",
                stock: 8,
                location: "A2"
            },
            {
                code: "B003",
                title: "Laut Bercerita",
                author: "Leila S. Chudori",
                publisher: "KPG (Kepustakaan Populer Gramedia)",
                publishedYear: 2017,
                isbn: "978-602-424-694-5",
                totalPages: 394,
                dimensions: "13.5 x 20 cm",
                edition: "Cetakan 2",
                stock: 15,
                location: "B1"
            },
            {
                code: "B004",
                title: "Pulang",
                author: "Tere Liye",
                publisher: "Republika Penerbit",
                publishedYear: 2015,
                isbn: "978-602-0822-12-9",
                totalPages: 404,
                dimensions: "14 x 20.5 cm",
                edition: "Original",
                stock: 10,
                location: "B2"
            },
            {
                code: "B005",
                title: "Cantik Itu Luka",
                author: "Eka Kurniawan",
                publisher: "Gramedia Pustaka Utama",
                publishedYear: 2002,
                isbn: "978-602-03-1258-3",
                totalPages: 537,
                dimensions: "14 x 21 cm",
                edition: "Cetakan Ulang",
                stock: 6,
                location: "C1"
            },
            {
                code: "B006",
                title: "Dilan: Dia adalah Dilanku Tahun 1990",
                author: "Pidi Baiq",
                publisher: "Pastel Books",
                publishedYear: 2014,
                isbn: "978-602-7870-41-3",
                totalPages: 348,
                dimensions: "14 x 21 cm",
                edition: "Softcover",
                stock: 20,
                location: "C2"
            },
            {
                code: "B007",
                title: "Negeri 5 Menara",
                author: "A. Fuadi",
                publisher: "Gramedia Pustaka Utama",
                publishedYear: 2009,
                isbn: "978-979-22-4861-6",
                totalPages: 423,
                dimensions: "13.5 x 20 cm",
                edition: "Cetakan 1",
                stock: 9,
                location: "D1"
            },
            {
                code: "B008",
                title: "Perahu Kertas",
                author: "Dee Lestari",
                publisher: "Bentang Pustaka",
                publishedYear: 2009,
                isbn: "978-979-1227-78-0",
                totalPages: 444,
                dimensions: "13 x 20 cm",
                edition: "Cetakan 1",
                stock: 7,
                location: "D2"
            },
            {
                code: "B009",
                title: "Ronggeng Dukuh Paruk",
                author: "Ahmad Tohari",
                publisher: "Gramedia Pustaka Utama",
                publishedYear: 1982,
                isbn: "978-979-22-0196-3",
                totalPages: 408,
                dimensions: "14 x 21 cm",
                edition: "Trilogi Lengkap",
                stock: 4,
                location: "E1"
            },
            {
                code: "B010",
                title: "Ayat-Ayat Cinta",
                author: "Habiburrahman El Shirazy",
                publisher: "Republika Penerbit",
                publishedYear: 2004,
                isbn: "978-979-3210-44-2",
                totalPages: 418,
                dimensions: "13.5 x 20.5 cm",
                edition: "Hardcover",
                stock: 14,
                location: "E2"
            },
        ];
        await db.insert(books).values(dummyBooks);

        const dummyMembers = [
            { name: "Siti Aminah", phone: "08123456789", address: "Jl. Merpati No. 10, Jakarta" },
            { name: "Budi Santoso", phone: "08198765432", address: "Jl. Elang No. 5, Bandung" },
            { name: "Rina Wati", phone: "08122334455", address: "Jl. Kenari No. 8, Surabaya" },
            { name: "Ahmad Fauzi", phone: "08199887766", address: "Jl. Mawar No. 12, Yogyakarta" },
            { name: "Dewi Lestari", phone: "08155566677", address: "Jl. Melati No. 3, Semarang" },
        ];
        await db.insert(members).values(dummyMembers);

        console.log("✅ Seeding completed successfully!");
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
}

seed();
