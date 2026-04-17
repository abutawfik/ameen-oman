import { useState } from "react";
import {
  SectionCard, FormField, TextInput, SelectInput, RadioGroup, FormActions,
} from "@/pages/dashboard/hotel-events/components/FormComponents";
import EmpConfirmation from "./components/EmpConfirmation";

interface Props { isAr: boolean; onCancel: () => void; }

const TERMINATION_REASONS = [
  { value: "resignation", label: "Resignation / استقالة" },
  { value: "termination", label: "Termination by Employer / إنهاء من صاحب العمل" },
  { value: "absconding", label: "Absconding / تغيب عن العمل" },
  { value: "deportation", label: "Deportation / ترحيل" },
  { value: "contract_end", label: "Contract End / انتهاء العقد" },
  { value: "death", label: "Death / وفاة" },
  { value: "medical", label: "Medical / أسباب طبية" },
];

interface PermitInfo {
  permitNumber: string;
  holderName: string;
  employerName: string;
  jobTitle: string;
  nationality: string;
  permitEnd: string;
  status: "active" | "expired";
}

const MOCK_PERMITS: Record<string, PermitInfo> = {
  "WP-2024-88210001": { permitNumber: "WP-2024-88210001", holderName: "Rajesh Kumar", employerName: "Oman Construction LLC", jobTitle: "Civil Engineer", nationality: "India", permitEnd: "2026-08-15", status: "active" },
  "WP-2023-44120002": { permitNumber: "WP-2023-44120002", holderName: "Priya Nair", employerName: "Muscat Hospitality Group", jobTitle: "Front Desk Officer", nationality: "India", permitEnd: "2025-12-31", status: "active" },
  "WP-2025-11030003": { permitNumber: "WP-2025-11030003", holderName: "Mohammed Al-Rashidi", employerName: "Al Seeb Retail Co.", jobTitle: "Sales Associate", nationality: "Yemen", permitEnd: "2025-03-01", status: "expired" },
};

