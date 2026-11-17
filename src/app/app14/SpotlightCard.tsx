"use client";

import { type ReactNode } from "react";
import ReactBitsSpotlightCard from "@/components/reactbits/SpotlightCard";

/** Campaign palette applied to the original React Bits component. */
export default function SpotlightCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <ReactBitsSpotlightCard
      className={className}
      spotlightColor="#02bd8f"
      intensity={0.14}
      borderGlow={0.5}
      proximity={50}
      style={{ backgroundColor: "#141513" }}
    >
      {children}
    </ReactBitsSpotlightCard>
  );
}
