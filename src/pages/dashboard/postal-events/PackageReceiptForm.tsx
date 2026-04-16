import { useState } from "react";
import { SectionCard, FormField, TextInput, SelectInput, FormActions } from "@/pages/dashboard/hotel-events/components/FormComponents";
import PstConfirmation from "./components/PstConfirmation";

interface Props { isAr: boolean; onCancel: () => void; }

const CONTENT_CATEGORIES = [
  { value: "electronics", label: "Electronics" }, { value: "clothing", label: "Clothing & Apparel" },
  { value: "books", label: "Books & Documents" }, { value: "food", label: "Food & Perishables" },
  { value: "medicine", label: "Medicine / Medical Supplies" }, { value: "jewelry", label: "Jewelry & Valuables" },
  { value: "industrial", label: "Industrial Parts" }, { value: "other", label: "Other" },
];

const ORIGIN_COUNTRIES = [
  { value: "AE", label: "UAE" }, { value: "SA", label: "Saudi Arabia" }, { value: "US", label: "United States" },
  { value: "GB", label: "United Kingdom" }, { value: "CN", label: "China" }, { value: "DE", label: "Germany" },
  { value: "IN", label: "India" }, { value: "TR", label: "Turkey" }, { value: "JP", label: "Japan" },
  { value: "FR", label: "France" }, { value: "IT", label: "Italy" }, { value: "other", label: "Other" },
];

const CUSTOMS_STATUS = [
  { value: "cleared", label: "Customs Cleared" }, { value: "pending", label: "Pending Inspection" },
  { value: "held", label: "Held for Review" }, { value: "exempt", label: "Duty Exempt" },
];

const genRef = () => `AMN-PST-${Math.floor(Math.random() * 9000) + 1000}`;

