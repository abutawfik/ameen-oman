import { useState } from "react";
import {
  FormField, TextInput, SelectInput, SectionCard, TipBanner, FormActions, RadioGroup,
  COUNTRIES,
} from "@/pages/dashboard/hotel-events/components/FormComponents";
import EcomConfirmation from "./EcomConfirmation";

interface Props { isAr: boolean; onCancel: () => void; }

interface CardEntry {
  id: string;
  cardType: string;
  last4: string;
  bank: string;
  transactionCount: string;
  totalAmount: string;
}

const PaymentPatternForm = ({ isAr, onCancel }: Props) => {
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  // Person
  const [docType, setDocType] = useState("passport");
  const [docNumber, setDocNumber] = useState("");
  const [personName, setPersonName] = useState("");
  const [nationality, setNationality] = useState("");
  const [phone, setPhone] = useState("");
  const [registeredAddress, setRegisteredAddress] = useState("");

  // Pattern type
  const [patternType, setPatternType] = useState("");

  // Cards
  const [cards, setCards] = useState<CardEntry[]>([
    { id: "c1", cardType: "", last4: "", bank: "", transactionCount: "", totalAmount: "" },
  ]);

  // Structuring details
  const [timeWindowDays, setTimeWindowDays] = useState("");
  const [totalTransactions, setTotalTransactions] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [avgTransactionAmount, setAvgTransactionAmount] = useState("");
  const [reportingThreshold, setReportingThreshold] = useState("");

  // Location anomaly
  const [registeredCity, setRegisteredCity] = useState("");
  const [transactionCity, setTransactionCity] = useState("");
  const [locationMismatch, setLocationMismatch] = useState("no");

  // Employment cross-ref
  const [declaredSalary, setDeclaredSalary] = useState("");
  const [spendRatio, setSpendRatio] = useState("");

  // Notes
  const [additionalNotes, setAdditionalNotes] = useState("");

  const addCard = () => {
    setCards((prev) => [...prev, { id: `c${Date.now()}`, cardType: "", last4: "", bank: "", transactionCount: "", totalAmount: "" }]);
  };

  const removeCard = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  const updateCard = (id: string, field: keyof CardEntry, value: string) => {
    setCards((prev) => prev.map((c) => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setSubmitted(true); }, 1200);
  };

  if (submitted) {
    return (
      <EcomConfirmation
        isAr={isAr}
        eventType="Payment Pattern Alert"
        eventTypeAr="تنبيه نمط الدفع"
        color="#22D3EE"
        icon="ri-exchange-line"
        onReset={() => setSubmitted(false)}
      />
    );
  }

  return (
    <div className="space-y-5">
      <TipBanner
        text={isAr
          ? "يُبلَّغ عن هذا الحدث عند اكتشاف أنماط دفع مشبوهة: بطاقات متعددة لنفس الشخص، معاملات صغيرة متكررة (تجزئة)، أو بطاقة مستخدمة في موقع غير معتاد."
          : "This event is reported when suspicious payment patterns are detected: multiple cards same person, frequent small transactions (structuring), or card used in unusual location vs registered address."}
        color="amber"
      />

      {/* Person Identity */}
      <SectionCard title={isAr ? "هوية الشخص" : "Person Identity"} icon="ri-user-line">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label={isAr ? "نوع الوثيقة" : "Document Type"} required>
            <SelectInput
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              options={[
                { value: "passport", label: "Passport" },
                { value: "national_id", label: "National ID" },
                { value: "resident_card", label: "Resident Card" },
              ]}
            />
          </FormField>
          <FormField label={isAr ? "رقم الوثيقة" : "Document Number"} required>
            <TextInput value={docNumber} onChange={(e) => setDocNumber(e.target.value)} placeholder="e.g. YE-4421-M" />
          </FormField>
          <FormField label={isAr ? "الاسم الكامل" : "Full Name"}>
            <TextInput value={personName} onChange={(e) => setPersonName(e.target.value)} placeholder={isAr ? "الاسم الكامل" : "Full name"} />
          </FormField>
          <FormField label={isAr ? "الجنسية" : "Nationality"} required>
            <SelectInput value={nationality} onChange={(e) => setNationality(e.target.value)} options={COUNTRIES} placeholder={isAr ? "اختر الجنسية" : "Select nationality"} />
          </FormField>
          <FormField label={isAr ? "رقم الهاتف" : "Phone Number"}>
            <TextInput value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+968 9XXX XXXX" />
          </FormField>
          <FormField label={isAr ? "العنوان المُسجَّل" : "Registered Address"}>
            <TextInput value={registeredAddress} onChange={(e) => setRegisteredAddress(e.target.value)} placeholder={isAr ? "العنوان المُسجَّل" : "Registered address"} />
          </FormField>
        </div>
      </SectionCard>

      {/* Pattern Type */}
      <SectionCard title={isAr ? "نوع النمط المشبوه" : "Suspicious Pattern Type"} icon="ri-exchange-line" accentColor="#22D3EE">
        <FormField label={isAr ? "نوع النمط" : "Pattern Type"} required>
          <SelectInput
            value={patternType}
            onChange={(e) => setPatternType(e.target.value)}
            options={[
              { value: "structuring", label: "Structuring — Multiple small transactions below threshold" },
              { value: "multiple_cards", label: "Multiple Cards — Same person, different cards" },
              { value: "location_mismatch", label: "Location Mismatch — Card used far from registered address" },
              { value: "velocity", label: "High Velocity — Unusually frequent transactions" },
              { value: "card_sharing", label: "Card Sharing — Multiple persons using same card" },
              { value: "round_amounts", label: "Round Amounts — Suspicious round-number transactions" },
              { value: "other", label: "Other Suspicious Pattern" },
            ]}
            placeholder={isAr ? "اختر نوع النمط" : "Select pattern type"}
          />
        </FormField>
      </SectionCard>

      {/* Payment Cards */}
      <SectionCard title={isAr ? "بطاقات الدفع المستخدمة" : "Payment Cards Used"} icon="ri-bank-card-line" accentColor="#FACC15">
        <div className="space-y-4">
          {cards.map((card, idx) => (
            <div key={card.id} className="p-4 rounded-xl border" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400 text-xs font-semibold font-['JetBrains_Mono']">
                  {isAr ? `بطاقة ${idx + 1}` : `Card ${idx + 1}`}
                </span>
                {cards.length > 1 && (
                  <button type="button" onClick={() => removeCard(card.id)}
                    className="w-6 h-6 flex items-center justify-center rounded cursor-pointer hover:bg-red-400/10 transition-colors">
                    <i className="ri-close-line text-red-400 text-xs" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <FormField label={isAr ? "نوع البطاقة" : "Card Type"}>
                  <SelectInput
                    value={card.cardType}
                    onChange={(e) => updateCard(card.id, "cardType", e.target.value)}
                    options={[
                      { value: "visa", label: "Visa" },
                      { value: "mastercard", label: "Mastercard" },
                      { value: "amex", label: "American Express" },
                      { value: "prepaid", label: "Prepaid" },
                      { value: "unknown", label: "Unknown" },
                    ]}
                    placeholder={isAr ? "النوع" : "Type"}
                  />
                </FormField>
                <FormField label={isAr ? "آخر 4 أرقام" : "Last 4 Digits"}>
                  <TextInput value={card.last4} onChange={(e) => updateCard(card.id, "last4", e.target.value)} placeholder="XXXX" maxLength={4} />
                </FormField>
                <FormField label={isAr ? "البنك المُصدِر" : "Issuing Bank"}>
                  <TextInput value={card.bank} onChange={(e) => updateCard(card.id, "bank", e.target.value)} placeholder={isAr ? "اسم البنك" : "Bank name"} />
                </FormField>
                <FormField label={isAr ? "عدد المعاملات" : "Transaction Count"}>
                  <TextInput type="number" value={card.transactionCount} onChange={(e) => updateCard(card.id, "transactionCount", e.target.value)} placeholder="0" />
                </FormField>
                <FormField label={isAr ? "الإجمالي (LCY)" : "Total Amount (LCY)"}>
                  <TextInput type="number" value={card.totalAmount} onChange={(e) => updateCard(card.id, "totalAmount", e.target.value)} placeholder="0.000" step="0.001" />
                </FormField>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addCard}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap font-['Inter']"
            style={{ background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.2)", color: "#22D3EE" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(34,211,238,0.15)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(34,211,238,0.08)"; }}
          >
            <i className="ri-add-line" />
            {isAr ? "إضافة بطاقة" : "Add Card"}
          </button>

          {cards.length >= 3 && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border" style={{ background: "rgba(250,204,21,0.06)", borderColor: "rgba(250,204,21,0.25)" }}>
              <i className="ri-alarm-warning-line text-yellow-400" />
              <p className="text-yellow-400 text-sm font-['Inter']">
                {isAr
                  ? `${cards.length} بطاقات لنفس الشخص — نمط مشبوه يستحق التحقيق`
                  : `${cards.length} cards for same person — suspicious pattern warranting investigation`}
              </p>
            </div>
          )}
        </div>
      </SectionCard>

      {/* Structuring Details */}
      <SectionCard title={isAr ? "تفاصيل النمط" : "Pattern Details"} icon="ri-bar-chart-line">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label={isAr ? "الإطار الزمني (أيام)" : "Time Window (days)"} required>
            <TextInput type="number" value={timeWindowDays} onChange={(e) => setTimeWindowDays(e.target.value)} placeholder="e.g. 7, 30, 90" />
          </FormField>
          <FormField label={isAr ? "إجمالي عدد المعاملات" : "Total Transaction Count"} required>
            <TextInput type="number" value={totalTransactions} onChange={(e) => setTotalTransactions(e.target.value)} placeholder="0" />
          </FormField>
          <FormField label={isAr ? "إجمالي المبلغ (LCY)" : "Total Amount (LCY)"} required>
            <TextInput type="number" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} placeholder="0.000" step="0.001" />
          </FormField>
          <FormField label={isAr ? "متوسط المعاملة (LCY)" : "Avg Transaction (LCY)"}>
            <TextInput type="number" value={avgTransactionAmount} onChange={(e) => setAvgTransactionAmount(e.target.value)} placeholder="0.000" step="0.001" />
          </FormField>
          <FormField label={isAr ? "حد الإبلاغ (LCY)" : "Reporting Threshold (LCY)"}>
            <TextInput type="number" value={reportingThreshold} onChange={(e) => setReportingThreshold(e.target.value)} placeholder={isAr ? "الحد المُهيَّأ" : "Configured threshold"} />
          </FormField>
        </div>
      </SectionCard>

      {/* Location Anomaly */}
      <SectionCard title={isAr ? "شذوذ الموقع" : "Location Anomaly"} icon="ri-map-pin-line" accentColor="#FB923C">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label={isAr ? "المدينة المُسجَّلة" : "Registered City"}>
            <TextInput value={registeredCity} onChange={(e) => setRegisteredCity(e.target.value)} placeholder={isAr ? "مدينة الإقامة المُسجَّلة" : "Registered residence city"} />
          </FormField>
          <FormField label={isAr ? "مدينة المعاملة" : "Transaction City"}>
            <TextInput value={transactionCity} onChange={(e) => setTransactionCity(e.target.value)} placeholder={isAr ? "مدينة استخدام البطاقة" : "City where card was used"} />
          </FormField>
          <FormField label={isAr ? "تناقض في الموقع؟" : "Location Mismatch?"} required>
            <RadioGroup
              name="location_mismatch"
              value={locationMismatch}
              onChange={setLocationMismatch}
              options={[
                { value: "yes", label: isAr ? "نعم" : "Yes" },
                { value: "no", label: isAr ? "لا" : "No" },
                { value: "unknown", label: isAr ? "غير معروف" : "Unknown" },
              ]}
            />
          </FormField>
        </div>
      </SectionCard>

      {/* Employment Cross-Reference */}
      <SectionCard title={isAr ? "مرجع التوظيف" : "Employment Cross-Reference"} icon="ri-briefcase-line" accentColor="#4ADE80">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label={isAr ? "الراتب المُعلَن (LCY/شهر)" : "Declared Salary (LCY/month)"}>
            <TextInput type="number" value={declaredSalary} onChange={(e) => setDeclaredSalary(e.target.value)} placeholder={isAr ? "من سجل التوظيف" : "From employment registry"} />
          </FormField>
          <FormField label={isAr ? "نسبة الإنفاق إلى الراتب" : "Spend-to-Salary Ratio"}>
            <TextInput value={spendRatio} onChange={(e) => setSpendRatio(e.target.value)} placeholder={isAr ? "مثال: 9× الراتب الشهري" : "e.g. 9× monthly salary"} />
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
        saveLabel={isAr ? "إرسال تنبيه النمط" : "Submit Payment Pattern Alert"}
        disabled={!docNumber || !patternType || !timeWindowDays || !totalTransactions || !totalAmount}
      />
    </div>
  );
};

export default PaymentPatternForm;
