import { useState } from "react";

interface Props { isAr: boolean; }

const PROVIDERS = [
  { id: "nat-bus", name: "National Bus Co.", nameAr: "شركة الحافلات الوطنية", type: "Government Bus", typeAr: "حافلة حكومية", icon: "ri-bus-line", color: "#22D3EE", status: "online" as const, tripsToday: 14821, matchRate: 94, lastSync: "14:32:07" },
  { id: "taxi-a", name: "Taxi Co. A", nameAr: "شركة التاكسي أ", type: "Licensed Taxi", typeAr: "تاكسي مرخّص", icon: "ri-taxi-line", color: "#4ADE80", status: "online" as const, tripsToday: 3247, matchRate: 87, lastSync: "14:31:55" },
  { id: "ridehail-a", name: "Ride-Hail App A", nameAr: "تطبيق التوصيل أ", type: "Ride-Hailing App", typeAr: "تطبيق توصيل", icon: "ri-car-line", color: "#A78BFA", status: "online" as const, tripsToday: 5412, matchRate: 78, lastSync: "14:32:01" },
  { id: "ridehail-b", name: "Ride-Hail App B", nameAr: "تطبيق التوصيل ب", type: "Ride-Hailing App", typeAr: "تطبيق توصيل", icon: "ri-car-line", color: "#FB923C", status: "online" as const, tripsToday: 3522, matchRate: 72, lastSync: "14:30:44" },
];

const MATCH_METHODS = [
  { id: "transit-card", icon: "ri-bank-card-line", label: "Transit Card → Document", labelAr: "بطاقة عبور → وثيقة", enabled: true, color: "#22D3EE", matched: 8241 },
  { id: "phone", icon: "ri-smartphone-line", label: "Phone Number → SIM Stream", labelAr: "رقم الهاتف → تدفق SIM", enabled: true, color: "#4ADE80", matched: 6134 },
  { id: "payment-card", icon: "ri-secure-payment-line", label: "Payment Card → Financial Stream", labelAr: "بطاقة دفع → التدفق المالي", enabled: true, color: "#A78BFA", matched: 3892 },
  { id: "anonymous", icon: "ri-user-unfollow-line", label: "Anonymous (no match)", labelAr: "مجهول (لا تطابق)", enabled: false, color: "#9CA3AF", matched: 1546 },
];

