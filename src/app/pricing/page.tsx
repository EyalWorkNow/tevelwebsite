import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import Logos from "@/components/Logos";
import { Button, CtaBand, Eyebrow, Reveal } from "@/components/ui";
import { names, slugs } from "@/lib/site";

export const metadata: Metadata = { title: "איך עובדים" };

/* ---------- building blocks (measured from the reference: pricing_card / cardHeader / cardBody) ---------- */
function Card({ children, as: Tag = "div" }: { children: ReactNode; as?: "div" | "section" }) {
  return <Tag className="overflow-hidden rounded-xl border border-line bg-ink-2">{children}</Tag>;
}

function CardHeader({ heading, cta }: { heading: string; cta?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-x-3 gap-y-2 px-4 py-5 text-center md:flex-row md:justify-between md:text-start">
      <h3 className="text-base leading-6 md:text-[28px] md:leading-9">{heading}</h3>
      {cta && <Button variant="default" href="/contact" arrow className="shrink-0 bg-ink">בואו נדבר</Button>}
    </div>
  );
}

function StepHeader({ n, heading, fee }: { n: string; heading: string; fee?: ReactNode }) {
  return (
    <div className="flex flex-col gap-x-3 gap-y-2 px-3 py-4 md:flex-row md:items-center md:justify-between md:px-4 md:py-5">
      <h3 className="flex items-baseline gap-2 text-base leading-6 md:gap-3.5 md:text-[28px] md:leading-9">
        <span className="font-mono text-muted">{n}</span>
        {heading}
      </h3>
      {fee && <p className="text-[13px] leading-5 text-muted md:shrink-0 md:text-base">{fee}</p>}
    </div>
  );
}

