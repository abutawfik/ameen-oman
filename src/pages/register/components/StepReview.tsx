import { entityTypes } from "./StepEntityType";

interface Props {
  entityType: string;
  details: Record<string, string>;
  method: string;
  apiData: Record<string, string>;
  filesCount: number;
  isAr: boolean;
  onSubmit: () => void;
  submitting: boolean;
  refNumber: string;
}

interface RowProps { label: string; value: string; mono?: boolean; }
const Row = ({ label, value, mono }: RowProps) =>
  value ? (
    <div className="flex items-start justify-between py-2 border-b border-white/5 last:border-0">
      <span className="text-gray-500 text-xs font-['Inter'] flex-shrink-0 mr-4 min-w-[120px]">{label}</span>
      <span className={`text-gray-200 text-xs text-right ${mono ? "font-['JetBrains_Mono']" : "font-['Inter']"}`}>{value}</span>
    </div>
  ) : null;

const SectionCard = ({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) => (
  <div
    className="p-4 rounded-xl border"
    style={{ background: "rgba(20,29,46,0.7)", borderColor: "rgba(181,142,60,0.12)" }}
  >
    <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-3 font-['JetBrains_Mono'] flex items-center gap-2">
      <i className={`${icon} text-gold-400`} />
      {title}
    </p>
    {children}
  </div>
);

const StepReview = ({ entityType, details, method, apiData, filesCount, isAr, onSubmit, submitting, refNumber }: Props) => {
  const et = entityTypes.find((e) => e.id === entityType);

  const t = {
    title: isAr ? "مراجعة وإرسال" : "Review & Submit",
    subtitle: isAr ? "راجع معلوماتك بعناية قبل الإرسال" : "Carefully review your information before submitting",
    entitySection: isAr ? "نوع الجهة" : "Entity Type",
    detailsSection: isAr ? "تفاصيل الجهة" : "Entity Details",
    integSection: isAr ? "طريقة التكامل" : "Integration Method",
    docsSection: isAr ? "المستندات" : "Documents",
    submit: isAr ? "إرسال طلب التسجيل" : "Submit Registration Request",
    submitting: isAr ? "جارٍ الإرسال..." : "Submitting...",
    disclaimer: isAr
      ? "بالإرسال، أقر بأن جميع المعلومات المقدمة صحيحة ودقيقة، وأن جهتي مخولة بتقديم البيانات إلى منصة الامين وفقاً للأنظمة والتشريعات المعمول بها."
      : "By submitting, I confirm that all provided information is accurate and complete, and that my entity is authorized to submit data to the Al-Ameen platform in accordance with applicable laws and regulations.",
    filesUploaded: isAr ? "ملف/ملفات مرفوعة" : "file(s) uploaded",
    noFiles: isAr ? "لم يتم رفع ملفات" : "No files uploaded",
    portal: isAr ? "بوابة الامين (يدوي)" : "Al-Ameen Portal (Manual)",
    api: isAr ? "B2B API (تلقائي)" : "B2B API (Automated)",
    nameEn: isAr ? "الاسم (إنجليزي)" : "Name (EN)",
    nameAr: isAr ? "الاسم (عربي)" : "Name (AR)",
    commReg: isAr ? "السجل التجاري" : "Commercial Reg.",
    license: isAr ? "الترخيص" : "License",
    gov: isAr ? "المحافظة" : "Governorate",
    address: isAr ? "العنوان" : "Address",
    contact: isAr ? "جهة الاتصال" : "Contact",
    email: isAr ? "البريد الإلكتروني" : "Email",
    phone: isAr ? "الهاتف" : "Phone",
    rateTier: isAr ? "مستوى معدل الطلبات" : "Rate Tier",
    successTitle: isAr ? "تم إرسال الطلب بنجاح!" : "Registration Submitted!",
    successDesc: isAr
      ? "تم استلام طلب تسجيل جهتك. سيقوم فريق الامين بمراجعة طلبك والتواصل معك خلال 3-5 أيام عمل."
      : "Your entity registration request has been received. The Al-Ameen team will review your application and contact you within 3-5 business days.",
    refLabel: isAr ? "رقم المرجع" : "Reference Number",
    keepRef: isAr ? "احتفظ بهذا الرقم للمتابعة" : "Keep this number for follow-up",
    goLogin: isAr ? "الذهاب إلى تسجيل الدخول" : "Go to Login",
    nextSteps: isAr ? "الخطوات التالية" : "Next Steps",
    steps: isAr
      ? ["سيتم مراجعة طلبك من قبل فريق الامين", "ستتلقى بريداً إلكترونياً بالموافقة أو طلب معلومات إضافية", "عند الموافقة، ستتلقى بيانات الدخول وتعليمات التكامل"]
      : ["Your application will be reviewed by the Al-Ameen team", "You will receive an email with approval or request for additional information", "Upon approval, you will receive login credentials and integration instructions"],
  };

  if (refNumber) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        {/* Success animation */}
        <div className="relative mb-6">
          <div
            className="w-24 h-24 flex items-center justify-center rounded-full"
            style={{ background: "rgba(181,142,60,0.08)", border: "2px solid rgba(181,142,60,0.4)" }}
          >
            <i className="ri-checkbox-circle-line text-gold-400 text-5xl" />
          </div>
          <div
            className="absolute -inset-2 rounded-full opacity-20 animate-ping"
            style={{ border: "1px solid rgba(181,142,60,0.6)" }}
          />
        </div>

        <h3 className="text-white font-bold text-2xl font-['Inter'] mb-2">{t.successTitle}</h3>
        <p className="text-gray-400 text-sm font-['Inter'] mb-8 max-w-md leading-relaxed">{t.successDesc}</p>

        {/* Reference number */}
        <div
          className="px-8 py-5 rounded-2xl border mb-6"
          style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.3)" }}
        >
          <p className="text-gray-500 text-xs font-['Inter'] mb-2">{t.refLabel}</p>
          <p
            className="font-black text-3xl font-['JetBrains_Mono'] tracking-widest"
            style={{ color: "#D4A84B", textShadow: "0 0 20px rgba(181,142,60,0.4)" }}
          >
            {refNumber}
          </p>
        </div>

        <p className="text-gray-600 text-xs font-['Inter'] mb-8">{t.keepRef}</p>

        {/* Next steps */}
        <div
          className="w-full max-w-md p-5 rounded-xl border mb-6 text-left"
          style={{ background: "rgba(20,29,46,0.7)", borderColor: "rgba(255,255,255,0.08)" }}
        >
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-3 font-['JetBrains_Mono']">{t.nextSteps}</p>
          <div className="space-y-3">
            {t.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0 text-xs font-bold font-['JetBrains_Mono']"
                  style={{ background: "rgba(181,142,60,0.12)", border: "1px solid rgba(181,142,60,0.3)", color: "#D4A84B" }}
                >
                  {i + 1}
                </div>
                <p className="text-gray-400 text-xs font-['Inter'] leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <a
          href="/login"
          className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm font-['Inter'] cursor-pointer hover:opacity-90 transition-all"
          style={{ background: "#D4A84B", color: "#0B1220" }}
        >
          <i className="ri-login-box-line" />
          {t.goLogin}
        </a>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-white font-bold text-xl font-['Inter'] mb-1">{t.title}</h3>
      <p className="text-gray-500 text-sm font-['Inter'] mb-6">{t.subtitle}</p>

      <div className="space-y-4 mb-6">
        {/* Entity Type */}
        <SectionCard title={t.entitySection} icon="ri-building-2-line">
          {et && (
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0"
                style={{ background: et.categoryColor + "15", border: `1px solid ${et.categoryColor}30` }}
              >
                <i className={`${et.icon} text-lg`} style={{ color: et.categoryColor }} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className="text-xs px-1.5 py-0.5 rounded font-['JetBrains_Mono']"
                    style={{ color: "#6B7280", background: "rgba(255,255,255,0.04)" }}
                  >
                    {et.streamNum}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-['Inter']"
                    style={{ background: et.badgeColor + "18", color: et.badgeColor }}
                  >
                    {et.badge === "core" ? (isAr ? "أساسي" : "Core") : (isAr ? "موسع" : "Extended")}
                  </span>
                </div>
                <p className="text-white font-bold text-sm font-['Inter']">{isAr ? et.titleAr : et.title}</p>
                <p className="text-gray-500 text-xs font-['Inter']">{isAr ? et.categoryAr : et.category}</p>
              </div>
            </div>
          )}
        </SectionCard>

        {/* Entity Details */}
        <SectionCard title={t.detailsSection} icon="ri-file-list-3-line">
          <Row label={t.nameEn} value={details.nameEn} />
          <Row label={t.nameAr} value={details.nameAr} />
          <Row label={t.commReg} value={details.commReg} mono />
          <Row label={t.license} value={details.license} mono />
          <Row label={t.gov} value={details.governorate} />
          <Row label={t.address} value={details.address} />
          <Row label={t.contact} value={details.contactName} />
          <Row label={t.email} value={details.contactEmail} mono />
          <Row label={t.phone} value={details.contactPhone} mono />
        </SectionCard>

        {/* Integration */}
        <SectionCard title={t.integSection} icon="ri-code-s-slash-line">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 flex items-center justify-center rounded-lg"
              style={{ background: "rgba(181,142,60,0.1)", border: "1px solid rgba(181,142,60,0.2)" }}
            >
              <i className={method === "api" ? "ri-code-s-slash-line text-gold-400" : "ri-window-line text-gold-400"} />
            </div>
            <div>
              <p className="text-white text-sm font-['Inter'] font-semibold">{method === "api" ? t.api : t.portal}</p>
              {method === "api" && apiData.rateTier && (
                <p className="text-gray-500 text-xs font-['Inter']">{t.rateTier}: {apiData.rateTier}</p>
              )}
            </div>
          </div>
        </SectionCard>

        {/* Documents */}
        <SectionCard title={t.docsSection} icon="ri-folder-line">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 flex items-center justify-center rounded-lg"
              style={{ background: filesCount > 0 ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)", border: `1px solid ${filesCount > 0 ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.2)"}` }}
            >
              <i className={`${filesCount > 0 ? "ri-file-check-line text-green-400" : "ri-file-warning-line text-red-400"}`} />
            </div>
            <p className="text-white text-sm font-['Inter']">
              {filesCount > 0 ? `${filesCount} ${t.filesUploaded}` : t.noFiles}
            </p>
          </div>
        </SectionCard>
      </div>

      {/* Disclaimer */}
      <div
        className="p-4 rounded-xl border mb-6"
        style={{ background: "rgba(251,146,60,0.04)", borderColor: "rgba(251,146,60,0.2)" }}
      >
        <div className="flex items-start gap-3">
          <i className="ri-shield-check-line text-orange-400 text-sm mt-0.5 flex-shrink-0" />
          <p className="text-gray-400 text-xs leading-relaxed font-['Inter']">{t.disclaimer}</p>
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={onSubmit}
        disabled={submitting}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold hover:opacity-90 transition-all duration-200 cursor-pointer text-sm font-['Inter'] disabled:opacity-60"
        style={{ background: "#D4A84B", color: "#0B1220" }}
      >
        {submitting ? (
          <>
            <i className="ri-loader-4-line animate-spin" />
            {t.submitting}
          </>
        ) : (
          <>
            <i className="ri-send-plane-line" />
            {t.submit}
          </>
        )}
      </button>
    </div>
  );
};

export default StepReview;
