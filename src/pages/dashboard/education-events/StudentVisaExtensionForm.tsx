import { useState } from "react";
import { SectionCard, FormField, TextInput, SelectInput, FormActions, LookupButton } from "@/pages/dashboard/hotel-events/components/FormComponents";
import EduConfirmation from "./components/EduConfirmation";

interface Props { isAr: boolean; onCancel: () => void; }

const MOCK_STUDENTS: Record<string, { name: string; nameAr: string; institution: string; program: string; attendance: number; standing: string; visaExpiry: string }> = {
  "STU-2024-1001": { name: "Ahmed Al-Rashidi", nameAr: "أحمد الراشدي", institution: "National University", program: "BSc Computer Science", attendance: 88, standing: "Good", visaExpiry: "2025-08-15" },
  "STU-2024-2234": { name: "Priya Nair", nameAr: "بريا ناير", institution: "National Business School", program: "MBA", attendance: 95, standing: "Excellent", visaExpiry: "2025-06-30" },
  "STU-2025-0088": { name: "Mohammed Al-Balushi", nameAr: "محمد البلوشي", institution: "National Technical College", program: "BSc Engineering", attendance: 62, standing: "Warning", visaExpiry: "2025-05-01" },
};

const EXTENSION_DURATIONS = [
  { value: "6m", label: "6 Months" }, { value: "1y", label: "1 Year" }, { value: "2y", label: "2 Years" },
];

const EXTENSION_REASONS = [
  { value: "program_completion", label: "Program Completion" }, { value: "thesis", label: "Thesis / Research Extension" },
  { value: "medical", label: "Medical Leave" }, { value: "academic_delay", label: "Academic Delay" },
];

const genRef = () => `AMN-EDU-${Math.floor(Math.random() * 9000) + 1000}`;

