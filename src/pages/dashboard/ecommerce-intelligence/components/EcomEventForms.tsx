import { useState } from "react";
import BulkPurchaseAlertForm from "./BulkPurchaseAlertForm";
import HighValueTransactionForm from "./HighValueTransactionForm";
import RestrictedItemForm from "./RestrictedItemForm";
import ShippingAlertForm from "./ShippingAlertForm";
import PaymentPatternForm from "./PaymentPatternForm";

interface Props { isAr: boolean; }

type EventType = "bulk" | "highvalue" | "restricted" | "shipping" | "pattern" | null;

const EVENT_TYPES: {
  id: EventType;
  icon: string;
  color: string;
  label: string;
  labelAr: string;
  desc: string;
  descAr: string;
  badge?: string;
  badgeColor?: string;
}[] = [
  {
    id: "bulk",
    icon: "ri-stack-line",
    color: "#FACC15",
    label: "Bulk Purchase Alert",
    labelAr: "تنبيه شراء بالجملة",
    desc: "Unusual quantities of monitored items exceeding threshold",
    descAr: "كميات غير معتادة من العناصر المراقبة تتجاوز الحد",
  },
  {
    id: "highvalue",
    icon: "ri-money-dollar-circle-line",
    color: "#FB923C",
    label: "High-Value Transaction",
    labelAr: "معاملة عالية القيمة",
    desc: "Single purchase above configurable threshold by category",
    descAr: "شراء واحد فوق الحد المُهيَّأ حسب الفئة",
  },
  {
    id: "restricted",
    icon: "ri-forbid-line",
    color: "#F87171",
    label: "Restricted Item Purchase",
    labelAr: "شراء عنصر مقيّد",
    desc: "Surveillance equipment, chemicals, drones, jammers",
    descAr: "معدات مراقبة، مواد كيميائية، طائرات مسيّرة، أجهزة تشويش",
    badge: "IMMEDIATE",
    badgeColor: "#F87171",
  },
  {
    id: "shipping",
    icon: "ri-ship-line",
    color: "#A78BFA",
    label: "Shipping Alert",
    labelAr: "تنبيه شحن",
    desc: "International shipments from high-risk origins or contents mismatch",
    descAr: "شحنات دولية من مصادر عالية المخاطر أو تناقض في المحتويات",
  },
  {
    id: "pattern",
    icon: "ri-exchange-line",
    color: "#D4A84B",
    label: "Payment Pattern",
    labelAr: "نمط الدفع",
    desc: "Multiple cards, structuring, location mismatch, high velocity",
    descAr: "بطاقات متعددة، تجزئة، تناقض موقع، تكرار عالٍ",
  },
];

