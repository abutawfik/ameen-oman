import { useState } from "react";
import {
  SectionCard, FormField, TextInput, SelectInput, TipBanner, FormActions, BRANCHES,
} from "@/pages/dashboard/hotel-events/components/FormComponents";
import { ValidatedInput, validateIMEI, LookupBar, generateMobRef, MobileConfirmationPanel } from "./components/MobileFormComponents";

const ESIM_PLANS = [
  { value: "esim_basic",    label: "eSIM Basic — 10GB / OMR 5" },
  { value: "esim_smart",    label: "eSIM Smart — 30GB / OMR 12" },
  { value: "esim_pro",      label: "eSIM Pro — 60GB / OMR 22" },
  { value: "esim_unlimited",label: "eSIM Unlimited / OMR 35" },
];

const ESIM_DEVICE_MODELS = [
  { value: "iphone_15_pro",   label: "iPhone 15 Pro / Pro Max" },
  { value: "iphone_15",       label: "iPhone 15 / Plus" },
  { value: "iphone_14",       label: "iPhone 14 Series" },
  { value: "samsung_s24",     label: "Samsung Galaxy S24 Series" },
  { value: "samsung_z_fold",  label: "Samsung Galaxy Z Fold/Flip" },
  { value: "pixel_8",         label: "Google Pixel 8 Series" },
  { value: "other",           label: "Other eSIM-Compatible Device" },
];

interface Props { isAr: boolean; onCancel: () => void; }

