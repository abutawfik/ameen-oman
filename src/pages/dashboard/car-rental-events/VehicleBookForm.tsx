import { useState } from "react";
import {
  SectionCard, FormField, TextInput, SelectInput, RadioGroup, TipBanner,
  FormActions, LookupButton, COUNTRIES, BRANCHES, PAYMENT_METHODS, CARD_TYPES,
} from "@/pages/dashboard/hotel-events/components/FormComponents";
import TravelDocSection, { type TravelDocData } from "@/pages/dashboard/hotel-events/components/TravelDocSection";
import PersonalDetailsSection, { type PersonalData } from "@/pages/dashboard/hotel-events/components/PersonalDetailsSection";
import ConfirmationPanel from "./components/ConfirmationPanel";

// ─── Static data ──────────────────────────────────────────────────────────────
const VEHICLE_CATEGORIES = [
  { value: "economy",  label: "Economy" },
  { value: "compact",  label: "Compact" },
  { value: "suv",      label: "SUV" },
  { value: "luxury",   label: "Luxury" },
  { value: "van",      label: "Van" },
  { value: "pickup",   label: "Pickup" },
];

const INSURANCE_TYPES = [
  { value: "basic",   label: "Basic" },
  { value: "full",    label: "Full Coverage" },
  { value: "premium", label: "Premium" },
];

const RENTAL_PURPOSES = [
  { value: "tourism",   label: "Tourism" },
  { value: "business",  label: "Business" },
  { value: "personal",  label: "Personal" },
  { value: "corporate", label: "Corporate" },
];

const LOCATIONS = [
  { value: "capital_airport",  label: "Capital International Airport" },
  { value: "capital_city",     label: "Capital City Office" },
  { value: "northern_airport", label: "Northern Region Airport" },
  { value: "northern_city",    label: "Northern City Office" },
  { value: "southern_branch",  label: "Southern Branch" },
  { value: "eastern_branch",   label: "Eastern Branch" },
];

