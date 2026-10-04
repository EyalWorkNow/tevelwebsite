"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { sentence, title, words } from "@/lib/lorem";

/* Form primitives measured from the reference (_text-field / _trigger / _checkbox / strong button). */
const field = "h-11 w-full rounded bg-white px-5 text-base text-black shadow-[inset_0_0_0_1px_#363533] outline-none transition-shadow duration-200 focus:shadow-[inset_0_0_0_1px_#363533,0_0_0_3px_rgba(249,245,239,.35)]";

function Label({ htmlFor, children, optional }: { htmlFor?: string; children: ReactNode; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="leading-6 tracking-[0.01em]">
      {children}
      {optional && <span className="text-stone-2"> (optional)</span>}
    </label>
  );
}

export function TextField({ id, label, optional, type = "text" }: { id: string; label: string; optional?: boolean; type?: string }) {
  return (
    <div className="grid grid-cols-1 content-end gap-2.5">
      <Label htmlFor={id} optional={optional}>{label}</Label>
      <input id={id} name={id} type={type} className={field} />
    </div>
  );
}

export function TextArea({ id, label, optional }: { id: string; label: string; optional?: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-2.5">
      <Label htmlFor={id} optional={optional}>{label}</Label>
      <textarea id={id} name={id} className={`${field} h-[120px] resize-y p-5 leading-6`} />
    </div>
  );
}

const Chevron = ({ open }: { open: boolean }) => (
  <svg viewBox="0 0 12 12" width={12} height={12} className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round"><path d="M3.5 4.75L6 7.25l2.5-2.5" /></svg>
);

