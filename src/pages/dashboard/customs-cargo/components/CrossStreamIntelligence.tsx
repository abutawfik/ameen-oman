import { useState } from "react";

interface CrossStreamIntelligenceProps {
  isAr: boolean;
}

const linkedProfiles = [
  {
    id: "CSI-2026-0041",
    person: {
      name: "Ahmed Khalid Al-Rashidi",
      nameAr: "أحمد خالد الراشدي",
      doc: "OM-4523891",
      nationality: "Omani",
      photo: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20middle%20eastern%20man%20in%20formal%20attire%2C%20clean%20white%20background%2C%20high%20quality%20portrait%20photography&width=80&height=80&seq=csi001&orientation=squarish",
      riskScore: 72,
      riskLevel: "high",
    },
    role: "Importer",
    declarations: [
      { ref: "AMN-CUS-2026-08821", type: "Import", goods: "Server infrastructure", value: "OMR 2,450,000", date: "2026-04-05", channel: "Yellow", flagged: true },
      { ref: "AMN-CUS-2026-08734", type: "Import", goods: "Electronic components", value: "OMR 890,000", date: "2026-03-22", channel: "Green", flagged: false },
      { ref: "AMN-CUS-2026-08612", type: "Export", goods: "Processed goods", value: "OMR 340,000", date: "2026-03-10", channel: "Green", flagged: false },
    ],
    crossStreamHits: [
      { stream: "Financial Events", streamAr: "الأحداث المالية", icon: "ri-bank-card-line", color: "#4ADE80", event: "Wire transfer OMR 2.1M to UAE account", date: "2026-04-04", alert: true },
      { stream: "Border Intelligence", streamAr: "استخبارات الحدود", icon: "ri-passport-line", color: "#60A5FA", event: "Entry from Dubai — 3 trips in 30 days", date: "2026-04-01", alert: true },
      { stream: "Hotel Intelligence", streamAr: "الاستخبارات الفندقية", icon: "ri-hotel-line", color: "#22D3EE", event: "Check-in: Grand Hyatt Muscat, 5 nights", date: "2026-03-28", alert: false },
      { stream: "Mobile Operators", streamAr: "مشغلو الاتصالات", icon: "ri-sim-card-line", color: "#22D3EE", event: "New SIM registered — secondary number", date: "2026-03-15", alert: false },
    ],
    matchConfidence: 98,
    matchType: "Exact",
    linkedEntities: ["Al-Rashidi Trading LLC", "Gulf Tech Solutions"],
    watchlistHit: true,
    watchlistName: "Financial Watchlist",
  },
  {
    id: "CSI-2026-0038",
    person: {
      name: "Fatima Mohammed Al-Zadjali",
      nameAr: "فاطمة محمد الزدجالية",
      doc: "OM-7823401",
      nationality: "Omani",
      photo: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20middle%20eastern%20woman%20in%20formal%20attire%2C%20clean%20white%20background%2C%20high%20quality%20portrait%20photography&width=80&height=80&seq=csi002&orientation=squarish",
      riskScore: 34,
      riskLevel: "low",
    },
    role: "Exporter",
    declarations: [
      { ref: "AMN-CUS-2026-08799", type: "Export", goods: "Dates & food products", value: "OMR 125,000", date: "2026-04-03", channel: "Green", flagged: false },
      { ref: "AMN-CUS-2026-08701", type: "Export", goods: "Handicrafts", value: "OMR 45,000", date: "2026-03-18", channel: "Green", flagged: false },
    ],
    crossStreamHits: [
      { stream: "Employment Registry", streamAr: "سجل التوظيف", icon: "ri-briefcase-line", color: "#F9A8D4", event: "Business owner — Al-Zadjali Exports LLC", date: "2026-01-10", alert: false },
      { stream: "Financial Events", streamAr: "الأحداث المالية", icon: "ri-bank-card-line", color: "#4ADE80", event: "Account opened — Commercial account", date: "2025-12-05", alert: false },
    ],
    matchConfidence: 100,
    matchType: "Exact",
    linkedEntities: ["Al-Zadjali Exports LLC"],
    watchlistHit: false,
    watchlistName: null,
  },
  {
    id: "CSI-2026-0035",
    person: {
      name: "Unknown Consignee",
      nameAr: "مستلم مجهول",
      doc: "UNKNOWN",
      nationality: "Unknown",
      photo: "https://readdy.ai/api/search-image?query=anonymous%20silhouette%20person%20unknown%20identity%20dark%20background%20minimal&width=80&height=80&seq=csi003&orientation=squarish",
      riskScore: 91,
      riskLevel: "critical",
    },
    role: "Importer",
    declarations: [
      { ref: "AMN-CUS-2026-08807", type: "Import", goods: "Chemical compounds", value: "OMR 890,000", date: "2026-04-04", channel: "Red", flagged: true },
    ],
    crossStreamHits: [
      { stream: "Border Intelligence", streamAr: "استخبارات الحدود", icon: "ri-passport-line", color: "#60A5FA", event: "No matching entry record found", date: "2026-04-04", alert: true },
      { stream: "Watchlist", streamAr: "قوائم المراقبة", icon: "ri-eye-line", color: "#F87171", event: "Possible match — National Security Watchlist (82% confidence)", date: "2026-04-04", alert: true },
    ],
    matchConfidence: 82,
    matchType: "Possible Match",
    linkedEntities: [],
    watchlistHit: true,
    watchlistName: "National Security",
  },
  {
    id: "CSI-2026-0029",
    person: {
      name: "Khalid Nasser Al-Balushi",
      nameAr: "خالد ناصر البلوشي",
      doc: "OM-3312890",
      nationality: "Omani",
      photo: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20omani%20man%20in%20business%20attire%2C%20clean%20background%2C%20high%20quality%20portrait&width=80&height=80&seq=csi004&orientation=squarish",
      riskScore: 55,
      riskLevel: "medium",
    },
    role: "Broker Agent",
    declarations: [
      { ref: "AMN-CUS-2026-08801", type: "Import", goods: "Garments bulk", value: "OMR 670,000", date: "2026-04-03", channel: "Yellow", flagged: true },
      { ref: "AMN-CUS-2026-08756", type: "Transit", goods: "Mixed goods", value: "OMR 230,000", date: "2026-03-25", channel: "Green", flagged: false },
    ],
    crossStreamHits: [
      { stream: "E-Commerce & Retail", streamAr: "التجارة الإلكترونية", icon: "ri-shopping-cart-line", color: "#34D399", event: "Bulk purchase pattern — 3 platforms", date: "2026-03-30", alert: true },
      { stream: "Transport Intelligence", streamAr: "استخبارات النقل", icon: "ri-bus-line", color: "#FB923C", event: "Frequent trips: Muscat ↔ Sohar (12 in 30 days)", date: "2026-03-28", alert: false },
      { stream: "Mobile Operators", streamAr: "مشغلو الاتصالات", icon: "ri-sim-card-line", color: "#22D3EE", event: "Roaming activated — UAE, Kuwait", date: "2026-03-20", alert: false },
    ],
    matchConfidence: 96,
    matchType: "Exact",
    linkedEntities: ["Oman Textile Imports", "Al-Balushi Trade Services"],
    watchlistHit: false,
    watchlistName: null,
  },
];

