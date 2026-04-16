import { useState } from "react";
import {
  SectionCard, FormField, TextInput, SelectInput, FormActions,
} from "@/pages/dashboard/hotel-events/components/FormComponents";
import EmpConfirmation from "./components/EmpConfirmation";

interface Props { isAr: boolean; onCancel: () => void; }

const SALARY_BANDS = [
  { value: "below_200", label: "Below 200 OMR" },
  { value: "200_400", label: "200 – 400 OMR" },
  { value: "400_700", label: "400 – 700 OMR" },
  { value: "700_1200", label: "700 – 1,200 OMR" },
  { value: "1200_2500", label: "1,200 – 2,500 OMR" },
  { value: "above_2500", label: "Above 2,500 OMR" },
];

interface PermitInfo {
  permitNumber: string;
  holderName: string;
  employerName: string;
  jobTitle: string;
  sector: string;
  currentExpiry: string;
  salaryBand: string;
  renewalCount: number;
  status: "active" | "expired" | "expiring_soon";
}

const MOCK_PERMITS: Record<string, PermitInfo> = {
  "WP-2024-88210001": { permitNumber: "WP-2024-88210001", holderName: "Rajesh Kumar", employerName: "Oman Construction LLC", jobTitle: "Civil Engineer", sector: "Construction", currentExpiry: "2026-08-15", salaryBand: "700_1200", renewalCount: 1, status: "active" },
  "WP-2023-44120002": { permitNumber: "WP-2023-44120002", holderName: "Priya Nair", employerName: "Muscat Hospitality Group", jobTitle: "Front Desk Officer", sector: "Hospitality", currentExpiry: "2026-04-30", salaryBand: "200_400", renewalCount: 2, status: "expiring_soon" },
  "WP-2025-11030003": { permitNumber: "WP-2025-11030003", holderName: "Mohammed Al-Rashidi", employerName: "Al Seeb Retail Co.", jobTitle: "Sales Associate", sector: "Retail", currentExpiry: "2025-03-01", salaryBand: "200_400", renewalCount: 0, status: "expired" },
};

