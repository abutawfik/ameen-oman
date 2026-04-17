import { useState } from "react";
import {
  SectionCard, FormField, TextInput, SelectInput, RadioGroup, FormActions,
  ScannerWidget, COUNTRIES, DOC_TYPES, GENDERS,
} from "@/pages/dashboard/hotel-events/components/FormComponents";
import UtilConfirmation from "./components/UtilConfirmation";

interface Props { isAr: boolean; onCancel: () => void; }

const GOVERNORATES = [
  { value: "capital",   label: "Capital Region / منطقة العاصمة" },
  { value: "north",     label: "Northern Region / المنطقة الشمالية" },
  { value: "south",     label: "Southern Region / المنطقة الجنوبية" },
  { value: "east",      label: "Eastern Region / المنطقة الشرقية" },
  { value: "west",      label: "Western Region / المنطقة الغربية" },
  { value: "central",   label: "Central Region / المنطقة الوسطى" },
  { value: "coastal_n", label: "Northern Coastal / الساحل الشمالي" },
  { value: "coastal_s", label: "Southern Coastal / الساحل الجنوبي" },
  { value: "interior",  label: "Interior Region / المنطقة الداخلية" },
  { value: "highland",  label: "Highland Region / المنطقة الجبلية" },
  { value: "border",    label: "Border Region / المنطقة الحدودية" },
];

const PROVIDERS = [
  { value: "nat_electric", label: "National Electric Company — Electricity / شركة الكهرباء الوطنية" },
  { value: "nat_water", label: "National Water Authority — Water / هيئة المياه الوطنية" },
  { value: "telco_a", label: "Telco A — Internet / مشغل الاتصالات أ — إنترنت" },
  { value: "telco_b", label: "Telco B — Internet / مشغل الاتصالات ب — إنترنت" },
  { value: "bundled", label: "Bundled (Electricity + Water) / مجمّع" },
];

const SERVICE_TYPES = [
  { value: "electricity", label: "Electricity / كهرباء" },
  { value: "water", label: "Water / مياه" },
  { value: "internet", label: "Internet / إنترنت" },
  { value: "bundled", label: "Bundled / مجمّع" },
];

const PROPERTY_TYPES = [
  { value: "residential", label: "Residential / سكني" },
  { value: "commercial", label: "Commercial / تجاري" },
  { value: "industrial", label: "Industrial / صناعي" },
  { value: "government", label: "Government / حكومي" },
];

const TARIFF_OPTIONS = [
  { value: "residential_standard", label: "Residential Standard" },
  { value: "residential_low_income", label: "Residential Low Income" },
  { value: "commercial_standard", label: "Commercial Standard" },
  { value: "industrial", label: "Industrial" },
  { value: "government", label: "Government" },
  { value: "fiber_50", label: "Fiber 50 Mbps" },
  { value: "fiber_100", label: "Fiber 100 Mbps" },
  { value: "fiber_200", label: "Fiber 200 Mbps" },
  { value: "fiber_500", label: "Fiber 500 Mbps" },
];

