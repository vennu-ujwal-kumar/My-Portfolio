import { cva, type VariantProps } from "class-variance-authority";
import {
  useEffect,
  useRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/* ─────────── Buttons (with subtle magnetic pull on desktop) ─────────── */

export const buttonVariants = cva(
  "group/btn relative inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-[transform,background-color,border-color,box-shadow,color] duration-300 will-change-transform disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-[0_0_0_1px_color-mix(in_oklab,var(--primary)_60%,transparent),0_8px_30px_-8px_color-mix(in_oklab,var(--primary)_60%,transparent)] hover:shadow-[0_0_0_1px_color-mix(in_oklab,var(--primary)_80%,transparent),0_12px_40px_-8px_color-mix(in_oklab,var(--primary)_75%,transparent)]",
        outline: "glass text-foreground hover:border-primary/40 hover:bg-primary/5",
        ghost: "text-muted-foreground hover:text-foreground hover:bg-accent/60",
        subtle: "bg-secondary text-secondary-foreground hover:bg-accent",
      },
      size: {
        sm: "h-9 px-4 text-[13px]",
        md: "h-11 px-6 text-sm",
        lg: "h-12 px-7 text-[15px]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type MagneticProps = { magnetic?: boolean };

function useMagnetic<T extends HTMLElement>(enabled: boolean) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * 0.18}px, ${y * 0.22}px)`;
    };
    const leave = () => {
      el.style.transform = "";
    };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, [enabled]);
  return ref;
}

export function Button({
  className,
  variant,
  size,
  magnetic = true,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants> & MagneticProps) {
  const ref = useMagnetic<HTMLButtonElement>(magnetic);
  return (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}

export function ButtonLink({
  className,
  variant,
  size,
  magnetic = true,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & VariantProps<typeof buttonVariants> & MagneticProps) {
  const ref = useMagnetic<HTMLAnchorElement>(magnetic);
  return <a ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

/* ─────────── Section shell ─────────── */

export function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className,
  align = "left",
}: {
  id: string;
  eyebrow?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <section id={id} className={cn("relative scroll-mt-24 py-24 sm:py-32", className)}>
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        {(eyebrow || title) && (
          <Reveal
            className={cn("mb-12 sm:mb-16", align === "center" && "mx-auto max-w-2xl text-center")}
          >
            {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
            {title && (
              <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl md:text-5xl">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {subtitle}
              </p>
            )}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}

/* ─────────── Scroll reveal ─────────── */

export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "article" | "span";
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.classList.add("is-visible");
          obs.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const Comp = Tag as "div";
  return (
    <Comp
      ref={ref as never}
      className={cn("reveal", className)}
      style={{ transitionDelay: `${delay}ms` } as CSSProperties}
    >
      {children}
    </Comp>
  );
}

/* ─────────── Spotlight card (cursor-reactive glow) ─────────── */

export function SpotlightCard({
  className,
  children,
  as: Tag = "div",
  ...rest
}: { className?: string; children: ReactNode; as?: "div" | "article" | "li" | "a" } & Record<
  string,
  unknown
>) {
  const Comp = Tag as "div";
  return (
    <Comp
      onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      className={cn("spotlight panel card-hover rounded-2xl", className)}
      {...(rest as object)}
    >
      {children}
    </Comp>
  );
}

/* ─────────── Brand icon via simple-icons, tinted with currentColor ─────────── */

export function BrandIcon({ slug, className }: { slug: string; className?: string }) {
  const url = `https://cdn.simpleicons.org/${slug}`;
  return (
    <span
      aria-hidden
      className={cn("inline-block bg-current", className)}
      style={{
        maskImage: `url(${url})`,
        WebkitMaskImage: `url(${url})`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}

export function Pill({
  children,
  className,
  tone = "default",
}: {
  children: ReactNode;
  className?: string;
  tone?: "default" | "primary" | "success" | "violet" | "muted";
}) {
  const tones = {
    default: "border-border bg-secondary/60 text-secondary-foreground",
    primary: "border-primary/30 bg-primary/10 text-primary",
    success: "border-success/30 bg-success/10 text-success",
    violet: "border-violet/30 bg-violet/10 text-violet",
    muted: "border-border bg-transparent text-muted-foreground",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
