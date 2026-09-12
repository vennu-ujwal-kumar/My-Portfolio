import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Info,
  Loader2,
  Mail,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { contactCopy, personal, socials, type SocialKey } from "@/data/portfolio";
import { contactSchema, submitContact, type ContactInput } from "@/lib/contact";
import { cn } from "@/lib/utils";
import { SocialIcon } from "./SocialIcon";
import { Button, Reveal, Section } from "./primitives";

const contactKeys: SocialKey[] = [
  "email",
  "github",
  "leetcode",
  "hackerrank",
  "codechef",
  "linkedin",
  "discord",
];

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "success" }
  | { kind: "info" | "error"; message: string };

export function Contact() {
  const [values, setValues] = useState<ContactInput>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactInput, string>>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [copied, setCopied] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const errs: typeof errors = {};
      for (const issue of parsed.error.issues)
        errs[issue.path[0] as keyof ContactInput] = issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus({ kind: "sending" });
    try {
      const res = await submitContact(parsed.data);
      if (res.ok) {
        setStatus({ kind: "success" });
        setValues({ name: "", email: "", subject: "", message: "" });
      } else
        setStatus({
          kind: res.reason === "not_configured" ? "info" : "error",
          message: res.message,
        });
    } catch {
      setStatus({ kind: "error", message: "Something went wrong. Please try again." });
    }
  };

  const field =
    "w-full rounded-xl border border-input bg-surface/60 px-4 py-3 text-sm text-foreground placeholder:text-subtle transition focus:border-primary/50 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20";
  const set =
    (k: keyof ContactInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((v) => ({ ...v, [k]: e.target.value }));

  return (
    <Section id="contact" eyebrow="09 — Contact" className="pb-16">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <Reveal>
          <h2 className="font-display text-4xl font-semibold tracking-[-0.03em] text-foreground sm:text-5xl md:text-6xl">
            {contactCopy.heading.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="text-gradient animate-gradient-x">
              {contactCopy.heading.split(" ").slice(-1)}
            </span>
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
            {contactCopy.body}
          </p>

          <ul className="mt-10 space-y-2">
            {contactKeys.map((k) => {
              const s = socials.find((x) => x.key === k)!;
              const configured = !!s.url;
              const Comp = configured ? "a" : "div";
              return (
                <li key={k}>
                  <Comp
                    {...(configured
                      ? {
                          href: s.url!,
                          target: s.key === "email" ? undefined : "_blank",
                          rel: "noreferrer",
                        }
                      : { "aria-disabled": true })}
                    className={cn(
                      "group flex items-center gap-4 rounded-xl border border-border px-4 py-3 transition",
                      configured
                        ? "hover:border-primary/40 hover:bg-primary/5"
                        : "border-dashed opacity-60",
                    )}
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-surface-2 text-foreground">
                      <SocialIcon name={k} />
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-medium text-foreground">{s.label}</span>
                      <span className="block font-mono text-[11px] text-subtle">
                        {configured
                          ? (s.handle ?? (k === "email" ? personal.email : s.url))
                          : "not added yet"}
                      </span>
                    </span>
                    {configured && (
                      <ArrowRight className="h-4 w-4 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                    )}
                  </Comp>
                </li>
              );
            })}
          </ul>
        </Reveal>

        <Reveal delay={120}>
          <form
            onSubmit={onSubmit}
            noValidate
            className="panel rounded-3xl p-6 sm:p-8"
            aria-describedby="contact-status"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="name" label="Name" error={errors.name}>
                <input
                  id="name"
                  name="name"
                  autoComplete="name"
                  value={values.name}
                  onChange={set("name")}
                  className={field}
                  placeholder="Your name"
                  aria-invalid={!!errors.name}
                />
              </Field>
              <Field id="email" label="Email" error={errors.email}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={set("email")}
                  className={field}
                  placeholder="you@example.com"
                  aria-invalid={!!errors.email}
                />
              </Field>
            </div>
            <Field id="subject" label="Subject" error={errors.subject} className="mt-4">
              <input
                id="subject"
                name="subject"
                value={values.subject}
                onChange={set("subject")}
                className={field}
                placeholder="What's this about?"
                aria-invalid={!!errors.subject}
              />
            </Field>
            <Field id="message" label="Message" error={errors.message} className="mt-4">
              <textarea
                id="message"
                name="message"
                rows={5}
                value={values.message}
                onChange={set("message")}
                className={cn(field, "resize-y")}
                placeholder="Say hello, share an idea, or ask a question…"
                aria-invalid={!!errors.message}
              />
            </Field>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <p className="font-mono text-[11px] text-subtle">
                Validated client-side · delivery service pluggable
              </p>
              <Button type="submit" size="lg" disabled={status.kind === "sending"}>
                {status.kind === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Send Message{" "}
                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
              </Button>
            </div>

            <div id="contact-status" aria-live="polite" className="mt-4 min-h-[1.5rem]">
              {status.kind === "success" && (
                <Banner icon={CheckCircle2} tone="success">
                  Message sent — thank you! I'll get back to you soon.
                </Banner>
              )}
              {status.kind === "info" && (
                <Banner icon={Info} tone="primary">
                  <div className="w-full">
                    <p>{status.message}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <a
                        href={`mailto:${personal.email || ""}?subject=${encodeURIComponent(values.subject || "Hello Ujwal")}&body=${encodeURIComponent((values.message ? values.message + "\n\n" : "") + "From: " + (values.name || "A Visitor") + (values.email ? ` <${values.email}>` : ""))}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 font-mono text-xs font-medium text-primary-foreground transition hover:opacity-90"
                      >
                        <Mail className="h-3.5 w-3.5" /> Open in Email App
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          const text = `Subject: ${values.subject}\nFrom: ${values.name} (${values.email})\n\n${values.message}`;
                          navigator.clipboard.writeText(text);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 font-mono text-xs text-foreground transition hover:bg-accent"
                      >
                        {copied ? (
                          <Check className="h-3.5 w-3.5 text-success" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                        {copied ? "Copied" : "Copy Message"}
                      </button>
                    </div>
                  </div>
                </Banner>
              )}
              {status.kind === "error" && (
                <Banner icon={AlertCircle} tone="destructive">
                  {status.message}
                </Banner>
              )}
            </div>
          </form>
        </Reveal>
      </div>
    </Section>
  );
}

function Field({
  id,
  label,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  className?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground"
      >
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function Banner({
  icon: Icon,
  tone,
  children,
}: {
  icon: typeof Info;
  tone: "success" | "primary" | "destructive";
  children: React.ReactNode;
}) {
  const tones = {
    success: "border-success/30 bg-success/10 text-success",
    primary: "border-primary/30 bg-primary/10 text-foreground",
    destructive: "border-destructive/30 bg-destructive/10 text-destructive",
  };
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm animate-fade-up",
        tones[tone],
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" /> <span>{children}</span>
    </div>
  );
}
