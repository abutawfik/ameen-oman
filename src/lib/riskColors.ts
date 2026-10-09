/** Canonical risk-level color tokens — single source of truth for the whole app. */
export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface RiskToken {
  color:   string;
  bg:      string;
  border:  string;
  labelEn: string;
  labelAr: string;
}

export const RISK_TOKEN: Record<RiskLevel, RiskToken> = {
  CRITICAL: { color: '#C94A5E', bg: 'rgba(201,74,94,0.10)',  border: 'rgba(201,74,94,0.35)',  labelEn: 'Critical', labelAr: 'حرج'    },
  HIGH:     { color: '#D4922A', bg: 'rgba(212,146,42,0.10)', border: 'rgba(212,146,42,0.35)', labelEn: 'High',     labelAr: 'عالٍ'   },
  MEDIUM:   { color: '#FACC15', bg: 'rgba(250,204,21,0.10)', border: 'rgba(250,204,21,0.30)', labelEn: 'Medium',   labelAr: 'متوسط'  },
  LOW:      { color: '#4A8E5A', bg: 'rgba(74,142,90,0.10)',  border: 'rgba(74,142,90,0.28)',  labelEn: 'Low',      labelAr: 'منخفض'  },
};

/** Convenience: just the color string, keyed by upper or lower case. */
export const RISK_COLOR: Record<string, string> = {
  CRITICAL: RISK_TOKEN.CRITICAL.color,
  HIGH:     RISK_TOKEN.HIGH.color,
  MEDIUM:   RISK_TOKEN.MEDIUM.color,
  LOW:      RISK_TOKEN.LOW.color,
  critical: RISK_TOKEN.CRITICAL.color,
  high:     RISK_TOKEN.HIGH.color,
  medium:   RISK_TOKEN.MEDIUM.color,
  low:      RISK_TOKEN.LOW.color,
};

export function getRiskToken(level: string): RiskToken {
  const key = level?.toUpperCase() as RiskLevel;
  return RISK_TOKEN[key] ?? RISK_TOKEN.LOW;
}
