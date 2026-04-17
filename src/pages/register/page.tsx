import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import i18n from "@/i18n";
import StepEntityType from "./components/StepEntityType";
import StepEntityDetails from "./components/StepEntityDetails";
import StepIntegration from "./components/StepIntegration";
import StepDocuments from "./components/StepDocuments";
import StepReview from "./components/StepReview";

const STEPS_EN = ["Entity Type", "Entity Details", "Integration", "Documents", "Review & Submit"];
const STEPS_AR = ["نوع الجهة", "تفاصيل الجهة", "التكامل", "المستندات", "المراجعة والإرسال"];

const STEP_ICONS = ["ri-building-2-line", "ri-file-list-3-line", "ri-code-s-slash-line", "ri-folder-line", "ri-send-plane-line"];

const RegisterPage = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState(i18n.language || "en");
  const isAr = lang === "ar";

  const [step, setStep] = useState(0);
  const [entityType, setEntityType] = useState("");
  const [details, setDetails] = useState<Record<string, string>>({});
  const [method, setMethod] = useState<"portal" | "api" | "">("");
  const [apiData, setApiData] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<{ name: string; size: number; type: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  useEffect(() => {
    document.documentElement.dir = isAr ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang, isAr]);

  const toggleLang = () => {
    const next = isAr ? "en" : "ar";
    setLang(next);
    i18n.changeLanguage(next);
  };

  const steps = isAr ? STEPS_AR : STEPS_EN;

  const canNext = () => {
    if (step === 0) return !!entityType;
    if (step === 1) return !!(details.nameEn && details.commReg && details.contactEmail);
    if (step === 2) return !!method;
    return true;
  };

  const handleNext = () => { if (canNext() && step < 4) setStep(step + 1); };
  const handleBack = () => { if (step > 0) setStep(step - 1); };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      const ref = "AMN-REG-" + Math.floor(100000 + Math.random() * 900000);
      setRefNumber(ref);
      setSubmitting(false);
    }, 2200);
  };

  const progressPct = ((step + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen relative" style={{ background: "#0B1220" }}>
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(181,142,60,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(181,142,60,0.12) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(181,142,60,0.04) 0%, transparent 60%)" }}
      />

      {/* Top navigation bar */}
      <div
        className="relative z-20 border-b"
        style={{ background: "rgba(11,18,32,0.95)", borderColor: "rgba(181,142,60,0.12)", backdropFilter: "blur(12px)" }}
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(181,142,60,0.08)",
                border: "1.5px solid rgba(181,142,60,0.4)",
                clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
              }}
            >
              <span className="text-sm font-black" style={{ color: "#D4A84B", fontFamily: "Inter, sans-serif" }}>A</span>
            </div>
            <div>
              <span className="text-white font-bold text-sm font-['Inter'] tracking-widest">Al-Ameen</span>
              <span className="text-gold-400 text-xs font-['Cairo'] ml-2">الأمين</span>
            </div>
            <span className="hidden md:block text-gray-600 text-xs font-['Inter'] ml-2">
              — {isAr ? "تسجيل جهة جديدة" : "Register New Entity"}
            </span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLang}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gold-500/40 text-gold-400 text-xs font-bold hover:bg-gold-500/10 transition-colors cursor-pointer font-['JetBrains_Mono']"
            >
              {isAr ? "EN" : "AR"}
            </button>
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gold-500/40 text-gold-400 text-xs rounded-lg hover:bg-gold-500/10 transition-colors cursor-pointer font-['Inter'] whitespace-nowrap"
            >
              <i className="ri-login-box-line" />
              {isAr ? "تسجيل الدخول" : "Login"}
            </button>
            <a
              href="/"
              className="hidden md:flex items-center gap-1.5 text-gray-500 hover:text-gold-400 transition-colors text-xs cursor-pointer font-['Inter']"
            >
              <i className="ri-home-line" />
              {isAr ? "الرئيسية" : "Home"}
            </a>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        {/* Progress wizard */}
        {!refNumber && (
          <div className="mb-8">
            {/* Step counter */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-500 text-xs font-['JetBrains_Mono']">
                {isAr ? "الخطوة" : "Step"} {step + 1} {isAr ? "من" : "of"} {steps.length}
              </p>
              <p className="text-gold-400 text-xs font-semibold font-['Inter']">{steps[step]}</p>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1 rounded-full mb-4" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div
                className="h-1 rounded-full transition-all duration-500"
                style={{
                  width: `${progressPct}%`,
                  background: "linear-gradient(90deg, #D4A84B, #C99C48)",
                  boxShadow: "0 0 8px rgba(181,142,60,0.4)",
                }}
              />
            </div>

            {/* Step dots */}
            <div className="flex items-start justify-between">
              {steps.map((s, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                  <div
                    className="w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all duration-300 text-xs font-bold font-['JetBrains_Mono'] cursor-pointer"
                    style={{
                      borderColor: i <= step ? "#D4A84B" : "rgba(255,255,255,0.1)",
                      background: i < step ? "#D4A84B" : i === step ? "rgba(181,142,60,0.12)" : "transparent",
                      color: i < step ? "#0B1220" : i === step ? "#D4A84B" : "#374151",
                    }}
                    onClick={() => { if (i < step) setStep(i); }}
                  >
                    {i < step ? (
                      <i className="ri-check-line text-xs" />
                    ) : (
                      <i className={`${STEP_ICONS[i]} text-xs`} />
                    )}
                  </div>
                  <span
                    className="hidden md:block text-xs font-['Inter'] text-center max-w-[90px] leading-tight"
                    style={{ color: i === step ? "#D4A84B" : i < step ? "#6B7280" : "#374151" }}
                  >
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step content card */}
        <div
          className="rounded-2xl p-6 md:p-8 border mb-6"
          style={{
            background: "rgba(20,29,46,0.8)",
            borderColor: "rgba(181,142,60,0.15)",
            backdropFilter: "blur(16px)",
          }}
        >
          {step === 0 && (
            <StepEntityType selected={entityType} onSelect={setEntityType} isAr={isAr} />
          )}
          {step === 1 && (
            <StepEntityDetails
              entityType={entityType}
              data={details}
              onChange={(k, v) => setDetails((d) => ({ ...d, [k]: v }))}
              isAr={isAr}
            />
          )}
          {step === 2 && (
            <StepIntegration
              method={method}
              onSelect={setMethod}
              apiData={apiData}
              onApiChange={(k, v) => setApiData((d) => ({ ...d, [k]: v }))}
              isAr={isAr}
              entityType={entityType}
            />
          )}
          {step === 3 && (
            <StepDocuments files={files} onFilesChange={setFiles} isAr={isAr} />
          )}
          {step === 4 && (
            <StepReview
              entityType={entityType}
              details={details}
              method={method}
              apiData={apiData}
              filesCount={files.length}
              isAr={isAr}
              onSubmit={handleSubmit}
              submitting={submitting}
              refNumber={refNumber}
            />
          )}
        </div>

        {/* Navigation buttons */}
        {!refNumber && (
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={step === 0}
              className="flex items-center gap-2 px-5 py-2.5 border border-white/10 text-gray-400 rounded-lg hover:border-gold-500/40 hover:text-gold-400 transition-colors cursor-pointer text-sm font-['Inter'] disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <i className={isAr ? "ri-arrow-right-line" : "ri-arrow-left-line"} />
              {isAr ? "السابق" : "Back"}
            </button>

            {/* Step indicator pill */}
            <div
              className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-full"
              style={{ background: "rgba(181,142,60,0.06)", border: "1px solid rgba(181,142,60,0.15)" }}
            >
              {steps.map((_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === step ? "20px" : "6px",
                    height: "6px",
                    background: i < step ? "#D4A84B" : i === step ? "#D4A84B" : "rgba(255,255,255,0.15)",
                  }}
                />
              ))}
            </div>

            {step < 4 && (
              <button
                onClick={handleNext}
                disabled={!canNext()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold cursor-pointer text-sm font-['Inter'] disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap transition-all"
                style={{ background: canNext() ? "#D4A84B" : "rgba(181,142,60,0.3)", color: "#0B1220" }}
              >
                {isAr ? "التالي" : "Next"}
                <i className={isAr ? "ri-arrow-left-line" : "ri-arrow-right-line"} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
