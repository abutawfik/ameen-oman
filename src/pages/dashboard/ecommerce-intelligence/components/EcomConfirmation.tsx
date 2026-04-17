import { useEffect, useState } from "react";

interface Props {
  isAr: boolean;
  eventType: string;
  eventTypeAr: string;
  color: string;
  icon: string;
  onReset: () => void;
}

const EcomConfirmation = ({ isAr, eventType, eventTypeAr, color, icon, onReset }: Props) => {
  const [code] = useState(() => {
    const seq = String(Math.floor(Math.random() * 9000) + 1000).padStart(4, "0");
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    return `AMN-ECM-${date}-${seq}`;
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div
        className="w-24 h-24 flex items-center justify-center rounded-full mb-6"
        style={{ background: `${color}12`, border: `2px solid ${color}40` }}
      >
        <i className={`${icon} text-5xl`} style={{ color }} />
      </div>

      <h2 className="text-white text-2xl font-bold mb-2 font-['Inter']">
        {isAr ? "تم الإرسال بنجاح" : "Event Submitted Successfully"}
      </h2>
      <p className="text-gray-400 text-sm mb-6 font-['Inter']">
        {isAr ? `تم تسجيل حدث "${eventTypeAr}" في نظام Al-Ameen` : `"${eventType}" event recorded in Al-Ameen system`}
      </p>

      {/* Confirmation code */}
      <div
        className="flex items-center gap-3 px-6 py-4 rounded-2xl mb-3"
        style={{ background: "rgba(184,138,60,0.06)", border: "1px solid rgba(184,138,60,0.2)" }}
      >
        <i className="ri-qr-code-line text-gold-400 text-xl" />
        <div className="text-left">
          <p className="text-gray-500 text-xs mb-0.5 font-['Inter']">
            {isAr ? "رمز التأكيد" : "Confirmation Code"}
          </p>
          <p className="text-gold-400 text-lg font-black font-['JetBrains_Mono'] tracking-widest">{code}</p>
        </div>
        <button
          type="button"
          onClick={() => { navigator.clipboard.writeText(code); setCopied(true); }}
          className="ml-2 w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-colors"
          style={{ background: "rgba(184,138,60,0.1)", border: "1px solid rgba(184,138,60,0.2)" }}
        >
          <i className={`${copied ? "ri-check-line text-green-400" : "ri-file-copy-line text-gold-400"} text-sm`} />
        </button>
      </div>

      <p className="text-gray-600 text-xs font-['JetBrains_Mono'] mb-8">
        {isAr ? "احتفظ بهذا الرمز للمراجعة" : "Keep this code for reference"} · Al-Ameen E-COMMERCE INTELLIGENCE
      </p>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-colors whitespace-nowrap font-['Inter']"
          style={{ background: "#D6B47E", color: "#051428" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#C99C48"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#D6B47E"; }}
        >
          <i className="ri-add-line" />
          {isAr ? "إرسال حدث جديد" : "Submit Another Event"}
        </button>
      </div>
    </div>
  );
};

export default EcomConfirmation;
