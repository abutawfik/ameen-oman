import { useState } from "react";

interface Props { isAr: boolean; }

const CATEGORIES = [
  {
    id: "electronics",
    icon: "ri-cpu-line",
    label: "Electronics",
    labelAr: "الإلكترونيات",
    color: "#D4A84B",
    count: 89,
    trend: "+12%",
    trendUp: false,
    threshold: "5+ units",
    thresholdAr: "5+ وحدات",
    desc: "Laptops, phones, tablets, SIM-enabled devices",
    descAr: "أجهزة كمبيوتر، هواتف، أجهزة لوحية، أجهزة SIM",
    recentFlags: [
      { item: "iPhone 15 Pro × 12", time: "14 min ago", risk: "high" as const },
      { item: "Laptop × 8 units", time: "1.2 hr ago", risk: "medium" as const },
      { item: "Prepaid SIM cards × 50", time: "2.4 hr ago", risk: "critical" as const },
    ],
  },
  {
    id: "chemicals",
    icon: "ri-flask-line",
    label: "Chemicals",
    labelAr: "المواد الكيميائية",
    color: "#F87171",
    count: 14,
    trend: "+3",
    trendUp: false,
    threshold: "Any quantity",
    thresholdAr: "أي كمية",
    desc: "Monitored chemical compounds, precursors",
    descAr: "مركبات كيميائية مراقبة، مواد أولية",
    recentFlags: [
      { item: "Ammonium nitrate 25kg", time: "3 hr ago", risk: "critical" as const },
      { item: "Acetone 10L × 4", time: "5 hr ago", risk: "high" as const },
    ],
  },
  {
    id: "communication",
    icon: "ri-radio-line",
    label: "Communication Devices",
    labelAr: "أجهزة الاتصال",
    color: "#FB923C",
    count: 22,
    trend: "+5",
    trendUp: false,
    threshold: "Restricted models",
    thresholdAr: "طرازات مقيّدة",
    desc: "Satellite phones, signal jammers, encrypted radios",
    descAr: "هواتف فضائية، مشوشات إشارة، راديو مشفر",
    recentFlags: [
      { item: "Satellite phone Iridium", time: "45 min ago", risk: "high" as const },
      { item: "Signal jammer device", time: "2 hr ago", risk: "critical" as const },
      { item: "Encrypted radio × 3", time: "4 hr ago", risk: "high" as const },
    ],
  },
  {
    id: "drones",
    icon: "ri-flight-takeoff-line",
    label: "Drones & UAVs",
    labelAr: "الطائرات المسيّرة",
    color: "#A78BFA",
    count: 7,
    trend: "+2",
    trendUp: false,
    threshold: "Commercial grade",
    thresholdAr: "درجة تجارية",
    desc: "Commercial drones, FPV systems, payload-capable UAVs",
    descAr: "طائرات مسيّرة تجارية، أنظمة FPV، طائرات بحمولة",
    recentFlags: [
      { item: "DJI Matrice 300 RTK", time: "2.1 hr ago", risk: "high" as const },
      { item: "FPV racing drone kit × 2", time: "6 hr ago", risk: "medium" as const },
    ],
  },
  {
    id: "surveillance",
    icon: "ri-spy-line",
    label: "Surveillance Equipment",
    labelAr: "معدات المراقبة",
    color: "#FACC15",
    count: 11,
    trend: "+1",
    trendUp: false,
    threshold: "Any purchase",
    thresholdAr: "أي شراء",
    desc: "Hidden cameras, tracking devices, IMSI catchers",
    descAr: "كاميرات مخفية، أجهزة تتبع، ماسحات IMSI",
    recentFlags: [
      { item: "GPS tracker × 6", time: "1 hr ago", risk: "medium" as const },
      { item: "Hidden camera pen × 4", time: "3.5 hr ago", risk: "high" as const },
    ],
  },
  {
    id: "prepaid",
    icon: "ri-bank-card-line",
    label: "Prepaid Cards",
    labelAr: "البطاقات المدفوعة مسبقاً",
    color: "#34D399",
    count: 104,
    trend: "+18%",
    trendUp: false,
    threshold: "10+ cards",
    thresholdAr: "10+ بطاقات",
    desc: "Prepaid payment cards, gift cards, crypto vouchers",
    descAr: "بطاقات دفع مسبق، بطاقات هدايا، قسائم عملات رقمية",
    recentFlags: [
      { item: "iTunes gift cards × 30", time: "22 min ago", risk: "high" as const },
      { item: "Visa prepaid × 15", time: "1.8 hr ago", risk: "medium" as const },
      { item: "Crypto vouchers × 20", time: "3 hr ago", risk: "high" as const },
    ],
  },
];

