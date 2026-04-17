import { useState } from "react";

// ─── ICCID Validator (19-20 digits) ──────────────────────────────────────────
export const validateICCID = (v: string) => /^\d{19,20}$/.test(v.replace(/\s/g, ""));

// ─── IMEI Luhn Validator ──────────────────────────────────────────────────────
export const validateIMEI = (imei: string): boolean => {
  const digits = imei.replace(/\D/g, "");
  if (digits.length !== 15) return false;
  let sum = 0;
  for (let i = 0; i < 15; i++) {
    let d = parseInt(digits[i], 10);
    if (i % 2 === 1) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
  }
  return sum % 10 === 0;
};

// ─── ValidatedInput ───────────────────────────────────────────────────────────
interface ValidatedInputProps {
  value: string;
  onChange: (v: string) => void;
  validate: (v: string) => boolean;
  placeholder: string;
  label: string;
  hint?: string;
  required?: boolean;
  monospace?: boolean;
}

export const ValidatedInput = ({ value, onChange, validate, placeholder, label, hint, required, monospace }: ValidatedInputProps) => {
  const [touched, setTouched] = useState(false);
  const isValid = value.length > 0 && validate(value);
  const isError = touched && value.length > 0 && !validate(value);

  return (
    <div>
      <label className="block text-gray-400 text-xs mb-1.5 font-['Inter']">
        {label}{required && <span className="text-gold-400 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder={placeholder}
          className={`w-full px-3 py-2.5 pr-9 rounded-lg text-sm text-white placeholder-gray-600 outline-none transition-all duration-200 ${monospace ? "font-['JetBrains_Mono']" : "font-['Inter']"}`}
          style={{
            background: "#0F1923",
            border: `1px solid ${isError ? "rgba(248,113,113,0.5)" : isValid ? "rgba(74,222,128,0.4)" : "rgba(255,255,255,0.08)"}`,
            boxShadow: isError ? "0 0 0 2px rgba(248,113,113,0.06)" : isValid ? "0 0 0 2px rgba(74,222,128,0.06)" : "none",
          }}
          onFocus={(e) => {
            if (!isError && !isValid) {
              e.target.style.borderColor = "#D4A84B";
              e.target.style.boxShadow = "0 0 0 2px rgba(181,142,60,0.08)";
            }
          }}
          onBlurCapture={(e) => {
            if (!isError && !isValid) {
              e.target.style.borderColor = "rgba(255,255,255,0.08)";
              e.target.style.boxShadow = "none";
            }
          }}
        />
        {value.length > 0 && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isValid
              ? <i className="ri-checkbox-circle-line text-green-400 text-sm" />
              : isError
              ? <i className="ri-error-warning-line text-red-400 text-sm" />
              : null}
          </div>
        )}
      </div>
      {isError && (
        <p className="text-red-400 text-xs mt-1 font-['Inter']">
          {hint || "Invalid format"}
        </p>
      )}
      {isValid && (
        <p className="text-green-400 text-xs mt-1 font-['Inter']">
          <i className="ri-check-line mr-1" />Valid
        </p>
      )}
    </div>
  );
};

// ─── ServiceToggle ────────────────────────────────────────────────────────────
interface ServiceToggleProps {
  label: string;
  labelAr: string;
  icon: string;
  value: boolean;
  onChange: (v: boolean) => void;
  isAr: boolean;
}

export const ServiceToggle = ({ label, labelAr, icon, value, onChange, isAr }: ServiceToggleProps) => (
  <button
    type="button"
    onClick={() => onChange(!value)}
    className="flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer w-full text-left"
    style={{
      background: value ? "rgba(181,142,60,0.08)" : "rgba(255,255,255,0.02)",
      borderColor: value ? "rgba(181,142,60,0.35)" : "rgba(255,255,255,0.08)",
    }}
  >
    <div
      className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 transition-all"
      style={{
        background: value ? "rgba(181,142,60,0.15)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${value ? "rgba(181,142,60,0.3)" : "rgba(255,255,255,0.08)"}`,
      }}
    >
      <i className={`${icon} text-sm`} style={{ color: value ? "#D4A84B" : "#6B7280" }} />
    </div>
    <span className="text-sm font-semibold font-['Inter'] flex-1" style={{ color: value ? "#D4A84B" : "#9CA3AF" }}>
      {isAr ? labelAr : label}
    </span>
    <div
      className="w-10 h-5 rounded-full transition-all relative flex-shrink-0"
      style={{ background: value ? "#D4A84B" : "rgba(255,255,255,0.1)" }}
    >
      <div
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
        style={{ left: value ? "calc(100% - 18px)" : "2px" }}
      />
    </div>
  </button>
);

