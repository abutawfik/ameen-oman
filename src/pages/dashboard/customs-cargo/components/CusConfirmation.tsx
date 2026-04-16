import { useState } from "react";

interface Props {
  refNumber: string;
  eventType: string;
  isAr: boolean;
  onReset: () => void;
}

const CusConfirmation = ({ refNumber, eventType, isAr, onReset }: Props) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(refNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const timestamp = new Date().toLocaleString(isAr ? "ar-SA" : "en-GB", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });

  const typeColors: Record<string, string> = {
    import:   "#22D3EE",
    export:   "#4ADE80",
    transit:  "#FACC15",
    freezone: "#38BDF8",
    seizure:  "#F87171",
    personal: "#A78BFA",
  };

  const accentColor = typeColors[eventType] || "#22D3EE";

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      {/* Success Icon */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{ background: `${accentColor}15`, border: `2px solid ${accentColor}40` }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: `${accentColor}25` }}>
            <i className="ri-checkbox-circle-line text-4xl" style={{ color: accentColor }} />
          </div>
        </div>
        {/* Pulse rings */}
        <div className="absolute inset-0 rounded-full animate-ping opacity-20"
          style={{ background: accentColor }} />
      </div>

      <h2 className="text-white text-2xl font-bold font-['Inter'] mb-2">
        {isAr ? "تم الإرسال بنجاح" : "Successfully Submitted"}
      </h2>
      <p className="text-gray-400 text-sm font-['Inter'] mb-8 max-w-md">
        {isAr
          ? "تم تسجيل الإقرار الجمركي في نظام أمين وسيتم معالجته من قِبل الجهة المختصة."
          : "The customs declaration has been recorded in the Al-Ameen system and will be processed by the relevant authority."}
      </p>

      {/* Reference Card */}
      <div className="w-full max-w-md rounded-2xl p-6 mb-8"
        style={{ background: "rgba(10,22,40,0.8)", border: `1px solid ${accentColor}30` }}>
        <p className="text-gray-500 text-xs font-['JetBrains_Mono'] uppercase tracking-widest mb-2">
          {isAr ? "رقم المرجع" : "Reference Number"}
        </p>
        <div className="flex items-center justify-center gap-3">
          <span className="text-xl font-bold font-['JetBrains_Mono']" style={{ color: accentColor }}>
            {refNumber}
          </span>
          <button
            onClick={handleCopy}
            className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-all"
            style={{ background: `${accentColor}15`, color: accentColor }}>
            <i className={copied ? "ri-check-line" : "ri-file-copy-line"} />
          </button>
        </div>
        <div className="mt-4 pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="grid grid-cols-2 gap-3 text-left">
            <div>
              <p className="text-gray-600 text-xs font-['JetBrains_Mono']">{isAr ? "التاريخ والوقت" : "Date & Time"}</p>
              <p className="text-gray-300 text-xs font-['Inter'] mt-0.5">{timestamp}</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs font-['JetBrains_Mono']">{isAr ? "الحالة" : "Status"}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-xs font-['JetBrains_Mono']">
                  {isAr ? "قيد المعالجة" : "Processing"}
                </span>
              </div>
            </div>
            <div>
              <p className="text-gray-600 text-xs font-['JetBrains_Mono']">{isAr ? "المصدر" : "Source"}</p>
              <p className="text-gray-300 text-xs font-['Inter'] mt-0.5">Al-Ameen Customs Stream</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs font-['JetBrains_Mono']">{isAr ? "الدفق" : "Stream"}</p>
              <p className="text-xs font-['JetBrains_Mono'] mt-0.5" style={{ color: accentColor }}>
                {isAr ? "الجمارك والشحن" : "Customs & Cargo"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="w-full max-w-md rounded-xl p-4 mb-8 text-left"
        style={{ background: "rgba(34,211,238,0.05)", border: "1px solid rgba(34,211,238,0.1)" }}>
        <p className="text-cyan-400 text-xs font-semibold font-['Inter'] mb-3">
          {isAr ? "الخطوات التالية" : "Next Steps"}
        </p>
        <div className="space-y-2">
          {[
            { icon: "ri-search-eye-line", text: isAr ? "مراجعة الوثائق من قِبل مكتب الجمارك" : "Document review by customs office" },
            { icon: "ri-notification-3-line", text: isAr ? "إشعار بنتيجة الفحص خلال 24 ساعة" : "Inspection result notification within 24 hours" },
            { icon: "ri-file-download-line", text: isAr ? "تحميل نسخة الإقرار من البوابة" : "Download declaration copy from portal" },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0"
                style={{ background: "rgba(34,211,238,0.1)" }}>
                <i className={`${step.icon} text-xs text-cyan-400`} />
              </div>
              <span className="text-gray-400 text-xs font-['Inter']">{step.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap justify-center">
        <button
          onClick={onReset}
          className="px-6 py-2.5 rounded-lg text-sm font-['Inter'] font-medium cursor-pointer whitespace-nowrap transition-all"
          style={{ border: "1px solid rgba(34,211,238,0.3)", color: "#22D3EE", background: "transparent" }}>
          {isAr ? "إقرار جديد" : "New Declaration"}
        </button>
        <button
          className="px-6 py-2.5 rounded-lg text-sm font-['Inter'] font-bold cursor-pointer whitespace-nowrap transition-all flex items-center gap-2"
          style={{ background: "#22D3EE", color: "#060D1A" }}>
          <i className="ri-printer-line" />
          {isAr ? "طباعة الإيصال" : "Print Receipt"}
        </button>
      </div>
    </div>
  );
};

export default CusConfirmation;
