import { useState } from "react";

interface Props { isAr: boolean; }

interface Anomaly {
  id: string;
  type: "tourist_industrial" | "no_address_taxi" | "late_night" | "frequent_sensitive" | "inconsistent_purpose";
  severity: "medium" | "high" | "critical";
  personName: string;
  personNameAr: string;
  nationality: string;
  flag: string;
  docNumber: string;
  visaType: string;
  visaTypeAr: string;
  detail: string;
  detailAr: string;
  linkedStreams: string[];
  tripCount: number;
  detectedAt: string;
  status: "open" | "investigating" | "resolved";
}

const ANOMALIES: Anomaly[] = [
  {
    id: "TRN-ANM-001", type: "tourist_industrial", severity: "critical",
    personName: "Reza Tehrani", personNameAr: "رضا طهراني", nationality: "Iran", flag: "🇮🇷",
    docNumber: "IR-3312-F", visaType: "Tourist", visaTypeAr: "سياحي",
    detail: "Tourist visa holder taking daily bus to Industrial Area (Route 14) for 5 consecutive days. No tourist attractions in that zone. Possible undeclared employment.",
    detailAr: "حامل تأشيرة سياحية يأخذ الحافلة يومياً إلى المنطقة الصناعية (خط 14) لمدة 5 أيام متتالية. لا مناطق سياحية في تلك المنطقة. احتمال عمل غير مصرح.",
    linkedStreams: ["TRANSPORT", "BORDER", "UTILITY"], tripCount: 12, detectedAt: "2026-04-05 09:14", status: "investigating",
  },
  {
    id: "TRN-ANM-002", type: "no_address_taxi", severity: "high",
    personName: "Abdi Hassan", personNameAr: "عبدي حسن", nationality: "Somalia", flag: "🇸🇴",
    docNumber: "SO-1122-M", visaType: "Transit", visaTypeAr: "عبور",
    detail: "Person with no registered address (no hotel, no rental) has 47 taxi trips in 14 days. Heavy cash payments. Pattern suggests undisclosed accommodation.",
    detailAr: "شخص بدون عنوان مسجّل (لا فندق، لا إيجار) لديه 47 رحلة تاكسي في 14 يوماً. مدفوعات نقدية كثيرة. النمط يشير إلى إقامة غير مُعلنة.",
    linkedStreams: ["TRANSPORT", "HOTEL", "MUNICIPALITY", "BORDER"], tripCount: 47, detectedAt: "2026-04-04 16:30", status: "open",
  },
  {
    id: "TRN-ANM-003", type: "late_night", severity: "high",
    personName: "Mohammed Al-Rashidi", personNameAr: "محمد الراشدي", nationality: "Yemen", flag: "🇾🇪",
    docNumber: "YE-4821-X", visaType: "Visit", visaTypeAr: "زيارة",
    detail: "Consistent late-night ride-hail trips (22:00–02:00) to residential areas with no registered occupants. 8 trips in 6 days. Possible undisclosed meeting points.",
    detailAr: "رحلات توصيل ليلية متكررة (22:00–02:00) إلى مناطق سكنية بدون ساكنين مسجّلين. 8 رحلات في 6 أيام. احتمال نقاط لقاء غير مُعلنة.",
    linkedStreams: ["TRANSPORT", "UTILITY", "MUNICIPALITY"], tripCount: 8, detectedAt: "2026-04-05 02:15", status: "open",
  },
  {
    id: "TRN-ANM-004", type: "frequent_sensitive", severity: "medium",
    personName: "Vikram Sharma", personNameAr: "فيكرام شارما", nationality: "India", flag: "🇮🇳",
    docNumber: "IN-9901-P", visaType: "Work", visaTypeAr: "عمل",
    detail: "Work visa holder making frequent trips to government district outside stated employer area. 15 trips in 30 days. Employer address is Sohar, trips are to Muscat ministries.",
    detailAr: "حامل تأشيرة عمل يقوم برحلات متكررة إلى المنطقة الحكومية خارج منطقة صاحب العمل المُعلنة. 15 رحلة في 30 يوماً.",
    linkedStreams: ["TRANSPORT", "MOBILE", "BORDER"], tripCount: 15, detectedAt: "2026-04-03 11:00", status: "investigating",
  },
  {
    id: "TRN-ANM-005", type: "inconsistent_purpose", severity: "medium",
    personName: "Chen Jing", personNameAr: "تشن جينغ", nationality: "China", flag: "🇨🇳",
    docNumber: "CN-9901-P", visaType: "Business", visaTypeAr: "أعمال",
    detail: "Business visa holder with no taxi/bus trips to commercial areas. All 22 trips are to residential neighborhoods and markets. Pattern inconsistent with business purpose.",
    detailAr: "حامل تأشيرة أعمال بدون رحلات إلى المناطق التجارية. جميع الرحلات الـ22 إلى أحياء سكنية وأسواق. النمط لا يتوافق مع غرض الأعمال.",
    linkedStreams: ["TRANSPORT", "BORDER", "FINANCIAL"], tripCount: 22, detectedAt: "2026-04-04 14:45", status: "open",
  },
];

