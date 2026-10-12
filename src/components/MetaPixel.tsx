"use client";
import Script from "next/script";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { META_PIXEL_ID, captureAttribution, readConsent, writeConsent, type Consent } from "@/lib/tracking";

const CONSENT_EVENT = "tevel-consent";
const subscribe = (onChange: () => void) => {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => { window.removeEventListener(CONSENT_EVENT, onChange); window.removeEventListener("storage", onChange); };
};

// Meta Pixel, loaded only after the visitor agrees (opt-in). PageView on load and on every client-side navigation.
export default function MetaPixel() {
  // "unknown" on the server and during hydration, so the banner never flashes for visitors who already chose.
  const consent = useSyncExternalStore<Consent | "unknown">(subscribe, readConsent, () => "unknown");
  const pathname = usePathname();
  const firstPath = useRef<string | null>(null);

  useEffect(() => { captureAttribution(); }, []);

  useEffect(() => {
    if (consent !== "granted") return;
    if (firstPath.current === null) { firstPath.current = pathname; return; }
    window.fbq?.("track", "PageView");
  }, [pathname, consent]);

  const choose = (value: "granted" | "denied") => { writeConsent(value); window.dispatchEvent(new Event(CONSENT_EVENT)); };

  return (
    <>
      {consent === "granted" && (
        <Script id="meta-pixel" strategy="afterInteractive">{`
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}</Script>
      )}
      {consent === null && (
        <div role="region" aria-label="הסכמה לעוגיות" className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl rounded-lg border border-line-2 bg-ink-2 p-4 text-sm text-paper shadow-lg sm:flex sm:items-center sm:gap-4">
          <p className="text-stone">
            נשמח למדוד את הפרסום שלנו בעזרת Meta Pixel (עוגיות של Meta). אפשר לסרב, והאתר יעבוד בדיוק אותו דבר.{" "}
            <Link href="/legal/cookies" className="underline">מדיניות עוגיות</Link>
          </p>
          <div className="mt-3 flex shrink-0 gap-2 sm:mt-0">
            <button type="button" onClick={() => choose("granted")} className="btn-light">אישור</button>
            <button type="button" onClick={() => choose("denied")} className="btn-dark">לא, תודה</button>
          </div>
        </div>
      )}
    </>
  );
}
