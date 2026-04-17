// Entity Resolution Review Queue — Wave 2 · Deliverable 3
// Triage candidate entity matches in the 0.70–0.85 similarity band (Tech Spec §6.2.2).
// Confident matches auto-merge at ≥0.85, pairs in 0.70–0.85 need human review.

import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import type { DashboardOutletContext } from "../DashboardLayout";
import { useBrandFonts } from "@/brand/typography";
import {
  ENTITY_MATCH_QUEUE,
  type EntityMatchCandidate,
} from "@/mocks/osintData";

type Status = EntityMatchCandidate["status"];

const STATUS_META: Record<Status, { labelEn: string; labelAr: string; color: string }> = {
  PENDING:        { labelEn: "Pending",        labelAr: "قيد المراجعة", color: "#C98A1B" },
  MERGED:         { labelEn: "Merged",         labelAr: "مدمج",          color: "#4A8E3A" },
  KEPT_SEPARATE:  { labelEn: "Kept separate",  labelAr: "منفصل",         color: "#4A7AA8" },
  ESCALATED:      { labelEn: "Escalated",      labelAr: "مصعّد",         color: "#8A1F3C" },
};

const simColor = (s: number) => (s >= 0.80 ? "#D6B47E" : "#C98A1B"); // brass / amber
const factorLabels: Record<string, { en: string; ar: string }> = {
  name_token_set_ratio:         { en: "Name tokens",            ar: "رموز الاسم" },
  alias_overlap_jaccard:        { en: "Alias overlap",          ar: "تداخل الأسماء البديلة" },
  country_match:                { en: "Country match",          ar: "مطابقة الدولة" },
  dob_proximity:                { en: "DOB proximity",          ar: "قُرب تاريخ الميلاد" },
  contextual_source_agreement:  { en: "Source agreement",       ar: "توافق المصادر" },
};

