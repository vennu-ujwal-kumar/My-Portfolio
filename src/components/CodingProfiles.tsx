import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, ExternalLink, GitFork, Star } from "lucide-react";
import { codingProfiles, personal, social } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { SocialIcon } from "./SocialIcon";
import { Pill, Reveal, Section, SpotlightCard } from "./primitives";

type GhUser = {
  public_repos: number;
  followers: number;
  following: number;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  name: string | null;
};

type GhRepo = {
  id: number;
  name: string;
  html_url: string;
  homepage: string | null;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  private?: boolean;
  visibility?: string;
};

async function fetchGithub() {
  const u = personal.githubUsername;
  const [ur, rr] = await Promise.all([
    fetch(`https://api.github.com/users/${u}`),
    fetch(`https://api.github.com/users/${u}/repos?sort=pushed&per_page=15`),
  ]);
  if (!ur.ok || !rr.ok) throw new Error("github unavailable");
  const user = (await ur.json()) as GhUser;
  const allRepos = (await rr.json()) as GhRepo[];
  // Strictly filter out any private repositories
  const publicRepos = allRepos.filter((r) => !r.private && r.visibility !== "private").slice(0, 6);
  return { user, repos: publicRepos };
}

export function CodingProfiles() {
  const gh = social("github");
  const { data, isError, isLoading } = useQuery({
    queryKey: ["github", personal.githubUsername],
    queryFn: fetchGithub,
    staleTime: 1000 * 60 * 30,
    retry: 1,
  });

  const totalStars = data ? data.repos.reduce((acc, r) => acc + r.stargazers_count, 0) : 0;

  return (
    <Section
      id="profiles"
      eyebrow="07 — Developer ecosystem"
      title="Where my code lives."
      subtitle="Live public GitHub data directly from the GitHub API; automatically updated as I build."
    >
      {/* GitHub */}
      <Reveal>
        <SpotlightCard className="overflow-hidden p-0">
          <div className="grid lg:grid-cols-[1fr_1.4fr]">
            <div className="flex flex-col justify-between border-b border-border p-7 lg:border-b-0 lg:border-r">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {data?.user.avatar_url ? (
                      <img
                        src={data.user.avatar_url}
                        alt="GitHub avatar"
                        className="h-11 w-11 rounded-lg border border-border object-cover"
                      />
                    ) : (
                      <span className="grid h-11 w-11 place-items-center rounded-lg border border-border bg-surface-2">
                        <SocialIcon name="github" />
                      </span>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-lg font-semibold tracking-tight">GitHub</h3>
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Live
                        </span>
                      </div>
                      <p className="font-mono text-xs text-muted-foreground">{gh.handle}</p>
                    </div>
                  </div>
                </div>

                {data?.user.bio && (
                  <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
                    {data.user.bio}
                  </p>
                )}

                {data ? (
                  <dl className="mt-6 grid grid-cols-4 gap-3 sm:gap-4">
                    {[
                      ["Repos", data.user.public_repos],
                      ["Followers", data.user.followers],
                      ["Following", data.user.following],
                      ["Stars", totalStars],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">
                          {k}
                        </dt>
                        <dd className="mt-1 font-display text-xl font-semibold tabular-nums sm:text-2xl">
                          {v}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="mt-6 text-sm text-muted-foreground">
                    {isLoading
                      ? "Loading public profile…"
                      : "Live stats unavailable right now — visit the profile directly."}
                  </p>
                )}
              </div>
              <a
                href={gh.url!}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center gap-1.5 text-sm text-primary underline-offset-4 hover:underline"
              >
                Visit profile <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
            <div className="p-7">
              <div className="mb-4 flex items-center justify-between">
                <p className="eyebrow">Recent public repositories</p>
                <span className="font-mono text-[10px] text-subtle">Synced live</span>
              </div>
              {data && data.repos.length > 0 ? (
                <ul className="grid gap-2 sm:grid-cols-2">
                  {data.repos.map((r) => (
                    <li key={r.id}>
                      <div className="group relative flex h-full flex-col justify-between rounded-xl border border-border bg-surface/60 p-4 transition hover:border-primary/40">
                        <div>
                          <div className="flex items-center justify-between gap-3">
                            <a
                              href={r.html_url}
                              target="_blank"
                              rel="noreferrer"
                              className="truncate font-mono text-[13px] text-foreground hover:text-primary transition-colors"
                            >
                              {r.name}
                            </a>
                            <span className="flex shrink-0 items-center gap-2 font-mono text-[11px] text-subtle">
                              <span className="inline-flex items-center gap-1">
                                <Star className="h-3 w-3" />
                                {r.stargazers_count}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <GitFork className="h-3 w-3" />
                                {r.forks_count}
                              </span>
                            </span>
                          </div>
                          <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">
                            {r.description ?? "No description"}
                          </p>
                        </div>
                        <div className="mt-3 flex items-center justify-between pt-2 border-t border-border/50">
                          {r.language ? (
                            <Pill tone="muted" className="text-[10px] py-0 px-2">
                              {r.language}
                            </Pill>
                          ) : (
                            <span />
                          )}
                          {r.homepage && (
                            <a
                              href={r.homepage}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 font-mono text-[11px] text-primary hover:underline"
                            >
                              Demo <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={cn("grid gap-2 sm:grid-cols-2", isLoading && "animate-pulse")}>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-24 rounded-xl border border-dashed border-border" />
                  ))}
                  {isError && (
                    <p className="col-span-full font-mono text-[11px] text-subtle">
                      GitHub API rate-limited or offline — showing static card.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </SpotlightCard>
      </Reveal>

      {/* Other profiles */}
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {codingProfiles
          .filter((p) => p.key !== "github")
          .map((p, i) => {
            const s = social(p.key);
            return (
              <Reveal as="li" key={p.key} delay={i * 70}>
                <SpotlightCard className="flex h-full flex-col p-6">
                  <div className="flex items-center justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-surface-2">
                      <SocialIcon name={p.key} />
                    </span>
                    {!s.url && <Pill tone="muted">link coming soon</Pill>}
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">
                    {s.label}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                  {p.key !== "linkedin" && (
                    <p className="mt-3 font-mono text-[11px] text-subtle">
                      stats appear once a profile is connected
                    </p>
                  )}
                  <a
                    href={s.url ?? undefined}
                    target="_blank"
                    rel="noreferrer"
                    aria-disabled={!s.url}
                    className={cn(
                      "mt-auto inline-flex items-center gap-1.5 pt-6 text-sm text-primary underline-offset-4 hover:underline",
                      !s.url && "pointer-events-none opacity-40",
                    )}
                  >
                    Visit <ArrowUpRight className="h-4 w-4" />
                  </a>
                </SpotlightCard>
              </Reveal>
            );
          })}
      </ul>
    </Section>
  );
}
