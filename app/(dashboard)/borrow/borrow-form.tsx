"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { borrowBook } from "@/app/(dashboard)/transactions/actions";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    memberId: z.string({ message: "Please select a member." }),
    bookId: z.string({ message: "Please select a book." }),
    dueDate: z.string({ message: "Please select a due date." }),
});

type BorrowFormProps = {
    members: { id: number; name: string; nis: string }[];
    books: { id: number; code: string; title: string; stock: number }[];
};

export function BorrowForm({ members, books }: BorrowFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [memberOpen, setMemberOpen] = useState(false);
    const [bookOpen, setBookOpen] = useState(false);
    const [memberSearch, setMemberSearch] = useState("");
    const [bookSearch, setBookSearch] = useState("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            dueDate: format(new Date(new Date().setDate(new Date().getDate() + 7)), "yyyy-MM-dd"),
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            await borrowBook(parseInt(values.memberId), parseInt(values.bookId), values.dueDate);
            router.push("/");
            router.refresh();
        } catch {
            setIsSubmitting(false);
        }
    }

    const filteredMembers = members.filter(member =>
        member.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
        member.nis.toLowerCase().includes(memberSearch.toLowerCase())
    );

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
        book.code.toLowerCase().includes(bookSearch)
    );

    return (
        <Card className="w-full max-w-lg mx-auto shadow-lg border-muted/40">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-serif font-bold">Borrow Book</CardTitle>
                <CardDescription>
                    Create a new loan transaction.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        <FormField
                            control={form.control}
                            name="memberId"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Member</FormLabel>
                                    <Popover open={memberOpen} onOpenChange={setMemberOpen}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={memberOpen}
                                                    className={cn(
                                                        "w-full justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? members.find((member) => String(member.id) === field.value)?.name
                                                        : "Select member"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                                            <div className="p-2 border-b">
                                                <Input
                                                    placeholder="Search member..."
                                                    value={memberSearch}
                                                    onChange={(e) => setMemberSearch(e.target.value)}
                                                    className="h-8"
                                                />
                                            </div>
                                            <div className="max-h-[200px] overflow-y-auto p-1">
                                                {filteredMembers.length === 0 ? (
                                                    <div className="py-6 text-center text-sm text-muted-foreground">No member found.</div>
                                                ) : (
                                                    filteredMembers.map((member) => (
                                                        <div
                                                            key={member.id}
                                                            className={cn(
                                                                "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                                                                String(member.id) === field.value && "bg-accent text-accent-foreground"
                                                            )}
                                                            onClick={() => {
                                                                form.setValue("memberId", String(member.id));
                                                                setMemberOpen(false);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    String(member.id) === field.value ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            <span className="truncate">{member.name}</span>
                                                            <span className="ml-auto text-xs text-muted-foreground pl-2">{member.nis}</span>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="bookId"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Book</FormLabel>
                                    <Popover open={bookOpen} onOpenChange={setBookOpen}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={bookOpen}
                                                    className={cn(
                                                        "w-full justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? books.find((book) => String(book.id) === field.value)?.title
                                                        : "Select book"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                                            <div className="p-2 border-b">
                                                <Input
                                                    placeholder="Search book..."
                                                    value={bookSearch}
                                                    onChange={(e) => setBookSearch(e.target.value)}
                                                    className="h-8"
                                                />
                                            </div>
                                            <div className="max-h-[200px] overflow-y-auto p-1">
                                                {filteredBooks.length === 0 ? (
                                                    <div className="py-6 text-center text-sm text-muted-foreground">No book found.</div>
                                                ) : (
                                                    filteredBooks.map((book) => (
                                                        <div
                                                            key={book.id}
                                                            className={cn(
                                                                "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                                                                String(book.id) === field.value && "bg-accent text-accent-foreground"
                                                            )}
                                                            onClick={() => {
                                                                form.setValue("bookId", String(book.id));
                                                                setBookOpen(false);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    String(book.id) === field.value ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            <span className="truncate">{book.title}</span>
                                                            <span className="ml-auto text-xs text-muted-foreground pl-2">{book.code}</span>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="dueDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Due Date</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input type="date" className="pl-9" {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 text-base shadow-md shadow-primary/20" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                "Confirm Loan"
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
