import { PropsWithChildren } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Activity, Home, Users, Sparkles } from "lucide-react";
import { ModeToggle } from "@/components/ModeToggle";

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
        "group relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-300",
        "hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/15",
        active ? "bg-foreground/6 text-foreground" : "text-muted-foreground hover:text-foreground",
      )}
      data-testid={`nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <Icon
        className={cn(
          "h-4 w-4 transition-transform duration-300",
          active ? "text-primary" : "text-muted-foreground group-hover:text-primary",
          "group-hover:-translate-y-0.5",
        )}
      />
      <span>{label}</span>
      {active && (
        <span
          className="absolute inset-x-2 -bottom-1 h-[2px] rounded-full bg-gradient-to-r from-primary/0 via-primary/60 to-primary/0"
          aria-hidden="true"
        />
      )}
    </Link>
  );
}

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-dvh app-surface">
      <div className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-foreground/[0.06] to-transparent" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <header className="flex items-center justify-between py-6">
            <div className="flex items-center gap-3">
              <div className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-2xl border border-border/70 bg-card paper-crisp">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/18 via-transparent to-accent/16" />
                <Sparkles className="relative h-5 w-5 text-primary" />
              </div>
              <div className="leading-tight">
                <div className="text-base sm:text-lg font-semibold tracking-tight">
                  Minimal Admin
                </div>
                <div className="text-xs text-muted-foreground">
                  Health + users, beautifully done
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ModeToggle />
            </div>
          </header>

          <div className="grid grid-cols-1 gap-6 pb-10 lg:grid-cols-[280px_1fr] lg:gap-10">
            <aside className="enter">
              <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/80 p-4 backdrop-blur paper grain">
                <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-primary/10 to-transparent" />
                <div className="relative">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Navigation
                  </div>
                  <nav className="grid gap-1">
                    <NavLink href="/" label="Home" icon={Home} />
                    <NavLink href="/users" label="Users" icon={Users} />
                    <NavLink href="/health" label="Health" icon={Activity} />
                  </nav>

                  <div className="my-5 h-px w-full hairline" />

                  <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-foreground/[0.02] to-foreground/[0.00] p-4">
                    <div className="text-sm font-semibold">Design notes</div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      Clean minimal doesn’t mean flat. This UI uses a warm paper
                      base, crisp shadows, and subtle motion—so it feels calm but premium.
                    </p>
                  </div>
                </div>
              </div>
            </aside>

            <main className="enter-delayed">{children}</main>
          </div>

          <footer className="pb-10 text-center text-xs text-muted-foreground">
            <span className="opacity-70">
              Built with React, TanStack Query, wouter, and a tiny bit of taste.
            </span>
          </footer>
        </div>
      </div>
    </div>
  );
}
