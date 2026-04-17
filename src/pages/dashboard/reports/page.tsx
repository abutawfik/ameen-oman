// Reports builder — Wave 3 · Deliverable 3 (+ Wave 4 · Deliverable 4)
// Two modes: Templates (6 pre-built + N custom) and Scheduled (4 active runs).
// Click Generate now → preview modal with mock rendered report + download PDF noop.
// Wave 4 · D4 — a seventh "+ Custom template" tile opens a bilingual builder
// modal that appends to an in-memory CUSTOM_REPORT_TEMPLATES list.

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

// Wave 4 · D4 — every reusable section the custom-template builder can offer.
// Kept deliberately broader than the pre-built templates so a builder isn't
// boxed in by the existing set.
const CUSTOM_SECTION_OPTIONS: { id: string; labelEn: string; labelAr: string; pages: number }[] = [
  { id: "executive_summary",            labelEn: "Executive summary",            labelAr: "الملخّص التنفيذي",              pages: 1 },
  { id: "kpi_strip",                    labelEn: "KPI strip",                    labelAr: "شريط المؤشرات",                 pages: 1 },
  { id: "case_outcomes_trend",          labelEn: "Case outcomes trend",          labelAr: "اتجاه نتائج القضايا",           pages: 1 },
  { id: "risk_contribution_breakdown",  labelEn: "Risk contribution breakdown",  labelAr: "تفصيل إسهام المخاطر",           pages: 2 },
  { id: "source_health_matrix",         labelEn: "Source health matrix",         labelAr: "مصفوفة صحة المصادر",            pages: 1 },
  { id: "top_origin_risk",              labelEn: "Top origin risk",              labelAr: "أعلى مخاطر المنشأ",             pages: 1 },
  { id: "sla_dashboard",                labelEn: "SLA dashboard",                labelAr: "لوحة مؤشرات SLA",                pages: 1 },
  { id: "model_governance_snapshot",    labelEn: "Model governance snapshot",    labelAr: "لقطة حوكمة النموذج",             pages: 2 },
  { id: "audit_log_excerpt",            labelEn: "Audit log excerpt",            labelAr: "مقتطف من سجل التدقيق",            pages: 1 },
  { id: "per_nationality_fairness_bars",labelEn: "Per-nationality fairness bars",labelAr: "أشرطة العدالة حسب الجنسية",     pages: 1 },
  { id: "contribution_mix_chart",       labelEn: "Contribution mix chart",       labelAr: "مخطط مزيج الإسهامات",            pages: 1 },
  { id: "team_workload",                labelEn: "Team workload",                labelAr: "عبء عمل الفريق",                 pages: 1 },
];

const RECIPIENT_SUGGESTIONS = [
  "duty-analyst@alameen.gov.om",
  "leadership@alameen.gov.om",
  "ops-team@alameen.gov.om",
  "governance@alameen.gov.om",
];

type Cadence = "one_off" | "daily" | "weekly" | "monthly" | "quarterly" | "cron";
type Format = "PDF" | "HTML" | "CSV";

const CADENCE_META: Record<Cadence, { labelEn: string; labelAr: string }> = {
  one_off:   { labelEn: "One-off",      labelAr: "لمرّة واحدة" },
  daily:     { labelEn: "Daily",        labelAr: "يوميّاً" },
  weekly:    { labelEn: "Weekly",       labelAr: "أسبوعياً" },
  monthly:   { labelEn: "Monthly",      labelAr: "شهرياً" },
  quarterly: { labelEn: "Quarterly",    labelAr: "ربع سنوي" },
  cron:      { labelEn: "Custom cron",  labelAr: "Cron مخصّص" },
};

