import { useState } from "react";
import {
  SectionCard, FormField, TextInput, SelectInput, RadioGroup, TipBanner,
  FormActions, ScannerWidget, COUNTRIES, BRANCHES,
} from "@/pages/dashboard/hotel-events/components/FormComponents";
import TravelDocSection, { type TravelDocData } from "@/pages/dashboard/hotel-events/components/TravelDocSection";
import PersonalDetailsSection, { type PersonalData } from "@/pages/dashboard/hotel-events/components/PersonalDetailsSection";
import MunConfirmation from "./components/MunConfirmation";

const PROPERTY_TYPES = [
  { value: "apartment",  label: "Apartment",           labelAr: "شقة" },
  { value: "villa",      label: "Villa",               labelAr: "فيلا" },
  { value: "studio",     label: "Studio",              labelAr: "استوديو" },
  { value: "room",       label: "Room",                labelAr: "غرفة" },
  { value: "office",     label: "Office",              labelAr: "مكتب" },
  { value: "warehouse",  label: "Warehouse",           labelAr: "مستودع" },
  { value: "shop",       label: "Shop",                labelAr: "محل تجاري" },
];

const REGIONS = [
  { value: "capital",    label: "Capital Region" },
  { value: "northern",   label: "Northern Region" },
  { value: "southern",   label: "Southern Region" },
  { value: "eastern",    label: "Eastern Region" },
  { value: "western",    label: "Western Region" },
  { value: "central",    label: "Central Region" },
  { value: "coastal",    label: "Coastal Region" },
];

const PAYMENT_FREQS = [
  { value: "monthly",   label: "Monthly",    labelAr: "شهري" },
  { value: "quarterly", label: "Quarterly",  labelAr: "ربع سنوي" },
  { value: "biannual",  label: "Bi-Annual",  labelAr: "نصف سنوي" },
  { value: "annual",    label: "Annual",     labelAr: "سنوي" },
];

const PAYMENT_METHODS = [
  { value: "cash",          label: "Cash" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "cheque",        label: "Cheque" },
  { value: "online",        label: "Online Payment" },
];

const FURNISHED_OPTS = [
  { value: "yes",     label: "Furnished",          labelAr: "مفروش" },
  { value: "no",      label: "Unfurnished",         labelAr: "غير مفروش" },
  { value: "partial", label: "Partially Furnished", labelAr: "مفروش جزئياً" },
];

const OCCUPATIONS = [
  { value: "employed",      label: "Employed",      labelAr: "موظف" },
  { value: "self_employed", label: "Self-Employed",  labelAr: "عمل حر" },
  { value: "student",       label: "Student",        labelAr: "طالب" },
  { value: "retired",       label: "Retired",        labelAr: "متقاعد" },
  { value: "unemployed",    label: "Unemployed",     labelAr: "غير موظف" },
];

interface CoTenant {
  id: string;
  name: string;
  docNumber: string;
  nationality: string;
  relationship: string;
}

const emptyPersonal = (): PersonalData => ({
  firstName: "", lastName: "", gender: "", dob: "", nationality: "",
  placeOfBirth: "", countryOfResidence: "", email: "", primaryContact: "", secondaryContact: "",
});
const emptyDoc = (): TravelDocData => ({
  holderStatus: "primary", docType: "", docNumber: "", issuingCountry: "",
  placeOfIssue: "", issuingAuthority: "", issueDate: "", expiryDate: "",
});

interface Props { isAr: boolean; onCancel: () => void; }

