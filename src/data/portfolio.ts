/**
 * ─────────────────────────────────────────────────────────────────────────
 *  PORTFOLIO CONTENT — edit everything about the site from this one file.
 *  Values marked `null` or "#" are placeholders and are rendered as
 *  "coming soon" / disabled states until you fill them in.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const personal = {
  name: "Vennu Ujwal",
  initials: "VU",
  role: "Full-Stack Developer in the making",
  tagline: "Building modern software at the intersection of code, intelligence, and the web.",
  description:
    "I'm an undergraduate student at GRIET, currently exploring full-stack development, artificial intelligence, and modern software technologies.",
  status: "Currently learning & building",
  location: "India",
  email: "vennuujwalkumar@gmail.com",
  /** Put a PDF in /public (e.g. /resume.pdf) and set this to "/resume.pdf". */
  resumeUrl: null as string | null,
  githubUsername: "vennu-ujwal-kumar",
};

export const seo = {
  title: "Vennu Ujwal — Full-Stack Developer",
  description:
    "Portfolio of Vennu Ujwal, an undergraduate developer exploring full-stack development, AI, and modern software engineering.",
};

export type SocialKey =
  | "github"
  | "linkedin"
  | "email"
  | "instagram"
  | "leetcode"
  | "hackerrank"
  | "codechef"
  | "discord";

export type SocialLink = {
  key: SocialKey;
  label: string;
  /** null = not configured yet (rendered as a disabled placeholder). */
  url: string | null;
  handle?: string;
};

export const socials: SocialLink[] = [
  {
    key: "github",
    label: "GitHub",
    url: "https://github.com/vennu-ujwal-kumar",
    handle: "@vennu-ujwal-kumar",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/ujwal-vennu-02537342a/",
    handle: "ujwal-vennu",
  },
  {
    key: "email",
    label: "Email",
    url: `mailto:${personal.email}`,
    handle: personal.email,
  },
  { key: "instagram", label: "Instagram", url: null },
  {
    key: "leetcode",
    label: "LeetCode",
    url: "https://leetcode.com/u/gDk2jQJ9mx/",
    handle: "ujwal vennu (@gDk2jQJ9mx)",
  },
  {
    key: "hackerrank",
    label: "HackerRank",
    url: "https://www.hackerrank.com/profile/vennuujwalkumar",
    handle: "@vennuujwalkumar",
  },
  {
    key: "codechef",
    label: "CodeChef",
    url: "https://www.codechef.com/users/ujwal_vennu",
    handle: "ujwal vennu (@ujwal_vennu)",
  },
  {
    key: "discord",
    label: "Discord",
    url: "https://discord.com/users/ujwal_vennu_21698",
    handle: "ujwal_vennu_21698",
  },
];

export const social = (key: SocialKey) => socials.find((s) => s.key === key)!;

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
  { label: "Achievements", href: "#achievements" },
  { label: "Contact", href: "#contact" },
];

export const quickProfile = [
  { label: "Education", value: "GRIET" },
  { label: "Year", value: "Sophomore" },
  { label: "Focus", value: "Full-Stack Development" },
  { label: "Exploring", value: "AI & Full-Stack" },
  { label: "Based in", value: personal.location },
];

export const aboutParagraphs = [
  "I'm currently pursuing my undergraduate degree at GRIET and am in my sophomore year.",
  "I'm working toward becoming a strong full-stack developer while exploring the rapidly evolving world of artificial intelligence and modern software engineering.",
  "I enjoy learning how systems work, building things from scratch, experimenting with new technologies, and continuously improving my development skills.",
];

export const interests = [
  "Full-Stack Development",
  "Artificial Intelligence",
  "Machine Learning",
  "Modern JavaScript ecosystems",
  "Backend engineering",
  "Software architecture",
  "Developer tools",
  "Emerging technologies",
];

/* ───────────── Skills ───────────── */

export type SkillLevel = "Comfortable" | "Working With" | "Exploring";
export type SkillCategory = "Frontend" | "Backend" | "Database" | "Tools" | "Exploring";

export type Skill = {
  name: string;
  description: string;
  level: SkillLevel;
  /** simple-icons slug (https://simpleicons.org). Omit for a generic icon. */
  icon?: string;
};

