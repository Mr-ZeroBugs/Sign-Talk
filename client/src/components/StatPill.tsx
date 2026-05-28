import { cn } from "@/lib/utils";

export function StatPill({
  label,
  value,
  tone = "neutral",
  "data-testid": dataTestId,
}: {
  label: string;
  value: string;
  tone?: "neutral" | "good" | "warn";
  "data-testid"?: string;
}) {
  const toneClasses =
    tone === "good"
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
      : tone === "warn"
        ? "border-amber-500/20 bg-amber-500/10 text-amber-800 dark:text-amber-200"
        : "border-border/70 bg-foreground/[0.03] text-foreground";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
        toneClasses,
      )}
      data-testid={dataTestId}
    >
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
