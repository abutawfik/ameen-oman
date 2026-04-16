import { useState, useEffect } from "react";

interface Props { isAr: boolean; }

type TxType = "bulk" | "restricted" | "highvalue" | "shipping" | "pattern";
type FilterType = "all" | TxType;

interface Transaction {
  id: string;
  ref: string;
  type: TxType;
  item: string;
  itemAr: string;
  person: string;
  personAr: string;
  flag: string;
  amount: string;
  method: string;
  retailer: string;
  time: string;
  risk: "critical" | "high" | "medium" | "low";
  flagReason: string;
  flagReasonAr: string;
}

const INITIAL_FEED: Transaction[] = [
  { id: "t1", ref: "AMN-ECM-20260405-0247", type: "restricted", item: "Signal Jammer SJ-Pro 4G", itemAr: "مشوش إشارة SJ-Pro 4G", person: "Mohammed Al-Rashidi", personAr: "محمد الراشدي", flag: "🇾🇪", amount: "OMR 450", method: "Cash", retailer: "Online Platform", time: "3 min ago", risk: "critical", flagReason: "Illegal device — signal jamming prohibited", flagReasonAr: "جهاز غير قانوني — التشويش محظور" },
  { id: "t2", ref: "AMN-ECM-20260405-0246", type: "bulk", item: "Prepaid SIM Cards × 50", itemAr: "شرائح SIM مدفوعة × 50", person: "Reza Tehrani", personAr: "رضا طهراني", flag: "🇮🇷", amount: "OMR 125", method: "Cash", retailer: "Omantel Store", time: "14 min ago", risk: "critical", flagReason: "Bulk SIM purchase — exceeds personal use threshold", flagReasonAr: "شراء شرائح بالجملة — يتجاوز حد الاستخدام الشخصي" },
  { id: "t3", ref: "AMN-ECM-20260405-0245", type: "highvalue", item: "iPhone 15 Pro × 12 units", itemAr: "آيفون 15 برو × 12 وحدة", person: "Unknown Buyer", personAr: "مشترٍ مجهول", flag: "🏳️", amount: "OMR 4,200", method: "Visa Card #7821", retailer: "Oman Electronics", time: "22 min ago", risk: "high", flagReason: "High-value bulk electronics — identity unverified", flagReasonAr: "إلكترونيات بالجملة عالية القيمة — هوية غير مؤكدة" },
  { id: "t4", ref: "AMN-ECM-20260405-0244", type: "pattern", item: "Multiple small transactions", itemAr: "معاملات صغيرة متعددة", person: "Mohammed Al-Rashidi", personAr: "محمد الراشدي", flag: "🇾🇪", amount: "OMR 89 × 6", method: "6 different cards", retailer: "Various", time: "38 min ago", risk: "high", flagReason: "Structuring pattern — 6 cards below reporting threshold", flagReasonAr: "نمط تجزئة — 6 بطاقات أقل من حد الإبلاغ" },
  { id: "t5", ref: "AMN-ECM-20260405-0243", type: "shipping", item: "Electronics package from China", itemAr: "طرد إلكترونيات من الصين", person: "Reza Tehrani", personAr: "رضا طهراني", flag: "🇮🇷", amount: "OMR 1,800", method: "Online payment", retailer: "AliExpress", time: "51 min ago", risk: "high", flagReason: "International shipment — contents declaration mismatch", flagReasonAr: "شحنة دولية — عدم تطابق إعلان المحتويات" },
  { id: "t6", ref: "AMN-ECM-20260405-0242", type: "restricted", item: "Ammonium Nitrate 25kg", itemAr: "نترات الأمونيوم 25 كجم", person: "Mohammed Al-Rashidi", personAr: "محمد الراشدي", flag: "🇾🇪", amount: "OMR 85", method: "Cash", retailer: "Nizwa Agricultural Supply", time: "1.2 hr ago", risk: "critical", flagReason: "Monitored chemical — no agricultural license", flagReasonAr: "مادة كيميائية مراقبة — لا يوجد ترخيص زراعي" },
  { id: "t7", ref: "AMN-ECM-20260405-0241", type: "bulk", item: "iTunes Gift Cards × 30", itemAr: "بطاقات iTunes × 30", person: "Reza Tehrani", personAr: "رضا طهراني", flag: "🇮🇷", amount: "OMR 300", method: "Cash", retailer: "Lulu Hypermarket", time: "1.8 hr ago", risk: "high", flagReason: "Bulk prepaid cards — money laundering indicator", flagReasonAr: "بطاقات مدفوعة مسبقاً بالجملة — مؤشر غسيل أموال" },
  { id: "t8", ref: "AMN-ECM-20260405-0240", type: "restricted", item: "GPS Tracker × 6 units", itemAr: "جهاز تتبع GPS × 6 وحدات", person: "Reza Tehrani", personAr: "رضا طهراني", flag: "🇮🇷", amount: "OMR 240", method: "Mastercard #8834", retailer: "Oman Electronics", time: "2.1 hr ago", risk: "medium", flagReason: "Surveillance equipment — bulk purchase", flagReasonAr: "معدات مراقبة — شراء بالجملة" },
];

