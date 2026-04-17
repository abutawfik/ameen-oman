import { useState } from "react";
import { mockFieldPerson, mockWatchlistHits, mockBiometricResults } from "@/mocks/mobileFieldData";

interface Props {
  isAr: boolean;
  onBack: () => void;
}

const riskColors = { low: "#4ADE80", medium: "#FACC15", high: "#FB923C", critical: "#F87171" };

const watchlistTypeColors: Record<string, string> = {
  national_security: "#F87171",
  interpol: "#A78BFA",
  financial: "#FACC15",
  employment: "#FB923C",
  overstay: "#FB923C",
  custom: "#D4A84B",
};

const PersonLookup = ({ isAr, onBack }: Props) => {
  const [query, setQuery] = useState("");
  const [scanning, setScanning] = useState(false);
  const [found, setFound] = useState(false);
  const [activeTab, setActiveTab] = useState<"identity" | "watchlist" | "events" | "biometric">("identity");
  const [confirmSighting, setConfirmSighting] = useState(false);
  const [backupRequested, setBackupRequested] = useState(false);
  const [reportCreated, setReportCreated] = useState(false);
  const [runningBiometric, setRunningBiometric] = useState(false);
  const [biometricDone, setBiometricDone] = useState(false);

  const person = mockFieldPerson;
  const riskColor = riskColors[person.riskLevel];

  const handleSearch = () => {
    if (query.length > 2) setFound(true);
  };

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setQuery("PK-8823401");
      setFound(true);
    }, 2200);
  };

  const handleBiometric = () => {
    setRunningBiometric(true);
    setTimeout(() => {
      setRunningBiometric(false);
      setBiometricDone(true);
      setActiveTab("biometric");
    }, 2500);
  };

  const RiskRing = ({ score, color }: { score: number; color: string }) => {
    const r = 26;
    const circ = 2 * Math.PI * r;
    const offset = circ - (score / 100) * circ;
    return (
      <div className="relative w-14 h-14 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 60 60">
          <circle cx="30" cy="30" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
          <circle cx="30" cy="30" r={r} fill="none" stroke={color} strokeWidth="5"
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
        </svg>
        <span className="text-sm font-black font-['JetBrains_Mono'] z-10" style={{ color }}>{score}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search bar */}
      <div className="px-3 pt-3 pb-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-2xl"
            style={{ background: "rgba(20,29,46,0.9)", border: "1.5px solid rgba(181,142,60,0.35)" }}>
            <i className="ri-search-line text-gold-400 text-base flex-shrink-0" />
            <input type="text" value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder={isAr ? "رقم المستند، الاسم، الهاتف..." : "Document, name, phone..."}
              className="flex-1 bg-transparent text-white text-sm font-['Inter'] outline-none placeholder-gray-600" />
            {query && (
              <button onClick={() => { setQuery(""); setFound(false); }} className="text-gray-600 cursor-pointer">
                <i className="ri-close-line text-sm" />
              </button>
            )}
          </div>
          <button onClick={handleScan}
            className="w-11 h-11 flex items-center justify-center rounded-2xl cursor-pointer flex-shrink-0"
            style={{ background: scanning ? "rgba(181,142,60,0.2)" : "rgba(181,142,60,0.1)", border: "1.5px solid rgba(181,142,60,0.4)" }}>
            {scanning
              ? <div className="w-4 h-4 rounded-full border-2 border-gold-400 border-t-transparent animate-spin" />
              : <i className="ri-camera-line text-gold-400 text-lg" />}
          </button>
        </div>
        {scanning && (
          <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: "rgba(181,142,60,0.06)", border: "1px solid rgba(181,142,60,0.2)" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
            <span className="text-gold-400 text-xs font-['JetBrains_Mono']">{isAr ? "جارٍ قراءة MRZ..." : "Reading MRZ passport chip..."}</span>
          </div>
        )}
        {!found && !scanning && (
          <button onClick={handleSearch}
            className="mt-2 w-full py-2.5 rounded-2xl text-sm font-bold font-['Inter'] cursor-pointer"
            style={{ background: "#D4A84B", color: "#0B1220" }}>
            {isAr ? "بحث" : "Search"}
          </button>
        )}
      </div>

      {/* Result */}
      {found && (
        <div className="flex-1 overflow-y-auto px-3 pb-4" style={{ scrollbarWidth: "none" }}>
          {/* Identity header */}
          <div className="rounded-2xl p-3 mb-2"
            style={{ background: "rgba(20,29,46,0.9)", border: `1.5px solid ${riskColor}44` }}>
            <div className="flex items-start gap-3">
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-xl overflow-hidden"
                  style={{ border: `2px solid ${riskColor}66` }}>
                  <img src={person.photo} alt="" className="w-full h-full object-cover object-top" />
                </div>
                {/* Watchlist badge */}
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: "#F87171", border: "1.5px solid #0B1220" }}>
                  <i className="ri-eye-fill text-[8px] text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white text-sm font-black font-['Inter'] leading-tight">{person.nameEn}</h3>
                <p className="text-gray-400 text-xs font-['Cairo'] mt-0.5">{person.nameAr}</p>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  <span className="text-[9px] font-['JetBrains_Mono'] px-1.5 py-0.5 rounded-full"
                    style={{ background: "rgba(181,142,60,0.1)", color: "#D4A84B", border: "1px solid rgba(181,142,60,0.2)" }}>
                    {person.docType}: {person.docNumber}
                  </span>
                  <span className="text-[10px] font-['Inter']">{person.nationalityFlag} {person.nationality}</span>
                </div>
                {/* Watchlist warning */}
                <div className="flex items-center gap-1 mt-1.5 px-2 py-1 rounded-lg"
                  style={{ background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.3)" }}>
                  <i className="ri-alarm-warning-fill text-red-400 text-[10px]" />
                  <span className="text-red-400 text-[9px] font-bold font-['JetBrains_Mono']">
                    {mockWatchlistHits.length} WATCHLIST HITS
                  </span>
                </div>
              </div>
              <RiskRing score={person.riskScore} color={riskColor} />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-3">
            {([
              { key: "identity", label: "ID", labelAr: "هوية", icon: "ri-user-line" },
              { key: "watchlist", label: "Watch", labelAr: "قوائم", icon: "ri-eye-line" },
              { key: "events", label: "Events", labelAr: "أحداث", icon: "ri-history-line" },
              { key: "biometric", label: "Bio", labelAr: "بيومتري", icon: "ri-fingerprint-line" },
            ] as const).map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-[10px] font-bold font-['JetBrains_Mono'] cursor-pointer transition-all"
                style={{
                  background: activeTab === tab.key ? "#D4A84B" : "rgba(20,29,46,0.8)",
                  color: activeTab === tab.key ? "#0B1220" : "#6B7280",
                  border: activeTab === tab.key ? "none" : "1px solid rgba(255,255,255,0.06)",
                }}>
                <i className={`${tab.icon} text-xs`} />
                {isAr ? tab.labelAr : tab.label}
              </button>
            ))}
          </div>

          {/* Identity tab */}
          {activeTab === "identity" && (
            <div className="rounded-2xl p-3 mb-3"
              style={{ background: "rgba(20,29,46,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {[
                  { k: isAr ? "العمر" : "Age", v: `${person.age} yrs` },
                  { k: isAr ? "الجنس" : "Gender", v: person.gender },
                  { k: isAr ? "الحالة" : "Status", v: isAr ? "داخل البلاد" : "In-Country", color: "#4ADE80" },
                  { k: isAr ? "التنبيهات" : "Alerts", v: `${person.patternAlerts}`, color: "#F87171" },
                  { k: isAr ? "تاريخ الميلاد" : "DOB", v: person.dob },
                  { k: isAr ? "نوع الوثيقة" : "Doc Type", v: person.docType },
                ].map((f) => (
                  <div key={f.k} className="px-2.5 py-2 rounded-xl"
                    style={{ background: "rgba(11,18,32,0.6)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <p className="text-gray-600 text-[9px] font-['JetBrains_Mono'] uppercase">{f.k}</p>
                    <p className="text-sm font-bold font-['JetBrains_Mono'] mt-0.5"
                      style={{ color: f.color || "#D1D5DB" }}>{f.v}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 px-2.5 py-2 rounded-xl"
                style={{ background: "rgba(11,18,32,0.6)", border: "1px solid rgba(181,142,60,0.1)" }}>
                <i className="ri-map-pin-line text-gold-400 text-sm flex-shrink-0" />
                <div>
                  <p className="text-gray-600 text-[9px] font-['JetBrains_Mono'] uppercase">{isAr ? "آخر موقع" : "Last Location"}</p>
                  <p className="text-white text-xs font-['Inter']">{person.lastLocation} · {person.lastSeen}</p>
                </div>
              </div>
            </div>
          )}

          {/* Watchlist tab */}
          {activeTab === "watchlist" && (
            <div className="space-y-2 mb-3">
              {mockWatchlistHits.map((hit, i) => (
                <div key={i} className="rounded-2xl p-3"
                  style={{ background: "rgba(20,29,46,0.9)", border: `1px solid ${watchlistTypeColors[hit.listType]}30` }}>
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0"
                      style={{ background: `${watchlistTypeColors[hit.listType]}18` }}>
                      <i className="ri-eye-line text-xs" style={{ color: watchlistTypeColors[hit.listType] }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-bold font-['Inter']">
                        {isAr ? hit.listNameAr : hit.listName}
                      </p>
                      <p className="text-gray-500 text-[9px] font-['JetBrains_Mono'] mt-0.5">
                        Added: {hit.addedDate}
                      </p>
                    </div>
                    <span className="text-[9px] font-bold font-['JetBrains_Mono'] px-1.5 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: `${watchlistTypeColors[hit.listType]}18`, color: watchlistTypeColors[hit.listType] }}>
                      {hit.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
              <div className="px-3 py-2.5 rounded-xl"
                style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}>
                <p className="text-red-400 text-[10px] font-bold font-['JetBrains_Mono'] mb-1">
                  <i className="ri-alert-fill mr-1" />FIELD OFFICER INSTRUCTIONS
                </p>
                <p className="text-gray-400 text-[10px] font-['Inter']">
                  {isAr ? "لا تقترب دون تصريح. اتصل بمركز القيادة فوراً." : "Do not approach without authorization. Contact Command Center immediately."}
                </p>
              </div>
            </div>
          )}

          {/* Events tab */}
          {activeTab === "events" && (
            <div className="rounded-2xl p-3 mb-3"
              style={{ background: "rgba(20,29,46,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="relative">
                <div className="absolute left-3 top-0 bottom-0 w-px"
                  style={{ background: "linear-gradient(to bottom, rgba(181,142,60,0.5), transparent)" }} />
                <div className="space-y-3">
                  {person.recentEvents.map((ev, i) => (
                    <div key={i} className="flex items-start gap-3 pl-8 relative">
                      <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full flex items-center justify-center z-10"
                        style={{ background: `${ev.streamColor}22`, border: `1.5px solid ${ev.streamColor}` }}>
                        <i className={`${ev.streamIcon} text-[7px]`} style={{ color: ev.streamColor }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          {ev.isAlert && (
                            <span className="text-[9px] font-bold font-['JetBrains_Mono'] px-1 py-0.5 rounded"
                              style={{ background: "rgba(248,113,113,0.15)", color: "#F87171" }}>
                              ALERT
                            </span>
                          )}
                          <span className="text-[9px] font-['JetBrains_Mono'] uppercase" style={{ color: ev.streamColor }}>{ev.stream}</span>
                        </div>
                        <p className="text-white text-xs font-['Inter'] leading-snug">{ev.description}</p>
                        <p className="text-gray-600 text-[10px] font-['JetBrains_Mono'] mt-0.5">{ev.datetime} · {ev.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Biometric tab */}
          {activeTab === "biometric" && (
            <div className="space-y-2 mb-3">
              {!biometricDone && !runningBiometric && (
                <button onClick={handleBiometric}
                  className="w-full flex flex-col items-center gap-3 py-6 rounded-2xl cursor-pointer"
                  style={{ background: "rgba(20,29,46,0.9)", border: "1.5px dashed rgba(181,142,60,0.3)" }}>
                  <i className="ri-fingerprint-line text-gold-400 text-3xl" />
                  <p className="text-white text-sm font-bold font-['Inter']">
                    {isAr ? "تشغيل المطابقة البيومترية" : "Run Biometric Match"}
                  </p>
                  <p className="text-gray-500 text-xs font-['Inter']">
                    {isAr ? "وجه + بصمة + قزحية" : "Face + Fingerprint + Iris"}
                  </p>
                </button>
              )}
              {runningBiometric && (
                <div className="flex flex-col items-center gap-3 py-6 rounded-2xl"
                  style={{ background: "rgba(20,29,46,0.9)", border: "1px solid rgba(181,142,60,0.2)" }}>
                  <div className="w-12 h-12 rounded-full border-2 border-gold-400 border-t-transparent animate-spin" />
                  <p className="text-gold-400 text-sm font-['JetBrains_Mono']">
                    {isAr ? "جارٍ المطابقة البيومترية..." : "Running biometric match..."}
                  </p>
                </div>
              )}
              {biometricDone && mockBiometricResults.map((result, i) => (
                <div key={i} className="rounded-2xl p-3"
                  style={{ background: "rgba(20,29,46,0.9)", border: "1px solid rgba(74,222,128,0.3)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0"
                      style={{ background: "rgba(74,222,128,0.15)" }}>
                      <i className={`${result.type === "face" ? "ri-user-smile-line" : result.type === "fingerprint" ? "ri-fingerprint-line" : "ri-eye-line"} text-green-400 text-base`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-white text-xs font-bold font-['Inter'] capitalize">{result.type} Match</p>
                        <span className="text-green-400 font-black font-['JetBrains_Mono'] text-sm">{result.confidence}%</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <div className="h-full rounded-full" style={{ width: `${result.confidence}%`, background: "#4ADE80" }} />
                      </div>
                      <p className="text-gray-500 text-[9px] font-['JetBrains_Mono'] mt-1">{result.matchedRecord} · {result.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <div className="space-y-2">
            <button onClick={() => setConfirmSighting(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold font-['Inter'] cursor-pointer transition-all"
              style={{ background: confirmSighting ? "rgba(181,142,60,0.2)" : "#D4A84B", color: confirmSighting ? "#D4A84B" : "#0B1220", border: confirmSighting ? "1.5px solid #D4A84B" : "none" }}>
              <i className={confirmSighting ? "ri-checkbox-circle-fill" : "ri-eye-line"} />
              {confirmSighting ? (isAr ? "تم تأكيد الرؤية ✓" : "Sighting Confirmed ✓") : (isAr ? "تأكيد الرؤية" : "Confirm Sighting")}
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setBackupRequested(true)}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-2xl text-xs font-bold font-['Inter'] cursor-pointer"
                style={{ background: backupRequested ? "rgba(250,204,21,0.15)" : "rgba(250,204,21,0.1)", color: "#FACC15", border: `1.5px solid ${backupRequested ? "#FACC15" : "rgba(250,204,21,0.3)"}` }}>
                <i className={backupRequested ? "ri-checkbox-circle-fill" : "ri-team-line"} />
                {backupRequested ? (isAr ? "تم ✓" : "Sent ✓") : (isAr ? "طلب دعم" : "Request Backup")}
              </button>
              <button onClick={() => setReportCreated(true)}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-2xl text-xs font-bold font-['Inter'] cursor-pointer"
                style={{ background: reportCreated ? "rgba(248,113,113,0.15)" : "rgba(248,113,113,0.1)", color: "#F87171", border: `1.5px solid ${reportCreated ? "#F87171" : "rgba(248,113,113,0.3)"}` }}>
                <i className={reportCreated ? "ri-checkbox-circle-fill" : "ri-file-text-line"} />
                {reportCreated ? (isAr ? "تم ✓" : "Created ✓") : (isAr ? "إنشاء تقرير" : "Create Report")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!found && !scanning && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: "rgba(181,142,60,0.06)", border: "1px solid rgba(181,142,60,0.15)" }}>
            <i className="ri-user-search-line text-gold-400/40 text-3xl" />
          </div>
          <p className="text-gray-600 text-sm font-['Inter'] text-center">
            {isAr ? "أدخل رقم المستند أو امسح جواز السفر" : "Enter document number or scan passport MRZ"}
          </p>
          <p className="text-gray-700 text-xs font-['JetBrains_Mono'] text-center">
            {isAr ? "مثال: PK-8823401" : "e.g. PK-8823401"}
          </p>
        </div>
      )}
    </div>
  );
};

export default PersonLookup;
