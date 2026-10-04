import { Arrow } from "./icons";

export default function Cta() {
  return (
    <section className="wrap">
      <div className="inner flex flex-col items-center py-24 text-center md:py-[120px]">
        <p className="max-w-[360px] font-serif text-[32px] font-light leading-9 tracking-[-0.04em] md:text-[36px] md:leading-10">
          Quote, ship and track every parcel from one calm place.
        </p>
        <a href="#" className="btn-light mt-8">Talk to us <Arrow /></a>
      </div>
    </section>
  );
}