interface CustomReportTemplate extends ReportTemplate {
  isCustom: true;
  recipients: string[];
  cadenceKey: Cadence;
  cadenceDetail: string;
  format: Format;
}

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
  // Wave 4 · D4 — in-memory custom templates. Starts empty; mutations are
  // page-local so the canonical REPORT_TEMPLATES constant stays untouched.
  const [customTemplates, setCustomTemplates] = useState<CustomReportTemplate[]>([]);
  const [builderOpen, setBuilderOpen] = useState(false);

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
            const count = m === "templates" ? (REPORT_TEMPLATES.length + customTemplates.length) : scheduledRows.filter((r) => r.enabled).length;
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
          customTemplates={customTemplates}
          onPreview={setPreviewTemplate}
          onSchedule={() => fireToast(isAr ? "الجدولة من الإعدادات — المرحلة 2" : "Schedule builder — Phase 2")}
          onOpenBuilder={() => setBuilderOpen(true)}
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

      {builderOpen && (
        <CustomTemplateBuilder
          isAr={isAr}
          onClose={() => setBuilderOpen(false)}
          onSave={(tpl) => {
            setCustomTemplates((prev) => [...prev, tpl]);
            try {
              window.dispatchEvent(new CustomEvent("ameen:reports:template-saved", { detail: tpl }));
            } catch { /* noop */ }
            setBuilderOpen(false);
            fireToast(isAr ? "تمّ الحفظ · القالب متاح ضمن المجدولة" : "Template saved · available under Scheduled");
          }}
          onGenerateNow={(tpl) => {
            setCustomTemplates((prev) => [...prev, tpl]);
            setBuilderOpen(false);
            setPreviewTemplate(tpl);
          }}
        />
      )}
    </div>
  );
};

// ─── Templates grid ────────────────────────────────────────────────────────

const TemplatesGrid = ({
  isAr, templates, customTemplates, onPreview, onSchedule, onOpenBuilder,
}: {
  isAr: boolean;
  templates: ReportTemplate[];
  customTemplates: CustomReportTemplate[];
  onPreview: (t: ReportTemplate) => void;
  onSchedule: () => void;
  onOpenBuilder: () => void;
}) => {
  const fonts = useBrandFonts();
  const all = [...templates, ...customTemplates];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {all.map((t) => {
        const isCustom = (t as CustomReportTemplate).isCustom === true;
        return (
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
            <div className="flex items-center gap-1.5">
              {isCustom && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-widest"
                  style={{ background: "rgba(214,180,126,0.18)", color: "#D6B47E", border: "1px solid #D6B47E66", fontFamily: fonts.mono }}>
                  {isAr ? "مخصَّص" : "CUSTOM"}
                </span>
              )}
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-widest"
                style={{ background: "rgba(184,138,60,0.1)", color: "#D6B47E", fontFamily: fonts.mono }}>
                {t.estimatedPages} {isAr ? "صفحات" : "pages"}
              </span>
            </div>
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
        );
      })}

      {/* Wave 4 · D4 — "+ Custom template" tile in brass dashed outline */}
      <button type="button"
        onClick={onOpenBuilder}
        className="rounded-xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all min-h-[240px]"
        style={{
          background: "rgba(184,138,60,0.04)",
          border: "2px dashed #D6B47E88",
          color: "#D6B47E",
          fontFamily: fonts.sans,
        }}>
        <div className="w-14 h-14 flex items-center justify-center rounded-2xl"
          style={{ background: "rgba(184,138,60,0.12)", border: "1px solid #D6B47E66" }}>
          <i className="ri-add-line text-3xl" style={{ color: "#D6B47E" }} />
        </div>
        <p className="text-sm font-bold tracking-wide">
          {isAr ? "قالب مخصَّص +" : "+ Custom template"}
        </p>
        <p className="text-gray-400 text-xs text-center max-w-[220px]" style={{ fontFamily: fonts.sans }}>
          {isAr
            ? "صمِّم تقريرك · اختر الأقسام، المستلمين، والتكرار."
            : "Design your own report · pick sections, recipients, and cadence."}
        </p>
      </button>
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

// ─── Custom Template Builder (Wave 4 · D4) ─────────────────────────────────

