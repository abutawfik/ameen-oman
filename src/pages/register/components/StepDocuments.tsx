import { useState, useRef } from "react";

interface UploadedFile { name: string; size: number; type: string; }

interface Props {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  isAr: boolean;
}

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = ["application/pdf", "image/jpeg", "image/png"];

const StepDocuments = ({ files, onFilesChange, isAr }: Props) => {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const t = {
    title: isAr ? "رفع المستندات" : "Upload Documents",
    subtitle: isAr ? "ارفع المستندات الرسمية المطلوبة للتحقق من هوية جهتك" : "Upload required official documents for entity identity verification",
    dropTitle: isAr ? "اسحب وأفلت الملفات هنا" : "Drag & drop files here",
    dropOr: isAr ? "أو" : "or",
    browse: isAr ? "تصفح الملفات" : "Browse Files",
    allowed: isAr ? "PDF، JPG، PNG — الحد الأقصى 5 ميجابايت لكل ملف" : "PDF, JPG, PNG — Max 5MB per file",
    required: isAr ? "المستندات المطلوبة" : "Required Documents",
    docs: isAr
      ? [
          { label: "شهادة التسجيل التجاري", required: true },
          { label: "ترخيص مزاولة النشاط", required: true },
          { label: "هوية المفوض بالتوقيع", required: true },
          { label: "خطاب تفويض رسمي", required: true },
          { label: "شهادة الضريبة (إن وجدت)", required: false },
          { label: "عقد الشراكة (للشركات)", required: false },
        ]
      : [
          { label: "Commercial Registration Certificate", required: true },
          { label: "Business Activity License", required: true },
          { label: "Authorized Signatory ID", required: true },
          { label: "Official Authorization Letter", required: true },
          { label: "Tax Certificate (if applicable)", required: false },
          { label: "Partnership Agreement (companies)", required: false },
        ],
    uploaded: isAr ? "الملفات المرفوعة" : "Uploaded Files",
    remove: isAr ? "حذف" : "Remove",
    sizeErr: isAr ? "حجم الملف يتجاوز 5 ميجابايت" : "File size exceeds 5MB",
    typeErr: isAr ? "نوع الملف غير مدعوم. يُسمح بـ PDF وJPG وPNG فقط" : "File type not supported. Only PDF, JPG, PNG allowed",
    optional: isAr ? "اختياري" : "Optional",
    required_label: isAr ? "مطلوب" : "Required",
    secureNote: isAr ? "جميع الملفات مشفرة ومحمية — TLS 1.3" : "All files are encrypted and secured — TLS 1.3",
  };

  const handleFiles = (fileList: FileList) => {
    setError("");
    const newFiles: UploadedFile[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i];
      if (!ALLOWED.includes(f.type)) { setError(t.typeErr); continue; }
      if (f.size > MAX_SIZE) { setError(t.sizeErr); continue; }
      newFiles.push({ name: f.name, size: f.size, type: f.type });
    }
    onFilesChange([...files, ...newFiles]);
  };

  const removeFile = (idx: number) => {
    onFilesChange(files.filter((_, i) => i !== idx));
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getIcon = (type: string) => {
    if (type === "application/pdf") return "ri-file-pdf-line";
    if (type.startsWith("image/")) return "ri-image-line";
    return "ri-file-line";
  };

  const getIconColor = (type: string) => {
    if (type === "application/pdf") return "#C94A5E";
    if (type.startsWith("image/")) return "#D6B47E";
    return "#9CA3AF";
  };

  return (
    <div>
      <h3 className="text-white font-bold text-xl font-['Inter'] mb-1">{t.title}</h3>
      <p className="text-gray-500 text-sm font-['Inter'] mb-6">{t.subtitle}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Required docs checklist */}
        <div className="lg:col-span-1">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-3 font-['JetBrains_Mono']">
            {t.required}
          </p>
          <div className="space-y-2">
            {t.docs.map((doc, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg border"
                style={{ background: "rgba(10,37,64,0.6)", borderColor: "rgba(255,255,255,0.06)" }}
              >
                <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                  <i className="ri-file-text-line text-gold-400 text-sm" />
                </div>
                <span className="text-gray-300 text-xs font-['Inter'] flex-1">{doc.label}</span>
                <span
                  className="text-xs px-1.5 py-0.5 rounded font-['Inter'] flex-shrink-0"
                  style={{
                    background: doc.required ? "rgba(201,74,94,0.1)" : "rgba(156,163,175,0.1)",
                    color: doc.required ? "#C94A5E" : "#6B7280",
                  }}
                >
                  {doc.required ? t.required_label : t.optional}
                </span>
              </div>
            ))}
          </div>

          {/* Security note */}
          <div
            className="mt-4 flex items-center gap-2 p-3 rounded-lg border"
            style={{ background: "rgba(74,222,128,0.04)", borderColor: "rgba(74,222,128,0.15)" }}
          >
            <i className="ri-shield-check-line text-green-400 text-xs flex-shrink-0" />
            <p className="text-green-400/70 text-xs font-['JetBrains_Mono']">{t.secureNote}</p>
          </div>
        </div>

        {/* Upload zone */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Drop zone */}
          <div
            className="relative flex flex-col items-center justify-center p-10 rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer"
            style={{
              borderColor: dragging ? "rgba(184,138,60,0.8)" : "rgba(184,138,60,0.3)",
              background: dragging ? "rgba(184,138,60,0.06)" : "rgba(10,37,64,0.5)",
            }}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
            onClick={() => inputRef.current?.click()}
          >
            <div
              className="w-16 h-16 flex items-center justify-center rounded-full mb-4 transition-all duration-200"
              style={{
                background: dragging ? "rgba(184,138,60,0.15)" : "rgba(184,138,60,0.08)",
                border: `1px solid ${dragging ? "rgba(184,138,60,0.5)" : "rgba(184,138,60,0.2)"}`,
              }}
            >
              <i className="ri-upload-cloud-2-line text-gold-400 text-3xl" />
            </div>
            <p className="text-white font-semibold text-sm font-['Inter'] mb-1">{t.dropTitle}</p>
            <p className="text-gray-500 text-xs mb-3 font-['Inter']">{t.dropOr}</p>
            <span
              className="px-5 py-2 rounded-lg text-xs font-semibold font-['Inter'] cursor-pointer transition-colors"
              style={{ background: "rgba(184,138,60,0.12)", border: "1px solid rgba(184,138,60,0.3)", color: "#D6B47E" }}
            >
              {t.browse}
            </span>
            <p className="text-gray-600 text-xs mt-3 font-['JetBrains_Mono']">{t.allowed}</p>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => { if (e.target.files) handleFiles(e.target.files); }}
            />
          </div>

          {/* Error */}
          {error && (
            <div
              className="flex items-center gap-2 p-3 rounded-lg border"
              style={{ borderColor: "rgba(201,74,94,0.3)", background: "rgba(201,74,94,0.05)" }}
            >
              <i className="ri-error-warning-line text-red-400 text-sm" />
              <p className="text-red-400 text-xs font-['Inter']">{error}</p>
            </div>
          )}

          {/* Uploaded files */}
          {files.length > 0 && (
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2 font-['JetBrains_Mono']">
                {t.uploaded} ({files.length})
              </p>
              <div className="space-y-2">
                {files.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg border"
                    style={{ background: "rgba(10,37,64,0.7)", borderColor: "rgba(184,138,60,0.15)" }}
                  >
                    <div
                      className="w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0"
                      style={{ background: getIconColor(f.type) + "12" }}
                    >
                      <i className={`${getIcon(f.type)} text-sm`} style={{ color: getIconColor(f.type) }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-semibold font-['Inter'] truncate">{f.name}</p>
                      <p className="text-gray-600 text-xs font-['JetBrains_Mono']">{formatSize(f.size)}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <i className="ri-checkbox-circle-line text-green-400 text-sm" />
                      <button
                        onClick={() => removeFile(i)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer text-gray-600 hover:text-red-400"
                      >
                        <i className="ri-close-line text-sm" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepDocuments;
