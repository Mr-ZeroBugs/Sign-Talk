import { useMemo } from "react";
import { useParams, Link } from "wouter";
import { ArrowLeft, Fingerprint, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/SectionCard";
import { StatPill } from "@/components/StatPill";
import { useUser } from "@/hooks/use-users";

export default function UserDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? null;

  const userQuery = useUser(id);

  const initials = useMemo(() => {
    const username = userQuery.data?.username ?? "";
    const parts = username.split(/[._\s-]+/).filter(Boolean);
    const a = parts[0]?.[0] ?? username[0] ?? "U";
    const b = parts[1]?.[0] ?? username[1] ?? "";
    return (a + b).toUpperCase();
  }, [userQuery.data?.username]);

  return (
    <div className="space-y-6">
      <SectionCard
        title="User details"
        description="Fetched from GET /api/users/:id. This is a read-only detail page."
        right={
          <Link
            href="/users"
            className="inline-flex items-center gap-2 rounded-2xl border border-border/70 bg-card/70 px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/15"
            data-testid="user-back-link"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        }
        data-testid="user-detail-page"
      >
        {userQuery.isLoading ? (
          <div className="grid gap-3" data-testid="user-detail-loading">
            <div className="h-24 rounded-2xl bg-foreground/[0.04] animate-pulse" />
            <div className="h-24 rounded-2xl bg-foreground/[0.04] animate-pulse" />
          </div>
        ) : userQuery.data === null ? (
          <div className="rounded-2xl border border-border/70 bg-foreground/[0.02] p-6 text-center" data-testid="user-detail-notfound">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-border/70 bg-card">
              <UserRound className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="mt-3 text-sm font-semibold">User not found</div>
            <p className="mt-1 text-xs text-muted-foreground">
              The server returned 404 for this id.
            </p>
            <div className="mt-4">
              <Link href="/users" className="inline-block">
                <Button
                  variant="outline"
                  className="rounded-2xl border-border/70 bg-card/70 hover:bg-foreground/5 transition-all duration-300"
                  data-testid="user-detail-back-button"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Return to users
                </Button>
              </Link>
            </div>
          </div>
        ) : userQuery.isError ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm" data-testid="user-detail-error">
            <div className="font-semibold text-destructive">Couldn’t load user</div>
            <div className="mt-1 text-muted-foreground">{(userQuery.error as any)?.message ?? "Unknown error"}</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[0.9fr_1.1fr]" data-testid="user-detail-content">
            <div className="rounded-2xl border border-border/70 bg-card p-5 paper-crisp">
              <div className="flex items-start gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-2xl border border-border/70 bg-gradient-to-br from-primary/12 via-foreground/[0.02] to-accent/10">
                  <span className="text-lg font-semibold">{initials}</span>
                </div>
                <div className="min-w-0">
                  <div className="truncate text-lg font-semibold" data-testid="user-detail-username">
                    {userQuery.data!.username}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <StatPill label="Type" value="User" data-testid="user-detail-type" />
                  </div>
                </div>
              </div>

              <div className="mt-5 h-px w-full hairline" />

              <div className="mt-5 grid gap-3">
                <div className="rounded-2xl border border-border/70 bg-foreground/[0.02] p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    <Fingerprint className="h-4 w-4 text-primary" />
                    Identifier
                  </div>
                  <div className="mt-2 break-all text-sm font-semibold" data-testid="user-detail-id">
                    {userQuery.data!.id}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card p-5 paper-crisp">
              <div className="text-sm font-semibold">About this page</div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground" data-testid="user-detail-about">
                The backend schema includes a password field, but a real app should never return
                password hashes to the client. This UI intentionally shows only the safe user fields
                available in the API response.
              </p>

              <div className="mt-5 rounded-2xl border border-border/70 bg-foreground/[0.02] p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Endpoint
                </div>
                <div className="mt-2 text-sm font-semibold">GET /api/users/{userQuery.data!.id}</div>
              </div>

              <div className="mt-5">
                <Link
                  href="/health"
                  className="inline-flex items-center gap-2 rounded-2xl border border-border/70 bg-card/70 px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/15"
                  data-testid="user-detail-to-health"
                >
                  Check server health
                </Link>
              </div>
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