const severityColor = (s: Anomaly["severity"]) => s === "medium" ? "#FACC15" : s === "high" ? "#C98A1B" : "#C94A5E";
const statusColor = (s: Anomaly["status"]) => s === "open" ? "#C94A5E" : s === "investigating" ? "#FACC15" : "#4ADE80";
const statusLabel = (s: Anomaly["status"], isAr: boolean) => s === "open" ? (isAr ? "مفتوح" : "Open") : s === "investigating" ? (isAr ? "قيد التحقيق" : "Investigating") : (isAr ? "محلول" : "Resolved");

const typeIcon = (t: Anomaly["type"]) => {
  if (t === "tourist_industrial") return "ri-store-line";
  if (t === "no_address_taxi") return "ri-ghost-line";
  if (t === "late_night") return "ri-moon-line";
  if (t === "frequent_sensitive") return "ri-government-line";
  return "ri-question-line";
};

const typeLabel = (t: Anomaly["type"], isAr: boolean) => {
  const map: Record<string, [string, string]> = {
    tourist_industrial: ["Tourist in Industrial Zone", "سائح في منطقة صناعية"],
    no_address_taxi: ["No Address + Heavy Taxi", "لا عنوان + تاكسي مكثف"],
    late_night: ["Late-Night Movements", "تنقلات ليلية متأخرة"],
    frequent_sensitive: ["Frequent Sensitive Area", "تردد متكرر على منطقة حساسة"],
    inconsistent_purpose: ["Inconsistent with Visa Purpose", "لا يتوافق مع غرض التأشيرة"],
  };
  return isAr ? map[t][1] : map[t][0];
};

const streamColor = (s: string) => {
  const map: Record<string, string> = { TRANSPORT: "#D6B47E", BORDER: "#A78BFA", HOTEL: "#C98A1B", MUNICIPALITY: "#4ADE80", UTILITY: "#FACC15", MOBILE: "#C94A5E", FINANCIAL: "#4ADE80" };
  return map[s] || "#9CA3AF";
};

