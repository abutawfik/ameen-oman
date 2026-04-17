import { useState } from "react";
import {
  SectionCard, FormField, TextInput, SelectInput, RadioGroup, TipBanner, FormActions, BRANCHES,
} from "@/pages/dashboard/hotel-events/components/FormComponents";
import TravelDocSection, { type TravelDocData } from "@/pages/dashboard/hotel-events/components/TravelDocSection";
import PersonalDetailsSection, { type PersonalData } from "@/pages/dashboard/hotel-events/components/PersonalDetailsSection";
import HltConfirmation from "./components/HltConfirmation";

const ARRIVAL_MODES = [
  { value: "walk_in",   label: "Walk-In",          labelAr: "مشياً" },
  { value: "ambulance", label: "Ambulance",         labelAr: "سيارة إسعاف" },
  { value: "police",    label: "Police Vehicle",    labelAr: "مركبة شرطة" },
  { value: "air",       label: "Air Ambulance",     labelAr: "مروحية إسعاف" },
  { value: "private",   label: "Private Vehicle",   labelAr: "مركبة خاصة" },
];

const DISCHARGE_STATUSES = [
  { value: "discharged",  label: "Discharged — Stable",    labelAr: "خروج — مستقر" },
  { value: "admitted",    label: "Admitted to Ward",        labelAr: "دخول للجناح" },
  { value: "icu",         label: "Transferred to ICU",      labelAr: "نقل للعناية المركزة" },
  { value: "transferred", label: "Transferred to Hospital", labelAr: "نقل لمستشفى آخر" },
  { value: "deceased",    label: "Deceased",                labelAr: "وفاة" },
  { value: "absconded",   label: "Left Against Advice",     labelAr: "غادر ضد النصيحة" },
];

const TRIAGE_LEVELS = [
  { value: "1", label: "1 — Resuscitation",  color: "#C94A5E" },
  { value: "2", label: "2 — Emergent",       color: "#C98A1B" },
  { value: "3", label: "3 — Urgent",         color: "#FACC15" },
  { value: "4", label: "4 — Less Urgent",    color: "#4ADE80" },
  { value: "5", label: "5 — Non-Urgent",     color: "#D6B47E" },
];

const emptyPersonal = (): PersonalData => ({
  firstName: "", lastName: "", gender: "", dob: "", nationality: "",
  placeOfBirth: "", countryOfResidence: "", email: "", primaryContact: "", secondaryContact: "",
});
const emptyDoc = (): TravelDocData => ({
  holderStatus: "primary", docType: "", docNumber: "", issuingCountry: "",
  placeOfIssue: "", issuingAuthority: "", issueDate: "", expiryDate: "",
});

interface AccompanyingPerson { id: string; name: string; relation: string; phone: string; }

interface Props { isAr: boolean; onCancel: () => void; }

