import { useState } from "react";
import { SectionCard, FormField, TextInput, SelectInput, RadioGroup, TipBanner, FormActions, BRANCHES, COUNTRIES } from "@/pages/dashboard/hotel-events/components/FormComponents";
import TravelDocSection, { type TravelDocData } from "@/pages/dashboard/hotel-events/components/TravelDocSection";
import PersonalDetailsSection, { type PersonalData } from "@/pages/dashboard/hotel-events/components/PersonalDetailsSection";
import MarConfirmation from "./components/MarConfirmation";

const VESSEL_TYPES = [
  { value: "motorboat",   label: "Motorboat" }, { value: "sailboat", label: "Sailboat" },
  { value: "yacht",       label: "Yacht" },     { value: "speedboat", label: "Speedboat" },
  { value: "catamaran",   label: "Catamaran" }, { value: "fishing",  label: "Fishing Boat" },
  { value: "pontoon",     label: "Pontoon" },   { value: "other",    label: "Other" },
];
const MARINAS = [
  { value: "capital_marina",  label: "Capital Marina" }, { value: "north_marina", label: "Northern Marina" },
  { value: "south_marina",    label: "Southern Marina" },{ value: "east_marina",  label: "Eastern Marina" },
];

interface Passenger { id: string; name: string; nationality: string; docNumber: string; }
const emptyPersonal = (): PersonalData => ({ firstName: "", lastName: "", gender: "", dob: "", nationality: "", placeOfBirth: "", countryOfResidence: "", email: "", primaryContact: "", secondaryContact: "" });
const emptyDoc = (): TravelDocData => ({ holderStatus: "primary", docType: "", docNumber: "", issuingCountry: "", placeOfIssue: "", issuingAuthority: "", issueDate: "", expiryDate: "" });

interface Props { isAr: boolean; onCancel: () => void; }