const TransportFeedConfig = ({ isAr }: Props) => {
  const [methods, setMethods] = useState(MATCH_METHODS);

  const toggleMethod = (id: string) => {
    setMethods((prev) => prev.map((m) => m.id === id ? { ...m, enabled: !m.enabled } : m));
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: isAr ? "إجمالي الرحلات اليوم" : "Total Trips Today", value: "27,002", color: "#22D3EE", icon: "ri-route-line" },
          { label: isAr ? "المزودون النشطون" : "Active Providers", value: `${PROVIDERS.filter(p => p.status === "online").length}/${PROVIDERS.length}`, color: "#4ADE80", icon: "ri-server-line" },
          { label: isAr ? "معدل التطابق" : "Overall Match Rate", value: "83%", color: "#A78BFA", icon: "ri-fingerprint-line" },
          { label: isAr ? "رحلات مجهولة" : "Anonymous Trips", value: "1,546", color: "#9CA3AF", icon: "ri-user-unfollow-line" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border p-4" style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(34,211,238,0.12)", backdropFilter: "blur(12px)" }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 flex items-center justify-center rounded-lg" style={{ background: `${stat.color}15` }}>
                <i className={`${stat.icon} text-xs`} style={{ color: stat.color }} />
              </div>
              <span className="text-gray-500 text-xs">{stat.label}</span>
            </div>
            <div className="text-2xl font-black font-['JetBrains_Mono']" style={{ color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Provider status */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(34,211,238,0.15)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-3 px-6 py-4 border-b" style={{ borderColor: "rgba(34,211,238,0.1)" }}>
          <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)" }}>
            <i className="ri-server-line text-cyan-400 text-sm" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">{isAr ? "مزودو النقل" : "Transport Providers"}</h3>
            <p className="text-gray-500 text-xs">{isAr ? "تغذية API مباشرة" : "Real-time API feed"}</p>
          </div>
        </div>
        <div className="divide-y" style={{ borderColor: "rgba(34,211,238,0.06)" }}>
          {PROVIDERS.map((p) => (
            <div key={p.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0" style={{ background: `${p.color}12`, border: `1px solid ${p.color}25` }}>
                <i className={`${p.icon} text-base`} style={{ color: p.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-white font-semibold text-sm">{isAr ? p.nameAr : p.name}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-400 text-xs font-semibold font-['JetBrains_Mono']">ONLINE</span>
                </div>
                <p className="text-gray-500 text-xs">{isAr ? p.typeAr : p.type}</p>
              </div>
              <div className="hidden md:block text-center">
                <div className="text-white font-bold text-sm font-['JetBrains_Mono']">{p.tripsToday.toLocaleString()}</div>
                <div className="text-gray-500 text-xs">{isAr ? "رحلات اليوم" : "trips today"}</div>
              </div>
              <div className="hidden lg:block text-center">
                <div className="text-sm font-bold font-['JetBrains_Mono']" style={{ color: p.matchRate > 85 ? "#4ADE80" : p.matchRate > 70 ? "#FACC15" : "#FB923C" }}>{p.matchRate}%</div>
                <div className="text-gray-500 text-xs">{isAr ? "معدل التطابق" : "match rate"}</div>
              </div>
              <div className="hidden lg:block text-right">
                <div className="text-cyan-400 text-xs font-['JetBrains_Mono']">{p.lastSync}</div>
                <div className="text-gray-500 text-xs">{isAr ? "آخر مزامنة" : "last sync"}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Identity matching methods */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(34,211,238,0.15)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-3 px-6 py-4 border-b" style={{ borderColor: "rgba(34,211,238,0.1)" }}>
          <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)" }}>
            <i className="ri-fingerprint-line text-cyan-400 text-sm" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">{isAr ? "طرق تطابق الهوية" : "Identity Matching Methods"}</h3>
            <p className="text-gray-500 text-xs">{isAr ? "كيف يربط AMEEN الرحلات بالأشخاص" : "How AMEEN links trips to persons"}</p>
          </div>
        </div>
        <div className="divide-y" style={{ borderColor: "rgba(34,211,238,0.06)" }}>
          {methods.map((m) => (
            <div key={m.id} className="flex items-center gap-4 px-6 py-4">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${m.color}12`, border: `1px solid ${m.color}25` }}>
                <i className={`${m.icon} text-sm`} style={{ color: m.color }} />
              </div>
              <div className="flex-1">
                <div className="text-white text-sm font-semibold">{isAr ? m.labelAr : m.label}</div>
                <div className="text-gray-500 text-xs">{m.matched.toLocaleString()} {isAr ? "تطابق اليوم" : "matches today"}</div>
              </div>
              <button type="button" onClick={() => toggleMethod(m.id)}
                className="relative w-10 h-5 rounded-full transition-all duration-300 flex-shrink-0 cursor-pointer"
                style={{ background: m.enabled ? "#22D3EE" : "rgba(255,255,255,0.1)" }}>
                <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm"
                  style={{ left: m.enabled ? "calc(100% - 18px)" : "2px" }} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy note */}
      <div className="flex items-start gap-3 px-5 py-4 rounded-xl border" style={{ background: "rgba(34,211,238,0.04)", borderColor: "rgba(34,211,238,0.15)" }}>
        <i className="ri-shield-check-line text-cyan-400 text-sm mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-cyan-400 text-xs font-bold mb-0.5">{isAr ? "توازن الخصوصية" : "Privacy Balance"}</p>
          <p className="text-gray-400 text-xs">
            {isAr
              ? "AMEEN يستقبل بيانات على مستوى المسار، وليس تتبع GPS في الوقت الفعلي. التحليل استرجاعي. البيانات المجهولة تُحتفظ بها مجهولة ما لم تُطابق بواسطة تدفق آخر."
              : "AMEEN receives route-level data, not real-time GPS tracking. Pattern analysis is retrospective. Anonymous data stays anonymous unless matched by another stream."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransportFeedConfig;
