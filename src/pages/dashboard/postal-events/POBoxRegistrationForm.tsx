import { useState } from "react";
import { SectionCard, FormField, TextInput, SelectInput, FormActions, ScannerWidget, COUNTRIES, DOC_TYPES, GENDERS } from "@/pages/dashboard/hotel-events/components/FormComponents";
import PstConfirmation from "./components/PstConfirmation";

interface Props { isAr: boolean; onCancel: () => void; }

const BOX_SIZES = [
  { value: "small", label: "Small (S) — Standard letters" },
  { value: "medium", label: "Medium (M) — Parcels up to 2kg" },
  { value: "large", label: "Large (L) — Parcels up to 10kg" },
  { value: "xlarge", label: "Extra Large (XL) — Bulk / Business" },
];

const DURATIONS = [
  { value: "6m", label: "6 Months" }, { value: "1y", label: "1 Year" },
  { value: "2y", label: "2 Years" }, { value: "3y", label: "3 Years" },
];

const BRANCHES = [
  { value: "central", label: "Central Post Office" }, { value: "north", label: "Northern Branch" },
  { value: "south", label: "Southern Branch" }, { value: "east", label: "Eastern Branch" },
  { value: "west", label: "Western Branch" },
];

const genRef = () => {
  const seq = Math.floor(Math.random() * 9000) + 1000;
  return `AMN-PST-${seq}`;
};

