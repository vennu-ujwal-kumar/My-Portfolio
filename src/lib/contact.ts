import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  subject: z.string().trim().min(3, "Add a short subject").max(150),
  message: z.string().trim().min(10, "Tell me a little more (10+ characters)").max(2000),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactResult =
  { ok: true } | { ok: false; reason: "not_configured" | "error"; message: string };

/**
 * Delivery hook. No email service is connected yet, so this reports
 * `not_configured` honestly. Swap the body for a real call (server function,
 * Formspree, Resend, etc.) when ready — the UI already handles every state.
 */
export async function submitContact(_input: ContactInput): Promise<ContactResult> {
  return {
    ok: false,
    reason: "not_configured",
    message:
      "Email delivery isn't connected yet. Your message was validated but not sent — please reach out via GitHub for now.",
  };
}
