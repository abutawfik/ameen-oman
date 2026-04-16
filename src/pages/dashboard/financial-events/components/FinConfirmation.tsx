import { useNavigate } from "react-router-dom";

interface Props {
  refNumber: string;
  eventType: string;
  isAr: boolean;
  onReset: () => void;
  flagged?: boolean;
}

const FinConfirmation = ({ refNumber, eventType, isAr, onReset, flagged }: Props) => {
  const navigate = useNavigate();

  const steps = isAr
    ? ["تم الإرسال", "قيد المراجعة", "مقبول"]
    : ["Submitted", "Under Review", "Accepted"];

  const accentColor = flagged ? "#F87171" : "#22D3EE";
  const accentBg = flagged ? "rgba(248,113,113,0.1)" : "rgba(34,211,238,0.1)";
  const accentBorder = flagged ? "rgba(248,113,113,0.4)" : "rgba(34,211,238,0.4)";
  const accentGlow = flagged ? "rgba(248,113,113,0.15)" : "rgba(34,211,238,0.15)";

  return (
    <div
      className="rounded-2xl border p-10 flex flex-col items-center text-center"
      style={{ background: "rgba(10,22,40,0.9)", borderColor: flagged ? "rgba(248,113,113,0.3)" : "rgba(34,211,238,0.25)", backdropFilter: "blur(16px)" }}
    >
      {/* Icon */}
      <div className="relative mb-6">
        <div
          className="w-20 h-20 flex items-center justify-center rounded-full"
          style={{ background: accentBg, border: `2px solid ${accentBorder}`, boxShadow: `0 0 40px ${accentGlow}` }}
        >
          <i className={`${flagged ? "ri-alert-line" : "ri-checkbox-circle-line"} text-4xl`} style={{ color: accentColor }} />
        </div>
        <div className="absolute inset-0 rounded-full animate-ping" style={{ background: `${accentColor}06`, animationDuration: "2s" }} />
      </div>

      {/* Flagged badge */}
      {flagged && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border mb-4" style={{ background: "rgba(248,113,113,0.08)", borderColor: "rgba(248,113,113,0.3)" }}>
          <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          <span className="text-red-400 text-xs font-bold font-['JetBrains_Mono']">
            {isAr ? "تم الإبلاغ — مُحال للمراجعة" : "FLAGGED — Referred for Review"}
          </span>
        </div>
      )}

      <h2 className="text-white text-2xl font-bold mb-2 font-['Inter']">
        {isAr ? "تم الإرسال بنجاح" : "Submitted Successfully"}
      </h2>
      <p className="text-gray-400 text-sm mb-6 font-['Inter']">
        {isAr ? `تم إرسال حدث "${eventType}" إلى منصة AL-AMEEN` : `"${eventType}" event submitted to AL-AMEEN platform`}
      </p>

      {/* Reference number */}
      <div
        className="px-6 py-4 rounded-xl border mb-6 w-full max-w-sm"
        style={{ background: `${accentColor}08`, borderColor: `${accentColor}30` }}
      >
        <p className="text-gray-500 text-xs mb-1 font-['Inter']">{isAr ? "رقم المرجع" : "Reference Number"}</p>
        <p className="text-xl font-bold font-['JetBrains_Mono'] tracking-wider" style={{ color: accentColor }}>{refNumber}</p>
      </div>

      {/* Status pipeline */}
      <div className="flex items-center gap-2 mb-8 w-full max-w-sm justify-center">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold"
                style={{
                  background: i === 0 ? `${accentColor}20` : "rgba(255,255,255,0.05)",
                  border: `1px solid ${i === 0 ? `${accentColor}50` : "rgba(255,255,255,0.1)"}`,
                  color: i === 0 ? accentColor : "#6B7280",
                }}
              >
                {i === 0 ? <i className="ri-check-line text-xs" /> : i + 1}
              </div>
              <span className="text-xs whitespace-nowrap" style={{ color: i === 0 ? accentColor : "#6B7280" }}>{step}</span>
            </div>
            {i < steps.length - 1 && (
              <div className="w-8 h-px mb-4" style={{ background: i === 0 ? `${accentColor}30` : "rgba(255,255,255,0.08)" }} />
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap font-['Inter'] transition-colors"
          style={{ background: "transparent", borderColor: "rgba(34,211,238,0.3)", color: "#22D3EE" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(34,211,238,0.08)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
        >
          <i className="ri-add-line" />{isAr ? "حدث جديد" : "New Event"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/dashboard?type=payment")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold cursor-pointer whitespace-nowrap font-['Inter'] transition-colors"
          style={{ background: "#22D3EE", color: "#060D1A" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#06B6D4"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#22D3EE"; }}
        >
          <i className="ri-dashboard-line" />{isAr ? "لوحة التحكم" : "Dashboard"}
        </button>
      </div>
    </div>
  );
};

export default FinConfirmation;