const EcomEventForms = ({ isAr }: Props) => {
  const [selectedType, setSelectedType] = useState<EventType>(null);

  const handleCancel = () => setSelectedType(null);

  if (selectedType === "bulk") return <BulkPurchaseAlertForm isAr={isAr} onCancel={handleCancel} />;
  if (selectedType === "highvalue") return <HighValueTransactionForm isAr={isAr} onCancel={handleCancel} />;
  if (selectedType === "restricted") return <RestrictedItemForm isAr={isAr} onCancel={handleCancel} />;
  if (selectedType === "shipping") return <ShippingAlertForm isAr={isAr} onCancel={handleCancel} />;
  if (selectedType === "pattern") return <PaymentPatternForm isAr={isAr} onCancel={handleCancel} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-white text-xl font-bold mb-1 font-['Inter']">
          {isAr ? "إرسال حدث تجارة إلكترونية" : "Submit E-Commerce Event"}
        </h2>
        <p className="text-gray-400 text-sm font-['Inter']">
          {isAr
            ? "اختر نوع الحدث المُبلَّغ عنه — ليس كل عملية شراء، فقط المحفزات المحددة"
            : "Select the type of flagged event to report — not every purchase, only specific triggers"}
        </p>
      </div>

      {/* Data source note */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl border" style={{ background: "rgba(181,142,60,0.04)", borderColor: "rgba(181,142,60,0.15)" }}>
        <i className="ri-information-line text-gold-400 mt-0.5" />
        <div>
          <p className="text-gold-400 text-sm font-semibold font-['Inter'] mb-0.5">
            {isAr ? "مصادر البيانات" : "Data Sources"}
          </p>
          <p className="text-gray-400 text-xs font-['Inter'] leading-relaxed">
            {isAr
              ? "معالجو الدفع (تقارير البنك المركزي) · تجار التجزئة الكبار (API) · المنصات الإلكترونية (شراكات). هذه ليست مراقبة شاملة لكل المشتريات."
              : "Payment Processors (Central Bank mandated reporting) · Major Retailers (API) · Online Platforms (partnerships). This is NOT mass surveillance of all purchases."}
          </p>
        </div>
      </div>

      {/* Event type cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {EVENT_TYPES.map((evt) => (
          <button
            key={evt.id}
            type="button"
            onClick={() => setSelectedType(evt.id)}
            className="relative rounded-2xl border p-6 text-left cursor-pointer transition-all overflow-hidden group"
            style={{
              background: "rgba(20,29,46,0.8)",
              borderColor: `${evt.color}25`,
              backdropFilter: "blur(12px)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = `${evt.color}60`;
              (e.currentTarget as HTMLButtonElement).style.background = `${evt.color}08`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = `${evt.color}25`;
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(20,29,46,0.8)";
            }}
          >
            {/* Glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `radial-gradient(circle at top left, ${evt.color}08, transparent 70%)` }} />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 flex items-center justify-center rounded-xl"
                  style={{ background: `${evt.color}15`, border: `1px solid ${evt.color}30` }}
                >
                  <i className={`${evt.icon} text-xl`} style={{ color: evt.color }} />
                </div>
                <div className="flex items-center gap-2">
                  {evt.badge && (
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-bold font-['JetBrains_Mono']"
                      style={{ background: `${evt.badgeColor}15`, color: evt.badgeColor, border: `1px solid ${evt.badgeColor}30`, fontSize: "9px" }}
                    >
                      {evt.badge}
                    </span>
                  )}
                  <div
                    className="w-7 h-7 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: `${evt.color}15` }}
                  >
                    <i className="ri-arrow-right-line text-sm" style={{ color: evt.color }} />
                  </div>
                </div>
              </div>

              <h3 className="text-white font-bold text-base mb-1 font-['Inter']">
                {isAr ? evt.labelAr : evt.label}
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed font-['Inter']">
                {isAr ? evt.descAr : evt.desc}
              </p>

              <div className="mt-4 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: evt.color }} />
                <span className="text-xs font-['JetBrains_Mono']" style={{ color: evt.color, fontSize: "10px" }}>
                  {isAr ? "انقر للإرسال" : "Click to submit"}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Confirmation code format */}
      <div className="rounded-2xl border p-5" style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.12)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(181,142,60,0.1)", border: "1px solid rgba(181,142,60,0.2)" }}>
            <i className="ri-qr-code-line text-gold-400 text-sm" />
          </div>
          <h3 className="text-white font-bold text-sm font-['Inter']">
            {isAr ? "رموز تأكيد AMEEN" : "AMEEN Confirmation Codes"}
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { code: "AMN-ECM-YYYYMMDD-XXXX", label: isAr ? "تنسيق الرمز القياسي" : "Standard code format", color: "#D4A84B" },
            { code: "AMN-ECM-20260405-0247", label: isAr ? "مثال: شراء مقيّد" : "Example: Restricted purchase", color: "#F87171" },
            { code: "AMN-ECM-20260405-0246", label: isAr ? "مثال: شراء بالجملة" : "Example: Bulk purchase", color: "#FACC15" },
          ].map((ex) => (
            <div key={ex.code} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: ex.color }} />
              <div>
                <div className="text-xs font-bold font-['JetBrains_Mono']" style={{ color: ex.color }}>{ex.code}</div>
                <div className="text-gray-500 text-xs font-['Inter']">{ex.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EcomEventForms;
