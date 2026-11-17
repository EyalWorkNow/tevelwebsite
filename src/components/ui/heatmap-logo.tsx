"use client";

// Adapted from Componentry: https://componentry.dev/docs/components/heatmap-logo
// Uses the original Paper Heatmap shader with TEVEL colors and motion controls.
import Image from "next/image";
import {
  Suspense,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Heatmap } from "@paper-design/shaders-react";

const BRAND_COLORS = [
  "#071712",
  "#01372a",
  "#015742",
  "#028365",
  "#02bd8f",
  "#85eda5",
  "#f9f5ef",
];

const FADE =
  "linear-gradient(to right, transparent, black 10%, black 90%, transparent)";
const EDGE_FADE = {
  maskImage: `${FADE}, ${FADE.replace("to right", "to bottom")}`,
  maskComposite: "intersect",
  WebkitMaskImage: `${FADE}, ${FADE.replace("to right", "to bottom")}`,
  WebkitMaskComposite: "source-in",
} as const;

function subscribeMotion(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  const observer = new MutationObserver(onChange);
  query.addEventListener("change", onChange);
  document.addEventListener("visibilitychange", onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => {
    query.removeEventListener("change", onChange);
    document.removeEventListener("visibilitychange", onChange);
    observer.disconnect();
  };
}

function motionPaused() {
  return (
    document.hidden ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    document.documentElement.classList.contains("a11y-no-motion")
  );
}

let webGLSupported: boolean | undefined;
function subscribeWebGL(onChange: () => void) {
  if (webGLSupported === undefined) {
    const context = document.createElement("canvas").getContext("webgl2");
    webGLSupported = context !== null;
    context?.getExtension("WEBGL_lose_context")?.loseContext();
  }
  onChange();
  return () => {};
}
const hasWebGL = () => webGLSupported ?? false;
const serverPaused = () => true;
const serverWebGL = () => false;

export interface HeatmapLogoProps {
  image: string;
  fallbackImage?: string;
  colors?: string[];
  background?: string;
  glow?: number;
  className?: string;
  label?: string;
}

export function HeatmapLogo({
  image,
  fallbackImage = image,
  colors = BRAND_COLORS,
  background = "#00000000",
  glow = 0,
  className = "",
  label = "הלוגו",
}: HeatmapLogoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const paused = useSyncExternalStore(
    subscribeMotion,
    motionPaused,
    serverPaused,
  );
  const webGL = useSyncExternalStore(subscribeWebGL, hasWebGL, serverWebGL);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const fallback = (
    <Image
      src={fallbackImage}
      alt=""
      fill
      unoptimized
      loading="eager"
      sizes="(max-width: 800px) 90vw, 600px"
      className="object-contain p-[10%]"
    />
  );

  return (
    <div
      ref={ref}
      role="img"
      aria-label={label}
      className={`relative aspect-square w-80 ${className}`}
      style={EDGE_FADE}
    >
      {webGL ? (
        <Suspense fallback={fallback}>
          <Heatmap
            image={image}
            suspendWhenProcessingImage
            colors={colors}
            colorBack={background}
            contour={0.45}
            innerGlow={0.55}
            outerGlow={glow}
            noise={0.15}
            angle={0}
            scale={0.9}
            speed={paused || !visible ? 0 : 0.6}
            minPixelRatio={1}
            maxPixelCount={500_000}
            className="absolute inset-0"
            aria-hidden="true"
          />
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
}
