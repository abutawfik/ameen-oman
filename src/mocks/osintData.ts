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

// ─────────────────────────────────────────────────────────────────────────
// Risk Engine Home — role-based dashboards mock extensions
// All net-new, scoped to the home dashboard (analyst/supervisor/manager views).
// Consumed by src/pages/dashboard/components/home/*.
// ─────────────────────────────────────────────────────────────────────────

// ─── Team roster (for Supervisor workload panel) ─────────────────────────
export interface AnalystWorkload {
  id: string;
  name: string;
  nameAr: string;
  avatarInitials: string;
  status: "on_shift" | "break" | "off";
  openAlerts: number;
  ackedToday: number;
  closedToday: number;
  avgResponseMins: number; // lower = better
  slaMetPct: number;        // 0-100
}

export const TEAM_ROSTER: AnalystWorkload[] = [
  { id: "u-001", name: "Ahmed Al-Amri",       nameAr: "أحمد العامري",    avatarInitials: "AA", status: "on_shift", openAlerts: 6, ackedToday: 18, closedToday: 11, avgResponseMins: 3.4, slaMetPct: 96 },
  { id: "u-002", name: "Fatima Al-Mansoori",  nameAr: "فاطمة المنصوري",  avatarInitials: "FM", status: "on_shift", openAlerts: 4, ackedToday: 22, closedToday: 14, avgResponseMins: 2.8, slaMetPct: 98 },
  { id: "u-003", name: "Omar Z. Qureshi",     nameAr: "عمر قريشي",        avatarInitials: "OQ", status: "on_shift", openAlerts: 9, ackedToday: 15, closedToday: 8,  avgResponseMins: 5.1, slaMetPct: 88 },
  { id: "u-004", name: "Leila D. Benaissa",   nameAr: "ليلى بن عيسى",     avatarInitials: "LB", status: "on_shift", openAlerts: 3, ackedToday: 19, closedToday: 12, avgResponseMins: 3.0, slaMetPct: 94 },
  { id: "u-005", name: "Hasan M. Al-Bakri",   nameAr: "حسن البكري",       avatarInitials: "HB", status: "break",    openAlerts: 5, ackedToday: 12, closedToday: 7,  avgResponseMins: 4.2, slaMetPct: 90 },
  { id: "u-006", name: "Noor F. Al-Hakim",    nameAr: "نور الحكيم",       avatarInitials: "NH", status: "on_shift", openAlerts: 2, ackedToday: 20, closedToday: 15, avgResponseMins: 2.6, slaMetPct: 99 },
  { id: "u-007", name: "Mohamed O. El-Sayed", nameAr: "محمد السيد",       avatarInitials: "ME", status: "off",      openAlerts: 0, ackedToday: 0,  closedToday: 0,  avgResponseMins: 0,   slaMetPct: 92 },
  { id: "u-008", name: "Khaled A. Saleh",     nameAr: "خالد صالح",        avatarInitials: "KS", status: "on_shift", openAlerts: 7, ackedToday: 14, closedToday: 9,  avgResponseMins: 4.7, slaMetPct: 86 },
];

// ─── Personal queue (for Analyst home) ───────────────────────────────────
export interface PersonalQueueItem {
  id: string;
  type: "alert" | "case_note" | "reassignment";
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  title: string;
  titleAr: string;
  subject: string;
  slaDeadline: string; // ISO
  createdAt: string;
  linkedRecordId?: string;
}

// NOTE: SLA deadlines seeded as offsets from build time so countdowns stay fresh in demo.
const nowMs = Date.now();
const mins = (m: number) => new Date(nowMs + m * 60_000).toISOString();
const minsAgo = (m: number) => new Date(nowMs - m * 60_000).toISOString();

