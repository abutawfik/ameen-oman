import { useState, useEffect } from "react";

interface Props { isAr: boolean; }

const EcomLiveCounters = ({ isAr }: Props) => {
  const [flaggedTx, setFlaggedTx] = useState(247);
  const [bulkAlerts, setBulkAlerts] = useState(38);
  const [restrictedItems, setRestrictedItems] = useState(14);
  const [shippingAlerts, setShippingAlerts] = useState(9);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlaggedTx((v) => v + Math.floor(Math.random() * 3));
      setBulkAlerts((v) => v + (Math.random() > 0.7 ? 1 : 0));
      setRestrictedItems((v) => v + (Math.random() > 0.9 ? 1 : 0));
      setShippingAlerts((v) => v + (Math.random() > 0.92 ? 1 : 0));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      label: isAr ? "معاملات مُبلَّغة اليوم" : "Flagged Transactions Today",
      sub: isAr ? "من المعالجين والبنوك" : "From processors & banks",
      value: flaggedTx,
      icon: "ri-flag-line",
      color: "#22D3EE",
      trend: "+11%",
      trendUp: true,
    },
    {
      label: isAr ? "تنبيهات الشراء بالجملة" : "Bulk Purchase Alerts",
      sub: isAr ? "كميات غير معتادة" : "Unusual quantities detected",
      value: bulkAlerts,
      icon: "ri-stack-line",
      color: "#FACC15",
      trend: "+4",
      trendUp: false,
    },
    {
      label: isAr ? "مشتريات مقيّدة" : "Restricted Item Purchases",
      sub: isAr ? "قائمة المراقبة" : "Monitored items list",
      value: restrictedItems,
      icon: "ri-forbid-line",
      color: "#F87171",
      trend: "+2",
      trendUp: false,
    },
    {
      label: isAr ? "تنبيهات الشحن" : "Shipping Alerts",
      sub: isAr ? "شحنات دولية مشبوهة" : "Suspicious intl. shipments",
      value: shippingAlerts,
      icon: "ri-ship-line",
      color: "#FB923C",
      trend: "+1",
      trendUp: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="relative rounded-2xl border p-5 overflow-hidden"
          style={{ background: "rgba(10,22,40,0.8)", borderColor: `${s.color}25`, backdropFilter: "blur(12px)" }}
        >
          <div className="absolute inset-0 opacity-5" style={{ background: `radial-gradient(circle at top right, ${s.color}, transparent 70%)` }} />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 flex items-center justify-center rounded-xl" style={{ background: `${s.color}15`, border: `1px solid ${s.color}30` }}>
                <i className={`${s.icon} text-base`} style={{ color: s.color }} />
              </div>
              <div
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-['JetBrains_Mono']"
                style={{
                  background: s.trendUp ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)",
                  color: s.trendUp ? "#4ADE80" : "#F87171",
                }}
              >
                <i className={s.trendUp ? "ri-arrow-up-line text-xs" : "ri-arrow-up-line text-xs"} />
                {s.trend}
              </div>
            </div>
            <div className="text-4xl font-black font-['JetBrains_Mono'] mb-1 tabular-nums" style={{ color: s.color }}>
              {s.value.toLocaleString()}
            </div>
            <div className="text-white font-semibold text-sm mb-0.5">{s.label}</div>
            <div className="text-gray-500 text-xs">{s.sub}</div>
            <div className="mt-3 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: s.color }} />
              <span className="text-xs font-['JetBrains_Mono']" style={{ color: s.color }}>LIVE</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EcomLiveCounters;