const typeConfig: Record<TxType, { label: string; labelAr: string; color: string; icon: string }> = {
  bulk:       { label: "Bulk Purchase",   labelAr: "شراء بالجملة",    color: "#FACC15", icon: "ri-stack-line" },
  restricted: { label: "Restricted Item", labelAr: "عنصر مقيّد",      color: "#F87171", icon: "ri-forbid-line" },
  highvalue:  { label: "High-Value",      labelAr: "قيمة عالية",      color: "#FB923C", icon: "ri-money-dollar-circle-line" },
  shipping:   { label: "Shipping Alert",  labelAr: "تنبيه شحن",       color: "#A78BFA", icon: "ri-ship-line" },
  pattern:    { label: "Payment Pattern", labelAr: "نمط دفع",         color: "#22D3EE", icon: "ri-exchange-line" },
};

const riskColor = (r: Transaction["risk"]) => {
  if (r === "low") return "#4ADE80";
  if (r === "medium") return "#FACC15";
  if (r === "high") return "#FB923C";
  return "#F87171";
};

const FlaggedTransactionFeed = ({ isAr }: Props) => {
  const [feed, setFeed] = useState<Transaction[]>(INITIAL_FEED);
  const [filter, setFilter] = useState<FilterType>("all");
  const [counter, setCounter] = useState(248);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((v) => v + 1);
      const newTx: Transaction = {
        id: `t-${Date.now()}`,
        ref: `AMN-ECM-20260405-0${counter}`,
        type: (["bulk", "restricted", "highvalue", "pattern"] as TxType[])[Math.floor(Math.random() * 4)],
        item: ["Laptop × 3", "Prepaid cards × 20", "Drone DJI", "Crypto vouchers × 10"][Math.floor(Math.random() * 4)],
        itemAr: ["لابتوب × 3", "بطاقات مدفوعة × 20", "طائرة مسيّرة DJI", "قسائم عملات × 10"][Math.floor(Math.random() * 4)],
        person: ["Unknown Buyer", "Reza Tehrani", "Mohammed Al-Rashidi"][Math.floor(Math.random() * 3)],
        personAr: ["مشترٍ مجهول", "رضا طهراني", "محمد الراشدي"][Math.floor(Math.random() * 3)],
        flag: ["🏳️", "🇮🇷", "🇾🇪"][Math.floor(Math.random() * 3)],
        amount: `OMR ${Math.floor(Math.random() * 2000 + 100)}`,
        method: ["Cash", "Visa Card", "Mastercard"][Math.floor(Math.random() * 3)],
        retailer: ["Lulu Hypermarket", "Oman Electronics", "Online Platform"][Math.floor(Math.random() * 3)],
        time: "just now",
        risk: (["high", "medium", "critical"] as Transaction["risk"][])[Math.floor(Math.random() * 3)],
        flagReason: "Auto-detected anomaly",
        flagReasonAr: "شذوذ مكتشف تلقائياً",
      };
      setFeed((prev) => [newTx, ...prev.slice(0, 19)]);
    }, 7000);
    return () => clearInterval(interval);
  }, [counter]);

  const FILTERS: { id: FilterType; label: string; labelAr: string }[] = [
    { id: "all", label: "All", labelAr: "الكل" },
    { id: "bulk", label: "Bulk", labelAr: "جملة" },
    { id: "restricted", label: "Restricted", labelAr: "مقيّد" },
    { id: "highvalue", label: "High-Value", labelAr: "عالي القيمة" },
    { id: "shipping", label: "Shipping", labelAr: "شحن" },
    { id: "pattern", label: "Pattern", labelAr: "نمط" },
  ];

  const filtered = filter === "all" ? feed : feed.filter((t) => t.type === filter);

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button key={f.id} type="button" onClick={() => setFilter(f.id)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all whitespace-nowrap"
            style={{
              background: filter === f.id ? "rgba(34,211,238,0.15)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${filter === f.id ? "rgba(34,211,238,0.35)" : "rgba(255,255,255,0.08)"}`,
              color: filter === f.id ? "#22D3EE" : "#6B7280",
            }}>
            {isAr ? f.labelAr : f.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg border" style={{ background: "rgba(74,222,128,0.06)", borderColor: "rgba(74,222,128,0.2)" }}>
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400 text-xs font-semibold font-['JetBrains_Mono']">LIVE</span>
        </div>
      </div>

      {/* Feed */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(34,211,238,0.12)", backdropFilter: "blur(12px)" }}>
        <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
          {filtered.map((tx) => {
            const tc = typeConfig[tx.type];
            const rc = riskColor(tx.risk);
            return (
              <div key={tx.id} className="flex items-start gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors" style={{ borderLeft: `3px solid ${rc}` }}>
                {/* Type icon */}
                <div className="w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0 mt-0.5" style={{ background: `${tc.color}12`, border: `1px solid ${tc.color}25` }}>
                  <i className={`${tc.icon} text-sm`} style={{ color: tc.color }} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-white text-sm font-semibold">{isAr ? tx.itemAr : tx.item}</span>
                    <span className="px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ background: `${tc.color}12`, color: tc.color, fontSize: "9px" }}>
                      {isAr ? tc.labelAr : tc.label}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ background: `${rc}12`, color: rc, fontSize: "9px" }}>
                      {tx.risk.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-base">{tx.flag}</span>
                    <span className="text-gray-400 text-xs">{isAr ? tx.personAr : tx.person}</span>
                    <span className="text-gray-600 text-xs">·</span>
                    <span className="text-gray-500 text-xs">{tx.retailer}</span>
                    <span className="text-gray-600 text-xs">·</span>
                    <span className="text-gray-500 text-xs">{tx.method}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg w-fit" style={{ background: `${rc}08`, border: `1px solid ${rc}15` }}>
                    <i className="ri-flag-line text-xs" style={{ color: rc }} />
                    <span className="text-xs" style={{ color: rc }}>{isAr ? tx.flagReasonAr : tx.flagReason}</span>
                  </div>
                </div>

                {/* Right */}
                <div className="text-right flex-shrink-0">
                  <div className="text-white font-bold font-['JetBrains_Mono'] text-sm">{tx.amount}</div>
                  <div className="text-gray-600 text-xs font-['JetBrains_Mono'] mt-0.5">{tx.time}</div>
                  <div className="text-gray-700 text-xs font-['JetBrains_Mono'] mt-0.5" style={{ fontSize: "9px" }}>{tx.ref}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FlaggedTransactionFeed;
