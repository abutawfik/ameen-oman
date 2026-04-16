import { type InputHTMLAttributes, type SelectHTMLAttributes } from "react";

// ─── Style constants ──────────────────────────────────────────────────────────
export const inputBase =
  "w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-gray-600 outline-none transition-all duration-200 font-['Inter']";

export const inputStyle = {
  background: "#0F1923",
  border: "1px solid rgba(255,255,255,0.08)",
};

export const focusHandlers = {
  onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = "#22D3EE";
    e.target.style.boxShadow = "0 0 0 2px rgba(34,211,238,0.08)";
  },
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = "rgba(255,255,255,0.08)";
    e.target.style.boxShadow = "none";
  },
};

// ─── Label ────────────────────────────────────────────────────────────────────
export const Label = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
  <label className="block text-gray-400 text-xs mb-1.5 font-['Inter'] tracking-wide">
    {children}
    {required && <span className="text-cyan-400 ml-0.5">*</span>}
  </label>
);

// ─── FormField ────────────────────────────────────────────────────────────────
export const FormField = ({
  label, required, children, className = "",
}: {
  label: string; required?: boolean; children: React.ReactNode; className?: string;
}) => (
  <div className={className}>
    <Label required={required}>{label}</Label>
    {children}
  </div>
);

// ─── TextInput ────────────────────────────────────────────────────────────────
interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  autoFilled?: boolean;
}
export const TextInput = ({ autoFilled, style: extraStyle, className = "", ...props }: TextInputProps) => (
  <input
    {...props}
    className={`${inputBase} ${className}`}
    style={{
      ...inputStyle,
      ...(autoFilled ? { background: "rgba(74,222,128,0.08)", borderColor: "rgba(74,222,128,0.3)" } : {}),
      ...extraStyle,
    }}
    onFocus={focusHandlers.onFocus as React.FocusEventHandler<HTMLInputElement>}
    onBlur={focusHandlers.onBlur as React.FocusEventHandler<HTMLInputElement>}
  />
);

// ─── SelectInput ──────────────────────────────────────────────────────────────
interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  placeholder?: string;
}
export const SelectInput = ({ options, placeholder, className = "", ...props }: SelectInputProps) => (
  <select
    {...props}
    className={`${inputBase} cursor-pointer ${className}`}
    style={{ ...inputStyle, background: "#0F1923" }}
    onFocus={focusHandlers.onFocus as React.FocusEventHandler<HTMLSelectElement>}
    onBlur={focusHandlers.onBlur as React.FocusEventHandler<HTMLSelectElement>}
  >
    {placeholder && <option value="">{placeholder}</option>}
    {options.map((o) => (
      <option key={o.value} value={o.value}>{o.label}</option>
    ))}
  </select>
);

