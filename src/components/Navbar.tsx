import { Command, FileText, Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { navLinks, personal, social } from "@/data/portfolio";
import { useResume } from "@/lib/resume";
import { useActiveSection, useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { SocialIcon } from "./SocialIcon";

const ids = navLinks.map((l) => l.href.slice(1));

export function Navbar({ onOpenPalette }: { onOpenPalette: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(ids);
  const { theme, toggle } = useTheme();
  const { resumeUrl } = useResume();
  const github = social("github");
  const linkedin = social("linkedin");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const iconBtn =
    "inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground";

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-5 sm:pt-4">
      <nav
        aria-label="Primary"
        className={cn(
          "glass flex w-full max-w-6xl items-center justify-between rounded-full pl-4 pr-2 transition-all duration-500",
          scrolled
            ? "h-12 shadow-soft"
            : "h-14 bg-transparent border-transparent backdrop-blur-none sm:border-glass-border sm:backdrop-blur-[16px]",
        )}
      >
        <a
          href="#home"
          className="flex items-center gap-2.5 font-display text-sm font-semibold tracking-tight text-foreground"
        >
          <span className="grid h-7 w-7 place-items-center rounded-md bg-primary/15 font-mono text-[11px] text-primary ring-1 ring-primary/30">
            {personal.initials}
          </span>
          <span className="hidden sm:inline">{personal.name.toUpperCase()}</span>
        </a>

        <ul className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map((l) => {
            const isActive = active === l.href.slice(1);
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "relative rounded-full px-3 py-1.5 text-[13px] transition-colors",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {l.label}
                  {isActive && (
                    <span className="absolute inset-x-3 -bottom-px h-px bg-primary shadow-[0_0_8px_var(--primary)]" />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-0.5">
          <button
            onClick={onOpenPalette}
            className={cn(iconBtn, "hidden sm:inline-flex")}
            aria-label="Open command palette (Ctrl+K)"
            title="Ctrl+K"
          >
            <Command className="h-4 w-4" />
          </button>
          <button
            onClick={toggle}
            className={iconBtn}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {github.url && (
            <a
              href={github.url}
              target="_blank"
              rel="noreferrer"
              className={cn(iconBtn, "hidden sm:inline-flex")}
              aria-label="GitHub"
            >
              <SocialIcon name="github" className="h-4 w-4" />
            </a>
          )}
          <a
            href={linkedin.url ?? undefined}
            target="_blank"
            rel="noreferrer"
            aria-label={linkedin.url ? "LinkedIn" : "LinkedIn (link not added yet)"}
            aria-disabled={!linkedin.url}
            className={cn(
              iconBtn,
              "hidden sm:inline-flex",
              !linkedin.url && "pointer-events-none opacity-40",
            )}
          >
            <SocialIcon name="linkedin" className="h-4 w-4" />
          </a>
          {resumeUrl ? (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="ml-1 hidden h-9 items-center gap-1.5 rounded-full bg-foreground px-3.5 text-[13px] font-medium text-background transition hover:opacity-90 sm:inline-flex"
            >
              <FileText className="h-3.5 w-3.5" /> Resume
            </a>
          ) : (
            <span
              className="ml-1 hidden h-9 items-center gap-1.5 rounded-full border border-dashed border-border px-3.5 font-mono text-[11px] text-muted-foreground xl:inline-flex"
              title="Add a resume via private admin or src/data/portfolio.ts"
            >
              <FileText className="h-3.5 w-3.5" /> Resume soon
            </span>
          )}
          <button
            onClick={() => setOpen(true)}
            className={cn(iconBtn, "lg:hidden")}
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-background/95 backdrop-blur-xl transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="flex h-14 items-center justify-between px-5">
          <span className="font-display text-sm font-semibold tracking-tight">
            {personal.name.toUpperCase()}
          </span>
          <button onClick={() => setOpen(false)} className={iconBtn} aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>
        <ul className="mt-6 flex flex-col px-5">
          {navLinks.map((l, i) => (
            <li
              key={l.href}
              style={{ transitionDelay: `${i * 40}ms` }}
              className={cn(
                "transition-all duration-500",
                open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
              )}
            >
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center justify-between border-b border-border py-4 font-display text-2xl font-medium tracking-tight",
                  active === l.href.slice(1) ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {l.label}
                <span className="font-mono text-xs text-subtle">0{i + 1}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap items-center gap-3 px-5">
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-4 text-sm font-medium text-background"
            >
              <FileText className="h-4 w-4" /> Resume
            </a>
          )}
          {github.url && (
            <a
              href={github.url}
              target="_blank"
              rel="noreferrer"
              className="glass inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm"
            >
              <SocialIcon name="github" /> GitHub
            </a>
          )}
          <button
            onClick={toggle}
            className="glass inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}{" "}
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>
      </div>
    </header>
  );
}
