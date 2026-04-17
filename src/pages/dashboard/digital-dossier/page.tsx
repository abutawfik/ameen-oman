import { useState } from "react";
import DossierBuilder from "./components/DossierBuilder";
import DossierPreview from "./components/DossierPreview";
import DossierHistory from "./components/DossierHistory";
import DossierTemplates from "./components/DossierTemplates";
import {
  dossierSections,
  dossierTemplates,
  classificationConfig,
  type ClassificationLevel,
  type DossierFormat,
  type SectionKey,
  type SubjectSearchResult,
  type DossierTemplate,
} from "@/mocks/dossierData";

type Tab = "builder" | "templates" | "history";

interface GenerationConfig {
  subject: SubjectSearchResult;
  classification: ClassificationLevel;
  format: DossierFormat;
  sections: SectionKey[];
  purpose: string;
  caseRef: string;
  watermark: boolean;
  encrypted: boolean;
}

type GenerationState = "idle" | "generating" | "ready";

const DigitalDossierPage = () => {
  const [isAr] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("builder");
  const [generationState, setGenerationState] = useState<GenerationState>("idle");
  const [generationConfig, setGenerationConfig] = useState<GenerationConfig | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStep, setGenerationStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const generationSteps = [
    "Authenticating officer credentials...",
    "Pulling identity & document records...",
    "Fetching border movement history...",
    "Aggregating financial transactions...",
    "Compiling mobile & telecom data...",
    "Loading social intelligence feeds...",
    "Running pattern analysis engine...",
    "Calculating risk composite score...",
    "Building connections network graph...",
    "Applying classification watermarks...",
    "Encrypting document payload...",
    "Finalizing PDF/DOCX output...",
  ];

  const handleGenerate = (config: GenerationConfig) => {
    setGenerationConfig(config);
    setGenerationState("generating");
    setGenerationProgress(0);
    setGenerationStep(0);

    const totalSteps = generationSteps.length;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setGenerationStep(step);
      setGenerationProgress(Math.round((step / totalSteps) * 100));
      if (step >= totalSteps) {
        clearInterval(interval);
        setTimeout(() => {
          setGenerationState("ready");
        }, 400);
      }
    }, 280);
  };

  const handleUseTemplate = (template: DossierTemplate) => {
    setActiveTab("builder");
  };

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "builder",   label: "Build Dossier",   icon: "ri-file-add-line" },
    { key: "templates", label: "Templates",        icon: "ri-layout-grid-line" },
    { key: "history",   label: "Report History",   icon: "ri-history-line" },
  ];

  const estimatedPages = generationConfig
    ? dossierSections.filter((s) => generationConfig.sections.includes(s.key)).reduce((sum, s) => sum + s.estimatedPages, 0)
    : 0;

  return (
    <div className="flex flex-col h-full" style={{ background: "#060D1A" }}>
      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dos-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#22D3EE" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dos-grid)" />
        </svg>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Page header */}
        <div
          className="flex items-center justify-between px-6 py-3 border-b flex-shrink-0"
          style={{ borderColor: "rgba(34,211,238,0.1)", background: "rgba(10,22,40,0.6)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.3)" }}>
              <i className="ri-file-shield-2-line text-cyan-400 text-sm" />
            </div>
            <div>
              <h1 className="text-white text-sm font-bold font-['Inter']">Digital Dossier & Report Generation</h1>
              <p className="text-gray-500 text-xs font-['JetBrains_Mono']">Auto-generate classified intelligence reports from all 16 data streams — PDF / DOCX / Encrypted</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: "rgba(34,211,238,0.06)", border: "1px solid rgba(34,211,238,0.15)" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-cyan-400 text-xs font-['JetBrains_Mono']">16 Streams Active</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.15)" }}>
              <i className="ri-shield-check-line text-green-400 text-xs" />
              <span className="text-green-400 text-xs font-['JetBrains_Mono']">AES-256 Encryption</span>
            </div>
          </div>
        </div>

        {/* KPI bar */}
        <div className="grid grid-cols-5 gap-0 border-b flex-shrink-0" style={{ borderColor: "rgba(34,211,238,0.08)" }}>
          {[
            { label: "Reports Generated", value: "1,247", icon: "ri-file-text-line", color: "#22D3EE" },
            { label: "Active Dossiers", value: "3", icon: "ri-folder-open-line", color: "#4ADE80" },
            { label: "Templates Available", value: dossierTemplates.length.toString(), icon: "ri-layout-grid-line", color: "#A78BFA" },
            { label: "Streams Covered", value: "16", icon: "ri-database-line", color: "#FACC15" },
            { label: "Avg. Generation Time", value: "3.4s", icon: "ri-timer-line", color: "#FB923C" },
          ].map((kpi, i) => (
            <div
              key={kpi.label}
              className="flex items-center gap-3 px-5 py-3"
              style={{ borderRight: i < 4 ? "1px solid rgba(34,211,238,0.08)" : "none" }}
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${kpi.color}15` }}>
                <i className={`${kpi.icon} text-sm`} style={{ color: kpi.color }} />
              </div>
              <div>
                <p className="text-white text-lg font-bold font-['JetBrains_Mono']">{kpi.value}</p>
                <p className="text-gray-600 text-[10px] font-['Inter']">{kpi.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left panel: tabs + content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex items-center gap-1 px-6 py-3 border-b flex-shrink-0" style={{ borderColor: "rgba(34,211,238,0.08)" }}>
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-['Inter'] cursor-pointer transition-all whitespace-nowrap"
                  style={{
                    background: activeTab === tab.key ? "rgba(34,211,238,0.1)" : "transparent",
                    color: activeTab === tab.key ? "#22D3EE" : "#6B7280",
                    border: activeTab === tab.key ? "1px solid rgba(34,211,238,0.25)" : "1px solid transparent",
                  }}
                >
                  <i className={`${tab.icon} text-sm`} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto px-6 py-5" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(34,211,238,0.2) transparent" }}>
              {activeTab === "builder" && (
                <DossierBuilder isAr={isAr} onGenerate={handleGenerate} />
              )}
              {activeTab === "templates" && (
                <DossierTemplates isAr={isAr} onUseTemplate={handleUseTemplate} />
              )}
              {activeTab === "history" && (
                <DossierHistory isAr={isAr} />
              )}
              <div className="h-6" />
            </div>
          </div>

          {/* Right panel: generation status / stream coverage */}
          <div className="w-72 flex-shrink-0 border-l flex flex-col overflow-hidden" style={{ borderColor: "rgba(34,211,238,0.1)" }}>
            {/* Generation status */}
            {generationState !== "idle" && (
              <div className="p-4 border-b" style={{ borderColor: "rgba(34,211,238,0.08)" }}>
                {generationState === "generating" && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <i className="ri-loader-4-line text-cyan-400 text-sm animate-spin" />
                      </div>
                      <span className="text-cyan-400 text-xs font-bold font-['JetBrains_Mono']">GENERATING...</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(34,211,238,0.1)" }}>
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${generationProgress}%`, background: "linear-gradient(90deg, #22D3EE, #4ADE80)" }}
                      />
                    </div>
                    <p className="text-gray-500 text-[10px] font-['JetBrains_Mono']">{generationProgress}% — {generationSteps[Math.min(generationStep, generationSteps.length - 1)]}</p>
                    <div className="space-y-1">
                      {generationSteps.slice(0, generationStep + 1).map((step, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <i className={`text-[10px] ${idx < generationStep ? "ri-check-line text-green-400" : "ri-loader-4-line text-cyan-400 animate-spin"}`} />
                          <span className="text-[10px] font-['JetBrains_Mono']" style={{ color: idx < generationStep ? "#4ADE80" : "#22D3EE" }}>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {generationState === "ready" && generationConfig && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(74,222,128,0.2)", border: "1px solid rgba(74,222,128,0.4)" }}>
                        <i className="ri-check-line text-green-400 text-xs" />
                      </div>
                      <span className="text-green-400 text-xs font-bold font-['JetBrains_Mono']">DOSSIER READY</span>
                    </div>
                    <div className="p-3 rounded-xl" style={{ background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.15)" }}>
                      <p className="text-white text-xs font-bold font-['Inter'] mb-1">{generationConfig.subject.nameEn}</p>
                      <div className="space-y-1 text-[10px] font-['JetBrains_Mono'] text-gray-500">
                        <p>{generationConfig.sections.length} sections · ~{estimatedPages} pages</p>
                        <p style={{ color: classificationConfig[generationConfig.classification].color }}>{generationConfig.classification}</p>
                        <p>{generationConfig.format}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowPreview(true)}
                        className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-['Inter'] cursor-pointer transition-colors whitespace-nowrap"
                        style={{ background: "rgba(34,211,238,0.08)", color: "#22D3EE", border: "1px solid rgba(34,211,238,0.2)" }}
                      >
                        <i className="ri-eye-line" />
                        Preview
                      </button>
                      <button
                        className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-bold font-['Inter'] cursor-pointer transition-all whitespace-nowrap"
                        style={{ background: "#22D3EE", color: "#060D1A" }}
                      >
                        <i className="ri-download-line" />
                        Download
                      </button>
                    </div>
                    <button
                      onClick={() => setGenerationState("idle")}
                      className="w-full py-1.5 rounded-lg text-xs font-['Inter'] cursor-pointer transition-colors text-gray-600 hover:text-gray-400"
                    >
                      Generate Another
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Stream coverage panel */}
            <div className="flex-1 overflow-y-auto p-4" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(34,211,238,0.2) transparent" }}>
              <p className="text-gray-600 text-[10px] font-['JetBrains_Mono'] mb-3">STREAM COVERAGE</p>
              <div className="space-y-1.5">
                {[
                  { stream: "Identity Fusion",   icon: "ri-fingerprint-line",      color: "#22D3EE", events: 12, status: "active" },
                  { stream: "Border Control",    icon: "ri-passport-line",          color: "#60A5FA", events: 3,  status: "active" },
                  { stream: "Hotel & Hospitality",icon: "ri-hotel-line",            color: "#22D3EE", events: 3,  status: "active" },
                  { stream: "Mobile Operators",  icon: "ri-sim-card-line",          color: "#A78BFA", events: 2,  status: "active" },
                  { stream: "Car Rental",        icon: "ri-car-line",               color: "#FB923C", events: 1,  status: "active" },
                  { stream: "Financial Services",icon: "ri-bank-card-line",         color: "#4ADE80", events: 4,  status: "active" },
                  { stream: "Employment",        icon: "ri-briefcase-line",         color: "#F9A8D4", events: 1,  status: "active" },
                  { stream: "Municipality",      icon: "ri-government-line",        color: "#34D399", events: 1,  status: "active" },
                  { stream: "Transport",         icon: "ri-bus-line",               color: "#FACC15", events: 6,  status: "active" },
                  { stream: "E-Commerce",        icon: "ri-shopping-cart-line",     color: "#38BDF8", events: 2,  status: "active" },
                  { stream: "Social Intelligence",icon: "ri-global-line",           color: "#F87171", events: 3,  status: "active" },
                  { stream: "Marine & Maritime", icon: "ri-anchor-line",            color: "#67E8F9", events: 1,  status: "active" },
                  { stream: "Customs & Cargo",   icon: "ri-ship-line",              color: "#FCD34D", events: 2,  status: "active" },
                  { stream: "Healthcare",        icon: "ri-heart-pulse-line",       color: "#F87171", events: 0,  status: "no-data" },
                  { stream: "Education",         icon: "ri-graduation-cap-line",    color: "#A78BFA", events: 0,  status: "no-data" },
                  { stream: "Postal Services",   icon: "ri-mail-send-line",         color: "#C084FC", events: 0,  status: "no-data" },
                ].map((s) => (
                  <div key={s.stream} className="flex items-center gap-2 py-1.5 px-2 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                      <i className={`${s.icon} text-xs`} style={{ color: s.status === "no-data" ? "#374151" : s.color }} />
                    </div>
                    <span className="text-xs font-['Inter'] flex-1 truncate" style={{ color: s.status === "no-data" ? "#4B5563" : "#9CA3AF" }}>
                      {s.stream}
                    </span>
                    <span className="text-[10px] font-['JetBrains_Mono'] flex-shrink-0" style={{ color: s.events > 0 ? s.color : "#374151" }}>
                      {s.events > 0 ? `${s.events}` : "—"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Classification guide */}
              <div className="mt-5">
                <p className="text-gray-600 text-[10px] font-['JetBrains_Mono'] mb-2">CLASSIFICATION GUIDE</p>
                <div className="space-y-1.5">
                  {(["UNCLASSIFIED", "RESTRICTED", "CONFIDENTIAL", "SECRET", "TOP SECRET"] as const).map((lvl) => {
                    const cfg = classificationConfig[lvl];
                    return (
                      <div key={lvl} className="flex items-center gap-2">
                        <i className={`${cfg.icon} text-xs flex-shrink-0`} style={{ color: cfg.color }} />
                        <span className="text-[10px] font-['JetBrains_Mono'] flex-shrink-0" style={{ color: cfg.color }}>{lvl}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview modal */}
      {showPreview && generationConfig && (
        <DossierPreview
          subject={generationConfig.subject}
          classification={generationConfig.classification}
          format={generationConfig.format}
          sections={generationConfig.sections}
          purpose={generationConfig.purpose}
          caseRef={generationConfig.caseRef}
          watermark={generationConfig.watermark}
          encrypted={generationConfig.encrypted}
          isAr={isAr}
          onClose={() => setShowPreview(false)}
          onDownload={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};

export default DigitalDossierPage;
