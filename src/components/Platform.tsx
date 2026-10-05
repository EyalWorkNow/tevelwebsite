"use client";
import { useEffect, useRef, useState } from "react";

const steps = [
  { tag: "BUILD", title: "אנחנו בונים תוכנה", body: "מערכות מידע, CRM ו-ERP, Back Office, Web Apps ואפליקציות מובייל.", color: "var(--color-teal)", notes: [["Business Systems", -150, -250, -40, -95], ["CRM / ERP", 175, -205, 75, -60]] },
  { tag: "INTELLIGENCE", title: "מחברים ומוסיפים חוכמה", body: "AI, אוטומציות, אינטגרציות ומערכי שירות לקוחות מבוססי AI.", color: "var(--color-brand)", notes: [["AI Layer", -175, -150, -60, -20], ["Automations", 185, -110, 70, 10]] },
  { tag: "TRANSFORM", title: "מבינים מה צריך להשתנות", body: "מיפוי העסק, ניתוח תהליכים ו-Technology Roadmap לפני שכותבים קוד.", color: "var(--color-amber)", notes: [["Mapping", -180, -60, -70, 40], ["Roadmap", 180, -20, 80, 60]] },
  { tag: "INVENT", title: "R&D כשאין פתרון מוכן", body: "מחקר, היתכנות, PoC ואבות-טיפוס — עד מוצר שאפשר להפעיל.", color: "var(--color-violet)", notes: [["PoC", -175, 40, -60, 140], ["Prototype", 170, 80, 70, 160]] },
] as const;

const S = 150; // half-size of each plate in flat coords
const ISO = "matrix(0.707 0.409 -0.707 0.409 0 0)"; // rotate 45° + squash = isometric