const EntityResolutionPage = () => {
  const { isAr } = useOutletContext<DashboardOutletContext>();
  const fonts = useBrandFonts();
  const [queue, setQueue] = useState<EntityMatchCandidate[]>(ENTITY_MATCH_QUEUE);
  const [statusFilter, setStatusFilter] = useState<Status | "ALL">("PENDING");
  const [activeId, setActiveId] = useState<string>(queue.find((q) => q.status === "PENDING")?.id ?? queue[0].id);
  const [note, setNote] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const active = queue.find((q) => q.id === activeId) ?? queue[0];

  const filtered = useMemo(() => {
    if (statusFilter === "ALL") return queue;
    return queue.filter((q) => q.status === statusFilter);
  }, [queue, statusFilter]);

  const counts: Record<Status | "ALL", number> = {
    ALL: queue.length,
    PENDING: queue.filter((q) => q.status === "PENDING").length,
    MERGED: queue.filter((q) => q.status === "MERGED").length,
    KEPT_SEPARATE: queue.filter((q) => q.status === "KEPT_SEPARATE").length,
    ESCALATED: queue.filter((q) => q.status === "ESCALATED").length,
  };

  const action = (next: Status, requiresNote: boolean) => {
    if (requiresNote && !note.trim()) {
      setToast(isAr ? "الملاحظة إلزامية" : "Note is required");
      setTimeout(() => setToast(null), 1800);
      return;
    }
    setQueue((q) => q.map((c) => c.id === active.id ? { ...c, status: next } : c));
    setNote("");
    setToast(
      next === "MERGED"    ? (isAr ? "تم الدمج — يغذي سجل v0.3.2" : "Merged — feeds v0.3.2 labelled pipeline")
      : next === "KEPT_SEPARATE" ? (isAr ? "تم الفصل" : "Kept separate")
      : next === "ESCALATED" ? (isAr ? "تم التصعيد" : "Escalated to supervisor")
      : (isAr ? "تم" : "Done")
    );
    setTimeout(() => setToast(null), 2600);
  };

  // Build factor data for chart
  const factorData = Object.entries(active.factors).map(([k, v]) => ({
    name: (isAr ? factorLabels[k]?.ar : factorLabels[k]?.en) ?? k,
    key: k,
    value: Number(v),
  }));

  const sharedSources = active.entityA.sources.filter((s) => active.entityB.sources.includes(s));

  return (
    <div className="p-5 min-h-full" style={{ background: "var(--alm-ocean-800, #0A2540)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-white text-2xl font-bold" style={{ fontFamily: fonts.display }}>
            {isAr ? "مراجعة دمج الكيانات" : "Entity Resolution Review"}
          </h1>
          <p className="text-gray-500 text-xs mt-0.5" style={{ fontFamily: fonts.mono }}>
            {isAr ? "نطاق التشابه 0.70 – 0.85 · الدمج التلقائي ≥ 0.85" : "Similarity band 0.70 – 0.85 · Auto-merge at ≥ 0.85"}
          </p>
        </div>
        {toast && (
          <div className="rounded-lg px-4 py-2 flex items-center gap-2"
            style={{ background: "rgba(74,142,58,0.18)", border: "1px solid #4A8E3A66", fontFamily: fonts.sans }}>
            <i className="ri-check-line" style={{ color: "#4A8E3A" }} />
            <span className="text-white text-xs">{toast}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Queue list */}
        <div className="col-span-12 lg:col-span-4">
          <div className="rounded-xl border p-2 mb-3 flex flex-wrap gap-1"
            style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.15)" }}>
            {(["PENDING", "ALL", "MERGED", "KEPT_SEPARATE", "ESCALATED"] as (Status | "ALL")[]).map((s) => {
              const isActive = statusFilter === s;
              const color = s === "ALL" ? "#D6B47E" : STATUS_META[s].color;
              return (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] cursor-pointer"
                  style={{
                    background: isActive ? `${color}22` : "transparent",
                    color: isActive ? color : "#9CA3AF",
                    border: `1px solid ${isActive ? `${color}55` : "transparent"}`,
                    fontFamily: fonts.sans,
                    fontWeight: isActive ? 700 : 500,
                  }}>
                  {s === "ALL" ? (isAr ? "الكل" : "All") : (isAr ? STATUS_META[s].labelAr : STATUS_META[s].labelEn)}
                  <span className="px-1 rounded" style={{ background: "rgba(255,255,255,0.06)", fontFamily: fonts.mono }}>{counts[s]}</span>
                </button>
              );
            })}
          </div>

          <div className="space-y-2 overflow-y-auto" style={{ maxHeight: "calc(100vh - 240px)" }}>
            {filtered.map((c) => {
              const isActive = c.id === active.id;
              return (
                <button key={c.id} onClick={() => setActiveId(c.id)}
                  className="w-full text-left rounded-lg p-3 cursor-pointer transition-all"
                  style={{
                    background: isActive ? "var(--alm-ocean-600, #1a3558)" : "rgba(10,37,64,0.65)",
                    border: "1px solid",
                    borderColor: isActive ? "rgba(184,138,60,0.25)" : "rgba(184,138,60,0.1)",
                    borderLeftWidth: 4,
                    borderLeftColor: isActive ? simColor(c.similarity) : "transparent",
                    fontFamily: fonts.sans,
                  }}>
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: simColor(c.similarity), fontFamily: fonts.mono, fontSize: 14 }}>
                      {c.similarity.toFixed(2)}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] tracking-widest font-bold"
                      style={{ background: `${STATUS_META[c.status].color}22`, color: STATUS_META[c.status].color, fontFamily: fonts.mono }}>
                      {c.status}
                    </span>
                    <span className="text-[10px] text-gray-500 ml-auto" style={{ fontFamily: fonts.mono }}>{c.id}</span>
                  </div>
                  <p className="text-xs text-white mt-1.5 truncate">
                    {c.entityA.canonicalName}
                  </p>
                  <p className="text-xs text-gray-400 truncate" style={{ fontFamily: fonts.sans }}>
                    <i className="ri-contrast-2-line mr-1" /> {c.entityB.canonicalName}
                  </p>
                  <p className="text-[10px] text-gray-600 mt-1" style={{ fontFamily: fonts.mono }}>
                    {c.entityA.type} · {c.createdAt.slice(0, 10)}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: active candidate */}
        <div className="col-span-12 lg:col-span-8 rounded-xl border"
          style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.15)" }}>
          {/* Header */}
          <div className="px-5 py-4 border-b flex items-center justify-between flex-wrap gap-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <div>
              <div className="flex items-center gap-3">
                <span className="font-black" style={{ color: simColor(active.similarity), fontSize: "2.5rem", lineHeight: 1, fontFamily: fonts.mono }}>
                  {active.similarity.toFixed(2)}
                </span>
                <div>
                  <span className="text-[10px] tracking-widest text-gray-500" style={{ fontFamily: fonts.mono }}>
                    {isAr ? "الدرجة الإجمالية" : "SIMILARITY"}
                  </span>
                  <p className="text-white text-xs font-bold" style={{ fontFamily: fonts.sans }}>
                    {active.similarity >= 0.80 ? (isAr ? "نطاق البرونز (0.80–0.85)" : "Brass band (0.80–0.85)") : (isAr ? "نطاق الكهرمان (0.70–0.79)" : "Amber band (0.70–0.79)")}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] tracking-widest font-bold"
                style={{ background: `${STATUS_META[active.status].color}22`, color: STATUS_META[active.status].color, border: `1px solid ${STATUS_META[active.status].color}55`, fontFamily: fonts.mono }}>
                {isAr ? STATUS_META[active.status].labelAr : STATUS_META[active.status].labelEn}
              </span>
              <span className="text-[10px] text-gray-500" style={{ fontFamily: fonts.mono }}>
                {active.id} · {active.entityA.type}
              </span>
            </div>
          </div>

          {/* Side-by-side entity cards */}
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[active.entityA, active.entityB].map((ent, i) => (
              <div key={ent.id} className="rounded-lg p-4"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: `1px solid ${i === 0 ? "#4A7AA855" : "#D6B47E55"}`,
                }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 flex items-center justify-center rounded-lg font-bold"
                    style={{ background: i === 0 ? "#4A7AA822" : "#D6B47E22", color: i === 0 ? "#4A7AA8" : "#D6B47E", fontFamily: fonts.mono }}>
                    {i === 0 ? "A" : "B"}
                  </span>
                  <h3 className="text-white text-sm font-bold" style={{ fontFamily: fonts.sans }}>{ent.canonicalName}</h3>
                </div>
                <p className="text-[10px] tracking-widest text-gray-500 mb-1" style={{ fontFamily: fonts.mono }}>
                  {ent.id} · {ent.type.toUpperCase()}
                </p>
                <div className="space-y-1 mb-3">
                  {Object.entries(ent.attributes).map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-2 text-xs">
                      <span className="text-gray-500" style={{ fontFamily: fonts.sans }}>{k}</span>
                      <span className="text-gray-200 truncate" style={{ fontFamily: fonts.mono }}>{String(v)}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <span className="text-[10px] tracking-widest text-gray-500" style={{ fontFamily: fonts.mono }}>
                    {isAr ? "أسماء بديلة" : "ALIASES"}
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {ent.aliases.map((a) => (
                      <span key={a} className="px-1.5 py-0.5 rounded text-[10px]"
                        style={{ background: "rgba(255,255,255,0.04)", color: "#D1D5DB", border: "1px solid rgba(255,255,255,0.06)", fontFamily: fonts.mono }}>
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <span className="text-[10px] tracking-widest text-gray-500" style={{ fontFamily: fonts.mono }}>
                    {isAr ? "المصادر" : "SOURCES"}
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {ent.sources.map((s) => {
                      const shared = sharedSources.includes(s);
                      return (
                        <span key={s} className="px-1.5 py-0.5 rounded text-[10px]"
                          style={{
                            background: shared ? "#4A8E3A22" : "rgba(255,255,255,0.04)",
                            color: shared ? "#4A8E3A" : "#D1D5DB",
                            border: shared ? "1px solid #4A8E3A55" : "1px solid rgba(255,255,255,0.06)",
                            fontFamily: fonts.mono,
                          }}>
                          {shared && "⚲ "}{s}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Factor breakdown */}
          <div className="px-5 pb-5">
            <div className="rounded-lg p-4"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <h4 className="text-white text-sm font-bold mb-3" style={{ fontFamily: fonts.sans }}>
                {isAr ? "تفصيل عوامل التشابه" : "Similarity factor breakdown"}
              </h4>
              <div style={{ height: 160 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={factorData} layout="vertical" margin={{ left: 120, right: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,138,60,0.08)" horizontal={false} />
                    <XAxis type="number" domain={[0, 1]} stroke="#6B7280" tick={{ fontSize: 10, fontFamily: "JetBrains Mono" }} />
                    <YAxis type="category" dataKey="name" stroke="#D1D5DB" tick={{ fontSize: 11, fontFamily: "Inter" }} width={120} />
                    <Tooltip contentStyle={{ background: "#0A2540", border: "1px solid rgba(184,138,60,0.3)", borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {factorData.map((d) => (
                        <Cell key={d.key} fill={d.value >= 0.85 ? "#4A8E3A" : d.value >= 0.65 ? "#D6B47E" : "#C94A5E"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Evidence */}
          <div className="px-5 pb-5">
            <div className="rounded-lg p-4"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <h4 className="text-white text-sm font-bold mb-3" style={{ fontFamily: fonts.sans }}>
                {isAr ? "الأدلة" : "Evidence"}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] tracking-widest text-gray-500" style={{ fontFamily: fonts.mono }}>
                    {isAr ? "المصادر المشتركة" : "SHARED SOURCES"}
                  </span>
                  {sharedSources.length === 0 ? (
                    <p className="text-gray-500 text-[11px] mt-1" style={{ fontFamily: fonts.sans }}>{isAr ? "لا يوجد" : "None"}</p>
                  ) : (
                    <ul className="mt-1 space-y-0.5">
                      {sharedSources.map((s) => (
                        <li key={s} className="text-[11px]" style={{ color: "#4A8E3A", fontFamily: fonts.mono }}>⚲ {s}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <span className="text-[10px] tracking-widest text-gray-500" style={{ fontFamily: fonts.mono }}>
                    {isAr ? "مقارنة الأسماء" : "ALIAS COMPARISON"}
                  </span>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div>
                      {active.entityA.aliases.map((a) => (
                        <p key={a} className="text-[11px] text-gray-300" style={{ fontFamily: fonts.mono }}>· {a}</p>
                      ))}
                    </div>
                    <div>
                      {active.entityB.aliases.map((a) => (
                        <p key={a} className="text-[11px] text-gray-300" style={{ fontFamily: fonts.mono }}>· {a}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          {active.status === "PENDING" && (
            <div className="px-5 pb-5">
              <label className="block text-[10px] tracking-widest text-gray-400 mb-1" style={{ fontFamily: fonts.mono }}>
                {isAr ? "ملاحظة (إلزامي للدمج/التصعيد)" : "Note (required for Merge / Escalate)"}
              </label>
              <textarea value={note} onChange={(e) => setNote(e.target.value)}
                className="w-full bg-transparent outline-none text-xs text-white resize-none px-2 py-1.5 rounded mb-3"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: fonts.sans, minHeight: 60 }}
                placeholder={isAr ? "اشرح القرار..." : "Explain the decision..."} />
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => action("MERGED", true)}
                  className="px-4 py-2 rounded-lg text-xs font-bold cursor-pointer"
                  style={{ background: "#D6B47E", color: "#051428", fontFamily: fonts.sans }}>
                  <i className="ri-git-merge-line mr-1" /> {isAr ? "دمج" : "Merge"}
                </button>
                <button onClick={() => action("KEPT_SEPARATE", false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold cursor-pointer"
                  style={{ background: "transparent", color: "#4A7AA8", border: "1px solid #4A7AA855", fontFamily: fonts.sans }}>
                  <i className="ri-separator mr-1" /> {isAr ? "إبقاء منفصل" : "Keep separate"}
                </button>
                <button onClick={() => action("ESCALATED", true)}
                  className="px-4 py-2 rounded-lg text-xs font-bold cursor-pointer"
                  style={{ background: "transparent", color: "#C94A5E", border: "1px solid #C94A5E55", fontFamily: fonts.sans }}>
                  <i className="ri-arrow-up-line mr-1" /> {isAr ? "تصعيد" : "Escalate"}
                </button>
              </div>
            </div>
          )}

          {active.status !== "PENDING" && (
            <div className="mx-5 mb-5 rounded-lg p-3 flex items-center gap-2"
              style={{ background: `${STATUS_META[active.status].color}11`, border: `1px solid ${STATUS_META[active.status].color}44` }}>
              <i className="ri-lock-line" style={{ color: STATUS_META[active.status].color }} />
              <span className="text-white text-xs" style={{ fontFamily: fonts.sans }}>
                {isAr ? "هذه الحالة قد أُغلقت بالنتيجة:" : "This candidate is resolved as:"}{" "}
                <span className="font-bold" style={{ color: STATUS_META[active.status].color }}>
                  {isAr ? STATUS_META[active.status].labelAr : STATUS_META[active.status].labelEn}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EntityResolutionPage;