export const skills: Record<SkillCategory, Skill[]> = {
  Frontend: [
    {
      name: "React",
      description: "Component-driven UIs and hooks.",
      level: "Comfortable",
      icon: "react",
    },
    {
      name: "Next.js",
      description: "Routing, rendering and full-stack React.",
      level: "Working With",
      icon: "nextdotjs",
    },
    {
      name: "JavaScript",
      description: "The language of the web.",
      level: "Comfortable",
      icon: "javascript",
    },
    {
      name: "HTML",
      description: "Semantic, accessible structure.",
      level: "Comfortable",
      icon: "html5",
    },
    {
      name: "CSS",
      description: "Layout, motion and responsive design.",
      level: "Comfortable",
      icon: "css",
    },
  ],
  Backend: [
    {
      name: "Node.js",
      description: "Servers, APIs and tooling in JS.",
      level: "Working With",
      icon: "nodedotjs",
    },
    {
      name: "Java",
      description: "Object-oriented fundamentals.",
      level: "Working With",
      icon: "openjdk",
    },
    {
      name: "Spring Boot",
      description: "Building structured backend services.",
      level: "Exploring",
      icon: "springboot",
    },
  ],
  Database: [
    // Add databases you actually use, e.g.:
    // { name: "PostgreSQL", description: "Relational data.", level: "Exploring", icon: "postgresql" },
    { name: "SQL", description: "Querying and modelling relational data.", level: "Exploring" },
  ],
  Tools: [
    {
      name: "Git",
      description: "Version control, branching, history.",
      level: "Comfortable",
      icon: "git",
    },
    {
      name: "GitHub",
      description: "Collaboration and open source.",
      level: "Comfortable",
      icon: "github",
    },
    { name: "VS Code", description: "Daily editor and extensions.", level: "Comfortable" },
    { name: "REST APIs", description: "Designing and consuming HTTP APIs.", level: "Working With" },
  ],
  Exploring: [
    {
      name: "Artificial Intelligence",
      description: "How intelligent systems are built.",
      level: "Exploring",
    },
    {
      name: "Cloud & APIs",
      description: "Scalable services and integrations.",
      level: "Exploring",
    },
    { name: "Machine Learning", description: "Models, data and evaluation.", level: "Exploring" },
    { name: "Modern Dev Tooling", description: "Bundlers, CI and DX.", level: "Exploring" },
  ],
};

/* ───────────── Projects ───────────── */

export type ProjectCategory = "Frontend" | "Backend" | "Full Stack" | "AI";
export type ProjectStatus = "Placeholder" | "In Progress" | "Completed" | "Planned";

export type Project = {
  slug: string;
  title: string;
  summary: string;
  category: ProjectCategory;
  status: ProjectStatus;
  tech: string[];
  featured?: boolean;
  /** Optional image path (put files in /public or import as asset). */
  image?: string | null;
  github?: string | null;
  /** Only rendered when a real deployment exists. */
  live?: string | null;
  details: {
    overview: string;
    problem: string;
    solution: string;
    features: string[];
    architecture: string;
    challenges: string;
    learned: string;
  };
};

const placeholderDetails = {
  overview: "Project overview goes here.",
  problem: "Describe the problem this project addresses.",
  solution: "Describe how the project solves it.",
  features: ["Key feature one", "Key feature two", "Key feature three"],
  architecture: "Describe the architecture (frontend, backend, data flow).",
  challenges: "What was hard and how you handled it.",
  learned: "What you learned while building it.",
};

/**
 * Featured & Curated Projects.
 * Additional public repositories created on GitHub are automatically synced in real time!
 */
