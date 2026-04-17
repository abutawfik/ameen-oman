// Audit Log Viewer — Wave 1 · Deliverable 3
// Tamper-evident view of model + operator activity (Tech Spec §9).
// Renders inside DashboardLayout's <Outlet /> — no sidebar/titlebar of its own.

import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContext } from "../DashboardLayout";
import {
  AUDIT_LOG,
  CLASSIFICATION_META,
  type AuditEntry,
  type Classification,
} from "@/mocks/osintData";
import {
  useClearance,
  REDACTED_GLYPH,
  CLEARANCE_AUDIT_EVENT,
  CLEARANCE_CHANGE_LOG,
} from "@/brand/clearance";

// ── Meta maps (event type + role) ──────────────────────────────────────────
type EventType = AuditEntry["eventType"];
type Role = AuditEntry["actor"]["role"];
type TimeRange = "24h" | "7d" | "30d" | "custom";

const EVENT_META: Record<EventType, { labelEn: string; labelAr: string; color: string; icon: string }> = {
  score_computed:      { labelEn: "Score computed",      labelAr: "حساب الدرجة",        color: "#6B4FAE", icon: "ri-calculator-line" },
  rule_fired:          { labelEn: "Rule fired",          labelAr: "إطلاق قاعدة",        color: "#D6B47E", icon: "ri-flashlight-line" },
  source_ingested:     { labelEn: "Source ingested",     labelAr: "استيعاب مصدر",       color: "#4ADE80", icon: "ri-download-2-line" },
  source_failed:       { labelEn: "Source failed",       labelAr: "فشل المصدر",          color: "#C94A5E", icon: "ri-error-warning-line" },
  classified_accessed: { labelEn: "Classified accessed", labelAr: "وصول مصنّف",          color: "#8A1F3C", icon: "ri-shield-keyhole-line" },
  weight_changed:      { labelEn: "Weight changed",      labelAr: "تغيير الوزن",         color: "#C98A1B", icon: "ri-equalizer-line" },
  rule_toggled:        { labelEn: "Rule toggled",        labelAr: "تبديل قاعدة",         color: "#F59E0B", icon: "ri-toggle-line" },
  rollback_triggered:  { labelEn: "Rollback triggered",  labelAr: "تشغيل تراجع",         color: "#C94A5E", icon: "ri-arrow-go-back-line" },
  clearance_changed:   { labelEn: "Clearance changed",   labelAr: "تغيير التصريح",       color: "#D6B47E", icon: "ri-shield-user-line" },
};

const ROLE_META: Record<Role, { labelEn: string; labelAr: string; color: string }> = {
  analyst:    { labelEn: "Analyst",    labelAr: "محلّل",   color: "#4ADE80" },
  supervisor: { labelEn: "Supervisor", labelAr: "مشرف",    color: "#D6B47E" },
  manager:    { labelEn: "Manager",    labelAr: "مدير",    color: "#6B4FAE" },
  admin:      { labelEn: "Admin",      labelAr: "مسؤول",   color: "#C98A1B" },
  system:     { labelEn: "System",     labelAr: "النظام",  color: "#6B7280" },
};

