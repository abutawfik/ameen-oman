import { useState } from "react";
import { SectionCard, FormField, TextInput, SelectInput, FormActions, LookupButton } from "@/pages/dashboard/hotel-events/components/FormComponents";
import EduConfirmation from "./components/EduConfirmation";

interface Props { isAr: boolean; onCancel: () => void; }

const MOCK_STUDENTS: Record<string, { name: string; nameAr: string; program: string; institution: string; gpa: string }> = {
  "STU-2024-1001": { name: "Ahmed Al-Rashidi", nameAr: "أحمد الراشدي", program: "BSc Computer Science", institution: "National University", gpa: "3.7" },
  "STU-2024-2234": { name: "Priya Nair", nameAr: "بريا ناير", program: "MBA", institution: "National Business School", gpa: "3.9" },
  "STU-2025-0088": { name: "Mohammed Al-Balushi", nameAr: "محمد البلوشي", program: "BSc Engineering", institution: "National Technical College", gpa: "3.2" },
};

const SEMESTERS = [
  { value: "fall_2025", label: "Fall 2025" }, { value: "spring_2026", label: "Spring 2026" },
  { value: "summer_2026", label: "Summer 2026" }, { value: "fall_2026", label: "Fall 2026" },
];

const COURSES = [
  { value: "cs101", label: "CS101 — Introduction to Programming (3 cr)" },
  { value: "cs201", label: "CS201 — Data Structures (3 cr)" },
  { value: "cs301", label: "CS301 — Algorithms (3 cr)" },
  { value: "math101", label: "MATH101 — Calculus I (4 cr)" },
  { value: "eng101", label: "ENG101 — Technical Writing (2 cr)" },
  { value: "bus201", label: "BUS201 — Business Strategy (3 cr)" },
  { value: "mba501", label: "MBA501 — Corporate Finance (3 cr)" },
  { value: "law301", label: "LAW301 — Commercial Law (3 cr)" },
];

const genRef = () => `AMN-EDU-${Math.floor(Math.random() * 9000) + 1000}`;

const CourseRegistrationForm = ({ isAr, onCancel }: Props) => {
  const [studentId, setStudentId] = useState("");
  const [studentData, setStudentData] = useState<typeof MOCK_STUDENTS[string] | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [semester, setSemester] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
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

  const toggleCourse = (val: string) => {
    setSelectedCourses(prev => prev.includes(val) ? prev.filter(c => c !== val) : [...prev, val]);
  };

  const totalCredits = selectedCourses.reduce((sum, c) => {
    const match = COURSES.find(co => co.value === c)?.label.match(/\((\d+) cr\)/);
    return sum + (match ? parseInt(match[1]) : 0);
  }, 0);

  const handleSave = () => { setSaving(true); setTimeout(() => { setSaving(false); setRefCode(genRef()); setConfirmed(true); }, 1500); };

  if (confirmed) return <EduConfirmation refNumber={refCode} eventType={isAr ? "تسجيل مقررات" : "Course Registration"} eventCode="AMN-EDU-CRS" color="#D4A84B" isAr={isAr} onReset={() => setConfirmed(false)} />;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Student Lookup */}
        <SectionCard title={isAr ? "بحث عن الطالب" : "Student Lookup"} icon="ri-user-search-line" accentColor="#D4A84B">
          <div className="space-y-4">
            <FormField label={isAr ? "رقم الطالب" : "Student ID"} required>
              <div className="flex gap-2">
                <TextInput placeholder="STU-XXXX-XXXX" value={studentId} onChange={(e) => setStudentId(e.target.value)} className="font-['JetBrains_Mono'] flex-1" />
                <LookupButton onClick={handleLookup} loading={lookupLoading} isAr={isAr} />
              </div>
              <p className="text-gray-600 text-xs mt-1">{isAr ? "جرّب: STU-2024-1001 أو STU-2024-2234" : "Try: STU-2024-1001 or STU-2024-2234"}</p>
            </FormField>
            {lookupError && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}>
                <i className="ri-close-circle-line text-red-400 text-sm" />
                <span className="text-red-400 text-xs">{lookupError}</span>
              </div>
            )}
            {studentData && (
              <div className="space-y-2 px-4 py-4 rounded-xl" style={{ background: "rgba(181,142,60,0.04)", border: "1px solid rgba(181,142,60,0.15)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <i className="ri-checkbox-circle-line text-gold-400 text-sm" />
                  <span className="text-gold-400 text-xs font-bold">{isAr ? "تم العثور على الطالب" : "Student Found"}</span>
                </div>
                {[
                  { label: isAr ? "الاسم" : "Name", value: isAr ? studentData.nameAr : studentData.name },
                  { label: isAr ? "البرنامج" : "Program", value: studentData.program },
                  { label: isAr ? "المؤسسة" : "Institution", value: studentData.institution },
                  { label: "GPA", value: studentData.gpa },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs">{row.label}</span>
                    <span className="text-white text-xs font-semibold font-['JetBrains_Mono']">{row.value}</span>
                  </div>
                ))}
              </div>
            )}
            <FormField label={isAr ? "الفصل الدراسي" : "Semester"} required>
              <SelectInput options={SEMESTERS} placeholder={isAr ? "اختر الفصل" : "Select semester"} value={semester} onChange={(e) => setSemester(e.target.value)} />
            </FormField>
          </div>
        </SectionCard>

        {/* Course Selection */}
        <SectionCard title={isAr ? "اختيار المقررات" : "Course Selection"} icon="ri-book-open-line">
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-xs">{isAr ? "اختر المقررات" : "Select courses"}</span>
              <span className="text-gold-400 text-xs font-bold font-['JetBrains_Mono']">{totalCredits} {isAr ? "ساعة معتمدة" : "credits"}</span>
            </div>
            {COURSES.map(course => {
              const isSelected = selectedCourses.includes(course.value);
              return (
                <button key={course.value} type="button" onClick={() => toggleCourse(course.value)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left cursor-pointer transition-all"
                  style={{ background: isSelected ? "rgba(181,142,60,0.08)" : "rgba(255,255,255,0.03)", border: `1px solid ${isSelected ? "rgba(181,142,60,0.3)" : "rgba(255,255,255,0.06)"}` }}>
                  <div className="w-5 h-5 flex items-center justify-center rounded flex-shrink-0" style={{ background: isSelected ? "#D4A84B" : "rgba(255,255,255,0.06)", border: `1px solid ${isSelected ? "#D4A84B" : "rgba(255,255,255,0.1)"}` }}>
                    {isSelected && <i className="ri-check-line text-xs text-gray-900" />}
                  </div>
                  <span className="text-xs font-['JetBrains_Mono']" style={{ color: isSelected ? "#D4A84B" : "#9CA3AF" }}>{course.label}</span>
                </button>
              );
            })}
            {totalCredits > 18 && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.2)" }}>
                <i className="ri-alarm-warning-line text-orange-400 text-xs" />
                <span className="text-orange-400 text-xs">{isAr ? "تجاوزت الحد الأقصى (18 ساعة)" : "Exceeds max credit load (18 credits)"}</span>
              </div>
            )}
          </div>
        </SectionCard>
      </div>
      <FormActions onCancel={onCancel} onSave={handleSave} saveLabel={isAr ? "تسجيل المقررات" : "Register Courses"} isAr={isAr} saving={saving} />
    </div>
  );
};

export default CourseRegistrationForm;
