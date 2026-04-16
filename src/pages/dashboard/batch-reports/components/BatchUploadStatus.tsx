import { useState, useMemo } from "react";
import type { UploadResult } from "./BatchUploadZone";

interface Props { isAr: boolean; results: UploadResult[]; }

const STATUS_COLORS: Record<string, string> = { accepted: "#4ADE80", rejected: "#F87171", pending: "#FACC15" };
const STATUS_LABELS: Record<string, { en: string; ar: string }> = {
  accepted: { en: "Accepted", ar: "مقبول" },
  rejected: { en: "Rejected", ar: "مرفوض" },
  pending:  { en: "Pending",  ar: "معلق" },
};

const BatchUploadStatus = ({ isAr, results }: Props) => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedRow, setSelectedRow] = useState<UploadResult | null>(null);

  const filtered = useMemo(() => {
    let rows = [...results];
    if (filterStatus !== "all") rows = rows.filter((r) => r.status === filterStatus);
    if (filterType !== "all") rows = rows.filter((r) => r.type === filterType);
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((r) => r.person.toLowerCase().includes(q) || r.ref.toLowerCase().includes(q) || r.type.toLowerCase().includes(q));
    }
    return rows;
  }, [results, filterStatus, filterType, search]);

  const accepted = results.filter((r) => r.status === "accepted").length;
  const rejected = results.filter((r) => r.status === "rejected").length;
  const pending = results.filter((r) => r.status === "pending").length;
  const uniqueTypes = Array.from(new Set(results.map((r) => r.type)));

  return (
    <div className="space-y-4">
      {/* Summary pills */}
      <div className="flex flex-wrap items-center gap-3">
        {[
          { label: isAr ? "إجمالي" : "Total", value: results.length, color: "#22D3EE" },
          { label: isAr ? "مقبول" : "Accepted", value: accepted, color: "#4ADE80" },
          { label: isAr ? "مرفوض" : "Rejected", value: rejected, color: "#F87171" },
          { label: isAr ? "معلق" : "Pending", value: pending, color: "#FACC15" },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-2 px-4 py-2 rounded-xl border"
            style={{ background: `${s.color}08`, borderColor: `${s.color}20` }}>
            <span className="text-xl font-black font-['JetBrains_Mono']" style={{ color: s.color }}>{s.value}</span>
            <span className="text-gray-400 text-xs">{s.label}</span>
          </div>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <button type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-semibold cursor-pointer whitespace-nowrap"
            style={{ background: "transparent", borderColor: "rgba(34,211,238,0.3)", color: "#22D3EE" }}>
            <i className="ri-download-2-line text-xs" />
            {isAr ? "تصدير النتائج" : "Export Results"}
          </button>
          {rejected > 0 && (
            <button type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap"
              style={{ background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.3)", color: "#F87171" }}>
              <i className="ri-refresh-line text-xs" />
              {isAr ? `إعادة إرسال ${rejected} مرفوض` : `Re-submit ${rejected} rejected`}
            </button>
          )}
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border p-4"
        style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(34,211,238,0.12)", backdropFilter: "blur(12px)" }}>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 rounded-lg border text-sm cursor-pointer outline-none"
          style={{ background: "rgba(6,13,26,0.8)", borderColor: "rgba(34,211,238,0.15)", color: "#D1D5DB", minWidth: "150px" }}>
          <option value="all">{isAr ? "كل الأنواع" : "All Types"}</option>
          {uniqueTypes.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-lg border text-sm cursor-pointer outline-none"
          style={{ background: "rgba(6,13,26,0.8)", borderColor: "rgba(34,211,238,0.15)", color: "#D1D5DB", minWidth: "130px" }}>
          <option value="all">{isAr ? "كل الحالات" : "All Status"}</option>
          <option value="accepted">{isAr ? "مقبول" : "Accepted"}</option>
          <option value="rejected">{isAr ? "مرفوض" : "Rejected"}</option>
          <option value="pending">{isAr ? "معلق" : "Pending"}</option>
        </select>
        <div className="relative flex-1 min-w-[200px]">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder={isAr ? "بحث..." : "Search..."}
            className="w-full pl-9 pr-3 py-2 rounded-lg border text-sm outline-none"
            style={{ background: "rgba(6,13,26,0.8)", borderColor: "rgba(34,211,238,0.15)", color: "#D1D5DB" }} />
        </div>
        <button type="button"
          className="px-4 py-2 rounded-lg text-sm font-bold cursor-pointer whitespace-nowrap"
          style={{ background: "#22D3EE", color: "#060D1A" }}>
          {isAr ? "بحث" : "Go"}
        </button>
      </div>

      {/* Results table */}
      <div className="rounded-2xl border overflow-hidden"
        style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(34,211,238,0.12)", backdropFilter: "blur(12px)" }}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr style={{ background: "rgba(34,211,238,0.05)", borderBottom: "1px solid rgba(34,211,238,0.1)" }}>
                {[
                  isAr ? "الصف" : "Row",
                  isAr ? "المرجع" : "Reference",
                  isAr ? "النوع" : "Type",
                  isAr ? "الشخص" : "Person",
                  isAr ? "الحالة" : "Status",
                  isAr ? "الأخطاء" : "Errors",
                ].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold font-['JetBrains_Mono'] uppercase tracking-wider text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, idx) => (
                <tr key={row.id}
                  onClick={() => row.errors.length > 0 ? setSelectedRow(selectedRow?.id === row.id ? null : row) : undefined}
                  className="border-b transition-colors"
                  style={{
                    background: selectedRow?.id === row.id ? "rgba(34,211,238,0.05)" : idx % 2 === 0 ? "rgba(10,22,40,0.6)" : "rgba(6,13,26,0.4)",
                    borderColor: "rgba(34,211,238,0.05)",
                    cursor: row.errors.length > 0 ? "pointer" : "default",
                    borderLeft: row.status === "rejected" ? "2px solid #F87171" : row.status === "pending" ? "2px solid #FACC15" : "2px solid transparent",
                  }}
                  onMouseEnter={(e) => { if (row.errors.length > 0) (e.currentTarget as HTMLElement).style.background = "rgba(34,211,238,0.04)"; }}
                  onMouseLeave={(e) => { if (selectedRow?.id !== row.id) (e.currentTarget as HTMLElement).style.background = idx % 2 === 0 ? "rgba(10,22,40,0.6)" : "rgba(6,13,26,0.4)"; }}>
                  <td className="px-4 py-3">
                    <span className="text-gray-500 text-xs font-['JetBrains_Mono']">#{row.row}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-cyan-400 text-xs font-['JetBrains_Mono']">{row.ref}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-white text-xs font-semibold">{row.type}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-300 text-xs">{row.person}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                      style={{ background: `${STATUS_COLORS[row.status]}18`, color: STATUS_COLORS[row.status] }}>
                      {isAr ? STATUS_LABELS[row.status].ar : STATUS_LABELS[row.status].en}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {row.errors.length > 0 ? (
                      <div className="flex items-center gap-1.5 cursor-pointer">
                        <i className="ri-error-warning-line text-amber-400 text-xs" />
                        <span className="text-amber-400 text-xs font-semibold">{row.errors.length} {isAr ? "خطأ" : "error(s)"}</span>
                        <i className="ri-arrow-right-s-line text-gray-600 text-xs" />
                      </div>
                    ) : (
                      <span className="text-gray-600 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Error slide-out panel */}
      {selectedRow && selectedRow.errors.length > 0 && (
        <div className="rounded-2xl border overflow-hidden"
          style={{ background: "rgba(6,13,26,0.95)", borderColor: "rgba(251,191,36,0.25)", backdropFilter: "blur(16px)" }}>
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(251,191,36,0.12)" }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg"
                style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.25)" }}>
                <i className="ri-error-warning-line text-amber-400 text-sm" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">{isAr ? "تفاصيل الأخطاء" : "Validation Errors"}</p>
                <p className="text-gray-500 text-xs">{selectedRow.ref} · {isAr ? `صف ${selectedRow.row}` : `Row ${selectedRow.row}`}</p>
              </div>
            </div>
            <button type="button" onClick={() => setSelectedRow(null)}
              className="w-7 h-7 flex items-center justify-center rounded-full cursor-pointer text-gray-500 hover:text-white transition-colors"
              style={{ background: "rgba(255,255,255,0.05)" }}>
              <i className="ri-close-line text-sm" />
            </button>
          </div>
          <div className="p-6 space-y-3">
            {selectedRow.errors.map((err, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-xl"
                style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.15)" }}>
                <i className="ri-close-circle-line text-amber-400 text-sm mt-0.5 flex-shrink-0" />
                <span className="text-amber-300 text-sm">{err}</span>
              </div>
            ))}
            <div className="flex items-center gap-3 pt-2">
              <button type="button"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold cursor-pointer whitespace-nowrap"
                style={{ background: "#22D3EE", color: "#060D1A" }}>
                <i className="ri-edit-line text-sm" />
                {isAr ? "تصحيح وإعادة الإرسال" : "Fix & Re-submit"}
              </button>
              <button type="button"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap"
                style={{ background: "transparent", borderColor: "rgba(255,255,255,0.1)", color: "#9CA3AF" }}>
                {isAr ? "تجاهل" : "Skip Row"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchUploadStatus;
