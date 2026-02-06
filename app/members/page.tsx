import { db } from "@/lib/db";
import { members } from "@/db/schema";
import { MembersList } from "@/components/MembersList";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function MembersPage() {
    const session = await auth();
    if (!session) redirect("/login");

    const allMembers = await db.select().from(members);

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-foreground font-serif">Members Management</h1>
            </div>

            <MembersList initialMembers={allMembers} />
        </div>
    );
}
