import { personal, socials } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { SocialIcon } from "./SocialIcon";

export function Footer() {
  return (
    <footer className="relative border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 py-14 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-xl font-semibold tracking-tight text-foreground">
            {personal.name}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{personal.role}.</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {socials.map((s) => (
              <li key={s.key}>
                <a
                  href={s.url ?? undefined}
                  target={s.key === "email" ? undefined : "_blank"}
                  rel="noreferrer"
                  aria-label={s.url ? s.label : `${s.label} (link coming soon)`}
                  aria-disabled={!s.url}
                  title={s.url ? s.label : `${s.label} — coming soon`}
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition hover:border-primary/40 hover:text-foreground",
                    !s.url && "pointer-events-none opacity-35",
                  )}
                >
                  <SocialIcon name={s.key} />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="font-mono text-[11px] text-subtle md:text-right">
          <p>© 2026 {personal.name}</p>
          <p className="mt-1">Built with curiosity, caffeine &amp; code.</p>
          <p className="mt-1 hidden md:block">
            press <kbd className="rounded border border-border px-1 py-0.5">Ctrl</kbd> +{" "}
            <kbd className="rounded border border-border px-1 py-0.5">K</kbd>
          </p>
          <div className="mt-2 flex items-center gap-2 md:justify-end">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("open-admin-portal"))}
              className="inline-flex items-center gap-1 text-[10px] text-muted-foreground/50 hover:text-foreground transition-colors cursor-pointer"
              title="Private Admin Manager (Resume & Photo — Ctrl+Shift+U)"
            >
              <span>🔒 Admin Manager (Resume &amp; Photo)</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
