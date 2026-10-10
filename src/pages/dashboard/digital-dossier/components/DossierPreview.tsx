import { dossierSectionText } from '@/workflows/dossier';
import { useState } from "react";
import {
  dossierSections,
  classificationConfig,
  type ClassificationLevel,
  type DossierFormat,
  type SectionKey,
  type SubjectSearchResult,
} from "@/mocks/dossierData";

interface Props {
  subject: SubjectSearchResult;
  classification: ClassificationLevel;
  format: DossierFormat;
  sections: SectionKey[];
  purpose: string;
  caseRef: string;
  watermark: boolean;
  encrypted: boolean;
  isAr: boolean;
  onClose: () => void;
  onDownload: () => void;
}

const DossierPreview = ({ subject, classification, format, sections, purpose, caseRef, watermark, encrypted, isAr, onClose, onDownload }: Props) => {
  const [activeSection, setActiveSection] = useState<SectionKey>(sections[0]);
  const cfg = classificationConfig[classification];

  const selectedSectionData = dossierSections.filter((s) => sections.includes(s.key));
  const estimatedPages = selectedSectionData.reduce((sum, s) => sum + s.estimatedPages, 0);

  const riskColors: Record<string, string> = {
    low: "#4ADE80", medium: "#FACC15", high: "#C98A1B", critical: "#C94A5E",
  };

  const renderSectionContent = (key: SectionKey) => (
    <div className="space-y-4">
      <p className="text-gold-400 text-sm">{isAr ? 'بيانات عرض فقط — لا توجد مصادر تشغيلية متصلة' : 'Demonstration data only — no connected operational sources'}</p>
      <h2 className="text-white text-xl font-bold">{subject.nameEn}</h2>
      <p className="text-gray-300 font-mono">{subject.docNumber} · {subject.nationality}</p>
      <p className="whitespace-pre-line text-gray-300 leading-relaxed">{dossierSectionText(subject, key)}</p>
      {key === 'cover_page' && <p className="text-gray-300">{classification} · {purpose || 'Demo review'} · {caseRef || 'No case reference'} · Unencrypted PDF</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex" style={{ background: "rgba(5,20,40,0.9)", backdropFilter: "blur(8px)" }}>
      <div className="flex w-full max-w-6xl mx-auto my-6 rounded-2xl overflow-hidden" style={{ background: "rgba(10,37,64,0.98)", border: "1px solid rgba(184,138,60,0.2)" }}>
        {/* Left: Section nav */}
        <div className="w-64 flex-shrink-0 border-r flex flex-col" style={{ borderColor: "rgba(184,138,60,0.1)" }}>
          <div className="p-4 border-b" style={{ borderColor: "rgba(184,138,60,0.1)" }}>
            <div className="flex items-center gap-2 mb-2">
              <i className="ri-file-pdf-line text-gold-400" />
              <span className="text-white text-sm font-bold font-['Manrope']">Dossier Preview</span>
            </div>
            <div className="px-2 py-1 rounded text-[11px] font-bold font-['JetBrains_Mono'] text-center" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
              {classification}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto py-2" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(184,138,60,0.2) transparent" }}>
            {selectedSectionData.map((section, idx) => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className="w-full flex items-center gap-2 px-4 py-2.5 cursor-pointer transition-all text-left"
                style={{
                  background: activeSection === section.key ? "rgba(184,138,60,0.08)" : "transparent",
                  borderLeft: activeSection === section.key ? "2px solid #C5A365" : "2px solid transparent",
                }}
              >
                <span className="text-gray-600 text-[11px] font-['JetBrains_Mono'] w-4 flex-shrink-0">{String(idx + 1).padStart(2, "0")}</span>
                <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                  <i className={`${section.streamIcon} text-xs`} style={{ color: activeSection === section.key ? "#C5A365" : section.streamColor }} />
                </div>
                <span className="text-xs font-['Manrope'] truncate" style={{ color: activeSection === section.key ? "#C5A365" : "#9CA3AF" }}>
                  {section.label}
                </span>
              </button>
            ))}
          </div>
          <div className="p-4 border-t" style={{ borderColor: "rgba(184,138,60,0.1)" }}>
            <p className="text-gray-600 text-[11px] font-['JetBrains_Mono']">{sections.length} sections · ~{estimatedPages} pages</p>
            {watermark && <p className="text-gray-700 text-[11px] font-['JetBrains_Mono'] mt-0.5">Watermarked · {encrypted ? "Encrypted" : "Standard"}</p>}
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0" style={{ borderColor: "rgba(184,138,60,0.1)" }}>
            <div>
              <h2 className="text-white text-sm font-bold font-['Manrope']">
                {dossierSections.find((s) => s.key === activeSection)?.label}
              </h2>
              <p className="text-gray-600 text-xs font-['JetBrains_Mono']">
                {dossierSections.find((s) => s.key === activeSection)?.stream} Stream
              </p>
            </div>
            <div className="flex items-center gap-3">
              {watermark && (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-['JetBrains_Mono']" style={{ background: "rgba(250,204,21,0.08)", color: "#FACC15", border: "1px solid rgba(250,204,21,0.2)" }}>
                  <i className="ri-mark-pen-line text-xs" />
                  WATERMARKED
                </div>
              )}
              {encrypted && (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-['JetBrains_Mono']" style={{ background: "rgba(74,222,128,0.08)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.2)" }}>
                  <i className="ri-lock-line text-xs" />
                  ENCRYPTED
                </div>
              )}
              <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer transition-colors hover:bg-white/5 text-gray-500 hover:text-gray-300">
                <i className="ri-close-line text-sm" />
              </button>
            </div>
          </div>

          {/* Content area */}
          <div className="flex-1 overflow-y-auto p-6" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(184,138,60,0.2) transparent" }}>
            {/* Classification banner */}
            <div className="text-center py-1.5 rounded mb-4 text-[11px] font-bold font-['JetBrains_Mono'] tracking-widest" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
              {classification} — HANDLE ACCORDING TO CLASSIFICATION POLICY
            </div>
            {renderSectionContent(activeSection)}
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between px-6 py-4 border-t" style={{ borderColor: "rgba(184,138,60,0.1)" }}>
            <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-['Manrope'] cursor-pointer transition-colors whitespace-nowrap" style={{ background: "rgba(255,255,255,0.04)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.08)" }}>
              Close Preview
            </button>
            <div className="flex gap-3">
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-['Manrope'] cursor-pointer transition-colors whitespace-nowrap" style={{ background: "rgba(184,138,60,0.08)", color: "#C5A365", border: "1px solid rgba(184,138,60,0.2)" }}>
                <i className="ri-printer-line" />
                Print
              </button>
              <button onClick={onDownload} className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-bold font-['Manrope'] cursor-pointer transition-all whitespace-nowrap" style={{ background: "#C5A365", color: "#071426", boxShadow: "0 0 16px rgba(184,138,60,0.25)" }}>
                <i className="ri-download-line" />
                Download {format}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DossierPreview;
