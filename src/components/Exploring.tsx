import { exploring, journey } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { Reveal, Section, SpotlightCard } from "./primitives";

export function Exploring() {
  return (
    <Section
      id="exploring"
      eyebrow="08 — Now"
      title="Currently exploring."
      subtitle="What's on my desk right now. The energy bars are just that — energy, not scores."
    >
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {exploring.map((e, i) => (
          <Reveal as="li" key={e.name} delay={i * 60}>
            <SpotlightCard className="p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-medium text-foreground">{e.name}</h3>
                <span className="font-mono text-[10px] text-subtle">0{i + 1}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{e.note}</p>
              <div className="relative mt-5 h-px w-full overflow-hidden bg-border" aria-hidden>
                <span
                  className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent animate-energy"
                  style={{ animationDelay: `${i * -0.4}s` }}
                />
              </div>
            </SpotlightCard>
          </Reveal>
        ))}
      </ul>

      {/* Developer journey */}
      <Reveal delay={120} className="mt-24">
        <p className="eyebrow mb-8">Developer journey</p>
        <ol className="relative grid gap-8 sm:grid-cols-5 sm:gap-4">
          <span
            aria-hidden
            className="absolute left-[11px] top-2 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-primary via-violet to-border sm:left-0 sm:top-[11px] sm:h-px sm:w-full sm:bg-gradient-to-r"
          />
          {journey.map((j, i) => {
            const last = i === journey.length - 1;
            return (
              <li key={j.step} className="relative flex gap-5 sm:block sm:pt-8">
                <span
                  className={cn(
                    "relative z-10 grid h-6 w-6 shrink-0 place-items-center rounded-full border bg-background sm:absolute sm:left-0 sm:top-0",
                    last ? "border-violet/60" : "border-primary/50",
                  )}
                >
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full",
                      last ? "bg-violet animate-pulse" : "bg-primary",
                    )}
                  />
                </span>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">
                    0{i + 1}
                  </span>
                  <h3 className="mt-1 font-display text-xl font-semibold tracking-tight text-foreground">
                    {j.step}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{j.note}</p>
                </div>
              </li>
            );
          })}
        </ol>
        <p className="mt-8 max-w-xl text-sm text-muted-foreground">
          This portfolio is a snapshot of the beginning of a much longer engineering journey.
        </p>
      </Reveal>
    </Section>
  );
}