// ─── Mock lookup data ─────────────────────────────────────────────────────────
const MOCK_BOOKINGS: Record<string, {
  plate: string; make: string; model: string; year: string; color: string;
  category: string; vin: string; pickupLocation: string; returnLocation: string;
  insurance: string; gpsTrackerId: string;
  personal: Partial<PersonalData>; doc: Partial<TravelDocData>;
}> = {
  "BK-CAR-001": {
    plate: "NAT-A-4821", make: "Toyota", model: "Camry", year: "2024",
    color: "White", category: "compact", vin: "1HGBH41JXMN109186",
    pickupLocation: "capital_airport", returnLocation: "capital_city",
    insurance: "full", gpsTrackerId: "GPS-4821-NAT",
    personal: {
      firstName: "Khalid", lastName: "Al-Mansouri", gender: "male",
      dob: "1985-04-12", nationality: "SA", placeOfBirth: "Riyadh",
      countryOfResidence: "SA", email: "khalid.mansouri@email.com",
      primaryContact: "+966 5512 3456",
    },
    doc: {
      holderStatus: "primary", docType: "passport", docNumber: "G8823401",
      issuingCountry: "SA", placeOfIssue: "Riyadh",
      issuingAuthority: "Government",
      issueDate: "2021-03-10", expiryDate: "2031-03-09",
    },
  },
  "BK-CAR-002": {
    plate: "NAT-B-7734", make: "Nissan", model: "Patrol", year: "2023",
    color: "Black", category: "suv", vin: "JN8AZ2NE5C9012345",
    pickupLocation: "capital_city", returnLocation: "capital_city",
    insurance: "premium", gpsTrackerId: "GPS-7734-NAT",
    personal: {
      firstName: "James", lastName: "Harrison", gender: "male",
      dob: "1979-09-30", nationality: "GB", placeOfBirth: "London",
      countryOfResidence: "AE", email: "j.harrison@corp.ae",
      primaryContact: "+971 5098 7654",
    },
    doc: {
      holderStatus: "primary", docType: "passport", docNumber: "P4490123",
      issuingCountry: "GB", placeOfIssue: "London",
      issuingAuthority: "HM Passport Office",
      issueDate: "2019-06-15", expiryDate: "2029-06-14",
    },
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface AdditionalDriver {
  id: string;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  licenseCountry: string;
  licenseExpiry: string;
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

// ─── Component ────────────────────────────────────────────────────────────────
const VehicleBookForm = ({ isAr, onCancel }: Props) => {
  const [branch, setBranch] = useState("");
  const [bookingRef, setBookingRef] = useState("");
  const [plate, setPlate] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [color, setColor] = useState("");
  const [category, setCategory] = useState("");
  const [vin, setVin] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupDateTime, setPickupDateTime] = useState("");
  const [returnLocation, setReturnLocation] = useState("");
  const [returnDateTime, setReturnDateTime] = useState("");
  const [insurance, setInsurance] = useState("");
  const [gpsTrackerId, setGpsTrackerId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardType, setCardType] = useState("");
  const [rentalPurpose, setRentalPurpose] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseCountry, setLicenseCountry] = useState("");
  const [licenseExpiry, setLicenseExpiry] = useState("");
  const [personal, setPersonal] = useState<PersonalData>(emptyPersonal());
  const [doc, setDoc] = useState<TravelDocData>(emptyDoc());
  const [additionalDrivers, setAdditionalDrivers] = useState<AdditionalDriver[]>([]);
  const [autoFilled, setAutoFilled] = useState(false);
  const [lookupError, setLookupError] = useState(false);
  const [scannerConnected] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  const t = {
    tip: isAr
      ? "أدخل رقم الحجز للحصول على تفاصيل المركبة مسبقاً. جرّب: BK-CAR-001 أو BK-CAR-002"
      : "Enter Booking Reference to pre-fill vehicle details. Try: BK-CAR-001 or BK-CAR-002",
    eventInfo: isAr ? "معلومات الحدث" : "Event Information",
    branch: isAr ? "الفرع" : "Branch",
    bookingRef: isAr ? "رقم الحجز" : "Booking Reference",
    plate: isAr ? "لوحة المركبة" : "Vehicle Plate",
    vin: isAr ? "رقم الهيكل (VIN)" : "VIN",
    make: isAr ? "الماركة" : "Make",
    model: isAr ? "الموديل" : "Model",
    year: isAr ? "السنة" : "Year",
    color: isAr ? "اللون" : "Color",
    category: isAr ? "الفئة" : "Category",
    pickupLoc: isAr ? "موقع الاستلام" : "Pick-Up Location",
    pickupDT: isAr ? "تاريخ ووقت الاستلام" : "Pick-Up Date/Time",
    returnLoc: isAr ? "موقع الإعادة" : "Return Location",
    returnDT: isAr ? "تاريخ ووقت الإعادة" : "Return Date/Time",
    insurance: isAr ? "التأمين" : "Insurance",
    gps: isAr ? "معرّف GPS" : "GPS Tracker ID",
    payment: isAr ? "طريقة الدفع" : "Payment Method",
    cardType: isAr ? "نوع البطاقة" : "Card Type",
    licSection: isAr ? "رخصة القيادة وغرض الإيجار" : "Driving License & Rental Purpose",
    licNumber: isAr ? "رقم رخصة القيادة" : "License Number",
    licCountry: isAr ? "دولة الإصدار" : "Issuing Country",
    licExpiry: isAr ? "تاريخ انتهاء الرخصة" : "License Expiry",
    purpose: isAr ? "غرض الإيجار" : "Rental Purpose",
    addDriver: isAr ? "إضافة سائق آخر" : "Add Additional Driver",
    driverTitle: isAr ? "سائق إضافي" : "Additional Driver",
    removeDriver: isAr ? "إزالة السائق" : "Remove Driver",
    notFound: isAr ? "لم يُعثر على الحجز" : "Booking not found",
  };

  const handleLookup = () => {
    const mock = MOCK_BOOKINGS[bookingRef.toUpperCase()];
    if (mock) {
      setLookupError(false);
      setPlate(mock.plate); setMake(mock.make); setModel(mock.model);
      setYear(mock.year); setColor(mock.color); setCategory(mock.category);
      setVin(mock.vin); setPickupLocation(mock.pickupLocation);
      setReturnLocation(mock.returnLocation); setInsurance(mock.insurance);
      setGpsTrackerId(mock.gpsTrackerId);
      setPersonal({ ...emptyPersonal(), ...mock.personal });
      setDoc({ ...emptyDoc(), ...mock.doc });
      setAutoFilled(true);
    } else {
      setLookupError(true);
    }
  };

  const addDriver = () => {
    setAdditionalDrivers((d) => [
      ...d,
      { id: Date.now().toString(), firstName: "", lastName: "", licenseNumber: "", licenseCountry: "", licenseExpiry: "" },
    ]);
  };
  const removeDriver = (id: string) => setAdditionalDrivers((d) => d.filter((dr) => dr.id !== id));
  const updateDriver = (id: string, key: keyof AdditionalDriver, val: string) => {
    setAdditionalDrivers((d) => d.map((dr) => dr.id === id ? { ...dr, [key]: val } : dr));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      const seq = String(Math.floor(Math.random() * 9000) + 1000);
      setRefNumber(`AMN-CAR-${Date.now()}-${seq}`);
      setConfirmed(true);
    }, 1800);
  };

  if (confirmed) {
    return (
      <ConfirmationPanel
        refNumber={refNumber}
        eventType={isAr ? "حجز مركبة" : "Vehicle Booking"}
        eventCode="CAR_BOOK"
        color="#D6B47E"
        isAr={isAr}
        onReset={() => { setConfirmed(false); setAutoFilled(false); setBookingRef(""); setPlate(""); setMake(""); setModel(""); }}
      />
    );
  }

  return (
    <div className="space-y-5">
      <TipBanner text={t.tip} color="amber" />

      {/* ── Two-column: Event Info + Travel Doc ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* LEFT — Event Info */}
        <SectionCard title={t.eventInfo} icon="ri-car-line">
          <div className="space-y-4">
            {/* Branch + Booking Ref */}
            <div className="grid grid-cols-2 gap-3">
              <FormField label={t.branch} required>
                <SelectInput
                  options={BRANCHES}
                  placeholder={isAr ? "اختر الفرع" : "Select branch"}
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                />
              </FormField>
              <FormField label={t.bookingRef}>
                <div className="flex gap-2">
                  <TextInput
                    placeholder="BK-CAR-XXX"
                    value={bookingRef}
                    onChange={(e) => { setBookingRef(e.target.value); setLookupError(false); }}
                    className="flex-1 font-['JetBrains_Mono'] tracking-wider"
                  />
                  <LookupButton onClick={handleLookup} isAr={isAr} />
                </div>
                {lookupError && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <i className="ri-error-warning-line" />{t.notFound}
                  </p>
                )}
              </FormField>
            </div>

            {/* Plate + VIN */}
            <div className="grid grid-cols-2 gap-3">
              <FormField label={t.plate} required>
                <TextInput
                  placeholder="NAT-A-XXXX"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value)}
                  autoFilled={autoFilled && !!plate}
                  className="font-['JetBrains_Mono'] tracking-wider"
                />
              </FormField>
              <FormField label={t.vin}>
                <TextInput
                  placeholder="1HGBH41JXMN..."
                  value={vin}
                  onChange={(e) => setVin(e.target.value)}
                  autoFilled={autoFilled && !!vin}
                  className="font-['JetBrains_Mono'] text-xs"
                />
              </FormField>
            </div>

            {/* Make + Model + Year */}
            <div className="grid grid-cols-3 gap-3">
              <FormField label={t.make} required>
                <TextInput
                  placeholder="Toyota"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  autoFilled={autoFilled && !!make}
                />
              </FormField>
              <FormField label={t.model} required>
                <TextInput
                  placeholder="Camry"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  autoFilled={autoFilled && !!model}
                />
              </FormField>
              <FormField label={t.year} required>
                <TextInput
                  placeholder="2024"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  autoFilled={autoFilled && !!year}
                  className="font-['JetBrains_Mono']"
                />
              </FormField>
            </div>

            {/* Color + Category */}
            <div className="grid grid-cols-2 gap-3">
              <FormField label={t.color} required>
                <TextInput
                  placeholder={isAr ? "أبيض" : "White"}
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  autoFilled={autoFilled && !!color}
                />
              </FormField>
              <FormField label={t.category} required>
                <SelectInput
                  options={VEHICLE_CATEGORIES}
                  placeholder={isAr ? "اختر الفئة" : "Select category"}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </FormField>
            </div>

            {/* Pick-Up Location + DateTime */}
            <div className="grid grid-cols-2 gap-3">
              <FormField label={t.pickupLoc} required>
                <SelectInput
                  options={LOCATIONS}
                  placeholder={isAr ? "اختر الموقع" : "Select location"}
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                />
              </FormField>
              <FormField label={t.pickupDT} required>
                <TextInput
                  type="datetime-local"
                  value={pickupDateTime}
                  onChange={(e) => setPickupDateTime(e.target.value)}
                />
              </FormField>
            </div>

            {/* Return Location + DateTime */}
            <div className="grid grid-cols-2 gap-3">
              <FormField label={t.returnLoc} required>
                <SelectInput
                  options={LOCATIONS}
                  placeholder={isAr ? "اختر الموقع" : "Select location"}
                  value={returnLocation}
                  onChange={(e) => setReturnLocation(e.target.value)}
                />
              </FormField>
              <FormField label={t.returnDT} required>
                <TextInput
                  type="datetime-local"
                  value={returnDateTime}
                  onChange={(e) => setReturnDateTime(e.target.value)}
                />
              </FormField>
            </div>

            {/* Insurance + GPS */}
            <div className="grid grid-cols-2 gap-3">
              <FormField label={t.insurance} required>
                <SelectInput
                  options={INSURANCE_TYPES}
                  placeholder={isAr ? "اختر التأمين" : "Select insurance"}
                  value={insurance}
                  onChange={(e) => setInsurance(e.target.value)}
                />
              </FormField>
              <FormField label={t.gps}>
                <TextInput
                  placeholder="GPS-XXXX-NAT"
                  value={gpsTrackerId}
                  onChange={(e) => setGpsTrackerId(e.target.value)}
                  autoFilled={autoFilled && !!gpsTrackerId}
                  className="font-['JetBrains_Mono']"
                />
              </FormField>
            </div>

            {/* Payment */}
            <div className="grid grid-cols-2 gap-3">
              <FormField label={t.payment} required>
                <SelectInput
                  options={PAYMENT_METHODS}
                  placeholder={isAr ? "اختر طريقة الدفع" : "Select payment"}
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
              </FormField>
              {(paymentMethod === "credit_card" || paymentMethod === "debit_card") && (
                <FormField label={t.cardType}>
                  <SelectInput
                    options={CARD_TYPES}
                    placeholder={isAr ? "اختر النوع" : "Select type"}
                    value={cardType}
                    onChange={(e) => setCardType(e.target.value)}
                  />
                </FormField>
              )}
            </div>
          </div>
        </SectionCard>

        {/* RIGHT — Travel Document */}
        <TravelDocSection
          data={doc}
          onChange={(k, v) => setDoc((d) => ({ ...d, [k]: v }))}
          isAr={isAr}
          scannerConnected={scannerConnected}
          autoFilled={autoFilled}
          onScan={() => {}}
        />
      </div>

      {/* ── Full-width: Personal Details ── */}
      <PersonalDetailsSection
        data={personal}
        onChange={(k, v) => setPersonal((p) => ({ ...p, [k]: v }))}
        isAr={isAr}
        autoFilled={autoFilled}
      />

      {/* ── Driving License + Rental Purpose ── */}
      <SectionCard title={t.licSection} icon="ri-steering-2-line" accentColor="#FACC15">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormField label={t.licNumber} required>
            <TextInput
              placeholder="DL-XXXXXXXX"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              className="font-['JetBrains_Mono'] tracking-wider"
            />
          </FormField>
          <FormField label={t.licCountry} required>
            <SelectInput
              options={COUNTRIES}
              placeholder={isAr ? "اختر الدولة" : "Select country"}
              value={licenseCountry}
              onChange={(e) => setLicenseCountry(e.target.value)}
            />
          </FormField>
          <FormField label={t.licExpiry} required>
            <TextInput
              type="date"
              value={licenseExpiry}
              onChange={(e) => setLicenseExpiry(e.target.value)}
            />
          </FormField>
          <FormField label={t.purpose} required>
            <SelectInput
              options={RENTAL_PURPOSES}
              placeholder={isAr ? "اختر الغرض" : "Select purpose"}
              value={rentalPurpose}
              onChange={(e) => setRentalPurpose(e.target.value)}
            />
          </FormField>
        </div>
      </SectionCard>

      {/* ── Additional Drivers ── */}
      {additionalDrivers.map((driver, idx) => (
        <SectionCard
          key={driver.id}
          title={`${t.driverTitle} #${idx + 1}`}
          icon="ri-user-add-line"
          accentColor="#4ADE80"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField label={isAr ? "الاسم الأول" : "First Name"} required>
              <TextInput
                placeholder={isAr ? "الاسم الأول" : "First name"}
                value={driver.firstName}
                onChange={(e) => updateDriver(driver.id, "firstName", e.target.value)}
              />
            </FormField>
            <FormField label={isAr ? "اسم العائلة" : "Last Name"} required>
              <TextInput
                placeholder={isAr ? "اسم العائلة" : "Last name"}
                value={driver.lastName}
                onChange={(e) => updateDriver(driver.id, "lastName", e.target.value)}
              />
            </FormField>
            <FormField label={isAr ? "رقم رخصة القيادة" : "License Number"} required>
              <TextInput
                placeholder="DL-XXXXXXXX"
                value={driver.licenseNumber}
                onChange={(e) => updateDriver(driver.id, "licenseNumber", e.target.value)}
                className="font-['JetBrains_Mono']"
              />
            </FormField>
            <FormField label={isAr ? "دولة الإصدار" : "License Country"} required>
              <SelectInput
                options={COUNTRIES}
                placeholder={isAr ? "اختر الدولة" : "Select country"}
                value={driver.licenseCountry}
                onChange={(e) => updateDriver(driver.id, "licenseCountry", e.target.value)}
              />
            </FormField>
            <FormField label={isAr ? "تاريخ انتهاء الرخصة" : "License Expiry"} required>
              <TextInput
                type="date"
                value={driver.licenseExpiry}
                onChange={(e) => updateDriver(driver.id, "licenseExpiry", e.target.value)}
              />
            </FormField>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => removeDriver(driver.id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors"
                style={{ background: "rgba(201,74,94,0.06)", borderColor: "rgba(201,74,94,0.2)", color: "#C94A5E" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,74,94,0.12)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,74,94,0.06)"; }}
              >
                <i className="ri-user-unfollow-line" />
                {t.removeDriver}
              </button>
            </div>
          </div>
        </SectionCard>
      ))}

      <button
        type="button"
        onClick={addDriver}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed text-sm font-semibold cursor-pointer transition-all"
        style={{ borderColor: "rgba(74,222,128,0.2)", color: "#4ADE80", background: "rgba(74,222,128,0.03)" }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(74,222,128,0.4)";
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(74,222,128,0.06)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(74,222,128,0.2)";
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(74,222,128,0.03)";
        }}
      >
        <i className="ri-user-add-line" />
        {t.addDriver}
      </button>

      <FormActions
        onCancel={onCancel}
        onSave={handleSave}
        saveLabel={isAr ? "حفظ الحجز" : "Save Booking"}
        isAr={isAr}
        saving={saving}
      />
    </div>
  );
};

export default VehicleBookForm;
