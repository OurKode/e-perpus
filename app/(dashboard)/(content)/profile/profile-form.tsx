"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "./actions";
// Assuming generic toast/alert usage if available, implementation detail below

export function ProfileForm({
    user
}: {
    user: { email: string; name: string | null; telp: number | null; address: string | null }
}) {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = (formData: FormData) => {
        setMessage(null);
        startTransition(async () => {
            const result = await updateProfile(formData);
            if (result.error) {
                setMessage({ type: 'error', text: result.error });
            } else if (result.success) {
                setMessage({ type: 'success', text: result.success });
            }
        });
    };

    return (
        <form action={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                <Input
                    id="email"
                    value={user.email}
                    disabled
                    className="bg-gray-100 border-gray-200 text-gray-600 cursor-not-allowed text-base py-6"
                />
                <p className="text-xs text-muted-foreground">Email address cannot be changed.</p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                <Input
                    id="name"
                    name="name"
                    defaultValue={user.name || ""}
                    placeholder="Enter your full name"
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500 text-base py-6"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="telp" className="text-gray-700">Phone Number</Label>
                <Input
                    id="telp"
                    name="telp"
                    type="number"
                    defaultValue={user.telp || ""}
                    placeholder="Enter your phone number"
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500 text-base py-6"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="address" className="text-gray-700">Address</Label>
                <Input
                    id="address"
                    name="address"
                    defaultValue={user.address || ""}
                    placeholder="Enter your address"
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500 text-base py-6"
                />
            </div>

            {message && (
                <div className={`p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="pt-4 flex justify-end">
                <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-green-700 hover:bg-green-800 text-white px-8 py-6 text-base font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-70"
                >
                    {isPending ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </form>
    );
}
