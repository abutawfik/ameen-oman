import { useState } from "react";

interface Props { isAr: boolean; }

const PERSONS = [
  {
    id: "P001",
    name: "Reza Tehrani",
    nameAr: "رضا طهراني",
    nationality: "Iran",
    flag: "🇮🇷",
    docNumber: "IR-3312-F",
    riskLevel: "critical" as const,
    totalFlagged: 12,
    totalSpend: "OMR 4,820",
    employmentSalary: "OMR 450/mo",
    paymentMethods: 4,
    purchases: [
      { date: "2026-04-04", item: "Prepaid SIM cards × 50", category: "Electronics", amount: "OMR 125", method: "Cash", risk: "critical" as const, flag: "Bulk SIM purchase — structuring pattern" },
      { date: "2026-04-02", item: "Satellite phone Iridium 9575", category: "Communication", amount: "OMR 890", method: "Visa Card #4521", risk: "high" as const, flag: "Restricted communication device" },
      { date: "2026-03-28", item: "Laptop × 3 units", category: "Electronics", amount: "OMR 1,200", method: "Cash", risk: "high" as const, flag: "Bulk electronics — cash payment" },
      { date: "2026-03-20", item: "GPS tracker × 6", category: "Surveillance", amount: "OMR 240", method: "Mastercard #8834", risk: "medium" as const, flag: "Surveillance equipment" },
      { date: "2026-03-15", item: "iTunes gift cards × 30", category: "Prepaid Cards", amount: "OMR 300", method: "Cash", risk: "high" as const, flag: "Bulk prepaid cards — money laundering indicator" },
    ],
    crossStream: {
      financial: "4 payment cards, avg monthly spend 8× salary",
      employment: "Construction worker, OMR 450/mo salary",
      border: "Entered 2025-11-12, no exit recorded",
      transport: "Frequent trips to Buraimi border area",
    },
  },
  {
    id: "P002",
    name: "Priya Nair",
    nameAr: "بريا ناير",
    nationality: "India",
    flag: "🇮🇳",
    docNumber: "IN-7823-P",
    riskLevel: "medium" as const,
    totalFlagged: 3,
    totalSpend: "OMR 1,240",
    employmentSalary: "OMR 1,200/mo",
    paymentMethods: 2,
    purchases: [
      { date: "2026-04-01", item: "iPhone 15 Pro × 3", category: "Electronics", amount: "OMR 1,050", method: "Visa Card #2211", risk: "medium" as const, flag: "Bulk electronics purchase" },
      { date: "2026-03-10", item: "Drone DJI Mini 4 Pro", category: "Drones", amount: "OMR 190", method: "Visa Card #2211", risk: "low" as const, flag: "Drone purchase — registration required" },
    ],
    crossStream: {
      financial: "2 payment cards, spend consistent with salary",
      employment: "IT Specialist, OMR 1,200/mo salary",
      border: "Resident visa, valid until 2027",
      transport: "Regular commute pattern, no anomalies",
    },
  },
  {
    id: "P003",
    name: "Mohammed Al-Rashidi",
    nameAr: "محمد الراشدي",
    nationality: "Yemen",
    flag: "🇾🇪",
    docNumber: "YE-4421-M",
    riskLevel: "high" as const,
    totalFlagged: 7,
    totalSpend: "OMR 2,890",
    employmentSalary: "OMR 320/mo",
    paymentMethods: 6,
    purchases: [
      { date: "2026-04-03", item: "Signal jammer device", category: "Communication", amount: "OMR 450", method: "Cash", risk: "critical" as const, flag: "Illegal device — signal jamming prohibited" },
      { date: "2026-03-25", item: "Ammonium nitrate 25kg", category: "Chemicals", amount: "OMR 85", method: "Cash", risk: "critical" as const, flag: "Monitored chemical — quantity threshold exceeded" },
      { date: "2026-03-18", item: "Crypto vouchers × 20", category: "Prepaid Cards", amount: "OMR 600", method: "Multiple cards", risk: "high" as const, flag: "Structuring — multiple small transactions" },
      { date: "2026-03-05", item: "Encrypted radio × 3", category: "Communication", amount: "OMR 720", method: "Cash", risk: "high" as const, flag: "Restricted communication equipment" },
    ],
    crossStream: {
      financial: "6 payment cards, spend 9× monthly salary",
      employment: "Retail worker, OMR 320/mo salary",
      border: "Tourist visa — overstay 45 days",
      transport: "Frequent trips to industrial zones",
    },
  },
];

const riskColor = (r: "low" | "medium" | "high" | "critical") => {
  if (r === "low") return "#4ADE80";
  if (r === "medium") return "#FACC15";
  if (r === "high") return "#FB923C";
  return "#F87171";
};

const streamColor = (key: string) => {
  const map: Record<string, string> = { financial: "#4ADE80", employment: "#F9A8D4", border: "#A78BFA", transport: "#FB923C" };
  return map[key] || "#9CA3AF";
};