const PermitRenewalForm = ({ isAr, onCancel }: Props) => {
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [permitNumber, setPermitNumber] = useState("");
  const [permitInfo, setPermitInfo] = useState<PermitInfo | null>(null);
  const [lookingUp, setLookingUp] = useState(false);
  const [newExpiry, setNewExpiry] = useState("");
  const [newSalaryBand, setNewSalaryBand] = useState("");
  const [newJobTitle, setNewJobTitle] = useState("");
  const [salaryChanged, setSalaryChanged] = useState(false);
  const [titleChanged, setTitleChanged] = useState(false);

  const handleLookup = () => {
    setLookingUp(true);
    setTimeout(() => {
      const found = MOCK_PERMITS[permitNumber];
      setPermitInfo(found || null);
      if (found) {
        setNewSalaryBand(found.salaryBand);
        setNewJobTitle(found.jobTitle);
      }
      setLookingUp(false);
    }, 900);
  };

  const handleSubmit = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setSubmitted(true); }, 1400);
  };

  if (submitted) return <EmpConfirmation isAr={isAr} onReset={() => setSubmitted(false)} eventLabel="Permit Renewal" eventLabelAr="تجديد التصريح" eventColor="#FACC15" eventIcon="ri-refresh-line" />;

  const statusColor = (s: PermitInfo["status"]) => s === "active" ? "#4ADE80" : s === "expiring_soon" ? "#FACC15" : "#F87171";
  const statusLabel = (s: PermitInfo["status"]) => s === "active" ? (isAr ? "نشط" : "Active") : s === "expiring_soon" ? (isAr ? "ينتهي قريباً" : "Expiring Soon") : (isAr ? "منتهي" : "Expired");

  return (
    <div className="space-y-5">
      {/* Lookup */}
      <SectionCard title={isAr ? "بحث عن التصريح" : "Permit Lookup"} icon="ri-search-line">
        <div className="space-y-4">
          <FormField label={isAr ? "رقم التصريح" : "Permit Number"} required>
            <div className="flex gap-2">
              <TextInput placeholder="WP-XXXX-XXXXXXXX" value={permitNumber} onChange={(e) => setPermitNumber(e.target.value)} className="font-['JetBrains_Mono'] flex-1" />
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

          {permitInfo && (
            <div className="rounded-xl border p-4" style={{ background: "rgba(10,22,40,0.6)", borderColor: "rgba(34,211,238,0.15)" }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full" style={{ background: statusColor(permitInfo.status) }} />
                <span className="text-xs font-bold font-['JetBrains_Mono']" style={{ color: statusColor(permitInfo.status) }}>{statusLabel(permitInfo.status)}</span>
                <span className="text-gray-600 text-xs">·</span>
                <span className="text-gray-400 text-xs">{isAr ? `تجديد رقم ${permitInfo.renewalCount + 1}` : `Renewal #${permitInfo.renewalCount + 1}`}</span>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { label: isAr ? "حامل التصريح" : "Permit Holder", value: permitInfo.holderName },
                  { label: isAr ? "صاحب العمل" : "Employer", value: permitInfo.employerName },
                  { label: isAr ? "المسمى الوظيفي" : "Job Title", value: permitInfo.jobTitle },
                  { label: isAr ? "القطاع" : "Sector", value: permitInfo.sector },
                  { label: isAr ? "انتهاء الحالي" : "Current Expiry", value: permitInfo.currentExpiry },
                  { label: isAr ? "عدد التجديدات" : "Renewal Count", value: String(permitInfo.renewalCount) },
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

      {/* Renewal Details */}
      <SectionCard title={isAr ? "تفاصيل التجديد" : "Renewal Details"} icon="ri-refresh-line">
        <div className="space-y-4">
          <FormField label={isAr ? "تاريخ الانتهاء الجديد" : "New Expiry Date"} required>
            <TextInput type="date" value={newExpiry} onChange={(e) => setNewExpiry(e.target.value)} />
          </FormField>

          {/* Salary change toggle */}
          <div>
            <button type="button" onClick={() => setSalaryChanged((v) => !v)}
              className="flex items-center gap-3 cursor-pointer mb-3">
              <div className="relative w-10 h-5 rounded-full transition-all duration-300"
                style={{ background: salaryChanged ? "#22D3EE" : "rgba(255,255,255,0.1)" }}>
                <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm"
                  style={{ left: salaryChanged ? "calc(100% - 18px)" : "2px" }} />
              </div>
              <span className="text-gray-300 text-sm">{isAr ? "تغيير الفئة الراتبية" : "Salary Band Change"}</span>
            </button>
            {salaryChanged && (
              <FormField label={isAr ? "الفئة الراتبية الجديدة" : "New Salary Band"} required>
                <SelectInput options={SALARY_BANDS} placeholder={isAr ? "اختر" : "Select"} value={newSalaryBand} onChange={(e) => setNewSalaryBand(e.target.value)} />
              </FormField>
            )}
          </div>

          {/* Title change toggle */}
          <div>
            <button type="button" onClick={() => setTitleChanged((v) => !v)}
              className="flex items-center gap-3 cursor-pointer mb-3">
              <div className="relative w-10 h-5 rounded-full transition-all duration-300"
                style={{ background: titleChanged ? "#22D3EE" : "rgba(255,255,255,0.1)" }}>
                <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm"
                  style={{ left: titleChanged ? "calc(100% - 18px)" : "2px" }} />
              </div>
              <span className="text-gray-300 text-sm">{isAr ? "تغيير المسمى الوظيفي" : "Job Title Change"}</span>
            </button>
            {titleChanged && (
              <FormField label={isAr ? "المسمى الوظيفي الجديد" : "New Job Title"} required>
                <TextInput placeholder={isAr ? "المسمى الوظيفي الجديد" : "New job title"} value={newJobTitle} onChange={(e) => setNewJobTitle(e.target.value)} />
              </FormField>
            )}
          </div>

          {/* Renewal summary */}
          {permitInfo && newExpiry && (
            <div className="rounded-xl border p-4" style={{ background: "rgba(250,204,21,0.06)", borderColor: "rgba(250,204,21,0.15)" }}>
              <p className="text-yellow-400 text-xs font-bold mb-2">{isAr ? "ملخص التجديد" : "Renewal Summary"}</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: isAr ? "الانتهاء الحالي" : "Current Expiry", value: permitInfo.currentExpiry, color: "#F87171" },
                  { label: isAr ? "الانتهاء الجديد" : "New Expiry", value: newExpiry, color: "#4ADE80" },
                  { label: isAr ? "رقم التجديد" : "Renewal #", value: String(permitInfo.renewalCount + 1), color: "#FACC15" },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <p className="text-gray-500 text-xs mb-0.5">{item.label}</p>
                    <p className="font-bold text-sm font-['JetBrains_Mono']" style={{ color: item.color }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </SectionCard>

      <FormActions isAr={isAr} onCancel={onCancel} onSave={handleSubmit} saving={saving} saveLabel={isAr ? "تأكيد التجديد" : "Confirm Renewal"} />
    </div>
  );
};

export default PermitRenewalForm;
