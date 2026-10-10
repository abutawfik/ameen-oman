import { useState, useMemo, useEffect } from "react";
import {
  dossierSections,
  classificationConfig,
  subjectSearchResults,
  type ClassificationLevel,
  type DossierFormat,
  type SectionKey,
  type SubjectSearchResult,
} from "@/mocks/dossierData";

import type { DossierTemplate } from "@/mocks/dossierData";

interface Props {
  template?: DossierTemplate | null;
  isAr: boolean;
  onGenerate: (config: {
    subject: SubjectSearchResult;
    classification: ClassificationLevel;
    format: DossierFormat;
    sections: SectionKey[];
    purpose: string;
    caseRef: string;
    watermark: boolean;
    encrypted: boolean;
  }) => void;
}

const classificationLevels: ClassificationLevel[] = ["UNCLASSIFIED", "RESTRICTED", "CONFIDENTIAL", "SECRET", "TOP SECRET"];

const formatOptions: { value: DossierFormat; label: string; icon: string; desc: string }[] = [
  { value: 'PDF', label: 'PDF', icon: 'ri-file-pdf-line', desc: 'Unencrypted demo PDF — printable, shareable' },
];

const classificationOrder: Record<ClassificationLevel, number> = {
    "UNCLASSIFIED": 0, "RESTRICTED": 1, "CONFIDENTIAL": 2, "SECRET": 3, "TOP SECRET": 4,
  };

