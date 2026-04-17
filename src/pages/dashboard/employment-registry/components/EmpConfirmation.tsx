import { useState, useEffect } from "react";

interface Props {
  isAr: boolean;
  onReset: () => void;
  eventLabel: string;
  eventLabelAr: string;
  eventColor: string;
  eventIcon: string;
}

const EmpConfirmation = ({ isAr, onReset, eventLabel, eventLabelAr, eventColor, eventIcon }: Props) => {
  const [seq] = useState(() => String(Math.floor(Math.random() * 9000) + 1000));
  const [ts] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  });
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 700);
    const t2 = setTimeout(() => setStep(2), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const refCode = `AMN-EMP-${ts}-${seq}`;

  const steps = [
    { label: isAr ? "تم الإرسال" : "Submitted" },
    { label: isAr ? "قيد المراجعة" : "Under Review" },
    { label: isAr ? "مقبول" : "Accepted" },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="w-full max-w-lg rounded-2xl border p-8 text-center"
        style={{ background: "rgba(10,37,64,0.9)", borderColor: `${eventColor}30`, backdropFilter: "blur(16px)", boxShadow: `0 0 40px ${eventColor}10` }}>
        <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: eventColor }} />
          <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: `${eventColor}15`, border: `2px solid ${eventColor}40` }}>
            <i className={`${eventIcon} text-4xl`} style={{ color: eventColor }} />
          </div>
        </div>
        <h2 className="text-white text-xl font-bold mb-1">{isAr ? "تم تسجيل الحدث بنجاح" : "Event Recorded Successfully"}</h2>
        <p className="text-gray-400 text-sm mb-6">{isAr ? eventLabelAr : eventLabel}</p>
        <div className="px-5 py-4 rounded-xl border mb-6" style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(184,138,60,0.15)" }}>
          <p className="text-gray-500 text-xs mb-1">{isAr ? "رمز المرجع" : "Reference Code"}</p>
          <p className="text-2xl font-black font-['JetBrains_Mono']" style={{ color: eventColor }}>{refCode}</p>
        </div>
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1">
                <div className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500"
                  style={{ background: i <= step ? `${eventColor}20` : "rgba(255,255,255,0.05)", border: `2px solid ${i <= step ? eventColor : "rgba(255,255,255,0.1)"}` }}>
                  {i <= step ? <i className="ri-check-line text-xs" style={{ color: eventColor }} /> : <span className="text-gray-600 text-xs">{i + 1}</span>}
                </div>
                <span className="text-xs whitespace-nowrap" style={{ color: i <= step ? eventColor : "#4B5563" }}>{s.label}</span>
              </div>
              {i < steps.length - 1 && <div className="w-8 h-px mb-4 transition-all duration-500" style={{ background: i < step ? eventColor : "rgba(255,255,255,0.1)" }} />}
            </div>
          ))}
        </div>
        <div className="flex gap-3 justify-center">
          <button type="button" onClick={onReset}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap"
            style={{ background: "transparent", borderColor: "rgba(255,255,255,0.15)", color: "#9CA3AF" }}>
            <i className="ri-add-line" />{isAr ? "تسجيل حدث آخر" : "Submit Another"}
          </button>
          <button type="button" onClick={() => window.history.back()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold cursor-pointer whitespace-nowrap"
            style={{ background: eventColor, color: "#051428" }}>
            <i className="ri-dashboard-3-line" />{isAr ? "لوحة التحكم" : "Dashboard"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmpConfirmation;
