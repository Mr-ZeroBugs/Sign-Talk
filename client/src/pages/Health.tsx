import { Activity, ArrowRight, Server, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/SectionCard";
import { StatPill } from "@/components/StatPill";
import { useHealthCheck } from "@/hooks/use-health";
import { useToast } from "@/hooks/use-toast";

export default function HealthPage() {
  const { toast } = useToast();
  const health = useHealthCheck();

  async function onPing() {
    try {
      const result = await health.mutateAsync();
      toast({
        title: "Server healthy",
        description: `ok = ${String(result.ok)}`,
      });
    } catch (e: any) {
      toast({
        title: "Health failed",
        description: e?.message ?? "Unknown error",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="space-y-6">
      <SectionCard
        title="Health check"
        description="A minimal action that confirms the API is alive: GET /api/health → { ok: true }."
        right={
          <Button
            onClick={onPing}
            data-testid="health-page-ping"
            className="h-10 rounded-2xl px-5 font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
          >
            <ShieldCheck className="mr-2 h-4 w-4" />
            Ping
            <ArrowRight className="ml-2 h-4 w-4 opacity-80" />
          </Button>
        }
        data-testid="health-page"
      >
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-card p-5 paper-crisp">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-primary" />
              <div className="text-sm font-semibold">Result</div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <StatPill
                label="ok"
                value={health.data?.ok ? "true" : "—"}
                tone={health.data?.ok ? "good" : "neutral"}
                data-testid="health-page-ok-pill"
              />
              <StatPill
                label="state"
                value={health.isPending ? "loading" : health.isError ? "error" : health.data ? "success" : "idle"}
                tone={health.isError ? "warn" : health.data ? "good" : "neutral"}
                data-testid="health-page-state-pill"
              />
            </div>

            <div className="mt-4 rounded-2xl border border-border/70 bg-foreground/[0.02] p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Endpoint
              </div>
              <div className="mt-2 text-sm font-semibold">GET /api/health</div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-5 paper-crisp">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-accent" />
              <div className="text-sm font-semibold">Notes</div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground" data-testid="health-page-notes">
              This page focuses on a single action with strong feedback. Use it while developing
              backend routes: if this fails, your API server likely isn’t responding or route
              handlers aren’t registered yet.
            </p>

            <Button
              variant="outline"
              onClick={onPing}
              data-testid="health-page-ping-outline"
              className="mt-4 h-11 w-full rounded-2xl border-border/70 bg-card/70 hover:bg-foreground/5 transition-all duration-300"
            >
              Ping again
            </Button>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
