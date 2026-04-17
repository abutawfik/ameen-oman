import { useNavigate } from "react-router-dom";
interface Props { refNumber: string; eventType: string; eventCode: string; color: string; isAr: boolean; onReset: () => void; }
const EduConfirmation = ({ refNumber, eventType, eventCode, color, isAr, onReset }: Props) => {
  const navigate = useNavigate();
  const steps = isAr ? ["تم الإرسال", "قيد المراجعة", "مقبول"] : ["Submitted", "Under Review", "Accepted"];
  return (
    <div className="rounded-2xl border p-10 flex flex-col items-center text-center" style={{ background: "rgba(10,37,64,0.9)", borderColor: `${color}30`, backdropFilter: "blur(20px)" }}>
      <div className="relative mb-6">
        <div className="w-24 h-24 flex items-center justify-center rounded-full" style={{ background: `${color}10`, border: `2px solid ${color}40`, boxShadow: `0 0 40px ${color}18` }}>
          <i className="ri-checkbox-circle-line text-5xl" style={{ color }} />
        </div>
        <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ border: `2px solid ${color}` }} />
      </div>
      <h2 className="text-white text-2xl font-bold mb-2">{isAr ? "تم الإرسال بنجاح" : "Event Submitted Successfully"}</h2>
      <p className="text-gray-400 text-sm mb-3">{isAr ? `تم إرسال حدث "${eventType}" إلى منصة Al-Ameen` : `"${eventType}" event submitted to Al-Ameen Portal`}</p>
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full mb-8" style={{ background: `${color}10`, border: `1px solid ${color}25` }}>
        <span className="text-xs font-bold font-['JetBrains_Mono']" style={{ color }}>{eventCode}</span>
        <div className="w-1 h-1 rounded-full" style={{ background: color }} />
        <span className="text-xs font-['JetBrains_Mono']" style={{ color }}>SUBMITTED</span>
      </div>
      <div className="px-8 py-5 rounded-2xl border mb-8 w-full max-w-md" style={{ background: "rgba(184,138,60,0.04)", borderColor: "rgba(184,138,60,0.15)" }}>
        <p className="text-gray-500 text-xs mb-2 uppercase tracking-widest">{isAr ? "رقم المرجع" : "Reference Number"}</p>
        <p className="text-xl font-bold font-['JetBrains_Mono'] tracking-wider mb-1" style={{ color: "#D6B47E" }}>{refNumber}</p>
        <p className="text-gray-600 text-xs">{isAr ? "احتفظ بهذا الرقم للمتابعة" : "Keep this number for tracking"}</p>
      </div>
      <div className="flex items-center gap-2 mb-8">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div className="w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold" style={{ background: i === 0 ? "rgba(184,138,60,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${i === 0 ? "rgba(184,138,60,0.5)" : "rgba(255,255,255,0.1)"}`, color: i === 0 ? "#D6B47E" : "#6B7280" }}>{i === 0 ? <i className="ri-check-line text-xs" /> : i + 1}</div>
              <span className="text-xs whitespace-nowrap" style={{ color: i === 0 ? "#D6B47E" : "#6B7280" }}>{step}</span>
            </div>
            {i < steps.length - 1 && <div className="w-8 h-px mb-4" style={{ background: i === 0 ? "rgba(184,138,60,0.3)" : "rgba(255,255,255,0.08)" }} />}
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <button type="button" onClick={onReset} className="flex items-center gap-2 px-5 py-2.5 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap" style={{ background: "transparent", borderColor: "rgba(184,138,60,0.25)", color: "#D6B47E" }} onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(184,138,60,0.06)"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}><i className="ri-add-line" />{isAr ? "إضافة حدث جديد" : "Submit Another"}</button>
        <button type="button" onClick={() => navigate("/dashboard/education-events")} className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold cursor-pointer whitespace-nowrap" style={{ background: "#D6B47E", color: "#051428" }} onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#C99C48"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#D6B47E"; }}><i className="ri-dashboard-line" />{isAr ? "العودة" : "Back to Events"}</button>
      </div>
    </div>
  );
};
export default EduConfirmation;