const EsimActivatedForm = ({ isAr, onCancel }: Props) => {
  const [imei, setImei] = useState("");
  const [branch, setBranch] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [subscriberName, setSubscriberName] = useState("");
  const [profileId, setProfileId] = useState("");
  const [qrReference, setQrReference] = useState("");
  const [plan, setPlan] = useState("");
  const [deviceModel, setDeviceModel] = useState("");
  const [activationDateTime, setActivationDateTime] = useState("");
  const [eid, setEid] = useState("");
  const [autoFilled, setAutoFilled] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  const handleLookup = () => {
    if (!imei) return;
    setMobileNumber("+968 9876 5432");
    setSubscriberName("Sara Al-Harthi");
    setBranch("main");
    setProfileId("PROF-OM-2024-88721");
    setQrReference("QR-ESIM-7821-OM");
    setEid("89049032004008882800000000000000");
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
        eventType={isAr ? "تفعيل eSIM" : "eSIM Activated"}
        isAr={isAr}
        onReset={() => { setConfirmed(false); setImei(""); setAutoFilled(false); setProfileId(""); setQrReference(""); }}
        onDashboard={onCancel}
      />
    );
  }

  return (
    <div className="space-y-5">
      <TipBanner
        text={isAr
          ? "أدخل رقم IMEI للجهاز لاسترداد بيانات eSIM. تأكد من توافق الجهاز مع تقنية eSIM."
          : "Enter device IMEI to retrieve eSIM data. Ensure the device is eSIM-compatible."}
        color="cyan"
      />

      <LookupBar
        label="Device IMEI"
        labelAr="رقم IMEI للجهاز"
        placeholder="XXXXXXXXXXXXXXX (15 digits)"
        value={imei}
        onChange={setImei}
        onLookup={handleLookup}
        isAr={isAr}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* eSIM Profile Info */}
        <SectionCard title={isAr ? "معلومات ملف eSIM" : "eSIM Profile Info"} icon="ri-phone-line">
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
              <FormField label={isAr ? "الفرع" : "Branch"} required>
                <SelectInput
                  options={BRANCHES}
                  placeholder={isAr ? "اختر الفرع" : "Select branch"}
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                />
              </FormField>
            </div>

            <FormField label={isAr ? "اسم المشترك" : "Subscriber Name"}>
              <TextInput
                placeholder={isAr ? "الاسم الكامل" : "Full name"}
                value={subscriberName}
                onChange={(e) => setSubscriberName(e.target.value)}
                autoFilled={autoFilled && !!subscriberName}
              />
            </FormField>

            <FormField label={isAr ? "معرّف الملف (Profile ID)" : "Profile ID"} required>
              <TextInput
                placeholder="PROF-OM-XXXX-XXXXX"
                value={profileId}
                onChange={(e) => setProfileId(e.target.value)}
                autoFilled={autoFilled && !!profileId}
                className="font-['JetBrains_Mono'] text-xs"
              />
            </FormField>

            <FormField label={isAr ? "مرجع رمز QR" : "QR Code Reference"} required>
              <TextInput
                placeholder="QR-ESIM-XXXX-OM"
                value={qrReference}
                onChange={(e) => setQrReference(e.target.value)}
                autoFilled={autoFilled && !!qrReference}
                className="font-['JetBrains_Mono']"
              />
            </FormField>

            <FormField label={isAr ? "معرّف EID" : "EID (eUICC ID)"}>
              <TextInput
                placeholder="89049032XXXXXXXXXXXXXXXXXXXXXXXX"
                value={eid}
                onChange={(e) => setEid(e.target.value)}
                autoFilled={autoFilled && !!eid}
                className="font-['JetBrains_Mono'] text-xs"
              />
            </FormField>
          </div>
        </SectionCard>

        {/* Plan & Device */}
        <SectionCard title={isAr ? "الخطة والجهاز" : "Plan & Device"} icon="ri-settings-3-line">
          <div className="space-y-4">
            <FormField label={isAr ? "خطة eSIM" : "eSIM Plan"} required>
              <SelectInput
                options={ESIM_PLANS}
                placeholder={isAr ? "اختر الخطة" : "Select plan"}
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
              />
            </FormField>

            <FormField label={isAr ? "موديل الجهاز" : "Device Model"} required>
              <SelectInput
                options={ESIM_DEVICE_MODELS}
                placeholder={isAr ? "اختر الموديل" : "Select model"}
                value={deviceModel}
                onChange={(e) => setDeviceModel(e.target.value)}
              />
            </FormField>

            <div>
              <ValidatedInput
                label={isAr ? "رقم IMEI للجهاز" : "Device IMEI"}
                value={imei}
                onChange={setImei}
                validate={validateIMEI}
                placeholder="XXXXXXXXXXXXXXX"
                hint={isAr ? "رقم IMEI غير صالح" : "Invalid IMEI"}
                required
                monospace
              />
            </div>

            <FormField label={isAr ? "تاريخ ووقت التفعيل" : "Activation Date/Time"} required>
              <TextInput
                type="datetime-local"
                value={activationDateTime}
                onChange={(e) => setActivationDateTime(e.target.value)}
              />
            </FormField>

            {/* eSIM status badge */}
            <div
              className="flex items-center gap-3 p-4 rounded-xl border"
              style={{ background: "rgba(184,138,60,0.05)", borderColor: "rgba(184,138,60,0.2)" }}
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0"
                style={{ background: "rgba(184,138,60,0.12)", border: "1px solid rgba(184,138,60,0.25)" }}>
                <i className="ri-phone-line text-gold-400 text-lg" />
              </div>
              <div>
                <p className="text-gold-400 font-bold text-sm font-['Inter']">
                  {isAr ? "eSIM جاهزة للتفعيل" : "eSIM Ready for Activation"}
                </p>
                <p className="text-gray-500 text-xs font-['Inter']">
                  {isAr ? "سيتم إرسال ملف eSIM إلى الجهاز" : "eSIM profile will be pushed to device"}
                </p>
              </div>
              <div className="ml-auto w-2.5 h-2.5 rounded-full bg-gold-400 animate-pulse flex-shrink-0" />
            </div>
          </div>
        </SectionCard>
      </div>

      <FormActions
        onCancel={onCancel}
        onSave={handleSave}
        saveLabel={isAr ? "تفعيل eSIM" : "Activate eSIM"}
        isAr={isAr}
        saving={saving}
      />
    </div>
  );
};

export default EsimActivatedForm;
