import { ArrowDown, ArrowRight, Camera } from "lucide-react";
import { useProfilePhoto } from "@/lib/profile-photo";
import { personal, quickProfile } from "@/data/portfolio";
import { ButtonLink } from "./primitives";

const codeLines = [
  "const dev = {",
  '  name: "Vennu Ujwal",',
  '  role: "full-stack (in progress)",',
  '  learning: ["AI", "full-stack"],',
  "};",
];

export function Hero() {
  const { photoUrl } = useProfilePhoto();

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-24 pb-16 sm:pt-28"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        {/* Copy */}
        <div className="max-w-xl">
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-success/25 bg-success/10 px-3 py-1 font-mono text-[11px] tracking-wide text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-dot" />
            {personal.status}
          </div>

          <h1
            className="animate-fade-up mt-6 font-display text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.04em] text-foreground sm:text-6xl md:text-7xl"
            style={{ animationDelay: "80ms" }}
          >
            Hi, I&apos;m <span className="text-gradient animate-gradient-x">{personal.name}.</span>
          </h1>

          <p
            className="animate-fade-up mt-5 font-display text-xl font-medium tracking-tight text-foreground/90 sm:text-2xl"
            style={{ animationDelay: "160ms" }}
          >
            {personal.role}.
          </p>
          <p
            className="animate-fade-up mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg"
            style={{ animationDelay: "220ms" }}
          >
            {personal.tagline}
          </p>
          <p
            className="animate-fade-up mt-4 max-w-lg text-[15px] leading-relaxed text-muted-foreground/90"
            style={{ animationDelay: "280ms" }}
          >
            {personal.description}
          </p>

          <div
            className="animate-fade-up mt-9 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "340ms" }}
          >
            <ButtonLink href="#projects" size="lg">
              View My Work
              <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
            </ButtonLink>
            <ButtonLink href="#contact" variant="outline" size="lg">
              Let&apos;s Connect
            </ButtonLink>
          </div>

          <dl
            className="animate-fade-up mt-12 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-6 sm:grid-cols-3"
            style={{ animationDelay: "420ms" }}
          >
            {quickProfile.slice(0, 3).map((q) => (
              <div key={q.label}>
                <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">
                  {q.label}
                </dt>
                <dd className="mt-1 text-sm font-medium text-foreground">{q.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Visual */}
        <div className="relative mx-auto w-full max-w-[420px] lg:max-w-none">
          <div
            className="animate-fade-up relative aspect-[4/5] w-full"
            style={{ animationDelay: "200ms" }}
          >
            {/* orbit rings */}
            <div
              aria-hidden
              className="absolute inset-[-8%] rounded-full border border-dashed border-primary/15 animate-spin-slow"
            />
            <div aria-hidden className="absolute inset-[4%] rounded-full border border-border" />
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[90px]"
            />

            {/* photo */}
            <figure className="group relative mx-auto h-full w-[82%] overflow-hidden rounded-[28px] border border-glass-border bg-surface shadow-elevated">
              <img
                src={photoUrl}
                alt="Portrait of Vennu Ujwal"
                width={1145}
                height={1394}
                fetchPriority="high"
                className="h-full w-full object-cover object-top saturate-[0.95] transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-primary/20 to-transparent opacity-60 animate-scan"
              />

              {/* Quick photo change button on hover */}
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(
                      new CustomEvent("open-admin-portal", { detail: { section: "photo" } })
                    );
                  }
                }}
                title="Change profile photo (Admin PIN required)"
                className="absolute top-3.5 right-3.5 flex h-8 w-8 items-center justify-center rounded-xl border border-glass-border bg-background/80 backdrop-blur-md text-muted-foreground opacity-0 transition-all duration-200 group-hover:opacity-100 hover:text-foreground hover:bg-background/95 hover:border-primary/40 cursor-pointer shadow-sm"
              >
                <Camera className="h-4 w-4" />
              </button>

              <figcaption className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono text-[11px] text-foreground/80">
                <span>vennu.ujwal</span>
                <span className="text-primary">GRIET · sophomore</span>
              </figcaption>
            </figure>

            {/* floating code panel */}
            <div
              className="glass absolute -left-2 top-[12%] hidden rounded-xl p-3.5 font-mono text-[11px] leading-relaxed shadow-soft animate-float sm:block lg:-left-10"
              style={{ animationDelay: "-2s" }}
            >
              {codeLines.map((l, i) => (
                <div key={i} className="whitespace-pre text-muted-foreground">
                  <span className="mr-3 text-subtle">{i + 1}</span>
                  <span className={i === 0 || i === 4 ? "text-violet" : "text-terminal-foreground"}>
                    {l}
                  </span>
                </div>
              ))}
            </div>

            {/* floating status panel */}
            <div
              className="glass absolute -right-2 bottom-[16%] hidden items-center gap-3 rounded-xl px-3.5 py-2.5 shadow-soft animate-float sm:flex lg:-right-8"
              style={{ animationDelay: "-5s" }}
            >
              <NodePulse />
              <div className="font-mono text-[11px] leading-tight">
                <div className="text-subtle">exploring</div>
                <div className="text-foreground">AI · Full-Stack</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <a
        href="#about"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-subtle transition-colors hover:text-foreground md:flex"
        aria-label="Scroll to about section"
      >
        scroll <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
      </a>
    </section>
  );
}

function NodePulse() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden className="text-primary">
      <g stroke="currentColor" strokeOpacity="0.5" strokeWidth="1">
        <line x1="6" y1="8" x2="17" y2="17" />
        <line x1="6" y1="26" x2="17" y2="17" />
        <line x1="28" y1="8" x2="17" y2="17" />
        <line x1="28" y1="26" x2="17" y2="17" />
      </g>
      {[
        [6, 8],
        [6, 26],
        [28, 8],
        [28, 26],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2" fill="currentColor" opacity="0.7" />
      ))}
      <circle cx="17" cy="17" r="3" fill="currentColor" className="animate-pulse" />
    </svg>
  );
}
