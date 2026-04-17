import { useState } from "react";
import { SectionCard, FormField, TextInput, SelectInput, RadioGroup, TipBanner, FormActions, COUNTRIES } from "@/pages/dashboard/hotel-events/components/FormComponents";
import TravelDocSection, { type TravelDocData } from "@/pages/dashboard/hotel-events/components/TravelDocSection";
import PersonalDetailsSection, { type PersonalData } from "@/pages/dashboard/hotel-events/components/PersonalDetailsSection";
import MarConfirmation from "./components/MarConfirmation";

const CERT_LEVELS = [{ value: "open_water", label: "Open Water" }, { value: "advanced", label: "Advanced Open Water" }, { value: "rescue", label: "Rescue Diver" }, { value: "divemaster", label: "Divemaster" }, { value: "instructor", label: "Instructor" }];
const CERT_ORGS = [{ value: "PADI", label: "PADI" }, { value: "SSI", label: "SSI" }, { value: "NAUI", label: "NAUI" }, { value: "BSAC", label: "BSAC" }, { value: "CMAS", label: "CMAS" }];
const emptyPersonal = (): PersonalData => ({ firstName: "", lastName: "", gender: "", dob: "", nationality: "", placeOfBirth: "", countryOfResidence: "", email: "", primaryContact: "", secondaryContact: "" });
const emptyDoc = (): TravelDocData => ({ holderStatus: "primary", docType: "", docNumber: "", issuingCountry: "", placeOfIssue: "", issuingAuthority: "", issueDate: "", expiryDate: "" });

