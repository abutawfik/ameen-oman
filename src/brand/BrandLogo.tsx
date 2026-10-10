import type { CSSProperties } from "react";
import "./identity.css";

export type BrandLogoVariant = "horizontal" | "stacked" | "mark";
export type BrandLogoTone = "light" | "dark" | "full";
export type BrandLogoSize = "sm" | "md" | "lg";
export interface BrandLogoProps {
  variant?: BrandLogoVariant;
  tone?: BrandLogoTone;
  size?: BrandLogoSize;
  showTagline?: boolean;
  /** Logo artwork stays Arabic-first independently of the UI language. */
  isAr?: boolean;
  className?: string;
  style?: CSSProperties;
}

export default function BrandLogo({ variant = "horizontal", tone = "full", size = "md", showTagline = false, className = "", style }: BrandLogoProps) {
  const mark = variant === "mark";
  const src = mark ? "/brand/al-ameen-emblem-navy.png" : tone === "dark" ? "/brand/al-ameen-lockup-ivory.png" : "/brand/al-ameen-lockup-navy.png";
  return (
    <div dir="ltr" className={`ameen-identity ameen-identity--${size} ameen-identity--${variant} ${tone === "dark" ? "ameen-identity--dark" : ""} ${className}`} style={style}>
      <img src={src} alt="Al-Ameen — الأمين" width={mark ? 1254 : 1774} height={mark ? 1254 : 887} decoding="async" />
      {showTagline && !mark && <span className="ameen-identity__tagline" lang="en">The Nation’s Trusted Guardian</span>}
    </div>
  );
}
