export type ThreatLevel = "CRITICAL" | "HIGH" | "ELEVATED" | "GUARDED" | "LOW";

export interface ThreatIndicator {
  id: string;
  stream: string;
  streamIcon: string;
  streamColor: string;
  signal: string;
  severity: "critical" | "high" | "medium" | "low";
  score: number;
  time: string;
  location: string;
}

export interface Investigation {
  id: string;
  caseRef: string;
  title: string;
  titleAr: string;
  category: string;
  categoryColor: string;
  priority: "critical" | "high" | "medium";
  status: "active" | "monitoring" | "escalated" | "closed";
  lead: string;
  subjects: number;
  streams: string[];
  openedDate: string;
  lastUpdate: string;
  riskScore: number;
  progress: number;
}

export interface WatchlistHit {
  id: string;
  time: string;
  personRef: string;
  nationality: string;
  listType: string;
  listColor: string;
  stream: string;
  streamIcon: string;
  location: string;
  matchConfidence: number;
  status: "confirmed" | "pending" | "false_positive";
  action: string;
}

export interface CorrelationAlert {
  id: string;
  time: string;
  title: string;
  titleAr: string;
  streams: { name: string; icon: string; color: string }[];
  subjects: number;
  correlationType: string;
  severity: "critical" | "high" | "medium";
  score: number;
  detail: string;
  status: "new" | "reviewing" | "actioned";
}

export const currentThreatLevel: ThreatLevel = "HIGH";

export const threatHistory: { date: string; level: ThreatLevel; score: number }[] = [
  { date: "Mar 31", level: "GUARDED",  score: 32 },
  { date: "Apr 01", level: "ELEVATED", score: 48 },
  { date: "Apr 02", level: "ELEVATED", score: 55 },
  { date: "Apr 03", level: "HIGH",     score: 67 },
  { date: "Apr 04", level: "HIGH",     score: 71 },
  { date: "Apr 05", level: "HIGH",     score: 74 },
  { date: "Apr 06", level: "HIGH",     score: 78 },
];

export const threatLevelConfig: Record<ThreatLevel, { color: string; bg: string; border: string; label: string; labelAr: string; description: string; descriptionAr: string }> = {
  CRITICAL: { color: "#F87171", bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.4)", label: "CRITICAL",  labelAr: "حرج",     description: "Imminent threat — maximum security posture", descriptionAr: "تهديد وشيك — أقصى درجات الأمن" },
  HIGH:     { color: "#FB923C", bg: "rgba(251,146,60,0.12)",  border: "rgba(251,146,60,0.4)",  label: "HIGH",      labelAr: "عالٍ",    description: "Significant threat — heightened vigilance",  descriptionAr: "تهديد كبير — يقظة مشددة" },
  ELEVATED: { color: "#FACC15", bg: "rgba(250,204,21,0.12)",  border: "rgba(250,204,21,0.4)",  label: "ELEVATED",  labelAr: "مرتفع",   description: "Significant risk — enhanced monitoring",     descriptionAr: "خطر كبير — مراقبة مكثفة" },
  GUARDED:  { color: "#D4A84B", bg: "rgba(181,142,60,0.12)",  border: "rgba(181,142,60,0.4)",  label: "GUARDED",   labelAr: "محدود",   description: "General risk — standard protocols active",   descriptionAr: "خطر عام — بروتوكولات قياسية" },
  LOW:      { color: "#4ADE80", bg: "rgba(74,222,128,0.12)",  border: "rgba(74,222,128,0.4)",  label: "LOW",       labelAr: "منخفض",   description: "Minimal risk — routine operations",          descriptionAr: "خطر ضئيل — عمليات روتينية" },
};