const TerminationForm = ({ isAr, onCancel }: Props) => {
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [permitNumber, setPermitNumber] = useState("");
  const [permitInfo, setPermitInfo] = useState<PermitInfo | null>(null);
  const [lookingUp, setLookingUp] = useState(false);
  const [terminationDate, setTerminationDate] = useState("");
  const [reason, setReason] = useState("");
  const [finalExit, setFinalExit] = useState("no");
  const [gracePeriod, setGracePeriod] = useState("30");
  const [confirmed, setConfirmed] = useState(false);

  const handleLookup = () => {
    setLookingUp(true);
    setTimeout(() => {
      setPermitInfo(MOCK_PERMITS[permitNumber] || null);
      setLookingUp(false);
    }, 900);
  };

  const handleSubmit = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setSubmitted(true); }, 1400);
  };

  if (submitted) return <EmpConfirmation isAr={isAr} onReset={() => setSubmitted(false)} eventLabel="Employment Termination" eventLabelAr="إنهاء العمل" eventColor="#F87171" eventIcon="ri-user-unfollow-line" />;

  const isAbsconding = reason === "absconding";
  const isDeportation = reason === "deportation";
  const isHighRisk = isAbsconding || isDeportation;

  return (
    <div className="space-y-5">
      {/* Warning */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl border" style={{ background: "rgba(248,113,113,0.06)", borderColor: "rgba(248,113,113,0.2)" }}>
        <i className="ri-error-warning-line text-red-400 text-sm mt-0.5 flex-shrink-0" />
        <p className="text-gray-400 text-xs">
          {isAr
            ? "إنهاء العمل يُلغي تصريح العمل ويُبلَّغ تلقائياً إلى وزارة العمل. حالات التغيب تُبلَّغ فوراً إلى Al-Ameen."
            : "Termination cancels the work permit and is auto-reported to the Ministry of Labour. Absconding cases are immediately flagged in Al-Ameen."}
        </p>
      </div>

      {/* Permit Lookup */}
      <SectionCard title={isAr ? "بحث عن التصريح" : "Permit Lookup"} icon="ri-search-line">
        <div className="space-y-4">
          <FormField label={isAr ? "رقم التصريح" : "Permit Number"} required>
            <div className="flex gap-2">
              <TextInput placeholder="WP-XXXX-XXXXXXXX" value={permitNumber} onChange={(e) => setPermitNumber(e.target.value)} className="font-['JetBrains_Mono'] flex-1" />
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
          {permitInfo && (
            <div className="rounded-xl border p-4" style={{ background: "rgba(20,29,46,0.6)", borderColor: "rgba(181,142,60,0.15)" }}>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { label: isAr ? "حامل التصريح" : "Permit Holder", value: permitInfo.holderName },
                  { label: isAr ? "صاحب العمل" : "Employer", value: permitInfo.employerName },
                  { label: isAr ? "المسمى الوظيفي" : "Job Title", value: permitInfo.jobTitle },
                  { label: isAr ? "الجنسية" : "Nationality", value: permitInfo.nationality },
                  { label: isAr ? "انتهاء التصريح" : "Permit End", value: permitInfo.permitEnd },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-gray-500 text-xs">{item.label}</p>
                    <p className="text-white text-sm font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </SectionCard>

      {/* Termination Details */}
      <SectionCard title={isAr ? "تفاصيل الإنهاء" : "Termination Details"} icon="ri-user-unfollow-line">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField label={isAr ? "تاريخ الإنهاء" : "Termination Date"} required>
              <TextInput type="date" value={terminationDate} onChange={(e) => setTerminationDate(e.target.value)} />
            </FormField>
            <FormField label={isAr ? "سبب الإنهاء" : "Termination Reason"} required>
              <SelectInput options={TERMINATION_REASONS} placeholder={isAr ? "اختر السبب" : "Select reason"} value={reason} onChange={(e) => setReason(e.target.value)} />
            </FormField>
          </div>

          {isHighRisk && (
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl border" style={{ background: "rgba(248,113,113,0.08)", borderColor: "rgba(248,113,113,0.25)" }}>
              <i className="ri-alarm-warning-line text-red-400 text-sm mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-400 text-xs font-bold mb-0.5">
                  {isAbsconding ? (isAr ? "تنبيه: تغيب عن العمل — يُبلَّغ فوراً إلى Al-Ameen" : "Alert: Absconding — Immediately flagged in Al-Ameen") : (isAr ? "تنبيه: ترحيل — يُبلَّغ إلى الجهات المختصة" : "Alert: Deportation — Reported to relevant authorities")}
                </p>
                <p className="text-gray-400 text-xs">
                  {isAbsconding ? (isAr ? "سيتم التحقق من تدفق الحدود. إذا لم يغادر الشخص البلاد، سيتم تفعيل مراقبة الفندق والمرافق والنقل." : "Border stream will be checked. If person has not exited, hotel/utility/transport monitoring will be activated.") : ""}
                </p>
              </div>
            </div>
          )}

          <FormField label={isAr ? "هل يتطلب مغادرة نهائية؟" : "Final Exit Required?"} required>
            <RadioGroup name="finalExit" options={[{ value: "yes", label: isAr ? "نعم" : "Yes" }, { value: "no", label: isAr ? "لا" : "No" }]} value={finalExit} onChange={setFinalExit} />
          </FormField>

          {finalExit === "yes" && (
            <FormField label={isAr ? "أيام فترة السماح المتبقية" : "Grace Period Days Remaining"} required>
              <div className="flex items-center gap-3">
                <TextInput type="number" placeholder="30" value={gracePeriod} onChange={(e) => setGracePeriod(e.target.value)} className="font-['JetBrains_Mono'] w-32" />
                <span className="text-gray-400 text-sm">{isAr ? "يوم" : "days"}</span>
                {parseInt(gracePeriod) <= 7 && parseInt(gracePeriod) > 0 && (
                  <span className="flex items-center gap-1 text-red-400 text-xs font-semibold">
                    <i className="ri-alarm-warning-line" />{isAr ? "فترة سماح قصيرة جداً" : "Very short grace period"}
                  </span>
                )}
              </div>
            </FormField>
          )}

          {/* Confirmation */}
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
          {saving ? <i className="ri-loader-4-line animate-spin" /> : <i className="ri-user-unfollow-line" />}
          {isAr ? "تأكيد الإنهاء" : "Confirm Termination"}
        </button>
      </div>
    </div>
  );
};

export default TerminationForm;
