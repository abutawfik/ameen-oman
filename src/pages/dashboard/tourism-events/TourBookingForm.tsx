import { useState } from "react";
import {
  SectionCard, FormField, TextInput, SelectInput, TipBanner, FormActions, BRANCHES, COUNTRIES,
} from "@/pages/dashboard/hotel-events/components/FormComponents";
import TravelDocSection, { type TravelDocData } from "@/pages/dashboard/hotel-events/components/TravelDocSection";
import PersonalDetailsSection, { type PersonalData } from "@/pages/dashboard/hotel-events/components/PersonalDetailsSection";
import TorConfirmation from "./components/TorConfirmation";

const TOUR_TYPES = [
  { value: "cultural",    label: "Cultural Tour",       labelAr: "جولة ثقافية" },
  { value: "heritage",    label: "Heritage Tour",       labelAr: "جولة تراثية" },
  { value: "nature",      label: "Nature & Wildlife",   labelAr: "طبيعة وحياة برية" },
  { value: "desert",      label: "Desert Safari",       labelAr: "سفاري صحراوي" },
  { value: "coastal",     label: "Coastal / Marine",    labelAr: "ساحلي / بحري" },
  { value: "city",        label: "City Tour",           labelAr: "جولة المدينة" },
  { value: "adventure",   label: "Adventure",           labelAr: "مغامرة" },
  { value: "religious",   label: "Religious / Pilgrimage", labelAr: "ديني / حج" },
  { value: "culinary",    label: "Culinary",            labelAr: "طهي وغذاء" },
];

const DURATIONS = [
  { value: "half_day",  label: "Half Day (4 hrs)" },
  { value: "full_day",  label: "Full Day (8 hrs)" },
  { value: "2_days",    label: "2 Days" },
  { value: "3_days",    label: "3 Days" },
  { value: "week",      label: "1 Week" },
  { value: "custom",    label: "Custom" },
];

const emptyPersonal = (): PersonalData => ({ firstName: "", lastName: "", gender: "", dob: "", nationality: "", placeOfBirth: "", countryOfResidence: "", email: "", primaryContact: "", secondaryContact: "" });
const emptyDoc = (): TravelDocData => ({ holderStatus: "primary", docType: "", docNumber: "", issuingCountry: "", placeOfIssue: "", issuingAuthority: "", issueDate: "", expiryDate: "" });

interface Props { isAr: boolean; onCancel: () => void; }