export const threatIndicators: ThreatIndicator[] = [
  { id: "ti1",  stream: "Border",      streamIcon: "ri-passport-line",        streamColor: "#60A5FA", signal: "3 flagged entries — Iranian nationals, Muscat Airport",          severity: "critical", score: 94, time: "14:32", location: "Muscat Airport" },
  { id: "ti2",  stream: "Financial",   streamIcon: "ri-bank-card-line",        streamColor: "#4ADE80", signal: "Structuring pattern — 12 sub-threshold transfers in 48h",        severity: "critical", score: 91, time: "14:28", location: "Bank Muscat" },
  { id: "ti3",  stream: "Social",      streamIcon: "ri-global-line",           streamColor: "#38BDF8", signal: "Threat-level keyword cluster — 7 accounts, coordinated posting",  severity: "high",     score: 84, time: "14:15", location: "Online" },
  { id: "ti4",  stream: "Mobile",      streamIcon: "ri-sim-card-line",         streamColor: "#A78BFA", signal: "Burner SIM cluster — 9 activations, same IMEI group",             severity: "high",     score: 79, time: "13:58", location: "Ruwi Area" },
  { id: "ti5",  stream: "E-Commerce",  streamIcon: "ri-shopping-cart-line",    streamColor: "#34D399", signal: "Bulk medical supply purchase — 500 units, flagged buyer",          severity: "high",     score: 76, time: "13:44", location: "Online" },
  { id: "ti6",  stream: "Transport",   streamIcon: "ri-bus-line",              streamColor: "#FB923C", signal: "Repeated route anomaly near restricted zone — Route 7",           severity: "medium",   score: 62, time: "13:30", location: "Industrial Zone" },
  { id: "ti7",  stream: "Customs",     streamIcon: "ri-ship-line",             streamColor: "#FACC15", signal: "HS 9301 — military equipment declaration mismatch",               severity: "high",     score: 81, time: "13:22", location: "Seeb Port" },
  { id: "ti8",  stream: "Employment",  streamIcon: "ri-briefcase-line",        streamColor: "#F9A8D4", signal: "Employer change pattern — 4 transfers in 30 days, same person",   severity: "medium",   score: 58, time: "12:55", location: "Muscat" },
];

export const activeInvestigations: Investigation[] = [
  {
    id: "inv1", caseRef: "INV-2026-0041", title: "Operation Desert Watch",       titleAr: "عملية مراقبة الصحراء",
    category: "Counter-Terrorism",  categoryColor: "#F87171",
    priority: "critical", status: "escalated", lead: "Lt. Col. Al-Zadjali",
    subjects: 7, streams: ["Border", "Financial", "Mobile", "Social"],
    openedDate: "2026-03-28", lastUpdate: "14:32:07", riskScore: 94, progress: 62,
  },
  {
    id: "inv2", caseRef: "INV-2026-0038", title: "Operation Silver Net",         titleAr: "عملية الشبكة الفضية",
    category: "Financial Crime",    categoryColor: "#FACC15",
    priority: "high", status: "active", lead: "Maj. Al-Rashidi",
    subjects: 12, streams: ["Financial", "E-Commerce", "Mobile"],
    openedDate: "2026-03-22", lastUpdate: "13:58:44", riskScore: 82, progress: 45,
  },
  {
    id: "inv3", caseRef: "INV-2026-0035", title: "Operation Blue Horizon",       titleAr: "عملية الأفق الأزرق",
    category: "Immigration Fraud",  categoryColor: "#60A5FA",
    priority: "high", status: "active", lead: "Capt. Al-Hinai",
    subjects: 23, streams: ["Border", "Employment", "Municipality"],
    openedDate: "2026-03-15", lastUpdate: "12:44:20", riskScore: 77, progress: 71,
  },
  {
    id: "inv4", caseRef: "INV-2026-0031", title: "Operation Amber Shield",       titleAr: "عملية الدرع العنبري",
    category: "Narcotics",          categoryColor: "#FB923C",
    priority: "high", status: "monitoring", lead: "Sgt. Al-Amri",
    subjects: 5, streams: ["Customs", "Transport", "Financial"],
    openedDate: "2026-03-10", lastUpdate: "11:30:15", riskScore: 71, progress: 83,
  },
  {
    id: "inv5", caseRef: "INV-2026-0028", title: "Operation Cyber Trace",        titleAr: "عملية التتبع الإلكتروني",
    category: "Cybercrime",         categoryColor: "#A78BFA",
    priority: "medium", status: "monitoring", lead: "Cpl. Al-Balushi",
    subjects: 3, streams: ["Social", "Mobile", "E-Commerce"],
    openedDate: "2026-03-05", lastUpdate: "10:15:00", riskScore: 55, progress: 90,
  },
  {
    id: "inv6", caseRef: "INV-2026-0024", title: "Operation Green Gate",         titleAr: "عملية البوابة الخضراء",
    category: "Human Trafficking",  categoryColor: "#4ADE80",
    priority: "critical", status: "active", lead: "Lt. Al-Farsi",
    subjects: 9, streams: ["Border", "Hotel", "Employment", "Transport"],
    openedDate: "2026-02-28", lastUpdate: "09:45:33", riskScore: 88, progress: 38,
  },
];

