import { useState } from "react";
import type { Person360 } from "@/mocks/person360Data";

interface Props {
  person: Person360;
  isAr: boolean;
}

const riskColors: Record<string, string> = {
  low: "#4ADE80",
  medium: "#FACC15",
  high: "#FB923C",
  critical: "#F87171",
};

const statusConfig: Record<string, { label: string; labelAr: string; color: string; icon: string }> = {
  "in-country": { label: "In-Country",  labelAr: "داخل البلاد", color: "#4ADE80", icon: "ri-map-pin-2-fill" },
  "departed":   { label: "Departed",    labelAr: "غادر البلاد", color: "#9CA3AF", icon: "ri-flight-takeoff-line" },
  "unknown":    { label: "Unknown",     labelAr: "غير معروف",   color: "#FACC15", icon: "ri-question-line" },
};

const RiskGauge = ({ score, level }: { score: number; level: string }) => {
  const color = riskColors[level] || "#9CA3AF";
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
          <circle
            cx="60" cy="60" r={radius} fill="none"
            stroke={color} strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 10px ${color})`, transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div className="flex flex-col items-center z-10">
          <span className="text-3xl font-black font-['JetBrains_Mono']" style={{ color }}>{score}</span>
          <span className="text-gray-500 text-xs font-['JetBrains_Mono'] uppercase tracking-wider">/ 100</span>
        </div>
      </div>
      <span
        className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest font-['JetBrains_Mono']"
        style={{ background: `${color}22`, color, border: `1px solid ${color}55` }}
      >
        {level.toUpperCase()} RISK
      </span>
    </div>
  );
};

const IdentityCard = ({ person, isAr }: Props) => {
  const [mapExpanded, setMapExpanded] = useState(false);
  const status = statusConfig[person.status];
  const riskColor = riskColors[person.riskLevel];

  const daysInCountry = Math.floor(
    (new Date().getTime() - new Date(person.entryDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  const visaExpiryDate = new Date(person.visaExpiry);
  const today = new Date();
  const daysToExpiry = Math.floor((visaExpiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const visaExpirySoon = daysToExpiry <= 7;

  return (
    <div
      className="rounded-xl p-5 flex flex-col lg:flex-row gap-5"
      style={{
        background: "rgba(20,29,46,0.8)",
        border: `1px solid ${riskColor}30`,
        backdropFilter: "blur(12px)",
        boxShadow: `0 0 40px ${riskColor}08`,
      }}
    >
      {/* Photo + Status */}
      <div className="flex flex-col items-center gap-3 flex-shrink-0">
        <div className="relative">
          <div
            className="w-28 h-28 rounded-xl overflow-hidden flex-shrink-0"
            style={{ border: `2px solid ${riskColor}60` }}
          >
            <img src={person.photo} alt={person.nameEn} className="w-full h-full object-cover object-top" />
          </div>
          {/* Status dot */}
          <div
            className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center border-2"
            style={{ background: status.color, borderColor: "#0B1220", boxShadow: `0 0 10px ${status.color}` }}
          >
            <i className={`${status.icon} text-xs text-black`} />
          </div>
        </div>
        <div className="text-center">
          <span className="text-xs font-bold font-['JetBrains_Mono'] uppercase tracking-wider" style={{ color: status.color }}>
            {isAr ? status.labelAr : status.label}
          </span>
        </div>
        <div
          className="px-3 py-1 rounded-full text-xs font-['JetBrains_Mono'] font-bold"
          style={{ background: "rgba(181,142,60,0.1)", color: "#D4A84B", border: "1px solid rgba(181,142,60,0.3)" }}
        >
          {person.id}
        </div>
        {/* Classification */}
        <div
          className="px-2 py-0.5 rounded text-[9px] font-['JetBrains_Mono'] font-bold tracking-widest"
          style={{ background: "rgba(248,113,113,0.1)", color: "#F87171", border: "1px solid rgba(248,113,113,0.2)" }}
        >
          RESTRICTED
        </div>
      </div>

      {/* Identity Details */}
      <div className="flex-1 min-w-0">
        <div className="mb-3">
          <h2 className="text-2xl font-black text-white font-['Inter'] leading-tight">{person.nameEn}</h2>
          <p className="text-gray-400 text-lg font-['Noto_Naskh_Arabic'] mt-0.5">{person.nameAr}</p>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 mb-4">
          {[
            { label: "Document",     labelAr: "المستند",        value: `${person.docType}: ${person.docNumber}`, mono: true },
            { label: "Nationality",  labelAr: "الجنسية",        value: `${person.nationalityFlag} ${person.nationality}`, mono: false },
            { label: "Date of Birth",labelAr: "تاريخ الميلاد", value: person.dob, mono: true },
            { label: "Age / Gender", labelAr: "العمر / الجنس", value: `${person.age} yrs · ${person.gender}`, mono: false },
            { label: "Entry Port",   labelAr: "منفذ الدخول",   value: person.entryPort, mono: false },
            { label: "Entry Date",   labelAr: "تاريخ الدخول",  value: person.entryDate, mono: true },
          ].map((field) => (
            <div key={field.label}>
              <p className="text-gray-600 text-[10px] uppercase tracking-wider font-['JetBrains_Mono'] mb-0.5">
                {isAr ? field.labelAr : field.label}
              </p>
              <p className={`text-white text-sm ${field.mono ? "font-['JetBrains_Mono']" : "font-['Inter']"}`}>
                {field.value}
              </p>
            </div>
          ))}
        </div>

        {/* Visa status */}
        <div
          className="flex items-center gap-3 p-3 rounded-lg mb-3"
          style={{
            background: visaExpirySoon ? "rgba(248,113,113,0.08)" : "rgba(181,142,60,0.05)",
            border: `1px solid ${visaExpirySoon ? "rgba(248,113,113,0.3)" : "rgba(181,142,60,0.15)"}`,
          }}
        >
          <i className={`ri-visa-line text-sm ${visaExpirySoon ? "text-red-400" : "text-gold-400"}`} />
          <div className="flex-1">
            <span className="text-white text-xs font-['Inter'] font-medium">{person.visaType} Visa</span>
            <span className="text-gray-500 text-xs font-['JetBrains_Mono'] ml-2">Expires: {person.visaExpiry}</span>
          </div>
          {visaExpirySoon ? (
            <span
              className="text-xs font-bold font-['JetBrains_Mono'] px-2 py-0.5 rounded-full animate-pulse"
              style={{ background: "rgba(248,113,113,0.2)", color: "#F87171" }}
            >
              {daysToExpiry}d LEFT
            </span>
          ) : (
            <span
              className="text-xs font-['JetBrains_Mono'] px-2 py-0.5 rounded-full"
              style={{ background: "rgba(74,222,128,0.1)", color: "#4ADE80" }}
            >
              {daysToExpiry}d remaining
            </span>
          )}
        </div>

        {/* Last Location */}
        <div className="pt-3 border-t" style={{ borderColor: "rgba(181,142,60,0.1)" }}>
          <div className="flex items-center gap-2 mb-2">
            <i className="ri-map-pin-line text-gold-400 text-sm" />
            <span className="text-gray-400 text-xs uppercase tracking-wider font-['JetBrains_Mono']">
              {isAr ? "آخر موقع معروف" : "Last Known Location"}
            </span>
            <span className="text-gray-600 text-xs font-['JetBrains_Mono'] ml-auto">{person.lastSeen}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white text-sm font-['Inter']">{person.lastLocation}</span>
            <button
              onClick={() => setMapExpanded(!mapExpanded)}
              className="text-xs px-2.5 py-1 rounded cursor-pointer transition-colors font-['JetBrains_Mono'] flex items-center gap-1"
              style={{ color: "#D4A84B", border: "1px solid rgba(181,142,60,0.3)", background: "rgba(181,142,60,0.05)" }}
            >
              <i className={`${mapExpanded ? "ri-map-pin-2-line" : "ri-map-2-line"} text-xs`} />
              {mapExpanded ? (isAr ? "إخفاء" : "Hide Map") : (isAr ? "عرض الخريطة" : "View Map")}
            </button>
          </div>
          {mapExpanded && (
            <div className="mt-3 rounded-lg overflow-hidden" style={{ height: "180px", border: "1px solid rgba(181,142,60,0.2)" }}>
              <iframe
                title="Last Known Location"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU3Luo&q=${person.lastLocationCoords.lat},${person.lastLocationCoords.lng}&zoom=14`}
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>

      {/* Risk Gauge + Stats */}
      <div
        className="flex flex-col items-center justify-start flex-shrink-0 lg:pl-5 lg:border-l gap-4"
        style={{ borderColor: "rgba(181,142,60,0.1)" }}
      >
        <p className="text-gray-500 text-xs uppercase tracking-widest font-['JetBrains_Mono']">
          {isAr ? "درجة المخاطرة" : "Risk Score"}
        </p>
        <RiskGauge score={person.riskScore} level={person.riskLevel} />

        <div className="w-full space-y-2 mt-1">
          {[
            { label: "Pattern Alerts",   labelAr: "تنبيهات الأنماط",  value: "8",           color: "#F87171" },
            { label: "Active Streams",   labelAr: "التدفقات النشطة",  value: "12/15",       color: "#D4A84B" },
            { label: "Days In-Country",  labelAr: "أيام داخل البلاد", value: `${daysInCountry}`, color: "#FACC15" },
            { label: "Connections",      labelAr: "الاتصالات",        value: "7",           color: "#A78BFA" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center justify-between gap-4">
              <span className="text-gray-500 text-xs font-['JetBrains_Mono']">{isAr ? stat.labelAr : stat.label}</span>
              <span className="text-sm font-bold font-['JetBrains_Mono']" style={{ color: stat.color }}>{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="w-full space-y-1.5 mt-1">
          <button
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-['JetBrains_Mono'] cursor-pointer transition-all whitespace-nowrap"
            style={{ background: "rgba(248,113,113,0.1)", color: "#F87171", border: "1px solid rgba(248,113,113,0.25)" }}
          >
            <i className="ri-flag-line text-xs" />
            {isAr ? "تصعيد" : "Escalate"}
          </button>
          <button
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-['JetBrains_Mono'] cursor-pointer transition-all whitespace-nowrap"
            style={{ background: "rgba(181,142,60,0.08)", color: "#D4A84B", border: "1px solid rgba(181,142,60,0.2)" }}
          >
            <i className="ri-team-line text-xs" />
            {isAr ? "نشر فريق ميداني" : "Deploy Field Team"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdentityCard;