/** Flat artwork per plate, drawn in a -S..S square then projected. */
function Pedestal({ on, color }: { on: boolean; color: string }) {
  const stroke = on ? color : "#45423f";
  return (
    <g>
      {/* Front-left face */}
      <polygon
        points="-42.4,0 56.6,57.3 56.6,25.3 -42.4,-32"
        fill="#121110"
        stroke={stroke}
        strokeWidth={1}
      />
      {/* Text on front-left face: TEVEL+ PLATFORM */}
      <g transform="translate(-24, 13) skewY(26.5)">
        <text
          fill={on ? "#f9f5ef" : "#78716c"}
          fontSize="9.5"
          fontFamily="var(--font-mono)"
          letterSpacing="0.1em"
          fontWeight="bold"
        >
          TEVEL+ PLATFORM
        </text>
      </g>
      {/* Front-right face */}
      <polygon
        points="56.6,57.3 155.5,0 155.5,-32 56.6,25.3"
        fill="#181716"
        stroke={stroke}
        strokeWidth={1}
      />
      {/* Top face */}
      <polygon
        points="56.6,-89.3 155.5,-32 56.6,25.3 -42.4,-32"
        fill="#21201f"
        stroke={stroke}
        strokeWidth={1.2}
      />
      {/* Tevel emblem in center of top face */}
      <g transform="translate(56.6, -32) scale(0.016) translate(-1596, -1558)" fill={on ? color : "#807b74"}>
        <path d="M1536.35 1985.43C1545.48 1966.77 1572.32 1967.47 1580.45 1986.59L1618.08 2075.01C1619.53 2078.43 1621.75 2081.47 1624.57 2083.89L1859.74 2286.32L1858.02 2286.44C1862.81 2290.87 1865.81 2297.2 1865.81 2304.24V2904.82C1865.81 3022 1770.81 3116.99 1653.63 3116.99H1541.98C1424.8 3116.99 1329.81 3022 1329.81 2904.82V2322.66L1329.31 2322.7V2239.18C1329.31 2232.51 1332.05 2226.14 1336.9 2221.55L1489.78 2077.17C1491.9 2075.17 1493.64 2072.81 1494.92 2070.19L1536.35 1985.43Z" />
        <path d="M1034.84 1773.82C1079.77 1731.3 1141.73 1711.73 1202.93 1720.73C1217.6 1722.89 1232.46 1723.43 1247.24 1722.33L1332.35 1716.01C1397.85 1711.14 1450.81 1768.55 1440.68 1833.45L1437.37 1854.67C1434.8 1871.15 1434.18 1887.88 1435.53 1904.51L1437.8 1932.45C1442.99 1996.34 1418.99 2059.15 1372.52 2103.3L762.416 2682.95C677.947 2763.2 544.546 2760.24 463.712 2676.33L429.684 2641.01C347.946 2556.16 351.071 2420.94 436.643 2339.95L1034.84 1773.82Z" />
        <path d="M1034.84 1426.86C1079.77 1469.39 1141.73 1488.96 1202.93 1479.95C1217.6 1477.8 1232.46 1477.26 1247.24 1478.36L1332.35 1484.68C1397.85 1489.55 1450.81 1432.14 1440.68 1367.24L1437.37 1346.02C1434.8 1329.54 1434.18 1312.81 1435.53 1296.18L1437.8 1268.24C1442.99 1204.35 1418.99 1141.54 1372.52 1097.39L762.416 517.742C677.947 437.49 544.546 440.444 463.712 524.356L429.684 559.68C347.946 644.532 351.071 779.752 436.643 860.737L1034.84 1426.86Z" />
        <path d="M2074.55 1773.82C2029.61 1731.3 1967.66 1711.73 1906.46 1720.73C1891.79 1722.89 1876.93 1723.43 1862.14 1722.33L1777.04 1716.01C1711.54 1711.14 1658.58 1768.55 1668.71 1833.45L1672.02 1854.67C1674.59 1871.15 1675.21 1887.88 1673.86 1904.51L1671.59 1932.45C1666.4 1996.34 1690.4 2059.15 1736.87 2103.3L2346.97 2682.95C2431.44 2763.2 2564.84 2760.24 2645.67 2676.33L2679.7 2641.01C2761.44 2556.16 2758.32 2420.94 2672.74 2339.95L2074.55 1773.82Z" />
        <path d="M2074.55 1426.86C2029.61 1469.39 1967.66 1488.96 1906.46 1479.95C1891.79 1477.8 1876.93 1477.26 1862.14 1478.36L1777.04 1484.68C1711.54 1489.55 1658.58 1432.14 1668.71 1367.24L1672.02 1346.02C1674.59 1329.54 1675.21 1312.81 1673.86 1296.18L1671.59 1268.24C1666.4 1204.35 1690.4 1141.54 1736.87 1097.39L2346.97 517.742C2431.44 437.49 2564.84 440.444 2645.67 524.356L2679.7 559.68C2761.44 644.532 2758.32 779.752 2672.74 860.737L2074.55 1426.86Z" />
        <path d="M1917.9 1615.21C1896.34 1606.1 1898.92 1574.75 1921.68 1569.29L2059.86 1536.16C2064.41 1535.07 2068.55 1532.69 2071.78 1529.29L2279.01 1311.39L2279.08 1312.39C2283.47 1308.02 2289.51 1305.33 2296.19 1305.33L2979.26 1305.33C3096.44 1305.33 3191.43 1400.32 3191.43 1517.5L3191.43 1629.15C3191.43 1746.33 3096.44 1841.33 2979.26 1841.33L2315.35 1841.33L2315.39 1841.83L2231.87 1841.83C2225.2 1841.83 2218.83 1839.08 2214.25 1834.23L2070.33 1681.85C2068.03 1679.41 2065.24 1677.47 2062.14 1676.17L1917.9 1615.21Z" />
        <path d="M1536.54 1231.25C1545.66 1249.91 1572.5 1249.21 1580.63 1230.09L1618.26 1141.67C1619.72 1138.25 1621.94 1135.21 1624.75 1132.79L1855.29 934.358C1856.87 933.293 1858.31 932.045 1859.6 930.647L1859.93 930.362L1859.86 930.358C1863.67 926.074 1865.99 920.429 1865.99 914.241V212.176C1865.99 94.9946 1771 3.83824e-05 1653.82 3.83824e-05H1542.17C1424.99 3.83824e-05 1329.99 94.9946 1329.99 212.176V894.024L1329.49 893.989V977.501C1329.49 984.172 1332.24 990.549 1337.09 995.13L1489.97 1139.51C1492.08 1141.51 1493.82 1143.88 1495.1 1146.49L1536.54 1231.25Z" />
        <path d="M1206.04 1617.05C1229.84 1610.98 1230.56 1577.43 1207.04 1570.34L1077.72 1531.37C1073.63 1530.14 1069.94 1527.85 1067.02 1524.74L863.856 1307.99L863.108 1318.9C859.197 1310.76 850.874 1305.14 841.238 1305.14L212.169 1305.16C94.9908 1305.17 0.000425819 1400.16 0.000430941 1517.34L0.000435821 1628.99C0.000440944 1746.17 94.9992 1841.17 212.183 1841.16L841.24 1841.14C845.261 1841.14 849.054 1840.16 852.393 1838.43L910.165 1838.43C917.318 1838.43 924.105 1835.27 928.712 1829.8L1075.97 1654.94C1079.23 1651.07 1083.62 1648.32 1088.52 1647.07L1206.04 1617.05Z" />
      </g>
    </g>
  );
}

