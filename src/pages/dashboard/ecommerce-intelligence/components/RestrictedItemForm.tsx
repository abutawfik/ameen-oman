import { useState } from "react";
import {
  FormField, TextInput, SelectInput, SectionCard, TipBanner, FormActions, RadioGroup,
  COUNTRIES,
} from "@/pages/dashboard/hotel-events/components/FormComponents";
import EcomConfirmation from "./EcomConfirmation";

interface Props { isAr: boolean; onCancel: () => void; }

const RESTRICTED_CATEGORIES = [
  { value: "surveillance_equipment", label: "Surveillance Equipment (Hidden cameras, IMSI catchers)" },
  { value: "signal_jammer", label: "Signal Jammer / Frequency Blocker" },
  { value: "satellite_phone", label: "Satellite Phone (Unlicensed)" },
  { value: "encrypted_radio", label: "Encrypted Radio / Communication Device" },
  { value: "drone_commercial", label: "Commercial Drone / UAV (Payload-capable)" },
  { value: "chemical_precursor", label: "Chemical Precursor / Monitored Compound" },
  { value: "explosive_material", label: "Explosive Material / Detonator" },
  { value: "tracking_device", label: "GPS Tracker / Covert Tracking Device" },
  { value: "night_vision", label: "Night Vision / Thermal Imaging Equipment" },
  { value: "other_restricted", label: "Other Restricted Item" },
];

const PAYMENT_METHODS = [
  { value: "cash", label: "Cash" },
  { value: "credit_card", label: "Credit Card" },
  { value: "debit_card", label: "Debit Card" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "online", label: "Online Payment" },
  { value: "crypto", label: "Cryptocurrency" },
];

