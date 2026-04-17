import { useState } from "react";
import { freeZones, hsCodes, fzPurposes } from "@/mocks/customsCargoData";

interface Props {
  isAr: boolean;
  onSubmit: (ref: string) => void;
}

const FreeZoneForm = ({ isAr, onSubmit }: Props) => {
  const [movement, setMovement] = useState<"in" | "out">("in");
  const [submitting, setSubmitting] = useState(false);
  const [hsSearch, setHsSearch] = useState("");
  const [showHsDropdown, setShowHsDropdown] = useState(false);

  const filteredHs = hsCodes.filter(
    (h) => h.code.includes(hsSearch) || h.descriptionEn.toLowerCase().includes(hsSearch.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      const seq = Math.floor(Math.random() * 90000) + 10000;
      onSubmit(`AMN-CUS-${new Date().getFullYear()}-${seq}`);
      setSubmitting(false);
    }, 1200);
  };

  const inputClass = "w-full bg-transparent border rounded-lg px-3 py-2.5 text-white text-sm font-['Inter'] focus:outline-none focus:border-gold-400 transition-colors placeholder-gray-600";
  const inputStyle = { borderColor: "rgba(184,138,60,0.2)", background: "rgba(255,255,255,0.03)" };
  const labelClass = "block text-gray-400 text-xs font-['Inter'] mb-1.5";
  const sectionClass = "rounded-xl p-5 space-y-4";
  const sectionStyle = { background: "rgba(10,37,64,0.6)", border: "1px solid rgba(184,138,60,0.1)" };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Movement Type */}
      <div className={sectionClass} style={sectionStyle}>
        <h3 className="text-gold-400 text-sm font-semibold font-['Inter'] flex items-center gap-2">
          <i className="ri-store-2-line" />
          {isAr ? "حركة المنطقة الحرة" : "Free Zone Movement"}
        </h3>
        <div className="flex gap-3">
          {(["in", "out"] as const).map((m) => (
            <button key={m} type="button" onClick={() => setMovement(m)}
              className="flex-1 py-3 rounded-xl text-sm font-['Inter'] font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
              style={{
                background: movement === m ? (m === "in" ? "rgba(184,138,60,0.15)" : "rgba(74,222,128,0.15)") : "rgba(255,255,255,0.03)",
                color: movement === m ? (m === "in" ? "#D6B47E" : "#4ADE80") : "#6B7280",
                border: `1px solid ${movement === m ? (m === "in" ? "#D6B47E" : "#4ADE80") : "rgba(255,255,255,0.08)"}`,
              }}>
              <i className={m === "in" ? "ri-login-box-line" : "ri-logout-box-line"} />
              {m === "in"
                ? (isAr ? "دخول المنطقة الحرة" : "Free Zone Entry")
                : (isAr ? "خروج المنطقة الحرة" : "Free Zone Exit")}
            </button>
          ))}
        </div>
      </div>

      {/* Zone & Company */}
      <div className={sectionClass} style={sectionStyle}>
        <h3 className="text-gold-400 text-sm font-semibold font-['Inter'] flex items-center gap-2">
          <i className="ri-building-4-line" />
          {isAr ? "بيانات المنطقة والشركة" : "Zone & Company Details"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{isAr ? "اسم المنطقة الحرة" : "Free Zone Name"} *</label>
            <select className={inputClass} style={inputStyle} required>
              <option value="">{isAr ? "اختر المنطقة" : "Select Zone"}</option>
              {freeZones.map((z) => (
                <option key={z.id} value={z.id}>{isAr ? z.nameAr : z.nameEn} ({z.type})</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>{isAr ? "رقم ترخيص شركة المنطقة الحرة" : "FZ Company License Number"} *</label>
            <input type="text" className={inputClass} style={inputStyle} placeholder="FZL-XXXXXXXX" required />
          </div>
          <div>
            <label className={labelClass}>{isAr ? "اسم الشركة" : "Company Name"} *</label>
            <input type="text" className={inputClass} style={inputStyle} required
              placeholder={isAr ? "الاسم التجاري المسجل" : "Registered trade name"} />
          </div>
          <div>
            <label className={labelClass}>{isAr ? "الغرض" : "Purpose"} *</label>
            <select className={inputClass} style={inputStyle} required>
              <option value="">{isAr ? "اختر الغرض" : "Select Purpose"}</option>
              {fzPurposes.map((p) => (
                <option key={p.id} value={p.id}>{isAr ? p.labelAr : p.labelEn}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{isAr ? "تاريخ الدخول" : "Entry Date"} *</label>
            <input type="date" className={inputClass} style={inputStyle} required
              defaultValue={new Date().toISOString().split("T")[0]} />
          </div>
          <div>
            <label className={labelClass}>{isAr ? "مدة التخزين المتوقعة (أيام)" : "Expected Duration in Zone (days)"}</label>
            <input type="number" className={inputClass} style={inputStyle} placeholder="e.g. 30" min="1" />
          </div>
        </div>
      </div>

      {/* Goods */}
      <div className={sectionClass} style={sectionStyle}>
        <h3 className="text-gold-400 text-sm font-semibold font-['Inter'] flex items-center gap-2">
          <i className="ri-box-3-line" />
          {isAr ? "معلومات البضائع" : "Goods Information"}
        </h3>
        <div className="relative">
          <label className={labelClass}>{isAr ? "رمز HS" : "HS Code"} *</label>
          <input type="text" className={inputClass} style={inputStyle}
            placeholder={isAr ? "ابحث برمز HS..." : "Search HS code..."}
            value={hsSearch}
            onChange={(e) => { setHsSearch(e.target.value); setShowHsDropdown(true); }}
            onFocus={() => setShowHsDropdown(true)} />
          {showHsDropdown && hsSearch && (
            <div className="absolute z-20 w-full mt-1 rounded-xl overflow-hidden shadow-2xl"
              style={{ background: "#0A2540", border: "1px solid rgba(184,138,60,0.2)" }}>
              {filteredHs.slice(0, 5).map((h) => (
                <button key={h.code} type="button"
                  className="w-full text-left px-4 py-3 hover:bg-gold-400/10 transition-colors border-b"
                  style={{ borderColor: "rgba(184,138,60,0.06)" }}
                  onClick={() => { setHsSearch(h.code); setShowHsDropdown(false); }}>
                  <span className="text-gold-400 text-sm font-bold font-['JetBrains_Mono']">{h.code}</span>
                  <span className="text-gray-300 text-sm font-['Inter'] ml-2">{h.descriptionEn}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{isAr ? "وصف البضائع" : "Goods Description"} *</label>
            <textarea className={inputClass} style={inputStyle} rows={2} required
              placeholder={isAr ? "وصف تفصيلي..." : "Detailed description..."} />
          </div>
          <div>
            <label className={labelClass}>{isAr ? "القيمة المُصرَّح بها (LCY)" : "Declared Value (LCY)"} *</label>
            <input type="number" className={inputClass} style={inputStyle} placeholder="0.000" required min="0" step="0.001" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>{isAr ? "الكمية" : "Quantity"} *</label>
            <input type="number" className={inputClass} style={inputStyle} placeholder="0" required min="0" />
          </div>
          <div>
            <label className={labelClass}>{isAr ? "الوحدة" : "Unit"}</label>
            <select className={inputClass} style={inputStyle}>
              {["KG", "TON", "PCS", "CTN", "M3", "LTR"].map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>{isAr ? "رقم الحاوية" : "Container Number"}</label>
            <input type="text" className={inputClass} style={inputStyle} placeholder="MSCU1234567" />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button type="button"
          className="px-6 py-2.5 rounded-lg text-sm font-['Inter'] font-medium cursor-pointer whitespace-nowrap transition-all"
          style={{ border: "1px solid rgba(184,138,60,0.3)", color: "#D6B47E", background: "transparent" }}>
          {isAr ? "حفظ مسودة" : "Save Draft"}
        </button>
        <button type="submit" disabled={submitting}
          className="px-8 py-2.5 rounded-lg text-sm font-['Inter'] font-bold cursor-pointer whitespace-nowrap transition-all flex items-center gap-2"
          style={{ background: submitting ? "rgba(184,138,60,0.5)" : "#D6B47E", color: "#051428" }}>
          {submitting ? (
            <><i className="ri-loader-4-line animate-spin" />{isAr ? "جارٍ الإرسال..." : "Submitting..."}</>
          ) : (
            <><i className="ri-send-plane-line" />{isAr ? "إرسال حركة المنطقة الحرة" : "Submit Free Zone Movement"}</>
          )}
        </button>
      </div>
    </form>
  );
};

export default FreeZoneForm;
