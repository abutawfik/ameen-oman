import { useState } from "react";
import {
  SectionCard, FormField, TextInput, SelectInput, TipBanner, FormActions, BRANCHES,
} from "@/pages/dashboard/hotel-events/components/FormComponents";
import { LookupBar, generateMobRef, MobileConfirmationPanel } from "./components/MobileFormComponents";

const ACTIVATED_BY = [
  { value: "store_agent",  label: "Store Agent" },
  { value: "self_service", label: "Self-Service Kiosk" },
  { value: "online",       label: "Online Portal" },
  { value: "api",          label: "API / CRM System" },
  { value: "call_center",  label: "Call Center" },
];

interface Props { isAr: boolean; onCancel: () => void; }

const SimActivatedForm = ({ isAr, onCancel }: Props) => {
  const [iccid, setIccid] = useState("");
  const [branch, setBranch] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [subscriberName, setSubscriberName] = useState("");
  const [activationDateTime, setActivationDateTime] = useState("");
  const [activatedBy, setActivatedBy] = useState("");
  const [firstUsageTimestamp, setFirstUsageTimestamp] = useState("");
  const [networkType, setNetworkType] = useState("");
  const [autoFilled, setAutoFilled] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  const handleLookup = () => {
    if (!iccid) return;
    setMobileNumber("+968 9234 5678");
    setSubscriberName("Khalid Al-Balushi");
    setBranch("main");
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
        eventType={isAr ? "تفعيل شريحة SIM" : "SIM Activated"}
        isAr={isAr}
        onReset={() => { setConfirmed(false); setIccid(""); setAutoFilled(false); }}
        onDashboard={onCancel}
      />
    );
  }

  return (
    <div className="space-y-5">
      <TipBanner
        text={isAr ? "أدخل رقم ICCID لاسترداد بيانات المشترك تلقائياً." : "Enter ICCID to auto-retrieve subscriber data."}
        color="amber"
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
        <SectionCard title={isAr ? "تفاصيل التفعيل" : "Activation Details"} icon="ri-checkbox-circle-line">
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

            <FormField label={isAr ? "تاريخ ووقت التفعيل" : "Activation Date/Time"} required>
              <TextInput
                type="datetime-local"
                value={activationDateTime}
                onChange={(e) => setActivationDateTime(e.target.value)}
              />
            </FormField>

            <FormField label={isAr ? "تم التفعيل بواسطة" : "Activated By"} required>
              <SelectInput
                options={ACTIVATED_BY.map((a) => ({
                  value: a.value,
                  label: isAr
                    ? a.value === "store_agent" ? "موظف المتجر"
                      : a.value === "self_service" ? "كشك الخدمة الذاتية"
                      : a.value === "online" ? "البوابة الإلكترونية"
                      : a.value === "api" ? "نظام API / CRM"
                      : "مركز الاتصال"
                    : a.label,
                }))}
                placeholder={isAr ? "اختر الجهة" : "Select activator"}
                value={activatedBy}
                onChange={(e) => setActivatedBy(e.target.value)}
              />
            </FormField>
          </div>
        </SectionCard>

        <SectionCard title={isAr ? "بيانات الاستخدام الأول" : "First Usage Data"} icon="ri-signal-wifi-line">
          <div className="space-y-4">
            <FormField label={isAr ? "طابع زمني للاستخدام الأول" : "First Usage Timestamp"}>
              <TextInput
                type="datetime-local"
                value={firstUsageTimestamp}
                onChange={(e) => setFirstUsageTimestamp(e.target.value)}
              />
            </FormField>

            <FormField label={isAr ? "نوع الشبكة" : "Network Type"}>
              <SelectInput
                options={[
                  { value: "2g", label: "2G" },
                  { value: "3g", label: "3G" },
                  { value: "4g", label: "4G LTE" },
                  { value: "5g", label: "5G" },
                ]}
                placeholder={isAr ? "اختر نوع الشبكة" : "Select network"}
                value={networkType}
                onChange={(e) => setNetworkType(e.target.value)}
              />
            </FormField>

            {/* Status indicator */}
            <div
              className="flex items-center gap-3 p-4 rounded-xl border"
              style={{ background: "rgba(74,222,128,0.05)", borderColor: "rgba(74,222,128,0.2)" }}
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0"
                style={{ background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.25)" }}>
                <i className="ri-sim-card-2-line text-green-400 text-lg" />
              </div>
              <div>
                <p className="text-green-400 font-bold text-sm font-['Inter']">
                  {isAr ? "الشريحة نشطة" : "SIM Active"}
                </p>
                <p className="text-gray-500 text-xs font-['Inter']">
                  {isAr ? "سيتم إرسال حدث التفعيل إلى AMEEN" : "Activation event will be sent to AMEEN"}
                </p>
              </div>
              <div className="ml-auto w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
            </div>

            {/* ICCID display */}
            {iccid && (
              <div
                className="p-3 rounded-xl border"
                style={{ background: "rgba(34,211,238,0.04)", borderColor: "rgba(34,211,238,0.15)" }}
              >
                <p className="text-gray-500 text-xs mb-1 font-['Inter']">ICCID</p>
                <p className="text-cyan-400 font-bold text-sm font-['JetBrains_Mono'] tracking-wider break-all">
                  {iccid}
                </p>
              </div>
            )}
          </div>
        </SectionCard>
      </div>

      <FormActions
        onCancel={onCancel}
        onSave={handleSave}
        saveLabel={isAr ? "تأكيد التفعيل" : "Confirm Activation"}
        isAr={isAr}
        saving={saving}
      />
    </div>
  );
};

export default SimActivatedForm;
