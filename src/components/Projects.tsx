import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, ExternalLink, Layers, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  personal,
  projectFilters,
  projects as initialProjects,
  type Project,
  type ProjectCategory,
  type ProjectStatus,
} from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { SocialIcon } from "./SocialIcon";
import { ButtonLink, Pill, Reveal, Section, SpotlightCard } from "./primitives";

const statusTone: Record<ProjectStatus, "muted" | "primary" | "success" | "violet"> = {
  Placeholder: "muted",
  "In Progress": "primary",
  Completed: "success",
  Planned: "violet",
};

async function fetchGitHubProjects(): Promise<Project[]> {
  const u = personal.githubUsername;
  try {
    const res = await fetch(`https://api.github.com/users/${u}/repos?sort=pushed&per_page=30`);
    if (!res.ok) return [];
    const repos = (await res.json()) as Array<{
      id: number;
      name: string;
      html_url: string;
      homepage: string | null;
      description: string | null;
      language: string | null;
      topics?: string[];
      stargazers_count: number;
      forks_count: number;
      fork: boolean;
      pushed_at: string;
      private?: boolean;
      visibility?: string;
    }>;

    const ignored = new Set(["ujwal-future-forge", "ujwal-future-forge-main", "my-portfolio"]);

    return repos
      .filter((r) => !r.fork && !r.private && r.visibility !== "private" && !ignored.has(r.name.toLowerCase()))
      .map((repo) => {
        let category: ProjectCategory = "Frontend";
        const combinedText = `${repo.name} ${repo.description ?? ""} ${(repo.topics ?? []).join(" ")}`.toLowerCase();
        if (combinedText.includes("ai") || combinedText.includes("machine learning") || combinedText.includes("ml")) {
          category = "AI";
        } else if (combinedText.includes("backend") || combinedText.includes("spring") || combinedText.includes("api") || combinedText.includes("server")) {
          category = "Backend";
        } else if (combinedText.includes("full stack") || combinedText.includes("fullstack") || (repo.language === "TypeScript" && repo.homepage)) {
          category = "Full Stack";
        }

        const tech: string[] = [];
        if (repo.language) tech.push(repo.language);
        if (repo.topics && repo.topics.length > 0) {
          repo.topics.forEach((t) => {
            const clean = t.charAt(0).toUpperCase() + t.slice(1);
            if (!tech.includes(clean)) tech.push(clean);
          });
        }
        if (repo.homepage?.includes("vercel.app") && !tech.includes("Vercel")) {
          tech.push("Vercel");
        }
        if (tech.length === 0) tech.push("Web");

        const title = repo.name.replace(/[-_]+/g, " ");

        return {
          slug: repo.name.toLowerCase(),
          title,
          summary:
            repo.description ||
            `Interactive software project created and actively maintained on GitHub by ${personal.name}.`,
          category,
          status: (repo.homepage ? "Completed" : "In Progress") as ProjectStatus,
          tech,
          featured: Boolean(repo.homepage),
          image: null,
          github: repo.html_url,
          live: repo.homepage || null,
          details: {
            overview:
              repo.description ||
              `Project ${repo.name} is an active software project developed on GitHub.`,
            problem:
              "Addressing real-world developer or user requirements with clean interface design, responsive layout, and robust implementation.",
            solution:
              "Built with modern web standards, lightweight architecture, and automated continuous deployment.",
            features: [
              "Public open-source repository available on GitHub",
              repo.homepage ? "Live production deployment running on Vercel" : "Active version-controlled git repository",
              repo.language ? `Primary development stack: ${repo.language}` : "Modern development stack",
              `Repository stats: ${repo.stargazers_count} stars · ${repo.forks_count} forks`,
            ],
            architecture:
              `Source code hosted on GitHub (${repo.html_url})` +
              (repo.homepage ? ` with live edge deployment on Vercel.` : `.`),
            challenges:
              "Architecting clean maintainable code, optimizing UX responsiveness, and managing continuous deployment.",
            learned:
              "End-to-end full stack workflows, version control discipline, and cloud hosting integration.",
          },
        };
      });
  } catch {
    return [];
  }
}

