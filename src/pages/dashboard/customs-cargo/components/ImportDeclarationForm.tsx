import { useState } from "react";
import { customsOffices, hsCodes, countries, shippingMethods } from "@/mocks/customsCargoData";

interface Props {
  isAr: boolean;
  onSubmit: (ref: string) => void;
}

const ImportDeclarationForm = ({ isAr, onSubmit }: Props) => {
  const [hsSearch, setHsSearch] = useState("");
  const [selectedHs, setSelectedHs] = useState<typeof hsCodes[0] | null>(null);
  const [showHsDropdown, setShowHsDropdown] = useState(false);
  const [importerType, setImporterType] = useState<"company" | "individual">("company");
  const [channel, setChannel] = useState("green");
  const [submitting, setSubmitting] = useState(false);

  const filteredHs = hsCodes.filter(
    (h) =>
      h.code.includes(hsSearch) ||
      h.descriptionEn.toLowerCase().includes(hsSearch.toLowerCase())
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
      {/* Declaration Header */}
      <div className={sectionClass} style={sectionStyle}>
        <h3 className="text-gold-400 text-sm font-semibold font-['Inter'] flex items-center gap-2">
          <i className="ri-file-list-3-line" />
          {isAr ? "بيانات الإقرار" : "Declaration Details"}
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
      </div>

      {/* Goods Information */}
      <div className={sectionClass} style={sectionStyle}>
        <h3 className="text-gold-400 text-sm font-semibold font-['Inter'] flex items-center gap-2">
          <i className="ri-box-3-line" />
          {isAr ? "معلومات البضائع" : "Goods Information"}
        </h3>

        {/* HS Code Lookup */}
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
              style={{ background: "#141D2E", border: "1px solid rgba(181,142,60,0.2)" }}>
              {filteredHs.slice(0, 6).map((h) => (
                <button
                  key={h.code}
                  type="button"
                  className="w-full text-left px-4 py-3 hover:bg-gold-400/10 transition-colors border-b"
                  style={{ borderColor: "rgba(181,142,60,0.06)" }}
                  onClick={() => { setSelectedHs(h); setHsSearch(h.code); setShowHsDropdown(false); }}
                >
                  <span className="text-gold-400 text-sm font-bold font-['JetBrains_Mono']">{h.code}</span>
                  <span className="text-gray-300 text-sm font-['Inter'] ml-2">{h.descriptionEn}</span>
                  <span className="text-gray-600 text-xs font-['Inter'] ml-2">({h.category})</span>
                </button>
              ))}
            </div>
          )}
          {selectedHs && (
            <div className="mt-2 px-3 py-2 rounded-lg text-xs font-['Inter']"
              style={{ background: "rgba(181,142,60,0.08)", border: "1px solid rgba(181,142,60,0.2)" }}>
              <span className="text-gold-400 font-bold">{selectedHs.code}</span>
              <span className="text-gray-300 ml-2">{selectedHs.descriptionEn}</span>
              {isAr && <span className="text-gray-400 ml-2 font-['Noto_Sans_Arabic']"> — {selectedHs.descriptionAr}</span>}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{isAr ? "وصف البضائع (إنجليزي)" : "Goods Description (EN)"} *</label>
            <textarea className={inputClass} style={inputStyle} rows={2}
              placeholder={isAr ? "وصف تفصيلي للبضائع..." : "Detailed goods description..."} required />
          </div>
          <div>
            <label className={labelClass}>{isAr ? "وصف البضائع (عربي)" : "Goods Description (AR)"}</label>
            <textarea className={inputClass} style={{ ...inputStyle, direction: "rtl" }} rows={2}
              placeholder="وصف تفصيلي للبضائع..." />
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
            <label className={labelClass}>{isAr ? "العملة الأصلية" : "Origin Currency"}</label>
            <select className={inputClass} style={inputStyle}>
              {["USD", "EUR", "GBP", "AED", "SAR", "CNY", "INR", "JPY"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{isAr ? "بلد المنشأ" : "Country of Origin"} *</label>
            <select className={inputClass} style={inputStyle} required>
              <option value="">{isAr ? "اختر البلد" : "Select Country"}</option>
              {countries.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>{isAr ? "بلد الشحن" : "Country of Consignment"} *</label>
            <select className={inputClass} style={inputStyle} required>
              <option value="">{isAr ? "اختر البلد" : "Select Country"}</option>
              {countries.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Transport Details */}
      <div className={sectionClass} style={sectionStyle}>
        <h3 className="text-gold-400 text-sm font-semibold font-['Inter'] flex items-center gap-2">
          <i className="ri-ship-line" />
          {isAr ? "تفاصيل النقل" : "Transport Details"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{isAr ? "رقم بوليصة الشحن / AWB" : "Bill of Lading / AWB Number"}</label>
            <input type="text" className={inputClass} style={inputStyle} placeholder="e.g. MSKU1234567 / 176-12345678" />
          </div>
          <div>
            <label className={labelClass}>{isAr ? "رقم الحاوية" : "Container Number(s)"}</label>
            <input type="text" className={inputClass} style={inputStyle} placeholder="e.g. MSCU1234567, TCKU9876543" />
          </div>
          <div>
            <label className={labelClass}>{isAr ? "اسم السفينة / الرحلة / المركبة" : "Vessel / Flight / Vehicle"}</label>
            <input type="text" className={inputClass} style={inputStyle} placeholder="e.g. MSC DIANA / WY-101 / TRK-4521" />
          </div>
          <div>
            <label className={labelClass}>{isAr ? "منفذ الدخول" : "Port of Entry"} *</label>
            <select className={inputClass} style={inputStyle} required>
              <option value="">{isAr ? "اختر المنفذ" : "Select Port"}</option>
              {customsOffices.filter(o => o.type !== "ftz" && o.type !== "postal").map((o) => (
                <option key={o.id} value={o.id}>{isAr ? o.nameAr : o.nameEn}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Importer Details */}
      <div className={sectionClass} style={sectionStyle}>
        <h3 className="text-gold-400 text-sm font-semibold font-['Inter'] flex items-center gap-2">
          <i className="ri-building-line" />
          {isAr ? "بيانات المستورد" : "Importer Details"}
        </h3>
        <div className="flex gap-3 mb-4">
          {(["company", "individual"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setImporterType(t)}
              className="px-4 py-2 rounded-lg text-sm font-['Inter'] font-medium transition-all cursor-pointer whitespace-nowrap"
              style={{
                background: importerType === t ? "#D4A84B" : "rgba(181,142,60,0.08)",
                color: importerType === t ? "#0B1220" : "#9CA3AF",
                border: `1px solid ${importerType === t ? "#D4A84B" : "rgba(181,142,60,0.15)"}`,
              }}
            >
              {t === "company"
                ? (isAr ? "شركة" : "Company")
                : (isAr ? "فرد" : "Individual")}
            </button>
          ))}
        </div>
        {importerType === "company" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{isAr ? "اسم الشركة" : "Company Name"} *</label>
              <input type="text" className={inputClass} style={inputStyle} placeholder={isAr ? "الاسم التجاري المسجل" : "Registered trade name"} required />
            </div>
            <div>
              <label className={labelClass}>{isAr ? "رقم السجل التجاري" : "Commercial Registration (CR)"} *</label>
              <input type="text" className={inputClass} style={inputStyle} placeholder="CR-XXXXXXXX" required />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{isAr ? "رقم الوثيقة" : "Document Number"} *</label>
              <input type="text" className={inputClass} style={inputStyle} placeholder={isAr ? "رقم جواز السفر / الهوية" : "Passport / ID number"} required />
            </div>
            <div>
              <label className={labelClass}>{isAr ? "الاسم الكامل" : "Full Name"} *</label>
              <input type="text" className={inputClass} style={inputStyle} placeholder={isAr ? "الاسم كما في الوثيقة" : "Name as in document"} required />
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{isAr ? "اسم الوكيل الجمركي" : "Customs Broker Name"}</label>
            <input type="text" className={inputClass} style={inputStyle} placeholder={isAr ? "اسم الوكيل المرخص" : "Licensed broker name"} />
          </div>
          <div>
            <label className={labelClass}>{isAr ? "رقم ترخيص الوكيل" : "Broker License Number"}</label>
            <input type="text" className={inputClass} style={inputStyle} placeholder="BRK-XXXXXX" />
          </div>
        </div>
      </div>

      {/* Duties & Payment */}
      <div className={sectionClass} style={sectionStyle}>
        <h3 className="text-gold-400 text-sm font-semibold font-['Inter'] flex items-center gap-2">
          <i className="ri-money-dollar-circle-line" />
          {isAr ? "الرسوم والدفع" : "Duties & Payment"}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className={labelClass}>{isAr ? "مبلغ الرسوم الجمركية" : "Duty Amount"}</label>
            <input type="number" className={inputClass} style={inputStyle} placeholder="0.000" min="0" step="0.001" />
          </div>
          <div>
            <label className={labelClass}>{isAr ? "ضريبة القيمة المضافة" : "VAT Amount"}</label>
            <input type="number" className={inputClass} style={inputStyle} placeholder="0.000" min="0" step="0.001" />
          </div>
          <div>
            <label className={labelClass}>{isAr ? "الإجمالي المُقيَّم" : "Total Assessed"}</label>
            <input type="number" className={inputClass} style={inputStyle} placeholder="0.000" min="0" step="0.001" />
          </div>
          <div>
            <label className={labelClass}>{isAr ? "طريقة الدفع" : "Payment Method"}</label>
            <select className={inputClass} style={inputStyle}>
              {["Bank Transfer", "Cash", "Guarantee Bond", "Deferred Payment", "Online Portal"].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Inspection */}
      <div className={sectionClass} style={sectionStyle}>
        <h3 className="text-gold-400 text-sm font-semibold font-['Inter'] flex items-center gap-2">
          <i className="ri-search-eye-line" />
          {isAr ? "الفحص والتفتيش" : "Inspection"}
        </h3>
        <div className="flex gap-3 flex-wrap mb-4">
          {[
            { id: "green",  label: "Green Channel",  labelAr: "القناة الخضراء",  color: "#4ADE80" },
            { id: "yellow", label: "Yellow Review",  labelAr: "المراجعة الصفراء",color: "#FACC15" },
            { id: "red",    label: "Red Inspection", labelAr: "الفحص الأحمر",    color: "#F87171" },
          ].map((ch) => (
            <button
              key={ch.id}
              type="button"
              onClick={() => setChannel(ch.id)}
              className="px-4 py-2 rounded-lg text-sm font-['Inter'] font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-2"
              style={{
                background: channel === ch.id ? `${ch.color}20` : "rgba(255,255,255,0.03)",
                color: channel === ch.id ? ch.color : "#6B7280",
                border: `1px solid ${channel === ch.id ? ch.color : "rgba(255,255,255,0.08)"}`,
              }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: ch.color }} />
              {isAr ? ch.labelAr : ch.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{isAr ? "رقم هوية المفتش" : "Inspector ID"}</label>
            <input type="text" className={inputClass} style={inputStyle} placeholder="INS-XXXXXX" />
          </div>
          <div>
            <label className={labelClass}>{isAr ? "نتائج الفحص" : "Inspection Findings"}</label>
            <input type="text" className={inputClass} style={inputStyle} placeholder={isAr ? "ملاحظات الفحص..." : "Inspection notes..."} />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          className="px-6 py-2.5 rounded-lg text-sm font-['Inter'] font-medium cursor-pointer whitespace-nowrap transition-all"
          style={{ border: "1px solid rgba(181,142,60,0.3)", color: "#D4A84B", background: "transparent" }}
        >
          {isAr ? "حفظ مسودة" : "Save Draft"}
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-8 py-2.5 rounded-lg text-sm font-['Inter'] font-bold cursor-pointer whitespace-nowrap transition-all flex items-center gap-2"
          style={{ background: submitting ? "rgba(181,142,60,0.5)" : "#D4A84B", color: "#0B1220" }}
        >
          {submitting ? (
            <><i className="ri-loader-4-line animate-spin" />{isAr ? "جارٍ الإرسال..." : "Submitting..."}</>
          ) : (
            <><i className="ri-send-plane-line" />{isAr ? "إرسال الإقرار" : "Submit Declaration"}</>
          )}
        </button>
      </div>
    </form>
  );
};

export default ImportDeclarationForm;
