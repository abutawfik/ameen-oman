import { useState } from "react";
import {
  SectionCard, FormField, TextInput, SelectInput, RadioGroup, FormActions,
  ScannerWidget, COUNTRIES, DOC_TYPES,
} from "@/pages/dashboard/hotel-events/components/FormComponents";
import UtilConfirmation from "./components/UtilConfirmation";

interface Props { isAr: boolean; onCancel: () => void; }

const TRANSFER_REASONS = [
  { value: "moved", label: "Moved to New Address / انتقال لعنوان جديد" },
  { value: "name_change", label: "Name Change / تغيير الاسم" },
  { value: "tenant_change", label: "Tenant Change / تغيير المستأجر" },
  { value: "ownership_transfer", label: "Ownership Transfer / نقل الملكية" },
  { value: "marriage", label: "Marriage / زواج" },
  { value: "inheritance", label: "Inheritance / إرث" },
];

interface AccountInfo {
  accountNumber: string;
  holderName: string;
  address: string;
  serviceType: string;
  provider: string;
  status: "active" | "suspended";
}

const MOCK_ACCOUNTS: Record<string, AccountInfo> = {
  "ACC-2024-8821": { accountNumber: "ACC-2024-8821", holderName: "Ahmed Al-Balushi", address: "District 4, Capital Region", serviceType: "Electricity", provider: "National Electric Company", status: "active" },
  "ACC-2023-4412": { accountNumber: "ACC-2023-4412", holderName: "Fatima Al-Zadjali", address: "Central District, Capital Region", serviceType: "Water", provider: "National Water Authority", status: "active" },
  "ACC-2025-1103": { accountNumber: "ACC-2025-1103", holderName: "Raj Patel", address: "Northern Coastal Region", serviceType: "Internet", provider: "Telco A", status: "suspended" },
};

