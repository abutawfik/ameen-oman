import { useState } from "react";
import {
  SectionCard, FormField, TextInput, SelectInput, RadioGroup, TipBanner,
  FormActions, ScannerWidget, COUNTRIES, BRANCHES, PAYMENT_METHODS, CARD_TYPES,
} from "@/pages/dashboard/hotel-events/components/FormComponents";
import TravelDocSection, { type TravelDocData } from "@/pages/dashboard/hotel-events/components/TravelDocSection";
import PersonalDetailsSection, { type PersonalData } from "@/pages/dashboard/hotel-events/components/PersonalDetailsSection";
import {
  ValidatedInput, ServiceToggle, validateICCID, validateIMEI, generateMobRef, MobileConfirmationPanel,
} from "./components/MobileFormComponents";

const PLAN_TYPES = [
  { value: "prepaid",  label: "Prepaid" },
  { value: "postpaid", label: "Postpaid" },
];

const SIM_TYPES = [
  { value: "physical", label: "Physical SIM" },
  { value: "esim",     label: "eSIM" },
];

const DEVICE_SOURCES = [
  { value: "store",   label: "Operator Store" },
  { value: "retail",  label: "Retail Partner" },
  { value: "online",  label: "Online Purchase" },
  { value: "own",     label: "Own Device" },
];

const PLAN_NAMES: Record<string, { value: string; label: string }[]> = {
  prepaid: [
    { value: "basic_30",    label: "Basic 30 — 5GB / OMR 3" },
    { value: "smart_50",    label: "Smart 50 — 15GB / OMR 5" },
    { value: "unlimited_80",label: "Unlimited 80 — Unlimited / OMR 8" },
  ],
  postpaid: [
    { value: "pro_100",     label: "Pro 100 — 30GB / OMR 10" },
    { value: "elite_200",   label: "Elite 200 — 60GB / OMR 20" },
    { value: "business_500",label: "Business 500 — Unlimited / OMR 50" },
  ],
};

const emptyPersonal = (): PersonalData => ({
  firstName: "", lastName: "", gender: "", dob: "", nationality: "",
  placeOfBirth: "", countryOfResidence: "", email: "", primaryContact: "", secondaryContact: "",
});

const emptyDoc = (): TravelDocData => ({
  holderStatus: "primary", docType: "", docNumber: "", issuingCountry: "",
  placeOfIssue: "", issuingAuthority: "", issueDate: "", expiryDate: "",
});

interface Props { isAr: boolean; onCancel: () => void; }

