import { useState } from "react";
import {
  SectionCard, FormField, TextInput, SelectInput, RadioGroup, FormActions,
  ScannerWidget, COUNTRIES, DOC_TYPES, GENDERS,
} from "@/pages/dashboard/hotel-events/components/FormComponents";
import EmpConfirmation from "./components/EmpConfirmation";

interface Props { isAr: boolean; onCancel: () => void; }

const SECTORS = [
  { value: "oil_gas", label: "Oil & Gas / النفط والغاز" },
  { value: "construction", label: "Construction / البناء والإنشاء" },
  { value: "hospitality", label: "Hospitality / الضيافة والسياحة" },
  { value: "retail", label: "Retail / التجزئة" },
  { value: "healthcare", label: "Healthcare / الرعاية الصحية" },
  { value: "education", label: "Education / التعليم" },
  { value: "it", label: "Information Technology / تقنية المعلومات" },
  { value: "finance", label: "Finance & Banking / المالية والمصرفية" },
  { value: "transport", label: "Transport & Logistics / النقل واللوجستيات" },
  { value: "manufacturing", label: "Manufacturing / التصنيع" },
  { value: "agriculture", label: "Agriculture / الزراعة" },
  { value: "other", label: "Other / أخرى" },
];

const SALARY_BANDS = [
  { value: "below_200", label: "Below 200 OMR" },
  { value: "200_400", label: "200 – 400 OMR" },
  { value: "400_700", label: "400 – 700 OMR" },
  { value: "700_1200", label: "700 – 1,200 OMR" },
  { value: "1200_2500", label: "1,200 – 2,500 OMR" },
  { value: "above_2500", label: "Above 2,500 OMR" },
];

const QUALIFICATIONS = [
  { value: "none", label: "No Formal Education / بدون تعليم رسمي" },
  { value: "primary", label: "Primary School / ابتدائي" },
  { value: "secondary", label: "Secondary School / ثانوي" },
  { value: "diploma", label: "Diploma / دبلوم" },
  { value: "bachelor", label: "Bachelor's Degree / بكالوريوس" },
  { value: "master", label: "Master's Degree / ماجستير" },
  { value: "phd", label: "PhD / دكتوراه" },
  { value: "vocational", label: "Vocational Training / تدريب مهني" },
];

