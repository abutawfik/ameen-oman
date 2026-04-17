import { useState } from "react";
import {
  SectionCard, FormField, TextInput, SelectInput, TipBanner, FormActions,
} from "@/pages/dashboard/hotel-events/components/FormComponents";
import MunConfirmation from "./components/MunConfirmation";

const STOP_REASONS = [
  { value: "tenant_request", label: "Tenant Request",     labelAr: "طلب المستأجر" },
  { value: "owner_request",  label: "Owner Request",      labelAr: "طلب المالك" },
  { value: "contract_end",   label: "Contract End",       labelAr: "انتهاء العقد" },
  { value: "non_payment",    label: "Non-Payment",        labelAr: "عدم السداد" },
  { value: "violation",      label: "Contract Violation", labelAr: "مخالفة العقد" },
  { value: "property_sale",  label: "Property Sale",      labelAr: "بيع العقار" },
  { value: "other",          label: "Other",              labelAr: "أخرى" },
];

const DEPOSIT_STATUSES = [
  { value: "full_return",    label: "Full Return",     labelAr: "استرداد كامل" },
  { value: "partial_return", label: "Partial Return",  labelAr: "استرداد جزئي" },
  { value: "forfeited",      label: "Forfeited",       labelAr: "مصادر" },
  { value: "pending",        label: "Pending Review",  labelAr: "قيد المراجعة" },
];

interface Props { isAr: boolean; onCancel: () => void; }

