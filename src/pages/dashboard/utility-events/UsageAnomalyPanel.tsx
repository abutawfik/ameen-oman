import { useState } from "react";

interface Props { isAr: boolean; onCancel: () => void; }

interface AnomalyRecord {
  id: string;
  type: "spike" | "no_rental" | "multi_account" | "no_occupant" | "commercial_on_residential";
  severity: "medium" | "high" | "critical";
  accountNumber: string;
  holderName: string;
  holderNameAr: string;
  address: string;
  provider: string;
  serviceType: string;
  detectedAt: string;
  detail: string;
  detailAr: string;
  linkedStreams: string[];
  status: "open" | "investigating" | "resolved";
}

const ANOMALIES: AnomalyRecord[] = [
  {
    id: "ANM-UTL-001", type: "spike", severity: "high",
    accountNumber: "ACC-2024-8821", holderName: "Ahmed Al-Balushi", holderNameAr: "أحمد البلوشي",
    address: "District 4, Capital Region", provider: "National Electric Company", serviceType: "Electricity",
    detectedAt: "2026-04-05 09:14", detail: "Usage spike 420% above 6-month average. Current: 2,840 kWh vs avg 680 kWh.",
    detailAr: "ارتفاع الاستهلاك 420% فوق متوسط 6 أشهر. الحالي: 2,840 كيلوواط مقابل متوسط 680.",
    linkedStreams: ["UTILITY", "MUNICIPALITY"], status: "investigating",
  },
  {
    id: "ANM-UTL-002", type: "no_rental", severity: "critical",
    accountNumber: "ACC-2025-3301", holderName: "Reza Tehrani", holderNameAr: "رضا طهراني",
    address: "Central District, Capital Region", provider: "National Water Authority", serviceType: "Water",
    detectedAt: "2026-04-05 11:32", detail: "Account active 8 months. No registered rental agreement found in Municipality stream for this address.",
    detailAr: "الحساب نشط 8 أشهر. لا يوجد عقد إيجار مسجّل في بيانات البلدية لهذا العنوان.",
    linkedStreams: ["UTILITY", "MUNICIPALITY", "BORDER"], status: "open",
  },
  {
    id: "ANM-UTL-003", type: "multi_account", severity: "high",
    accountNumber: "ACC-2023-7712 / ACC-2024-5503", holderName: "Vikram Sharma", holderNameAr: "فيكرام شارما",
    address: "Northern Coast + Capital Region", provider: "Telco A", serviceType: "Internet",
    detectedAt: "2026-04-04 16:45", detail: "Same person has active internet connections at 2 different addresses simultaneously. Possible subletting.",
    detailAr: "نفس الشخص لديه اتصالات إنترنت نشطة في عنوانين مختلفين في نفس الوقت. احتمال إيجار من الباطن.",
    linkedStreams: ["UTILITY", "MUNICIPALITY"], status: "open",
  },
  {
    id: "ANM-UTL-004", type: "no_occupant", severity: "medium",
    accountNumber: "ACC-2024-9901", holderName: "Fatima Al-Zadjali", holderNameAr: "فاطمة الزدجالية",
    address: "Interior Region", provider: "National Electric Company", serviceType: "Electricity",
    detectedAt: "2026-04-05 08:00", detail: "Active connection at address with no registered occupant in any Al-Ameen stream. No hotel, no rental, no border entry.",
    detailAr: "توصيل نشط في عنوان لا يوجد فيه ساكن مسجّل في أي تدفق Al-Ameen. لا فندق، لا إيجار، لا دخول حدودي.",
    linkedStreams: ["UTILITY", "HOTEL", "MUNICIPALITY", "BORDER"], status: "open",
  },
  {
    id: "ANM-UTL-005", type: "commercial_on_residential", severity: "critical",
    accountNumber: "ACC-2022-1144", holderName: "Mohammed Al-Rashidi", holderNameAr: "محمد الراشدي",
    address: "Northern District, Capital Region", provider: "National Electric Company", serviceType: "Electricity",
    detectedAt: "2026-04-03 14:20", detail: "Residential tariff account consuming 18,400 kWh/month — consistent with commercial operation (restaurant/workshop). Avg residential: 600 kWh.",
    detailAr: "حساب بتعرفة سكنية يستهلك 18,400 كيلوواط/شهر — يتوافق مع نشاط تجاري (مطعم/ورشة). متوسط سكني: 600 كيلوواط.",
    linkedStreams: ["UTILITY", "MUNICIPALITY"], status: "investigating",
  },
];