const CustomTemplateBuilder = ({
  isAr, onClose, onSave, onGenerateNow,
}: {
  isAr: boolean;
  onClose: () => void;
  onSave: (tpl: CustomReportTemplate) => void;
  onGenerateNow: (tpl: CustomReportTemplate) => void;
}) => {
  const fonts = useBrandFonts();
  const [name, setName] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [selectedSections, setSelectedSections] = useState<string[]>([
    "executive_summary", "kpi_strip", "audit_log_excerpt",
  ]);
  const [recipientInput, setRecipientInput] = useState("");
  const [recipients, setRecipients] = useState<string[]>([]);
  const [cadenceKey, setCadenceKey] = useState<Cadence>("weekly");
  const [cadenceTime, setCadenceTime] = useState("09:00");
  const [cadenceDay, setCadenceDay] = useState("Monday");
  const [cronExpr, setCronExpr] = useState("0 9 * * 1");
  const [format, setFormat] = useState<Format>("PDF");

  const toggleSection = (id: string) => {
    setSelectedSections((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const commitRecipient = (raw: string) => {
    const cleaned = raw.trim().replace(/,$/, "");
    if (!cleaned) return;
    if (recipients.includes(cleaned)) return;
    setRecipients((prev) => [...prev, cleaned]);
  };

  const handleRecipientKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commitRecipient(recipientInput);
      setRecipientInput("");
    } else if (e.key === "Backspace" && !recipientInput && recipients.length) {
      // Pop the last chip on backspace when field is empty.
      setRecipients((prev) => prev.slice(0, -1));
    }
  };

  const removeRecipient = (r: string) => {
    setRecipients((prev) => prev.filter((x) => x !== r));
  };

  const cadenceDetail = useMemo(() => {
    switch (cadenceKey) {
      case "one_off":   return new Date().toISOString().slice(0, 10) + " @ " + cadenceTime;
      case "daily":     return `Daily @ ${cadenceTime}`;
      case "weekly":    return `${cadenceDay}s @ ${cadenceTime}`;
      case "monthly":   return `Day ${cadenceDay.replace(/^\D+/, "") || "1"} @ ${cadenceTime}`;
      case "quarterly": return `Quarterly · first ${cadenceDay} @ ${cadenceTime}`;
      case "cron":      return `cron: ${cronExpr}`;
    }
  }, [cadenceKey, cadenceTime, cadenceDay, cronExpr]);

  // Page estimate = sum of per-section pages + 2 (cover + TOC).
  const pageEstimate = useMemo(() => {
    const body = selectedSections.reduce((sum, id) => {
      const meta = CUSTOM_SECTION_OPTIONS.find((s) => s.id === id);
      return sum + (meta?.pages ?? 1);
    }, 0);
    return Math.max(2, body + 2);
  }, [selectedSections]);

  // Deterministic generation-time estimate in ms — roughly 0.4s per page.
  const generationMs = Math.round(pageEstimate * 420 + selectedSections.length * 80);

  const canSave = (name.trim() || nameAr.trim()) && selectedSections.length > 0;

  const buildTemplate = (): CustomReportTemplate => {
    const id = `tmpl-custom-${Date.now()}`;
    const effectiveName = name.trim() || nameAr.trim() || "Custom report";
    const effectiveNameAr = nameAr.trim() || name.trim() || "تقرير مخصَّص";
    return {
      id,
      name: effectiveName,
      nameAr: effectiveNameAr,
      description: description.trim() || "Operator-configured custom report.",
      descriptionAr: descriptionAr.trim() || "تقرير مخصَّص من المشغّل.",
      icon: "ri-magic-line",
      color: "#D6B47E",
      estimatedPages: pageEstimate,
      sections: selectedSections,
      suggestedCadence: cadenceDetail,
      audience: recipients.length ? `${recipients.length} recipient(s)` : "Custom",
      isCustom: true,
      recipients,
      cadenceKey,
      cadenceDetail,
      format,
    };
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-3xl max-h-[92vh] rounded-2xl border overflow-hidden flex flex-col"
        style={{ background: "var(--alm-ocean-800, #0A2540)", borderColor: "rgba(184,138,60,0.4)", boxShadow: "0 25px 80px rgba(0,0,0,0.6)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="flex items-center justify-between px-5 py-3 border-b flex-shrink-0"
          style={{ borderColor: "rgba(184,138,60,0.15)", background: "rgba(10,37,64,0.9)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center rounded-lg"
              style={{ background: "rgba(184,138,60,0.18)", border: "1px solid #D6B47E55" }}>
              <i className="ri-magic-line text-lg" style={{ color: "#D6B47E" }} />
            </div>
            <div>
              <h2 className="text-white text-base font-bold" style={{ fontFamily: fonts.sans }}>
                {isAr ? "منشئ القوالب المخصَّصة" : "Custom template builder"}
              </h2>
              <p className="text-gray-500 text-[10px]" style={{ fontFamily: fonts.mono }}>
                {isAr ? "تصميم ثنائي اللغة · مقاطع · مستلمون · تكرار · تنسيق" : "Bilingual · sections · recipients · cadence · format"}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-md cursor-pointer"
            style={{ background: "rgba(255,255,255,0.05)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.08)" }}>
            <i className="ri-close-line" />
          </button>
        </header>

        {/* Scrollable form body */}
        <div className="overflow-auto flex-1 p-5 space-y-5">
          {/* 1 · Name + description */}
          <Section title={isAr ? "الاسم والوصف" : "Name & description"} idx={1}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <LabelledInput label="Name (EN)" value={name} onChange={setName} placeholder="Weekly border-intelligence brief" />
              <LabelledInput label="الاسم (AR)" value={nameAr} onChange={setNameAr} placeholder="النشرة الأسبوعية لاستخبارات الحدود" rtl />
              <LabelledTextarea label="Description (EN)" value={description} onChange={setDescription} placeholder="Summary of last-7-days border activity for leadership." />
              <LabelledTextarea label="الوصف (AR)" value={descriptionAr} onChange={setDescriptionAr} placeholder="ملخّص نشاط الحدود خلال الأيام السبعة الماضية للقيادة." rtl />
            </div>
          </Section>

          {/* 2 · Sections */}
          <Section title={isAr ? "الأقسام" : "Sections"} idx={2} hint={isAr ? `${selectedSections.length} مُختارة` : `${selectedSections.length} selected`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1.5">
              {CUSTOM_SECTION_OPTIONS.map((opt) => {
                const active = selectedSections.includes(opt.id);
                return (
                  <button key={opt.id} type="button" onClick={() => toggleSection(opt.id)}
                    className="flex items-center justify-between gap-2 px-3 py-2 rounded-md text-left cursor-pointer transition-all"
                    style={{
                      background: active ? "rgba(184,138,60,0.14)" : "rgba(255,255,255,0.02)",
                      border: `1px solid ${active ? "#D6B47E88" : "rgba(255,255,255,0.08)"}`,
                    }}>
                    <div className="flex items-center gap-2 min-w-0">
                      <i className={active ? "ri-checkbox-fill" : "ri-checkbox-blank-line"} style={{ color: active ? "#D6B47E" : "#6B7280" }} />
                      <span className="text-xs truncate" style={{ color: active ? "#F8F5F0" : "#9CA3AF", fontFamily: fonts.sans }}>
                        {isAr ? opt.labelAr : opt.labelEn}
                      </span>
                    </div>
                    <span className="text-[9px] font-['JetBrains_Mono']" style={{ color: "#6B7280" }}>{opt.pages}p</span>
                  </button>
                );
              })}
            </div>
          </Section>

          {/* 3 · Recipients */}
          <Section title={isAr ? "المستلمون" : "Recipients"} idx={3}>
            <div className="rounded-md p-2 flex flex-wrap items-center gap-1.5"
              style={{ background: "rgba(10,37,64,0.85)", border: "1px solid rgba(184,138,60,0.2)" }}>
              {recipients.map((r) => (
                <span key={r} className="flex items-center gap-1 px-2 py-1 rounded text-[11px]"
                  style={{ background: "rgba(184,138,60,0.12)", color: "#D6B47E", border: "1px solid #D6B47E55", fontFamily: fonts.mono }}>
                  {r}
                  <button type="button" onClick={() => removeRecipient(r)} className="text-gray-400 cursor-pointer hover:text-white ml-0.5">
                    <i className="ri-close-line" />
                  </button>
                </span>
              ))}
              <input
                list="recipient-suggestions"
                value={recipientInput}
                onChange={(e) => setRecipientInput(e.target.value)}
                onKeyDown={handleRecipientKey}
                onBlur={() => { if (recipientInput) { commitRecipient(recipientInput); setRecipientInput(""); } }}
                placeholder={isAr ? "أضف بريداً · Enter أو فاصلة" : "Add email · press Enter or ,"}
                className="flex-1 min-w-[180px] bg-transparent text-white text-xs outline-none py-1"
                style={{ fontFamily: fonts.mono }}
              />
              <datalist id="recipient-suggestions">
                {RECIPIENT_SUGGESTIONS.map((s) => <option key={s} value={s} />)}
              </datalist>
            </div>
          </Section>

          {/* 4 · Cadence */}
          <Section title={isAr ? "التكرار" : "Cadence"} idx={4}>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {(Object.keys(CADENCE_META) as Cadence[]).map((k) => {
                const active = cadenceKey === k;
                return (
                  <button key={k} type="button" onClick={() => setCadenceKey(k)}
                    className="px-3 py-1.5 rounded-md text-xs font-bold cursor-pointer"
                    style={{
                      background: active ? "rgba(184,138,60,0.15)" : "rgba(255,255,255,0.03)",
                      color: active ? "#D6B47E" : "#9CA3AF",
                      border: `1px solid ${active ? "#D6B47E" : "rgba(255,255,255,0.1)"}`,
                      fontFamily: fonts.sans,
                    }}>
                    {isAr ? CADENCE_META[k].labelAr : CADENCE_META[k].labelEn}
                  </button>
                );
              })}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(cadenceKey === "weekly" || cadenceKey === "monthly" || cadenceKey === "quarterly") && (
                <LabelledInput
                  label={cadenceKey === "weekly" ? (isAr ? "اليوم" : "Day of week") : (isAr ? "اليوم/الشهر" : "Day of month")}
                  value={cadenceDay}
                  onChange={setCadenceDay}
                  placeholder={cadenceKey === "weekly" ? "Monday" : "1"}
                />
              )}
              {(cadenceKey === "one_off" || cadenceKey === "daily" || cadenceKey === "weekly" || cadenceKey === "monthly" || cadenceKey === "quarterly") && (
                <LabelledInput
                  label={isAr ? "الوقت" : "Time"}
                  value={cadenceTime}
                  onChange={setCadenceTime}
                  placeholder="09:00"
                />
              )}
              {cadenceKey === "cron" && (
                <LabelledInput
                  label={isAr ? "تعبير Cron" : "Cron expression"}
                  value={cronExpr}
                  onChange={setCronExpr}
                  placeholder="0 9 * * 1"
                />
              )}
            </div>
          </Section>

          {/* 5 · Format */}
          <Section title={isAr ? "التنسيق" : "Format"} idx={5}>
            <div className="flex gap-1.5">
              {(["PDF", "HTML", "CSV"] as Format[]).map((f) => {
                const active = format === f;
                return (
                  <button key={f} type="button" onClick={() => setFormat(f)}
                    className="px-4 py-1.5 rounded-md text-xs font-bold cursor-pointer"
                    style={{
                      background: active ? "rgba(184,138,60,0.15)" : "rgba(255,255,255,0.03)",
                      color: active ? "#D6B47E" : "#9CA3AF",
                      border: `1px solid ${active ? "#D6B47E" : "rgba(255,255,255,0.1)"}`,
                      fontFamily: fonts.mono,
                    }}>
                    {f}
                  </button>
                );
              })}
            </div>
          </Section>

          {/* 6 · Preview */}
          <Section title={isAr ? "المعاينة" : "Preview"} idx={6}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <MiniStat label={isAr ? "الصفحات" : "Pages"} value={`~${pageEstimate}`} accent="#D6B47E" />
              <MiniStat label={isAr ? "المستلمون" : "Recipients"} value={String(recipients.length)} accent="#4ADE80" />
              <MiniStat label={isAr ? "زمن التوليد" : "Gen time"} value={`~${generationMs}ms`} accent="#B8A0FF" />
            </div>
            <p className="mt-3 text-[11px]" style={{ color: "#6B7280", fontFamily: fonts.mono }}>
              <i className="ri-time-line mr-1" />
              {cadenceDetail} · {format}
            </p>
          </Section>
        </div>

        {/* Footer — actions */}
        <footer className="flex items-center justify-end gap-2 px-5 py-3 border-t flex-shrink-0"
          style={{ borderColor: "rgba(184,138,60,0.15)", background: "rgba(10,37,64,0.9)" }}>
          <button type="button" onClick={onClose}
            className="px-3 py-1.5 rounded-md text-xs font-bold cursor-pointer"
            style={{ background: "transparent", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.1)", fontFamily: fonts.sans }}>
            {isAr ? "إلغاء" : "Cancel"}
          </button>
          <button type="button"
            disabled={!canSave}
            onClick={() => onGenerateNow(buildTemplate())}
            className="px-3 py-1.5 rounded-md text-xs font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            style={{ background: "transparent", color: "#D6B47E", border: "1px solid #D6B47E55", fontFamily: fonts.sans }}>
            <i className="ri-flashlight-line" />
            {isAr ? "توليد الآن" : "Generate now"}
          </button>
          <button type="button"
            disabled={!canSave}
            onClick={() => onSave(buildTemplate())}
            className="px-4 py-1.5 rounded-md text-xs font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            style={{ background: "#D6B47E", color: "var(--alm-ocean-900)", fontFamily: fonts.sans }}>
            <i className="ri-save-line" />
            {isAr ? "حفظ القالب" : "Save template"}
          </button>
        </footer>
      </div>
    </div>
  );
};

// ── Builder sub-components ─────────────────────────────────────────────────

const Section = ({ idx, title, hint, children }: { idx: number; title: string; hint?: string; children: React.ReactNode }) => {
  const fonts = useBrandFonts();
  return (
    <div className="rounded-lg border p-4" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(184,138,60,0.12)" }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white text-sm font-bold flex items-center gap-2">
          <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black"
            style={{ background: "rgba(184,138,60,0.18)", color: "#D6B47E", fontFamily: fonts.mono }}>
            {idx}
          </span>
          {title}
        </h3>
        {hint && (
          <span className="text-[10px] tracking-widest" style={{ color: "#6B7280", fontFamily: fonts.mono }}>{hint}</span>
        )}
      </div>
      {children}
    </div>
  );
};

const LabelledInput = ({ label, value, onChange, placeholder, rtl }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rtl?: boolean;
}) => {
  const fonts = useBrandFonts();
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] tracking-widest uppercase" style={{ color: "#6B7280", fontFamily: fonts.mono }}>{label}</span>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        dir={rtl ? "rtl" : undefined}
        className="px-3 py-2 rounded-md text-sm outline-none"
        style={{ background: "rgba(10,37,64,0.85)", border: "1px solid rgba(184,138,60,0.15)", color: "#F8F5F0", fontFamily: fonts.sans }} />
    </label>
  );
};

const LabelledTextarea = ({ label, value, onChange, placeholder, rtl }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rtl?: boolean;
}) => {
  const fonts = useBrandFonts();
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] tracking-widest uppercase" style={{ color: "#6B7280", fontFamily: fonts.mono }}>{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        dir={rtl ? "rtl" : undefined}
        rows={2}
        className="px-3 py-2 rounded-md text-sm outline-none resize-vertical"
        style={{ background: "rgba(10,37,64,0.85)", border: "1px solid rgba(184,138,60,0.15)", color: "#F8F5F0", fontFamily: fonts.sans }} />
    </label>
  );
};

const MiniStat = ({ label, value, accent }: { label: string; value: string; accent: string }) => {
  const fonts = useBrandFonts();
  return (
    <div className="rounded-md p-3" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${accent}33` }}>
      <p className="text-[10px] tracking-widest uppercase" style={{ color: accent, fontFamily: fonts.mono }}>{label}</p>
      <p className="text-white text-xl font-black" style={{ fontFamily: fonts.mono }}>{value}</p>
    </div>
  );
};

export default ReportsPage;