// ─── SectionCard ──────────────────────────────────────────────────────────────
export const SectionCard = ({
  title, icon, children, className = "", accentColor = "#22D3EE",
}: {
  title: string; icon?: string; children: React.ReactNode; className?: string; accentColor?: string;
}) => (
  <div
    className={`rounded-2xl border p-5 ${className}`}
    style={{
      background: "rgba(10,22,40,0.85)",
      borderColor: "rgba(34,211,238,0.12)",
      backdropFilter: "blur(16px)",
      boxShadow: "inset 0 1px 0 rgba(34,211,238,0.04)",
    }}
  >
    {title && (
      <div className="flex items-center gap-2.5 mb-5 pb-3 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        {icon && (
          <div
            className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0"
            style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}30` }}
          >
            <i className={`${icon} text-sm`} style={{ color: accentColor }} />
          </div>
        )}
        <h3 className="text-white font-bold text-sm font-['Inter'] tracking-wide">{title}</h3>
      </div>
    )}
    {children}
  </div>
);

// ─── TipBanner ────────────────────────────────────────────────────────────────
export const TipBanner = ({ text, color = "amber" }: { text: string; color?: "amber" | "cyan" | "green" }) => {
  const colors = {
    amber: { bg: "rgba(251,146,60,0.06)", border: "rgba(251,146,60,0.22)", text: "#FB923C", icon: "ri-information-line" },
    cyan:  { bg: "rgba(34,211,238,0.06)",  border: "rgba(34,211,238,0.22)",  text: "#22D3EE", icon: "ri-lightbulb-flash-line" },
    green: { bg: "rgba(74,222,128,0.06)",  border: "rgba(74,222,128,0.22)",  text: "#4ADE80", icon: "ri-checkbox-circle-line" },
  };
  const c = colors[color];
  return (
    <div
      className="flex items-start gap-3 px-4 py-3 rounded-xl border"
      style={{ background: c.bg, borderColor: c.border }}
    >
      <i className={`${c.icon} text-sm mt-0.5 flex-shrink-0`} style={{ color: c.text }} />
      <p className="text-sm font-['Inter'] leading-relaxed" style={{ color: c.text }}>{text}</p>
    </div>
  );
};

// ─── RadioGroup ───────────────────────────────────────────────────────────────
export const RadioGroup = ({
  options, value, onChange, name,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  name: string;
}) => (
  <div className="flex gap-2 flex-wrap" role="radiogroup" aria-label={name}>
    {options.map((opt) => (
      <button
        key={opt.value}
        type="button"
        onClick={() => onChange(opt.value)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer font-['Inter'] whitespace-nowrap"
        style={{
          background: value === opt.value ? "rgba(34,211,238,0.12)" : "#0F1923",
          borderColor: value === opt.value ? "#22D3EE" : "rgba(255,255,255,0.08)",
          color: value === opt.value ? "#22D3EE" : "#6B7280",
        }}
      >
        <div
          className="w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
          style={{ borderColor: value === opt.value ? "#22D3EE" : "#374151" }}
        >
          {value === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
        </div>
        {opt.label}
      </button>
    ))}
  </div>
);

// ─── ExpiryDateInput ──────────────────────────────────────────────────────────
export const ExpiryDateInput = ({
  value, onChange, label, required,
}: {
  value: string; onChange: (v: string) => void; label: string; required?: boolean;
}) => {
  const isNearExpiry = () => {
    if (!value) return false;
    const diff = (new Date(value).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 30;
  };
  const near = isNearExpiry();
  return (
    <FormField label={label} required={required}>
      <div className="relative">
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputBase}
          style={{
            ...inputStyle,
            ...(near ? { borderColor: "rgba(251,146,60,0.6)", background: "rgba(251,146,60,0.05)" } : {}),
          }}
          onFocus={focusHandlers.onFocus as React.FocusEventHandler<HTMLInputElement>}
          onBlur={focusHandlers.onBlur as React.FocusEventHandler<HTMLInputElement>}
        />
        {near && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <i className="ri-alarm-warning-line text-orange-400 text-xs" />
          </div>
        )}
      </div>
      {near && (
        <p className="text-orange-400 text-xs mt-1 font-['Inter'] flex items-center gap-1">
          <i className="ri-error-warning-line" />
          {label.includes("انتهاء") ? "الوثيقة تنتهي خلال 30 يوماً" : "Document expires within 30 days"}
        </p>
      )}
    </FormField>
  );
};

// ─── ScannerWidget ────────────────────────────────────────────────────────────
export const ScannerWidget = ({
  connected, onScan, isAr,
}: {
  connected: boolean; onScan: () => void; isAr: boolean;
}) => (
  <div
    className="flex items-center justify-between p-3 rounded-xl border mb-4"
    style={{
      background: connected ? "rgba(74,222,128,0.04)" : "rgba(255,255,255,0.02)",
      borderColor: connected ? "rgba(74,222,128,0.2)" : "rgba(255,255,255,0.06)",
    }}
  >
    <div className="flex items-center gap-3">
      <div
        className="w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0"
        style={{
          background: connected ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.04)",
          border: `1px solid ${connected ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.08)"}`,
        }}
      >
        <i className={`ri-scan-line text-base ${connected ? "text-green-400" : "text-gray-600"}`} />
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
          <span
            className="text-xs font-semibold font-['JetBrains_Mono']"
            style={{ color: connected ? "#4ADE80" : "#F87171" }}
          >
            {connected
              ? (isAr ? "Regula متصل" : "Regula Connected")
              : (isAr ? "Regula غير متصل" : "Regula Offline")}
          </span>
        </div>
        <p className="text-gray-500 text-xs font-['Inter'] mt-0.5">
          {connected
            ? (isAr ? "ضع وثيقة السفر على الماسح الضوئي" : "Place Travel Document on scanner")
            : (isAr ? "الماسح غير متاح — أدخل البيانات يدوياً" : "Scanner unavailable — enter data manually")}
        </p>
      </div>
    </div>
    {connected && (
      <button
        type="button"
        onClick={onScan}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap font-['Inter']"
        style={{ background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.3)", color: "#4ADE80" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(74,222,128,0.2)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(74,222,128,0.12)"; }}
      >
        <i className="ri-scan-2-line text-xs" />
        {isAr ? "مسح" : "Scan"}
      </button>
    )}
  </div>
);