const severityColor = (s: AnomalyRecord["severity"]) => {
  if (s === "medium") return "#FACC15";
  if (s === "high") return "#FB923C";
  return "#F87171";
};

const typeIcon = (t: AnomalyRecord["type"]) => {
  if (t === "spike") return "ri-bar-chart-grouped-line";
  if (t === "no_rental") return "ri-home-wifi-line";
  if (t === "multi_account") return "ri-user-shared-line";
  if (t === "no_occupant") return "ri-ghost-line";
  return "ri-store-line";
};

const typeLabel = (t: AnomalyRecord["type"], isAr: boolean) => {
  const map: Record<string, [string, string]> = {
    spike: ["Usage Spike", "ارتفاع الاستهلاك"],
    no_rental: ["No Rental Registered", "لا إيجار مسجّل"],
    multi_account: ["Multiple Accounts", "حسابات متعددة"],
    no_occupant: ["No Registered Occupant", "لا ساكن مسجّل"],
    commercial_on_residential: ["Commercial on Residential", "تجاري على سكني"],
  };
  return isAr ? map[t][1] : map[t][0];
};

const statusColor = (s: AnomalyRecord["status"]) => {
  if (s === "open") return "#F87171";
  if (s === "investigating") return "#FACC15";
  return "#4ADE80";
};

const statusLabel = (s: AnomalyRecord["status"], isAr: boolean) => {
  if (s === "open") return isAr ? "مفتوح" : "Open";
  if (s === "investigating") return isAr ? "قيد التحقيق" : "Investigating";
  return isAr ? "محلول" : "Resolved";
};

const streamColor = (s: string) => {
  if (s === "UTILITY") return "#D4A84B";
  if (s === "MUNICIPALITY") return "#4ADE80";
  if (s === "BORDER") return "#A78BFA";
  if (s === "HOTEL") return "#FB923C";
  return "#9CA3AF";
};

