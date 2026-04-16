import { useState } from "react";
import { darkWebMentions, feedSources, type DarkWebMention } from "@/mocks/threatIntelData";

const severityColors = {
  critical: "#F87171",
  high: "#FB923C",
  medium: "#FACC15",
  low: "#4ADE80",
};

interface Props {
  isAr: boolean;
}

const DarkWebMonitor = ({ isAr }: Props) => {
  const [selectedMention, setSelectedMention] = useState<DarkWebMention | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>("all");

  const filtered = darkWebMentions.filter((m) => filterSeverity === "all" || m.severity === filterSeverity);

  return (
    <div className="grid grid-cols-3 gap-4 h-full">
      {/* Left: Feed Sources */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          <p className="text-gray-400 text-xs font-bold font-['JetBrains_Mono'] uppercase tracking-widest">Feed Sources</p>
        </div>
        {feedSources.map((src) => (
          <div key={src.id} className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${src.color}15` }}>
                <i className={`${src.icon} text-xs`} style={{ color: src.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-['Inter'] font-medium truncate">{src.name}</p>
                <p className="text-gray-600 text-[10px] font-['JetBrains_Mono'] capitalize">{src.type}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <div className={`w-1.5 h-1.5 rounded-full ${src.status === "online" ? "bg-green-400" : src.status === "degraded" ? "bg-yellow-400" : "bg-red-400"}`} />
                <span className={`text-[10px] font-['JetBrains_Mono'] ${src.status === "online" ? "text-green-400" : src.status === "degraded" ? "text-yellow-400" : "text-red-400"}`}>
                  {src.status}
                </span>
              </div>
            </div>
            <div className="flex justify-between text-[10px] font-['JetBrains_Mono']">
              <span className="text-gray-600">{src.iocCount.toLocaleString()} IOCs</span>
              <span className="text-gray-600">{src.reliability}% reliable</span>
            </div>
            <div className="mt-1.5 w-full h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="h-full rounded-full" style={{ width: `${src.reliability}%`, background: src.color }} />
            </div>
            <p className="text-gray-700 text-[10px] font-['JetBrains_Mono'] mt-1">Synced {src.lastSync}</p>
          </div>
        ))}
      </div>

      {/* Middle: Mentions Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <i className="ri-ghost-line text-red-400 text-sm" />
            <p className="text-gray-400 text-xs font-bold font-['JetBrains_Mono'] uppercase tracking-widest">Dark Web Mentions</p>
          </div>
          <div className="flex items-center gap-1">
            {["all", "critical", "high", "medium"].map((s) => (
              <button key={s} onClick={() => setFilterSeverity(s)}
                className="px-2 py-1 rounded text-[10px] font-['Inter'] cursor-pointer transition-all whitespace-nowrap"
                style={{
                  background: filterSeverity === s ? "rgba(34,211,238,0.1)" : "transparent",
                  color: filterSeverity === s ? "#22D3EE" : "#6B7280",
                }}>
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {filtered.map((mention) => (
          <button
            key={mention.id}
            onClick={() => setSelectedMention(selectedMention?.id === mention.id ? null : mention)}
            className="w-full text-left p-3 rounded-xl cursor-pointer transition-all"
            style={{
              background: selectedMention?.id === mention.id ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)",
              border: `1px solid ${selectedMention?.id === mention.id ? severityColors[mention.severity] + "40" : "rgba(255,255,255,0.06)"}`,
            }}
          >
            <div className="flex items-start gap-2 mb-2">
              <div className="w-6 h-6 flex items-center justify-center rounded flex-shrink-0 mt-0.5" style={{ background: `${mention.platformColor}15` }}>
                <i className={`${mention.platformIcon} text-xs`} style={{ color: mention.platformColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-gray-400 text-[10px] font-['Inter'] truncate">{mention.platform}</span>
                  {mention.verified && <i className="ri-verified-badge-line text-cyan-400 text-[10px] flex-shrink-0" />}
                  {mention.translated && (
                    <span className="text-[9px] px-1 rounded font-['JetBrains_Mono'] flex-shrink-0" style={{ background: "rgba(167,139,250,0.15)", color: "#A78BFA" }}>
                      {mention.originalLang.toUpperCase()}→EN
                    </span>
                  )}
                </div>
                <p className="text-white text-xs font-['Inter'] line-clamp-2">{mention.content}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-gray-700 text-[10px] font-['JetBrains_Mono']">@{mention.author}</span>
                <span className="text-gray-700 text-[10px] font-['JetBrains_Mono']">{mention.timestamp}</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded" style={{ background: `${severityColors[mention.severity]}15` }}>
                <span className="text-[10px] font-bold font-['JetBrains_Mono']" style={{ color: severityColors[mention.severity] }}>
                  {mention.severity.toUpperCase()}
                </span>
              </div>
            </div>
            {mention.keywords.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {mention.keywords.map((kw) => (
                  <span key={kw} className="text-[9px] px-1.5 py-0.5 rounded font-['JetBrains_Mono']" style={{ background: "rgba(248,113,113,0.1)", color: "#F87171" }}>
                    {kw}
                  </span>
                ))}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Right: Detail Panel */}
      <div>
        {selectedMention ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-gray-400 text-xs font-bold font-['JetBrains_Mono'] uppercase tracking-widest">Mention Detail</p>
              <button onClick={() => setSelectedMention(null)} className="text-gray-600 hover:text-gray-400 cursor-pointer">
                <i className="ri-close-line text-sm" />
              </button>
            </div>
            <div className="p-4 rounded-xl space-y-4" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${severityColors[selectedMention.severity]}30` }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: `${selectedMention.platformColor}15` }}>
                  <i className={`${selectedMention.platformIcon} text-sm`} style={{ color: selectedMention.platformColor }} />
                </div>
                <div>
                  <p className="text-white text-xs font-bold font-['Inter']">{selectedMention.platform}</p>
                  <p className="text-gray-600 text-[10px] font-['JetBrains_Mono']">{selectedMention.timestamp}</p>
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-[10px] font-['JetBrains_Mono'] mb-1">CONTENT</p>
                <p className="text-gray-300 text-xs font-['Inter'] leading-relaxed">{selectedMention.content}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Author", value: `@${selectedMention.author}` },
                  { label: "Severity", value: selectedMention.severity.toUpperCase() },
                  { label: "Category", value: selectedMention.category },
                  { label: "Verified", value: selectedMention.verified ? "Yes" : "Unverified" },
                  { label: "Language", value: selectedMention.originalLang.toUpperCase() },
                  { label: "Translated", value: selectedMention.translated ? "Yes" : "No" },
                ].map((row) => (
                  <div key={row.label}>
                    <p className="text-gray-700 text-[10px] font-['JetBrains_Mono']">{row.label}</p>
                    <p className="text-gray-400 text-xs font-['Inter']">{row.value}</p>
                  </div>
                ))}
              </div>
              {selectedMention.linkedIocs.length > 0 && (
                <div>
                  <p className="text-gray-600 text-[10px] font-['JetBrains_Mono'] mb-1">LINKED IOCs</p>
                  <div className="space-y-1">
                    {selectedMention.linkedIocs.map((iocId) => (
                      <div key={iocId} className="flex items-center gap-2 px-2 py-1 rounded" style={{ background: "rgba(34,211,238,0.06)" }}>
                        <i className="ri-link text-cyan-400 text-xs" />
                        <span className="text-cyan-400 text-[10px] font-['JetBrains_Mono']">{iocId.toUpperCase()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <button className="flex-1 py-2 rounded-lg text-xs font-['Inter'] cursor-pointer whitespace-nowrap" style={{ background: "rgba(248,113,113,0.1)", color: "#F87171", border: "1px solid rgba(248,113,113,0.2)" }}>
                  <i className="ri-alarm-warning-line mr-1" />Escalate
                </button>
                <button className="flex-1 py-2 rounded-lg text-xs font-['Inter'] cursor-pointer whitespace-nowrap" style={{ background: "rgba(34,211,238,0.08)", color: "#22D3EE", border: "1px solid rgba(34,211,238,0.2)" }}>
                  <i className="ri-file-add-line mr-1" />Add to Case
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-full mb-3" style={{ background: "rgba(248,113,113,0.1)" }}>
              <i className="ri-ghost-line text-red-400 text-xl" />
            </div>
            <p className="text-gray-600 text-sm font-['Inter']">Select a mention to view details</p>
          </div>
        )}

        {/* Keyword cloud */}
        <div className="mt-4 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
          <p className="text-gray-600 text-[10px] font-['JetBrains_Mono'] mb-2">HOT KEYWORDS (24H)</p>
          <div className="flex flex-wrap gap-1.5">
            {[
              { word: "Muttrah Port", count: 8, color: "#F87171" },
              { word: "customs", count: 6, color: "#FB923C" },
              { word: "Oman", count: 14, color: "#FACC15" },
              { word: "passport", count: 5, color: "#F87171" },
              { word: "BTC", count: 9, color: "#4ADE80" },
              { word: "credentials", count: 4, color: "#F87171" },
              { word: "Salalah", count: 3, color: "#FB923C" },
              { word: "ROP", count: 4, color: "#F87171" },
              { word: "money mule", count: 3, color: "#FACC15" },
              { word: "database", count: 5, color: "#A78BFA" },
            ].map((kw) => (
              <span key={kw.word} className="text-[10px] px-2 py-0.5 rounded font-['JetBrains_Mono'] cursor-pointer" style={{ background: `${kw.color}12`, color: kw.color, border: `1px solid ${kw.color}25` }}>
                {kw.word} <span className="opacity-60">({kw.count})</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DarkWebMonitor;
