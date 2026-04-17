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
  | "behavioral"
  | "declaration"
  | "entity"
  | "presence"
  | "document";

export type DecisionPoint = "ETA" | "API_PNR";
export type RiskBand = "low" | "borderline" | "elevated" | "high" | "critical";
export type SourceConfidence = "High" | "Medium-High" | "Medium" | "Low";
export type SourceStatus = "healthy" | "degraded" | "stale" | "down";
export type Classification = "public" | "internal" | "restricted" | "classified";

export const CLASSIFICATION_META: Record<Classification, { color: string; bg: string; label: string; labelAr: string }> = {
  // Al-Ameen brand v1.0 classification palette — semantic tokens
  public:     { color: "#4A7AA8", bg: "rgba(74,122,168,0.1)",  label: "PUBLIC",     labelAr: "عام" },      // ocean info
  internal:   { color: "#4A8E3A", bg: "rgba(74,142,58,0.1)",   label: "INTERNAL",   labelAr: "داخلي" },    // olive
  restricted: { color: "#B88A3C", bg: "rgba(184,138,60,0.12)", label: "RESTRICTED", labelAr: "مقيّد" },    // frankincense gold — ceremonial
  classified: { color: "#8A1F3C", bg: "rgba(201,74,94,0.1)",   label: "CLASSIFIED", labelAr: "سرّي" },     // oman red
};

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
    defaultWeight: 15,
    weight: 15,
    color: "#C94A5E",
    icon: "ri-shield-cross-line",
    primarySources: ["OpenSanctions"],
    method: "Deterministic match + fuzzy entity resolution",
  },
  {
    key: "geopolitical",
    labelEn: "Geopolitical Origin",
    labelAr: "المخاطر الجيوسياسية",
    defaultWeight: 12,
    weight: 12,
    color: "#C98A1B",
    icon: "ri-global-line",
    primarySources: ["GDELT", "ACLED", "Advisories"],
    method: "Rolling 7-day conflict intensity score",
  },
  {
    key: "biosecurity",
    labelEn: "Biosecurity",
    labelAr: "الأمن الحيوي",
    defaultWeight: 5,
    weight: 5,
    color: "#FACC15",
    icon: "ri-heart-pulse-line",
    primarySources: ["WHO", "ECDC", "ReliefWeb"],
    method: "Outbreak origin windowing",
  },
  {
    key: "routing",
    labelEn: "Routing Anomaly",
    labelAr: "شذوذ المسار",
    defaultWeight: 12,
    weight: 12,
    color: "#6B4FAE",
    icon: "ri-route-line",
    primarySources: ["OpenSky", "flight history"],
    method: "Isolation Forest (unsupervised)",
  },
  {
    key: "behavioral",
    labelEn: "Behavioral History",
    labelAr: "السجل السلوكي",
    defaultWeight: 15,
    weight: 15,
    color: "#EC4899",
    icon: "ri-user-heart-line",
    primarySources: ["eVisa history", "Entry/Exit", "Historical border"],
    method: "Prior-overstays / visit-cadence / denial count",
  },
  {
    key: "declaration",
    labelEn: "Declaration Match",
    labelAr: "مطابقة الإقرار",
    defaultWeight: 12,
    weight: 12,
    color: "#14B8A6",
    icon: "ri-contacts-book-line",
    primarySources: ["MOL employment", "Hotels", "Municipality"],
    method: "Declared employer / address match score",
  },
  {
    key: "entity",
    labelEn: "Sponsor / Entity",
    labelAr: "الكفيل / الكيان",
    defaultWeight: 10,
    weight: 10,
    color: "#D6B47E",
    icon: "ri-organization-chart",
    primarySources: ["OpenCorporates", "OpenSanctions"],
    method: "Personalized PageRank (decay 0.5)",
  },
  {
    key: "presence",
    labelEn: "Presence Coherence",
    labelAr: "تماسك الحضور",
    defaultWeight: 10,
    weight: 10,
    color: "#F59E0B",
    icon: "ri-time-line",
    primarySources: ["APIS", "Hotels", "Mobile operators", "Car rentals"],
    method: "Cross-stream timeline-gap detection (Model 3)",
  },
  {
    key: "document",
    labelEn: "Document & Identity",
    labelAr: "الوثائق والهوية",
    defaultWeight: 9,
    weight: 9,
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
  sourceType: "osint" | "internal";
  classification: Classification;
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
    color: "#C94A5E",
    sourceType: "osint",
    classification: "public",
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
    color: "#C98A1B",
    sourceType: "osint",
    classification: "public",
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
    color: "#C98A1B",
    sourceType: "osint",
    classification: "public",
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
    sourceType: "osint",
    classification: "public",
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
    sourceType: "osint",
    classification: "public",
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
    color: "#6B4FAE",
    sourceType: "osint",
    classification: "public",
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
    color: "#D6B47E",
    sourceType: "osint",
    classification: "public",
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
    color: "#D6B47E",
    sourceType: "osint",
    classification: "public",
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
    sourceType: "osint",
    classification: "public",
  },
];

// ─────────────────────────────────────────────────────────────────────────
// ROP internal streams (Tech Spec §4.2.1)
// Nine internal data streams the risk engine consumes alongside OSINT.
// ─────────────────────────────────────────────────────────────────────────