const NewConnectionForm = ({ isAr, onCancel }: Props) => {
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [scannerConnected] = useState(true);
  const [autoFilled, setAutoFilled] = useState(false);

  // Event Info
  const [provider, setProvider] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [propertyType, setPropertyType] = useState("residential");
  const [meterNumber, setMeterNumber] = useState("");
  const [connectionDate, setConnectionDate] = useState("");
  const [tariff, setTariff] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [wilayat, setWilayat] = useState("");
  const [street, setStreet] = useState("");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [unit, setUnit] = useState("");
  const [landlordRef, setLandlordRef] = useState("");
  const [previousAddress, setPreviousAddress] = useState("");

  // Travel Doc
  const [docType, setDocType] = useState("");
  const [docNumber, setDocNumber] = useState("");
  const [issuingCountry, setIssuingCountry] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [issuingAuthority, setIssuingAuthority] = useState("");

  // Personal
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [nationality, setNationality] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleScan = () => {
    setAutoFilled(true);
    setDocType("passport"); setDocNumber("P-8821-K"); setIssuingCountry("SA");
    setIssueDate("2020-03-15"); setExpiryDate("2030-03-14"); setIssuingAuthority("National Authority");
    setFirstName("Khalid"); setLastName("Al-Rashidi"); setGender("male");
    setDob("1988-07-22"); setNationality("SA"); setEmail("khalid.rashidi@email.com"); setPhone("+XXX 9123 4567");
  };

  const handleSubmit = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setSubmitted(true); }, 1400);
  };

  if (submitted) return <UtilConfirmation isAr={isAr} onReset={() => setSubmitted(false)} eventLabel="New Utility Connection" eventLabelAr="توصيل خدمة جديدة" eventColor="#D6B47E" />;

  const t = {
    eventInfo: isAr ? "معلومات الحدث" : "Event Information",
    provider: isAr ? "مزود الخدمة" : "Provider Name",
    serviceType: isAr ? "نوع الخدمة" : "Service Type",
    accountNumber: isAr ? "رقم الحساب" : "Account Number",
    propertyType: isAr ? "نوع العقار" : "Property Type",
    meterNumber: isAr ? "رقم العداد" : "Meter Number",
    connectionDate: isAr ? "تاريخ التوصيل" : "Connection Date",
    tariff: isAr ? "الخطة / التعرفة" : "Plan / Tariff",
    address: isAr ? "عنوان التوصيل" : "Connection Address",
    governorate: isAr ? "المحافظة" : "Governorate",
    wilayat: isAr ? "الولاية" : "Wilayat",
    street: isAr ? "الشارع" : "Street",
    building: isAr ? "المبنى" : "Building",
    floor: isAr ? "الطابق" : "Floor",
    unit: isAr ? "الوحدة" : "Unit",
    landlordRef: isAr ? "مرجع المالك (من بيانات البلدية)" : "Landlord Reference (from Municipality data)",
    previousAddress: isAr ? "العنوان السابق" : "Previous Address",
    travelDoc: isAr ? "وثيقة السفر" : "Travel Document",
    docType: isAr ? "نوع الوثيقة" : "Document Type",
    docNumber: isAr ? "رقم الوثيقة" : "Document Number",
    issuingCountry: isAr ? "دولة الإصدار" : "Issuing Country",
    issueDate: isAr ? "تاريخ الإصدار" : "Issue Date",
    expiryDate: isAr ? "تاريخ الانتهاء" : "Expiry Date",
    issuingAuthority: isAr ? "جهة الإصدار" : "Issuing Authority",
    personal: isAr ? "البيانات الشخصية" : "Personal Details",
    firstName: isAr ? "الاسم الأول" : "First Name",
    lastName: isAr ? "اسم العائلة" : "Last Name",
    gender: isAr ? "الجنس" : "Gender",
    dob: isAr ? "تاريخ الميلاد" : "Date of Birth",
    nationality: isAr ? "الجنسية" : "Nationality",
    email: isAr ? "البريد الإلكتروني" : "Email",
    phone: isAr ? "رقم الهاتف" : "Phone Number",
  };

  const genderOpts = GENDERS.map((g) => ({ value: g.value, label: isAr ? (g.value === "male" ? "ذكر" : "أنثى") : g.label }));
  const docTypeOpts = DOC_TYPES.map((d) => ({ value: d.value, label: isAr ? (d.value === "passport" ? "جواز سفر" : d.value === "national_id" ? "بطاقة هوية" : d.value === "resident_card" ? "بطاقة إقامة" : "هوية خليجية") : d.label }));

  return (
    <div className="space-y-5">
      {/* Intelligence note */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl border" style={{ background: "rgba(184,138,60,0.04)", borderColor: "rgba(184,138,60,0.15)" }}>
        <i className="ri-lightbulb-flash-line text-gold-400 text-sm mt-0.5 flex-shrink-0" />
        <p className="text-gray-400 text-xs">
          {isAr
            ? "توصيلات المرافق تكشف أين يعيش الشخص فعلياً — غالباً مختلف عن العنوان المسجّل. يتم التحقق المتقاطع مع بيانات إيجار البلدية وتسجيلات الفنادق."
            : "Utility connections reveal WHERE a person actually lives — often different from registered address. Cross-referenced with Municipality rental data and hotel check-ins."}
        </p>
      </div>

      {/* 2-column layout: Event Info + Travel Doc */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Event Info */}
        <SectionCard title={t.eventInfo} icon="ri-plug-line">
          <div className="space-y-4">
            <FormField label={t.provider} required>
              <SelectInput options={PROVIDERS} placeholder={isAr ? "اختر المزود" : "Select provider"} value={provider} onChange={(e) => setProvider(e.target.value)} />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={t.serviceType} required>
                <SelectInput options={SERVICE_TYPES} placeholder={isAr ? "اختر" : "Select"} value={serviceType} onChange={(e) => setServiceType(e.target.value)} />
              </FormField>
              <FormField label={t.propertyType} required>
                <SelectInput options={PROPERTY_TYPES} placeholder={isAr ? "اختر" : "Select"} value={propertyType} onChange={(e) => setPropertyType(e.target.value)} />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={t.accountNumber} required>
                <TextInput placeholder="ACC-XXXX-XXXX" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="font-['JetBrains_Mono']" />
              </FormField>
              <FormField label={t.meterNumber} required>
                <TextInput placeholder="MTR-XXXXXXXX" value={meterNumber} onChange={(e) => setMeterNumber(e.target.value)} className="font-['JetBrains_Mono']" />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={t.connectionDate} required>
                <TextInput type="date" value={connectionDate} onChange={(e) => setConnectionDate(e.target.value)} />
              </FormField>
              <FormField label={t.tariff} required>
                <SelectInput options={TARIFF_OPTIONS} placeholder={isAr ? "اختر الخطة" : "Select plan"} value={tariff} onChange={(e) => setTariff(e.target.value)} />
              </FormField>
            </div>

            {/* Address */}
            <div className="pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <p className="text-gray-400 text-xs font-semibold mb-3 flex items-center gap-1.5">
                <i className="ri-map-pin-line text-gold-400" />{t.address}
              </p>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <FormField label={t.governorate} required>
                    <SelectInput options={GOVERNORATES} placeholder={isAr ? "اختر" : "Select"} value={governorate} onChange={(e) => setGovernorate(e.target.value)} />
                  </FormField>
                  <FormField label={t.wilayat} required>
                    <TextInput placeholder={isAr ? "الولاية" : "Wilayat"} value={wilayat} onChange={(e) => setWilayat(e.target.value)} />
                  </FormField>
                </div>
                <FormField label={t.street} required>
                  <TextInput placeholder={isAr ? "اسم الشارع" : "Street name"} value={street} onChange={(e) => setStreet(e.target.value)} />
                </FormField>
                <div className="grid grid-cols-3 gap-3">
                  <FormField label={t.building}>
                    <TextInput placeholder={isAr ? "رقم" : "No."} value={building} onChange={(e) => setBuilding(e.target.value)} />
                  </FormField>
                  <FormField label={t.floor}>
                    <TextInput placeholder={isAr ? "طابق" : "Floor"} value={floor} onChange={(e) => setFloor(e.target.value)} />
                  </FormField>
                  <FormField label={t.unit}>
                    <TextInput placeholder={isAr ? "وحدة" : "Unit"} value={unit} onChange={(e) => setUnit(e.target.value)} />
                  </FormField>
                </div>
                <FormField label={t.landlordRef}>
                  <div className="relative">
                    <TextInput placeholder="MUN-AGR-XXXX" value={landlordRef} onChange={(e) => setLandlordRef(e.target.value)} className="font-['JetBrains_Mono']" />
                    {landlordRef && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <i className="ri-links-line text-gold-400 text-xs" />
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 text-xs mt-1">{isAr ? "يربط بسجل إيجار البلدية" : "Links to Municipality rental record"}</p>
                </FormField>
                <FormField label={t.previousAddress}>
                  <TextInput placeholder={isAr ? "العنوان السابق (اختياري)" : "Previous address (optional)"} value={previousAddress} onChange={(e) => setPreviousAddress(e.target.value)} />
                </FormField>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Travel Doc */}
        <SectionCard title={t.travelDoc} icon="ri-passport-line">
          <ScannerWidget connected={scannerConnected} onScan={handleScan} isAr={isAr} />
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField label={t.docType} required>
                <SelectInput options={docTypeOpts} placeholder={isAr ? "اختر" : "Select"} value={docType} onChange={(e) => setDocType(e.target.value)} />
              </FormField>
              <FormField label={t.docNumber} required>
                <TextInput placeholder="e.g. A12345678" value={docNumber} onChange={(e) => setDocNumber(e.target.value)} autoFilled={autoFilled && !!docNumber} className="font-['JetBrains_Mono']" />
              </FormField>
            </div>
            <FormField label={t.issuingCountry} required>
              <SelectInput options={COUNTRIES} placeholder={isAr ? "اختر الدولة" : "Select country"} value={issuingCountry} onChange={(e) => setIssuingCountry(e.target.value)} />
            </FormField>
            <FormField label={t.issuingAuthority}>
              <TextInput placeholder={isAr ? "جهة الإصدار" : "e.g. Government"} value={issuingAuthority} onChange={(e) => setIssuingAuthority(e.target.value)} autoFilled={autoFilled && !!issuingAuthority} />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={t.issueDate} required>
                <TextInput type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} autoFilled={autoFilled && !!issueDate} />
              </FormField>
              <FormField label={t.expiryDate} required>
                <TextInput type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} autoFilled={autoFilled && !!expiryDate} />
              </FormField>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Personal Details — full width */}
      <SectionCard title={t.personal} icon="ri-user-line">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormField label={t.firstName} required>
            <TextInput placeholder={isAr ? "الاسم الأول" : "First name"} value={firstName} onChange={(e) => setFirstName(e.target.value)} autoFilled={autoFilled && !!firstName} />
          </FormField>
          <FormField label={t.lastName} required>
            <TextInput placeholder={isAr ? "اسم العائلة" : "Last name"} value={lastName} onChange={(e) => setLastName(e.target.value)} autoFilled={autoFilled && !!lastName} />
          </FormField>
          <FormField label={t.dob} required>
            <TextInput type="date" value={dob} onChange={(e) => setDob(e.target.value)} autoFilled={autoFilled && !!dob} />
          </FormField>
          <FormField label={t.nationality} required>
            <SelectInput options={COUNTRIES} placeholder={isAr ? "اختر" : "Select"} value={nationality} onChange={(e) => setNationality(e.target.value)} />
          </FormField>
          <FormField label={t.gender} required className="sm:col-span-2 lg:col-span-1">
            <RadioGroup name="gender" options={genderOpts} value={gender} onChange={setGender} />
          </FormField>
          <FormField label={t.email}>
            <TextInput type="email" placeholder="name@email.com" value={email} onChange={(e) => setEmail(e.target.value)} autoFilled={autoFilled && !!email} />
          </FormField>
          <FormField label={t.phone} required>
            <TextInput type="tel" placeholder="+968 XXXX XXXX" value={phone} onChange={(e) => setPhone(e.target.value)} autoFilled={autoFilled && !!phone} />
          </FormField>
        </div>
      </SectionCard>

      <FormActions isAr={isAr} onCancel={onCancel} onSave={handleSubmit} saving={saving} saveLabel={isAr ? "تسجيل التوصيل" : "Register Connection"} />
    </div>
  );
};

export default NewConnectionForm;