const SimPurchaseForm = ({ isAr, onCancel }: Props) => {
  const [branch, setBranch] = useState("");
  const [iccid, setIccid] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [simType, setSimType] = useState("physical");
  const [planType, setPlanType] = useState("prepaid");
  const [planName, setPlanName] = useState("");
  const [activationDate, setActivationDate] = useState("");
  const [deviceBrand, setDeviceBrand] = useState("");
  const [deviceModel, setDeviceModel] = useState("");
  const [imei1, setImei1] = useState("");
  const [imei2, setImei2] = useState("");
  const [deviceSerial, setDeviceSerial] = useState("");
  const [deviceSource, setDeviceSource] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardType, setCardType] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [intlCalling, setIntlCalling] = useState(false);
  const [dataRoaming, setDataRoaming] = useState(false);
  const [intlSms, setIntlSms] = useState(false);
  const [mobileMoney, setMobileMoney] = useState(false);
  const [personal, setPersonal] = useState<PersonalData>(emptyPersonal());
  const [doc, setDoc] = useState<TravelDocData>(emptyDoc());
  const [autoFilled, setAutoFilled] = useState(false);
  const [scannerConnected] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  const handleScan = () => {
    setDoc({
      holderStatus: "primary", docType: "passport", docNumber: "P87654321",
      issuingCountry: "OM", placeOfIssue: "Muscat", issuingAuthority: "National Police",
      issueDate: "2021-06-10", expiryDate: "2031-06-09",
    });
    setPersonal({
      firstName: "Khalid", lastName: "Al-Balushi", gender: "male",
      dob: "1992-11-05", nationality: "OM", placeOfBirth: "Muscat",
      countryOfResidence: "OM", email: "khalid.balushi@email.com",
      primaryContact: "+968 9234 5678", secondaryContact: "",
    });
    setCurrentAddress("Building 12, Al Khuwair, Muscat, Oman");
    setAutoFilled(true);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setRefNumber(generateMobRef());
      setConfirmed(true);
    }, 1800);
  };

  if (confirmed) {
    return (
      <MobileConfirmationPanel
        refNumber={refNumber}
        eventType={isAr ? "شراء شريحة SIM" : "SIM Purchase"}
        isAr={isAr}
        onReset={() => { setConfirmed(false); setIccid(""); setMobileNumber(""); setImei1(""); setImei2(""); setAutoFilled(false); }}
        onDashboard={onCancel}
      />
    );
  }

  return (
    <div className="space-y-5">
      <TipBanner
        text={isAr
          ? "تحقق من صحة رقم ICCID (19-20 رقماً) ورقم IMEI (15 رقماً — خوارزمية Luhn) قبل الحفظ."
          : "Validate ICCID (19-20 digits) and IMEI (15 digits — Luhn algorithm) before saving."}
        color="cyan"
      />

      {/* Two-column: Event Info + Travel Doc */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Event Info */}
        <SectionCard title={isAr ? "معلومات الحدث" : "Event Info"} icon="ri-sim-card-line">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "الفرع" : "Operator Branch"} required>
                <SelectInput
                  options={BRANCHES}
                  placeholder={isAr ? "اختر الفرع" : "Select branch"}
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                />
              </FormField>
              <FormField label={isAr ? "رقم الجوال" : "Mobile Number (+968)"} required>
                <TextInput
                  placeholder="+968 9XXX XXXX"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="font-['JetBrains_Mono']"
                />
              </FormField>
            </div>

            <ValidatedInput
              label={isAr ? "الرقم التسلسلي للشريحة (ICCID)" : "SIM Serial Number (ICCID)"}
              value={iccid}
              onChange={setIccid}
              validate={validateICCID}
              placeholder="89968XXXXXXXXXXXXXXX"
              hint={isAr ? "يجب أن يكون 19-20 رقماً" : "Must be 19-20 digits"}
              required
              monospace
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "نوع الشريحة" : "SIM Type"} required>
                <RadioGroup
                  name="simType"
                  options={SIM_TYPES.map((s) => ({ value: s.value, label: isAr ? (s.value === "physical" ? "شريحة فعلية" : "eSIM") : s.label }))}
                  value={simType}
                  onChange={setSimType}
                />
              </FormField>
              <FormField label={isAr ? "نوع الخطة" : "Plan Type"} required>
                <RadioGroup
                  name="planType"
                  options={PLAN_TYPES.map((p) => ({ value: p.value, label: isAr ? (p.value === "prepaid" ? "مدفوع مسبقاً" : "مدفوع لاحقاً") : p.label }))}
                  value={planType}
                  onChange={(v) => { setPlanType(v); setPlanName(""); }}
                />
              </FormField>
            </div>

            <FormField label={isAr ? "اسم الخطة" : "Plan Name"} required>
              <SelectInput
                options={PLAN_NAMES[planType] || []}
                placeholder={isAr ? "اختر الخطة" : "Select plan"}
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
              />
            </FormField>

            <FormField label={isAr ? "تاريخ التفعيل" : "Activation Date"} required>
              <TextInput
                type="datetime-local"
                value={activationDate}
                onChange={(e) => setActivationDate(e.target.value)}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "طريقة الدفع" : "Payment Method"} required>
                <SelectInput
                  options={PAYMENT_METHODS}
                  placeholder={isAr ? "اختر طريقة الدفع" : "Select payment"}
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
              </FormField>
              {(paymentMethod === "credit_card" || paymentMethod === "debit_card") && (
                <FormField label={isAr ? "نوع البطاقة" : "Card Type"}>
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

        {/* Travel Document */}
        <TravelDocSection
          data={doc}
          onChange={(k, v) => setDoc((d) => ({ ...d, [k]: v }))}
          isAr={isAr}
          scannerConnected={scannerConnected}
          autoFilled={autoFilled}
          onScan={handleScan}
        />
      </div>

      {/* Personal Details */}
      <PersonalDetailsSection
        data={personal}
        onChange={(k, v) => setPersonal((p) => ({ ...p, [k]: v }))}
        isAr={isAr}
        autoFilled={autoFilled}
      />

      {/* Current Address in Oman */}
      <SectionCard title={isAr ? "العنوان الحالي في عُمان" : "Current Address in Oman"} icon="ri-map-pin-line">
        <FormField label={isAr ? "العنوان الكامل" : "Full Address"} required>
          <TextInput
            placeholder={isAr ? "مثال: مبنى 12، الخوير، مسقط، عُمان" : "e.g. Building 12, Al Khuwair, Muscat, Oman"}
            value={currentAddress}
            onChange={(e) => setCurrentAddress(e.target.value)}
            autoFilled={autoFilled && !!currentAddress}
          />
        </FormField>
      </SectionCard>

      {/* Device Info */}
      <SectionCard title={isAr ? "معلومات الجهاز" : "Device Information"} icon="ri-smartphone-line">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField label={isAr ? "ماركة الجهاز" : "Device Brand"}>
            <TextInput
              placeholder="Apple / Samsung / Huawei..."
              value={deviceBrand}
              onChange={(e) => setDeviceBrand(e.target.value)}
            />
          </FormField>
          <FormField label={isAr ? "موديل الجهاز" : "Device Model"}>
            <TextInput
              placeholder="iPhone 15 Pro / Galaxy S24..."
              value={deviceModel}
              onChange={(e) => setDeviceModel(e.target.value)}
            />
          </FormField>
          <FormField label={isAr ? "مصدر الجهاز" : "Device Source"}>
            <SelectInput
              options={DEVICE_SOURCES.map((d) => ({
                value: d.value,
                label: isAr
                  ? d.value === "store" ? "متجر المشغّل"
                    : d.value === "retail" ? "شريك تجزئة"
                    : d.value === "online" ? "شراء إلكتروني"
                    : "جهاز شخصي"
                  : d.label,
              }))}
              placeholder={isAr ? "اختر المصدر" : "Select source"}
              value={deviceSource}
              onChange={(e) => setDeviceSource(e.target.value)}
            />
          </FormField>

          <div className="sm:col-span-2 lg:col-span-1">
            <ValidatedInput
              label={isAr ? "IMEI 1 (15 رقماً)" : "IMEI 1 (15 digits)"}
              value={imei1}
              onChange={setImei1}
              validate={validateIMEI}
              placeholder="XXXXXXXXXXXXXXX"
              hint={isAr ? "رقم IMEI غير صالح — تحقق من الرقم" : "Invalid IMEI — verify the number"}
              required
              monospace
            />
          </div>
          <div>
            <ValidatedInput
              label={isAr ? "IMEI 2 (اختياري)" : "IMEI 2 (optional)"}
              value={imei2}
              onChange={setImei2}
              validate={validateIMEI}
              placeholder="XXXXXXXXXXXXXXX"
              hint={isAr ? "رقم IMEI غير صالح" : "Invalid IMEI"}
              monospace
            />
          </div>
          <FormField label={isAr ? "الرقم التسلسلي للجهاز" : "Device Serial Number"}>
            <TextInput
              placeholder="SN-XXXXXXXXXX"
              value={deviceSerial}
              onChange={(e) => setDeviceSerial(e.target.value)}
              className="font-['JetBrains_Mono']"
            />
          </FormField>
        </div>
      </SectionCard>

      {/* Service Toggles */}
      <SectionCard title={isAr ? "الخدمات الإضافية" : "Additional Services"} icon="ri-settings-3-line">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ServiceToggle
            label="International Calling"
            labelAr="المكالمات الدولية"
            icon="ri-phone-line"
            value={intlCalling}
            onChange={setIntlCalling}
            isAr={isAr}
          />
          <ServiceToggle
            label="Data Roaming"
            labelAr="تجوال البيانات"
            icon="ri-global-line"
            value={dataRoaming}
            onChange={setDataRoaming}
            isAr={isAr}
          />
          <ServiceToggle
            label="International SMS"
            labelAr="الرسائل الدولية"
            icon="ri-message-2-line"
            value={intlSms}
            onChange={setIntlSms}
            isAr={isAr}
          />
          <ServiceToggle
            label="Mobile Money"
            labelAr="المحفظة الإلكترونية"
            icon="ri-wallet-3-line"
            value={mobileMoney}
            onChange={setMobileMoney}
            isAr={isAr}
          />
        </div>

        {/* Active services summary */}
        {(intlCalling || dataRoaming || intlSms || mobileMoney) && (
          <div
            className="mt-4 flex flex-wrap gap-2 p-3 rounded-xl border"
            style={{ background: "rgba(184,138,60,0.04)", borderColor: "rgba(184,138,60,0.15)" }}
          >
            <span className="text-gray-500 text-xs font-['Inter'] w-full mb-1">
              {isAr ? "الخدمات المفعّلة:" : "Active services:"}
            </span>
            {intlCalling && <span className="px-2 py-0.5 rounded-full text-xs font-semibold font-['Inter']" style={{ background: "rgba(184,138,60,0.12)", color: "#D6B47E", border: "1px solid rgba(184,138,60,0.25)" }}>{isAr ? "مكالمات دولية" : "Intl Calling"}</span>}
            {dataRoaming && <span className="px-2 py-0.5 rounded-full text-xs font-semibold font-['Inter']" style={{ background: "rgba(184,138,60,0.12)", color: "#D6B47E", border: "1px solid rgba(184,138,60,0.25)" }}>{isAr ? "تجوال البيانات" : "Data Roaming"}</span>}
            {intlSms && <span className="px-2 py-0.5 rounded-full text-xs font-semibold font-['Inter']" style={{ background: "rgba(184,138,60,0.12)", color: "#D6B47E", border: "1px solid rgba(184,138,60,0.25)" }}>{isAr ? "رسائل دولية" : "Intl SMS"}</span>}
            {mobileMoney && <span className="px-2 py-0.5 rounded-full text-xs font-semibold font-['Inter']" style={{ background: "rgba(184,138,60,0.12)", color: "#D6B47E", border: "1px solid rgba(184,138,60,0.25)" }}>{isAr ? "محفظة إلكترونية" : "Mobile Money"}</span>}
          </div>
        )}
      </SectionCard>

      <FormActions
        onCancel={onCancel}
        onSave={handleSave}
        saveLabel={isAr ? "حفظ عملية الشراء" : "Save SIM Purchase"}
        isAr={isAr}
        saving={saving}
      />
    </div>
  );
};

export default SimPurchaseForm;
