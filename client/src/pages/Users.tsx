import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Eye, Plus, Search, Users2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/SectionCard";
import { useCreateUser, useUsers } from "@/hooks/use-users";
import { useToast } from "@/hooks/use-toast";
import { insertUserSchema, type InsertUser } from "@shared/schema";

export default function UsersPage() {
  const { toast } = useToast();
  const users = useUsers();
  const createUser = useCreateUser();

  const [q, setQ] = useState("");
  const [form, setForm] = useState<InsertUser>({ username: "", password: "" });

  const filtered = useMemo(() => {
    const list = users.data ?? [];
    const query = q.trim().toLowerCase();
    if (!query) return list;
    return list.filter((u) => u.username.toLowerCase().includes(query) || u.id.toLowerCase().includes(query));
  }, [q, users.data]);

  async function onCreate() {
    const parsed = insertUserSchema.safeParse(form);
    if (!parsed.success) {
      toast({ title: "Invalid input", description: parsed.error.issues[0]?.message, variant: "destructive" });
      return;
    }
    try {
      await createUser.mutateAsync(parsed.data);
      setForm({ username: "", password: "" });
      toast({ title: "Created", description: "User added to directory." });
    } catch (e: any) {
      toast({ title: "Create failed", description: e?.message ?? "Unknown error", variant: "destructive" });
    }
  }

  return (
    <div className="space-y-6">
      <SectionCard
        title="Users"
        description="Search the directory and open a user detail page."
        right={
          <Button
            variant="outline"
            onClick={() => users.refetch()}
            data-testid="users-page-refresh"
            className="h-10 rounded-2xl border-border/70 bg-card/70 hover:bg-foreground/5 transition-all duration-300"
          >
            Refresh
          </Button>
        }
        data-testid="users-page"
      >
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5 paper-crisp">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Users2 className="h-4 w-4 text-primary" />
                <div className="text-sm font-semibold" data-testid="users-page-title">
                  Directory
                </div>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search username or id…"
                  className="h-11 rounded-2xl border-2 border-border bg-background pl-10 focus:ring-4 focus:ring-ring/10 transition-all duration-200"
                  data-testid="users-search"
                />
              </div>
            </div>

            <div className="mt-4">
              {users.isLoading ? (
                <div className="space-y-2" data-testid="users-page-loading">
                  <div className="h-11 rounded-xl bg-foreground/[0.04] animate-pulse" />
                  <div className="h-11 rounded-xl bg-foreground/[0.04] animate-pulse" />
                  <div className="h-11 rounded-xl bg-foreground/[0.04] animate-pulse" />
                </div>
              ) : users.isError ? (
                <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm" data-testid="users-page-error">
                  <div className="font-semibold text-destructive">Couldn’t load users</div>
                  <div className="mt-1 text-muted-foreground">{(users.error as any)?.message ?? "Unknown error"}</div>
                </div>
              ) : filtered.length === 0 ? (
                <div className="rounded-2xl border border-border/70 bg-foreground/[0.02] p-6 text-center" data-testid="users-page-empty">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-border/70 bg-card">
                    <Users2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="mt-3 text-sm font-semibold">No matches</div>
                  <p className="mt-1 text-xs text-muted-foreground">Try a different query.</p>
                </div>
              ) : (
                <div className="grid gap-2" data-testid="users-page-list">
                  {filtered.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/5"
                      data-testid={`users-page-row-${u.id}`}
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">{u.username}</div>
                        <div className="truncate text-xs text-muted-foreground">{u.id}</div>
                      </div>
                      <Link
                        href={`/users/${u.id}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-card/70 px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/15"
                        data-testid={`users-page-open-${u.id}`}
                      >
                        <Eye className="h-4 w-4 text-primary" />
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5 paper-crisp">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Quick add</div>
              <div className="rounded-full border border-border/70 bg-foreground/[0.03] px-3 py-1 text-[11px] font-semibold text-muted-foreground">
                POST /api/users
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <Input
                value={form.username}
                onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                placeholder="Username"
                className="h-11 rounded-2xl border-2 border-border bg-background focus:ring-4 focus:ring-ring/10 transition-all duration-200"
                data-testid="users-quick-username"
              />
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                placeholder="Password"
                className="h-11 rounded-2xl border-2 border-border bg-background focus:ring-4 focus:ring-ring/10 transition-all duration-200"
                data-testid="users-quick-password"
              />

              <Button
                onClick={onCreate}
                disabled={createUser.isPending || !form.username.trim() || !form.password.trim()}
                className="h-11 w-full rounded-2xl font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                data-testid="users-quick-submit"
              >
                <Plus className="mr-2 h-4 w-4" />
                {createUser.isPending ? "Creating..." : "Create user"}
              </Button>

              <p className="text-xs leading-relaxed text-muted-foreground" data-testid="users-quick-help">
                Want the simplest possible flow? This page is it: search + create + open details.
              </p>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
