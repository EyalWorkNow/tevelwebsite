import Link from "next/link";
import type { Metadata } from "next";
import { answers, type Answer, type Lang } from "@/lib/answers";
import { Button, CtaBand, Reveal } from "@/components/ui";
import { Arrow } from "@/components/icons";

const BASE = (process.env.NEXT_PUBLIC_SITE_URL || "https://tevelwebsite.vercel.app").replace(/\/$/, "");
const path = (lang: Lang, slug?: string) => `${lang === "en" ? "/en" : ""}/answers${slug ? `/${slug}` : ""}`;
const ui = {
  he: { eyebrow: "שאלות ותשובות", indexH1: "שאלות שעסקים שואלים — ותשובות ישירות", indexLede: "תשובות קצרות וברורות לשאלות הנפוצות על פיתוח מערכות, CRM ו-ERP, אוטומציות, AI, אפליקציות ו-R&D — ואיך תבל ניגשת לכל אחת מהן.", short: "התשובה הקצרה", faq: "שאלות נוספות", related: "לקריאה נוספת", other: "שאלות נוספות", lang: "English", back: "כל השאלות", cta: "בואו נדבר" },
  en: { eyebrow: "Questions & answers", indexH1: "Questions businesses ask — and direct answers", indexLede: "Short, clear answers to common questions about custom software, CRM and ERP, automation, AI, apps and R&D — and how TEVEL approaches each one.", short: "The short answer", faq: "More questions", related: "Read more", other: "Other questions", lang: "עברית", back: "All questions", cta: "Talk to us" },
};

export function answerMetadata(a: Answer, lang: Lang): Metadata {
  const t = a[lang];
  return {
    title: t.q,
    description: t.tldr.slice(0, 160),
    alternates: { canonical: path(lang, a.slug), languages: { he: path("he", a.slug), en: path("en", a.slug), "x-default": path("he", a.slug) } },
    openGraph: { title: t.q, description: t.tldr.slice(0, 200), locale: lang === "he" ? "he_IL" : "en_US", type: "article" },
  };
}

export function indexMetadata(lang: Lang): Metadata {
  return {
    title: ui[lang].eyebrow,
    description: ui[lang].indexLede,
    alternates: { canonical: path(lang), languages: { he: path("he"), en: path("en"), "x-default": path("he") } },
  };
}

