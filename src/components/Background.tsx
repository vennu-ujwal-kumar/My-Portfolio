import { useEffect, useRef } from "react";

/** Fixed, non-interactive backdrop: grid, blurred light sources, drifting particles, noise. */
export function Background() {
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = glow.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let raf = 0;
    let tx = window.innerWidth / 2,
      ty = window.innerHeight / 3,
      x = tx,
      y = ty;
    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const tick = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      el.style.transform = `translate3d(${x - 300}px, ${y - 300}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div aria-hidden className="noise pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 grid-bg" />
      {/* light sources */}
      <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-primary/10 blur-[150px] light:bg-primary/5" />
      <div className="absolute top-[40%] -right-40 h-[420px] w-[420px] rounded-full bg-primary/[0.04] blur-[150px]" />
      <div className="absolute bottom-[-10%] -left-40 h-[420px] w-[520px] rounded-full bg-primary/[0.03] blur-[150px]" />
      {/* cursor-reactive glow */}
      <div
        ref={glow}
        className="absolute left-0 top-0 h-[600px] w-[600px] rounded-full bg-primary/[0.05] blur-[130px] will-change-transform light:bg-primary/[0.03]"
      />
      {/* particles */}
      <div className="absolute inset-0">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="absolute block rounded-full bg-foreground/40 animate-float"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.s,
              height: p.s,
              opacity: p.o,
              animationDuration: `${p.d}s`,
              animationDelay: `${-p.d / 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

const PARTICLES = Array.from({ length: 28 }, (_, i) => {
  const r = (n: number) => (((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1) + 1) % 1;
  return { x: r(1) * 100, y: r(2) * 100, s: 1 + r(3) * 2, o: 0.15 + r(4) * 0.35, d: 6 + r(5) * 10 };
});
