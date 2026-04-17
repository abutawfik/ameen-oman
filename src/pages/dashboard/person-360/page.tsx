// Person 360° — Wave 2 · Deliverable 1
// Full entity dossier with Identity · Movements · Relationships · Activity · Risk · Cases tabs.
// Renders inside DashboardLayout's <Outlet /> — no sidebar/titlebar of its own.

import { useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import type { DashboardOutletContext } from "../DashboardLayout";
import { useBrandFonts } from "@/brand/typography";
import {
  SCORED_RECORDS,
  MOVEMENT_EVENTS,
  ENTITY_GRAPHS,
  CASES,
  RISK_RULES,
  SCORE_BAND_META,
  CLASSIFICATION_META,
  DEFAULT_SUB_SCORE_WEIGHTS,
  type ScoredRecord,
  type Classification,
  type MovementEvent,
  type MovementEventType,
  type GraphNode,
  type GraphEdge,
  type Case,
  type SubScoreKey,
} from "@/mocks/osintData";

type TabKey = "identity" | "movements" | "relationships" | "activity" | "risk" | "cases";

// ── Shared helpers ─────────────────────────────────────────────────────────

const EVENT_META: Record<MovementEventType, { labelEn: string; labelAr: string; icon: string; color: string; group: "border" | "hotel" | "sim" | "vehicle" | "mol" | "municipality" }> = {
  BORDER_ENTRY:          { labelEn: "Border entry",       labelAr: "دخول حدودي",      icon: "ri-flight-land-line",   color: "#D6B47E", group: "border" },
  BORDER_EXIT:           { labelEn: "Border exit",        labelAr: "خروج حدودي",      icon: "ri-flight-takeoff-line", color: "#B88A3C", group: "border" },
  HOTEL_CHECKIN:         { labelEn: "Hotel check-in",     labelAr: "تسجيل فندق",       icon: "ri-hotel-bed-line",     color: "#4A7AA8", group: "hotel" },
  HOTEL_CHECKOUT:        { labelEn: "Hotel check-out",    labelAr: "مغادرة فندق",      icon: "ri-hotel-line",          color: "#4A7AA8", group: "hotel" },
  SIM_ACTIVATION:        { labelEn: "SIM activation",     labelAr: "تفعيل شريحة",     icon: "ri-sim-card-line",      color: "#4A8E3A", group: "sim" },
  VEHICLE_RENTAL_START:  { labelEn: "Vehicle rental",     labelAr: "استئجار مركبة",    icon: "ri-car-line",            color: "#C94A5E", group: "vehicle" },
  VEHICLE_RENTAL_END:    { labelEn: "Vehicle returned",   labelAr: "إعادة مركبة",      icon: "ri-car-washing-line",   color: "#C94A5E", group: "vehicle" },
  MOL_EMPLOYMENT_START:  { labelEn: "MOL employment",     labelAr: "تسجيل توظيف",      icon: "ri-briefcase-line",      color: "#6B4FAE", group: "mol" },
  MOL_EMPLOYMENT_END:    { labelEn: "MOL employment end", labelAr: "نهاية توظيف",      icon: "ri-briefcase-4-line",    color: "#6B4FAE", group: "mol" },
  MUNICIPALITY_LEASE:    { labelEn: "Municipality lease", labelAr: "عقد إيجار بلدي",   icon: "ri-home-office-line",    color: "#C98A1B", group: "municipality" },
};

const NODE_META: Record<GraphNode["type"], { color: string; icon: string }> = {
  person:       { color: "#4A7AA8", icon: "ri-user-line" },
  sponsor:      { color: "#D6B47E", icon: "ri-shield-user-line" },
  employer:     { color: "#4A8E3A", icon: "ri-briefcase-line" },
  address:      { color: "#7AB3E8", icon: "ri-map-pin-line" },
  vehicle:      { color: "#C94A5E", icon: "ri-car-line" },
  sim:          { color: "#4A90C8", icon: "ri-sim-card-line" },
  organization: { color: "#C98A1B", icon: "ri-building-line" },
};

const ClassificationPill = ({ classification, isAr }: { classification: Classification; isAr: boolean }) => {
  const meta = CLASSIFICATION_META[classification];
  return (
    <span
      className="rounded-md font-bold tracking-widest inline-flex items-center px-1.5 py-0.5"
      style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.color}44`, fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}
    >
      {isAr ? meta.labelAr : meta.label}
    </span>
  );
};

const formatTs = (iso: string): string => iso.replace("T", " ").replace("Z", "Z");

// Seeded helpers — same subject gets same synthetic data each render.
const seed = (s: string): (() => number) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 1000) / 1000;
  };
};

const birthYearFromId = (id: string): number => {
  const r = seed(id);
  return 1971 + Math.floor(r() * 28);
};
const ageFromYear = (year: number): number => 2026 - year;

// ── Header ────────────────────────────────────────────────────────────────

const SubjectHeader = ({
  subject,
  isAr,
  all,
  onSelect,
}: {
  subject: ScoredRecord;
  isAr: boolean;
  all: ScoredRecord[];
  onSelect: (id: string) => void;
}) => {
  const fonts = useBrandFonts();
  const bandMeta = SCORE_BAND_META[subject.band];
  const year = birthYearFromId(subject.id);
  const age = ageFromYear(year);

  return (
    <div
      className="rounded-2xl border p-6 mb-4 flex flex-col gap-5"
      style={{
        background: `linear-gradient(135deg, ${bandMeta.color}11, var(--alm-ocean-800, #0A2540))`,
        borderColor: `${bandMeta.color}44`,
      }}
    >
      <div className="flex items-start gap-2 flex-wrap">
        <span className="text-gray-500 text-[10px] font-bold tracking-widest" style={{ fontFamily: fonts.mono }}>
          {isAr ? "اختيار الشخص" : "SUBJECT"}
        </span>
        <div className="flex gap-2 flex-wrap ml-2">
          {all.map((r) => {
            const active = r.id === subject.id;
            return (
              <button
                key={r.id}
                onClick={() => onSelect(r.id)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs cursor-pointer transition-all"
                style={{
                  background: active ? `${SCORE_BAND_META[r.band].color}22` : "rgba(255,255,255,0.03)",
                  color: active ? SCORE_BAND_META[r.band].color : "#9CA3AF",
                  border: `1px solid ${active ? SCORE_BAND_META[r.band].color : "rgba(255,255,255,0.08)"}`,
                  fontFamily: fonts.sans,
                }}
              >
                <i className="ri-user-search-line text-sm" />
                {r.travelerName}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-5">
        {/* Avatar */}
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${bandMeta.color}33, ${bandMeta.color}11)`,
            border: `1px solid ${bandMeta.color}55`,
          }}
        >
          <i className="ri-user-3-line text-3xl" style={{ color: bandMeta.color }} />
        </div>

        {/* Name + identity chips */}
        <div className="flex-1 min-w-[260px]">
          <h1 className="text-white text-3xl font-bold" style={{ fontFamily: fonts.display }}>
            {subject.travelerName}
          </h1>
          <p className="text-gray-400 text-sm mt-0.5" style={{ fontFamily: fonts.arabic, direction: "rtl", textAlign: "left" }}>
            {subject.travelerNameAr}
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="px-2 py-1 rounded-md text-xs flex items-center gap-1.5"
              style={{ background: "rgba(255,255,255,0.04)", color: "#D1D5DB", border: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="text-base leading-none">{subject.nationalityCode ? String.fromCodePoint(...[...subject.nationalityCode.toUpperCase()].map((c) => 0x1f1a5 + c.charCodeAt(0))) : ""}</span>
              <span style={{ fontFamily: fonts.mono }}>{subject.nationality}</span>
            </span>
            <span className="px-2 py-1 rounded-md text-xs" style={{ background: "rgba(255,255,255,0.04)", color: "#D1D5DB", border: "1px solid rgba(255,255,255,0.06)", fontFamily: fonts.mono }}>
              <i className="ri-passport-line mr-1" />
              {subject.passportNumber}
            </span>
            <span className="px-2 py-1 rounded-md text-xs" style={{ background: "rgba(255,255,255,0.04)", color: "#D1D5DB", border: "1px solid rgba(255,255,255,0.06)", fontFamily: fonts.mono }}>
              <i className="ri-calendar-line mr-1" />
              {year}-{String(1 + Math.floor(seed(subject.id + "m")() * 12)).padStart(2, "0")}-{String(1 + Math.floor(seed(subject.id + "d")() * 27)).padStart(2, "0")}
            </span>
            <span className="px-2 py-1 rounded-md text-xs" style={{ background: "rgba(255,255,255,0.04)", color: "#D1D5DB", border: "1px solid rgba(255,255,255,0.06)", fontFamily: fonts.mono }}>
              {age} {isAr ? "عاماً" : "yrs"}
            </span>
            <ClassificationPill classification={subject.classification} isAr={isAr} />
          </div>

          <p className="text-gray-500 text-[11px] mt-2 flex items-center gap-2" style={{ fontFamily: fonts.mono }} title={isAr ? "من تدفق الدخول/الخروج الحدودي" : "from Border Entry/Exit"}>
            <i className="ri-time-line" />
            {isAr ? "آخر رصد" : "Last seen"}: {formatTs(subject.arrivalTs)}
          </p>
        </div>

        {/* Score badge */}
        <div className="flex flex-col items-center justify-center min-w-[120px]">
          <span className="text-[10px] tracking-widest text-gray-500" style={{ fontFamily: fonts.mono }}>
            {isAr ? "الدرجة الموحّدة" : "UNIFIED SCORE"}
          </span>
          <span className="font-black" style={{ color: bandMeta.color, fontSize: "3.5rem", lineHeight: 1, fontFamily: fonts.mono }}>
            {subject.unifiedScore}
          </span>
          <span
            className="mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-widest"
            style={{ background: `${bandMeta.color}22`, color: bandMeta.color, border: `1px solid ${bandMeta.color}55`, fontFamily: fonts.mono }}
          >
            {isAr ? bandMeta.labelAr : bandMeta.labelEn}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          className="px-4 py-2 rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1.5"
          style={{ background: "transparent", color: "#D6B47E", border: "1px solid #D6B47E55", fontFamily: fonts.sans }}
        >
          <i className="ri-eye-line" />
          {isAr ? "إضافة إلى قائمة المراقبة" : "Add to Watchlist"}
        </button>
        <button
          className="px-4 py-2 rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1.5"
          style={{ background: "#8A1F3C", color: "#FFFFFF", border: "1px solid #8A1F3C", fontFamily: fonts.sans }}
        >
          <i className="ri-folder-add-line" />
          {isAr ? "فتح قضية جديدة" : "Open New Case"}
        </button>
      </div>
    </div>
  );
};

// ── Tab 1: Identity ───────────────────────────────────────────────────────

const IdentityTab = ({ subject, isAr }: { subject: ScoredRecord; isAr: boolean }) => {
  const fonts = useBrandFonts();
  const year = birthYearFromId(subject.id);

  // Generate alias variants deterministically
  const aliases = [
    subject.travelerName,
    subject.travelerName.replace(/\s+/g, " "),
    subject.travelerName.split(" ").reverse().join(" "),
  ];

  type CardSpec = {
    titleEn: string;
    titleAr: string;
    icon: string;
    rows: [string, string, string][]; // [labelEn, labelAr, value]
    source: string;
    refreshedAt: string;
  };

  const cards: CardSpec[] = [
    {
      titleEn: "Biographic", titleAr: "معلومات شخصية", icon: "ri-id-card-line",
      rows: [
        ["Full name", "الاسم الكامل", subject.travelerName],
        ["Arabic name", "الاسم بالعربية", subject.travelerNameAr],
        ["Date of birth", "تاريخ الميلاد", `${year}-${String(1 + Math.floor(seed(subject.id + "m")() * 12)).padStart(2, "0")}-${String(1 + Math.floor(seed(subject.id + "d")() * 27)).padStart(2, "0")}`],
        ["Gender", "النوع", seed(subject.id + "g")() > 0.5 ? (isAr ? "ذكر" : "Male") : (isAr ? "أنثى" : "Female")],
        ["Nationality", "الجنسية", `${subject.nationality}`],
      ],
      source: "Civil registry · MoI",
      refreshedAt: "2026-04-17T03:00:00Z",
    },
    {
      titleEn: "Passport", titleAr: "جواز السفر", icon: "ri-passport-line",
      rows: [
        ["Passport no.", "رقم الجواز", subject.passportNumber],
        ["Issuing country", "بلد الإصدار", subject.nationality],
        ["Issued", "تاريخ الإصدار", `${year + 20}-03-11`],
        ["Expires", "تاريخ الانتهاء", `${year + 30}-03-10`],
        ["Biometric match", "المطابقة الحيوية", isAr ? "مطابق ✓" : "Matched ✓"],
      ],
      source: "Biometric gate · ePassport",
      refreshedAt: subject.arrivalTs,
    },
    {
      titleEn: "National ID", titleAr: "الرقم الوطني", icon: "ri-shield-user-line",
      rows: [
        ["National ID", "الرقم الوطني", `${subject.nationalityCode.toUpperCase()}-${Math.floor(seed(subject.id + "n")() * 900000000 + 100000000)}`],
        ["Check-digit", "خانة التحقق", isAr ? "صحيح ✓" : "Valid ✓"],
        ["Issued at", "مكان الإصدار", "Riyadh · SA-01"],
      ],
      source: "GCC ID exchange",
      refreshedAt: "2026-04-10T00:00:00Z",
    },
    {
      titleEn: "Aliases", titleAr: "الأسماء البديلة", icon: "ri-user-received-2-line",
      rows: aliases.map((a, i) => [`Alias ${i + 1}`, `اسم ${i + 1}`, a] as [string, string, string]),
      source: "OpenSanctions · eVisa history",
      refreshedAt: "2026-04-16T14:00:00Z",
    },
    {
      titleEn: "Contact", titleAr: "الاتصال", icon: "ri-phone-line",
      rows: [
        ["Phone", "الهاتف", subject.classification === "public" ? "+968 9xxx 1284" : "+968 9xxx ••84"],
        ["Email", "البريد الإلكتروني", subject.classification === "public" ? `${subject.travelerName.toLowerCase().split(" ")[0]}@corp.${subject.nationalityCode}` : "••••••@corp.•••"],
      ],
      source: "Declaration · SIM provider",
      refreshedAt: subject.arrivalTs,
    },
    {
      titleEn: "Declared address", titleAr: "العنوان المُعلَن", icon: "ri-map-pin-line",
      rows: [
        ["Declared", "المُعلَن", "Qurum Heights, Muscat"],
        ["Matches municipality", "مطابقة البلدية", subject.subScores.declaration > 40 ? (isAr ? "جزئي (0.74)" : "Partial (0.74)") : (isAr ? "مطابق" : "Matched")],
      ],
      source: "Muscat Municipality",
      refreshedAt: "2026-04-14T08:00:00Z",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((c) => (
        <div key={c.titleEn} className="rounded-xl border p-4 flex flex-col"
          style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.15)" }}>
          <div className="flex items-center gap-2 mb-3">
            <i className={c.icon} style={{ color: "#D6B47E" }} />
            <h3 className="text-white text-sm font-bold" style={{ fontFamily: fonts.sans }}>
              {isAr ? c.titleAr : c.titleEn}
            </h3>
          </div>
          <div className="space-y-1.5 flex-1">
            {c.rows.map(([en, ar, val]) => (
              <div key={en} className="flex items-center justify-between gap-2 text-xs">
                <span className="text-gray-500" style={{ fontFamily: fonts.sans }}>{isAr ? ar : en}</span>
                <span className="text-gray-200 font-medium text-right" style={{ fontFamily: fonts.mono }}>{val}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-2 border-t flex items-center justify-between text-[10px]" style={{ borderColor: "rgba(255,255,255,0.06)", fontFamily: fonts.mono }}>
            <span className="text-gray-600">{isAr ? "المصدر" : "Source"}: {c.source}</span>
            <span className="text-gray-600">{formatTs(c.refreshedAt)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Tab 2: Movements ──────────────────────────────────────────────────────

const MovementsTab = ({ subject, isAr }: { subject: ScoredRecord; isAr: boolean }) => {
  const fonts = useBrandFonts();
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const events = useMemo(
    () => MOVEMENT_EVENTS.filter((e) => e.travelerId === subject.id).sort((a, b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime()),
    [subject.id],
  );
  // Related events for highlighting (within 24h of clicked event). Always call the hook — keeps hook order stable.
  const relatedIds = useMemo(() => {
    if (!highlighted) return new Set<string>();
    const origin = events.find((e) => e.id === highlighted);
    if (!origin) return new Set<string>();
    const out = new Set<string>();
    const originMs = new Date(origin.occurredAt).getTime();
    events.forEach((e) => {
      const dMs = Math.abs(new Date(e.occurredAt).getTime() - originMs);
      if (dMs <= 24 * 3_600_000) out.add(e.id);
    });
    return out;
  }, [highlighted, events]);

  if (events.length === 0) {
    return (
      <div className="rounded-xl border p-12 text-center"
        style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.15)" }}>
        <i className="ri-time-line text-5xl text-gray-600" />
        <p className="text-gray-400 mt-3" style={{ fontFamily: fonts.sans }}>
          {isAr ? "لا توجد حركات مُسجَّلة لهذا الشخص" : "No movement events recorded for this subject"}
        </p>
      </div>
    );
  }

  // Detect coherence gaps for separators
  return (
    <div className="space-y-4">
      {/* Coherence banner */}
      {events.some((e) => e.coherenceGapHours && e.coherenceGapHours >= 48) && (
        <div className="rounded-xl border p-4 flex items-center gap-3"
          style={{ background: "linear-gradient(135deg, rgba(138,31,60,0.18), rgba(10,37,64,0.8))", borderColor: "#8A1F3C55" }}>
          <i className="ri-error-warning-fill text-2xl" style={{ color: "#C94A5E" }} />
          <div className="flex-1">
            <h4 className="text-white text-sm font-bold" style={{ fontFamily: fonts.sans }}>
              {isAr ? "فجوة تماسك الحضور" : "Sequence Coherence Gap"}
            </h4>
            <p className="text-gray-300 text-xs" style={{ fontFamily: fonts.sans }}>
              {isAr ? "فجوة 72 ساعة بين وصول APIS وأول تسجيل فندق — شذوذ" : "72h gap between APIS arrival and first hotel check-in — anomalous"}
            </p>
          </div>
          <span className="px-3 py-1 rounded-md text-[10px] font-bold tracking-widest"
            style={{ background: "#8A1F3C22", color: "#C94A5E", border: "1px solid #C94A5E55", fontFamily: fonts.mono }}>
            {isAr ? "شذوذ" : "ANOMALY"}
          </span>
        </div>
      )}

      {/* Timeline */}
      <div
        className="rounded-xl border p-4"
        style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.15)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-sm font-bold" style={{ fontFamily: fonts.sans }}>
            {isAr ? "الجدول الزمني للحركات" : "Movement Timeline"}
            <span className="ml-2 text-[10px] text-gray-500 tracking-widest" style={{ fontFamily: fonts.mono }}>
              {events.length} {isAr ? "حدثاً" : "events"}
            </span>
          </h3>
          <span className="text-[10px] text-gray-500" style={{ fontFamily: fonts.mono }}>
            {isAr ? "اضغط لتمييز الأحداث المرتبطة" : "Click to highlight related events"}
          </span>
        </div>

        {/* Horizontal scrollable timeline */}
        <div className="overflow-x-auto pb-2" style={{ scrollbarWidth: "thin" }}>
          <div className="relative" style={{ minWidth: `${events.length * 220}px`, height: 380 }}>
            {/* Axis line in brass */}
            <div className="absolute left-0 right-0 top-[180px] h-px" style={{ background: "linear-gradient(90deg, transparent, #D6B47E55, #D6B47E55, transparent)" }} />

            {events.map((ev, idx) => {
              const meta = EVENT_META[ev.type];
              const prev = events[idx - 1];
              const gapMs = prev ? new Date(ev.occurredAt).getTime() - new Date(prev.occurredAt).getTime() : 0;
              const gapDays = Math.floor(gapMs / (24 * 3_600_000));
              const dashed = gapDays > 60;
              const anomaly = ev.coherenceGapHours && ev.coherenceGapHours >= 48;
              const isRelated = relatedIds.has(ev.id);
              const dimmed = highlighted && !isRelated;
              const above = idx % 2 === 0;

              return (
                <div key={ev.id} className="absolute" style={{ left: `${idx * 220 + 30}px`, top: 0, width: 200 }}>
                  {/* Month separator */}
                  {idx > 0 && gapDays > 20 && (
                    <div className="absolute top-[170px] -left-[30px] text-[10px] text-gray-600" style={{ fontFamily: fonts.mono }}>
                      {dashed && (
                        <div className="w-10 h-px" style={{ borderTop: "2px dashed #D6B47E55" }} />
                      )}
                      <span className="mt-1 block">{new Date(ev.occurredAt).toISOString().slice(0, 7)}</span>
                    </div>
                  )}

                  {/* Connector to axis */}
                  <div
                    className="absolute left-1/2 w-px"
                    style={{
                      top: above ? 160 : 200,
                      height: above ? 20 : 20,
                      background: `${meta.color}88`,
                    }}
                  />

                  {/* Axis dot */}
                  <div
                    className="absolute left-1/2 w-3 h-3 rounded-full -translate-x-1/2"
                    style={{
                      top: 174,
                      background: meta.color,
                      boxShadow: isRelated ? `0 0 10px ${meta.color}` : "none",
                      opacity: dimmed ? 0.3 : 1,
                    }}
                  />

                  {/* Card */}
                  <button
                    onClick={() => setHighlighted(highlighted === ev.id ? null : ev.id)}
                    className="absolute left-1/2 -translate-x-1/2 rounded-lg border p-3 cursor-pointer text-left transition-all w-[200px]"
                    style={{
                      top: above ? 10 : 215,
                      background: anomaly ? "rgba(138,31,60,0.2)" : "rgba(5,20,40,0.95)",
                      borderColor: anomaly ? "#C94A5E" : isRelated ? `${meta.color}AA` : "rgba(255,255,255,0.08)",
                      boxShadow: isRelated ? `0 0 12px ${meta.color}44` : "none",
                      opacity: dimmed ? 0.35 : 1,
                      fontFamily: fonts.sans,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <i className={meta.icon} style={{ color: meta.color }} />
                      <span className="text-[10px] tracking-widest font-bold px-1.5 py-0.5 rounded"
                        style={{ background: `${meta.color}22`, color: meta.color, fontFamily: fonts.mono }}>
                        {isAr ? meta.labelAr : meta.labelEn}
                      </span>
                    </div>
                    <div className="text-xs text-white font-bold mb-0.5" style={{ fontFamily: fonts.mono }}>
                      {ev.occurredAt.slice(0, 10)} · {ev.occurredAt.slice(11, 16)}
                    </div>
                    <div className="text-[11px] text-gray-300 mb-1">
                      {ev.location.iata ? `${ev.location.iata} · ` : ""}{ev.location.city}
                    </div>
                    <div className="text-[10px] text-gray-500" style={{ fontFamily: fonts.mono }}>
                      {ev.source}
                    </div>
                    {anomaly && (
                      <div className="mt-1 text-[10px] font-bold" style={{ color: "#C94A5E", fontFamily: fonts.mono }}>
                        {isAr ? `فجوة ${ev.coherenceGapHours} ساعة` : `${ev.coherenceGapHours}h gap`}
                      </div>
                    )}
                    <ClassificationPill classification={ev.sourceClass} isAr={isAr} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Tab 3: Relationships (SVG radial graph) ───────────────────────────────

const RelationshipsTab = ({ subject, isAr }: { subject: ScoredRecord; isAr: boolean }) => {
  const fonts = useBrandFonts();
  const graph = ENTITY_GRAPHS[subject.id];
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  if (!graph) {
    return (
      <div className="rounded-xl border p-12 text-center"
        style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.15)" }}>
        <i className="ri-share-line text-5xl text-gray-600" />
        <p className="text-gray-400 mt-3" style={{ fontFamily: fonts.sans }}>
          {isAr ? "لا توجد علاقات مُحمَّلة لهذا الشخص" : "No relationship graph loaded for this subject"}
        </p>
      </div>
    );
  }

  const center = graph.nodes.find((n) => n.id === "subject")!;
  const others = graph.nodes.filter((n) => n.id !== "subject");

  const WIDTH = 800;
  const HEIGHT = 520;
  const CX = WIDTH / 2;
  const CY = HEIGHT / 2;

  // Lay ring 1 = direct neighbors of subject, ring 2 = the rest
  const directIds = new Set<string>();
  graph.edges.forEach((e) => {
    if (e.from === "subject") directIds.add(e.to);
    if (e.to === "subject") directIds.add(e.from);
  });
  const ring1 = others.filter((n) => directIds.has(n.id));
  const ring2 = others.filter((n) => !directIds.has(n.id));

  const positions: Record<string, { x: number; y: number }> = {};
  positions["subject"] = { x: CX, y: CY };

  const layoutRing = (nodes: GraphNode[], radius: number) => {
    nodes.forEach((n, i) => {
      const angle = (i / Math.max(1, nodes.length)) * 2 * Math.PI - Math.PI / 2;
      positions[n.id] = { x: CX + radius * Math.cos(angle), y: CY + radius * Math.sin(angle) };
    });
  };
  layoutRing(ring1, 170);
  layoutRing(ring2, 235);

  const selectedNode = selectedNodeId ? graph.nodes.find((n) => n.id === selectedNodeId) : null;
  const edgeColor = (e: GraphEdge): string => (e.type === "sanctioned_by" ? "#C94A5E" : e.type === "related_to" ? "#C98A1B" : "#D6B47E55");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 rounded-xl border p-4 relative"
        style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.15)" }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white text-sm font-bold" style={{ fontFamily: fonts.sans }}>
            {isAr ? "شبكة العلاقات" : "Relationship Graph"}
          </h3>
          <div className="flex gap-2 text-[10px]" style={{ fontFamily: fonts.mono }}>
            {Object.entries(NODE_META).map(([k, m]) => (
              <span key={k} className="flex items-center gap-1 text-gray-500">
                <span className="w-2 h-2 rounded-full" style={{ background: m.color }} />
                {k}
              </span>
            ))}
          </div>
        </div>
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" style={{ maxHeight: 520 }}>
          {/* Concentric rings */}
          <circle cx={CX} cy={CY} r={170} fill="none" stroke="#D6B47E22" strokeDasharray="3 4" />
          <circle cx={CX} cy={CY} r={235} fill="none" stroke="#D6B47E14" strokeDasharray="3 4" />

          {/* Edges */}
          {graph.edges.map((e, i) => {
            const from = positions[e.from];
            const to = positions[e.to];
            if (!from || !to) return null;
            const sanctions = e.type === "sanctioned_by";
            return (
              <g key={i}>
                <line
                  x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke={edgeColor(e)}
                  strokeWidth={sanctions ? 2 : 1.25}
                  strokeDasharray={sanctions ? "5 4" : undefined}
                />
                {e.label && (
                  <text
                    x={(from.x + to.x) / 2}
                    y={(from.y + to.y) / 2 - 4}
                    fontSize="9"
                    fill={sanctions ? "#C94A5E" : "#9CA3AF"}
                    fontFamily="JetBrains Mono"
                    textAnchor="middle"
                  >{e.label}</text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {graph.nodes.map((n) => {
            const p = positions[n.id];
            const isSubject = n.id === "subject";
            const meta = NODE_META[n.type];
            const r = isSubject ? 28 : n.sanctioned ? 22 : 18;
            return (
              <g key={n.id} onClick={() => setSelectedNodeId(n.id === selectedNodeId ? null : n.id)} style={{ cursor: "pointer" }}>
                <circle
                  cx={p.x} cy={p.y} r={r}
                  fill={n.sanctioned ? "#8A1F3C" : `${meta.color}33`}
                  stroke={n.sanctioned ? "#C94A5E" : meta.color}
                  strokeWidth={isSubject ? 3 : 1.5}
                />
                {n.sanctioned && (
                  <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="14" fill="#FFFFFF">!</text>
                )}
                <text
                  x={p.x} y={p.y + r + 14}
                  textAnchor="middle" fontSize="11"
                  fill={isSubject ? "#FFFFFF" : "#D1D5DB"}
                  fontFamily={fonts.sans}
                  fontWeight={isSubject ? "bold" : "normal"}
                >{n.label.length > 22 ? n.label.slice(0, 20) + "…" : n.label}</text>
              </g>
            );
          })}
        </svg>

        {/* Sanctioned path callout */}
        {graph.edges.some((e) => e.type === "sanctioned_by") && (
          <div className="absolute bottom-4 left-4 rounded-lg px-3 py-2 flex items-center gap-2"
            style={{ background: "rgba(138,31,60,0.4)", border: "1px solid #C94A5E88", fontFamily: fonts.mono }}>
            <i className="ri-alarm-warning-fill text-lg" style={{ color: "#C94A5E" }} />
            <span className="text-[11px] text-white">
              {isAr ? "مسار مسارين إلى كيان معاقَب" : "2-hop path to sanctioned entity"}
            </span>
          </div>
        )}
      </div>

      {/* Side panel */}
      <div className="rounded-xl border p-4"
        style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.15)" }}>
        {selectedNode ? (
          <>
            <div className="flex items-center gap-2 mb-3">
              <i className={NODE_META[selectedNode.type].icon} style={{ color: NODE_META[selectedNode.type].color }} />
              <h3 className="text-white text-sm font-bold" style={{ fontFamily: fonts.sans }}>{selectedNode.label}</h3>
            </div>
            {selectedNode.labelAr && (
              <p className="text-gray-400 text-xs mb-3" style={{ fontFamily: fonts.arabic, direction: "rtl", textAlign: "left" }}>{selectedNode.labelAr}</p>
            )}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">{isAr ? "النوع" : "Type"}</span>
                <span className="text-gray-200" style={{ fontFamily: fonts.mono }}>{selectedNode.type}</span>
              </div>
              {selectedNode.riskScore !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-500">{isAr ? "درجة المخاطر" : "Risk score"}</span>
                  <span className="font-bold" style={{ color: selectedNode.riskScore > 70 ? "#C94A5E" : selectedNode.riskScore > 40 ? "#C98A1B" : "#4ADE80", fontFamily: fonts.mono }}>
                    {selectedNode.riskScore}
                  </span>
                </div>
              )}
              {selectedNode.classification && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">{isAr ? "التصنيف" : "Classification"}</span>
                  <ClassificationPill classification={selectedNode.classification} isAr={isAr} />
                </div>
              )}
              {selectedNode.sanctioned && (
                <div className="mt-2 px-3 py-2 rounded-md flex items-center gap-2"
                  style={{ background: "rgba(138,31,60,0.25)", border: "1px solid #C94A5E55" }}>
                  <i className="ri-alarm-warning-fill" style={{ color: "#C94A5E" }} />
                  <span className="text-xs text-white font-bold">{isAr ? "على قائمة العقوبات" : "On sanctions list"}</span>
                </div>
              )}
              {/* Edges connected */}
              <div className="pt-2 mt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <h4 className="text-[11px] tracking-widest text-gray-500 mb-2" style={{ fontFamily: fonts.mono }}>
                  {isAr ? "الحوافّ" : "EDGES"}
                </h4>
                {graph.edges.filter((e) => e.from === selectedNode.id || e.to === selectedNode.id).map((e, i) => (
                  <div key={i} className="text-[11px] text-gray-300 flex items-center gap-1 py-0.5" style={{ fontFamily: fonts.mono }}>
                    <i className="ri-arrow-right-line" style={{ color: edgeColor(e) }} />
                    {e.type}{e.label ? ` · ${e.label}` : ""}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <i className="ri-touch-line text-4xl text-gray-600" />
            <p className="text-gray-400 text-sm mt-2" style={{ fontFamily: fonts.sans }}>
              {isAr ? "اضغط عقدة لعرض التفاصيل" : "Click a node to see details"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Tab 4: Activity ───────────────────────────────────────────────────────

const ActivityTab = ({ subject, isAr }: { subject: ScoredRecord; isAr: boolean }) => {
  const fonts = useBrandFonts();
  const movements = MOVEMENT_EVENTS.filter((e) => e.travelerId === subject.id).map((e) => ({
    id: e.id,
    at: e.occurredAt,
    icon: EVENT_META[e.type].icon,
    color: EVENT_META[e.type].color,
    typeEn: EVENT_META[e.type].labelEn,
    typeAr: EVENT_META[e.type].labelAr,
    descEn: `${e.location.city} · ${e.source}`,
    descAr: `${e.location.city} · ${e.source}`,
    classification: e.sourceClass,
  }));
  const signals = subject.contributions.map((c, i) => ({
    id: `sig-${i}`,
    at: subject.computedAt,
    icon: c.type === "rule" ? "ri-flashlight-line" : "ri-cpu-line",
    color: c.type === "rule" ? "#D6B47E" : "#6B4FAE",
    typeEn: c.type === "rule" ? "Rule fired" : "ML feature",
    typeAr: c.type === "rule" ? "إطلاق قاعدة" : "ميزة ML",
    descEn: `${c.ref} · ${c.observed}`,
    descAr: `${c.ref} · ${c.observed}`,
    classification: subject.classification,
  }));
  const merged = [...movements, ...signals].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()).slice(0, 20);

  // Group by day
  const groups: Record<string, typeof merged> = {};
  merged.forEach((m) => {
    const day = m.at.slice(0, 10);
    (groups[day] ??= []).push(m);
  });

  return (
    <div className="rounded-xl border p-5"
      style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.15)" }}>
      <h3 className="text-white text-sm font-bold mb-4" style={{ fontFamily: fonts.sans }}>
        {isAr ? "نشاط الشخص" : "Activity feed"}
        <span className="ml-2 text-[10px] tracking-widest text-gray-500" style={{ fontFamily: fonts.mono }}>
          {merged.length} {isAr ? "حدثاً" : "events"}
        </span>
      </h3>
      <div className="space-y-5">
        {Object.entries(groups).map(([day, items]) => (
          <div key={day}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] tracking-widest font-bold text-gray-400" style={{ fontFamily: fonts.mono }}>
                {day}
              </span>
              <div className="flex-1 h-px" style={{ background: "rgba(184,138,60,0.1)" }} />
            </div>
            <ul className="space-y-2">
              {items.map((it) => (
                <li key={it.id} className="flex items-start gap-3 rounded-md p-2"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${it.color}22`, border: `1px solid ${it.color}55` }}
                  >
                    <i className={it.icon} style={{ color: it.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold" style={{ color: it.color, fontFamily: fonts.mono }}>{it.at.slice(11, 16)}</span>
                      <span className="text-gray-300 font-medium" style={{ fontFamily: fonts.sans }}>
                        {isAr ? it.typeAr : it.typeEn}
                      </span>
                      <ClassificationPill classification={it.classification} isAr={isAr} />
                    </div>
                    <p className="text-gray-400 text-[11px] mt-0.5" style={{ fontFamily: fonts.sans }}>
                      {isAr ? it.descAr : it.descEn}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Tab 5: Risk ───────────────────────────────────────────────────────────

const RiskTab = ({ subject, isAr }: { subject: ScoredRecord; isAr: boolean }) => {
  const fonts = useBrandFonts();
  const band = SCORE_BAND_META[subject.band];

  // 7-day trend (deterministic)
  const trend = useMemo(() => {
    const r = seed(subject.id + "trend");
    return Array.from({ length: 7 }, (_, i) => {
      const variation = (r() - 0.5) * 8;
      const v = Math.max(0, Math.min(100, subject.unifiedScore - (6 - i) * 1.2 + variation));
      const d = new Date(new Date(subject.computedAt).getTime() - (6 - i) * 86400000);
      return { day: d.toISOString().slice(5, 10), score: Math.round(v) };
    });
  }, [subject]);

  // Group contributions by sub-score
  const bySub: Record<SubScoreKey, typeof subject.contributions> = {
    sanctions: [], geopolitical: [], biosecurity: [], routing: [],
    behavioral: [], declaration: [], entity: [], presence: [], document: [],
  };
  subject.contributions.forEach((c) => bySub[c.subScore].push(c));

  // Open rule fires — RISK_RULES filtered by any subscore category with contributions
  const activeCategories = new Set<SubScoreKey>(subject.contributions.map((c) => c.subScore));
  const openRules = RISK_RULES.filter((r) => r.enabled && activeCategories.has(r.category)).slice(0, 8);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Score + trend */}
      <div className="lg:col-span-2 rounded-xl border p-5"
        style={{ background: `linear-gradient(135deg, ${band.color}11, rgba(10,37,64,0.8))`, borderColor: `${band.color}44` }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] tracking-widest text-gray-400" style={{ fontFamily: fonts.mono }}>
              {isAr ? "الدرجة الموحّدة الحالية" : "CURRENT UNIFIED SCORE"}
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="font-black" style={{ color: band.color, fontSize: "3rem", lineHeight: 1, fontFamily: fonts.mono }}>
                {subject.unifiedScore}
              </span>
              <span className="px-2 py-0.5 rounded-md text-xs font-bold tracking-widest"
                style={{ background: `${band.color}22`, color: band.color, border: `1px solid ${band.color}55`, fontFamily: fonts.mono }}>
                {isAr ? band.labelAr : band.labelEn}
              </span>
            </div>
          </div>
          <span className="text-[10px] tracking-widest text-gray-500" style={{ fontFamily: fonts.mono }}>
            {isAr ? "آخر 7 أيام" : "7-DAY TREND"}
          </span>
        </div>
        <div style={{ height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ left: 0, right: 16, top: 4, bottom: 0 }}>
              <defs>
                <linearGradient id="riskTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={band.color} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={band.color} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,138,60,0.08)" />
              <XAxis dataKey="day" stroke="#6B7280" tick={{ fontSize: 10, fontFamily: "JetBrains Mono" }} />
              <YAxis domain={[0, 100]} stroke="#6B7280" tick={{ fontSize: 10, fontFamily: "JetBrains Mono" }} />
              <Tooltip contentStyle={{ background: "#0A2540", border: "1px solid rgba(184,138,60,0.3)", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="score" stroke={band.color} strokeWidth={2} fill="url(#riskTrend)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active signals list */}
      <div className="rounded-xl border p-5"
        style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.15)" }}>
        <h3 className="text-white text-sm font-bold mb-3" style={{ fontFamily: fonts.sans }}>
          {isAr ? "الإشارات النشطة" : "Active signals"}
        </h3>
        <div className="space-y-3">
          {(Object.keys(bySub) as SubScoreKey[]).map((sub) => {
            if (bySub[sub].length === 0) return null;
            const meta = DEFAULT_SUB_SCORE_WEIGHTS.find((w) => w.key === sub)!;
            return (
              <div key={sub}>
                <div className="flex items-center gap-2 mb-1">
                  <i className={meta.icon} style={{ color: meta.color }} />
                  <span className="text-[10px] tracking-widest font-bold" style={{ color: meta.color, fontFamily: fonts.mono }}>
                    {isAr ? meta.labelAr : meta.labelEn}
                  </span>
                </div>
                <ul className="pl-4 space-y-0.5">
                  {bySub[sub].map((c, i) => (
                    <li key={i} className="text-[11px] text-gray-300" style={{ fontFamily: fonts.sans }}>
                      · {c.observed}
                      <span className="ml-2 font-bold" style={{ color: meta.color, fontFamily: fonts.mono }}>+{c.contribution}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Open rules */}
      <div className="lg:col-span-3 rounded-xl border p-5"
        style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.15)" }}>
        <h3 className="text-white text-sm font-bold mb-3" style={{ fontFamily: fonts.sans }}>
          {isAr ? "قواعد ذات صلة بالمخاطر" : "Open rule fires"}
          <span className="ml-2 text-[10px] tracking-widest text-gray-500" style={{ fontFamily: fonts.mono }}>
            {openRules.length}
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {openRules.map((r) => (
            <div key={r.id} className="rounded-md px-3 py-2 flex items-start gap-2"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="text-[10px] font-bold tracking-widest px-1.5 py-0.5 rounded"
                style={{ background: "rgba(184,138,60,0.15)", color: "#D6B47E", fontFamily: fonts.mono }}>
                {r.id}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-200 font-medium" style={{ fontFamily: fonts.sans }}>
                  {isAr ? r.descriptionAr : r.description}
                </p>
                <p className="text-[10px] text-gray-500" style={{ fontFamily: fonts.mono }}>
                  {r.category} · contrib {Math.round(r.contribution * 100)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Tab 6: Cases ──────────────────────────────────────────────────────────

const CASE_STATUS_COLOR: Record<Case["status"], string> = {
  DRAFT: "#6B7280",
  OPEN: "#4A7AA8",
  INVESTIGATING: "#D6B47E",
  PENDING_REVIEW: "#C98A1B",
  CLOSED: "#4A8E3A",
};

const CasesTab = ({ subject, isAr }: { subject: ScoredRecord; isAr: boolean }) => {
  const fonts = useBrandFonts();
  const navigate = useNavigate();
  const cases = CASES.filter((c) => c.subjectTravelerId === subject.id);

  if (cases.length === 0) {
    return (
      <div className="rounded-xl border p-12 text-center"
        style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.15)" }}>
        <i className="ri-folder-shield-2-line text-5xl text-gray-600" />
        <p className="text-gray-400 mt-3" style={{ fontFamily: fonts.sans }}>
          {isAr ? "لا توجد قضايا مفتوحة لهذا الشخص" : "No cases linked to this subject"}
        </p>
        <button
          onClick={() => navigate("/dashboard/case-management")}
          className="mt-4 px-4 py-2 rounded-lg text-xs cursor-pointer"
          style={{ background: "#D6B47E", color: "#051428", fontFamily: fonts.sans }}
        >
          {isAr ? "فتح إدارة القضايا" : "Open Case Management"}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border"
      style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.15)" }}>
      <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <h3 className="text-white text-sm font-bold" style={{ fontFamily: fonts.sans }}>
          {isAr ? "القضايا المرتبطة" : "Linked cases"}
          <span className="ml-2 text-[10px] tracking-widest text-gray-500" style={{ fontFamily: fonts.mono }}>
            {cases.length}
          </span>
        </h3>
      </div>
      <ul>
        {cases.map((c) => (
          <li key={c.id}>
            <button
              onClick={() => navigate(`/dashboard/case-management?id=${c.id}`)}
              className="w-full flex items-start gap-3 px-5 py-3 text-left border-b cursor-pointer hover:bg-white/5 transition-colors"
              style={{ borderColor: "rgba(255,255,255,0.04)" }}
            >
              <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest"
                style={{ background: `${CASE_STATUS_COLOR[c.status]}22`, color: CASE_STATUS_COLOR[c.status], border: `1px solid ${CASE_STATUS_COLOR[c.status]}55`, fontFamily: fonts.mono }}>
                {c.status}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-bold" style={{ fontFamily: fonts.sans }}>{c.title}</p>
                <p className="text-[11px] text-gray-500 mt-0.5" style={{ fontFamily: fonts.mono }}>
                  {c.id} · {isAr ? "الخطورة" : "Severity"}: {c.severity} · {isAr ? "المالك" : "Owner"}: {c.ownerName} · {isAr ? "آخر نشاط" : "Last activity"} {c.lastActivityAt.slice(0, 10)}
                </p>
              </div>
              <ClassificationPill classification={c.classification} isAr={isAr} />
              <i className="ri-arrow-right-line text-gray-500" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ── Page shell ────────────────────────────────────────────────────────────

const Person360Page = () => {
  const { isAr } = useOutletContext<DashboardOutletContext>();
  const fonts = useBrandFonts();
  const subjects = SCORED_RECORDS.slice(0, 3);
  const [subjectId, setSubjectId] = useState<string>(subjects[0].id);
  const [tab, setTab] = useState<TabKey>("identity");
  const subject = subjects.find((s) => s.id === subjectId) ?? subjects[0];

  const tabs: { key: TabKey; labelEn: string; labelAr: string; icon: string }[] = [
    { key: "identity",      labelEn: "Identity",      labelAr: "الهوية",        icon: "ri-id-card-line" },
    { key: "movements",     labelEn: "Movements",     labelAr: "الحركات",       icon: "ri-route-line" },
    { key: "relationships", labelEn: "Relationships", labelAr: "العلاقات",      icon: "ri-share-line" },
    { key: "activity",      labelEn: "Activity",      labelAr: "النشاط",        icon: "ri-pulse-line" },
    { key: "risk",          labelEn: "Risk",          labelAr: "المخاطر",       icon: "ri-shield-cross-line" },
    { key: "cases",         labelEn: "Cases",         labelAr: "القضايا",       icon: "ri-folder-shield-2-line" },
  ];

  return (
    <div className="p-5 min-h-full" style={{ background: "var(--alm-ocean-800, #0A2540)" }}>
      <SubjectHeader subject={subject} isAr={isAr} all={subjects} onSelect={setSubjectId} />

      {/* Tab bar */}
      <div className="flex items-center gap-1 p-1 rounded-xl mb-4"
        style={{ background: "rgba(10,37,64,0.65)", border: "1px solid rgba(184,138,60,0.1)" }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm cursor-pointer transition-all"
            style={{
              background: tab === t.key ? "rgba(184,138,60,0.12)" : "transparent",
              color: tab === t.key ? "#D6B47E" : "#9CA3AF",
              border: `1px solid ${tab === t.key ? "rgba(184,138,60,0.25)" : "transparent"}`,
              fontFamily: fonts.sans,
              fontWeight: tab === t.key ? 700 : 500,
            }}
          >
            <i className={t.icon} />
            {isAr ? t.labelAr : t.labelEn}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === "identity"      && <IdentityTab     subject={subject} isAr={isAr} />}
      {tab === "movements"     && <MovementsTab    subject={subject} isAr={isAr} />}
      {tab === "relationships" && <RelationshipsTab subject={subject} isAr={isAr} />}
      {tab === "activity"      && <ActivityTab     subject={subject} isAr={isAr} />}
      {tab === "risk"          && <RiskTab         subject={subject} isAr={isAr} />}
      {tab === "cases"         && <CasesTab        subject={subject} isAr={isAr} />}
    </div>
  );
};

export default Person360Page;
