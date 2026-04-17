import { useState } from "react";
import { SectionCard, FormField, TextInput, SelectInput, TipBanner, FormActions, BRANCHES, COUNTRIES } from "@/pages/dashboard/hotel-events/components/FormComponents";
import TravelDocSection, { type TravelDocData } from "@/pages/dashboard/hotel-events/components/TravelDocSection";
import PersonalDetailsSection, { type PersonalData } from "@/pages/dashboard/hotel-events/components/PersonalDetailsSection";
import MarConfirmation from "./components/MarConfirmation";

const MARINAS = [{ value: "capital_marina", label: "Capital Marina" }, { value: "north_marina", label: "Northern Marina" }, { value: "south_marina", label: "Southern Marina" }, { value: "east_marina", label: "Eastern Marina" }];
const VESSEL_TYPES = [{ value: "motorboat", label: "Motorboat" }, { value: "sailboat", label: "Sailboat" }, { value: "yacht", label: "Yacht" }, { value: "speedboat", label: "Speedboat" }, { value: "cargo", label: "Cargo Vessel" }, { value: "other", label: "Other" }];

interface CrewMember { id: string; name: string; nationality: string; role: string; }
const emptyPersonal = (): PersonalData => ({ firstName: "", lastName: "", gender: "", dob: "", nationality: "", placeOfBirth: "", countryOfResidence: "", email: "", primaryContact: "", secondaryContact: "" });
const emptyDoc = (): TravelDocData => ({ holderStatus: "primary", docType: "", docNumber: "", issuingCountry: "", placeOfIssue: "", issuingAuthority: "", issueDate: "", expiryDate: "" });

interface Props { isAr: boolean; onCancel: () => void; }