export function Projects() {
  const [filter, setFilter] = useState<(typeof projectFilters)[number]>("All");
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const { data: remoteRepos = [] } = useQuery({
    queryKey: ["github-projects", personal.githubUsername],
    queryFn: fetchGitHubProjects,
    staleTime: 1000 * 60 * 15,
  });

  const allProjects = useMemo(() => {
    const combined: Project[] = [...initialProjects];
    const existingSlugs = new Set(combined.map((p) => p.slug.toLowerCase()));
    const existingGithubUrls = new Set(combined.map((p) => p.github?.toLowerCase()).filter(Boolean));

    for (const ghProj of remoteRepos) {
      const match = combined.find(
        (p) =>
          p.slug.toLowerCase() === ghProj.slug ||
          (p.github && p.github.toLowerCase() === ghProj.github?.toLowerCase())
      );
      if (match) {
        if (!match.live && ghProj.live) match.live = ghProj.live;
        if (!match.github && ghProj.github) match.github = ghProj.github;
      } else if (!existingSlugs.has(ghProj.slug) && !existingGithubUrls.has(ghProj.github?.toLowerCase())) {
        combined.push(ghProj);
      }
    }
    return combined;
  }, [remoteRepos]);

  const list = allProjects.filter((p) => filter === "All" || p.category === filter);
  const featured = list.find((p) => p.featured) ?? list[0];
  const rest = list.filter((p) => p !== featured);
  const open = allProjects.find((p) => p.slug === openSlug) ?? null;

  return (
    <Section
      id="projects"
      eyebrow="03 — Projects"
      title="Things I've built."
      subtitle="A collection of applications, tools, and systems I've built — auto-synced directly with my GitHub and Vercel deployments."
    >
      <Reveal className="mb-8 flex flex-wrap items-center gap-2">
        {projectFilters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={cn(
              "rounded-full border px-4 py-1.5 text-[13px] transition-all",
              filter === f
                ? "border-primary/40 bg-primary/10 text-foreground"
                : "border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground",
            )}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto font-mono text-[11px] text-subtle">
          {list.length} {list.length === 1 ? "project" : "projects"}
        </span>
      </Reveal>

      {list.length === 0 ? (
        <Reveal>
          <div className="panel rounded-2xl p-10 text-center text-muted-foreground">
            Nothing in this category yet.
          </div>
        </Reveal>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {featured && (
            <Reveal className="lg:col-span-3">
              <ProjectCard project={featured} featured onOpen={() => setOpenSlug(featured.slug)} />
            </Reveal>
          )}
          {rest.map((p, i) => (
            <Reveal key={p.slug} delay={i * 70}>
              <ProjectCard project={p} onOpen={() => setOpenSlug(p.slug)} />
            </Reveal>
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border/40 pt-6">
        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Auto-synced with GitHub & Vercel</span>
        </div>
        <p className="font-mono text-[11px] text-subtle">
          New projects deployed on Vercel or pushed to GitHub appear here automatically.
        </p>
      </div>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpenSlug(null)}>
        <DialogContent className="scrollbar-thin max-h-[88vh] w-[min(92vw,720px)] max-w-none overflow-y-auto rounded-2xl border-glass-border bg-card p-0 sm:rounded-3xl">
          {open && <ProjectDetails project={open} />}
        </DialogContent>
      </Dialog>
    </Section>
  );
}

function Thumb({
  project,
  className,
  allowInteractive = false,
}: {
  project: Project;
  className?: string;
  allowInteractive?: boolean;
}) {
  const [interactive, setInteractive] = useState(false);
  let hostname = "";
  try {
    if (project.live) hostname = new URL(project.live).hostname;
  } catch {}

  return (
    <div className={cn("relative flex flex-col overflow-hidden bg-surface-2", className)}>
      {/* Sleek Mock Browser Bar */}
      <div className="flex h-8 shrink-0 items-center justify-between border-b border-border/60 bg-surface px-3.5 backdrop-blur z-10">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-rose-500/80" />
          <span className="h-2 w-2 rounded-full bg-amber-500/80" />
          <span className="h-2 w-2 rounded-full bg-emerald-500/80" />
        </div>
        {hostname ? (
          <div className="flex items-center gap-1.5 rounded-full border border-border/50 bg-background/60 px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="truncate max-w-[130px] sm:max-w-[190px]">{hostname}</span>
          </div>
        ) : (
          <div className="font-mono text-[10px] text-subtle">preview</div>
        )}
        {project.live && allowInteractive ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setInteractive(!interactive);
            }}
            className="rounded px-1.5 py-0.5 font-mono text-[10px] text-primary hover:bg-primary/10 transition-colors"
          >
            {interactive ? "Screenshot" : "Try Live App"}
          </button>
        ) : (
          <div className="w-10" />
        )}
      </div>

      {/* Main Preview Container */}
      <div className="relative flex-1 overflow-hidden min-h-[220px]">
        {interactive && project.live ? (
          <iframe
            src={project.live}
            title={`${project.title} live interactive preview`}
            className="h-full w-full border-0 bg-background"
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        ) : project.image ? (
          <div className="group/img relative h-full w-full overflow-hidden">
            <img
              src={project.image}
              alt={`${project.title} preview`}
              loading="lazy"
              className="h-full w-full object-cover object-top transition-transform duration-700 group-hover/img:scale-[1.02]"
            />
            {project.live && (
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity group-hover/img:opacity-100 flex items-end p-4">
                <a
                  href={project.live}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 font-mono text-xs text-primary-foreground shadow-lg transition-transform hover:scale-105"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Open Live App
                </a>
              </div>
            )}
          </div>
        ) : project.live ? (
          <div className="relative h-full w-full">
            <iframe
              src={project.live}
              title={`${project.title} preview`}
              className="h-full w-full border-0 pointer-events-none scale-100 origin-top"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="grid-bg absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-background/70 to-violet/15 backdrop-blur-[1px]" />
            <div className="relative flex flex-col items-center gap-2.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/25 bg-surface-2 shadow-sm text-primary">
                <Layers className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <span className="font-display text-base font-semibold tracking-tight text-foreground/90">
                {project.title}
              </span>
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
                <span>{project.category}</span>
                {project.tech[0] && <span>· {project.tech[0]}</span>}
              </div>
            </div>
          </div>
        )}

        <div className="absolute left-3 top-3 flex gap-2 pointer-events-none z-10">
          <Pill tone={statusTone[project.status]} className="bg-background/80 backdrop-blur shadow-sm">
            {project.status}
          </Pill>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  featured,
  onOpen,
}: {
  project: Project;
  featured?: boolean;
  onOpen: () => void;
}) {
  return (
    <SpotlightCard
      as="article"
      className={cn(
        "group flex h-full flex-col overflow-hidden",
        featured && "lg:grid lg:grid-cols-[1.2fr_1fr]",
      )}
    >
      <Thumb
        project={project}
        className={featured ? "aspect-[16/9] lg:aspect-auto lg:min-h-[340px]" : "aspect-[16/10]"}
        allowInteractive={true}
      />
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
              {project.category}
              {featured && " · Featured"}
            </p>
            <h3
              className={cn(
                "mt-2 font-display font-semibold tracking-tight text-foreground",
                featured ? "text-2xl sm:text-3xl" : "text-xl",
              )}
            >
              {project.title}
            </h3>
          </div>
          <button
            onClick={onOpen}
            aria-label={`View details for ${project.title}`}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-all group-hover:border-primary/40 group-hover:text-foreground hover:bg-primary/10"
          >
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
          {project.summary}
        </p>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <li key={t}>
              <Pill>{t}</Pill>
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
          <ButtonLink
            href={project.github ?? undefined}
            target="_blank"
            rel="noreferrer"
            variant="outline"
            size="sm"
            magnetic={false}
            aria-disabled={!project.github}
            className={cn(!project.github && "pointer-events-none opacity-40")}
          >
            <SocialIcon name="github" className="h-4 w-4" /> GitHub
          </ButtonLink>
          {project.live && (
            <ButtonLink
              href={project.live}
              target="_blank"
              rel="noreferrer"
              variant="primary"
              size="sm"
              magnetic={false}
            >
              <ExternalLink className="h-3.5 w-3.5" /> Live Demo
            </ButtonLink>
          )}
          <button
            onClick={onOpen}
            className="ml-auto text-[13px] text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
          >
            View Details
          </button>
        </div>
      </div>
    </SpotlightCard>
  );
}

function ProjectDetails({ project }: { project: Project }) {
  const [tab, setTab] = useState<"details" | "live">("details");
  const d = project.details;
  const rows: [string, React.ReactNode][] = [
    ["Overview", d.overview],
    ["Problem", d.problem],
    ["Solution", d.solution],
    [
      "Key features",
      <ul key="f" className="list-disc space-y-1 pl-5">
        {d.features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>,
    ],
    ["Architecture", d.architecture],
    ["Challenges", d.challenges],
    ["What I learned", d.learned],
  ];
  return (
    <div>
      <Thumb
        project={project}
        className="aspect-[16/9] rounded-t-2xl sm:rounded-t-3xl border-b border-border"
        allowInteractive={true}
      />
      <div className="p-6 sm:p-8">
        <DialogHeader className="text-left">
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
              {project.category}
            </p>
            {project.live && (
              <div className="flex items-center rounded-lg border border-border bg-surface-2 p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setTab("details")}
                  className={cn(
                    "rounded-md px-2.5 py-1 font-mono transition-colors",
                    tab === "details"
                      ? "bg-primary text-primary-foreground shadow"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Overview
                </button>
                <button
                  type="button"
                  onClick={() => setTab("live")}
                  className={cn(
                    "rounded-md px-2.5 py-1 font-mono transition-colors flex items-center gap-1",
                    tab === "live"
                      ? "bg-primary text-primary-foreground shadow"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <ExternalLink className="h-3 w-3" /> Live App
                </button>
              </div>
            )}
          </div>
          <DialogTitle className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            {project.title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">{project.summary}</DialogDescription>
        </DialogHeader>

        {tab === "live" && project.live ? (
          <div className="mt-6 overflow-hidden rounded-xl border border-border bg-surface">
            <div className="flex h-8 items-center justify-between border-b border-border bg-surface-2 px-3 text-xs font-mono text-muted-foreground">
              <span>{project.live}</span>
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline"
              >
                Open in new tab ↗
              </a>
            </div>
            <iframe
              src={project.live}
              title={`${project.title} live interactive`}
              className="h-[520px] w-full border-0 bg-background"
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          </div>
        ) : (
          <>
            <div className="mt-6">
              <p className="eyebrow mb-2">Technology stack</p>
              <ul className="flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <li key={t}>
                    <Pill>{t}</Pill>
                  </li>
                ))}
              </ul>
            </div>
            <dl className="mt-8 space-y-6">
              {rows.map(([k, v]) => (
                <div key={k} className="grid gap-1 sm:grid-cols-[150px_1fr] sm:gap-6">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">
                    {k}
                  </dt>
                  <dd className="text-sm leading-relaxed text-foreground/85">{v}</dd>
                </div>
              ))}
            </dl>
          </>
        )}

        <div className="mt-8 flex flex-wrap gap-2 border-t border-border pt-6">
          {project.github ? (
            <ButtonLink
              href={project.github}
              target="_blank"
              rel="noreferrer"
              variant="outline"
              size="sm"
              magnetic={false}
            >
              <SocialIcon name="github" className="h-4 w-4" /> View on GitHub
            </ButtonLink>
          ) : (
            <span className="font-mono text-[11px] text-subtle">GitHub link not added yet</span>
          )}
          {project.live && (
            <ButtonLink
              href={project.live}
              target="_blank"
              rel="noreferrer"
              size="sm"
              magnetic={false}
            >
              <ExternalLink className="h-3.5 w-3.5" /> Open Deployed Site
            </ButtonLink>
          )}
        </div>
      </div>
    </div>
  );
}