export function AnswerPage({ a, lang }: { a: Answer; lang: Lang }) {
  const t = a[lang], u = ui[lang], dir = lang === "he" ? "rtl" : "ltr";
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "FAQPage", inLanguage: lang, mainEntity: [[t.q, t.tldr], ...t.faq].map(([q, ans]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: ans } })) },
      { "@type": "Article", headline: t.q, inLanguage: lang, url: BASE + path(lang, a.slug), author: { "@type": "Organization", name: "TEVEL | תבל", url: BASE }, publisher: { "@id": `${BASE}/#org` }, about: t.short },
    ],
  };
  return (
    <div lang={lang} dir={dir}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <article className="wrap">
        <div className="inner mx-auto max-w-[860px] pb-16 pt-12 md:pt-[72px]">
          <div className="flex items-center justify-between gap-4">
            <Link href={path(lang)} className="label text-muted transition-colors hover:text-paper">{u.back}</Link>
            <Link href={path(lang === "he" ? "en" : "he", a.slug)} hrefLang={lang === "he" ? "en" : "he"} className="label rounded-full border border-line-2 px-3 py-1.5 transition-colors hover:border-brand">{u.lang}</Link>
          </div>
          <Reveal><p className="label mt-10 text-brand">{t.short}</p></Reveal>
          <Reveal delay={60}><h1 className="mt-4 text-[34px] font-light leading-[42px] md:text-[48px] md:leading-[58px]">{t.q}</h1></Reveal>

          <Reveal delay={120}>
            <section aria-labelledby="short" className="mt-10 rounded-lg border border-brand/40 bg-brand/5 p-6">
              <h2 id="short" className="label text-brand">{u.short}</h2>
              <p className="mt-3 text-lg leading-8">{t.tldr}</p>
            </section>
          </Reveal>

          {t.sections.map((s) => (
            <section key={s.h} className="mt-12">
              <h2 className="text-[26px] font-light leading-9 md:text-[30px]">{s.h}</h2>
              {s.p && <p className="mt-4 text-lg leading-8 text-stone">{s.p}</p>}
              {s.list && (
                <ul className="mt-4 space-y-2">
                  {s.list.map((li) => <li key={li} className="flex gap-3 text-lg leading-8 text-stone"><span className="mt-3.5 size-1.5 shrink-0 rounded-full bg-brand" />{li}</li>)}
                </ul>
              )}
            </section>
          ))}

          <section className="mt-14">
            <h2 className="text-[26px] font-light leading-9 md:text-[30px]">{u.faq}</h2>
            <div className="mt-4">
              {t.faq.map(([q, ans]) => (
                <details key={q} className="group border-b border-line">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg">
                    {q}<span className="text-muted transition-transform duration-300 group-open:rotate-45 group-open:text-brand">+</span>
                  </summary>
                  <p className="pb-6 leading-7 text-stone">{ans}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="mt-14">
            <h2 className="label text-muted">{u.related}</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {a.links.map((l) => (
                <Link key={l.href} href={l.href} className="group inline-flex items-center gap-2 rounded-full border border-line-2 px-4 py-2 text-sm transition-colors hover:border-brand">
                  {l[lang]}<Arrow />
                </Link>
              ))}
            </div>
          </section>

          <div className="mt-12"><Button href="/contact" arrow>{t.cta}</Button></div>
        </div>
      </article>

      <section className="rule">
        <div className="wrap"><div className="inner py-14">
          <h2 className="label text-muted">{u.other}</h2>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {answers.filter((x) => x.slug !== a.slug).map((x) => (
              <li key={x.slug}><Link href={path(lang, x.slug)} className="block rounded-lg border border-line p-4 leading-7 transition-colors hover:border-line-2 hover:bg-ink-2">{x[lang].q}</Link></li>
            ))}
          </ul>
        </div></div>
      </section>
      <CtaBand cta={u.cta} text={lang === "he" ? "ספרו לנו מה לא עובד. אנחנו נתחיל משם." : "Tell us what's not working. We'll start there."} />
    </div>
  );
}

export function AnswersIndex({ lang }: { lang: Lang }) {
  const u = ui[lang];
  return (
    <div lang={lang} dir={lang === "he" ? "rtl" : "ltr"}>
      <section className="wrap">
        <div className="inner mx-auto max-w-[960px] pb-10 pt-12 md:pt-[72px]">
          <div className="flex items-center justify-between">
            <p className="label text-brand">{u.eyebrow}</p>
            <Link href={path(lang === "he" ? "en" : "he")} hrefLang={lang === "he" ? "en" : "he"} className="label rounded-full border border-line-2 px-3 py-1.5 transition-colors hover:border-brand">{u.lang}</Link>
          </div>
          <h1 className="mt-6 text-[36px] font-light leading-[44px] md:text-[52px] md:leading-[62px]">{u.indexH1}</h1>
          <p className="mt-6 max-w-[640px] text-lg leading-8 text-stone">{u.indexLede}</p>
          <ul className="mt-12 grid gap-4 md:grid-cols-2">
            {answers.map((a, i) => (
              <Reveal as="li" key={a.slug} delay={(i % 2) * 80}>
                <Link href={path(lang, a.slug)} className="group flex h-full flex-col justify-between rounded-lg border border-line p-5 transition-colors hover:border-line-2 hover:bg-ink-2">
                  <span className="label text-muted">{a[lang].short}</span>
                  <span className="mt-4 text-xl font-light leading-8">{a[lang].q}</span>
                  <span className="mt-4 line-clamp-2 text-sm leading-6 text-stone-2">{a[lang].tldr}</span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand cta={u.cta} text={lang === "he" ? "ספרו לנו מה לא עובד. אנחנו נתחיל משם." : "Tell us what's not working. We'll start there."} />
    </div>
  );
}

export const answerSlugs = () => answers.map((a) => ({ slug: a.slug }));