export const projects: Project[] = [
  {
    slug: "task-flow",
    title: "TaskFlow",
    summary:
      "A modernized productivity web platform that enables users to organize tasks, track workflows, and boost daily efficiency.",
    category: "Frontend",
    status: "Completed",
    tech: ["JavaScript", "HTML5", "CSS3", "Vercel"],
    featured: true,
    image: "/images/projects/task-flow.png",
    github: "https://github.com/vennu-ujwal-kumar/Task-Flow",
    live: "https://task-flow-sage-tau.vercel.app",
    details: {
      overview:
        "TaskFlow is a modernized web application designed to help users streamline their daily workflow. It provides an intuitive, high-speed task tracking interface with seamless state persistence.",
      problem:
        "Many task trackers are overcomplicated or heavy, making quick capture and daily task organization cumbersome.",
      solution:
        "Engineered a lightning-fast, distraction-free productivity app featuring intuitive task management, immediate feedback, and a polished dark-mode aesthetic.",
      features: [
        "Create, complete, prioritize, and delete tasks seamlessly",
        "Clean, responsive UI crafted for both desktop and mobile devices",
        "Zero-latency interaction with local state synchronization",
        "Continuous deployment on Vercel with automatic builds",
      ],
      architecture:
        "Client-side architecture built with modern JavaScript, semantic HTML5, responsive CSS tokens, and hosted on Vercel edge infrastructure.",
      challenges:
        "Ensuring smooth UI transitions, responsive mobile-friendly layouts, and resilient state handling across sessions.",
      learned:
        "Mastered Vercel continuous deployment workflows, semantic frontend architecture, and developer-friendly UX design.",
    },
  },
];

export const projectFilters: Array<"All" | ProjectCategory> = [
  "All",
  "Frontend",
  "Backend",
  "Full Stack",
  "AI",
];

/* ───────────── Experience / Education / Milestones ───────────── */

export const experience = [
  {
    period: "2026 — Present",
    title: "Undergraduate Student",
    org: "GRIET",
    description:
      "Currently building my foundation in software engineering while developing projects and exploring full-stack development, artificial intelligence, and modern technologies.",
    current: true,
  },
  {
    period: "Ongoing",
    title: "Currently Building",
    org: "Personal projects",
    description:
      "Personal projects, developer skills, and a stronger understanding of full-stack engineering.",
    current: true,
  },
];

export const education = {
  school: "GRIET",
  degree: "Undergraduate Studies",
  status: "Currently pursuing",
  year: "Sophomore",
  focus: "Computer Science / Software Development",
  // Optional — fill in later if you want them shown:
  cgpa: null as string | null,
  graduation: null as string | null,
};

export const milestones = [
  "Currently pursuing undergraduate studies at GRIET",
  "Building projects to strengthen full-stack development skills",
  "Exploring AI and modern software engineering",
  "Expanding experience across frontend and backend technologies",
];

/** Empty categories render as "nothing here yet" placeholders — add items as they happen. */
export const achievementCategories: { label: string; items: string[] }[] = [
  { label: "Hackathons", items: [] },
  { label: "Certifications", items: [] },
  { label: "Awards", items: [] },
  { label: "Competitions", items: [] },
];

/* ───────────── Coding profiles ───────────── */

export const codingProfiles: { key: SocialKey; description: string }[] = [
  { key: "github", description: "Open-source code, experiments and projects." },
  { key: "linkedin", description: "Professional profile and updates." },
  { key: "leetcode", description: "Problem solving and algorithm practice." },
  { key: "hackerrank", description: "Coding challenges and skill tracks." },
  { key: "codechef", description: "Competitive programming and algorithm practice." },
];

/* ───────────── Currently exploring ───────────── */

export const exploring = [
  { name: "Artificial Intelligence", note: "Foundations & applications" },
  { name: "System Design", note: "Scalable & maintainable architectures" },
  { name: "Advanced Full-Stack Development", note: "End-to-end systems" },
  { name: "Spring Boot", note: "Java backend services" },
  { name: "Modern React / Next.js", note: "Server components & patterns" },
  { name: "Software Architecture", note: "Designing maintainable systems" },
  { name: "Developer Tools", note: "Better workflows & DX" },
];

export const journey = [
  { step: "Started", note: "Wrote my first lines of code and got hooked." },
  { step: "Learning", note: "Fundamentals: JavaScript, Java, the web." },
  { step: "Building", note: "Turning ideas into working projects." },
  { step: "Exploring", note: "AI, modern stacks, engineering patterns." },
  { step: "Growing", note: "Toward a career as a full-stack engineer." },
];

export const contactCopy = {
  heading: "Let's build something.",
  body: "I'm always interested in learning, building, and connecting with people who are passionate about technology.",
};
