"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { deleteMember } from "./actions";
import { members } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

type Member = InferSelectModel<typeof members>;

export function MembersList({ initialMembers }: { initialMembers: Member[] }) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredMembers = initialMembers.filter((member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.phone && member.phone.includes(searchTerm))
    );

    return (
        <div className="space-y-4">
            <div className="flex w-full max-w-sm items-center space-x-2">
                <Input
                    placeholder="Search by name or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm bg-white"
                />
            </div>
            <div className="rounded-lg border border-border overflow-hidden bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                            <TableHead className="text-muted-foreground">ID</TableHead>
                            <TableHead className="text-muted-foreground">Name</TableHead>
                            <TableHead className="text-muted-foreground">Phone</TableHead>
                            <TableHead className="text-muted-foreground">Joined Date</TableHead>
                            <TableHead className="text-right text-muted-foreground">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredMembers.map((member) => (
                            <TableRow key={member.id}>
                                <TableCell className="font-medium text-foreground">{member.id}</TableCell>
                                <TableCell className="text-foreground">{member.name}</TableCell>
                                <TableCell className="text-foreground">{member.phone}</TableCell>
                                <TableCell className="text-foreground">{member.createdAt ? member.createdAt.toLocaleDateString() : "-"}</TableCell>
                                <TableCell className="text-right">
                                    <form action={async () => {
                                        await deleteMember(member.id);
                                    }}>
                                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                            Delete
                                        </Button>
                                    </form>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredMembers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                    No members found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