interface Props { isAr: boolean; onCancel: () => void; }
const DivingRegistrationForm = ({ isAr, onCancel }: Props) => {
  const [certLevel, setCertLevel] = useState(""); const [certNumber, setCertNumber] = useState(""); const [certOrg, setCertOrg] = useState("");
  const [diveDate, setDiveDate] = useState(""); const [siteGps, setSiteGps] = useState(""); const [siteName, setSiteName] = useState("");
  const [maxDepth, setMaxDepth] = useState(""); const [buddyName, setBuddyName] = useState(""); const [buddyCert, setBuddyCert] = useState("");
  const [diveOperator, setDiveOperator] = useState(""); const [operatorLicense, setOperatorLicense] = useState("");
  const [medicalFit, setMedicalFit] = useState("yes"); const [waiverSigned, setWaiverSigned] = useState("yes");
  const [personal, setPersonal] = useState<PersonalData>(emptyPersonal()); const [doc, setDoc] = useState<TravelDocData>(emptyDoc());
  const [autoFilled, setAutoFilled] = useState(false); const [scannerConnected] = useState(true);
  const [saving, setSaving] = useState(false); const [confirmed, setConfirmed] = useState(false); const [refNumber, setRefNumber] = useState("");

  const handleScan = () => {
    setDoc({ holderStatus: "primary", docType: "passport", docNumber: "P33445566", issuingCountry: "US", placeOfIssue: "New York", issuingAuthority: "US State Dept", issueDate: "2022-02-14", expiryDate: "2032-02-13" });
    setPersonal({ firstName: "Ryan", lastName: "Mitchell", gender: "male", dob: "1991-05-20", nationality: "US", placeOfBirth: "New York", countryOfResidence: "US", email: "ryan.mitchell@email.com", primaryContact: "+XXX 9456 7890", secondaryContact: "" });
    setAutoFilled(true);
  };
  const handleSave = () => { setSaving(true); setTimeout(() => { setSaving(false); setRefNumber(`AMN-MAR-${Date.now()}-${Math.floor(Math.random() * 9000) + 1000}`); setConfirmed(true); }, 1800); };
  if (confirmed) return <MarConfirmation refNumber={refNumber} eventType={isAr ? "تسجيل غوص" : "Diving Registration"} eventCode="MAR_DIVING" color="#C98A1B" isAr={isAr} onReset={() => { setConfirmed(false); setAutoFilled(false); }} />;

  return (
    <div className="space-y-5">
      <TipBanner text={isAr ? "يجب التحقق من شهادة الغوص والصلاحية الطبية قبل التسجيل." : "Diving certification and medical fitness must be verified before registration."} color="amber" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <SectionCard title={isAr ? "تفاصيل الغوص" : "Diving Details"} icon="ri-water-flash-line" accentColor="#C98A1B">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "مستوى الشهادة" : "Cert Level"} required><SelectInput options={CERT_LEVELS} placeholder={isAr ? "اختر" : "Select"} value={certLevel} onChange={(e) => setCertLevel(e.target.value)} /></FormField>
              <FormField label={isAr ? "المنظمة" : "Cert Org"} required><SelectInput options={CERT_ORGS} placeholder={isAr ? "اختر" : "Select"} value={certOrg} onChange={(e) => setCertOrg(e.target.value)} /></FormField>
            </div>
            <FormField label={isAr ? "رقم الشهادة" : "Cert Number"} required><TextInput placeholder="CERT-XXXXXXXXXX" value={certNumber} onChange={(e) => setCertNumber(e.target.value)} className="font-['JetBrains_Mono']" /></FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "تاريخ الغوص" : "Dive Date"} required><TextInput type="date" value={diveDate} onChange={(e) => setDiveDate(e.target.value)} /></FormField>
              <FormField label={isAr ? "أقصى عمق (م)" : "Max Depth (m)"} required><TextInput type="number" placeholder="30" value={maxDepth} onChange={(e) => setMaxDepth(e.target.value)} className="font-['JetBrains_Mono']" /></FormField>
            </div>
            <FormField label={isAr ? "اسم موقع الغوص" : "Dive Site Name"} required><TextInput placeholder={isAr ? "اسم الموقع" : "Site name"} value={siteName} onChange={(e) => setSiteName(e.target.value)} /></FormField>
            <FormField label={isAr ? "إحداثيات GPS للموقع" : "Site GPS Coordinates"} required><TextInput placeholder="23.5880° N, 58.3829° E" value={siteGps} onChange={(e) => setSiteGps(e.target.value)} className="font-['JetBrains_Mono'] text-xs" /></FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "اسم الرفيق (Buddy)" : "Buddy Name"} required><TextInput placeholder={isAr ? "الاسم الكامل" : "Full name"} value={buddyName} onChange={(e) => setBuddyName(e.target.value)} /></FormField>
              <FormField label={isAr ? "شهادة الرفيق" : "Buddy Cert No."}><TextInput placeholder="CERT-XXXXXXXXXX" value={buddyCert} onChange={(e) => setBuddyCert(e.target.value)} className="font-['JetBrains_Mono']" /></FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "مشغل الغوص" : "Dive Operator"} required><TextInput placeholder={isAr ? "اسم الشركة" : "Company name"} value={diveOperator} onChange={(e) => setDiveOperator(e.target.value)} /></FormField>
              <FormField label={isAr ? "رخصة المشغل" : "Operator License"} required><TextInput placeholder="OPL-XXXXXXXX" value={operatorLicense} onChange={(e) => setOperatorLicense(e.target.value)} className="font-['JetBrains_Mono']" /></FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "لياقة طبية؟" : "Medically Fit?"} required><RadioGroup name="medical" options={[{ value: "yes", label: isAr ? "نعم" : "Yes" }, { value: "no", label: isAr ? "لا" : "No" }]} value={medicalFit} onChange={setMedicalFit} /></FormField>
              <FormField label={isAr ? "تم توقيع الإخلاء؟" : "Waiver Signed?"} required><RadioGroup name="waiver" options={[{ value: "yes", label: isAr ? "نعم" : "Yes" }, { value: "no", label: isAr ? "لا" : "No" }]} value={waiverSigned} onChange={setWaiverSigned} /></FormField>
            </div>
          </div>
        </SectionCard>
        <TravelDocSection data={doc} onChange={(k, v) => setDoc(d => ({ ...d, [k]: v }))} isAr={isAr} scannerConnected={scannerConnected} autoFilled={autoFilled} onScan={handleScan} />
      </div>
      <PersonalDetailsSection data={personal} onChange={(k, v) => setPersonal(p => ({ ...p, [k]: v }))} isAr={isAr} autoFilled={autoFilled} />
      <FormActions onCancel={onCancel} onSave={handleSave} saveLabel={isAr ? "تسجيل الغوص" : "Register Dive"} isAr={isAr} saving={saving} />
    </div>
  );
};
export default DivingRegistrationForm;