// Classification pill — mirrors CLASSIFICATION_META shape used elsewhere.
const ClassificationPill = ({ classification, isAr }: { classification: Classification; isAr: boolean }) => {
  const meta = CLASSIFICATION_META[classification];
  return (
    <span className="rounded-md font-bold tracking-widest font-['JetBrains_Mono'] inline-flex items-center px-1.5 py-0.5"
      style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.color}44`, fontSize: 10 }}>
      {isAr ? meta.labelAr : meta.label}
    </span>
  );
};

const PAGE_SIZE = 12;

const AuditLogPage = () => {
  const { isAr } = useOutletContext<DashboardOutletContext>();
  const { canView } = useClearance();
  const now = Date.now();
  // Wave 3 · D5 — classified_accessed rows hide their target_id unless
  // the viewer has CLASSIFIED clearance. Everything else renders normally.
  const redactTarget = (entry: AuditEntry): string => {
    if (entry.eventType === "classified_accessed" && !canView("classified")) return REDACTED_GLYPH;
    return entry.targetId;
  };

  const [actorFilter, setActorFilter]   = useState<string>("all");
  const [eventFilter, setEventFilter]   = useState<EventType | "all">("all");
  const [timeRange,   setTimeRange]     = useState<TimeRange>("24h");
  const [classFilter, setClassFilter]   = useState<Classification | "all">("all");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<AuditEntry | null>(null);

  // Wave 4 · D3 — in-memory runtime entries merged on top of AUDIT_LOG.
  // Seeded from the module-level clearance log so entries persist across
  // page navigations within the same session.
  const [runtimeEntries, setRuntimeEntries] = useState<AuditEntry[]>(() => [...CLEARANCE_CHANGE_LOG]);

  useEffect(() => {
    const handler = (evt: Event) => {
      const ce = evt as CustomEvent<AuditEntry>;
      if (!ce.detail) return;
      setRuntimeEntries((prev) => {
        // De-dupe by id so a replayed event can't balloon the list.
        if (prev.some((e) => e.id === ce.detail.id)) return prev;
        return [ce.detail, ...prev];
      });
    };
    window.addEventListener(CLEARANCE_AUDIT_EVENT, handler as EventListener);
    return () => window.removeEventListener(CLEARANCE_AUDIT_EVENT, handler as EventListener);
  }, []);

  // Merge seeded + runtime entries. Runtime entries sort naturally on top
  // because they were pushed with fresher timestamps.
  const combined = useMemo(
    () => [...runtimeEntries, ...AUDIT_LOG],
    [runtimeEntries],
  );

  // Unique actors for the actor filter dropdown — includes runtime actors.
  const actors = useMemo(() => {
    const map = new Map<string, { id: string; name: string; role: Role }>();
    combined.forEach((e) => { map.set(e.actor.id, e.actor); });
    return Array.from(map.values());
  }, [combined]);

  const filtered = useMemo(() => {
    const cutoffHours = timeRange === "24h" ? 24 : timeRange === "7d" ? 24 * 7 : 24 * 30;
    const cutoff = now - cutoffHours * 3_600_000;
    return combined.filter((e) => {
      if (actorFilter !== "all" && e.actor.id !== actorFilter) return false;
      if (eventFilter !== "all" && e.eventType !== eventFilter) return false;
      if (classFilter !== "all" && e.classification !== classFilter) return false;
      if (timeRange !== "custom") {
        if (new Date(e.occurredAt).getTime() < cutoff) return false;
      }
      return true;
    });
  }, [combined, actorFilter, eventFilter, classFilter, timeRange, now]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const CRITICAL_EVENT: EventType = "classified_accessed";

  const reset = () => {
    setActorFilter("all"); setEventFilter("all"); setClassFilter("all"); setTimeRange("24h"); setPage(0);
  };

  return (
    <div className="flex flex-col h-full" style={{ background: "#051428" }}>
      {/* Grid texture */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "linear-gradient(rgba(184,138,60,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(184,138,60,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Classification banner */}
        <div className="w-full py-1.5 px-6 flex items-center justify-between relative z-10"
          style={{ background: "#7F1D1D", borderBottom: "1px solid rgba(201,74,94,0.4)" }}>
          <div className="flex items-center gap-3">
            <i className="ri-shield-keyhole-line text-red-300 text-sm" />
            <span className="text-white text-xs font-bold tracking-widest uppercase font-['JetBrains_Mono']">
              {isAr ? "سجل تدقيق — لا يمكن التعديل" : "TAMPER-EVIDENT AUDIT LOG"}
            </span>
          </div>
          <span className="text-red-300 text-xs font-['JetBrains_Mono'] opacity-70">
            SITA-BORDERS-AUDIT-2026
          </span>
        </div>

        {/* Page header */}
        <div className="flex-shrink-0 px-6 pt-5 pb-4 border-b"
          style={{ borderColor: "rgba(184,138,60,0.08)" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-9 h-9 flex items-center justify-center rounded-xl"
                  style={{ background: "rgba(184,138,60,0.15)" }}>
                  <i className="ri-archive-line text-base" style={{ color: "#D6B47E" }} />
                </div>
                <h1 className="text-white font-black font-['Inter'] text-xl tracking-tight">
                  {isAr ? "سجل التدقيق" : "Audit Log"}
                </h1>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-['JetBrains_Mono'] tracking-widest"
                  style={{ background: "rgba(184,138,60,0.12)", color: "#D6B47E", border: "1px solid rgba(184,138,60,0.3)" }}>
                  {combined.length} {isAr ? "سجلات" : "ENTRIES"}
                </span>
              </div>
              <p className="text-gray-400 text-sm font-['Inter'] ml-12">
                {isAr
                  ? "سجل غير قابل للتلاعب لكل حساب درجة، وتفعيل قاعدة، ودخول إلى بيانات مصنّفة"
                  : "Tamper-evident record of every score, rule fire, and classified-data access"}
              </p>
            </div>
          </div>

          {/* Filter bar */}
          <div data-narrate-id="audit-filters" className="flex flex-wrap items-center gap-2">
            {/* Actor */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold tracking-widest uppercase font-['JetBrains_Mono'] text-gray-500">
                {isAr ? "المنفّذ" : "Actor"}
              </span>
              <select value={actorFilter} onChange={(e) => { setActorFilter(e.target.value); setPage(0); }}
                className="px-2 py-1 rounded-md text-xs font-['Inter'] cursor-pointer"
                style={{ background: "rgba(10,37,64,0.85)", border: "1px solid rgba(255,255,255,0.1)", color: "#9CA3AF" }}>
                <option value="all">{isAr ? "الكل" : "All"}</option>
                {actors.map((a) => (
                  <option key={a.id} value={a.id}>{a.name} · {a.role}</option>
                ))}
              </select>
            </div>
            {/* Event */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold tracking-widest uppercase font-['JetBrains_Mono'] text-gray-500">
                {isAr ? "الحدث" : "Event"}
              </span>
              <select value={eventFilter} onChange={(e) => { setEventFilter(e.target.value as EventType | "all"); setPage(0); }}
                className="px-2 py-1 rounded-md text-xs font-['Inter'] cursor-pointer"
                style={{ background: "rgba(10,37,64,0.85)", border: "1px solid rgba(255,255,255,0.1)", color: "#9CA3AF" }}>
                <option value="all">{isAr ? "الكل" : "All"}</option>
                {(Object.keys(EVENT_META) as EventType[]).map((k) => (
                  <option key={k} value={k}>{isAr ? EVENT_META[k].labelAr : EVENT_META[k].labelEn}</option>
                ))}
              </select>
            </div>
            {/* Time range */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold tracking-widest uppercase font-['JetBrains_Mono'] text-gray-500 mr-1">
                {isAr ? "النطاق" : "Range"}
              </span>
              {(["24h", "7d", "30d", "custom"] as TimeRange[]).map((r) => {
                const active = timeRange === r;
                return (
                  <button key={r} onClick={() => { setTimeRange(r); setPage(0); }}
                    className="px-2 py-1 rounded-md text-[11px] font-bold font-['JetBrains_Mono'] tracking-widest cursor-pointer"
                    style={{
                      background: active ? "rgba(184,138,60,0.18)" : "transparent",
                      color: active ? "#D6B47E" : "#6B7280",
                      border: active ? "1px solid #D6B47E55" : "1px solid rgba(255,255,255,0.1)",
                    }}>
                    {r.toUpperCase()}
                  </button>
                );
              })}
            </div>
            {/* Classification */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold tracking-widest uppercase font-['JetBrains_Mono'] text-gray-500 mr-1">
                {isAr ? "التصنيف" : "Class"}
              </span>
              {(["all", "public", "internal", "restricted", "classified"] as const).map((c) => {
                const active = classFilter === c;
                const color = c === "all" ? "#D6B47E" : CLASSIFICATION_META[c].color;
                const label = c === "all" ? (isAr ? "الكل" : "All") : (isAr ? CLASSIFICATION_META[c].labelAr : CLASSIFICATION_META[c].label);
                return (
                  <button key={c} onClick={() => { setClassFilter(c); setPage(0); }}
                    className="px-2 py-1 rounded-md text-[11px] font-bold font-['JetBrains_Mono'] tracking-widest cursor-pointer"
                    style={{
                      background: active ? `${color}22` : "transparent",
                      color: active ? color : "#6B7280",
                      border: active ? `1px solid ${color}55` : "1px solid rgba(255,255,255,0.1)",
                    }}>
                    {label}
                  </button>
                );
              })}
            </div>
            <button onClick={reset}
              className="ml-auto px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#9CA3AF" }}>
              <i className="ri-restart-line mr-1" />
              {isAr ? "إعادة التعيين" : "Reset"}
            </button>
            {/* Compliance export — feeds the Reports suite Compliance Summary template. */}
            <button data-narrate-id="audit-export"
              type="button"
              onClick={() => {
                try {
                  const csv = ["id,occurredAt,actor,role,eventType,classification,targetId"]
                    .concat(filtered.map((e) => [
                      e.id, e.occurredAt, e.actor.name, e.actor.role, e.eventType, e.classification, redactTarget(e),
                    ].join(",")))
                    .join("\n");
                  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "audit-log.csv";
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                } catch { /* noop */ }
              }}
              className="px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer"
              style={{ background: "rgba(184,138,60,0.12)", color: "#D6B47E", border: "1px solid #D6B47E55", fontFamily: "'JetBrains Mono', monospace" }}>
              <i className="ri-file-download-line mr-1" />
              {isAr ? "تصدير CSV" : "EXPORT CSV"}
            </button>
            <span className="text-gray-500 text-xs font-['JetBrains_Mono']">
              {filtered.length} {isAr ? "سجلات" : "entries"}
            </span>
          </div>
        </div>

        {/* Results table */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="rounded-xl border overflow-hidden"
            style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
            {/* Header row */}
            <div className="grid grid-cols-12 gap-2 px-4 py-2.5 border-b text-[10px] font-bold tracking-widest uppercase font-['JetBrains_Mono']"
              style={{ borderColor: "rgba(184,138,60,0.08)", color: "#6B7280" }}>
              <div className="col-span-2">{isAr ? "التوقيت" : "Timestamp"}</div>
              <div className="col-span-2">{isAr ? "المنفّذ" : "Actor"}</div>
              <div className="col-span-2">{isAr ? "الحدث" : "Event"}</div>
              <div className="col-span-1">{isAr ? "التصنيف" : "Class"}</div>
              <div className="col-span-2">{isAr ? "الهدف" : "Target"}</div>
              <div className="col-span-3">{isAr ? "التفاصيل" : "Details"}</div>
            </div>

            {pageRows.map((e, rowIdx) => {
              const ev = EVENT_META[e.eventType];
              const role = ROLE_META[e.actor.role];
              const critical = e.eventType === CRITICAL_EVENT;
              const clearanceEvent = e.eventType === "clearance_changed";
              const ts = new Date(e.occurredAt);
              const tsStr = `${ts.toISOString().slice(0, 10)} ${ts.toISOString().slice(11, 19)}Z`;
              // Brass left-border for clearance cycles (lower-severity than the
              // critical red reserved for classified_accessed).
              const leftBorder = critical
                ? "3px solid #C94A5E"
                : clearanceEvent
                  ? "3px solid #D6B47E"
                  : "3px solid transparent";
              const rowBg = critical
                ? "rgba(201,74,94,0.04)"
                : clearanceEvent
                  ? "rgba(184,138,60,0.04)"
                  : "transparent";
              return (
                <button key={e.id}
                  data-narrate-id={rowIdx === 0 ? "audit-first-row" : undefined}
                  onClick={() => setSelected(e)}
                  className="w-full grid grid-cols-12 gap-2 px-4 py-2.5 border-b text-left cursor-pointer transition-colors hover:bg-white/[0.03]"
                  style={{
                    borderColor: "rgba(184,138,60,0.05)",
                    borderLeft: leftBorder,
                    background: rowBg,
                  }}>
                  <div className="col-span-2 text-gray-400 text-[11px] font-['JetBrains_Mono'] truncate">{tsStr}</div>
                  <div className="col-span-2 flex flex-col min-w-0">
                    <span className="text-gray-300 text-xs truncate">{e.actor.name}</span>
                    <span className="text-[10px] font-['JetBrains_Mono']" style={{ color: role.color }}>
                      {isAr ? role.labelAr : role.labelEn}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center gap-2 min-w-0">
                    <i className={`${ev.icon} text-base flex-shrink-0`} style={{ color: ev.color }} />
                    <span className="text-xs font-['JetBrains_Mono'] truncate" style={{ color: ev.color }}>
                      {isAr ? ev.labelAr : ev.labelEn}
                    </span>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <ClassificationPill classification={e.classification} isAr={isAr} />
                  </div>
                  <div className="col-span-2 text-gray-300 text-[11px] font-['JetBrains_Mono'] truncate">
                    {(() => {
                      const val = redactTarget(e);
                      const hidden = val === REDACTED_GLYPH;
                      return (
                        <span
                          style={{ color: hidden ? "#6B7280" : undefined, letterSpacing: hidden ? "0.05em" : undefined }}
                          title={hidden ? (isAr ? "مُخفى · يتطلب صلاحية سرّي" : "Redacted · CLASSIFIED clearance required") : undefined}
                        >
                          {val}
                        </span>
                      );
                    })()}
                  </div>
                  <div className="col-span-3 text-gray-500 text-[11px] font-['JetBrains_Mono'] truncate">
                    {Object.entries(e.details).slice(0, 2).map(([k, v], i, arr) => (
                      <span key={k}>
                        <span className="text-gray-600">{k}</span>
                        <span className="text-gray-700">:</span>
                        <span className="text-gray-400 ml-0.5">{typeof v === "object" ? JSON.stringify(v) : String(v)}</span>
                        {i < arr.length - 1 && <span className="text-gray-700 mx-1">·</span>}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
            {pageRows.length === 0 && (
              <div className="py-10 text-center text-gray-500 text-sm">
                {isAr ? "لا توجد سجلات تطابق المرشحات" : "No entries match current filters"}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
                className="px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer disabled:opacity-40"
                style={{ background: "rgba(10,37,64,0.85)", border: "1px solid rgba(255,255,255,0.1)", color: "#9CA3AF" }}>
                <i className="ri-arrow-left-s-line" /> {isAr ? "السابق" : "Prev"}
              </button>
              <span className="text-[11px] font-['JetBrains_Mono'] text-gray-500 tracking-widest">
                {isAr ? `${page + 1} من ${totalPages}` : `${page + 1} / ${totalPages}`}
              </span>
              <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                className="px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer disabled:opacity-40"
                style={{ background: "rgba(10,37,64,0.85)", border: "1px solid rgba(255,255,255,0.1)", color: "#9CA3AF" }}>
                {isAr ? "التالي" : "Next"} <i className="ri-arrow-right-s-line" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Side drawer — full JSON payload */}
      {selected && (
        <div className="fixed inset-0 z-50 flex" onClick={() => setSelected(null)}>
          <div className="flex-1 bg-black/50" />
          <div className="w-full max-w-xl h-full overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ background: "#0A2540", borderLeft: "1px solid rgba(184,138,60,0.3)" }}>
            <div className="sticky top-0 flex items-center justify-between px-5 py-3 border-b z-10"
              style={{ background: "#0A2540", borderColor: "rgba(184,138,60,0.2)" }}>
              <div className="flex items-center gap-2">
                <i className={`${EVENT_META[selected.eventType].icon} text-lg`} style={{ color: EVENT_META[selected.eventType].color }} />
                <h3 className="text-white text-sm font-bold">
                  {isAr ? EVENT_META[selected.eventType].labelAr : EVENT_META[selected.eventType].labelEn}
                </h3>
                <ClassificationPill classification={selected.classification} isAr={isAr} />
              </div>
              <button onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-white cursor-pointer p-1">
                <i className="ri-close-line text-xl" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-md p-2" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[9px] tracking-widest text-gray-600 font-['JetBrains_Mono']">{isAr ? "المعرف" : "ID"}</div>
                  <div className="text-gray-200 font-['JetBrains_Mono']">{selected.id}</div>
                </div>
                <div className="rounded-md p-2" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[9px] tracking-widest text-gray-600 font-['JetBrains_Mono']">{isAr ? "التوقيت" : "OCCURRED"}</div>
                  <div className="text-gray-200 font-['JetBrains_Mono']">{selected.occurredAt}</div>
                </div>
                <div className="rounded-md p-2" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[9px] tracking-widest text-gray-600 font-['JetBrains_Mono']">{isAr ? "المنفّذ" : "ACTOR"}</div>
                  <div className="text-gray-200">{selected.actor.name}</div>
                  <div className="text-[10px] font-['JetBrains_Mono']" style={{ color: ROLE_META[selected.actor.role].color }}>
                    {selected.actor.id} · {isAr ? ROLE_META[selected.actor.role].labelAr : ROLE_META[selected.actor.role].labelEn}
                  </div>
                </div>
                <div className="rounded-md p-2" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="text-[9px] tracking-widest text-gray-600 font-['JetBrains_Mono']">{isAr ? "الهدف" : "TARGET"}</div>
                  <div className="text-gray-200 font-['JetBrains_Mono']">
                    {redactTarget(selected)}
                    {redactTarget(selected) === REDACTED_GLYPH && (
                      <span className="ml-2 text-[9px] text-gray-500 tracking-widest">
                        <i className="ri-lock-line mr-0.5" />
                        {isAr ? "يتطلب سرّي" : "REQUIRES CLASSIFIED"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[10px] tracking-widest font-bold text-gray-500 font-['JetBrains_Mono'] mb-2">
                  {isAr ? "الحمولة الكاملة" : "FULL JSON PAYLOAD"}
                </div>
                <pre className="rounded-md p-3 text-[11px] font-['JetBrains_Mono'] overflow-auto leading-relaxed"
                  style={{ background: "#051428", border: "1px solid rgba(184,138,60,0.15)", color: "#D6B47E" }}>
{JSON.stringify(selected, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogPage;
