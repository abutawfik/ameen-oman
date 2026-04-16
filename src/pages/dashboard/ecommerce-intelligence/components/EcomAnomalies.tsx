import { useState } from "react";

interface Props { isAr: boolean; }

type Severity = "critical" | "high" | "medium" | "low";
type Status = "open" | "investigating" | "resolved";

interface Anomaly {
  id: string;
  type: string;
  typeAr: string;
  severity: Severity;
  person: string;
  personAr: string;
  nationality: string;
  flag: string;
  docNumber: string;
  description: string;
  descriptionAr: string;
  detectedAt: string;
  linkedStreams: string[];
  status: Status;
  details: string;
  detailsAr: string;
}

const ANOMALIES: Anomaly[] = [
  {
    id: "ECM-ANO-001",
    type: "Structuring Pattern",
    typeAr: "نمط التجزئة",
    severity: "critical",
    person: "Mohammed Al-Rashidi",
    personAr: "محمد الراشدي",
    nationality: "Yemen",
    flag: "🇾🇪",
    docNumber: "YE-4421-M",
    description: "6 payment cards used for multiple small transactions below reporting threshold — classic structuring pattern",
    descriptionAr: "6 بطاقات دفع مستخدمة لمعاملات صغيرة متعددة أقل من حد الإبلاغ — نمط تجزئة كلاسيكي",
    detectedAt: "2026-04-05 07:14",
    linkedStreams: ["FINANCIAL", "BORDER", "TRANSPORT"],
    status: "investigating",
    details: "Person used 6 different payment cards across 14 transactions in 72 hours, each below OMR 100. Total: OMR 1,240. Employment salary: OMR 320/mo. Spend ratio: 9× monthly income.",
    detailsAr: "استخدم الشخص 6 بطاقات دفع مختلفة في 14 معاملة خلال 72 ساعة، كل منها أقل من 100 ريال. الإجمالي: 1,240 ريال. راتب التوظيف: 320 ريال/شهر. نسبة الإنفاق: 9× الدخل الشهري.",
  },
  {
    id: "ECM-ANO-002",
    type: "Restricted Item Purchase",
    typeAr: "شراء عنصر مقيّد",
    severity: "critical",
    person: "Reza Tehrani",
    personAr: "رضا طهراني",
    nationality: "Iran",
    flag: "🇮🇷",
    docNumber: "IR-3312-F",
    description: "Signal jammer device purchased — illegal in Oman. Cross-reference with communication stream shows no legitimate business purpose",
    descriptionAr: "تم شراء جهاز تشويش إشارة — غير قانوني في عُمان. التحقق المتقاطع مع تدفق الاتصالات لا يُظهر غرضاً تجارياً مشروعاً",
    detectedAt: "2026-04-03 14:22",
    linkedStreams: ["MOBILE", "BORDER", "EMPLOYMENT"],
    status: "open",
    details: "Signal jammer (model: SJ-Pro 4G) purchased from online retailer. Device capable of blocking GSM/3G/4G signals in 50m radius. Purchaser has no telecommunications license. Border stream: entered Nov 2025, no exit.",
    detailsAr: "تم شراء مشوش إشارة (طراز: SJ-Pro 4G) من متجر إلكتروني. الجهاز قادر على حجب إشارات GSM/3G/4G في نطاق 50 متر. المشتري لا يملك ترخيص اتصالات. تدفق الحدود: دخل نوفمبر 2025، لا خروج.",
  },
  {
    id: "ECM-ANO-003",
    type: "Bulk SIM Card Purchase",
    typeAr: "شراء شرائح SIM بالجملة",
    severity: "high",
    person: "Reza Tehrani",
    personAr: "رضا طهراني",
    nationality: "Iran",
    flag: "🇮🇷",
    docNumber: "IR-3312-F",
    description: "50 prepaid SIM cards purchased in single transaction — far exceeds personal use threshold. Cross-reference with mobile stream shows 12 already activated",
    descriptionAr: "50 شريحة SIM مدفوعة مسبقاً تم شراؤها في معاملة واحدة — يتجاوز بكثير حد الاستخدام الشخصي. التحقق المتقاطع مع تدفق الجوال يُظهر تفعيل 12 منها",
    detectedAt: "2026-04-04 11:38",
    linkedStreams: ["MOBILE", "FINANCIAL"],
    status: "open",
    details: "50 Omantel prepaid SIMs purchased at Muscat City Centre branch. Payment: cash. Mobile stream confirms 12 SIMs already registered to different identities. Possible SIM farm operation.",
    detailsAr: "50 شريحة عُمانتل مدفوعة مسبقاً تم شراؤها في فرع مسقط سيتي سنتر. الدفع: نقداً. تدفق الجوال يؤكد تسجيل 12 شريحة بهويات مختلفة. احتمال عملية مزرعة SIM.",
  },
  {
    id: "ECM-ANO-004",
    type: "Spend vs Salary Mismatch",
    typeAr: "عدم تطابق الإنفاق مع الراتب",
    severity: "high",
    person: "Reza Tehrani",
    personAr: "رضا طهراني",
    nationality: "Iran",
    flag: "🇮🇷",
    docNumber: "IR-3312-F",
    description: "Total flagged purchases OMR 4,820 in 45 days. Employment salary OMR 450/month. Spend ratio 10.7× monthly income — unexplained wealth source",
    descriptionAr: "إجمالي المشتريات المُبلَّغة 4,820 ريال في 45 يوماً. راتب التوظيف 450 ريال/شهر. نسبة الإنفاق 10.7× الدخل الشهري — مصدر ثروة غير مفسّر",
    detectedAt: "2026-04-05 09:02",
    linkedStreams: ["FINANCIAL", "EMPLOYMENT"],
    status: "investigating",
    details: "Cross-reference between e-commerce flagged purchases and employment registry shows significant income-expenditure gap. Financial stream shows 4 payment cards with no declared income source for 3 of them.",
    detailsAr: "التحقق المتقاطع بين المشتريات الإلكترونية المُبلَّغة وسجل التوظيف يُظهر فجوة كبيرة بين الدخل والإنفاق. تدفق المالية يُظهر 4 بطاقات دفع بدون مصدر دخل معلن لـ 3 منها.",
  },
  {
    id: "ECM-ANO-005",
    type: "Chemical Purchase Alert",
    typeAr: "تنبيه شراء مواد كيميائية",
    severity: "critical",
    person: "Mohammed Al-Rashidi",
    personAr: "محمد الراشدي",
    nationality: "Yemen",
    flag: "🇾🇪",
    docNumber: "YE-4421-M",
    description: "25kg ammonium nitrate purchased — monitored chemical. No agricultural or industrial license on record. Tourist visa status",
    descriptionAr: "تم شراء 25 كجم نترات الأمونيوم — مادة كيميائية مراقبة. لا يوجد ترخيص زراعي أو صناعي. وضع تأشيرة سياحية",
    detectedAt: "2026-03-25 16:45",
    linkedStreams: ["BORDER", "EMPLOYMENT", "TRANSPORT"],
    status: "open",
    details: "Ammonium nitrate (25kg) purchased from agricultural supply store in Nizwa. Purchaser holds tourist visa — no agricultural or industrial license. Border stream: overstay 45 days. Transport: frequent trips to Nizwa/Ibri area.",
    detailsAr: "نترات الأمونيوم (25 كجم) تم شراؤها من متجر مستلزمات زراعية في نزوى. المشتري يحمل تأشيرة سياحية — لا يوجد ترخيص زراعي أو صناعي. تدفق الحدود: تجاوز 45 يوماً. النقل: رحلات متكررة إلى منطقة نزوى/إبري.",
  },
];

