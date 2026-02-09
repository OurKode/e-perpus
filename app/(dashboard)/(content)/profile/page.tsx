import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { updateProfile } from "./actions";
import { UserPen } from "lucide-react";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage() {
    const session = await auth();
    if (!session?.user?.email) redirect("/login");

    const user = await db.query.users.findFirst({
        where: eq(users.email, session.user.email),
    });

    if (!user) redirect("/login");

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white font-serif tracking-tight">Edit Profile</h1>
                <p className="text-green-100">Update your personal information.</p>
            </div>

            <Card className="border-none shadow-lg bg-white/95 backdrop-blur">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                            <UserPen className="h-6 w-6 text-green-700" />
                        </div>
                        <div>
                            <CardTitle className="text-xl text-gray-800">Profile Settings</CardTitle>
                            <CardDescription>Manage your account details and preferences.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ProfileForm user={user} />
                </CardContent>
            </Card>
        </div>
    );
}