const POBoxRegistrationForm = ({ isAr, onCancel }: Props) => {
  const [boxNumber, setBoxNumber] = useState("");
  const [boxSize, setBoxSize] = useState("");
  const [duration, setDuration] = useState("");
  const [branch, setBranch] = useState("");
  const [docType, setDocType] = useState("");
  const [docNumber, setDocNumber] = useState("");
  const [docExpiry, setDocExpiry] = useState("");
  const [nationality, setNationality] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [refCode, setRefCode] = useState("");

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setRefCode(genRef()); setConfirmed(true); }, 1500);
  };

  if (confirmed) return (
    <PstConfirmation refNumber={refCode} eventType={isAr ? "تسجيل صندوق بريد" : "PO Box Registration"} eventCode="AMN-PST-POBOX" color="#D4A84B" isAr={isAr} onReset={() => setConfirmed(false)} />
  );

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Box Details */}
        <SectionCard title={isAr ? "تفاصيل صندوق البريد" : "PO Box Details"} icon="ri-mail-line" accentColor="#D4A84B">
          <div className="space-y-4">
            <FormField label={isAr ? "رقم الصندوق" : "Box Number"} required>
              <TextInput placeholder="PO-XXXXX" value={boxNumber} onChange={(e) => setBoxNumber(e.target.value)} className="font-['JetBrains_Mono']" />
            </FormField>
            <FormField label={isAr ? "حجم الصندوق" : "Box Size"} required>
              <SelectInput options={BOX_SIZES} placeholder={isAr ? "اختر الحجم" : "Select size"} value={boxSize} onChange={(e) => setBoxSize(e.target.value)} />
            </FormField>
            <FormField label={isAr ? "مدة الاشتراك" : "Subscription Duration"} required>
              <SelectInput options={DURATIONS} placeholder={isAr ? "اختر المدة" : "Select duration"} value={duration} onChange={(e) => setDuration(e.target.value)} />
            </FormField>
            <FormField label={isAr ? "فرع مكتب البريد" : "Post Office Branch"} required>
              <SelectInput options={BRANCHES} placeholder={isAr ? "اختر الفرع" : "Select branch"} value={branch} onChange={(e) => setBranch(e.target.value)} />
            </FormField>
          </div>
        </SectionCard>

        {/* Travel Document */}
        <SectionCard title={isAr ? "وثيقة السفر" : "Travel Document"} icon="ri-passport-line">
          <div className="space-y-4">
            <ScannerWidget connected={true} onScan={() => {}} isAr={isAr} />
            <FormField label={isAr ? "نوع الوثيقة" : "Document Type"} required>
              <SelectInput options={DOC_TYPES} placeholder={isAr ? "اختر النوع" : "Select type"} value={docType} onChange={(e) => setDocType(e.target.value)} />
            </FormField>
            <FormField label={isAr ? "رقم الوثيقة" : "Document Number"} required>
              <TextInput placeholder="XXXXXXXXX" value={docNumber} onChange={(e) => setDocNumber(e.target.value)} className="font-['JetBrains_Mono']" />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "تاريخ الانتهاء" : "Expiry Date"} required>
                <TextInput type="date" value={docExpiry} onChange={(e) => setDocExpiry(e.target.value)} />
              </FormField>
              <FormField label={isAr ? "الجنسية" : "Nationality"} required>
                <SelectInput options={COUNTRIES} placeholder={isAr ? "اختر" : "Select"} value={nationality} onChange={(e) => setNationality(e.target.value)} />
              </FormField>
            </div>
          </div>
        </SectionCard>

        {/* Personal Details */}
        <SectionCard title={isAr ? "البيانات الشخصية" : "Personal Details"} icon="ri-user-line">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "الاسم الأول" : "First Name"} required>
                <TextInput placeholder={isAr ? "الاسم الأول" : "First name"} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </FormField>
              <FormField label={isAr ? "اسم العائلة" : "Last Name"} required>
                <TextInput placeholder={isAr ? "اسم العائلة" : "Last name"} value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "الجنس" : "Gender"} required>
                <SelectInput options={GENDERS} placeholder={isAr ? "اختر" : "Select"} value={gender} onChange={(e) => setGender(e.target.value)} />
              </FormField>
              <FormField label={isAr ? "تاريخ الميلاد" : "Date of Birth"} required>
                <TextInput type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
              </FormField>
            </div>
            <FormField label={isAr ? "رقم الهاتف" : "Phone Number"} required>
              <TextInput type="tel" placeholder="+XXX XXXX XXXX" value={phone} onChange={(e) => setPhone(e.target.value)} className="font-['JetBrains_Mono']" />
            </FormField>
            <FormField label={isAr ? "البريد الإلكتروني" : "Email Address"}>
              <TextInput type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormField>
          </div>
        </SectionCard>

        {/* Summary */}
        <SectionCard title={isAr ? "ملخص التسجيل" : "Registration Summary"} icon="ri-file-list-3-line">
          <div className="space-y-3">
            {[
              { label: isAr ? "رقم الصندوق" : "Box Number", value: boxNumber || "—" },
              { label: isAr ? "الحجم" : "Size", value: BOX_SIZES.find(s => s.value === boxSize)?.label || "—" },
              { label: isAr ? "المدة" : "Duration", value: DURATIONS.find(d => d.value === duration)?.label || "—" },
              { label: isAr ? "الفرع" : "Branch", value: BRANCHES.find(b => b.value === branch)?.label || "—" },
              { label: isAr ? "الاسم" : "Name", value: firstName && lastName ? `${firstName} ${lastName}` : "—" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="text-gray-500 text-xs">{row.label}</span>
                <span className="text-white text-xs font-semibold font-['JetBrains_Mono']">{row.value}</span>
              </div>
            ))}
            <div className="flex items-start gap-3 px-3 py-3 rounded-lg mt-2" style={{ background: "rgba(181,142,60,0.04)", border: "1px solid rgba(181,142,60,0.15)" }}>
              <i className="ri-shield-check-line text-gold-400 text-sm mt-0.5 flex-shrink-0" />
              <p className="text-gray-400 text-xs">{isAr ? "سيتم ربط صندوق البريد بوثيقة السفر في قاعدة بيانات Al-Ameen." : "PO Box will be linked to the travel document in the Al-Ameen database."}</p>
            </div>
          </div>
        </SectionCard>
      </div>
      <FormActions onCancel={onCancel} onSave={handleSave} saveLabel={isAr ? "تسجيل صندوق البريد" : "Register PO Box"} isAr={isAr} saving={saving} />
    </div>
  );
};

export default POBoxRegistrationForm;
