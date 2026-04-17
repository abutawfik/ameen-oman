import { dossierTemplates, dossierSections, classificationConfig, type DossierTemplate } from "@/mocks/dossierData";

interface Props {
  isAr: boolean;
  onUseTemplate: (template: DossierTemplate) => void;
}

const categoryConfig: Record<string, { label: string; color: string; icon: string }> = {
  full:          { label: "Full Intelligence", color: "#F87171", icon: "ri-file-shield-2-line" },
  investigation: { label: "Investigation",     color: "#FB923C", icon: "ri-search-eye-line" },
  financial:     { label: "Financial Crime",   color: "#4ADE80", icon: "ri-bank-card-line" },
  border:        { label: "Border & Travel",   color: "#60A5FA", icon: "ri-passport-line" },
  compliance:    { label: "Compliance",        color: "#34D399", icon: "ri-shield-check-line" },
};

const DossierTemplates = ({ isAr, onUseTemplate }: Props) => {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white text-sm font-bold font-['Inter']">Report Templates</h3>
          <p className="text-gray-600 text-xs font-['Inter'] mt-0.5">Pre-configured templates for common intelligence scenarios</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-['Inter'] cursor-pointer transition-colors whitespace-nowrap" style={{ background: "rgba(181,142,60,0.08)", color: "#D4A84B", border: "1px solid rgba(181,142,60,0.2)" }}>
          <i className="ri-add-line" />
          New Template
        </button>
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-2 gap-4">
        {dossierTemplates.map((template) => {
          const cfg = classificationConfig[template.classification];
          const catCfg = categoryConfig[template.category];
          const sectionData = dossierSections.filter((s) => template.sections.includes(s.key));
          const estimatedPages = sectionData.reduce((sum, s) => sum + s.estimatedPages, 0);

          return (
            <div
              key={template.id}
              className="rounded-xl p-5 flex flex-col gap-4"
              style={{ background: "rgba(20,29,46,0.8)", border: "1px solid rgba(181,142,60,0.12)" }}
            >
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${template.color}15`, border: `1px solid ${template.color}30` }}>
                  <i className={`${template.icon} text-xl`} style={{ color: template.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-sm font-bold font-['Inter'] mb-1">{template.name}</h4>
                  <p className="text-gray-500 text-xs font-['Inter'] leading-relaxed">{template.description}</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-['JetBrains_Mono']" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                  {template.classification}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-['JetBrains_Mono']" style={{ background: `${catCfg.color}15`, color: catCfg.color }}>
                  <i className={`${catCfg.icon} mr-1`} />{catCfg.label}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-['JetBrains_Mono']" style={{ background: "rgba(255,255,255,0.04)", color: "#9CA3AF" }}>
                  {template.format}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Sections", value: template.sections.length },
                  { label: "Est. Pages", value: `~${estimatedPages}` },
                  { label: "Used", value: template.usageCount },
                ].map((stat) => (
                  <div key={stat.label} className="p-2 rounded-lg text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <p className="text-white text-sm font-bold font-['JetBrains_Mono']">{stat.value}</p>
                    <p className="text-gray-600 text-[10px] font-['Inter']">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Section preview */}
              <div>
                <p className="text-gray-700 text-[10px] font-['JetBrains_Mono'] mb-2">INCLUDED SECTIONS</p>
                <div className="flex flex-wrap gap-1">
                  {sectionData.slice(0, 6).map((s) => (
                    <span key={s.key} className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-['Inter']" style={{ background: `${s.streamColor}10`, color: s.streamColor }}>
                      <i className={`${s.streamIcon} text-[10px]`} />
                      {s.stream}
                    </span>
                  ))}
                  {sectionData.length > 6 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-['JetBrains_Mono'] text-gray-600" style={{ background: "rgba(255,255,255,0.03)" }}>
                      +{sectionData.length - 6} more
                    </span>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: "rgba(181,142,60,0.08)" }}>
                <div className="text-[10px] font-['JetBrains_Mono'] text-gray-700">
                  <span>By {template.createdBy}</span>
                  <span className="mx-1">·</span>
                  <span>Last used {template.lastUsed}</span>
                </div>
                <button
                  onClick={() => onUseTemplate(template)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-['Inter'] cursor-pointer transition-all whitespace-nowrap"
                  style={{ background: "#D4A84B", color: "#0B1220", boxShadow: "0 0 12px rgba(181,142,60,0.2)" }}
                >
                  <i className="ri-file-add-line" />
                  Use Template
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Usage stats */}
      <div className="rounded-xl p-5" style={{ background: "rgba(20,29,46,0.8)", border: "1px solid rgba(181,142,60,0.12)" }}>
        <h4 className="text-white text-sm font-bold font-['Inter'] mb-4">Template Usage Statistics</h4>
        <div className="space-y-3">
          {dossierTemplates.sort((a, b) => b.usageCount - a.usageCount).map((t) => (
            <div key={t.id} className="flex items-center gap-3">
              <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                <i className={`${t.icon} text-sm`} style={{ color: t.color }} />
              </div>
              <span className="text-gray-400 text-xs font-['Inter'] w-48 flex-shrink-0 truncate">{t.name}</span>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(t.usageCount / 891) * 100}%`,
                    background: t.color,
                    opacity: 0.7,
                  }}
                />
              </div>
              <span className="text-gray-600 text-xs font-['JetBrains_Mono'] w-10 text-right flex-shrink-0">{t.usageCount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DossierTemplates;
