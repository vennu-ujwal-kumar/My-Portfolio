import {
  Github,
  Home,
  Linkedin,
  Moon,
  Sun,
  type LucideIcon,
  BookOpen,
  Code2,
  FolderGit2,
  Briefcase,
  GraduationCap,
  Mail,
  Trophy,
} from "lucide-react";
import { useEffect } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { social } from "@/data/portfolio";
import { useTheme } from "@/lib/theme";

import { DialogDescription, DialogTitle } from "@/components/ui/dialog";

const nav: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Go Home", href: "#home", icon: Home },
  { label: "About", href: "#about", icon: BookOpen },
  { label: "Skills", href: "#skills", icon: Code2 },
  { label: "Projects", href: "#projects", icon: FolderGit2 },
  { label: "Experience", href: "#experience", icon: Briefcase },
  { label: "Education", href: "#education", icon: GraduationCap },
  { label: "Achievements", href: "#achievements", icon: Trophy },
  { label: "Contact", href: "#contact", icon: Mail },
];

export function CommandPalette({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (o: boolean) => void;
}) {
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const go = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    history.replaceState(null, "", href);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <DialogTitle className="sr-only">Command palette</DialogTitle>
      <DialogDescription className="sr-only">Jump to a section or run an action</DialogDescription>
      <CommandInput placeholder="Type a command or search…" className="font-mono text-sm" />
      <CommandList className="scrollbar-thin">
        <CommandEmpty className="py-8 text-center font-mono text-xs text-subtle">
          No results.
        </CommandEmpty>
        <CommandGroup heading="Navigate">
          {nav.map((n) => (
            <CommandItem key={n.href} value={n.label} onSelect={() => go(n.href)} className="gap-3">
              <n.icon className="h-4 w-4 text-muted-foreground" /> {n.label}
              <span className="ml-auto font-mono text-[10px] text-subtle">{n.href}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem
            value="GitHub"
            onSelect={() => {
              setOpen(false);
              window.open(social("github").url!, "_blank", "noopener");
            }}
            className="gap-3"
          >
            <Github className="h-4 w-4 text-muted-foreground" /> Open GitHub
          </CommandItem>
          <CommandItem
            value="LinkedIn"
            onSelect={() => {
              setOpen(false);
              window.open(social("linkedin").url!, "_blank", "noopener");
            }}
            className="gap-3"
          >
            <Linkedin className="h-4 w-4 text-muted-foreground" /> Open LinkedIn
          </CommandItem>
          <CommandItem
            value="Toggle Theme"
            onSelect={() => {
              toggle();
              setOpen(false);
            }}
            className="gap-3"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Moon className="h-4 w-4 text-muted-foreground" />
            )}{" "}
            Toggle Theme
            <span className="ml-auto font-mono text-[10px] text-subtle">
              {theme === "dark" ? "→ light" : "→ dark"}
            </span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