export const INTERNAL_STREAMS: OsintSource[] = [
  {
    id: "entry-exit",
    name: "Entry / Exit Records",
    category: "Border movements",
    format: "Internal stream",
    refresh: "Real-time",
    refreshMinutes: 0,
    confidence: "High",
    status: "healthy",
    lastSuccess: "2026-04-17T11:57:18Z",
    lastFailure: null,
    records24h: 34820,
    signalContribution: "Arrival/departure stamps, dwell time, overstays",
    endpoint: "int.rop.om/borders/entry-exit",
    color: "#D6B47E",
    sourceType: "internal",
    classification: "internal",
  },
  {
    id: "apis",
    name: "APIS / Advance Passenger Info",
    category: "Pre-arrival",
    format: "EDIFACT / JSON",
    refresh: "Flight-bound",
    refreshMinutes: 5,
    confidence: "High",
    status: "healthy",
    lastSuccess: "2026-04-17T11:55:02Z",
    lastFailure: null,
    records24h: 28410,
    signalContribution: "Pre-arrival passenger manifests, travel document data",
    endpoint: "int.rop.om/apis/inbound",
    color: "#6B4FAE",
    sourceType: "internal",
    classification: "internal",
  },
  {
    id: "evisa",
    name: "eVisa History",
    category: "Visa issuance",
    format: "Internal stream",
    refresh: "Daily",
    refreshMinutes: 1440,
    confidence: "High",
    status: "healthy",
    lastSuccess: "2026-04-17T03:00:15Z",
    lastFailure: null,
    records24h: 12240,
    signalContribution: "Prior visa denials, renewals, issuance velocity",
    endpoint: "int.rop.om/evisa/history",
    color: "#EC4899",
    sourceType: "internal",
    classification: "internal",
  },
  {
    id: "historical-border",
    name: "Historical Border Data",
    category: "Archive",
    format: "Bulk / warehouse",
    refresh: "Hourly",
    refreshMinutes: 60,
    confidence: "High",
    status: "healthy",
    lastSuccess: "2026-04-17T11:00:00Z",
    lastFailure: null,
    records24h: 182400,
    signalContribution: "Long-horizon pattern baselines (36 months)",
    endpoint: "int.rop.om/warehouse/borders",
    color: "#4ADE80",
    sourceType: "internal",
    classification: "internal",
  },
  {
    id: "hotels",
    name: "Hotel Check-ins",
    category: "Presence",
    format: "Hospitality feed",
    refresh: "Near real-time",
    refreshMinutes: 10,
    confidence: "Medium-High",
    status: "healthy",
    lastSuccess: "2026-04-17T11:50:44Z",
    lastFailure: "2026-04-16T19:12:00Z",
    records24h: 8420,
    signalContribution: "First touchpoint in-country, declared address match",
    endpoint: "int.rop.om/hospitality/checkins",
    color: "#F59E0B",
    sourceType: "internal",
    classification: "internal",
  },
  {
    id: "mobile-ops",
    name: "Mobile Operators",
    category: "Telecom",
    format: "Carrier feed",
    refresh: "Hourly",
    refreshMinutes: 60,
    confidence: "Medium-High",
    status: "healthy",
    lastSuccess: "2026-04-17T11:05:22Z",
    lastFailure: null,
    records24h: 4280,
    signalContribution: "SIM activation time, device-traveler linkage",
    endpoint: "int.rop.om/telecom/sim-activations",
    color: "#C94A5E",
    sourceType: "internal",
    classification: "restricted",
  },
  {
    id: "car-rentals",
    name: "Car Rentals",
    category: "Mobility",
    format: "Operator feed",
    refresh: "Hourly",
    refreshMinutes: 60,
    confidence: "Medium",
    status: "healthy",
    lastSuccess: "2026-04-17T11:10:08Z",
    lastFailure: null,
    records24h: 1240,
    signalContribution: "Vehicle rental first-use, identity cross-check",
    endpoint: "int.rop.om/mobility/rentals",
    color: "#C98A1B",
    sourceType: "internal",
    classification: "internal",
  },
  {
    id: "municipality",
    name: "Municipality Records",
    category: "Address registry",
    format: "Registry feed",
    refresh: "Daily",
    refreshMinutes: 1440,
    confidence: "Medium-High",
    status: "healthy",
    lastSuccess: "2026-04-17T02:30:00Z",
    lastFailure: null,
    records24h: 540,
    signalContribution: "Declared address verification",
    endpoint: "int.rop.om/municipality/addresses",
    color: "#14B8A6",
    sourceType: "internal",
    classification: "internal",
  },
  {
    id: "mol",
    name: "MOL Employment",
    category: "Labour registry",
    format: "MOL feed",
    refresh: "Daily",
    refreshMinutes: 1440,
    confidence: "High",
    status: "healthy",
    lastSuccess: "2026-04-17T02:45:04Z",
    lastFailure: null,
    records24h: 2180,
    signalContribution: "Declared employer validation, work permit status",
    endpoint: "int.rop.om/mol/employment",
    color: "#D6B47E",
    sourceType: "internal",
    classification: "internal",
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
  // ── Tech Spec v1.0 §7 + Appendix B expansion (11 new rules) ─────────────
  {
    id: "R-SNC-004",
    category: "sanctions",
    description: "PEP exposure via OpenSanctions (direct match)",
    descriptionAr: "تعرّض شخصية سياسية عبر OpenSanctions (تطابق مباشر)",
    contribution: 0.8,
    threshold: "PEP list match ≥ 0.90 confidence on name + DOB",
    enabled: true,
    version: "v1.2",
    firesLast24h: 9,
  },
  {
    id: "R-GEO-003",
    category: "geopolitical",
    description: "ACLED armed-conflict event within 50km of origin airport (7d)",
    descriptionAr: "حدث نزاع مسلّح ضمن 50كم من مطار المنشأ خلال 7 أيام (ACLED)",
    contribution: 0.65,
    threshold: "ACLED fatalities > 0 within 50km radius, rolling 7-day window",
    enabled: true,
    version: "v1.1",
    firesLast24h: 48,
  },
  {
    id: "R-GEO-004",
    category: "geopolitical",
    description: "Country travel-advisory level 4 (do not travel)",
    descriptionAr: "تحذير السفر لبلد المنشأ مستوى 4 (لا تسافر)",
    contribution: 0.75,
    threshold: "Advisory level = 4 at scan time",
    enabled: true,
    version: "v1.0",
    firesLast24h: 22,
  },
  {
    id: "R-BIO-002",
    category: "biosecurity",
    description: "ECDC surveillance cluster at origin within outbreak window",
    descriptionAr: "تجمّع مراقبة ECDC عند المنشأ ضمن نافذة التفشي",
    contribution: 0.55,
    threshold: "ECDC cluster status = active and origin country match",
    enabled: true,
    version: "v1.0",
    firesLast24h: 6,
  },
  {
    id: "R-RTE-003",
    category: "routing",
    description: "Routing deviation from historical origin-destination pattern (z>2.5)",
    descriptionAr: "انحراف المسار عن نمط المنشأ-الوجهة التاريخي (z>2.5)",
    contribution: 0.5,
    threshold: "Z-score > 2.5 vs 36-month OD baseline for nationality",
    enabled: true,
    version: "v1.1",
    firesLast24h: 31,
  },
  {
    id: "R-ENT-002",
    category: "entity",
    description: "Sponsor has >10 unrelated applicants in rolling 180 days",
    descriptionAr: "الكفيل لديه أكثر من 10 مقدّمين غير مرتبطين خلال 180 يوماً",
    contribution: 0.6,
    threshold: "distinct_applicant_count(sponsor, 180d) > 10",
    enabled: true,
    version: "v1.0",
    firesLast24h: 14,
  },
  {
    id: "R-ENT-003",
    category: "entity",
    description: "Sponsor corporate record missing in OpenCorporates",
    descriptionAr: "سجل الكفيل مفقود في OpenCorporates",
    contribution: 0.45,
    threshold: "OpenCorporates lookup returns 0 results for sponsor name",
    enabled: true,
    version: "v1.0",
    firesLast24h: 17,
  },
  {
    id: "R-BEH-001",
    category: "behavioral",
    description: "Prior overstay count ≥ 2 per Entry/Exit history",
    descriptionAr: "عدد تجاوزات الإقامة السابقة ≥ 2 حسب سجل الدخول/الخروج",
    contribution: 0.7,
    threshold: "overstay_count(traveler, all-time) ≥ 2",
    enabled: true,
    version: "v1.1",
    firesLast24h: 12,
  },
  {
    id: "R-BEH-002",
    category: "behavioral",
    description: "Visa denial count ≥ 1 in last 24 months",
    descriptionAr: "عدد رفضات التأشيرة ≥ 1 خلال 24 شهراً",
    contribution: 0.55,
    threshold: "denial_count(traveler, 24mo) ≥ 1",
    enabled: true,
    version: "v1.0",
    firesLast24h: 21,
  },
  {
    id: "R-DEC-001",
    category: "declaration",
    description: "Declared employer not found in MOL active records",
    descriptionAr: "صاحب العمل المُعلن غير موجود في سجلات وزارة العمل النشطة",
    contribution: 0.6,
    threshold: "declared_employer ∉ MOL active registry",
    enabled: true,
    version: "v1.0",
    firesLast24h: 19,
  },
  {
    id: "R-DEC-002",
    category: "declaration",
    description: "Declared address mismatch vs hotel check-in address",
    descriptionAr: "عدم تطابق العنوان المُعلن مع عنوان تسجيل الفندق",
    contribution: 0.5,
    threshold: "fuzzy_match(declared_address, hotel_address) < 0.70",
    enabled: true,
    version: "v1.0",
    firesLast24h: 26,
  },
  {
    id: "R-PRE-001",
    category: "presence",
    description: "APIS arrival → first hotel check-in gap > 48 hours (anomalous)",
    descriptionAr: "فجوة وصول APIS → أول فندق > 48 ساعة (شاذة)",
    contribution: 0.65,
    threshold: "hours(apis_arrival → first_hotel_checkin) > 48",
    enabled: true,
    version: "v1.1",
    firesLast24h: 11,
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
  // B2 — classification + coverage metadata
  classification: Classification;
  sourcesAvailable: string[];
  sourcesUnavailable: string[];
  rulesSkipped: string[];
}

const band = (score: number): RiskBand => {
  if (score >= 80) return "critical";
  if (score >= 65) return "high";
  if (score >= 45) return "elevated";
  if (score >= 25) return "borderline";
  return "low";
};

export const SCORE_BAND_META: Record<RiskBand, { labelEn: string; labelAr: string; color: string }> = {
  // Al-Ameen brand v1.0 risk palette (from tokens.css)
  critical:   { labelEn: "CRITICAL",   labelAr: "حرج",     color: "#8A1F3C" }, // oman red
  high:       { labelEn: "HIGH",       labelAr: "مرتفع",   color: "#C94A5E" }, // ember
  elevated:   { labelEn: "ELEVATED",   labelAr: "مرتفع جزئياً", color: "#C98A1B" }, // amber
  borderline: { labelEn: "BORDERLINE", labelAr: "حدّي",    color: "#C98A1B" }, // amber (same amber band, label differs)
  low:        { labelEn: "LOW",        labelAr: "منخفض",   color: "#4A8E3A" }, // olive
};

// Default sources expected by every record — used for sourcesAvailable default.
const DEFAULT_SOURCES_EXPECTED = [
  "OpenSanctions", "GDELT", "ACLED", "WHO", "ECDC", "OpenSky", "Advisories", "OpenCorporates",
];

// Compute unified score from a full 9-dim subScores map using the defaults.
const computeUnified = (subScores: Record<SubScoreKey, number>): number =>
  Math.round(
    DEFAULT_SUB_SCORE_WEIGHTS.reduce(
      (sum, w) => sum + subScores[w.key] * (w.defaultWeight / 100),
      0,
    ),
  );

// Legacy 6-dim subScores shape — older call sites pass this; we fill in
// sensible values for the 3 new dimensions from the existing ones.
type LegacySubScores = {
  sanctions: number;
  geopolitical: number;
  biosecurity: number;
  routing: number;
  entity: number;
  document: number;
  // optional overrides for the 3 new dimensions
  behavioral?: number;
  declaration?: number;
  presence?: number;
};

interface RecMeta {
  classification?: Classification;
  sourcesAvailable?: string[];
  sourcesUnavailable?: string[];
  rulesSkipped?: string[];
}

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
  legacySubs: LegacySubScores,
  contributions: ScoreContribution[],
  demoScenario?: string,
  meta?: RecMeta,
): ScoredRecord => {
  // Derive the 3 new sub-scores from existing ones unless explicitly set.
  // Behavioral tracks entity/sanctions pressure, declaration mirrors entity/document
  // gaps, presence nudges upward on routing anomalies.
  const behavioral = legacySubs.behavioral ??
    Math.min(90, Math.round(legacySubs.entity * 0.25 + legacySubs.sanctions * 0.15 + 4));
  const declaration = legacySubs.declaration ??
    Math.min(90, Math.round(legacySubs.entity * 0.2 + legacySubs.document * 0.35 + 3));
  const presence = legacySubs.presence ??
    Math.min(90, Math.round(legacySubs.routing * 0.2 + legacySubs.biosecurity * 0.1 + 5));

  const subScores: Record<SubScoreKey, number> = {
    sanctions: legacySubs.sanctions,
    geopolitical: legacySubs.geopolitical,
    biosecurity: legacySubs.biosecurity,
    routing: legacySubs.routing,
    behavioral,
    declaration,
    entity: legacySubs.entity,
    presence,
    document: legacySubs.document,
  };

  const unified = computeUnified(subScores);
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
    classification: meta?.classification ?? "internal",
    sourcesAvailable: meta?.sourcesAvailable ?? DEFAULT_SOURCES_EXPECTED,
    sourcesUnavailable: meta?.sourcesUnavailable ?? [],
    rulesSkipped: meta?.rulesSkipped ?? [],
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
    { sanctions: 2, geopolitical: 8, biosecurity: 5, routing: 12, entity: 6, document: 4, behavioral: 6, declaration: 8, presence: 7 },
    [
      { type: "rule", ref: "R-GEO-002", subScore: "geopolitical", observed: "Advisory level 2 (normal precautions)", contribution: 6, source: "Travel Advisories", confidence: "High" },
      { type: "ml_feature", ref: "route_common_pattern", subScore: "routing", observed: "Origin-destination common for nationality (p>0.95)", contribution: 2, source: "OpenSky", confidence: "Medium" },
      { type: "ml_feature", ref: "prior_cadence", subScore: "behavioral", observed: "4 prior business visits, all clean", contribution: 3, source: "eVisa history", confidence: "High" },
    ],
    "low-risk-routine",
    { classification: "internal" },
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
    { sanctions: 18, geopolitical: 68, biosecurity: 32, routing: 42, entity: 24, document: 18, behavioral: 44, declaration: 38, presence: 36 },
    [
      { type: "rule", ref: "R-GEO-001", subScore: "geopolitical", observed: "GDELT conflict intensity 164 (> 120)", contribution: 48, source: "GDELT", confidence: "Medium-High" },
      { type: "rule", ref: "R-GEO-002", subScore: "geopolitical", observed: "Advisory level 3 — reconsider travel", contribution: 22, source: "Travel Advisories", confidence: "High" },
      { type: "rule", ref: "R-TMP-001", subScore: "geopolitical", observed: "Advisory escalation 9 days ago", contribution: 16, source: "Travel Advisories", confidence: "High" },
      { type: "ml_feature", ref: "nationality_origin_rarity", subScore: "routing", observed: "Origin within top-20 for nationality", contribution: 12, source: "OpenSky", confidence: "Medium" },
      { type: "ml_feature", ref: "declared_address_match", subScore: "declaration", observed: "Declared hotel address partial match (0.74)", contribution: 14, source: "Hotels", confidence: "Medium-High" },
    ],
    "borderline-context",
    { classification: "internal", rulesSkipped: ["R-DEC-001"] },
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
    { sanctions: 82, geopolitical: 72, biosecurity: 12, routing: 48, entity: 92, document: 36, behavioral: 88, declaration: 78, presence: 52 },
    [
      { type: "rule", ref: "R-SNC-003", subScore: "entity", observed: "Sponsor 2 hops from EU-sanctioned oligarch", contribution: 60, source: "OpenSanctions + OpenCorporates", confidence: "High" },
      { type: "rule", ref: "R-SNC-002", subScore: "sanctions", observed: "Sponsor parent entity on UK sanctions list (pending appeal)", contribution: 54, source: "OpenSanctions", confidence: "High" },
      { type: "rule", ref: "R-GEO-002", subScore: "geopolitical", observed: "Advisory level 3 — travel restrictions", contribution: 28, source: "Travel Advisories", confidence: "High" },
      { type: "ml_feature", ref: "entity_graph_pagerank", subScore: "entity", observed: "Personalized PageRank 0.91 (top 2%)", contribution: 22, source: "Graph Engine", confidence: "High" },
      { type: "ml_feature", ref: "prior_denial_count", subScore: "behavioral", observed: "3 prior visa denials (2024–2025) on same sponsor", contribution: 48, source: "eVisa history", confidence: "High" },
      { type: "rule", ref: "R-DEC-001", subScore: "declaration", observed: "Declared employer does not match MOL record", contribution: 22, source: "MOL employment", confidence: "High" },
    ],
    "high-risk-sponsor",
    { classification: "restricted", rulesSkipped: ["R-BIO-002"] },
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
    { sanctions: 18, geopolitical: 58, biosecurity: 34, routing: 96, entity: 68, document: 44, behavioral: 82, declaration: 86, presence: 96 },
    [
      { type: "ml_feature", ref: "iforest_anomaly", subScore: "routing", observed: "Isolation Forest anomaly_score 0.89", contribution: 56, source: "RoutingAnomalyDetector", confidence: "Medium-High" },
      { type: "rule", ref: "R-RTE-001", subScore: "routing", observed: "Origin CDG rare for DZA→MCT (<1%)", contribution: 28, source: "OpenSky", confidence: "Medium" },
      { type: "rule", ref: "R-RTE-002", subScore: "routing", observed: "3 near-simultaneous PNR records in 3 hours", contribution: 22, source: "PNR", confidence: "High" },
      { type: "ml_feature", ref: "booking_to_departure_days", subScore: "routing", observed: "Booked 11 hours before departure (top 0.5%)", contribution: 12, source: "PNR", confidence: "High" },
      { type: "ml_feature", ref: "presence_gap_apis_hotel", subScore: "presence", observed: "APIS→first hotel gap 62h (typical ≤4h)", contribution: 58, source: "APIS + Hotels", confidence: "High" },
    ],
    "anomaly-driven",
    { classification: "internal", sourcesUnavailable: ["ECDC"], rulesSkipped: ["R-TMP-002", "R-BIO-002"] },
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
    { sanctions: 8, geopolitical: 52, biosecurity: 96, routing: 44, entity: 28, document: 22, behavioral: 38, declaration: 32, presence: 52 },
    [
      { type: "rule", ref: "R-BIO-001", subScore: "biosecurity", observed: "Origin in active avian-influenza outbreak (WHO DON 2026-04-11)", contribution: 62, source: "WHO", confidence: "High" },
      { type: "rule", ref: "R-BIO-001", subScore: "biosecurity", observed: "ECDC surveillance flag: poultry cluster SGN", contribution: 24, source: "ECDC", confidence: "High" },
      { type: "ml_feature", ref: "nationality_origin_rarity", subScore: "routing", observed: "Common routing — no anomaly", contribution: 8, source: "OpenSky", confidence: "Medium" },
    ],
    "health-overlap",
    { classification: "internal" },
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
// Wave 4 · Deliverable 5 — Rasad shadow simulation
// Deterministic synthetic boosts over each scored record. Drives the
// ScatterChart on the OSINT Risk Engine → Rasad tab.
// ─────────────────────────────────────────────────────────────────────────

export interface RasadShadowScore {
  recordId: string;
  travelerName: string;
  classification: Classification;
  osintScore: number;
  rasadScore: number;        // OSINT + simulated classified boost
  delta: number;
  topClassifiedContributor: string;
  topClassifiedContributorAr: string;
}

// Tiny deterministic hash → [0, 1). Keeps the chart stable across reloads.
const seededFraction = (seed: string): number => {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return (h % 1000) / 1000;
};

const RASAD_CONTRIBUTORS_EN = [
  "Rasad: sponsor matched to 2024 intelligence bulletin #IB-0142",
  "Rasad: HUMINT source corroborated travel intent",
  "Rasad: undeclared beneficial owner on sponsor graph",
  "Rasad: device proximity cluster at origin airport",
  "Rasad: prior watchlist hit (sealed, 2023-Q3)",
  "Rasad: classified financial flow to sanctioned intermediary",
  "Rasad: elicitation flag raised by sister-service partner",
  "Rasad: passport biometric overlap with prior alias file",
];

const RASAD_CONTRIBUTORS_AR = [
  "رصد: الكفيل مرتبط بنشرة استخبارات 2024 #IB-0142",
  "رصد: مصدر HUMINT يؤكّد نيّة السفر",
  "رصد: مالك مستتر غير مُعلَن في رسم الكفيل",
  "رصد: تجمّع قرب الأجهزة في مطار المنشأ",
  "رصد: إصابة سابقة في قائمة المراقبة (مختومة 2023-Q3)",
  "رصد: تدفق مالي مُصنَّف إلى وسيط مُعاقَب",
  "رصد: تنبيه استمالة من جهاز شقيق",
  "رصد: تطابق بيومتري في ملف اسم مستعار سابق",
];

export const RASAD_SHADOW_SCORES: RasadShadowScore[] = SCORED_RECORDS.map((r) => {
  // Boost bands per classification — wider range on CLASSIFIED so the shift
  // is visually meaningful, zero on PUBLIC so the identity line stays honest.
  const frac = seededFraction(r.id);
  let boost = 0;
  if (r.classification === "classified") boost = Math.round(12 + frac * 6);       // 12-18
  else if (r.classification === "restricted") boost = Math.round(5 + frac * 5);   // 5-10
  else if (r.classification === "internal") boost = Math.round(frac * 3);         // 0-3
  else boost = 0;                                                                 // public
  const rasadScore = Math.min(100, r.unifiedScore + boost);
  const contributorIdx = Math.floor(frac * RASAD_CONTRIBUTORS_EN.length);
  return {
    recordId: r.id,
    travelerName: r.travelerName,
    classification: r.classification,
    osintScore: r.unifiedScore,
    rasadScore,
    delta: rasadScore - r.unifiedScore,
    topClassifiedContributor: RASAD_CONTRIBUTORS_EN[contributorIdx],
    topClassifiedContributorAr: RASAD_CONTRIBUTORS_AR[contributorIdx],
  };
});

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

// ─────────────────────────────────────────────────────────────────────────
// A2 — Sequence Coherence (Model 3)
// Multi-stream timeline data per traveler. Each touchpoint records when
// the cross-stream signal was observed vs when it was expected (hours
// after APIS arrival).
// ─────────────────────────────────────────────────────────────────────────

export interface SequenceTouchpoint {
  stream: string;            // APIS | Hotel | SIM | Rental | MOL
  icon: string;              // remixicon class
  color: string;             // render color
  labelEn: string;
  labelAr: string;
  occurredAt: string | null; // ISO; null = signal never observed
  expectedWithinHrs: number; // expected hours post-APIS arrival
  observedHrs: number | null;// actual hours post-APIS (derived)
}

export interface SequenceTimeline {
  travelerId: string;
  travelerName: string;
  travelerNameAr: string;
  nationality: string;
  classification: Classification;
  apisArrivalTs: string;
  touchpoints: SequenceTouchpoint[];
  presenceCoherenceScore: number; // 0-100 (higher = more anomalous)
  verdict: "coherent" | "mildly-gapped" | "strongly-gapped" | "missing";
  narrativeEn: string;
  narrativeAr: string;
}

// Helper for building touchpoints with derived observedHrs.
const tp = (
  stream: string,
  icon: string,
  color: string,
  labelEn: string,
  labelAr: string,
  apisIso: string,
  observedIso: string | null,
  expectedWithinHrs: number,
): SequenceTouchpoint => {
  const observedHrs = observedIso === null
    ? null
    : Math.round((new Date(observedIso).getTime() - new Date(apisIso).getTime()) / 3_600_000);
  return { stream, icon, color, labelEn, labelAr, occurredAt: observedIso, expectedWithinHrs, observedHrs };
};

const apis1 = "2026-04-17T04:10:00Z";
const apis2 = "2026-04-17T06:45:00Z";
const apis3 = "2026-04-16T22:00:00Z";
const apis4 = "2026-04-17T01:30:00Z";
const apis5 = "2026-04-16T18:40:00Z";
const apis6 = "2026-04-17T09:15:00Z";

const ICON_APIS   = { icon: "ri-flight-land-line",    color: "#D6B47E" };
const ICON_HOTEL  = { icon: "ri-hotel-line",          color: "#F59E0B" };
const ICON_SIM    = { icon: "ri-sim-card-2-line",     color: "#EC4899" };
const ICON_RENTAL = { icon: "ri-car-line",            color: "#6B4FAE" };
const ICON_MOL    = { icon: "ri-briefcase-4-line",    color: "#14B8A6" };

export const SEQUENCE_TIMELINES: SequenceTimeline[] = [
  // 1. Coherent — everything lands within expected windows
  {
    travelerId: "seq-001",
    travelerName: "James W. Carter",
    travelerNameAr: "جيمس كارتر",
    nationality: "USA",
    classification: "internal",
    apisArrivalTs: apis1,
    touchpoints: [
      tp("APIS",   ICON_APIS.icon,   ICON_APIS.color,   "APIS arrival",     "وصول APIS",       apis1, apis1,                     0),
      tp("Hotel",  ICON_HOTEL.icon,  ICON_HOTEL.color,  "First hotel",      "الفندق الأول",     apis1, "2026-04-17T05:55:00Z",    4),
      tp("SIM",    ICON_SIM.icon,    ICON_SIM.color,    "SIM activation",   "تفعيل الشريحة",   apis1, "2026-04-17T06:20:00Z",    6),
      tp("Rental", ICON_RENTAL.icon, ICON_RENTAL.color, "Vehicle rental",   "تأجير مركبة",      apis1, "2026-04-17T09:45:00Z",   12),
      tp("MOL",    ICON_MOL.icon,    ICON_MOL.color,    "MOL touchpoint",   "بصمة وزارة العمل", apis1, null,                     48),
    ],
    presenceCoherenceScore: 8,
    verdict: "coherent",
    narrativeEn: "All touchpoints land inside expected windows. Business traveler — MOL touchpoint not expected.",
    narrativeAr: "جميع نقاط الاتصال ضمن النوافذ المتوقعة. مسافر أعمال — لا يُتوقع تماسّ مع وزارة العمل.",
  },
  // 2. Mildly gapped — hotel 8h vs typical 4h
  {
    travelerId: "seq-002",
    travelerName: "Yasir A. Karim",
    travelerNameAr: "ياسر كريم",
    nationality: "PAK",
    classification: "internal",
    apisArrivalTs: apis2,
    touchpoints: [
      tp("APIS",   ICON_APIS.icon,   ICON_APIS.color,   "APIS arrival",     "وصول APIS",       apis2, apis2,                     0),
      tp("Hotel",  ICON_HOTEL.icon,  ICON_HOTEL.color,  "First hotel",      "الفندق الأول",     apis2, "2026-04-17T15:00:00Z",    4),
      tp("SIM",    ICON_SIM.icon,    ICON_SIM.color,    "SIM activation",   "تفعيل الشريحة",   apis2, "2026-04-17T11:10:00Z",    6),
      tp("Rental", ICON_RENTAL.icon, ICON_RENTAL.color, "Vehicle rental",   "تأجير مركبة",      apis2, null,                     12),
      tp("MOL",    ICON_MOL.icon,    ICON_MOL.color,    "MOL touchpoint",   "بصمة وزارة العمل", apis2, null,                     48),
    ],
    presenceCoherenceScore: 28,
    verdict: "mildly-gapped",
    narrativeEn: "Hotel check-in 8h after arrival vs typical 4h. Within operator tolerance — flagged for watch only.",
    narrativeAr: "تسجيل دخول الفندق بعد 8 ساعات من الوصول مقابل 4 ساعات المعتادة. ضمن هامش التسامح — للمراقبة فقط.",
  },
  // 3. Strongly gapped — the dramatic 62h APIS → hotel gap (ties to demo-anomaly)
  {
    travelerId: "seq-003",
    travelerName: "Leila D. Benaissa",
    travelerNameAr: "ليلى بن عيسى",
    nationality: "DZA",
    classification: "internal",
    apisArrivalTs: apis3,
    touchpoints: [
      tp("APIS",   ICON_APIS.icon,   ICON_APIS.color,   "APIS arrival",     "وصول APIS",       apis3, apis3,                     0),
      tp("Hotel",  ICON_HOTEL.icon,  ICON_HOTEL.color,  "First hotel",      "الفندق الأول",     apis3, "2026-04-19T12:30:00Z",    4),
      tp("SIM",    ICON_SIM.icon,    ICON_SIM.color,    "SIM activation",   "تفعيل الشريحة",   apis3, "2026-04-19T14:05:00Z",    6),
      tp("Rental", ICON_RENTAL.icon, ICON_RENTAL.color, "Vehicle rental",   "تأجير مركبة",      apis3, null,                     12),
      tp("MOL",    ICON_MOL.icon,    ICON_MOL.color,    "MOL touchpoint",   "بصمة وزارة العمل", apis3, null,                     48),
    ],
    presenceCoherenceScore: 82,
    verdict: "strongly-gapped",
    narrativeEn: "APIS → first hotel gap = 62h (typical ≤4h). SIM activation co-located with hotel check-in 2.5 days in-country — unaccounted presence window is the Model 3 signal.",
    narrativeAr: "فجوة APIS → أول فندق = 62 ساعة (المعتاد ≤4 ساعات). تفعيل الشريحة متزامن مع دخول الفندق بعد 2.5 يوم — نافذة الحضور غير المُبرّرة هي إشارة النموذج الثالث.",
  },
  // 4. Missing — signals never arrived
  {
    travelerId: "seq-004",
    travelerName: "Mikhail V. Petrov",
    travelerNameAr: "ميخائيل بيتروف",
    nationality: "RUS",
    classification: "restricted",
    apisArrivalTs: apis4,
    touchpoints: [
      tp("APIS",   ICON_APIS.icon,   ICON_APIS.color,   "APIS arrival",     "وصول APIS",       apis4, apis4,                     0),
      tp("Hotel",  ICON_HOTEL.icon,  ICON_HOTEL.color,  "First hotel",      "الفندق الأول",     apis4, null,                      4),
      tp("SIM",    ICON_SIM.icon,    ICON_SIM.color,    "SIM activation",   "تفعيل الشريحة",   apis4, null,                      6),
      tp("Rental", ICON_RENTAL.icon, ICON_RENTAL.color, "Vehicle rental",   "تأجير مركبة",      apis4, null,                     12),
      tp("MOL",    ICON_MOL.icon,    ICON_MOL.color,    "MOL touchpoint",   "بصمة وزارة العمل", apis4, null,                     48),
    ],
    presenceCoherenceScore: 71,
    verdict: "missing",
    narrativeEn: "No cross-stream touchpoints observed. Either unreported private-host stay or in-transit case. Raises presence-coherence flag pending sponsor confirmation.",
    narrativeAr: "لم تُرصد أي نقاط اتصال متقاطعة. إما إقامة خاصة غير مُبلّغ عنها أو حالة عبور. يُرفع علم تماسك الحضور في انتظار تأكيد الكفيل.",
  },
  // 5. Coherent with SIM delay
  {
    travelerId: "seq-005",
    travelerName: "Sarah M. Nguyen",
    travelerNameAr: "سارة نغوين",
    nationality: "VNM",
    classification: "internal",
    apisArrivalTs: apis5,
    touchpoints: [
      tp("APIS",   ICON_APIS.icon,   ICON_APIS.color,   "APIS arrival",     "وصول APIS",       apis5, apis5,                     0),
      tp("Hotel",  ICON_HOTEL.icon,  ICON_HOTEL.color,  "First hotel",      "الفندق الأول",     apis5, "2026-04-16T21:40:00Z",    4),
      tp("SIM",    ICON_SIM.icon,    ICON_SIM.color,    "SIM activation",   "تفعيل الشريحة",   apis5, "2026-04-17T09:20:00Z",    6),
      tp("Rental", ICON_RENTAL.icon, ICON_RENTAL.color, "Vehicle rental",   "تأجير مركبة",      apis5, null,                     12),
      tp("MOL",    ICON_MOL.icon,    ICON_MOL.color,    "MOL touchpoint",   "بصمة وزارة العمل", apis5, "2026-04-18T10:00:00Z",   48),
    ],
    presenceCoherenceScore: 14,
    verdict: "coherent",
    narrativeEn: "Business traveler — hotel + MOL checkpoints clean. SIM activation modestly late (14.5h vs 6h target) but within confidence band.",
    narrativeAr: "مسافر أعمال — نقاط الفندق ووزارة العمل سليمة. تفعيل الشريحة متأخر قليلاً (14.5 ساعة مقابل 6) لكن ضمن نطاق الثقة.",
  },
  // 6. Mildly gapped — SIM activation anomaly
  {
    travelerId: "seq-006",
    travelerName: "Elena S. Marković",
    travelerNameAr: "إيلينا ماركوفيتش",
    nationality: "SRB",
    classification: "internal",
    apisArrivalTs: apis6,
    touchpoints: [
      tp("APIS",   ICON_APIS.icon,   ICON_APIS.color,   "APIS arrival",     "وصول APIS",       apis6, apis6,                     0),
      tp("Hotel",  ICON_HOTEL.icon,  ICON_HOTEL.color,  "First hotel",      "الفندق الأول",     apis6, "2026-04-17T14:00:00Z",    4),
      tp("SIM",    ICON_SIM.icon,    ICON_SIM.color,    "SIM activation",   "تفعيل الشريحة",   apis6, null,                      6),
      tp("Rental", ICON_RENTAL.icon, ICON_RENTAL.color, "Vehicle rental",   "تأجير مركبة",      apis6, "2026-04-17T16:30:00Z",   12),
      tp("MOL",    ICON_MOL.icon,    ICON_MOL.color,    "MOL touchpoint",   "بصمة وزارة العمل", apis6, null,                     48),
    ],
    presenceCoherenceScore: 38,
    verdict: "mildly-gapped",
    narrativeEn: "No SIM activation observed — unusual given vehicle rental present. Possible roaming SIM use, flagged for analyst review.",
    narrativeAr: "لم يُرصد تفعيل شريحة — غير معتاد مع وجود تأجير مركبة. احتمال استخدام شريحة تجوال، مرفوع للمراجعة.",
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Model Governance (Wave 1 · Deliverable 2)
// Drift / calibration / fairness / registry seeds for the Model Governance tab.
// ─────────────────────────────────────────────────────────────────────────

export interface ScoreDriftPoint {
  date: string;       // YYYY-MM-DD
  meanScore: number;  // 0-100
  stdDev: number;     // ± range
  population: number; // records scored that day
}

// Deterministic 30-day drift series ending 2026-04-17.
const buildScoreDrift = (): ScoreDriftPoint[] => {
  const out: ScoreDriftPoint[] = [];
  const end = new Date("2026-04-17T00:00:00Z").getTime();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(end - i * 86_400_000);
    const iso = d.toISOString().slice(0, 10);
    const seed = i * 5.3 + 1.9;
    const wave = Math.sin(seed / 3.8) * 3.2 + Math.cos(seed / 5.1) * 2.1;
    const mean = +(42.5 + wave + (i < 3 ? 1.4 : 0)).toFixed(2);
    const sd = +(6.5 + Math.abs(Math.sin(seed / 6)) * 1.2).toFixed(2);
    const pop = Math.round(16800 + wave * 380 + (i % 7 === 0 ? -1200 : 0));
    out.push({ date: iso, meanScore: mean, stdDev: sd, population: pop });
  }
  return out;
};

export const SCORE_DRIFT_30D: ScoreDriftPoint[] = buildScoreDrift();

// Calibration curve — 20 reliability points (expected vs observed risk %).
export const CALIBRATION_CURVE: { expectedPct: number; observedPct: number }[] = [
  { expectedPct:  5, observedPct:  4.2 },
  { expectedPct: 10, observedPct:  9.1 },
  { expectedPct: 15, observedPct: 14.0 },
  { expectedPct: 20, observedPct: 18.7 },
  { expectedPct: 25, observedPct: 24.6 },
  { expectedPct: 30, observedPct: 28.9 },
  { expectedPct: 35, observedPct: 33.8 },
  { expectedPct: 40, observedPct: 39.3 },
  { expectedPct: 45, observedPct: 44.1 },
  { expectedPct: 50, observedPct: 49.6 },
  { expectedPct: 55, observedPct: 54.2 },
  { expectedPct: 60, observedPct: 59.8 },
  { expectedPct: 65, observedPct: 64.4 },
  { expectedPct: 70, observedPct: 69.1 },
  { expectedPct: 75, observedPct: 74.8 },
  { expectedPct: 80, observedPct: 79.5 },
  { expectedPct: 85, observedPct: 83.9 },
  { expectedPct: 90, observedPct: 88.7 },
  { expectedPct: 95, observedPct: 93.2 },
  { expectedPct: 99, observedPct: 97.4 },
];

export interface NationalityFairness {
  iso3: string;
  name: string;
  flagRatePct: number;       // 0-100
  deviationSigma: number;    // vs global mean (σ units, signed)
}

// 15 nationalities — flag rate deviation from global mean in σ units.
// Max |σ| stays ≤ 1.9 to honor the "0 breaching 2σ threshold" panel headline.
export const NATIONALITY_FAIRNESS: NationalityFairness[] = [
  { iso3: "YEM", name: "Yemen",        flagRatePct: 42.1, deviationSigma:  1.85 },
  { iso3: "SYR", name: "Syria",        flagRatePct: 39.7, deviationSigma:  1.78 },
  { iso3: "IRN", name: "Iran",         flagRatePct: 31.2, deviationSigma:  1.42 },
  { iso3: "IRQ", name: "Iraq",         flagRatePct: 28.6, deviationSigma:  1.28 },
  { iso3: "LBY", name: "Libya",        flagRatePct: 26.9, deviationSigma:  1.18 },
  { iso3: "AFG", name: "Afghanistan",  flagRatePct: 25.4, deviationSigma:  1.10 },
  { iso3: "PAK", name: "Pakistan",     flagRatePct: 14.8, deviationSigma:  0.62 },
  { iso3: "RUS", name: "Russia",       flagRatePct: 12.3, deviationSigma:  0.48 },
  { iso3: "IND", name: "India",        flagRatePct:  9.1, deviationSigma:  0.22 },
  { iso3: "EGY", name: "Egypt",        flagRatePct:  8.4, deviationSigma:  0.15 },
  { iso3: "USA", name: "United States",flagRatePct:  4.2, deviationSigma: -0.42 },
  { iso3: "GBR", name: "United Kingdom",flagRatePct: 3.8, deviationSigma: -0.48 },
  { iso3: "DEU", name: "Germany",      flagRatePct:  3.2, deviationSigma: -0.55 },
  { iso3: "CHN", name: "China",        flagRatePct:  2.8, deviationSigma: -0.62 },
  { iso3: "JPN", name: "Japan",        flagRatePct:  1.9, deviationSigma: -0.74 },
];

export interface ModelRegistryMilestone {
  version: string;
  deployedAt: string;          // ISO date
  retiredAt: string | null;    // null = currently running
  status: "active" | "shadow" | "retired";
  noteEn: string;
  noteAr: string;
}

export const MODEL_REGISTRY_TIMELINE: ModelRegistryMilestone[] = [
  { version: "mvp-0.1.0",   deployedAt: "2025-11-12", retiredAt: "2025-12-18", status: "retired", noteEn: "Initial PoC — rules only, 6 sub-scores", noteAr: "إصدار PoC أول — قواعد فقط، 6 درجات فرعية" },
  { version: "mvp-0.2.0",   deployedAt: "2025-12-18", retiredAt: "2026-02-10", status: "retired", noteEn: "Added ML routing anomaly (Isolation Forest)", noteAr: "إضافة شذوذ المسار عبر ML (Isolation Forest)" },
  { version: "mvp-0.2.5",   deployedAt: "2026-02-10", retiredAt: "2026-03-18", status: "retired", noteEn: "Entity-graph PageRank, sanctions 2-hop", noteAr: "PageRank لرسم الكيان، درجتان للعقوبات" },
  { version: "mvp-0.3.0",   deployedAt: "2026-03-18", retiredAt: "2026-04-03", status: "retired", noteEn: "Sequence-coherence Model 3 + 9 sub-scores", noteAr: "النموذج الثالث لتماسك التسلسل + 9 درجات فرعية" },
  { version: "mvp-0.3.1",   deployedAt: "2026-04-03", retiredAt: null,         status: "active",  noteEn: "Calibrated percentile output, fairness-aware", noteAr: "مُعاير بالنسب، واعٍ بالعدالة" },
  { version: "mvp-0.3.2-rc1", deployedAt: "2026-04-12", retiredAt: null,       status: "shadow",  noteEn: "Shadow — adds declaration-match features", noteAr: "ظلّ — يضيف ميزات مطابقة الإقرار" },
];

// ─────────────────────────────────────────────────────────────────────────
// Audit Log (Wave 1 · Deliverable 3)
// 50 synthetic entries across all event types + actor roles.
// ─────────────────────────────────────────────────────────────────────────

export interface AuditEntry {
  id: string;
  occurredAt: string; // ISO
  actor: { id: string; name: string; role: "analyst"|"supervisor"|"manager"|"admin"|"system" };
  eventType: "score_computed"|"rule_fired"|"source_ingested"|"source_failed"|"classified_accessed"|"weight_changed"|"rule_toggled"|"rollback_triggered"|"clearance_changed";
  targetId: string;
  classification: Classification;
  details: Record<string, unknown>;
}

const AUDIT_ACTORS = [
  { id: "u-001", name: "Ahmed Al-Amri",       role: "analyst"    as const },
  { id: "u-002", name: "Fatima Al-Mansoori",  role: "analyst"    as const },
  { id: "u-003", name: "Omar Z. Qureshi",     role: "analyst"    as const },
  { id: "u-004", name: "Leila D. Benaissa",   role: "analyst"    as const },
  { id: "s-001", name: "Hasan M. Al-Bakri",   role: "supervisor" as const },
  { id: "s-002", name: "Noor F. Al-Hakim",    role: "supervisor" as const },
  { id: "m-001", name: "Mohamed O. El-Sayed", role: "manager"    as const },
  { id: "a-001", name: "Khaled A. Saleh",     role: "admin"      as const },
  { id: "sys",   name: "risk-engine",         role: "system"     as const },
];

const AUDIT_TARGET_POOL = [
  "demo-lowrisk", "demo-borderline", "demo-highrisk-sponsor", "demo-anomaly", "demo-health",
  "rec-000127", "rec-000128", "rec-000129", "rec-000130", "rec-000131",
  "rec-000132", "rec-000133", "rec-000134", "rec-000135", "rec-000136",
  "rec-000137", "rec-000138",
];

// Deterministic hashy picker so seeded entries stay stable across reloads.
const pick = <T,>(arr: T[], seed: number): T => arr[Math.abs(seed) % arr.length];

const buildAuditLog = (): AuditEntry[] => {
  const out: AuditEntry[] = [];
  const end = new Date("2026-04-17T11:55:00Z").getTime();
  const eventTypes: AuditEntry["eventType"][] = [
    "score_computed", "rule_fired", "source_ingested", "source_failed",
    "classified_accessed", "weight_changed", "rule_toggled", "rollback_triggered",
  ];

  for (let i = 0; i < 50; i++) {
    const seed = i * 7 + 3;
    const ts = new Date(end - i * 47 * 60_000 - (i % 5) * 13 * 60_000).toISOString();
    // Bias distribution: score_computed & rule_fired more common; rollback rare.
    const etIdx = i % 10 === 0 ? 7 : (i % 6 === 0 ? 4 : (i % 3 === 0 ? 1 : (i % 2 === 0 ? 0 : (i % 5)) + 0));
    const eventType = eventTypes[etIdx % eventTypes.length];
    // System actor for automatic events; otherwise pick a human.
    const systemEvents: AuditEntry["eventType"][] = ["score_computed", "source_ingested", "source_failed"];
    const actor = systemEvents.includes(eventType)
      ? AUDIT_ACTORS[AUDIT_ACTORS.length - 1]
      : pick(AUDIT_ACTORS.slice(0, -1), seed);
    const targetId = eventType === "source_ingested" || eventType === "source_failed"
      ? pick(["OpenSanctions", "GDELT", "ACLED", "WHO", "ECDC", "OpenSky", "Advisories", "OpenCorporates", "ReliefWeb"], seed)
      : eventType === "weight_changed"
        ? pick(["sanctions", "geopolitical", "biosecurity", "routing", "behavioral", "declaration", "entity", "presence", "document"], seed)
        : eventType === "rule_toggled"
          ? pick(["R-SNC-001", "R-GEO-001", "R-RTE-001", "R-TMP-002", "R-BEH-001", "R-DEC-001"], seed)
          : eventType === "rollback_triggered"
            ? "mvp-0.3.0"
            : pick(AUDIT_TARGET_POOL, seed);

    // Classification: classified_accessed events are classified; score_computed on
    // restricted records stays restricted; the rest default internal/public.
    const classification: Classification = eventType === "classified_accessed"
      ? "classified"
      : eventType === "rollback_triggered" || eventType === "weight_changed"
        ? "restricted"
        : eventType === "source_ingested" || eventType === "source_failed"
          ? "public"
          : "internal";

    // Build shape-appropriate details payload.
    let details: Record<string, unknown>;
    switch (eventType) {
      case "score_computed":
        details = { unifiedScore: 28 + (i % 60), modelVersion: "mvp-0.3.1", latencyMs: 180 + (i % 120) };
        break;
      case "rule_fired":
        details = { ruleId: pick(["R-SNC-001", "R-GEO-001", "R-ENT-001", "R-BIO-001", "R-RTE-001"], seed), contribution: +((0.2 + (i % 10) / 20).toFixed(2)), observed: "threshold exceeded" };
        break;
      case "source_ingested":
        details = { records: 100 + i * 37, durationMs: 820 + i * 13, checksumOk: true };
        break;
      case "source_failed":
        details = { errorCode: pick(["ETIMEDOUT", "EAUTH", "E429", "E503"], seed), retryAttempt: 1 + (i % 3) };
        break;
      case "classified_accessed":
        details = { classification: "classified", accessReason: "operator_queue_detail_open", approver: "s-001" };
        break;
      case "weight_changed":
        details = { key: targetId, oldValue: 12, newValue: 12 + (i % 6) - 2, profileId: "default" };
        break;
      case "rule_toggled":
        details = { ruleId: targetId, newState: i % 2 === 0 ? "enabled" : "disabled" };
        break;
      case "rollback_triggered":
        details = { fromVersion: "mvp-0.3.1", toVersion: "mvp-0.3.0", reason: "fairness_breach_drill" };
        break;
    }

    out.push({
      id: `audit-${String(i + 1).padStart(4, "0")}`,
      occurredAt: ts,
      actor: { id: actor.id, name: actor.name, role: actor.role },
      eventType,
      targetId,
      classification,
      details,
    });
  }
  return out;
};

export const AUDIT_LOG: AuditEntry[] = buildAuditLog();

// ─────────────────────────────────────────────────────────────────────────
// Feature Vector (Wave 1 · Deliverable 4)
// ML scoring inputs keyed by scored-record id.
// ─────────────────────────────────────────────────────────────────────────

export interface FeatureVector {
  traveler_id: string;
  decision_point: DecisionPoint;
  as_of: string;
  // Routing
  origin_iata: string | null;
  carrier_iata: string | null;
  nationality: string;
  stopover_count: number;
  hour_of_arrival: number;
  dow_of_arrival: number;
  booking_to_departure_days: number | null;
  // Behavioral
  prior_overstays: number | null;
  visit_cadence_days: number | null;
  mean_length_of_stay_days: number | null;
  visa_denial_count: number | null;
  // Declaration
  declared_address_matches_hotel: boolean | null;
  declared_address_matches_municipality: boolean | null;
  declared_employer_matches_mol: boolean | null;
  declared_length_vs_actual_days: number | null;
  // Presence
  hours_apis_to_first_hotel: number | null;
  hours_apis_to_first_sim: number | null;
  hours_apis_to_first_rental_or_mol: number | null;
  missing_presence_signals_count: number;
  // Entity graph
  sponsor_propagated_risk: number | null;
  employer_propagated_risk: number | null;
  sponsor_graph_degree: number | null;
  // OSINT context
  origin_conflict_intensity_7d: number | null;
  origin_travel_advisory_level: number | null;
  outbreak_active_at_origin: boolean;
  // Meta
  missing_feature_mask: Record<string, boolean>;
  feature_schema_version: string;
}

// Derive a plausible feature vector from the already-scored record so values
// round-trip with what the Explain tab already shows (no contradictions).
const buildFeatureVector = (r: ScoredRecord): FeatureVector => {
  const arrival = new Date(r.arrivalTs);
  const hour = arrival.getUTCHours();
  const dow = arrival.getUTCDay();
  const scen = r.demoScenario ?? "";
  // Sprinkle nulls on the lower-risk records to demo "missing feature" highlighting.
  const isClean = r.unifiedScore < 25;
  const priorOverstays = isClean ? 0 : Math.round(r.subScores.behavioral / 25);
  const visaDenials = isClean ? 0 : Math.round(r.subScores.behavioral / 30);
  const declAddrHotel = scen === "anomaly-driven" ? false : (isClean ? true : null);
  const declEmployerMol = scen === "high-risk-sponsor" ? false : (isClean ? true : null);
  const hoursApisToHotel = scen === "anomaly-driven" ? 62 : scen === "high-risk-sponsor" ? null : 4;
  const hoursApisToSim = scen === "high-risk-sponsor" ? null : 6;
  const hoursApisToRentalMol = scen === "high-risk-sponsor" ? null : (isClean ? 12 : 28);
  const sponsorRisk = r.sponsor ? +(r.subScores.entity / 100).toFixed(2) : null;
  const sponsorDegree = r.sponsor ? Math.round(3 + r.subScores.entity / 15) : null;

  const vec: FeatureVector = {
    traveler_id: r.id,
    decision_point: r.decisionPoint,
    as_of: r.computedAt,
    // Routing
    origin_iata: r.originIata,
    carrier_iata: r.carrierIata,
    nationality: r.nationality,
    stopover_count: scen === "anomaly-driven" ? 2 : 0,
    hour_of_arrival: hour,
    dow_of_arrival: dow,
    booking_to_departure_days: scen === "anomaly-driven" ? 0 : (isClean ? 38 : 7),
    // Behavioral
    prior_overstays: priorOverstays,
    visit_cadence_days: isClean ? 95 : null,
    mean_length_of_stay_days: isClean ? 6 : null,
    visa_denial_count: visaDenials,
    // Declaration
    declared_address_matches_hotel: declAddrHotel,
    declared_address_matches_municipality: scen === "anomaly-driven" ? false : (isClean ? true : null),
    declared_employer_matches_mol: declEmployerMol,
    declared_length_vs_actual_days: isClean ? 0 : null,
    // Presence
    hours_apis_to_first_hotel: hoursApisToHotel,
    hours_apis_to_first_sim: hoursApisToSim,
    hours_apis_to_first_rental_or_mol: hoursApisToRentalMol,
    missing_presence_signals_count:
      (hoursApisToHotel === null ? 1 : 0) +
      (hoursApisToSim === null ? 1 : 0) +
      (hoursApisToRentalMol === null ? 1 : 0),
    // Entity
    sponsor_propagated_risk: sponsorRisk,
    employer_propagated_risk: r.sponsor ? +((r.subScores.entity * 0.7) / 100).toFixed(2) : null,
    sponsor_graph_degree: sponsorDegree,
    // OSINT context
    origin_conflict_intensity_7d: r.subScores.geopolitical > 40 ? r.subScores.geopolitical * 2 : null,
    origin_travel_advisory_level: r.subScores.geopolitical > 70 ? 4 : r.subScores.geopolitical > 45 ? 3 : r.subScores.geopolitical > 20 ? 2 : 1,
    outbreak_active_at_origin: scen === "health-overlap",
    // Meta
    missing_feature_mask: {},
    feature_schema_version: "v1.2.0",
  };

  // Build the missing_feature_mask from any null values above.
  const mask: Record<string, boolean> = {};
  (Object.entries(vec) as [string, unknown][]).forEach(([k, v]) => {
    if (v === null) mask[k] = true;
  });
  vec.missing_feature_mask = mask;
  return vec;
};

export const FEATURE_VECTORS: Record<string, FeatureVector> = SCORED_RECORDS.reduce(
  (acc, r) => {
    acc[r.id] = buildFeatureVector(r);
    return acc;
  },
  {} as Record<string, FeatureVector>,
);

// ─────────────────────────────────────────────────────────────────────────
// Weight Profiles (Wave 1 · Deliverable 5)
// Named profiles replace the single default weight set in the Config tab.
// ─────────────────────────────────────────────────────────────────────────

export interface WeightProfile {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  decisionPoint: DecisionPoint | "both";
  sourceClass: Classification | "all";
  weights: Record<SubScoreKey, number>; // percentage points; must sum to 100
  createdAt: string;
  isDefault?: boolean;
}

export const WEIGHT_PROFILES: WeightProfile[] = [
  {
    id: "default",
    name: "Balanced · default",
    nameAr: "الملف الافتراضي",
    description: "PoC-calibrated baseline weights (Tech Spec §6.2)",
    descriptionAr: "الأوزان الأساسية المُعايَرة لمرحلة PoC (§6.2)",
    decisionPoint: "both",
    sourceClass: "all",
    weights: { sanctions: 15, geopolitical: 12, biosecurity: 5, routing: 12, behavioral: 15, declaration: 12, entity: 10, presence: 10, document: 9 },
    createdAt: "2026-03-18T00:00:00Z",
    isDefault: true,
  },
  {
    id: "eta-heavy-sanctions",
    name: "ETA · Sanctions-heavy",
    nameAr: "تأشيرة · ثقيل على العقوبات",
    description: "ETA adjudication leans on sanctions/entity signal; low biosec",
    descriptionAr: "تقدير التأشيرة يعتمد على العقوبات/الكيان وتقليل الوزن الحيوي",
    decisionPoint: "ETA",
    sourceClass: "all",
    weights: { sanctions: 25, geopolitical: 15, biosecurity: 3, routing: 10, behavioral: 10, declaration: 10, entity: 12, presence: 8, document: 7 },
    createdAt: "2026-03-28T00:00:00Z",
  },
  {
    id: "pnr-behavioral",
    name: "API/PNR · Behavioral-focus",
    nameAr: "ركاب · سلوكي",
    description: "API/PNR pre-arrival emphasizes behavioral + routing anomaly",
    descriptionAr: "ما قبل الوصول يركّز على السلوك وشذوذ المسار",
    decisionPoint: "API_PNR",
    sourceClass: "all",
    weights: { sanctions: 12, geopolitical: 10, biosecurity: 5, routing: 18, behavioral: 22, declaration: 12, entity: 8, presence: 8, document: 5 },
    createdAt: "2026-04-02T00:00:00Z",
  },
  {
    id: "classified-rasad",
    name: "Classified · Rasad-weighted",
    nameAr: "مصنّف · رصد",
    description: "Classified feed boost — raises entity + behavioral, tunes document",
    descriptionAr: "تعزيز التغذية المصنّفة — رفع الكيان والسلوك وضبط الوثيقة",
    decisionPoint: "both",
    sourceClass: "classified",
    weights: { sanctions: 10, geopolitical: 15, biosecurity: 5, routing: 12, behavioral: 15, declaration: 10, entity: 15, presence: 10, document: 8 },
    createdAt: "2026-04-08T00:00:00Z",
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Wave 2 · Movement events (Person 360° tab 2)
// ─────────────────────────────────────────────────────────────────────────

export type MovementEventType =
  | "BORDER_ENTRY" | "BORDER_EXIT"
  | "HOTEL_CHECKIN" | "HOTEL_CHECKOUT"
  | "SIM_ACTIVATION"
  | "VEHICLE_RENTAL_START" | "VEHICLE_RENTAL_END"
  | "MOL_EMPLOYMENT_START" | "MOL_EMPLOYMENT_END"
  | "MUNICIPALITY_LEASE";

export interface MovementEvent {
  id: string;
  travelerId: string;
  type: MovementEventType;
  occurredAt: string;
  location: { iata?: string; city: string; country: string };
  source: string;
  sourceClass: Classification;
  payload: Record<string, unknown>;
  coherenceGapHours?: number;
}

// Seeded events covering the first 3 scored records (demo-lowrisk, demo-borderline, demo-highrisk-sponsor)
export const MOVEMENT_EVENTS: MovementEvent[] = [
  // ── demo-lowrisk · James W. Carter · USA ────────────────────────────────
  { id: "mv-l01", travelerId: "demo-lowrisk", type: "BORDER_ENTRY", occurredAt: "2026-02-14T08:30:00Z", location: { iata: "MCT", city: "Muscat", country: "OMN" }, source: "Border Entry/Exit", sourceClass: "internal", payload: { flight: "EK204", stampNo: "A90123" } },
  { id: "mv-l02", travelerId: "demo-lowrisk", type: "HOTEL_CHECKIN", occurredAt: "2026-02-14T11:15:00Z", location: { city: "Muscat", country: "OMN" }, source: "Shangri-La Al Husn", sourceClass: "internal", payload: { reservation: "SHR-20262-1104", room: "812" } },
  { id: "mv-l03", travelerId: "demo-lowrisk", type: "SIM_ACTIVATION", occurredAt: "2026-02-14T12:02:00Z", location: { city: "Muscat", country: "OMN" }, source: "Omantel", sourceClass: "restricted", payload: { msisdn: "+968 9xxxx ••210", planAr: "Visitor 30-day" } },
  { id: "mv-l04", travelerId: "demo-lowrisk", type: "VEHICLE_RENTAL_START", occurredAt: "2026-02-14T13:45:00Z", location: { iata: "MCT", city: "Muscat", country: "OMN" }, source: "Europcar Muscat Intl.", sourceClass: "internal", payload: { plate: "8-2419 A", modelEn: "Toyota Prado" } },
  { id: "mv-l05", travelerId: "demo-lowrisk", type: "HOTEL_CHECKOUT", occurredAt: "2026-02-19T09:10:00Z", location: { city: "Muscat", country: "OMN" }, source: "Shangri-La Al Husn", sourceClass: "internal", payload: { reservation: "SHR-20262-1104" } },
  { id: "mv-l06", travelerId: "demo-lowrisk", type: "VEHICLE_RENTAL_END", occurredAt: "2026-02-19T12:25:00Z", location: { iata: "MCT", city: "Muscat", country: "OMN" }, source: "Europcar Muscat Intl.", sourceClass: "internal", payload: { plate: "8-2419 A", distanceKm: 482 } },
  { id: "mv-l07", travelerId: "demo-lowrisk", type: "BORDER_EXIT", occurredAt: "2026-02-19T14:10:00Z", location: { iata: "MCT", city: "Muscat", country: "OMN" }, source: "Border Entry/Exit", sourceClass: "internal", payload: { flight: "EK207" } },
  { id: "mv-l08", travelerId: "demo-lowrisk", type: "BORDER_ENTRY", occurredAt: "2026-04-18T09:15:00Z", location: { iata: "MCT", city: "Muscat", country: "OMN" }, source: "Border Entry/Exit", sourceClass: "internal", payload: { flight: "EK204", stampNo: "A91884" } },
  { id: "mv-l09", travelerId: "demo-lowrisk", type: "HOTEL_CHECKIN", occurredAt: "2026-04-18T11:05:00Z", location: { city: "Muscat", country: "OMN" }, source: "Chedi Muscat", sourceClass: "internal", payload: { reservation: "CHD-20264-0821" } },
  { id: "mv-l10", travelerId: "demo-lowrisk", type: "MOL_EMPLOYMENT_START", occurredAt: "2026-04-18T00:00:00Z", location: { city: "Muscat", country: "OMN" }, source: "MOL registry", sourceClass: "restricted", payload: { employer: "Bechtel Corporation", category: "Consulting" } },
  { id: "mv-l11", travelerId: "demo-lowrisk", type: "SIM_ACTIVATION", occurredAt: "2026-04-18T13:40:00Z", location: { city: "Muscat", country: "OMN" }, source: "Ooredoo", sourceClass: "restricted", payload: { msisdn: "+968 9xxxx ••553" } },
  { id: "mv-l12", travelerId: "demo-lowrisk", type: "MUNICIPALITY_LEASE", occurredAt: "2026-04-18T15:00:00Z", location: { city: "Muscat", country: "OMN" }, source: "Muscat Municipality", sourceClass: "internal", payload: { unit: "Al Mouj Towers A-17" } },

  // ── demo-borderline · Yasir A. Karim · PAK ──────────────────────────────
  { id: "mv-b01", travelerId: "demo-borderline", type: "BORDER_ENTRY", occurredAt: "2025-11-04T03:20:00Z", location: { iata: "MCT", city: "Muscat", country: "OMN" }, source: "Border Entry/Exit", sourceClass: "internal", payload: { flight: "PK207", stampNo: "B18003" } },
  { id: "mv-b02", travelerId: "demo-borderline", type: "HOTEL_CHECKIN", occurredAt: "2025-11-04T07:00:00Z", location: { city: "Muscat", country: "OMN" }, source: "Radisson Blu Muscat", sourceClass: "internal", payload: { reservation: "RBM-2025-9930", room: "416" } },
  { id: "mv-b03", travelerId: "demo-borderline", type: "SIM_ACTIVATION", occurredAt: "2025-11-04T10:48:00Z", location: { city: "Muscat", country: "OMN" }, source: "Vodafone Oman", sourceClass: "restricted", payload: { msisdn: "+968 9xxxx ••097" } },
  { id: "mv-b04", travelerId: "demo-borderline", type: "MUNICIPALITY_LEASE", occurredAt: "2025-11-06T12:00:00Z", location: { city: "Muscat", country: "OMN" }, source: "Muscat Municipality", sourceClass: "internal", payload: { unit: "Ghubra Heights B-04", leaseMonths: 6 } },
  { id: "mv-b05", travelerId: "demo-borderline", type: "MOL_EMPLOYMENT_START", occurredAt: "2025-11-09T00:00:00Z", location: { city: "Muscat", country: "OMN" }, source: "MOL registry", sourceClass: "restricted", payload: { employer: "Pearl Logistics LLC" } },
  { id: "mv-b06", travelerId: "demo-borderline", type: "VEHICLE_RENTAL_START", occurredAt: "2025-11-12T14:00:00Z", location: { city: "Muscat", country: "OMN" }, source: "Budget Oman", sourceClass: "internal", payload: { plate: "2-7701 B", modelEn: "Hyundai Accent" } },
  { id: "mv-b07", travelerId: "demo-borderline", type: "VEHICLE_RENTAL_END", occurredAt: "2025-11-18T16:00:00Z", location: { city: "Muscat", country: "OMN" }, source: "Budget Oman", sourceClass: "internal", payload: { plate: "2-7701 B", distanceKm: 1824 } },
  { id: "mv-b08", travelerId: "demo-borderline", type: "HOTEL_CHECKOUT", occurredAt: "2025-11-22T10:00:00Z", location: { city: "Muscat", country: "OMN" }, source: "Radisson Blu Muscat", sourceClass: "internal", payload: { reservation: "RBM-2025-9930" } },
  { id: "mv-b09", travelerId: "demo-borderline", type: "BORDER_EXIT", occurredAt: "2025-11-23T12:15:00Z", location: { iata: "MCT", city: "Muscat", country: "OMN" }, source: "Border Entry/Exit", sourceClass: "internal", payload: { flight: "PK208" } },
  { id: "mv-b10", travelerId: "demo-borderline", type: "BORDER_ENTRY", occurredAt: "2026-04-18T04:42:00Z", location: { iata: "MCT", city: "Muscat", country: "OMN" }, source: "Border Entry/Exit", sourceClass: "internal", payload: { flight: "PK207", stampNo: "B21770" } },
  { id: "mv-b11", travelerId: "demo-borderline", type: "SIM_ACTIVATION", occurredAt: "2026-04-18T08:20:00Z", location: { city: "Muscat", country: "OMN" }, source: "Vodafone Oman", sourceClass: "restricted", payload: { msisdn: "+968 9xxxx ••441" } },
  { id: "mv-b12", travelerId: "demo-borderline", type: "HOTEL_CHECKIN", occurredAt: "2026-04-18T10:30:00Z", location: { city: "Muscat", country: "OMN" }, source: "Crowne Plaza Muscat", sourceClass: "internal", payload: { reservation: "CRP-20264-5551", room: "1103" } },
  { id: "mv-b13", travelerId: "demo-borderline", type: "MOL_EMPLOYMENT_END", occurredAt: "2025-12-01T00:00:00Z", location: { city: "Muscat", country: "OMN" }, source: "MOL registry", sourceClass: "restricted", payload: { employer: "Pearl Logistics LLC", reason: "contract_expired" } },

  // ── demo-highrisk-sponsor · Mikhail V. Petrov · RUS ─────────────────────
  { id: "mv-h01", travelerId: "demo-highrisk-sponsor", type: "BORDER_ENTRY", occurredAt: "2026-01-23T22:50:00Z", location: { iata: "MCT", city: "Muscat", country: "OMN" }, source: "Border Entry/Exit", sourceClass: "internal", payload: { flight: "EK865" } },
  { id: "mv-h02", travelerId: "demo-highrisk-sponsor", type: "HOTEL_CHECKIN", occurredAt: "2026-01-24T00:05:00Z", location: { city: "Muscat", country: "OMN" }, source: "Kempinski Muscat", sourceClass: "internal", payload: { reservation: "KMP-2026-0118", room: "2701" } },
  { id: "mv-h03", travelerId: "demo-highrisk-sponsor", type: "SIM_ACTIVATION", occurredAt: "2026-01-24T10:45:00Z", location: { city: "Muscat", country: "OMN" }, source: "Omantel", sourceClass: "restricted", payload: { msisdn: "+968 9xxxx ••118" } },
  { id: "mv-h04", travelerId: "demo-highrisk-sponsor", type: "MOL_EMPLOYMENT_START", occurredAt: "2026-01-25T00:00:00Z", location: { city: "Muscat", country: "OMN" }, source: "MOL registry", sourceClass: "restricted", payload: { employer: "Volga Holdings International", note: "declared employer mismatch" } },
  { id: "mv-h05", travelerId: "demo-highrisk-sponsor", type: "VEHICLE_RENTAL_START", occurredAt: "2026-01-26T09:10:00Z", location: { city: "Muscat", country: "OMN" }, source: "Sixt Oman", sourceClass: "internal", payload: { plate: "1-0091 C", modelEn: "Range Rover Sport" } },
  { id: "mv-h06", travelerId: "demo-highrisk-sponsor", type: "MUNICIPALITY_LEASE", occurredAt: "2026-01-28T10:00:00Z", location: { city: "Muscat", country: "OMN" }, source: "Muscat Municipality", sourceClass: "internal", payload: { unit: "Qurum Heights 12-C", leaseMonths: 12 } },
  { id: "mv-h07", travelerId: "demo-highrisk-sponsor", type: "VEHICLE_RENTAL_END", occurredAt: "2026-02-09T15:00:00Z", location: { city: "Muscat", country: "OMN" }, source: "Sixt Oman", sourceClass: "internal", payload: { plate: "1-0091 C", distanceKm: 918 } },
  { id: "mv-h08", travelerId: "demo-highrisk-sponsor", type: "HOTEL_CHECKOUT", occurredAt: "2026-02-10T11:30:00Z", location: { city: "Muscat", country: "OMN" }, source: "Kempinski Muscat", sourceClass: "internal", payload: { reservation: "KMP-2026-0118" } },
  { id: "mv-h09", travelerId: "demo-highrisk-sponsor", type: "BORDER_EXIT", occurredAt: "2026-02-10T14:20:00Z", location: { iata: "MCT", city: "Muscat", country: "OMN" }, source: "Border Entry/Exit", sourceClass: "internal", payload: { flight: "EK866" } },
  { id: "mv-h10", travelerId: "demo-highrisk-sponsor", type: "BORDER_ENTRY", occurredAt: "2026-04-18T22:05:00Z", location: { iata: "MCT", city: "Muscat", country: "OMN" }, source: "Border Entry/Exit", sourceClass: "internal", payload: { flight: "EK865" } },
  // Big coherence gap — no hotel check-in for 72h after arrival
  { id: "mv-h11", travelerId: "demo-highrisk-sponsor", type: "HOTEL_CHECKIN", occurredAt: "2026-04-21T22:40:00Z", location: { city: "Muscat", country: "OMN" }, source: "Al Bustan Palace", sourceClass: "internal", payload: { reservation: "ABP-2026-9120", room: "1911" }, coherenceGapHours: 72 },
  { id: "mv-h12", travelerId: "demo-highrisk-sponsor", type: "SIM_ACTIVATION", occurredAt: "2026-04-21T23:45:00Z", location: { city: "Muscat", country: "OMN" }, source: "Vodafone Oman", sourceClass: "restricted", payload: { msisdn: "+968 9xxxx ••902" } },
  { id: "mv-h13", travelerId: "demo-highrisk-sponsor", type: "MOL_EMPLOYMENT_END", occurredAt: "2026-02-10T00:00:00Z", location: { city: "Muscat", country: "OMN" }, source: "MOL registry", sourceClass: "restricted", payload: { employer: "Volga Holdings International" } },
];

// ─────────────────────────────────────────────────────────────────────────
// Wave 2 · Entity graph for Person 360° relationships tab
// ─────────────────────────────────────────────────────────────────────────

export interface GraphNode {
  id: string;
  type: "person" | "sponsor" | "employer" | "address" | "vehicle" | "sim" | "organization";
  label: string;
  labelAr?: string;
  riskScore?: number;
  classification?: Classification;
  sanctioned?: boolean;
}
export interface GraphEdge {
  from: string;
  to: string;
  type: "sponsor_of" | "employed_by" | "resided_at" | "rented" | "activated" | "traveled_with" | "sanctioned_by" | "related_to";
  label?: string;
  weight?: number;
}

export const ENTITY_GRAPHS: Record<string, { nodes: GraphNode[]; edges: GraphEdge[] }> = {
  "demo-lowrisk": {
    nodes: [
      { id: "subject", type: "person", label: "James W. Carter", labelAr: "جيمس كارتر", riskScore: 11, classification: "internal" },
      { id: "emp-bechtel", type: "employer", label: "Bechtel Corporation", labelAr: "شركة بكتل", classification: "public" },
      { id: "addr-almouj", type: "address", label: "Al Mouj Towers A-17", labelAr: "أبراج الموج أ-17" },
      { id: "sim-omantel", type: "sim", label: "Omantel SIM ••553", labelAr: "شريحة عمانتل" },
      { id: "veh-europcar", type: "vehicle", label: "Toyota Prado 8-2419 A", labelAr: "تويوتا برادو 8-2419 أ" },
      { id: "hotel-chedi", type: "organization", label: "Chedi Muscat", labelAr: "شيدي مسقط" },
    ],
    edges: [
      { from: "subject", to: "emp-bechtel", type: "employed_by", label: "employed_by" },
      { from: "subject", to: "addr-almouj", type: "resided_at", label: "resided_at" },
      { from: "subject", to: "sim-omantel", type: "activated", label: "activated" },
      { from: "subject", to: "veh-europcar", type: "rented", label: "rented" },
      { from: "subject", to: "hotel-chedi", type: "resided_at", label: "stayed_at" },
    ],
  },
  "demo-borderline": {
    nodes: [
      { id: "subject", type: "person", label: "Yasir A. Karim", labelAr: "ياسر كريم", riskScore: 38, classification: "internal" },
      { id: "spon-pearl", type: "sponsor", label: "Pearl Logistics LLC", labelAr: "لؤلؤة اللوجستيات" },
      { id: "emp-pearl", type: "employer", label: "Pearl Logistics LLC", labelAr: "لؤلؤة اللوجستيات" },
      { id: "addr-ghubra", type: "address", label: "Ghubra Heights B-04", labelAr: "غبرة هايتس ب-04" },
      { id: "sim-vodafone", type: "sim", label: "Vodafone SIM ••441" },
      { id: "veh-budget", type: "vehicle", label: "Hyundai Accent 2-7701 B" },
      { id: "person-travel-companion", type: "person", label: "Bilal R. Karim", labelAr: "بلال كريم", riskScore: 26 },
      { id: "hotel-radisson", type: "organization", label: "Radisson Blu Muscat" },
    ],
    edges: [
      { from: "subject", to: "spon-pearl", type: "sponsor_of", label: "sponsor_of" },
      { from: "subject", to: "emp-pearl", type: "employed_by", label: "employed_by" },
      { from: "subject", to: "addr-ghubra", type: "resided_at", label: "resided_at" },
      { from: "subject", to: "sim-vodafone", type: "activated" },
      { from: "subject", to: "veh-budget", type: "rented" },
      { from: "subject", to: "person-travel-companion", type: "traveled_with", label: "traveled_with" },
      { from: "subject", to: "hotel-radisson", type: "resided_at", label: "stayed_at" },
    ],
  },
  "demo-highrisk-sponsor": {
    nodes: [
      { id: "subject", type: "person", label: "Mikhail V. Petrov", labelAr: "ميخائيل بيتروف", riskScore: 71, classification: "restricted" },
      { id: "spon-volga", type: "sponsor", label: "Volga Holdings International", labelAr: "فولغا القابضة", riskScore: 88, classification: "restricted" },
      { id: "emp-volga", type: "employer", label: "Volga Holdings International", labelAr: "فولغا القابضة", riskScore: 88 },
      { id: "org-parent", type: "organization", label: "Rusenergy Ventures Ltd.", labelAr: "روس إنرجي", riskScore: 92, sanctioned: true, classification: "classified" },
      { id: "person-oligarch", type: "person", label: "A. K. Gavrilov (EU-sanctioned)", labelAr: "أ. غافريلوف (مُعاقَب)", riskScore: 96, sanctioned: true, classification: "classified" },
      { id: "addr-qurum", type: "address", label: "Qurum Heights 12-C", labelAr: "قرم هايتس 12-ج" },
      { id: "sim-vodafone-902", type: "sim", label: "Vodafone SIM ••902" },
      { id: "veh-sixt", type: "vehicle", label: "Range Rover Sport 1-0091 C" },
      { id: "hotel-kempinski", type: "organization", label: "Kempinski Muscat" },
    ],
    edges: [
      { from: "subject", to: "spon-volga", type: "sponsor_of", label: "sponsor_of" },
      { from: "subject", to: "emp-volga", type: "employed_by", label: "employed_by" },
      { from: "spon-volga", to: "org-parent", type: "related_to", label: "parent_of" },
      { from: "org-parent", to: "person-oligarch", type: "sanctioned_by", label: "2-hop · sanctioned" },
      { from: "subject", to: "addr-qurum", type: "resided_at" },
      { from: "subject", to: "sim-vodafone-902", type: "activated" },
      { from: "subject", to: "veh-sixt", type: "rented" },
      { from: "subject", to: "hotel-kempinski", type: "resided_at", label: "stayed_at" },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────
// Wave 2 · Case management — full lifecycle + disposition
// ─────────────────────────────────────────────────────────────────────────

export type CaseStatus = "DRAFT" | "OPEN" | "INVESTIGATING" | "PENDING_REVIEW" | "CLOSED";
export type CaseDisposition = "CONFIRMED_THREAT" | "FALSE_POSITIVE" | "INSUFFICIENT_EVIDENCE" | "TRANSFERRED";

export interface CaseNote {
  id: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  body: string;
}

export interface Case {
  id: string;
  title: string;
  titleAr: string;
  status: CaseStatus;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  ownerId: string;
  ownerName: string;
  subjectTravelerId: string;
  subjectName: string;
  linkedEvents: string[];
  linkedScores: string[];
  linkedSignals: string[];
  notes: CaseNote[];
  disposition?: CaseDisposition;
  dispositionReason?: string;
  openedAt: string;
  lastActivityAt: string;
  closedAt?: string;
  classification: Classification;
}

export const CASES: Case[] = [
  {
    id: "CASE-2026-00118",
    title: "Sanctions-proximate sponsor — 2-hop review",
    titleAr: "كفيل قريب من قائمة العقوبات — مراجعة مسارين",
    status: "INVESTIGATING",
    severity: "HIGH",
    ownerId: "analyst-rahma",
    ownerName: "Rahma Al-Kindi",
    subjectTravelerId: "demo-highrisk-sponsor",
    subjectName: "Mikhail V. Petrov",
    linkedEvents: ["mv-h01", "mv-h04", "mv-h10"],
    linkedScores: ["demo-highrisk-sponsor"],
    linkedSignals: ["R-SNC-003", "R-SNC-002", "R-DEC-001"],
    notes: [
      { id: "n1", authorId: "analyst-rahma", authorName: "Rahma Al-Kindi", createdAt: "2026-04-16T09:12:00Z", body: "Opened after sponsor graph-walk flagged Volga → Rusenergy → Gavrilov (EU sanctions). Subject has declared-employer mismatch against MOL. Pulling corporate filings from OpenCorporates for parent." },
      { id: "n2", authorId: "analyst-rahma", authorName: "Rahma Al-Kindi", createdAt: "2026-04-16T14:40:00Z", body: "OpenCorporates confirms Volga is 82% owned by Rusenergy. Rusenergy director since 2022 is Gavrilov. 2-hop path valid." },
      { id: "n3", authorId: "supervisor-ahmed", authorName: "Ahmed Al-Lawati", createdAt: "2026-04-17T07:30:00Z", body: "Requesting MOL attestation on Volga employment. Hold on border gate until status clarified." },
    ],
    openedAt: "2026-04-16T09:12:00Z",
    lastActivityAt: "2026-04-17T07:30:00Z",
    classification: "restricted",
  },
  {
    id: "CASE-2026-00119",
    title: "Presence coherence gap — 72h APIS→hotel",
    titleAr: "فجوة تماسك الحضور — 72 ساعة",
    status: "OPEN",
    severity: "MEDIUM",
    ownerId: "analyst-salim",
    ownerName: "Salim Al-Mahrouqi",
    subjectTravelerId: "demo-highrisk-sponsor",
    subjectName: "Mikhail V. Petrov",
    linkedEvents: ["mv-h10", "mv-h11", "mv-h12"],
    linkedScores: ["demo-highrisk-sponsor"],
    linkedSignals: ["presence_gap_apis_hotel"],
    notes: [
      { id: "n4", authorId: "analyst-salim", authorName: "Salim Al-Mahrouqi", createdAt: "2026-04-17T06:00:00Z", body: "Subject's arrival APIS on 18 Apr then nothing until Al Bustan check-in 72h later. Unusual for this traveler." },
    ],
    openedAt: "2026-04-17T06:00:00Z",
    lastActivityAt: "2026-04-17T06:00:00Z",
    classification: "internal",
  },
  {
    id: "CASE-2026-00120",
    title: "Routing anomaly cluster — CDG origin",
    titleAr: "تجمّع شذوذ في المسار — منشأ CDG",
    status: "PENDING_REVIEW",
    severity: "HIGH",
    ownerId: "analyst-noor",
    ownerName: "Noor Al-Farsi",
    subjectTravelerId: "demo-anomaly",
    subjectName: "Leila D. Benaissa",
    linkedEvents: [],
    linkedScores: ["demo-anomaly"],
    linkedSignals: ["iforest_anomaly", "R-RTE-001", "R-RTE-002"],
    notes: [
      { id: "n5", authorId: "analyst-noor", authorName: "Noor Al-Farsi", createdAt: "2026-04-15T12:00:00Z", body: "Booking made 11h before departure. Origin CDG rare for DZA→MCT. Escalating to supervisor for routing review." },
      { id: "n6", authorId: "analyst-noor", authorName: "Noor Al-Farsi", createdAt: "2026-04-16T09:20:00Z", body: "No prior advisories. Subject cleared biometric match. Awaiting final review and disposition." },
    ],
    openedAt: "2026-04-15T10:00:00Z",
    lastActivityAt: "2026-04-16T09:20:00Z",
    classification: "internal",
  },
  {
    id: "CASE-2026-00121",
    title: "Borderline-context review (PAK · GDELT)",
    titleAr: "مراجعة سياق حدّي (باكستان · GDELT)",
    status: "OPEN",
    severity: "MEDIUM",
    ownerId: "analyst-rahma",
    ownerName: "Rahma Al-Kindi",
    subjectTravelerId: "demo-borderline",
    subjectName: "Yasir A. Karim",
    linkedEvents: ["mv-b10", "mv-b11", "mv-b12"],
    linkedScores: ["demo-borderline"],
    linkedSignals: ["R-GEO-001", "R-GEO-002", "R-TMP-001"],
    notes: [
      { id: "n7", authorId: "analyst-rahma", authorName: "Rahma Al-Kindi", createdAt: "2026-04-17T08:00:00Z", body: "Routine borderline review. Subject has previously cleared visits. Advisory level 3 is the main driver." },
    ],
    openedAt: "2026-04-17T08:00:00Z",
    lastActivityAt: "2026-04-17T08:00:00Z",
    classification: "internal",
  },
  {
    id: "CASE-2026-00122",
    title: "Low-risk routine sample",
    titleAr: "عيّنة منخفضة المخاطر",
    status: "DRAFT",
    severity: "LOW",
    ownerId: "analyst-salim",
    ownerName: "Salim Al-Mahrouqi",
    subjectTravelerId: "demo-lowrisk",
    subjectName: "James W. Carter",
    linkedEvents: ["mv-l08"],
    linkedScores: ["demo-lowrisk"],
    linkedSignals: [],
    notes: [],
    openedAt: "2026-04-17T11:00:00Z",
    lastActivityAt: "2026-04-17T11:00:00Z",
    classification: "public",
  },
  {
    id: "CASE-2026-00115",
    title: "Confirmed sanctions hit — entity resolution",
    titleAr: "تطابق عقوبات مؤكد",
    status: "CLOSED",
    severity: "CRITICAL",
    ownerId: "analyst-noor",
    ownerName: "Noor Al-Farsi",
    subjectTravelerId: "rec-000136",
    subjectName: "Amr H. Barakat",
    linkedEvents: [],
    linkedScores: ["rec-000136"],
    linkedSignals: ["R-SNC-003"],
    notes: [
      { id: "n8", authorId: "analyst-noor", authorName: "Noor Al-Farsi", createdAt: "2026-04-10T10:00:00Z", body: "Sponsor Tripoli Offshore Services confirmed as front entity for UN-sanctioned network." },
      { id: "n9", authorId: "supervisor-ahmed", authorName: "Ahmed Al-Lawati", createdAt: "2026-04-12T11:00:00Z", body: "Confirmed threat. Closing with disposition CONFIRMED_THREAT and transferring to ROP Special Branch." },
    ],
    disposition: "CONFIRMED_THREAT",
    dispositionReason: "Sponsor confirmed as front entity for UN-sanctioned network after OpenCorporates + OFAC cross-check. Transferred to ROP Special Branch for follow-up.",
    openedAt: "2026-04-10T10:00:00Z",
    lastActivityAt: "2026-04-12T11:10:00Z",
    closedAt: "2026-04-12T11:10:00Z",
    classification: "classified",
  },
  {
    id: "CASE-2026-00110",
    title: "Anomaly false-positive — conference travel",
    titleAr: "نتيجة إيجابية خاطئة — سفر مؤتمرات",
    status: "CLOSED",
    severity: "MEDIUM",
    ownerId: "analyst-rahma",
    ownerName: "Rahma Al-Kindi",
    subjectTravelerId: "rec-000135",
    subjectName: "Chen Wei",
    linkedEvents: [],
    linkedScores: ["rec-000135"],
    linkedSignals: [],
    notes: [
      { id: "n10", authorId: "analyst-rahma", authorName: "Rahma Al-Kindi", createdAt: "2026-04-05T08:00:00Z", body: "Routing anomaly score 0.62. Subject attending Oman Energy Conference." },
      { id: "n11", authorId: "analyst-rahma", authorName: "Rahma Al-Kindi", createdAt: "2026-04-07T14:00:00Z", body: "Conference attendance confirmed by host. Closing as false positive — to be added to labelled training pipeline." },
    ],
    disposition: "FALSE_POSITIVE",
    dispositionReason: "Anomaly signal triggered by late booking for an attended Oman Energy Conference event. Host confirmation on file.",
    openedAt: "2026-04-05T08:00:00Z",
    lastActivityAt: "2026-04-07T14:05:00Z",
    closedAt: "2026-04-07T14:05:00Z",
    classification: "internal",
  },
  {
    id: "CASE-2026-00108",
    title: "Sponsor dissolution — insufficient evidence",
    titleAr: "حلّ الكفيل — أدلة غير كافية",
    status: "CLOSED",
    severity: "HIGH",
    ownerId: "analyst-noor",
    ownerName: "Noor Al-Farsi",
    subjectTravelerId: "rec-000131",
    subjectName: "Hasan M. Al-Bakri",
    linkedEvents: [],
    linkedScores: ["rec-000131"],
    linkedSignals: ["R-ENT-001"],
    notes: [
      { id: "n12", authorId: "analyst-noor", authorName: "Noor Al-Farsi", createdAt: "2026-04-01T08:00:00Z", body: "Sponsor OpenCorporates inactive Q4 2024. Unable to resolve beneficial ownership." },
      { id: "n13", authorId: "supervisor-ahmed", authorName: "Ahmed Al-Lawati", createdAt: "2026-04-03T16:00:00Z", body: "Closed with insufficient evidence. Will retrigger if sponsor reactivates." },
    ],
    disposition: "INSUFFICIENT_EVIDENCE",
    dispositionReason: "OpenCorporates record inactive Q4 2024, no substitute beneficial-ownership chain. Continued monitoring flag added.",
    openedAt: "2026-04-01T08:00:00Z",
    lastActivityAt: "2026-04-03T16:05:00Z",
    closedAt: "2026-04-03T16:05:00Z",
    classification: "restricted",
  },
  {
    id: "CASE-2026-00125",
    title: "Draft — potential visa-denial repeat",
    titleAr: "مسودة — احتمال تكرار رفض التأشيرة",
    status: "DRAFT",
    severity: "MEDIUM",
    ownerId: "analyst-salim",
    ownerName: "Salim Al-Mahrouqi",
    subjectTravelerId: "rec-000129",
    subjectName: "Abdul R. Hashemi",
    linkedEvents: [],
    linkedScores: ["rec-000129"],
    linkedSignals: [],
    notes: [],
    openedAt: "2026-04-17T12:00:00Z",
    lastActivityAt: "2026-04-17T12:00:00Z",
    classification: "internal",
  },
  {
    id: "CASE-2026-00126",
    title: "Biosecurity overlap — ROP coordination",
    titleAr: "تراكب أمن حيوي — تنسيق الشرطة",
    status: "INVESTIGATING",
    severity: "HIGH",
    ownerId: "analyst-rahma",
    ownerName: "Rahma Al-Kindi",
    subjectTravelerId: "demo-health",
    subjectName: "Sarah M. Nguyen",
    linkedEvents: [],
    linkedScores: ["demo-health"],
    linkedSignals: ["R-BIO-001"],
    notes: [
      { id: "n14", authorId: "analyst-rahma", authorName: "Rahma Al-Kindi", createdAt: "2026-04-16T07:00:00Z", body: "Origin SGN in active avian-influenza cluster (WHO DON). Notifying Ministry of Health for secondary screening at MCT." },
    ],
    openedAt: "2026-04-16T07:00:00Z",
    lastActivityAt: "2026-04-16T07:00:00Z",
    classification: "internal",
  },
  {
    id: "CASE-2026-00104",
    title: "Transferred — cross-agency (ROP)",
    titleAr: "نقل — تنسيق شرطي",
    status: "CLOSED",
    severity: "CRITICAL",
    ownerId: "analyst-noor",
    ownerName: "Noor Al-Farsi",
    subjectTravelerId: "rec-000127",
    subjectName: "Khaled A. Saleh",
    linkedEvents: [],
    linkedScores: ["rec-000127"],
    linkedSignals: [],
    notes: [
      { id: "n15", authorId: "supervisor-ahmed", authorName: "Ahmed Al-Lawati", createdAt: "2026-03-28T09:00:00Z", body: "Transferred to Royal Oman Police Special Branch for kinetic handling." },
    ],
    disposition: "TRANSFERRED",
    dispositionReason: "Transferred to Royal Oman Police Special Branch — case beyond civil adjudication scope.",
    openedAt: "2026-03-27T08:00:00Z",
    lastActivityAt: "2026-03-28T09:05:00Z",
    closedAt: "2026-03-28T09:05:00Z",
    classification: "classified",
  },
  {
    id: "CASE-2026-00127",
    title: "Pending review — document anomaly",
    titleAr: "قيد المراجعة — شذوذ وثيقة",
    status: "PENDING_REVIEW",
    severity: "LOW",
    ownerId: "analyst-salim",
    ownerName: "Salim Al-Mahrouqi",
    subjectTravelerId: "rec-000136",
    subjectName: "Amr H. Barakat",
    linkedEvents: [],
    linkedScores: ["rec-000136"],
    linkedSignals: ["R-DOC-001"],
    notes: [
      { id: "n16", authorId: "analyst-salim", authorName: "Salim Al-Mahrouqi", createdAt: "2026-04-16T10:00:00Z", body: "Passport format inconsistent. Supervisor to finalize before close." },
    ],
    openedAt: "2026-04-16T10:00:00Z",
    lastActivityAt: "2026-04-16T10:00:00Z",
    classification: "internal",
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Wave 2 · Entity resolution review queue (0.70–0.85 similarity band)
// ─────────────────────────────────────────────────────────────────────────

export interface EntityMatchCandidate {
  id: string;
  entityA: { id: string; type: "person" | "organization" | "sponsor"; canonicalName: string; aliases: string[]; attributes: Record<string, unknown>; sources: string[] };
  entityB: { id: string; type: "person" | "organization" | "sponsor"; canonicalName: string; aliases: string[]; attributes: Record<string, unknown>; sources: string[] };
  similarity: number;
  factors: {
    name_token_set_ratio: number;
    alias_overlap_jaccard: number;
    country_match: 0 | 0.5 | 1;
    dob_proximity: number;
    contextual_source_agreement: number;
  };
  createdAt: string;
  status: "PENDING" | "MERGED" | "KEPT_SEPARATE" | "ESCALATED";
}

export const ENTITY_MATCH_QUEUE: EntityMatchCandidate[] = [
  {
    id: "ERQ-0001",
    entityA: { id: "ent-1001", type: "person", canonicalName: "Mohammad A. Rahman", aliases: ["Mohammed Abdul Rahman", "M. A. Rahman"], attributes: { dob: "1983-05-14", nationality: "PAK", passportNumber: "AX1820233" }, sources: ["eVisa history", "MOL registry"] },
    entityB: { id: "ent-1044", type: "person", canonicalName: "Muhammad Abdur Rahman", aliases: ["Mohammad Rahman", "M A Rahman"], attributes: { dob: "1983-05-15", nationality: "PAK", passportNumber: "AX1820239" }, sources: ["OpenSanctions", "Hotels"] },
    similarity: 0.82,
    factors: { name_token_set_ratio: 0.88, alias_overlap_jaccard: 0.66, country_match: 1, dob_proximity: 0.92, contextual_source_agreement: 0.70 },
    createdAt: "2026-04-17T06:10:00Z",
    status: "PENDING",
  },
  {
    id: "ERQ-0002",
    entityA: { id: "ent-1102", type: "organization", canonicalName: "Pearl Logistics LLC", aliases: ["Pearl Logistics", "Pearl Log"], attributes: { country: "OMN", registered: "2018-06-01", industry: "Freight" }, sources: ["OpenCorporates", "MOL"] },
    entityB: { id: "ent-1207", type: "organization", canonicalName: "Pearl Logistics (Oman) LLC", aliases: ["Pearl Logistics Oman"], attributes: { country: "OMN", registered: "2018-06-15", industry: "Logistics" }, sources: ["OpenCorporates"] },
    similarity: 0.78,
    factors: { name_token_set_ratio: 0.85, alias_overlap_jaccard: 0.50, country_match: 1, dob_proximity: 0.95, contextual_source_agreement: 0.60 },
    createdAt: "2026-04-17T04:18:00Z",
    status: "PENDING",
  },
  {
    id: "ERQ-0003",
    entityA: { id: "ent-1220", type: "person", canonicalName: "Leila D. Benaissa", aliases: ["Leïla Ben-Aïssa", "Layla Benaissa"], attributes: { dob: "1991-02-09", nationality: "DZA", passportNumber: "DZ5593120" }, sources: ["eVisa history"] },
    entityB: { id: "ent-1288", type: "person", canonicalName: "Layla Ben Aissa", aliases: ["Leila Benaissa"], attributes: { dob: "1991-02-09", nationality: "DZA", passportNumber: "DZ5593120" }, sources: ["Hotels", "OpenSanctions"] },
    similarity: 0.84,
    factors: { name_token_set_ratio: 0.80, alias_overlap_jaccard: 0.80, country_match: 1, dob_proximity: 1, contextual_source_agreement: 0.72 },
    createdAt: "2026-04-17T02:40:00Z",
    status: "PENDING",
  },
  {
    id: "ERQ-0004",
    entityA: { id: "ent-1302", type: "sponsor", canonicalName: "Volga Holdings International", aliases: ["Volga Holdings", "Volga Intl."], attributes: { country: "RUS", registered: "2011-03-12" }, sources: ["OpenCorporates"] },
    entityB: { id: "ent-1355", type: "sponsor", canonicalName: "Volga Holding Intl FZ-LLC", aliases: ["Volga FZ"], attributes: { country: "UAE", registered: "2020-09-08" }, sources: ["OpenCorporates", "OpenSanctions"] },
    similarity: 0.73,
    factors: { name_token_set_ratio: 0.78, alias_overlap_jaccard: 0.33, country_match: 0.5, dob_proximity: 0.80, contextual_source_agreement: 0.70 },
    createdAt: "2026-04-16T20:30:00Z",
    status: "PENDING",
  },
  {
    id: "ERQ-0005",
    entityA: { id: "ent-1410", type: "person", canonicalName: "Chen Wei", aliases: ["Wei Chen"], attributes: { dob: "1978-07-21", nationality: "CHN", passportNumber: "CN4410928" }, sources: ["eVisa history"] },
    entityB: { id: "ent-1488", type: "person", canonicalName: "Chen Wei", aliases: ["Chen W."], attributes: { dob: "1978-07-22", nationality: "CHN", passportNumber: "CN4410921" }, sources: ["Hotels"] },
    similarity: 0.76,
    factors: { name_token_set_ratio: 1, alias_overlap_jaccard: 0.33, country_match: 1, dob_proximity: 0.92, contextual_source_agreement: 0.54 },
    createdAt: "2026-04-16T19:10:00Z",
    status: "PENDING",
  },
  {
    id: "ERQ-0006",
    entityA: { id: "ent-1501", type: "person", canonicalName: "Khaled A. Saleh", aliases: ["Khalid Al-Saleh"], attributes: { dob: "1986-09-03", nationality: "YEM" }, sources: ["eVisa history"] },
    entityB: { id: "ent-1545", type: "person", canonicalName: "Khaled Abdullah Saleh", aliases: ["K. A. Saleh"], attributes: { dob: "1986-09-03", nationality: "YEM" }, sources: ["OpenSanctions"] },
    similarity: 0.81,
    factors: { name_token_set_ratio: 0.90, alias_overlap_jaccard: 0.50, country_match: 1, dob_proximity: 1, contextual_source_agreement: 0.66 },
    createdAt: "2026-04-16T16:55:00Z",
    status: "MERGED",
  },
  {
    id: "ERQ-0007",
    entityA: { id: "ent-1610", type: "organization", canonicalName: "Bechtel Corporation", aliases: ["Bechtel Corp", "Bechtel"], attributes: { country: "USA" }, sources: ["OpenCorporates"] },
    entityB: { id: "ent-1660", type: "organization", canonicalName: "Bechtel Infrastructure & Power", aliases: ["Bechtel I&P"], attributes: { country: "USA" }, sources: ["OpenCorporates"] },
    similarity: 0.71,
    factors: { name_token_set_ratio: 0.62, alias_overlap_jaccard: 0.25, country_match: 1, dob_proximity: 0.85, contextual_source_agreement: 0.80 },
    createdAt: "2026-04-16T15:20:00Z",
    status: "KEPT_SEPARATE",
  },
  {
    id: "ERQ-0008",
    entityA: { id: "ent-1701", type: "person", canonicalName: "Abdul R. Hashemi", aliases: ["Abdulrahim Hashemi"], attributes: { dob: "1975-11-02", nationality: "IRN" }, sources: ["eVisa history"] },
    entityB: { id: "ent-1760", type: "person", canonicalName: "Abd Al-Rahim Hashimi", aliases: ["Abd al Rahim Hashemi"], attributes: { dob: "1975-11-02", nationality: "IRN" }, sources: ["OpenSanctions"] },
    similarity: 0.77,
    factors: { name_token_set_ratio: 0.78, alias_overlap_jaccard: 0.55, country_match: 1, dob_proximity: 1, contextual_source_agreement: 0.52 },
    createdAt: "2026-04-16T13:30:00Z",
    status: "ESCALATED",
  },
  {
    id: "ERQ-0009",
    entityA: { id: "ent-1801", type: "person", canonicalName: "Stefan K. Larsson", aliases: ["Stefan Larsson"], attributes: { dob: "1989-08-18", nationality: "SWE" }, sources: ["eVisa history"] },
    entityB: { id: "ent-1844", type: "person", canonicalName: "Stefan Larsson", aliases: ["S. Larsson"], attributes: { dob: "1989-08-19", nationality: "SWE" }, sources: ["Hotels"] },
    similarity: 0.79,
    factors: { name_token_set_ratio: 0.92, alias_overlap_jaccard: 0.50, country_match: 1, dob_proximity: 0.92, contextual_source_agreement: 0.58 },
    createdAt: "2026-04-16T11:10:00Z",
    status: "PENDING",
  },
  {
    id: "ERQ-0010",
    entityA: { id: "ent-1901", type: "organization", canonicalName: "Arabian Gulf Trading", aliases: ["AG Trading", "Arabian Trading"], attributes: { country: "YEM" }, sources: ["OpenCorporates"] },
    entityB: { id: "ent-1955", type: "organization", canonicalName: "Arabian Gulf Trade & Commerce", aliases: ["AG Trade"], attributes: { country: "YEM" }, sources: ["OpenCorporates"] },
    similarity: 0.74,
    factors: { name_token_set_ratio: 0.70, alias_overlap_jaccard: 0.30, country_match: 1, dob_proximity: 0.88, contextual_source_agreement: 0.65 },
    createdAt: "2026-04-16T09:50:00Z",
    status: "PENDING",
  },
  {
    id: "ERQ-0011",
    entityA: { id: "ent-2001", type: "person", canonicalName: "Priya N. Raman", aliases: ["Priya Raman"], attributes: { dob: "1992-01-04", nationality: "IND" }, sources: ["eVisa history"] },
    entityB: { id: "ent-2050", type: "person", canonicalName: "Priya Narayan Raman", aliases: ["P. N. Raman"], attributes: { dob: "1992-01-04", nationality: "IND" }, sources: ["Hotels"] },
    similarity: 0.83,
    factors: { name_token_set_ratio: 0.92, alias_overlap_jaccard: 0.60, country_match: 1, dob_proximity: 1, contextual_source_agreement: 0.62 },
    createdAt: "2026-04-16T07:40:00Z",
    status: "PENDING",
  },
  {
    id: "ERQ-0012",
    entityA: { id: "ent-2101", type: "sponsor", canonicalName: "Levant Holdings", aliases: ["Levant Hldgs"], attributes: { country: "SYR" }, sources: ["OpenCorporates"] },
    entityB: { id: "ent-2155", type: "sponsor", canonicalName: "Levant Holdings Group", aliases: ["LHG"], attributes: { country: "SYR" }, sources: ["OpenCorporates", "OpenSanctions"] },
    similarity: 0.72,
    factors: { name_token_set_ratio: 0.70, alias_overlap_jaccard: 0.30, country_match: 1, dob_proximity: 0.85, contextual_source_agreement: 0.72 },
    createdAt: "2026-04-16T05:00:00Z",
    status: "PENDING",
  },
  {
    id: "ERQ-0013",
    entityA: { id: "ent-2201", type: "person", canonicalName: "Mikhail V. Petrov", aliases: ["M. Petrov"], attributes: { dob: "1971-04-09", nationality: "RUS" }, sources: ["eVisa history"] },
    entityB: { id: "ent-2244", type: "person", canonicalName: "Mikhail Vladimirovich Petrov", aliases: ["M. V. Petrov"], attributes: { dob: "1971-04-09", nationality: "RUS" }, sources: ["OpenSanctions"] },
    similarity: 0.85,
    factors: { name_token_set_ratio: 0.95, alias_overlap_jaccard: 0.66, country_match: 1, dob_proximity: 1, contextual_source_agreement: 0.68 },
    createdAt: "2026-04-15T22:10:00Z",
    status: "PENDING",
  },
  {
    id: "ERQ-0014",
    entityA: { id: "ent-2301", type: "person", canonicalName: "Mohamed O. El-Sayed", aliases: ["Mohamed El Sayed", "M. El Sayed"], attributes: { dob: "1982-12-17", nationality: "EGY" }, sources: ["eVisa history"] },
    entityB: { id: "ent-2345", type: "person", canonicalName: "Mohammed Omar El Sayed", aliases: ["Mohamed O. Elsayed"], attributes: { dob: "1982-12-17", nationality: "EGY" }, sources: ["MOL", "Hotels"] },
    similarity: 0.80,
    factors: { name_token_set_ratio: 0.88, alias_overlap_jaccard: 0.55, country_match: 1, dob_proximity: 1, contextual_source_agreement: 0.62 },
    createdAt: "2026-04-15T18:40:00Z",
    status: "PENDING",
  },
  {
    id: "ERQ-0015",
    entityA: { id: "ent-2401", type: "person", canonicalName: "Omar Z. Qureshi", aliases: ["Omar Qureshi"], attributes: { dob: "1980-06-02", nationality: "PAK" }, sources: ["eVisa history"] },
    entityB: { id: "ent-2444", type: "person", canonicalName: "Omar Zahid Qureshi", aliases: ["O. Z. Qureshi"], attributes: { dob: "1980-06-02", nationality: "PAK" }, sources: ["MOL"] },
    similarity: 0.80,
    factors: { name_token_set_ratio: 0.92, alias_overlap_jaccard: 0.50, country_match: 1, dob_proximity: 1, contextual_source_agreement: 0.58 },
    createdAt: "2026-04-15T16:20:00Z",
    status: "PENDING",
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Wave 2 · Notifications routing + channels
// ─────────────────────────────────────────────────────────────────────────

export interface RoutingRule {
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  recipients: string[];
  channels: ("in_app" | "email" | "sms" | "webhook" | "voice")[];
  ackSlaMinutes: number | null;
  escalateAfterMinutes: number | null;
  escalateTo: string | null;
}

export const ROUTING_RULES: RoutingRule[] = [
  { severity: "CRITICAL", recipients: ["on-duty analyst", "team lead"], channels: ["in_app", "sms", "email"], ackSlaMinutes: 15,  escalateAfterMinutes: 15,  escalateTo: "supervisor" },
  { severity: "HIGH",     recipients: ["on-duty analyst"],              channels: ["in_app", "email"],        ackSlaMinutes: 60,  escalateAfterMinutes: 60,  escalateTo: "supervisor" },
  { severity: "MEDIUM",   recipients: ["queue"],                         channels: ["in_app"],                  ackSlaMinutes: 480, escalateAfterMinutes: 480, escalateTo: "end-of-shift digest" },
  { severity: "LOW",      recipients: [],                                channels: ["email"],                   ackSlaMinutes: null, escalateAfterMinutes: null, escalateTo: null },
];

export interface NotificationChannel {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
  health: "healthy" | "degraded" | "down";
  provider: string;
  lastTestAt: string;
  config: Record<string, string>;
}

export const NOTIFICATION_CHANNELS: NotificationChannel[] = [
  { id: "in_app",  name: "In-App",   icon: "ri-notification-3-line", enabled: true,  health: "healthy", provider: "Al-Ameen Core", lastTestAt: "2026-04-17T05:30:00Z", config: { topic: "alerts.*", retention: "30d" } },
  { id: "email",   name: "Email",    icon: "ri-mail-line",            enabled: true,  health: "healthy",  provider: "AWS SES",        lastTestAt: "2026-04-17T03:05:00Z", config: { sender: "alerts@alameen.gov.om", rateLimit: "500/min" } },
  { id: "sms",     name: "SMS",      icon: "ri-smartphone-line",      enabled: true,  health: "degraded", provider: "Omantel SMS GW", lastTestAt: "2026-04-17T02:40:00Z", config: { sender: "ALAMEEN", rateLimit: "120/min" } },
  { id: "webhook", name: "Webhook",  icon: "ri-plug-line",             enabled: true,  health: "healthy",  provider: "Internal ESB",   lastTestAt: "2026-04-17T04:12:00Z", config: { url: "https://esb.alameen.gov.om/notify", rateLimit: "10000/min" } },
  { id: "voice",   name: "Voice Call", icon: "ri-phone-line",          enabled: false, health: "down",     provider: "Omantel Voice",  lastTestAt: "2026-04-14T11:15:00Z", config: { sender: "ALAMEEN", note: "pending Phase 2 contract" } },
];

// ─────────────────────────────────────────────────────────────────────────
// Wave 2 · Scoring "As-of" replay (spec §8.1)
// ─────────────────────────────────────────────────────────────────────────

export interface AsOfSnapshot {
  recordId: string;
  asOf: string;
  unifiedScore: number;
  subScores: Record<SubScoreKey, number>;
  featureSnapshotHash: string;
  differences: { source: string; thenValue: string; nowValue: string }[];
}

// Deterministic decay — % of current per age bucket (older = smaller)
const AS_OF_DECAY: Record<string, number> = { "24h": 0.96, "7d": 0.88, "30d": 0.78 };

const buildAsOfSnapshots = (): Record<string, AsOfSnapshot[]> => {
  const out: Record<string, AsOfSnapshot[]> = {};
  const buckets: { label: string; offsetMs: number }[] = [
    { label: "24h", offsetMs: 24 * 3_600_000 },
    { label: "7d",  offsetMs: 7 * 24 * 3_600_000 },
    { label: "30d", offsetMs: 30 * 24 * 3_600_000 },
  ];
  // Simple FNV-1a-ish string hash for stable pseudo-SHA prefixes.
  const shortHash = (s: string): string => {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
    }
    return h.toString(16).padStart(8, "0").slice(0, 8);
  };

  SCORED_RECORDS.forEach((r) => {
    out[r.id] = buckets.map((b) => {
      const decay = AS_OF_DECAY[b.label];
      const subScores = Object.fromEntries(
        (Object.keys(r.subScores) as SubScoreKey[]).map((k) => [k, Math.round(r.subScores[k] * decay)]),
      ) as Record<SubScoreKey, number>;
      const unifiedScore = computeUnified(subScores);
      const asOfDate = new Date(new Date(r.computedAt).getTime() - b.offsetMs).toISOString();
      const hash = `sha:${shortHash(r.id + b.label)}…`;
      // Synthesize a short differences list based on the biggest deltas.
      const deltas = (Object.keys(r.subScores) as SubScoreKey[])
        .map((k) => ({ k, delta: r.subScores[k] - subScores[k] }))
        .sort((a, b) => b.delta - a.delta)
        .slice(0, 3);
      const differences = deltas.map(({ k }) => {
        const meta = DEFAULT_SUB_SCORE_WEIGHTS.find((w) => w.key === k)!;
        return {
          source: meta.primarySources[0] ?? "Internal",
          thenValue: `${meta.labelEn}: ${subScores[k]}`,
          nowValue: `${meta.labelEn}: ${r.subScores[k]}`,
        };
      });
      return { recordId: r.id, asOf: asOfDate, unifiedScore, subScores, featureSnapshotHash: hash, differences };
    });
  });

  return out;
};

export const AS_OF_SNAPSHOTS: Record<string, AsOfSnapshot[]> = buildAsOfSnapshots();

// ─────────────────────────────────────────────────────────────────────────
// Wave 3 · Deliverable 5 — clearance simulator ordering
// Exported from mocks for convenience; the React context lives in
// src/brand/clearance.ts. Ordered low → high; rank = index.
// ─────────────────────────────────────────────────────────────────────────

export const CLEARANCE_LEVELS: Classification[] = ["public", "internal", "restricted", "classified"];

// ─────────────────────────────────────────────────────────────────────────
// Wave 3 · Deliverable 3 — Report templates + scheduled runs
// Six pre-built templates, four active schedules. Data only — the Reports
// page renders them.
// ─────────────────────────────────────────────────────────────────────────

export interface ReportTemplate {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  color: string;
  estimatedPages: number;
  sections: string[];
  // Cadence this template is *typically* run at — drives the chip on the card.
  suggestedCadence: string;
  audience: string;
}

export const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: "tmpl-daily-ops",
    name: "Daily Ops Summary",
    nameAr: "ملخّص العمليات اليومي",
    description: "24-hour operations snapshot — scoring throughput, queue flow, team performance.",
    descriptionAr: "لقطة عمليات على مدار 24 ساعة — حجم التسجيل، تدفق القائمة، أداء الفريق.",
    icon: "ri-sun-line",
    color: "#D6B47E",
    estimatedPages: 3,
    sections: ["scored_24h", "flagged_24h", "cases_opened_closed", "avg_response_time", "top_flags"],
    suggestedCadence: "Daily · 08:00",
    audience: "Duty analyst",
  },
  {
    id: "tmpl-weekly-source-health",
    name: "Weekly Source Health",
    nameAr: "صحة المصادر الأسبوعية",
    description: "Per-source uptime, latency, record ingest rate, DLQ depth, and failure patterns.",
    descriptionAr: "تشغيل كل مصدر وزمن الاستجابة ومعدل الاستيعاب وعمق DLQ وأنماط الإخفاق.",
    icon: "ri-broadcast-line",
    color: "#4A8E3A",
    estimatedPages: 5,
    sections: ["source_uptime", "source_latency", "records_ingested", "dlq_depth", "failure_patterns"],
    suggestedCadence: "Weekly · Mondays 09:00",
    audience: "Ops team",
  },
  {
    id: "tmpl-monthly-exec",
    name: "Monthly Executive",
    nameAr: "التقرير التنفيذي الشهري",
    description: "Risk posture, trend analysis, top cases by impact, cost per case.",
    descriptionAr: "الوضع الأمني، تحليل الاتجاهات، أبرز القضايا بالتأثير، تكلفة القضية.",
    icon: "ri-line-chart-line",
    color: "#6B4FAE",
    estimatedPages: 8,
    sections: ["risk_posture_trends", "top_cases", "cost_per_case", "team_throughput", "kpi_deltas"],
    suggestedCadence: "Monthly · 1st @ 07:00",
    audience: "Leadership",
  },
  {
    id: "tmpl-quarterly-gov",
    name: "Quarterly Governance",
    nameAr: "الحوكمة الفصلية",
    description: "Drift, fairness, rule-fire distribution, model versions deployed, calibration audit.",
    descriptionAr: "الانحراف والعدالة وتوزيع إطلاق القواعد ونماذج النشر وتدقيق المعايرة.",
    icon: "ri-shield-star-line",
    color: "#C98A1B",
    estimatedPages: 12,
    sections: ["drift_metrics", "fairness_audit", "rule_fire_distribution", "model_versions", "calibration"],
    suggestedCadence: "Quarterly",
    audience: "Governance board",
  },
  {
    id: "tmpl-adhoc-score-audit",
    name: "Ad-hoc Score Audit",
    nameAr: "تدقيق درجة فرديّة",
    description: "Full lineage for a single scored record — feature snapshot, contributions, skipped rules.",
    descriptionAr: "تسلسل كامل لسجل تسجيل واحد — لقطة الميزات، الإسهامات، القواعد المُتخطّاة.",
    icon: "ri-file-search-line",
    color: "#4A7AA8",
    estimatedPages: 2,
    sections: ["score_lineage", "feature_snapshot", "contributions", "rules_skipped", "replay_hash"],
    suggestedCadence: "On demand",
    audience: "Analyst / auditor",
  },
  {
    id: "tmpl-compliance-summary",
    name: "Compliance Summary",
    nameAr: "ملخّص الامتثال",
    description: "Classified accesses, retention adherence, audit events grouped by actor and severity.",
    descriptionAr: "الوصولات السرّية، التزام الاحتفاظ، أحداث التدقيق مجمّعة بالفاعل والخطورة.",
    icon: "ri-file-shield-line",
    color: "#C94A5E",
    estimatedPages: 6,
    sections: ["classified_accesses", "data_retention", "audit_by_actor", "access_violations"],
    suggestedCadence: "Monthly · 1st @ 09:00",
    audience: "Compliance officer",
  },
];

export type ScheduleStatus = "ok" | "failed" | "pending";

export interface ScheduledReport {
  id: string;
  templateId: string;
  cadence: string;       // human-readable "Daily 08:00" / "Mondays 09:00"
  recipients: string[];
  lastRunAt: string;
  lastRunStatus: ScheduleStatus;
  nextRunAt: string;
  enabled: boolean;
  durationMs: number;    // last run duration for the detail row
}

export const SCHEDULED_REPORTS: ScheduledReport[] = [
  {
    id: "sch-daily-ops",
    templateId: "tmpl-daily-ops",
    cadence: "Daily 08:00",
    recipients: ["duty-analyst@alameen.gov.om"],
    lastRunAt: "2026-04-17T08:00:00Z",
    lastRunStatus: "ok",
    nextRunAt: "2026-04-18T08:00:00Z",
    enabled: true,
    durationMs: 1240,
  },
  {
    id: "sch-weekly-source",
    templateId: "tmpl-weekly-source-health",
    cadence: "Mondays 09:00",
    recipients: ["ops-team@alameen.gov.om", "connectors@alameen.gov.om"],
    lastRunAt: "2026-04-13T09:00:00Z",
    lastRunStatus: "ok",
    nextRunAt: "2026-04-20T09:00:00Z",
    enabled: true,
    durationMs: 4380,
  },
  {
    id: "sch-monthly-exec",
    templateId: "tmpl-monthly-exec",
    cadence: "1st of month 07:00",
    recipients: ["leadership@alameen.gov.om"],
    lastRunAt: "2026-04-01T07:00:00Z",
    lastRunStatus: "ok",
    nextRunAt: "2026-05-01T07:00:00Z",
    enabled: true,
    durationMs: 8920,
  },
  {
    id: "sch-quarterly-gov",
    templateId: "tmpl-quarterly-gov",
    cadence: "Quarterly",
    recipients: ["governance@alameen.gov.om"],
    lastRunAt: "2026-01-15T07:00:00Z",
    lastRunStatus: "ok",
    nextRunAt: "2026-04-15T07:00:00Z",
    enabled: true,
    durationMs: 21_400,
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Wave 3 · Deliverable 4 — Demo narration scripts
// Each script walks one route through its key interactive elements.
// Target selectors use `[data-narrate-id="..."]` hooks already on the pages.
// ─────────────────────────────────────────────────────────────────────────

export interface NarrationStep {
  targetSelector: string;
  titleEn: string;
  titleAr: string;
  bodyEn: string;
  bodyAr: string;
  durationMs?: number;
}

export interface NarrationScript {
  route: string;
  title: string;
  titleAr: string;
  steps: NarrationStep[];
}

export const DEMO_NARRATIONS: NarrationScript[] = [
  {
    route: "/dashboard",
    title: "Command Center walkthrough",
    titleAr: "جولة مركز القيادة",
    steps: [
      {
        targetSelector: "[data-narrate-id='dashboard-kpis']",
        titleEn: "Live KPI strip",
        titleAr: "شريط المؤشرات المباشر",
        bodyEn: "Every tile is a live aggregation. Scored, flagged, open cases — always reflects current mock data.",
        bodyAr: "كل بطاقة تجميع لحظي. مسجَّل، مُرفَع، قضايا مفتوحة — دائماً يعكس البيانات الحالية.",
      },
      {
        targetSelector: "[data-narrate-id='dashboard-sidebar']",
        titleEn: "Single dashboard sidebar",
        titleAr: "شريط جانبي موحَّد",
        bodyEn: "Risk Assessment, OSINT, Watchlist, Cases, Person 360°, Audit, Entity Resolution, Reports — one operator shell.",
        bodyAr: "تقييم المخاطر، OSINT، قائمة المراقبة، القضايا، ملف الشخص، التدقيق، حل الكيانات، التقارير — غلاف واحد.",
      },
      {
        targetSelector: "[data-narrate-id='dashboard-event-feed']",
        titleEn: "Unified event feed",
        titleAr: "تدفق الأحداث الموحَّد",
        bodyEn: "Every ingested signal surfaces here with source, classification, and timestamp.",
        bodyAr: "كل إشارة مستوعبة تظهر هنا مع المصدر والتصنيف والطابع الزمني.",
      },
      {
        targetSelector: "[data-narrate-id='dashboard-shortcut-osint']",
        titleEn: "Jump to OSINT Risk Engine",
        titleAr: "الانتقال إلى محرّك المخاطر OSINT",
        bodyEn: "The signature module — 7 tabs, from Operator Queue to Model Governance.",
        bodyAr: "الوحدة الأبرز — 7 تبويبات من قائمة المشغّل إلى حوكمة النموذج.",
      },
    ],
  },
  {
    route: "/dashboard/osint-risk-engine",
    title: "OSINT Risk Engine — feature tour",
    titleAr: "جولة محرّك المخاطر OSINT",
    steps: [
      {
        targetSelector: "[data-narrate-id='osint-overview-kpis']",
        titleEn: "Unified score overview",
        titleAr: "نظرة عامة على الدرجة الموحَّدة",
        bodyEn: "24h throughput, flagged rate, average score, live source count, model version.",
        bodyAr: "حجم 24 ساعة، نسبة التنبيه، متوسط الدرجة، عدد المصادر الحيّة، إصدار النموذج.",
      },
      {
        targetSelector: "[data-narrate-id='osint-queue-first-row']",
        titleEn: "Operator Queue",
        titleAr: "قائمة المشغّل",
        bodyEn: "Records sorted by unified score. Click a row to open Explainability with full lineage.",
        bodyAr: "سجلات مرتَّبة بالدرجة الموحَّدة. اضغط على صف لفتح الشرح الكامل للسلسلة.",
      },
      {
        targetSelector: "[data-narrate-id='osint-explain-coverage']",
        titleEn: "Coverage strip",
        titleAr: "شريط التغطية",
        bodyEn: "Transparency — which sources contributed, which rules skipped, confidence gauge.",
        bodyAr: "شفافية — أيّ مصادر ساهمت، أيّ قواعد تم تجاوزها، مقياس الثقة.",
      },
      {
        targetSelector: "[data-narrate-id='osint-sequence-gap']",
        titleEn: "Sequence Coherence anomaly",
        titleAr: "شذوذ تماسك التسلسل",
        bodyEn: "62h APIS → hotel gap triggers the Model 3 presence anomaly — rules alone wouldn't catch it.",
        bodyAr: "فجوة 62 ساعة بين APIS والفندق تُفعِّل شذوذ الحضور — لا تكتشفها القواعد وحدها.",
      },
      {
        targetSelector: "[data-narrate-id='osint-sources-mix']",
        titleEn: "Source mix",
        titleAr: "مزيج المصادر",
        bodyEn: "8 public OSINT feeds + 9 internal streams. Classification-aware, refresh-aware.",
        bodyAr: "8 تغذيات OSINT عامة + 9 تدفقات داخلية. واعية للتصنيف ولتردّد التحديث.",
      },
      {
        targetSelector: "[data-narrate-id='osint-governance-drift']",
        titleEn: "Model drift monitor",
        titleAr: "مراقبة انحراف النموذج",
        bodyEn: "30-day drift + calibration curve. Governance tab catches silent degradation.",
        bodyAr: "انحراف 30 يوماً + منحنى المعايرة. تبويب الحوكمة يلتقط التراجع الصامت.",
      },
      {
        targetSelector: "[data-narrate-id='osint-config-profile']",
        titleEn: "Weight profiles",
        titleAr: "ملفات الأوزان",
        bodyEn: "Switch profiles for ETA vs API/PNR, or classified vs public. Every change is auditable.",
        bodyAr: "بدّل الملفات بين ETA و API/PNR أو سرّي وعام. كل تغيير مسجَّل للتدقيق.",
      },
    ],
  },
  {
    route: "/dashboard/person-360",
    title: "Person 360° dossier",
    titleAr: "ملف الشخص 360°",
    steps: [
      {
        targetSelector: "[data-narrate-id='person-subject-header']",
        titleEn: "Subject header",
        titleAr: "ترويسة الشخص",
        bodyEn: "Name, nationality, passport, unified score — everything the operator needs up top.",
        bodyAr: "الاسم والجنسية والجواز والدرجة الموحَّدة — كل ما يحتاجه المشغّل في الأعلى.",
      },
      {
        targetSelector: "[data-narrate-id='person-identity-cards']",
        titleEn: "Identity breakdown",
        titleAr: "تفصيل الهوية",
        bodyEn: "Biographic, passport, national ID, aliases, contact — redacted by clearance.",
        bodyAr: "المعلومات الشخصية، الجواز، الرقم الوطني، الأسماء البديلة، الاتصال — تُحجَب بالصلاحية.",
      },
      {
        targetSelector: "[data-narrate-id='person-tab-movements']",
        titleEn: "Movements timeline",
        titleAr: "الجدول الزمني للحركات",
        bodyEn: "Border, hotel, SIM, rental, MOL, municipality — one coherent cross-stream timeline.",
        bodyAr: "حدود، فندق، شريحة، إيجار، توظيف، بلدية — جدول زمني واحد متعدد المصادر.",
      },
      {
        targetSelector: "[data-narrate-id='person-tab-relationships']",
        titleEn: "Entity graph",
        titleAr: "شبكة الكيانات",
        bodyEn: "Sponsor, employer, address — personalized PageRank feeds the Entity sub-score.",
        bodyAr: "الكفيل، صاحب العمل، العنوان — PageRank مخصَّص يغذّي درجة الكيانات.",
      },
      {
        targetSelector: "[data-narrate-id='person-tab-cases']",
        titleEn: "Active cases",
        titleAr: "القضايا النشطة",
        bodyEn: "Every case touching this subject — status, severity, owner, last activity.",
        bodyAr: "كل قضية تتعلق بهذا الشخص — الحالة، الخطورة، المالك، آخر نشاط.",
      },
    ],
  },
  {
    route: "/dashboard/case-management",
    title: "Case Management lifecycle",
    titleAr: "دورة إدارة القضايا",
    steps: [
      {
        targetSelector: "[data-narrate-id='cases-pipeline']",
        titleEn: "Kanban pipeline",
        titleAr: "خط الأنابيب",
        bodyEn: "Draft → Open → Investigating → Pending Review → Closed. Drag or click to advance.",
        bodyAr: "مسودّة → مفتوحة → قيد التحقيق → بانتظار المراجعة → مغلقة. اسحب أو اضغط للتقدم.",
      },
      {
        targetSelector: "[data-narrate-id='cases-first-card']",
        titleEn: "Case card",
        titleAr: "بطاقة القضية",
        bodyEn: "ID, severity, owner, linked subjects, classification. Click for full dossier.",
        bodyAr: "المعرّف، الخطورة، المالك، الأشخاص المرتبطون، التصنيف. اضغط للملف الكامل.",
      },
      {
        targetSelector: "[data-narrate-id='cases-disposition']",
        titleEn: "Disposition gates",
        titleAr: "بوّابات القرار",
        bodyEn: "Closing requires a disposition: Confirmed Threat, False Positive, Insufficient Evidence, Transferred.",
        bodyAr: "الإغلاق يستلزم قراراً: تهديد مؤكَّد، إنذار زائف، أدلّة غير كافية، مُحوَّلة.",
      },
      {
        targetSelector: "[data-narrate-id='cases-notes']",
        titleEn: "Case notes",
        titleAr: "ملاحظات القضية",
        bodyEn: "Every note is timestamped + actor-stamped + immutable. Feeds the Audit Log.",
        bodyAr: "كل ملاحظة مختومة بالزمن والفاعل وغير قابلة للتعديل. تتدفق إلى سجل التدقيق.",
      },
      {
        targetSelector: "[data-narrate-id='cases-stats']",
        titleEn: "Rollup stats",
        titleAr: "الإحصاءات التجميعية",
        bodyEn: "Open / closed / average time-to-disposition — everything derived, nothing hardcoded.",
        bodyAr: "مفتوحة / مغلقة / متوسط وقت القرار — كل شيء مُشتق وليس ثابتاً.",
      },
    ],
  },
  {
    route: "/dashboard/audit-log",
    title: "Audit Log viewer",
    titleAr: "عارض سجل التدقيق",
    steps: [
      {
        targetSelector: "[data-narrate-id='audit-filters']",
        titleEn: "Event-type filters",
        titleAr: "مرشّحات نوع الحدث",
        bodyEn: "Score computed, rule fired, classified accessed, weight changed — slice by actor or severity.",
        bodyAr: "حُسِبت درجة، أُطلقت قاعدة، وصول سرّي، تغيير وزن — قسِّم حسب الفاعل أو الخطورة.",
      },
      {
        targetSelector: "[data-narrate-id='audit-first-row']",
        titleEn: "One row = one immutable event",
        titleAr: "كل صف = حدث ثابت",
        bodyEn: "Actor + role + target + classification + detail payload. Signed, WORM storage.",
        bodyAr: "الفاعل + الدور + الهدف + التصنيف + الحمولة. موقَّع، تخزين WORM.",
      },
      {
        targetSelector: "[data-narrate-id='audit-export']",
        titleEn: "Compliance export",
        titleAr: "تصدير الامتثال",
        bodyEn: "Feeds the Compliance Summary report. CSV / JSON / signed PDF.",
        bodyAr: "يُغذّي تقرير ملخّص الامتثال. CSV / JSON / PDF موقَّع.",
      },
    ],
  },
  {
    route: "/dashboard/entity-resolution",
    title: "Entity Resolution queue",
    titleAr: "قائمة حل الكيانات",
    steps: [
      {
        targetSelector: "[data-narrate-id='entity-queue']",
        titleEn: "Pending matches",
        titleAr: "التطابقات المعلَّقة",
        bodyEn: "Candidates ranked by match score. Human confirms or rejects — feeds training data.",
        bodyAr: "المرشّحون مرتَّبون بدرجة التطابق. يُقرّ الإنسان أو يرفض — يغذّي بيانات التدريب.",
      },
      {
        targetSelector: "[data-narrate-id='entity-first-pair']",
        titleEn: "Side-by-side comparison",
        titleAr: "مقارنة جنباً إلى جنب",
        bodyEn: "Two candidate records, aligned field by field — name, DOB, passport, sponsor.",
        bodyAr: "سجلان مرشّحان، مُحاذيان حقلاً بحقل — الاسم، الميلاد، الجواز، الكفيل.",
      },
      {
        targetSelector: "[data-narrate-id='entity-actions']",
        titleEn: "Resolve actions",
        titleAr: "إجراءات الحل",
        bodyEn: "Confirm same · Confirm different · Needs review. Logged and audited.",
        bodyAr: "تأكيد التطابق · تأكيد الاختلاف · يحتاج مراجعة. مُسجَّل ومُدقَّق.",
      },
    ],
  },
];

