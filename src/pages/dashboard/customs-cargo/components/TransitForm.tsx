import { useState } from "react";
import { customsOffices, hsCodes, countries, shippingMethods } from "@/mocks/customsCargoData";

interface Props {
  isAr: boolean;
  onSubmit: (ref: string) => void;
}

const TransitForm = ({ isAr, onSubmit }: Props) => {
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
  const inputStyle = { borderColor: "rgba(181,142,60,0.2)", background: "rgba(255,255,255,0.03)" };
  const labelClass = "block text-gray-400 text-xs font-['Inter'] mb-1.5";
  const sectionClass = "rounded-xl p-5 space-y-4";
  const sectionStyle = { background: "rgba(20,29,46,0.6)", border: "1px solid rgba(181,142,60,0.1)" };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Transit Route */}
      <div className={sectionClass} style={sectionStyle}>
        <h3 className="text-gold-400 text-sm font-semibold font-['Inter'] flex items-center gap-2">
          <i className="ri-arrow-left-right-line" />
          {isAr ? "مسار العبور" : "Transit Route"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>{isAr ? "بلد المنشأ" : "Origin Country"} *</label>
            <select className={inputClass} style={inputStyle} required>
              <option value="">{isAr ? "اختر البلد" : "Select Country"}</option>
              {countries.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>{isAr ? "بلد الوجهة" : "Destination Country"} *</label>
            <select className={inputClass} style={inputStyle} required>
              <option value="">{isAr ? "اختر البلد" : "Select Country"}</option>
              {countries.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>{isAr ? "طريقة الشحن" : "Shipping Method"} *</label>
            <select className={inputClass} style={inputStyle} required>
              <option value="">{isAr ? "اختر الطريقة" : "Select Method"}</option>
              {shippingMethods.map((m) => (
                <option key={m.id} value={m.id}>{isAr ? m.labelAr : m.labelEn}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{isAr ? "منفذ الدخول" : "Entry Port"} *</label>
            <select className={inputClass} style={inputStyle} required>
              <option value="">{isAr ? "اختر المنفذ" : "Select Port"}</option>
              {customsOffices.filter(o => o.type !== "ftz" && o.type !== "postal").map((o) => (
                <option key={o.id} value={o.id}>{isAr ? o.nameAr : o.nameEn}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>{isAr ? "منفذ الخروج" : "Exit Port"} *</label>
            <select className={inputClass} style={inputStyle} required>
              <option value="">{isAr ? "اختر المنفذ" : "Select Port"}</option>
              {customsOffices.filter(o => o.type !== "ftz" && o.type !== "postal").map((o) => (
                <option key={o.id} value={o.id}>{isAr ? o.nameAr : o.nameEn}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>{isAr ? "المسار المحدد" : "Prescribed Route"}</label>
          <input type="text" className={inputClass} style={inputStyle}
            placeholder={isAr ? "مثال: ميناء شمالي → طريق الساحل → منفذ غربي" : "e.g. Northern Port → Coastal Highway → Western Crossing"} />
        </div>
      </div>

      {/* Bond & Guarantee */}
      <div className={sectionClass} style={sectionStyle}>
        <h3 className="text-gold-400 text-sm font-semibold font-['Inter'] flex items-center gap-2">
          <i className="ri-shield-check-line" />
          {isAr ? "الكفالة والضمان" : "Bond & Guarantee"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>{isAr ? "رقم مرجع الكفالة" : "Bond Reference Number"} *</label>
            <input type="text" className={inputClass} style={inputStyle} placeholder="BOND-XXXXXXXX" required />
          </div>
          <div>
            <label className={labelClass}>{isAr ? "مبلغ الضمان (LCY)" : "Guarantee Amount (LCY)"} *</label>
            <input type="number" className={inputClass} style={inputStyle} placeholder="0.000" required min="0" step="0.001" />
          </div>
          <div>
            <label className={labelClass}>{isAr ? "مدة العبور (أيام)" : "Transit Period (days)"} *</label>
            <input type="number" className={inputClass} style={inputStyle} placeholder="e.g. 7" required min="1" max="90" />
          </div>
        </div>
        <div>
          <label className={labelClass}>{isAr ? "أرقام الأختام" : "Seal Numbers"}</label>
          <input type="text" className={inputClass} style={inputStyle}
            placeholder={isAr ? "أرقام الأختام مفصولة بفاصلة..." : "Seal numbers, comma-separated..."} />
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
              style={{ background: "#141D2E", border: "1px solid rgba(181,142,60,0.2)" }}>
              {filteredHs.slice(0, 5).map((h) => (
                <button key={h.code} type="button"
                  className="w-full text-left px-4 py-3 hover:bg-gold-400/10 transition-colors border-b"
                  style={{ borderColor: "rgba(181,142,60,0.06)" }}
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>{isAr ? "الكمية" : "Quantity"} *</label>
            <input type="number" className={inputClass} style={inputStyle} placeholder="0" required min="0" />
          </div>
          <div>
            <label className={labelClass}>{isAr ? "الوحدة" : "Unit"}</label>
            <select className={inputClass} style={inputStyle}>
              {["KG", "TON", "PCS", "CTN", "M3"].map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>{isAr ? "رقم الحاوية" : "Container Number"}</label>
            <input type="text" className={inputClass} style={inputStyle} placeholder="MSCU1234567" />
          </div>
        </div>
      </div>

      {/* Carrier */}
      <div className={sectionClass} style={sectionStyle}>
        <h3 className="text-gold-400 text-sm font-semibold font-['Inter'] flex items-center gap-2">
          <i className="ri-truck-line" />
          {isAr ? "بيانات الناقل" : "Carrier Details"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{isAr ? "اسم الناقل" : "Carrier Name"} *</label>
            <input type="text" className={inputClass} style={inputStyle} required
              placeholder={isAr ? "اسم شركة الشحن" : "Shipping company name"} />
          </div>
          <div>
            <label className={labelClass}>{isAr ? "رقم المركبة / الرحلة" : "Vehicle / Flight Number"}</label>
            <input type="text" className={inputClass} style={inputStyle} placeholder="e.g. TRK-4521 / WY-303" />
          </div>
          <div>
            <label className={labelClass}>{isAr ? "تاريخ الدخول المتوقع" : "Expected Entry Date"} *</label>
            <input type="date" className={inputClass} style={inputStyle} required />
          </div>
          <div>
            <label className={labelClass}>{isAr ? "تاريخ الخروج المتوقع" : "Expected Exit Date"} *</label>
            <input type="date" className={inputClass} style={inputStyle} required />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button type="button"
          className="px-6 py-2.5 rounded-lg text-sm font-['Inter'] font-medium cursor-pointer whitespace-nowrap transition-all"
          style={{ border: "1px solid rgba(181,142,60,0.3)", color: "#D4A84B", background: "transparent" }}>
          {isAr ? "حفظ مسودة" : "Save Draft"}
        </button>
        <button type="submit" disabled={submitting}
          className="px-8 py-2.5 rounded-lg text-sm font-['Inter'] font-bold cursor-pointer whitespace-nowrap transition-all flex items-center gap-2"
          style={{ background: submitting ? "rgba(181,142,60,0.5)" : "#D4A84B", color: "#0B1220" }}>
          {submitting ? (
            <><i className="ri-loader-4-line animate-spin" />{isAr ? "جارٍ الإرسال..." : "Submitting..."}</>
          ) : (
            <><i className="ri-send-plane-line" />{isAr ? "إرسال إقرار العبور" : "Submit Transit Declaration"}</>
          )}
        </button>
      </div>
    </form>
  );
};

export default TransitForm;
