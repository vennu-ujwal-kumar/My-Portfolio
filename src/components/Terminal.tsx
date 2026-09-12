import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { interests, personal, projects, skills, social } from "@/data/portfolio";
import { cn } from "@/lib/utils";

type Line = { kind: "cmd" | "out" | "muted" | "accent"; text: string };

const PROMPT = "ujwal@portfolio:~$";

const INTRO: Line[] = [
  { kind: "cmd", text: "whoami" },
  { kind: "out", text: personal.name },
  { kind: "cmd", text: "role" },
  { kind: "out", text: personal.role },
  { kind: "cmd", text: "interests" },
  ...["AI", "Web Development", "Backend Architecture", "Modern Software Engineering"].map((t) => ({
    kind: "out" as const,
    text: `  · ${t}`,
  })),
  { kind: "muted", text: 'type "help" to see available commands' },
];

const COMMANDS: Record<string, () => Line[]> = {
  help: () => [
    { kind: "accent", text: "available commands" },
    ...[
      "help",
      "about",
      "skills",
      "projects",
      "github",
      "linkedin",
      "discord",
      "leetcode",
      "hackerrank",
      "codechef",
      "contact",
      "admin",
      "resume",
      "photo",
      "whoami",
      "role",
      "interests",
      "clear",
    ].map((c) => ({ kind: "out" as const, text: `  ${c}` })),
  ],
  whoami: () => [{ kind: "out", text: personal.name }],
  role: () => [{ kind: "out", text: personal.role }],
  interests: () => interests.map((t) => ({ kind: "out", text: `  · ${t}` })),
  about: () => [
    { kind: "out", text: `Undergraduate at GRIET · ${personal.location}` },
    { kind: "out", text: "Sophomore · working toward full-stack engineering" },
    { kind: "out", text: "Exploring AI, full-stack systems and modern software." },
  ],
  skills: () =>
    (Object.keys(skills) as (keyof typeof skills)[]).map((k) => ({
      kind: "out",
      text: `  ${k.padEnd(10)} ${skills[k].map((s) => s.name).join(", ")}`,
    })),
  projects: () => [
    ...projects.map((p) => ({
      kind: "out" as const,
      text: `  ${p.title} — ${p.status.toLowerCase()} · ${p.category}`,
    })),
  ],
  github: () => {
    const url = social("github").url!;
    if (typeof window !== "undefined") window.open(url, "_blank", "noopener");
    return [{ kind: "out", text: `opening ${url}` }];
  },
  linkedin: () => {
    const url = social("linkedin").url!;
    if (typeof window !== "undefined") window.open(url, "_blank", "noopener");
    return [{ kind: "out", text: `opening ${url}` }];
  },
  discord: () => [
    { kind: "out", text: "Discord handle: ujwal_vennu_21698" },
    { kind: "accent", text: "  https://discord.com/users/ujwal_vennu_21698" },
  ],
  leetcode: () => {
    const url = social("leetcode").url!;
    if (typeof window !== "undefined") window.open(url, "_blank", "noopener");
    return [{ kind: "out", text: `opening ${url}` }];
  },
  hackerrank: () => {
    const url = social("hackerrank").url!;
    if (typeof window !== "undefined") window.open(url, "_blank", "noopener");
    return [{ kind: "out", text: `opening ${url}` }];
  },
  codechef: () => {
    const url = social("codechef").url!;
    if (typeof window !== "undefined") window.open(url, "_blank", "noopener");
    return [{ kind: "out", text: `opening ${url}` }];
  },
  contact: () => [
    { kind: "out", text: "scroll to #contact or reach out directly:" },
    { kind: "accent", text: personal.email ? `  ${personal.email}` : "email not configured yet" },
  ],
  admin: () => {
    if (typeof window !== "undefined") window.dispatchEvent(new Event("open-admin-portal"));
    return [{ kind: "accent", text: "Opening private admin portal…" }];
  },
  resume: () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-admin-portal", { detail: { section: "resume" } }));
    }
    return [{ kind: "accent", text: "Opening resume manager…" }];
  },
  photo: () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-admin-portal", { detail: { section: "photo" } }));
    }
    return [{ kind: "accent", text: "Opening profile photo manager…" }];
  },
  "sudo hire ujwal": () => [
    { kind: "accent", text: "[sudo] password for recruiter: ********" },
    { kind: "out", text: `Permission granted. Deploying ${personal.name} to your team…` },
    { kind: "out", text: "  ✓ curiosity      installed" },
    { kind: "out", text: "  ✓ persistence    installed" },
    { kind: "out", text: "  ✓ caffeine       installed" },
    { kind: "muted", text: "Just kidding — but let's talk. See #contact." },
  ],
};

