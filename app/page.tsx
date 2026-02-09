import { db } from "@/lib/db";
import { books, transactions, members } from "@/db/schema";
import { count, eq, isNull, sql } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { differenceInCalendarDays, format } from "date-fns";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ReturnButton } from "@/components/ReturnButton";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");


  // Fetch Stats
  const totalBooksRes = await db.select({ count: count() }).from(books);
  const totalMembersRes = await db.select({ count: count() }).from(members);
  const activeLoansRes = await db.select({ count: count() }).from(transactions).where(isNull(transactions.returnDate));

  const totalBooks = totalBooksRes[0]?.count ?? 0;
  const totalMembers = totalMembersRes[0]?.count ?? 0;
  const activeLoans = activeLoansRes[0]?.count ?? 0;

  // Fetch Active Loans
  const activeTransactions = await db.select({
    id: transactions.id,
    bookTitle: books.title,
    bookCode: books.code,
    memberName: members.name,
    borrowDate: transactions.borrowDate,
    dueDate: transactions.dueDate,
  })
    .from(transactions)
    .leftJoin(books, eq(transactions.bookId, books.id))
    .leftJoin(members, eq(transactions.memberId, members.id))
    .where(isNull(transactions.returnDate));

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground font-serif tracking-tight">Dashboard Perpustakaan</h1>
        <div className="text-sm text-muted-foreground">
          Selamat Datang, Administrator
        </div>
      </div>

      {/* Stats Counters - "Pure Light" Design */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Total Judul Buku */}
        <Card className="border-l-4 border-l-primary shadow-emerald-100 bg-gradient-to-br from-emerald-50 to-emerald-100/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uSppercase tracking-widest">Total Judul Buku</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">{totalBooks}</div>
          </CardContent>
        </Card>

        {/* Total Siswa */}
        <Card className="border-l-4 border-l-primary shadow-emerald-100 bg-gradient-to-br from-emerald-50 to-emerald-100/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Total Siswa Terdaftar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">{totalMembers}</div>
          </CardContent>
        </Card>

        {/* Sedang Dipinjam */}
        <Card className="border-l-4 border-l-amber-500 shadow-amber-50 bg-gradient-to-br from-amber-50 to-amber-100/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-600 uppercase tracking-widest">Sedang Dipinjam</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-amber-600">{activeLoans}</div>
          </CardContent>
        </Card>
      </div>

      {/* Active Loans Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Peminjaman Aktif</h2>
        <div className="rounded-lg border border-border overflow-hidden bg-emerald-50/50 shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead>Judul Buku</TableHead>
                <TableHead>Peminjam</TableHead>
                <TableHead>Tanggal Pinjam</TableHead>
                <TableHead>Tanggal Pengembalian Buku</TableHead>
                <TableHead>Denda</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeTransactions.map((t) => {
                const daysLate = differenceInCalendarDays(new Date(), new Date(t.dueDate));
                const isOverdue = daysLate > 0;

                return (
                  <TableRow key={t.id}>
                    <TableCell>
                      <div className="font-medium text-foreground">{t.bookTitle}</div>
                      <div className="text-xs text-muted-foreground">{t.bookCode}</div>
                    </TableCell>
                    <TableCell className="text-foreground">{t.memberName}</TableCell>
                    <TableCell className="text-muted-foreground">{format(new Date(t.borrowDate), "d MMM yyyy")}</TableCell>
                    <TableCell>
                      <span className={isOverdue ? "text-rose-600 font-bold" : "text-foreground"}>
                        {format(new Date(t.dueDate), "d MMM yyyy")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={isOverdue ? "text-rose-600 font-medium" : "text-muted-foreground"}>
                        {isOverdue ? `Rp ${(daysLate * 5000).toLocaleString("id-ID")}` : "-"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {isOverdue ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-100">
                          Terlambat ({daysLate} Hari)
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                          Sedang Dipinjam
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <ReturnButton transactionId={t.id} />
                    </TableCell>
                  </TableRow>
                );
              })}
              {activeTransactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-32 text-muted-foreground">
                    Tidak ada peminjaman aktif saat ini.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
