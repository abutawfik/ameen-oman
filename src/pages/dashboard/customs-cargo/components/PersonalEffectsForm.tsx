import { useState } from "react";
import { customsOffices } from "@/mocks/customsCargoData";

interface Props {
  isAr: boolean;
  onSubmit: (ref: string) => void;
}

interface EffectItem {
  id: string;
  description: string;
  quantity: string;
  value: string;
}

const PersonalEffectsForm = ({ isAr, onSubmit }: Props) => {
  const [accompanied, setAccompanied] = useState<"accompanied" | "unaccompanied">("accompanied");
  const [items, setItems] = useState<EffectItem[]>([
    { id: "1", description: "", quantity: "1", value: "" },
  ]);
  const [submitting, setSubmitting] = useState(false);

  const addItem = () => {
    setItems((prev) => [...prev, { id: Date.now().toString(), description: "", quantity: "1", value: "" }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, field: keyof EffectItem, value: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const totalValue = items.reduce((sum, i) => sum + (parseFloat(i.value) || 0), 0);

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
      {/* Type */}
      <div className={sectionClass} style={sectionStyle}>
        <h3 className="text-gold-400 text-sm font-semibold font-['Inter'] flex items-center gap-2">
          <i className="ri-luggage-cart-line" />
          {isAr ? "نوع الأمتعة الشخصية" : "Personal Effects Type"}
        </h3>
        <div className="flex gap-3">
          {(["accompanied", "unaccompanied"] as const).map((t) => (
            <button key={t} type="button" onClick={() => setAccompanied(t)}
              className="flex-1 py-3 rounded-xl text-sm font-['Inter'] font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
              style={{
                background: accompanied === t ? "rgba(181,142,60,0.15)" : "rgba(255,255,255,0.03)",
                color: accompanied === t ? "#D4A84B" : "#6B7280",
                border: `1px solid ${accompanied === t ? "#D4A84B" : "rgba(255,255,255,0.08)"}`,
              }}>
              <i className={t === "accompanied" ? "ri-user-line" : "ri-box-3-line"} />
              {t === "accompanied"
                ? (isAr ? "مصحوبة (مع المسافر)" : "Accompanied (with traveler)")
                : (isAr ? "غير مصحوبة (شحن منفصل)" : "Unaccompanied (separate shipment)")}
            </button>
          ))}
        </div>
      </div>

      {/* Owner Details */}
      <div className={sectionClass} style={sectionStyle}>
        <h3 className="text-gold-400 text-sm font-semibold font-['Inter'] flex items-center gap-2">
          <i className="ri-user-line" />
          {isAr ? "بيانات المالك" : "Owner Details"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{isAr ? "رقم الوثيقة" : "Document Number"} *</label>
            <input type="text" className={inputClass} style={inputStyle} required
              placeholder={isAr ? "رقم جواز السفر / الهوية" : "Passport / ID number"} />
          </div>
          <div>
            <label className={labelClass}>{isAr ? "الاسم الكامل" : "Full Name"} *</label>
            <input type="text" className={inputClass} style={inputStyle} required
              placeholder={isAr ? "الاسم كما في الوثيقة" : "Name as in document"} />
          </div>
          <div>
            <label className={labelClass}>{isAr ? "الجنسية" : "Nationality"} *</label>
            <input type="text" className={inputClass} style={inputStyle} required />
          </div>
          <div>
            <label className={labelClass}>{isAr ? "رقم الرحلة / وسيلة النقل" : "Flight / Transport Number"}</label>
            <input type="text" className={inputClass} style={inputStyle} placeholder="e.g. WY-101" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <label className={labelClass}>{isAr ? "تاريخ الوصول" : "Arrival Date"} *</label>
            <input type="date" className={inputClass} style={inputStyle} required
              defaultValue={new Date().toISOString().split("T")[0]} />
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className={sectionClass} style={sectionStyle}>
        <div className="flex items-center justify-between">
          <h3 className="text-gold-400 text-sm font-semibold font-['Inter'] flex items-center gap-2">
            <i className="ri-list-check-2" />
            {isAr ? "قائمة الأمتعة والمقتنيات" : "Items List"}
          </h3>
          <button type="button" onClick={addItem}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-['Inter'] font-medium cursor-pointer transition-all whitespace-nowrap"
            style={{ background: "rgba(181,142,60,0.1)", color: "#D4A84B", border: "1px solid rgba(181,142,60,0.2)" }}>
            <i className="ri-add-line" />
            {isAr ? "إضافة عنصر" : "Add Item"}
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <span className="text-gray-600 text-xs font-['JetBrains_Mono'] mt-3 w-5 flex-shrink-0">{idx + 1}.</span>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-1">
                  <label className={labelClass}>{isAr ? "وصف العنصر" : "Item Description"} *</label>
                  <input type="text" className={inputClass} style={inputStyle} required
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    placeholder={isAr ? "مثال: لابتوب، ملابس..." : "e.g. Laptop, Clothing..."} />
                </div>
                <div>
                  <label className={labelClass}>{isAr ? "الكمية" : "Qty"}</label>
                  <input type="number" className={inputClass} style={inputStyle} min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, "quantity", e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>{isAr ? "القيمة التقديرية (LCY)" : "Est. Value (LCY)"}</label>
                  <input type="number" className={inputClass} style={inputStyle} min="0" step="0.001"
                    value={item.value}
                    onChange={(e) => updateItem(item.id, "value", e.target.value)}
                    placeholder="0.000" />
                </div>
              </div>
              {items.length > 1 && (
                <button type="button" onClick={() => removeItem(item.id)}
                  className="mt-6 w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer transition-all flex-shrink-0"
                  style={{ background: "rgba(248,113,113,0.1)", color: "#F87171" }}>
                  <i className="ri-delete-bin-line text-sm" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex items-center justify-between p-3 rounded-lg"
          style={{ background: "rgba(181,142,60,0.06)", border: "1px solid rgba(181,142,60,0.15)" }}>
          <span className="text-gray-300 text-sm font-['Inter']">
            {isAr ? "إجمالي القيمة التقديرية" : "Total Estimated Value"}
          </span>
          <span className="text-gold-400 text-lg font-bold font-['JetBrains_Mono']">
            {totalValue.toFixed(3)} LCY
          </span>
        </div>
      </div>

      {/* Customs Assessment */}
      <div className={sectionClass} style={sectionStyle}>
        <h3 className="text-gold-400 text-sm font-semibold font-['Inter'] flex items-center gap-2">
          <i className="ri-scales-3-line" />
          {isAr ? "التقييم الجمركي" : "Customs Assessment"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{isAr ? "تقييم الجمارك (LCY)" : "Customs Assessment (LCY)"}</label>
            <input type="number" className={inputClass} style={inputStyle} placeholder="0.000" min="0" step="0.001" />
          </div>
          <div>
            <label className={labelClass}>{isAr ? "الرسوم المستحقة (LCY)" : "Duties Due (LCY)"}</label>
            <input type="number" className={inputClass} style={inputStyle} placeholder="0.000" min="0" step="0.001" />
          </div>
        </div>
        <div>
          <label className={labelClass}>{isAr ? "ملاحظات الجمارك" : "Customs Notes"}</label>
          <textarea className={inputClass} style={inputStyle} rows={2}
            placeholder={isAr ? "ملاحظات إضافية..." : "Additional notes..."} />
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
            <><i className="ri-send-plane-line" />{isAr ? "إرسال إقرار الأمتعة" : "Submit Personal Effects"}</>
          )}
        </button>
      </div>
    </form>
  );
};

export default PersonalEffectsForm;
