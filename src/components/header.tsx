
"use client";

import Link from "next/link";
import { Moon, Sun, HeartPulse, Sparkles, Menu, User as UserIcon, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { EmergencyModal } from "./emergency-modal";
import { useState } from "react";
import { useTheme } from "./theme-provider";
import { useUser, useAuth } from "@/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Skeleton } from "./ui/skeleton";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

function Logo() {
    return (
        <Link href="/" className="flex items-center space-x-3 group">
            <motion.div 
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.8, ease: "anticipate" }}
                className="bg-accent/20 p-2 rounded-xl border border-accent/30 shadow-[0_0_20px_rgba(var(--accent),0.2)]"
            >
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-accent" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" opacity="0.3" />
                    <path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
            </motion.div>
            <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight font-headline text-white leading-none">
                    PeaceMind
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-accent font-bold mt-0.5">
                    Sanctuary
                </span>
            </div>
        </Link>
    );
}

function ThemeToggle() {
    const { setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white/5">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass border-white/10 rounded-2xl">
                <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

const navLinks = [
    { href: "/tools", label: "Care Suite" },
    { href: "/intake", label: "Screening" },
    { href: "/resources", label: "Care Guide" },
    { href: "/community", label: "Community" },
];

function UserNav() {
    const { user, isUserLoading } = useUser();
    const auth = useAuth();
    const router = useRouter();

    if (isUserLoading) {
        return <Skeleton className="h-10 w-10 rounded-full" />;
    }

    if (!user) {
        return (
            <div className="hidden md:flex items-center gap-3">
                <Button variant="ghost" asChild className="rounded-xl hover:bg-white/5">
                    <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl px-6 font-bold shadow-lg shadow-accent/20">
                    <Link href="/signup">Sign Up</Link>
                </Button>
            </div>
        );
    }
    
    const getInitials = (name: string | null | undefined) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }

    const handleLogout = async () => {
        if (auth) {
            await auth.signOut();
        }
        router.push('/');
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 border border-white/10">
                    <Avatar className="h-full w-full">
                        <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? ''} />
                        <AvatarFallback className="bg-accent/10 text-accent font-bold">{getInitials(user.displayName)}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 glass border-white/10 rounded-3xl p-2 mt-2">
                 <div className="px-4 py-4">
                    <p className="text-sm font-bold leading-none">{user.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground mt-1.5">{user.email}</p>
                 </div>
                 <DropdownMenuSeparator className="bg-white/5" />
                 <DropdownMenuItem asChild className="rounded-xl mt-1">
                    <Link href="/profile"><UserIcon className="mr-3 h-4 w-4" />My Profile</Link>
                 </DropdownMenuItem>
                 <DropdownMenuItem asChild className="rounded-xl">
                    <Link href="/intake"><ShieldCheck className="mr-3 h-4 w-4" />New Screening</Link>
                 </DropdownMenuItem>
                 <DropdownMenuSeparator className="bg-white/5" />
                 <DropdownMenuItem onClick={handleLogout} className="rounded-xl text-red-400 focus:bg-red-500/10 focus:text-red-400">
                    <LogOut className="mr-3 h-4 w-4"/>
                    Log out from Sanctuary
                 </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export function Header() {
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-[100] w-full border-b border-white/5 bg-background/80 backdrop-blur-3xl">
        <div className="container flex h-20 items-center justify-between">
          <Logo />
          
          <nav className="items-center space-x-1 hidden md:flex">
            {navLinks.map(link => (
                <Link 
                    key={link.href} 
                    href={link.href} 
                    className="px-4 py-2 rounded-xl text-sm font-medium text-white/50 transition-all hover:text-white hover:bg-white/5"
                >
                    {link.label}
                </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
             <div className="hidden md:flex">
                <Button
                    variant="destructive"
                    size="sm"
                    className="h-10 px-4 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all font-bold text-xs uppercase tracking-widest"
                    onClick={() => setEmergencyModalOpen(true)}
                >
                    <HeartPulse className="mr-2 h-4 w-4" />
                    Emergency
                </Button>
            </div>
            <ThemeToggle />
            <UserNav />
            <div className="md:hidden">
                 <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-xl">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="glass border-l-white/10 w-full max-w-[300px]">
                        <SheetHeader className="mb-8">
                            <Logo />
                        </SheetHeader>
                        <div className="flex flex-col gap-2">
                            {navLinks.map(link => (
                                <SheetClose key={link.href} asChild>
                                    <Link href={link.href} className="flex items-center h-14 px-6 rounded-2xl text-lg font-medium text-white/70 hover:bg-white/5 hover:text-white">
                                        {link.label}
                                    </Link>
                                </SheetClose>
                            ))}
                             <div className="mt-8 pt-8 border-t border-white/5">
                                 <Button
                                    variant="destructive"
                                    className="w-full h-14 rounded-2xl font-bold bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white"
                                    onClick={() => setEmergencyModalOpen(true)}
                                    >
                                    <HeartPulse className="mr-3 h-5 w-5" />
                                    Emergency Support
                                </Button>
                             </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
          </div>
        </div>
      </header>
      <EmergencyModal open={emergencyModalOpen} onOpenChange={setEmergencyModalOpen} />
    </>
  );
}
