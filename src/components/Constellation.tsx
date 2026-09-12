import { useState } from "react";
import { cn } from "@/lib/utils";

type Node = {
  id: string;
  label: string;
  x: number;
  y: number;
  tone?: "primary" | "violet" | "cyan";
  core?: boolean;
};

const NODES: Node[] = [
  { id: "core", label: "Full-Stack Development", x: 50, y: 50, core: true },
  { id: "ai", label: "Artificial Intelligence", x: 50, y: 12, tone: "violet" },
  { id: "fe", label: "Frontend", x: 14, y: 50, tone: "cyan" },
  { id: "be", label: "Backend", x: 86, y: 50, tone: "cyan" },
  { id: "java", label: "Java / Spring Boot", x: 72, y: 84, tone: "primary" },
  { id: "node", label: "Node.js / APIs", x: 28, y: 84, tone: "primary" },
  { id: "react", label: "React / Next.js", x: 18, y: 20 },
  { id: "ml", label: "Machine Learning", x: 82, y: 20 },
  { id: "git", label: "Git / Tooling", x: 50, y: 92 },
];

const EDGES: [string, string][] = [
  ["core", "ai"],
  ["core", "fe"],
  ["core", "be"],
  ["core", "java"],
  ["core", "node"],
  ["fe", "react"],
  ["ai", "ml"],
  ["ai", "react"],
  ["be", "java"],
  ["be", "ml"],
  ["node", "git"],
  ["java", "git"],
  ["fe", "node"],
];

const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));

export function Constellation() {
  const [active, setActive] = useState<string | null>(null);
  const neighbours = new Set(
    active ? EDGES.flatMap(([a, b]) => (a === active ? [b] : b === active ? [a] : [])) : [],
  );

  return (
    <div className="panel relative overflow-hidden rounded-2xl">
      <div aria-hidden className="absolute inset-0 grid-bg opacity-60" />
      <div className="relative aspect-[16/11] w-full sm:aspect-[21/9]">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          <defs>
            <linearGradient id="edge" x1="0" x2="1">
              <stop offset="0" stopColor="var(--primary)" />
              <stop offset="1" stopColor="var(--violet)" />
            </linearGradient>
          </defs>
          {EDGES.map(([a, b]) => {
            const A = byId[a]!,
              B = byId[b]!;
            const lit = active === a || active === b;
            const dim = active && !lit;
            return (
              <line
                key={a + b}
                x1={A.x}
                y1={A.y}
                x2={B.x}
                y2={B.y}
                stroke={lit ? "url(#edge)" : "currentColor"}
                strokeWidth={lit ? 0.5 : 0.25}
                vectorEffect="non-scaling-stroke"
                className={cn(
                  "text-foreground transition-all duration-300",
                  lit ? "opacity-100" : dim ? "opacity-[0.06]" : "opacity-20",
                )}
                style={{ strokeWidth: lit ? 1.6 : 1 }}
              />
            );
          })}
        </svg>

        {NODES.map((n) => {
          const lit = active === n.id || neighbours.has(n.id);
          const dim = active && !lit;
          return (
            <button
              key={n.id}
              type="button"
              onMouseEnter={() => setActive(n.id)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(n.id)}
              onBlur={() => setActive(null)}
              aria-label={n.label}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border font-mono transition-all duration-300",
                n.core
                  ? "border-primary/50 bg-primary/15 px-3 py-1.5 text-[10px] text-foreground ring-glow sm:px-4 sm:py-2 sm:text-xs"
                  : "border-border bg-card px-2 py-1 text-[9px] text-muted-foreground hover:text-foreground sm:px-3 sm:py-1.5 sm:text-[11px]",
                lit && !n.core && "border-primary/50 text-foreground shadow-glow",
                dim && "opacity-30",
              )}
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
            >
              <span
                className={cn(
                  "mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle",
                  n.tone === "violet" ? "bg-violet" : n.tone === "cyan" ? "bg-cyan" : "bg-primary",
                  n.core && "animate-pulse",
                )}
              />
              {n.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
