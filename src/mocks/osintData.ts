// OSINT-Enriched Unified Risk Assessment Engine — mock data
// Source: Oman_OSINT_Risk_Engine_PoC.docx (v0.1, 17 April 2026)
// Backing data for the /dashboard/osint-risk-engine demo view.
// All scores + signals are synthetic, calibrated to the scoring model
// described in the PoC (see ROADMAP.md section 3).

export type SubScoreKey =
  | "sanctions"
  | "geopolitical"
  | "biosecurity"
  | "routing"
  | "entity"
  | "document";

export type DecisionPoint = "ETA" | "API_PNR";
export type RiskBand = "low" | "borderline" | "elevated" | "high" | "critical";
export type SourceConfidence = "High" | "Medium-High" | "Medium" | "Low";
export type SourceStatus = "healthy" | "degraded" | "stale" | "down";

// ─────────────────────────────────────────────────────────────────────────
// Sub-score weights (defaults per PoC §6.2, tunable via Config tab)
// ─────────────────────────────────────────────────────────────────────────

export interface SubScoreWeight {
  key: SubScoreKey;
  labelEn: string;
  labelAr: string;
  defaultWeight: number; // percentage (0-100, sum = 100)
  weight: number;
  color: string;
  icon: string;
  primarySources: string[];
  method: string;
}

export const DEFAULT_SUB_SCORE_WEIGHTS: SubScoreWeight[] = [
  {
    key: "sanctions",
    labelEn: "Sanctions / PEP",
    labelAr: "العقوبات / الشخصيات السياسية",
    defaultWeight: 25,
    weight: 25,
    color: "#F87171",
    icon: "ri-shield-cross-line",
    primarySources: ["OpenSanctions"],
    method: "Deterministic match + fuzzy entity resolution",
  },
  {
    key: "geopolitical",
    labelEn: "Geopolitical Origin",
    labelAr: "المخاطر الجيوسياسية",
    defaultWeight: 20,
    weight: 20,
    color: "#FB923C",
    icon: "ri-global-line",
    primarySources: ["GDELT", "ACLED", "Advisories"],
    method: "Rolling 7-day conflict intensity score",
  },
  {
    key: "biosecurity",
    labelEn: "Biosecurity",
    labelAr: "الأمن الحيوي",
    defaultWeight: 10,
    weight: 10,
    color: "#FACC15",
    icon: "ri-heart-pulse-line",
    primarySources: ["WHO", "ECDC", "ReliefWeb"],
    method: "Outbreak origin windowing",
  },
  {
    key: "routing",
    labelEn: "Routing Anomaly",
    labelAr: "شذوذ المسار",
    defaultWeight: 20,
    weight: 20,
    color: "#AA95FF",
    icon: "ri-route-line",
    primarySources: ["OpenSky", "flight history"],
    method: "Isolation Forest (unsupervised)",
  },
  {
    key: "entity",
    labelEn: "Sponsor / Entity",
    labelAr: "الكفيل / الكيان",
    defaultWeight: 15,
    weight: 15,
    color: "#22D3EE",
    icon: "ri-organization-chart",
    primarySources: ["OpenCorporates", "OpenSanctions"],
    method: "Personalized PageRank (decay 0.5)",
  },
  {
    key: "document",
    labelEn: "Document & Identity",
    labelAr: "الوثائق والهوية",
    defaultWeight: 10,
    weight: 10,
    color: "#4ADE80",
    icon: "ri-passport-line",
    primarySources: ["Advisories", "internal flags"],
    method: "Rules (PoC); ML in Phase 2",
  },
];

// ─────────────────────────────────────────────────────────────────────────
// OSINT source inventory (PoC §4.1)
// ─────────────────────────────────────────────────────────────────────────

export interface OsintSource {
  id: string;
  name: string;
  category: string;
  format: string;
  refresh: string;
  refreshMinutes: number;
  confidence: SourceConfidence;
  status: SourceStatus;
  lastSuccess: string; // ISO
  lastFailure: string | null;
  records24h: number;
  signalContribution: string;
  endpoint: string;
  color: string;
}

