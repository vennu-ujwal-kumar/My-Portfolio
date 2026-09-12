import { useEffect, useRef, useState } from "react";
import { useIsFinePointer, useReducedMotion } from "@/lib/theme";

const INTERACTIVE = "a, button, [role=button], input, textarea, select, label, [data-cursor]";

export function CustomCursor() {
  const fine = useIsFinePointer();
  const reduced = useReducedMotion();
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!fine) return;
    document.documentElement.classList.add("cursor-none-desktop");
    let raf = 0,
      tx = 0,
      ty = 0,
      rx = 0,
      ry = 0,
      hover = false,
      down = false;
    const move = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      setVisible(true);
      const t = e.target as HTMLElement | null;
      hover = !!t?.closest?.(INTERACTIVE);
      if (dot.current)
        dot.current.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%,-50%)`;
    };
    const tick = () => {
      const ease = reduced ? 1 : 0.18;
      rx += (tx - rx) * ease;
      ry += (ty - ry) * ease;
      if (ring.current) {
        const s = down ? 0.7 : hover ? 1.8 : 1;
        ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%,-50%) scale(${s})`;
        ring.current.style.opacity = hover ? "0.9" : "0.5";
      }
      raf = requestAnimationFrame(tick);
    };
    const onDown = () => {
      down = true;
    };
    const onUp = () => {
      down = false;
    };
    const leave = () => setVisible(false);
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", leave);
    raf = requestAnimationFrame(tick);
    return () => {
      document.documentElement.classList.remove("cursor-none-desktop");
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, [fine, reduced]);

  if (!fine) return null;
  return (
    <>
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 rounded-full bg-primary mix-blend-difference transition-opacity"
        style={{ opacity: visible ? 1 : 0 }}
      />
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] h-8 w-8 rounded-full border border-primary/70 transition-[opacity,border-color] duration-200"
        style={{ opacity: visible ? 0.5 : 0, willChange: "transform" }}
      />
    </>
  );
}