const EmergencyVisitForm = ({ isAr, onCancel }: Props) => {
  const [facility, setFacility] = useState("");
  const [arrivalDateTime, setArrivalDateTime] = useState("");
  const [arrivalMode, setArrivalMode] = useState("walk_in");
  const [triageLevel, setTriageLevel] = useState("3");
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [dischargeDateTime, setDischargeDateTime] = useState("");
  const [dischargeStatus, setDischargeStatus] = useState("");
  const [accompanyingPersons, setAccompanyingPersons] = useState<AccompanyingPerson[]>([]);
  const [personal, setPersonal] = useState<PersonalData>(emptyPersonal());
  const [doc, setDoc] = useState<TravelDocData>(emptyDoc());
  const [autoFilled, setAutoFilled] = useState(false);
  const [scannerConnected] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  const handleScan = () => {
    setDoc({ holderStatus: "primary", docType: "passport", docNumber: "P44556677", issuingCountry: "AE", placeOfIssue: "Dubai", issuingAuthority: "UAE Authority", issueDate: "2020-09-01", expiryDate: "2030-08-31" });
    setPersonal({ firstName: "Omar", lastName: "Al-Zaabi", gender: "male", dob: "1990-07-15", nationality: "AE", placeOfBirth: "Dubai", countryOfResidence: "AE", email: "omar.zaabi@email.com", primaryContact: "+XXX 9234 5678", secondaryContact: "" });
    setAutoFilled(true);
  };

  const addPerson = () => setAccompanyingPersons(p => [...p, { id: Date.now().toString(), name: "", relation: "", phone: "" }]);
  const removePerson = (id: string) => setAccompanyingPersons(p => p.filter(x => x.id !== id));
  const updatePerson = (id: string, key: keyof AccompanyingPerson, val: string) =>
    setAccompanyingPersons(p => p.map(x => x.id === id ? { ...x, [key]: val } : x));

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setRefNumber(`AMN-HLT-${Date.now()}-${Math.floor(Math.random() * 9000) + 1000}`);
      setConfirmed(true);
    }, 1800);
  };

  const selectedTriage = TRIAGE_LEVELS.find(t => t.value === triageLevel);

  if (confirmed) return <HltConfirmation refNumber={refNumber} eventType={isAr ? "زيارة طارئة" : "Emergency Visit"} eventCode="HLT_EMERGENCY" color="#C98A1B" isAr={isAr} onReset={() => { setConfirmed(false); setAutoFilled(false); }} />;

  return (
    <div className="space-y-5">
      <TipBanner text={isAr ? "حالات الطوارئ تُرسَل فوراً إلى Al-Ameen. تأكد من تحديد مستوى الفرز بدقة." : "Emergency cases are submitted instantly to Al-Ameen. Ensure triage level is accurately assigned."} color="amber" />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Emergency Details */}
        <SectionCard title={isAr ? "تفاصيل الطوارئ" : "Emergency Details"} icon="ri-heart-pulse-line" accentColor="#C98A1B">
          <div className="space-y-4">
            <FormField label={isAr ? "المنشأة الصحية" : "Health Facility"} required>
              <SelectInput options={BRANCHES} placeholder={isAr ? "اختر المنشأة" : "Select facility"} value={facility} onChange={(e) => setFacility(e.target.value)} />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "تاريخ ووقت الوصول" : "Arrival Date/Time"} required>
                <TextInput type="datetime-local" value={arrivalDateTime} onChange={(e) => setArrivalDateTime(e.target.value)} />
              </FormField>
              <FormField label={isAr ? "طريقة الوصول" : "Arrival Mode"} required>
                <SelectInput options={ARRIVAL_MODES.map(m => ({ value: m.value, label: isAr ? m.labelAr : m.label }))} value={arrivalMode} onChange={(e) => setArrivalMode(e.target.value)} />
              </FormField>
            </div>

            {/* Triage Level */}
            <FormField label={isAr ? "مستوى الفرز (1-5)" : "Triage Level (1-5)"} required>
              <div className="flex gap-2">
                {TRIAGE_LEVELS.map(t => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTriageLevel(t.value)}
                    className="flex-1 py-2.5 rounded-lg border text-xs font-bold cursor-pointer transition-all font-['JetBrains_Mono']"
                    style={{
                      background: triageLevel === t.value ? `${t.color}20` : "rgba(255,255,255,0.03)",
                      borderColor: triageLevel === t.value ? t.color : "rgba(255,255,255,0.08)",
                      color: triageLevel === t.value ? t.color : "#4B5563",
                    }}
                  >
                    {t.value}
                  </button>
                ))}
              </div>
              {selectedTriage && (
                <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg border" style={{ background: `${selectedTriage.color}08`, borderColor: `${selectedTriage.color}25` }}>
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: selectedTriage.color }} />
                  <span className="text-xs font-semibold font-['Inter']" style={{ color: selectedTriage.color }}>{selectedTriage.label}</span>
                </div>
              )}
            </FormField>

            <FormField label={isAr ? "الشكوى الرئيسية" : "Chief Complaint"} required>
              <textarea
                rows={3}
                placeholder={isAr ? "وصف الحالة الطارئة..." : "Describe the emergency condition..."}
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                maxLength={500}
                className="w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-gray-600 outline-none transition-all duration-200 resize-none font-['Inter']"
                style={{ background: "#0F1923", border: "1px solid rgba(255,255,255,0.08)" }}
                onFocus={(e) => { e.target.style.borderColor = "#D6B47E"; e.target.style.boxShadow = "0 0 0 2px rgba(184,138,60,0.08)"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "تاريخ ووقت الخروج" : "Discharge Date/Time"}>
                <TextInput type="datetime-local" value={dischargeDateTime} onChange={(e) => setDischargeDateTime(e.target.value)} />
              </FormField>
              <FormField label={isAr ? "حالة الخروج" : "Discharge Status"}>
                <SelectInput options={DISCHARGE_STATUSES.map(d => ({ value: d.value, label: isAr ? d.labelAr : d.label }))} placeholder={isAr ? "اختر" : "Select"} value={dischargeStatus} onChange={(e) => setDischargeStatus(e.target.value)} />
              </FormField>
            </div>
          </div>
        </SectionCard>

        <div className="space-y-5">
          <TravelDocSection data={doc} onChange={(k, v) => setDoc(d => ({ ...d, [k]: v }))} isAr={isAr} scannerConnected={scannerConnected} autoFilled={autoFilled} onScan={handleScan} />
        </div>
      </div>

      <PersonalDetailsSection data={personal} onChange={(k, v) => setPersonal(p => ({ ...p, [k]: v }))} isAr={isAr} autoFilled={autoFilled} />

      {/* Accompanying Persons */}
      {accompanyingPersons.map((person, idx) => (
        <SectionCard key={person.id} title={`${isAr ? "مرافق" : "Accompanying Person"} #${idx + 1}`} icon="ri-user-add-line" accentColor="#4ADE80">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label={isAr ? "الاسم" : "Name"} required>
              <TextInput placeholder={isAr ? "الاسم الكامل" : "Full name"} value={person.name} onChange={(e) => updatePerson(person.id, "name", e.target.value)} />
            </FormField>
            <FormField label={isAr ? "صلة القرابة" : "Relationship"} required>
              <SelectInput
                options={[
                  { value: "spouse",  label: isAr ? "زوج/زوجة" : "Spouse" },
                  { value: "parent",  label: isAr ? "والد/والدة" : "Parent" },
                  { value: "child",   label: isAr ? "ابن/ابنة" : "Child" },
                  { value: "sibling", label: isAr ? "أخ/أخت" : "Sibling" },
                  { value: "friend",  label: isAr ? "صديق" : "Friend" },
                  { value: "other",   label: isAr ? "أخرى" : "Other" },
                ]}
                placeholder={isAr ? "اختر" : "Select"}
                value={person.relation}
                onChange={(e) => updatePerson(person.id, "relation", e.target.value)}
              />
            </FormField>
            <FormField label={isAr ? "رقم الهاتف" : "Phone"}>
              <div className="flex gap-2">
                <TextInput type="tel" placeholder="+XXX XXXX XXXX" value={person.phone} onChange={(e) => updatePerson(person.id, "phone", e.target.value)} className="flex-1 font-['JetBrains_Mono']" />
                <button type="button" onClick={() => removePerson(person.id)} className="px-3 py-2 rounded-lg border text-xs cursor-pointer" style={{ background: "rgba(201,74,94,0.06)", borderColor: "rgba(201,74,94,0.2)", color: "#C94A5E" }}>
                  <i className="ri-close-line" />
                </button>
              </div>
            </FormField>
          </div>
        </SectionCard>
      ))}

      <button
        type="button"
        onClick={addPerson}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed text-sm font-semibold cursor-pointer transition-all"
        style={{ borderColor: "rgba(184,138,60,0.2)", color: "#D6B47E", background: "rgba(184,138,60,0.03)" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(184,138,60,0.4)"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(184,138,60,0.06)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(184,138,60,0.2)"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(184,138,60,0.03)"; }}
      >
        <i className="ri-user-add-line" />{isAr ? "إضافة مرافق" : "Add Accompanying Person"}
      </button>

      <FormActions onCancel={onCancel} onSave={handleSave} saveLabel={isAr ? "تسجيل الحالة الطارئة" : "Register Emergency Visit"} isAr={isAr} saving={saving} />
    </div>
  );
};

export default EmergencyVisitForm;
