import { useState } from "react";
import { SectionCard, FormField, TextInput, SelectInput, RadioGroup, FormActions, ScannerWidget, COUNTRIES, DOC_TYPES, GENDERS } from "@/pages/dashboard/hotel-events/components/FormComponents";
import EduConfirmation from "./components/EduConfirmation";

interface Props { isAr: boolean; onCancel: () => void; }

const INSTITUTIONS = [
  { value: "nat_univ", label: "National University" }, { value: "tech_college", label: "National Technical College" },
  { value: "applied_sci", label: "University of Applied Sciences" }, { value: "med_college", label: "College of Medicine" },
  { value: "business_school", label: "National Business School" }, { value: "arts_college", label: "College of Arts & Humanities" },
];

const PROGRAMS = [
  { value: "bsc_cs", label: "BSc Computer Science" }, { value: "bsc_eng", label: "BSc Engineering" },
  { value: "bsc_bus", label: "BSc Business Administration" }, { value: "bsc_med", label: "MBBS Medicine" },
  { value: "bsc_law", label: "LLB Law" }, { value: "msc_cs", label: "MSc Computer Science" },
  { value: "mba", label: "MBA" }, { value: "phd", label: "PhD" }, { value: "diploma", label: "Diploma" },
];

const FACULTIES = [
  { value: "science", label: "Faculty of Science" }, { value: "engineering", label: "Faculty of Engineering" },
  { value: "business", label: "Faculty of Business" }, { value: "medicine", label: "Faculty of Medicine" },
  { value: "law", label: "Faculty of Law" }, { value: "arts", label: "Faculty of Arts" },
];

const STUDY_MODES = [{ value: "ft", label: "Full-Time" }, { value: "pt", label: "Part-Time" }];

const genRef = () => `AMN-EDU-${Math.floor(Math.random() * 9000) + 1000}`;

const StudentEnrollmentForm = ({ isAr, onCancel }: Props) => {
  const [institution, setInstitution] = useState("");
  const [program, setProgram] = useState("");
  const [faculty, setFaculty] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [studyMode, setStudyMode] = useState("ft");
  const [scholarship, setScholarship] = useState("no");
  const [housing, setHousing] = useState("no");
  const [docType, setDocType] = useState("");
  const [docNumber, setDocNumber] = useState("");
  const [docExpiry, setDocExpiry] = useState("");
  const [nationality, setNationality] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [refCode, setRefCode] = useState("");

  const handleSave = () => { setSaving(true); setTimeout(() => { setSaving(false); setRefCode(genRef()); setConfirmed(true); }, 1500); };

  if (confirmed) return <EduConfirmation refNumber={refCode} eventType={isAr ? "تسجيل طالب" : "Student Enrollment"} eventCode="AMN-EDU-ENR" color="#A78BFA" isAr={isAr} onReset={() => setConfirmed(false)} />;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <SectionCard title={isAr ? "تفاصيل التسجيل" : "Enrollment Details"} icon="ri-graduation-cap-line" accentColor="#A78BFA">
          <div className="space-y-4">
            <FormField label={isAr ? "المؤسسة التعليمية" : "Institution"} required>
              <SelectInput options={INSTITUTIONS} placeholder={isAr ? "اختر المؤسسة" : "Select institution"} value={institution} onChange={(e) => setInstitution(e.target.value)} />
            </FormField>
            <FormField label={isAr ? "البرنامج الدراسي" : "Program"} required>
              <SelectInput options={PROGRAMS} placeholder={isAr ? "اختر البرنامج" : "Select program"} value={program} onChange={(e) => setProgram(e.target.value)} />
            </FormField>
            <FormField label={isAr ? "الكلية / القسم" : "Faculty / Department"} required>
              <SelectInput options={FACULTIES} placeholder={isAr ? "اختر الكلية" : "Select faculty"} value={faculty} onChange={(e) => setFaculty(e.target.value)} />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "تاريخ البدء" : "Start Date"} required>
                <TextInput type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </FormField>
              <FormField label={isAr ? "تاريخ الانتهاء المتوقع" : "Expected End Date"}>
                <TextInput type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </FormField>
            </div>
            <FormField label={isAr ? "نظام الدراسة" : "Study Mode"} required>
              <RadioGroup name="studyMode" options={STUDY_MODES} value={studyMode} onChange={setStudyMode} />
            </FormField>
            <FormField label={isAr ? "منحة دراسية" : "Scholarship"}>
              <RadioGroup name="scholarship" options={[{ value: "yes", label: isAr ? "نعم" : "Yes" }, { value: "no", label: isAr ? "لا" : "No" }]} value={scholarship} onChange={setScholarship} />
            </FormField>
            <FormField label={isAr ? "سكن الحرم الجامعي" : "Campus Housing"}>
              <RadioGroup name="housing" options={[{ value: "yes", label: isAr ? "نعم — سكن جامعي" : "Yes — Campus" }, { value: "no", label: isAr ? "لا — خارجي" : "No — External" }]} value={housing} onChange={setHousing} />
            </FormField>
          </div>
        </SectionCard>

        <div className="space-y-5">
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
            </div>
          </SectionCard>
        </div>
      </div>
      <FormActions onCancel={onCancel} onSave={handleSave} saveLabel={isAr ? "تسجيل الطالب" : "Submit Enrollment"} isAr={isAr} saving={saving} />
    </div>
  );
};

export default StudentEnrollmentForm;
