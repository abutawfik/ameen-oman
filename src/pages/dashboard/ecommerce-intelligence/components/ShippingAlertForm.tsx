import { useState } from "react";
import {
  FormField, TextInput, SelectInput, SectionCard, TipBanner, FormActions, RadioGroup,
  COUNTRIES,
} from "@/pages/dashboard/hotel-events/components/FormComponents";
import EcomConfirmation from "./EcomConfirmation";

interface Props { isAr: boolean; onCancel: () => void; }

const HIGH_RISK_ORIGINS = [
  { value: "AF", label: "Afghanistan" },
  { value: "IR", label: "Iran" },
  { value: "KP", label: "North Korea" },
  { value: "SY", label: "Syria" },
  { value: "YE", label: "Yemen" },
  { value: "LY", label: "Libya" },
  { value: "SO", label: "Somalia" },
  { value: "SD", label: "Sudan" },
  { value: "MM", label: "Myanmar" },
  { value: "other", label: "Other High-Risk Origin" },
];

const SHIPMENT_TYPES = [
  { value: "parcel", label: "Parcel / Package" },
  { value: "freight", label: "Freight / Cargo" },
  { value: "express", label: "Express Courier" },
  { value: "postal", label: "Postal Mail" },
  { value: "container", label: "Container Shipment" },
];

