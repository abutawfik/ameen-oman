import { useState, useEffect } from "react";
import FieldDashboard from "./components/FieldDashboard";
import PersonLookup from "./components/PersonLookup";
import AlertDetail from "./components/AlertDetail";
import FieldReportForm from "./components/FieldReportForm";
import FieldMap from "./components/FieldMap";
import { fieldAlerts, type FieldAlert } from "@/mocks/mobileFieldData";

type Screen = "lock" | "dashboard" | "lookup" | "alert" | "report" | "map";

const MobileFieldPage = () => {
  const [isAr, setIsAr] = useState(false);
  const [screen, setScreen] = useState<Screen>("lock");
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [biometricDone, setBiometricDone] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<FieldAlert | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [time, setTime] = useState(new Date());
  const [autoLockTimer, setAutoLockTimer] = useState(30);
  const [pendingSync] = useState(3);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (screen === "lock") return;
    const t = setInterval(() => {
      setAutoLockTimer((prev) => {
        if (prev <= 1) { setScreen("lock"); setPin(""); return 30; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [screen]);

  const resetLockTimer = () => setAutoLockTimer(30);

  const handlePinInput = (digit: string) => {
    resetLockTimer();
    const newPin = pin + digit;
    setPin(newPin);
    if (newPin.length === 4) {
      if (newPin === "1234") {
        setScreen("dashboard");
        setPin("");
        setPinError(false);
      } else {
        setPinError(true);
        setTimeout(() => { setPin(""); setPinError(false); }, 800);
      }
    }
  };

  const handleBiometric = () => {
    setBiometricDone(true);
    setTimeout(() => {
      setScreen("dashboard");
      setBiometricDone(false);
    }, 1200);
  };

  const criticalCount = fieldAlerts.filter((a) => a.priority === "critical" && a.status === "new").length;

  const navItems = [
    { key: "dashboard" as Screen, icon: "ri-home-5-line",    labelEn: "Home",   labelAr: "الرئيسية" },
    { key: "lookup"    as Screen, icon: "ri-user-search-line",labelEn: "Lookup", labelAr: "بحث" },
    { key: "map"       as Screen, icon: "ri-map-2-line",      labelEn: "Map",    labelAr: "الخريطة" },
    { key: "report"    as Screen, icon: "ri-file-text-line",  labelEn: "Report", labelAr: "تقرير" },
  ];

  const timeStr = time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  const dateStr = time.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  return (
    <div
      className="min-h-screen flex items-center justify-center py-8 px-4"
      style={{ background: "#030810" }}
      onClick={resetLockTimer}
    >
      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04]">
        <svg width="100%" height="100%"><defs><pattern id="mf-bg" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M 50 0 L 0 0 0 50" fill="none" stroke="#D4A84B" strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#mf-bg)"/></svg>
      </div>

      {/* Desktop context label */}
      <div className="hidden lg:flex flex-col items-center gap-6 mr-12 max-w-xs">
        <div className="text-center">
          <div className="flex items-center gap-2 justify-center mb-3">
            <div className="w-8 h-8 flex items-center justify-center rounded-xl" style={{ background: "rgba(181,142,60,0.1)", border: "1px solid rgba(181,142,60,0.3)" }}>
              <i className="ri-smartphone-line text-gold-400 text-base" />
            </div>
            <span className="text-gold-400 font-black text-lg font-['Inter'] tracking-widest">Al-Ameen Mobile</span>
          </div>
          <p className="text-gray-400 text-sm font-['Inter'] leading-relaxed">
            Field Officer Application for National Police. Secure, offline-capable intelligence tool for field operations.
          </p>
        </div>
        <div className="space-y-2 w-full">
          {[
            { icon: "ri-fingerprint-line", text: "Biometric + PIN authentication" },
            { icon: "ri-lock-line",        text: "Auto-lock after 30 seconds" },
            { icon: "ri-wifi-off-line",    text: "Full offline capability" },
            { icon: "ri-shield-check-line",text: "Certificate pinning + remote wipe" },
            { icon: "ri-user-search-line", text: "MRZ passport scanning" },
            { icon: "ri-alarm-warning-line",text: "Auto-escalation integration" },
          ].map((f) => (
            <div key={f.text} className="flex items-center gap-2.5 px-3 py-2 rounded-xl" style={{ background: "rgba(20,29,46,0.6)", border: "1px solid rgba(181,142,60,0.08)" }}>
              <i className={`${f.icon} text-gold-400 text-sm flex-shrink-0`} />
              <span className="text-gray-400 text-xs font-['Inter']">{f.text}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOnline(!isOnline)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-['JetBrains_Mono'] cursor-pointer"
            style={{ background: isOnline ? "rgba(74,222,128,0.1)" : "rgba(250,204,21,0.1)", color: isOnline ? "#4ADE80" : "#FACC15", border: `1px solid ${isOnline ? "rgba(74,222,128,0.3)" : "rgba(250,204,21,0.3)"}` }}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: isOnline ? "#4ADE80" : "#FACC15" }} />
            {isOnline ? "Online" : `Offline (${pendingSync} queued)`}
          </button>
          <button
            onClick={() => setIsAr(!isAr)}
            className="px-3 py-2 rounded-xl text-xs font-bold font-['JetBrains_Mono'] cursor-pointer"
            style={{ background: "rgba(181,142,60,0.08)", color: "#D4A84B", border: "1px solid rgba(181,142,60,0.2)" }}
          >
            {isAr ? "EN" : "AR"}
          </button>
        </div>
      </div>

      {/* Phone frame */}
      <div
        className="relative flex-shrink-0"
        style={{
          width: "390px",
          height: "844px",
          borderRadius: "50px",
          background: "#0A0F1A",
          border: "2px solid rgba(181,142,60,0.25)",
          boxShadow: "0 0 60px rgba(181,142,60,0.08), 0 40px 80px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.04)",
          overflow: "hidden",
        }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50" style={{ width: "120px", height: "34px", background: "#0A0F1A", borderRadius: "0 0 20px 20px" }} />

        {/* Status bar */}
        <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-6 pt-3 pb-1" style={{ height: "44px" }}>
          <span className="text-white text-xs font-bold font-['JetBrains_Mono']">{timeStr}</span>
          <div className="flex items-center gap-1.5">
            {!isOnline && <i className="ri-wifi-off-line text-yellow-400 text-xs" />}
            {isOnline && <i className="ri-wifi-line text-white text-xs" />}
            <i className="ri-signal-wifi-3-line text-white text-xs" />
            <i className="ri-battery-2-charge-line text-white text-xs" />
          </div>
        </div>

        {/* RED CLASSIFICATION BANNER */}
        <div
          className="absolute z-50 flex items-center justify-center gap-2"
          style={{ top: "44px", left: 0, right: 0, height: "22px", background: "rgba(220,38,38,0.95)", backdropFilter: "blur(4px)" }}
        >
          <i className="ri-shield-fill text-white text-[10px]" />
          <span className="text-white text-[9px] font-black font-['JetBrains_Mono'] uppercase tracking-widest">
            {isAr ? "سري للغاية — Al-Ameen" : "TOP SECRET — Al-Ameen CLASSIFIED"}
          </span>
          <i className="ri-shield-fill text-white text-[10px]" />
        </div>

        {/* Main content area */}
        <div
          className="absolute flex flex-col"
          style={{ top: "66px", left: 0, right: 0, bottom: screen !== "lock" ? "80px" : 0, background: "#0B1220" }}
        >
          {/* Offline banner */}
          {!isOnline && screen !== "lock" && (
            <div className="flex items-center gap-2 px-4 py-2 flex-shrink-0" style={{ background: "rgba(250,204,21,0.1)", borderBottom: "1px solid rgba(250,204,21,0.2)" }}>
              <i className="ri-wifi-off-line text-yellow-400 text-xs" />
              <span className="text-yellow-400 text-[10px] font-['JetBrains_Mono']">
                {isAr ? `وضع عدم الاتصال — ${pendingSync} تقارير في قائمة الانتظار` : `Offline Mode — ${pendingSync} reports queued`}
              </span>
            </div>
          )}

          {/* Auto-lock timer (subtle) */}
          {screen !== "lock" && (
            <div className="absolute top-1 right-3 z-20">
              <span className="text-gray-800 text-[9px] font-['JetBrains_Mono']">{autoLockTimer}s</span>
            </div>
          )}

          {/* LOCK SCREEN */}
          {screen === "lock" && (
            <div className="flex flex-col items-center justify-center h-full px-8 gap-6" style={{ background: "#0B1220" }}>
              {/* Police emblem */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "rgba(181,142,60,0.1)", border: "2px solid rgba(181,142,60,0.4)", boxShadow: "0 0 24px rgba(181,142,60,0.15)" }}>
                  <i className="ri-shield-star-fill text-gold-400 text-3xl" />
                </div>
                <p className="text-gold-400 font-black text-xl font-['Inter'] tracking-widest">Al-Ameen</p>
                <p className="text-gray-500 text-xs font-['JetBrains_Mono']">{isAr ? "تطبيق الضباط الميدانيين" : "Field Officer Application"}</p>
                <p className="text-gray-600 text-[10px] font-['JetBrains_Mono']">{dateStr}</p>
              </div>

              {/* Biometric */}
              <button
                onClick={handleBiometric}
                className="flex flex-col items-center gap-2 cursor-pointer"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center transition-all"
                  style={{
                    background: biometricDone ? "rgba(74,222,128,0.2)" : "rgba(181,142,60,0.08)",
                    border: biometricDone ? "2px solid #4ADE80" : "2px solid rgba(181,142,60,0.3)",
                    boxShadow: biometricDone ? "0 0 20px rgba(74,222,128,0.4)" : "none",
                  }}
                >
                  <i className={`text-3xl ${biometricDone ? "ri-checkbox-circle-fill text-green-400" : "ri-fingerprint-line text-gold-400"}`} />
                </div>
                <span className="text-gray-500 text-xs font-['Inter']">
                  {biometricDone ? (isAr ? "تم التحقق..." : "Verified...") : (isAr ? "المس للمصادقة البيومترية" : "Touch to authenticate")}
                </span>
              </button>

              {/* PIN pad */}
              <div className="w-full">
                <p className="text-gray-600 text-xs font-['JetBrains_Mono'] text-center mb-3">{isAr ? "أو أدخل رمز PIN" : "or enter PIN"}</p>
                {/* PIN dots */}
                <div className="flex items-center justify-center gap-3 mb-4">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-3 h-3 rounded-full transition-all"
                      style={{
                        background: i < pin.length ? (pinError ? "#F87171" : "#D4A84B") : "rgba(255,255,255,0.1)",
                        boxShadow: i < pin.length && !pinError ? "0 0 8px #D4A84B" : "none",
                      }}
                    />
                  ))}
                </div>
                {pinError && <p className="text-red-400 text-xs font-['JetBrains_Mono'] text-center mb-2">{isAr ? "رمز PIN غير صحيح" : "Incorrect PIN"}</p>}
                {/* Keypad */}
                <div className="grid grid-cols-3 gap-2">
                  {["1","2","3","4","5","6","7","8","9","",  "0","⌫"].map((d, i) => (
                    <button
                      key={i}
                      onClick={() => d === "⌫" ? setPin((p) => p.slice(0, -1)) : d ? handlePinInput(d) : undefined}
                      className="h-14 rounded-2xl flex items-center justify-center text-xl font-bold font-['JetBrains_Mono'] cursor-pointer transition-all active:scale-95"
                      style={{
                        background: d ? "rgba(20,29,46,0.8)" : "transparent",
                        color: d === "⌫" ? "#F87171" : "#D1D5DB",
                        border: d ? "1px solid rgba(255,255,255,0.08)" : "none",
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
                <p className="text-gray-700 text-[10px] font-['JetBrains_Mono'] text-center mt-2">{isAr ? "رمز التجربة: 1234" : "Demo PIN: 1234"}</p>
              </div>
            </div>
          )}

          {/* DASHBOARD */}
          {screen === "dashboard" && !selectedAlert && (
            <FieldDashboard
              isAr={isAr}
              onAlertTap={(alert) => { setSelectedAlert(alert); }}
              onSearch={() => setScreen("lookup")}
            />
          )}

          {/* ALERT DETAIL */}
          {screen === "dashboard" && selectedAlert && (
            <AlertDetail
              alert={selectedAlert}
              isAr={isAr}
              onBack={() => setSelectedAlert(null)}
            />
          )}

          {/* LOOKUP */}
          {screen === "lookup" && (
            <PersonLookup isAr={isAr} onBack={() => setScreen("dashboard")} />
          )}

          {/* MAP */}
          {screen === "map" && (
            <FieldMap isAr={isAr} />
          )}

          {/* REPORT */}
          {screen === "report" && (
            <FieldReportForm isAr={isAr} onBack={() => setScreen("dashboard")} />
          )}
        </div>

        {/* Bottom nav bar */}
        {screen !== "lock" && (
          <div
            className="absolute bottom-0 left-0 right-0 flex items-center justify-around px-2 pt-2 pb-4"
            style={{ background: "rgba(11,18,32,0.98)", borderTop: "1px solid rgba(181,142,60,0.12)", backdropFilter: "blur(12px)", height: "80px" }}
          >
            {navItems.map((item) => {
              const isActive = screen === item.key || (screen === "dashboard" && item.key === "dashboard");
              return (
                <button
                  key={item.key}
                  onClick={() => { setScreen(item.key); setSelectedAlert(null); resetLockTimer(); }}
                  className="flex flex-col items-center gap-1 px-3 py-1 rounded-2xl cursor-pointer transition-all relative"
                  style={{ color: isActive ? "#D4A84B" : "#4B5563" }}
                >
                  {/* Alert badge on home */}
                  {item.key === "dashboard" && criticalCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "#F87171" }}>
                      <span className="text-[9px] font-bold text-white font-['JetBrains_Mono']">{criticalCount}</span>
                    </div>
                  )}
                  <div
                    className="w-10 h-10 flex items-center justify-center rounded-2xl transition-all"
                    style={{
                      background: isActive ? "rgba(181,142,60,0.12)" : "transparent",
                      border: isActive ? "1px solid rgba(181,142,60,0.25)" : "1px solid transparent",
                    }}
                  >
                    <i className={`${item.icon} text-xl`} />
                  </div>
                  <span className="text-[9px] font-['Inter'] font-medium whitespace-nowrap">
                    {isAr ? item.labelAr : item.labelEn}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Back button for sub-screens */}
        {(screen === "lookup" || screen === "map" || screen === "report" || (screen === "dashboard" && selectedAlert)) && (
          <button
            onClick={() => { setScreen("dashboard"); setSelectedAlert(null); resetLockTimer(); }}
            className="absolute z-50 flex items-center gap-1.5 cursor-pointer"
            style={{ top: "72px", left: "16px", color: "#D4A84B" }}
          >
            <i className="ri-arrow-left-line text-base" />
            <span className="text-xs font-['Inter'] font-semibold">{isAr ? "رجوع" : "Back"}</span>
          </button>
        )}

        {/* Screen title */}
        {screen !== "lock" && (
          <div className="absolute z-40 flex items-center justify-center" style={{ top: "72px", left: 0, right: 0, height: "28px" }}>
            <span className="text-white text-sm font-black font-['Inter'] tracking-wide">
              {screen === "dashboard" && !selectedAlert && (isAr ? "لوحة التحكم" : "Field Dashboard")}
              {screen === "dashboard" && selectedAlert && (isAr ? "تفاصيل التنبيه" : "Alert Detail")}
              {screen === "lookup" && (isAr ? "البحث عن شخص" : "Person Lookup")}
              {screen === "map" && (isAr ? "الخريطة الميدانية" : "Field Map")}
              {screen === "report" && (isAr ? "تقرير ميداني" : "Field Report")}
            </span>
          </div>
        )}

        {/* Home indicator */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full bg-white/20" />
      </div>

      {/* Right side info panel */}
      <div className="hidden xl:flex flex-col gap-4 ml-12 max-w-xs">
        <div className="rounded-2xl p-4" style={{ background: "rgba(20,29,46,0.8)", border: "1px solid rgba(181,142,60,0.15)" }}>
          <p className="text-gold-400 text-xs font-bold font-['JetBrains_Mono'] uppercase tracking-wider mb-3">Navigation</p>
          <div className="space-y-2 text-xs font-['Inter'] text-gray-400">
            <p>🔐 <strong className="text-white">Lock Screen</strong> — PIN: 1234 or tap fingerprint</p>
            <p>🏠 <strong className="text-white">Dashboard</strong> — Active alerts + nearby locations</p>
            <p>🔍 <strong className="text-white">Lookup</strong> — Search or scan MRZ</p>
            <p>🗺️ <strong className="text-white">Map</strong> — Dark tiles + flagged pins</p>
            <p>📋 <strong className="text-white">Report</strong> — Field report submission</p>
            <p>⚡ <strong className="text-white">Tap any alert</strong> — Full detail + status update</p>
          </div>
        </div>
        <div className="rounded-2xl p-4" style={{ background: "rgba(20,29,46,0.8)", border: "1px solid rgba(248,113,113,0.2)" }}>
          <p className="text-red-400 text-xs font-bold font-['JetBrains_Mono'] uppercase tracking-wider mb-2">Auto-Escalation</p>
          <div className="space-y-1.5 text-xs font-['JetBrains_Mono'] text-gray-500">
            <p><span className="text-yellow-400">T+30min</span> En Route → no On Scene → auto-escalate</p>
            <p><span className="text-orange-400">T+60min</span> On Scene → no resolution → supervisor</p>
            <p><span className="text-red-400">T+120min</span> → Command Center escalation</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFieldPage;