const PackageReceiptForm = ({ isAr, onCancel }: Props) => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [originCountry, setOriginCountry] = useState("");
  const [contentsCategory, setContentsCategory] = useState("");
  const [declaredValue, setDeclaredValue] = useState("");
  const [weight, setWeight] = useState("");
  const [customsRef, setCustomsRef] = useState("");
  const [customsStatus, setCustomsStatus] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientDoc, setRecipientDoc] = useState("");
  const [poBoxNumber, setPoBoxNumber] = useState("");
  const [receiptDate, setReceiptDate] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [refCode, setRefCode] = useState("");

  const isHighValue = parseFloat(declaredValue) > 500;
  const isRestrictedCategory = ["medicine", "jewelry", "industrial"].includes(contentsCategory);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setRefCode(genRef()); setConfirmed(true); }, 1500);
  };

  if (confirmed) return (
    <PstConfirmation refNumber={refCode} eventType={isAr ? "استلام طرد" : "Package Receipt"} eventCode="AMN-PST-PKG" color="#4ADE80" isAr={isAr} onReset={() => setConfirmed(false)} />
  );

  return (
    <div className="space-y-5">
      {(isHighValue || isRestrictedCategory) && (
        <div className="flex items-start gap-3 px-5 py-4 rounded-xl border" style={{ background: "rgba(251,146,60,0.06)", borderColor: "rgba(251,146,60,0.2)" }}>
          <i className="ri-alarm-warning-line text-orange-400 text-sm mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-orange-400 text-xs font-bold mb-0.5">{isAr ? "تنبيه AMEEN" : "AMEEN Alert"}</p>
            <p className="text-gray-400 text-xs">
              {isHighValue && (isAr ? "القيمة المُعلنة تتجاوز 500 LCY — يتطلب مراجعة جمركية. " : "Declared value exceeds 500 LCY — customs review required. ")}
              {isRestrictedCategory && (isAr ? "فئة المحتويات تتطلب تصريحاً خاصاً." : "Contents category requires special clearance.")}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Package Details */}
        <SectionCard title={isAr ? "تفاصيل الطرد" : "Package Details"} icon="ri-box-3-line" accentColor="#4ADE80">
          <div className="space-y-4">
            <FormField label={isAr ? "رقم التتبع" : "Tracking Number"} required>
              <TextInput placeholder="XXXXXXXXXXXXXXXX" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} className="font-['JetBrains_Mono']" />
            </FormField>
            <FormField label={isAr ? "بلد المنشأ" : "Origin Country"} required>
              <SelectInput options={ORIGIN_COUNTRIES} placeholder={isAr ? "اختر البلد" : "Select country"} value={originCountry} onChange={(e) => setOriginCountry(e.target.value)} />
            </FormField>
            <FormField label={isAr ? "فئة المحتويات" : "Contents Category"} required>
              <SelectInput options={CONTENT_CATEGORIES} placeholder={isAr ? "اختر الفئة" : "Select category"} value={contentsCategory} onChange={(e) => setContentsCategory(e.target.value)} />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "القيمة المُعلنة (LCY)" : "Declared Value (LCY)"} required>
                <div className="relative">
                  <TextInput type="number" placeholder="0.000" value={declaredValue} onChange={(e) => setDeclaredValue(e.target.value)} className="font-['JetBrains_Mono'] pr-12" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-['JetBrains_Mono']">LCY</span>
                </div>
              </FormField>
              <FormField label={isAr ? "الوزن (كجم)" : "Weight (kg)"} required>
                <TextInput type="number" placeholder="0.0" value={weight} onChange={(e) => setWeight(e.target.value)} className="font-['JetBrains_Mono']" />
              </FormField>
            </div>
            <FormField label={isAr ? "تاريخ الاستلام" : "Receipt Date"} required>
              <TextInput type="datetime-local" value={receiptDate} onChange={(e) => setReceiptDate(e.target.value)} />
            </FormField>
          </div>
        </SectionCard>

        {/* Customs & Recipient */}
        <div className="space-y-5">
          <SectionCard title={isAr ? "معلومات الجمارك" : "Customs Information"} icon="ri-shield-check-line">
            <div className="space-y-4">
              <FormField label={isAr ? "مرجع الجمارك" : "Customs Reference"}>
                <TextInput placeholder="CUS-XXXXXXXXXX" value={customsRef} onChange={(e) => setCustomsRef(e.target.value)} className="font-['JetBrains_Mono']" />
              </FormField>
              <FormField label={isAr ? "حالة التخليص الجمركي" : "Customs Status"} required>
                <SelectInput options={CUSTOMS_STATUS} placeholder={isAr ? "اختر الحالة" : "Select status"} value={customsStatus} onChange={(e) => setCustomsStatus(e.target.value)} />
              </FormField>
              <div className="flex items-start gap-3 px-3 py-3 rounded-lg" style={{ background: "rgba(34,211,238,0.04)", border: "1px solid rgba(34,211,238,0.12)" }}>
                <i className="ri-information-line text-cyan-400 text-sm mt-0.5 flex-shrink-0" />
                <p className="text-gray-400 text-xs">{isAr ? "AMEEN يربط بيانات الطرد بسجلات الجمارك والمستلم تلقائياً." : "AMEEN auto-links package data with customs records and recipient profile."}</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title={isAr ? "بيانات المستلم" : "Recipient Details"} icon="ri-user-received-line">
            <div className="space-y-4">
              <FormField label={isAr ? "اسم المستلم" : "Recipient Name"} required>
                <TextInput placeholder={isAr ? "الاسم الكامل" : "Full name"} value={recipientName} onChange={(e) => setRecipientName(e.target.value)} />
              </FormField>
              <FormField label={isAr ? "رقم وثيقة المستلم" : "Recipient Document No."}>
                <TextInput placeholder="XXXXXXXXX" value={recipientDoc} onChange={(e) => setRecipientDoc(e.target.value)} className="font-['JetBrains_Mono']" />
              </FormField>
              <FormField label={isAr ? "رقم صندوق البريد" : "PO Box Number"}>
                <TextInput placeholder="PO-XXXXX" value={poBoxNumber} onChange={(e) => setPoBoxNumber(e.target.value)} className="font-['JetBrains_Mono']" />
              </FormField>
              <FormField label={isAr ? "ملاحظات" : "Notes"}>
                <textarea
                  rows={2}
                  maxLength={500}
                  placeholder={isAr ? "ملاحظات إضافية..." : "Additional notes..."}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm text-white placeholder-gray-600 outline-none resize-none"
                  style={{ background: "#0F1923", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "Inter" }}
                  onFocus={(e) => { e.target.style.borderColor = "#22D3EE"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
                />
                <p className="text-gray-600 text-xs mt-1 text-right">{notes.length}/500</p>
              </FormField>
            </div>
          </SectionCard>
        </div>
      </div>
      <FormActions onCancel={onCancel} onSave={handleSave} saveLabel={isAr ? "تسجيل استلام الطرد" : "Record Package Receipt"} isAr={isAr} saving={saving} />
    </div>
  );
};

export default PackageReceiptForm;
