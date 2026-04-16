import { useState } from "react";
import { customsOffices, seizureReasons } from "@/mocks/customsCargoData";

interface Props {
  isAr: boolean;
  onSubmit: (ref: string) => void;
}

const SeizureForm = ({ isAr, onSubmit }: Props) => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [photoCount, setPhotoCount] = useState(0);

  const toggleReason = (id: string) => {
    setSelectedReasons((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

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
      {/* Warning Banner */}
      <div className="rounded-xl p-4 flex items-start gap-3"
        style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.3)" }}>
        <i className="ri-alarm-warning-line text-red-400 text-xl flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-red-400 text-sm font-semibold font-['Inter']">
            {isAr ? "تسجيل ضبط جمركي" : "Customs Seizure Record"}
          </p>
          <p className="text-red-300/70 text-xs font-['Inter'] mt-0.5">
            {isAr
              ? "هذا السجل سيُرسَل فوراً إلى مركز القيادة وسيُنشئ قضية تلقائياً."
              : "This record will be immediately sent to Command Center and will auto-create a case."}
          </p>
        </div>
      </div>

      {/* Seizure Details */}
      <div className={sectionClass} style={sectionStyle}>
        <h3 className="text-red-400 text-sm font-semibold font-['Inter'] flex items-center gap-2">
          <i className="ri-shield-cross-line" />
          {isAr ? "تفاصيل الضبط" : "Seizure Details"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{isAr ? "رقم مرجع الإقرار (إن وجد)" : "Declaration Reference (if any)"}</label>
            <input type="text" className={inputClass} style={inputStyle} placeholder="AMN-CUS-XXXX-XXXXX" />
          </div>
          <div>
            <label className={labelClass}>{isAr ? "مكتب الجمارك" : "Customs Office"} *</label>
            <select className={inputClass} style={inputStyle} required>
              <option value="">{isAr ? "اختر المكتب" : "Select Office"}</option>
              {customsOffices.map((o) => (
                <option key={o.id} value={o.id}>{isAr ? o.nameAr : o.nameEn}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>{isAr ? "تاريخ ووقت الضبط" : "Seizure Date & Time"} *</label>
            <input type="datetime-local" className={inputClass} style={inputStyle} required
              defaultValue={new Date().toISOString().slice(0, 16)} />
          </div>
          <div>
            <label className={labelClass}>{isAr ? "رقم هوية الضابط" : "Officer ID"} *</label>
            <input type="text" className={inputClass} style={inputStyle} placeholder="OFF-XXXXXX" required />
          </div>
        </div>
      </div>

      {/* Seizure Reasons */}
      <div className={sectionClass} style={sectionStyle}>
        <h3 className="text-red-400 text-sm font-semibold font-['Inter'] flex items-center gap-2">
          <i className="ri-error-warning-line" />
          {isAr ? "أسباب الضبط" : "Seizure Reasons"} *
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {seizureReasons.map((reason) => (
            <button
              key={reason.id}
              type="button"
              onClick={() => toggleReason(reason.id)}
              className="flex items-center gap-3 p-3 rounded-lg text-left transition-all cursor-pointer"
              style={{
                background: selectedReasons.includes(reason.id) ? "rgba(248,113,113,0.12)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${selectedReasons.includes(reason.id) ? "rgba(248,113,113,0.4)" : "rgba(255,255,255,0.06)"}`,
              }}
            >
              <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                style={{
                  background: selectedReasons.includes(reason.id) ? "#F87171" : "transparent",
                  border: `2px solid ${selectedReasons.includes(reason.id) ? "#F87171" : "rgba(248,113,113,0.3)"}`,
                }}>
                {selectedReasons.includes(reason.id) && <i className="ri-check-line text-xs text-[#060D1A]" />}
              </div>
              <span className="text-sm font-['Inter']"
                style={{ color: selectedReasons.includes(reason.id) ? "#F87171" : "#9CA3AF" }}>
                {isAr ? reason.labelAr : reason.labelEn}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Seized Items */}
      <div className={sectionClass} style={sectionStyle}>
        <h3 className="text-red-400 text-sm font-semibold font-['Inter'] flex items-center gap-2">
          <i className="ri-box-3-line" />
          {isAr ? "البضائع المضبوطة" : "Seized Items"}
        </h3>
        <div>
          <label className={labelClass}>{isAr ? "وصف البضائع المضبوطة" : "Description of Seized Items"} *</label>
          <textarea className={inputClass} style={inputStyle} rows={3} required
            placeholder={isAr ? "وصف تفصيلي للبضائع المضبوطة، الكميات، الأوزان..." : "Detailed description of seized items, quantities, weights..."} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{isAr ? "القيمة التقديرية (LCY)" : "Estimated Value (LCY)"}</label>
            <input type="number" className={inputClass} style={inputStyle} placeholder="0.000" min="0" step="0.001" />
          </div>
          <div>
            <label className={labelClass}>{isAr ? "رقم مرجع القضية" : "Case Reference Number"}</label>
            <input type="text" className={inputClass} style={inputStyle} placeholder="CASE-XXXXXXXX" />
          </div>
        </div>
      </div>

      {/* Person / Entity */}
      <div className={sectionClass} style={sectionStyle}>
        <h3 className="text-red-400 text-sm font-semibold font-['Inter'] flex items-center gap-2">
          <i className="ri-user-line" />
          {isAr ? "بيانات الشخص / الجهة" : "Person / Entity Details"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{isAr ? "رقم الوثيقة / السجل التجاري" : "Document / CR Number"}</label>
            <input type="text" className={inputClass} style={inputStyle} placeholder={isAr ? "رقم الوثيقة..." : "Document number..."} />
          </div>
          <div>
            <label className={labelClass}>{isAr ? "الاسم" : "Name"}</label>
            <input type="text" className={inputClass} style={inputStyle} placeholder={isAr ? "الاسم الكامل أو اسم الشركة" : "Full name or company name"} />
          </div>
          <div>
            <label className={labelClass}>{isAr ? "الجنسية" : "Nationality"}</label>
            <input type="text" className={inputClass} style={inputStyle} placeholder={isAr ? "الجنسية..." : "Nationality..."} />
          </div>
          <div>
            <label className={labelClass}>{isAr ? "رقم الهاتف" : "Phone Number"}</label>
            <input type="tel" className={inputClass} style={inputStyle} placeholder="+968 XXXX XXXX" />
          </div>
        </div>
      </div>

      {/* Photos */}
      <div className={sectionClass} style={sectionStyle}>
        <h3 className="text-red-400 text-sm font-semibold font-['Inter'] flex items-center gap-2">
          <i className="ri-camera-line" />
          {isAr ? "صور الضبط" : "Seizure Photos"}
        </h3>
        <div
          className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all"
          style={{ borderColor: "rgba(248,113,113,0.3)", background: "rgba(248,113,113,0.04)" }}
          onClick={() => setPhotoCount((c) => Math.min(c + 1, 10))}
        >
          <i className="ri-upload-cloud-2-line text-3xl text-red-400/50 mb-2" />
          <p className="text-gray-400 text-sm font-['Inter']">
            {isAr ? "انقر لإرفاق صور الضبط" : "Click to attach seizure photos"}
          </p>
          <p className="text-gray-600 text-xs font-['Inter'] mt-1">
            {isAr ? "JPG, PNG — حتى 10 صور" : "JPG, PNG — up to 10 photos"}
          </p>
          {photoCount > 0 && (
            <div className="mt-3 flex items-center justify-center gap-2">
              <i className="ri-image-line text-red-400" />
              <span className="text-red-400 text-sm font-['JetBrains_Mono']">{photoCount} {isAr ? "صورة مرفقة" : "photo(s) attached"}</span>
            </div>
          )}
        </div>
      </div>

      {/* Findings */}
      <div className={sectionClass} style={sectionStyle}>
        <h3 className="text-red-400 text-sm font-semibold font-['Inter'] flex items-center gap-2">
          <i className="ri-file-text-line" />
          {isAr ? "نتائج وملاحظات الضابط" : "Officer Findings & Notes"}
        </h3>
        <textarea className={inputClass} style={inputStyle} rows={4}
          placeholder={isAr ? "وصف تفصيلي لملابسات الضبط، الإجراءات المتخذة، الملاحظات..." : "Detailed description of seizure circumstances, actions taken, observations..."} />
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button type="button"
          className="px-6 py-2.5 rounded-lg text-sm font-['Inter'] font-medium cursor-pointer whitespace-nowrap transition-all"
          style={{ border: "1px solid rgba(248,113,113,0.3)", color: "#F87171", background: "transparent" }}>
          {isAr ? "حفظ مسودة" : "Save Draft"}
        </button>
        <button type="submit" disabled={submitting}
          className="px-8 py-2.5 rounded-lg text-sm font-['Inter'] font-bold cursor-pointer whitespace-nowrap transition-all flex items-center gap-2"
          style={{ background: submitting ? "rgba(248,113,113,0.5)" : "#F87171", color: "#060D1A" }}>
          {submitting ? (
            <><i className="ri-loader-4-line animate-spin" />{isAr ? "جارٍ الإرسال..." : "Submitting..."}</>
          ) : (
            <><i className="ri-alarm-warning-line" />{isAr ? "تسجيل الضبط" : "Record Seizure"}</>
          )}
        </button>
      </div>
    </form>
  );
};

export default SeizureForm;
