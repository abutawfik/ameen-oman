import { useNavigate } from "react-router-dom";

interface Props {
  refNumber: string;
  eventType: string;
  eventCode: string;
  color: string;
  isAr: boolean;
  onReset: () => void;
}

const ConfirmationPanel = ({ refNumber, eventType, eventCode, color, isAr, onReset }: Props) => {
  const navigate = useNavigate();

  return (
    <div
      className="rounded-2xl border p-10 flex flex-col items-center text-center"
      style={{
        background: "rgba(10,37,64,0.9)",
        borderColor: "rgba(184,138,60,0.2)",
        backdropFilter: "blur(20px)",
        boxShadow: `0 0 60px ${color}08`,
      }}
    >
      {/* Animated checkmark */}
      <div
        className="w-24 h-24 flex items-center justify-center rounded-full mb-6 relative"
        style={{
          background: `${color}10`,
          border: `2px solid ${color}40`,
          boxShadow: `0 0 40px ${color}18`,
        }}
      >
        <i className="ri-checkbox-circle-line text-5xl" style={{ color }} />
        {/* Pulse ring */}
        <div
          className="absolute inset-0 rounded-full animate-ping opacity-20"
          style={{ border: `2px solid ${color}` }}
        />
      </div>

      <h2 className="text-white text-2xl font-bold mb-2 font-['Inter']">
        {isAr ? "تم الإرسال بنجاح" : "Event Submitted Successfully"}
      </h2>
      <p className="text-gray-400 text-sm mb-2 font-['Inter']">
        {isAr
          ? `تم إرسال حدث ${eventType} إلى منصة الأمين`
          : `${eventType} event has been submitted to Al-Ameen Portal`}
      </p>
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-full mb-8"
        style={{ background: `${color}10`, border: `1px solid ${color}25` }}
      >
        <span className="text-xs font-bold font-['JetBrains_Mono']" style={{ color }}>{eventCode}</span>
        <div className="w-1 h-1 rounded-full" style={{ background: color }} />
        <span className="text-xs font-['JetBrains_Mono']" style={{ color }}>SUBMITTED</span>
      </div>

      {/* Reference number */}
      <div
        className="px-8 py-5 rounded-2xl border mb-8 w-full max-w-md"
        style={{ background: "rgba(184,138,60,0.04)", borderColor: "rgba(184,138,60,0.15)" }}
      >
        <p className="text-gray-500 text-xs mb-2 font-['Inter'] uppercase tracking-widest">
          {isAr ? "رقم المرجع" : "Reference Number"}
        </p>
        <p
          className="text-xl font-bold font-['JetBrains_Mono'] tracking-wider mb-2"
          style={{ color: "#D6B47E" }}
        >
          {refNumber}
        </p>
        <p className="text-gray-600 text-xs font-['Inter']">
          {isAr ? "احتفظ بهذا الرقم للمتابعة" : "Keep this number for tracking"}
        </p>
      </div>

      {/* Status pipeline */}
      <div className="flex items-center gap-2 mb-8">
        {[
          { label: isAr ? "مُرسَل" : "Submitted", icon: "ri-send-plane-line", done: true },
          { label: isAr ? "قيد المراجعة" : "Under Review", icon: "ri-eye-line", done: false },
          { label: isAr ? "مقبول" : "Accepted", icon: "ri-checkbox-circle-line", done: false },
        ].map((step, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold font-['Inter']"
              style={{
                background: step.done ? "rgba(184,138,60,0.1)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${step.done ? "rgba(184,138,60,0.25)" : "rgba(255,255,255,0.07)"}`,
                color: step.done ? "#D6B47E" : "#4B5563",
              }}
            >
              <i className={`${step.icon} text-xs`} />
              {step.label}
            </div>
            {i < 2 && <i className="ri-arrow-right-s-line text-gray-700 text-sm" />}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap font-['Inter'] transition-colors"
          style={{ background: "transparent", borderColor: "rgba(184,138,60,0.25)", color: "#D6B47E" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(184,138,60,0.06)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
        >
          <i className="ri-add-line" />
          {isAr ? "إضافة حدث جديد" : "Submit Another Event"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/dashboard?type=car-rental")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold cursor-pointer whitespace-nowrap font-['Inter'] transition-colors"
          style={{ background: "#D6B47E", color: "#051428" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#C99C48"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#D6B47E"; }}
        >
          <i className="ri-dashboard-line" />
          {isAr ? "العودة للوحة التحكم" : "Back to Dashboard"}
        </button>
      </div>
    </div>
  );
};

export default ConfirmationPanel;
