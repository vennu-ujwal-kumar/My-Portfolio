import { aboutParagraphs, interests, quickProfile } from "@/data/portfolio";
import { Pill, Reveal, Section } from "./primitives";
import { Terminal } from "./Terminal";

export function About() {
  return (
    <Section id="about" eyebrow="01 — About" title="A little about me.">
      <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <Reveal className="space-y-5 text-[15.5px] leading-relaxed text-muted-foreground sm:text-base">
          {aboutParagraphs.map((p, i) => (
            <p key={i} className={i === 0 ? "text-foreground/90 text-lg" : undefined}>
              {p}
            </p>
          ))}
          <div className="pt-2">
            <p className="eyebrow mb-3">Interests</p>
            <ul className="flex flex-wrap gap-2">
              {interests.map((it) => (
                <li key={it}>
                  <Pill>{it}</Pill>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <Terminal />
        </Reveal>
      </div>

      {/* Quick profile strip */}
      <Reveal delay={80} className="mt-16">
        <dl className="panel grid grid-cols-2 divide-border overflow-hidden rounded-2xl sm:grid-cols-3 lg:grid-cols-5 lg:divide-x">
          {quickProfile.map((q) => (
            <div key={q.label} className="border-b border-border p-5 lg:border-b-0 sm:p-6">
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">
                {q.label}
              </dt>
              <dd className="mt-2 font-display text-base font-semibold tracking-tight text-foreground sm:text-lg">
                {q.value}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  );
}
