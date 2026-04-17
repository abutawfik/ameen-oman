export interface ExecKpi {
  id: string;
  label: string;
  value: string;
  delta: string;
  deltaUp: boolean;
  icon: string;
  color: string;
  trend: number[];
  unit: string;
}

export interface StreamHealthItem {
  stream: string;
  icon: string;
  color: string;
  eventsToday: number;
  alertsToday: number;
  status: "nominal" | "elevated" | "critical";
  trend: "up" | "down" | "stable";
  coverage: number;
}

export interface ThreatTrendPoint {
  date: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface TopRiskSubject {
  id: string;
  name: string;
  nationality: string;
  riskScore: number;
  riskDelta: number;
  activeAlerts: number;
  streams: number;
  photo: string;
  status: "monitored" | "detained" | "wanted";
}

export interface BriefingItem {
  id: string;
  time: string;
  priority: "critical" | "high" | "medium";
  title: string;
  summary: string;
  streams: string[];
  action: string;
}

export interface RegionalThreatItem {
  region: string;
  threatLevel: "critical" | "high" | "medium" | "low";
  activeIncidents: number;
  watchlistHits: number;
  x: number;
  y: number;
}

export const execKpis: ExecKpi[] = [
  { id: "k1", label: "National Threat Index", value: "74.2", delta: "+3.1", deltaUp: false, icon: "ri-shield-flash-line", color: "#F87171", trend: [62, 65, 68, 71, 69, 72, 74], unit: "/100" },
  { id: "k2", label: "Active Investigations", value: "23", delta: "+4", deltaUp: false, icon: "ri-search-eye-line", color: "#FB923C", trend: [15, 17, 18, 19, 20, 21, 23], unit: "" },
  { id: "k3", label: "Watchlist Hits (24h)", value: "147", delta: "+18", deltaUp: false, icon: "ri-eye-line", color: "#FACC15", trend: [98, 112, 119, 124, 131, 138, 147], unit: "" },
  { id: "k4", label: "Cross-Stream Correlations", value: "38", delta: "+7", deltaUp: false, icon: "ri-git-branch-line", color: "#A78BFA", trend: [22, 25, 28, 31, 33, 35, 38], unit: "" },
  { id: "k5", label: "Events Processed (24h)", value: "284,712", delta: "+12%", deltaUp: true, icon: "ri-database-2-line", color: "#D4A84B", trend: [210000, 225000, 241000, 255000, 263000, 271000, 284712], unit: "" },
  { id: "k6", label: "Dossiers Generated", value: "1,247", delta: "+89", deltaUp: true, icon: "ri-file-shield-2-line", color: "#4ADE80", trend: [980, 1050, 1100, 1150, 1180, 1210, 1247], unit: "" },
];

export const streamHealth: StreamHealthItem[] = [
  { stream: "Border Control",     icon: "ri-passport-line",        color: "#60A5FA", eventsToday: 16303, alertsToday: 23, status: "elevated", trend: "up",    coverage: 99 },
  { stream: "Financial Services", icon: "ri-bank-card-line",        color: "#4ADE80", eventsToday: 24891, alertsToday: 18, status: "elevated", trend: "up",    coverage: 98 },
  { stream: "Mobile Operators",   icon: "ri-sim-card-line",         color: "#A78BFA", eventsToday: 42103, alertsToday: 7,  status: "nominal",  trend: "stable",coverage: 97 },
  { stream: "Hotel & Hospitality",icon: "ri-hotel-line",            color: "#D4A84B", eventsToday: 1284,  alertsToday: 3,  status: "nominal",  trend: "stable",coverage: 96 },
  { stream: "Transport Intel",    icon: "ri-bus-line",              color: "#FB923C", eventsToday: 42891, alertsToday: 12, status: "elevated", trend: "up",    coverage: 94 },
  { stream: "E-Commerce",         icon: "ri-shopping-cart-line",    color: "#34D399", eventsToday: 18234, alertsToday: 9,  status: "nominal",  trend: "stable",coverage: 93 },
  { stream: "Social Intelligence",icon: "ri-global-line",           color: "#38BDF8", eventsToday: 12891, alertsToday: 67, status: "critical", trend: "up",    coverage: 88 },
  { stream: "Employment Registry",icon: "ri-briefcase-line",        color: "#F9A8D4", eventsToday: 3891,  alertsToday: 2,  status: "nominal",  trend: "down",  coverage: 99 },
  { stream: "Customs & Cargo",    icon: "ri-ship-line",             color: "#FCD34D", eventsToday: 2341,  alertsToday: 14, status: "elevated", trend: "up",    coverage: 91 },
  { stream: "Healthcare",         icon: "ri-heart-pulse-line",      color: "#F87171", eventsToday: 1847,  alertsToday: 1,  status: "nominal",  trend: "stable",coverage: 95 },
  { stream: "Education",          icon: "ri-graduation-cap-line",   color: "#C084FC", eventsToday: 2341,  alertsToday: 1,  status: "nominal",  trend: "stable",coverage: 97 },
  { stream: "Municipality",       icon: "ri-government-line",       color: "#DDB96B", eventsToday: 1203,  alertsToday: 0,  status: "nominal",  trend: "stable",coverage: 98 },
  { stream: "Utility Events",     icon: "ri-flashlight-line",       color: "#FACC15", eventsToday: 412,   alertsToday: 0,  status: "nominal",  trend: "stable",coverage: 99 },
  { stream: "Tourism Events",     icon: "ri-map-2-line",            color: "#86EFAC", eventsToday: 891,   alertsToday: 2,  status: "nominal",  trend: "stable",coverage: 92 },
  { stream: "Marine Events",      icon: "ri-anchor-line",           color: "#7DD3FC", eventsToday: 234,   alertsToday: 5,  status: "elevated", trend: "up",    coverage: 87 },
  { stream: "Postal Services",    icon: "ri-mail-send-line",        color: "#DDD6FE", eventsToday: 567,   alertsToday: 1,  status: "nominal",  trend: "stable",coverage: 94 },
];

export const threatTrend: ThreatTrendPoint[] = [
  { date: "Mar 31", critical: 4,  high: 12, medium: 28, low: 45 },
  { date: "Apr 1",  critical: 5,  high: 14, medium: 31, low: 48 },
  { date: "Apr 2",  critical: 3,  high: 11, medium: 29, low: 44 },
  { date: "Apr 3",  critical: 6,  high: 16, medium: 34, low: 51 },
  { date: "Apr 4",  critical: 7,  high: 18, medium: 36, low: 53 },
  { date: "Apr 5",  critical: 5,  high: 15, medium: 33, low: 49 },
  { date: "Apr 6",  critical: 8,  high: 21, medium: 38, low: 56 },
];

export const topRiskSubjects: TopRiskSubject[] = [
  { id: "rs1", name: "Mohammed Al-Balushi", nationality: "Omani",   riskScore: 96, riskDelta: +4, activeAlerts: 7, streams: 14, photo: "https://readdy.ai/api/search-image?query=male%20intelligence%20subject%20profile%20photo%20middle%20eastern%20formal%20attire%20neutral%20background%20surveillance%20file&width=48&height=48&seq=rs1&orientation=squarish", status: "monitored" },
  { id: "rs2", name: "Ahmed Al-Rashidi",    nationality: "Omani",   riskScore: 94, riskDelta: +2, activeAlerts: 5, streams: 12, photo: "https://readdy.ai/api/search-image?query=male%20intelligence%20subject%20profile%20photo%20middle%20eastern%20business%20attire%20neutral%20background%20classified%20file&width=48&height=48&seq=rs2&orientation=squarish", status: "monitored" },
  { id: "rs3", name: "DESERT VIPER",        nationality: "Unknown", riskScore: 94, riskDelta: +6, activeAlerts: 4, streams: 3,  photo: "https://readdy.ai/api/search-image?query=unknown%20threat%20actor%20silhouette%20dark%20background%20red%20glow%20intelligence%20file%20classified%20unknown%20identity&width=48&height=48&seq=rs3&orientation=squarish", status: "wanted" },
  { id: "rs4", name: "Tariq Al-Farsi",      nationality: "Omani",   riskScore: 87, riskDelta: +1, activeAlerts: 3, streams: 8,  photo: "https://readdy.ai/api/search-image?query=male%20suspect%20profile%20photo%20middle%20eastern%20neutral%20expression%20intelligence%20surveillance%20file&width=48&height=48&seq=rs4&orientation=squarish", status: "monitored" },
  { id: "rs5", name: "Unknown Actor #7",    nationality: "Unknown", riskScore: 78, riskDelta: -2, activeAlerts: 2, streams: 6,  photo: "https://readdy.ai/api/search-image?query=unknown%20person%20silhouette%20question%20mark%20overlay%20intelligence%20file%20dark%20background%20classified%20profile&width=48&height=48&seq=rs5&orientation=squarish", status: "monitored" },
];

export const morningBriefing: BriefingItem[] = [
  { id: "b1", time: "06:14", priority: "critical", title: "Operation Iron Hawk — New Intelligence", summary: "HUMINT source confirms planned meeting between primary subject and unknown associate at Muscat hotel. Surveillance assets requested.", streams: ["Hotel", "Mobile", "Social"], action: "Authorize Surveillance" },
  { id: "b2", time: "02:41", priority: "critical", title: "Dark Web Alert — Port Insider Confirmed", summary: "Intercepted communication confirms customs official at Muttrah Port is facilitating smuggling. Identity partially established.", streams: ["Customs", "Mobile", "Financial"], action: "Initiate Arrest Warrant" },
  { id: "b3", time: "04:55", priority: "high", title: "Cyber Intrusion — 47 Endpoints Compromised", summary: "SIEM detected C2 beacon from 47 government endpoints. Malware variant identified. Containment in progress.", streams: ["Mobile", "Employment"], action: "View Incident Report" },
  { id: "b4", time: "01:22", priority: "high", title: "Financial Structuring Pattern — 3 New Accounts", summary: "Pattern engine identified 3 new accounts exhibiting structuring behavior linked to Operation Desert Watch network.", streams: ["Financial", "Employment"], action: "Freeze Accounts" },
  { id: "b5", time: "07:30", priority: "medium", title: "Border Alert — Watchlist Hit at Seeb Airport", summary: "Subject on Tier-2 watchlist attempted departure. Detained for secondary screening. Awaiting clearance decision.", streams: ["Border"], action: "Review Case" },
];

export const regionalThreats: RegionalThreatItem[] = [
  { region: "Muscat Governorate",  threatLevel: "critical", activeIncidents: 8,  watchlistHits: 67, x: 62, y: 38 },
  { region: "Dhofar",             threatLevel: "high",     activeIncidents: 3,  watchlistHits: 12, x: 45, y: 72 },
  { region: "Musandam",           threatLevel: "high",     activeIncidents: 2,  watchlistHits: 8,  x: 68, y: 12 },
  { region: "Al Batinah",         threatLevel: "medium",   activeIncidents: 2,  watchlistHits: 14, x: 55, y: 25 },
  { region: "Al Dakhiliyah",      threatLevel: "medium",   activeIncidents: 1,  watchlistHits: 6,  x: 50, y: 45 },
  { region: "Al Sharqiyah",       threatLevel: "low",      activeIncidents: 1,  watchlistHits: 4,  x: 72, y: 50 },
  { region: "Al Wusta",           threatLevel: "low",      activeIncidents: 0,  watchlistHits: 2,  x: 48, y: 60 },
];
