// Reports builder — Wave 3 · Deliverable 3
// Two modes: Templates (6 pre-built) and Scheduled (4 active runs).
// Click Generate now → preview modal with mock rendered report + download PDF noop.

import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContext } from "../DashboardLayout";
import { useBrandFonts } from "@/brand/typography";
import {
  REPORT_TEMPLATES,
  SCHEDULED_REPORTS,
  aggregate,
  type ReportTemplate,
  type ScheduledReport,
  type ScheduleStatus,
} from "@/mocks/osintData";

type Mode = "templates" | "scheduled";

const formatDate = (iso: string, isAr: boolean): string => {
  const d = new Date(iso);
  return d.toLocaleString(isAr ? "ar-OM" : "en-GB", {
    year: "numeric", month: "short", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
};

const statusMeta: Record<ScheduleStatus, { color: string; labelEn: string; labelAr: string; icon: string }> = {
  ok:      { color: "#4ADE80", labelEn: "OK",      labelAr: "تم",     icon: "ri-check-line" },
  failed:  { color: "#C94A5E", labelEn: "FAILED",  labelAr: "فشل",    icon: "ri-close-line" },
  pending: { color: "#C98A1B", labelEn: "PENDING", labelAr: "معلَّق", icon: "ri-time-line" },
};

const ReportsPage = () => {
  const { isAr } = useOutletContext<DashboardOutletContext>();
  const fonts = useBrandFonts();
  const [mode, setMode] = useState<Mode>("templates");
  const [previewTemplate, setPreviewTemplate] = useState<ReportTemplate | null>(null);
  const [scheduledRows, setScheduledRows] = useState<ScheduledReport[]>(SCHEDULED_REPORTS);
  const [toast, setToast] = useState<string | null>(null);

  const fireToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3200);
  };

  const handleRunNow = (row: ScheduledReport) => {
    const now = new Date().toISOString();
    setScheduledRows((rows) =>
      rows.map((r) =>
        r.id === row.id ? { ...r, lastRunAt: now, lastRunStatus: "ok" } : r,
      ),
    );
    fireToast(isAr ? `تم تشغيل: ${row.cadence}` : `Ran: ${row.cadence} — report delivered to ${row.recipients.length} recipient(s)`);
  };

  const handleToggle = (row: ScheduledReport) => {
    setScheduledRows((rows) =>
      rows.map((r) =>
        r.id === row.id ? { ...r, enabled: !r.enabled } : r,
      ),
    );
    fireToast(
      row.enabled
        ? (isAr ? "أُوقف التشغيل المجدول" : "Schedule disabled")
        : (isAr ? "تم التفعيل" : "Schedule enabled"),
    );
  };

  const handleEdit = () => {
    fireToast(isAr ? "تحرير الجدولة — المرحلة 2" : "Edit schedule — Phase 2");
  };

  return (
    <div className="p-5 min-h-full" style={{ background: "var(--alm-ocean-800, #0A2540)" }}>
      {/* Header */}
      <header className="rounded-2xl border p-5 mb-5 flex items-start justify-between gap-4 flex-wrap"
        style={{
          background: "linear-gradient(135deg, rgba(184,138,60,0.1), rgba(10,37,64,0.8))",
          borderColor: "rgba(184,138,60,0.25)",
        }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <i className="ri-file-chart-line text-2xl" style={{ color: "#D6B47E" }} />
            <h1 className="text-white text-2xl font-bold" style={{ fontFamily: fonts.display }}>
              {isAr ? "التقارير" : "Reports"}
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-widest"
              style={{ background: "rgba(107,79,174,0.15)", color: "#6B4FAE", fontFamily: fonts.mono }}>
              {isAr ? "ويف 3" : "WAVE 3"}
            </span>
          </div>
          <p className="text-gray-400 text-sm" style={{ fontFamily: fonts.sans }}>
            {isAr
              ? "ستة قوالب جاهزة + أربع جدولات نشطة. لكل قالب لقطة معاينة مباشرة."
              : "Six pre-built templates + four active schedules. Each template has a live preview."}
          </p>
        </div>

        {/* Mode pill toggle */}
        <div className="flex gap-1 p-1 rounded-lg"
          style={{ background: "rgba(10,37,64,0.85)", border: "1px solid rgba(184,138,60,0.15)" }}>
          {(["templates", "scheduled"] as Mode[]).map((m) => {
            const active = mode === m;
            const count = m === "templates" ? REPORT_TEMPLATES.length : scheduledRows.filter((r) => r.enabled).length;
            return (
              <button key={m} type="button" onClick={() => setMode(m)}
                className="px-4 py-1.5 rounded-md text-sm font-semibold cursor-pointer transition-all flex items-center gap-2"
                style={{
                  background: active ? "rgba(184,138,60,0.15)" : "transparent",
                  color: active ? "#D6B47E" : "#9CA3AF",
                  border: `1px solid ${active ? "#D6B47E" : "transparent"}`,
                  fontFamily: fonts.sans,
                }}>
                <i className={m === "templates" ? "ri-layout-grid-line" : "ri-calendar-schedule-line"} />
                {m === "templates"
                  ? (isAr ? "القوالب" : "Templates")
                  : (isAr ? "مجدول" : "Scheduled")}
                <span className="px-1.5 py-0.5 rounded text-[10px] font-['JetBrains_Mono']"
                  style={{ background: active ? "rgba(184,138,60,0.2)" : "rgba(255,255,255,0.05)", color: active ? "#D6B47E" : "#6B7280" }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Toast */}
      {toast && (
        <div className="rounded-lg border px-4 py-2.5 mb-4 flex items-center gap-3"
          style={{
            background: "linear-gradient(135deg, rgba(74,222,128,0.12), rgba(10,37,64,0.8))",
            borderColor: "rgba(74,222,128,0.4)",
          }}>
          <i className="ri-check-double-line text-lg" style={{ color: "#4ADE80" }} />
          <span className="text-white text-sm" style={{ fontFamily: fonts.sans }}>{toast}</span>
        </div>
      )}

      {mode === "templates" && (
        <TemplatesGrid
          isAr={isAr}
          templates={REPORT_TEMPLATES}
          onPreview={setPreviewTemplate}
          onSchedule={() => fireToast(isAr ? "الجدولة من الإعدادات — المرحلة 2" : "Schedule builder — Phase 2")}
        />
      )}

      {mode === "scheduled" && (
        <ScheduledTable
          isAr={isAr}
          rows={scheduledRows}
          onRunNow={handleRunNow}
          onToggle={handleToggle}
          onEdit={handleEdit}
        />
      )}

      {previewTemplate && (
        <PreviewModal
          isAr={isAr}
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
        />
      )}
    </div>
  );
};

// ─── Templates grid ────────────────────────────────────────────────────────

const TemplatesGrid = ({
  isAr, templates, onPreview, onSchedule,
}: {
  isAr: boolean;
  templates: ReportTemplate[];
  onPreview: (t: ReportTemplate) => void;
  onSchedule: () => void;
}) => {
  const fonts = useBrandFonts();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((t) => (
        <div key={t.id}
          className="rounded-xl border p-5 flex flex-col gap-3 transition-all"
          style={{
            background: "rgba(10,37,64,0.65)",
            borderColor: `${t.color}33`,
          }}>
          <div className="flex items-start justify-between gap-3">
            <div className="w-11 h-11 flex items-center justify-center rounded-xl flex-shrink-0"
              style={{ background: `${t.color}18`, border: `1px solid ${t.color}44` }}>
              <i className={`${t.icon} text-xl`} style={{ color: t.color }} />
            </div>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-widest"
              style={{ background: "rgba(184,138,60,0.1)", color: "#D6B47E", fontFamily: fonts.mono }}>
              {t.estimatedPages} {isAr ? "صفحات" : "pages"}
            </span>
          </div>

          <div>
            <h3 className="text-white text-base font-bold" style={{ fontFamily: fonts.sans }}>
              {isAr ? t.nameAr : t.name}
            </h3>
            <p className="text-gray-400 text-xs mt-1" style={{ fontFamily: fonts.sans }}>
              {isAr ? t.descriptionAr : t.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-1">
            {t.sections.slice(0, 4).map((s) => (
              <span key={s} className="px-2 py-0.5 rounded text-[10px]"
                style={{ background: "rgba(255,255,255,0.04)", color: "#9CA3AF", fontFamily: fonts.mono }}>
                {s}
              </span>
            ))}
            {t.sections.length > 4 && (
              <span className="px-2 py-0.5 rounded text-[10px]"
                style={{ background: "rgba(255,255,255,0.04)", color: "#6B7280", fontFamily: fonts.mono }}>
                +{t.sections.length - 4}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-[11px] pt-2 border-t"
            style={{ borderColor: "rgba(255,255,255,0.05)", fontFamily: fonts.mono }}>
            <span className="text-gray-500">
              <i className="ri-time-line mr-1" />
              {t.suggestedCadence}
            </span>
            <span className="text-gray-500">
              <i className="ri-user-line mr-1" />
              {t.audience}
            </span>
          </div>

          <div className="flex gap-2 mt-2">
            <button type="button" onClick={() => onPreview(t)}
              className="flex-1 px-3 py-2 rounded-md text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5"
              style={{ background: t.color, color: "var(--alm-ocean-900)", fontFamily: fonts.sans }}>
              <i className="ri-file-search-line" />
              {isAr ? "توليد الآن" : "Generate now"}
            </button>
            <button type="button" onClick={onSchedule}
              className="px-3 py-2 rounded-md text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5"
              style={{ background: "transparent", color: "#D6B47E", border: "1px solid #D6B47E55", fontFamily: fonts.sans }}>
              <i className="ri-calendar-schedule-line" />
              {isAr ? "جدولة" : "Schedule"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Scheduled table ───────────────────────────────────────────────────────

const ScheduledTable = ({
  isAr, rows, onRunNow, onToggle, onEdit,
}: {
  isAr: boolean;
  rows: ScheduledReport[];
  onRunNow: (r: ScheduledReport) => void;
  onToggle: (r: ScheduledReport) => void;
  onEdit: () => void;
}) => {
  const fonts = useBrandFonts();
  return (
    <div className="rounded-xl border overflow-hidden"
      style={{ background: "rgba(10,37,64,0.65)", borderColor: "rgba(184,138,60,0.12)" }}>
      <div className="grid grid-cols-12 gap-2 px-4 py-2.5 border-b text-[10px] font-bold tracking-widest uppercase"
        style={{ borderColor: "rgba(184,138,60,0.08)", color: "#6B7280", fontFamily: fonts.mono }}>
        <div className="col-span-3">{isAr ? "القالب" : "Template"}</div>
        <div className="col-span-2">{isAr ? "الجدول" : "Cadence"}</div>
        <div className="col-span-3">{isAr ? "المستلمون" : "Recipients"}</div>
        <div className="col-span-1">{isAr ? "آخر" : "Last"}</div>
        <div className="col-span-1">{isAr ? "التالي" : "Next"}</div>
        <div className="col-span-2 text-right">{isAr ? "الإجراءات" : "Actions"}</div>
      </div>

      {rows.map((row) => {
        const tmpl = REPORT_TEMPLATES.find((t) => t.id === row.templateId);
        const status = statusMeta[row.lastRunStatus];
        return (
          <div key={row.id}
            className="grid grid-cols-12 gap-2 px-4 py-3 border-b items-center"
            style={{ borderColor: "rgba(184,138,60,0.05)", opacity: row.enabled ? 1 : 0.55 }}>
            {/* Template */}
            <div className="col-span-3 flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0"
                style={{ background: `${tmpl?.color ?? "#D6B47E"}18`, border: `1px solid ${tmpl?.color ?? "#D6B47E"}44` }}>
                <i className={`${tmpl?.icon ?? "ri-file-chart-line"} text-sm`}
                  style={{ color: tmpl?.color ?? "#D6B47E" }} />
              </div>
              <div className="min-w-0">
                <p className="text-white text-xs font-bold truncate" style={{ fontFamily: fonts.sans }}>
                  {tmpl ? (isAr ? tmpl.nameAr : tmpl.name) : row.templateId}
                </p>
                <p className="text-gray-600 text-[10px] truncate" style={{ fontFamily: fonts.mono }}>
                  {row.id} · {row.durationMs}ms
                </p>
              </div>
            </div>

            {/* Cadence */}
            <div className="col-span-2 text-gray-300 text-xs" style={{ fontFamily: fonts.mono }}>
              {row.cadence}
            </div>

            {/* Recipients */}
            <div className="col-span-3 text-gray-400 text-[11px] min-w-0" style={{ fontFamily: fonts.mono }}>
              <p className="truncate">{row.recipients.join(", ")}</p>
            </div>

            {/* Last */}
            <div className="col-span-1 flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-widest inline-flex items-center gap-0.5"
                style={{ background: `${status.color}18`, color: status.color, fontFamily: fonts.mono }}>
                <i className={status.icon} />
                {isAr ? status.labelAr : status.labelEn}
              </span>
            </div>

            {/* Next */}
            <div className="col-span-1 text-gray-500 text-[10px]" style={{ fontFamily: fonts.mono }}>
              {formatDate(row.nextRunAt, isAr)}
            </div>

            {/* Actions */}
            <div className="col-span-2 flex justify-end gap-1">
              <button type="button" onClick={onEdit}
                className="px-2 py-1 rounded text-[10px] font-bold cursor-pointer tracking-widest"
                style={{ background: "transparent", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.1)", fontFamily: fonts.mono }}>
                {isAr ? "تحرير" : "EDIT"}
              </button>
              <button type="button" onClick={() => onRunNow(row)}
                className="px-2 py-1 rounded text-[10px] font-bold cursor-pointer tracking-widest"
                style={{ background: "rgba(184,138,60,0.12)", color: "#D6B47E", border: "1px solid #D6B47E55", fontFamily: fonts.mono }}>
                {isAr ? "تشغيل" : "RUN NOW"}
              </button>
              <button type="button" onClick={() => onToggle(row)}
                className="px-2 py-1 rounded text-[10px] font-bold cursor-pointer tracking-widest"
                style={{
                  background: row.enabled ? "rgba(201,74,94,0.12)" : "rgba(74,222,128,0.12)",
                  color: row.enabled ? "#C94A5E" : "#4ADE80",
                  border: `1px solid ${row.enabled ? "#C94A5E55" : "#4ADE8055"}`,
                  fontFamily: fonts.mono,
                }}>
                {row.enabled ? (isAr ? "إيقاف" : "DISABLE") : (isAr ? "تفعيل" : "ENABLE")}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Preview modal ─────────────────────────────────────────────────────────

const PreviewModal = ({
  isAr, template, onClose,
}: {
  isAr: boolean;
  template: ReportTemplate;
  onClose: () => void;
}) => {
  const fonts = useBrandFonts();
  const agg = useMemo(() => aggregate(), []);

  // Synthetic mini-chart bars for the KPI strip (12 data points).
  const sparkline = useMemo(() => {
    const base = agg.total24h / 12;
    return Array.from({ length: 12 }, (_, i) => Math.max(6, Math.round(base * (0.65 + 0.9 * Math.sin(i * 0.9 + 1)))));
  }, [agg.total24h]);

  const maxSpark = Math.max(...sparkline);

  const handleDownload = () => {
    // Mock PDF download — the brief says console.log is fine.
    console.log("[report-preview] download requested:", template.id);
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] rounded-2xl border overflow-hidden flex flex-col"
        style={{
          background: "var(--alm-ocean-800, #0A2540)",
          borderColor: `${template.color}55`,
          boxShadow: "0 25px 80px rgba(0,0,0,0.6)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <header className="flex items-center justify-between px-5 py-3 border-b flex-shrink-0"
          style={{ borderColor: "rgba(184,138,60,0.15)", background: "rgba(10,37,64,0.9)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center rounded-lg"
              style={{ background: `${template.color}18`, border: `1px solid ${template.color}44` }}>
              <i className={`${template.icon} text-lg`} style={{ color: template.color }} />
            </div>
            <div>
              <h2 className="text-white text-base font-bold" style={{ fontFamily: fonts.sans }}>
                {isAr ? template.nameAr : template.name}
              </h2>
              <p className="text-gray-500 text-[10px]" style={{ fontFamily: fonts.mono }}>
                {template.estimatedPages} {isAr ? "صفحات" : "pages"} · {template.sections.length} {isAr ? "أقسام" : "sections"} · {isAr ? "معاينة" : "PREVIEW"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={handleDownload}
              className="px-3 py-1.5 rounded-md text-xs font-bold cursor-pointer flex items-center gap-1.5"
              style={{ background: template.color, color: "var(--alm-ocean-900)", fontFamily: fonts.sans }}>
              <i className="ri-file-download-line" />
              {isAr ? "تنزيل PDF" : "Download PDF"}
            </button>
            <button type="button" onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-md cursor-pointer"
              style={{ background: "rgba(255,255,255,0.05)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.08)" }}>
              <i className="ri-close-line" />
            </button>
          </div>
        </header>

        {/* Scrollable pages */}
        <div className="overflow-auto flex-1 p-5 space-y-4" style={{ background: "rgba(10,37,64,0.4)" }}>
          {/* Page 1 — cover */}
          <div className="rounded-lg border p-6"
            style={{ background: "#F8F5F0", borderColor: "rgba(10,37,64,0.1)", minHeight: 320, color: "#0A2540" }}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[10px] font-bold tracking-widest" style={{ color: "#B88A3C", fontFamily: fonts.mono }}>
                  AL-AMEEN · REPORT SUITE
                </p>
                <h1 className="text-3xl font-bold mt-1" style={{ fontFamily: fonts.display }}>
                  {isAr ? template.nameAr : template.name}
                </h1>
              </div>
              <i className={`${template.icon} text-5xl`} style={{ color: template.color }} />
            </div>
            <div className="grid grid-cols-2 gap-6 mt-12 pt-6 border-t" style={{ borderColor: "rgba(10,37,64,0.1)" }}>
              <div>
                <p className="text-[10px] tracking-widest" style={{ color: "#6B7280", fontFamily: fonts.mono }}>
                  {isAr ? "الفترة" : "PERIOD"}
                </p>
                <p className="font-bold" style={{ fontFamily: fonts.mono }}>
                  {new Date().toISOString().slice(0, 10)}
                </p>
              </div>
              <div>
                <p className="text-[10px] tracking-widest" style={{ color: "#6B7280", fontFamily: fonts.mono }}>
                  {isAr ? "الجمهور" : "AUDIENCE"}
                </p>
                <p className="font-bold" style={{ fontFamily: fonts.sans }}>{template.audience}</p>
              </div>
              <div>
                <p className="text-[10px] tracking-widest" style={{ color: "#6B7280", fontFamily: fonts.mono }}>
                  {isAr ? "الإصدار" : "ISSUE NUMBER"}
                </p>
                <p className="font-bold" style={{ fontFamily: fonts.mono }}>2026/Q2-001</p>
              </div>
              <div>
                <p className="text-[10px] tracking-widest" style={{ color: "#6B7280", fontFamily: fonts.mono }}>
                  {isAr ? "التصنيف" : "CLASSIFICATION"}
                </p>
                <p className="font-bold" style={{ color: "#B88A3C", fontFamily: fonts.mono }}>RESTRICTED</p>
              </div>
            </div>
          </div>

          {/* Page 2 — KPI strip */}
          <div className="rounded-lg border p-6"
            style={{ background: "#F8F5F0", borderColor: "rgba(10,37,64,0.1)", color: "#0A2540" }}>
            <h2 className="text-lg font-bold mb-4" style={{ fontFamily: fonts.display }}>
              {isAr ? "المؤشرات الرئيسية" : "Key Performance Indicators"}
            </h2>
            <div className="grid grid-cols-4 gap-3 mb-5">
              {[
                { label: "Scored · 24h", value: agg.total24h.toLocaleString(), color: "#B88A3C" },
                { label: "Flagged", value: agg.flagged24h.toString(), color: "#C94A5E" },
                { label: "Flag rate", value: `${agg.flagRate}%`, color: "#C98A1B" },
                { label: "Avg score", value: agg.avgScore.toString(), color: "#6B4FAE" },
              ].map((k) => (
                <div key={k.label} className="rounded-md p-3"
                  style={{ background: "rgba(10,37,64,0.04)", border: "1px solid rgba(10,37,64,0.08)" }}>
                  <p className="text-[10px] tracking-widest" style={{ color: "#6B7280", fontFamily: fonts.mono }}>
                    {k.label.toUpperCase()}
                  </p>
                  <p className="text-2xl font-black" style={{ color: k.color, fontFamily: fonts.mono }}>{k.value}</p>
                </div>
              ))}
            </div>
            {/* Sparkline */}
            <div className="rounded-md p-4" style={{ background: "rgba(10,37,64,0.04)" }}>
              <p className="text-[10px] tracking-widest mb-2" style={{ color: "#6B7280", fontFamily: fonts.mono }}>
                {isAr ? "معدل التسجيل · 12 ساعة مضت" : "SCORE THROUGHPUT · LAST 12 HOURS"}
              </p>
              <div className="flex items-end gap-1" style={{ height: 80 }}>
                {sparkline.map((v, i) => (
                  <div key={i} className="flex-1 rounded-t"
                    style={{ background: template.color, height: `${(v / maxSpark) * 100}%`, opacity: 0.35 + (i / sparkline.length) * 0.6 }} />
                ))}
              </div>
            </div>
          </div>

          {/* Page 3 — sections */}
          <div className="rounded-lg border p-6"
            style={{ background: "#F8F5F0", borderColor: "rgba(10,37,64,0.1)", color: "#0A2540" }}>
            <h2 className="text-lg font-bold mb-4" style={{ fontFamily: fonts.display }}>
              {isAr ? "فهرس التقرير" : "Report contents"}
            </h2>
            <ol className="space-y-2" style={{ fontFamily: fonts.sans }}>
              {template.sections.map((s, i) => (
                <li key={s} className="flex items-center justify-between py-2 border-b"
                  style={{ borderColor: "rgba(10,37,64,0.06)" }}>
                  <span className="flex items-center gap-3">
                    <span className="w-7 h-7 flex items-center justify-center rounded text-xs font-bold"
                      style={{ background: `${template.color}18`, color: template.color, fontFamily: fonts.mono }}>
                      {i + 1}
                    </span>
                    <span className="text-sm font-semibold">{s.replaceAll("_", " ")}</span>
                  </span>
                  <span className="text-xs" style={{ color: "#6B7280", fontFamily: fonts.mono }}>
                    p. {i + 2}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Page 4 — footer narrative */}
          <div className="rounded-lg border p-6"
            style={{ background: "#F8F5F0", borderColor: "rgba(10,37,64,0.1)", color: "#0A2540" }}>
            <h2 className="text-lg font-bold mb-3" style={{ fontFamily: fonts.display }}>
              {isAr ? "ملاحظات تنفيذية" : "Executive summary"}
            </h2>
            <p className="text-sm leading-relaxed mb-3" style={{ fontFamily: fonts.sans }}>
              {isAr
                ? "تم توليد هذا التقرير تلقائياً من مصادر Al-Ameen المدمجة. يعكس الأرقام الحالية في لحظة التوليد، ويشمل جميع الرحلات والإشارات الموثَّقة للفترة المحدَّدة."
                : "This report was auto-generated from Al-Ameen's consolidated sources. Figures reflect state at generation time and cover every scored record and signal inside the specified period."}
            </p>
            <p className="text-sm leading-relaxed" style={{ fontFamily: fonts.sans }}>
              {isAr
                ? "كل قسم من أقسام التقرير يستند إلى تسلسل محاسبيّ قابل للاستعلام؛ يمكن التحقّق من أي رقم عبر سجل التدقيق."
                : "Every section derives from an auditable lineage; any figure can be verified via the Audit Log."}
            </p>
            <div className="mt-6 pt-4 border-t flex items-center justify-between text-[10px]"
              style={{ borderColor: "rgba(10,37,64,0.1)", color: "#6B7280", fontFamily: fonts.mono }}>
              <span>ALAMEEN-REPORT-{template.id.toUpperCase()}</span>
              <span>{isAr ? "صفحة 4 من" : "page 4 of"} {template.estimatedPages}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