const RestrictedItemForm = ({ isAr, onCancel }: Props) => {
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  // Buyer
  const [docType, setDocType] = useState("passport");
  const [docNumber, setDocNumber] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [nationality, setNationality] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [visaType, setVisaType] = useState("");

  // Item
  const [restrictedCategory, setRestrictedCategory] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemModel, setItemModel] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [purchaseTime, setPurchaseTime] = useState("");

  // License check
  const [hasLicense, setHasLicense] = useState("no");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseAuthority, setLicenseAuthority] = useState("");

  // Retailer
  const [retailerName, setRetailerName] = useState("");
  const [retailerType, setRetailerType] = useState("online_platform");
  const [retailerLocation, setRetailerLocation] = useState("");

  // Intelligence
  const [immediateRisk, setImmediateRisk] = useState("medium");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setSubmitted(true); }, 1200);
  };

  if (submitted) {
    return (
      <EcomConfirmation
        isAr={isAr}
        eventType="Restricted Item Purchase"
        eventTypeAr="شراء عنصر مقيّد"
        color="#F87171"
        icon="ri-forbid-line"
        onReset={() => setSubmitted(false)}
      />
    );
  }

  return (
    <div className="space-y-5">
      <TipBanner
        text={isAr
          ? "العناصر المقيّدة تُبلَّغ عنها بغض النظر عن الكمية. أي شراء من القائمة المراقبة يُولِّد تنبيهاً فورياً."
          : "Restricted items are reported regardless of quantity. Any purchase from the monitored list generates an immediate alert."}
        color="amber"
      />

      {/* Critical alert */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl border" style={{ background: "rgba(248,113,113,0.06)", borderColor: "rgba(248,113,113,0.3)" }}>
        <i className="ri-alarm-warning-line text-red-400 text-lg" />
        <div>
          <p className="text-red-400 text-sm font-bold font-['Inter']">
            {isAr ? "تنبيه فوري — عنصر مقيّد" : "Immediate Alert — Restricted Item"}
          </p>
          <p className="text-red-400/70 text-xs font-['Inter']">
            {isAr ? "سيتم إرسال هذا الحدث فوراً إلى فريق الاستخبارات للمراجعة" : "This event will be immediately escalated to the intelligence team for review"}
          </p>
        </div>
      </div>

      {/* Buyer Identity */}
      <SectionCard title={isAr ? "هوية المشتري" : "Buyer Identity"} icon="ri-user-line">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label={isAr ? "نوع الوثيقة" : "Document Type"} required>
            <SelectInput
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              options={[
                { value: "passport", label: "Passport" },
                { value: "national_id", label: "National ID" },
                { value: "resident_card", label: "Resident Card" },
                { value: "unknown", label: "Unknown / Refused to provide" },
              ]}
            />
          </FormField>
          <FormField label={isAr ? "رقم الوثيقة" : "Document Number"} required>
            <TextInput value={docNumber} onChange={(e) => setDocNumber(e.target.value)} placeholder="e.g. IR-3312-F" />
          </FormField>
          <FormField label={isAr ? "الاسم الكامل" : "Full Name"}>
            <TextInput value={buyerName} onChange={(e) => setBuyerName(e.target.value)} placeholder={isAr ? "الاسم إن كان معروفاً" : "Name if known"} />
          </FormField>
          <FormField label={isAr ? "الجنسية" : "Nationality"} required>
            <SelectInput value={nationality} onChange={(e) => setNationality(e.target.value)} options={COUNTRIES} placeholder={isAr ? "اختر الجنسية" : "Select nationality"} />
          </FormField>
          <FormField label={isAr ? "رقم الهاتف" : "Phone Number"}>
            <TextInput value={buyerPhone} onChange={(e) => setBuyerPhone(e.target.value)} placeholder="+968 9XXX XXXX" />
          </FormField>
          <FormField label={isAr ? "نوع التأشيرة" : "Visa Type"}>
            <SelectInput
              value={visaType}
              onChange={(e) => setVisaType(e.target.value)}
              options={[
                { value: "citizen", label: "Citizen" },
                { value: "resident", label: "Resident" },
                { value: "tourist", label: "Tourist" },
                { value: "work", label: "Work Visa" },
                { value: "student", label: "Student Visa" },
                { value: "unknown", label: "Unknown" },
              ]}
              placeholder={isAr ? "اختر نوع التأشيرة" : "Select visa type"}
            />
          </FormField>
        </div>
      </SectionCard>

      {/* Restricted Item Details */}
      <SectionCard title={isAr ? "تفاصيل العنصر المقيّد" : "Restricted Item Details"} icon="ri-forbid-line" accentColor="#F87171">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label={isAr ? "فئة العنصر المقيّد" : "Restricted Item Category"} required>
            <SelectInput value={restrictedCategory} onChange={(e) => setRestrictedCategory(e.target.value)} options={RESTRICTED_CATEGORIES} placeholder={isAr ? "اختر الفئة" : "Select category"} />
          </FormField>
          <FormField label={isAr ? "وصف العنصر" : "Item Description"} required>
            <TextInput value={itemDescription} onChange={(e) => setItemDescription(e.target.value)} placeholder={isAr ? "وصف تفصيلي" : "Detailed description"} />
          </FormField>
          <FormField label={isAr ? "الطراز / الموديل" : "Model / Make"}>
            <TextInput value={itemModel} onChange={(e) => setItemModel(e.target.value)} placeholder={isAr ? "مثال: SJ-Pro 4G" : "e.g. SJ-Pro 4G, DJI Matrice 300"} />
          </FormField>
          <FormField label={isAr ? "الكمية" : "Quantity"} required>
            <TextInput type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="1" min="1" />
          </FormField>
          <FormField label={isAr ? "المبلغ (LCY)" : "Amount (LCY)"}>
            <TextInput type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.000" step="0.001" />
          </FormField>
          <FormField label={isAr ? "طريقة الدفع" : "Payment Method"} required>
            <SelectInput value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} options={PAYMENT_METHODS} placeholder={isAr ? "اختر طريقة الدفع" : "Select payment method"} />
          </FormField>
          <FormField label={isAr ? "تاريخ الشراء" : "Purchase Date"} required>
            <TextInput type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />
          </FormField>
          <FormField label={isAr ? "وقت الشراء" : "Purchase Time"}>
            <TextInput type="time" value={purchaseTime} onChange={(e) => setPurchaseTime(e.target.value)} />
          </FormField>
        </div>
      </SectionCard>

      {/* License Check */}
      <SectionCard title={isAr ? "التحقق من الترخيص" : "License Verification"} icon="ri-shield-check-line" accentColor="#4ADE80">
        <div className="space-y-4">
          <FormField label={isAr ? "هل يمتلك المشتري ترخيصاً مناسباً؟" : "Does buyer hold appropriate license?"} required>
            <RadioGroup
              name="has_license"
              value={hasLicense}
              onChange={setHasLicense}
              options={[
                { value: "yes", label: isAr ? "نعم — مرخَّص" : "Yes — Licensed" },
                { value: "no", label: isAr ? "لا — غير مرخَّص" : "No — Unlicensed" },
                { value: "unknown", label: isAr ? "غير معروف" : "Unknown" },
              ]}
            />
          </FormField>
          {hasLicense === "yes" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label={isAr ? "رقم الترخيص" : "License Number"}>
                <TextInput value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} placeholder="LIC-XXXXXXXX" />
              </FormField>
              <FormField label={isAr ? "الجهة المُصدِرة" : "Issuing Authority"}>
                <TextInput value={licenseAuthority} onChange={(e) => setLicenseAuthority(e.target.value)} placeholder={isAr ? "اسم الجهة" : "Authority name"} />
              </FormField>
            </div>
          )}
          {hasLicense === "no" && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border" style={{ background: "rgba(248,113,113,0.06)", borderColor: "rgba(248,113,113,0.25)" }}>
              <i className="ri-close-circle-line text-red-400" />
              <p className="text-red-400 text-sm font-['Inter']">
                {isAr ? "شراء بدون ترخيص — سيتم تصعيد هذا الحدث تلقائياً" : "Unlicensed purchase — this event will be automatically escalated"}
              </p>
            </div>
          )}
        </div>
      </SectionCard>

      {/* Retailer */}
      <SectionCard title={isAr ? "معلومات التاجر" : "Retailer Information"} icon="ri-store-line">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label={isAr ? "اسم التاجر" : "Retailer Name"} required>
            <TextInput value={retailerName} onChange={(e) => setRetailerName(e.target.value)} placeholder={isAr ? "اسم المتجر أو المنصة" : "Store or platform name"} />
          </FormField>
          <FormField label={isAr ? "نوع التاجر" : "Retailer Type"}>
            <SelectInput
              value={retailerType}
              onChange={(e) => setRetailerType(e.target.value)}
              options={[
                { value: "physical_store", label: "Physical Store" },
                { value: "online_platform", label: "Online Platform" },
                { value: "import_agent", label: "Import Agent" },
                { value: "other", label: "Other" },
              ]}
            />
          </FormField>
          <FormField label={isAr ? "الموقع" : "Location"}>
            <TextInput value={retailerLocation} onChange={(e) => setRetailerLocation(e.target.value)} placeholder={isAr ? "المدينة أو المنطقة" : "City or region"} />
          </FormField>
        </div>
      </SectionCard>

      {/* Risk Assessment */}
      <SectionCard title={isAr ? "تقييم المخاطر الفوري" : "Immediate Risk Assessment"} icon="ri-alarm-warning-line" accentColor="#F87171">
        <div className="space-y-4">
          <FormField label={isAr ? "مستوى الخطر الفوري" : "Immediate Risk Level"} required>
            <RadioGroup
              name="immediate_risk"
              value={immediateRisk}
              onChange={setImmediateRisk}
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
              onFocus={(e) => { e.target.style.borderColor = "#22D3EE"; }}
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
        saveLabel={isAr ? "إرسال تنبيه العنصر المقيّد" : "Submit Restricted Item Alert"}
        disabled={!docNumber || !restrictedCategory || !itemDescription || !paymentMethod || !purchaseDate || !retailerName}
      />
    </div>
  );
};

export default RestrictedItemForm;
