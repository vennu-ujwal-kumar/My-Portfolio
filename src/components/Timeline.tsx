import { Award, GraduationCap, Sparkles, Trophy, type LucideIcon } from "lucide-react";
import { achievementCategories, education, experience, milestones } from "@/data/portfolio";
import { Pill, Reveal, Section, SpotlightCard } from "./primitives";

/* ───────────── Experience & Growth ───────────── */
export function Experience() {
  return (
    <Section
      id="experience"
      eyebrow="04 — Experience"
      title="Experience & Growth."
      subtitle="No internships yet — this is the honest starting line, and it's moving."
    >
      <ol className="relative ml-3 border-l border-border pl-8 sm:ml-6 sm:pl-12">
        {experience.map((e, i) => (
          <Reveal as="li" key={e.title} delay={i * 100} className="relative pb-12 last:pb-0">
            <span className="absolute -left-[41px] top-1.5 grid h-5 w-5 place-items-center rounded-full border border-primary/40 bg-background sm:-left-[57px]">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse-dot" />
            </span>
            <SpotlightCard className="p-6 sm:p-7">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs text-primary">{e.period}</span>
                {e.current && <Pill tone="success">current</Pill>}
              </div>
              <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-foreground">
                {e.title} <span className="text-muted-foreground">— {e.org}</span>
              </h3>
              <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                {e.description}
              </p>
            </SpotlightCard>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

/* ───────────── Education ───────────── */
export function Education() {
  const fields = [
    ["Status", education.status],
    ["Year", education.year],
    ["Focus", education.focus],
    education.cgpa && ["CGPA", education.cgpa],
    education.graduation && ["Graduation", education.graduation],
  ].filter(Boolean) as [string, string][];

  return (
    <Section id="education" eyebrow="05 — Education" title="Where I'm studying.">
      <Reveal>
        <SpotlightCard className="grid gap-8 p-7 sm:p-9 lg:grid-cols-[1fr_auto]">
          <div className="flex items-start gap-5">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
              <GraduationCap className="h-6 w-6" strokeWidth={1.6} />
            </span>
            <div>
              <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                {education.school}{" "}
                <span className="text-muted-foreground">— {education.degree}</span>
              </h3>
              <p className="mt-2 text-muted-foreground">
                Building a foundation in computer science and software development, one semester at
                a time.
              </p>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-x-10 gap-y-4 sm:grid-cols-3 lg:grid-cols-1 lg:border-l lg:border-border lg:pl-8">
            {fields.map(([k, v]) => (
              <div key={k}>
                <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">
                  {k}
                </dt>
                <dd className="mt-1 text-sm font-medium text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </SpotlightCard>
      </Reveal>
    </Section>
  );
}

/* ───────────── Milestones / Achievements ───────────── */
const catIcon: Record<string, LucideIcon> = {
  Hackathons: Sparkles,
  Certifications: Award,
  Awards: Trophy,
  Competitions: Trophy,
};

export function Milestones() {
  return (
    <Section
      id="achievements"
      eyebrow="06 — Achievements"
      title="Milestones."
      subtitle="A section designed to grow. Only real progress goes here."
    >
      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <Reveal>
          <SpotlightCard className="h-full p-7">
            <p className="eyebrow mb-5">So far</p>
            <ul className="space-y-4">
              {milestones.map((m, i) => (
                <li key={m} className="flex items-start gap-4">
                  <span className="mt-0.5 font-mono text-xs text-primary">0{i + 1}</span>
                  <span className="text-[15px] text-foreground/90">{m}</span>
                </li>
              ))}
            </ul>
          </SpotlightCard>
        </Reveal>
        <div className="grid grid-cols-2 gap-3">
          {achievementCategories.map((c, i) => {
            const Icon = catIcon[c.label] ?? Award;
            const empty = c.items.length === 0;
            return (
              <Reveal key={c.label} delay={i * 60}>
                <div
                  className={
                    empty
                      ? "h-full rounded-2xl border border-dashed border-border p-5"
                      : "panel h-full rounded-2xl p-5"
                  }
                >
                  <Icon className="h-5 w-5 text-subtle" strokeWidth={1.5} />
                  <h3 className="mt-4 font-medium text-foreground">{c.label}</h3>
                  {empty ? (
                    <p className="mt-1 font-mono text-[11px] text-subtle">nothing here yet</p>
                  ) : (
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      {c.items.map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
