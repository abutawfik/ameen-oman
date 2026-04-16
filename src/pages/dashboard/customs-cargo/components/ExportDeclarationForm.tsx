import { useState } from "react";
import { customsOffices, hsCodes, countries, shippingMethods } from "@/mocks/customsCargoData";

interface Props {
  isAr: boolean;
  onSubmit: (ref: string) => void;
}

const ExportDeclarationForm = ({ isAr, onSubmit }: Props) => {
  const [hsSearch, setHsSearch] = useState("");
  const [selectedHs, setSelectedHs] = useState<typeof hsCodes[0] | null>(null);
  const [showHsDropdown, setShowHsDropdown] = useState(false);
  const [exporterType, setExporterType] = useState<"company" | "individual">("company");
  const [isReExport, setIsReExport] = useState(false);
  const [isControlled, setIsControlled] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  const inputClass = "w-full bg-transparent border rounded-lg px-3 py-2.5 text-white text-sm font-['Inter'] focus:outline-none focus:border-cyan-400 transition-colors placeholder-gray-600";
  const inputStyle = { borderColor: "rgba(34,211,238,0.2)", background: "rgba(255,255,255,0.03)" };
  const labelClass = "block text-gray-400 text-xs font-['Inter'] mb-1.5";
  const sectionClass = "rounded-xl p-5 space-y-4";
  const sectionStyle = { background: "rgba(10,22,40,0.6)", border: "1px solid rgba(34,211,238,0.1)" };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Declaration Header */}
      <div className={sectionClass} style={sectionStyle}>
        <h3 className="text-cyan-400 text-sm font-semibold font-['Inter'] flex items-center gap-2">
          <i className="ri-file-list-3-line" />
          {isAr ? "بيانات إقرار التصدير" : "Export Declaration Details"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>{isAr ? "مكتب الجمارك" : "Customs Office"} *</label>
            <select className={inputClass} style={inputStyle} required>
              <option value="">{isAr ? "اختر المكتب" : "Select Office"}</option>
              {customsOffices.filter(o => o.type !== "ftz").map((o) => (
                <option key={o.id} value={o.id}>{isAr ? o.nameAr : o.nameEn}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>{isAr ? "تاريخ الإقرار" : "Declaration Date"} *</label>
            <input type="date" className={inputClass} style={inputStyle} required
              defaultValue={new Date().toISOString().split("T")[0]} />
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

        {/* Flags */}
        <div className="flex gap-4 flex-wrap">
          <label className="flex items-center gap-2 cursor-pointer">
            <div
              onClick={() => setIsReExport(!isReExport)}
              className="w-5 h-5 rounded flex items-center justify-center transition-all cursor-pointer"
              style={{
                background: isReExport ? "#22D3EE" : "transparent",
                border: `2px solid ${isReExport ? "#22D3EE" : "rgba(34,211,238,0.3)"}`,
              }}
            >
              {isReExport && <i className="ri-check-line text-xs text-[#060D1A]" />}
            </div>
            <span className="text-gray-300 text-sm font-['Inter']">
              {isAr ? "إعادة تصدير (بضائع مستوردة مسبقاً)" : "Re-Export (previously imported goods)"}
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <div
              onClick={() => setIsControlled(!isControlled)}
              className="w-5 h-5 rounded flex items-center justify-center transition-all cursor-pointer"
              style={{
                background: isControlled ? "#FACC15" : "transparent",
                border: `2px solid ${isControlled ? "#FACC15" : "rgba(250,204,21,0.3)"}`,
              }}
            >
              {isControlled && <i className="ri-check-line text-xs text-[#060D1A]" />}
            </div>
            <span className="text-gray-300 text-sm font-['Inter']">
              {isAr ? "بضائع خاضعة للرقابة (تتطلب شهادة المستخدم النهائي)" : "Controlled Goods (requires End User Certificate)"}
            </span>
          </label>
        </div>

        {isControlled && (
          <div>
            <label className={labelClass}>{isAr ? "رقم شهادة المستخدم النهائي" : "End User Certificate Number"} *</label>
            <input type="text" className={inputClass} style={inputStyle} placeholder="EUC-XXXXXXXX" required />
          </div>
        )}
      </div>

      {/* Goods Information */}
      <div className={sectionClass} style={sectionStyle}>
        <h3 className="text-cyan-400 text-sm font-semibold font-['Inter'] flex items-center gap-2">
          <i className="ri-box-3-line" />
          {isAr ? "معلومات البضائع" : "Goods Information"}
        </h3>
        <div className="relative">
          <label className={labelClass}>{isAr ? "رمز النظام المنسق (HS)" : "HS Code"} *</label>
          <input
            type="text"
            className={inputClass}
            style={inputStyle}
            placeholder={isAr ? "ابحث برمز HS أو الوصف..." : "Search HS code or description..."}
            value={hsSearch}
            onChange={(e) => { setHsSearch(e.target.value); setShowHsDropdown(true); }}
            onFocus={() => setShowHsDropdown(true)}
          />
          {showHsDropdown && hsSearch && (
            <div className="absolute z-20 w-full mt-1 rounded-xl overflow-hidden shadow-2xl"
              style={{ background: "#0A1628", border: "1px solid rgba(34,211,238,0.2)" }}>
              {filteredHs.slice(0, 6).map((h) => (
                <button key={h.code} type="button"
                  className="w-full text-left px-4 py-3 hover:bg-cyan-400/10 transition-colors border-b"
                  style={{ borderColor: "rgba(34,211,238,0.06)" }}
                  onClick={() => { setSelectedHs(h); setHsSearch(h.code); setShowHsDropdown(false); }}>
                  <span className="text-cyan-400 text-sm font-bold font-['JetBrains_Mono']">{h.code}</span>
                  <span className="text-gray-300 text-sm font-['Inter'] ml-2">{h.descriptionEn}</span>
                </button>
              ))}
            </div>
          )}
          {selectedHs && (
            <div className="mt-2 px-3 py-2 rounded-lg text-xs font-['Inter']"
              style={{ background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.2)" }}>
              <span className="text-cyan-400 font-bold">{selectedHs.code}</span>
              <span className="text-gray-300 ml-2">{selectedHs.descriptionEn}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{isAr ? "وصف البضائع (إنجليزي)" : "Goods Description (EN)"} *</label>
            <textarea className={inputClass} style={inputStyle} rows={2} required
              placeholder={isAr ? "وصف تفصيلي..." : "Detailed description..."} />
          </div>
          <div>
            <label className={labelClass}>{isAr ? "وصف البضائع (عربي)" : "Goods Description (AR)"}</label>
            <textarea className={inputClass} style={{ ...inputStyle, direction: "rtl" }} rows={2}
              placeholder="وصف تفصيلي..." />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className={labelClass}>{isAr ? "الكمية" : "Quantity"} *</label>
            <input type="number" className={inputClass} style={inputStyle} placeholder="0" required min="0" />
          </div>
          <div>
            <label className={labelClass}>{isAr ? "الوحدة" : "Unit"} *</label>
            <select className={inputClass} style={inputStyle} required>
              {["KG", "TON", "PCS", "CTN", "M3", "LTR", "SET"].map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>{isAr ? "القيمة المُصرَّح بها (LCY)" : "Declared Value (LCY)"} *</label>
            <input type="number" className={inputClass} style={inputStyle} placeholder="0.000" required min="0" step="0.001" />
          </div>
          <div>
            <label className={labelClass}>{isAr ? "بلد الوجهة" : "Destination Country"} *</label>
            <select className={inputClass} style={inputStyle} required>
              <option value="">{isAr ? "اختر البلد" : "Select Country"}</option>
              {countries.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Exporter Details */}
      <div className={sectionClass} style={sectionStyle}>
        <h3 className="text-cyan-400 text-sm font-semibold font-['Inter'] flex items-center gap-2">
          <i className="ri-building-line" />
          {isAr ? "بيانات المُصدِّر" : "Exporter Details"}
        </h3>
        <div className="flex gap-3 mb-4">
          {(["company", "individual"] as const).map((t) => (
            <button key={t} type="button" onClick={() => setExporterType(t)}
              className="px-4 py-2 rounded-lg text-sm font-['Inter'] font-medium transition-all cursor-pointer whitespace-nowrap"
              style={{
                background: exporterType === t ? "#22D3EE" : "rgba(34,211,238,0.08)",
                color: exporterType === t ? "#060D1A" : "#9CA3AF",
                border: `1px solid ${exporterType === t ? "#22D3EE" : "rgba(34,211,238,0.15)"}`,
              }}>
              {t === "company" ? (isAr ? "شركة" : "Company") : (isAr ? "فرد" : "Individual")}
            </button>
          ))}
        </div>
        {exporterType === "company" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{isAr ? "اسم الشركة" : "Company Name"} *</label>
              <input type="text" className={inputClass} style={inputStyle} required placeholder={isAr ? "الاسم التجاري" : "Trade name"} />
            </div>
            <div>
              <label className={labelClass}>{isAr ? "رقم السجل التجاري" : "CR Number"} *</label>
              <input type="text" className={inputClass} style={inputStyle} required placeholder="CR-XXXXXXXX" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{isAr ? "رقم الوثيقة" : "Document Number"} *</label>
              <input type="text" className={inputClass} style={inputStyle} required placeholder={isAr ? "رقم جواز السفر / الهوية" : "Passport / ID"} />
            </div>
            <div>
              <label className={labelClass}>{isAr ? "الاسم الكامل" : "Full Name"} *</label>
              <input type="text" className={inputClass} style={inputStyle} required />
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{isAr ? "اسم الوكيل الجمركي" : "Customs Broker"}</label>
            <input type="text" className={inputClass} style={inputStyle} placeholder={isAr ? "اسم الوكيل المرخص" : "Licensed broker name"} />
          </div>
          <div>
            <label className={labelClass}>{isAr ? "رقم ترخيص الوكيل" : "Broker License"}</label>
            <input type="text" className={inputClass} style={inputStyle} placeholder="BRK-XXXXXX" />
          </div>
        </div>
      </div>

      {/* Transport */}
      <div className={sectionClass} style={sectionStyle}>
        <h3 className="text-cyan-400 text-sm font-semibold font-['Inter'] flex items-center gap-2">
          <i className="ri-ship-line" />
          {isAr ? "تفاصيل النقل" : "Transport Details"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{isAr ? "رقم بوليصة الشحن / AWB" : "Bill of Lading / AWB"}</label>
            <input type="text" className={inputClass} style={inputStyle} placeholder="e.g. MSKU1234567" />
          </div>
          <div>
            <label className={labelClass}>{isAr ? "رقم الحاوية" : "Container Number(s)"}</label>
            <input type="text" className={inputClass} style={inputStyle} placeholder="e.g. MSCU1234567" />
          </div>
          <div>
            <label className={labelClass}>{isAr ? "اسم السفينة / الرحلة" : "Vessel / Flight"}</label>
            <input type="text" className={inputClass} style={inputStyle} placeholder="e.g. MSC DIANA / WY-202" />
          </div>
          <div>
            <label className={labelClass}>{isAr ? "منفذ الخروج" : "Port of Exit"} *</label>
            <select className={inputClass} style={inputStyle} required>
              <option value="">{isAr ? "اختر المنفذ" : "Select Port"}</option>
              {customsOffices.filter(o => o.type !== "ftz" && o.type !== "postal").map((o) => (
                <option key={o.id} value={o.id}>{isAr ? o.nameAr : o.nameEn}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button type="button"
          className="px-6 py-2.5 rounded-lg text-sm font-['Inter'] font-medium cursor-pointer whitespace-nowrap transition-all"
          style={{ border: "1px solid rgba(34,211,238,0.3)", color: "#22D3EE", background: "transparent" }}>
          {isAr ? "حفظ مسودة" : "Save Draft"}
        </button>
        <button type="submit" disabled={submitting}
          className="px-8 py-2.5 rounded-lg text-sm font-['Inter'] font-bold cursor-pointer whitespace-nowrap transition-all flex items-center gap-2"
          style={{ background: submitting ? "rgba(34,211,238,0.5)" : "#22D3EE", color: "#060D1A" }}>
          {submitting ? (
            <><i className="ri-loader-4-line animate-spin" />{isAr ? "جارٍ الإرسال..." : "Submitting..."}</>
          ) : (
            <><i className="ri-send-plane-line" />{isAr ? "إرسال إقرار التصدير" : "Submit Export Declaration"}</>
          )}
        </button>
      </div>
    </form>
  );
};

export default ExportDeclarationForm;
