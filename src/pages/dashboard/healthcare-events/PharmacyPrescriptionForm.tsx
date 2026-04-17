import { useState } from "react";
import {
  SectionCard, FormField, TextInput, SelectInput, RadioGroup, TipBanner, FormActions, BRANCHES, COUNTRIES,
} from "@/pages/dashboard/hotel-events/components/FormComponents";
import TravelDocSection, { type TravelDocData } from "@/pages/dashboard/hotel-events/components/TravelDocSection";
import PersonalDetailsSection, { type PersonalData } from "@/pages/dashboard/hotel-events/components/PersonalDetailsSection";
import HltConfirmation from "./components/HltConfirmation";

const MED_CATEGORIES = [
  { value: "standard",   label: "Standard",   labelAr: "عادي",    color: "#4ADE80" },
  { value: "controlled", label: "Controlled", labelAr: "مضبوط",   color: "#FACC15" },
  { value: "narcotic",   label: "Narcotic",   labelAr: "مخدر",    color: "#C94A5E" },
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

const PharmacyPrescriptionForm = ({ isAr, onCancel }: Props) => {
  const [pharmacyBranch, setPharmacyBranch] = useState("");
  const [pharmacyLicense, setPharmacyLicense] = useState("");
  const [prescriptionId, setPrescriptionId] = useState("");
  const [prescriptionDate, setPrescriptionDate] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [doctorLicense, setDoctorLicense] = useState("");
  const [doctorFacility, setDoctorFacility] = useState("");
  const [medCategory, setMedCategory] = useState("standard");
  const [medicationName, setMedicationName] = useState("");
  const [dosage, setDosage] = useState("");
  const [quantity, setQuantity] = useState("");
  const [dispensingNotes, setDispensingNotes] = useState("");
  const [personal, setPersonal] = useState<PersonalData>(emptyPersonal());
  const [doc, setDoc] = useState<TravelDocData>(emptyDoc());
  const [autoFilled, setAutoFilled] = useState(false);
  const [scannerConnected] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  const handleScan = () => {
    setDoc({ holderStatus: "primary", docType: "national_id", docNumber: "NID-55667788", issuingCountry: "SA", placeOfIssue: "Capital City", issuingAuthority: "National Authority", issueDate: "2022-01-15", expiryDate: "2032-01-14" });
    setPersonal({ firstName: "Layla", lastName: "Al-Rashidi", gender: "female", dob: "1995-03-08", nationality: "SA", placeOfBirth: "Capital City", countryOfResidence: "SA", email: "layla.rashidi@email.com", primaryContact: "+XXX 9345 6789", secondaryContact: "" });
    setAutoFilled(true);
  };

  const selectedCat = MED_CATEGORIES.find(c => c.value === medCategory);
  const isControlled = medCategory === "controlled" || medCategory === "narcotic";

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setRefNumber(`AMN-HLT-${Date.now()}-${Math.floor(Math.random() * 9000) + 1000}`);
      setConfirmed(true);
    }, 1800);
  };

  if (confirmed) return <HltConfirmation refNumber={refNumber} eventType={isAr ? "وصفة طبية" : "Pharmacy Prescription"} eventCode="HLT_PRESCRIPTION" color="#4ADE80" isAr={isAr} onReset={() => { setConfirmed(false); setAutoFilled(false); }} />;

  return (
    <div className="space-y-5">
      {isControlled && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl border" style={{ background: "rgba(201,74,94,0.06)", borderColor: "rgba(201,74,94,0.25)" }}>
          <i className="ri-alert-line text-red-400 text-sm mt-0.5 flex-shrink-0" />
          <p className="text-red-400 text-sm font-['Inter']">
            {isAr ? "تنبيه: الأدوية المضبوطة والمخدرة تُبلَّغ تلقائياً إلى Al-Ameen وتتطلب موافقة إضافية." : "Alert: Controlled and narcotic medications are auto-reported to Al-Ameen and require additional approval."}
          </p>
        </div>
      )}
      <TipBanner text={isAr ? "تأكد من صحة رقم ترخيص الطبيب والصيدلية قبل الإرسال." : "Verify doctor and pharmacy license numbers before submission."} color="cyan" />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Prescription Info */}
        <SectionCard title={isAr ? "معلومات الوصفة" : "Prescription Information"} icon="ri-medicine-bottle-line" accentColor="#4ADE80">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "الصيدلية" : "Pharmacy Branch"} required>
                <SelectInput options={BRANCHES} placeholder={isAr ? "اختر الصيدلية" : "Select pharmacy"} value={pharmacyBranch} onChange={(e) => setPharmacyBranch(e.target.value)} />
              </FormField>
              <FormField label={isAr ? "رخصة الصيدلية" : "Pharmacy License"} required>
                <TextInput placeholder="PHL-XXXXXXXX" value={pharmacyLicense} onChange={(e) => setPharmacyLicense(e.target.value)} className="font-['JetBrains_Mono']" />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "رقم الوصفة" : "Prescription ID"} required>
                <TextInput placeholder="RX-XXXXXXXXXX" value={prescriptionId} onChange={(e) => setPrescriptionId(e.target.value)} className="font-['JetBrains_Mono']" />
              </FormField>
              <FormField label={isAr ? "تاريخ الوصفة" : "Prescription Date"} required>
                <TextInput type="date" value={prescriptionDate} onChange={(e) => setPrescriptionDate(e.target.value)} />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "اسم الطبيب" : "Doctor Name"} required>
                <TextInput placeholder={isAr ? "الاسم الكامل" : "Full name"} value={doctorName} onChange={(e) => setDoctorName(e.target.value)} />
              </FormField>
              <FormField label={isAr ? "رخصة الطبيب" : "Doctor License"} required>
                <TextInput placeholder="DRL-XXXXXXXX" value={doctorLicense} onChange={(e) => setDoctorLicense(e.target.value)} className="font-['JetBrains_Mono']" />
              </FormField>
            </div>
            <FormField label={isAr ? "المنشأة الصحية للطبيب" : "Doctor's Facility"}>
              <TextInput placeholder={isAr ? "اسم المستشفى / العيادة" : "Hospital / clinic name"} value={doctorFacility} onChange={(e) => setDoctorFacility(e.target.value)} />
            </FormField>
          </div>
        </SectionCard>

        {/* Medication */}
        <SectionCard title={isAr ? "تفاصيل الدواء" : "Medication Details"} icon="ri-capsule-line">
          <div className="space-y-4">
            <FormField label={isAr ? "فئة الدواء" : "Medication Category"} required>
              <div className="flex gap-2">
                {MED_CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setMedCategory(cat.value)}
                    className="flex-1 py-2.5 rounded-lg border text-xs font-bold cursor-pointer transition-all font-['Inter']"
                    style={{
                      background: medCategory === cat.value ? `${cat.color}15` : "rgba(255,255,255,0.03)",
                      borderColor: medCategory === cat.value ? cat.color : "rgba(255,255,255,0.08)",
                      color: medCategory === cat.value ? cat.color : "#4B5563",
                    }}
                  >
                    {isAr ? cat.labelAr : cat.label}
                  </button>
                ))}
              </div>
              {selectedCat && (
                <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg border" style={{ background: `${selectedCat.color}08`, borderColor: `${selectedCat.color}25` }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: selectedCat.color }} />
                  <span className="text-xs font-semibold" style={{ color: selectedCat.color }}>
                    {isAr ? (medCategory === "standard" ? "دواء عادي — لا قيود" : medCategory === "controlled" ? "دواء مضبوط — يتطلب موافقة" : "مخدر — إبلاغ إلزامي") : (medCategory === "standard" ? "Standard — No restrictions" : medCategory === "controlled" ? "Controlled — Approval required" : "Narcotic — Mandatory reporting")}
                  </span>
                </div>
              )}
            </FormField>
            <FormField label={isAr ? "اسم الدواء" : "Medication Name"} required>
              <TextInput placeholder={isAr ? "الاسم التجاري / العلمي" : "Brand / generic name"} value={medicationName} onChange={(e) => setMedicationName(e.target.value)} />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "الجرعة" : "Dosage"} required>
                <TextInput placeholder="e.g. 500mg twice daily" value={dosage} onChange={(e) => setDosage(e.target.value)} />
              </FormField>
              <FormField label={isAr ? "الكمية" : "Quantity"} required>
                <TextInput type="number" placeholder="30" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="font-['JetBrains_Mono']" />
              </FormField>
            </div>
            <FormField label={isAr ? "ملاحظات الصرف" : "Dispensing Notes"}>
              <textarea
                rows={3}
                placeholder={isAr ? "أي ملاحظات خاصة بالصرف..." : "Any special dispensing notes..."}
                value={dispensingNotes}
                onChange={(e) => setDispensingNotes(e.target.value)}
                maxLength={500}
                className="w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-gray-600 outline-none transition-all duration-200 resize-none font-['Inter']"
                style={{ background: "#0F1923", border: "1px solid rgba(255,255,255,0.08)" }}
                onFocus={(e) => { e.target.style.borderColor = "#D6B47E"; e.target.style.boxShadow = "0 0 0 2px rgba(184,138,60,0.08)"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
              />
            </FormField>
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <TravelDocSection data={doc} onChange={(k, v) => setDoc(d => ({ ...d, [k]: v }))} isAr={isAr} scannerConnected={scannerConnected} autoFilled={autoFilled} onScan={handleScan} />
        <PersonalDetailsSection data={personal} onChange={(k, v) => setPersonal(p => ({ ...p, [k]: v }))} isAr={isAr} autoFilled={autoFilled} />
      </div>

      <FormActions onCancel={onCancel} onSave={handleSave} saveLabel={isAr ? "تسجيل الوصفة الطبية" : "Register Prescription"} isAr={isAr} saving={saving} />
    </div>
  );
};

export default PharmacyPrescriptionForm;
