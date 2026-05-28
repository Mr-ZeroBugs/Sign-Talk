import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

export function SectionCard({
  title,
  description,
  right,
  className,
  children,
  "data-testid": dataTestId,
}: PropsWithChildren<{
  title: string;
  description?: string;
  right?: React.ReactNode;
  className?: string;
  "data-testid"?: string;
}>) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border/70 bg-card/85 backdrop-blur paper grain",
        className,
      )}
      data-testid={dataTestId}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-foreground/[0.04] to-transparent" />
      <div className="relative p-5 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl">{title}</h2>
            {description ? (
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
          {right ? <div className="shrink-0">{right}</div> : null}
        </div>

        <div className="mt-6">{children}</div>
      </div>
    </section>
  );
}