const StopRentalForm = ({ isAr, onCancel }: Props) => {
  const [agreementRef, setAgreementRef] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [forwardingAddress, setForwardingAddress] = useState("");
  const [depositStatus, setDepositStatus] = useState("full_return");
  const [depositAmount, setDepositAmount] = useState("");
  const [outstanding, setOutstanding] = useState("");
  const [outstandingNotes, setOutstandingNotes] = useState("");
  const [autoFilled, setAutoFilled] = useState(false);
  const [lookupError, setLookupError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  const MOCK_AGREEMENTS: Record<string, { tenant: string; address: string; deposit: string }> = {
    "AGR-2024-001": { tenant: "Mohammed Al-Farsi", address: "Block 7, Northern District, Capital Region", deposit: "2400.000" },
    "AGR-2024-002": { tenant: "Sarah Johnson", address: "Unit 4B, Eastern Area, Coastal Region", deposit: "1700.000" },
  };

  const handleLookup = () => {
    const found = MOCK_AGREEMENTS[agreementRef.toUpperCase()];
    if (found) {
      setTenantName(found.tenant);
      setPropertyAddress(found.address);
      setDepositAmount(found.deposit);
      setAutoFilled(true);
      setLookupError(false);
    } else {
      setLookupError(true);
      setAutoFilled(false);
    }
  };

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
        eventType={isAr ? "إنهاء إيجار" : "Stop Rental"}
        isAr={isAr}
        onReset={() => { setConfirmed(false); setAgreementRef(""); setAutoFilled(false); }}
      />
    );

  const netToTenant =
    depositAmount && outstanding
      ? (parseFloat(depositAmount) - parseFloat(outstanding || "0")).toFixed(3)
      : depositAmount
      ? depositAmount
      : null;

  return (
    <div className="space-y-5">
      <TipBanner
        text={isAr ? "إنهاء الإيجار إجراء نهائي. تأكد من معالجة التأمين والمستحقات. جرّب: AGR-2024-001" : "Rental termination is final. Ensure deposit and outstanding amounts are handled. Try: AGR-2024-001"}
        color="amber"
      />

      {/* Lookup */}
      <SectionCard title={isAr ? "بحث عن العقد" : "Agreement Lookup"} icon="ri-search-line">
        <div className="flex gap-3 items-end flex-wrap">
          <div className="flex-1 min-w-48">
            <FormField label={isAr ? "رقم مرجع العقد" : "Agreement Reference"} required>
              <div className="flex gap-2">
                <TextInput
                  placeholder="AGR-XXXX-XXX"
                  value={agreementRef}
                  onChange={(e) => { setAgreementRef(e.target.value); setLookupError(false); }}
                  className="font-['JetBrains_Mono']"
                />
                <button
                  type="button"
                  onClick={handleLookup}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors"
                  style={{ background: "rgba(184,138,60,0.12)", border: "1px solid rgba(184,138,60,0.3)", color: "#D6B47E" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(184,138,60,0.2)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(184,138,60,0.12)"; }}
                >
                  <i className="ri-search-line text-xs" />{isAr ? "بحث" : "Lookup"}
                </button>
              </div>
            </FormField>
          </div>
          {autoFilled && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ background: "rgba(74,222,128,0.06)", borderColor: "rgba(74,222,128,0.2)" }}>
              <i className="ri-checkbox-circle-line text-green-400 text-sm" />
              <span className="text-green-400 text-xs font-semibold">{isAr ? "تم العثور على العقد" : "Agreement found"}</span>
            </div>
          )}
          {lookupError && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ background: "rgba(201,74,94,0.06)", borderColor: "rgba(201,74,94,0.2)" }}>
              <i className="ri-close-circle-line text-red-400 text-sm" />
              <span className="text-red-400 text-xs font-semibold">{isAr ? "لم يُعثر على العقد" : "Agreement not found"}</span>
            </div>
          )}
        </div>
        {autoFilled && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <FormField label={isAr ? "اسم المستأجر" : "Tenant Name"}>
              <TextInput value={tenantName} onChange={(e) => setTenantName(e.target.value)} autoFilled />
            </FormField>
            <FormField label={isAr ? "عنوان العقار" : "Property Address"}>
              <TextInput value={propertyAddress} onChange={(e) => setPropertyAddress(e.target.value)} autoFilled />
            </FormField>
          </div>
        )}
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Termination Details */}
        <SectionCard title={isAr ? "تفاصيل الإنهاء" : "Termination Details"} icon="ri-home-2-line">
          <div className="space-y-4">
            <FormField label={isAr ? "تاريخ الإنهاء" : "Termination Date"} required>
              <TextInput type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </FormField>
            <FormField label={isAr ? "سبب الإنهاء" : "Termination Reason"} required>
              <SelectInput
                options={STOP_REASONS.map((r) => ({ value: r.value, label: isAr ? r.labelAr : r.label }))}
                placeholder={isAr ? "اختر السبب" : "Select reason"}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </FormField>
            <FormField label={isAr ? "عنوان المراسلة الجديد" : "Forwarding Address"} required>
              <TextInput placeholder={isAr ? "العنوان الجديد للمستأجر" : "Tenant's new address"} value={forwardingAddress} onChange={(e) => setForwardingAddress(e.target.value)} />
            </FormField>
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl border" style={{ background: "rgba(201,74,94,0.05)", borderColor: "rgba(201,74,94,0.2)" }}>
              <i className="ri-error-warning-line text-red-400 text-sm mt-0.5 flex-shrink-0" />
              <p className="text-gray-400 text-xs">
                {isAr
                  ? "تحذير: إنهاء الإيجار إجراء لا رجعة فيه. سيتم إرسال إشعار فوري إلى Al-Ameen."
                  : "Warning: Rental termination is irreversible. An immediate notification will be sent to Al-Ameen."}
              </p>
            </div>
          </div>
        </SectionCard>

        {/* Deposit & Outstanding */}
        <SectionCard title={isAr ? "التأمين والمستحقات" : "Deposit & Outstanding"} icon="ri-money-dollar-circle-line">
          <div className="space-y-4">
            <FormField label={isAr ? "حالة التأمين" : "Deposit Status"} required>
              <SelectInput
                options={DEPOSIT_STATUSES.map((d) => ({ value: d.value, label: isAr ? d.labelAr : d.label }))}
                placeholder={isAr ? "اختر الحالة" : "Select status"}
                value={depositStatus}
                onChange={(e) => setDepositStatus(e.target.value)}
              />
            </FormField>
            <FormField label={isAr ? "مبلغ التأمين (LCY)" : "Deposit Amount (LCY)"}>
              <div className="relative">
                <TextInput type="number" placeholder="0.000" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} autoFilled={autoFilled && !!depositAmount} className="font-['JetBrains_Mono'] pr-12" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-['JetBrains_Mono']">LCY</span>
              </div>
            </FormField>
            <FormField label={isAr ? "المبالغ المستحقة (LCY)" : "Outstanding Amount (LCY)"}>
              <div className="relative">
                <TextInput type="number" placeholder="0.000" value={outstanding} onChange={(e) => setOutstanding(e.target.value)} className="font-['JetBrains_Mono'] pr-12" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-['JetBrains_Mono']">LCY</span>
              </div>
            </FormField>
            {parseFloat(outstanding) > 0 && (
              <FormField label={isAr ? "تفاصيل المستحقات" : "Outstanding Details"}>
                <textarea
                  rows={3}
                  placeholder={isAr ? "وصف المبالغ المستحقة..." : "Describe outstanding amounts..."}
                  value={outstandingNotes}
                  onChange={(e) => setOutstandingNotes(e.target.value)}
                  maxLength={500}
                  className="w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-gray-600 outline-none transition-all duration-200 resize-none"
                  style={{ background: "#0F1923", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "Inter, sans-serif" }}
                  onFocus={(e) => { e.target.style.borderColor = "#D6B47E"; e.target.style.boxShadow = "0 0 0 2px rgba(184,138,60,0.08)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
                />
              </FormField>
            )}

            {/* Financial Summary */}
            {(depositAmount || outstanding) && (
              <div className="p-3 rounded-xl border" style={{ background: "rgba(184,138,60,0.04)", borderColor: "rgba(184,138,60,0.15)" }}>
                <p className="text-gray-500 text-xs mb-2">{isAr ? "ملخص مالي" : "Financial Summary"}</p>
                {[
                  { label: isAr ? "التأمين" : "Deposit", value: depositAmount ? `LCY ${depositAmount}` : "—" },
                  { label: isAr ? "المستحقات" : "Outstanding", value: outstanding ? `LCY ${outstanding}` : "LCY 0.000" },
                  { label: isAr ? "الصافي للمستأجر" : "Net to Tenant", value: netToTenant ? `LCY ${netToTenant}` : "—", highlight: true },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between py-1.5 border-b last:border-0" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                    <span className="text-gray-400 text-xs">{row.label}</span>
                    <span className="text-sm font-bold font-['JetBrains_Mono']" style={{ color: row.highlight ? "#D6B47E" : "#D1D5DB" }}>{row.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </SectionCard>
      </div>

      <FormActions onCancel={onCancel} onSave={handleSave} saveLabel={isAr ? "تأكيد الإنهاء النهائي" : "Confirm Termination"} isAr={isAr} saving={saving} />
    </div>
  );
};

export default StopRentalForm;
