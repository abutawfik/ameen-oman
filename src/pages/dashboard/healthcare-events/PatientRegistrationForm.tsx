import { useState } from "react";
import {
  SectionCard, FormField, TextInput, SelectInput, RadioGroup, TipBanner, FormActions, BRANCHES, COUNTRIES,
} from "@/pages/dashboard/hotel-events/components/FormComponents";
import TravelDocSection, { type TravelDocData } from "@/pages/dashboard/hotel-events/components/TravelDocSection";
import PersonalDetailsSection, { type PersonalData } from "@/pages/dashboard/hotel-events/components/PersonalDetailsSection";
import HltConfirmation from "./components/HltConfirmation";

const DEPARTMENTS = [
  { value: "general",    label: "General Medicine",    labelAr: "الطب العام" },
  { value: "emergency",  label: "Emergency",           labelAr: "الطوارئ" },
  { value: "cardiology", label: "Cardiology",          labelAr: "أمراض القلب" },
  { value: "orthopedics",label: "Orthopedics",         labelAr: "العظام" },
  { value: "pediatrics", label: "Pediatrics",          labelAr: "طب الأطفال" },
  { value: "obstetrics", label: "Obstetrics & Gynecology", labelAr: "النساء والولادة" },
  { value: "neurology",  label: "Neurology",           labelAr: "الأعصاب" },
  { value: "oncology",   label: "Oncology",            labelAr: "الأورام" },
  { value: "radiology",  label: "Radiology",           labelAr: "الأشعة" },
  { value: "surgery",    label: "Surgery",             labelAr: "الجراحة" },
];

const INSURANCE_PROVIDERS = [
  { value: "national",   label: "National Health Insurance" },
  { value: "private_a",  label: "Private Insurance — Plan A" },
  { value: "private_b",  label: "Private Insurance — Plan B" },
  { value: "corporate",  label: "Corporate Insurance" },
  { value: "self_pay",   label: "Self-Pay / No Insurance" },
  { value: "government", label: "Government Coverage" },
];

