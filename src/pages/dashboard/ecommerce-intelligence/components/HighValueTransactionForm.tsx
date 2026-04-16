import { useState } from "react";
import {
  FormField, TextInput, SelectInput, SectionCard, TipBanner, FormActions, RadioGroup,
  COUNTRIES,
} from "@/pages/dashboard/hotel-events/components/FormComponents";
import EcomConfirmation from "./EcomConfirmation";

interface Props { isAr: boolean; onCancel: () => void; }

const ITEM_CATEGORIES = [
  { value: "jewelry", label: "Jewelry / Gold / Precious Metals" },
  { value: "electronics", label: "Electronics" },
  { value: "vehicles", label: "Vehicles / Automotive" },
  { value: "real_estate", label: "Real Estate Related" },
  { value: "art", label: "Art / Antiques / Collectibles" },
  { value: "luxury_goods", label: "Luxury Goods / Designer Items" },
  { value: "industrial", label: "Industrial Equipment" },
  { value: "other", label: "Other High-Value Item" },
];

const PAYMENT_METHODS = [
  { value: "cash", label: "Cash" },
  { value: "credit_card", label: "Credit Card" },
  { value: "debit_card", label: "Debit Card" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "crypto", label: "Cryptocurrency" },
  { value: "cheque", label: "Cheque" },
  { value: "multiple", label: "Multiple Methods" },
];