const riskColor = (r: Severity) => {
  if (r === "low") return "#4ADE80";
  if (r === "medium") return "#FACC15";
  if (r === "high") return "#FB923C";
  return "#F87171";
};

const streamColor = (s: string) => {
  const map: Record<string, string> = { FINANCIAL: "#4ADE80", MOBILE: "#22D3EE", BORDER: "#A78BFA", EMPLOYMENT: "#F9A8D4", TRANSPORT: "#FB923C", UTILITY: "#FACC15" };
  return map[s] || "#9CA3AF";
};

const STATUS_FLOW: Status[] = ["open", "investigating", "resolved"];

const EcomAnomalies = ({ isAr }: Props) => {
  const [anomalies, setAnomalies] = useState<Anomaly[]>(ANOMALIES);
  const [selected, setSelected] = useState<string | null>(null);

  const selectedAnomaly = anomalies.find((a) => a.id === selected);

  const updateStatus = (id: string, status: Status) => {
    setAnomalies((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const counts = {
    total: anomalies.length,
    open: anomalies.filter((a) => a.status === "open").length,
    investigating: anomalies.filter((a) => a.status === "investigating").length,
    critical: anomalies.filter((a) => a.severity === "critical").length,
  };

  return (
    <div className="space-y-5">
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: isAr ? "إجمالي" : "Total", value: counts.total, color: "#22D3EE" },
          { label: isAr ? "مفتوح" : "Open", value: counts.open, color: "#F87171" },
          { label: isAr ? "قيد التحقيق" : "Investigating", value: counts.investigating, color: "#FACC15" },
          { label: isAr ? "حرج" : "Critical", value: counts.critical, color: "#F87171" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border p-4 text-center" style={{ background: "rgba(10,22,40,0.8)", borderColor: `${s.color}20`, backdropFilter: "blur(12px)" }}>
            <div className="text-3xl font-black font-['JetBrains_Mono']" style={{ color: s.color }}>{s.value}</div>
            <div className="text-gray-500 text-xs mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Anomaly list */}
        <div className="space-y-3">
          {anomalies.map((anomaly) => {
            const rc = riskColor(anomaly.severity);
            const isActive = selected === anomaly.id;
            return (
              <button
                key={anomaly.id}
                type="button"
                onClick={() => setSelected(isActive ? null : anomaly.id)}
                className="w-full rounded-2xl border p-4 text-left cursor-pointer transition-all"
                style={{
                  background: isActive ? `${rc}08` : "rgba(10,22,40,0.8)",
                  borderColor: isActive ? `${rc}40` : `${rc}20`,
                  backdropFilter: "blur(12px)",
                  borderLeft: `4px solid ${rc}`,
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-white text-sm font-bold">{isAr ? anomaly.typeAr : anomaly.type}</span>
                      <span className="px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ background: `${rc}15`, color: rc, fontSize: "9px" }}>
                        {anomaly.severity.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base">{anomaly.flag}</span>
                      <span className="text-gray-400 text-xs">{isAr ? anomaly.personAr : anomaly.person}</span>
                      <span className="text-gray-600 text-xs font-['JetBrains_Mono']">{anomaly.docNumber}</span>
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{isAr ? anomaly.descriptionAr : anomaly.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{
                        background: anomaly.status === "resolved" ? "rgba(74,222,128,0.12)" : anomaly.status === "investigating" ? "rgba(250,204,21,0.12)" : "rgba(248,113,113,0.12)",
                        color: anomaly.status === "resolved" ? "#4ADE80" : anomaly.status === "investigating" ? "#FACC15" : "#F87171",
                        fontSize: "9px",
                      }}>
                      {anomaly.status.toUpperCase()}
                    </span>
                    <span className="text-gray-600 text-xs font-['JetBrains_Mono'] whitespace-nowrap">{anomaly.detectedAt.split(" ")[1]}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        {selectedAnomaly ? (
          <div className="rounded-2xl border p-5 space-y-4" style={{ background: "rgba(10,22,40,0.9)", borderColor: `${riskColor(selectedAnomaly.severity)}30`, backdropFilter: "blur(16px)" }}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-white font-bold">{isAr ? selectedAnomaly.typeAr : selectedAnomaly.type}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: `${riskColor(selectedAnomaly.severity)}15`, color: riskColor(selectedAnomaly.severity), border: `1px solid ${riskColor(selectedAnomaly.severity)}30` }}>
                    {selectedAnomaly.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-500 text-xs font-['JetBrains_Mono']">{selectedAnomaly.id} · {selectedAnomaly.detectedAt}</p>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 cursor-pointer transition-colors flex-shrink-0">
                <i className="ri-close-line text-gray-400" />
              </button>
            </div>

            {/* Person */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="text-2xl">{selectedAnomaly.flag}</span>
              <div>
                <p className="text-white font-bold text-sm">{isAr ? selectedAnomaly.personAr : selectedAnomaly.person}</p>
                <p className="text-gray-500 text-xs font-['JetBrains_Mono']">{selectedAnomaly.docNumber} · {selectedAnomaly.nationality}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 font-['JetBrains_Mono']">{isAr ? "الوصف" : "Description"}</p>
              <p className="text-gray-300 text-sm leading-relaxed">{isAr ? selectedAnomaly.descriptionAr : selectedAnomaly.description}</p>
            </div>

            {/* Details */}
            <div className="px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 font-['JetBrains_Mono']">{isAr ? "التفاصيل" : "Intelligence Details"}</p>
              <p className="text-gray-400 text-xs leading-relaxed">{isAr ? selectedAnomaly.detailsAr : selectedAnomaly.details}</p>
            </div>

            {/* Linked streams */}
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 font-['JetBrains_Mono']">{isAr ? "التدفقات المرتبطة" : "Linked Streams"}</p>
              <div className="flex gap-2 flex-wrap">
                {selectedAnomaly.linkedStreams.map((s) => (
                  <span key={s} className="px-2 py-1 rounded-lg text-xs font-bold font-['JetBrains_Mono']"
                    style={{ background: `${streamColor(s)}12`, color: streamColor(s), border: `1px solid ${streamColor(s)}25` }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Status updater */}
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 font-['JetBrains_Mono']">{isAr ? "تحديث الحالة" : "Update Status"}</p>
              <div className="flex gap-2">
                {STATUS_FLOW.map((s) => {
                  const isActive = selectedAnomaly.status === s;
                  const sc = s === "resolved" ? "#4ADE80" : s === "investigating" ? "#FACC15" : "#F87171";
                  return (
                    <button key={s} type="button" onClick={() => updateStatus(selectedAnomaly.id, s)}
                      className="flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all whitespace-nowrap"
                      style={{
                        background: isActive ? `${sc}20` : "rgba(255,255,255,0.04)",
                        border: `1px solid ${isActive ? sc : "rgba(255,255,255,0.08)"}`,
                        color: isActive ? sc : "#6B7280",
                      }}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border flex items-center justify-center" style={{ background: "rgba(10,22,40,0.5)", borderColor: "rgba(34,211,238,0.08)", minHeight: "300px" }}>
            <div className="text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-2xl mx-auto mb-3" style={{ background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.15)" }}>
                <i className="ri-cursor-line text-cyan-400 text-xl" />
              </div>
              <p className="text-gray-500 text-sm">{isAr ? "اختر شذوذاً لعرض التفاصيل" : "Select an anomaly to view details"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EcomAnomalies;
