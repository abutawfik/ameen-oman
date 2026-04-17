import { useState } from "react";
import { threatActors, type ThreatActor } from "@/mocks/threatIntelData";

interface Props {
  isAr: boolean;
}

const ThreatActors = ({ isAr }: Props) => {
  const [selected, setSelected] = useState<ThreatActor>(threatActors[0]);

  const statusConfig = {
    active:   { color: "#C94A5E", bg: "rgba(201,74,94,0.1)", label: "ACTIVE" },
    dormant:  { color: "#FACC15", bg: "rgba(250,204,21,0.1)",  label: "DORMANT" },
    arrested: { color: "#4ADE80", bg: "rgba(74,222,128,0.1)",  label: "ARRESTED" },
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Actor list */}
      <div className="space-y-3">
        <p className="text-gray-600 text-[10px] font-['JetBrains_Mono'] uppercase tracking-widest mb-3">Known Threat Actors</p>
        {threatActors.map((actor) => {
          const stat = statusConfig[actor.status];
          const isSelected = selected.id === actor.id;
          return (
            <button
              key={actor.id}
              onClick={() => setSelected(actor)}
              className="w-full text-left p-3 rounded-xl cursor-pointer transition-all"
              style={{
                background: isSelected ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${isSelected ? "rgba(184,138,60,0.3)" : "rgba(255,255,255,0.06)"}`,
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0" style={{ border: `2px solid ${stat.color}40` }}>
                  <img src={actor.photo} alt={actor.alias} className="w-full h-full object-cover object-top" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-white text-xs font-bold font-['JetBrains_Mono'] truncate">{actor.alias}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-['JetBrains_Mono'] flex-shrink-0" style={{ background: stat.bg, color: stat.color }}>{stat.label}</span>
                  </div>
                  <p className="text-gray-600 text-[10px] font-['Inter'] truncate">{actor.nationality}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold font-['JetBrains_Mono'] text-sm" style={{ color: actor.riskScore >= 90 ? "#C94A5E" : actor.riskScore >= 75 ? "#C98A1B" : "#FACC15" }}>{actor.riskScore}</p>
                  <p className="text-gray-700 text-[10px]">risk</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Actor detail */}
      <div className="col-span-2 space-y-4">
        <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-start gap-4 mb-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0" style={{ border: `2px solid ${statusConfig[selected.status].color}40` }}>
              <img src={selected.photo} alt={selected.alias} className="w-full h-full object-cover object-top" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-white text-lg font-bold font-['JetBrains_Mono']">{selected.alias}</h3>
                <span className="text-xs px-2 py-1 rounded font-['JetBrains_Mono']" style={{ background: statusConfig[selected.status].bg, color: statusConfig[selected.status].color }}>
                  {statusConfig[selected.status].label}
                </span>
              </div>
              {selected.realName && (
                <p className="text-gray-400 text-sm font-['Inter'] mb-1">Real Name: <span className="text-white">{selected.realName}</span></p>
              )}
              <p className="text-gray-500 text-xs font-['Inter']">{selected.nationality}</p>
              <p className="text-gray-500 text-xs font-['Inter'] mt-1">Motivation: <span className="text-gray-300">{selected.motivation}</span></p>
            </div>
            <div className="text-center flex-shrink-0">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: `${selected.riskScore >= 90 ? "#C94A5E" : "#C98A1B"}15`, border: `2px solid ${selected.riskScore >= 90 ? "#C94A5E" : "#C98A1B"}40` }}>
                <span className="text-2xl font-black font-['JetBrains_Mono']" style={{ color: selected.riskScore >= 90 ? "#C94A5E" : "#C98A1B" }}>{selected.riskScore}</span>
              </div>
              <p className="text-gray-600 text-[10px] font-['JetBrains_Mono'] mt-1">RISK SCORE</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: "Linked IOCs", value: selected.linkedIocs.toString(), icon: "ri-database-line", color: "#D6B47E" },
              { label: "Linked Cases", value: selected.linkedCases.toString(), icon: "ri-folder-line", color: "#A78BFA" },
              { label: "Last Activity", value: selected.lastActivity, icon: "ri-time-line", color: "#FACC15" },
            ].map((stat) => (
              <div key={stat.label} className="p-3 rounded-xl text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <i className={`${stat.icon} text-lg mb-1`} style={{ color: stat.color }} />
                <p className="text-white text-sm font-bold font-['JetBrains_Mono']">{stat.value}</p>
                <p className="text-gray-600 text-[10px] font-['Inter']">{stat.label}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-gray-600 text-[10px] font-['JetBrains_Mono'] mb-2">TACTICS, TECHNIQUES & PROCEDURES (TTPs)</p>
            <div className="flex flex-wrap gap-2">
              {selected.ttps.map((ttp) => (
                <span key={ttp} className="text-xs px-3 py-1.5 rounded-lg font-['Inter']" style={{ background: "rgba(201,74,94,0.08)", color: "#C94A5E", border: "1px solid rgba(201,74,94,0.2)" }}>
                  {ttp}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "View Person 360°", icon: "ri-user-search-line", color: "#D6B47E" },
            { label: "Open Case File", icon: "ri-folder-open-line", color: "#A78BFA" },
            { label: "Generate Dossier", icon: "ri-file-shield-2-line", color: "#4ADE80" },
            { label: "Escalate Alert", icon: "ri-alarm-warning-line", color: "#C94A5E" },
          ].map((action) => (
            <button key={action.label} className="flex flex-col items-center gap-1.5 p-3 rounded-xl cursor-pointer transition-all hover:bg-white/5 whitespace-nowrap" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <i className={`${action.icon} text-lg`} style={{ color: action.color }} />
              <span className="text-[10px] font-['Inter'] text-gray-500 text-center leading-tight">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThreatActors;
