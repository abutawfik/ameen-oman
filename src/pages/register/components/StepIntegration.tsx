import { useState } from "react";

interface Props {
  method: "portal" | "api" | "";
  onSelect: (m: "portal" | "api") => void;
  apiData: Record<string, string>;
  onApiChange: (k: string, v: string) => void;
  isAr: boolean;
  entityType: string;
}

const coreTypes = ["hotel", "car-rental", "mobile", "municipality"];

const StepIntegration = ({ method, onSelect, apiData, onApiChange, isAr, entityType }: Props) => {
  const [keyGenerated, setKeyGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const isCore = coreTypes.includes(entityType);

  const generateKey = () => {
    const seg = () => Math.random().toString(36).substring(2, 8).toUpperCase();
    const key = `AMN-${seg()}-${seg()}-${seg()}`;
    onApiChange("apiKey", key);
    setKeyGenerated(true);
  };

  const copyKey = () => {
    if (apiData.apiKey) {
      navigator.clipboard.writeText(apiData.apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const t = {
    title: isAr ? "طريقة التكامل" : "Integration Method",
    subtitle: isAr ? "اختر كيفية إرسال بيانات جهتك إلى الأمين" : "Choose how your entity will submit data to Al-Ameen",
    portalTitle: isAr ? "بوابة الأمين" : "Al-Ameen Portal",
    portalDesc: isAr
      ? "إدخال البيانات يدوياً عبر واجهة الويب. مثالي للجهات الأصغر أو كبديل عند عدم توفر تكامل API."
      : "Manual data entry via web interface. Ideal for smaller entities or as a fallback when API integration is unavailable.",
    portalFeatures: isAr
      ? ["واجهة ويب سهلة الاستخدام", "لا يتطلب تطوير تقني", "مناسب للجهات الصغيرة", "دعم رفع الملفات الدفعية"]
      : ["Easy-to-use web interface", "No technical development required", "Suitable for smaller entities", "Batch file upload support"],
    apiTitle: isAr ? "تكامل B2B API" : "B2B API Integration",
    apiDesc: isAr
      ? "تكامل مباشر بين الأنظمة. RESTful API مع مصادقة JWT وبث الأحداث في الوقت الفعلي."
      : "Direct machine-to-machine integration. RESTful API with JWT authentication and real-time event streaming.",
    apiFeatures: isAr
      ? ["إرسال تلقائي في الوقت الفعلي", "مصادقة JWT آمنة", "دعم Webhook للإقرار", "بيئة اختبار كاملة", "تشفير TLS 1.3"]
      : ["Automatic real-time submission", "Secure JWT authentication", "Webhook acknowledgment support", "Full sandbox environment", "TLS 1.3 encryption"],
    recommended: isAr ? "موصى به" : "Recommended",
    apiConfig: isAr ? "إعدادات API" : "API Configuration",
    apiKey: isAr ? "مفتاح API" : "API Key",
    generate: isAr ? "توليد مفتاح" : "Generate Key",
    regenerate: isAr ? "إعادة توليد" : "Regenerate",
    webhook: isAr ? "رابط Webhook (اختياري)" : "Webhook URL (optional)",
    webhookPh: "https://your-system.com/alameen-webhook",
    ipWhitelist: isAr ? "قائمة IP المسموح بها (اختياري)" : "IP Whitelist (optional)",
    ipPh: "192.168.1.1, 10.0.0.1",
    rateLimit: isAr ? "مستوى معدل الطلبات" : "Rate Limit Tier",
    sandboxUrl: isAr ? "رابط بيئة الاختبار" : "Sandbox Base URL",
    prodUrl: isAr ? "رابط الإنتاج" : "Production Base URL",
    hotelNote: isAr
      ? "ملاحظة: الفنادق التي تستخدم تطبيق الأمين للضيافة لا تحتاج إلى هذه البوابة — التطبيق يتزامن تلقائياً في الخلفية."
      : "Note: Hotels using Al-Ameen Hospitality app do NOT need this portal — the app syncs automatically in the background.",
    keyNote: isAr ? "احتفظ بهذا المفتاح في مكان آمن — لن يُعرض مرة أخرى" : "Keep this key secure — it will not be shown again",
  };

  return (
    <div>
      <h3 className="text-white font-bold text-xl font-['Inter'] mb-1">{t.title}</h3>
      <p className="text-gray-500 text-sm font-['Inter'] mb-6">{t.subtitle}</p>

      {/* Hotel hospitality note */}
      {entityType === "hotel" && (
        <div
          className="mb-5 flex items-start gap-3 p-4 rounded-xl border"
          style={{ borderColor: "rgba(250,204,21,0.3)", background: "rgba(250,204,21,0.04)" }}
        >
          <i className="ri-information-line text-yellow-400 text-sm mt-0.5 flex-shrink-0" />
          <p className="text-yellow-400/90 text-xs font-['Inter'] leading-relaxed">{t.hotelNote}</p>
        </div>
      )}

      {/* Method cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Portal Card */}
        <button
          onClick={() => onSelect("portal")}
          className="flex flex-col items-start p-5 rounded-xl border text-left transition-all duration-200 cursor-pointer"
          style={{
            background: method === "portal" ? "rgba(184,138,60,0.06)" : "rgba(10,37,64,0.7)",
            borderColor: method === "portal" ? "rgba(184,138,60,0.5)" : "rgba(255,255,255,0.08)",
            boxShadow: method === "portal" ? "0 0 24px rgba(184,138,60,0.08)" : "none",
          }}
        >
          <div className="flex items-center justify-between w-full mb-4">
            <div
              className="w-12 h-12 flex items-center justify-center rounded-xl"
              style={{ background: "rgba(184,138,60,0.1)", border: "1px solid rgba(184,138,60,0.25)" }}
            >
              <i className="ri-window-line text-gold-400 text-2xl" />
            </div>
            {method === "portal" && (
              <i className="ri-checkbox-circle-fill text-gold-400 text-xl" />
            )}
          </div>
          <p className="text-white font-bold text-base font-['Inter'] mb-2">{t.portalTitle}</p>
          <p className="text-gray-500 text-xs leading-relaxed font-['Inter'] mb-4">{t.portalDesc}</p>
          <div className="space-y-2 w-full">
            {t.portalFeatures.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <i className="ri-check-line text-gold-400 text-xs flex-shrink-0" />
                <span className="text-gray-400 text-xs font-['Inter']">{f}</span>
              </div>
            ))}
          </div>
        </button>

        {/* API Card */}
        <button
          onClick={() => onSelect("api")}
          className="flex flex-col items-start p-5 rounded-xl border text-left transition-all duration-200 cursor-pointer relative"
          style={{
            background: method === "api" ? "rgba(184,138,60,0.06)" : "rgba(10,37,64,0.7)",
            borderColor: method === "api" ? "rgba(184,138,60,0.5)" : "rgba(255,255,255,0.08)",
            boxShadow: method === "api" ? "0 0 24px rgba(184,138,60,0.08)" : "none",
          }}
        >
          {isCore && (
            <div
              className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-semibold font-['Inter']"
              style={{ background: "rgba(74,222,128,0.15)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.3)" }}
            >
              {t.recommended}
            </div>
          )}
          <div className="flex items-center justify-between w-full mb-4">
            <div
              className="w-12 h-12 flex items-center justify-center rounded-xl"
              style={{ background: "rgba(184,138,60,0.1)", border: "1px solid rgba(184,138,60,0.25)" }}
            >
              <i className="ri-code-s-slash-line text-gold-400 text-2xl" />
            </div>
            {method === "api" && (
              <i className="ri-checkbox-circle-fill text-gold-400 text-xl" />
            )}
          </div>
          <p className="text-white font-bold text-base font-['Inter'] mb-2">{t.apiTitle}</p>
          <p className="text-gray-500 text-xs leading-relaxed font-['Inter'] mb-4">{t.apiDesc}</p>
          <div className="space-y-2 w-full">
            {t.apiFeatures.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <i className="ri-check-line text-gold-400 text-xs flex-shrink-0" />
                <span className="text-gray-400 text-xs font-['Inter']">{f}</span>
              </div>
            ))}
          </div>
        </button>
      </div>

      {/* API Configuration Panel */}
      {method === "api" && (
        <div
          className="p-5 rounded-xl border space-y-5"
          style={{ background: "rgba(10,37,64,0.8)", borderColor: "rgba(184,138,60,0.15)" }}
        >
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest font-['JetBrains_Mono'] flex items-center gap-2">
            <i className="ri-settings-3-line text-gold-400" />
            {t.apiConfig}
          </p>

          {/* API Key */}
          <div>
            <label className="block text-gray-400 text-xs mb-1.5 font-['Inter']">{t.apiKey}</label>
            <div className="flex gap-2">
              <div
                className="flex-1 flex items-center px-3 py-2.5 rounded-lg font-['JetBrains_Mono'] text-xs overflow-hidden"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <span className="text-gold-400 flex-1 truncate">
                  {apiData.apiKey || (isAr ? "اضغط لتوليد مفتاح..." : "Click to generate key...")}
                </span>
              </div>
              <button
                onClick={copyKey}
                disabled={!apiData.apiKey}
                className="w-10 h-10 flex items-center justify-center rounded-lg border text-gray-400 hover:text-gold-400 transition-colors cursor-pointer disabled:opacity-40"
                style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}
              >
                {copied ? <i className="ri-check-line text-green-400" /> : <i className="ri-file-copy-line text-sm" />}
              </button>
              <button
                onClick={generateKey}
                className="px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors font-['Inter'] whitespace-nowrap"
                style={{ background: "rgba(184,138,60,0.12)", border: "1px solid rgba(184,138,60,0.3)", color: "#D6B47E" }}
              >
                {keyGenerated ? t.regenerate : t.generate}
              </button>
            </div>
            {keyGenerated && (
              <p className="text-yellow-400/70 text-xs mt-1.5 font-['Inter'] flex items-center gap-1">
                <i className="ri-alert-line text-xs" />
                {t.keyNote}
              </p>
            )}
          </div>

          {/* Endpoints info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-400 text-xs mb-1.5 font-['Inter']">{t.sandboxUrl}</label>
              <div
                className="px-3 py-2.5 rounded-lg font-['JetBrains_Mono'] text-xs text-gray-500"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                https://sandbox.alameen.gov/api/v1
              </div>
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1.5 font-['Inter']">{t.prodUrl}</label>
              <div
                className="px-3 py-2.5 rounded-lg font-['JetBrains_Mono'] text-xs text-gray-500"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                https://api.alameen.gov/v1
              </div>
            </div>
          </div>

          {/* Webhook */}
          <div>
            <label className="block text-gray-400 text-xs mb-1.5 font-['Inter']">{t.webhook}</label>
            <input
              value={apiData.webhook || ""}
              onChange={(e) => onApiChange("webhook", e.target.value)}
              placeholder={t.webhookPh}
              className="w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-gray-600 outline-none font-['Inter']"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(184,138,60,0.5)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
            />
          </div>

          {/* IP Whitelist */}
          <div>
            <label className="block text-gray-400 text-xs mb-1.5 font-['Inter']">{t.ipWhitelist}</label>
            <input
              value={apiData.ipWhitelist || ""}
              onChange={(e) => onApiChange("ipWhitelist", e.target.value)}
              placeholder={t.ipPh}
              className="w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-gray-600 outline-none font-['Inter']"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(184,138,60,0.5)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
            />
          </div>

          {/* Rate Limit Tier */}
          <div>
            <label className="block text-gray-400 text-xs mb-2 font-['Inter']">{t.rateLimit}</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { tier: "Standard", desc: "1,000 req/hr", color: "#4ADE80", note: isAr ? "للجهات الصغيرة" : "Small entities" },
                { tier: "Enhanced", desc: "10,000 req/hr", color: "#FACC15", note: isAr ? "للجهات المتوسطة" : "Medium entities" },
                { tier: "Enterprise", desc: isAr ? "غير محدود" : "Unlimited", color: "#D6B47E", note: isAr ? "للجهات الكبيرة" : "Large entities" },
              ].map((r) => (
                <button
                  key={r.tier}
                  onClick={() => onApiChange("rateTier", r.tier)}
                  className="flex flex-col items-center p-3 rounded-xl border transition-all cursor-pointer"
                  style={{
                    background: apiData.rateTier === r.tier ? r.color + "12" : "rgba(255,255,255,0.03)",
                    borderColor: apiData.rateTier === r.tier ? r.color + "60" : "rgba(255,255,255,0.08)",
                  }}
                >
                  <span className="text-xs font-bold font-['Inter'] mb-0.5" style={{ color: r.color }}>{r.tier}</span>
                  <span className="text-gray-500 text-xs font-['JetBrains_Mono']">{r.desc}</span>
                  <span className="text-gray-600 text-xs font-['Inter'] mt-0.5">{r.note}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Portal info panel */}
      {method === "portal" && (
        <div
          className="p-5 rounded-xl border"
          style={{ background: "rgba(10,37,64,0.8)", borderColor: "rgba(184,138,60,0.12)" }}
        >
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-3 font-['JetBrains_Mono'] flex items-center gap-2">
            <i className="ri-information-line text-gold-400" />
            {isAr ? "معلومات البوابة" : "Portal Information"}
          </p>
          <div className="space-y-2">
            {[
              { icon: "ri-link", label: isAr ? "رابط البوابة" : "Portal URL", value: "https://portal.alameen.gov" },
              { icon: "ri-user-line", label: isAr ? "بيانات الدخول" : "Login Credentials", value: isAr ? "ستُرسل بعد الموافقة" : "Will be sent after approval" },
              { icon: "ri-time-line", label: isAr ? "وقت المعالجة" : "Processing Time", value: isAr ? "3-5 أيام عمل" : "3-5 business days" },
              { icon: "ri-customer-service-2-line", label: isAr ? "الدعم التقني" : "Technical Support", value: "support@alameen.gov" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 py-1.5">
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                  <i className={`${item.icon} text-gold-400 text-xs`} />
                </div>
                <span className="text-gray-500 text-xs font-['Inter'] w-32 flex-shrink-0">{item.label}</span>
                <span className="text-gray-300 text-xs font-['JetBrains_Mono']">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StepIntegration;