const StartRentalForm = ({ isAr, onCancel }: Props) => {
  const [munOffice, setMunOffice] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [region, setRegion] = useState("");
  const [district, setDistrict] = useState("");
  const [area, setArea] = useState("");
  const [street, setStreet] = useState("");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [unit, setUnit] = useState("");
  const [sizeSqm, setSizeSqm] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [furnished, setFurnished] = useState("no");
  const [regNumber, setRegNumber] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerDoc, setOwnerDoc] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [agreementRef, setAgreementRef] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rentLCY, setRentLCY] = useState("");
  const [deposit, setDeposit] = useState("");
  const [payFreq, setPayFreq] = useState("monthly");
  const [payMethod, setPayMethod] = useState("");
  const [occupation, setOccupation] = useState("");
  const [employer, setEmployer] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [occupantsCount, setOccupantsCount] = useState("");
  const [coTenants, setCoTenants] = useState<CoTenant[]>([]);
  const [personal, setPersonal] = useState<PersonalData>(emptyPersonal());
  const [doc, setDoc] = useState<TravelDocData>(emptyDoc());
  const [autoFilled, setAutoFilled] = useState(false);
  const [scannerConnected] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  const handleScan = () => {
    setDoc({
      holderStatus: "primary", docType: "passport", docNumber: "P12345678",
      issuingCountry: "SA", placeOfIssue: "Capital City", issuingAuthority: "National Authority",
      issueDate: "2020-01-10", expiryDate: "2030-01-09",
    });
    setPersonal({
      firstName: "Mohammed", lastName: "Al-Farsi", gender: "male", dob: "1985-03-20",
      nationality: "SA", placeOfBirth: "Capital City", countryOfResidence: "SA",
      email: "m.alfarsi@email.com", primaryContact: "+XXX 9345 6789", secondaryContact: "",
    });
    setAutoFilled(true);
  };

  const addCoTenant = () =>
    setCoTenants((t) => [...t, { id: Date.now().toString(), name: "", docNumber: "", nationality: "", relationship: "" }]);
  const removeCoTenant = (id: string) => setCoTenants((t) => t.filter((c) => c.id !== id));
  const updateCoTenant = (id: string, key: keyof CoTenant, val: string) =>
    setCoTenants((t) => t.map((c) => (c.id === id ? { ...c, [key]: val } : c)));

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      const seq = Math.floor(Math.random() * 9000) + 1000;
      setRefNumber(`AMN-MUN-${Date.now()}-${seq}`);
      setConfirmed(true);
    }, 1800);
  };

  if (confirmed)
    return (
      <MunConfirmation
        refNumber={refNumber}
        eventType={isAr ? "بدء إيجار" : "Start Rental"}
        isAr={isAr}
        onReset={() => { setConfirmed(false); setAgreementRef(""); setAutoFilled(false); }}
      />
    );

  const durationMonths = (() => {
    if (!startDate || !endDate) return null;
    const diff = (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24 * 30);
    return diff > 0 ? Math.round(diff) : null;
  })();

  return (
    <div className="space-y-5">
      <TipBanner
        text={isAr ? "تأكد من صحة رقم تسجيل العقار ومعلومات المالك قبل الحفظ." : "Verify property registration number and owner details before saving."}
        color="amber"
      />

      {/* Property Info */}
      <SectionCard title={isAr ? "معلومات العقار" : "Property Information"} icon="ri-home-3-line">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField label={isAr ? "مكتب البلدية" : "Municipality Office"} required>
            <SelectInput
              options={BRANCHES.map((b) => ({ value: b.value, label: b.label }))}
              placeholder={isAr ? "اختر المكتب" : "Select office"}
              value={munOffice}
              onChange={(e) => setMunOffice(e.target.value)}
            />
          </FormField>
          <FormField label={isAr ? "نوع العقار" : "Property Type"} required>
            <SelectInput
              options={PROPERTY_TYPES.map((p) => ({ value: p.value, label: isAr ? p.labelAr : p.label }))}
              placeholder={isAr ? "اختر النوع" : "Select type"}
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
            />
          </FormField>
          <FormField label={isAr ? "رقم التسجيل" : "Registration Number"} required>
            <TextInput placeholder="REG-XXXX-XXXX" value={regNumber} onChange={(e) => setRegNumber(e.target.value)} className="font-['JetBrains_Mono']" />
          </FormField>
          <FormField label={isAr ? "المساحة (م²)" : "Size (sqm)"} required>
            <TextInput type="number" placeholder="120" value={sizeSqm} onChange={(e) => setSizeSqm(e.target.value)} className="font-['JetBrains_Mono']" />
          </FormField>
          <FormField label={isAr ? "عدد غرف النوم" : "Bedrooms"}>
            <SelectInput
              options={["Studio", "1", "2", "3", "4", "5", "6+"].map((v) => ({ value: v, label: v === "Studio" ? (isAr ? "استوديو" : "Studio") : v }))}
              placeholder={isAr ? "اختر" : "Select"}
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
            />
          </FormField>
          <FormField label={isAr ? "مفروش؟" : "Furnished?"} required>
            <SelectInput
              options={FURNISHED_OPTS.map((f) => ({ value: f.value, label: isAr ? f.labelAr : f.label }))}
              placeholder={isAr ? "اختر" : "Select"}
              value={furnished}
              onChange={(e) => setFurnished(e.target.value)}
            />
          </FormField>
        </div>
      </SectionCard>

      {/* Full Address */}
      <SectionCard title={isAr ? "عنوان العقار الكامل" : "Full Property Address"} icon="ri-map-pin-line">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField label={isAr ? "المنطقة / الإقليم" : "Region / District"} required>
            <SelectInput
              options={REGIONS}
              placeholder={isAr ? "اختر المنطقة" : "Select region"}
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            />
          </FormField>
          <FormField label={isAr ? "الحي" : "District"} required>
            <TextInput placeholder={isAr ? "مثال: الحي الشمالي" : "e.g. Northern District"} value={district} onChange={(e) => setDistrict(e.target.value)} />
          </FormField>
          <FormField label={isAr ? "المنطقة / الحي الفرعي" : "Area / Sub-District"} required>
            <TextInput placeholder={isAr ? "مثال: المنطقة الصناعية" : "e.g. Industrial Area"} value={area} onChange={(e) => setArea(e.target.value)} />
          </FormField>
          <FormField label={isAr ? "الشارع" : "Street"}>
            <TextInput placeholder={isAr ? "اسم الشارع" : "Street name"} value={street} onChange={(e) => setStreet(e.target.value)} />
          </FormField>
          <FormField label={isAr ? "المبنى" : "Building"}>
            <TextInput placeholder={isAr ? "رقم / اسم المبنى" : "Building no. / name"} value={building} onChange={(e) => setBuilding(e.target.value)} />
          </FormField>
          <div className="grid grid-cols-2 gap-2">
            <FormField label={isAr ? "الطابق" : "Floor"}>
              <TextInput placeholder="1" value={floor} onChange={(e) => setFloor(e.target.value)} className="font-['JetBrains_Mono']" />
            </FormField>
            <FormField label={isAr ? "الوحدة" : "Unit"}>
              <TextInput placeholder="A1" value={unit} onChange={(e) => setUnit(e.target.value)} className="font-['JetBrains_Mono']" />
            </FormField>
          </div>
        </div>
      </SectionCard>

      {/* Owner + Agreement side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SectionCard title={isAr ? "معلومات المالك" : "Owner Information"} icon="ri-user-star-line">
          <div className="space-y-4">
            <FormField label={isAr ? "اسم المالك" : "Owner Name"} required>
              <TextInput placeholder={isAr ? "الاسم الكامل" : "Full name"} value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
            </FormField>
            <FormField label={isAr ? "رقم وثيقة المالك" : "Owner Document No."} required>
              <TextInput placeholder="ID / Passport No." value={ownerDoc} onChange={(e) => setOwnerDoc(e.target.value)} className="font-['JetBrains_Mono']" />
            </FormField>
            <FormField label={isAr ? "هاتف المالك" : "Owner Phone"} required>
              <TextInput type="tel" placeholder="+XXX XXXX XXXX" value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value)} className="font-['JetBrains_Mono']" />
            </FormField>
          </div>
        </SectionCard>

        <SectionCard title={isAr ? "تفاصيل عقد الإيجار" : "Rental Agreement"} icon="ri-file-text-line">
          <div className="space-y-4">
            <FormField label={isAr ? "رقم مرجع العقد" : "Agreement Reference"} required>
              <TextInput placeholder="AGR-XXXX-XXXX" value={agreementRef} onChange={(e) => setAgreementRef(e.target.value)} className="font-['JetBrains_Mono']" />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "تاريخ البدء" : "Start Date"} required>
                <TextInput type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </FormField>
              <FormField label={isAr ? "تاريخ الانتهاء" : "End Date"} required>
                <TextInput type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </FormField>
            </div>
            {durationMonths && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ background: "rgba(184,138,60,0.05)", borderColor: "rgba(184,138,60,0.2)" }}>
                <i className="ri-calendar-check-line text-gold-400 text-sm" />
                <span className="text-gold-400 text-xs font-['JetBrains_Mono']">{durationMonths} {isAr ? "شهراً" : "months"}</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "الإيجار (LCY)" : "Rent (LCY)"} required>
                <div className="relative">
                  <TextInput type="number" placeholder="0.000" value={rentLCY} onChange={(e) => setRentLCY(e.target.value)} className="font-['JetBrains_Mono'] pr-12" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-['JetBrains_Mono']">LCY</span>
                </div>
              </FormField>
              <FormField label={isAr ? "التأمين (LCY)" : "Deposit (LCY)"}>
                <div className="relative">
                  <TextInput type="number" placeholder="0.000" value={deposit} onChange={(e) => setDeposit(e.target.value)} className="font-['JetBrains_Mono'] pr-12" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-['JetBrains_Mono']">LCY</span>
                </div>
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "دورية الدفع" : "Payment Frequency"} required>
                <SelectInput
                  options={PAYMENT_FREQS.map((f) => ({ value: f.value, label: isAr ? f.labelAr : f.label }))}
                  placeholder={isAr ? "اختر" : "Select"}
                  value={payFreq}
                  onChange={(e) => setPayFreq(e.target.value)}
                />
              </FormField>
              <FormField label={isAr ? "طريقة الدفع" : "Payment Method"} required>
                <SelectInput
                  options={PAYMENT_METHODS}
                  placeholder={isAr ? "اختر" : "Select"}
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                />
              </FormField>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Travel Doc + Additional Tenant Info side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <TravelDocSection
          data={doc}
          onChange={(k, v) => setDoc((d) => ({ ...d, [k]: v }))}
          isAr={isAr}
          scannerConnected={scannerConnected}
          autoFilled={autoFilled}
          onScan={handleScan}
        />
        <SectionCard title={isAr ? "بيانات إضافية للمستأجر" : "Additional Tenant Info"} icon="ri-briefcase-line">
          <div className="space-y-4">
            <FormField label={isAr ? "المهنة" : "Occupation"} required>
              <SelectInput
                options={OCCUPATIONS.map((o) => ({ value: o.value, label: isAr ? o.labelAr : o.label }))}
                placeholder={isAr ? "اختر المهنة" : "Select occupation"}
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
              />
            </FormField>
            <FormField label={isAr ? "جهة العمل" : "Employer"}>
              <TextInput placeholder={isAr ? "اسم الشركة / الجهة" : "Company / employer name"} value={employer} onChange={(e) => setEmployer(e.target.value)} />
            </FormField>
            <FormField label={isAr ? "جهة الاتصال في حالات الطوارئ" : "Emergency Contact"} required>
              <TextInput type="tel" placeholder="+XXX XXXX XXXX" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} className="font-['JetBrains_Mono']" />
            </FormField>
            <FormField label={isAr ? "عدد الساكنين الإجمالي" : "Total Occupants"} required>
              <TextInput type="number" placeholder="1" value={occupantsCount} onChange={(e) => setOccupantsCount(e.target.value)} className="font-['JetBrains_Mono']" />
            </FormField>
          </div>
        </SectionCard>
      </div>

      {/* Personal Details full-width */}
      <PersonalDetailsSection
        data={personal}
        onChange={(k, v) => setPersonal((p) => ({ ...p, [k]: v }))}
        isAr={isAr}
        autoFilled={autoFilled}
      />

      {/* Co-Tenants */}
      <div>
        {coTenants.map((ct, idx) => (
          <SectionCard key={ct.id} title={`${isAr ? "مستأجر مشارك" : "Co-Tenant"} #${idx + 1}`} icon="ri-user-add-line" className="mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <FormField label={isAr ? "الاسم الكامل" : "Full Name"} required>
                <TextInput placeholder={isAr ? "الاسم" : "Name"} value={ct.name} onChange={(e) => updateCoTenant(ct.id, "name", e.target.value)} />
              </FormField>
              <FormField label={isAr ? "رقم الوثيقة" : "Document No."} required>
                <TextInput placeholder="ID / Passport" value={ct.docNumber} onChange={(e) => updateCoTenant(ct.id, "docNumber", e.target.value)} className="font-['JetBrains_Mono']" />
              </FormField>
              <FormField label={isAr ? "الجنسية" : "Nationality"} required>
                <SelectInput options={COUNTRIES} placeholder={isAr ? "اختر" : "Select"} value={ct.nationality} onChange={(e) => updateCoTenant(ct.id, "nationality", e.target.value)} />
              </FormField>
              <FormField label={isAr ? "صلة القرابة" : "Relationship"} required>
                <SelectInput
                  options={[
                    { value: "spouse",    label: isAr ? "زوج/زوجة" : "Spouse" },
                    { value: "child",     label: isAr ? "ابن/ابنة" : "Child" },
                    { value: "parent",    label: isAr ? "والد/والدة" : "Parent" },
                    { value: "sibling",   label: isAr ? "أخ/أخت" : "Sibling" },
                    { value: "colleague", label: isAr ? "زميل" : "Colleague" },
                    { value: "other",     label: isAr ? "أخرى" : "Other" },
                  ]}
                  placeholder={isAr ? "اختر" : "Select"}
                  value={ct.relationship}
                  onChange={(e) => updateCoTenant(ct.id, "relationship", e.target.value)}
                />
              </FormField>
            </div>
            <div className="flex justify-end mt-3">
              <button
                type="button"
                onClick={() => removeCoTenant(ct.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer whitespace-nowrap"
                style={{ background: "rgba(201,74,94,0.08)", borderColor: "rgba(201,74,94,0.25)", color: "#C94A5E" }}
              >
                <i className="ri-user-unfollow-line" />{isAr ? "إزالة" : "Remove"}
              </button>
            </div>
          </SectionCard>
        ))}
        <button
          type="button"
          onClick={addCoTenant}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed text-sm font-semibold cursor-pointer transition-all"
          style={{ borderColor: "rgba(184,138,60,0.25)", color: "#D6B47E", background: "rgba(184,138,60,0.03)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(184,138,60,0.5)"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(184,138,60,0.06)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(184,138,60,0.25)"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(184,138,60,0.03)"; }}
        >
          <i className="ri-user-add-line" />{isAr ? "إضافة مستأجر مشارك" : "Add Co-Tenant"}
        </button>
      </div>

      <FormActions onCancel={onCancel} onSave={handleSave} saveLabel={isAr ? "حفظ عقد الإيجار" : "Save Rental Agreement"} isAr={isAr} saving={saving} />
    </div>
  );
};

export default StartRentalForm;