const UsageAnomalyPanel = ({ isAr, onCancel }: Props) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<Record<string, AnomalyRecord["status"]>>(
    Object.fromEntries(ANOMALIES.map((a) => [a.id, a.status]))
  );

  const updateStatus = (id: string, status: AnomalyRecord["status"]) => {
    setStatuses((prev) => ({ ...prev, [id]: status }));
  };

  const selected = ANOMALIES.find((a) => a.id === selectedId);

  return (
    <div className="space-y-5">
      {/* System-generated banner */}
      <div className="flex items-start gap-3 px-5 py-4 rounded-xl border" style={{ background: "rgba(251,146,60,0.06)", borderColor: "rgba(251,146,60,0.2)" }}>
        <i className="ri-robot-line text-orange-400 text-base mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-orange-400 text-sm font-bold mb-0.5">{isAr ? "تنبيه مُولَّد تلقائياً — لا إدخال يدوي" : "System-Generated Alerts — No Manual Entry"}</p>
          <p className="text-gray-400 text-xs">
            {isAr
              ? "يكتشف Al-Ameen هذه الشذوذات تلقائياً عبر التحليل المتقاطع بين تدفقات المرافق والبلدية والحدود والفنادق."
              : "Al-Ameen auto-detects these anomalies via cross-stream analysis between Utility, Municipality, Border, and Hotel data streams."}
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: isAr ? "إجمالي التنبيهات" : "Total Alerts", value: ANOMALIES.length, color: "#D4A84B", icon: "ri-alert-line" },
          { label: isAr ? "مفتوح" : "Open", value: ANOMALIES.filter(a => a.status === "open").length, color: "#F87171", icon: "ri-error-warning-line" },
          { label: isAr ? "قيد التحقيق" : "Investigating", value: ANOMALIES.filter(a => a.status === "investigating").length, color: "#FACC15", icon: "ri-search-eye-line" },
          { label: isAr ? "حرج" : "Critical", value: ANOMALIES.filter(a => a.severity === "critical").length, color: "#F87171", icon: "ri-alarm-warning-line" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border p-4" style={{ background: "rgba(20,29,46,0.8)", borderColor: `${stat.color}20`, backdropFilter: "blur(12px)" }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 flex items-center justify-center rounded-lg" style={{ background: `${stat.color}15` }}>
                <i className={`${stat.icon} text-xs`} style={{ color: stat.color }} />
              </div>
              <span className="text-gray-500 text-xs">{stat.label}</span>
            </div>
            <div className="text-3xl font-black font-['JetBrains_Mono']" style={{ color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Anomaly list + detail */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* List */}
        <div className="lg:col-span-2 space-y-3">
          {ANOMALIES.map((anomaly) => {
            const color = severityColor(anomaly.severity);
            const currentStatus = statuses[anomaly.id];
            const isSelected = selectedId === anomaly.id;
            return (
              <button key={anomaly.id} type="button" onClick={() => setSelectedId(isSelected ? null : anomaly.id)}
                className="w-full rounded-xl border p-4 text-left cursor-pointer transition-all duration-200"
                style={{
                  background: isSelected ? `${color}08` : "rgba(20,29,46,0.8)",
                  borderColor: isSelected ? `${color}40` : "rgba(181,142,60,0.1)",
                  borderLeft: `3px solid ${color}`,
                  backdropFilter: "blur(12px)",
                }}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${color}15` }}>
                      <i className={`${typeIcon(anomaly.type)} text-xs`} style={{ color }} />
                    </div>
                    <span className="text-white text-xs font-bold">{typeLabel(anomaly.type, isAr)}</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-xs font-bold font-['JetBrains_Mono'] flex-shrink-0" style={{ background: `${color}15`, color, border: `1px solid ${color}30`, fontSize: "9px" }}>
                    {anomaly.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-400 text-xs mb-2">{isAr ? anomaly.holderNameAr : anomaly.holderName}</p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-xs font-['JetBrains_Mono']">{anomaly.id}</span>
                  <span className="px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ background: `${statusColor(currentStatus)}15`, color: statusColor(currentStatus), fontSize: "9px" }}>
                    {statusLabel(currentStatus, isAr)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="rounded-2xl border p-6 sticky top-24" style={{ background: "rgba(20,29,46,0.9)", borderColor: `${severityColor(selected.severity)}30`, backdropFilter: "blur(16px)" }}>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl" style={{ background: `${severityColor(selected.severity)}15`, border: `1px solid ${severityColor(selected.severity)}30` }}>
                    <i className={`${typeIcon(selected.type)} text-lg`} style={{ color: severityColor(selected.severity) }} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">{typeLabel(selected.type, isAr)}</h3>
                    <p className="text-gray-500 text-xs font-['JetBrains_Mono']">{selected.id}</p>
                  </div>
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-bold" style={{ background: `${severityColor(selected.severity)}15`, color: severityColor(selected.severity), border: `1px solid ${severityColor(selected.severity)}30` }}>
                  {selected.severity.toUpperCase()}
                </span>
              </div>

              {/* Account info */}
              <div className="rounded-xl border p-4 mb-4" style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: isAr ? "صاحب الحساب" : "Account Holder", value: isAr ? selected.holderNameAr : selected.holderName },
                    { label: isAr ? "رقم الحساب" : "Account Number", value: selected.accountNumber },
                    { label: isAr ? "المزود" : "Provider", value: selected.provider },
                    { label: isAr ? "نوع الخدمة" : "Service Type", value: selected.serviceType },
                    { label: isAr ? "العنوان" : "Address", value: selected.address },
                    { label: isAr ? "وقت الاكتشاف" : "Detected At", value: selected.detectedAt },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-gray-500 text-xs">{item.label}</p>
                      <p className="text-white text-xs font-semibold font-['JetBrains_Mono']">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detail */}
              <div className="rounded-xl border p-4 mb-4" style={{ background: `${severityColor(selected.severity)}06`, borderColor: `${severityColor(selected.severity)}20` }}>
                <p className="text-gray-300 text-sm leading-relaxed">{isAr ? selected.detailAr : selected.detail}</p>
              </div>

              {/* Linked streams */}
              <div className="mb-5">
                <p className="text-gray-500 text-xs mb-2">{isAr ? "التدفقات المرتبطة" : "Linked Streams"}</p>
                <div className="flex gap-2 flex-wrap">
                  {selected.linkedStreams.map((stream) => (
                    <span key={stream} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold font-['JetBrains_Mono']"
                      style={{ background: `${streamColor(stream)}12`, color: streamColor(stream), border: `1px solid ${streamColor(stream)}25` }}>
                      <i className="ri-links-line text-xs" />{stream}
                    </span>
                  ))}
                </div>
              </div>

              {/* Status update */}
              <div>
                <p className="text-gray-500 text-xs mb-2">{isAr ? "تحديث الحالة" : "Update Status"}</p>
                <div className="flex gap-2">
                  {(["open", "investigating", "resolved"] as const).map((s) => (
                    <button key={s} type="button" onClick={() => updateStatus(selected.id, s)}
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
            <div className="rounded-2xl border p-8 flex flex-col items-center justify-center text-center h-full min-h-[300px]" style={{ background: "rgba(20,29,46,0.5)", borderColor: "rgba(181,142,60,0.08)", backdropFilter: "blur(12px)" }}>
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl mb-4" style={{ background: "rgba(181,142,60,0.08)", border: "1px solid rgba(181,142,60,0.15)" }}>
                <i className="ri-bar-chart-grouped-line text-gold-400 text-2xl" />
              </div>
              <p className="text-gray-400 text-sm">{isAr ? "اختر تنبيهاً لعرض التفاصيل" : "Select an alert to view details"}</p>
            </div>
          )}
        </div>
      </div>

      {/* Detection rules */}
      <div className="rounded-2xl border p-5" style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.12)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(181,142,60,0.1)", border: "1px solid rgba(181,142,60,0.2)" }}>
            <i className="ri-cpu-line text-gold-400 text-sm" />
          </div>
          <h3 className="text-white font-bold text-sm">{isAr ? "قواعد الكشف التلقائي" : "Auto-Detection Rules"}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { icon: "ri-bar-chart-grouped-line", label: isAr ? "ارتفاع مفاجئ >300% من المتوسط" : "Sudden spike >300% of average", color: "#FB923C" },
            { icon: "ri-home-wifi-line", label: isAr ? "حساب نشط بدون إيجار مسجّل في البلدية" : "Active account, no rental in Municipality stream", color: "#F87171" },
            { icon: "ri-user-shared-line", label: isAr ? "حسابات متعددة لنفس الشخص في عناوين مختلفة" : "Multiple accounts same person, different addresses", color: "#FACC15" },
            { icon: "ri-ghost-line", label: isAr ? "توصيل في عنوان بدون ساكن مسجّل" : "Connection at address with no registered occupant", color: "#F87171" },
            { icon: "ri-store-line", label: isAr ? "نمط استهلاك تجاري على تعرفة سكنية" : "Commercial usage pattern on residential tariff", color: "#FB923C" },
            { icon: "ri-links-line", label: isAr ? "اتصال إنترنت = مرساة البصمة الرقمية" : "Internet connection = digital footprint anchor", color: "#D4A84B" },
          ].map((rule) => (
            <div key={rule.label} className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="w-6 h-6 flex items-center justify-center rounded flex-shrink-0 mt-0.5" style={{ background: `${rule.color}12` }}>
                <i className={`${rule.icon} text-xs`} style={{ color: rule.color }} />
              </div>
              <span className="text-gray-300 text-xs leading-relaxed">{rule.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsageAnomalyPanel;