const REFERRAL_SOURCES = [
  { value: "self",       label: "Self-Referred",       labelAr: "مراجعة ذاتية" },
  { value: "gp",         label: "General Practitioner",labelAr: "طبيب عام" },
  { value: "specialist", label: "Specialist",          labelAr: "أخصائي" },
  { value: "emergency",  label: "Emergency Services",  labelAr: "خدمات الطوارئ" },
  { value: "clinic",     label: "Clinic / Polyclinic", labelAr: "عيادة / مركز صحي" },
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

const PatientRegistrationForm = ({ isAr, onCancel }: Props) => {
  const [facility, setFacility] = useState("");
  const [department, setDepartment] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [referredBy, setReferredBy] = useState("");
  const [insuranceProvider, setInsuranceProvider] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [emergencyContactRelation, setEmergencyContactRelation] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [allergies, setAllergies] = useState("");
  const [personal, setPersonal] = useState<PersonalData>(emptyPersonal());
  const [doc, setDoc] = useState<TravelDocData>(emptyDoc());
  const [autoFilled, setAutoFilled] = useState(false);
  const [scannerConnected] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  const handleScan = () => {
    setDoc({ holderStatus: "primary", docType: "national_id", docNumber: "NID-88234567", issuingCountry: "SA", placeOfIssue: "Capital City", issuingAuthority: "National Authority", issueDate: "2021-05-10", expiryDate: "2031-05-09" });
    setPersonal({ firstName: "Nasser", lastName: "Al-Balushi", gender: "male", dob: "1978-11-22", nationality: "SA", placeOfBirth: "Capital City", countryOfResidence: "SA", email: "nasser.balushi@email.com", primaryContact: "+XXX 9123 4567", secondaryContact: "" });
    setAutoFilled(true);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setRefNumber(`AMN-HLT-${Date.now()}-${Math.floor(Math.random() * 9000) + 1000}`);
      setConfirmed(true);
    }, 1800);
  };

  if (confirmed) return <HltConfirmation refNumber={refNumber} eventType={isAr ? "تسجيل مريض" : "Patient Registration"} eventCode="HLT_PATIENT" color="#C94A5E" isAr={isAr} onReset={() => { setConfirmed(false); setAutoFilled(false); }} />;

  return (
    <div className="space-y-5">
      <TipBanner text={isAr ? "تأكد من صحة بيانات الهوية والتأمين قبل تسجيل المريض." : "Verify identity and insurance details before registering the patient."} color="cyan" />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Event Info */}
        <SectionCard title={isAr ? "معلومات الزيارة" : "Visit Information"} icon="ri-hospital-line" accentColor="#C94A5E">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "المنشأة الصحية" : "Health Facility"} required>
                <SelectInput options={BRANCHES} placeholder={isAr ? "اختر المنشأة" : "Select facility"} value={facility} onChange={(e) => setFacility(e.target.value)} />
              </FormField>
              <FormField label={isAr ? "القسم" : "Department"} required>
                <SelectInput options={DEPARTMENTS.map(d => ({ value: d.value, label: isAr ? d.labelAr : d.label }))} placeholder={isAr ? "اختر القسم" : "Select dept"} value={department} onChange={(e) => setDepartment(e.target.value)} />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "تاريخ الزيارة" : "Visit Date"} required>
                <TextInput type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} />
              </FormField>
              <FormField label={isAr ? "مصدر الإحالة" : "Referred By"} required>
                <SelectInput options={REFERRAL_SOURCES.map(r => ({ value: r.value, label: isAr ? r.labelAr : r.label }))} placeholder={isAr ? "اختر" : "Select"} value={referredBy} onChange={(e) => setReferredBy(e.target.value)} />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "فصيلة الدم" : "Blood Type"}>
                <SelectInput
                  options={["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(b => ({ value: b, label: b }))}
                  placeholder={isAr ? "اختر" : "Select"}
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                />
              </FormField>
              <FormField label={isAr ? "الحساسية المعروفة" : "Known Allergies"}>
                <TextInput placeholder={isAr ? "مثال: البنسلين" : "e.g. Penicillin"} value={allergies} onChange={(e) => setAllergies(e.target.value)} />
              </FormField>
            </div>
          </div>
        </SectionCard>

        {/* Insurance */}
        <SectionCard title={isAr ? "التأمين وجهة الاتصال الطارئة" : "Insurance & Emergency Contact"} icon="ri-shield-cross-line">
          <div className="space-y-4">
            <FormField label={isAr ? "مزود التأمين" : "Insurance Provider"} required>
              <SelectInput options={INSURANCE_PROVIDERS} placeholder={isAr ? "اختر المزود" : "Select provider"} value={insuranceProvider} onChange={(e) => setInsuranceProvider(e.target.value)} />
            </FormField>
            {insuranceProvider && insuranceProvider !== "self_pay" && (
              <FormField label={isAr ? "رقم الوثيقة" : "Policy Number"} required>
                <TextInput placeholder="POL-XXXXXXXXXX" value={policyNumber} onChange={(e) => setPolicyNumber(e.target.value)} className="font-['JetBrains_Mono']" />
              </FormField>
            )}
            <div className="border-t pt-4" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <p className="text-gray-400 text-xs mb-3 uppercase tracking-wide font-['Inter']">{isAr ? "جهة الاتصال في حالات الطوارئ" : "Emergency Contact"}</p>
              <div className="space-y-3">
                <FormField label={isAr ? "الاسم الكامل" : "Full Name"} required>
                  <TextInput placeholder={isAr ? "الاسم" : "Name"} value={emergencyContactName} onChange={(e) => setEmergencyContactName(e.target.value)} />
                </FormField>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label={isAr ? "رقم الهاتف" : "Phone"} required>
                    <TextInput type="tel" placeholder="+XXX XXXX XXXX" value={emergencyContactPhone} onChange={(e) => setEmergencyContactPhone(e.target.value)} className="font-['JetBrains_Mono']" />
                  </FormField>
                  <FormField label={isAr ? "صلة القرابة" : "Relationship"} required>
                    <SelectInput
                      options={[
                        { value: "spouse",  label: isAr ? "زوج/زوجة" : "Spouse" },
                        { value: "parent",  label: isAr ? "والد/والدة" : "Parent" },
                        { value: "child",   label: isAr ? "ابن/ابنة" : "Child" },
                        { value: "sibling", label: isAr ? "أخ/أخت" : "Sibling" },
                        { value: "other",   label: isAr ? "أخرى" : "Other" },
                      ]}
                      placeholder={isAr ? "اختر" : "Select"}
                      value={emergencyContactRelation}
                      onChange={(e) => setEmergencyContactRelation(e.target.value)}
                    />
                  </FormField>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <TravelDocSection data={doc} onChange={(k, v) => setDoc(d => ({ ...d, [k]: v }))} isAr={isAr} scannerConnected={scannerConnected} autoFilled={autoFilled} onScan={handleScan} />
        <PersonalDetailsSection data={personal} onChange={(k, v) => setPersonal(p => ({ ...p, [k]: v }))} isAr={isAr} autoFilled={autoFilled} />
      </div>

      <FormActions onCancel={onCancel} onSave={handleSave} saveLabel={isAr ? "تسجيل المريض" : "Register Patient"} isAr={isAr} saving={saving} />
    </div>
  );
};

export default PatientRegistrationForm;