const HighValueTransactionForm = ({ isAr, onCancel }: Props) => {
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  // Buyer
  const [docType, setDocType] = useState("passport");
  const [docNumber, setDocNumber] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [nationality, setNationality] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");

  // Transaction
  const [itemCategory, setItemCategory] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [currency, setCurrency] = useState("LCY");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [transactionTime, setTransactionTime] = useState("");
  const [transactionRef, setTransactionRef] = useState("");

  // Retailer
  const [retailerName, setRetailerName] = useState("");
  const [retailerCR, setRetailerCR] = useState("");
  const [retailerBranch, setRetailerBranch] = useState("");

  // Intelligence
  const [salaryDeclared, setSalaryDeclared] = useState("");
  const [spendRatioFlag, setSpendRatioFlag] = useState("unknown");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const amount = parseFloat(transactionAmount) || 0;
  const isHighValue = amount >= 5000;

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setSubmitted(true); }, 1200);
  };

  if (submitted) {
    return (
      <EcomConfirmation
        isAr={isAr}
        eventType="High-Value Transaction"
        eventTypeAr="معاملة عالية القيمة"
        color="#FB923C"
        icon="ri-money-dollar-circle-line"
        onReset={() => setSubmitted(false)}
      />
    );
  }

  return (
    <div className="space-y-5">
      <TipBanner
        text={isAr
          ? "يُبلَّغ عن هذا الحدث عند تجاوز معاملة واحدة الحد المُهيَّأ حسب الفئة. يتم تحديد الحد من قِبل البنك المركزي."
          : "This event is reported when a single purchase exceeds the configurable threshold by category. Threshold is set by the Central Bank."}
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
                { value: "gcc_id", label: "GCC ID" },
              ]}
            />
          </FormField>
          <FormField label={isAr ? "رقم الوثيقة" : "Document Number"} required>
            <TextInput value={docNumber} onChange={(e) => setDocNumber(e.target.value)} placeholder="e.g. A12345678" />
          </FormField>
          <FormField label={isAr ? "الاسم الكامل" : "Full Name"} required>
            <TextInput value={buyerName} onChange={(e) => setBuyerName(e.target.value)} placeholder={isAr ? "الاسم الكامل" : "Full name"} />
          </FormField>
          <FormField label={isAr ? "الجنسية" : "Nationality"} required>
            <SelectInput value={nationality} onChange={(e) => setNationality(e.target.value)} options={COUNTRIES} placeholder={isAr ? "اختر الجنسية" : "Select nationality"} />
          </FormField>
          <FormField label={isAr ? "رقم الهاتف" : "Phone Number"}>
            <TextInput value={buyerPhone} onChange={(e) => setBuyerPhone(e.target.value)} placeholder="+968 9XXX XXXX" />
          </FormField>
          <FormField label={isAr ? "العنوان المُسجَّل" : "Registered Address"}>
            <TextInput value={buyerAddress} onChange={(e) => setBuyerAddress(e.target.value)} placeholder={isAr ? "العنوان إن كان معروفاً" : "Address if known"} />
          </FormField>
        </div>
      </SectionCard>

      {/* Transaction Details */}
      <SectionCard title={isAr ? "تفاصيل المعاملة" : "Transaction Details"} icon="ri-money-dollar-circle-line" accentColor="#FB923C">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label={isAr ? "فئة العنصر" : "Item Category"} required>
            <SelectInput value={itemCategory} onChange={(e) => setItemCategory(e.target.value)} options={ITEM_CATEGORIES} placeholder={isAr ? "اختر الفئة" : "Select category"} />
          </FormField>
          <FormField label={isAr ? "وصف العنصر" : "Item Description"} required>
            <TextInput value={itemDescription} onChange={(e) => setItemDescription(e.target.value)} placeholder={isAr ? "وصف تفصيلي للعنصر" : "Detailed item description"} />
          </FormField>
          <FormField label={isAr ? "مبلغ المعاملة" : "Transaction Amount"} required>
            <TextInput type="number" value={transactionAmount} onChange={(e) => setTransactionAmount(e.target.value)} placeholder="0.000" step="0.001" />
          </FormField>
          <FormField label={isAr ? "العملة" : "Currency"} required>
            <SelectInput
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              options={[
                { value: "LCY", label: "LCY (Local Currency)" },
                { value: "USD", label: "USD" },
                { value: "EUR", label: "EUR" },
                { value: "GBP", label: "GBP" },
                { value: "AED", label: "AED" },
                { value: "SAR", label: "SAR" },
              ]}
            />
          </FormField>
          <FormField label={isAr ? "طريقة الدفع" : "Payment Method"} required>
            <SelectInput value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} options={PAYMENT_METHODS} placeholder={isAr ? "اختر طريقة الدفع" : "Select payment method"} />
          </FormField>
          {(paymentMethod === "credit_card" || paymentMethod === "debit_card") && (
            <FormField label={isAr ? "رقم البطاقة (آخر 4 أرقام)" : "Card Number (Last 4)"}>
              <TextInput value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="XXXX" maxLength={4} />
            </FormField>
          )}
          {paymentMethod === "bank_transfer" && (
            <FormField label={isAr ? "اسم البنك" : "Bank Name"}>
              <TextInput value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder={isAr ? "اسم البنك المُحوِّل" : "Sending bank name"} />
            </FormField>
          )}
          <FormField label={isAr ? "تاريخ المعاملة" : "Transaction Date"} required>
            <TextInput type="date" value={transactionDate} onChange={(e) => setTransactionDate(e.target.value)} />
          </FormField>
          <FormField label={isAr ? "وقت المعاملة" : "Transaction Time"}>
            <TextInput type="time" value={transactionTime} onChange={(e) => setTransactionTime(e.target.value)} />
          </FormField>
          <FormField label={isAr ? "رقم مرجع المعاملة" : "Transaction Reference"}>
            <TextInput value={transactionRef} onChange={(e) => setTransactionRef(e.target.value)} placeholder={isAr ? "رقم الفاتورة أو المعاملة" : "Invoice or transaction ID"} />
          </FormField>
        </div>

        {/* High-value indicator */}
        {isHighValue && (
          <div className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl border" style={{ background: "rgba(251,146,60,0.06)", borderColor: "rgba(251,146,60,0.25)" }}>
            <i className="ri-alarm-warning-line text-orange-400" />
            <p className="text-orange-400 text-sm font-['Inter']">
              {isAr
                ? `المبلغ ${transactionAmount} LCY — يتجاوز حد الإبلاغ. سيتم تصنيف هذا الحدث تلقائياً كمعاملة عالية القيمة.`
                : `Amount ${transactionAmount} LCY — exceeds reporting threshold. This will be auto-classified as a high-value transaction.`}
            </p>
          </div>
        )}
      </SectionCard>

      {/* Retailer */}
      <SectionCard title={isAr ? "معلومات التاجر" : "Retailer Information"} icon="ri-store-line">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label={isAr ? "اسم التاجر" : "Retailer Name"} required>
            <TextInput value={retailerName} onChange={(e) => setRetailerName(e.target.value)} placeholder={isAr ? "اسم المتجر" : "Store name"} />
          </FormField>
          <FormField label={isAr ? "رقم السجل التجاري" : "Commercial Registration"}>
            <TextInput value={retailerCR} onChange={(e) => setRetailerCR(e.target.value)} placeholder="CR-XXXXXXXX" />
          </FormField>
          <FormField label={isAr ? "الفرع / الموقع" : "Branch / Location"}>
            <TextInput value={retailerBranch} onChange={(e) => setRetailerBranch(e.target.value)} placeholder={isAr ? "الفرع أو الموقع" : "Branch or location"} />
          </FormField>
        </div>
      </SectionCard>

      {/* Intelligence Cross-Reference */}
      <SectionCard title={isAr ? "مرجع الاستخبارات" : "Intelligence Cross-Reference"} icon="ri-links-line" accentColor="#4ADE80">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label={isAr ? "الراتب المُعلَن (LCY/شهر)" : "Declared Salary (LCY/month)"}>
            <TextInput
              type="number"
              value={salaryDeclared}
              onChange={(e) => setSalaryDeclared(e.target.value)}
              placeholder={isAr ? "من سجل التوظيف" : "From employment registry"}
            />
          </FormField>
          <FormField label={isAr ? "نسبة الإنفاق مقارنة بالراتب" : "Spend vs Salary Ratio"} required>
            <RadioGroup
              name="spend_ratio"
              value={spendRatioFlag}
              onChange={setSpendRatioFlag}
              options={[
                { value: "normal", label: isAr ? "طبيعي" : "Normal" },
                { value: "elevated", label: isAr ? "مرتفع" : "Elevated" },
                { value: "suspicious", label: isAr ? "مشبوه" : "Suspicious" },
                { value: "unknown", label: isAr ? "غير معروف" : "Unknown" },
              ]}
            />
          </FormField>
        </div>
        <div className="mt-4">
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
        saveLabel={isAr ? "إرسال المعاملة" : "Submit High-Value Transaction"}
        disabled={!docNumber || !buyerName || !itemCategory || !transactionAmount || !paymentMethod || !transactionDate || !retailerName}
      />
    </div>
  );
};

export default HighValueTransactionForm;
