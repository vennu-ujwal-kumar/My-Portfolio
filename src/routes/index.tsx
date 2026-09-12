import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { About } from "@/components/About";
import { AdminPortal } from "@/components/AdminPortal";
import { Background } from "@/components/Background";
import { CodingProfiles } from "@/components/CodingProfiles";
import { CommandPalette } from "@/components/CommandPalette";
import { Contact } from "@/components/Contact";
import { CustomCursor } from "@/components/CustomCursor";
import { Exploring } from "@/components/Exploring";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Education, Experience, Milestones } from "@/components/Timeline";
import { personal, seo, social } from "@/data/portfolio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: seo.title },
      { name: "description", content: seo.description },
      { property: "og:title", content: seo.title },
      { property: "og:description", content: seo.description },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: seo.title },
      { name: "twitter:description", content: seo.description },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: personal.name,
          jobTitle: personal.role,
          affiliation: { "@type": "CollegeOrUniversity", name: "GRIET" },
          sameAs: [social("github").url],
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminSection, setAdminSection] = useState<"resume" | "photo">("resume");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Shift + U or Cmd + Shift + U
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "u") {
        e.preventDefault();
        setAdminSection("resume");
        setAdminOpen((prev) => !prev);
      }
    };
    const handleOpenAdmin = (e: Event) => {
      const customEvt = e as CustomEvent<{ section?: "resume" | "photo" }>;
      if (customEvt.detail?.section) {
        setAdminSection(customEvt.detail.section);
      }
      setAdminOpen(true);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-admin-portal", handleOpenAdmin);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-admin-portal", handleOpenAdmin);
    };
  }, []);

  return (
    <>
      <Background />
      <CustomCursor />
      <Navbar onOpenPalette={() => setPaletteOpen(true)} />
      <CommandPalette open={paletteOpen} setOpen={setPaletteOpen} />
      <AdminPortal
        open={adminOpen}
        onOpenChange={setAdminOpen}
        initialSection={adminSection}
      />
      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <Milestones />
        <CodingProfiles />
        <Exploring />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
