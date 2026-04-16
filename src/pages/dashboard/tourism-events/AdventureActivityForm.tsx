import { useState } from "react";
import {
  SectionCard, FormField, TextInput, SelectInput, RadioGroup, TipBanner, FormActions, BRANCHES,
} from "@/pages/dashboard/hotel-events/components/FormComponents";
import TravelDocSection, { type TravelDocData } from "@/pages/dashboard/hotel-events/components/TravelDocSection";
import PersonalDetailsSection, { type PersonalData } from "@/pages/dashboard/hotel-events/components/PersonalDetailsSection";
import TorConfirmation from "./components/TorConfirmation";

const ACTIVITY_TYPES = [
  { value: "rock_climbing",  label: "Rock Climbing",    labelAr: "تسلق الصخور" },
  { value: "hiking",         label: "Hiking / Trekking",labelAr: "المشي لمسافات طويلة" },
  { value: "zip_line",       label: "Zip Line",         labelAr: "الحبل المتزلج" },
  { value: "paragliding",    label: "Paragliding",      labelAr: "الطيران الشراعي" },
  { value: "skydiving",      label: "Skydiving",        labelAr: "القفز بالمظلة" },
  { value: "off_road",       label: "Off-Road / 4x4",   labelAr: "الطرق الوعرة" },
  { value: "kayaking",       label: "Kayaking",         labelAr: "التجديف بالكياك" },
  { value: "snorkeling",     label: "Snorkeling",       labelAr: "الغطس السطحي" },
  { value: "caving",         label: "Caving / Spelunking",labelAr: "استكشاف الكهوف" },
  { value: "other",          label: "Other",            labelAr: "أخرى" },
];

const RISK_LEVELS = [
  { value: "low",    label: "Low",    color: "#4ADE80" },
  { value: "medium", label: "Medium", color: "#FACC15" },
  { value: "high",   label: "High",   color: "#FB923C" },
];

const emptyPersonal = (): PersonalData => ({ firstName: "", lastName: "", gender: "", dob: "", nationality: "", placeOfBirth: "", countryOfResidence: "", email: "", primaryContact: "", secondaryContact: "" });
const emptyDoc = (): TravelDocData => ({ holderStatus: "primary", docType: "", docNumber: "", issuingCountry: "", placeOfIssue: "", issuingAuthority: "", issueDate: "", expiryDate: "" });

interface Props { isAr: boolean; onCancel: () => void; }

