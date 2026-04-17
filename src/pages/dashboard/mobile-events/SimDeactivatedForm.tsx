import { useState } from "react";
import {
  SectionCard, FormField, TextInput, SelectInput, RadioGroup, TipBanner, FormActions,
} from "@/pages/dashboard/hotel-events/components/FormComponents";
import { LookupBar, generateMobRef, MobileConfirmationPanel } from "./components/MobileFormComponents";

const DEACTIVATION_REASONS = [
  { value: "customer_request", label: "Customer Request",    labelAr: "طلب العميل" },
  { value: "non_payment",      label: "Non-Payment",         labelAr: "عدم السداد" },
  { value: "suspicious",       label: "Suspicious Activity", labelAr: "نشاط مشبوه" },
  { value: "lost_stolen",      label: "Lost / Stolen",       labelAr: "مفقودة / مسروقة" },
  { value: "regulatory",       label: "Regulatory Order",    labelAr: "أمر تنظيمي" },
];

const DEACTIVATION_TYPES = [
  { value: "temporary",  label: "Temporary",  labelAr: "مؤقت" },
  { value: "permanent",  label: "Permanent",  labelAr: "دائم" },
];

interface Props { isAr: boolean; onCancel: () => void; }

const SimDeactivatedForm = ({ isAr, onCancel }: Props) => {
  const [iccid, setIccid] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [subscriberName, setSubscriberName] = useState("");
  const [deactivationDateTime, setDeactivationDateTime] = useState("");
  const [reason, setReason] = useState("");
  const [deactivationType, setDeactivationType] = useState("temporary");
  const [reactivationEligible, setReactivationEligible] = useState("yes");
  const [reactivationDate, setReactivationDate] = useState("");
  const [notes, setNotes] = useState("");
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

  const selectedReason = DEACTIVATION_REASONS.find((r) => r.value === reason);
  const isSuspicious = reason === "suspicious" || reason === "lost_stolen" || reason === "regulatory";

  if (confirmed) {
    return (
      <MobileConfirmationPanel
        refNumber={refNumber}
        eventType={isAr ? "إيقاف تشغيل شريحة SIM" : "SIM Deactivated"}
        isAr={isAr}
        onReset={() => { setConfirmed(false); setIccid(""); setAutoFilled(false); setReason(""); }}
        onDashboard={onCancel}
      />
    );
  }

  return (
    <div className="space-y-5">
      <TipBanner
        text={isAr ? "أدخل رقم ICCID لاسترداد بيانات المشترك. حدد سبب الإيقاف بدقة." : "Enter ICCID to retrieve subscriber data. Select deactivation reason accurately."}
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
        <SectionCard title={isAr ? "تفاصيل الإيقاف" : "Deactivation Details"} icon="ri-pause-circle-line">
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

            <FormField label={isAr ? "تاريخ ووقت الإيقاف" : "Deactivation Date/Time"} required>
              <TextInput
                type="datetime-local"
                value={deactivationDateTime}
                onChange={(e) => setDeactivationDateTime(e.target.value)}
              />
            </FormField>

            <FormField label={isAr ? "سبب الإيقاف" : "Deactivation Reason"} required>
              <SelectInput
                options={DEACTIVATION_REASONS.map((r) => ({ value: r.value, label: isAr ? r.labelAr : r.label }))}
                placeholder={isAr ? "اختر السبب" : "Select reason"}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </FormField>

            {/* Risk indicator for suspicious reasons */}
            {isSuspicious && selectedReason && (
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl border"
                style={{ background: "rgba(201,74,94,0.06)", borderColor: "rgba(201,74,94,0.25)" }}
              >
                <i className="ri-alert-line text-red-400 text-lg flex-shrink-0" />
                <div>
                  <p className="text-red-400 font-bold text-xs font-['Inter']">
                    {isAr ? "تنبيه: سبب ذو أولوية عالية" : "Alert: High-Priority Reason"}
                  </p>
                  <p className="text-gray-400 text-xs font-['Inter']">
                    {isAr ? "سيتم إرسال إشعار فوري إلى Al-Ameen" : "Immediate notification will be sent to Al-Ameen"}
                  </p>
                </div>
              </div>
            )}

            <FormField label={isAr ? "نوع الإيقاف" : "Deactivation Type"} required>
              <RadioGroup
                name="deactivationType"
                options={DEACTIVATION_TYPES.map((t) => ({ value: t.value, label: isAr ? t.labelAr : t.label }))}
                value={deactivationType}
                onChange={setDeactivationType}
              />
            </FormField>

            <FormField label={isAr ? "ملاحظات إضافية" : "Additional Notes"}>
              <textarea
                rows={3}
                placeholder={isAr ? "أي تفاصيل إضافية..." : "Any additional details..."}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-gray-600 outline-none transition-all duration-200 font-['Inter'] resize-none"
                style={{ background: "#0F1923", border: "1px solid rgba(255,255,255,0.08)" }}
                onFocus={(e) => { e.target.style.borderColor = "#D6B47E"; e.target.style.boxShadow = "0 0 0 2px rgba(184,138,60,0.08)"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
              />
            </FormField>
          </div>
        </SectionCard>

        <SectionCard title={isAr ? "إمكانية إعادة التفعيل" : "Reactivation Eligibility"} icon="ri-refresh-line">
          <div className="space-y-4">
            <FormField label={isAr ? "مؤهل لإعادة التفعيل؟" : "Eligible for Reactivation?"} required>
              <RadioGroup
                name="reactivationEligible"
                options={[
                  { value: "yes", label: isAr ? "نعم" : "Yes" },
                  { value: "no",  label: isAr ? "لا" : "No" },
                  { value: "conditional", label: isAr ? "مشروط" : "Conditional" },
                ]}
                value={reactivationEligible}
                onChange={setReactivationEligible}
              />
            </FormField>

            {reactivationEligible !== "no" && (
              <FormField label={isAr ? "تاريخ إعادة التفعيل المتوقع" : "Expected Reactivation Date"}>
                <TextInput
                  type="date"
                  value={reactivationDate}
                  onChange={(e) => setReactivationDate(e.target.value)}
                />
              </FormField>
            )}

            {/* Status visual */}
            <div
              className="flex items-center gap-3 p-4 rounded-xl border"
              style={{
                background: deactivationType === "temporary" ? "rgba(250,204,21,0.05)" : "rgba(201,74,94,0.05)",
                borderColor: deactivationType === "temporary" ? "rgba(250,204,21,0.2)" : "rgba(201,74,94,0.2)",
              }}
            >
              <div
                className="w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0"
                style={{
                  background: deactivationType === "temporary" ? "rgba(250,204,21,0.12)" : "rgba(201,74,94,0.12)",
                  border: `1px solid ${deactivationType === "temporary" ? "rgba(250,204,21,0.25)" : "rgba(201,74,94,0.25)"}`,
                }}
              >
                <i
                  className={`${deactivationType === "temporary" ? "ri-pause-circle-line" : "ri-close-circle-line"} text-lg`}
                  style={{ color: deactivationType === "temporary" ? "#FACC15" : "#C94A5E" }}
                />
              </div>
              <div>
                <p
                  className="font-bold text-sm font-['Inter']"
                  style={{ color: deactivationType === "temporary" ? "#FACC15" : "#C94A5E" }}
                >
                  {deactivationType === "temporary"
                    ? (isAr ? "إيقاف مؤقت" : "Temporary Deactivation")
                    : (isAr ? "إيقاف دائم" : "Permanent Deactivation")}
                </p>
                <p className="text-gray-500 text-xs font-['Inter']">
                  {deactivationType === "temporary"
                    ? (isAr ? "يمكن إعادة التفعيل لاحقاً" : "Can be reactivated later")
                    : (isAr ? "لا يمكن إعادة التفعيل" : "Cannot be reactivated")}
                </p>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      <FormActions
        onCancel={onCancel}
        onSave={handleSave}
        saveLabel={isAr ? "تأكيد الإيقاف" : "Confirm Deactivation"}
        isAr={isAr}
        saving={saving}
      />
    </div>
  );
};

export default SimDeactivatedForm;