const StudentVisaExtensionForm = ({ isAr, onCancel }: Props) => {
  const [studentId, setStudentId] = useState("");
  const [studentData, setStudentData] = useState<typeof MOCK_STUDENTS[string] | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [extensionDuration, setExtensionDuration] = useState("");
  const [extensionReason, setExtensionReason] = useState("");
  const [newVisaExpiry, setNewVisaExpiry] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [refCode, setRefCode] = useState("");

  const handleLookup = () => {
    setLookupLoading(true); setLookupError(""); setStudentData(null);
    setTimeout(() => {
      setLookupLoading(false);
      const found = MOCK_STUDENTS[studentId.trim()];
      if (found) setStudentData(found);
      else setLookupError(isAr ? "لم يُعثر على الطالب" : "Student not found");
    }, 1100);
  };

  const standingColor = (s: string) => s === "Excellent" ? "#4ADE80" : s === "Good" ? "#22D3EE" : "#FB923C";
  const attendanceColor = (a: number) => a >= 80 ? "#4ADE80" : a >= 70 ? "#FACC15" : "#F87171";
  const isEligible = studentData && studentData.attendance >= 70 && studentData.standing !== "Suspended";

  const handleSave = () => { setSaving(true); setTimeout(() => { setSaving(false); setRefCode(genRef()); setConfirmed(true); }, 1500); };

  if (confirmed) return <EduConfirmation refNumber={refCode} eventType={isAr ? "تمديد تأشيرة طالب" : "Student Visa Extension"} eventCode="AMN-EDU-VISA" color="#4ADE80" isAr={isAr} onReset={() => setConfirmed(false)} />;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <SectionCard title={isAr ? "بحث عن الطالب" : "Student Lookup"} icon="ri-user-search-line" accentColor="#4ADE80">
          <div className="space-y-4">
            <FormField label={isAr ? "رقم الطالب" : "Student ID"} required>
              <div className="flex gap-2">
                <TextInput placeholder="STU-XXXX-XXXX" value={studentId} onChange={(e) => setStudentId(e.target.value)} className="font-['JetBrains_Mono'] flex-1" />
                <LookupButton onClick={handleLookup} loading={lookupLoading} isAr={isAr} />
              </div>
              <p className="text-gray-600 text-xs mt-1">{isAr ? "جرّب: STU-2024-1001 أو STU-2025-0088" : "Try: STU-2024-1001 or STU-2025-0088"}</p>
            </FormField>
            {lookupError && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}>
                <i className="ri-close-circle-line text-red-400 text-sm" /><span className="text-red-400 text-xs">{lookupError}</span>
              </div>
            )}
            {studentData && (
              <div className="space-y-3 px-4 py-4 rounded-xl" style={{ background: "rgba(74,222,128,0.04)", border: "1px solid rgba(74,222,128,0.15)" }}>
                <div className="flex items-center gap-2 mb-1">
                  <i className="ri-checkbox-circle-line text-green-400 text-sm" />
                  <span className="text-green-400 text-xs font-bold">{isAr ? "تم العثور على الطالب" : "Student Found"}</span>
                </div>
                {[
                  { label: isAr ? "الاسم" : "Name", value: isAr ? studentData.nameAr : studentData.name, color: "#FFFFFF" },
                  { label: isAr ? "المؤسسة" : "Institution", value: studentData.institution, color: "#D1D5DB" },
                  { label: isAr ? "البرنامج" : "Program", value: studentData.program, color: "#D1D5DB" },
                  { label: isAr ? "انتهاء التأشيرة الحالية" : "Current Visa Expiry", value: studentData.visaExpiry, color: "#FACC15" },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs">{row.label}</span>
                    <span className="text-xs font-semibold font-['JetBrains_Mono']" style={{ color: row.color }}>{row.value}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-1 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <span className="text-gray-500 text-xs">{isAr ? "نسبة الحضور" : "Attendance"}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                      <div className="h-full rounded-full" style={{ width: `${studentData.attendance}%`, background: attendanceColor(studentData.attendance) }} />
                    </div>
                    <span className="text-xs font-bold font-['JetBrains_Mono']" style={{ color: attendanceColor(studentData.attendance) }}>{studentData.attendance}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-xs">{isAr ? "الوضع الأكاديمي" : "Academic Standing"}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: `${standingColor(studentData.standing)}15`, color: standingColor(studentData.standing) }}>{studentData.standing}</span>
                </div>
                {!isEligible && (
                  <div className="flex items-start gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}>
                    <i className="ri-alarm-warning-line text-red-400 text-xs mt-0.5 flex-shrink-0" />
                    <p className="text-red-400 text-xs">{isAr ? "الطالب غير مؤهل للتمديد — نسبة الحضور أقل من 70%" : "Student not eligible — attendance below 70%"}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </SectionCard>

        <SectionCard title={isAr ? "تفاصيل التمديد" : "Extension Details"} icon="ri-passport-line">
          <div className="space-y-4">
            <FormField label={isAr ? "مدة التمديد" : "Extension Duration"} required>
              <SelectInput options={EXTENSION_DURATIONS} placeholder={isAr ? "اختر المدة" : "Select duration"} value={extensionDuration} onChange={(e) => setExtensionDuration(e.target.value)} />
            </FormField>
            <FormField label={isAr ? "سبب التمديد" : "Extension Reason"} required>
              <SelectInput options={EXTENSION_REASONS} placeholder={isAr ? "اختر السبب" : "Select reason"} value={extensionReason} onChange={(e) => setExtensionReason(e.target.value)} />
            </FormField>
            <FormField label={isAr ? "تاريخ انتهاء التأشيرة الجديدة" : "New Visa Expiry Date"} required>
              <TextInput type="date" value={newVisaExpiry} onChange={(e) => setNewVisaExpiry(e.target.value)} />
            </FormField>
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl border" style={{ background: "rgba(34,211,238,0.04)", borderColor: "rgba(34,211,238,0.15)" }}>
              <i className="ri-information-line text-cyan-400 text-sm mt-0.5 flex-shrink-0" />
              <p className="text-gray-400 text-xs">{isAr ? "AMEEN يتحقق تلقائياً من نسبة الحضور والوضع الأكاديمي قبل الموافقة على التمديد." : "AMEEN auto-verifies attendance % and academic standing before approving the extension."}</p>
            </div>
          </div>
        </SectionCard>
      </div>
      <FormActions onCancel={onCancel} onSave={handleSave} saveLabel={isAr ? "تقديم طلب التمديد" : "Submit Visa Extension"} isAr={isAr} saving={saving} disabled={studentData !== null && !isEligible} />
    </div>
  );
};

export default StudentVisaExtensionForm;