export const PERSONAL_QUEUE: PersonalQueueItem[] = [
  { id: "pq-001", type: "alert",        severity: "CRITICAL", title: "Sponsor 2-hop match on sanctions graph", titleAr: "تطابق الكفيل على درجتين مع قائمة العقوبات", subject: "Mikhail V. Petrov",   slaDeadline: mins(3),   createdAt: minsAgo(12), linkedRecordId: "demo-highrisk-sponsor" },
  { id: "pq-002", type: "alert",        severity: "HIGH",     title: "Conflict-zone origin + advisory L4",     titleAr: "منشأ نزاع + تحذير مستوى 4",                 subject: "Hasan M. Al-Bakri",   slaDeadline: mins(8),   createdAt: minsAgo(5),  linkedRecordId: "rec-000131" },
  { id: "pq-003", type: "case_note",    severity: "MEDIUM",   title: "Routing anomaly confirmed, ready to close",titleAr: "تأكد شذوذ المسار، جاهز للإغلاق",            subject: "Leila D. Benaissa",   slaDeadline: mins(24),  createdAt: minsAgo(34), linkedRecordId: "demo-anomaly" },
  { id: "pq-004", type: "alert",        severity: "HIGH",     title: "Origin country advisory escalated to L3",titleAr: "تم تصعيد تحذير بلد المنشأ إلى المستوى 3",    subject: "Yasir A. Karim",      slaDeadline: mins(41),  createdAt: minsAgo(18), linkedRecordId: "demo-borderline" },
  { id: "pq-005", type: "reassignment", severity: "MEDIUM",   title: "Reassigned from Omar — biosec context",  titleAr: "أعيد تعيينه من عمر — سياق بيولوجي",          subject: "Sarah M. Nguyen",     slaDeadline: mins(62),  createdAt: minsAgo(41), linkedRecordId: "demo-health" },
  { id: "pq-006", type: "alert",        severity: "LOW",      title: "Document format check pending",          titleAr: "فحص تنسيق المستند معلّق",                    subject: "Amr H. Barakat",      slaDeadline: mins(95),  createdAt: minsAgo(21), linkedRecordId: "rec-000136" },
  { id: "pq-007", type: "case_note",    severity: "LOW",      title: "Second-opinion requested on routing",    titleAr: "طُلب رأي ثانٍ بشأن المسار",                  subject: "Elena S. Marković",   slaDeadline: mins(118), createdAt: minsAgo(56), linkedRecordId: "rec-000128" },
];

// ─── Escalations log (for Supervisor) ────────────────────────────────────
export interface EscalationEntry {
  id: string;
  escalatedAt: string;
  fromAnalystId: string;
  toRole: "supervisor" | "manager";
  caseId: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  reason: string;
  reasonAr: string;
  status: "pending" | "reviewed" | "actioned";
}

export const RECENT_ESCALATIONS: EscalationEntry[] = [
  { id: "esc-001", escalatedAt: minsAgo(4),   fromAnalystId: "u-003", toRole: "supervisor", caseId: "demo-highrisk-sponsor", severity: "CRITICAL", reason: "Sponsor graph 2-hop to EU-sanctioned entity — needs supervisor sign-off", reasonAr: "الكفيل ضمن درجتين من كيان خاضع للعقوبات — يتطلب موافقة المشرف", status: "pending" },
  { id: "esc-002", escalatedAt: minsAgo(17),  fromAnalystId: "u-008", toRole: "supervisor", caseId: "rec-000131",            severity: "HIGH",     reason: "Advisory escalation + conflict intensity — deny recommended", reasonAr: "تصعيد تحذيري + كثافة نزاع — يُوصى بالرفض", status: "reviewed" },
  { id: "esc-003", escalatedAt: minsAgo(38),  fromAnalystId: "u-004", toRole: "manager",    caseId: "demo-anomaly",          severity: "HIGH",     reason: "Anomaly cluster spanning 3 PNRs, possible trafficking pattern",          reasonAr: "تجمّع شذوذ يغطي 3 حجوزات، نمط تهريب محتمل",     status: "actioned" },
  { id: "esc-004", escalatedAt: minsAgo(72),  fromAnalystId: "u-005", toRole: "supervisor", caseId: "rec-000136",            severity: "MEDIUM",   reason: "Document format flag + sponsor corporate gap",                             reasonAr: "علامة تنسيق المستند + فجوة كيان الكفيل",           status: "reviewed" },
  { id: "esc-005", escalatedAt: minsAgo(104), fromAnalystId: "u-003", toRole: "supervisor", caseId: "rec-000129",            severity: "HIGH",     reason: "Sponsor 2-hop match, originating from IKA",                                reasonAr: "تطابق كفيل على درجتين، منشأ من طهران",             status: "actioned" },
  { id: "esc-006", escalatedAt: minsAgo(148), fromAnalystId: "u-001", toRole: "supervisor", caseId: "rec-000137",            severity: "MEDIUM",   reason: "Conflict intensity 128 + advisory L3",                                     reasonAr: "كثافة نزاع 128 + تحذير مستوى 3",                 status: "actioned" },
  { id: "esc-007", escalatedAt: minsAgo(195), fromAnalystId: "u-002", toRole: "manager",    caseId: "demo-health",           severity: "MEDIUM",   reason: "Biosec outbreak overlap during peak-season",                               reasonAr: "تداخل تفشٍ حيوي خلال الذروة",                    status: "actioned" },
  { id: "esc-008", escalatedAt: minsAgo(260), fromAnalystId: "u-006", toRole: "supervisor", caseId: "rec-000128",            severity: "MEDIUM",   reason: "Rare origin-nationality combination, second opinion requested",            reasonAr: "مزيج منشأ-جنسية نادر، طُلب رأي ثانٍ",              status: "actioned" },
];