// ─── FormActions ──────────────────────────────────────────────────────────────
export const FormActions = ({
  onCancel, onSave, saveLabel = "Save Event", saving = false, isAr, disabled = false,
}: {
  onCancel: () => void;
  onSave: () => void;
  saveLabel?: string;
  saving?: boolean;
  isAr: boolean;
  disabled?: boolean;
}) => (
  <div
    className="flex items-center justify-end gap-3 pt-4 border-t mt-2"
    style={{ borderColor: "rgba(255,255,255,0.06)" }}
  >
    <button
      type="button"
      onClick={onCancel}
      className="flex items-center gap-2 px-5 py-2.5 rounded-lg border text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap font-['Inter']"
      style={{ background: "transparent", borderColor: "rgba(255,255,255,0.15)", color: "#9CA3AF" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.3)";
        (e.currentTarget as HTMLButtonElement).style.color = "#D1D5DB";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.15)";
        (e.currentTarget as HTMLButtonElement).style.color = "#9CA3AF";
      }}
    >
      <i className="ri-close-line" />
      {isAr ? "إلغاء" : "Cancel"}
    </button>
    <button
      type="button"
      onClick={onSave}
      disabled={saving || disabled}
      className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-colors cursor-pointer whitespace-nowrap font-['Inter'] disabled:opacity-60"
      style={{ background: "#22D3EE", color: "#060D1A" }}
      onMouseEnter={(e) => { if (!saving) (e.currentTarget as HTMLButtonElement).style.background = "#06B6D4"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#22D3EE"; }}
    >
      {saving ? <i className="ri-loader-4-line animate-spin" /> : <i className="ri-save-line" />}
      {isAr ? "حفظ الحدث" : saveLabel}
    </button>
  </div>
);

// ─── SuccessScreen ────────────────────────────────────────────────────────────
export const SuccessScreen = ({
  icon, color, titleEn, titleAr, isAr, eventCode,
}: {
  icon: string; color: string; titleEn: string; titleAr: string; isAr: boolean; eventCode: string;
}) => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div
      className="w-20 h-20 flex items-center justify-center rounded-full mb-5"
      style={{ background: `${color}15`, border: `2px solid ${color}50` }}
    >
      <i className={`${icon} text-4xl`} style={{ color }} />
    </div>
    <p className="text-white font-bold text-xl font-['Inter'] mb-2">{isAr ? titleAr : titleEn}</p>
    <div
      className="flex items-center gap-2 px-4 py-2 rounded-lg mt-1"
      style={{ background: "rgba(34,211,238,0.06)", border: "1px solid rgba(34,211,238,0.15)" }}
    >
      <i className="ri-checkbox-circle-line text-cyan-400 text-sm" />
      <span className="text-cyan-400 text-sm font-['JetBrains_Mono'] tracking-widest">
        HTL-{Date.now().toString().slice(-8)}
      </span>
    </div>
    <p className="text-gray-600 text-xs font-['JetBrains_Mono'] mt-3">{eventCode} — SUBMITTED</p>
  </div>
);