const WorkPermitForm = ({ isAr, onCancel }: Props) => {
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [scannerConnected] = useState(true);
  const [autoFilled, setAutoFilled] = useState(false);

  // Ministry feed fields
  const [permitNumber, setPermitNumber] = useState("");
  const [employerName, setEmployerName] = useState("");
  const [crNumber, setCrNumber] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [sector, setSector] = useState("");
  const [salaryBand, setSalaryBand] = useState("");
  const [permitStart, setPermitStart] = useState("");
  const [permitEnd, setPermitEnd] = useState("");
  const [sponsorName, setSponsorName] = useState("");

  // Travel doc
  const [docType, setDocType] = useState("");
  const [docNumber, setDocNumber] = useState("");
  const [issuingCountry, setIssuingCountry] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [issuingAuthority, setIssuingAuthority] = useState("");

  // Personal
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [nationality, setNationality] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [qualification, setQualification] = useState("");
  const [prevEmploymentCountry, setPrevEmploymentCountry] = useState("");

  const handleScan = () => {
    setAutoFilled(true);
    setDocType("passport"); setDocNumber("IN-7734-K"); setIssuingCountry("IN");
    setIssueDate("2020-05-10"); setExpiryDate("2030-05-09"); setIssuingAuthority("Govt of India");
    setFirstName("Rajesh"); setLastName("Kumar"); setGender("male");
    setDob("1990-03-14"); setNationality("IN"); setEmail("rajesh.kumar@email.com"); setPhone("+968 9234 5678");
  };

  const handleSubmit = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setSubmitted(true); }, 1400);
  };

  if (submitted) return <EmpConfirmation isAr={isAr} onReset={() => setSubmitted(false)} eventLabel="Work Permit Issued" eventLabelAr="تصريح عمل صادر" eventColor="#22D3EE" eventIcon="ri-briefcase-line" />;

  const docTypeOpts = DOC_TYPES.map((d) => ({ value: d.value, label: isAr ? (d.value === "passport" ? "جواز سفر" : d.value === "national_id" ? "بطاقة هوية" : d.value === "resident_card" ? "بطاقة إقامة" : "هوية خليجية") : d.label }));
  const genderOpts = GENDERS.map((g) => ({ value: g.value, label: isAr ? (g.value === "male" ? "ذكر" : "أنثى") : g.label }));

  return (
    <div className="space-y-5">
      {/* Ministry feed note */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl border" style={{ background: "rgba(34,211,238,0.04)", borderColor: "rgba(34,211,238,0.15)" }}>
        <i className="ri-government-line text-cyan-400 text-sm mt-0.5 flex-shrink-0" />
        <p className="text-gray-400 text-xs">
          {isAr
            ? "هذا الحدث يُستقبل من تغذية API لوزارة العمل. يمكن أيضاً إدخاله يدوياً من قِبل صاحب العمل المسجّل."
            : "This event is received from the Ministry of Labour API feed. Can also be entered manually by a registered employer."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Ministry / Permit Info */}
        <SectionCard title={isAr ? "معلومات التصريح" : "Permit Information"} icon="ri-briefcase-line">
          <div className="space-y-4">
            <FormField label={isAr ? "رقم التصريح" : "Permit Number"} required>
              <TextInput placeholder="WP-XXXX-XXXXXXXX" value={permitNumber} onChange={(e) => setPermitNumber(e.target.value)} className="font-['JetBrains_Mono']" />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "اسم صاحب العمل" : "Employer Name"} required>
                <TextInput placeholder={isAr ? "اسم الشركة" : "Company name"} value={employerName} onChange={(e) => setEmployerName(e.target.value)} />
              </FormField>
              <FormField label={isAr ? "رقم السجل التجاري" : "CR Number"} required>
                <TextInput placeholder="CR-XXXXXXXX" value={crNumber} onChange={(e) => setCrNumber(e.target.value)} className="font-['JetBrains_Mono']" />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "المسمى الوظيفي" : "Job Title"} required>
                <TextInput placeholder={isAr ? "المسمى الوظيفي" : "e.g. Civil Engineer"} value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
              </FormField>
              <FormField label={isAr ? "القطاع" : "Sector"} required>
                <SelectInput options={SECTORS} placeholder={isAr ? "اختر القطاع" : "Select sector"} value={sector} onChange={(e) => setSector(e.target.value)} />
              </FormField>
            </div>
            <FormField label={isAr ? "الفئة الراتبية" : "Salary Band"} required>
              <SelectInput options={SALARY_BANDS} placeholder={isAr ? "اختر الفئة" : "Select band"} value={salaryBand} onChange={(e) => setSalaryBand(e.target.value)} />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "تاريخ البدء" : "Permit Start"} required>
                <TextInput type="date" value={permitStart} onChange={(e) => setPermitStart(e.target.value)} />
              </FormField>
              <FormField label={isAr ? "تاريخ الانتهاء" : "Permit End"} required>
                <TextInput type="date" value={permitEnd} onChange={(e) => setPermitEnd(e.target.value)} />
              </FormField>
            </div>
            <FormField label={isAr ? "اسم الكفيل" : "Sponsor Name"} required>
              <TextInput placeholder={isAr ? "اسم الكفيل" : "Sponsor full name"} value={sponsorName} onChange={(e) => setSponsorName(e.target.value)} />
            </FormField>
          </div>
        </SectionCard>

        {/* Travel Doc */}
        <SectionCard title={isAr ? "وثيقة السفر" : "Travel Document"} icon="ri-passport-line">
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
            <FormField label={isAr ? "دولة الإصدار" : "Issuing Country"} required>
              <SelectInput options={COUNTRIES} placeholder={isAr ? "اختر" : "Select"} value={issuingCountry} onChange={(e) => setIssuingCountry(e.target.value)} />
            </FormField>
            <FormField label={isAr ? "جهة الإصدار" : "Issuing Authority"}>
              <TextInput placeholder={isAr ? "جهة الإصدار" : "e.g. Ministry of Interior"} value={issuingAuthority} onChange={(e) => setIssuingAuthority(e.target.value)} autoFilled={autoFilled && !!issuingAuthority} />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "تاريخ الإصدار" : "Issue Date"} required>
                <TextInput type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} autoFilled={autoFilled && !!issueDate} />
              </FormField>
              <FormField label={isAr ? "تاريخ الانتهاء" : "Expiry Date"} required>
                <TextInput type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} autoFilled={autoFilled && !!expiryDate} />
              </FormField>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Personal Details */}
      <SectionCard title={isAr ? "البيانات الشخصية" : "Personal Details"} icon="ri-user-line">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormField label={isAr ? "الاسم الأول" : "First Name"} required>
            <TextInput placeholder={isAr ? "الاسم الأول" : "First name"} value={firstName} onChange={(e) => setFirstName(e.target.value)} autoFilled={autoFilled && !!firstName} />
          </FormField>
          <FormField label={isAr ? "اسم العائلة" : "Last Name"} required>
            <TextInput placeholder={isAr ? "اسم العائلة" : "Last name"} value={lastName} onChange={(e) => setLastName(e.target.value)} autoFilled={autoFilled && !!lastName} />
          </FormField>
          <FormField label={isAr ? "تاريخ الميلاد" : "Date of Birth"} required>
            <TextInput type="date" value={dob} onChange={(e) => setDob(e.target.value)} autoFilled={autoFilled && !!dob} />
          </FormField>
          <FormField label={isAr ? "الجنسية" : "Nationality"} required>
            <SelectInput options={COUNTRIES} placeholder={isAr ? "اختر" : "Select"} value={nationality} onChange={(e) => setNationality(e.target.value)} />
          </FormField>
          <FormField label={isAr ? "الجنس" : "Gender"} required className="sm:col-span-2 lg:col-span-1">
            <RadioGroup name="gender" options={genderOpts} value={gender} onChange={setGender} />
          </FormField>
          <FormField label={isAr ? "البريد الإلكتروني" : "Email"}>
            <TextInput type="email" placeholder="name@email.com" value={email} onChange={(e) => setEmail(e.target.value)} autoFilled={autoFilled && !!email} />
          </FormField>
          <FormField label={isAr ? "رقم الهاتف" : "Phone"} required>
            <TextInput type="tel" placeholder="+968 XXXX XXXX" value={phone} onChange={(e) => setPhone(e.target.value)} autoFilled={autoFilled && !!phone} />
          </FormField>
          <FormField label={isAr ? "المؤهل العلمي" : "Qualification"} required>
            <SelectInput options={QUALIFICATIONS} placeholder={isAr ? "اختر" : "Select"} value={qualification} onChange={(e) => setQualification(e.target.value)} />
          </FormField>
          <FormField label={isAr ? "دولة العمل السابقة" : "Previous Employment Country"}>
            <SelectInput options={[{ value: "none", label: isAr ? "لا يوجد" : "None / First Job" }, ...COUNTRIES]} placeholder={isAr ? "اختر" : "Select"} value={prevEmploymentCountry} onChange={(e) => setPrevEmploymentCountry(e.target.value)} />
          </FormField>
        </div>
      </SectionCard>

      <FormActions isAr={isAr} onCancel={onCancel} onSave={handleSubmit} saving={saving} saveLabel={isAr ? "تسجيل التصريح" : "Register Permit"} />
    </div>
  );
};

export default WorkPermitForm;