const riskColor = (r: "low" | "medium" | "high" | "critical") => {
  if (r === "low") return "#4ADE80";
  if (r === "medium") return "#FACC15";
  if (r === "high") return "#FB923C";
  return "#F87171";
};

const ItemCategoryMonitor = ({ isAr }: Props) => {
  const [selected, setSelected] = useState<string | null>(null);

  const selectedCat = CATEGORIES.find((c) => c.id === selected);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelected(selected === cat.id ? null : cat.id)}
            className="relative rounded-2xl border p-5 text-left cursor-pointer transition-all overflow-hidden"
            style={{
              background: selected === cat.id ? `${cat.color}10` : "rgba(20,29,46,0.8)",
              borderColor: selected === cat.id ? `${cat.color}50` : `${cat.color}20`,
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="absolute inset-0 opacity-5" style={{ background: `radial-gradient(circle at bottom left, ${cat.color}, transparent 70%)` }} />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl" style={{ background: `${cat.color}15`, border: `1px solid ${cat.color}30` }}>
                  <i className={`${cat.icon} text-lg`} style={{ color: cat.color }} />
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: "rgba(248,113,113,0.1)" }}>
                  <i className="ri-arrow-up-line text-red-400 text-xs" />
                  <span className="text-red-400 text-xs font-bold font-['JetBrains_Mono']">{cat.trend}</span>
                </div>
              </div>
              <div className="text-3xl font-black font-['JetBrains_Mono'] mb-1" style={{ color: cat.color }}>
                {cat.count}
              </div>
              <div className="text-white font-bold text-sm mb-0.5">{isAr ? cat.labelAr : cat.label}</div>
              <div className="text-gray-500 text-xs mb-2">{isAr ? cat.descAr : cat.desc}</div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: `${cat.color}08`, border: `1px solid ${cat.color}15` }}>
                <i className="ri-alarm-warning-line text-xs" style={{ color: cat.color }} />
                <span className="text-xs font-['JetBrains_Mono']" style={{ color: cat.color }}>
                  {isAr ? "الحد:" : "Threshold:"} {isAr ? cat.thresholdAr : cat.threshold}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Detail panel */}
      {selectedCat && (
        <div className="rounded-2xl border p-6" style={{ background: "rgba(20,29,46,0.9)", borderColor: `${selectedCat.color}30`, backdropFilter: "blur(16px)" }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl" style={{ background: `${selectedCat.color}15`, border: `1px solid ${selectedCat.color}30` }}>
                <i className={`${selectedCat.icon} text-lg`} style={{ color: selectedCat.color }} />
              </div>
              <div>
                <h3 className="text-white font-bold">{isAr ? selectedCat.labelAr : selectedCat.label}</h3>
                <p className="text-gray-500 text-xs">{isAr ? "أحدث التنبيهات المُبلَّغة" : "Most recent flagged alerts"}</p>
              </div>
            </div>
            <button type="button" onClick={() => setSelected(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
              <i className="ri-close-line text-gray-400" />
            </button>
          </div>
          <div className="space-y-3">
            {selectedCat.recentFlags.map((flag, i) => {
              const rc = riskColor(flag.risk);
              return (
                <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${rc}20`, borderLeft: `3px solid ${rc}` }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: `${rc}12` }}>
                      <i className={`${selectedCat.icon} text-sm`} style={{ color: rc }} />
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">{flag.item}</p>
                      <p className="text-gray-500 text-xs font-['JetBrains_Mono']">{flag.time}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: `${rc}15`, color: rc, border: `1px solid ${rc}30` }}>
                    {flag.risk.toUpperCase()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemCategoryMonitor;