const TransportAnomalies = ({ isAr }: Props) => {
  const [selected, setSelected] = useState<Anomaly | null>(null);
  const [statuses, setStatuses] = useState<Record<string, Anomaly["status"]>>(
    Object.fromEntries(ANOMALIES.map((a) => [a.id, a.status]))
  );

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(10,37,64,0.8)", borderColor: "rgba(201,74,94,0.2)", backdropFilter: "blur(12px)" }}>
      <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(201,74,94,0.12)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(201,74,94,0.1)", border: "1px solid rgba(201,74,94,0.25)" }}>
            <i className="ri-alarm-warning-line text-red-400 text-sm" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">{isAr ? "كشف الشذوذات" : "Anomaly Detection"}</h3>
            <p className="text-gray-500 text-xs">{isAr ? "أنماط تنقل مشبوهة — تحليل متقاطع" : "Suspicious movement patterns — cross-stream analysis"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border" style={{ background: "rgba(201,74,94,0.08)", borderColor: "rgba(201,74,94,0.2)" }}>
          <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
          <span className="text-red-400 text-xs font-bold font-['JetBrains_Mono']">{ANOMALIES.filter(a => statuses[a.id] === "open").length} {isAr ? "مفتوح" : "OPEN"}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5">
        {/* List */}
        <div className="lg:col-span-2 divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
          {ANOMALIES.map((anomaly) => {
            const color = severityColor(anomaly.severity);
            const isActive = selected?.id === anomaly.id;
            return (
              <button key={anomaly.id} type="button" onClick={() => setSelected(isActive ? null : anomaly)}
                className="w-full flex items-start gap-3 px-5 py-4 cursor-pointer transition-colors text-left"
                style={{ background: isActive ? `${color}08` : "transparent", borderLeft: `3px solid ${color}` }}
                onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.02)"; }}
                onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>
                <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${color}15` }}>
                  <i className={`${typeIcon(anomaly.type)} text-sm`} style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-white text-xs font-bold">{typeLabel(anomaly.type, isAr)}</span>
                    <span className="px-1.5 py-0.5 rounded text-xs font-bold" style={{ background: `${color}15`, color, fontSize: "9px" }}>{anomaly.severity.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-base">{anomaly.flag}</span>
                    <span className="text-gray-400 text-xs">{isAr ? anomaly.personNameAr : anomaly.personName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-xs font-['JetBrains_Mono']">{anomaly.id}</span>
                    <span className="px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ background: `${statusColor(statuses[anomaly.id])}15`, color: statusColor(statuses[anomaly.id]), fontSize: "9px" }}>
                      {statusLabel(statuses[anomaly.id], isAr)}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail */}
        <div className="lg:col-span-3 border-t lg:border-t-0 lg:border-l p-5" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          {selected ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selected.flag}</span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-bold text-sm">{isAr ? selected.personNameAr : selected.personName}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: `${severityColor(selected.severity)}15`, color: severityColor(selected.severity), border: `1px solid ${severityColor(selected.severity)}30` }}>
                        {selected.severity.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-gray-400 text-xs font-['JetBrains_Mono']">{selected.docNumber}</span>
                      <span className="text-gray-600 text-xs">·</span>
                      <span className="text-gray-400 text-xs">{isAr ? selected.visaTypeAr : selected.visaType} {isAr ? "تأشيرة" : "Visa"}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-2xl font-black font-['JetBrains_Mono']" style={{ color: severityColor(selected.severity) }}>{selected.tripCount}</div>
                  <div className="text-gray-500 text-xs">{isAr ? "رحلة" : "trips"}</div>
                </div>
              </div>

              <div className="rounded-xl border p-4" style={{ background: `${severityColor(selected.severity)}06`, borderColor: `${severityColor(selected.severity)}20` }}>
                <p className="text-gray-300 text-sm leading-relaxed">{isAr ? selected.detailAr : selected.detail}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: isAr ? "نوع الشذوذ" : "Anomaly Type", value: typeLabel(selected.type, isAr) },
                  { label: isAr ? "وقت الاكتشاف" : "Detected At", value: selected.detectedAt },
                  { label: isAr ? "عدد الرحلات" : "Trip Count", value: String(selected.tripCount) },
                  { label: isAr ? "المعرّف" : "ID", value: selected.id },
                ].map((item) => (
                  <div key={item.label} className="px-3 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p className="text-gray-500 text-xs">{item.label}</p>
                    <p className="text-white text-xs font-semibold font-['JetBrains_Mono'] mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-gray-500 text-xs mb-2">{isAr ? "التدفقات المرتبطة" : "Linked Streams"}</p>
                <div className="flex gap-2 flex-wrap">
                  {selected.linkedStreams.map((s) => (
                    <span key={s} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold font-['JetBrains_Mono']"
                      style={{ background: `${streamColor(s)}12`, color: streamColor(s), border: `1px solid ${streamColor(s)}25` }}>
                      <i className="ri-links-line text-xs" />{s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-gray-500 text-xs mb-2">{isAr ? "تحديث الحالة" : "Update Status"}</p>
                <div className="flex gap-2">
                  {(["open", "investigating", "resolved"] as const).map((s) => (
                    <button key={s} type="button" onClick={() => setStatuses((prev) => ({ ...prev, [selected.id]: s }))}
                      className="flex-1 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all whitespace-nowrap"
                      style={{
                        background: statuses[selected.id] === s ? `${statusColor(s)}20` : "rgba(255,255,255,0.04)",
                        border: `1px solid ${statuses[selected.id] === s ? statusColor(s) : "rgba(255,255,255,0.08)"}`,
                        color: statuses[selected.id] === s ? statusColor(s) : "#6B7280",
                      }}>
                      {statusLabel(s, isAr)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[280px] text-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl mb-4" style={{ background: "rgba(201,74,94,0.08)", border: "1px solid rgba(201,74,94,0.15)" }}>
                <i className="ri-alarm-warning-line text-red-400 text-2xl" />
              </div>
              <p className="text-gray-400 text-sm">{isAr ? "اختر شذوذاً لعرض التفاصيل" : "Select an anomaly to view details"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransportAnomalies;
