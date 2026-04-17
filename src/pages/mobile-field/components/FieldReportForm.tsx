import { useState } from "react";
import { encounterTypes, outcomeTypes } from "@/mocks/mobileFieldData";

interface Props {
  isAr: boolean;
  onBack: () => void;
}

const FieldReportForm = ({ isAr, onBack }: Props) => {
  const [personRef, setPersonRef] = useState("P-2025-00441 — Khalid Al-Rashidi");
  const [location, setLocation] = useState("Al Khuwair, Muscat (GPS: 23.5957, 58.3932)");
  const [encounterType, setEncounterType] = useState("");
  const [outcome, setOutcome] = useState("");
  const [narrative, setNarrative] = useState("");
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [photoCount, setPhotoCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [offline] = useState(false);

  const handleRecord = () => {
    if (recording) {
      setRecording(false);
    } else {
      setRecording(true);
      const interval = setInterval(() => {
        setRecordingTime((t) => {
          if (t >= 60) { clearInterval(interval); setRecording(false); return t; }
          return t + 1;
        });
      }, 1000);
    }
  };

  const handleSubmit = () => {
    if (!encounterType || !outcome || !narrative) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1800);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 px-6">
        <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "rgba(74,222,128,0.15)", border: "2px solid #4ADE80", boxShadow: "0 0 24px rgba(74,222,128,0.3)" }}>
          <i className="ri-check-line text-green-400 text-3xl" />
        </div>
        <div className="text-center">
          <h3 className="text-white text-lg font-black font-['Inter'] mb-1">{isAr ? "تم إرسال التقرير" : "Report Submitted"}</h3>
          <p className="text-gray-400 text-sm font-['Inter']">{isAr ? "تم إرسال التقرير إلى مركز القيادة" : "Report sent to Command Center"}</p>
          <p className="text-gray-600 text-xs font-['JetBrains_Mono'] mt-1">RPT-2025-{Math.floor(Math.random() * 90000 + 10000)}</p>
        </div>
        <button onClick={onBack} className="px-6 py-3 rounded-2xl text-sm font-bold font-['Inter'] cursor-pointer" style={{ background: "#D6B47E", color: "#051428" }}>
          {isAr ? "العودة للوحة التحكم" : "Back to Dashboard"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto px-3 py-3 space-y-3" style={{ scrollbarWidth: "none" }}>

      {/* Offline queue banner */}
      {offline && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: "rgba(250,204,21,0.1)", border: "1px solid rgba(250,204,21,0.3)" }}>
          <i className="ri-wifi-off-line text-yellow-400 text-sm" />
          <span className="text-yellow-400 text-xs font-['JetBrains_Mono']">{isAr ? "وضع عدم الاتصال — سيُرسَل عند الاتصال" : "Offline — Will sync on reconnect"}</span>
        </div>
      )}

      {/* Person */}
      <div>
        <label className="text-gray-500 text-[10px] uppercase tracking-wider font-['JetBrains_Mono'] block mb-1.5">{isAr ? "الشخص" : "Person"}</label>
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl" style={{ background: "rgba(10,37,64,0.9)", border: "1.5px solid rgba(184,138,60,0.25)" }}>
          <i className="ri-user-line text-gold-400 text-sm flex-shrink-0" />
          <span className="text-white text-xs font-['JetBrains_Mono'] flex-1 truncate">{personRef}</span>
          <button className="text-gold-400 text-xs font-['JetBrains_Mono'] cursor-pointer whitespace-nowrap">{isAr ? "تغيير" : "Change"}</button>
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="text-gray-500 text-[10px] uppercase tracking-wider font-['JetBrains_Mono'] block mb-1.5">{isAr ? "الموقع" : "Location"}</label>
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl" style={{ background: "rgba(10,37,64,0.9)", border: "1.5px solid rgba(184,138,60,0.25)" }}>
          <i className="ri-map-pin-line text-gold-400 text-sm flex-shrink-0" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex-1 bg-transparent text-white text-xs font-['JetBrains_Mono'] outline-none"
          />
          <button className="text-gold-400 text-xs cursor-pointer flex-shrink-0"><i className="ri-crosshair-2-line text-sm" /></button>
        </div>
      </div>

      {/* Encounter Type */}
      <div>
        <label className="text-gray-500 text-[10px] uppercase tracking-wider font-['JetBrains_Mono'] block mb-1.5">{isAr ? "نوع المواجهة" : "Encounter Type"}</label>
        <div className="grid grid-cols-2 gap-1.5">
          {encounterTypes.slice(0, 6).map((t) => (
            <button
              key={t}
              onClick={() => setEncounterType(t)}
              className="px-2 py-2 rounded-xl text-xs font-['Inter'] cursor-pointer transition-all text-left"
              style={{
                background: encounterType === t ? "rgba(184,138,60,0.12)" : "rgba(10,37,64,0.8)",
                color: encounterType === t ? "#D6B47E" : "#6B7280",
                border: encounterType === t ? "1px solid rgba(184,138,60,0.35)" : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Outcome */}
      <div>
        <label className="text-gray-500 text-[10px] uppercase tracking-wider font-['JetBrains_Mono'] block mb-1.5">{isAr ? "النتيجة" : "Outcome"}</label>
        <div className="grid grid-cols-2 gap-1.5">
          {outcomeTypes.slice(0, 6).map((o) => (
            <button
              key={o}
              onClick={() => setOutcome(o)}
              className="px-2 py-2 rounded-xl text-xs font-['Inter'] cursor-pointer transition-all text-left"
              style={{
                background: outcome === o ? "rgba(74,222,128,0.1)" : "rgba(10,37,64,0.8)",
                color: outcome === o ? "#4ADE80" : "#6B7280",
                border: outcome === o ? "1px solid rgba(74,222,128,0.3)" : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {o}
            </button>
          ))}
        </div>
      </div>

      {/* Photo capture */}
      <div>
        <label className="text-gray-500 text-[10px] uppercase tracking-wider font-['JetBrains_Mono'] block mb-1.5">{isAr ? "الصور" : "Photos"}</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPhotoCount((c) => Math.min(c + 1, 5))}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-['Inter'] cursor-pointer flex-1"
            style={{ background: "rgba(10,37,64,0.9)", border: "1.5px solid rgba(184,138,60,0.25)", color: "#D6B47E" }}
          >
            <i className="ri-camera-line text-base" />
            {isAr ? "التقاط صورة" : "Capture Photo"}
          </button>
          {photoCount > 0 && (
            <div className="flex items-center gap-1 px-3 py-2.5 rounded-2xl" style={{ background: "rgba(184,138,60,0.08)", border: "1px solid rgba(184,138,60,0.2)" }}>
              <i className="ri-image-line text-gold-400 text-sm" />
              <span className="text-gold-400 text-sm font-bold font-['JetBrains_Mono']">{photoCount}</span>
            </div>
          )}
        </div>
      </div>

      {/* Voice note */}
      <div>
        <label className="text-gray-500 text-[10px] uppercase tracking-wider font-['JetBrains_Mono'] block mb-1.5">{isAr ? "ملاحظة صوتية" : "Voice Note"}</label>
        <button
          onClick={handleRecord}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl text-sm font-bold font-['Inter'] cursor-pointer transition-all"
          style={{
            background: recording ? "rgba(184,138,60,0.15)" : "rgba(10,37,64,0.9)",
            border: recording ? "1.5px solid #D6B47E" : "1.5px solid rgba(184,138,60,0.25)",
            color: recording ? "#D6B47E" : "#6B7280",
          }}
        >
          {recording ? (
            <>
              <div className="w-3 h-3 rounded-full bg-gold-400 animate-pulse" style={{ boxShadow: "0 0 8px #D6B47E" }} />
              <span className="font-['JetBrains_Mono']">{String(Math.floor(recordingTime / 60)).padStart(2, "0")}:{String(recordingTime % 60).padStart(2, "0")}</span>
              <span>{isAr ? "جارٍ التسجيل — اضغط للإيقاف" : "Recording — Tap to stop"}</span>
            </>
          ) : (
            <>
              <i className="ri-mic-line text-lg" />
              {isAr ? "تسجيل ملاحظة صوتية" : "Record Voice Note"}
            </>
          )}
        </button>
      </div>

      {/* Narrative */}
      <div>
        <label className="text-gray-500 text-[10px] uppercase tracking-wider font-['JetBrains_Mono'] block mb-1.5">{isAr ? "السرد" : "Narrative"}</label>
        <textarea
          value={narrative}
          onChange={(e) => setNarrative(e.target.value.slice(0, 500))}
          placeholder={isAr ? "وصف المواجهة..." : "Describe the encounter..."}
          rows={4}
          className="w-full px-3 py-2.5 rounded-2xl text-sm font-['Inter'] resize-none"
          style={{ background: "rgba(10,37,64,0.9)", border: "1.5px solid rgba(184,138,60,0.2)", color: "#D1D5DB", outline: "none" }}
        />
        <p className="text-gray-700 text-[10px] font-['JetBrains_Mono'] text-right mt-1">{narrative.length}/500</p>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!encounterType || !outcome || !narrative || submitting}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-black font-['Inter'] cursor-pointer transition-all mb-2"
        style={{
          background: (!encounterType || !outcome || !narrative) ? "rgba(184,138,60,0.1)" : "#D6B47E",
          color: (!encounterType || !outcome || !narrative) ? "rgba(184,138,60,0.4)" : "#051428",
          cursor: (!encounterType || !outcome || !narrative) ? "not-allowed" : "pointer",
        }}
      >
        {submitting ? (
          <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
        ) : (
          <i className="ri-send-plane-fill text-base" />
        )}
        {submitting ? (isAr ? "جارٍ الإرسال..." : "Submitting...") : (isAr ? "إرسال إلى مركز القيادة" : "Submit to Command Center")}
      </button>
    </div>
  );
};

export default FieldReportForm;
