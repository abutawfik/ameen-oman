import { useState } from "react";
import {
  SectionCard, FormField, TextInput, SelectInput, TipBanner, FormActions, BRANCHES,
} from "@/pages/dashboard/hotel-events/components/FormComponents";
import TravelDocSection, { type TravelDocData } from "@/pages/dashboard/hotel-events/components/TravelDocSection";
import PersonalDetailsSection, { type PersonalData } from "@/pages/dashboard/hotel-events/components/PersonalDetailsSection";
import FinConfirmation from "./components/FinConfirmation";

const CURRENCIES = [
  { value: "LCY", label: "LCY — Local Currency" },
  { value: "USD", label: "USD — US Dollar" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "GBP", label: "GBP — British Pound" },
  { value: "AED", label: "AED — UAE Dirham" },
  { value: "SAR", label: "SAR — Saudi Riyal" },
  { value: "INR", label: "INR — Indian Rupee" },
  { value: "PKR", label: "PKR — Pakistani Rupee" },
  { value: "BDT", label: "BDT — Bangladeshi Taka" },
  { value: "PHP", label: "PHP — Philippine Peso" },
  { value: "EGP", label: "EGP — Egyptian Pound" },
  { value: "JPY", label: "JPY — Japanese Yen" },
  { value: "CNY", label: "CNY — Chinese Yuan" },
];

const EXCHANGE_PURPOSES = [
  { value: "travel",      label: "Travel",      labelAr: "سفر" },
  { value: "remittance",  label: "Remittance",  labelAr: "تحويل" },
  { value: "business",    label: "Business",    labelAr: "أعمال" },
  { value: "personal",    label: "Personal",    labelAr: "شخصي" },
  { value: "investment",  label: "Investment",  labelAr: "استثمار" },
];

