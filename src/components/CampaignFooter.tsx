import Link from "next/link";
import { company } from "@/lib/site";
import { TevelLogo } from "./icons";

export default function CampaignFooter() {
  return (
    <footer className="rule">
      <div className="wrap">
        <div className="inner flex flex-col gap-5 py-8 md:flex-row md:items-center md:justify-between">
          <Link href="/" aria-label="תבל — דף הבית" className="self-start">
            <TevelLogo className="h-7 w-auto" />
          </Link>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-stone">
            <a href={`tel:${company.phoneE164}`} dir="ltr" className="inline-flex min-h-11 items-center hover:text-paper">{company.phone}</a>
            <a href={`mailto:${company.email}`} className="inline-flex min-h-11 items-center hover:text-paper">{company.email}</a>
          </div>
          <nav aria-label="מידע משפטי" className="flex flex-wrap gap-x-5 text-xs text-muted">
            <Link href="/legal/privacy" className="inline-flex min-h-11 items-center hover:text-paper">פרטיות</Link>
            <Link href="/legal/cookies" className="inline-flex min-h-11 items-center hover:text-paper">עוגיות</Link>
            <Link href="/legal/accessibility" className="inline-flex min-h-11 items-center hover:text-paper">נגישות</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
