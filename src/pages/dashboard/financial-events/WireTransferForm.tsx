import { useState } from "react";
import {
  SectionCard, FormField, TextInput, SelectInput, FormActions, BRANCHES, COUNTRIES,
} from "@/pages/dashboard/hotel-events/components/FormComponents";
import TravelDocSection, { type TravelDocData } from "@/pages/dashboard/hotel-events/components/TravelDocSection";
import PersonalDetailsSection, { type PersonalData } from "@/pages/dashboard/hotel-events/components/PersonalDetailsSection";
import FinConfirmation from "./components/FinConfirmation";

const CURRENCIES = [
  { value: "LCY", label: "LCY" }, { value: "USD", label: "USD" }, { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" }, { value: "AED", label: "AED" }, { value: "SAR", label: "SAR" },
  { value: "INR", label: "INR" }, { value: "PKR", label: "PKR" }, { value: "EGP", label: "EGP" },
];

const TRANSFER_PURPOSES = [
  { value: "family_support", label: "Family Support",    labelAr: "دعم الأسرة" },
  { value: "business",       label: "Business Payment",  labelAr: "دفعة تجارية" },
  { value: "education",      label: "Education Fees",    labelAr: "رسوم تعليمية" },
  { value: "medical",        label: "Medical",           labelAr: "طبي" },
  { value: "investment",     label: "Investment",        labelAr: "استثمار" },
  { value: "property",       label: "Property Purchase", labelAr: "شراء عقار" },
  { value: "other",          label: "Other",             labelAr: "أخرى" },
];

const HIGH_RISK_JURISDICTIONS = ["iran", "north korea", "syria", "myanmar", "cuba", "venezuela"];

const emptyPersonal = (): PersonalData => ({
  firstName: "", lastName: "", gender: "", dob: "", nationality: "",
  placeOfBirth: "", countryOfResidence: "", email: "", primaryContact: "", secondaryContact: "",
});
const emptyDoc = (): TravelDocData => ({
  holderStatus: "primary", docType: "", docNumber: "", issuingCountry: "",
  placeOfIssue: "", issuingAuthority: "", issueDate: "", expiryDate: "",
});

interface Props { isAr: boolean; onCancel: () => void; }

const WireTransferForm = ({ isAr, onCancel }: Props) => {
  const [branch, setBranch] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientCountry, setRecipientCountry] = useState("");
  const [recipientBank, setRecipientBank] = useState("");
  const [recipientAccount, setRecipientAccount] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [purpose, setPurpose] = useState("");
  const [swiftRef, setSwiftRef] = useState("");
  const [personal, setPersonal] = useState<PersonalData>(emptyPersonal());
  const [doc, setDoc] = useState<TravelDocData>(emptyDoc());
  const [autoFilled, setAutoFilled] = useState(false);
  const [scannerConnected] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  const handleScan = () => {
    setDoc({
      holderStatus: "primary", docType: "passport", docNumber: "P77889900",
      issuingCountry: "PK", placeOfIssue: "Karachi", issuingAuthority: "Govt of Pakistan",
      issueDate: "2021-11-20", expiryDate: "2031-11-19",
    });
    setPersonal({
      firstName: "Ali", lastName: "Hassan", gender: "male", dob: "1978-02-28",
      nationality: "PK", placeOfBirth: "Karachi", countryOfResidence: "PK",
      email: "ali.hassan@email.com", primaryContact: "+XXX 9678 9012", secondaryContact: "",
    });
    setAutoFilled(true);
  };

  // Approximate LCY equivalent (simplified)
  const lcyRates: Record<string, number> = { LCY: 1, USD: 0.385, EUR: 0.42, GBP: 0.48, AED: 0.105, SAR: 0.103, INR: 0.0046, PKR: 0.00138, EGP: 0.0079 };
  const amountLCY = parseFloat(amount) * (lcyRates[currency] ?? 0.3);
  const isHighAmount = amountLCY > 1000;
  const isHighRisk = HIGH_RISK_JURISDICTIONS.some((c) => recipientCountry.toLowerCase().includes(c));
  const isFlagged = isHighAmount || isHighRisk;

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      const seq = Math.floor(Math.random() * 9000) + 1000;
      setRefNumber(`AMN-FIN-${Date.now()}-${seq}`);
      setConfirmed(true);
    }, 1800);
  };

  if (confirmed)
    return (
      <FinConfirmation
        refNumber={refNumber}
        eventType={isAr ? "تحويل بنكي" : "Wire Transfer"}
        isAr={isAr}
        flagged={isFlagged}
        onReset={() => { setConfirmed(false); setAmount(""); setRecipientName(""); setAutoFilled(false); }}
      />
    );

  return (
    <div className="space-y-5">
      {/* Amber auto-flag note */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl border" style={{ background: "rgba(251,146,60,0.06)", borderColor: "rgba(251,146,60,0.25)" }}>
        <i className="ri-alarm-warning-line text-orange-400 text-sm mt-0.5 flex-shrink-0" />
        <p className="text-orange-400 text-sm font-['Inter']">
          {isAr
            ? "تنبيه: التحويلات فوق 1000 LCY أو إلى دول عالية المخاطر تُبلَّغ تلقائياً إلى AL-AMEEN."
            : "Transfers >1000 LCY or to high-risk jurisdictions are auto-flagged and reported to AL-AMEEN."}
        </p>
      </div>

      {/* Live flag indicator */}
      {isFlagged && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border" style={{ background: "rgba(248,113,113,0.08)", borderColor: "rgba(248,113,113,0.3)" }}>
          <div className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse flex-shrink-0" />
          <p className="text-red-400 text-sm font-bold font-['Inter']">
            {isAr ? "هذه المعاملة مُبلَّغ عنها تلقائياً" : "This transaction is auto-flagged"}
            {isHighAmount && ` — ${isAr ? "مبلغ مرتفع" : "High Amount"}`}
            {isHighRisk && ` — ${isAr ? "دولة عالية المخاطر" : "High-Risk Jurisdiction"}`}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Sender Travel Doc */}
        <TravelDocSection
          data={doc}
          onChange={(k, v) => setDoc((d) => ({ ...d, [k]: v }))}
          isAr={isAr}
          scannerConnected={scannerConnected}
          autoFilled={autoFilled}
          onScan={handleScan}
        />

        <div className="space-y-5">
          {/* Recipient Details */}
          <SectionCard title={isAr ? "بيانات المستفيد" : "Recipient Details"} icon="ri-user-received-line">
            <div className="space-y-4">
              <FormField label={isAr ? "اسم المستفيد" : "Recipient Name"} required>
                <TextInput placeholder={isAr ? "الاسم الكامل" : "Full name"} value={recipientName} onChange={(e) => setRecipientName(e.target.value)} />
              </FormField>
              <FormField label={isAr ? "دولة المستفيد" : "Recipient Country"} required>
                <SelectInput options={COUNTRIES} placeholder={isAr ? "اختر الدولة" : "Select country"} value={recipientCountry} onChange={(e) => setRecipientCountry(e.target.value)} />
              </FormField>
              <FormField label={isAr ? "البنك المستفيد" : "Recipient Bank"} required>
                <TextInput placeholder={isAr ? "اسم البنك" : "Bank name"} value={recipientBank} onChange={(e) => setRecipientBank(e.target.value)} />
              </FormField>
              <FormField label={isAr ? "رقم الحساب / IBAN" : "Account No. / IBAN"} required>
                <TextInput placeholder="IBAN / Account number" value={recipientAccount} onChange={(e) => setRecipientAccount(e.target.value)} className="font-['JetBrains_Mono'] text-xs" />
              </FormField>
              <FormField label={isAr ? "رمز SWIFT / BIC" : "SWIFT / BIC Code"} required>
                <TextInput placeholder="XXXXXXXX" value={swiftCode} onChange={(e) => setSwiftCode(e.target.value.toUpperCase())} className="font-['JetBrains_Mono']" />
              </FormField>
            </div>
          </SectionCard>

          {/* Transfer Details */}
          <SectionCard title={isAr ? "تفاصيل التحويل" : "Transfer Details"} icon="ri-send-plane-line">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <FormField label={isAr ? "المبلغ" : "Amount"} required>
                  <TextInput type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="font-['JetBrains_Mono']" />
                </FormField>
                <FormField label={isAr ? "العملة" : "Currency"} required>
                  <SelectInput options={CURRENCIES} value={currency} onChange={(e) => setCurrency(e.target.value)} />
                </FormField>
              </div>
              {amount && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ background: "rgba(34,211,238,0.05)", borderColor: "rgba(34,211,238,0.2)" }}>
                  <i className="ri-exchange-dollar-line text-cyan-400 text-sm" />
                  <span className="text-gray-400 text-xs">{isAr ? "ما يعادل تقريباً:" : "Approx. equivalent:"}</span>
                  <span className="text-cyan-400 font-bold text-sm font-['JetBrains_Mono']">LCY {amountLCY.toFixed(3)}</span>
                </div>
              )}
              <FormField label={isAr ? "الغرض من التحويل" : "Transfer Purpose"} required>
                <SelectInput
                  options={TRANSFER_PURPOSES.map((p) => ({ value: p.value, label: isAr ? p.labelAr : p.label }))}
                  placeholder={isAr ? "اختر الغرض" : "Select purpose"}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                />
              </FormField>
              <FormField label={isAr ? "مرجع SWIFT" : "SWIFT Reference"}>
                <TextInput placeholder="SWIFT-REF-XXXXXXXX" value={swiftRef} onChange={(e) => setSwiftRef(e.target.value)} className="font-['JetBrains_Mono']" />
              </FormField>
              <FormField label={isAr ? "الفرع" : "Branch"} required>
                <SelectInput options={BRANCHES} placeholder={isAr ? "اختر الفرع" : "Select branch"} value={branch} onChange={(e) => setBranch(e.target.value)} />
              </FormField>
            </div>
          </SectionCard>
        </div>
      </div>

      <PersonalDetailsSection data={personal} onChange={(k, v) => setPersonal((p) => ({ ...p, [k]: v }))} isAr={isAr} autoFilled={autoFilled} />
      <FormActions onCancel={onCancel} onSave={handleSave} saveLabel={isAr ? "إرسال التحويل" : "Submit Wire Transfer"} isAr={isAr} saving={saving} />
    </div>
  );
};

export default WireTransferForm;
