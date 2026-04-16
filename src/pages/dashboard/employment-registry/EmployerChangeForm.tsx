import { useState } from "react";
import {
  SectionCard, FormField, TextInput, SelectInput, RadioGroup, FormActions,
} from "@/pages/dashboard/hotel-events/components/FormComponents";
import EmpConfirmation from "./components/EmpConfirmation";

interface Props { isAr: boolean; onCancel: () => void; }

const TRANSFER_REASONS = [
  { value: "resignation", label: "Resignation / استقالة" },
  { value: "termination", label: "Termination by Employer / إنهاء من صاحب العمل" },
  { value: "sponsor_transfer", label: "Sponsor Transfer / نقل كفالة" },
  { value: "business_closure", label: "Business Closure / إغلاق المنشأة" },
  { value: "mutual_agreement", label: "Mutual Agreement / اتفاق مشترك" },
];

const NOC_STATUS = [
  { value: "obtained", label: "NOC Obtained / تم الحصول على عدم الممانعة" },
  { value: "waived", label: "NOC Waived (2-year rule) / مُعفى (قاعدة السنتين)" },
  { value: "pending", label: "NOC Pending / قيد الانتظار" },
  { value: "not_required", label: "Not Required / غير مطلوب" },
];

interface PermitInfo {
  permitNumber: string;
  holderName: string;
  employerName: string;
  jobTitle: string;
  sector: string;
  permitEnd: string;
  status: "active" | "expired";
}

const MOCK_PERMITS: Record<string, PermitInfo> = {
  "WP-2024-88210001": { permitNumber: "WP-2024-88210001", holderName: "Rajesh Kumar", employerName: "Oman Construction LLC", jobTitle: "Civil Engineer", sector: "Construction", permitEnd: "2026-08-15", status: "active" },
  "WP-2023-44120002": { permitNumber: "WP-2023-44120002", holderName: "Priya Nair", employerName: "Muscat Hospitality Group", jobTitle: "Front Desk Officer", sector: "Hospitality", permitEnd: "2025-12-31", status: "active" },
  "WP-2025-11030003": { permitNumber: "WP-2025-11030003", holderName: "Mohammed Al-Rashidi", employerName: "Al Seeb Retail Co.", jobTitle: "Sales Associate", sector: "Retail", permitEnd: "2025-03-01", status: "expired" },
};

