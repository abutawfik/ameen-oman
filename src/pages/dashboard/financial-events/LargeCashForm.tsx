import { useState } from "react";
import {
  SectionCard, FormField, TextInput, SelectInput, RadioGroup, TipBanner, FormActions, BRANCHES,
} from "@/pages/dashboard/hotel-events/components/FormComponents";
import TravelDocSection, { type TravelDocData } from "@/pages/dashboard/hotel-events/components/TravelDocSection";
import PersonalDetailsSection, { type PersonalData } from "@/pages/dashboard/hotel-events/components/PersonalDetailsSection";
import FinConfirmation from "./components/FinConfirmation";

const SOURCE_OF_FUNDS = [
  { value: "salary",      label: "Salary / Wages",     labelAr: "راتب / أجور" },
  { value: "business",    label: "Business Revenue",   labelAr: "إيرادات تجارية" },
  { value: "savings",     label: "Personal Savings",   labelAr: "مدخرات شخصية" },
  { value: "property",    label: "Property Sale",      labelAr: "بيع عقار" },
  { value: "inheritance", label: "Inheritance",        labelAr: "إرث" },
  { value: "investment",  label: "Investment Return",  labelAr: "عائد استثماري" },
  { value: "loan",        label: "Bank Loan",          labelAr: "قرض بنكي" },
  { value: "other",       label: "Other",              labelAr: "أخرى" },
];

const CASH_PURPOSES = [
  { value: "business",   label: "Business Operations", labelAr: "عمليات تجارية" },
  { value: "property",   label: "Property Purchase",   labelAr: "شراء عقار" },
  { value: "personal",   label: "Personal Use",        labelAr: "استخدام شخصي" },
  { value: "investment", label: "Investment",          labelAr: "استثمار" },
  { value: "other",      label: "Other",               labelAr: "أخرى" },
];

const emptyPersonal = (): PersonalData => ({
  firstName: "", lastName: "", gender: "", dob: "", nationality: "",
  placeOfBirth: "", countryOfResidence: "", email: "", primaryContact: "", secondaryContact: "",
});
const emptyDoc = (): TravelDocData => ({
  holderStatus: "primary", docType: "", docNumber: "", issuingCountry: "",
  placeOfIssue: "", issuingAuthority: "", issueDate: "", expiryDate: "",
});

interface Props { isAr: boolean; onCancel: () => void; }