export const watchlistHits: WatchlistHit[] = [
  { id: "wh1",  time: "14:32:07", personRef: "***4521", nationality: "IR", listType: "Terrorism Watch",    listColor: "#F87171", stream: "Border",     streamIcon: "ri-passport-line",     location: "Muscat Airport T1",  matchConfidence: 97, status: "confirmed",     action: "Detained for questioning" },
  { id: "wh2",  time: "14:28:33", personRef: "***1122", nationality: "IR", listType: "Financial Crime",    listColor: "#FACC15", stream: "Financial",  streamIcon: "ri-bank-card-line",    location: "Bank Muscat, CBD",   matchConfidence: 91, status: "confirmed",     action: "Account frozen, case opened" },
  { id: "wh3",  time: "13:44:12", personRef: "***8823", nationality: "PK", listType: "Immigration Alert",  listColor: "#60A5FA", stream: "Border",     streamIcon: "ri-passport-line",     location: "Seeb Land Border",   matchConfidence: 88, status: "confirmed",     action: "Entry denied, deported" },
  { id: "wh4",  time: "13:22:05", personRef: "***3312", nationality: "OM", listType: "Narcotics Watch",    listColor: "#FB923C", stream: "Customs",    streamIcon: "ri-ship-line",         location: "Seeb Port",          matchConfidence: 84, status: "pending",       action: "Cargo held for inspection" },
  { id: "wh5",  time: "12:55:40", personRef: "***7701", nationality: "IN", listType: "Financial Crime",    listColor: "#FACC15", stream: "E-Commerce", streamIcon: "ri-shopping-cart-line",location: "Online Platform",    matchConfidence: 76, status: "pending",       action: "Account flagged, review pending" },
  { id: "wh6",  time: "12:30:18", personRef: "***5523", nationality: "OM", listType: "Terrorism Watch",    listColor: "#F87171", stream: "Mobile",     streamIcon: "ri-sim-card-line",     location: "Ruwi Area",          matchConfidence: 71, status: "pending",       action: "Location tracking active" },
  { id: "wh7",  time: "11:58:22", personRef: "***9901", nationality: "EG", listType: "Human Trafficking",  listColor: "#4ADE80", stream: "Hotel",      streamIcon: "ri-hotel-line",        location: "Al Bustan Palace",   matchConfidence: 68, status: "false_positive", action: "Cleared — identity mismatch" },
  { id: "wh8",  time: "11:30:44", personRef: "***2234", nationality: "AF", listType: "Terrorism Watch",    listColor: "#F87171", stream: "Border",     streamIcon: "ri-passport-line",     location: "Muscat Airport T2",  matchConfidence: 95, status: "confirmed",     action: "Detained — case INV-2026-0041" },
];

