import { useState } from "react";
import {
  dossierSections,
  classificationConfig,
  type ClassificationLevel,
  type DossierFormat,
  type SectionKey,
  type SubjectSearchResult,
} from "@/mocks/dossierData";
import { mockTimeline, mockStreamSummary } from "@/mocks/person360Data";

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
    low: "#4ADE80", medium: "#FACC15", high: "#FB923C", critical: "#F87171",
  };

  const renderSectionContent = (key: SectionKey) => {
    switch (key) {
      case "cover_page":
        return (
          <div className="space-y-6">
            {/* Classification banner */}
            <div className="text-center py-3 rounded-lg font-bold text-sm font-['JetBrains_Mono'] tracking-widest" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
              ⬛ {classification} ⬛
            </div>
            <div className="flex items-center gap-6">
              <img src={subject.photo} alt={subject.nameEn} className="w-24 h-24 rounded-xl object-cover object-top flex-shrink-0" />
              <div>
                <p className="text-gray-500 text-xs font-['JetBrains_Mono'] mb-1">INTELLIGENCE DOSSIER</p>
                <h2 className="text-white text-2xl font-bold font-['Inter'] mb-1">{subject.nameEn}</h2>
                <p className="text-gray-400 text-sm font-['JetBrains_Mono']">{subject.docNumber} · {subject.nationalityFlag} {subject.nationality}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 rounded text-xs font-bold font-['JetBrains_Mono']" style={{ background: `${riskColors[subject.riskLevel]}20`, color: riskColors[subject.riskLevel] }}>
                    RISK: {subject.riskScore}/100 — {subject.riskLevel.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs font-['JetBrains_Mono']">
              {[
                { label: "Document Ref", value: `AMEEN-DOS-2026-${subject.id.split("-").pop()}` },
                { label: "Generated", value: new Date().toISOString().slice(0, 16).replace("T", " ") },
                { label: "Classification", value: classification },
                { label: "Format", value: format },
                { label: "Sections", value: `${sections.length} sections · ~${estimatedPages} pages` },
                { label: "Purpose", value: purpose || "Intelligence Review" },
                { label: "Case Ref", value: caseRef || "—" },
                { label: "Watermark", value: watermark ? "Enabled" : "Disabled" },
              ].map((item) => (
                <div key={item.label} className="p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-gray-600 text-[10px] mb-0.5">{item.label}</p>
                  <p className="text-gray-300">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case "executive_summary":
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-xl" style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.2)" }}>
              <p className="text-red-400 text-xs font-bold font-['JetBrains_Mono'] mb-2">⚠ HIGH PRIORITY — IMMEDIATE ATTENTION REQUIRED</p>
              <p className="text-gray-300 text-sm font-['Inter'] leading-relaxed">
                Subject <strong className="text-white">{subject.nameEn}</strong> ({subject.docNumber}) is a {subject.nationality} national currently in-country on a Tourist visa (expiring 2026-04-14). Intelligence analysis across {subject.streamCount} data streams has identified <strong className="text-red-400">{subject.alertCount} critical pattern alerts</strong> indicating potential involvement in financial crime, document fraud, and organized network activity.
              </p>
            </div>
            <div className="space-y-2">
              {[
                { icon: "ri-alert-fill", color: "#F87171", title: "Visa Type Conflict", desc: "Tourist visa active while work permit issued — legal violation" },
                { icon: "ri-bank-card-line", color: "#FB923C", title: "Suspicious Financial Activity", desc: "OMR 2,500 cash withdrawal + OMR 3,200 international wire within 21 days of arrival" },
                { icon: "ri-sim-card-line", color: "#A78BFA", title: "Multiple SIM Acquisition", desc: "2 SIM cards purchased within 24 hours on same device (IMEI shared with flagged person)" },
                { icon: "ri-ship-line", color: "#67E8F9", title: "Maritime Risk", desc: "Boat rental with 3 unregistered passengers — coastal security concern" },
                { icon: "ri-box-3-line", color: "#FCD34D", title: "Customs Invoice Manipulation", desc: "68% value variance on cargo clearance — suspected under-invoicing" },
              ].map((alert) => (
                <div key={alert.title} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${alert.color}15` }}>
                    <i className={`${alert.icon} text-sm`} style={{ color: alert.color }} />
                  </div>
                  <div>
                    <p className="text-white text-xs font-bold font-['Inter']">{alert.title}</p>
                    <p className="text-gray-500 text-xs font-['Inter']">{alert.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 rounded-lg" style={{ background: "rgba(34,211,238,0.05)", border: "1px solid rgba(34,211,238,0.15)" }}>
              <p className="text-cyan-400 text-xs font-bold font-['JetBrains_Mono'] mb-1">RECOMMENDED ACTIONS</p>
              <ul className="text-gray-400 text-xs font-['Inter'] space-y-1">
                <li>• Immediate visa status review and potential deportation proceedings</li>
                <li>• Financial Intelligence Unit referral for wire transfer investigation</li>
                <li>• IMEI device sharing investigation with Tariq Hussain (PK-9934521)</li>
                <li>• Customs fraud referral for cargo value variance</li>
                <li>• Maritime authority notification for unregistered boat passengers</li>
              </ul>
            </div>
          </div>
        );

      case "identity_documents":
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Full Name (EN)", value: subject.nameEn },
                { label: "Document Number", value: subject.docNumber },
                { label: "Nationality", value: `${subject.nationalityFlag} ${subject.nationality}` },
                { label: "Date of Birth", value: "1991-03-15" },
                { label: "Gender", value: "Male" },
                { label: "Age", value: "34" },
                { label: "Visa Type", value: "Tourist" },
                { label: "Visa Expiry", value: "2026-04-14" },
                { label: "Entry Port", value: "Capital International Airport" },
                { label: "Entry Date", value: "2026-03-15" },
                { label: "Status", value: "In Country" },
                { label: "Risk Score", value: `${subject.riskScore}/100 — ${subject.riskLevel.toUpperCase()}` },
              ].map((item) => (
                <div key={item.label} className="p-2.5 rounded-lg" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <p className="text-gray-600 text-[10px] font-['JetBrains_Mono'] mb-0.5">{item.label}</p>
                  <p className="text-gray-200 text-xs font-['Inter']">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case "border_movements":
        return (
          <div className="space-y-2">
            {mockTimeline.filter((e) => e.stream === "Border").map((event) => (
              <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${event.streamColor}15` }}>
                  <i className={`${event.streamIcon} text-sm`} style={{ color: event.streamColor }} />
                </div>
                <div className="flex-1">
                  <p className="text-white text-xs font-bold font-['Inter']">{event.title}</p>
                  <p className="text-gray-500 text-xs font-['Inter']">{event.description}</p>
                  <p className="text-gray-700 text-[10px] font-['JetBrains_Mono'] mt-1">{event.datetime} · {event.location}</p>
                </div>
              </div>
            ))}
          </div>
        );

      case "pattern_alerts":
        return (
          <div className="space-y-2">
            {mockTimeline.filter((e) => e.isAlert).map((event) => (
              <div key={event.id} className="p-3 rounded-lg" style={{ background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.15)" }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold font-['JetBrains_Mono']" style={{
                    background: event.alertSeverity === "critical" ? "rgba(248,113,113,0.2)" : event.alertSeverity === "high" ? "rgba(251,146,60,0.2)" : "rgba(250,204,21,0.2)",
                    color: event.alertSeverity === "critical" ? "#F87171" : event.alertSeverity === "high" ? "#FB923C" : "#FACC15",
                  }}>
                    {event.alertSeverity?.toUpperCase()}
                  </span>
                  <span className="text-white text-xs font-bold font-['Inter']">{event.alertType}</span>
                </div>
                <p className="text-gray-400 text-xs font-['Inter']">{event.description}</p>
                <p className="text-gray-700 text-[10px] font-['JetBrains_Mono'] mt-1">{event.datetime} · {event.stream}</p>
              </div>
            ))}
          </div>
        );

      case "connections_network":
        return (
          <div className="space-y-3">
            <p className="text-gray-500 text-xs font-['Inter']">7 known associates identified across multiple data streams:</p>
            {[
              { name: "Tariq Hussain", doc: "PK-9934521", relation: "Shared IMEI Device", risk: 82, flag: "🇵🇰", severity: "critical" },
              { name: "Ravi Kumar", doc: "IN-4523891", relation: "Co-Driver (Toyota Hilux)", risk: 61, flag: "🇮🇳", severity: "high" },
              { name: "Yusuf Al-Siyabi", doc: "OM-5512890", relation: "Boat Passenger", risk: 71, flag: "🇴🇲", severity: "high" },
              { name: "Ahmed Al-Farsi", doc: "OM-1234567", relation: "Co-Guest (Grand Hyatt)", risk: 45, flag: "🇴🇲", severity: "medium" },
              { name: "Saeed Al-Harthi", doc: "OM-8812345", relation: "Same Booking Organization", risk: 55, flag: "🇴🇲", severity: "medium" },
              { name: "Mohammed Al-Balushi", doc: "OM-3344521", relation: "Same Employer", risk: 34, flag: "🇴🇲", severity: "low" },
              { name: "Fatima Al-Zadjali", doc: "OM-7654321", relation: "Co-Tenant (Al Khuwair)", risk: 12, flag: "🇴🇲", severity: "low" },
            ].map((c) => (
              <div key={c.doc} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <span className="text-xl">{c.flag}</span>
                <div className="flex-1">
                  <p className="text-white text-xs font-bold font-['Inter']">{c.name}</p>
                  <p className="text-gray-500 text-xs font-['Inter']">{c.relation} · {c.doc}</p>
                </div>
                <span className="text-xs font-bold font-['JetBrains_Mono']" style={{ color: riskColors[c.severity] }}>
                  {c.risk}/100
                </span>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <div className="space-y-3">
            {mockStreamSummary
              .filter((s) => s.count > 0)
              .slice(0, 4)
              .map((stream) => (
                <div key={stream.stream} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${stream.color}15` }}>
                    <i className={`${stream.icon} text-sm`} style={{ color: stream.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-xs font-bold font-['Inter'] capitalize">{stream.stream} Stream</p>
                    <p className="text-gray-500 text-xs font-['Inter']">{stream.label} · Last: {stream.lastEvent}</p>
                  </div>
                  <span className="text-xs font-['JetBrains_Mono'] text-cyan-400">{stream.count} events</span>
                </div>
              ))}
            <p className="text-gray-700 text-xs font-['JetBrains_Mono'] text-center">Full data available in generated document</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex" style={{ background: "rgba(6,13,26,0.9)", backdropFilter: "blur(8px)" }}>
      <div className="flex w-full max-w-6xl mx-auto my-6 rounded-2xl overflow-hidden" style={{ background: "rgba(10,22,40,0.98)", border: "1px solid rgba(34,211,238,0.2)" }}>
        {/* Left: Section nav */}
        <div className="w-64 flex-shrink-0 border-r flex flex-col" style={{ borderColor: "rgba(34,211,238,0.1)" }}>
          <div className="p-4 border-b" style={{ borderColor: "rgba(34,211,238,0.1)" }}>
            <div className="flex items-center gap-2 mb-2">
              <i className="ri-file-pdf-line text-cyan-400" />
              <span className="text-white text-sm font-bold font-['Inter']">Dossier Preview</span>
            </div>
            <div className="px-2 py-1 rounded text-[10px] font-bold font-['JetBrains_Mono'] text-center" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
              {classification}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto py-2" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(34,211,238,0.2) transparent" }}>
            {selectedSectionData.map((section, idx) => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className="w-full flex items-center gap-2 px-4 py-2.5 cursor-pointer transition-all text-left"
                style={{
                  background: activeSection === section.key ? "rgba(34,211,238,0.08)" : "transparent",
                  borderLeft: activeSection === section.key ? "2px solid #22D3EE" : "2px solid transparent",
                }}
              >
                <span className="text-gray-600 text-[10px] font-['JetBrains_Mono'] w-4 flex-shrink-0">{String(idx + 1).padStart(2, "0")}</span>
                <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                  <i className={`${section.streamIcon} text-xs`} style={{ color: activeSection === section.key ? "#22D3EE" : section.streamColor }} />
                </div>
                <span className="text-xs font-['Inter'] truncate" style={{ color: activeSection === section.key ? "#22D3EE" : "#9CA3AF" }}>
                  {section.label}
                </span>
              </button>
            ))}
          </div>
          <div className="p-4 border-t" style={{ borderColor: "rgba(34,211,238,0.1)" }}>
            <p className="text-gray-600 text-[10px] font-['JetBrains_Mono']">{sections.length} sections · ~{estimatedPages} pages</p>
            {watermark && <p className="text-gray-700 text-[10px] font-['JetBrains_Mono'] mt-0.5">Watermarked · {encrypted ? "Encrypted" : "Standard"}</p>}
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0" style={{ borderColor: "rgba(34,211,238,0.1)" }}>
            <div>
              <h2 className="text-white text-sm font-bold font-['Inter']">
                {dossierSections.find((s) => s.key === activeSection)?.label}
              </h2>
              <p className="text-gray-600 text-xs font-['JetBrains_Mono']">
                {dossierSections.find((s) => s.key === activeSection)?.stream} Stream
              </p>
            </div>
            <div className="flex items-center gap-3">
              {watermark && (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-['JetBrains_Mono']" style={{ background: "rgba(250,204,21,0.08)", color: "#FACC15", border: "1px solid rgba(250,204,21,0.2)" }}>
                  <i className="ri-mark-pen-line text-xs" />
                  WATERMARKED
                </div>
              )}
              {encrypted && (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-['JetBrains_Mono']" style={{ background: "rgba(74,222,128,0.08)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.2)" }}>
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
          <div className="flex-1 overflow-y-auto p-6" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(34,211,238,0.2) transparent" }}>
            {/* Classification banner */}
            <div className="text-center py-1.5 rounded mb-4 text-[10px] font-bold font-['JetBrains_Mono'] tracking-widest" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
              {classification} — HANDLE ACCORDING TO CLASSIFICATION POLICY
            </div>
            {renderSectionContent(activeSection)}
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between px-6 py-4 border-t" style={{ borderColor: "rgba(34,211,238,0.1)" }}>
            <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-['Inter'] cursor-pointer transition-colors whitespace-nowrap" style={{ background: "rgba(255,255,255,0.04)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.08)" }}>
              Close Preview
            </button>
            <div className="flex gap-3">
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-['Inter'] cursor-pointer transition-colors whitespace-nowrap" style={{ background: "rgba(34,211,238,0.08)", color: "#22D3EE", border: "1px solid rgba(34,211,238,0.2)" }}>
                <i className="ri-printer-line" />
                Print
              </button>
              <button onClick={onDownload} className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-bold font-['Inter'] cursor-pointer transition-all whitespace-nowrap" style={{ background: "#22D3EE", color: "#060D1A", boxShadow: "0 0 16px rgba(34,211,238,0.25)" }}>
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
