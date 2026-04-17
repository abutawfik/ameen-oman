import { useState } from "react";
import {
  FormField, TextInput, SelectInput, SectionCard, TipBanner, FormActions, RadioGroup,
  COUNTRIES,
} from "@/pages/dashboard/hotel-events/components/FormComponents";
import EcomConfirmation from "./EcomConfirmation";

interface Props { isAr: boolean; onCancel: () => void; }

const ITEM_CATEGORIES = [
  { value: "electronics", label: "Electronics (Laptops, Phones, Tablets)" },
  { value: "sim_devices", label: "SIM-Enabled Devices" },
  { value: "prepaid_cards", label: "Prepaid Payment / Gift Cards" },
  { value: "chemicals", label: "Chemicals / Precursors" },
  { value: "drones", label: "Drones / UAVs" },
  { value: "surveillance", label: "Surveillance Equipment" },
  { value: "communication", label: "Communication Devices" },
  { value: "other_monitored", label: "Other Monitored Items" },
];

const PAYMENT_METHODS = [
  { value: "cash", label: "Cash" },
  { value: "credit_card", label: "Credit Card" },
  { value: "debit_card", label: "Debit Card" },
  { value: "multiple_cards", label: "Multiple Cards" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "online", label: "Online Payment" },
  { value: "crypto", label: "Cryptocurrency / Voucher" },
];

const RETAILER_TYPES = [
  { value: "hypermarket", label: "Hypermarket / Supermarket" },
  { value: "electronics_store", label: "Electronics Store" },
  { value: "online_platform", label: "Online Platform" },
  { value: "agricultural_supply", label: "Agricultural Supply" },
  { value: "pharmacy", label: "Pharmacy" },
  { value: "general_trade", label: "General Trade" },
  { value: "other", label: "Other" },
];

