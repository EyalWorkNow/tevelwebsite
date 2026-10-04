import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Logos from "@/components/Logos";
import Platform from "@/components/Platform";
import Solutions from "@/components/Solutions";
import Products from "@/components/Products";
import Stories from "@/components/Stories";
import Developers from "@/components/Developers";
import Speed from "@/components/Speed";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Logos />
        <Platform />
        <Solutions />
        <Products />
        <Stories />
        <Developers />
        <Speed />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
