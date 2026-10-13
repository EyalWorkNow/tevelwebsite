import type { Metadata } from "next";
import { mailbox, openPackage } from "@/lib/relay/mailbox";
import { TevelLogo } from "@/components/icons";
import SignClient, { type SignModel } from "./SignClient";
import "../sign.css";

// The customer's page for a quote, invoice or document sent from the Tevel CRM (cloud mailbox,
// docs: ~/tevel-crm/docs/tevel/public-links-he.md). Never indexed, never cached, no tracking.
export const metadata: Metadata = {
  title: { absolute: "מסמך לצפייה וחתימה" },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  referrer: "no-referrer",
};

const Notice = ({ title, text }: { title: string; text: string }) => (
  <div className="sign-root"><div className="sign-wrap"><div className="sign-brand"><TevelLogo className="h-7 w-auto" /></div><section className="sign-card sign-notice" role="status"><h1>{title}</h1><p>{text}</p></section></div></div>
);

export default async function SignPage({ params }: PageProps<"/sign/[token]">) {
  const { token } = await params;
  const box = mailbox();
  if (!box) return <Notice title="השירות לא זמין כרגע" text="אפשר לנסות שוב מאוחר יותר או לפנות לעסק ששלח את הקישור." />;
  const opened = await openPackage(box, token).catch(() => null);
  if (!opened) return <Notice title="תקלה זמנית" text="אפשר לנסות שוב בעוד רגע." />;
  if (!opened.ok) return <Notice title="המסמך לא זמין" text={opened.message} />;
  const { manifest, action, signed, expired } = opened;
  if (expired && !action) return <Notice title="תוקף הקישור פג" text="אפשר לבקש מהעסק קישור חדש." />;
  const state: SignModel["state"] = action?.type === "signed" ? "SIGNED" : action?.type === "declined" ? "DECLINED" : !manifest.doc ? "PREPARING" : manifest.mode === "VIEW" ? "VIEW" : "SIGN";
  const model: SignModel = {
    state, title: manifest.title, number: manifest.number, kindLabel: manifest.kindLabel, business: manifest.business, signerName: action?.signerName || manifest.signerName,
    consentText: manifest.consentText, contentHash: manifest.contentHash, expiresAt: manifest.expiresAt, commercial: manifest.commercial, fields: manifest.fields,
    values: manifest.values, docName: manifest.doc?.fileName ?? "", signedCopy: Boolean(signed), actionAt: action?.at ?? null,
  };
  return <SignClient token={token} model={model} />;
}
