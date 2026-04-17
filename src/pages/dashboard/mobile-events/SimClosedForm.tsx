import { useState } from "react";
import {
  SectionCard, FormField, TextInput, SelectInput, RadioGroup, TipBanner, FormActions,
} from "@/pages/dashboard/hotel-events/components/FormComponents";
import { LookupBar, generateMobRef, MobileConfirmationPanel } from "./components/MobileFormComponents";

const CLOSURE_REASONS = [
  { value: "customer_request", label: "Customer Request",       labelAr: "طلب العميل" },
  { value: "contract_end",     label: "Contract End",           labelAr: "انتهاء العقد" },
  { value: "fraud",            label: "Fraud / Misuse",         labelAr: "احتيال / إساءة استخدام" },
  { value: "death",            label: "Subscriber Deceased",    labelAr: "وفاة المشترك" },
  { value: "regulatory",       label: "Regulatory Closure",     labelAr: "إغلاق تنظيمي" },
  { value: "migration",        label: "Migration to Another Op",labelAr: "الانتقال لمشغّل آخر" },
];

const RECYCLING_OPTIONS = [
  { value: "immediate",  label: "Immediate (30 days)",  labelAr: "فوري (30 يوماً)" },
  { value: "standard",   label: "Standard (90 days)",   labelAr: "قياسي (90 يوماً)" },
  { value: "hold",       label: "Hold (1 year)",        labelAr: "احتجاز (سنة)" },
  { value: "no_recycle", label: "Do Not Recycle",       labelAr: "لا تُعاد" },
];

interface Props { isAr: boolean; onCancel: () => void; }

const SimClosedForm = ({ isAr, onCancel }: Props) => {
  const [iccid, setIccid] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [subscriberName, setSubscriberName] = useState("");
  const [closureDate, setClosureDate] = useState("");
  const [reason, setReason] = useState("");
  const [finalBalance, setFinalBalance] = useState("");
  const [balanceDisposition, setBalanceDisposition] = useState("refund");
  const [numberRecycling, setNumberRecycling] = useState("standard");
  const [portingRequested, setPortingRequested] = useState("no");
  const [portingOperator, setPortingOperator] = useState("");
  const [autoFilled, setAutoFilled] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  const handleLookup = () => {
    if (!iccid) return;
    setMobileNumber("+968 9234 5678");
    setSubscriberName("Khalid Al-Balushi");
    setFinalBalance("2.450");
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
        eventType={isAr ? "إغلاق شريحة SIM" : "SIM Closed"}
        isAr={isAr}
        onReset={() => { setConfirmed(false); setIccid(""); setAutoFilled(false); setReason(""); }}
        onDashboard={onCancel}
      />
    );
  }

  return (
    <div className="space-y-5">
      <TipBanner
        text={isAr ? "إغلاق الشريحة نهائي. تأكد من معالجة الرصيد المتبقي وإعادة تدوير الرقم." : "SIM closure is final. Ensure remaining balance is handled and number recycling is configured."}
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
        <SectionCard title={isAr ? "تفاصيل الإغلاق" : "Closure Details"} icon="ri-close-circle-line">
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

            <FormField label={isAr ? "تاريخ الإغلاق" : "Closure Date"} required>
              <TextInput
                type="datetime-local"
                value={closureDate}
                onChange={(e) => setClosureDate(e.target.value)}
              />
            </FormField>

            <FormField label={isAr ? "سبب الإغلاق" : "Closure Reason"} required>
              <SelectInput
                options={CLOSURE_REASONS.map((r) => ({ value: r.value, label: isAr ? r.labelAr : r.label }))}
                placeholder={isAr ? "اختر السبب" : "Select reason"}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </FormField>

            {/* Porting */}
            <FormField label={isAr ? "طلب نقل الرقم (MNP)؟" : "Number Porting Requested (MNP)?"}>
              <RadioGroup
                name="porting"
                options={[
                  { value: "yes", label: isAr ? "نعم" : "Yes" },
                  { value: "no",  label: isAr ? "لا" : "No" },
                ]}
                value={portingRequested}
                onChange={setPortingRequested}
              />
            </FormField>

            {portingRequested === "yes" && (
              <FormField label={isAr ? "المشغّل المستقبِل" : "Receiving Operator"}>
                <SelectInput
                  options={[
                    { value: "omantel",  label: "Omantel" },
                    { value: "ooredoo",  label: "Ooredoo Oman" },
                    { value: "vodafone", label: "Vodafone Oman" },
                  ]}
                  placeholder={isAr ? "اختر المشغّل" : "Select operator"}
                  value={portingOperator}
                  onChange={(e) => setPortingOperator(e.target.value)}
                />
              </FormField>
            )}
          </div>
        </SectionCard>

        <SectionCard title={isAr ? "الرصيد وإعادة تدوير الرقم" : "Balance & Number Recycling"} icon="ri-recycle-line">
          <div className="space-y-4">
            <FormField label={isAr ? "الرصيد النهائي (OMR)" : "Final Balance (OMR)"}>
              <TextInput
                type="number"
                placeholder="0.000"
                value={finalBalance}
                onChange={(e) => setFinalBalance(e.target.value)}
                autoFilled={autoFilled && !!finalBalance}
                className="font-['JetBrains_Mono']"
              />
            </FormField>

            {parseFloat(finalBalance) > 0 && (
              <FormField label={isAr ? "التصرف في الرصيد" : "Balance Disposition"} required>
                <RadioGroup
                  name="balanceDisposition"
                  options={[
                    { value: "refund",   label: isAr ? "استرداد" : "Refund" },
                    { value: "donate",   label: isAr ? "تبرع" : "Donate" },
                    { value: "forfeit",  label: isAr ? "مصادرة" : "Forfeit" },
                  ]}
                  value={balanceDisposition}
                  onChange={setBalanceDisposition}
                />
              </FormField>
            )}

            <FormField label={isAr ? "إعادة تدوير الرقم" : "Number Recycling"} required>
              <SelectInput
                options={RECYCLING_OPTIONS.map((r) => ({ value: r.value, label: isAr ? r.labelAr : r.label }))}
                placeholder={isAr ? "اختر سياسة إعادة التدوير" : "Select recycling policy"}
                value={numberRecycling}
                onChange={(e) => setNumberRecycling(e.target.value)}
              />
            </FormField>

            {/* Closure warning */}
            <div
              className="flex items-start gap-3 px-4 py-3 rounded-xl border"
              style={{ background: "rgba(248,113,113,0.05)", borderColor: "rgba(248,113,113,0.2)" }}
            >
              <i className="ri-error-warning-line text-red-400 text-sm mt-0.5 flex-shrink-0" />
              <p className="text-gray-400 text-xs font-['Inter']">
                {isAr
                  ? "تحذير: إغلاق الشريحة إجراء لا رجعة فيه. سيتم إرسال إشعار فوري إلى منصة Al-Ameen."
                  : "Warning: SIM closure is irreversible. An immediate notification will be sent to the Al-Ameen platform."}
              </p>
            </div>
          </div>
        </SectionCard>
      </div>

      <FormActions
        onCancel={onCancel}
        onSave={handleSave}
        saveLabel={isAr ? "تأكيد الإغلاق النهائي" : "Confirm Final Closure"}
        isAr={isAr}
        saving={saving}
      />
    </div>
  );
};

export default SimClosedForm;