// ─── LookupButton ─────────────────────────────────────────────────────────────
export const LookupButton = ({ onClick, isAr, loading = false }: { onClick: () => void; isAr: boolean; loading?: boolean }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={loading}
    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap font-['Inter'] transition-colors disabled:opacity-60"
    style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.25)", color: "#22D3EE" }}
    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(34,211,238,0.18)"; }}
    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(34,211,238,0.1)"; }}
  >
    {loading ? <i className="ri-loader-4-line animate-spin" /> : <i className="ri-search-line" />}
    {isAr ? "بحث" : "Lookup"}
  </button>
);

// ─── Shared data ──────────────────────────────────────────────────────────────
export const COUNTRIES = [
  { value: "SA", label: "Saudi Arabia / السعودية" },
  { value: "AE", label: "UAE / الإمارات" },
  { value: "KW", label: "Kuwait / الكويت" },
  { value: "BH", label: "Bahrain / البحرين" },
  { value: "QA", label: "Qatar / قطر" },
  { value: "JO", label: "Jordan / الأردن" },
  { value: "EG", label: "Egypt / مصر" },
  { value: "IN", label: "India / الهند" },
  { value: "PK", label: "Pakistan / باكستان" },
  { value: "BD", label: "Bangladesh / بنغلاديش" },
  { value: "PH", label: "Philippines / الفلبين" },
  { value: "GB", label: "United Kingdom / المملكة المتحدة" },
  { value: "US", label: "United States / الولايات المتحدة" },
  { value: "DE", label: "Germany / ألمانيا" },
  { value: "FR", label: "France / فرنسا" },
  { value: "CN", label: "China / الصين" },
  { value: "JP", label: "Japan / اليابان" },
  { value: "TR", label: "Turkey / تركيا" },
  { value: "OTHER", label: "Other / أخرى" },
];

export const BRANCHES = [
  { value: "main",     label: "Main Branch — Capital" },
  { value: "branch_2", label: "Branch 2 — Northern Region" },
  { value: "branch_3", label: "Branch 3 — Southern Region" },
  { value: "branch_4", label: "Branch 4 — Eastern Region" },
];

export const PAYMENT_METHODS = [
  { value: "cash",          label: "Cash" },
  { value: "credit_card",   label: "Credit Card" },
  { value: "debit_card",    label: "Debit Card" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "online",        label: "Online Payment" },
  { value: "corporate",     label: "Corporate Account" },
  { value: "room_charge",   label: "Room Charge" },
];

export const CARD_TYPES = [
  { value: "visa",       label: "Visa" },
  { value: "mastercard", label: "Mastercard" },
  { value: "amex",       label: "American Express" },
  { value: "unionpay",   label: "UnionPay" },
  { value: "other",      label: "Other" },
];

export const DOC_TYPES = [
  { value: "passport",      label: "Passport" },
  { value: "national_id",   label: "National ID" },
  { value: "resident_card", label: "Resident Card" },
  { value: "gcc_id",        label: "GCC ID" },
  { value: "travel_doc",    label: "Travel Document" },
];

export const GENDERS = [
  { value: "male",   label: "Male / ذكر" },
  { value: "female", label: "Female / أنثى" },
];

export const HOLDER_STATUS = [
  { value: "primary",   label: "Primary Guest" },
  { value: "secondary", label: "Secondary Guest" },
];
