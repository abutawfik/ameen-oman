import { useState } from "react";
import {
  SectionCard, FormField, TextInput, SelectInput, RadioGroup, TipBanner, FormActions,
} from "@/pages/dashboard/hotel-events/components/FormComponents";
import { CountryChipSelector, LookupBar, generateMobRef, MobileConfirmationPanel } from "./components/MobileFormComponents";

const ROAMING_PACKAGES = [
  { value: "daily_1gb",    label: "Daily 1GB — OMR 1.5/day" },
  { value: "weekly_5gb",   label: "Weekly 5GB — OMR 8/week" },
  { value: "monthly_15gb", label: "Monthly 15GB — OMR 25/month" },
  { value: "unlimited_7d", label: "Unlimited 7 Days — OMR 20" },
  { value: "pay_per_use",  label: "Pay Per Use" },
];

const ROAMING_DURATIONS = [
  { value: "1_week",  label: "1 Week",   labelAr: "أسبوع واحد" },
  { value: "2_weeks", label: "2 Weeks",  labelAr: "أسبوعان" },
  { value: "1_month", label: "1 Month",  labelAr: "شهر واحد" },
  { value: "3_months",label: "3 Months", labelAr: "3 أشهر" },
  { value: "custom",  label: "Custom",   labelAr: "مخصص" },
];

interface Props { isAr: boolean; onCancel: () => void; }

