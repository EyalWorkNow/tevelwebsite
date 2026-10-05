"use client";
import { useState, type FormEvent } from "react";
import { Arrow } from "./icons";

type Status = "idle" | "sending" | "sent" | "error";
const ERR: Record<string, string> = {
  invalid_email: "כתובת האימייל לא תקינה.",
  missing_name: "נא למלא שם.",
  rate_limited: "נשלחו יותר מדי פניות. נסו שוב בעוד כמה דקות.",
  mail_not_configured: "שליחת הטופס עדיין לא הוגדרה. אפשר לפנות אלינו ישירות במייל.",
};

async function submit(e: FormEvent<HTMLFormElement>, source: string, set: (s: Status) => void, setErr: (s: string) => void) {
  e.preventDefault();
  const form = e.currentTarget;
  set("sending");
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...Object.fromEntries(new FormData(form)), source }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { setErr(ERR[data.error] ?? "משהו השתבש. נסו שוב."); set("error"); return; }
    form.reset();
    set("sent");
  } catch {
    setErr("אין חיבור לשרת. נסו שוב."); set("error");
  }
}

const field = "h-11 w-full rounded-md border border-line-2 bg-ink-2 px-3 text-paper placeholder:text-muted outline-none transition-colors focus:border-brand";
const Label = ({ children, req }: { children: string; req?: boolean }) => (
  <span className="mb-1.5 block text-sm text-stone">{children}{req && <span className="text-brand"> *</span>}</span>
);
const Honeypot = () => <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />;

/** Full qualification form — /contact. Fields per brief §25, kept short. */
export function LeadForm({ source = "contact" }: { source?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [err, setErr] = useState("");

  if (status === "sent") return (
    <div className="rounded-lg border border-brand/40 bg-brand/5 p-8 text-center animate-[fade-in_.4s_ease_both]">
      <p className="font-serif text-2xl font-light">תודה, קיבלנו.</p>
      <p className="mt-2 text-stone">נחזור אליכם בהקדם כדי להבין מה לא עובד — ומשם נתחיל.</p>
    </div>
  );

  return (
    <form onSubmit={(e) => submit(e, source, setStatus, setErr)} className="grid gap-5 sm:grid-cols-2">
      <Honeypot />
      <label><Label req>שם</Label><input name="name" required autoComplete="name" className={field} /></label>
      <label><Label>חברה</Label><input name="company" autoComplete="organization" className={field} /></label>
      <label><Label>תפקיד</Label><input name="role" autoComplete="organization-title" className={field} /></label>
      <label><Label req>אימייל</Label><input name="email" type="email" required dir="ltr" autoComplete="email" className={`${field} text-right`} /></label>
      <label><Label>טלפון</Label><input name="phone" type="tel" dir="ltr" autoComplete="tel" className={`${field} text-right`} /></label>
      <label>
        <Label>גודל החברה</Label>
        <select name="size" defaultValue="" className={field}>
          <option value="" disabled>בחרו</option>
          {["1–9 עובדים", "10–49 עובדים", "50–199 עובדים", "200+ עובדים"].map((o) => <option key={o}>{o}</option>)}
        </select>
      </label>
      <label className="sm:col-span-2">
        <Label req>מה אתם מנסים לפתור?</Label>
        <textarea name="message" required rows={5} placeholder="לא צריך לדעת איזו מערכת אתם צריכים — ספרו מה לא עובד." className={`${field} h-auto py-3`} />
      </label>
      <label>
        <Label>טווח תקציב (לא חובה)</Label>
        <select name="budget" defaultValue="" className={field}>
          <option value="">לא בטוחים עדיין</option>
          {["עד ₪50K", "₪50K–150K", "₪150K–500K", "₪500K+"].map((o) => <option key={o}>{o}</option>)}
        </select>
      </label>
      <fieldset>
        <Label>איך נוח לחזור אליכם?</Label>
        <div className="flex h-11 items-center gap-5">
          {["אימייל", "טלפון", "WhatsApp"].map((o, i) => (
            <label key={o} className="flex items-center gap-2 text-sm">
              <input type="radio" name="contact" value={o} defaultChecked={i === 0} className="accent-[var(--color-brand)]" />{o}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="flex flex-col items-start gap-3 sm:col-span-2">
        <button type="submit" disabled={status === "sending"} className="btn-light disabled:opacity-60">
          {status === "sending" ? "שולח…" : "שליחה"} <Arrow />
        </button>
        {status === "error" && <p role="alert" className="text-sm text-rose">{err}</p>}
      </div>
    </form>
  );
}

/** One-line email capture — Invoice waitlist / insights. */
export function EmailCapture({ source, cta = "הצטרפות" }: { source: string; cta?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [err, setErr] = useState("");
  if (status === "sent") return <p className="text-brand animate-[fade-in_.4s_ease_both]">נרשמתם. נעדכן אתכם.</p>;
  return (
    <form onSubmit={(e) => submit(e, source, setStatus, setErr)} className="flex w-full max-w-md flex-col gap-2">
      <Honeypot />
      <div className="flex gap-2">
        <input name="email" type="email" required dir="ltr" placeholder="name@company.com" aria-label="אימייל" className={`${field} text-right`} />
        <button type="submit" disabled={status === "sending"} className="btn-light shrink-0 disabled:opacity-60">{status === "sending" ? "…" : cta}</button>
      </div>
      {status === "error" && <p role="alert" className="text-sm text-rose">{err}</p>}
    </form>
  );
}
