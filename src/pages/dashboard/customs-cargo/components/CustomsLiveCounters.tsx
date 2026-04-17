import { useState, useEffect } from "react";
import { customsKpis, recentDeclarations } from "@/mocks/customsCargoData";

interface Props {
  isAr: boolean;
}

const channelColors: Record<string, string> = {
  green:   "#4ADE80",
  yellow:  "#FACC15",
  red:     "#C94A5E",
  pending: "#9CA3AF",
};

const typeLabels: Record<string, { en: string; ar: string; icon: string; color: string }> = {
  import:   { en: "Import",        ar: "استيراد",    icon: "ri-download-2-line",       color: "#D6B47E" },
  export:   { en: "Export",        ar: "تصدير",      icon: "ri-upload-2-line",         color: "#4ADE80" },
  transit:  { en: "Transit",       ar: "عبور",       icon: "ri-arrow-left-right-line", color: "#FACC15" },
  freezone: { en: "Free Zone",     ar: "منطقة حرة",  icon: "ri-store-2-line",          color: "#38BDF8" },
  seizure:  { en: "Seizure",       ar: "ضبط",        icon: "ri-shield-cross-line",     color: "#C94A5E" },
  personal: { en: "Personal Effects", ar: "أمتعة شخصية", icon: "ri-luggage-cart-line", color: "#A78BFA" },
};

const CustomsLiveCounters = ({ isAr }: Props) => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {customsKpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl p-4 flex flex-col gap-2"
            style={{
              background: "rgba(10,37,64,0.8)",
              border: "1px solid rgba(184,138,60,0.12)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: `${kpi.color}18` }}>
                <i className={`${kpi.icon} text-base`} style={{ color: kpi.color }} />
              </div>
              <span
                className="text-xs font-['JetBrains_Mono'] font-semibold px-1.5 py-0.5 rounded"
                style={{
                  color: kpi.deltaUp ? "#4ADE80" : "#C94A5E",
                  background: kpi.deltaUp ? "rgba(74,222,128,0.1)" : "rgba(201,74,94,0.1)",
                }}
              >
                {kpi.delta}
              </span>
            </div>
            <div>
              <p className="text-white text-xl font-bold font-['JetBrains_Mono']">{kpi.value}</p>
              <p className="text-gray-400 text-xs font-['Inter'] mt-0.5">
                {isAr ? kpi.labelAr : kpi.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Channel Distribution */}
      <div
        className="rounded-xl p-5"
        style={{ background: "rgba(10,37,64,0.8)", border: "1px solid rgba(184,138,60,0.12)" }}
      >
        <h3 className="text-white text-sm font-semibold font-['Inter'] mb-4">
          {isAr ? "توزيع قنوات الفحص" : "Inspection Channel Distribution"}
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Green Channel", labelAr: "القناة الخضراء", value: 1204, pct: 65, color: "#4ADE80", desc: "Auto-cleared", descAr: "تخليص تلقائي" },
            { label: "Yellow Review",  labelAr: "المراجعة الصفراء", value: 489, pct: 26, color: "#FACC15", desc: "Document review", descAr: "مراجعة وثائق" },
            { label: "Red Inspection", labelAr: "الفحص الأحمر",   value: 154, pct: 9,  color: "#C94A5E", desc: "Physical inspection", descAr: "فحص مادي" },
          ].map((ch) => (
            <div key={ch.label} className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-2">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15.9" fill="none"
                    stroke={ch.color} strokeWidth="3"
                    strokeDasharray={`${ch.pct} ${100 - ch.pct}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-xs font-bold font-['JetBrains_Mono']">{ch.pct}%</span>
                </div>
              </div>
              <p className="text-white text-lg font-bold font-['JetBrains_Mono']">{ch.value.toLocaleString()}</p>
              <p className="font-semibold text-xs font-['Inter']" style={{ color: ch.color }}>
                {isAr ? ch.labelAr : ch.label}
              </p>
              <p className="text-gray-500 text-xs font-['Inter']">{isAr ? ch.descAr : ch.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Declarations Feed */}
      <div
        className="rounded-xl p-5"
        style={{ background: "rgba(10,37,64,0.8)", border: "1px solid rgba(184,138,60,0.12)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-sm font-semibold font-['Inter']">
            {isAr ? "آخر الإقرارات الجمركية" : "Recent Customs Declarations"}
          </h3>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
            <span className="text-gold-400 text-xs font-['JetBrains_Mono']">{isAr ? "مباشر" : "LIVE"}</span>
          </div>
        </div>
        <div className="space-y-2">
          {recentDeclarations.map((decl) => {
            const typeInfo = typeLabels[decl.type];
            return (
              <div
                key={decl.id}
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
              >
                <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0"
                  style={{ background: `${typeInfo.color}15` }}>
                  <i className={`${typeInfo.icon} text-sm`} style={{ color: typeInfo.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white text-xs font-semibold font-['JetBrains_Mono']">{decl.ref}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded font-['Inter']"
                      style={{ color: typeInfo.color, background: `${typeInfo.color}15` }}>
                      {isAr ? typeInfo.ar : typeInfo.en}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs font-['Inter'] truncate mt-0.5">{decl.declarant} — {decl.goods}</p>
                  <p className="text-gray-600 text-xs font-['Inter']">{decl.port}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-white text-xs font-bold font-['JetBrains_Mono']">{decl.value}</p>
                  <div className="flex items-center gap-1 justify-end mt-1">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: channelColors[decl.channel] }} />
                    <span className="text-xs font-['JetBrains_Mono'] capitalize" style={{ color: channelColors[decl.channel] }}>
                      {decl.channel}
                    </span>
                  </div>
                  <p className="text-gray-600 text-xs font-['JetBrains_Mono'] mt-0.5">{decl.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Port Activity */}
      <div
        className="rounded-xl p-5"
        style={{ background: "rgba(10,37,64,0.8)", border: "1px solid rgba(184,138,60,0.12)" }}
      >
        <h3 className="text-white text-sm font-semibold font-['Inter'] mb-4">
          {isAr ? "نشاط المنافذ" : "Port Activity"}
        </h3>
        <div className="space-y-3">
          {[
            { name: "Capital International Airport", nameAr: "مطار العاصمة الدولي",    count: 612, pct: 33, color: "#D6B47E" },
            { name: "Capital Seaport",               nameAr: "الميناء البحري للعاصمة", count: 489, pct: 26, color: "#4ADE80" },
            { name: "Northern Port",                 nameAr: "الميناء الشمالي",         count: 334, pct: 18, color: "#A78BFA" },
            { name: "Eastern Land Crossing",         nameAr: "المنفذ البري الشرقي",     count: 223, pct: 12, color: "#FACC15" },
            { name: "Free Trade Zones",              nameAr: "المناطق الحرة",           count: 189, pct: 11, color: "#38BDF8" },
          ].map((port) => (
            <div key={port.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-300 text-xs font-['Inter']">{isAr ? port.nameAr : port.name}</span>
                <span className="text-white text-xs font-bold font-['JetBrains_Mono']">{port.count}</span>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${port.pct}%`, background: port.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomsLiveCounters;
