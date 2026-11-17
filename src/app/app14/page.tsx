import { LeadForm } from "@/components/LeadForm";
import { Arrow, ArrowUpRight, Check, Glyph } from "@/components/icons";
import { HeatmapLogo } from "@/components/ui/heatmap-logo";
import StarBorder from "@/components/reactbits/StarBorder";
import { company } from "@/lib/site";
import { seo } from "@/lib/seo";
import SpotlightCard from "./SpotlightCard";
import styles from "./app14.module.css";

export const metadata = seo("/app14", {
  title: "פיתוח אפליקציית מובייל החל מ־14,000 ₪",
  description:
    "אפיון, עיצוב ופיתוח אפליקציית מובייל מקצה לקצה. כולל מיתוג בסיסי ו־CRM ל־3 חודשים בחינם. קבלו הצעה לפיתוח האפליקציה שלכם עם תבל, החל מ־14,000 ₪.",
});

const features = [
  {
    number: "01",
    title: "אפיון",
    text: "מגדירים מה האפליקציה תעשה ולמי היא מיועדת.",
    visual: "wireframe",
  },
  {
    number: "02",
    title: "עיצוב",
    text: "מעצבים מסכים ברורים ונוחים לשימוש.",
    visual: "design",
  },
  {
    number: "03",
    title: "פיתוח",
    text: "בונים את האפליקציה, מחברים את המערכות ובודקים שהכל עובד.",
    visual: "code",
  },
];

function CampaignCta({
  children = "קבלו הצעה לאפליקציה שלכם",
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <StarBorder
      as="a"
      href="#app14-contact"
      className={`${styles.primaryButton} ${className}`}
      color="#a4ffd9"
      trailColor="#ffffff"
      backgroundColor="#02bd8f"
      textColor="#071b14"
      radius={9.6}
      duration={5}
      sparkle={false}
      glow={0.4}
    >
      {children}
      <span className={styles.ctaArrow}>
        <Arrow width={19} height={19} />
      </span>
    </StarBorder>
  );
}

const questions = [
  [
    "מה כלול במחיר?",
    "אפיון, עיצוב ופיתוח לפי היקף מוסכם, מיתוג בסיסי ו־3 חודשי CRM בחינם. המחיר מתחיל ב־14,000 ₪; ההצעה הסופית תכלול את היקף העבודה, תנאי התשלום והמע״מ.",
  ],
  [
    "גם לאייפון וגם לאנדרואיד?",
    "אפשר לתכנן פיתוח לאחת הפלטפורמות או לשתיהן. נסכם מה מתאים לכם במסגרת ההצעה.",
  ],
  [
    "כמה זמן זה לוקח?",
    "תלוי במסכים וביכולות שצריך לפתח. אחרי שנכיר את הרעיון, נגדיר לוח זמנים.",
  ],
  [
    "יש עלויות נוספות?",
    "אחסון, שירותים חיצוניים, חשבונות מפתח ותחזוקה עשויים לדרוש תשלום נוסף. הכל יפורט בהצעה, כולל המשך השימוש ב־CRM אחרי שלושת החודשים.",
  ],
];

function FeatureVisual({ kind }: { kind: string }) {
  if (kind === "wireframe")
    return (
      <div className={styles.wireframe} aria-hidden="true">
        <span />
        <div>
          <i />
          <i />
        </div>
        <b />
        <b />
        <b />
        <em />
      </div>
    );
  if (kind === "design")
    return (
      <div className={styles.designPreview} aria-hidden="true">
        <span>אבג</span>
        <div>
          <i />
          <i />
          <i />
        </div>
        <small>ממשק שמדבר בשפה שלכם</small>
      </div>
    );
  return (
    <div className={styles.systemPreview} aria-hidden="true">
      <div>
        <Glyph name="frame" />
        <span>האפליקציה שלכם</span>
      </div>
      <span className={styles.systemConnection} />
      <div>
        <Glyph name="people" />
        <span>המידע והלקוחות</span>
      </div>
      <small>
        <Check /> כל החלקים מתחברים.
      </small>
    </div>
  );
}

