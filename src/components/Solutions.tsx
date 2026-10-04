"use client";
import { useState } from "react";
import { IconBox } from "./icons";

const items = [
  { t: "Marketplaces", d: "Give every seller on your platform negotiated rates and a label in one call.", f: ["Multi-carrier rating", "Split shipments", "Seller-level billing"] },
  { t: "D2C brands", d: "Branded tracking pages and returns that keep shoppers in your store.", f: ["Branded tracking", "Self-serve returns", "Delivery promises"] },
  { t: "3PLs and warehouses", d: "Route each order to the cheapest compliant lane, automatically.", f: ["Rules engine", "Batch labels", "Dock scheduling"] },
  { t: "Cross-border trade", d: "Duties, taxes and customs documents calculated before checkout.", f: ["Landed cost", "Commercial invoices", "HS code lookup"] },
  { t: "Freight forwarders", d: "Digitise quotes and bookings without rebuilding your TMS.", f: ["Instant quotes", "Booking API", "Milestone webhooks"] },
  { t: "Fleet and last mile", d: "Dispatch your own drivers alongside partner carriers.", f: ["Driver app", "Proof of delivery", "Live ETAs"] },
];

const events = [
  ["ORD-88412", "Picked up", "Rotterdam", "+2h"],
  ["ORD-88409", "In transit", "Hamburg", "+6h"],
  ["ORD-88397", "Customs cleared", "Antwerp", "+1d"],
  ["ORD-88381", "Delivered", "Lyon", "done"],
];

export default function Solutions() {
  const [open, setOpen] = useState(0);
  const [mode, setMode] = useState<"ui" | "api">("ui");

  return (
    <section className="rule">
      <div className="wrap">
        <div className="inner grid gap-10 py-14 md:grid-cols-2 md:gap-6 md:py-0">
          <div className="md:py-[72px]">
            <h2 className="h2">Made for how you ship</h2>
            <div className="mt-10">
              {items.map((it, i) => (
                <div key={it.t} className={i ? "border-t border-line" : ""}>
                  <button
                    onClick={() => setOpen(i)}
                    aria-expanded={open === i}
                    className={`w-full py-4 text-left font-serif font-light transition-all duration-300 ${open === i ? "text-[32px] leading-10 tracking-[-0.05em] text-paper" : "text-xl leading-7 tracking-[-0.02em] text-stone-2 hover:text-paper"}`}
                  >
                    {it.t}
                  </button>
                  <div className={`grid transition-all duration-500 ${open === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden">
                      <p className="max-w-[478px] leading-6">{it.d}</p>
                      <ul className="mt-5 space-y-3 text-sm">
                        {it.f.map((f) => <li key={f} className="flex items-center gap-3"><IconBox width={16} height={16} className="text-muted" />{f}</li>)}
                      </ul>
                      <a href="#" className="label mt-6 mb-6 inline-flex rounded-full border border-line-2 px-3.5 py-2 transition-colors hover:border-stone">Learn more</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual: generated dusk gradient instead of a photo */}
          <div className="relative grid min-h-[560px] place-items-center overflow-hidden md:-mr-10"
            style={{ background: "radial-gradient(120% 80% at 70% 30%, #e26d4f 0%, #6b2f46 30%, #1c2a4a 60%, #0d1424 100%)" }}>
            <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: "repeating-linear-gradient(0deg,#fff 0 1px,transparent 1px 4px)" }} />
            <div className="relative w-[360px] max-w-[88%] rounded-lg border border-line bg-ink/90 p-4 font-mono text-xs shadow-2xl backdrop-blur">
              {mode === "ui" ? (
                <>
                  <div className="flex justify-between">
                    <div><div className="text-paper">ACME OUTDOOR</div><div className="text-muted">ACCOUNT #2207</div></div>
                    <div className="text-mint">LIVE SHIPMENTS</div>
                  </div>
                  <div className="mt-4 font-sans text-muted">In transit this week</div>
                  <div className="mt-2 text-right text-3xl text-paper">1,284</div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {[["Carriers", "14"], ["On time", "97.2%"], ["Avg. cost", "€6.40"], ["Lanes", "EU / UK"]].map(([a, b]) => (
                      <div key={a} className="flex justify-between rounded border border-line px-2 py-2"><span className="font-sans text-muted">{a}</span><span>{b}</span></div>
                    ))}
                  </div>
                  <div className="mt-4 font-sans text-muted">Recent events</div>
                  {events.map(([id, s, c, t]) => (
                    <div key={id} className="mt-2 flex justify-between font-sans">
                      <span>{id} <span className="text-muted">{s}</span></span>
                      <span className={t === "done" ? "text-mint" : "text-stone"}>{c}</span>
                    </div>
                  ))}
                </>
              ) : (
                <pre className="overflow-x-auto leading-5 text-stone">{`GET /v1/shipments?status=in_transit

{
  "count": 1284,
  "on_time_rate": 0.972,
  "data": [
    { "id": "ORD-88412",
      "status": "picked_up",
      "location": "Rotterdam" }
  ]
}`}</pre>
              )}
            </div>
            <div className="absolute bottom-8 flex items-center gap-2 rounded-full border border-line bg-ink/90 px-2 py-1 font-mono text-[10px]">
              <span className={mode === "ui" ? "text-paper" : "text-muted"}>UI</span>
              <button onClick={() => setMode(mode === "ui" ? "api" : "ui")} aria-label="Toggle UI or API view" className="relative h-4 w-8 rounded-full bg-line">
                <span className={`absolute top-0.5 size-3 rounded-full bg-paper transition-all duration-300 ${mode === "ui" ? "left-0.5" : "left-[18px]"}`} />
              </button>
              <span className={mode === "api" ? "text-paper" : "text-muted"}>API</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