const EmployerChangeForm = ({ isAr, onCancel }: Props) => {
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [oldPermit, setOldPermit] = useState("");
  const [oldPermitInfo, setOldPermitInfo] = useState<PermitInfo | null>(null);
  const [lookingUp, setLookingUp] = useState(false);
  const [newEmployer, setNewEmployer] = useState("");
  const [newCR, setNewCR] = useState("");
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newPermitNumber, setNewPermitNumber] = useState("");
  const [transferDate, setTransferDate] = useState("");
  const [reason, setReason] = useState("");
  const [nocStatus, setNocStatus] = useState("");
  const [notes, setNotes] = useState("");

  const handleLookup = () => {
    setLookingUp(true);
    setTimeout(() => {
      setOldPermitInfo(MOCK_PERMITS[oldPermit] || null);
      setLookingUp(false);
    }, 900);
  };

  const handleSubmit = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setSubmitted(true); }, 1400);
  };

  if (submitted) return <EmpConfirmation isAr={isAr} onReset={() => setSubmitted(false)} eventLabel="Employer Change" eventLabelAr="تغيير صاحب العمل" eventColor="#4ADE80" eventIcon="ri-building-line" />;

  return (
    <div className="space-y-5">
      {/* Old Permit Lookup */}
      <SectionCard title={isAr ? "التصريح الحالي" : "Current Permit"} icon="ri-search-line">
        <div className="space-y-4">
          <FormField label={isAr ? "رقم التصريح الحالي" : "Current Permit Number"} required>
            <div className="flex gap-2">
              <TextInput placeholder="WP-XXXX-XXXXXXXX" value={oldPermit} onChange={(e) => setOldPermit(e.target.value)} className="font-['JetBrains_Mono'] flex-1" />
              <button type="button" onClick={handleLookup}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap"
                style={{ background: "#22D3EE", color: "#060D1A" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#06B6D4"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#22D3EE"; }}>
                {lookingUp ? <i className="ri-loader-4-line animate-spin" /> : <i className="ri-search-line" />}
                {isAr ? "بحث" : "Lookup"}
              </button>
            </div>
          </FormField>
          {oldPermitInfo && (
            <div className="rounded-xl border p-4" style={{ background: oldPermitInfo.status === "active" ? "rgba(74,222,128,0.06)" : "rgba(248,113,113,0.06)", borderColor: oldPermitInfo.status === "active" ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.2)" }}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2 h-2 rounded-full ${oldPermitInfo.status === "active" ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
                <span className="text-xs font-bold font-['JetBrains_Mono']" style={{ color: oldPermitInfo.status === "active" ? "#4ADE80" : "#F87171" }}>{oldPermitInfo.status.toUpperCase()}</span>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { label: isAr ? "حامل التصريح" : "Permit Holder", value: oldPermitInfo.holderName },
                  { label: isAr ? "صاحب العمل" : "Employer", value: oldPermitInfo.employerName },
                  { label: isAr ? "المسمى الوظيفي" : "Job Title", value: oldPermitInfo.jobTitle },
                  { label: isAr ? "القطاع" : "Sector", value: oldPermitInfo.sector },
                  { label: isAr ? "انتهاء التصريح" : "Permit End", value: oldPermitInfo.permitEnd },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-gray-500 text-xs">{item.label}</p>
                    <p className="text-white text-sm font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {oldPermitInfo === null && oldPermit && !lookingUp && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl border" style={{ background: "rgba(248,113,113,0.06)", borderColor: "rgba(248,113,113,0.2)" }}>
              <i className="ri-error-warning-line text-red-400 text-sm" />
              <span className="text-red-400 text-sm">{isAr ? "لم يتم العثور على التصريح" : "Permit not found"}</span>
            </div>
          )}
        </div>
      </SectionCard>

      {/* New Employer */}
      <SectionCard title={isAr ? "صاحب العمل الجديد" : "New Employer"} icon="ri-building-line">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField label={isAr ? "اسم صاحب العمل الجديد" : "New Employer Name"} required>
              <TextInput placeholder={isAr ? "اسم الشركة" : "Company name"} value={newEmployer} onChange={(e) => setNewEmployer(e.target.value)} />
            </FormField>
            <FormField label={isAr ? "رقم السجل التجاري" : "CR Number"} required>
              <TextInput placeholder="CR-XXXXXXXX" value={newCR} onChange={(e) => setNewCR(e.target.value)} className="font-['JetBrains_Mono']" />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label={isAr ? "المسمى الوظيفي الجديد" : "New Job Title"} required>
              <TextInput placeholder={isAr ? "المسمى الوظيفي" : "Job title"} value={newJobTitle} onChange={(e) => setNewJobTitle(e.target.value)} />
            </FormField>
            <FormField label={isAr ? "رقم التصريح الجديد" : "New Permit Number"} required>
              <TextInput placeholder="WP-XXXX-XXXXXXXX" value={newPermitNumber} onChange={(e) => setNewPermitNumber(e.target.value)} className="font-['JetBrains_Mono']" />
            </FormField>
          </div>
        </div>
      </SectionCard>

      {/* Transfer Details */}
      <SectionCard title={isAr ? "تفاصيل النقل" : "Transfer Details"} icon="ri-swap-line">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField label={isAr ? "تاريخ النقل" : "Transfer Date"} required>
              <TextInput type="date" value={transferDate} onChange={(e) => setTransferDate(e.target.value)} />
            </FormField>
            <FormField label={isAr ? "سبب النقل" : "Transfer Reason"} required>
              <SelectInput options={TRANSFER_REASONS} placeholder={isAr ? "اختر السبب" : "Select reason"} value={reason} onChange={(e) => setReason(e.target.value)} />
            </FormField>
          </div>
          <FormField label={isAr ? "حالة عدم الممانعة (NOC)" : "NOC Status"} required>
            <SelectInput options={NOC_STATUS} placeholder={isAr ? "اختر الحالة" : "Select status"} value={nocStatus} onChange={(e) => setNocStatus(e.target.value)} />
          </FormField>
          {nocStatus === "pending" && (
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl border" style={{ background: "rgba(250,204,21,0.06)", borderColor: "rgba(250,204,21,0.2)" }}>
              <i className="ri-time-line text-yellow-400 text-sm mt-0.5 flex-shrink-0" />
              <p className="text-yellow-400 text-xs">{isAr ? "تحذير: NOC قيد الانتظار. لا يمكن إتمام النقل حتى يتم الحصول عليه." : "Warning: NOC is pending. Transfer cannot be finalized until obtained."}</p>
            </div>
          )}
          <FormField label={isAr ? "ملاحظات" : "Notes"}>
            <textarea rows={3} placeholder={isAr ? "أي ملاحظات إضافية..." : "Any additional notes..."} value={notes} onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-gray-600 outline-none resize-none font-['Inter']"
              style={{ background: "#0F1923", border: "1px solid rgba(255,255,255,0.08)" }}
              onFocus={(e) => { e.target.style.borderColor = "#22D3EE"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }} />
          </FormField>
        </div>
      </SectionCard>

      <FormActions isAr={isAr} onCancel={onCancel} onSave={handleSubmit} saving={saving} saveLabel={isAr ? "تأكيد النقل" : "Confirm Transfer"} />
    </div>
  );
};

export default EmployerChangeForm;