export default function MobileAppCampaignPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="app14-title">
        <div className={`${styles.container} ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <div className={styles.eyebrow}>
              <span /> תבל / פיתוח אפליקציות מובייל
            </div>
            <h1 id="app14-title">
              מפתחים את
              <br />
              <span>האפליקציה שלכם.</span>
            </h1>
            <p className={styles.heroDescription}>
              אפיון, עיצוב ופיתוח. הכל עם צוות אחד.
            </p>
            <div className={styles.heroOffer}>
              <div className={styles.priceLine}>
                <span>החל מ־</span>
                <strong dir="ltr">
                  14,000<small> ₪</small>
                </strong>
              </div>
              <div className={styles.heroBonus}>
                <span>
                  <Check />
                  מיתוג בסיסי כלול
                </span>
                <span>
                  <Check />
                  CRM ל־3 חודשים בחינם
                </span>
              </div>
            </div>
            <CampaignCta />
            <p className={styles.heroNote}>מתחילים בשיחת היכרות.</p>
            <a href="#app14-package" className={styles.textLink}>
              כל מה שכלול בחבילה <span>↓</span>
            </a>
          </div>
          <div className={styles.logoStage}>
            <HeatmapLogo
              image="/brand/tevel-logo-heatmap.svg"
              fallbackImage="/brand/tevel-logo.svg"
              background="#0c0c0b"
              glow={0.15}
              label="TEVEL תבל"
              className={styles.heroLogo}
            />
          </div>
        </div>
      </section>

      <section
        id="app14-package"
        className={`${styles.container} ${styles.section}`}
        aria-labelledby="package-title"
      >
        <div className={styles.sectionHeading}>
          <h2 id="package-title">מה כלול בחבילה?</h2>
        </div>
        <div className={styles.featureGrid}>
          {features.map((feature) => (
            <SpotlightCard key={feature.number} className={styles.featureCard}>
              <div className={styles.cardTop}>
                <small>{feature.number}</small>
              </div>
              <FeatureVisual kind={feature.visual} />
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </SpotlightCard>
          ))}
        </div>
        <div className={styles.bonusGrid}>
          <SpotlightCard className={styles.crmCard}>
            <div className={styles.bonusCopy}>
              <h3>3 חודשי CRM בחינם.</h3>
              <p>לניהול הלקוחות שלכם, כבר מההתחלה.</p>
            </div>
            <div className={styles.crmVisual} aria-hidden="true">
              <div className={styles.crmWindowBar}>
                <i />
                <i />
                <i />
              </div>
              <div className={styles.crmWindowTitle}>
                <strong>הלקוחות שלי</strong>
                <span>TEVEL CRM</span>
              </div>
              {["לקוח חדש", "בתהליך", "יוצאים לדרך"].map((label, index) => (
                <div className={styles.crmRow} key={label}>
                  <span className={styles.crmAvatar}>
                    {["א", "נ", "ד"][index]}
                  </span>
                  <div>
                    <span />
                    <span />
                  </div>
                  <small>{label}</small>
                </div>
              ))}
              <div className={styles.freeLabel}>
                <Check />3 חודשים בחינם
              </div>
            </div>
          </SpotlightCard>
          <SpotlightCard className={styles.brandCard}>
            <div className={styles.brandArt} aria-hidden="true">
              <strong>א.</strong>
              <span>המותג שלכם.</span>
              <div>
                <i />
                <i />
                <i />
              </div>
            </div>
            <h3>מיתוג בסיסי כלול.</h3>
            <p>שפה ויזואלית ראשונית לאפליקציה שלכם.</p>
          </SpotlightCard>
        </div>
      </section>

      <section
        className={`${styles.container} ${styles.section} ${styles.faqSection}`}
        aria-labelledby="faq-title"
      >
        <div>
          <h2 id="faq-title">עוד כמה דברים שכדאי לדעת.</h2>
        </div>
        <div className={styles.faqList}>
          {questions.map(([question, answer]) => (
            <details key={question}>
              <summary>
                {question}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section
        id="app14-contact"
        className={styles.contactSection}
        aria-labelledby="contact-title"
      >
        <div className={`${styles.container} ${styles.contactGrid}`}>
          <div>
            <h2 id="contact-title">מה תרצו לבנות?</h2>
            <p className={styles.contactDescription}>
              ספרו לנו בקצרה על הרעיון. נחזור אליכם לשיחת היכרות.
            </p>

            <a
              href={`tel:${company.phoneE164}`}
              className={styles.contactPhone}
            >
              מעדיפים לדבר? <b dir="ltr">{company.phone}</b>
              <ArrowUpRight />
            </a>
          </div>
          <div className={styles.formPanel}>
            <LeadForm source="app14" campaign mobileApp />
          </div>
        </div>
      </section>
      <div className={styles.mobileCta}>
        <span>
          פיתוח אפליקציות<strong>החל מ־14,000 ₪</strong>
        </span>
        <a href="#app14-contact" className={styles.stickyButton}>
          קבלו הצעה <Arrow width={17} height={17} />
        </a>
      </div>
    </div>
  );
}
