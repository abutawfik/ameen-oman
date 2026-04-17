import { useState } from "react";
import {
  SectionCard, FormField, TextInput, SelectInput, RadioGroup, TipBanner, FormActions, BRANCHES, COUNTRIES,
} from "@/pages/dashboard/hotel-events/components/FormComponents";
import TravelDocSection, { type TravelDocData } from "@/pages/dashboard/hotel-events/components/TravelDocSection";
import PersonalDetailsSection, { type PersonalData } from "@/pages/dashboard/hotel-events/components/PersonalDetailsSection";
import TorConfirmation from "./components/TorConfirmation";

const TICKET_TYPES = [
  { value: "adult",    label: "Adult",          labelAr: "بالغ" },
  { value: "child",    label: "Child",          labelAr: "طفل" },
  { value: "senior",   label: "Senior",         labelAr: "كبير السن" },
  { value: "student",  label: "Student",        labelAr: "طالب" },
  { value: "group",    label: "Group",          labelAr: "مجموعة" },
  { value: "vip",      label: "VIP",            labelAr: "VIP" },
  { value: "free",     label: "Free Entry",     labelAr: "دخول مجاني" },
];

const PAYMENT_METHODS = [
  { value: "cash",   label: "Cash" },
  { value: "card",   label: "Card" },
  { value: "online", label: "Online" },
  { value: "voucher",label: "Voucher" },
];

const ATTRACTIONS = [
  { value: "national_museum",  label: "National Museum" },
  { value: "heritage_village", label: "Heritage Village" },
  { value: "nature_reserve",   label: "Nature Reserve" },
  { value: "cultural_center",  label: "Cultural Center" },
  { value: "archaeological",   label: "Archaeological Site" },
  { value: "theme_park",       label: "Theme Park" },
  { value: "aquarium",         label: "Aquarium" },
  { value: "zoo",              label: "Zoo / Wildlife Park" },
  { value: "other",            label: "Other" },
];

const emptyPersonal = (): PersonalData => ({ firstName: "", lastName: "", gender: "", dob: "", nationality: "", placeOfBirth: "", countryOfResidence: "", email: "", primaryContact: "", secondaryContact: "" });
const emptyDoc = (): TravelDocData => ({ holderStatus: "primary", docType: "", docNumber: "", issuingCountry: "", placeOfIssue: "", issuingAuthority: "", issueDate: "", expiryDate: "" });

interface Props { isAr: boolean; onCancel: () => void; }

const AttractionEntryForm = ({ isAr, onCancel }: Props) => {
  const [attractionName, setAttractionName] = useState("");
  const [attractionType, setAttractionType] = useState("");
  const [location, setLocation] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [ticketType, setTicketType] = useState("adult");
  const [groupSize, setGroupSize] = useState("1");
  const [ticketPrice, setTicketPrice] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [personal, setPersonal] = useState<PersonalData>(emptyPersonal());
  const [doc, setDoc] = useState<TravelDocData>(emptyDoc());
  const [autoFilled, setAutoFilled] = useState(false);
  const [scannerConnected] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  const handleScan = () => {
    setDoc({ holderStatus: "primary", docType: "passport", docNumber: "P99887766", issuingCountry: "DE", placeOfIssue: "Berlin", issuingAuthority: "German Authority", issueDate: "2021-04-20", expiryDate: "2031-04-19" });
    setPersonal({ firstName: "Klaus", lastName: "Müller", gender: "male", dob: "1985-06-14", nationality: "DE", placeOfBirth: "Berlin", countryOfResidence: "DE", email: "k.muller@email.de", primaryContact: "+XXX 9456 7890", secondaryContact: "" });
    setAutoFilled(true);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setRefNumber(`AMN-TOR-${Date.now()}-${Math.floor(Math.random() * 9000) + 1000}`); setConfirmed(true); }, 1800);
  };

  if (confirmed) return <TorConfirmation refNumber={refNumber} eventType={isAr ? "دخول معلم سياحي" : "Attraction Entry"} eventCode="TOR_ATTRACTION" color="#D4A84B" isAr={isAr} onReset={() => { setConfirmed(false); setAutoFilled(false); }} />;

  return (
    <div className="space-y-5">
      <TipBanner text={isAr ? "سجّل بيانات الزائر وتفاصيل التذكرة لكل دخول إلى المعالم السياحية." : "Record visitor details and ticket information for each attraction entry."} color="cyan" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <SectionCard title={isAr ? "معلومات المعلم والزيارة" : "Attraction & Visit Info"} icon="ri-ticket-line" accentColor="#D4A84B">
          <div className="space-y-4">
            <FormField label={isAr ? "اسم المعلم السياحي" : "Attraction Name"} required>
              <TextInput placeholder={isAr ? "اسم المعلم" : "Attraction name"} value={attractionName} onChange={(e) => setAttractionName(e.target.value)} />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "نوع المعلم" : "Attraction Type"} required>
                <SelectInput options={ATTRACTIONS} placeholder={isAr ? "اختر النوع" : "Select type"} value={attractionType} onChange={(e) => setAttractionType(e.target.value)} />
              </FormField>
              <FormField label={isAr ? "الموقع" : "Location"} required>
                <TextInput placeholder={isAr ? "المدينة / المنطقة" : "City / Region"} value={location} onChange={(e) => setLocation(e.target.value)} />
              </FormField>
            </div>
            <FormField label={isAr ? "تاريخ الزيارة" : "Visit Date"} required>
              <TextInput type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "نوع التذكرة" : "Ticket Type"} required>
                <SelectInput options={TICKET_TYPES.map(t => ({ value: t.value, label: isAr ? t.labelAr : t.label }))} value={ticketType} onChange={(e) => setTicketType(e.target.value)} />
              </FormField>
              <FormField label={isAr ? "حجم المجموعة" : "Group Size"} required>
                <TextInput type="number" placeholder="1" value={groupSize} onChange={(e) => setGroupSize(e.target.value)} className="font-['JetBrains_Mono']" />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "سعر التذكرة (LCY)" : "Ticket Price (LCY)"}>
                <div className="relative">
                  <TextInput type="number" placeholder="0.000" value={ticketPrice} onChange={(e) => setTicketPrice(e.target.value)} className="font-['JetBrains_Mono'] pr-12" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-['JetBrains_Mono']">LCY</span>
                </div>
              </FormField>
              <FormField label={isAr ? "طريقة الدفع" : "Payment Method"} required>
                <SelectInput options={PAYMENT_METHODS} placeholder={isAr ? "اختر" : "Select"} value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} />
              </FormField>
            </div>
          </div>
        </SectionCard>
        <TravelDocSection data={doc} onChange={(k, v) => setDoc(d => ({ ...d, [k]: v }))} isAr={isAr} scannerConnected={scannerConnected} autoFilled={autoFilled} onScan={handleScan} />
      </div>
      <PersonalDetailsSection data={personal} onChange={(k, v) => setPersonal(p => ({ ...p, [k]: v }))} isAr={isAr} autoFilled={autoFilled} />
      <FormActions onCancel={onCancel} onSave={handleSave} saveLabel={isAr ? "تسجيل الدخول" : "Register Entry"} isAr={isAr} saving={saving} />
    </div>
  );
};
export default AttractionEntryForm;