const ServiceTransferForm = ({ isAr, onCancel }: Props) => {
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [scannerConnected] = useState(true);
  const [autoFilled, setAutoFilled] = useState(false);

  const [oldAccount, setOldAccount] = useState("");
  const [oldAccountInfo, setOldAccountInfo] = useState<AccountInfo | null>(null);
  const [lookingUp, setLookingUp] = useState(false);
  const [newAccount, setNewAccount] = useState("");
  const [transferDate, setTransferDate] = useState("");
  const [reason, setReason] = useState("");
  const [differentPerson, setDifferentPerson] = useState("no");

  // New occupant doc
  const [docType, setDocType] = useState("");
  const [docNumber, setDocNumber] = useState("");
  const [issuingCountry, setIssuingCountry] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newNationality, setNewNationality] = useState("");

  const handleLookup = () => {
    setLookingUp(true);
    setTimeout(() => {
      const found = MOCK_ACCOUNTS[oldAccount];
      setOldAccountInfo(found || null);
      setLookingUp(false);
    }, 900);
  };

  const handleScan = () => {
    setAutoFilled(true);
    setDocType("passport"); setDocNumber("P-7734-K"); setIssuingCountry("IN");
    setIssueDate("2019-06-10"); setExpiryDate("2029-06-09");
    setNewFirstName("Priya"); setNewLastName("Sharma"); setNewPhone("+XXX 9876 5432"); setNewNationality("IN");
  };

  const handleSubmit = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setSubmitted(true); }, 1400);
  };

  if (submitted) return <UtilConfirmation isAr={isAr} onReset={() => setSubmitted(false)} eventLabel="Service Transfer" eventLabelAr="نقل الخدمة" eventColor="#D4A84B" />;

  const docTypeOpts = DOC_TYPES.map((d) => ({ value: d.value, label: isAr ? (d.value === "passport" ? "جواز سفر" : d.value === "national_id" ? "بطاقة هوية" : d.value === "resident_card" ? "بطاقة إقامة" : "هوية خليجية") : d.label }));

  return (
    <div className="space-y-5">
      {/* Old Account Lookup */}
      <SectionCard title={isAr ? "الحساب الحالي" : "Current Account"} icon="ri-swap-line">
        <div className="space-y-4">
          <FormField label={isAr ? "رقم الحساب الحالي" : "Current Account Number"} required>
            <div className="flex gap-2">
              <TextInput placeholder="ACC-XXXX-XXXX" value={oldAccount} onChange={(e) => setOldAccount(e.target.value)} className="font-['JetBrains_Mono'] flex-1" />
              <button type="button" onClick={handleLookup}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors"
                style={{ background: "#D4A84B", color: "#0B1220" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#C99C48"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#D4A84B"; }}>
                {lookingUp ? <i className="ri-loader-4-line animate-spin" /> : <i className="ri-search-line" />}
                {isAr ? "بحث" : "Lookup"}
              </button>
            </div>
          </FormField>

          {oldAccountInfo && (
            <div className="rounded-xl border p-4" style={{ background: oldAccountInfo.status === "active" ? "rgba(74,222,128,0.06)" : "rgba(248,113,113,0.06)", borderColor: oldAccountInfo.status === "active" ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.2)" }}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2 h-2 rounded-full ${oldAccountInfo.status === "active" ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
                <span className="text-xs font-bold font-['JetBrains_Mono']" style={{ color: oldAccountInfo.status === "active" ? "#4ADE80" : "#F87171" }}>
                  {oldAccountInfo.status.toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: isAr ? "صاحب الحساب" : "Account Holder", value: oldAccountInfo.holderName },
                  { label: isAr ? "نوع الخدمة" : "Service Type", value: oldAccountInfo.serviceType },
                  { label: isAr ? "المزود" : "Provider", value: oldAccountInfo.provider },
                  { label: isAr ? "العنوان" : "Address", value: oldAccountInfo.address },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-gray-500 text-xs">{item.label}</p>
                    <p className="text-white text-sm font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {oldAccountInfo === null && oldAccount && !lookingUp && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl border" style={{ background: "rgba(248,113,113,0.06)", borderColor: "rgba(248,113,113,0.2)" }}>
              <i className="ri-error-warning-line text-red-400 text-sm" />
              <span className="text-red-400 text-sm">{isAr ? "لم يتم العثور على الحساب" : "Account not found"}</span>
            </div>
          )}
        </div>
      </SectionCard>

      {/* Transfer Details */}
      <SectionCard title={isAr ? "تفاصيل النقل" : "Transfer Details"} icon="ri-arrow-right-line">
        <div className="space-y-4">
          <FormField label={isAr ? "رقم الحساب الجديد" : "New Account Number"} required>
            <TextInput placeholder="ACC-XXXX-XXXX" value={newAccount} onChange={(e) => setNewAccount(e.target.value)} className="font-['JetBrains_Mono']" />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label={isAr ? "تاريخ النقل" : "Transfer Date"} required>
              <TextInput type="date" value={transferDate} onChange={(e) => setTransferDate(e.target.value)} />
            </FormField>
            <FormField label={isAr ? "سبب النقل" : "Transfer Reason"} required>
              <SelectInput options={TRANSFER_REASONS} placeholder={isAr ? "اختر السبب" : "Select reason"} value={reason} onChange={(e) => setReason(e.target.value)} />
            </FormField>
          </div>
          <FormField label={isAr ? "هل المستأجر الجديد شخص مختلف؟" : "Is the new occupant a different person?"} required>
            <RadioGroup name="differentPerson" options={[{ value: "no", label: isAr ? "لا — نفس الشخص" : "No — Same person" }, { value: "yes", label: isAr ? "نعم — شخص مختلف" : "Yes — Different person" }]} value={differentPerson} onChange={setDifferentPerson} />
          </FormField>
        </div>
      </SectionCard>

      {/* New Occupant Doc — only if different person */}
      {differentPerson === "yes" && (
        <SectionCard title={isAr ? "وثيقة المستأجر الجديد" : "New Occupant Document"} icon="ri-passport-line">
          <ScannerWidget connected={scannerConnected} onScan={handleScan} isAr={isAr} />
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "نوع الوثيقة" : "Document Type"} required>
                <SelectInput options={docTypeOpts} placeholder={isAr ? "اختر" : "Select"} value={docType} onChange={(e) => setDocType(e.target.value)} />
              </FormField>
              <FormField label={isAr ? "رقم الوثيقة" : "Document Number"} required>
                <TextInput placeholder="e.g. A12345678" value={docNumber} onChange={(e) => setDocNumber(e.target.value)} autoFilled={autoFilled && !!docNumber} className="font-['JetBrains_Mono']" />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "دولة الإصدار" : "Issuing Country"} required>
                <SelectInput options={COUNTRIES} placeholder={isAr ? "اختر" : "Select"} value={issuingCountry} onChange={(e) => setIssuingCountry(e.target.value)} />
              </FormField>
              <FormField label={isAr ? "الجنسية" : "Nationality"} required>
                <SelectInput options={COUNTRIES} placeholder={isAr ? "اختر" : "Select"} value={newNationality} onChange={(e) => setNewNationality(e.target.value)} />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "تاريخ الإصدار" : "Issue Date"} required>
                <TextInput type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} autoFilled={autoFilled && !!issueDate} />
              </FormField>
              <FormField label={isAr ? "تاريخ الانتهاء" : "Expiry Date"} required>
                <TextInput type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} autoFilled={autoFilled && !!expiryDate} />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "الاسم الأول" : "First Name"} required>
                <TextInput placeholder={isAr ? "الاسم الأول" : "First name"} value={newFirstName} onChange={(e) => setNewFirstName(e.target.value)} autoFilled={autoFilled && !!newFirstName} />
              </FormField>
              <FormField label={isAr ? "اسم العائلة" : "Last Name"} required>
                <TextInput placeholder={isAr ? "اسم العائلة" : "Last name"} value={newLastName} onChange={(e) => setNewLastName(e.target.value)} autoFilled={autoFilled && !!newLastName} />
              </FormField>
            </div>
            <FormField label={isAr ? "رقم الهاتف" : "Phone Number"} required>
              <TextInput type="tel" placeholder="+968 XXXX XXXX" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} autoFilled={autoFilled && !!newPhone} />
            </FormField>
          </div>
        </SectionCard>
      )}

      <FormActions isAr={isAr} onCancel={onCancel} onSave={handleSubmit} saving={saving} saveLabel={isAr ? "تأكيد النقل" : "Confirm Transfer"} />
    </div>
  );
};

export default ServiceTransferForm;
