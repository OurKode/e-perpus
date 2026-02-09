import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Book, Users, LogOut } from "lucide-react";
import { signOut } from "@/auth";
import { ServiceHoursDialog } from "@/components/ServiceHoursDialog";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair",
});

function Sidebar() {
    return (
        <div className="fixed inset-y-0 left-0 z-50 pb-12 w-75 border-r border-sidebar-border bg-sidebar hidden md:block shadow-sm shadow-blue-900/20">
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    {/* Brand */}
                    <div className="mb-8 px-4 flex items-center gap-3">
                        <img src="/logo.png" alt="Logo" className="w-30 h-30 rounded-lg object-cover shadow-sm shadow-blue-900/20" />
                        <h2 className={`text-xl font-bold tracking-tight text-sidebar-foreground ${playfair.className}`}>
                            Perpustakaan MTS - MAS Aisyiyah Binjai
                        </h2>
                    </div>
                    <div className="space-y-1">
                        {/* Navigation Items - Deep Green text, Gold/Green active accents */}
                        <Link href="/">
                            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent hover:border-l-4 hover:border-accent-foreground transition-all duration-200 rounded-none rounded-r-lg pl-3">
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                Halaman utama
                            </Button>
                        </Link>
                        <Link href="/books">
                            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent hover:border-l-4 hover:border-accent-foreground transition-all duration-200 rounded-none rounded-r-lg pl-3">
                                <Book className="mr-2 h-4 w-4" />
                                Buku
                            </Button>
                        </Link>
                        <Link href="/members">
                            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent hover:border-l-4 hover:border-accent-foreground transition-all duration-200 rounded-none rounded-r-lg pl-3">
                                <Users className="mr-2 h-4 w-4" />
                                Anggota
                            </Button>
                        </Link>
                        <Link href="/borrow">
                            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent hover:border-l-4 hover:border-accent-foreground transition-all duration-200 rounded-none rounded-r-lg pl-3">
                                <Book className="mr-2 h-4 w-4" />
                                Peminjaman Buku
                            </Button>
                        </Link>
                        {/* Service Hours Info */}
                        <ServiceHoursDialog />
                        {/* Logout */}
                        <form action={async () => {
                            'use server';
                            await signOut();
                        }} className="pt-4 mt-4 border-t border-sidebar-border">
                            <Button variant="ghost" className="w-full justify-start text-sidebar-primary hover:text-red-600 hover:bg-red-50">
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 min-h-screen p-8 bg-[#228B22] text-white">
                {children}
            </main>
        </div>
    );
}