// ─── Origin-country risk (for map + league table) ────────────────────────
export interface OriginRisk {
  iso2: string; // lowercase
  iso3: string;
  nameEn: string;
  nameAr: string;
  arrivals24h: number;
  flagged24h: number;
  avgScore: number;
  topBand: RiskBand;
  // Optional centroid (lon, lat) for bubble rendering on the map.
  lon: number;
  lat: number;
}

const bandOf = (score: number): RiskBand => {
  if (score >= 80) return "critical";
  if (score >= 65) return "high";
  if (score >= 45) return "elevated";
  if (score >= 25) return "borderline";
  return "low";
};

const mkOrigin = (
  iso2: string, iso3: string, nameEn: string, nameAr: string,
  arrivals24h: number, flagged24h: number, avgScore: number,
  lon: number, lat: number,
): OriginRisk => ({
  iso2, iso3, nameEn, nameAr, arrivals24h, flagged24h, avgScore, topBand: bandOf(avgScore), lon, lat,
});

export const ORIGIN_RISK: OriginRisk[] = [
  // GCC + Oman neighbourhood
  mkOrigin("ae", "ARE", "United Arab Emirates", "الإمارات",        1420, 18, 14, 54.37, 24.47),
  mkOrigin("sa", "SAU", "Saudi Arabia",         "السعودية",         1180, 24, 22, 45.07, 23.88),
  mkOrigin("qa", "QAT", "Qatar",                "قطر",              420,  5,  16, 51.18, 25.35),
  mkOrigin("kw", "KWT", "Kuwait",               "الكويت",           380,  7,  19, 47.48, 29.31),
  mkOrigin("bh", "BHR", "Bahrain",              "البحرين",          210,  3,  17, 50.55, 26.07),
  // MENA — higher risk
  mkOrigin("ye", "YEM", "Yemen",                "اليمن",            142, 62, 74, 48.52, 15.55),
  mkOrigin("sy", "SYR", "Syria",                "سوريا",             88, 48, 82, 38.99, 34.80),
  mkOrigin("iq", "IRQ", "Iraq",                 "العراق",           186, 58, 66, 43.67, 33.22),
  mkOrigin("ir", "IRN", "Iran",                 "إيران",            312, 84, 68, 53.68, 32.43),
  mkOrigin("ly", "LBY", "Libya",                "ليبيا",             72, 34, 71, 17.23, 26.34),
  mkOrigin("sd", "SDN", "Sudan",                "السودان",           96, 38, 69, 30.22, 12.86),
  mkOrigin("eg", "EGY", "Egypt",                "مصر",              620, 24, 28, 30.80, 26.82),
  mkOrigin("jo", "JOR", "Jordan",               "الأردن",           240, 11, 26, 36.23, 30.59),
  mkOrigin("lb", "LBN", "Lebanon",              "لبنان",            184, 22, 44, 35.86, 33.85),
  mkOrigin("dz", "DZA", "Algeria",              "الجزائر",          162, 14, 34, 1.66,  28.03),
  mkOrigin("ma", "MAR", "Morocco",              "المغرب",           210, 8,  24, -7.09, 31.79),
  mkOrigin("tn", "TUN", "Tunisia",              "تونس",              118, 6,  28, 9.54,  33.89),
  // South Asia
  mkOrigin("pk", "PAK", "Pakistan",             "باكستان",          820, 58, 48, 69.35, 30.37),
  mkOrigin("in", "IND", "India",                "الهند",            2240, 42, 22, 78.96, 20.59),
  mkOrigin("bd", "BGD", "Bangladesh",           "بنغلاديش",         640, 28, 32, 90.36, 23.68),
  mkOrigin("lk", "LKA", "Sri Lanka",            "سريلانكا",         220, 8,  24, 80.77, 7.87),
  mkOrigin("np", "NPL", "Nepal",                "نيبال",            180, 6,  22, 84.12, 28.39),
  mkOrigin("af", "AFG", "Afghanistan",          "أفغانستان",         58, 34, 72, 67.70, 33.93),
  // South-East Asia
  mkOrigin("ph", "PHL", "Philippines",          "الفلبين",          560, 16, 22, 121.77, 12.87),
  mkOrigin("id", "IDN", "Indonesia",            "إندونيسيا",        380, 10, 20, 113.92, -0.78),
  mkOrigin("vn", "VNM", "Vietnam",              "فيتنام",            180, 18, 48, 108.27, 14.06),
  mkOrigin("th", "THA", "Thailand",             "تايلاند",           240, 8,  22, 100.99, 15.87),
  mkOrigin("my", "MYS", "Malaysia",             "ماليزيا",          148, 4,  18, 101.97, 4.21),
  // Africa
  mkOrigin("ng", "NGA", "Nigeria",              "نيجيريا",          128, 14, 36, 8.67,  9.08),
  mkOrigin("ke", "KEN", "Kenya",                "كينيا",             94, 6,  24, 37.90, -0.02),
  mkOrigin("et", "ETH", "Ethiopia",             "إثيوبيا",           78, 8,  32, 40.49, 9.15),
  mkOrigin("so", "SOM", "Somalia",              "الصومال",           42, 22, 74, 46.20, 5.15),
  mkOrigin("za", "ZAF", "South Africa",         "جنوب أفريقيا",     104, 4,  18, 22.94, -30.56),
  // Europe
  mkOrigin("gb", "GBR", "United Kingdom",       "المملكة المتحدة",  620, 8,  14, -3.44, 55.38),
  mkOrigin("de", "DEU", "Germany",              "ألمانيا",          440, 6,  12, 10.45, 51.17),
  mkOrigin("fr", "FRA", "France",               "فرنسا",            420, 8,  16, 2.21,  46.23),
  mkOrigin("it", "ITA", "Italy",                "إيطاليا",          260, 5,  14, 12.57, 41.87),
  mkOrigin("es", "ESP", "Spain",                "إسبانيا",          220, 4,  14, -3.75, 40.46),
  mkOrigin("nl", "NLD", "Netherlands",          "هولندا",           160, 3,  12, 5.29,  52.13),
  mkOrigin("ru", "RUS", "Russia",               "روسيا",            180, 58, 62, 105.32, 61.52),
  mkOrigin("rs", "SRB", "Serbia",               "صربيا",             68, 10, 38, 21.01, 44.02),
  mkOrigin("tr", "TUR", "Turkey",               "تركيا",             480, 18, 32, 35.24, 38.96),
  mkOrigin("ua", "UKR", "Ukraine",              "أوكرانيا",          92, 14, 52, 31.17, 48.38),
  // East Asia
  mkOrigin("cn", "CHN", "China",                "الصين",            920, 10, 14, 104.20, 35.86),
  mkOrigin("jp", "JPN", "Japan",                "اليابان",          340, 3,  10, 138.25, 36.20),
  mkOrigin("kr", "KOR", "South Korea",          "كوريا الجنوبية",   260, 4,  12, 127.77, 35.91),
  // Americas
  mkOrigin("us", "USA", "United States",        "الولايات المتحدة",  620, 12, 14, -95.71, 37.09),
  mkOrigin("ca", "CAN", "Canada",               "كندا",             220, 4,  12, -106.35, 56.13),
  mkOrigin("br", "BRA", "Brazil",               "البرازيل",         140, 5,  18, -51.92, -14.23),
  mkOrigin("mx", "MEX", "Mexico",               "المكسيك",            84, 6,  22, -102.55, 23.63),
  // Oceania
  mkOrigin("au", "AUS", "Australia",            "أستراليا",          220, 4,  12, 133.77, -25.27),
];

