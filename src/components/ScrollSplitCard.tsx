"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import { Arrow, TevelLogo } from "./icons";
import styles from "./ScrollSplitCard.module.css";

export interface ScrollSplitCardItem {
  title: string;
  description: string;
  label: string;
  href: string;
  accent: string;
  preview: "system" | "workflow" | "assistant";
}

// Adapted from https://componentry.dev/docs/components/scroll-split-card.
// Native scroll tracking keeps the split / flip choreography without a motion dependency.
export default function ScrollSplitCard({ cards }: {
  cards: readonly [ScrollSplitCardItem, ScrollSplitCardItem, ScrollSplitCardItem];
}) {
  const regionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const region = regionRef.current;
    if (!region) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 767px)");
    const backs = region.querySelectorAll<HTMLElement>("[data-card-back]");
    let frame = 0;
    const clamp = (value: number) => Math.max(0, Math.min(1, value));
    const update = () => {
      frame = 0;
      const bounds = region.getBoundingClientRect();
      const stageHeight = region.firstElementChild?.getBoundingClientRect().height ?? window.innerHeight;
      const progress = clamp(-bounds.top / Math.max(1, bounds.height - stageHeight));
      const split = clamp(progress / 0.35);
      const flip = clamp((progress - 0.3) / 0.35);
      const open = clamp((progress - 0.66) / 0.22);
      const finish = clamp((progress - 0.9) / 0.1);
      const staticView = reducedMotion.matches || document.documentElement.classList.contains("a11y-no-motion");
      region.dataset.static = String(staticView);
      region.style.setProperty("--split", String(split));
      region.style.setProperty("--flip", String(flip));
      region.style.setProperty("--finish", String(finish));
      region.style.setProperty("--open", String(open));
      region.style.setProperty("--hint-opacity", String(1 - clamp(progress / 0.12)));
      // Only the revealed faces participate in keyboard navigation.
      backs.forEach((back) => {
        back.inert = !staticView && (mobile.matches ? open < 0.95 : flip < 0.5);
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new MutationObserver(schedule);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    const visibility = new IntersectionObserver(([entry]) => {
      region.dataset.active = String(entry.isIntersecting);
    });
    visibility.observe(region);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reducedMotion.addEventListener("change", schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reducedMotion.removeEventListener("change", schedule);
    };
  }, []);

  return (
    <div ref={regionRef} className={styles.region}>
      <div className={styles.stage}>
        <p className={styles.hint} aria-hidden="true">גוללים. מפרקים. מגלים מה אפשר לשנות. <span>↓</span></p>
        <div className={styles.cards}>
          {cards.map((card, index) => (
            <article key={card.href} className={styles.card} style={{ "--index": index, "--direction": index - 1, "--accent": card.accent } as CSSProperties}>
              <div className={styles.front} aria-hidden="true">
                <div className={styles.artwork} style={{ left: `${index * -100}%` }}>
                  <div className={styles.aurora} />
                  <div className={styles.grid} />
                  <div className={styles.orbit} />
                  <div className={styles.brand}><TevelLogo className={styles.logo} /><span>הטכנולוגיה שמחברת את העסק.</span></div>
                  <span className={styles.artworkLabel}>UNDERSTAND. BUILD. CONNECT.</span>
                </div>
              </div>
              <div className={styles.back} data-card-back>
                <div className={styles.cardTop}><span>{card.label}</span><span>0{index + 1}</span></div>
                <ProductPreview kind={card.preview} />
                <div className={styles.cardContent}>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                  <Link href={card.href}>לגלות את הפתרון <Arrow /></Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className={styles.ending}>פחות עבודה מסביב. יותר עסק שעובד.</p>
      </div>
    </div>
  );
}

function ProductPreview({ kind }: { kind: ScrollSplitCardItem["preview"] }) {
  return (
    <div className={styles.preview} aria-hidden="true" dir="ltr">
      <div className={styles.previewBar}><i /><i /><i /><span>TEVEL / {kind === "system" ? "WORKSPACE" : kind === "workflow" ? "WORKFLOWS" : "INTELLIGENCE"}</span></div>
      {kind === "system" ? (
        <div className={styles.workspace}>
          <div className={styles.sidebar}><b /><b /><b /></div>
          <div className={styles.workspaceBody}><div className={styles.metrics}><i /><i /><i /></div><div className={styles.chart}>{[32, 55, 42, 72, 62, 94, 82].map((height, i) => <i key={i} style={{ height: `${height}%` }} />)}</div></div>
        </div>
      ) : kind === "workflow" ? (
        <div className={styles.workflow}><span>01<br /><b>TRIGGER</b></span><i /><span>02<br /><b>ACTION</b></span><i /><span>✓<br /><b>DONE</b></span></div>
      ) : (
        <div className={styles.assistant}><div><span>✦</span><i /><i /></div><p><i /><i /><i /></p><span className={styles.approved}>✓ CONNECTED TO YOUR KNOWLEDGE</span></div>
      )}
    </div>
  );
}