const ShippingAlertForm = ({ isAr, onCancel }: Props) => {
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  // Recipient
  const [docType, setDocType] = useState("passport");
  const [docNumber, setDocNumber] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [nationality, setNationality] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");

  // Shipment
  const [shipmentType, setShipmentType] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [originCountry, setOriginCountry] = useState("");
  const [isHighRiskOrigin, setIsHighRiskOrigin] = useState(false);
  const [carrier, setCarrier] = useState("");
  const [declaredContents, setDeclaredContents] = useState("");
  const [actualContents, setActualContents] = useState("");
  const [declaredValue, setDeclaredValue] = useState("");
  const [actualValue, setActualValue] = useState("");
  const [weight, setWeight] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [portOfEntry, setPortOfEntry] = useState("");

  // Flags
  const [contentsMismatch, setContentsMismatch] = useState("no");
  const [valueMismatch, setValueMismatch] = useState("no");
  const [flagReason, setFlagReason] = useState("");
  const [riskLevel, setRiskLevel] = useState("medium");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setSubmitted(true); }, 1200);
  };

  if (submitted) {
    return (
      <EcomConfirmation
        isAr={isAr}
        eventType="Shipping Alert"
        eventTypeAr="تنبيه شحن"
        color="#A78BFA"
        icon="ri-ship-line"
        onReset={() => setSubmitted(false)}
      />
    );
  }

  return (
    <div className="space-y-5">
      <TipBanner
        text={isAr
          ? "يُبلَّغ عن هذا الحدث للشحنات الدولية من مصادر عالية المخاطر أو عند وجود تناقض بين إعلان المحتويات والمحتويات الفعلية."
          : "This event is reported for international shipments from high-risk origins or when there is a mismatch between declared and actual contents."}
        color="amber"
      />

      {/* Recipient Identity */}
      <SectionCard title={isAr ? "هوية المستلم" : "Recipient Identity"} icon="ri-user-received-line">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label={isAr ? "نوع الوثيقة" : "Document Type"} required>
            <SelectInput
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              options={[
                { value: "passport", label: "Passport" },
                { value: "national_id", label: "National ID" },
                { value: "resident_card", label: "Resident Card" },
                { value: "po_box", label: "PO Box Only" },
              ]}
            />
          </FormField>
          <FormField label={isAr ? "رقم الوثيقة" : "Document Number"} required>
            <TextInput value={docNumber} onChange={(e) => setDocNumber(e.target.value)} placeholder="e.g. IR-3312-F" />
          </FormField>
          <FormField label={isAr ? "اسم المستلم" : "Recipient Name"} required>
            <TextInput value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder={isAr ? "الاسم الكامل" : "Full name"} />
          </FormField>
          <FormField label={isAr ? "الجنسية" : "Nationality"} required>
            <SelectInput value={nationality} onChange={(e) => setNationality(e.target.value)} options={COUNTRIES} placeholder={isAr ? "اختر الجنسية" : "Select nationality"} />
          </FormField>
          <FormField label={isAr ? "رقم الهاتف" : "Phone Number"}>
            <TextInput value={recipientPhone} onChange={(e) => setRecipientPhone(e.target.value)} placeholder="+968 9XXX XXXX" />
          </FormField>
          <FormField label={isAr ? "عنوان التسليم" : "Delivery Address"} required>
            <TextInput value={recipientAddress} onChange={(e) => setRecipientAddress(e.target.value)} placeholder={isAr ? "العنوان الكامل" : "Full delivery address"} />
          </FormField>
        </div>
      </SectionCard>

      {/* Shipment Details */}
      <SectionCard title={isAr ? "تفاصيل الشحنة" : "Shipment Details"} icon="ri-ship-line" accentColor="#A78BFA">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label={isAr ? "نوع الشحنة" : "Shipment Type"} required>
            <SelectInput value={shipmentType} onChange={(e) => setShipmentType(e.target.value)} options={SHIPMENT_TYPES} placeholder={isAr ? "اختر النوع" : "Select type"} />
          </FormField>
          <FormField label={isAr ? "رقم التتبع" : "Tracking Number"} required>
            <TextInput value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="e.g. 1Z999AA10123456784" />
          </FormField>
          <FormField label={isAr ? "بلد المنشأ" : "Origin Country"} required>
            <SelectInput
              value={originCountry}
              onChange={(e) => {
                setOriginCountry(e.target.value);
                setIsHighRiskOrigin(HIGH_RISK_ORIGINS.some((h) => h.value === e.target.value));
              }}
              options={COUNTRIES}
              placeholder={isAr ? "اختر بلد المنشأ" : "Select origin country"}
            />
          </FormField>
          <FormField label={isAr ? "شركة الشحن" : "Carrier / Courier"} required>
            <TextInput value={carrier} onChange={(e) => setCarrier(e.target.value)} placeholder="e.g. DHL, FedEx, AliExpress" />
          </FormField>
          <FormField label={isAr ? "الوزن (كجم)" : "Weight (kg)"}>
            <TextInput type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="0.0" step="0.1" />
          </FormField>
          <FormField label={isAr ? "تاريخ الوصول" : "Arrival Date"} required>
            <TextInput type="date" value={arrivalDate} onChange={(e) => setArrivalDate(e.target.value)} />
          </FormField>
          <FormField label={isAr ? "منفذ الدخول" : "Port of Entry"}>
            <SelectInput
              value={portOfEntry}
              onChange={(e) => setPortOfEntry(e.target.value)}
              options={[
                { value: "muscat_airport", label: "Muscat International Airport" },
                { value: "salalah_port", label: "Salalah Port" },
                { value: "muscat_port", label: "Muscat Port" },
                { value: "sohar_port", label: "Sohar Port" },
                { value: "buraimi_land", label: "Buraimi Land Border" },
                { value: "other", label: "Other" },
              ]}
              placeholder={isAr ? "اختر منفذ الدخول" : "Select port of entry"}
            />
          </FormField>
        </div>

        {/* High-risk origin alert */}
        {isHighRiskOrigin && (
          <div className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl border" style={{ background: "rgba(248,113,113,0.06)", borderColor: "rgba(248,113,113,0.3)" }}>
            <i className="ri-alarm-warning-line text-red-400" />
            <p className="text-red-400 text-sm font-['Inter']">
              {isAr ? "بلد المنشأ مُصنَّف عالي المخاطر — سيتم تصعيد هذا الحدث تلقائياً" : "Origin country is classified high-risk — this event will be automatically escalated"}
            </p>
          </div>
        )}
      </SectionCard>

      {/* Contents Declaration */}
      <SectionCard title={isAr ? "إعلان المحتويات" : "Contents Declaration"} icon="ri-file-list-3-line" accentColor="#FACC15">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label={isAr ? "المحتويات المُعلَنة" : "Declared Contents"} required>
            <TextInput value={declaredContents} onChange={(e) => setDeclaredContents(e.target.value)} placeholder={isAr ? "ما هو مُعلَن على الشحنة" : "What is declared on the shipment"} />
          </FormField>
          <FormField label={isAr ? "المحتويات الفعلية" : "Actual Contents"}>
            <TextInput value={actualContents} onChange={(e) => setActualContents(e.target.value)} placeholder={isAr ? "ما تم فحصه فعلياً" : "What was actually inspected"} />
          </FormField>
          <FormField label={isAr ? "القيمة المُعلَنة (LCY)" : "Declared Value (LCY)"}>
            <TextInput type="number" value={declaredValue} onChange={(e) => setDeclaredValue(e.target.value)} placeholder="0.000" step="0.001" />
          </FormField>
          <FormField label={isAr ? "القيمة الفعلية المُقدَّرة (LCY)" : "Estimated Actual Value (LCY)"}>
            <TextInput type="number" value={actualValue} onChange={(e) => setActualValue(e.target.value)} placeholder="0.000" step="0.001" />
          </FormField>
          <FormField label={isAr ? "تناقض في المحتويات؟" : "Contents Mismatch?"} required>
            <RadioGroup
              name="contents_mismatch"
              value={contentsMismatch}
              onChange={setContentsMismatch}
              options={[
                { value: "yes", label: isAr ? "نعم" : "Yes" },
                { value: "no", label: isAr ? "لا" : "No" },
                { value: "partial", label: isAr ? "جزئي" : "Partial" },
              ]}
            />
          </FormField>
          <FormField label={isAr ? "تناقض في القيمة؟" : "Value Mismatch?"} required>
            <RadioGroup
              name="value_mismatch"
              value={valueMismatch}
              onChange={setValueMismatch}
              options={[
                { value: "yes", label: isAr ? "نعم" : "Yes" },
                { value: "no", label: isAr ? "لا" : "No" },
                { value: "unknown", label: isAr ? "غير معروف" : "Unknown" },
              ]}
            />
          </FormField>
        </div>
      </SectionCard>

      {/* Flag & Risk */}
      <SectionCard title={isAr ? "تفاصيل التنبيه" : "Flag Details"} icon="ri-flag-line" accentColor="#F87171">
        <div className="space-y-4">
          <FormField label={isAr ? "سبب التنبيه" : "Flag Reason"} required>
            <SelectInput
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              options={[
                { value: "high_risk_origin", label: "High-risk origin country" },
                { value: "contents_mismatch", label: "Contents declaration mismatch" },
                { value: "value_mismatch", label: "Value significantly understated" },
                { value: "restricted_items", label: "Restricted items detected" },
                { value: "frequent_shipments", label: "Unusually frequent shipments" },
                { value: "no_business_purpose", label: "No legitimate business purpose" },
                { value: "other", label: "Other" },
              ]}
              placeholder={isAr ? "اختر السبب" : "Select reason"}
            />
          </FormField>
          <FormField label={isAr ? "مستوى الخطر" : "Risk Level"} required>
            <RadioGroup
              name="risk_level"
              value={riskLevel}
              onChange={setRiskLevel}
              options={[
                { value: "low", label: isAr ? "منخفض" : "Low" },
                { value: "medium", label: isAr ? "متوسط" : "Medium" },
                { value: "high", label: isAr ? "عالٍ" : "High" },
                { value: "critical", label: isAr ? "حرج" : "Critical" },
              ]}
            />
          </FormField>
          <FormField label={isAr ? "ملاحظات إضافية" : "Additional Notes"}>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder={isAr ? "أي معلومات إضافية ذات صلة..." : "Any additional relevant information..."}
              className="w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-gray-600 outline-none transition-all resize-none font-['Inter']"
              style={{ background: "#0F1923", border: "1px solid rgba(255,255,255,0.08)" }}
              onFocus={(e) => { e.target.style.borderColor = "#D4A84B"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
            />
            <p className="text-gray-600 text-xs mt-1 text-right font-['JetBrains_Mono']">{additionalNotes.length}/500</p>
          </FormField>
        </div>
      </SectionCard>

      <FormActions
        isAr={isAr}
        onCancel={onCancel}
        onSave={handleSave}
        saving={saving}
        saveLabel={isAr ? "إرسال تنبيه الشحن" : "Submit Shipping Alert"}
        disabled={!docNumber || !recipientName || !trackingNumber || !originCountry || !carrier || !arrivalDate || !declaredContents || !flagReason}
      />
    </div>
  );
};

export default ShippingAlertForm;