// ─── 30-day program KPIs (for Manager) ────────────────────────────────────
export interface ProgramKpiDaily {
  date: string; // YYYY-MM-DD
  cases_closed: number;
  confirmed_threats: number;
  false_positives: number;
  avg_score: number;
  unique_entities: number;
}

const buildProgramKpis = (): ProgramKpiDaily[] => {
  const out: ProgramKpiDaily[] = [];
  const today = new Date("2026-04-17T00:00:00Z");
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86_400_000);
    const iso = d.toISOString().slice(0, 10);
    // Deterministic pseudo-noise so chart has shape without Math.random instability.
    const seed = i * 7.3 + 2.1;
    const wave = Math.sin(seed / 4) * 0.4 + Math.cos(seed / 6.5) * 0.3;
    const closed = Math.round(58 + wave * 18 + (i % 7 === 0 ? -12 : 0));
    const threats = Math.max(1, Math.round(closed * (0.18 + Math.sin(seed / 3) * 0.04)));
    const fp = Math.max(1, Math.round(closed * (0.22 + Math.cos(seed / 5) * 0.06)));
    const avg = Math.round(42 + wave * 10);
    const entities = Math.round(1200 + wave * 300 + (i % 7 === 0 ? -180 : 0));
    out.push({ date: iso, cases_closed: closed, confirmed_threats: threats, false_positives: fp, avg_score: avg, unique_entities: entities });
  }
  return out;
};