/** Flat artwork per plate, drawn in a -S..S square then projected. */
function Art({ i, on }: { i: number; on: boolean }) {
  const fg = on ? "#f9f5ef" : "#5a5651";

  if (i === 0) {
    return (
      <>
        {/* Recessed tray inner floor */}
        <rect x={-S + 16} y={-S + 16} width={268} height={268} fill="#11100f" stroke="#2c2a28" strokeWidth={1.5} />
        {/* Top 3 partitioned module cards */}
        <rect x={-S + 28} y={-S + 28} width={72} height={52} fill="#191817" stroke="#363432" strokeWidth={1} rx={2} />
        <rect x={-S + 106} y={-S + 28} width={72} height={52} fill="#191817" stroke="#363432" strokeWidth={1} rx={2} />
        <rect x={-S + 184} y={-S + 28} width={88} height={52} fill="#191817" stroke="#363432" strokeWidth={1} rx={2} />
        {/* Right main canvas panel */}
        <rect x={-S + 124} y={-S + 90} width={148} height={180} fill="#191817" stroke="#363432" strokeWidth={1} rx={2} />
        <rect x={-S + 136} y={-S + 104} width={124} height={20} fill="#242220" rx={2} />
        <rect x={-S + 136} y={-S + 134} width={85} height={7} rx={3.5} fill="#2e2c29" />
        <rect x={-S + 136} y={-S + 150} width={105} height={7} rx={3.5} fill="#2e2c29" />
        <rect x={-S + 136} y={-S + 166} width={65} height={7} rx={3.5} fill="#2e2c29" />
        {/* Front-left diagonal hatching slat grille */}
        <rect x={-S + 28} y={-S + 90} width={86} height={180} fill="#141312" stroke="#2a2927" strokeWidth={1} rx={2} />
        {Array.from({ length: 12 }, (_, k) => (
          <line
            key={k}
            x1={-S + 26 + k * 8}
            y1={-S + 90}
            x2={-S + 46 + k * 8}
            y2={-S + 270}
            stroke={on ? "#3ad4c4" : "#45423f"}
            strokeWidth={1.5}
            opacity={on ? 0.75 : 0.35}
          />
        ))}
      </>
    );
  }

  if (i === 1) {
    return (
      <>
        {/* Monospace label RUN:API */}
        <text
          x={-S + 26}
          y={-S + 42}
          fill={on ? "#3ad4c4" : "#78716c"}
          fontSize={11}
          fontFamily="var(--font-mono)"
          letterSpacing="0.12em"
          fontWeight="bold"
        >
          RUN:API
        </text>
        {/* Thick pill code bars with rounded ends */}
        <rect x={-S + 26} y={-S + 60} width={248} height={10} rx={5} fill={fg} />
        <rect x={-S + 26} y={-S + 80} width={170} height={10} rx={5} fill={fg} />
        <rect x={-S + 26} y={-S + 100} width={215} height={10} rx={5} fill={fg} />
        <rect x={-S + 52} y={-S + 120} width={145} height={10} rx={5} fill={fg} />
        <rect x={-S + 78} y={-S + 140} width={196} height={10} rx={5} fill={fg} />
        <rect x={-S + 78} y={-S + 160} width={155} height={10} rx={5} fill={fg} />
        <rect x={-S + 52} y={-S + 180} width={222} height={10} rx={5} fill={fg} />
        <rect x={-S + 26} y={-S + 200} width={125} height={10} rx={5} fill={fg} />
        <rect x={-S + 26} y={-S + 220} width={95} height={10} rx={5} fill={fg} />
        <rect x={-S + 26} y={-S + 240} width={145} height={10} rx={5} fill={fg} />
        <rect x={-S + 26} y={-S + 260} width={75} height={10} rx={5} fill={fg} />
      </>
    );
  }

  if (i === 2) {
    return (
      <>
        {/* Subtle grid pattern on base slab */}
        <rect x={-S + 18} y={-S + 18} width={264} height={264} fill="#141312" stroke="#292826" strokeWidth={1} />
        {Array.from({ length: 5 }, (_, r) =>
          Array.from({ length: 5 }, (_, k) => (
            <circle key={`${r}${k}`} cx={-S + 35 + k * 58} cy={-S + 35 + r * 58} r={1.5} fill="#42403d" />
          ))
        )}
      </>
    );
  }

  // i === 3 (Bottom hardware / R&D slab)
  return (
    <>
      <rect x={-S + 16} y={-S + 16} width={268} height={268} fill="#121110" stroke="#292826" strokeWidth={1} />
      {/* Corner IC chip */}
      <rect x={-S + 26} y={-S + 26} width={64} height={64} fill="#1a1918" stroke={on ? "#f35c95" : "#3a3835"} strokeWidth={1.2} rx={2} />
      {/* IC Pins */}
      {[-18, -2, 14].map((offset) => (
        <g key={offset}>
          <line x1={-S + 26} y1={-S + 58 + offset} x2={-S + 18} y2={-S + 58 + offset} stroke="#504c46" strokeWidth={1.2} />
          <line x1={-S + 58 + offset} y1={-S + 26} x2={-S + 58 + offset} y2={-S + 18} stroke="#504c46" strokeWidth={1.2} />
          <line x1={-S + 90} y1={-S + 58 + offset} x2={-S + 98} y2={-S + 58 + offset} stroke="#504c46" strokeWidth={1.2} />
          <line x1={-S + 58 + offset} y1={-S + 90} x2={-S + 58 + offset} y2={-S + 98} stroke="#504c46" strokeWidth={1.2} />
        </g>
      ))}
      <text x={-S + 34} y={-S + 52} fill={on ? "#f9f5ef" : "#8c867e"} fontSize={8.5} fontFamily="var(--font-mono)" fontWeight="bold">TEVEL</text>
      <text x={-S + 34} y={-S + 66} fill="#6e6962" fontSize={7.5} fontFamily="var(--font-mono)">CORE</text>

      {/* Coordinate crosshairs */}
      {Array.from({ length: 4 }, (_, r) =>
        Array.from({ length: 4 }, (_, c) => {
          const cx = -S + 120 + c * 38;
          const cy = -S + 45 + r * 38;
          return (
            <path
              key={`x-${r}-${c}`}
              d={`M${cx - 4} ${cy} h8 M${cx} ${cy - 4} v8`}
              stroke={on ? "#e5b53a" : "#45423e"}
              strokeWidth={1}
            />
          );
        })
      )}

      {/* Bus traces and solder pads */}
      <circle cx={-S + 45} cy={-S + 180} r={3} fill={on ? "#3ad4c4" : "#45423e"} />
      <circle cx={-S + 110} cy={-S + 180} r={3} fill={on ? "#3ad4c4" : "#45423e"} />
      <circle cx={-S + 170} cy={-S + 240} r={3} fill={on ? "#3ad4c4" : "#45423e"} />
      <path
        d={`M${-S + 45} ${-S + 180} L${-S + 110} ${-S + 180} L${-S + 170} ${-S + 240}`}
        stroke={on ? "#3ad4c4" : "#383633"}
        strokeWidth={1.5}
        fill="none"
      />

      {/* Barcode tracks */}
      {Array.from({ length: 16 }, (_, k) => (
        <line
          key={`bar-${k}`}
          x1={-S + 195 + k * 4.5}
          y1={-S + 200}
          x2={-S + 195 + k * 4.5}
          y2={-S + 265}
          stroke={k % 3 === 0 ? (on ? "#f9f5ef" : "#605c56") : "#302e2b"}
          strokeWidth={k % 2 === 0 ? 2 : 1}
        />
      ))}
    </>
  );
}