const BoatRentalForm = ({ isAr, onCancel }: Props) => {
  const [marineLicense, setMarineLicense] = useState("");
  const [vesselName, setVesselName] = useState("");
  const [vesselType, setVesselType] = useState("");
  const [vesselReg, setVesselReg] = useState("");
  const [marina, setMarina] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [destination, setDestination] = useState("");
  const [gpsTrackerId, setGpsTrackerId] = useState("");
  const [safetyCheck, setSafetyCheck] = useState("yes");
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [personal, setPersonal] = useState<PersonalData>(emptyPersonal());
  const [doc, setDoc] = useState<TravelDocData>(emptyDoc());
  const [autoFilled, setAutoFilled] = useState(false);
  const [scannerConnected] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  const handleScan = () => {
    setDoc({ holderStatus: "primary", docType: "passport", docNumber: "P22334455", issuingCountry: "SA", placeOfIssue: "Capital City", issuingAuthority: "National Authority", issueDate: "2021-06-01", expiryDate: "2031-05-31" });
    setPersonal({ firstName: "Saeed", lastName: "Al-Harthi", gender: "male", dob: "1980-04-18", nationality: "SA", placeOfBirth: "Capital City", countryOfResidence: "SA", email: "saeed.harthi@email.com", primaryContact: "+XXX 9234 5678", secondaryContact: "" });
    setAutoFilled(true);
  };

  const addPassenger = () => setPassengers(p => [...p, { id: Date.now().toString(), name: "", nationality: "", docNumber: "" }]);
  const removePassenger = (id: string) => setPassengers(p => p.filter(x => x.id !== id));
  const updatePassenger = (id: string, key: keyof Passenger, val: string) => setPassengers(p => p.map(x => x.id === id ? { ...x, [key]: val } : x));

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setRefNumber(`AMN-MAR-${Date.now()}-${Math.floor(Math.random() * 9000) + 1000}`); setConfirmed(true); }, 1800);
  };

  if (confirmed) return <MarConfirmation refNumber={refNumber} eventType={isAr ? "تأجير قارب" : "Boat Rental"} eventCode="MAR_BOAT" color="#D4A84B" isAr={isAr} onReset={() => { setConfirmed(false); setAutoFilled(false); }} />;

  return (
    <div className="space-y-5">
      <TipBanner text={isAr ? "تأكد من صحة رخصة الملاحة البحرية وبيانات السفينة قبل الإرسال." : "Verify marine license and vessel details before submission."} color="cyan" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <SectionCard title={isAr ? "تفاصيل القارب والإيجار" : "Vessel & Rental Details"} icon="ri-ship-line" accentColor="#D4A84B">
          <div className="space-y-4">
            <FormField label={isAr ? "رخصة الملاحة البحرية" : "Marine License No."} required>
              <TextInput placeholder="MRL-XXXXXXXX" value={marineLicense} onChange={(e) => setMarineLicense(e.target.value)} className="font-['JetBrains_Mono']" />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "اسم السفينة" : "Vessel Name"} required>
                <TextInput placeholder={isAr ? "اسم القارب" : "Vessel name"} value={vesselName} onChange={(e) => setVesselName(e.target.value)} />
              </FormField>
              <FormField label={isAr ? "نوع السفينة" : "Vessel Type"} required>
                <SelectInput options={VESSEL_TYPES} placeholder={isAr ? "اختر النوع" : "Select type"} value={vesselType} onChange={(e) => setVesselType(e.target.value)} />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "رقم تسجيل السفينة" : "Vessel Registration"} required>
                <TextInput placeholder="VES-XXXXXXXX" value={vesselReg} onChange={(e) => setVesselReg(e.target.value)} className="font-['JetBrains_Mono']" />
              </FormField>
              <FormField label={isAr ? "الميناء" : "Marina"} required>
                <SelectInput options={MARINAS} placeholder={isAr ? "اختر الميناء" : "Select marina"} value={marina} onChange={(e) => setMarina(e.target.value)} />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "تاريخ البدء" : "Start Date"} required>
                <TextInput type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </FormField>
              <FormField label={isAr ? "تاريخ الانتهاء" : "End Date"} required>
                <TextInput type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </FormField>
            </div>
            <FormField label={isAr ? "الوجهة" : "Destination"} required>
              <TextInput placeholder={isAr ? "الوجهة / المسار" : "Destination / Route"} value={destination} onChange={(e) => setDestination(e.target.value)} />
            </FormField>
            <FormField label={isAr ? "معرّف GPS" : "GPS Tracker ID"}>
              <TextInput placeholder="GPS-XXXX-MAR" value={gpsTrackerId} onChange={(e) => setGpsTrackerId(e.target.value)} className="font-['JetBrains_Mono']" />
            </FormField>
            <FormField label={isAr ? "فحص السلامة مكتمل؟" : "Safety Check Completed?"} required>
              <RadioGroup name="safety" options={[{ value: "yes", label: isAr ? "نعم" : "Yes" }, { value: "no", label: isAr ? "لا" : "No" }]} value={safetyCheck} onChange={setSafetyCheck} />
            </FormField>
          </div>
        </SectionCard>
        <TravelDocSection data={doc} onChange={(k, v) => setDoc(d => ({ ...d, [k]: v }))} isAr={isAr} scannerConnected={scannerConnected} autoFilled={autoFilled} onScan={handleScan} />
      </div>
      <PersonalDetailsSection data={personal} onChange={(k, v) => setPersonal(p => ({ ...p, [k]: v }))} isAr={isAr} autoFilled={autoFilled} />
      {passengers.map((p, idx) => (
        <SectionCard key={p.id} title={`${isAr ? "راكب" : "Passenger"} #${idx + 1}`} icon="ri-user-line" accentColor="#4ADE80">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label={isAr ? "الاسم" : "Name"} required><TextInput placeholder={isAr ? "الاسم الكامل" : "Full name"} value={p.name} onChange={(e) => updatePassenger(p.id, "name", e.target.value)} /></FormField>
            <FormField label={isAr ? "الجنسية" : "Nationality"} required><SelectInput options={COUNTRIES} placeholder={isAr ? "اختر" : "Select"} value={p.nationality} onChange={(e) => updatePassenger(p.id, "nationality", e.target.value)} /></FormField>
            <FormField label={isAr ? "رقم الوثيقة" : "Doc Number"} required>
              <div className="flex gap-2">
                <TextInput placeholder="ID / Passport" value={p.docNumber} onChange={(e) => updatePassenger(p.id, "docNumber", e.target.value)} className="flex-1 font-['JetBrains_Mono']" />
                <button type="button" onClick={() => removePassenger(p.id)} className="px-3 py-2 rounded-lg border text-xs cursor-pointer" style={{ background: "rgba(248,113,113,0.06)", borderColor: "rgba(248,113,113,0.2)", color: "#F87171" }}><i className="ri-close-line" /></button>
              </div>
            </FormField>
          </div>
        </SectionCard>
      ))}
      <button type="button" onClick={addPassenger} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed text-sm font-semibold cursor-pointer transition-all" style={{ borderColor: "rgba(181,142,60,0.2)", color: "#D4A84B", background: "rgba(181,142,60,0.03)" }} onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(181,142,60,0.4)"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(181,142,60,0.2)"; }}>
        <i className="ri-user-add-line" />{isAr ? "إضافة راكب" : "Add Passenger"}
      </button>
      <FormActions onCancel={onCancel} onSave={handleSave} saveLabel={isAr ? "تأكيد تأجير القارب" : "Confirm Boat Rental"} isAr={isAr} saving={saving} />
    </div>
  );
};
export default BoatRentalForm;
