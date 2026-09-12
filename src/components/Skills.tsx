import { Code2 } from "lucide-react";
import { useState } from "react";
import { skills, type SkillCategory, type SkillLevel } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { Constellation } from "./Constellation";
import { BrandIcon, Pill, Reveal, Section, SpotlightCard } from "./primitives";

const categories = Object.keys(skills) as SkillCategory[];
const levelTone: Record<SkillLevel, "success" | "primary" | "violet"> = {
  Comfortable: "success",
  "Working With": "primary",
  Exploring: "violet",
};

export function Skills() {
  const [cat, setCat] = useState<SkillCategory | "All">("All");
  const list =
    cat === "All"
      ? categories.flatMap((c) => skills[c].map((s) => ({ ...s, cat: c })))
      : skills[cat].map((s) => ({ ...s, cat }));

  return (
    <Section
      id="skills"
      eyebrow="02 — Skills"
      title="What I work with."
      subtitle="Honest labels: Comfortable, Working With, or Exploring — no inflated expertise."
    >
      <Reveal className="mb-8 flex flex-wrap gap-2">
        {(["All", ...categories] as const).map((c) => (
          <button
            key={c}
            aria-pressed={cat === c}
            onClick={() => setCat(c)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-[13px] transition-all",
              cat === c
                ? "border-primary/40 bg-primary/10 text-foreground"
                : "border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground",
            )}
          >
            {c}
          </button>
        ))}
      </Reveal>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s, i) => (
          <Reveal as="li" key={`${s.cat}-${s.name}`} delay={Math.min(i, 8) * 50}>
            <SpotlightCard className="flex h-full items-start gap-4 p-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border bg-surface-2 text-foreground">
                {s.icon ? (
                  <BrandIcon slug={s.icon} className="h-5 w-5" />
                ) : (
                  <Code2 className="h-5 w-5" strokeWidth={1.6} />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="truncate font-medium text-foreground">{s.name}</h3>
                  <Pill tone={levelTone[s.level]} className="shrink-0">
                    {s.level}
                  </Pill>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">
                  {s.cat}
                </p>
              </div>
            </SpotlightCard>
          </Reveal>
        ))}
      </ul>

      <Reveal delay={100} className="mt-20">
        <p className="eyebrow mb-4">How it connects</p>
        <Constellation />
      </Reveal>
    </Section>
  );
}
