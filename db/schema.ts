import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const users = sqliteTable("users", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    email: text("email").unique().notNull(),
    password: text("password").notNull(),
});

export const members = sqliteTable("members", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    phone: text("phone"),
    createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
});

export const membersRelations = relations(members, ({ many }) => ({
    transactions: many(transactions),
}));

export const books = sqliteTable("books", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    code: text("code").unique().notNull(),
    title: text("title").notNull(),
    stock: integer("stock").default(0).notNull(),
    location: text("location"),
});

export const booksRelations = relations(books, ({ many }) => ({
    transactions: many(transactions),
}));

export const transactions = sqliteTable("transactions", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    memberId: integer("member_id").references(() => members.id).notNull(),
    bookId: integer("book_id").references(() => books.id).notNull(),
    borrowDate: text("borrow_date").notNull(), // ISO YYYY-MM-DD
    dueDate: text("due_date").notNull(),       // ISO YYYY-MM-DD
    returnDate: text("return_date"),           // ISO YYYY-MM-DD or null
    status: text("status").default("BORROWED").notNull(), // BORROWED, RETURNED
    fineAmount: integer("fine_amount").default(0).notNull(), // stored in smallest currency unit or just integer
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
    member: one(members, {
        fields: [transactions.memberId],
        references: [members.id],
    }),
    book: one(books, {
        fields: [transactions.bookId],
        references: [books.id],
    }),
}));
