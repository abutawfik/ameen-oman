import { useState, useEffect, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { DashboardOutletContext } from "../DashboardLayout";

type Tab = "live" | "entities" | "alerts" | "replication" | "audit";

// ── MOCK DATA ──────────────────────────────────────────────────────────────────

const LIVE_FEED_SEED = [
  { id: "f1",  time: "14:32:07", entity: "Hotel",       entityIcon: "ri-hotel-line",         entityColor: "#D6B47E", name: "Ahmed Al-Rashidi",    nat: "OM", event: "Check-In",          risk: "clear",    ref: "HTL-2026-04891", detail: "Room 204, Al Bustan Palace, 3 nights" },
  { id: "f2",  time: "14:31:55", entity: "Border",      entityIcon: "ri-passport-line",      entityColor: "#60A5FA", name: "Reza Tehrani",        nat: "IR", event: "Entry Recorded",    risk: "flagged",  ref: "BRD-2026-44891", detail: "Muscat Airport T1 — Watchlist match" },
  { id: "f3",  time: "14:31:44", entity: "Financial",   entityIcon: "ri-bank-card-line",     entityColor: "#4ADE80", name: "Al-Rashidi Trading",  nat: "OM", event: "Wire Transfer",     risk: "review",   ref: "PAY-2026-88234", detail: "OMR 45,000 → HSBC London" },
  { id: "f4",  time: "14:31:30", entity: "Mobile",      entityIcon: "ri-sim-card-line",      entityColor: "#A78BFA", name: "Unknown Subject",     nat: "PK", event: "SIM Activation",    risk: "review",   ref: "MOB-2026-19234", detail: "3rd SIM this month — same IMEI" },
  { id: "f5",  time: "14:31:18", entity: "Car Rental",  entityIcon: "ri-car-line",           entityColor: "#4ADE80", name: "James Wilson",        nat: "GB", event: "Vehicle Pickup",    risk: "clear",    ref: "CAR-2026-07234", detail: "Nissan Patrol, 7 days, Airport" },
  { id: "f6",  time: "14:31:05", entity: "Employment",  entityIcon: "ri-briefcase-line",     entityColor: "#F9A8D4", name: "Priya Nair",          nat: "IN", event: "Employer Change",   risk: "clear",    ref: "EMP-2026-33234", detail: "Al-Rashidi Group → Oman Oil" },
  { id: "f7",  time: "14:30:52", entity: "E-Commerce",  entityIcon: "ri-shopping-cart-line", entityColor: "#34D399", name: "Mohammed Al-Balushi", nat: "OM", event: "Bulk Order",        risk: "flagged",  ref: "ECM-2026-77233", detail: "500 units medical supplies — flagged" },
  { id: "f8",  time: "14:30:40", entity: "Transport",   entityIcon: "ri-bus-line",           entityColor: "#C98A1B", name: "Carlos Mendez",       nat: "ES", event: "Route Flagged",     risk: "review",   ref: "TRN-2026-55232", detail: "Repeated stops near restricted zone" },
  { id: "f9",  time: "14:30:28", entity: "Social",      entityIcon: "ri-global-line",        entityColor: "#38BDF8", name: "Anonymous",           nat: "??", event: "Keyword Alert",     risk: "flagged",  ref: "SOC-2026-99233", detail: "High-priority keyword — public post" },
  { id: "f10", time: "14:30:15", entity: "Utility",     entityIcon: "ri-flashlight-line",    entityColor: "#FACC15", name: "Hamad Al-Zadjali",    nat: "OM", event: "New Connection",    risk: "clear",    ref: "UTL-2026-11234", detail: "Villa 45, Al Azaiba, 3-phase" },
  { id: "f11", time: "14:30:02", entity: "Municipality",entityIcon: "ri-government-line",    entityColor: "#D6B47E", name: "Layla Al-Hinai",      nat: "OM", event: "Lease Start",       risk: "clear",    ref: "MUN-2026-03421", detail: "Villa 12, Al Khuwair, 12 months" },
  { id: "f12", time: "14:29:50", entity: "Border",      entityIcon: "ri-passport-line",      entityColor: "#60A5FA", name: "Unknown Subject",     nat: "PK", event: "Overstay Alert",    risk: "flagged",  ref: "BRD-2026-44888", detail: "Visa expired 3 days ago" },
];

const ENTITIES_DATA = [
  { id: "ENT-001", name: "Al Bustan Palace Hotel",    nameAr: "فندق البستان بالاس",       type: "Hotel",        typeIcon: "ri-hotel-line",         color: "#D6B47E", status: "active",    integration: "API",    events: 1284, lastActivity: "14:32:07" },
  { id: "ENT-002", name: "Oman Car Rental Co.",       nameAr: "شركة عُمان لتأجير السيارات",type: "Car Rental",   typeIcon: "ri-car-line",           color: "#4ADE80", status: "active",    integration: "API",    events: 2103, lastActivity: "14:31:44" },
  { id: "ENT-003", name: "Omantel",                   nameAr: "عُمانتل",                  type: "Mobile",       typeIcon: "ri-sim-card-line",      color: "#A78BFA", status: "active",    integration: "API",    events: 8412, lastActivity: "14:32:01" },
  { id: "ENT-004", name: "Muscat Municipality",       nameAr: "بلدية مسقط",              type: "Municipality", typeIcon: "ri-government-line",    color: "#FACC15", status: "active",    integration: "Portal", events: 891,  lastActivity: "14:29:50" },
  { id: "ENT-005", name: "Bank Muscat",               nameAr: "بنك مسقط",                type: "Financial",    typeIcon: "ri-bank-card-line",     color: "#4ADE80", status: "active",    integration: "API",    events: 24891,lastActivity: "14:31:55" },
  { id: "ENT-006", name: "iBorders System",           nameAr: "نظام iBorders",           type: "Border",       typeIcon: "ri-passport-line",      color: "#60A5FA", status: "active",    integration: "API",    events: 16303,lastActivity: "14:32:07" },
  { id: "ENT-007", name: "OIFC Electricity",          nameAr: "شركة الكهرباء",           type: "Utility",      typeIcon: "ri-flashlight-line",    color: "#FACC15", status: "active",    integration: "Portal", events: 412,  lastActivity: "14:30:02" },
  { id: "ENT-008", name: "Ministry of Labour",        nameAr: "وزارة العمل",             type: "Employment",   typeIcon: "ri-briefcase-line",     color: "#F9A8D4", status: "active",    integration: "API",    events: 3891, lastActivity: "14:31:18" },
  { id: "ENT-009", name: "Mwasalat",                  nameAr: "مواصلات",                 type: "Transport",    typeIcon: "ri-bus-line",           color: "#C98A1B", status: "active",    integration: "API",    events: 42891,lastActivity: "14:30:40" },
  { id: "ENT-010", name: "Oman Digital Commerce",     nameAr: "التجارة الرقمية عُمان",   type: "E-Commerce",   typeIcon: "ri-shopping-cart-line", color: "#34D399", status: "active",    integration: "API",    events: 18234,lastActivity: "14:30:52" },
  { id: "ENT-011", name: "Digital Intelligence Unit", nameAr: "وحدة الاستخبارات الرقمية",type: "Social",       typeIcon: "ri-global-line",        color: "#38BDF8", status: "active",    integration: "API",    events: 8412, lastActivity: "14:29:50" },
  { id: "ENT-012", name: "Ooredoo Oman",              nameAr: "أوريدو عُمان",            type: "Mobile",       typeIcon: "ri-sim-card-line",      color: "#A78BFA", status: "suspended", integration: "Portal", events: 0,    lastActivity: "08:14:22" },
  { id: "ENT-013", name: "Salalah Municipality",      nameAr: "بلدية صلالة",             type: "Municipality", typeIcon: "ri-government-line",    color: "#FACC15", status: "pending",   integration: "Portal", events: 0,    lastActivity: "—" },
];

const ALERTS_DATA = [
  { id: "ALT-2026-001", ts: "14:32:07", person: "***4521", nat: "IR", event: "Entry + Watchlist Match", score: 94, category: "Security", status: "open",        assigned: "Unassigned",      priority: "critical", minutesOpen: 0,  detail: "Reza Tehrani — Iranian national, watchlist match at Muscat Airport T1. Previous border flags in 2024." },
  { id: "ALT-2026-002", ts: "14:30:52", person: "***3312", nat: "OM", event: "Bulk Purchase — Medical", score: 78, category: "E-Commerce",status: "investigating",assigned: "Sgt. Al-Amri",   priority: "high",     minutesOpen: 2,  detail: "Mohammed Al-Balushi — 500 units medical supplies, unusual quantity for individual buyer." },
  { id: "ALT-2026-003", ts: "14:29:50", person: "***8401", nat: "PK", event: "Overstay — 3 Days",       score: 71, category: "Immigration",status: "open",        assigned: "Unassigned",      priority: "high",     minutesOpen: 3,  detail: "Pakistani national, visa expired 3 days ago. Last known location: Ruwi area." },
  { id: "ALT-2026-004", ts: "14:28:33", person: "***1122", nat: "IR", event: "Financial Pattern",       score: 88, category: "Financial", status: "escalated",   assigned: "Lt. Al-Zadjali",  priority: "critical", minutesOpen: 4,  detail: "Reza Tehrani — structuring pattern detected. 12 transactions under OMR 1,000 in 48 hours." },
  { id: "ALT-2026-005", ts: "14:15:20", person: "???",     nat: "??", event: "Keyword Alert — Threat",  score: 82, category: "Social",    status: "investigating",assigned: "Cpl. Al-Hinai",   priority: "critical", minutesOpen: 17, detail: "Anonymous public post — threat-level keyword match, location tag near government building." },
  { id: "ALT-2026-006", ts: "13:58:44", person: "***9901", nat: "IN", event: "SIM — 3rd This Month",    score: 55, category: "Mobile",    status: "resolved",    assigned: "Sgt. Al-Farsi",   priority: "medium",   minutesOpen: 34, detail: "Priya Nair — 3rd SIM purchase this month, same IMEI device. Possible resale activity." },
  { id: "ALT-2026-007", ts: "13:44:12", person: "***5523", nat: "OM", event: "Route Anomaly",           score: 48, category: "Transport", status: "resolved",    assigned: "Cpl. Al-Balushi", priority: "medium",   minutesOpen: 48, detail: "Repeated stops near restricted industrial zone — Route 7, Bus #BUS-441." },
];

const AUDIT_DATA = [
  { id: "AUD-001", ts: "14:32:01", user: "Ahmed Al-Rashidi", action: "VIEW",     target: "Alert ALT-2026-001",    ip: "10.0.1.45",  detail: "Viewed critical alert details" },
  { id: "AUD-002", ts: "14:31:44", user: "Nadia Al-Rashidi", action: "ASSIGN",   target: "Alert ALT-2026-002",    ip: "10.0.1.52",  detail: "Assigned to Sgt. Al-Amri" },
  { id: "AUD-003", ts: "14:30:52", user: "Fatima Al-Zadjali",action: "ESCALATE", target: "Alert ALT-2026-004",    ip: "10.0.1.38",  detail: "Escalated to Lt. Al-Zadjali" },
  { id: "AUD-004", ts: "14:29:30", user: "Mohammed Al-Balushi",action:"EXPORT",  target: "Report RPT-2026-0405",  ip: "10.0.1.61",  detail: "Exported daily report with digital signature" },
  { id: "AUD-005", ts: "14:28:15", user: "Khalid Al-Amri",   action: "RESOLVE",  target: "Alert ALT-2026-006",    ip: "10.0.1.29",  detail: "Marked as resolved — no further action" },
  { id: "AUD-006", ts: "14:27:00", user: "Ahmed Al-Rashidi", action: "LOGIN",    target: "System",                ip: "10.0.1.45",  detail: "Successful login — 2FA verified" },
  { id: "AUD-007", ts: "14:25:44", user: "Layla Al-Hinai",   action: "VIEW",     target: "Person Profile ***8401",ip: "10.0.1.77",  detail: "Accessed person profile — overstay case" },
  { id: "AUD-008", ts: "14:24:30", user: "Omar Al-Farsi",    action: "SEARCH",   target: "Event List",            ip: "10.0.1.83",  detail: "Searched: nationality=IR, date=today" },
  { id: "AUD-009", ts: "14:22:18", user: "Nadia Al-Rashidi", action: "CONFIG",   target: "Alert Thresholds",      ip: "10.0.1.52",  detail: "Updated risk score threshold: Financial → 75" },
  { id: "AUD-010", ts: "14:20:05", user: "Ahmed Al-Rashidi", action: "EXPORT",   target: "Audit Log AUD-0405",    ip: "10.0.1.45",  detail: "Exported audit trail — digitally signed" },
];

const GOVERNORATES = [
  { name: "Muscat",          nameAr: "مسقط",          x: 72, y: 38, density: 95, flagged: 12 },
  { name: "Dhofar",          nameAr: "ظفار",          x: 35, y: 82, density: 42, flagged: 3  },
  { name: "North Al Batinah",nameAr: "شمال الباطنة",  x: 60, y: 22, density: 68, flagged: 5  },
  { name: "South Al Batinah",nameAr: "جنوب الباطنة",  x: 65, y: 30, density: 55, flagged: 4  },
  { name: "Al Dakhiliyah",   nameAr: "الداخلية",      x: 55, y: 45, density: 38, flagged: 2  },
  { name: "Al Sharqiyah N",  nameAr: "شمال الشرقية",  x: 80, y: 35, density: 31, flagged: 1  },
  { name: "Al Sharqiyah S",  nameAr: "جنوب الشرقية",  x: 82, y: 50, density: 28, flagged: 2  },
  { name: "Al Buraymi",      nameAr: "البريمي",        x: 48, y: 18, density: 22, flagged: 1  },
  { name: "Al Wusta",        nameAr: "الوسطى",         x: 55, y: 62, density: 15, flagged: 0  },
  { name: "Musandam",        nameAr: "مسندم",          x: 58, y: 8,  density: 18, flagged: 1  },
  { name: "Al Dhahirah",     nameAr: "الظاهرة",        x: 44, y: 28, density: 25, flagged: 1  },
  { name: "Al Buraymi",      nameAr: "البريمي",        x: 42, y: 20, density: 20, flagged: 0  },
  { name: "Al Dhahirah",     nameAr: "الظاهرة",        x: 46, y: 32, density: 24, flagged: 1  },
];

const BORDER_POINTS = [
  { name: "Muscat Airport",  nameAr: "مطار مسقط",    x: 71, y: 36, arrivals: 8412, departures: 7891 },
  { name: "Salalah Airport", nameAr: "مطار صلالة",   x: 34, y: 80, arrivals: 1234, departures: 1102 },
  { name: "Hatta Border",    nameAr: "حدود حتا",     x: 50, y: 16, arrivals: 2341, departures: 2198 },
  { name: "Seeb Port",       nameAr: "ميناء السيب",  x: 68, y: 34, arrivals: 891,  departures: 834  },
];

const PRIORITY_CONFIG = {
  critical: { color: "#C94A5E", bg: "rgba(201,74,94,0.08)", border: "rgba(201,74,94,0.3)", label: "Critical", labelAr: "حرج" },
  high:     { color: "#C98A1B", bg: "rgba(201,138,27,0.08)",  border: "rgba(201,138,27,0.3)",  label: "High",     labelAr: "عالٍ" },
  medium:   { color: "#FACC15", bg: "rgba(250,204,21,0.08)",  border: "rgba(250,204,21,0.3)",  label: "Medium",   labelAr: "متوسط" },
  low:      { color: "#D6B47E", bg: "rgba(184,138,60,0.08)",  border: "rgba(184,138,60,0.3)",  label: "Low",      labelAr: "منخفض" },
};

const ACTION_COLORS: Record<string, string> = {
  VIEW: "#D6B47E", ASSIGN: "#4ADE80", ESCALATE: "#C94A5E", EXPORT: "#A78BFA",
  RESOLVE: "#4ADE80", LOGIN: "#9CA3AF", SEARCH: "#FACC15", CONFIG: "#C98A1B",
};

// ── COMPONENT ─────────────────────────────────────────────────────────────────

const CommandCenterPage = () => {
  const navigate = useNavigate();
  const { isAr } = useOutletContext<DashboardOutletContext>();
  const [activeTab, setActiveTab] = useState<Tab>("live");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [liveEvents, setLiveEvents] = useState(48291);
  const [eventsPerHour, setEventsPerHour] = useState(2847);
  const [riskAlerts, setRiskAlerts] = useState(7);
  const [borderArrivals, setBorderArrivals] = useState(8412);
  const [borderDepartures, setBorderDepartures] = useState(7891);
  const [feedItems, setFeedItems] = useState(LIVE_FEED_SEED);
  const [alerts, setAlerts] = useState(ALERTS_DATA);
  const [selectedAlert, setSelectedAlert] = useState<typeof ALERTS_DATA[0] | null>(null);
  const [alertNote, setAlertNote] = useState("");
  const [feedFilter, setFeedFilter] = useState("all");
  const [hoveredGov, setHoveredGov] = useState<typeof GOVERNORATES[0] | null>(null);
  const [rl1Lag, setRl1Lag] = useState(0.4);
  const [rl2Lag, setRl2Lag] = useState(1.2);
  const [rl1Events, setRl1Events] = useState(48291);
  const [rl2Events, setRl2Events] = useState(48289);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      setLiveEvents((v) => v + Math.floor(Math.random() * 4));
      setEventsPerHour((v) => Math.max(2000, v + Math.floor((Math.random() - 0.5) * 20)));
      setBorderArrivals((v) => v + Math.floor(Math.random() * 2));
      setBorderDepartures((v) => v + Math.floor(Math.random() * 2));
      setRl1Lag((v) => Math.max(0.1, Math.min(8, v + (Math.random() - 0.5) * 0.3)));
      setRl2Lag((v) => Math.max(0.1, Math.min(8, v + (Math.random() - 0.5) * 0.5)));
      setRl1Events((v) => v + Math.floor(Math.random() * 4));
      setRl2Events((v) => v + Math.floor(Math.random() * 4));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-escalate alerts open > 30 min
  useEffect(() => {
    const interval = setInterval(() => {
      setAlerts((prev) => prev.map((a) => ({
        ...a,
        minutesOpen: a.minutesOpen + 1,
        status: a.status === "open" && a.minutesOpen >= 30 ? "escalated" : a.status,
      })));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const timeStr = currentTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dateStr = currentTime.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });

  const filteredFeed = feedFilter === "all" ? feedItems : feedItems.filter((f) => f.risk === feedFilter);

  const resolveAlert = (id: string) => {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, status: "resolved" } : a));
    setSelectedAlert(null);
  };
  const escalateAlert = (id: string) => {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, status: "escalated", assigned: "Lt. Al-Zadjali" } : a));
  };

  const openAlerts = alerts.filter((a) => a.status !== "resolved").length;

  const TABS: { id: Tab; icon: string; label: string; labelAr: string; badge?: number; badgeColor?: string }[] = [
    { id: "live",        icon: "ri-pulse-line",          label: "Live Dashboard",    labelAr: "لوحة مباشرة" },
    { id: "entities",    icon: "ri-building-line",       label: "Entity Management", labelAr: "إدارة الكيانات" },
    { id: "alerts",      icon: "ri-alarm-warning-line",  label: "Risk Alerts",       labelAr: "تنبيهات المخاطر", badge: openAlerts, badgeColor: "#C94A5E" },
    { id: "replication", icon: "ri-server-line",         label: "VIS Replication",   labelAr: "تكرار VIS" },
    { id: "audit",       icon: "ri-shield-check-line",   label: "Audit Trail",       labelAr: "مسار التدقيق" },
  ];

  return (
    <div className="min-h-screen font-['Inter']" style={{ background: "#051428" }} dir={isAr ? "rtl" : "ltr"}>
      {/* Grid texture */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(184,138,60,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(184,138,60,0.025) 1px, transparent 1px)`,
        backgroundSize: "40px 40px"
      }} />

      {/* CLASSIFICATION BANNER */}
      <div className="w-full py-1.5 px-6 flex items-center justify-between" style={{ background: "#7F1D1D", borderBottom: "1px solid rgba(201,74,94,0.4)" }}>
        <div className="flex items-center gap-3">
          <i className="ri-shield-keyhole-line text-red-300 text-sm" />
          <span className="text-white text-xs font-bold tracking-widest uppercase font-['JetBrains_Mono']">
            {isAr ? "سري — للأفراد المخوّلين فقط" : "RESTRICTED — Authorized Personnel Only"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-red-300 text-xs font-['JetBrains_Mono'] opacity-70">CLASSIFICATION: SECRET</span>
          <span className="text-red-300 text-xs font-['JetBrains_Mono'] opacity-70">|</span>
          <span className="text-red-300 text-xs font-['JetBrains_Mono'] opacity-70">AL-AMEEN-CC-2026</span>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-3 border-b"
        style={{ background: "rgba(5,20,40,0.97)", borderColor: "rgba(184,138,60,0.12)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors"
            style={{ background: "transparent", borderColor: "rgba(255,255,255,0.1)", color: "#9CA3AF" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#D1D5DB"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#9CA3AF"; }}>
            <i className={isAr ? "ri-arrow-right-line" : "ri-arrow-left-line"} />
            {isAr ? "لوحة التحكم" : "Dashboard"}
          </button>

          {/* Logo + Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0"
              style={{ background: "rgba(184,138,60,0.1)", border: "2px solid rgba(184,138,60,0.3)" }}>
              <i className="ri-radar-line text-gold-400 text-base" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-gold-400 font-black text-base tracking-wide">Al-Ameen</span>
                <span className="text-white font-bold text-sm">{isAr ? "مركز القيادة" : "Command Center"}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: "rgba(201,74,94,0.15)", color: "#C94A5E", border: "1px solid rgba(201,74,94,0.3)" }}>
                  {isAr ? "سري" : "SECRET"}
                </span>
              </div>
              <p className="text-gray-500 text-xs font-['JetBrains_Mono']">مركز قيادة أمين · Police Internal</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Clock */}
          <div className="hidden lg:flex flex-col items-end px-3 py-1.5 rounded-lg border"
            style={{ background: "rgba(184,138,60,0.04)", borderColor: "rgba(184,138,60,0.12)" }}>
            <span className="text-gold-400 text-sm font-black font-['JetBrains_Mono']">{timeStr}</span>
            <span className="text-gray-600 text-xs font-['JetBrains_Mono']">{dateStr}</span>
          </div>

          {/* System health */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border"
            style={{ background: "rgba(74,222,128,0.06)", borderColor: "rgba(74,222,128,0.2)" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-semibold font-['JetBrains_Mono']">{isAr ? "النظام سليم" : "SYSTEM OK"}</span>
          </div>

          {/* Risk alerts badge */}
          {openAlerts > 0 && (
            <button type="button" onClick={() => setActiveTab("alerts")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border cursor-pointer"
              style={{ background: "rgba(201,74,94,0.08)", borderColor: "rgba(201,74,94,0.3)" }}>
              <i className="ri-alarm-warning-line text-red-400 text-xs" />
              <span className="text-red-400 text-xs font-bold font-['JetBrains_Mono']">{openAlerts} {isAr ? "تنبيه" : "ALERTS"}</span>
            </button>
          )}

          {/* Role badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border"
            style={{ background: "rgba(167,139,250,0.08)", borderColor: "rgba(167,139,250,0.2)" }}>
            <i className="ri-shield-star-line text-purple-400 text-xs" />
            <span className="text-purple-400 text-xs font-bold">{isAr ? "مسؤول" : "ADMIN"}</span>
          </div>

          {/* Language */}
        </div>
      </header>

      {/* Tab bar */}
      <div className="sticky top-[89px] z-30 flex items-center gap-1 px-6 py-2 border-b overflow-x-auto"
        style={{ background: "rgba(5,20,40,0.95)", borderColor: "rgba(184,138,60,0.08)", backdropFilter: "blur(12px)" }}>
        {TABS.map((tab) => (
          <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all flex-shrink-0"
            style={{
              background: activeTab === tab.id ? "rgba(184,138,60,0.12)" : "transparent",
              border: `1px solid ${activeTab === tab.id ? "rgba(184,138,60,0.25)" : "transparent"}`,
              color: activeTab === tab.id ? "#D6B47E" : "#6B7280",
            }}>
            <i className={`${tab.icon} text-xs`} />
            {isAr ? tab.labelAr : tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-xs font-bold font-['JetBrains_Mono']"
                style={{ background: `${tab.badgeColor}20`, color: tab.badgeColor, fontSize: "9px" }}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <main className="relative z-10 max-w-[1400px] mx-auto px-6 py-6 space-y-6">

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 1 — LIVE DASHBOARD
        ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "live" && (
          <>
            {/* ROW 1 — Counters */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
              {[
                { label: isAr ? "أحداث اليوم" : "Live Events Today",    value: liveEvents,        color: "#D6B47E", icon: "ri-pulse-line",          mono: true,  large: true },
                { label: isAr ? "حدث/ساعة" : "Events / Hour",           value: eventsPerHour,     color: "#4ADE80", icon: "ri-speed-line",          mono: true,  large: false },
                { label: isAr ? "كيانات نشطة" : "Active Entities",      value: 11,                color: "#A78BFA", icon: "ri-building-line",       mono: false, large: false },
                { label: isAr ? "تنبيهات المخاطر" : "Risk Alerts",      value: openAlerts,        color: "#C94A5E", icon: "ri-alarm-warning-line",  mono: false, large: false },
                { label: isAr ? "صحة النظام" : "System Health",         value: "100%",            color: "#4ADE80", icon: "ri-server-line",         mono: false, large: false },
                { label: isAr ? "وصول اليوم" : "Border Arrivals",       value: borderArrivals,    color: "#60A5FA", icon: "ri-login-circle-line",   mono: true,  large: false },
                { label: isAr ? "مغادرة اليوم" : "Border Departures",   value: borderDepartures,  color: "#C98A1B", icon: "ri-logout-circle-line",  mono: true,  large: false },
              ].map((s, i) => (
                <div key={i} className="relative rounded-2xl border p-4 overflow-hidden"
                  style={{ background: "rgba(10,37,64,0.8)", borderColor: `${s.color}25`, backdropFilter: "blur(12px)" }}>
                  <div className="absolute inset-0 opacity-5" style={{ background: `radial-gradient(circle at top right, ${s.color}, transparent 70%)` }} />
                  <div className="relative z-10">
                    <div className="w-7 h-7 flex items-center justify-center rounded-lg mb-2"
                      style={{ background: `${s.color}15`, border: `1px solid ${s.color}30` }}>
                      <i className={`${s.icon} text-xs`} style={{ color: s.color }} />
                    </div>
                    <div className={`font-black font-['JetBrains_Mono'] tabular-nums mb-0.5 ${s.large ? "text-3xl" : "text-xl"}`} style={{ color: s.color }}>
                      {typeof s.value === "number" ? s.value.toLocaleString() : s.value}
                    </div>
                    <div className="text-gray-500 text-xs leading-tight">{s.label}</div>
                    <div className="mt-2 flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full animate-pulse" style={{ background: s.color }} />
                      <span className="text-xs font-['JetBrains_Mono']" style={{ color: s.color, fontSize: "9px" }}>LIVE</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ROW 2 — Live Feed */}
            <div className="rounded-2xl border overflow-hidden"
              style={{ background: "rgba(10,37,64,0.8)", borderColor: "rgba(184,138,60,0.12)", backdropFilter: "blur(12px)" }}>
              <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "rgba(184,138,60,0.08)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 flex items-center justify-center rounded-lg"
                    style={{ background: "rgba(184,138,60,0.1)", border: "1px solid rgba(184,138,60,0.2)" }}>
                    <i className="ri-pulse-line text-gold-400 text-xs" />
                  </div>
                  <span className="text-white font-bold text-sm">{isAr ? "التغذية المباشرة" : "Live Event Feed"}</span>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-green-400 text-xs font-['JetBrains_Mono']">LIVE</span>
                  </div>
                </div>
                {/* Filter toggles */}
                <div className="flex items-center gap-1">
                  {[
                    { id: "all",     label: isAr ? "الكل" : "All",      color: "#D6B47E" },
                    { id: "flagged", label: isAr ? "مُبلَّغ" : "Flagged", color: "#C94A5E" },
                    { id: "review",  label: isAr ? "مراجعة" : "Review",  color: "#FACC15" },
                    { id: "clear",   label: isAr ? "سليم" : "Clear",     color: "#4ADE80" },
                  ].map((f) => (
                    <button key={f.id} type="button" onClick={() => setFeedFilter(f.id)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all"
                      style={{
                        background: feedFilter === f.id ? `${f.color}15` : "transparent",
                        border: `1px solid ${feedFilter === f.id ? f.color : "transparent"}`,
                        color: feedFilter === f.id ? f.color : "#6B7280",
                      }}>
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
              <div ref={feedRef} className="divide-y overflow-y-auto" style={{ maxHeight: "320px", borderColor: "rgba(184,138,60,0.04)" }}>
                {filteredFeed.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 px-5 py-2.5 hover:bg-white/[0.02] transition-colors cursor-pointer">
                    <span className="text-gray-600 text-xs font-['JetBrains_Mono'] flex-shrink-0 w-16">{item.time}</span>
                    <div className="w-6 h-6 flex items-center justify-center rounded-md flex-shrink-0"
                      style={{ background: `${item.entityColor}12`, border: `1px solid ${item.entityColor}20` }}>
                      <i className={`${item.entityIcon} text-xs`} style={{ color: item.entityColor }} />
                    </div>
                    <span className="text-gray-400 text-xs flex-shrink-0 w-20 truncate">{item.entity}</span>
                    <span className="text-white text-xs font-semibold flex-shrink-0 w-36 truncate">{item.name}</span>
                    <span className="text-gray-400 text-xs flex-1 truncate">{item.event}</span>
                    {/* Nationality */}
                    <span className="text-gray-500 text-xs font-['JetBrains_Mono'] flex-shrink-0 w-8">{item.nat}</span>
                    {/* Risk badge */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {item.risk === "flagged" && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: "rgba(201,74,94,0.12)", border: "1px solid rgba(201,74,94,0.3)" }}>
                          <i className="ri-shield-cross-line text-red-400" style={{ fontSize: "9px" }} />
                          <span className="text-red-400 font-bold" style={{ fontSize: "9px" }}>{isAr ? "مُبلَّغ" : "FLAGGED"}</span>
                        </div>
                      )}
                      {item.risk === "review" && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: "rgba(250,204,21,0.1)", border: "1px solid rgba(250,204,21,0.25)" }}>
                          <i className="ri-shield-line text-yellow-400" style={{ fontSize: "9px" }} />
                          <span className="text-yellow-400 font-bold" style={{ fontSize: "9px" }}>{isAr ? "مراجعة" : "REVIEW"}</span>
                        </div>
                      )}
                      {item.risk === "clear" && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)" }}>
                          <i className="ri-shield-check-line text-green-400" style={{ fontSize: "9px" }} />
                          <span className="text-green-400 font-bold" style={{ fontSize: "9px" }}>{isAr ? "سليم" : "CLEAR"}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-gray-700 text-xs font-['JetBrains_Mono'] flex-shrink-0 hidden xl:block">{item.ref}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ROW 3 — Oman Map */}
            <div className="rounded-2xl border overflow-hidden"
              style={{ background: "rgba(10,37,64,0.8)", borderColor: "rgba(184,138,60,0.12)", backdropFilter: "blur(12px)" }}>
              <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "rgba(184,138,60,0.08)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 flex items-center justify-center rounded-lg"
                    style={{ background: "rgba(184,138,60,0.1)", border: "1px solid rgba(184,138,60,0.2)" }}>
                    <i className="ri-map-2-line text-gold-400 text-xs" />
                  </div>
                  <span className="text-white font-bold text-sm">{isAr ? "خريطة عُمان — كثافة الأحداث" : "Oman — Event Density Map"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm" style={{ background: "rgba(184,138,60,0.15)" }} />
                    <span className="text-gray-500 text-xs">{isAr ? "منخفض" : "Low"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm" style={{ background: "rgba(184,138,60,0.5)" }} />
                    <span className="text-gray-500 text-xs">{isAr ? "متوسط" : "Medium"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm" style={{ background: "#D6B47E" }} />
                    <span className="text-gray-500 text-xs">{isAr ? "مرتفع" : "High"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <span className="text-gray-500 text-xs">{isAr ? "مُبلَّغ" : "Flagged"}</span>
                  </div>
                </div>
              </div>
              <div className="relative" style={{ height: "380px", background: "rgba(5,20,40,0.6)" }}>
                {/* Map background grid */}
                <div className="absolute inset-0" style={{
                  backgroundImage: `linear-gradient(rgba(184,138,60,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(184,138,60,0.04) 1px, transparent 1px)`,
                  backgroundSize: "20px 20px"
                }} />
                {/* Oman outline hint */}
                <div className="absolute inset-0 flex items-center justify-center opacity-5">
                  <i className="ri-map-2-line text-gold-400" style={{ fontSize: "200px" }} />
                </div>
                {/* Governorate dots */}
                {GOVERNORATES.map((gov, i) => {
                  const opacity = gov.density / 100;
                  const size = 8 + (gov.density / 100) * 20;
                  return (
                    <div key={i}
                      onMouseEnter={() => setHoveredGov(gov)}
                      onMouseLeave={() => setHoveredGov(null)}
                      className="absolute cursor-pointer transition-all"
                      style={{ left: `${gov.x}%`, top: `${gov.y}%`, transform: "translate(-50%,-50%)" }}>
                      <div className="rounded-full"
                        style={{ width: size, height: size, background: `rgba(184,138,60,${opacity})`, border: `1px solid rgba(184,138,60,${opacity + 0.2})` }} />
                      {gov.flagged > 0 && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-400 animate-pulse border border-red-600" />
                      )}
                    </div>
                  );
                })}
                {/* Border crossing points */}
                {BORDER_POINTS.map((bp, i) => (
                  <div key={i} className="absolute" style={{ left: `${bp.x}%`, top: `${bp.y}%`, transform: "translate(-50%,-50%)" }}>
                    <div className="w-4 h-4 rounded-sm flex items-center justify-center"
                      style={{ background: "rgba(96,165,250,0.2)", border: "1px solid rgba(96,165,250,0.5)" }}>
                      <i className="ri-passport-line text-blue-400" style={{ fontSize: "8px" }} />
                    </div>
                    <div className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-center" style={{ fontSize: "8px" }}>
                      <div className="text-blue-400 font-['JetBrains_Mono']">{bp.arrivals.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
                {/* Hover tooltip */}
                {hoveredGov && (
                  <div className="absolute z-20 px-3 py-2 rounded-xl border pointer-events-none"
                    style={{ left: `${hoveredGov.x + 3}%`, top: `${hoveredGov.y - 8}%`, background: "rgba(5,20,40,0.95)", borderColor: "rgba(184,138,60,0.3)", minWidth: "140px" }}>
                    <p className="text-white text-xs font-bold">{isAr ? hoveredGov.nameAr : hoveredGov.name}</p>
                    <p className="text-gold-400 text-xs font-['JetBrains_Mono']">{isAr ? "الكثافة:" : "Density:"} {hoveredGov.density}%</p>
                    {hoveredGov.flagged > 0 && (
                      <p className="text-red-400 text-xs font-['JetBrains_Mono']">{isAr ? "مُبلَّغ:" : "Flagged:"} {hoveredGov.flagged}</p>
                    )}
                  </div>
                )}
                {/* Map label */}
                <div className="absolute bottom-3 left-3 text-gray-700 text-xs font-['JetBrains_Mono']">
                  {isAr ? "عُمان — تمثيل تخطيطي" : "Oman — Schematic Representation"}
                </div>
              </div>
            </div>

            {/* ROW 3.5 — Cargo Intelligence Widget */}
            <div className="rounded-2xl border overflow-hidden"
              style={{ background: "rgba(10,37,64,0.8)", borderColor: "rgba(252,211,77,0.2)", backdropFilter: "blur(12px)" }}>
              <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "rgba(252,211,77,0.1)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 flex items-center justify-center rounded-lg"
                    style={{ background: "rgba(252,211,77,0.1)", border: "1px solid rgba(252,211,77,0.25)" }}>
                    <i className="ri-ship-line text-yellow-300 text-xs" />
                  </div>
                  <span className="text-white font-bold text-sm">{isAr ? "استخبارات الشحن — مباشر" : "Cargo Intelligence — Live"}</span>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-pulse" />
                    <span className="text-yellow-300 text-xs font-['JetBrains_Mono']">STREAM 14</span>
                  </div>
                </div>
                <button type="button" onClick={() => navigate("/dashboard/customs-cargo")}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all"
                  style={{ background: "rgba(252,211,77,0.1)", color: "#FCD34D", border: "1px solid rgba(252,211,77,0.2)" }}>
                  <i className="ri-external-link-line text-xs" />
                  {isAr ? "عرض الكل" : "Full View"}
                </button>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                  {[
                    { label: isAr ? "ضبط اليوم" : "Seizures Today",      value: "23",       color: "#C94A5E", icon: "ri-shield-cross-line",        sub: "+21% vs yesterday" },
                    { label: isAr ? "شحنات عالية القيمة" : "High-Value", value: "162",      color: "#FACC15", icon: "ri-money-dollar-circle-line", sub: "OMR 500K+" },
                    { label: isAr ? "قناة حمراء" : "Red Channel",        value: "9",        color: "#C94A5E", icon: "ri-alert-line",               sub: "Held for inspection" },
                    { label: isAr ? "رسوم محصلة" : "Duty Collected",     value: "OMR 4.2M", color: "#4ADE80", icon: "ri-bank-line",                sub: "Today" },
                  ].map((s) => (
                    <div key={s.label} className="p-3 rounded-xl" style={{ background: "rgba(5,20,40,0.6)", border: `1px solid ${s.color}18` }}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-6 h-6 flex items-center justify-center rounded-md" style={{ background: `${s.color}15` }}>
                          <i className={`${s.icon} text-xs`} style={{ color: s.color }} />
                        </div>
                        <span className="text-gray-500 text-xs font-['Inter']">{s.label}</span>
                      </div>
                      <div className="text-xl font-black font-['JetBrains_Mono']" style={{ color: s.color }}>{s.value}</div>
                      <div className="text-gray-600 text-xs font-['Inter'] mt-0.5">{s.sub}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-xs font-semibold font-['Inter'] uppercase tracking-wider">
                      {isAr ? "رموز HS عالية المخاطر" : "High-Risk HS Codes"}
                    </span>
                    <span className="text-gray-600 text-xs font-['JetBrains_Mono']">{isAr ? "اليوم" : "Today"}</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { code: "9301", desc: "Military weapons & ammunition",       risk: "critical", score: 98, seizures: 3,  color: "#C94A5E" },
                      { code: "2933", desc: "Heterocyclic compounds (precursors)", risk: "critical", score: 94, seizures: 5,  color: "#C94A5E" },
                      { code: "8471", desc: "Computing machines & components",     risk: "high",     score: 78, seizures: 8,  color: "#C98A1B" },
                      { code: "6110", desc: "Jerseys & pullovers (textile)",       risk: "high",     score: 72, seizures: 14, color: "#C98A1B" },
                      { code: "2710", desc: "Petroleum oils & preparations",       risk: "high",     score: 68, seizures: 6,  color: "#C98A1B" },
                    ].map((hs) => (
                      <div key={hs.code} className="flex items-center gap-3 px-3 py-2 rounded-lg"
                        style={{ background: "rgba(5,20,40,0.5)", border: `1px solid ${hs.color}15` }}>
                        <span className="text-xs font-bold font-['JetBrains_Mono'] w-10 flex-shrink-0" style={{ color: hs.color }}>{hs.code}</span>
                        <span className="text-gray-300 text-xs font-['Inter'] flex-1 truncate">{hs.desc}</span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="w-16 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                            <div className="h-full rounded-full" style={{ width: `${hs.score}%`, background: hs.color }} />
                          </div>
                          <span className="text-xs font-['JetBrains_Mono'] w-6 text-right" style={{ color: hs.color }}>{hs.score}</span>
                          <span className="px-1.5 py-0.5 rounded text-xs font-['JetBrains_Mono']"
                            style={{ background: `${hs.color}15`, color: hs.color, fontSize: "9px" }}>
                            {hs.seizures} seized
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 4 — Entity Ranking + Risk Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Entity Ranking */}
              <div className="rounded-2xl border overflow-hidden"
                style={{ background: "rgba(10,37,64,0.8)", borderColor: "rgba(184,138,60,0.12)", backdropFilter: "blur(12px)" }}>
                <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ borderColor: "rgba(184,138,60,0.08)" }}>
                  <div className="w-7 h-7 flex items-center justify-center rounded-lg"
                    style={{ background: "rgba(184,138,60,0.1)", border: "1px solid rgba(184,138,60,0.2)" }}>
                    <i className="ri-trophy-line text-gold-400 text-xs" />
                  </div>
                  <span className="text-white font-bold text-sm">{isAr ? "ترتيب الكيانات" : "Entity Ranking"}</span>
                </div>
                <div className="divide-y" style={{ borderColor: "rgba(184,138,60,0.04)" }}>
                  {ENTITIES_DATA.filter((e) => e.status === "active").sort((a, b) => b.events - a.events).slice(0, 7).map((e, i) => (
                    <div key={e.id} className="flex items-center gap-3 px-5 py-2.5">
                      <span className="text-gray-600 text-xs font-bold font-['JetBrains_Mono'] w-5 flex-shrink-0">#{i + 1}</span>
                      <div className="w-6 h-6 flex items-center justify-center rounded-md flex-shrink-0"
                        style={{ background: `${e.color}12`, border: `1px solid ${e.color}20` }}>
                        <i className={`${e.typeIcon} text-xs`} style={{ color: e.color }} />
                      </div>
                      <span className="text-white text-xs font-semibold flex-1 truncate">{isAr ? e.nameAr : e.name}</span>
                      <div className="flex-1 mx-2">
                        <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                          <div className="h-full rounded-full" style={{ width: `${(e.events / 42891) * 100}%`, background: e.color }} />
                        </div>
                      </div>
                      <span className="text-xs font-bold font-['JetBrains_Mono'] flex-shrink-0" style={{ color: e.color }}>
                        {e.events.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Summary */}
              <div className="rounded-2xl border overflow-hidden"
                style={{ background: "rgba(10,37,64,0.8)", borderColor: "rgba(184,138,60,0.12)", backdropFilter: "blur(12px)" }}>
                <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ borderColor: "rgba(184,138,60,0.08)" }}>
                  <div className="w-7 h-7 flex items-center justify-center rounded-lg"
                    style={{ background: "rgba(201,74,94,0.1)", border: "1px solid rgba(201,74,94,0.2)" }}>
                    <i className="ri-shield-cross-line text-red-400 text-xs" />
                  </div>
                  <span className="text-white font-bold text-sm">{isAr ? "ملخص المخاطر" : "Risk Summary"}</span>
                </div>
                <div className="p-5 space-y-4">
                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: isAr ? "تقييمات" : "Assessments", value: alerts.length, color: "#D6B47E" },
                      { label: isAr ? "مُبلَّغ" : "Flagged", value: alerts.filter((a) => a.priority === "critical" || a.priority === "high").length, color: "#C94A5E" },
                      { label: isAr ? "مراجعة معلقة" : "Pending Review", value: alerts.filter((a) => a.status === "open").length, color: "#FACC15" },
                    ].map((s) => (
                      <div key={s.label} className="px-3 py-3 rounded-xl text-center"
                        style={{ background: `${s.color}08`, border: `1px solid ${s.color}15` }}>
                        <div className="text-2xl font-black font-['JetBrains_Mono']" style={{ color: s.color }}>{s.value}</div>
                        <div className="text-gray-500 text-xs mt-0.5">{s.label}</div>
                      </div>
                    ))}
                  </div>
                  {/* Priority breakdown */}
                  <div className="space-y-2">
                    {(["critical", "high", "medium", "low"] as const).map((p) => {
                      const cfg = PRIORITY_CONFIG[p];
                      const count = alerts.filter((a) => a.priority === p).length;
                      return (
                        <div key={p} className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cfg.color }} />
                          <span className="text-gray-400 text-xs w-16">{isAr ? cfg.labelAr : cfg.label}</span>
                          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                            <div className="h-full rounded-full" style={{ width: `${(count / alerts.length) * 100}%`, background: cfg.color }} />
                          </div>
                          <span className="text-xs font-bold font-['JetBrains_Mono'] w-4 text-right" style={{ color: cfg.color }}>{count}</span>
                        </div>
                      );
                    })}
                  </div>
                  {/* Pending reviews amber badge */}
                  {alerts.filter((a) => a.status === "open").length > 0 && (
                    <button type="button" onClick={() => setActiveTab("alerts")}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border cursor-pointer transition-colors"
                      style={{ background: "rgba(250,204,21,0.06)", borderColor: "rgba(250,204,21,0.2)" }}>
                      <i className="ri-time-line text-yellow-400 text-xs" />
                      <span className="text-yellow-400 text-xs font-semibold">
                        {alerts.filter((a) => a.status === "open").length} {isAr ? "تنبيهات تحتاج مراجعة" : "alerts need review"}
                      </span>
                      <i className="ri-arrow-right-s-line text-yellow-400 text-xs" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 2 — ENTITY MANAGEMENT
        ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "entities" && (
          <>
            <div>
              <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "إدارة الكيانات" : "Entity Management"}</h1>
              <p className="text-gray-400 text-sm">{isAr ? "جميع الكيانات المتكاملة مع Al-Ameen" : "All entities integrated with Al-Ameen"}</p>
            </div>
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: isAr ? "نشط" : "Active",    value: ENTITIES_DATA.filter((e) => e.status === "active").length,    color: "#4ADE80" },
                { label: isAr ? "موقوف" : "Suspended",value: ENTITIES_DATA.filter((e) => e.status === "suspended").length, color: "#C94A5E" },
                { label: isAr ? "معلق" : "Pending",   value: ENTITIES_DATA.filter((e) => e.status === "pending").length,   color: "#FACC15" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border p-4 flex items-center gap-3"
                  style={{ background: "rgba(10,37,64,0.8)", borderColor: `${s.color}20` }}>
                  <span className="text-3xl font-black font-['JetBrains_Mono']" style={{ color: s.color }}>{s.value}</span>
                  <span className="text-gray-400 text-sm">{s.label}</span>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border overflow-hidden"
              style={{ background: "rgba(10,37,64,0.8)", borderColor: "rgba(184,138,60,0.12)", backdropFilter: "blur(12px)" }}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr style={{ background: "rgba(184,138,60,0.05)", borderBottom: "1px solid rgba(184,138,60,0.1)" }}>
                      {[isAr?"المعرف":"Entity ID", isAr?"الاسم":"Name", isAr?"النوع":"Type", isAr?"الحالة":"Status", isAr?"التكامل":"Integration", isAr?"الأحداث":"Events", isAr?"آخر نشاط":"Last Activity"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-bold font-['JetBrains_Mono'] uppercase tracking-wider text-gray-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ENTITIES_DATA.map((e, idx) => {
                      const statusColor = e.status === "active" ? "#4ADE80" : e.status === "suspended" ? "#C94A5E" : "#FACC15";
                      return (
                        <tr key={e.id} className="border-b transition-colors"
                          style={{ background: idx % 2 === 0 ? "rgba(10,37,64,0.6)" : "rgba(5,20,40,0.4)", borderColor: "rgba(184,138,60,0.05)" }}>
                          <td className="px-4 py-3"><span className="text-gray-500 text-xs font-['JetBrains_Mono']">{e.id}</span></td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 flex items-center justify-center rounded-md flex-shrink-0"
                                style={{ background: `${e.color}12`, border: `1px solid ${e.color}20` }}>
                                <i className={`${e.typeIcon} text-xs`} style={{ color: e.color }} />
                              </div>
                              <span className="text-white text-xs font-semibold">{isAr ? e.nameAr : e.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3"><span className="text-gray-400 text-xs">{e.type}</span></td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }} />
                              <span className="text-xs font-semibold capitalize" style={{ color: statusColor }}>{isAr ? (e.status === "active" ? "نشط" : e.status === "suspended" ? "موقوف" : "معلق") : e.status}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                              style={{ background: e.integration === "API" ? "rgba(184,138,60,0.1)" : "rgba(167,139,250,0.1)", color: e.integration === "API" ? "#D6B47E" : "#A78BFA", border: `1px solid ${e.integration === "API" ? "rgba(184,138,60,0.2)" : "rgba(167,139,250,0.2)"}` }}>
                              {e.integration}
                            </span>
                          </td>
                          <td className="px-4 py-3"><span className="text-gray-300 text-xs font-['JetBrains_Mono']">{e.events.toLocaleString()}</span></td>
                          <td className="px-4 py-3"><span className="text-gray-500 text-xs font-['JetBrains_Mono']">{e.lastActivity}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 3 — RISK ALERTS QUEUE
        ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "alerts" && (
          <>
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "قائمة تنبيهات المخاطر" : "Risk Alerts Queue"}</h1>
                <p className="text-gray-400 text-sm">{isAr ? "التصعيد التلقائي بعد 30 دقيقة بدون إجراء" : "Auto-escalate if unactioned &gt; 30 minutes"}</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border"
                style={{ background: "rgba(201,74,94,0.06)", borderColor: "rgba(201,74,94,0.2)" }}>
                <i className="ri-alarm-warning-line text-red-400 text-xs" />
                <span className="text-red-400 text-xs font-bold font-['JetBrains_Mono']">{openAlerts} {isAr ? "مفتوح" : "OPEN"}</span>
              </div>
            </div>

            <div className="space-y-3">
              {alerts.map((alert) => {
                const cfg = PRIORITY_CONFIG[alert.priority as keyof typeof PRIORITY_CONFIG];
                const isSelected = selectedAlert?.id === alert.id;
                return (
                  <div key={alert.id}>
                    <div
                      onClick={() => setSelectedAlert(isSelected ? null : alert)}
                      className="rounded-2xl border cursor-pointer transition-all overflow-hidden"
                      style={{
                        background: isSelected ? "rgba(184,138,60,0.04)" : "rgba(10,37,64,0.8)",
                        borderColor: isSelected ? "rgba(184,138,60,0.25)" : cfg.border,
                        borderLeft: `4px solid ${cfg.color}`,
                        backdropFilter: "blur(12px)",
                      }}>
                      <div className="flex items-center gap-4 px-5 py-3 flex-wrap">
                        <span className="text-gray-500 text-xs font-['JetBrains_Mono'] flex-shrink-0">{alert.ts}</span>
                        <span className="text-gold-400 text-xs font-bold font-['JetBrains_Mono'] flex-shrink-0">{alert.id}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0"
                          style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                          {isAr ? cfg.labelAr : cfg.label}
                        </span>
                        <span className="text-white text-xs font-semibold flex-1 min-w-0 truncate">{alert.event}</span>
                        <span className="text-gray-500 text-xs font-['JetBrains_Mono'] flex-shrink-0">{alert.nat} · {alert.person}</span>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <span className="text-xs font-bold font-['JetBrains_Mono']" style={{ color: alert.score >= 80 ? "#C94A5E" : alert.score >= 60 ? "#FACC15" : "#4ADE80" }}>
                            {alert.score}
                          </span>
                          <span className="text-gray-600 text-xs">/100</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0"
                          style={{
                            background: alert.status === "resolved" ? "rgba(74,222,128,0.1)" : alert.status === "escalated" ? "rgba(201,74,94,0.1)" : alert.status === "investigating" ? "rgba(250,204,21,0.1)" : "rgba(156,163,175,0.1)",
                            color: alert.status === "resolved" ? "#4ADE80" : alert.status === "escalated" ? "#C94A5E" : alert.status === "investigating" ? "#FACC15" : "#9CA3AF",
                          }}>
                          {isAr ? (alert.status === "resolved" ? "محلول" : alert.status === "escalated" ? "مُصعَّد" : alert.status === "investigating" ? "قيد التحقيق" : "مفتوح") : alert.status}
                        </span>
                        <span className="text-gray-500 text-xs flex-shrink-0">{alert.assigned}</span>
                        {alert.minutesOpen > 0 && alert.status !== "resolved" && (
                          <span className="text-xs font-['JetBrains_Mono'] flex-shrink-0" style={{ color: alert.minutesOpen >= 30 ? "#C94A5E" : "#FACC15" }}>
                            {alert.minutesOpen}m
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Expanded detail */}
                    {isSelected && (
                      <div className="rounded-b-2xl border border-t-0 px-5 py-4"
                        style={{ background: "rgba(5,20,40,0.95)", borderColor: "rgba(184,138,60,0.15)" }}>
                        <p className="text-gray-300 text-sm mb-4">{alert.detail}</p>
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          {alert.status !== "resolved" && (
                            <>
                              <button type="button" onClick={() => resolveAlert(alert.id)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap"
                                style={{ background: "#D6B47E", color: "#051428" }}>
                                <i className="ri-checkbox-circle-line text-xs" />
                                {isAr ? "حل" : "Resolve"}
                              </button>
                              <button type="button" onClick={() => escalateAlert(alert.id)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-bold cursor-pointer whitespace-nowrap"
                                style={{ background: "transparent", borderColor: "rgba(201,74,94,0.4)", color: "#C94A5E" }}>
                                <i className="ri-arrow-up-line text-xs" />
                                {isAr ? "تصعيد" : "Escalate"}
                              </button>
                              <button type="button"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-semibold cursor-pointer whitespace-nowrap"
                                style={{ background: "transparent", borderColor: "rgba(250,204,21,0.3)", color: "#FACC15" }}>
                                <i className="ri-user-add-line text-xs" />
                                {isAr ? "تعيين" : "Assign"}
                              </button>
                            </>
                          )}
                        </div>
                        {/* Notes */}
                        <div className="flex gap-2">
                          <input type="text" value={alertNote} onChange={(e) => setAlertNote(e.target.value)}
                            placeholder={isAr ? "إضافة ملاحظة..." : "Add note..."}
                            className="flex-1 px-3 py-2 rounded-lg border text-xs outline-none"
                            style={{ background: "rgba(5,20,40,0.8)", borderColor: "rgba(184,138,60,0.15)", color: "#D1D5DB" }} />
                          <button type="button" onClick={() => setAlertNote("")}
                            className="px-3 py-2 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap"
                            style={{ background: "rgba(184,138,60,0.1)", color: "#D6B47E", border: "1px solid rgba(184,138,60,0.2)" }}>
                            {isAr ? "حفظ" : "Save"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 4 — VIS REPLICATION MONITOR
        ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "replication" && (
          <>
            <div>
              <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "مراقبة تكرار VIS" : "VIS Replication Monitor"}</h1>
              <p className="text-gray-400 text-sm">{isAr ? "مراقبة مزامنة قواعد البيانات المتكررة RES-A وRES-B" : "Monitor synchronization of replicated databases RES-A and RES-B"}</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                { id: "RES-A", lag: rl1Lag, events: rl1Events, host: "vis-a.police.gov", location: "Muscat DC", locationAr: "مركز بيانات مسقط" },
                { id: "RES-B", lag: rl2Lag, events: rl2Events, host: "vis-b.police.gov", location: "Salalah DC", locationAr: "مركز بيانات صلالة" },
              ].map((rl) => {
                const lagOk = rl.lag < 5;
                const lagColor = rl.lag < 1 ? "#4ADE80" : rl.lag < 3 ? "#FACC15" : "#C94A5E";
                return (
                  <div key={rl.id} className="rounded-2xl border overflow-hidden"
                    style={{ background: "rgba(10,37,64,0.8)", borderColor: lagOk ? "rgba(184,138,60,0.15)" : "rgba(201,74,94,0.3)", backdropFilter: "blur(12px)" }}>
                    <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "rgba(184,138,60,0.08)" }}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 flex items-center justify-center rounded-xl"
                          style={{ background: lagOk ? "rgba(184,138,60,0.1)" : "rgba(201,74,94,0.1)", border: `1px solid ${lagOk ? "rgba(184,138,60,0.2)" : "rgba(201,74,94,0.3)"}` }}>
                          <i className="ri-server-line text-sm" style={{ color: lagOk ? "#D6B47E" : "#C94A5E" }} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-black text-lg">{rl.id}</span>
                            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: lagOk ? "#4ADE80" : "#C94A5E" }} />
                            <span className="text-xs font-semibold" style={{ color: lagOk ? "#4ADE80" : "#C94A5E" }}>
                              {lagOk ? (isAr ? "متزامن" : "SYNCED") : (isAr ? "تأخر!" : "LAG!")}
                            </span>
                          </div>
                          <p className="text-gray-500 text-xs font-['JetBrains_Mono']">{rl.host}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">{isAr ? (rl.location === "Muscat DC" ? rl.locationAr : rl.locationAr) : rl.location}</div>
                      </div>
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                          <div className="text-2xl font-black font-['JetBrains_Mono']" style={{ color: lagColor }}>{rl.lag.toFixed(1)}s</div>
                          <div className="text-gray-500 text-xs">{isAr ? "وقت التأخر" : "Lag Time"}</div>
                        </div>
                        <div className="px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                          <div className="text-2xl font-black font-['JetBrains_Mono'] text-gold-400">{rl.events.toLocaleString()}</div>
                          <div className="text-gray-500 text-xs">{isAr ? "إجمالي الأحداث" : "Total Events"}</div>
                        </div>
                      </div>
                      {/* Lag bar */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-gray-500 text-xs">{isAr ? "مستوى التأخر" : "Lag Level"}</span>
                          <span className="text-xs font-['JetBrains_Mono']" style={{ color: lagColor }}>{rl.lag.toFixed(1)}s / 5s max</span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                          <div className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (rl.lag / 5) * 100)}%`, background: lagColor }} />
                        </div>
                      </div>
                      {/* Status items */}
                      {[
                        { label: isAr ? "آخر مزامنة" : "Last Sync",       value: timeStr,                    ok: true },
                        { label: isAr ? "حالة الاتصال" : "Connection",     value: isAr ? "متصل" : "Connected", ok: true },
                        { label: isAr ? "سلامة البيانات" : "Data Integrity",value: "100%",                     ok: true },
                        { label: isAr ? "تشفير" : "Encryption",            value: "AES-256",                  ok: true },
                      ].map((s) => (
                        <div key={s.label} className="flex items-center justify-between">
                          <span className="text-gray-500 text-xs">{s.label}</span>
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: s.ok ? "#4ADE80" : "#C94A5E" }} />
                            <span className="text-xs font-['JetBrains_Mono']" style={{ color: s.ok ? "#4ADE80" : "#C94A5E" }}>{s.value}</span>
                          </div>
                        </div>
                      ))}
                      {!lagOk && (
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border animate-pulse"
                          style={{ background: "rgba(201,74,94,0.08)", borderColor: "rgba(201,74,94,0.3)" }}>
                          <i className="ri-alarm-warning-line text-red-400 text-xs" />
                          <span className="text-red-400 text-xs font-bold">{isAr ? "تحذير: التأخر يتجاوز 5 دقائق!" : "WARNING: Lag exceeds 5 minutes!"}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Sync summary */}
            <div className="rounded-2xl border p-5"
              style={{ background: "rgba(10,37,64,0.8)", borderColor: "rgba(184,138,60,0.12)", backdropFilter: "blur(12px)" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg"
                  style={{ background: "rgba(184,138,60,0.1)", border: "1px solid rgba(184,138,60,0.2)" }}>
                  <i className="ri-refresh-line text-gold-400 text-sm" />
                </div>
                <h3 className="text-white font-bold text-sm">{isAr ? "ملخص المزامنة" : "Sync Summary"}</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: isAr ? "الأحداث الرئيسية" : "Primary Events",  value: liveEvents.toLocaleString(), color: "#D6B47E" },
                  { label: isAr ? "أحداث RES-A" : "RES-A Events",         value: rl1Events.toLocaleString(),  color: "#4ADE80" },
                  { label: isAr ? "أحداث RES-B" : "RES-B Events",         value: rl2Events.toLocaleString(),  color: "#A78BFA" },
                  { label: isAr ? "الفجوة القصوى" : "Max Gap",            value: `${Math.abs(liveEvents - rl2Events)}`, color: rl2Lag > 5 ? "#C94A5E" : "#FACC15" },
                ].map((s) => (
                  <div key={s.label} className="px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="text-xl font-black font-['JetBrains_Mono']" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-gray-500 text-xs">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 5 — AUDIT TRAIL
        ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "audit" && (
          <>
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-white text-2xl font-bold mb-1">{isAr ? "مسار التدقيق" : "Audit Trail"}</h1>
                <p className="text-gray-400 text-sm">{isAr ? "سجل غير قابل للتغيير — جميع إجراءات المستخدمين" : "Immutable log — all user actions recorded"}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border"
                  style={{ background: "rgba(74,222,128,0.06)", borderColor: "rgba(74,222,128,0.2)" }}>
                  <i className="ri-lock-line text-green-400 text-xs" />
                  <span className="text-green-400 text-xs font-semibold">{isAr ? "غير قابل للتغيير" : "Immutable"}</span>
                </div>
                <button type="button"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-bold cursor-pointer whitespace-nowrap"
                  style={{ background: "transparent", borderColor: "rgba(184,138,60,0.3)", color: "#D6B47E" }}>
                  <i className="ri-download-2-line text-xs" />
                  {isAr ? "تصدير موقّع رقمياً" : "Export (Digitally Signed)"}
                </button>
              </div>
            </div>
            <div className="rounded-2xl border overflow-hidden"
              style={{ background: "rgba(10,37,64,0.8)", borderColor: "rgba(184,138,60,0.12)", backdropFilter: "blur(12px)" }}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr style={{ background: "rgba(184,138,60,0.05)", borderBottom: "1px solid rgba(184,138,60,0.1)" }}>
                      {[isAr?"الطابع الزمني":"Timestamp", isAr?"المستخدم":"User", isAr?"الإجراء":"Action", isAr?"الهدف":"Target", isAr?"عنوان IP":"IP Address", isAr?"التفاصيل":"Details"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-bold font-['JetBrains_Mono'] uppercase tracking-wider text-gray-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {AUDIT_DATA.map((entry, idx) => (
                      <tr key={entry.id} className="border-b transition-colors"
                        style={{ background: idx % 2 === 0 ? "rgba(10,37,64,0.6)" : "rgba(5,20,40,0.4)", borderColor: "rgba(184,138,60,0.05)" }}>
                        <td className="px-4 py-3"><span className="text-gray-400 text-xs font-['JetBrains_Mono']">{entry.ts}</span></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0"
                              style={{ background: "rgba(184,138,60,0.1)", border: "1px solid rgba(184,138,60,0.2)" }}>
                              <span className="text-gold-400 font-bold" style={{ fontSize: "8px" }}>{entry.user.split(" ").map((n) => n[0]).join("").slice(0, 2)}</span>
                            </div>
                            <span className="text-white text-xs font-semibold whitespace-nowrap">{entry.user}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold font-['JetBrains_Mono']"
                            style={{ background: `${ACTION_COLORS[entry.action] || "#9CA3AF"}15`, color: ACTION_COLORS[entry.action] || "#9CA3AF", border: `1px solid ${ACTION_COLORS[entry.action] || "#9CA3AF"}25` }}>
                            {entry.action}
                          </span>
                        </td>
                        <td className="px-4 py-3"><span className="text-gray-300 text-xs">{entry.target}</span></td>
                        <td className="px-4 py-3"><span className="text-gray-500 text-xs font-['JetBrains_Mono']">{entry.ip}</span></td>
                        <td className="px-4 py-3"><span className="text-gray-400 text-xs">{entry.detail}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Integrity footer */}
              <div className="flex items-center gap-3 px-5 py-3 border-t" style={{ borderColor: "rgba(184,138,60,0.08)" }}>
                <i className="ri-shield-check-line text-green-400 text-xs" />
                <span className="text-green-400 text-xs font-['JetBrains_Mono']">
                  {isAr ? "سلامة السجل مؤكدة — SHA-256 · لا توجد تعديلات مكتشفة" : "Log integrity verified — SHA-256 · No tampering detected"}
                </span>
                <span className="ml-auto text-gray-600 text-xs font-['JetBrains_Mono']">HASH: 3f7a9c2e...b84d1f</span>
              </div>
            </div>
          </>
        )}

      </main>
    </div>
  );
};

export default CommandCenterPage;