const MarinaDockingForm = ({ isAr, onCancel }: Props) => {
  const [vesselName, setVesselName] = useState("");
  const [vesselType, setVesselType] = useState("");
  const [vesselReg, setVesselReg] = useState("");
  const [vesselFlag, setVesselFlag] = useState("");
  const [marina, setMarina] = useState("");
  const [arrivalDateTime, setArrivalDateTime] = useState("");
  const [departureDateTime, setDepartureDateTime] = useState("");
  const [lastPort, setLastPort] = useState("");
  const [nextPort, setNextPort] = useState("");
  const [berthNumber, setBerthNumber] = useState("");
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [personal, setPersonal] = useState<PersonalData>(emptyPersonal());
  const [doc, setDoc] = useState<TravelDocData>(emptyDoc());
  const [autoFilled, setAutoFilled] = useState(false);
  const [scannerConnected] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  const handleScan = () => {
    setDoc({ holderStatus: "primary", docType: "passport", docNumber: "P66778899", issuingCountry: "GB", placeOfIssue: "London", issuingAuthority: "HM Passport Office", issueDate: "2020-11-10", expiryDate: "2030-11-09" });
    setPersonal({ firstName: "William", lastName: "Clarke", gender: "male", dob: "1975-09-22", nationality: "GB", placeOfBirth: "London", countryOfResidence: "GB", email: "w.clarke@email.co.uk", primaryContact: "+XXX 9345 6789", secondaryContact: "" });
    setAutoFilled(true);
  };

  const addCrew = () => setCrew(c => [...c, { id: Date.now().toString(), name: "", nationality: "", role: "" }]);
  const removeCrew = (id: string) => setCrew(c => c.filter(x => x.id !== id));
  const updateCrew = (id: string, key: keyof CrewMember, val: string) => setCrew(c => c.map(x => x.id === id ? { ...x, [key]: val } : x));

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setRefNumber(`AMN-MAR-${Date.now()}-${Math.floor(Math.random() * 9000) + 1000}`); setConfirmed(true); }, 1800);
  };

  if (confirmed) return <MarConfirmation refNumber={refNumber} eventType={isAr ? "رسو في الميناء" : "Marina Docking"} eventCode="MAR_DOCKING" color="#4ADE80" isAr={isAr} onReset={() => { setConfirmed(false); setAutoFilled(false); }} />;

  return (
    <div className="space-y-5">
      <TipBanner text={isAr ? "سجّل بيانات السفينة والطاقم الكامل عند الرسو في الميناء." : "Record vessel and full crew manifest upon marina docking."} color="cyan" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <SectionCard title={isAr ? "بيانات السفينة والرسو" : "Vessel & Docking Details"} icon="ri-anchor-line" accentColor="#4ADE80">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "اسم السفينة" : "Vessel Name"} required><TextInput placeholder={isAr ? "اسم السفينة" : "Vessel name"} value={vesselName} onChange={(e) => setVesselName(e.target.value)} /></FormField>
              <FormField label={isAr ? "نوع السفينة" : "Vessel Type"} required><SelectInput options={VESSEL_TYPES} placeholder={isAr ? "اختر" : "Select"} value={vesselType} onChange={(e) => setVesselType(e.target.value)} /></FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "رقم التسجيل" : "Registration No."} required><TextInput placeholder="VES-XXXXXXXX" value={vesselReg} onChange={(e) => setVesselReg(e.target.value)} className="font-['JetBrains_Mono']" /></FormField>
              <FormField label={isAr ? "علم السفينة" : "Vessel Flag"} required><SelectInput options={COUNTRIES} placeholder={isAr ? "اختر الدولة" : "Select country"} value={vesselFlag} onChange={(e) => setVesselFlag(e.target.value)} /></FormField>
            </div>
            <FormField label={isAr ? "الميناء" : "Marina"} required><SelectInput options={MARINAS} placeholder={isAr ? "اختر الميناء" : "Select marina"} value={marina} onChange={(e) => setMarina(e.target.value)} /></FormField>
            <FormField label={isAr ? "رقم الرصيف" : "Berth Number"}><TextInput placeholder="B-XXX" value={berthNumber} onChange={(e) => setBerthNumber(e.target.value)} className="font-['JetBrains_Mono']" /></FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "تاريخ الوصول" : "Arrival Date/Time"} required><TextInput type="datetime-local" value={arrivalDateTime} onChange={(e) => setArrivalDateTime(e.target.value)} /></FormField>
              <FormField label={isAr ? "تاريخ المغادرة" : "Departure Date/Time"}><TextInput type="datetime-local" value={departureDateTime} onChange={(e) => setDepartureDateTime(e.target.value)} /></FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "آخر ميناء" : "Last Port"} required><TextInput placeholder={isAr ? "اسم الميناء" : "Port name"} value={lastPort} onChange={(e) => setLastPort(e.target.value)} /></FormField>
              <FormField label={isAr ? "الميناء التالي" : "Next Port"}><TextInput placeholder={isAr ? "اسم الميناء" : "Port name"} value={nextPort} onChange={(e) => setNextPort(e.target.value)} /></FormField>
            </div>
          </div>
        </SectionCard>
        <TravelDocSection data={doc} onChange={(k, v) => setDoc(d => ({ ...d, [k]: v }))} isAr={isAr} scannerConnected={scannerConnected} autoFilled={autoFilled} onScan={handleScan} />
      </div>
      <PersonalDetailsSection data={personal} onChange={(k, v) => setPersonal(p => ({ ...p, [k]: v }))} isAr={isAr} autoFilled={autoFilled} />
      {crew.map((c, idx) => (
        <SectionCard key={c.id} title={`${isAr ? "فرد الطاقم" : "Crew Member"} #${idx + 1}`} icon="ri-user-line" accentColor="#D6B47E">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label={isAr ? "الاسم" : "Name"} required><TextInput placeholder={isAr ? "الاسم الكامل" : "Full name"} value={c.name} onChange={(e) => updateCrew(c.id, "name", e.target.value)} /></FormField>
            <FormField label={isAr ? "الجنسية" : "Nationality"} required><SelectInput options={COUNTRIES} placeholder={isAr ? "اختر" : "Select"} value={c.nationality} onChange={(e) => updateCrew(c.id, "nationality", e.target.value)} /></FormField>
            <FormField label={isAr ? "الدور / المنصب" : "Role / Position"} required>
              <div className="flex gap-2">
                <TextInput placeholder={isAr ? "مثال: ربان" : "e.g. Captain"} value={c.role} onChange={(e) => updateCrew(c.id, "role", e.target.value)} className="flex-1" />
                <button type="button" onClick={() => removeCrew(c.id)} className="px-3 py-2 rounded-lg border text-xs cursor-pointer" style={{ background: "rgba(201,74,94,0.06)", borderColor: "rgba(201,74,94,0.2)", color: "#C94A5E" }}><i className="ri-close-line" /></button>
              </div>
            </FormField>
          </div>
        </SectionCard>
      ))}
      <button type="button" onClick={addCrew} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed text-sm font-semibold cursor-pointer transition-all" style={{ borderColor: "rgba(184,138,60,0.2)", color: "#D6B47E", background: "rgba(184,138,60,0.03)" }} onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(184,138,60,0.4)"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(184,138,60,0.2)"; }}>
        <i className="ri-user-add-line" />{isAr ? "إضافة فرد طاقم" : "Add Crew Member"}
      </button>
      <FormActions onCancel={onCancel} onSave={handleSave} saveLabel={isAr ? "تسجيل الرسو" : "Register Docking"} isAr={isAr} saving={saving} />
    </div>
  );
};
export default MarinaDockingForm;