export const correlationAlerts: CorrelationAlert[] = [
  {
    id: "ca1", time: "14:32:07",
    title: "Multi-Stream Convergence — Subject ***4521",
    titleAr: "تقاطع متعدد المصادر — الشخص ***4521",
    streams: [
      { name: "Border",    icon: "ri-passport-line",     color: "#60A5FA" },
      { name: "Financial", icon: "ri-bank-card-line",    color: "#4ADE80" },
      { name: "Mobile",    icon: "ri-sim-card-line",     color: "#A78BFA" },
      { name: "Social",    icon: "ri-global-line",       color: "#38BDF8" },
    ],
    subjects: 1, correlationType: "Person Convergence", severity: "critical", score: 97,
    detail: "Iranian national flagged at border entry simultaneously matched in financial structuring pattern, new SIM activation, and social media keyword alert. All 4 streams triggered within 4 minutes.",
    status: "new",
  },
  {
    id: "ca2", time: "14:15:20",
    title: "Coordinated Social + Mobile Activity",
    titleAr: "نشاط منسق — التواصل الاجتماعي والجوال",
    streams: [
      { name: "Social",  icon: "ri-global-line",    color: "#38BDF8" },
      { name: "Mobile",  icon: "ri-sim-card-line",  color: "#A78BFA" },
    ],
    subjects: 7, correlationType: "Network Coordination", severity: "high", score: 84,
    detail: "7 accounts posting threat-level keywords within 12-minute window. All linked to burner SIM cluster activated in Ruwi area. Coordinated behavior pattern detected by Pattern Engine.",
    status: "reviewing",
  },
  {
    id: "ca3", time: "13:58:44",
    title: "Financial + E-Commerce Layering Pattern",
    titleAr: "نمط تطبيق مالي وتجارة إلكترونية",
    streams: [
      { name: "Financial",  icon: "ri-bank-card-line",    color: "#4ADE80" },
      { name: "E-Commerce", icon: "ri-shopping-cart-line",color: "#34D399" },
    ],
    subjects: 3, correlationType: "Money Laundering", severity: "high", score: 79,
    detail: "3 subjects using e-commerce bulk purchases to layer financial transactions. Pattern matches known money laundering typology. OMR 340,000 moved across 47 transactions in 72 hours.",
    status: "reviewing",
  },
  {
    id: "ca4", time: "13:22:05",
    title: "Customs + Transport Route Anomaly",
    titleAr: "شذوذ مسار الجمارك والنقل",
    streams: [
      { name: "Customs",   icon: "ri-ship-line",  color: "#FACC15" },
      { name: "Transport", icon: "ri-bus-line",   color: "#FB923C" },
    ],
    subjects: 2, correlationType: "Smuggling Route", severity: "high", score: 76,
    detail: "Cargo declared at Seeb Port with HS 9301 mismatch. Same vehicle tracked on Route 7 with repeated stops near restricted industrial zone. Possible smuggling route identified.",
    status: "new",
  },
  {
    id: "ca5", time: "12:55:40",
    title: "Border + Employment + Hotel Cluster",
    titleAr: "تجمع الحدود والتوظيف والفنادق",
    streams: [
      { name: "Border",     icon: "ri-passport-line",  color: "#60A5FA" },
      { name: "Employment", icon: "ri-briefcase-line", color: "#F9A8D4" },
      { name: "Hotel",      icon: "ri-hotel-line",     color: "#D4A84B" },
    ],
    subjects: 9, correlationType: "Human Trafficking", severity: "critical", score: 88,
    detail: "9 foreign nationals entered on tourist visas, immediately registered with same employer, housed in same hotel block. Pattern matches human trafficking indicators. Case INV-2026-0024 active.",
    status: "actioned",
  },
  {
    id: "ca6", time: "11:30:44",
    title: "Healthcare + Financial Prescription Fraud",
    titleAr: "احتيال وصفات طبية — الصحة والمالية",
    streams: [
      { name: "Healthcare", icon: "ri-heart-pulse-line", color: "#F87171" },
      { name: "Financial",  icon: "ri-bank-card-line",   color: "#4ADE80" },
    ],
    subjects: 4, correlationType: "Healthcare Fraud", severity: "medium", score: 61,
    detail: "4 subjects receiving controlled substance prescriptions from 3 different hospitals, all paid via same financial account. Possible prescription fraud and diversion ring.",
    status: "reviewing",
  },
];

export const streamThreatScores: { stream: string; icon: string; color: string; score: number; trend: "up" | "down" | "stable"; events: number; alerts: number }[] = [
  { stream: "Border Intelligence",  icon: "ri-passport-line",        color: "#60A5FA", score: 82, trend: "up",     events: 16303, alerts: 5 },
  { stream: "Financial Services",   icon: "ri-bank-card-line",       color: "#4ADE80", score: 79, trend: "up",     events: 24891, alerts: 4 },
  { stream: "Social Intelligence",  icon: "ri-global-line",          color: "#38BDF8", score: 74, trend: "up",     events: 8412,  alerts: 3 },
  { stream: "Mobile Operators",     icon: "ri-sim-card-line",        color: "#A78BFA", score: 68, trend: "stable", events: 19234, alerts: 2 },
  { stream: "Customs & Cargo",      icon: "ri-ship-line",            color: "#FACC15", score: 65, trend: "up",     events: 4821,  alerts: 3 },
  { stream: "E-Commerce",           icon: "ri-shopping-cart-line",   color: "#34D399", score: 58, trend: "stable", events: 18234, alerts: 2 },
  { stream: "Transport",            icon: "ri-bus-line",             color: "#FB923C", score: 45, trend: "down",   events: 42891, alerts: 1 },
  { stream: "Employment Registry",  icon: "ri-briefcase-line",       color: "#F9A8D4", score: 42, trend: "stable", events: 3891,  alerts: 1 },
  { stream: "Hotel Intelligence",   icon: "ri-hotel-line",           color: "#D4A84B", score: 38, trend: "down",   events: 1284,  alerts: 1 },
  { stream: "Healthcare",           icon: "ri-heart-pulse-line",     color: "#F87171", score: 35, trend: "stable", events: 1847,  alerts: 1 },
  { stream: "Municipality",         icon: "ri-government-line",      color: "#FACC15", score: 22, trend: "down",   events: 891,   alerts: 0 },
  { stream: "Utility Events",       icon: "ri-flashlight-line",      color: "#FACC15", score: 18, trend: "stable", events: 412,   alerts: 0 },
];