const AdventureActivityForm = ({ isAr, onCancel }: Props) => {
  const [activityType, setActivityType] = useState("");
  const [operatorName, setOperatorName] = useState("");
  const [operatorLicense, setOperatorLicense] = useState("");
  const [locationGps, setLocationGps] = useState("");
  const [activityDate, setActivityDate] = useState("");
  const [riskLevel, setRiskLevel] = useState("medium");
  const [waiverSigned, setWaiverSigned] = useState("no");
  const [certificationRequired, setCertificationRequired] = useState("no");
  const [certificationNumber, setCertificationNumber] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [participantCount, setParticipantCount] = useState("1");
  const [personal, setPersonal] = useState<PersonalData>(emptyPersonal());
  const [doc, setDoc] = useState<TravelDocData>(emptyDoc());
  const [autoFilled, setAutoFilled] = useState(false);
  const [scannerConnected] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  const handleScan = () => {
    setDoc({ holderStatus: "primary", docType: "passport", docNumber: "P55443322", issuingCountry: "AU", placeOfIssue: "Sydney", issuingAuthority: "Australian Authority", issueDate: "2020-03-15", expiryDate: "2030-03-14" });
    setPersonal({ firstName: "Jack", lastName: "Thompson", gender: "male", dob: "1992-08-30", nationality: "AU", placeOfBirth: "Sydney", countryOfResidence: "AU", email: "j.thompson@email.au", primaryContact: "+XXX 9678 9012", secondaryContact: "" });
    setAutoFilled(true);
  };

  const selectedRisk = RISK_LEVELS.find(r => r.value === riskLevel);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setRefNumber(`AMN-TOR-${Date.now()}-${Math.floor(Math.random() * 9000) + 1000}`); setConfirmed(true); }, 1800);
  };

  if (confirmed) return <TorConfirmation refNumber={refNumber} eventType={isAr ? "نشاط مغامرة" : "Adventure Activity"} eventCode="TOR_ADVENTURE" color="#FB923C" isAr={isAr} onReset={() => { setConfirmed(false); setAutoFilled(false); }} />;

  return (
    <div className="space-y-5">
      <TipBanner text={isAr ? "الأنشطة عالية المخاطر تتطلب توقيع إخلاء مسؤولية وشهادة معتمدة." : "High-risk activities require a signed waiver and valid certification."} color="amber" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <SectionCard title={isAr ? "تفاصيل النشاط" : "Activity Details"} icon="ri-run-line" accentColor="#FB923C">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "نوع النشاط" : "Activity Type"} required>
                <SelectInput options={ACTIVITY_TYPES.map(a => ({ value: a.value, label: isAr ? a.labelAr : a.label }))} placeholder={isAr ? "اختر النشاط" : "Select activity"} value={activityType} onChange={(e) => setActivityType(e.target.value)} />
              </FormField>
              <FormField label={isAr ? "تاريخ النشاط" : "Activity Date"} required>
                <TextInput type="date" value={activityDate} onChange={(e) => setActivityDate(e.target.value)} />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "اسم المشغل" : "Operator Name"} required>
                <TextInput placeholder={isAr ? "اسم الشركة" : "Company name"} value={operatorName} onChange={(e) => setOperatorName(e.target.value)} />
              </FormField>
              <FormField label={isAr ? "رخصة المشغل" : "Operator License"} required>
                <TextInput placeholder="OPL-XXXXXXXX" value={operatorLicense} onChange={(e) => setOperatorLicense(e.target.value)} className="font-['JetBrains_Mono']" />
              </FormField>
            </div>
            <FormField label={isAr ? "إحداثيات GPS للموقع" : "Location GPS Coordinates"} required>
              <TextInput placeholder="23.5880° N, 58.3829° E" value={locationGps} onChange={(e) => setLocationGps(e.target.value)} className="font-['JetBrains_Mono'] text-xs" />
            </FormField>
            <FormField label={isAr ? "مستوى المخاطر" : "Risk Level"} required>
              <div className="flex gap-2">
                {RISK_LEVELS.map(r => (
                  <button key={r.value} type="button" onClick={() => setRiskLevel(r.value)}
                    className="flex-1 py-2.5 rounded-lg border text-xs font-bold cursor-pointer transition-all font-['Inter']"
                    style={{ background: riskLevel === r.value ? `${r.color}15` : "rgba(255,255,255,0.03)", borderColor: riskLevel === r.value ? r.color : "rgba(255,255,255,0.08)", color: riskLevel === r.value ? r.color : "#4B5563" }}
                  >{isAr ? (r.value === "low" ? "منخفض" : r.value === "medium" ? "متوسط" : "مرتفع") : r.label}</button>
                ))}
              </div>
              {selectedRisk && <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg border" style={{ background: `${selectedRisk.color}08`, borderColor: `${selectedRisk.color}25` }}><div className="w-2 h-2 rounded-full" style={{ background: selectedRisk.color }} /><span className="text-xs font-semibold" style={{ color: selectedRisk.color }}>{isAr ? (riskLevel === "low" ? "مخاطر منخفضة" : riskLevel === "medium" ? "مخاطر متوسطة" : "مخاطر مرتفعة") : `${selectedRisk.label} Risk`}</span></div>}
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "تم توقيع إخلاء المسؤولية؟" : "Waiver Signed?"} required>
                <RadioGroup name="waiver" options={[{ value: "yes", label: isAr ? "نعم" : "Yes" }, { value: "no", label: isAr ? "لا" : "No" }]} value={waiverSigned} onChange={setWaiverSigned} />
              </FormField>
              <FormField label={isAr ? "شهادة مطلوبة؟" : "Certification Required?"} required>
                <RadioGroup name="cert" options={[{ value: "yes", label: isAr ? "نعم" : "Yes" }, { value: "no", label: isAr ? "لا" : "No" }]} value={certificationRequired} onChange={setCertificationRequired} />
              </FormField>
            </div>
            {certificationRequired === "yes" && (
              <FormField label={isAr ? "رقم الشهادة" : "Certification Number"} required>
                <TextInput placeholder="CERT-XXXXXXXXXX" value={certificationNumber} onChange={(e) => setCertificationNumber(e.target.value)} className="font-['JetBrains_Mono']" />
              </FormField>
            )}
            <FormField label={isAr ? "عدد المشاركين" : "Participant Count"} required>
              <TextInput type="number" placeholder="1" value={participantCount} onChange={(e) => setParticipantCount(e.target.value)} className="font-['JetBrains_Mono']" />
            </FormField>
            <div className="border-t pt-4" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <p className="text-gray-400 text-xs mb-3 uppercase tracking-wide">{isAr ? "جهة الاتصال الطارئة" : "Emergency Contact"}</p>
              <div className="grid grid-cols-2 gap-3">
                <FormField label={isAr ? "الاسم" : "Name"} required>
                  <TextInput placeholder={isAr ? "الاسم الكامل" : "Full name"} value={emergencyContactName} onChange={(e) => setEmergencyContactName(e.target.value)} />
                </FormField>
                <FormField label={isAr ? "الهاتف" : "Phone"} required>
                  <TextInput type="tel" placeholder="+XXX XXXX XXXX" value={emergencyContactPhone} onChange={(e) => setEmergencyContactPhone(e.target.value)} className="font-['JetBrains_Mono']" />
                </FormField>
              </div>
            </div>
          </div>
        </SectionCard>
        <TravelDocSection data={doc} onChange={(k, v) => setDoc(d => ({ ...d, [k]: v }))} isAr={isAr} scannerConnected={scannerConnected} autoFilled={autoFilled} onScan={handleScan} />
      </div>
      <PersonalDetailsSection data={personal} onChange={(k, v) => setPersonal(p => ({ ...p, [k]: v }))} isAr={isAr} autoFilled={autoFilled} />
      <FormActions onCancel={onCancel} onSave={handleSave} saveLabel={isAr ? "تسجيل النشاط" : "Register Activity"} isAr={isAr} saving={saving} />
    </div>
  );
};
export default AdventureActivityForm;