/** Custom select: `light` = white search-select (contact), default = dark trigger (contact/sales). */
export function Select({ id, label, placeholder, options, optional, light, multi }: { id: string; label: string; placeholder: string; options: string[]; optional?: boolean; light?: boolean; multi?: boolean }) {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", esc); };
  }, [open]);
  const toggle = (o: string) => {
    if (multi) setPicked((p) => (p.includes(o) ? p.filter((x) => x !== o) : [...p, o]));
    else { setPicked([o]); setOpen(false); }
  };
  const value = picked.join(", ");
  return (
    <div className="grid grid-cols-1 gap-2.5">
      <Label htmlFor={id} optional={optional}>{label}</Label>
      <div ref={ref} className="relative">
        <button
          id={id}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className={`flex h-11 w-full items-center justify-between gap-3 rounded px-5 text-left transition-shadow duration-200 ${
            light
              ? "bg-white text-black shadow-[inset_0_0_0_1px_#363533]"
              : "text-paper shadow-[inset_0_0_0_1px_#363533] hover:shadow-[inset_0_0_0_1px_#514e4b]"
          } ${open ? "shadow-[inset_0_0_0_1px_#959089]" : ""}`}
        >
          <span className={`truncate leading-6 ${value ? "" : light ? "text-stone-2" : "text-stone-2"}`}>{value || placeholder}</span>
          <span className={light ? "text-stone-2" : "text-paper"}><Chevron open={open} /></span>
        </button>
        {open && (
          <ul role="listbox" aria-multiselectable={multi} className="absolute inset-x-0 top-[calc(100%+6px)] z-30 max-h-64 overflow-auto rounded-md bg-ink-2 p-1 shadow-[inset_0_0_0_1px_#363533,0_12px_32px_rgba(0,0,0,.5)] animate-[slide-down-and-fade_.2s_ease_both]">
            {options.map((o) => {
              const on = picked.includes(o);
              return (
                <li key={o} role="option" aria-selected={on}>
                  <button type="button" onClick={() => toggle(o)} className={`flex w-full items-center justify-between rounded px-4 py-2.5 text-left leading-6 transition-colors duration-150 hover:bg-line ${on ? "text-paper" : "text-stone"}`}>
                    {o}
                    {on && <svg viewBox="0 0 16 16" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3.5 8.5l3 3 6-7" /></svg>}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export function Consent({ id }: { id: string }) {
  const [on, setOn] = useState(false);
  return (
    <div className="flex gap-3 pb-10">
      <button
        type="button"
        role="checkbox"
        aria-checked={on}
        aria-labelledby={`${id}-l`}
        onClick={() => setOn((v) => !v)}
        className={`mt-px grid size-5 shrink-0 place-items-center rounded shadow-[inset_0_0_0_1px_#363533] transition-colors duration-150 ${on ? "bg-paper" : "bg-white"}`}
      >
        {on && <svg viewBox="0 0 16 16" width={12} height={12} fill="none" stroke="#0c0c0b" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3.5 8.5l3 3 6-7" /></svg>}
      </button>
      <div className="flex flex-col gap-1">
        <span id={`${id}-l`} className="-mt-px cursor-pointer leading-6 tracking-[0.01em]" onClick={() => setOn((v) => !v)}>{sentence(12, 40)}</span>
        <span className="max-w-[648px] text-[13px] leading-6 tracking-[0.01em] text-stone-2">
          {sentence(16, 41).slice(0, -1)} <Link href="#" className="text-paper underline underline-offset-2">{words(1, 42)}@lorem.com</Link>.
        </span>
      </div>
    </div>
  );
}

function Policy({ className = "" }: { className?: string }) {
  return (
    <p className={`text-[13px] leading-6 tracking-[0.01em] ${className}`}>
      {title(2, 43)} <Link href="/privacy" className="underline underline-offset-2 transition-[text-decoration-color] duration-150 hover:decoration-transparent">{words(2, 44)}</Link> {words(8, 45)}.
    </p>
  );
}

const submit = "h-11 rounded-md bg-paper px-5 font-mono text-base uppercase leading-4 text-ink-2 transition-colors duration-300 hover:bg-paper-2";

function useSubmit() {
  const [sent, setSent] = useState(false);
  return [sent, (e: FormEvent) => { e.preventDefault(); setSent(true); }] as const;
}

const countries = Array.from({ length: 10 }, (_, i) => title(1 + (i % 2), 100 + i));

export function ContactForm() {
  const [sent, onSubmit] = useSubmit();
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8" noValidate>
      <div className="flex gap-3"><div className="flex-1"><TextField id="c-first" label="First name" /></div><div className="flex-1"><TextField id="c-last" label="Last name" /></div></div>
      <div className="flex gap-3"><div className="flex-1"><TextField id="c-email" label="Company email" type="email" /></div><div className="flex-1"><TextField id="c-web" label="Company website" optional /></div></div>
      <Select id="c-country" label="Country" placeholder={sentence(5, 46).slice(0, -1)} options={countries} light />
      <TextArea id="c-msg" label="Message" />
      <Consent id="c-consent" />
      <div className="flex flex-col gap-5 md:items-end">
        <button type="submit" className={`${submit} w-full md:w-[230px]`}>{sent ? "Sent" : "Send"}</button>
        <Policy className="text-center md:text-right" />
      </div>
    </form>
  );
}

const lists = {
  products: Array.from({ length: 6 }, (_, i) => title(2, 120 + i)),
  jobs: Array.from({ length: 7 }, (_, i) => title(1 + (i % 2), 130 + i)),
  activity: Array.from({ length: 6 }, (_, i) => title(2, 140 + i)),
  source: Array.from({ length: 6 }, (_, i) => title(1, 150 + i)),
};

export function SalesForm() {
  const [sent, onSubmit] = useSubmit();
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8" noValidate>
      <div className="flex gap-3"><div className="flex-1"><TextField id="s-first" label="First name" /></div><div className="flex-1"><TextField id="s-last" label="Last name" /></div></div>
      <TextField id="s-email" label="Company email" type="email" />
      <Select id="s-products" label={`${title(5, 47)}?`} placeholder={title(4, 48)} options={lists.products} multi />
      <Select id="s-job" label={title(2, 49)} placeholder={title(4, 50)} options={lists.jobs} />
      <Select id="s-activity" label={`${title(5, 51)}?`} placeholder={title(4, 52)} options={lists.activity} />
      <Select id="s-source" label={`${title(4, 53)}?`} placeholder={title(2, 54)} options={lists.source} optional />
      <TextArea id="s-msg" label="Message" optional />
      <Consent id="s-consent" />
      <Policy />
      <button type="submit" className={`${submit} w-full`}>{sent ? "Sent" : "Submit"}</button>
    </form>
  );
}
