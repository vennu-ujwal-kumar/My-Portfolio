import { Github, Instagram, Linkedin, Mail } from "lucide-react";
import { BrandIcon } from "./primitives";
import type { SocialKey } from "@/data/portfolio";
import { cn } from "@/lib/utils";

export function SocialIcon({ name, className }: { name: SocialKey; className?: string }) {
  const c = cn("h-[18px] w-[18px]", className);
  switch (name) {
    case "github":
      return <Github className={c} strokeWidth={1.8} />;
    case "linkedin":
      return <Linkedin className={c} strokeWidth={1.8} />;
    case "email":
      return <Mail className={c} strokeWidth={1.8} />;
    case "instagram":
      return <Instagram className={c} strokeWidth={1.8} />;
    case "leetcode":
      return <BrandIcon slug="leetcode" className={c} />;
    case "hackerrank":
      return <BrandIcon slug="hackerrank" className={c} />;
    case "codechef":
      return <BrandIcon slug="codechef" className={c} />;
    case "discord":
      return <BrandIcon slug="discord" className={c} />;
  }
}