const BulkPurchaseAlertForm = ({ isAr, onCancel }: Props) => {
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  // Buyer identity
  const [docType, setDocType] = useState("passport");
  const [docNumber, setDocNumber] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [nationality, setNationality] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [identityVerified, setIdentityVerified] = useState("yes");

  // Purchase details
  const [itemCategory, setItemCategory] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardLast4, setCardLast4] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [purchaseTime, setPurchaseTime] = useState("");

  // Retailer
  const [retailerName, setRetailerName] = useState("");
  const [retailerType, setRetailerType] = useState("");
  const [retailerBranch, setRetailerBranch] = useState("");
  const [retailerRef, setRetailerRef] = useState("");

  // Flags
  const [flagReason, setFlagReason] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setSubmitted(true); }, 1200);
  };

  if (submitted) {
    return (
      <EcomConfirmation
        isAr={isAr}
        eventType="Bulk Purchase Alert"
        eventTypeAr="تنبيه شراء بالجملة"
        color="#FACC15"
        icon="ri-stack-line"
        onReset={() => setSubmitted(false)}
      />
    );
  }

  return (
    <div className="space-y-5">
      <TipBanner
        text={isAr
          ? "يُبلَّغ عن هذا الحدث عند شراء كميات غير معتادة من العناصر المراقبة تتجاوز الحد المُهيَّأ. ليس كل عملية شراء — فقط المحفزات المحددة."
          : "This event is reported when unusual quantities of monitored items exceed the configured threshold. Not every purchase — only specific triggers."}
        color="amber"
      />

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
                { value: "unknown", label: "Unknown / Unverified" },
              ]}
            />
          </FormField>
          <FormField label={isAr ? "رقم الوثيقة" : "Document Number"} required>
            <TextInput
              value={docNumber}
              onChange={(e) => setDocNumber(e.target.value)}
              placeholder="e.g. IR-3312-F"
            />
          </FormField>
          <FormField label={isAr ? "اسم المشتري" : "Buyer Name"}>
            <TextInput
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              placeholder={isAr ? "الاسم الكامل" : "Full name if known"}
            />
          </FormField>
          <FormField label={isAr ? "الجنسية" : "Nationality"} required>
            <SelectInput
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              options={COUNTRIES}
              placeholder={isAr ? "اختر الجنسية" : "Select nationality"}
            />
          </FormField>
          <FormField label={isAr ? "رقم الهاتف" : "Phone Number"}>
            <TextInput
              value={buyerPhone}
              onChange={(e) => setBuyerPhone(e.target.value)}
              placeholder="+968 9XXX XXXX"
            />
          </FormField>
          <FormField label={isAr ? "تم التحقق من الهوية؟" : "Identity Verified?"} required>
            <RadioGroup
              name="identity_verified"
              value={identityVerified}
              onChange={setIdentityVerified}
              options={[
                { value: "yes", label: isAr ? "نعم" : "Yes" },
                { value: "no", label: isAr ? "لا" : "No" },
                { value: "partial", label: isAr ? "جزئياً" : "Partial" },
              ]}
            />
          </FormField>
        </div>
      </SectionCard>

      {/* Purchase Details */}
      <SectionCard title={isAr ? "تفاصيل الشراء" : "Purchase Details"} icon="ri-stack-line" accentColor="#FACC15">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label={isAr ? "فئة العنصر" : "Item Category"} required>
            <SelectInput
              value={itemCategory}
              onChange={(e) => setItemCategory(e.target.value)}
              options={ITEM_CATEGORIES}
              placeholder={isAr ? "اختر الفئة" : "Select category"}
            />
          </FormField>
          <FormField label={isAr ? "وصف العنصر" : "Item Description"} required>
            <TextInput
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              placeholder={isAr ? "مثال: آيفون 15 برو" : "e.g. iPhone 15 Pro, Ammonium Nitrate"}
            />
          </FormField>
          <FormField label={isAr ? "الكمية" : "Quantity"} required>
            <TextInput
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
              min="1"
            />
          </FormField>
          <FormField label={isAr ? "سعر الوحدة (LCY)" : "Unit Price (LCY)"}>
            <TextInput
              type="number"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              placeholder="0.000"
              step="0.001"
            />
          </FormField>
          <FormField label={isAr ? "المبلغ الإجمالي (LCY)" : "Total Amount (LCY)"} required>
            <TextInput
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              placeholder="0.000"
              step="0.001"
            />
          </FormField>
          <FormField label={isAr ? "طريقة الدفع" : "Payment Method"} required>
            <SelectInput
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              options={PAYMENT_METHODS}
              placeholder={isAr ? "اختر طريقة الدفع" : "Select payment method"}
            />
          </FormField>
          {(paymentMethod === "credit_card" || paymentMethod === "debit_card") && (
            <FormField label={isAr ? "آخر 4 أرقام من البطاقة" : "Card Last 4 Digits"}>
              <TextInput
                value={cardLast4}
                onChange={(e) => setCardLast4(e.target.value)}
                placeholder="XXXX"
                maxLength={4}
              />
            </FormField>
          )}
          <FormField label={isAr ? "تاريخ الشراء" : "Purchase Date"} required>
            <TextInput
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
            />
          </FormField>
          <FormField label={isAr ? "وقت الشراء" : "Purchase Time"}>
            <TextInput
              type="time"
              value={purchaseTime}
              onChange={(e) => setPurchaseTime(e.target.value)}
            />
          </FormField>
        </div>

        {/* Quantity alert */}
        {quantity && parseInt(quantity) >= 5 && (
          <div className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl border" style={{ background: "rgba(250,204,21,0.06)", borderColor: "rgba(250,204,21,0.25)" }}>
            <i className="ri-alarm-warning-line text-yellow-400" />
            <p className="text-yellow-400 text-sm font-['Inter']">
              {isAr
                ? `الكمية ${quantity} وحدة — تتجاوز حد الإبلاغ. سيتم تصنيف هذا الحدث تلقائياً.`
                : `Quantity ${quantity} units — exceeds reporting threshold. This event will be auto-classified.`}
            </p>
          </div>
        )}
      </SectionCard>

      {/* Retailer Info */}
      <SectionCard title={isAr ? "معلومات التاجر" : "Retailer Information"} icon="ri-store-line">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label={isAr ? "اسم التاجر" : "Retailer Name"} required>
            <TextInput
              value={retailerName}
              onChange={(e) => setRetailerName(e.target.value)}
              placeholder={isAr ? "اسم المتجر أو المنصة" : "Store or platform name"}
            />
          </FormField>
          <FormField label={isAr ? "نوع التاجر" : "Retailer Type"} required>
            <SelectInput
              value={retailerType}
              onChange={(e) => setRetailerType(e.target.value)}
              options={RETAILER_TYPES}
              placeholder={isAr ? "اختر النوع" : "Select type"}
            />
          </FormField>
          <FormField label={isAr ? "الفرع / الموقع" : "Branch / Location"}>
            <TextInput
              value={retailerBranch}
              onChange={(e) => setRetailerBranch(e.target.value)}
              placeholder={isAr ? "مثال: فرع مسقط سيتي سنتر" : "e.g. Muscat City Centre Branch"}
            />
          </FormField>
          <FormField label={isAr ? "رقم مرجع التاجر" : "Retailer Reference Number"}>
            <TextInput
              value={retailerRef}
              onChange={(e) => setRetailerRef(e.target.value)}
              placeholder={isAr ? "رقم الفاتورة أو المعاملة" : "Invoice or transaction number"}
            />
          </FormField>
        </div>
      </SectionCard>

      {/* Flag Details */}
      <SectionCard title={isAr ? "تفاصيل التنبيه" : "Flag Details"} icon="ri-flag-line" accentColor="#F87171">
        <div className="space-y-4">
          <FormField label={isAr ? "سبب التنبيه" : "Flag Reason"} required>
            <SelectInput
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              options={[
                { value: "quantity_threshold", label: "Quantity exceeds threshold" },
                { value: "restricted_item", label: "Item on restricted/monitored list" },
                { value: "cash_bulk", label: "Bulk cash purchase — no identity" },
                { value: "unusual_buyer", label: "Buyer profile inconsistent with purchase" },
                { value: "repeat_purchase", label: "Repeat bulk purchase — same person" },
                { value: "other", label: "Other" },
              ]}
              placeholder={isAr ? "اختر السبب" : "Select reason"}
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
        saveLabel={isAr ? "إرسال تنبيه الشراء" : "Submit Bulk Purchase Alert"}
        disabled={!docNumber || !itemCategory || !quantity || !totalAmount || !paymentMethod || !purchaseDate || !retailerName || !flagReason}
      />
    </div>
  );
};

export default BulkPurchaseAlertForm;