const LargeCashForm = ({ isAr, onCancel }: Props) => {
  const [branch, setBranch] = useState("");
  const [transactionType, setTransactionType] = useState("deposit");
  const [amount, setAmount] = useState("");
  const [sourceOfFunds, setSourceOfFunds] = useState("");
  const [purpose, setPurpose] = useState("");
  const [tellerId, setTellerId] = useState("");
  const [supervisorId, setSupervisorId] = useState("");
  const [personal, setPersonal] = useState<PersonalData>(emptyPersonal());
  const [doc, setDoc] = useState<TravelDocData>(emptyDoc());
  const [autoFilled, setAutoFilled] = useState(false);
  const [scannerConnected] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  const handleScan = () => {
    setDoc({
      holderStatus: "primary", docType: "passport", docNumber: "P33221100",
      issuingCountry: "SA", placeOfIssue: "Capital City", issuingAuthority: "National Authority",
      issueDate: "2020-07-01", expiryDate: "2030-06-30",
    });
    setPersonal({
      firstName: "Saif", lastName: "Al-Rawahi", gender: "male", dob: "1975-12-10",
      nationality: "SA", placeOfBirth: "Capital City", countryOfResidence: "SA",
      email: "saif.rawahi@email.com", primaryContact: "+XXX 9789 0123", secondaryContact: "",
    });
    setAutoFilled(true);
  };

  const amountNum = parseFloat(amount) || 0;
  const isAboveThreshold = amountNum >= 5000;
  const riskLevel = amountNum >= 50000 ? "critical" : amountNum >= 20000 ? "high" : amountNum >= 5000 ? "medium" : "low";
  const riskColors: Record<string, string> = { critical: "#F87171", high: "#FB923C", medium: "#FACC15", low: "#4ADE80" };
  const riskLabels: Record<string, string> = {
    critical: isAr ? "حرج" : "CRITICAL",
    high: isAr ? "مرتفع" : "HIGH",
    medium: isAr ? "متوسط" : "MEDIUM",
    low: isAr ? "منخفض" : "LOW",
  };

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
        eventType={isAr ? "نقد كبير" : "Large Cash Transaction"}
        isAr={isAr}
        flagged={isAboveThreshold}
        onReset={() => { setConfirmed(false); setAmount(""); setAutoFilled(false); }}
      />
    );

  return (
    <div className="space-y-5">
      <TipBanner
        text={isAr ? "المعاملات النقدية فوق 5000 LCY تُبلَّغ تلقائياً إلى Al-Ameen وفق متطلبات مكافحة غسل الأموال." : "Cash transactions above 5000 LCY are automatically reported to Al-Ameen per AML requirements."}
        color="amber"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SectionCard title={isAr ? "تفاصيل المعاملة النقدية" : "Cash Transaction Details"} icon="ri-money-cny-circle-line">
          <div className="space-y-4">
            <FormField label={isAr ? "الفرع" : "Branch"} required>
              <SelectInput options={BRANCHES} placeholder={isAr ? "اختر الفرع" : "Select branch"} value={branch} onChange={(e) => setBranch(e.target.value)} />
            </FormField>

            <FormField label={isAr ? "نوع المعاملة" : "Transaction Type"} required>
              <RadioGroup
                name="txType"
                options={[
                  { value: "deposit",    label: isAr ? "إيداع" : "Deposit" },
                  { value: "withdrawal", label: isAr ? "سحب" : "Withdrawal" },
                ]}
                value={transactionType}
                onChange={setTransactionType}
              />
            </FormField>

            <FormField label={isAr ? "المبلغ (LCY)" : "Amount (LCY)"} required>
              <div className="relative">
                <TextInput
                  type="number"
                  placeholder="5000.000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="font-['JetBrains_Mono'] text-lg pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-['JetBrains_Mono']">LCY</span>
              </div>
            </FormField>

            {/* Risk meter */}
            {amount && (
              <div
                className="p-4 rounded-xl border transition-all"
                style={{ background: `${riskColors[riskLevel]}08`, borderColor: `${riskColors[riskLevel]}30` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-400 text-xs">{isAr ? "مستوى المخاطر" : "Risk Level"}</p>
                  <span className="text-xs font-bold font-['JetBrains_Mono']" style={{ color: riskColors[riskLevel] }}>
                    {riskLabels[riskLevel]}
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((amountNum / 100000) * 100, 100)}%`, background: riskColors[riskLevel] }}
                  />
                </div>
                {isAboveThreshold && (
                  <p className="text-xs mt-2" style={{ color: riskColors[riskLevel] }}>
                    <i className="ri-alert-line mr-1" />
                    {isAr ? "هذه المعاملة مُبلَّغ عنها تلقائياً إلى Al-Ameen" : "This transaction is auto-reported to Al-Ameen"}
                  </p>
                )}
              </div>
            )}

            <FormField label={isAr ? "مصدر الأموال" : "Source of Funds"} required>
              <SelectInput
                options={SOURCE_OF_FUNDS.map((s) => ({ value: s.value, label: isAr ? s.labelAr : s.label }))}
                placeholder={isAr ? "اختر المصدر" : "Select source"}
                value={sourceOfFunds}
                onChange={(e) => setSourceOfFunds(e.target.value)}
              />
            </FormField>

            <FormField label={isAr ? "الغرض" : "Purpose"} required>
              <SelectInput
                options={CASH_PURPOSES.map((p) => ({ value: p.value, label: isAr ? p.labelAr : p.label }))}
                placeholder={isAr ? "اختر الغرض" : "Select purpose"}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "رقم الصراف" : "Teller ID"} required>
                <TextInput placeholder="TLR-XXXX" value={tellerId} onChange={(e) => setTellerId(e.target.value)} className="font-['JetBrains_Mono']" />
              </FormField>
              <FormField label={isAr ? "رقم المشرف" : "Supervisor ID"}>
                <TextInput placeholder="SUP-XXXX" value={supervisorId} onChange={(e) => setSupervisorId(e.target.value)} className="font-['JetBrains_Mono']" />
              </FormField>
            </div>
          </div>
        </SectionCard>

        <TravelDocSection
          data={doc}
          onChange={(k, v) => setDoc((d) => ({ ...d, [k]: v }))}
          isAr={isAr}
          scannerConnected={scannerConnected}
          autoFilled={autoFilled}
          onScan={handleScan}
        />
      </div>

      <PersonalDetailsSection data={personal} onChange={(k, v) => setPersonal((p) => ({ ...p, [k]: v }))} isAr={isAr} autoFilled={autoFilled} />
      <FormActions onCancel={onCancel} onSave={handleSave} saveLabel={isAr ? "تسجيل المعاملة النقدية" : "Record Cash Transaction"} isAr={isAr} saving={saving} />
    </div>
  );
};

export default LargeCashForm;