const TourBookingForm = ({ isAr, onCancel }: Props) => {
  const [operatorName, setOperatorName] = useState("");
  const [operatorLicense, setOperatorLicense] = useState("");
  const [tourType, setTourType] = useState("");
  const [tourDate, setTourDate] = useState("");
  const [duration, setDuration] = useState("");
  const [groupSize, setGroupSize] = useState("1");
  const [guideName, setGuideName] = useState("");
  const [guideLicense, setGuideLicense] = useState("");
  const [meetingPoint, setMeetingPoint] = useState("");
  const [pricePerPerson, setPricePerPerson] = useState("");
  const [personal, setPersonal] = useState<PersonalData>(emptyPersonal());
  const [doc, setDoc] = useState<TravelDocData>(emptyDoc());
  const [autoFilled, setAutoFilled] = useState(false);
  const [scannerConnected] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  const handleScan = () => {
    setDoc({ holderStatus: "primary", docType: "passport", docNumber: "P11223344", issuingCountry: "FR", placeOfIssue: "Paris", issuingAuthority: "French Authority", issueDate: "2022-07-10", expiryDate: "2032-07-09" });
    setPersonal({ firstName: "Marie", lastName: "Dupont", gender: "female", dob: "1988-02-25", nationality: "FR", placeOfBirth: "Paris", countryOfResidence: "FR", email: "marie.dupont@email.fr", primaryContact: "+XXX 9567 8901", secondaryContact: "" });
    setAutoFilled(true);
  };

  const totalPrice = parseFloat(pricePerPerson) * parseInt(groupSize || "1");

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setRefNumber(`AMN-TOR-${Date.now()}-${Math.floor(Math.random() * 9000) + 1000}`); setConfirmed(true); }, 1800);
  };

  if (confirmed) return <TorConfirmation refNumber={refNumber} eventType={isAr ? "حجز جولة سياحية" : "Tour Booking"} eventCode="TOR_BOOKING" color="#4ADE80" isAr={isAr} onReset={() => { setConfirmed(false); setAutoFilled(false); }} />;

  return (
    <div className="space-y-5">
      <TipBanner text={isAr ? "تأكد من صحة رخصة المشغل السياحي والمرشد قبل الإرسال." : "Verify tour operator and guide license numbers before submission."} color="cyan" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <SectionCard title={isAr ? "تفاصيل الجولة" : "Tour Details"} icon="ri-map-2-line" accentColor="#4ADE80">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "اسم المشغل السياحي" : "Tour Operator"} required>
                <TextInput placeholder={isAr ? "اسم الشركة" : "Company name"} value={operatorName} onChange={(e) => setOperatorName(e.target.value)} />
              </FormField>
              <FormField label={isAr ? "رخصة المشغل" : "Operator License"} required>
                <TextInput placeholder="OPL-XXXXXXXX" value={operatorLicense} onChange={(e) => setOperatorLicense(e.target.value)} className="font-['JetBrains_Mono']" />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "نوع الجولة" : "Tour Type"} required>
                <SelectInput options={TOUR_TYPES.map(t => ({ value: t.value, label: isAr ? t.labelAr : t.label }))} placeholder={isAr ? "اختر النوع" : "Select type"} value={tourType} onChange={(e) => setTourType(e.target.value)} />
              </FormField>
              <FormField label={isAr ? "تاريخ الجولة" : "Tour Date"} required>
                <TextInput type="date" value={tourDate} onChange={(e) => setTourDate(e.target.value)} />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "المدة" : "Duration"} required>
                <SelectInput options={DURATIONS} placeholder={isAr ? "اختر المدة" : "Select duration"} value={duration} onChange={(e) => setDuration(e.target.value)} />
              </FormField>
              <FormField label={isAr ? "حجم المجموعة" : "Group Size"} required>
                <TextInput type="number" placeholder="1" value={groupSize} onChange={(e) => setGroupSize(e.target.value)} className="font-['JetBrains_Mono']" />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "اسم المرشد" : "Guide Name"} required>
                <TextInput placeholder={isAr ? "الاسم الكامل" : "Full name"} value={guideName} onChange={(e) => setGuideName(e.target.value)} />
              </FormField>
              <FormField label={isAr ? "رخصة المرشد" : "Guide License"} required>
                <TextInput placeholder="GDL-XXXXXXXX" value={guideLicense} onChange={(e) => setGuideLicense(e.target.value)} className="font-['JetBrains_Mono']" />
              </FormField>
            </div>
            <FormField label={isAr ? "نقطة الالتقاء" : "Meeting Point"}>
              <TextInput placeholder={isAr ? "الموقع / الفندق" : "Location / Hotel"} value={meetingPoint} onChange={(e) => setMeetingPoint(e.target.value)} />
            </FormField>
            <FormField label={isAr ? "السعر للفرد (LCY)" : "Price Per Person (LCY)"}>
              <div className="relative">
                <TextInput type="number" placeholder="0.000" value={pricePerPerson} onChange={(e) => setPricePerPerson(e.target.value)} className="font-['JetBrains_Mono'] pr-12" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-['JetBrains_Mono']">LCY</span>
              </div>
            </FormField>
            {pricePerPerson && (
              <div className="flex items-center justify-between px-4 py-3 rounded-xl border" style={{ background: "rgba(181,142,60,0.04)", borderColor: "rgba(181,142,60,0.15)" }}>
                <span className="text-gray-400 text-xs">{isAr ? "الإجمالي للمجموعة" : "Group Total"}</span>
                <span className="text-gold-400 font-bold font-['JetBrains_Mono']">LCY {isNaN(totalPrice) ? "0.000" : totalPrice.toFixed(3)}</span>
              </div>
            )}
          </div>
        </SectionCard>
        <TravelDocSection data={doc} onChange={(k, v) => setDoc(d => ({ ...d, [k]: v }))} isAr={isAr} scannerConnected={scannerConnected} autoFilled={autoFilled} onScan={handleScan} />
      </div>
      <PersonalDetailsSection data={personal} onChange={(k, v) => setPersonal(p => ({ ...p, [k]: v }))} isAr={isAr} autoFilled={autoFilled} />
      <FormActions onCancel={onCancel} onSave={handleSave} saveLabel={isAr ? "تأكيد حجز الجولة" : "Confirm Tour Booking"} isAr={isAr} saving={saving} />
    </div>
  );
};
export default TourBookingForm;
