import { useEffect, useMemo, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

function getInitialTheme(): "light" | "dark" {
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
  return prefersDark ? "dark" : "light";
}

export function ModeToggle() {
  const initial = useMemo(() => (typeof window === "undefined" ? "light" : getInitialTheme()), []);
  const [theme, setTheme] = useState<"light" | "dark">(initial);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      className="group relative h-10 rounded-2xl border-border/70 bg-card/70 backdrop-blur px-3 shadow-sm hover:shadow-md transition-all duration-300"
      data-testid="theme-toggle"
      aria-label="Toggle theme"
    >
      <span className="mr-2 text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
        {theme === "dark" ? "Dark" : "Light"}
      </span>
      <span className="relative grid h-7 w-7 place-items-center rounded-xl bg-gradient-to-br from-foreground/5 to-foreground/0 border border-border/60">
        {theme === "dark" ? (
          <Moon className="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-6" />
        ) : (
          <Sun className="h-4 w-4 text-accent transition-transform duration-300 group-hover:-rotate-6" />
        )}
      </span>
    </Button>
  );
}
