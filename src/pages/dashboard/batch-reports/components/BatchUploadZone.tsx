import { useState, useRef, useCallback } from "react";

interface Props { isAr: boolean; onProcessingComplete: (results: UploadResult[]) => void; }

export interface UploadResult {
  id: string;
  row: number;
  ref: string;
  type: string;
  person: string;
  status: "accepted" | "rejected" | "pending";
  errors: string[];
  date: string;
}

interface FileCard {
  id: string;
  name: string;
  size: string;
  progress: number;
  speed: string;
  done: boolean;
}

const ENTITY_TEMPLATES = [
  { value: "hotel",        label: "Hotel Events",        labelAr: "أحداث الفنادق",       icon: "ri-hotel-line" },
  { value: "car-rental",   label: "Car Rental",          labelAr: "تأجير السيارات",       icon: "ri-car-line" },
  { value: "mobile",       label: "Mobile Operators",    labelAr: "مشغلو الاتصالات",      icon: "ri-sim-card-line" },
  { value: "municipality", label: "Municipality",        labelAr: "البلديات",              icon: "ri-government-line" },
  { value: "financial",    label: "Financial Services",  labelAr: "الخدمات المالية",      icon: "ri-bank-card-line" },
  { value: "employment",   label: "Employment Registry", labelAr: "سجل التوظيف",          icon: "ri-briefcase-line" },
  { value: "utility",      label: "Utility Events",      labelAr: "أحداث المرافق",        icon: "ri-flashlight-line" },
];

const MOCK_RESULTS: UploadResult[] = [
  { id: "u1",  row: 1,  ref: "HTL-BATCH-001", type: "Check-In",    person: "Ahmed Al-Rashidi",    status: "accepted", errors: [],                                                                date: "2026-04-05" },
  { id: "u2",  row: 2,  ref: "HTL-BATCH-002", type: "Booking",     person: "Sarah Johnson",       status: "accepted", errors: [],                                                                date: "2026-04-05" },
  { id: "u3",  row: 3,  ref: "HTL-BATCH-003", type: "Check-Out",   person: "Mohammed Al-Balushi", status: "accepted", errors: [],                                                                date: "2026-04-05" },
  { id: "u4",  row: 4,  ref: "HTL-BATCH-004", type: "Room Change", person: "Fatima Al-Zadjali",   status: "rejected", errors: ["Missing document number", "Invalid room format"],               date: "2026-04-05" },
  { id: "u5",  row: 5,  ref: "HTL-BATCH-005", type: "Check-In",    person: "Khalid Al-Amri",      status: "accepted", errors: [],                                                                date: "2026-04-05" },
  { id: "u6",  row: 6,  ref: "HTL-BATCH-006", type: "Booking",     person: "James Wilson",        status: "pending",  errors: ["Duplicate reference detected"],                                  date: "2026-04-05" },
  { id: "u7",  row: 7,  ref: "HTL-BATCH-007", type: "Check-Out",   person: "Priya Nair",          status: "accepted", errors: [],                                                                date: "2026-04-05" },
  { id: "u8",  row: 8,  ref: "HTL-BATCH-008", type: "Check-In",    person: "Omar Al-Farsi",       status: "rejected", errors: ["Nationality code invalid (XX)", "Date format error: use YYYY-MM-DD"], date: "2026-04-05" },
  { id: "u9",  row: 9,  ref: "HTL-BATCH-009", type: "Room Change", person: "Layla Al-Hinai",      status: "accepted", errors: [],                                                                date: "2026-04-05" },
  { id: "u10", row: 10, ref: "HTL-BATCH-010", type: "Booking",     person: "Carlos Mendez",       status: "accepted", errors: [],                                                                date: "2026-04-05" },
  { id: "u11", row: 11, ref: "HTL-BATCH-011", type: "Check-In",    person: "Nadia Al-Rashidi",    status: "accepted", errors: [],                                                                date: "2026-04-05" },
  { id: "u12", row: 12, ref: "HTL-BATCH-012", type: "Check-Out",   person: "Hamad Al-Zadjali",    status: "rejected", errors: ["Person not found in registry", "Branch code mismatch"],          date: "2026-04-05" },
];

