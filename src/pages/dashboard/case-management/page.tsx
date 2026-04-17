// Case Management — Wave 2 · Deliverable 2
// Full lifecycle: DRAFT → OPEN → INVESTIGATING → PENDING_REVIEW → CLOSED + disposition.
// Query param: ?id=CASE-XYZ pre-selects.
// Renders inside DashboardLayout's <Outlet />.

import { useEffect, useMemo, useRef, useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import type { DashboardOutletContext } from "../DashboardLayout";
import { useBrandFonts } from "@/brand/typography";
import useFocusTrap from "@/components/FocusTrap";
import {
  CASES,
  CLASSIFICATION_META,
  type Case,
  type CaseDisposition,
  type CaseNote,
  type CaseStatus,
  type Classification,
} from "@/mocks/osintData";

const STATUS_META: Record<CaseStatus, { labelEn: string; labelAr: string; color: string }> = {
  DRAFT:           { labelEn: "Draft",           labelAr: "مسودة",            color: "#6B7280" },
  OPEN:            { labelEn: "Open",            labelAr: "مفتوحة",          color: "#4A7AA8" },
  INVESTIGATING:   { labelEn: "Investigating",   labelAr: "قيد التحقيق",      color: "#D6B47E" },
  PENDING_REVIEW:  { labelEn: "Pending review",  labelAr: "قيد المراجعة",    color: "#C98A1B" },
  CLOSED:          { labelEn: "Closed",          labelAr: "مغلقة",           color: "#4A8E3A" },
};

const SEVERITY_META: Record<Case["severity"], { color: string; labelEn: string; labelAr: string }> = {
  CRITICAL: { color: "#8A1F3C", labelEn: "Critical", labelAr: "حرج" },
  HIGH:     { color: "#C94A5E", labelEn: "High",     labelAr: "مرتفع" },
  MEDIUM:   { color: "#C98A1B", labelEn: "Medium",   labelAr: "متوسط" },
  LOW:      { color: "#4A8E3A", labelEn: "Low",      labelAr: "منخفض" },
};

const DISPOSITION_META: Record<CaseDisposition, { labelEn: string; labelAr: string }> = {
  CONFIRMED_THREAT:      { labelEn: "Confirmed threat",       labelAr: "تهديد مؤكد" },
  FALSE_POSITIVE:        { labelEn: "False positive",         labelAr: "نتيجة إيجابية خاطئة" },
  INSUFFICIENT_EVIDENCE: { labelEn: "Insufficient evidence",  labelAr: "أدلة غير كافية" },
  TRANSFERRED:           { labelEn: "Transferred",            labelAr: "نُقلت" },
};

const ClassificationPill = ({ classification, isAr }: { classification: Classification; isAr: boolean }) => {
  const meta = CLASSIFICATION_META[classification];
  return (
    <span className="rounded-md font-bold tracking-widest inline-flex items-center px-1.5 py-0.5"
      style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.color}44`, fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>
      {isAr ? meta.labelAr : meta.label}
    </span>
  );
};

type StatusFilter = CaseStatus | "ALL";
type SeverityFilter = Case["severity"] | "ALL";

const statusFilters: StatusFilter[] = ["ALL", "DRAFT", "OPEN", "INVESTIGATING", "PENDING_REVIEW", "CLOSED"];

const fmtAgo = (iso: string, isAr: boolean): string => {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return isAr ? `منذ ${mins} د` : `${mins}m ago`;
  const h = Math.floor(mins / 60);
  if (h < 24) return isAr ? `منذ ${h} س` : `${h}h ago`;
  const d = Math.floor(h / 24);
  return isAr ? `منذ ${d} ي` : `${d}d ago`;
};

const CaseManagementPage = () => {
  const { isAr } = useOutletContext<DashboardOutletContext>();
  const fonts = useBrandFonts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [cases, setCases] = useState<Case[]>(CASES);
  const [statusTab, setStatusTab] = useState<StatusFilter>("ALL");
  const [sevFilter, setSevFilter] = useState<SeverityFilter>("ALL");
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<string>(searchParams.get("id") ?? cases[0].id);

  const [showDispositionModal, setShowDispositionModal] = useState(false);
  const [dispReason, setDispReason] = useState("");
  const [dispChoice, setDispChoice] = useState<CaseDisposition>("CONFIRMED_THREAT");
  const [dispSeverity, setDispSeverity] = useState<Case["severity"]>("HIGH");
  const [toast, setToast] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const dispModalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dispModalRef, showDispositionModal, {
    onEscape: () => setShowDispositionModal(false),
  });

  // Query param sync
  useEffect(() => {
    const q = searchParams.get("id");
    if (q && cases.some((c) => c.id === q)) setActiveId(q);
  }, [searchParams, cases]);

  const active = cases.find((c) => c.id === activeId) ?? cases[0];

  const countsByStatus = useMemo(() => {
    const map: Record<string, number> = { ALL: cases.length };
    statusFilters.forEach((s) => {
      if (s !== "ALL") map[s] = cases.filter((c) => c.status === s).length;
    });
    return map;
  }, [cases]);

  const filtered = useMemo(() => cases.filter((c) => {
    if (statusTab !== "ALL" && c.status !== statusTab) return false;
    if (sevFilter !== "ALL" && c.severity !== sevFilter) return false;
    if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.subjectName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [cases, statusTab, sevFilter, search]);

  const advance = (next: CaseStatus) => {
    setCases((prev) => prev.map((c) => c.id === active.id ? { ...c, status: next, lastActivityAt: new Date().toISOString() } : c));
    setToast(isAr ? `تم نقل القضية إلى ${STATUS_META[next].labelAr}` : `Case moved to ${STATUS_META[next].labelEn}`);
    setTimeout(() => setToast(null), 2200);
  };

  const reopen = () => {
    setCases((prev) => prev.map((c) => c.id === active.id ? { ...c, status: "INVESTIGATING", disposition: undefined, dispositionReason: undefined, closedAt: undefined, lastActivityAt: new Date().toISOString() } : c));
    setToast(isAr ? "أُعيد فتح القضية" : "Case reopened");
    setTimeout(() => setToast(null), 2200);
  };

  const closeWithDisposition = () => {
    if (!dispReason.trim()) return;
    const now = new Date().toISOString();
    setCases((prev) => prev.map((c) => c.id === active.id ? {
      ...c,
      status: "CLOSED",
      severity: dispSeverity,
      disposition: dispChoice,
      dispositionReason: dispReason.trim(),
      closedAt: now,
      lastActivityAt: now,
    } : c));
    setShowDispositionModal(false);
    setDispReason("");
    setToast(isAr ? "تم تسجيل النتيجة المُعنونة — تُغذّي تدريب v0.3.2" : "Labelled outcome recorded — feeds v0.3.2 retraining");
    setTimeout(() => setToast(null), 3400);
  };

  const addNote = () => {
    if (!noteDraft.trim()) return;
    const n: CaseNote = {
      id: `n-${Date.now()}`,
      authorId: "current-user",
      authorName: "You",
      createdAt: new Date().toISOString(),
      body: noteDraft.trim(),
    };
    setCases((prev) => prev.map((c) => c.id === active.id ? { ...c, notes: [...c.notes, n], lastActivityAt: n.createdAt } : c));
    setNoteDraft("");
  };

  const selectCase = (id: string) => {
    setActiveId(id);
    const sp = new URLSearchParams(searchParams);
    sp.set("id", id);
    setSearchParams(sp, { replace: true });
  };

  const closedReadonly = active.status === "CLOSED";

  // Primary action button for current status
  const primaryAction = (() => {
    switch (active.status) {
      case "DRAFT":          return { label: isAr ? "فتح القضية" : "Open case",                onClick: () => advance("OPEN") };
      case "OPEN":           return { label: isAr ? "بدء التحقيق" : "Start Investigating",      onClick: () => advance("INVESTIGATING") };
      case "INVESTIGATING":  return { label: isAr ? "إرسال للمراجعة" : "Submit for Review",     onClick: () => advance("PENDING_REVIEW") };
      case "PENDING_REVIEW": return { label: isAr ? "إغلاق بنتيجة" : "Close with disposition", onClick: () => { setDispSeverity(active.severity); setShowDispositionModal(true); } };
      case "CLOSED":         return { label: isAr ? "إعادة فتح" : "Reopen",                     onClick: reopen };
    }
  })();

  return (
    <div className="p-5 min-h-full" style={{ background: "var(--alm-ocean-800, #0A2540)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-white text-2xl font-bold" style={{ fontFamily: fonts.display }}>
            {isAr ? "إدارة القضايا" : "Case Management"}
          </h1>
          <p className="text-gray-500 text-xs mt-0.5" style={{ fontFamily: fonts.mono }}>
            {isAr ? "دورة حياة كاملة · تصرّف ملزم · تغذية تدريب" : "Full lifecycle · Dispositions · Feeds labelled training"}
          </p>
        </div>
        {toast && (
          <div
            role="status"
            aria-live="polite"
            className="rounded-lg px-4 py-2 flex items-center gap-2"
            style={{ background: "rgba(74,142,58,0.18)", border: "1px solid #4A8E3A66", fontFamily: fonts.sans }}
          >
            <i className="ri-check-line" style={{ color: "#4A8E3A" }} aria-hidden="true" />
            <span className="text-white text-xs">{toast}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Left: Case list */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-3">
          {/* Status tabs */}
          <div
            role="tablist"
            aria-label={isAr ? "تصفية القضايا بالحالة" : "Filter cases by status"}
            className="rounded-xl border p-2 flex flex-wrap gap-1"
            style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.15)" }}
          >
            {statusFilters.map((s) => {
              const active = statusTab === s;
              const color = s === "ALL" ? "#D6B47E" : STATUS_META[s as CaseStatus].color;
              const label = s === "ALL"
                ? (isAr ? "الكل" : "All")
                : (isAr ? STATUS_META[s as CaseStatus].labelAr : STATUS_META[s as CaseStatus].labelEn);
              return (
                <button
                  key={s}
                  role="tab"
                  aria-selected={active}
                  tabIndex={active ? 0 : -1}
                  onClick={() => setStatusTab(s)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] cursor-pointer"
                  style={{
                    background: active ? `${color}22` : "transparent",
                    color: active ? color : "#9CA3AF",
                    border: `1px solid ${active ? `${color}55` : "transparent"}`,
                    fontFamily: fonts.sans,
                    fontWeight: active ? 700 : 500,
                  }}
                >
                  {label}
                  <span className="px-1 rounded" style={{ background: "rgba(255,255,255,0.06)", fontFamily: fonts.mono }} aria-label={isAr ? `${countsByStatus[s]} قضية` : `${countsByStatus[s]} cases`}>
                    {countsByStatus[s]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Severity pills */}
          <div className="flex gap-2 flex-wrap">
            {(["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"] as SeverityFilter[]).map((s) => {
              const active = sevFilter === s;
              const color = s === "ALL" ? "#D6B47E" : SEVERITY_META[s as Case["severity"]].color;
              return (
                <button key={s} onClick={() => setSevFilter(s)}
                  className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold cursor-pointer"
                  style={{
                    background: active ? `${color}22` : "transparent",
                    color: active ? color : "#6B7280",
                    border: `1px solid ${active ? color : "rgba(255,255,255,0.08)"}`,
                    fontFamily: fonts.mono,
                  }}>
                  {s === "ALL" ? (isAr ? "الكل" : "All") : s[0]}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="rounded-lg flex items-center px-3 py-2"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <i className="ri-search-line text-gray-500" aria-hidden="true" />
            <label htmlFor="case-search" className="sr-only">
              {isAr ? "بحث في القضايا" : "Search cases"}
            </label>
            <input
              id="case-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isAr ? "بحث..." : "Search cases..."}
              className="flex-1 bg-transparent outline-none text-xs px-2 text-white"
              style={{ fontFamily: fonts.sans }}
              aria-label={isAr ? "بحث في القضايا" : "Search cases"}
            />
          </div>

          {/* Cards */}
          <div className="space-y-2 overflow-y-auto" style={{ maxHeight: "calc(100vh - 320px)" }}>
            {filtered.map((c) => {
              const isActive = c.id === active.id;
              const sev = SEVERITY_META[c.severity];
              const stat = STATUS_META[c.status];
              return (
                <button
                  key={c.id}
                  onClick={() => selectCase(c.id)}
                  className="w-full text-left rounded-lg p-3 flex flex-col gap-1.5 cursor-pointer transition-all"
                  style={{
                    background: isActive ? "var(--alm-ocean-600, #1a3558)" : "rgba(10,37,64,0.65)",
                    border: "1px solid",
                    borderColor: isActive ? "rgba(184,138,60,0.15)" : "rgba(184,138,60,0.1)",
                    borderLeftWidth: 4,
                    borderLeftColor: isActive ? "#D6B47E" : "transparent",
                    fontFamily: fonts.sans,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: sev.color, boxShadow: `0 0 6px ${sev.color}` }} />
                    <h3 className="text-white text-xs font-bold truncate flex-1">{c.title}</h3>
                    <span className="text-[9px] tracking-widest font-bold px-1.5 py-0.5 rounded"
                      style={{ background: `${stat.color}22`, color: stat.color, fontFamily: fonts.mono }}>
                      {c.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500" style={{ fontFamily: fonts.mono }}>
                    {c.id} · {c.subjectName} · {fmtAgo(c.openedAt, isAr)}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                      <i className="ri-user-line text-[10px]" /> {c.ownerName}
                    </span>
                    <ClassificationPill classification={c.classification} isAr={isAr} />
                  </div>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="text-center py-6 text-gray-500 text-xs" style={{ fontFamily: fonts.sans }}>
                {isAr ? "لا توجد قضايا مطابقة" : "No matching cases"}
              </div>
            )}
          </div>
        </div>

        {/* Right: Case detail */}
        <div className="col-span-12 lg:col-span-8 rounded-xl border flex flex-col"
          style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.15)" }}>
          {/* Header */}
          <div className="px-5 py-4 border-b flex items-start gap-3 flex-wrap" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-white text-lg font-bold" style={{ fontFamily: fonts.display }}>{active.title}</h2>
                <span className="px-2 py-0.5 rounded text-[10px] tracking-widest font-bold"
                  style={{ background: `${STATUS_META[active.status].color}22`, color: STATUS_META[active.status].color, border: `1px solid ${STATUS_META[active.status].color}55`, fontFamily: fonts.mono }}>
                  {isAr ? STATUS_META[active.status].labelAr : STATUS_META[active.status].labelEn}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] tracking-widest font-bold"
                  style={{ background: `${SEVERITY_META[active.severity].color}22`, color: SEVERITY_META[active.severity].color, fontFamily: fonts.mono }}>
                  {active.severity}
                </span>
                <ClassificationPill classification={active.classification} isAr={isAr} />
              </div>
              <p className="text-gray-400 text-sm mt-1" style={{ fontFamily: fonts.arabic, direction: "rtl", textAlign: "left" }}>
                {active.titleAr}
              </p>
              <p className="text-gray-500 text-[11px] mt-1" style={{ fontFamily: fonts.mono }}>
                {active.id} · {isAr ? "المالك" : "Owner"}: {active.ownerName} · {isAr ? "الموضوع" : "Subject"}: {active.subjectName} · {isAr ? "فُتحت" : "Opened"} {active.openedAt.slice(0, 10)}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              {primaryAction && (
                <button
                  onClick={primaryAction.onClick}
                  className="px-4 py-2 rounded-lg text-xs font-bold cursor-pointer"
                  style={{
                    background: active.status === "CLOSED" ? "transparent" : "#D6B47E",
                    color: active.status === "CLOSED" ? "#D6B47E" : "#051428",
                    border: active.status === "CLOSED" ? "1px solid #D6B47E66" : "none",
                    fontFamily: fonts.sans,
                  }}
                >
                  {primaryAction.label}
                </button>
              )}
            </div>
          </div>

          {/* Closed banner */}
          {closedReadonly && active.disposition && (
            <div className="px-5 py-3 border-b flex items-center gap-3"
              style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(74,142,58,0.08)" }}>
              <i className="ri-lock-line" style={{ color: "#4A8E3A" }} />
              <p className="text-white text-xs" style={{ fontFamily: fonts.sans }}>
                {isAr ? "القضية مغلقة بالنتيجة:" : "This case is closed with disposition:"}{" "}
                <span className="font-bold" style={{ color: "#4A8E3A" }}>
                  {isAr ? DISPOSITION_META[active.disposition].labelAr : DISPOSITION_META[active.disposition].labelEn}
                </span>
                . {isAr ? "أعد فتحها للتعديل." : "Reopen to edit."}
              </p>
            </div>
          )}

          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Linked entities panel */}
            {(() => {
              const sections: { title: string; titleAr: string; icon: string; items: string[]; color: string }[] = [
                { title: "Linked events",   titleAr: "الأحداث المرتبطة",  icon: "ri-calendar-event-line", items: active.linkedEvents,  color: "#4A7AA8" },
                { title: "Linked entities", titleAr: "الكيانات المرتبطة", icon: "ri-user-3-line",          items: [active.subjectName],  color: "#4A8E3A" },
                { title: "Linked signals",  titleAr: "الإشارات المرتبطة", icon: "ri-flashlight-line",      items: active.linkedSignals, color: "#D6B47E" },
                { title: "Linked scores",   titleAr: "الدرجات المرتبطة",  icon: "ri-shield-cross-line",     items: active.linkedScores,  color: "#C98A1B" },
              ];
              return sections.map((s) => (
                <div key={s.title} className="rounded-lg p-3"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <i className={s.icon} style={{ color: s.color }} />
                      <span className="text-[11px] font-bold tracking-widest" style={{ color: s.color, fontFamily: fonts.mono }}>
                        {isAr ? s.titleAr : s.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-bold" style={{ fontFamily: fonts.mono }}>
                      {s.items.length}
                    </span>
                  </div>
                  {s.items.length === 0 ? (
                    <p className="text-[10px] text-gray-600" style={{ fontFamily: fonts.sans }}>
                      {isAr ? "لا يوجد" : "None"}
                    </p>
                  ) : (
                    <ul className="space-y-1">
                      {s.items.slice(0, 4).map((it, i) => (
                        <li key={i} className="text-[11px] text-gray-300 truncate" style={{ fontFamily: fonts.mono }}>· {it}</li>
                      ))}
                      {s.items.length > 4 && (
                        <li className="text-[10px]" style={{ color: s.color, fontFamily: fonts.mono }}>
                          {isAr ? `عرض الكل (+${s.items.length - 4})` : `view all (+${s.items.length - 4})`}
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              ));
            })()}
          </div>

          {/* Disposition summary (closed) */}
          {closedReadonly && active.disposition && (
            <div className="mx-5 mb-5 rounded-lg p-4"
              style={{ background: "rgba(74,142,58,0.06)", border: "1px solid rgba(74,142,58,0.3)" }}>
              <span className="text-[10px] tracking-widest font-bold" style={{ color: "#4A8E3A", fontFamily: fonts.mono }}>
                {isAr ? "النتيجة" : "DISPOSITION"}
              </span>
              <h4 className="text-white text-sm font-bold mt-1" style={{ fontFamily: fonts.sans }}>
                {isAr ? DISPOSITION_META[active.disposition].labelAr : DISPOSITION_META[active.disposition].labelEn}
              </h4>
              {active.dispositionReason && (
                <p className="text-gray-300 text-xs mt-2" style={{ fontFamily: fonts.sans }}>
                  {active.dispositionReason}
                </p>
              )}
            </div>
          )}

          {/* Notes timeline */}
          <div className="mx-5 mb-5 rounded-lg flex-1"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="px-4 py-2 border-b flex items-center justify-between" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <h4 className="text-white text-sm font-bold" style={{ fontFamily: fonts.sans }}>
                {isAr ? "ملاحظات" : "Notes"}
                <span className="ml-2 text-[10px] text-gray-500 tracking-widest" style={{ fontFamily: fonts.mono }}>
                  {active.notes.length}
                </span>
              </h4>
              <span className="text-[10px] text-gray-500" style={{ fontFamily: fonts.mono }}>
                {isAr ? "الملاحظات ثابتة بعد الحفظ" : "Immutable after save"}
              </span>
            </div>
            <ul className="p-3 space-y-2 max-h-[280px] overflow-y-auto">
              {active.notes.length === 0 && (
                <p className="text-center py-4 text-gray-500 text-xs" style={{ fontFamily: fonts.sans }}>
                  {isAr ? "لا توجد ملاحظات بعد" : "No notes yet"}
                </p>
              )}
              {active.notes.map((n) => (
                <li key={n.id} className="rounded-md p-2.5" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="flex items-center gap-2 text-[10px] mb-1">
                    <span className="font-bold text-white" style={{ fontFamily: fonts.sans }}>{n.authorName}</span>
                    <span className="text-gray-500" style={{ fontFamily: fonts.mono }}>{n.createdAt.slice(0, 16).replace("T", " ")}</span>
                  </div>
                  <p className="text-xs text-gray-200 whitespace-pre-wrap" style={{ fontFamily: fonts.sans }}>{n.body}</p>
                </li>
              ))}
            </ul>
            {!closedReadonly && (
              <div className="p-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <textarea
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder={isAr ? "أضف ملاحظة..." : "Add note..."}
                  className="w-full bg-transparent outline-none text-xs text-white resize-none px-2 py-1.5 rounded"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: fonts.sans, minHeight: 60 }}
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] text-gray-500" style={{ fontFamily: fonts.mono }}>
                    {noteDraft.length} {isAr ? "حرف" : "chars"}
                  </span>
                  <button onClick={addNote} disabled={!noteDraft.trim()}
                    className="px-3 py-1.5 rounded-md text-[11px] font-bold cursor-pointer disabled:opacity-40"
                    style={{ background: "#D6B47E", color: "#051428", fontFamily: fonts.sans }}>
                    {isAr ? "حفظ الملاحظة" : "Save note"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Disposition modal */}
      {showDispositionModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(5,20,40,0.85)", backdropFilter: "blur(6px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowDispositionModal(false); }}
        >
          <div
            ref={dispModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="disp-modal-title"
            className="w-full max-w-md rounded-2xl p-6"
            style={{ background: "rgba(10,37,64,0.95)", border: "1px solid rgba(184,138,60,0.3)" }}
          >
            <h3 id="disp-modal-title" className="text-white text-lg font-bold mb-4" style={{ fontFamily: fonts.display }}>
              {isAr ? "إغلاق القضية بنتيجة" : "Close case with disposition"}
            </h3>

            <fieldset className="mb-4">
              <legend className="block text-[10px] tracking-widest text-gray-400 mb-1" style={{ fontFamily: fonts.mono }}>
                {isAr ? "تأكيد الخطورة" : "Confirm severity"}
              </legend>
              <div className="flex gap-2">
                {(["CRITICAL", "HIGH", "MEDIUM", "LOW"] as Case["severity"][]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setDispSeverity(s)}
                    aria-pressed={dispSeverity === s}
                    className="px-3 py-1 rounded text-[10px] font-bold cursor-pointer"
                    style={{
                      background: dispSeverity === s ? `${SEVERITY_META[s].color}22` : "transparent",
                      color: dispSeverity === s ? SEVERITY_META[s].color : "#9CA3AF",
                      border: `1px solid ${dispSeverity === s ? SEVERITY_META[s].color : "rgba(255,255,255,0.1)"}`,
                      fontFamily: fonts.mono,
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="mb-4">
              <legend className="block text-[10px] tracking-widest text-gray-400 mb-2" style={{ fontFamily: fonts.mono }}>
                {isAr ? "النتيجة" : "Disposition"}
              </legend>
              <div className="space-y-1.5">
                {(Object.keys(DISPOSITION_META) as CaseDisposition[]).map((d) => (
                  <label key={d} className="flex items-center gap-2 cursor-pointer text-sm text-white" style={{ fontFamily: fonts.sans }}>
                    <input type="radio" name="disp" checked={dispChoice === d} onChange={() => setDispChoice(d)} />
                    {isAr ? DISPOSITION_META[d].labelAr : DISPOSITION_META[d].labelEn}
                  </label>
                ))}
              </div>
            </fieldset>

            <label htmlFor="disp-reason" className="block text-[10px] tracking-widest text-gray-400 mb-1" style={{ fontFamily: fonts.mono }}>
              {isAr ? "السبب (إلزامي)" : "Reason (required)"}
            </label>
            <textarea
              id="disp-reason"
              value={dispReason}
              onChange={(e) => setDispReason(e.target.value)}
              required
              aria-required="true"
              className="w-full bg-transparent outline-none text-xs text-white resize-none px-2 py-1.5 rounded mb-4"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: fonts.sans, minHeight: 80 }}
              placeholder={isAr ? "وصف موجز للقرار..." : "Briefly describe the decision..."}
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowDispositionModal(false)}
                className="px-4 py-2 rounded-lg text-xs cursor-pointer"
                style={{ background: "transparent", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.1)", fontFamily: fonts.sans }}>
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button onClick={closeWithDisposition} disabled={!dispReason.trim()}
                className="px-4 py-2 rounded-lg text-xs font-bold cursor-pointer disabled:opacity-40"
                style={{ background: "#D6B47E", color: "#051428", fontFamily: fonts.sans }}>
                {isAr ? "إغلاق القضية" : "Close case"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseManagementPage;
