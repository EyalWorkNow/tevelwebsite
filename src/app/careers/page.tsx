import { seo } from "@/lib/seo";
import type { Metadata } from "next";
import { Benefits, Callout, CareersCta, CareersHero, Intro, OpenRoles, PhotoMarquee, Remote, Testimonial, Together, Values } from "@/components/pages/careers/Careers";

export const metadata: Metadata = seo("/careers");

export default function CareersPage() {
  return (
    <>
      <CareersHero />
      <PhotoMarquee />
      <Intro />
      <Remote />
      <Values />
      <Callout />
      <Benefits />
      <Testimonial />
      <Together />
      <OpenRoles />
      <CareersCta />
    </>
  );
}