export function Terminal({ className }: { className?: string }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const [booted, setBooted] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // typing intro, once visible
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        obs.disconnect();
        if (reduced) {
          setLines(INTRO);
          setBooted(true);
          return;
        }
        let i = 0;
        const step = () => {
          setLines(INTRO.slice(0, i + 1));
          i++;
          if (i < INTRO.length) setTimeout(step, INTRO[i - 1]?.kind === "cmd" ? 420 : 120);
          else setBooted(true);
        };
        setTimeout(step, 300);
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    setHistory((h) => [cmd, ...h].slice(0, 30));
    setHIdx(-1);
    if (cmd === "clear") {
      setLines([]);
      return;
    }
    const handler = COMMANDS[cmd];
    const out: Line[] = handler
      ? handler()
      : [{ kind: "muted", text: `command not found: ${cmd} — try "help"` }];
    setLines((l) => [...l, { kind: "cmd", text: raw.trim() }, ...out]);
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      run(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const n = Math.min(hIdx + 1, history.length - 1);
      setHIdx(n);
      setInput(history[n] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const n = Math.max(hIdx - 1, -1);
      setHIdx(n);
      setInput(n === -1 ? "" : (history[n] ?? ""));
    } else if (e.key === "Tab") {
      e.preventDefault();
      const m = Object.keys(COMMANDS).find(
        (c) => c.startsWith(input.toLowerCase()) && !c.includes(" "),
      );
      if (m) setInput(m);
    }
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-glass-border bg-terminal shadow-elevated",
        className,
      )}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center gap-2 border-b border-border/60 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-chart-5/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
        <span className="ml-3 font-mono text-[11px] text-subtle">ujwal@portfolio — zsh</span>
      </div>
      <div
        ref={bodyRef}
        className="scrollbar-thin h-[300px] overflow-y-auto px-4 py-4 font-mono text-[12.5px] leading-relaxed sm:h-[340px] sm:text-[13px]"
        aria-live="polite"
      >
        {lines.map((l, i) => (
          <div
            key={i}
            className={cn(
              "whitespace-pre-wrap break-words",
              l.kind === "cmd" && "mt-2 first:mt-0 text-terminal-foreground",
              l.kind === "out" && "text-foreground/85 light:text-background/85",
              l.kind === "muted" && "text-subtle",
              l.kind === "accent" && "text-primary",
            )}
          >
            {l.kind === "cmd" ? (
              <>
                <span className="text-success">{PROMPT}</span> {l.text}
              </>
            ) : (
              l.text
            )}
          </div>
        ))}
        {booted && (
          <div className="mt-2 flex items-center gap-2 text-terminal-foreground">
            <span className="shrink-0 text-success">{PROMPT}</span>
            <label htmlFor="terminal-input" className="sr-only">
              Terminal command
            </label>
            <input
              id="terminal-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              autoComplete="off"
              spellCheck={false}
              className="min-w-0 flex-1 bg-transparent caret-primary outline-none placeholder:text-subtle"
              placeholder="type a command…"
            />
          </div>
        )}
        {!booted && (
          <span className="inline-block h-4 w-2 bg-terminal-foreground animate-blink" aria-hidden />
        )}
      </div>
    </div>
  );
}
