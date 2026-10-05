import { seo } from "@/lib/seo";
import Hero from "@/components/Hero";
import Logos from "@/components/Logos";
import Platform from "@/components/Platform";
import Solutions from "@/components/Solutions";
import Products from "@/components/Products";
import Stories from "@/components/Stories";
import Developers from "@/components/Developers";
import Speed from "@/components/Speed";
import { CtaBand } from "@/components/ui";

export const metadata = seo("/");

export default function Home() {
  return (
    <>
      <Hero />
      <Logos />
      <Platform />
      <Solutions />
      <Products />
      <Stories />
      <Developers />
      <Speed />
      <CtaBand />
    </>
  );
}