export default function Platform() {
  const ref = useRef<HTMLElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    const on = () => {
      const el = ref.current!;
      const r = el.getBoundingClientRect();
      const total = el.offsetHeight - innerHeight;
      setP(Math.min(1, Math.max(0, -r.top / total)));
    };
    on();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); };
  }, []);

  // 0–0.12 intro, then four equal step windows
  const intro = p < 0.12;
  const sp = Math.max(0, (p - 0.12) / 0.88);
  const active = intro ? -1 : Math.min(3, Math.floor(sp * 4));
  const spread = intro ? p / 0.12 : 1 - Math.max(0, sp - 0.85) / 0.15;
  const color = active >= 0 ? steps[active].color : "var(--color-line-2)";

  return (
    <section ref={ref} className="rule relative h-[420vh]">
      <div className="wrap sticky top-0 h-screen">
        <div className="grid h-full md:grid-cols-2">
          {/* Left: intro copy, then the timeline */}
          <div className="inner relative border-line md:border-e">
            <div className={`absolute inset-x-6 top-1/2 -translate-y-1/2 transition-opacity duration-500 md:inset-x-10 ${intro ? "opacity-100" : "pointer-events-none opacity-0"}`}>
              <h2 className="h2">אנחנו מבינים איך העסק עובד — ובונים את הטכנולוגיה <em>שתגרום לו לעבוד טוב יותר.</em></h2>
              <p className="mt-4 max-w-[420px] font-light leading-7 text-stone">
                ארבע שכבות, DNA אחד: להבין את העסק, לבנות את הטכנולוגיה שלו, לחבר אותה, להפוך אותה לחכמה — ולשפר אותה כל הזמן.
              </p>
            </div>

            <div className={`absolute inset-y-16 start-6 w-px bg-line md:start-10 transition-opacity duration-500 ${intro ? "opacity-0" : "opacity-100"}`}>
              <div className="absolute inset-x-0 top-0 transition-[height,background] duration-300" style={{ height: `${sp * 100}%`, background: color }} />
            </div>

            <ol className={`absolute inset-y-16 start-6 end-6 transition-opacity duration-500 md:start-10 ${intro ? "opacity-0" : "opacity-100"}`}>
              {steps.map((s, i) => {
                const isActive = i === active;
                const above = i < active;
                return (
                  <li
                    key={s.tag}
                    className="absolute inset-x-0 -translate-y-1/2 transition-all duration-500"
                    style={{ top: isActive ? "45%" : above ? `${i * 4}%` : `${88 + (i - active - 1) * 4}%` }}
                  >
                    <div key={`${i}-${active}`} className="label flex items-center gap-4 animate-[step-up_.35s_ease-out_both]">
                      <span className="-ms-[7px] grid size-[15px] place-items-center rounded-full bg-ink" style={{ boxShadow: isActive ? `0 0 0 1px ${s.color}` : "none" }}>
                        <span className="size-[5px] rounded-full" style={{ background: isActive ? s.color : "var(--color-line-2)" }} />
                      </span>
                      <span className="text-line-2" dir="ltr">0{i + 1}</span>
                      <span className={isActive ? "text-paper animate-[eyebrow-wipe_.5s_ease-out_both]" : "text-line-2"}>{s.tag}</span>
                    </div>
                    <div className={`overflow-hidden ps-8 transition-all duration-500 ${isActive ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}>
                      <h3 key={active} className="h2 mt-3 animate-[fade-in_.5s_ease-out_both]">{s.title}</h3>
                      <p key={-active - 1} className="mt-3 max-w-[380px] text-xl font-light leading-7 animate-[fade-in_.5s_.1s_ease-out_both]">{s.body}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Right: exploding isometric stack */}
          <div className="hidden items-center justify-center md:flex" style={{ backgroundImage: "radial-gradient(#363533 1px, transparent 1px)", backgroundSize: "16px 16px" }}>
            <svg style={{ direction: "ltr" }} viewBox="-300 -380 600 760" className="h-[85vh] max-h-[720px] w-auto overflow-visible" aria-hidden>
              {steps.map((s, i) => {
                const y = (i - 1.5) * (40 + 110 * spread);
                const on = i === active;
                const H = 16;
                return (
                  <g key={i} style={{ transform: `translateY(${y}px)`, transition: "transform .5s cubic-bezier(.2,.7,.2,1)" }}>
                    {/* 3D Slab Front-Left Side Wall */}
                    <polygon
                      points={`-212.1,0 0,122.7 0,${122.7 + H} -212.1,${H}`}
                      fill="#100f0e"
                      stroke={on ? s.color : "#363533"}
                      strokeWidth={1}
                    />
                    {/* 3D Slab Front-Right Side Wall */}
                    <polygon
                      points={`0,122.7 212.1,0 212.1,${H} 0,${122.7 + H}`}
                      fill="#171615"
                      stroke={on ? s.color : "#363533"}
                      strokeWidth={1}
                    />
                    {/* Bottom Plate 3: Connector fins / heat-sink along front-right edge */}
                    {i === 3 && (
                      <g>
                        {Array.from({ length: 14 }, (_, k) => {
                          const t0 = 0.08 + k * 0.06;
                          const t1 = t0 + 0.038;
                          const x0 = t0 * 212.1;
                          const y0 = 122.7 - t0 * 122.7;
                          const x1 = t1 * 212.1;
                          const y1 = 122.7 - t1 * 122.7;
                          return (
                            <polygon
                              key={k}
                              points={`${x0},${y0 + 2} ${x1},${y1 + 2} ${x1},${y1 + H - 2} ${x0},${y0 + H - 2}`}
                              fill={k % 2 === 0 ? (on ? s.color : "#5a5650") : "#222120"}
                              stroke="#0d0c0b"
                              strokeWidth={0.5}
                            />
                          );
                        })}
                      </g>
                    )}
                    {/* Slab Top Surface */}
                    <g transform={ISO}>
                      <rect
                        x={-S}
                        y={-S}
                        width={S * 2}
                        height={S * 2}
                        fill="#1b1a19"
                        stroke={on ? s.color : "#42403d"}
                        strokeWidth={1.2}
                        style={{ transition: "stroke .4s" }}
                      />
                      <Art i={i} on={on} />
                    </g>
                    {/* Plate 2: 3D raised Pedestal with Tevel Emblem */}
                    {i === 2 && <Pedestal on={on} color={s.color} />}
                  </g>
                );
              })}
              {active >= 0 && steps[active].notes.map(([label, lx, ly, px, py], k) => {
                const right = lx > 0;
                const elbowX = right ? lx - 20 : lx + 20;
                return (
                  <g key={`${active}-${k}`} className="font-mono" style={{ fontSize: 13, letterSpacing: "0.06em" }}>
                    <polyline points={`${right ? lx - 8 : lx + 8 + label.length * 8.5},${ly} ${elbowX + (right ? -30 : 30 + label.length * 8.5)},${ly} ${px},${py}`} pathLength={1} strokeDasharray="1" fill="none" stroke="#959089" strokeWidth={1}
                      style={{ animation: "line-draw .55s ease-out .15s both" }} />
                    <circle cx={right ? lx - 8 : lx + 8 + label.length * 8.5} cy={ly} r={3} fill={steps[active].color} style={{ animation: "fade-in .3s ease-out both" }} />
                    <text x={right ? lx : lx} y={ly + 4} fill="#f9f5ef" textAnchor="start" style={{ animation: "fade-in .3s ease-out .1s both", textTransform: "uppercase" }}>{label}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
