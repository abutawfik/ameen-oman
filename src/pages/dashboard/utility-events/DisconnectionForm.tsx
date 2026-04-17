import { useState } from "react";
import {
  SectionCard, FormField, TextInput, SelectInput, FormActions,
} from "@/pages/dashboard/hotel-events/components/FormComponents";
import UtilConfirmation from "./components/UtilConfirmation";

interface Props { isAr: boolean; onCancel: () => void; }

const DISCONNECTION_REASONS = [
  { value: "customer_request", label: "Customer Request / طلب العميل" },
  { value: "non_payment", label: "Non-Payment / عدم السداد" },
  { value: "vacancy", label: "Property Vacancy / شغور العقار" },
  { value: "violation", label: "Tariff Violation / مخالفة التعرفة" },
  { value: "relocation", label: "Relocation / انتقال" },
  { value: "demolition", label: "Property Demolition / هدم العقار" },
];

interface AccountInfo {
  accountNumber: string;
  holderName: string;
  address: string;
  serviceType: string;
  provider: string;
  meterNumber: string;
  lastReading: number;
  outstandingBalance: number;
  status: "active" | "suspended";
}

const MOCK_ACCOUNTS: Record<string, AccountInfo> = {
  "ACC-2024-8821": { accountNumber: "ACC-2024-8821", holderName: "Ahmed Al-Balushi", address: "District 4, Capital Region", serviceType: "Electricity", provider: "National Electric Company", meterNumber: "MTR-44821", lastReading: 14820, outstandingBalance: 0, status: "active" },
  "ACC-2023-4412": { accountNumber: "ACC-2023-4412", holderName: "Fatima Al-Zadjali", address: "Central District, Capital Region", serviceType: "Water", provider: "National Water Authority", meterNumber: "MTR-33412", lastReading: 8240, outstandingBalance: 45.5, status: "active" },
  "ACC-2025-1103": { accountNumber: "ACC-2025-1103", holderName: "Raj Patel", address: "Northern Coastal Region", serviceType: "Internet", provider: "Telco A", meterNumber: "N/A", lastReading: 0, outstandingBalance: 128.0, status: "suspended" },
};

