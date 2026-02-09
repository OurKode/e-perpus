export default function ContentLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="w-full min-h-screen p-8 bg-[#228B22] text-white">
            {children}
        </div>
    );
}
