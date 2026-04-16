import { useState } from "react";
import {
  SectionCard, FormField, TextInput, SelectInput, RadioGroup, TipBanner, FormActions, BRANCHES,
} from "@/pages/dashboard/hotel-events/components/FormComponents";
import TravelDocSection, { type TravelDocData } from "@/pages/dashboard/hotel-events/components/TravelDocSection";
import PersonalDetailsSection, { type PersonalData } from "@/pages/dashboard/hotel-events/components/PersonalDetailsSection";
import FinConfirmation from "./components/FinConfirmation";

const ACCOUNT_TYPES = [
  { value: "current",  label: "Current Account",  labelAr: "حساب جاري" },
  { value: "savings",  label: "Savings Account",  labelAr: "حساب توفير" },
  { value: "fixed",    label: "Fixed Deposit",    labelAr: "وديعة ثابتة" },
  { value: "business", label: "Business Account", labelAr: "حساب تجاري" },
  { value: "joint",    label: "Joint Account",    labelAr: "حساب مشترك" },
];

const SOURCE_OF_FUNDS = [
  { value: "salary",      label: "Salary" },
  { value: "business",    label: "Business Income" },
  { value: "savings",     label: "Savings" },
  { value: "investment",  label: "Investment Returns" },
  { value: "inheritance", label: "Inheritance" },
  { value: "other",       label: "Other" },
];

