import BrandLogo from "@/brand/BrandLogo";
interface LogoProps {
  variant?: "full" | "compact" | "icon" | "hospitality" | "light" | "cobranded";
  size?: number;
  className?: string;
}
export const AmeenShield = ({ size = 64 }: { size?: number; light?: boolean }) => <BrandLogo variant="mark" style={{ width: size }} />;
export default function AmeenLogo({ variant = "full", size = 64, className = "" }: LogoProps) {
  return <div className={className}>
    <BrandLogo variant={variant === "icon" ? "mark" : "horizontal"} tone={variant === "light" ? "dark" : "light"} showTagline={variant === "full"} style={{ width: variant === "icon" ? size : size * 4, maxWidth: "100%" }} />
    {variant === "hospitality" && <p style={{ color: "#C5A365", fontFamily: "Manrope, sans-serif", fontSize: 12 }}>Hospitality</p>}
  </div>;
}