const DisconnectionForm = ({ isAr, onCancel }: Props) => {
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [lookingUp, setLookingUp] = useState(false);
  const [disconnectionDate, setDisconnectionDate] = useState("");
  const [reason, setReason] = useState("");
  const [finalReading, setFinalReading] = useState("");
  const [outstandingBalance, setOutstandingBalance] = useState("");
  const [notes, setNotes] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const handleLookup = () => {
    setLookingUp(true);
    setTimeout(() => {
      const found = MOCK_ACCOUNTS[accountNumber];
      setAccountInfo(found || null);
      if (found) {
        setFinalReading(String(found.lastReading));
        setOutstandingBalance(String(found.outstandingBalance));
      }
      setLookingUp(false);
    }, 900);
  };

  const handleSubmit = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setSubmitted(true); }, 1400);
  };

  if (submitted) return <UtilConfirmation isAr={isAr} onReset={() => setSubmitted(false)} eventLabel="Service Disconnection" eventLabelAr="قطع الخدمة" eventColor="#F87171" />;

  const isHighRisk = reason === "non_payment" || reason === "violation";

  return (
    <div className="space-y-5">
      {/* Warning banner */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl border" style={{ background: "rgba(248,113,113,0.06)", borderColor: "rgba(248,113,113,0.2)" }}>
        <i className="ri-error-warning-line text-red-400 text-sm mt-0.5 flex-shrink-0" />
        <p className="text-gray-400 text-xs">
          {isAr
            ? "قطع الخدمة إجراء لا رجعة فيه. تأكد من صحة جميع البيانات قبل الإرسال."
            : "Disconnection is an irreversible action. Verify all data before submitting."}
        </p>
      </div>

      {/* Account Lookup */}
      <SectionCard title={isAr ? "بحث عن الحساب" : "Account Lookup"} icon="ri-search-line">
        <div className="space-y-4">
          <FormField label={isAr ? "رقم الحساب" : "Account Number"} required>
            <div className="flex gap-2">
              <TextInput placeholder="ACC-XXXX-XXXX" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="font-['JetBrains_Mono'] flex-1" />
              <button type="button" onClick={handleLookup}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap"
                style={{ background: "#D4A84B", color: "#0B1220" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#C99C48"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#D4A84B"; }}>
                {lookingUp ? <i className="ri-loader-4-line animate-spin" /> : <i className="ri-search-line" />}
                {isAr ? "بحث" : "Lookup"}
              </button>
            </div>
          </FormField>

          {accountInfo && (
            <div className="rounded-xl border p-4" style={{ background: "rgba(20,29,46,0.6)", borderColor: "rgba(181,142,60,0.15)" }}>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { label: isAr ? "صاحب الحساب" : "Account Holder", value: accountInfo.holderName, color: "#FFFFFF" },
                  { label: isAr ? "نوع الخدمة" : "Service Type", value: accountInfo.serviceType, color: "#D4A84B" },
                  { label: isAr ? "المزود" : "Provider", value: accountInfo.provider, color: "#D1D5DB" },
                  { label: isAr ? "العنوان" : "Address", value: accountInfo.address, color: "#D1D5DB" },
                  { label: isAr ? "رقم العداد" : "Meter Number", value: accountInfo.meterNumber, color: "#D4A84B" },
                  { label: isAr ? "الرصيد المستحق" : "Outstanding Balance", value: `${accountInfo.outstandingBalance} LCY`, color: accountInfo.outstandingBalance > 0 ? "#F87171" : "#4ADE80" },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-gray-500 text-xs">{item.label}</p>
                    <p className="text-sm font-semibold font-['JetBrains_Mono']" style={{ color: item.color }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </SectionCard>

      {/* Disconnection Details */}
      <SectionCard title={isAr ? "تفاصيل القطع" : "Disconnection Details"} icon="ri-shut-down-line">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField label={isAr ? "تاريخ القطع" : "Disconnection Date"} required>
              <TextInput type="date" value={disconnectionDate} onChange={(e) => setDisconnectionDate(e.target.value)} />
            </FormField>
            <FormField label={isAr ? "سبب القطع" : "Disconnection Reason"} required>
              <SelectInput options={DISCONNECTION_REASONS} placeholder={isAr ? "اختر السبب" : "Select reason"} value={reason} onChange={(e) => setReason(e.target.value)} />
            </FormField>
          </div>

          {isHighRisk && (
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl border" style={{ background: "rgba(248,113,113,0.06)", borderColor: "rgba(248,113,113,0.2)" }}>
              <i className="ri-alarm-warning-line text-red-400 text-sm mt-0.5 flex-shrink-0" />
              <p className="text-red-400 text-xs font-semibold">
                {isAr ? "تنبيه: هذا السبب يُبلَّغ تلقائياً إلى AMEEN للمراجعة." : "Alert: This reason is auto-reported to AMEEN for review."}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <FormField label={isAr ? "القراءة النهائية" : "Final Reading"}>
              <TextInput placeholder="e.g. 14820" value={finalReading} onChange={(e) => setFinalReading(e.target.value)} className="font-['JetBrains_Mono']" />
            </FormField>
            <FormField label={isAr ? "الرصيد المستحق (LCY)" : "Outstanding Balance (LCY)"}>
              <TextInput placeholder="0.000" value={outstandingBalance} onChange={(e) => setOutstandingBalance(e.target.value)} className="font-['JetBrains_Mono']" />
            </FormField>
          </div>

          <FormField label={isAr ? "ملاحظات" : "Notes"}>
            <textarea
              rows={3}
              placeholder={isAr ? "أي ملاحظات إضافية..." : "Any additional notes..."}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-gray-600 outline-none resize-none font-['Inter']"
              style={{ background: "#0F1923", border: "1px solid rgba(255,255,255,0.08)" }}
              onFocus={(e) => { e.target.style.borderColor = "#D4A84B"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
            />
          </FormField>

          {/* Confirmation checkbox */}
          <button type="button" onClick={() => setConfirmed((v) => !v)}
            className="flex items-center gap-3 cursor-pointer w-full text-left">
            <div className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all"
              style={{ borderColor: confirmed ? "#F87171" : "rgba(255,255,255,0.2)", background: confirmed ? "rgba(248,113,113,0.15)" : "transparent" }}>
              {confirmed && <i className="ri-check-line text-red-400 text-xs" />}
            </div>
            <span className="text-gray-400 text-xs">{isAr ? "أؤكد أن هذا الإجراء مصرح به وأن جميع البيانات صحيحة" : "I confirm this action is authorized and all data is accurate"}</span>
          </button>
        </div>
      </SectionCard>

      <div className="flex items-center justify-end gap-3 pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <button type="button" onClick={onCancel}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap"
          style={{ background: "transparent", borderColor: "rgba(255,255,255,0.15)", color: "#9CA3AF" }}>
          <i className="ri-close-line" />{isAr ? "إلغاء" : "Cancel"}
        </button>
        <button type="button" onClick={handleSubmit} disabled={!confirmed || saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold cursor-pointer whitespace-nowrap disabled:opacity-40"
          style={{ background: "#F87171", color: "#0B1220" }}
          onMouseEnter={(e) => { if (confirmed) (e.currentTarget as HTMLButtonElement).style.background = "#EF4444"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#F87171"; }}>
          {saving ? <i className="ri-loader-4-line animate-spin" /> : <i className="ri-shut-down-line" />}
          {isAr ? "تأكيد القطع" : "Confirm Disconnection"}
        </button>
      </div>
    </div>
  );
};

export default DisconnectionForm;