const MONTHLY_VOLUMES = [
  { value: "under_1k",  label: "Under LCY 1,000" },
  { value: "1k_5k",     label: "LCY 1,000 – 5,000" },
  { value: "5k_20k",    label: "LCY 5,000 – 20,000" },
  { value: "20k_100k",  label: "LCY 20,000 – 100,000" },
  { value: "over_100k", label: "Over LCY 100,000" },
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

const AccountOpenedForm = ({ isAr, onCancel }: Props) => {
  const [branch, setBranch] = useState("");
  const [accountType, setAccountType] = useState("");
  const [initialDeposit, setInitialDeposit] = useState("");
  const [sourceOfFunds, setSourceOfFunds] = useState("");
  const [employerRef, setEmployerRef] = useState("");
  const [monthlyVolume, setMonthlyVolume] = useState("");
  const [intlTransfer, setIntlTransfer] = useState(false);
  const [pep, setPep] = useState("no");
  const [personal, setPersonal] = useState<PersonalData>(emptyPersonal());
  const [doc, setDoc] = useState<TravelDocData>(emptyDoc());
  const [autoFilled, setAutoFilled] = useState(false);
  const [scannerConnected] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  const handleScan = () => {
    setDoc({
      holderStatus: "primary", docType: "national_id", docNumber: "NID-12345678",
      issuingCountry: "SA", placeOfIssue: "Capital City", issuingAuthority: "National Authority",
      issueDate: "2022-03-01", expiryDate: "2032-02-28",
    });
    setPersonal({
      firstName: "Fatima", lastName: "Al-Zadjali", gender: "female", dob: "1990-09-15",
      nationality: "SA", placeOfBirth: "Capital City", countryOfResidence: "SA",
      email: "fatima.zadjali@email.com", primaryContact: "+XXX 9567 8901", secondaryContact: "",
    });
    setAutoFilled(true);
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
        eventType={isAr ? "فتح حساب" : "Account Opened"}
        isAr={isAr}
        onReset={() => { setConfirmed(false); setAccountType(""); setAutoFilled(false); }}
      />
    );

  const riskLevel = pep === "yes" ? "critical" : intlTransfer ? "medium" : "low";
  const riskColors: Record<string, string> = { critical: "#F87171", medium: "#FB923C", low: "#4ADE80" };
  const riskLabels: Record<string, string> = {
    critical: isAr ? "حرج" : "CRITICAL",
    medium: isAr ? "متوسط" : "MEDIUM",
    low: isAr ? "منخفض" : "LOW",
  };
  const riskWidths: Record<string, string> = { critical: "85%", medium: "55%", low: "25%" };

  return (
    <div className="space-y-5">
      <TipBanner
        text={isAr ? "يجب التحقق من هوية العميل وفق متطلبات AML/KYC قبل فتح الحساب." : "Customer identity must be verified per AML/KYC requirements before account opening."}
        color="cyan"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Account Details */}
        <SectionCard title={isAr ? "تفاصيل الحساب" : "Account Details"} icon="ri-bank-line">
          <div className="space-y-4">
            <FormField label={isAr ? "الفرع" : "Bank Branch"} required>
              <SelectInput options={BRANCHES} placeholder={isAr ? "اختر الفرع" : "Select branch"} value={branch} onChange={(e) => setBranch(e.target.value)} />
            </FormField>
            <FormField label={isAr ? "نوع الحساب" : "Account Type"} required>
              <SelectInput
                options={ACCOUNT_TYPES.map((a) => ({ value: a.value, label: isAr ? a.labelAr : a.label }))}
                placeholder={isAr ? "اختر النوع" : "Select type"}
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
              />
            </FormField>
            <FormField label={isAr ? "الإيداع الأولي (LCY)" : "Initial Deposit (LCY)"} required>
              <div className="relative">
                <TextInput type="number" placeholder="0.000" value={initialDeposit} onChange={(e) => setInitialDeposit(e.target.value)} className="font-['JetBrains_Mono'] pr-12" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-['JetBrains_Mono']">LCY</span>
              </div>
            </FormField>
            <FormField label={isAr ? "مصدر الأموال" : "Source of Funds"} required>
              <SelectInput options={SOURCE_OF_FUNDS} placeholder={isAr ? "اختر المصدر" : "Select source"} value={sourceOfFunds} onChange={(e) => setSourceOfFunds(e.target.value)} />
            </FormField>
            <FormField label={isAr ? "مرجع جهة العمل" : "Employer Reference"}>
              <TextInput placeholder={isAr ? "اسم الشركة / رقم الموظف" : "Company name / employee ID"} value={employerRef} onChange={(e) => setEmployerRef(e.target.value)} />
            </FormField>
            <FormField label={isAr ? "الحجم الشهري المتوقع" : "Expected Monthly Volume"} required>
              <SelectInput options={MONTHLY_VOLUMES} placeholder={isAr ? "اختر النطاق" : "Select range"} value={monthlyVolume} onChange={(e) => setMonthlyVolume(e.target.value)} />
            </FormField>
          </div>
        </SectionCard>

        <div className="space-y-5">
          {/* Services & Compliance */}
          <SectionCard title={isAr ? "الخدمات والامتثال" : "Services & Compliance"} icon="ri-shield-check-line">
            <div className="space-y-4">
              {/* International Transfer toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl border" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: intlTransfer ? "rgba(34,211,238,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${intlTransfer ? "rgba(34,211,238,0.3)" : "rgba(255,255,255,0.08)"}` }}>
                    <i className="ri-send-plane-line text-sm" style={{ color: intlTransfer ? "#22D3EE" : "#6B7280" }} />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{isAr ? "التحويل الدولي" : "International Transfer"}</p>
                    <p className="text-gray-500 text-xs">{isAr ? "تفعيل خدمة التحويل الدولي" : "Enable international transfer service"}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIntlTransfer((v) => !v)}
                  className="relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer flex-shrink-0"
                  style={{ background: intlTransfer ? "#22D3EE" : "rgba(255,255,255,0.1)" }}
                >
                  <div
                    className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300"
                    style={{ background: "#fff", left: intlTransfer ? "calc(100% - 22px)" : "2px" }}
                  />
                </button>
              </div>

              <FormField label={isAr ? "شخص مُعرَّض سياسياً (PEP)؟" : "Politically Exposed Person (PEP)?"} required>
                <RadioGroup
                  name="pep"
                  options={[
                    { value: "no",  label: isAr ? "لا" : "No" },
                    { value: "yes", label: isAr ? "نعم" : "Yes" },
                  ]}
                  value={pep}
                  onChange={setPep}
                />
              </FormField>

              {pep === "yes" && (
                <div className="flex items-start gap-3 px-4 py-3 rounded-xl border" style={{ background: "rgba(248,113,113,0.06)", borderColor: "rgba(248,113,113,0.25)" }}>
                  <i className="ri-alert-line text-red-400 text-sm mt-0.5 flex-shrink-0" />
                  <p className="text-gray-400 text-xs">
                    {isAr ? "تنبيه: يتطلب فتح حساب PEP موافقة إدارة الامتثال." : "Alert: PEP account opening requires Compliance Management approval."}
                  </p>
                </div>
              )}

              {/* Auto Risk Level */}
              <div className="p-4 rounded-xl border" style={{ background: "rgba(34,211,238,0.04)", borderColor: "rgba(34,211,238,0.15)" }}>
                <p className="text-gray-500 text-xs mb-2">{isAr ? "مستوى المخاطر التلقائي" : "Auto Risk Level"}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: riskWidths[riskLevel], background: riskColors[riskLevel] }}
                    />
                  </div>
                  <span className="text-xs font-bold font-['JetBrains_Mono']" style={{ color: riskColors[riskLevel] }}>
                    {riskLabels[riskLevel]}
                  </span>
                </div>
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
      </div>

      <PersonalDetailsSection data={personal} onChange={(k, v) => setPersonal((p) => ({ ...p, [k]: v }))} isAr={isAr} autoFilled={autoFilled} />
      <FormActions onCancel={onCancel} onSave={handleSave} saveLabel={isAr ? "فتح الحساب" : "Open Account"} isAr={isAr} saving={saving} />
    </div>
  );
};

export default AccountOpenedForm;
