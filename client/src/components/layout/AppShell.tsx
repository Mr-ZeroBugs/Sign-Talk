import { PropsWithChildren } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Languages, BookOpen, Home } from "lucide-react";

const navItems = [
    { href: "/", label: "หน้าหลัก", icon: Home },
    { href: "/translate", label: "เเปลภาษามือ", icon: Languages },
    { href: "/talk-to-sign", label: "คลังท่าทาง", icon: BookOpen },
];

function NavLink({
    href,
    label,
    icon: Icon,
}: {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}) {
    const [location] = useLocation();
    const active = location === href;

    return (
        <Link
            href={href}
            className={cn(
                "group relative flex items-center gap-2 rounded-2xl px-2.5 py-2 text-xs font-black transition-all duration-300 md:px-3.5",
                active
                    ? "bg-slate-800 text-white shadow-[0_4px_16px_-4px_rgba(15,23,42,0.3)]"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/80"
            )}
        >
            <Icon className={cn("h-4 w-4 md:h-3.5 md:w-3.5", active && "animate-pulse")} />
            <span className="hidden tracking-tight md:inline">{label}</span>
        </Link>
    );
}

export default function AppShell({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-background text-slate-900 selection:bg-slate-200">
            {/* Minimalist Top Header */}
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center px-4 pt-4 md:px-6">
                <div className="max-w-7xl w-full bg-white/70 backdrop-blur-xl border border-slate-200/60 h-12 md:h-14 rounded-[20px] md:rounded-[24px] px-3 md:px-5 flex items-center justify-between shadow-[0_8px_32px_-8px_rgba(0,0,0,0.06)]">
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-lg md:rounded-xl bg-slate-800 border border-slate-700">
                            <Languages className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
                        </div>
                        <span className="hidden font-black text-xs md:text-sm tracking-[0.22em] uppercase text-slate-800 sm:inline">SignTalk</span>
                    </div>

                    <nav className="flex items-center gap-1.5">
                        {navItems.map((item) => (
                            <NavLink key={item.href} {...item} />
                        ))}
                    </nav>

                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white/80">
                            <div className="h-2 w-2 rounded-full bg-emerald-400" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Content Area */}
            <main className="pt-20 pb-10">
                {children}
            </main>

            {/* Subtle Vignette Background */}
            <div className="fixed inset-0 pointer-events-none z-[-1] opacity-50 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0),rgba(0,0,0,0.03))]" />
        </div>
    );
}