// ─── CountryChipSelector ──────────────────────────────────────────────────────
const ROAMING_COUNTRIES = [
  "Saudi Arabia", "UAE", "Kuwait", "Bahrain", "Qatar", "Jordan", "Egypt",
  "India", "Pakistan", "UK", "USA", "Germany", "France", "Turkey",
  "Malaysia", "Singapore", "Thailand", "China", "Japan", "Australia",
  "Canada", "Italy", "Spain", "Netherlands", "Switzerland",
];

interface CountryChipProps {
  selected: string[];
  onChange: (v: string[]) => void;
  isAr: boolean;
}

export const CountryChipSelector = ({ selected, onChange, isAr }: CountryChipProps) => {
  const [search, setSearch] = useState("");

  const filtered = ROAMING_COUNTRIES.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (country: string) => {
    if (selected.includes(country)) {
      onChange(selected.filter((c) => c !== country));
    } else {
      onChange([...selected, country]);
    }
  };

  return (
    <div>
      <label className="block text-gray-400 text-xs mb-1.5 font-['Inter']">
        {isAr ? "الدول المقصودة" : "Destination Countries"}
        <span className="text-gold-400 ml-0.5">*</span>
      </label>

      {/* Search */}
      <div className="relative mb-2">
        <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={isAr ? "ابحث عن دولة..." : "Search country..."}
          className="w-full pl-8 pr-3 py-2 rounded-lg text-xs text-white placeholder-gray-600 outline-none font-['Inter']"
          style={{ background: "#0F1923", border: "1px solid rgba(255,255,255,0.08)" }}
          onFocus={(e) => { e.target.style.borderColor = "#D4A84B"; }}
          onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
        />
      </div>

      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2 p-2 rounded-lg" style={{ background: "rgba(181,142,60,0.04)", border: "1px solid rgba(181,142,60,0.12)" }}>
          {selected.map((c) => (
            <span
              key={c}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold font-['Inter']"
              style={{ background: "rgba(181,142,60,0.15)", border: "1px solid rgba(181,142,60,0.3)", color: "#D4A84B" }}
            >
              {c}
              <button
                type="button"
                onClick={() => toggle(c)}
                className="cursor-pointer hover:text-red-400 transition-colors"
              >
                <i className="ri-close-line text-xs" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Country grid */}
      <div
        className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 rounded-lg"
        style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        {filtered.map((country) => {
          const isSelected = selected.includes(country);
          return (
            <button
              key={country}
              type="button"
              onClick={() => toggle(country)}
              className="px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all whitespace-nowrap font-['Inter']"
              style={{
                background: isSelected ? "rgba(181,142,60,0.15)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${isSelected ? "rgba(181,142,60,0.35)" : "rgba(255,255,255,0.08)"}`,
                color: isSelected ? "#D4A84B" : "#6B7280",
              }}
            >
              {isSelected && <i className="ri-check-line mr-1 text-xs" />}
              {country}
            </button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <p className="text-gold-400 text-xs mt-1.5 font-['Inter']">
          {selected.length} {isAr ? "دولة محددة" : "countries selected"}
        </p>
      )}
    </div>
  );
};

// ─── MobileConfirmationPanel ──────────────────────────────────────────────────
interface ConfirmProps {
  refNumber: string;
  eventType: string;
  isAr: boolean;
  onReset: () => void;
  onDashboard: () => void;
}

export const MobileConfirmationPanel = ({ refNumber, eventType, isAr, onReset, onDashboard }: ConfirmProps) => (
  <div
    className="rounded-2xl border p-10 flex flex-col items-center text-center"
    style={{ background: "rgba(20,29,46,0.9)", borderColor: "rgba(181,142,60,0.25)", backdropFilter: "blur(16px)" }}
  >
    <div
      className="w-20 h-20 flex items-center justify-center rounded-full mb-6"
      style={{ background: "rgba(181,142,60,0.1)", border: "2px solid rgba(181,142,60,0.4)", boxShadow: "0 0 40px rgba(181,142,60,0.15)" }}
    >
      <i className="ri-checkbox-circle-line text-4xl text-gold-400" />
    </div>
    <h2 className="text-white text-2xl font-bold mb-2 font-['Inter']">
      {isAr ? "تم الإرسال بنجاح" : "Event Submitted Successfully"}
    </h2>
    <p className="text-gray-400 text-sm mb-6 font-['Inter']">
      {isAr ? `تم إرسال حدث ${eventType} إلى منصة Al-Ameen` : `${eventType} event submitted to Al-Ameen platform`}
    </p>
    <div
      className="px-6 py-4 rounded-xl border mb-8 w-full max-w-sm"
      style={{ background: "rgba(181,142,60,0.05)", borderColor: "rgba(181,142,60,0.2)" }}
    >
      <p className="text-gray-500 text-xs mb-1 font-['Inter']">{isAr ? "رقم المرجع" : "Reference Number"}</p>
      <p className="text-gold-400 text-xl font-bold font-['JetBrains_Mono'] tracking-wider">{refNumber}</p>
    </div>
    <div className="flex gap-3">
      <button
        type="button"
        onClick={onReset}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap font-['Inter'] transition-colors"
        style={{ background: "transparent", borderColor: "rgba(181,142,60,0.3)", color: "#D4A84B" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(181,142,60,0.08)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
      >
        <i className="ri-add-line" />
        {isAr ? "حدث جديد" : "New Event"}
      </button>
      <button
        type="button"
        onClick={onDashboard}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold cursor-pointer whitespace-nowrap font-['Inter'] transition-colors"
        style={{ background: "#D4A84B", color: "#0B1220" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#C99C48"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#D4A84B"; }}
      >
        <i className="ri-dashboard-line" />
        {isAr ? "لوحة التحكم" : "Dashboard"}
      </button>
    </div>
  </div>
);

// ─── Shared lookup bar ────────────────────────────────────────────────────────
interface LookupBarProps {
  label: string;
  labelAr: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  onLookup: () => void;
  isAr: boolean;
  extra?: React.ReactNode;
}

export const LookupBar = ({ label, labelAr, placeholder, value, onChange, onLookup, isAr, extra }: LookupBarProps) => (
  <div
    className="rounded-xl border p-5 mb-5"
    style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.15)", backdropFilter: "blur(12px)" }}
  >
    <div className="flex items-center gap-2 mb-4 pb-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
      <div className="w-7 h-7 flex items-center justify-center rounded-lg" style={{ background: "rgba(181,142,60,0.1)", border: "1px solid rgba(181,142,60,0.2)" }}>
        <i className="ri-search-line text-gold-400 text-sm" />
      </div>
      <h3 className="text-white font-bold text-sm font-['Inter']">{isAr ? "بحث" : "Lookup"}</h3>
    </div>
    <div className="flex gap-3 items-end flex-wrap">
      <div className="flex-1 min-w-48">
        <label className="block text-gray-400 text-xs mb-1.5 font-['Inter']">
          {isAr ? labelAr : label}<span className="text-gold-400 ml-0.5">*</span>
        </label>
        <div className="flex gap-2">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-3 py-2.5 rounded-lg text-sm text-white placeholder-gray-600 outline-none transition-all duration-200 font-['JetBrains_Mono']"
            style={{ background: "#0F1923", border: "1px solid rgba(255,255,255,0.08)" }}
            onFocus={(e) => { e.target.style.borderColor = "#D4A84B"; e.target.style.boxShadow = "0 0 0 2px rgba(181,142,60,0.08)"; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
          />
          <button
            type="button"
            onClick={onLookup}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors"
            style={{ background: "rgba(181,142,60,0.12)", border: "1px solid rgba(181,142,60,0.3)", color: "#D4A84B" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(181,142,60,0.2)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(181,142,60,0.12)"; }}
          >
            <i className="ri-search-line text-xs" />
            {isAr ? "بحث" : "Lookup"}
          </button>
        </div>
      </div>
      {extra}
    </div>
  </div>
);

// ─── Shared submit handler helper ─────────────────────────────────────────────
export const generateMobRef = () => {
  const seq = Math.floor(Math.random() * 9000) + 1000;
  return `AMN-MOB-${Date.now()}-${seq}`;
};