const riskColors: Record<string, string> = {
  low: "#4ADE80",
  medium: "#FACC15",
  high: "#FB923C",
  critical: "#F87171",
};

const channelColors: Record<string, string> = {
  Green: "#4ADE80",
  Yellow: "#FACC15",
  Red: "#F87171",
};

const CrossStreamIntelligence = ({ isAr }: CrossStreamIntelligenceProps) => {
  const [selectedProfile, setSelectedProfile] = useState(linkedProfiles[0]);
  const [activeSection, setActiveSection] = useState<"declarations" | "crossstream" | "network">("declarations");

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-lg font-bold font-['Inter']">
            {isAr ? "لوحة الاستخبارات متعددة المصادر" : "Cross-Stream Intelligence Panel"}
          </h2>
          <p className="text-gray-500 text-xs font-['JetBrains_Mono'] mt-0.5">
            {isAr ? "ربط الإقرارات الجمركية بملفات الأشخاص 360°" : "Linking customs declarations to Person 360° profiles — importer/exporter identity matching"}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)" }}>
          <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          <span className="text-red-400 text-xs font-['JetBrains_Mono']">2 HIGH-RISK MATCHES</span>
        </div>
      </div>

      <div className="flex gap-5">
        {/* Left: Profile list */}
        <div className="w-72 flex-shrink-0 space-y-2">
          <p className="text-gray-500 text-xs font-['Inter'] px-1">
            {isAr ? "الأشخاص المرتبطون بالإقرارات الجمركية" : "Persons linked to customs declarations"}
          </p>
          {linkedProfiles.map((profile) => (
            <button key={profile.id} onClick={() => setSelectedProfile(profile)}
              className="w-full p-3 rounded-xl text-left transition-all cursor-pointer"
              style={{
                background: selectedProfile.id === profile.id ? "rgba(34,211,238,0.08)" : "rgba(10,22,40,0.6)",
                border: `1px solid ${selectedProfile.id === profile.id ? "rgba(34,211,238,0.25)" : profile.watchlistHit ? "rgba(248,113,113,0.2)" : "rgba(255,255,255,0.05)"}`,
              }}>
              <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <img src={profile.person.photo} alt="" className="w-10 h-10 rounded-lg object-cover object-top" />
                  {profile.watchlistHit && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "#F87171" }}>
                      <i className="ri-eye-line text-white" style={{ fontSize: "8px" }} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-semibold font-['Inter'] truncate">{isAr ? profile.person.nameAr : profile.person.name}</p>
                  <p className="text-gray-500 text-xs font-['JetBrains_Mono']">{profile.person.doc}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-['Inter']" style={{ color: riskColors[profile.person.riskLevel] }}>
                      Risk: {profile.person.riskScore}
                    </span>
                    <span className="text-gray-600 text-xs">·</span>
                    <span className="text-xs font-['Inter']" style={{ color: profile.matchType === "Exact" ? "#4ADE80" : "#FACC15" }}>
                      {profile.matchConfidence}%
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Right: Detail panel */}
        <div className="flex-1 space-y-4">
          {/* Person card */}
          <div className="p-5 rounded-xl" style={{ background: "rgba(10,22,40,0.8)", border: `1px solid ${selectedProfile.watchlistHit ? "rgba(248,113,113,0.3)" : "rgba(34,211,238,0.1)"}` }}>
            <div className="flex items-start gap-4">
              <div className="relative flex-shrink-0">
                <img src={selectedProfile.person.photo} alt="" className="w-16 h-16 rounded-xl object-cover object-top" />
                {selectedProfile.watchlistHit && (
                  <div className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full flex items-center gap-1"
                    style={{ background: "#F87171", fontSize: "9px" }}>
                    <i className="ri-eye-line text-white" style={{ fontSize: "8px" }} />
                    <span className="text-white font-bold font-['Inter']">WATCHLIST</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-white text-base font-bold font-['Inter']">{isAr ? selectedProfile.person.nameAr : selectedProfile.person.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-cyan-400 text-xs font-['JetBrains_Mono']">{selectedProfile.person.doc}</span>
                      <span className="text-gray-500 text-xs font-['Inter']">{selectedProfile.person.nationality}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold font-['Inter']"
                        style={{ background: "rgba(34,211,238,0.1)", color: "#22D3EE", border: "1px solid rgba(34,211,238,0.2)" }}>
                        {selectedProfile.role}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold font-['JetBrains_Mono']" style={{ color: riskColors[selectedProfile.person.riskLevel] }}>
                      {selectedProfile.person.riskScore}
                    </div>
                    <div className="text-xs text-gray-500 font-['Inter']">Risk Score</div>
                  </div>
                </div>

                {/* Match info */}
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                    style={{ background: selectedProfile.matchType === "Exact" ? "rgba(74,222,128,0.1)" : "rgba(250,204,21,0.1)", border: `1px solid ${selectedProfile.matchType === "Exact" ? "rgba(74,222,128,0.25)" : "rgba(250,204,21,0.25)"}` }}>
                    <i className={`${selectedProfile.matchType === "Exact" ? "ri-checkbox-circle-line text-green-400" : "ri-question-line text-yellow-400"} text-xs`} />
                    <span className="text-xs font-semibold font-['Inter']" style={{ color: selectedProfile.matchType === "Exact" ? "#4ADE80" : "#FACC15" }}>
                      {selectedProfile.matchType} Match — {selectedProfile.matchConfidence}% confidence
                    </span>
                  </div>
                  {selectedProfile.watchlistHit && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)" }}>
                      <i className="ri-eye-line text-red-400 text-xs" />
                      <span className="text-red-400 text-xs font-semibold font-['Inter']">{selectedProfile.watchlistName}</span>
                    </div>
                  )}
                </div>

                {/* Linked entities */}
                {selectedProfile.linkedEntities.length > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-gray-500 text-xs font-['Inter']">{isAr ? "الكيانات المرتبطة:" : "Linked entities:"}</span>
                    {selectedProfile.linkedEntities.map((e) => (
                      <span key={e} className="px-2 py-0.5 rounded-full text-xs font-['Inter']"
                        style={{ background: "rgba(167,139,250,0.1)", color: "#A78BFA", border: "1px solid rgba(167,139,250,0.2)" }}>
                        {e}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section tabs */}
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(10,22,40,0.8)", border: "1px solid rgba(34,211,238,0.08)" }}>
            {[
              { id: "declarations", label: "Customs Declarations", labelAr: "الإقرارات الجمركية", icon: "ri-file-list-3-line" },
              { id: "crossstream", label: "Cross-Stream Hits", labelAr: "تطابقات متعددة المصادر", icon: "ri-git-branch-line" },
              { id: "network", label: "Network View", labelAr: "عرض الشبكة", icon: "ri-share-line" },
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveSection(tab.id as typeof activeSection)}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap font-['Inter']"
                style={{
                  background: activeSection === tab.id ? "rgba(34,211,238,0.12)" : "transparent",
                  color: activeSection === tab.id ? "#22D3EE" : "#6B7280",
                  border: activeSection === tab.id ? "1px solid rgba(34,211,238,0.25)" : "1px solid transparent",
                }}>
                <i className={`${tab.icon} text-sm`} />
                {isAr ? tab.labelAr : tab.label}
              </button>
            ))}
          </div>

          {/* Declarations */}
          {activeSection === "declarations" && (
            <div className="space-y-2">
              {selectedProfile.declarations.map((d) => (
                <div key={d.ref} className="p-4 rounded-xl transition-all"
                  style={{
                    background: d.flagged ? "rgba(248,113,113,0.05)" : "rgba(10,22,40,0.8)",
                    border: `1px solid ${d.flagged ? "rgba(248,113,113,0.2)" : "rgba(34,211,238,0.08)"}`,
                  }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center rounded-lg"
                        style={{ background: d.type === "Import" ? "rgba(34,211,238,0.1)" : d.type === "Export" ? "rgba(74,222,128,0.1)" : "rgba(250,204,21,0.1)" }}>
                        <i className={`${d.type === "Import" ? "ri-download-2-line text-cyan-400" : d.type === "Export" ? "ri-upload-2-line text-green-400" : "ri-arrow-left-right-line text-yellow-400"} text-sm`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-cyan-400 text-xs font-['JetBrains_Mono'] font-bold">{d.ref}</span>
                          {d.flagged && <span className="px-1.5 py-0.5 rounded text-xs font-['Inter']" style={{ background: "rgba(248,113,113,0.15)", color: "#F87171" }}>FLAGGED</span>}
                        </div>
                        <p className="text-gray-400 text-xs font-['Inter'] mt-0.5">{d.goods} · {d.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white text-sm font-bold font-['JetBrains_Mono']">{d.value}</div>
                      <div className="flex items-center justify-end gap-1 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: channelColors[d.channel] }} />
                        <span className="text-xs font-['Inter']" style={{ color: channelColors[d.channel] }}>{d.channel}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Cross-stream hits */}
          {activeSection === "crossstream" && (
            <div className="space-y-3">
              <p className="text-gray-500 text-xs font-['Inter']">
                {isAr ? "أحداث مرتبطة بهذا الشخص عبر مصادر البيانات الأخرى" : "Events linked to this person across other data streams"}
              </p>
              {selectedProfile.crossStreamHits.map((hit, i) => (
                <div key={i} className="p-4 rounded-xl"
                  style={{
                    background: hit.alert ? "rgba(248,113,113,0.05)" : "rgba(10,22,40,0.8)",
                    border: `1px solid ${hit.alert ? "rgba(248,113,113,0.2)" : "rgba(34,211,238,0.08)"}`,
                  }}>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0"
                      style={{ background: `${hit.color}15`, border: `1px solid ${hit.color}25` }}>
                      <i className={`${hit.icon} text-sm`} style={{ color: hit.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold font-['Inter']" style={{ color: hit.color }}>
                          {isAr ? hit.streamAr : hit.stream}
                        </span>
                        <div className="flex items-center gap-2">
                          {hit.alert && (
                            <span className="px-1.5 py-0.5 rounded text-xs font-['Inter']"
                              style={{ background: "rgba(248,113,113,0.15)", color: "#F87171" }}>ALERT</span>
                          )}
                          <span className="text-gray-600 text-xs font-['JetBrains_Mono']">{hit.date}</span>
                        </div>
                      </div>
                      <p className="text-gray-300 text-xs font-['Inter']">{hit.event}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Network view */}
          {activeSection === "network" && (
            <div className="p-5 rounded-xl" style={{ background: "rgba(10,22,40,0.8)", border: "1px solid rgba(34,211,238,0.1)" }}>
              <h4 className="text-white text-sm font-bold font-['Inter'] mb-4">
                {isAr ? "شبكة الروابط" : "Entity Network"}
              </h4>
              {/* Visual network */}
              <div className="relative rounded-xl overflow-hidden" style={{ height: "280px", background: "rgba(6,13,26,0.9)", border: "1px solid rgba(34,211,238,0.06)" }}>
                <div className="absolute inset-0 opacity-5"
                  style={{
                    backgroundImage: "linear-gradient(rgba(34,211,238,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.5) 1px, transparent 1px)",
                    backgroundSize: "25px 25px",
                  }} />

                {/* Center node — person */}
                <div className="absolute" style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full animate-ping" style={{ background: `${riskColors[selectedProfile.person.riskLevel]}15`, border: `1px solid ${riskColors[selectedProfile.person.riskLevel]}30`, width: "64px", height: "64px" }} />
                    <div className="w-14 h-14 rounded-full overflow-hidden relative z-10" style={{ border: `2px solid ${riskColors[selectedProfile.person.riskLevel]}` }}>
                      <img src={selectedProfile.person.photo} alt="" className="w-full h-full object-cover object-top" />
                    </div>
                    <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-white text-xs font-bold font-['Inter']" style={{ fontSize: "9px" }}>
                      {selectedProfile.person.name.split(" ")[0]}
                    </div>
                  </div>
                </div>

                {/* Connected nodes */}
                {[
                  { label: "Customs", icon: "ri-ship-line", color: "#FCD34D", pos: { top: "15%", left: "20%" } },
                  { label: "Financial", icon: "ri-bank-card-line", color: "#4ADE80", pos: { top: "15%", left: "70%" } },
                  { label: "Border", icon: "ri-passport-line", color: "#60A5FA", pos: { top: "70%", left: "15%" } },
                  { label: "Hotel", icon: "ri-hotel-line", color: "#22D3EE", pos: { top: "70%", left: "75%" } },
                  ...(selectedProfile.linkedEntities.length > 0 ? [{ label: selectedProfile.linkedEntities[0].split(" ")[0], icon: "ri-building-line", color: "#A78BFA", pos: { top: "40%", left: "82%" } }] : []),
                ].map((node, i) => (
                  <div key={i} className="absolute flex flex-col items-center gap-1" style={{ ...node.pos, transform: "translate(-50%,-50%)" }}>
                    {/* Line to center */}
                    <div className="absolute" style={{
                      width: "2px",
                      height: "60px",
                      background: `linear-gradient(${node.color}40, transparent)`,
                      transformOrigin: "top",
                      transform: "rotate(45deg)",
                      opacity: 0.4,
                    }} />
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center relative z-10"
                      style={{ background: `${node.color}15`, border: `1px solid ${node.color}40` }}>
                      <i className={`${node.icon} text-sm`} style={{ color: node.color }} />
                    </div>
                    <span className="text-gray-500 font-['Inter'] whitespace-nowrap" style={{ fontSize: "9px" }}>{node.label}</span>
                  </div>
                ))}
              </div>

              {/* Stream summary */}
              <div className="grid grid-cols-4 gap-2 mt-4">
                {[
                  { label: "Streams Hit", value: selectedProfile.crossStreamHits.length, color: "#22D3EE" },
                  { label: "Declarations", value: selectedProfile.declarations.length, color: "#FCD34D" },
                  { label: "Alerts", value: selectedProfile.crossStreamHits.filter((h) => h.alert).length, color: "#F87171" },
                  { label: "Entities", value: selectedProfile.linkedEntities.length || "—", color: "#A78BFA" },
                ].map((s) => (
                  <div key={s.label} className="p-2 rounded-lg text-center" style={{ background: `${s.color}08`, border: `1px solid ${s.color}20` }}>
                    <div className="text-base font-bold font-['JetBrains_Mono']" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-xs text-gray-500 font-['Inter']">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CrossStreamIntelligence;