const streamIcon = (key: string) => {
  const map: Record<string, string> = { financial: "ri-bank-card-line", employment: "ri-briefcase-line", border: "ri-passport-line", transport: "ri-bus-line" };
  return map[key] || "ri-information-line";
};

const PersonPurchaseProfile = ({ isAr }: Props) => {
  const [selectedPerson, setSelectedPerson] = useState<string>(PERSONS[0].id);
  const person = PERSONS.find((p) => p.id === selectedPerson)!;
  const rc = riskColor(person.riskLevel);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Person list */}
      <div className="space-y-3">
        <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-widest font-['JetBrains_Mono'] px-1">
          {isAr ? "الأشخاص المُبلَّغ عنهم" : "Flagged Persons"}
        </h3>
        {PERSONS.map((p) => {
          const prc = riskColor(p.riskLevel);
          const isActive = selectedPerson === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedPerson(p.id)}
              className="w-full flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all text-left"
              style={{
                background: isActive ? `${prc}10` : "rgba(10,22,40,0.8)",
                borderColor: isActive ? `${prc}40` : "rgba(34,211,238,0.1)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="text-2xl flex-shrink-0">{p.flag}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white text-sm font-bold truncate">{isAr ? p.nameAr : p.name}</span>
                  <span className="px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ background: `${prc}15`, color: prc, fontSize: "9px" }}>
                    {p.riskLevel.toUpperCase()}
                  </span>
                </div>
                <div className="text-gray-500 text-xs font-['JetBrains_Mono']">{p.docNumber}</div>
                <div className="text-xs mt-1" style={{ color: prc }}>
                  {p.totalFlagged} {isAr ? "تنبيه" : "flags"} · {p.totalSpend}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Purchase timeline + cross-stream */}
      <div className="lg:col-span-2 space-y-4">
        {/* Person header */}
        <div className="rounded-2xl border p-5" style={{ background: "rgba(10,22,40,0.8)", borderColor: `${rc}25`, backdropFilter: "blur(12px)" }}>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="text-4xl">{person.flag}</div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white text-lg font-bold">{isAr ? person.nameAr : person.name}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: `${rc}15`, color: rc, border: `1px solid ${rc}30` }}>
                    {person.riskLevel.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="text-gray-400 text-xs font-['JetBrains_Mono']">{person.docNumber}</span>
                  <span className="text-gray-600 text-xs">·</span>
                  <span className="text-gray-400 text-xs">{person.nationality}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: isAr ? "تنبيهات" : "Flags", value: person.totalFlagged, color: rc },
                { label: isAr ? "الإنفاق" : "Total Spend", value: person.totalSpend, color: "#22D3EE" },
                { label: isAr ? "بطاقات" : "Cards", value: person.paymentMethods, color: "#FACC15" },
              ].map((stat) => (
                <div key={stat.label} className="px-3 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="text-lg font-black font-['JetBrains_Mono']" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="text-gray-500 text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Cross-stream */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            {Object.entries(person.crossStream).map(([key, val]) => {
              const sc = streamColor(key);
              return (
                <div key={key} className="flex items-start gap-2 px-3 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${sc}15` }}>
                  <div className="w-6 h-6 flex items-center justify-center rounded-lg flex-shrink-0 mt-0.5" style={{ background: `${sc}12` }}>
                    <i className={`${streamIcon(key)} text-xs`} style={{ color: sc }} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider font-['JetBrains_Mono']" style={{ color: sc, fontSize: "9px" }}>{key}</p>
                    <p className="text-gray-400 text-xs">{val}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Purchase timeline */}
        <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(34,211,238,0.12)", backdropFilter: "blur(12px)" }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(34,211,238,0.08)" }}>
            <h3 className="text-white font-bold text-sm">{isAr ? "سجل المشتريات المُبلَّغة" : "Flagged Purchase History"}</h3>
          </div>
          <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
            {person.purchases.map((p, i) => {
              const prc = riskColor(p.risk);
              return (
                <div key={i} className="px-5 py-4 hover:bg-white/[0.02] transition-colors" style={{ borderLeft: `3px solid ${prc}` }}>
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-white text-sm font-semibold">{p.item}</span>
                        <span className="px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ background: `${prc}15`, color: prc, fontSize: "9px" }}>{p.risk.toUpperCase()}</span>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-gray-500 text-xs font-['JetBrains_Mono']">{p.date}</span>
                        <span className="text-gray-600 text-xs">·</span>
                        <span className="text-gray-400 text-xs">{p.category}</span>
                        <span className="text-gray-600 text-xs">·</span>
                        <span className="text-gray-400 text-xs">{p.method}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-2 px-2 py-1 rounded-lg w-fit" style={{ background: `${prc}08`, border: `1px solid ${prc}15` }}>
                        <i className="ri-flag-line text-xs" style={{ color: prc }} />
                        <span className="text-xs" style={{ color: prc }}>{p.flag}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-white font-bold font-['JetBrains_Mono']">{p.amount}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonPurchaseProfile;