const DossierBuilder = ({ isAr, onGenerate, template }: Props) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<SubjectSearchResult | null>(null);
  const [classification, setClassification] = useState<ClassificationLevel>("CONFIDENTIAL");
  const [format, setFormat] = useState<DossierFormat>("PDF");
  const [selectedSections, setSelectedSections] = useState<Set<SectionKey>>(
    new Set(dossierSections.filter((s) => s.required).map((s) => s.key))
  );
  const [purpose, setPurpose] = useState("");
  const [caseRef, setCaseRef] = useState("");
  const [watermark, setWatermark] = useState(true);
  const [encrypted, setEncrypted] = useState(false);
  const [sectionFilter, setSectionFilter] = useState<string>("all");

  useEffect(() => {
    if (!template) return;
    setClassification(template.classification);
    setSelectedSections(new Set([...template.sections, ...dossierSections.filter(s => s.required).map(s => s.key)].filter(key => dossierSections.some(s => s.key === key && classificationOrder[s.classificationMin] <= classificationOrder[template.classification]))));
    setFormat('PDF'); setEncrypted(false); setStep(1);
  }, [template]);

  const filteredSubjects = useMemo(() => {
    if (!searchQuery.trim()) return subjectSearchResults;
    const q = searchQuery.toLowerCase();
    return subjectSearchResults.filter(
      (s) => s.nameEn.toLowerCase().includes(q) || s.docNumber.toLowerCase().includes(q) || s.nationality.toLowerCase().includes(q)
    );
  }, [searchQuery]);



  const availableSections = useMemo(() => {
    return dossierSections.filter(
      (s) => classificationOrder[s.classificationMin] <= classificationOrder[classification]
    );
  }, [classification]);

  const filteredSections = useMemo(() => {
    if (sectionFilter === "all") return availableSections;
    if (sectionFilter === "required") return availableSections.filter((s) => s.required);
    return availableSections.filter((s) => s.stream.toLowerCase() === sectionFilter.toLowerCase());
  }, [availableSections, sectionFilter]);

  const toggleSection = (key: SectionKey, required: boolean) => {
    if (required) return;
    setSelectedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const selectAll = () => {
    setSelectedSections(new Set(availableSections.map((s) => s.key)));
  };

  const clearOptional = () => {
    setSelectedSections(new Set(dossierSections.filter((s) => s.required).map((s) => s.key)));
  };

  const estimatedPages = useMemo(() => {
    return dossierSections
      .filter((s) => selectedSections.has(s.key))
      .reduce((sum, s) => sum + s.estimatedPages, 0);
  }, [selectedSections]);

  const totalDataPoints = useMemo(() => {
    return dossierSections
      .filter((s) => selectedSections.has(s.key))
      .reduce((sum, s) => sum + s.dataPoints, 0);
  }, [selectedSections]);

  const riskColors: Record<string, string> = {
    low: "#4ADE80", medium: "#FACC15", high: "#C98A1B", critical: "#C94A5E",
  };

  const streamFilters = ["all", "required", "Identity", "Risk", "Borders", "Hotel", "Car Rental", "Mobile", "Financial", "Employment", "Transport", "Social", "Marine", "Customs", "System"];

  const handleGenerate = () => {
    if (!selectedSubject) return;
    onGenerate({
      subject: selectedSubject,
      classification,
      format,
      sections: Array.from(selectedSections).filter(key => availableSections.some(s => s.key === key)),
      purpose,
      caseRef,
      watermark,
      encrypted: format === "ENCRYPTED_PDF" || encrypted,
    });
  };

  return (
    <div className="space-y-5">
      {template && <p className="text-gold-400 text-sm mb-3">Template: {template.name}</p>}
      {/* Step indicator */}
      <div className="flex items-center gap-0">
        {[
          { n: 1, label: "Select Subject" },
          { n: 2, label: "Configure Sections" },
          { n: 3, label: "Output Settings" },
        ].map((s, i) => (
          <div key={s.n} className="flex items-center flex-1">
            <button
              onClick={() => { if (s.n < step || (s.n === 2 && selectedSubject) || (s.n === 3 && selectedSubject)) setStep(s.n as 1|2|3); }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-['JetBrains_Mono'] flex-shrink-0 transition-all"
                style={{
                  background: step === s.n ? "#C5A365" : step > s.n ? "rgba(74,222,128,0.2)" : "rgba(184,138,60,0.08)",
                  color: step === s.n ? "#071426" : step > s.n ? "#4ADE80" : "#6B7280",
                  border: step > s.n ? "1px solid rgba(74,222,128,0.4)" : "1px solid rgba(184,138,60,0.2)",
                }}
              >
                {step > s.n ? <i className="ri-check-line text-sm" /> : s.n}
              </div>
              <span className="text-sm font-['Manrope'] whitespace-nowrap" style={{ color: step === s.n ? "#C5A365" : step > s.n ? "#4ADE80" : "#6B7280" }}>
                {s.label}
              </span>
            </button>
            {i < 2 && <div className="flex-1 h-px mx-3" style={{ background: step > s.n ? "rgba(74,222,128,0.3)" : "rgba(184,138,60,0.1)" }} />}
          </div>
        ))}
      </div>

      {/* STEP 1: Subject Selection */}
      {step === 1 && (
        <div className="space-y-4">
          <div
            className="rounded-xl p-5"
            style={{ background: "rgba(10,37,64,0.8)", border: "1px solid rgba(184,138,60,0.15)" }}
          >
            <h3 className="text-white text-sm font-bold font-['Manrope'] mb-4">Search Subject</h3>
            <div className="relative mb-4">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, document number, or nationality..."
                className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm font-['Manrope'] outline-none transition-colors"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(184,138,60,0.15)",
                  color: "#E5E7EB",
                }}
              />
            </div>
            <div className="space-y-2">
              {filteredSubjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => setSelectedSubject(subject)}
                  className="w-full flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all text-left"
                  style={{
                    background: selectedSubject?.id === subject.id ? "rgba(184,138,60,0.08)" : "rgba(255,255,255,0.02)",
                    border: selectedSubject?.id === subject.id ? "1px solid rgba(184,138,60,0.3)" : "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <img
                    src={subject.photo}
                    alt={subject.nameEn}
                    className="w-12 h-12 rounded-lg object-cover object-top flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white text-sm font-bold font-['Manrope']">{subject.nameEn}</span>
                      <span className="text-lg">{subject.nationalityFlag}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-['JetBrains_Mono'] text-gray-500">
                      <span>{subject.docNumber}</span>
                      <span>·</span>
                      <span>{subject.nationality}</span>
                      <span>·</span>
                      <span style={{ color: subject.status === "in-country" ? "#4ADE80" : "#9CA3AF" }}>
                        {subject.status === "in-country" ? "In Country" : subject.status === "departed" ? "Departed" : "Unknown"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs font-['JetBrains_Mono']" style={{ color: riskColors[subject.riskLevel] }}>
                        Risk: {subject.riskScore}/100
                      </span>
                      <span className="text-xs text-gray-600 font-['JetBrains_Mono']">{subject.streamCount} streams · {subject.eventCount} events</span>
                      {subject.alertCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded text-[11px] font-bold font-['JetBrains_Mono']" style={{ background: "rgba(201,74,94,0.15)", color: "#C94A5E" }}>
                          {subject.alertCount} alerts
                        </span>
                      )}
                    </div>
                  </div>
                  {selectedSubject?.id === subject.id && (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(184,138,60,0.2)", border: "1px solid rgba(184,138,60,0.4)" }}>
                      <i className="ri-check-line text-gold-400 text-xs" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => { if (selectedSubject) setStep(2); }}
            disabled={!selectedSubject}
            className="w-full py-3 rounded-xl text-sm font-bold font-['Manrope'] cursor-pointer transition-all whitespace-nowrap"
            style={{
              background: selectedSubject ? "#C5A365" : "rgba(184,138,60,0.1)",
              color: selectedSubject ? "#071426" : "#6B7280",
              boxShadow: selectedSubject ? "0 0 20px rgba(184,138,60,0.2)" : "none",
            }}
          >
            Continue — Configure Sections
            <i className="ri-arrow-right-line ml-2" />
          </button>
        </div>
      )}

      {/* STEP 2: Section Selection */}
      {step === 2 && (
        <div className="space-y-4">
          {/* Classification selector */}
          <div className="rounded-xl p-5" style={{ background: "rgba(10,37,64,0.8)", border: "1px solid rgba(184,138,60,0.15)" }}>
            <h3 className="text-white text-sm font-bold font-['Manrope'] mb-3">Classification Level</h3>
            <div className="flex gap-2 flex-wrap">
              {classificationLevels.map((lvl) => {
                const cfg = classificationConfig[lvl];
                return (
                  <button
                    key={lvl}
                    onClick={() => setClassification(lvl)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-['JetBrains_Mono'] cursor-pointer transition-all whitespace-nowrap"
                    style={{
                      background: classification === lvl ? cfg.bg : "rgba(255,255,255,0.03)",
                      color: classification === lvl ? cfg.color : "#6B7280",
                      border: classification === lvl ? `1px solid ${cfg.border}` : "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <i className={`${cfg.icon} text-xs`} />
                    {lvl}
                  </button>
                );
              })}
            </div>
            <p className="text-gray-600 text-xs font-['Manrope'] mt-2">{classificationConfig[classification].description}</p>
          </div>

          {/* Section selector */}
          <div className="rounded-xl p-5" style={{ background: "rgba(10,37,64,0.8)", border: "1px solid rgba(184,138,60,0.15)" }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white text-sm font-bold font-['Manrope']">
                Report Sections
                <span className="ml-2 text-xs font-normal text-gray-500">({selectedSections.size} selected · ~{estimatedPages} pages)</span>
              </h3>
              <div className="flex gap-2">
                <button onClick={selectAll} className="text-xs text-gold-400 hover:text-gold-300 cursor-pointer font-['Manrope'] transition-colors">Select All</button>
                <span className="text-gray-700">·</span>
                <button onClick={clearOptional} className="text-xs text-gray-500 hover:text-gray-400 cursor-pointer font-['Manrope'] transition-colors">Required Only</button>
              </div>
            </div>

            {/* Stream filter pills */}
            <div className="flex gap-1.5 flex-wrap mb-4">
              {streamFilters.slice(0, 8).map((f) => (
                <button
                  key={f}
                  onClick={() => setSectionFilter(f)}
                  className="px-2.5 py-1 rounded-full text-[11px] font-['Manrope'] cursor-pointer transition-all whitespace-nowrap capitalize"
                  style={{
                    background: sectionFilter === f ? "rgba(184,138,60,0.12)" : "rgba(255,255,255,0.03)",
                    color: sectionFilter === f ? "#C5A365" : "#6B7280",
                    border: sectionFilter === f ? "1px solid rgba(184,138,60,0.25)" : "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {f === "all" ? "All" : f === "required" ? "Required" : f}
                </button>
              ))}
            </div>

            <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(184,138,60,0.2) transparent" }}>
              {filteredSections.map((section) => {
                const isSelected = selectedSections.has(section.key);
                return (
                  <button
                    key={section.key}
                    onClick={() => toggleSection(section.key, section.required)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all text-left"
                    style={{
                      background: isSelected ? "rgba(184,138,60,0.05)" : "rgba(255,255,255,0.02)",
                      border: isSelected ? "1px solid rgba(184,138,60,0.2)" : "1px solid rgba(255,255,255,0.04)",
                      opacity: section.required ? 1 : 1,
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                      style={{
                        background: isSelected ? (section.required ? "rgba(74,222,128,0.2)" : "rgba(184,138,60,0.2)") : "rgba(255,255,255,0.04)",
                        border: isSelected ? `1px solid ${section.required ? "#4ADE80" : "#C5A365"}` : "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      {isSelected && <i className={`text-[11px] ${section.required ? "ri-lock-line text-green-400" : "ri-check-line text-gold-400"}`} />}
                    </div>
                    <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                      <i className={`${section.streamIcon} text-sm`} style={{ color: section.streamColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold font-['Manrope']" style={{ color: isSelected ? "#E5E7EB" : "#9CA3AF" }}>
                          {section.label}
                        </span>
                        {section.required && (
                          <span className="px-1 py-0.5 rounded text-[9px] font-bold font-['JetBrains_Mono']" style={{ background: "rgba(74,222,128,0.1)", color: "#4ADE80" }}>REQ</span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-600 font-['Manrope'] truncate">{section.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[11px] font-['JetBrains_Mono']" style={{ color: section.dataPoints > 0 ? "#C5A365" : "#4B5563" }}>
                        {section.dataPoints > 0 ? `${section.dataPoints} events` : "no data"}
                      </p>
                      <p className="text-[11px] text-gray-700 font-['JetBrains_Mono']">~{section.estimatedPages}p</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Summary bar */}
            <div className="mt-4 pt-4 border-t flex items-center justify-between" style={{ borderColor: "rgba(184,138,60,0.08)" }}>
              <div className="flex gap-4 text-xs font-['JetBrains_Mono']">
                <span className="text-gray-500">{selectedSections.size} sections</span>
                <span className="text-gold-400">~{estimatedPages} pages</span>
                <span className="text-gray-500">{totalDataPoints} data points</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-2.5 rounded-xl text-sm font-['Manrope'] cursor-pointer transition-colors whitespace-nowrap"
              style={{ background: "rgba(255,255,255,0.04)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <i className="ri-arrow-left-line mr-1" /> Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold font-['Manrope'] cursor-pointer transition-all whitespace-nowrap"
              style={{ background: "#C5A365", color: "#071426", boxShadow: "0 0 20px rgba(184,138,60,0.2)" }}
            >
              Continue — Output Settings <i className="ri-arrow-right-line ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Output Settings */}
      {step === 3 && (
        <div className="space-y-4">
          {/* Format */}
          <div className="rounded-xl p-5" style={{ background: "rgba(10,37,64,0.8)", border: "1px solid rgba(184,138,60,0.15)" }}>
            <h3 className="text-white text-sm font-bold font-['Manrope'] mb-3">Output Format</h3>
            <div className="grid grid-cols-3 gap-3">
              {formatOptions.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFormat(f.value)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl cursor-pointer transition-all"
                  style={{
                    background: format === f.value ? "rgba(184,138,60,0.08)" : "rgba(255,255,255,0.02)",
                    border: format === f.value ? "1px solid rgba(184,138,60,0.3)" : "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <i className={`${f.icon} text-2xl`} style={{ color: format === f.value ? "#C5A365" : "#6B7280" }} />
                  <span className="text-xs font-bold font-['Manrope']" style={{ color: format === f.value ? "#C5A365" : "#9CA3AF" }}>{f.label}</span>
                  <span className="text-[11px] text-gray-600 font-['Manrope'] text-center">{f.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Purpose & Case Ref */}
          <div className="rounded-xl p-5" style={{ background: "rgba(10,37,64,0.8)", border: "1px solid rgba(184,138,60,0.15)" }}>
            <h3 className="text-white text-sm font-bold font-['Manrope'] mb-3">Report Metadata</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 font-['Manrope'] mb-1 block">Purpose / Reason for Generation</label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Active Investigation — Operation Desert Watch"
                  className="w-full px-3 py-2.5 rounded-lg text-sm font-['Manrope'] outline-none"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(184,138,60,0.15)", color: "#E5E7EB" }}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-['Manrope'] mb-1 block">Case Reference (optional)</label>
                <input
                  type="text"
                  value={caseRef}
                  onChange={(e) => setCaseRef(e.target.value)}
                  placeholder="e.g. OPS-2026-DW-441"
                  className="w-full px-3 py-2.5 rounded-lg text-sm font-['Manrope'] outline-none"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(184,138,60,0.15)", color: "#E5E7EB" }}
                />
              </div>
            </div>
          </div>

          {/* Security options */}
          <div className="rounded-xl p-5" style={{ background: "rgba(10,37,64,0.8)", border: "1px solid rgba(184,138,60,0.15)" }}>
            <h3 className="text-white text-sm font-bold font-['Manrope'] mb-3">Security Options</h3>
            <div className="space-y-3">
              {[
                { key: "watermark", label: "Add Watermark", desc: "Embed classification + demo watermark on every page", value: watermark, set: setWatermark },
                { key: "encrypted", label: "Encryption unavailable in demo", desc: "This local PDF export is unencrypted. Do not use real operational data.", value: false, set: setEncrypted, disabled: true },
              ].map((opt) => (
                <div key={opt.key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white font-['Manrope']">{opt.label}</p>
                    <p className="text-xs text-gray-600 font-['Manrope']">{opt.desc}</p>
                  </div>
                  <button
                    disabled={opt.disabled}
                    aria-label={opt.label}
                    aria-pressed={opt.value}
                    onClick={() => !opt.disabled && opt.set(!opt.value)}
                    className="relative w-10 h-5 rounded-full transition-all cursor-pointer flex-shrink-0"
                    style={{
                      background: opt.value ? "rgba(184,138,60,0.3)" : "rgba(255,255,255,0.08)",
                      border: opt.value ? "1px solid rgba(184,138,60,0.5)" : "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <div
                      className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
                      style={{
                        left: opt.value ? "calc(100% - 18px)" : "2px",
                        background: opt.value ? "#C5A365" : "#6B7280",
                      }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          {selectedSubject && (
            <div className="rounded-xl p-4" style={{ background: "rgba(184,138,60,0.04)", border: "1px solid rgba(184,138,60,0.15)" }}>
              <p className="text-xs text-gray-500 font-['JetBrains_Mono'] mb-2">GENERATION SUMMARY</p>
              <div className="grid grid-cols-2 gap-2 text-xs font-['JetBrains_Mono']">
                <div><span className="text-gray-600">Subject:</span> <span className="text-white">{selectedSubject.nameEn}</span></div>
                <div><span className="text-gray-600">Classification:</span> <span style={{ color: classificationConfig[classification].color }}>{classification}</span></div>
                <div><span className="text-gray-600">Format:</span> <span className="text-gold-400">{format}</span></div>
                <div><span className="text-gray-600">Sections:</span> <span className="text-white">{selectedSections.size} (~{estimatedPages}p)</span></div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-xl text-sm font-['Manrope'] cursor-pointer transition-colors whitespace-nowrap"
              style={{ background: "rgba(255,255,255,0.04)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <i className="ri-arrow-left-line mr-1" /> Back
            </button>
            <button
              onClick={handleGenerate}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold font-['Manrope'] cursor-pointer transition-all whitespace-nowrap"
              style={{ background: "#C5A365", color: "#071426", boxShadow: "0 0 24px rgba(184,138,60,0.3)" }}
            >
              <i className="ri-file-pdf-line" />
              Generate Dossier
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DossierBuilder;