const SOURCE_OF_FUNDS = [
  { value: "salary",     label: "Salary",          labelAr: "راتب" },
  { value: "savings",    label: "Savings",          labelAr: "مدخرات" },
  { value: "business",   label: "Business Income",  labelAr: "دخل تجاري" },
  { value: "investment", label: "Investment",       labelAr: "استثمار" },
  { value: "gift",       label: "Gift",             labelAr: "هدية" },
  { value: "other",      label: "Other",            labelAr: "أخرى" },
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

const CurrencyExchangeForm = ({ isAr, onCancel }: Props) => {
  const [branch, setBranch] = useState("");
  const [transactionId] = useState(`TXN-${Date.now().toString().slice(-8)}`);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [fromAmount, setFromAmount] = useState("");
  const [toCurrency, setToCurrency] = useState("LCY");
  const [toAmount, setToAmount] = useState("");
  const [rate, setRate] = useState("");
  const [purpose, setPurpose] = useState("");
  const [sourceOfFunds, setSourceOfFunds] = useState("");
  const [personal, setPersonal] = useState<PersonalData>(emptyPersonal());
  const [doc, setDoc] = useState<TravelDocData>(emptyDoc());
  const [autoFilled, setAutoFilled] = useState(false);
  const [scannerConnected] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  const handleScan = () => {
    setDoc({
      holderStatus: "primary", docType: "passport", docNumber: "P55443322",
      issuingCountry: "IN", placeOfIssue: "Mumbai", issuingAuthority: "Govt of India",
      issueDate: "2019-08-15", expiryDate: "2029-08-14",
    });
    setPersonal({
      firstName: "Rajesh", lastName: "Kumar", gender: "male", dob: "1980-05-12",
      nationality: "IN", placeOfBirth: "Mumbai", countryOfResidence: "IN",
      email: "rajesh.kumar@email.com", primaryContact: "+XXX 9456 7890", secondaryContact: "",
    });
    setAutoFilled(true);
  };

  const calcToAmount = (from: string, r: string) => {
    const f = parseFloat(from);
    const rt = parseFloat(r);
    if (!isNaN(f) && !isNaN(rt) && rt > 0) setToAmount((f * rt).toFixed(3));
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
        eventType={isAr ? "صرف عملة" : "Currency Exchange"}
        isAr={isAr}
        onReset={() => { setConfirmed(false); setFromAmount(""); setToAmount(""); setAutoFilled(false); }}
      />
    );

  return (
    <div className="space-y-5">
      <TipBanner
        text={isAr ? "جميع معاملات الصرف تُرسَل فوراً إلى Al-Ameen. المعاملات فوق 1000 LCY تُبلَّغ تلقائياً." : "All exchange transactions are sent to Al-Ameen instantly. Transactions above 1000 LCY are auto-reported."}
        color="cyan"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Transaction Info */}
        <SectionCard title={isAr ? "تفاصيل المعاملة" : "Transaction Details"} icon="ri-exchange-dollar-line">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "الفرع" : "Branch"} required>
                <SelectInput options={BRANCHES} placeholder={isAr ? "اختر الفرع" : "Select branch"} value={branch} onChange={(e) => setBranch(e.target.value)} />
              </FormField>
              <FormField label={isAr ? "رقم المعاملة" : "Transaction ID"}>
                <TextInput value={transactionId} readOnly className="font-['JetBrains_Mono'] text-xs opacity-70" />
              </FormField>
            </div>

            {/* Exchange visual */}
            <div className="rounded-xl border p-4" style={{ background: "rgba(0,0,0,0.3)", borderColor: "rgba(181,142,60,0.12)" }}>
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <p className="text-gray-500 text-xs mb-2">{isAr ? "من" : "From"}</p>
                  <div className="space-y-2">
                    <SelectInput options={CURRENCIES} value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)} />
                    <TextInput
                      type="number"
                      placeholder="0.00"
                      value={fromAmount}
                      onChange={(e) => { setFromAmount(e.target.value); calcToAmount(e.target.value, rate); }}
                      className="font-['JetBrains_Mono']"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center pb-2 flex-shrink-0">
                  <div className="w-9 h-9 flex items-center justify-center rounded-full" style={{ background: "rgba(181,142,60,0.12)", border: "1px solid rgba(181,142,60,0.25)" }}>
                    <i className="ri-arrow-left-right-line text-gold-400 text-sm" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-gray-500 text-xs mb-2">{isAr ? "إلى" : "To"}</p>
                  <div className="space-y-2">
                    <SelectInput options={CURRENCIES} value={toCurrency} onChange={(e) => setToCurrency(e.target.value)} />
                    <TextInput
                      type="number"
                      placeholder="0.000"
                      value={toAmount}
                      onChange={(e) => setToAmount(e.target.value)}
                      className="font-['JetBrains_Mono']"
                      style={{ color: "#D4A84B" }}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <FormField label={isAr ? "سعر الصرف" : "Exchange Rate"} required>
                  <TextInput
                    type="number"
                    placeholder="0.38500"
                    value={rate}
                    onChange={(e) => { setRate(e.target.value); calcToAmount(fromAmount, e.target.value); }}
                    className="font-['JetBrains_Mono']"
                  />
                </FormField>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "الغرض" : "Purpose"} required>
                <SelectInput
                  options={EXCHANGE_PURPOSES.map((p) => ({ value: p.value, label: isAr ? p.labelAr : p.label }))}
                  placeholder={isAr ? "اختر الغرض" : "Select purpose"}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                />
              </FormField>
              <FormField label={isAr ? "مصدر الأموال" : "Source of Funds"} required>
                <SelectInput
                  options={SOURCE_OF_FUNDS.map((s) => ({ value: s.value, label: isAr ? s.labelAr : s.label }))}
                  placeholder={isAr ? "اختر المصدر" : "Select source"}
                  value={sourceOfFunds}
                  onChange={(e) => setSourceOfFunds(e.target.value)}
                />
              </FormField>
            </div>
          </div>
        </SectionCard>

        {/* Travel Doc */}
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
      <FormActions onCancel={onCancel} onSave={handleSave} saveLabel={isAr ? "حفظ معاملة الصرف" : "Save Exchange Transaction"} isAr={isAr} saving={saving} />
    </div>
  );
};

export default CurrencyExchangeForm;
