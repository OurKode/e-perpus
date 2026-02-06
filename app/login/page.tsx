'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authenticate } from '@/app/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Playfair_Display, Inter } from 'next/font/google';
import { motion } from 'framer-motion';

// Font configurations
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'] });

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, 'Password is required'),
});

export default function LoginPage() {
    const [isPending, startTransition] = useTransition();
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    });

    function onSubmit(values: z.infer<typeof loginSchema>) {
        startTransition(async () => {
            const errorMessage = await authenticate(values);
            if (errorMessage) {
                alert(errorMessage);
            }
        });
    }

    return (
        <div
            className={`min-h-screen w-full flex items-center justify-center bg-white relative ${inter.className}`}
        >
            {/* Decorative Purity Strip - Emerald 50 */}
            <div className="absolute top-0 left-0 w-full h-[300px] bg-secondary/50 rounded-b-[3rem] z-0" />

            {/* Clean Card - White on White with Emerald Shadow */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-[420px] p-8 rounded-xl bg-white shadow-xl shadow-emerald-100/50 border border-border"
            >
                <div className="flex flex-col items-center mb-8 text-center pt-2">
                    {/* Logo - Gold/Green */}
                    <div className="w-14 h-14 mb-4 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-emerald-100">
                        <span className="text-white font-serif font-bold text-2xl">A</span>
                    </div>

                    <h1 className={`text-3xl font-bold tracking-tight mb-2 text-foreground ${playfair.className}`}>
                        MTs Aisyiyah
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Sign in to access your administrative dashboard.
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel className="text-sm font-medium text-foreground">
                                        Email Address
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="admin@mts-aisyiyah.sch.id"
                                            {...field}
                                            className="bg-white border-border focus:border-ring focus:ring-ring/20 rounded-md h-11 text-foreground placeholder:text-muted-foreground/50 transition-all font-medium"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-destructive text-xs" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel className="text-sm font-medium text-foreground">
                                        Password
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            {...field}
                                            className="bg-white border-border focus:border-ring focus:ring-ring/20 rounded-md h-11 text-foreground placeholder:text-muted-foreground/50 transition-all font-medium"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-destructive text-xs" />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-md shadow-lg shadow-emerald-100/50 mt-2 transition-all"
                        >
                            {isPending ? 'Authenticating...' : 'Sign In'}
                        </Button>
                    </form>
                </Form>
                <div className="mt-6 text-center text-xs text-muted-foreground/60">
                    &copy; {new Date().getFullYear()} MTs Aisyiyah. Pure & Enlightened.
                </div>
            </motion.div>
        </div>
    );
}