const BatchUploadZone = ({ isAr, onProcessingComplete }: Props) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<FileCard[]>([]);
  const [entityType, setEntityType] = useState("hotel");
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [done, setDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addMockFile = (name: string) => {
    const id = `f${Date.now()}`;
    const card: FileCard = { id, name, size: `${(Math.random() * 4 + 0.5).toFixed(1)} MB`, progress: 0, speed: "0 KB/s", done: false };
    setFiles((prev) => [...prev, card]);

    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.floor(Math.random() * 15) + 5;
      if (prog >= 100) {
        prog = 100;
        clearInterval(interval);
        setFiles((prev) => prev.map((f) => f.id === id ? { ...f, progress: 100, speed: "Done", done: true } : f));
      } else {
        setFiles((prev) => prev.map((f) => f.id === id ? { ...f, progress: prog, speed: `${Math.floor(Math.random() * 800 + 200)} KB/s` } : f));
      }
    }, 200);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    dropped.forEach((f) => addMockFile(f.name));
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    selected.forEach((f) => addMockFile(f.name));
  };

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));

  const handleProceed = () => {
    setProcessing(true);
    setProcessingStep(0);
    const steps = [0, 1, 2, 3];
    steps.forEach((step, i) => {
      setTimeout(() => {
        setProcessingStep(step);
        if (step === 3) {
          setTimeout(() => {
            setProcessing(false);
            setDone(true);
            onProcessingComplete(MOCK_RESULTS);
          }, 800);
        }
      }, i * 900);
    });
  };

  const PROCESSING_STEPS = [
    { en: "Validating file format...", ar: "التحقق من تنسيق الملف..." },
    { en: "Parsing records...", ar: "تحليل السجلات..." },
    { en: "Cross-referencing registry...", ar: "المقارنة مع السجل..." },
    { en: "Finalizing submission...", ar: "إتمام الإرسال..." },
  ];

  return (
    <div className="space-y-6">
      {/* Template download + entity selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-5"
        style={{ background: "rgba(10,37,64,0.8)", borderColor: "rgba(184,138,60,0.12)", backdropFilter: "blur(12px)" }}>
        <div>
          <h3 className="text-white font-bold text-sm mb-1">{isAr ? "قالب الرفع" : "Upload Template"}</h3>
          <p className="text-gray-500 text-xs">{isAr ? "اختر نوع الكيان لتنزيل القالب المناسب" : "Select entity type to download the matching template"}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select value={entityType} onChange={(e) => setEntityType(e.target.value)}
            className="px-3 py-2 rounded-lg border text-sm cursor-pointer outline-none"
            style={{ background: "rgba(5,20,40,0.8)", borderColor: "rgba(184,138,60,0.2)", color: "#D1D5DB", minWidth: "180px" }}>
            {ENTITY_TEMPLATES.map((t) => (
              <option key={t.value} value={t.value}>{isAr ? t.labelAr : t.label}</option>
            ))}
          </select>
          <button type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold cursor-pointer whitespace-nowrap transition-opacity hover:opacity-80"
            style={{ background: "transparent", border: "1px solid #D6B47E", color: "#D6B47E" }}>
            <i className="ri-download-2-line text-sm" />
            {isAr ? "تنزيل القالب" : "Download Template"}
          </button>
          <button type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold cursor-pointer whitespace-nowrap transition-opacity hover:opacity-80"
            style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#9CA3AF" }}>
            <i className="ri-file-excel-2-line text-sm" />
            {isAr ? "مثال CSV" : "Sample CSV"}
          </button>
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="relative rounded-2xl border-2 border-dashed p-12 flex flex-col items-center justify-center cursor-pointer transition-all"
        style={{
          borderColor: isDragging ? "#D6B47E" : "rgba(184,138,60,0.25)",
          background: isDragging ? "rgba(184,138,60,0.06)" : "rgba(10,37,64,0.6)",
          backdropFilter: "blur(12px)",
        }}>
        <input ref={fileInputRef} type="file" multiple accept=".csv,.xls,.xlsx" className="hidden" onChange={handleFileInput} />
        <div className="w-16 h-16 flex items-center justify-center rounded-2xl mb-4"
          style={{ background: isDragging ? "rgba(184,138,60,0.15)" : "rgba(184,138,60,0.08)", border: `1px solid ${isDragging ? "#D6B47E" : "rgba(184,138,60,0.2)"}` }}>
          <i className={`ri-upload-cloud-2-line text-3xl ${isDragging ? "text-gold-300" : "text-gold-400"}`} />
        </div>
        <p className="text-white font-bold text-lg mb-1">{isAr ? "أسقط الملفات هنا" : "Drop files here"}</p>
        <p className="text-gray-500 text-sm mb-3">{isAr ? "أو انقر للاختيار" : "or click to browse"}</p>
        <div className="flex items-center gap-3">
          {["CSV", "XLS", "XLSX"].map((fmt) => (
            <span key={fmt} className="px-2.5 py-1 rounded-full text-xs font-bold font-['JetBrains_Mono']"
              style={{ background: "rgba(184,138,60,0.08)", color: "#D6B47E", border: "1px solid rgba(184,138,60,0.2)" }}>
              {fmt}
            </span>
          ))}
          <span className="text-gray-600 text-xs">{isAr ? "الحد الأقصى 5 ميجابايت" : "max 5 MB"}</span>
        </div>
      </div>

      {/* File cards */}
      {files.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {files.map((file) => (
            <div key={file.id} className="rounded-2xl border p-4 flex items-start gap-4"
              style={{ background: "rgba(10,37,64,0.8)", borderColor: file.done ? "rgba(74,222,128,0.2)" : "rgba(184,138,60,0.12)", backdropFilter: "blur(12px)" }}>
              <div className="w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0"
                style={{ background: file.done ? "rgba(74,222,128,0.1)" : "rgba(184,138,60,0.1)", border: `1px solid ${file.done ? "rgba(74,222,128,0.3)" : "rgba(184,138,60,0.2)"}` }}>
                <i className={`${file.name.endsWith(".csv") ? "ri-file-text-line" : "ri-file-excel-2-line"} text-base`}
                  style={{ color: file.done ? "#4ADE80" : "#D6B47E" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white text-sm font-semibold truncate">{file.name}</span>
                  <button type="button" onClick={() => removeFile(file.id)}
                    className="w-5 h-5 flex items-center justify-center rounded-full cursor-pointer text-gray-600 hover:text-red-400 transition-colors flex-shrink-0 ml-2"
                    style={{ background: "rgba(255,255,255,0.05)" }}>
                    <i className="ri-close-line text-xs" />
                  </button>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500 text-xs">{file.size}</span>
                  <span className="text-xs font-['JetBrains_Mono']" style={{ color: file.done ? "#4ADE80" : "#D6B47E" }}>
                    {file.done ? (isAr ? "مكتمل" : "Done") : file.speed}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${file.progress}%`, background: file.done ? "#4ADE80" : "linear-gradient(90deg, #D6B47E, #38BDF8)" }} />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-gray-600 text-xs font-['JetBrains_Mono']">{file.progress}%</span>
                  {file.done && <i className="ri-checkbox-circle-fill text-green-400 text-sm" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action buttons */}
      {files.length > 0 && (
        <div className="flex items-center gap-3">
          <button type="button" onClick={handleProceed}
            disabled={!files.every((f) => f.done) || processing}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold cursor-pointer whitespace-nowrap transition-opacity disabled:opacity-40"
            style={{ background: "#D6B47E", color: "#051428" }}>
            <i className="ri-send-plane-line text-sm" />
            {isAr ? "المتابعة" : "Proceed"}
          </button>
          <button type="button" onClick={() => setFiles([])}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors"
            style={{ background: "transparent", borderColor: "rgba(255,255,255,0.15)", color: "#9CA3AF" }}>
            <i className="ri-close-line text-sm" />
            {isAr ? "إلغاء" : "Cancel"}
          </button>
          <span className="text-gray-600 text-xs font-['JetBrains_Mono']">
            {files.length} {isAr ? "ملف" : "file(s)"} · {files.filter((f) => f.done).length} {isAr ? "جاهز" : "ready"}
          </span>
        </div>
      )}

      {/* Processing modal */}
      {processing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(5,20,40,0.85)", backdropFilter: "blur(8px)" }}>
          <div className="rounded-2xl border p-8 w-full max-w-md mx-4 text-center"
            style={{ background: "rgba(10,37,64,0.95)", borderColor: "rgba(184,138,60,0.25)", backdropFilter: "blur(20px)" }}>
            {/* Spinner */}
            <div className="w-16 h-16 mx-auto mb-5 relative">
              <div className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
                style={{ borderTopColor: "#D6B47E", borderRightColor: "rgba(184,138,60,0.3)" }} />
              <div className="absolute inset-2 rounded-full flex items-center justify-center"
                style={{ background: "rgba(184,138,60,0.08)" }}>
                <i className="ri-upload-cloud-2-line text-gold-400 text-xl" />
              </div>
            </div>
            <h3 className="text-white font-bold text-lg mb-1">{isAr ? "جارٍ المعالجة..." : "Processing..."}</h3>
            <p className="text-gray-400 text-sm mb-5">
              {isAr ? PROCESSING_STEPS[processingStep].ar : PROCESSING_STEPS[processingStep].en}
            </p>
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-gold-400 font-bold font-['JetBrains_Mono'] text-2xl">{files.length}</span>
              <span className="text-gray-500 text-sm">{isAr ? "ملف قيد المعالجة" : "file(s) processing"}</span>
            </div>
            {/* Step indicators */}
            <div className="flex items-center justify-center gap-2">
              {PROCESSING_STEPS.map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full transition-all"
                  style={{ background: i <= processingStep ? "#D6B47E" : "rgba(255,255,255,0.1)" }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Success banner */}
      {done && (
        <div className="flex items-center gap-4 px-5 py-4 rounded-2xl border"
          style={{ background: "rgba(74,222,128,0.06)", borderColor: "rgba(74,222,128,0.2)" }}>
          <div className="w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0"
            style={{ background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.3)" }}>
            <i className="ri-checkbox-circle-line text-green-400 text-lg" />
          </div>
          <div className="flex-1">
            <p className="text-green-400 font-bold text-sm">{isAr ? "تمت المعالجة بنجاح" : "Processing Complete"}</p>
            <p className="text-gray-400 text-xs">
              {isAr ? "9 مقبول · 3 مرفوض · 0 معلق — راجع النتائج أدناه" : "9 accepted · 3 rejected · 0 pending — review results below"}
            </p>
          </div>
          <span className="text-green-400 text-xs font-bold font-['JetBrains_Mono']">AMN-BATCH-20260405-0047</span>
        </div>
      )}
    </div>
  );
};

export default BatchUploadZone;