export const OSINT_SOURCES: OsintSource[] = [
  {
    id: "opensanctions",
    name: "OpenSanctions",
    category: "Sanctions & PEP",
    format: "JSON API / bulk",
    refresh: "Daily",
    refreshMinutes: 1440,
    confidence: "High",
    status: "healthy",
    lastSuccess: "2026-04-17T02:12:04Z",
    lastFailure: null,
    records24h: 18420,
    signalContribution: "UN/OFAC/EU/UK lists, PEP exposure",
    endpoint: "data.opensanctions.org/datasets/latest/default/entities.ftm.json",
    color: "#F87171",
  },
  {
    id: "gdelt",
    name: "GDELT 2.0",
    category: "Geopolitical events",
    format: "BigQuery / API",
    refresh: "15 min",
    refreshMinutes: 15,
    confidence: "Medium-High",
    status: "healthy",
    lastSuccess: "2026-04-17T11:43:18Z",
    lastFailure: "2026-04-16T22:10:03Z",
    records24h: 94322,
    signalContribution: "Country-of-origin conflict intensity, unrest signal",
    endpoint: "api.gdeltproject.org/api/v2/doc/doc",
    color: "#FB923C",
  },
  {
    id: "acled",
    name: "ACLED",
    category: "Armed conflict",
    format: "REST API",
    refresh: "Weekly",
    refreshMinutes: 10080,
    confidence: "Medium-High",
    status: "healthy",
    lastSuccess: "2026-04-15T07:30:00Z",
    lastFailure: null,
    records24h: 1284,
    signalContribution: "Conflict event density, actor proximity, location risk",
    endpoint: "api.acleddata.com/acled/read",
    color: "#FB923C",
  },
  {
    id: "who",
    name: "WHO Disease Outbreak News",
    category: "Biosecurity",
    format: "RSS / JSON",
    refresh: "Daily",
    refreshMinutes: 1440,
    confidence: "High",
    status: "healthy",
    lastSuccess: "2026-04-17T06:04:55Z",
    lastFailure: null,
    records24h: 7,
    signalContribution: "Outbreak origin, traveler health advisory overlap",
    endpoint: "who.int/feeds/entity/csr/don/en/rss.xml",
    color: "#FACC15",
  },
  {
    id: "ecdc",
    name: "ECDC Feeds",
    category: "Biosecurity",
    format: "JSON",
    refresh: "Daily",
    refreshMinutes: 1440,
    confidence: "High",
    status: "degraded",
    lastSuccess: "2026-04-17T04:18:22Z",
    lastFailure: "2026-04-17T10:22:10Z",
    records24h: 12,
    signalContribution: "Disease surveillance, traveler advisory overlap",
    endpoint: "ecdc.europa.eu/en/publications-data",
    color: "#FACC15",
  },
  {
    id: "opensky",
    name: "OpenSky Network",
    category: "Aviation movements",
    format: "REST API",
    refresh: "Near real-time",
    refreshMinutes: 15,
    confidence: "Medium",
    status: "healthy",
    lastSuccess: "2026-04-17T11:52:41Z",
    lastFailure: "2026-04-17T03:02:11Z",
    records24h: 2847,
    signalContribution: "Routing anomaly, aircraft history, flight path deviation",
    endpoint: "opensky-network.org/api/flights/all",
    color: "#AA95FF",
  },
  {
    id: "advisories",
    name: "Travel Advisories",
    category: "Govt advisories",
    format: "Scraped / feed",
    refresh: "Daily",
    refreshMinutes: 1440,
    confidence: "High",
    status: "healthy",
    lastSuccess: "2026-04-17T01:00:04Z",
    lastFailure: null,
    records24h: 84,
    signalContribution: "Origin-country advisory level alignment",
    endpoint: "travel.state.gov, gov.uk/foreign-travel-advice",
    color: "#22D3EE",
  },
  {
    id: "opencorporates",
    name: "OpenCorporates",
    category: "Corporate entities",
    format: "REST API",
    refresh: "On-query",
    refreshMinutes: 0,
    confidence: "Medium",
    status: "healthy",
    lastSuccess: "2026-04-17T11:48:02Z",
    lastFailure: null,
    records24h: 612,
    signalContribution: "Sponsor entity resolution, beneficial ownership",
    endpoint: "api.opencorporates.com/v0.4",
    color: "#22D3EE",
  },
  {
    id: "reliefweb",
    name: "ReliefWeb",
    category: "Humanitarian",
    format: "REST API",
    refresh: "Daily",
    refreshMinutes: 1440,
    confidence: "Medium",
    status: "stale",
    lastSuccess: "2026-04-16T08:12:33Z",
    lastFailure: "2026-04-17T02:14:41Z",
    records24h: 42,
    signalContribution: "Displacement flow signal, emergency origin mapping",
    endpoint: "api.reliefweb.int/v1",
    color: "#4ADE80",
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Rules catalogue (PoC §7.2, Appendix A.5 — 12 rules)
// ─────────────────────────────────────────────────────────────────────────

export interface RiskRule {
  id: string;
  category: SubScoreKey;
  description: string;
  descriptionAr: string;
  contribution: number; // 0-1
  threshold: string;
  enabled: boolean;
  version: string;
  firesLast24h: number;
}

export const RISK_RULES: RiskRule[] = [
  {
    id: "R-SNC-001",
    category: "sanctions",
    description: "Direct sanctions match on traveler",
    descriptionAr: "تطابق مباشر للعقوبات على المسافر",
    contribution: 1.0,
    threshold: "Fuzzy name match ≥ 0.92 to OpenSanctions entity",
    enabled: true,
    version: "v1.0",
    firesLast24h: 3,
  },
  {
    id: "R-SNC-002",
    category: "sanctions",
    description: "Direct sanctions match on sponsor entity",
    descriptionAr: "تطابق مباشر للعقوبات على الكفيل",
    contribution: 0.95,
    threshold: "Sponsor entity in OpenSanctions active list",
    enabled: true,
    version: "v1.0",
    firesLast24h: 7,
  },
  {
    id: "R-SNC-003",
    category: "entity",
    description: "Sponsor entity within 2 hops of sanctioned entity",
    descriptionAr: "الكفيل ضمن درجتين من كيان خاضع للعقوبات",
    contribution: 0.7,
    threshold: "Graph path length ≤ 2, decay 0.5",
    enabled: true,
    version: "v1.0",
    firesLast24h: 24,
  },
  {
    id: "R-GEO-001",
    category: "geopolitical",
    description: "Origin country conflict intensity above threshold",
    descriptionAr: "كثافة النزاع في بلد المنشأ أعلى من الحد",
    contribution: 0.7,
    threshold: "Rolling 7-day Goldstein-weighted GDELT sum > 120",
    enabled: true,
    version: "v1.1",
    firesLast24h: 141,
  },
  {
    id: "R-GEO-002",
    category: "geopolitical",
    description: "Origin country travel advisory level ≥ 3",
    descriptionAr: "مستوى تحذير السفر لبلد المنشأ ≥ 3",
    contribution: 0.6,
    threshold: "Advisory level ∈ {3, 4}",
    enabled: true,
    version: "v1.0",
    firesLast24h: 86,
  },
  {
    id: "R-BIO-001",
    category: "biosecurity",
    description: "Traveler origin within active WHO outbreak window",
    descriptionAr: "منشأ المسافر ضمن نافذة تفشٍ نشطة من WHO",
    contribution: 0.65,
    threshold: "Outbreak status = ACTIVE and country match",
    enabled: true,
    version: "v1.0",
    firesLast24h: 18,
  },
  {
    id: "R-RTE-001",
    category: "routing",
    description: "Routing pattern unusual for nationality",
    descriptionAr: "نمط المسار غير معتاد للجنسية",
    contribution: 0.55,
    threshold: "Isolation Forest anomaly_score > 0.75",
    enabled: true,
    version: "v1.0",
    firesLast24h: 63,
  },
  {
    id: "R-RTE-002",
    category: "routing",
    description: "Multiple near-simultaneous bookings, same traveler",
    descriptionAr: "حجوزات متعددة متزامنة لنفس المسافر",
    contribution: 0.6,
    threshold: "≥ 2 PNR records within 4-hour window",
    enabled: true,
    version: "v1.0",
    firesLast24h: 11,
  },
  {
    id: "R-DOC-001",
    category: "document",
    description: "Passport number format inconsistent with issuing country",
    descriptionAr: "تنسيق رقم الجواز لا يتوافق مع بلد الإصدار",
    contribution: 0.75,
    threshold: "Regex mismatch for issuing country",
    enabled: true,
    version: "v1.0",
    firesLast24h: 4,
  },
  {
    id: "R-ENT-001",
    category: "entity",
    description: "Sponsor corporate record missing or anomalous",
    descriptionAr: "سجل الكفيل الشركاتي مفقود أو شاذ",
    contribution: 0.5,
    threshold: "OpenCorporates lookup fails or inactive",
    enabled: true,
    version: "v1.0",
    firesLast24h: 29,
  },
  {
    id: "R-TMP-001",
    category: "geopolitical",
    description: "Travel within 14 days of advisory escalation",
    descriptionAr: "السفر خلال 14 يومًا من تصعيد التحذير",
    contribution: 0.45,
    threshold: "Advisory level change ≥ 1 within window",
    enabled: true,
    version: "v1.0",
    firesLast24h: 37,
  },
  {
    id: "R-TMP-002",
    category: "routing",
    description: "Recent nationality-aggregate anomaly",
    descriptionAr: "شذوذ إجمالي حديث للجنسية",
    contribution: 0.4,
    threshold: "Z-score > 2.5 vs 30-day baseline",
    enabled: false,
    version: "v0.9",
    firesLast24h: 0,
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Signal contribution — what a single rule fire or ML feature contributed
// ─────────────────────────────────────────────────────────────────────────

export interface ScoreContribution {
  type: "rule" | "ml_feature";
  ref: string; // rule id OR feature name
  subScore: SubScoreKey;
  observed: string; // human-readable observed value
  contribution: number; // 0-100 (pts contributed to sub-score)
  source: string;
  confidence: SourceConfidence;
}

// ─────────────────────────────────────────────────────────────────────────
// Scored records — unified score per traveler (PoC §6.2, Appendix A.7)
// ─────────────────────────────────────────────────────────────────────────

export interface ScoredRecord {
  id: string;
  decisionPoint: DecisionPoint;
  travelerName: string;
  travelerNameAr: string;
  nationality: string; // ISO-3
  nationalityCode: string; // 2-letter for emoji flags
  passportNumber: string;
  originIata: string;
  destIata: string;
  carrierIata: string;
  flightNumber: string;
  arrivalTs: string;
  sponsor: string | null;
  visaType: string;
  unifiedScore: number; // 0-100
  band: RiskBand;
  subScores: Record<SubScoreKey, number>; // 0-100 per category
  contributions: ScoreContribution[];
  modelVersion: string;
  computedAt: string;
  demoScenario?: string;
}

const band = (score: number): RiskBand => {
  if (score >= 80) return "critical";
  if (score >= 65) return "high";
  if (score >= 45) return "elevated";
  if (score >= 25) return "borderline";
  return "low";
};

export const SCORE_BAND_META: Record<RiskBand, { labelEn: string; labelAr: string; color: string }> = {
  critical:   { labelEn: "CRITICAL",   labelAr: "حرج",     color: "#DC2626" },
  high:       { labelEn: "HIGH",       labelAr: "مرتفع",   color: "#F87171" },
  elevated:   { labelEn: "ELEVATED",   labelAr: "مرتفع جزئياً", color: "#FB923C" },
  borderline: { labelEn: "BORDERLINE", labelAr: "حدّي",    color: "#FACC15" },
  low:        { labelEn: "LOW",        labelAr: "منخفض",   color: "#4ADE80" },
};

// Helper — build a ScoredRecord quickly
const rec = (
  id: string,
  decisionPoint: DecisionPoint,
  travelerName: string,
  travelerNameAr: string,
  nationality: string,
  nationalityCode: string,
  originIata: string,
  carrierIata: string,
  flightNumber: string,
  arrivalTs: string,
  sponsor: string | null,
  visaType: string,
  subScores: Record<SubScoreKey, number>,
  contributions: ScoreContribution[],
  demoScenario?: string,
): ScoredRecord => {
  const unified = Math.round(
    subScores.sanctions * 0.25 +
    subScores.geopolitical * 0.20 +
    subScores.biosecurity * 0.10 +
    subScores.routing * 0.20 +
    subScores.entity * 0.15 +
    subScores.document * 0.10,
  );
  return {
    id,
    decisionPoint,
    travelerName,
    travelerNameAr,
    nationality,
    nationalityCode,
    passportNumber: `${nationalityCode.toUpperCase()}${Math.floor(Math.random() * 9_000_000 + 1_000_000)}`,
    originIata,
    destIata: "MCT",
    carrierIata,
    flightNumber,
    arrivalTs,
    sponsor,
    visaType,
    unifiedScore: unified,
    band: band(unified),
    subScores,
    contributions,
    modelVersion: "mvp-0.3.1",
    computedAt: new Date().toISOString(),
    demoScenario,
  };
};

// ── Demo scenarios (PoC §8.2) ────────────────────────────────────────────

const demoScenarios: ScoredRecord[] = [
  rec(
    "demo-lowrisk",
    "ETA",
    "James W. Carter",
    "جيمس كارتر",
    "USA", "us",
    "JFK", "EK", "EK204",
    "2026-04-18T09:15:00Z",
    "Bechtel Corporation",
    "Business Single-Entry",
    { sanctions: 2, geopolitical: 8, biosecurity: 5, routing: 12, entity: 6, document: 4 },
    [
      { type: "rule", ref: "R-GEO-002", subScore: "geopolitical", observed: "Advisory level 2 (normal precautions)", contribution: 6, source: "Travel Advisories", confidence: "High" },
      { type: "ml_feature", ref: "route_common_pattern", subScore: "routing", observed: "Origin-destination common for nationality (p>0.95)", contribution: 2, source: "OpenSky", confidence: "Medium" },
    ],
    "low-risk-routine",
  ),
  rec(
    "demo-borderline",
    "API_PNR",
    "Yasir A. Karim",
    "ياسر كريم",
    "PAK", "pk",
    "KHI", "PK", "PK207",
    "2026-04-18T04:42:00Z",
    "Pearl Logistics LLC",
    "Tourist Multiple-Entry",
    { sanctions: 6, geopolitical: 62, biosecurity: 28, routing: 22, entity: 14, document: 10 },
    [
      { type: "rule", ref: "R-GEO-001", subScore: "geopolitical", observed: "GDELT conflict intensity 164 (> 120)", contribution: 48, source: "GDELT", confidence: "Medium-High" },
      { type: "rule", ref: "R-GEO-002", subScore: "geopolitical", observed: "Advisory level 3 — reconsider travel", contribution: 22, source: "Travel Advisories", confidence: "High" },
      { type: "rule", ref: "R-TMP-001", subScore: "geopolitical", observed: "Advisory escalation 9 days ago", contribution: 16, source: "Travel Advisories", confidence: "High" },
      { type: "ml_feature", ref: "nationality_origin_rarity", subScore: "routing", observed: "Origin within top-20 for nationality", contribution: 12, source: "OpenSky", confidence: "Medium" },
    ],
    "borderline-context",
  ),
  rec(
    "demo-highrisk-sponsor",
    "ETA",
    "Mikhail V. Petrov",
    "ميخائيل بيتروف",
    "RUS", "ru",
    "DXB", "EK", "EK865",
    "2026-04-18T22:05:00Z",
    "Volga Holdings International",
    "Business Multiple-Entry",
    { sanctions: 72, geopolitical: 48, biosecurity: 6, routing: 18, entity: 86, document: 12 },
    [
      { type: "rule", ref: "R-SNC-003", subScore: "entity", observed: "Sponsor 2 hops from EU-sanctioned oligarch", contribution: 60, source: "OpenSanctions + OpenCorporates", confidence: "High" },
      { type: "rule", ref: "R-SNC-002", subScore: "sanctions", observed: "Sponsor parent entity on UK sanctions list (pending appeal)", contribution: 54, source: "OpenSanctions", confidence: "High" },
      { type: "rule", ref: "R-GEO-002", subScore: "geopolitical", observed: "Advisory level 3 — travel restrictions", contribution: 28, source: "Travel Advisories", confidence: "High" },
      { type: "ml_feature", ref: "entity_graph_pagerank", subScore: "entity", observed: "Personalized PageRank 0.91 (top 2%)", contribution: 22, source: "Graph Engine", confidence: "High" },
    ],
    "high-risk-sponsor",
  ),
  rec(
    "demo-anomaly",
    "API_PNR",
    "Leila D. Benaissa",
    "ليلى بن عيسى",
    "DZA", "dz",
    "CDG", "AF", "AF672",
    "2026-04-18T17:30:00Z",
    null,
    "Tourist Single-Entry",
    { sanctions: 4, geopolitical: 22, biosecurity: 14, routing: 84, entity: 32, document: 20 },
    [
      { type: "ml_feature", ref: "iforest_anomaly", subScore: "routing", observed: "Isolation Forest anomaly_score 0.89", contribution: 56, source: "RoutingAnomalyDetector", confidence: "Medium-High" },
      { type: "rule", ref: "R-RTE-001", subScore: "routing", observed: "Origin CDG rare for DZA→MCT (<1%)", contribution: 28, source: "OpenSky", confidence: "Medium" },
      { type: "rule", ref: "R-RTE-002", subScore: "routing", observed: "3 near-simultaneous PNR records in 3 hours", contribution: 22, source: "PNR", confidence: "High" },
      { type: "ml_feature", ref: "booking_to_departure_days", subScore: "routing", observed: "Booked 11 hours before departure (top 0.5%)", contribution: 12, source: "PNR", confidence: "High" },
    ],
    "anomaly-driven",
  ),
  rec(
    "demo-health",
    "ETA",
    "Sarah M. Nguyen",
    "سارة نغوين",
    "VNM", "vn",
    "SGN", "VN", "VN515",
    "2026-04-19T05:40:00Z",
    "Hanoi Tech Exchange",
    "Business Single-Entry",
    { sanctions: 2, geopolitical: 12, biosecurity: 78, routing: 18, entity: 8, document: 6 },
    [
      { type: "rule", ref: "R-BIO-001", subScore: "biosecurity", observed: "Origin in active avian-influenza outbreak (WHO DON 2026-04-11)", contribution: 62, source: "WHO", confidence: "High" },
      { type: "rule", ref: "R-BIO-001", subScore: "biosecurity", observed: "ECDC surveillance flag: poultry cluster SGN", contribution: 24, source: "ECDC", confidence: "High" },
      { type: "ml_feature", ref: "nationality_origin_rarity", subScore: "routing", observed: "Common routing — no anomaly", contribution: 8, source: "OpenSky", confidence: "Medium" },
    ],
    "health-overlap",
  ),
];

// ── Additional synthetic queue records (operator view) ────────────────────

const additionalRecords: ScoredRecord[] = [
  rec("rec-000127", "ETA", "Khaled A. Saleh",   "خالد صالح",    "YEM", "ye", "SAH", "FZ", "FZ643", "2026-04-17T14:25:00Z", "Arabian Gulf Trading", "Tourist Single-Entry",
    { sanctions: 10, geopolitical: 74, biosecurity: 8, routing: 34, entity: 22, document: 18 },
    [
      { type: "rule", ref: "R-GEO-001", subScore: "geopolitical", observed: "Goldstein-weighted intensity 198", contribution: 52, source: "GDELT", confidence: "Medium-High" },
      { type: "rule", ref: "R-GEO-002", subScore: "geopolitical", observed: "Advisory level 4 — do not travel", contribution: 30, source: "Advisories", confidence: "High" },
      { type: "ml_feature", ref: "iforest_anomaly", subScore: "routing", observed: "Anomaly_score 0.52", contribution: 14, source: "RoutingAnomalyDetector", confidence: "Medium" },
    ]),
  rec("rec-000128", "API_PNR", "Elena S. Marković", "إيلينا ماركوفيتش", "SRB", "rs", "BEG", "JU", "JU860", "2026-04-17T19:10:00Z", null, "Tourist Single-Entry",
    { sanctions: 4, geopolitical: 28, biosecurity: 6, routing: 32, entity: 10, document: 8 },
    [
      { type: "rule", ref: "R-RTE-001", subScore: "routing", observed: "Origin-nationality combo uncommon", contribution: 18, source: "OpenSky", confidence: "Medium" },
      { type: "rule", ref: "R-GEO-002", subScore: "geopolitical", observed: "Advisory level 2", contribution: 10, source: "Advisories", confidence: "High" },
    ]),
  rec("rec-000129", "ETA", "Abdul R. Hashemi",  "عبد الرحيم هاشمي", "IRN", "ir", "IKA", "W5", "W5081", "2026-04-17T22:45:00Z", "Persian Gulf Logistics", "Business Multiple-Entry",
    { sanctions: 42, geopolitical: 66, biosecurity: 6, routing: 18, entity: 58, document: 12 },
    [
      { type: "rule", ref: "R-SNC-003", subScore: "entity", observed: "Sponsor 2 hops from US-sanctioned entity", contribution: 44, source: "OpenSanctions", confidence: "High" },
      { type: "rule", ref: "R-GEO-001", subScore: "geopolitical", observed: "Conflict intensity 138", contribution: 36, source: "GDELT", confidence: "Medium-High" },
      { type: "rule", ref: "R-GEO-002", subScore: "geopolitical", observed: "Advisory level 4", contribution: 24, source: "Advisories", confidence: "High" },
    ]),
  rec("rec-000130", "API_PNR", "Fatima Al-Mansoori", "فاطمة المنصوري", "ARE", "ae", "DXB", "EK", "EK866", "2026-04-17T23:05:00Z", "Dubai Trade Authority", "Diplomatic",
    { sanctions: 0, geopolitical: 4, biosecurity: 2, routing: 6, entity: 4, document: 2 },
    [
      { type: "ml_feature", ref: "route_common_pattern", subScore: "routing", observed: "Routing highly typical", contribution: 3, source: "OpenSky", confidence: "Medium" },
    ]),
  rec("rec-000131", "ETA", "Hasan M. Al-Bakri",  "حسن البكري",   "SYR", "sy", "DAM", "RB", "RB101", "2026-04-18T01:20:00Z", "Levant Holdings", "Tourist Single-Entry",
    { sanctions: 22, geopolitical: 82, biosecurity: 14, routing: 28, entity: 46, document: 10 },
    [
      { type: "rule", ref: "R-GEO-001", subScore: "geopolitical", observed: "Conflict intensity 312", contribution: 64, source: "GDELT + ACLED", confidence: "Medium-High" },
      { type: "rule", ref: "R-GEO-002", subScore: "geopolitical", observed: "Advisory level 4", contribution: 30, source: "Advisories", confidence: "High" },
      { type: "rule", ref: "R-ENT-001", subScore: "entity", observed: "Sponsor OpenCorporates record inactive 2024-Q4", contribution: 26, source: "OpenCorporates", confidence: "Medium" },
    ]),
  rec("rec-000132", "API_PNR", "Priya N. Raman", "بريا رامان",  "IND", "in", "BLR", "AI", "AI969", "2026-04-18T02:35:00Z", null, "Tourist Multiple-Entry",
    { sanctions: 0, geopolitical: 10, biosecurity: 14, routing: 8, entity: 4, document: 4 },
    [
      { type: "ml_feature", ref: "route_common_pattern", subScore: "routing", observed: "Routing typical, hour common", contribution: 3, source: "OpenSky", confidence: "Medium" },
    ]),
  rec("rec-000133", "ETA", "Mohamed O. El-Sayed", "محمد السيد",  "EGY", "eg", "CAI", "MS", "MS611", "2026-04-18T06:10:00Z", "Nile Commerce Group", "Business Single-Entry",
    { sanctions: 2, geopolitical: 24, biosecurity: 10, routing: 12, entity: 18, document: 8 },
    [
      { type: "rule", ref: "R-GEO-002", subScore: "geopolitical", observed: "Advisory level 2", contribution: 12, source: "Advisories", confidence: "High" },
      { type: "rule", ref: "R-ENT-001", subScore: "entity", observed: "Sponsor corporate record present; beneficial ownership partially resolved", contribution: 10, source: "OpenCorporates", confidence: "Medium" },
    ]),
  rec("rec-000134", "ETA", "Omar Z. Qureshi",    "عمر قريشي",   "PAK", "pk", "LHE", "PK", "PK297", "2026-04-18T08:45:00Z", "Indus Freight Ltd", "Business Single-Entry",
    { sanctions: 4, geopolitical: 44, biosecurity: 18, routing: 18, entity: 20, document: 6 },
    [
      { type: "rule", ref: "R-GEO-001", subScore: "geopolitical", observed: "Conflict intensity 102", contribution: 28, source: "GDELT", confidence: "Medium-High" },
      { type: "rule", ref: "R-GEO-002", subScore: "geopolitical", observed: "Advisory level 3", contribution: 20, source: "Advisories", confidence: "High" },
    ]),
  rec("rec-000135", "API_PNR", "Chen Wei",        "تشين وي",     "CHN", "cn", "PEK", "CA", "CA745", "2026-04-18T11:00:00Z", null, "Tourist Single-Entry",
    { sanctions: 0, geopolitical: 6, biosecurity: 4, routing: 10, entity: 2, document: 2 },
    [
      { type: "ml_feature", ref: "route_common_pattern", subScore: "routing", observed: "Routing typical", contribution: 4, source: "OpenSky", confidence: "Medium" },
    ]),
  rec("rec-000136", "ETA", "Amr H. Barakat",     "عمرو بركات",  "LBY", "ly", "TIP", "8U", "8U212", "2026-04-18T13:25:00Z", "Tripoli Offshore Services", "Business Single-Entry",
    { sanctions: 32, geopolitical: 68, biosecurity: 8, routing: 22, entity: 52, document: 14 },
    [
      { type: "rule", ref: "R-GEO-001", subScore: "geopolitical", observed: "Conflict intensity 186", contribution: 48, source: "GDELT", confidence: "Medium-High" },
      { type: "rule", ref: "R-SNC-003", subScore: "entity", observed: "Sponsor linked to 2-hop sanctioned entity", contribution: 32, source: "OpenSanctions", confidence: "High" },
      { type: "rule", ref: "R-DOC-001", subScore: "document", observed: "Passport format inconsistent (expected 1 alpha + 8 digit)", contribution: 14, source: "Document Rules", confidence: "High" },
    ]),
  rec("rec-000137", "API_PNR", "Noor F. Al-Hakim", "نور الحكيم", "IRQ", "iq", "BGW", "IA", "IA207", "2026-04-18T14:40:00Z", null, "Tourist Single-Entry",
    { sanctions: 4, geopolitical: 56, biosecurity: 10, routing: 26, entity: 16, document: 10 },
    [
      { type: "rule", ref: "R-GEO-001", subScore: "geopolitical", observed: "Conflict intensity 128", contribution: 38, source: "GDELT", confidence: "Medium-High" },
      { type: "rule", ref: "R-GEO-002", subScore: "geopolitical", observed: "Advisory level 3", contribution: 20, source: "Advisories", confidence: "High" },
    ]),
  rec("rec-000138", "ETA", "Stefan K. Larsson",  "ستيفان لارسون", "SWE", "se", "ARN", "SK", "SK101", "2026-04-18T15:55:00Z", "Nordic Tech Solutions", "Business Single-Entry",
    { sanctions: 0, geopolitical: 4, biosecurity: 2, routing: 6, entity: 4, document: 2 },
    []),
];

export const SCORED_RECORDS: ScoredRecord[] = [...demoScenarios, ...additionalRecords];

// ─────────────────────────────────────────────────────────────────────────
// Pipeline throughput (for Overview KPIs + chart)
// ─────────────────────────────────────────────────────────────────────────

export interface ThroughputPoint {
  hour: string; // HH:00
  scored: number;
  flagged: number;
}

export const THROUGHPUT_24H: ThroughputPoint[] = [
  { hour: "12:00", scored: 842, flagged: 24 },
  { hour: "13:00", scored: 918, flagged: 31 },
  { hour: "14:00", scored: 1042, flagged: 28 },
  { hour: "15:00", scored: 1189, flagged: 42 },
  { hour: "16:00", scored: 1276, flagged: 51 },
  { hour: "17:00", scored: 1312, flagged: 46 },
  { hour: "18:00", scored: 1208, flagged: 38 },
  { hour: "19:00", scored: 1147, flagged: 35 },
  { hour: "20:00", scored: 1056, flagged: 30 },
  { hour: "21:00", scored: 952, flagged: 28 },
  { hour: "22:00", scored: 864, flagged: 26 },
  { hour: "23:00", scored: 742, flagged: 19 },
  { hour: "00:00", scored: 612, flagged: 14 },
  { hour: "01:00", scored: 524, flagged: 11 },
  { hour: "02:00", scored: 466, flagged: 9 },
  { hour: "03:00", scored: 432, flagged: 7 },
  { hour: "04:00", scored: 492, flagged: 10 },
  { hour: "05:00", scored: 624, flagged: 15 },
  { hour: "06:00", scored: 782, flagged: 22 },
  { hour: "07:00", scored: 938, flagged: 29 },
  { hour: "08:00", scored: 1104, flagged: 34 },
  { hour: "09:00", scored: 1238, flagged: 41 },
  { hour: "10:00", scored: 1324, flagged: 48 },
  { hour: "11:00", scored: 1396, flagged: 53 },
];

// ─────────────────────────────────────────────────────────────────────────
// Aggregates (for Overview KPI strip)
// ─────────────────────────────────────────────────────────────────────────

export const aggregate = () => {
  const total24h = THROUGHPUT_24H.reduce((s, p) => s + p.scored, 0);
  const flagged24h = THROUGHPUT_24H.reduce((s, p) => s + p.flagged, 0);
  const avgScore = Math.round(
    SCORED_RECORDS.reduce((s, r) => s + r.unifiedScore, 0) / SCORED_RECORDS.length,
  );
  const healthy = OSINT_SOURCES.filter((s) => s.status === "healthy").length;
  const degraded = OSINT_SOURCES.filter((s) => s.status === "degraded" || s.status === "stale").length;
  const down = OSINT_SOURCES.filter((s) => s.status === "down").length;
  return {
    total24h,
    flagged24h,
    flagRate: ((flagged24h / total24h) * 100).toFixed(2),
    avgScore,
    sourcesHealthy: healthy,
    sourcesDegraded: degraded,
    sourcesDown: down,
    sourcesTotal: OSINT_SOURCES.length,
  };
};