export const PROGRAM_KPIS_30D: ProgramKpiDaily[] = buildProgramKpis();

export interface ContributionMix {
  day: string;
  rules: number;
  ml: number;
  watchlist: number;
  manual: number;
}

export const CONTRIBUTION_MIX_7D: ContributionMix[] = [
  { day: "Thu", rules: 142, ml: 98,  watchlist: 46, manual: 18 },
  { day: "Fri", rules: 158, ml: 112, watchlist: 52, manual: 22 },
  { day: "Sat", rules: 126, ml: 88,  watchlist: 38, manual: 16 },
  { day: "Sun", rules: 134, ml: 94,  watchlist: 42, manual: 14 },
  { day: "Mon", rules: 172, ml: 124, watchlist: 58, manual: 24 },
  { day: "Tue", rules: 168, ml: 118, watchlist: 54, manual: 20 },
  { day: "Wed", rules: 184, ml: 136, watchlist: 62, manual: 26 },
];

// ─── Model governance snapshot ────────────────────────────────────────────
export const MODEL_GOVERNANCE = {
  activeVersion: "mvp-0.3.1",
  previousVersion: "mvp-0.3.0",
  daysInProduction: 14,
  drift: {
    status: "ok" as "ok" | "watch" | "breach",
    scoreDistShift: 0.12,
    nationalityFairnessFlags: 0,
  },
  lastRetrain: "2026-03-18",
  nextScheduledReview: "2026-05-01",
};

// ─── SLA rollup (for Supervisor + Manager) ────────────────────────────────
export interface SlaSummary {
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  met: number;
  breached: number;
  inFlight: number;
}

export const SLA_SUMMARY_24H: SlaSummary[] = [
  { severity: "CRITICAL", met: 14, breached: 1, inFlight: 3 },
  { severity: "HIGH",     met: 42, breached: 4, inFlight: 8 },
  { severity: "MEDIUM",   met: 96, breached: 6, inFlight: 12 },
  { severity: "LOW",      met: 128, breached: 2, inFlight: 6 },
];

// Monthly aggregate — same shape, used by Manager "Operational SLAs" panel.
export const SLA_SUMMARY_30D: SlaSummary[] = [
  { severity: "CRITICAL", met: 412,  breached: 18, inFlight: 0 },
  { severity: "HIGH",     met: 1184, breached: 62, inFlight: 0 },
  { severity: "MEDIUM",   met: 2864, breached: 104, inFlight: 0 },
  { severity: "LOW",      met: 3968, breached: 52,  inFlight: 0 },
];