const RoamingServiceForm = ({ isAr, onCancel }: Props) => {
  const [iccid, setIccid] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [subscriberName, setSubscriberName] = useState("");
  const [activationDate, setActivationDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [roamingPackage, setRoamingPackage] = useState("");
  const [duration, setDuration] = useState("");
  const [dataRoaming, setDataRoaming] = useState("enabled");
  const [voiceRoaming, setVoiceRoaming] = useState("enabled");
  const [smsRoaming, setSmsRoaming] = useState("enabled");
  const [autoFilled, setAutoFilled] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  const handleLookup = () => {
    if (!iccid) return;
    setMobileNumber("+968 9234 5678");
    setSubscriberName("Khalid Al-Balushi");
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
        eventType={isAr ? "خدمة التجوال" : "Roaming Service"}
        isAr={isAr}
        onReset={() => { setConfirmed(false); setIccid(""); setAutoFilled(false); setSelectedCountries([]); setRoamingPackage(""); }}
        onDashboard={onCancel}
      />
    );
  }

  return (
    <div className="space-y-5">
      <TipBanner
        text={isAr
          ? "حدد جميع الدول المقصودة لضمان تفعيل التجوال في كل الوجهات."
          : "Select all destination countries to ensure roaming is activated for every destination."}
        color="cyan"
      />

      <LookupBar
        label="SIM Serial (ICCID)"
        labelAr="الرقم التسلسلي للشريحة (ICCID)"
        placeholder="89968XXXXXXXXXXXXXXX"
        value={iccid}
        onChange={setIccid}
        onLookup={handleLookup}
        isAr={isAr}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Roaming Details */}
        <SectionCard title={isAr ? "تفاصيل التجوال" : "Roaming Details"} icon="ri-global-line">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "رقم الجوال" : "Mobile Number"}>
                <TextInput
                  placeholder="+968 9XXX XXXX"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  autoFilled={autoFilled && !!mobileNumber}
                  className="font-['JetBrains_Mono']"
                />
              </FormField>
              <FormField label={isAr ? "اسم المشترك" : "Subscriber Name"}>
                <TextInput
                  placeholder={isAr ? "الاسم الكامل" : "Full name"}
                  value={subscriberName}
                  onChange={(e) => setSubscriberName(e.target.value)}
                  autoFilled={autoFilled && !!subscriberName}
                />
              </FormField>
            </div>

            <FormField label={isAr ? "باقة التجوال" : "Roaming Package"} required>
              <SelectInput
                options={ROAMING_PACKAGES}
                placeholder={isAr ? "اختر الباقة" : "Select package"}
                value={roamingPackage}
                onChange={(e) => setRoamingPackage(e.target.value)}
              />
            </FormField>

            <FormField label={isAr ? "مدة التجوال" : "Roaming Duration"} required>
              <SelectInput
                options={ROAMING_DURATIONS.map((d) => ({ value: d.value, label: isAr ? d.labelAr : d.label }))}
                placeholder={isAr ? "اختر المدة" : "Select duration"}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label={isAr ? "تاريخ التفعيل" : "Activation Date"} required>
                <TextInput
                  type="datetime-local"
                  value={activationDate}
                  onChange={(e) => setActivationDate(e.target.value)}
                />
              </FormField>
              <FormField label={isAr ? "تاريخ العودة" : "Return Date"} required>
                <TextInput
                  type="datetime-local"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                />
              </FormField>
            </div>

            {/* Service toggles */}
            <div>
              <p className="text-gray-400 text-xs mb-2 font-['Inter']">
                {isAr ? "خدمات التجوال المفعّلة" : "Enabled Roaming Services"}
              </p>
              <div className="space-y-2">
                {[
                  { key: "data",  label: "Data Roaming",  labelAr: "تجوال البيانات",  value: dataRoaming,  set: setDataRoaming,  icon: "ri-wifi-line" },
                  { key: "voice", label: "Voice Roaming", labelAr: "تجوال الصوت",     value: voiceRoaming, set: setVoiceRoaming, icon: "ri-phone-line" },
                  { key: "sms",   label: "SMS Roaming",   labelAr: "تجوال الرسائل",   value: smsRoaming,   set: setSmsRoaming,   icon: "ri-message-2-line" },
                ].map((svc) => (
                  <div key={svc.key} className="flex items-center justify-between p-2.5 rounded-lg border"
                    style={{ background: svc.value === "enabled" ? "rgba(34,211,238,0.05)" : "rgba(255,255,255,0.02)", borderColor: svc.value === "enabled" ? "rgba(34,211,238,0.2)" : "rgba(255,255,255,0.06)" }}>
                    <div className="flex items-center gap-2">
                      <i className={`${svc.icon} text-sm`} style={{ color: svc.value === "enabled" ? "#22D3EE" : "#6B7280" }} />
                      <span className="text-xs font-semibold font-['Inter']" style={{ color: svc.value === "enabled" ? "#D1D5DB" : "#6B7280" }}>
                        {isAr ? svc.labelAr : svc.label}
                      </span>
                    </div>
                    <RadioGroup
                      name={svc.key}
                      options={[
                        { value: "enabled",  label: isAr ? "مفعّل" : "On" },
                        { value: "disabled", label: isAr ? "معطّل" : "Off" },
                      ]}
                      value={svc.value}
                      onChange={svc.set}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Country Selection */}
        <SectionCard title={isAr ? "الدول المقصودة" : "Destination Countries"} icon="ri-map-2-line">
          <div className="space-y-4">
            <CountryChipSelector
              selected={selectedCountries}
              onChange={setSelectedCountries}
              isAr={isAr}
            />

            {/* Coverage summary */}
            {selectedCountries.length > 0 && (
              <div
                className="p-4 rounded-xl border"
                style={{ background: "rgba(34,211,238,0.04)", borderColor: "rgba(34,211,238,0.15)" }}
              >
                <p className="text-gray-400 text-xs mb-2 font-['Inter']">
                  {isAr ? "ملخص التغطية" : "Coverage Summary"}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0"
                    style={{ background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.25)" }}>
                    <i className="ri-earth-line text-cyan-400 text-lg" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg font-['JetBrains_Mono']">
                      {selectedCountries.length}
                    </p>
                    <p className="text-gray-500 text-xs font-['Inter']">
                      {isAr ? "دولة محددة للتجوال" : "countries selected for roaming"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Package summary */}
            {roamingPackage && (
              <div
                className="p-3 rounded-xl border"
                style={{ background: "rgba(250,204,21,0.04)", borderColor: "rgba(250,204,21,0.15)" }}
              >
                <p className="text-gray-500 text-xs mb-1 font-['Inter']">
                  {isAr ? "الباقة المختارة" : "Selected Package"}
                </p>
                <p className="text-yellow-400 font-bold text-sm font-['Inter']">
                  {ROAMING_PACKAGES.find((p) => p.value === roamingPackage)?.label}
                </p>
              </div>
            )}
          </div>
        </SectionCard>
      </div>

      <FormActions
        onCancel={onCancel}
        onSave={handleSave}
        saveLabel={isAr ? "تفعيل خدمة التجوال" : "Activate Roaming Service"}
        isAr={isAr}
        saving={saving}
      />
    </div>
  );
};

export default RoamingServiceForm;