function CardBody({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 border-t border-line p-4 md:p-5">{children}</div>;
}

function Lead({ strong, rest }: { strong: string; rest: string }) {
  return <p className="font-light leading-6 text-muted"><span className="text-paper">{strong}</span> {rest}</p>;
}

function Note() {
  return (
    <div className="mt-4 text-center text-[13px] leading-[18px] text-muted">
      <p><span>*</span> אין התחייבות; ההמלצה מבוססת על כדאיות אמיתית.</p>
      <p><Link href="/reports" className="text-paper underline decoration-paper/60 underline-offset-2 transition-[text-decoration-color] duration-150 hover:decoration-paper">שלוש רמות הפתרון</Link> שלנו.</p>
    </div>
  );
}

function SectionHead({ heading, lede }: { heading: string; lede: string }) {
  return (
    <Reveal className="grid gap-3 text-center md:gap-4">
      <h2 className="h2">{heading}</h2>
      <p className="mx-auto max-w-[560px] text-lg font-light leading-6 text-stone md:text-xl md:leading-7">{lede}</p>
    </Reveal>
  );
}

const tile = "grid place-items-center content-center rounded-lg border border-line bg-ink/40 px-3 text-center transition-colors duration-300 hover:border-line-2";

/* ---------- page ---------- */
export default function PricingPage() {
  // Four solution families (by index in site.ts) — each tile links to its solution page.
  const packages: [string, string, string][] = [0, 1, 2, 3].map((i) => [names.solutions[i], names.solutionsDesc[i], `/solutions/${slugs.solutions[i]}`]);
  const categories = ["Focused Fix", "Core Transformation", "Full Transformation"];

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line">
        <div className="wrap">
          <div className="inner flex flex-col items-center gap-6 py-16 text-center md:gap-8 md:py-[120px]">
            <Reveal><Eyebrow>איך עובדים</Eyebrow></Reveal>
            <Reveal delay={80}>
              <h1 className="max-w-[576px] font-serif text-[34px] font-light leading-[34px] tracking-[-0.05em] md:text-5xl md:leading-[48px]">
                מתחילים מהבעיה. <span className="text-stone">לא מהטכנולוגיה.</span>
              </h1>
            </Reveal>
            <Reveal delay={160}><p className="max-w-[616px] text-lg font-light leading-6 md:text-xl md:leading-7">לא צריך להגיע עם מפרט טכני. ספרו לנו מה לא עובד — נמפה את התהליכים, האנשים, המערכות והמידע, ורק אז נמליץ מה לבנות, מה לחבר ומה לא לעשות בכלל.</p></Reveal>
            <Reveal delay={240}><Button variant="default" href="/contact" arrow className="bg-ink">קבעו שיחת Discovery</Button></Reveal>
          </div>
        </div>
      </section>

      <Logos />

      {/* Business banking */}
      <section className="rule">
        <div className="wrap">
          <div className="grid gap-6 px-3 py-14 md:px-10 md:py-20">
            <SectionHead heading="שיחת Discovery" lede="השיחה הראשונה היא בלי עלות ובלי התחייבות — ומתחילה בבעיה, לא בפתרון" />
            <div className="mx-auto flex w-full max-w-[768px] flex-col gap-5">
              <Reveal>
                <Card>
                  <CardHeader heading="שיחת היכרות ראשונה" cta />
                  <CardBody>
                    <dl className="grid">
                      {[["מה מביאים לשיחה", "תיאור הבעיה"], ["מה יוצאים איתו", "כיוון ראשוני*"]].map(([k, v], i) => (
                        <div key={k} className={`flex justify-between gap-6 ${i ? "border-t border-line pt-4" : "pb-4"}`}>
                          <dt className="font-light leading-6 text-muted">{k}</dt>
                          <dd className="whitespace-nowrap leading-6">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </CardBody>
                </Card>
              </Reveal>
              <Note />
            </div>
          </div>
        </div>
      </section>

      {/* Platform banking */}
      <section className="rule">
        <div className="wrap">
          <div className="grid gap-6 px-3 py-14 md:px-10 md:py-20">
            <SectionHead heading="מהבעיה לפתרון" lede="שלושה שלבים, וכל אחד נבנה על מה שהתברר בקודם" />
            <div className="mx-auto flex w-full max-w-[768px] flex-col gap-5">
              <ol className="flex flex-col gap-5">
                <Reveal as="li">
                  <Card as="section">
                    <StepHeader n="01" heading="Discovery" fee={<>שיחה ראשונה, <span className="text-paper">ללא התחייבות</span></>} />
                    <CardBody><Lead strong="מבינים מה באמת לא עובד." rest="מדברים על העסק, הצוותים והכאבים היומיומיים — לפני שמדברים על טכנולוגיה." /></CardBody>
                  </Card>
                </Reveal>
                <Reveal as="li">
                  <Card as="section">
                    <StepHeader n="02" heading="מיפוי עסקי" />
                    <CardBody>
                      <Lead strong="ממפים אנשים, מערכות, מידע ותהליכים." rest="מזהים איפה העבודה נתקעת, מה נעשה ידנית ואיפה המידע מתפצל — ומתאימים את משפחת הפתרון:" />
                      <ul className="grid grid-cols-2 gap-2 md:grid-cols-4">
                        {packages.map(([v, sub, href]) => (
                          <li key={v} className={`${tile} h-[82px] md:h-[82px]`}>
                            <Link href={href} className="contents">
                              <span className="leading-6">{v}</span>
                              {sub && <span className="text-sm leading-6 text-muted">{sub}</span>}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </CardBody>
                  </Card>
                </Reveal>
                <Reveal as="li">
                  <Card as="section">
                    <StepHeader n="03" heading="פתרון והצעה" />
                    <CardBody>
                      <Lead strong="ממליצים על רמת הפתרון שמתאימה לכם." rest="לפעמים תיקון ממוקד מספיק, ולפעמים נדרש שינוי עמוק יותר. ההצעה מפרטת היקף, שלבים וסדר עדיפויות *" />
                      <ul className="grid gap-2 md:grid-cols-3">
                        {categories.map((c) => <li key={c} className={`${tile} h-[58px]`}>{c}</li>)}
                      </ul>
                    </CardBody>
                  </Card>
                </Reveal>
              </ol>
              <Reveal>
                <Card as="section"><CardHeader heading="מתעדפים לפי Impact, Cost, Complexity ו-Risk" cta /></Card>
              </Reveal>
              <Note />
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
