// Shared constants + helpers used across OSINT Risk Engine tabs.
// Extracted from the former monolithic page.tsx so each tab / sub-component
// can pull only what it needs without re-importing from the page shell.

import { SCORE_BAND_META, type RiskBand } from "@/mocks/osintData";

export const scoreColor = (band: RiskBand) => SCORE_BAND_META[band].color;

export const confidenceColor: Record<string, string> = {
  "High": "#4ADE80",
  "Medium-High": "#D6B47E",
  "Medium": "#FACC15",
  "Low": "#C94A5E",
};

export const sourceStatusMeta: Record<string, { color: string; bg: string; label: string }> = {
  healthy:  { color: "#4ADE80", bg: "rgba(74,222,128,0.1)",  label: "HEALTHY" },
  degraded: { color: "#C98A1B", bg: "rgba(201,138,27,0.1)",  label: "DEGRADED" },
  stale:    { color: "#FACC15", bg: "rgba(250,204,21,0.1)",  label: "STALE" },
  down:     { color: "#C94A5E", bg: "rgba(201,74,94,0.1)", label: "DOWN" },
};

export const timeSince = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.floor(hr / 24)}d ago`;
};

export type Tab = "overview" | "queue" | "explain" | "sequence" | "sources" | "config" | "governance" | "rasad";
export type SourceFilter = "all" | "osint" | "internal";
