import { useState, useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import i18n from "@/i18n";

const LoginPage = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState(i18n.language || "en");
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ entityId: "", username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isAr = lang === "ar";

  // Scroll to top immediately on mount (before paint) to prevent blank flash
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.dir = isAr ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [isAr, lang]);

  useEffect(() => {
    document.documentElement.dir = isAr ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang, isAr]);

  const toggleLang = () => {
    const next = isAr ? "en" : "ar";
    setLang(next);
    i18n.changeLanguage(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.entityId || !form.username || !form.password) {
      setError(isAr ? "يرجى ملء جميع الحقول" : "Please fill in all fields");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard?type=hotel");
    }, 1600);
  };

  const t = {
    authority: isAr ? "الشرطة الوطنية" : "NATIONAL POLICE",
    authorityFull: isAr ? "نظام مراقبة الحدود" : "BORDER CONTROL SYSTEM",
    system: isAr ? "الامين" : "AL-AMEEN",
    systemAr: isAr ? "Al-Ameen" : "الامين",
    subtitle: isAr ? "نظام رصد الأنشطة والأحداث والكيانات الوطنية" : "Activity Monitoring for Events & Entities Nationally",
    entityId: isAr ? "معرّف الجهة" : "Entity ID",
    entityIdPh: "AMN-ENT-XXXXXX",
    username: isAr ? "اسم المستخدم" : "Username",
    usernamePh: isAr ? "اسم المستخدم" : "Username",
    password: isAr ? "كلمة المرور" : "Password",
    passwordPh: "••••••••",
    login: isAr ? "تسجيل الدخول" : "Login",
    logging: isAr ? "جارٍ الدخول..." : "Logging in...",
    register: isAr ? "تسجيل جهة جديدة" : "Register New Entity",
    forgot: isAr ? "نسيت كلمة المرور؟" : "Forgot password?",
    secure: isAr ? "اتصال آمن ومشفر — TLS 1.3" : "Secure encrypted connection — TLS 1.3",
    operated: isAr ? "يعمل تحت مظلة نظام مراقبة الحدود" : "Operated under Border Control System",
    badge: isAr ? "بوابة مقيدة — للجهات المعتمدة فقط" : "RESTRICTED PORTAL — AUTHORIZED ENTITIES ONLY",
    newEntity: isAr ? "جهة جديدة؟" : "New entity?",
    hospitality: isAr ? "فندق يستخدم تطبيق الامين للضيافة؟" : "Hotel using Al-Ameen Hospitality app?",
    hospitalityNote: isAr ? "لا تحتاج إلى هذه البوابة — التطبيق يتزامن تلقائياً" : "No need for this portal — the app syncs automatically",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "#0B1220" }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(181,142,60,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(181,142,60,0.15) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(181,142,60,0.06) 0%, transparent 70%)",
        }}
      />
      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(22)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: (i % 3 === 0 ? 3 : i % 3 === 1 ? 2 : 1.5) + "px",
              height: (i % 3 === 0 ? 3 : i % 3 === 1 ? 2 : 1.5) + "px",
              background: i % 5 === 0 ? "rgba(181,142,60,0.4)" : "rgba(181,142,60,0.2)",
              left: ((i * 4.55) % 100) + "%",
              top: ((i * 7.7) % 100) + "%",
              animation: `floatP ${(i % 5) + 8}s ease-in-out infinite`,
              animationDelay: (i * 0.4) + "s",
            }}
          />
        ))}
      </div>

      {/* Top-right: Language toggle */}
      <button
        onClick={toggleLang}
        className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full border border-gold-500/40 text-gold-400 text-xs font-bold hover:bg-gold-500/10 transition-colors cursor-pointer font-['JetBrains_Mono'] z-20"
      >
        {isAr ? "EN" : "AR"}
      </button>

      {/* Top-left: Back to home */}
      <a
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 hover:text-gold-400 transition-colors text-sm cursor-pointer z-20 font-['Inter']"
      >
        <i className="ri-arrow-left-line" />
        {isAr ? "الرئيسية" : "Home"}
      </a>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-[420px] mx-4">
        <div
          className="rounded-2xl border overflow-hidden"
          style={{
            background: "rgba(20,29,46,0.88)",
            borderColor: "rgba(181,142,60,0.2)",
            backdropFilter: "blur(24px)",
            boxShadow: "0 0 80px rgba(181,142,60,0.06), 0 0 0 1px rgba(181,142,60,0.05)",
          }}
        >
          {/* Classification banner */}
          <div
            className="flex items-center justify-center gap-2 py-2 px-4"
            style={{ background: "rgba(248,113,113,0.08)", borderBottom: "1px solid rgba(248,113,113,0.2)" }}
          >
            <i className="ri-lock-line text-red-400 text-xs" />
            <span className="text-red-400 text-xs font-['JetBrains_Mono'] tracking-widest">{t.badge}</span>
          </div>

          <div className="p-8">
            {/* Header — National Police Emblem + Branding */}
            <div className="flex flex-col items-center mb-8">
              {/* Hexagonal shield emblem */}
              <div className="relative mb-5">
                <div
                  className="w-20 h-20 flex items-center justify-center"
                  style={{
                    background: "rgba(181,142,60,0.06)",
                    border: "2px solid rgba(181,142,60,0.35)",
                    clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
                  }}
                >
                  <span
                    className="text-3xl font-black"
                    style={{
                      color: "#D4A84B",
                      fontFamily: "Inter, sans-serif",
                      textShadow: "0 0 16px rgba(181,142,60,0.7)",
                    }}
                  >
                    A
                  </span>
                </div>
                {/* Outer hex ring */}
                <div
                  className="absolute -inset-2 opacity-20"
                  style={{
                    border: "1px dashed rgba(181,142,60,0.6)",
                    clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
                  }}
                />
              </div>

              {/* Authority name */}
              <p
                className="text-white font-bold text-xs tracking-[0.25em] font-['Inter'] mb-0.5 uppercase"
              >
                {t.authority}
              </p>
              <p className="text-gray-600 text-xs tracking-widest font-['JetBrains_Mono'] mb-3">
                {t.authorityFull}
              </p>

              {/* System name */}
              <div className="flex flex-col items-center">
                <span
                  className="text-3xl font-black tracking-widest font-['Inter']"
                  style={{ color: "#D4A84B", textShadow: "0 0 20px rgba(181,142,60,0.4)" }}
                >
                  {t.system}
                </span>
                <span className="text-gold-400/60 text-base font-['Cairo'] mt-0.5">
                  {t.systemAr}
                </span>
              </div>

              <p className="text-gray-500 text-xs text-center font-['Inter'] max-w-xs mt-2 leading-relaxed">
                {t.subtitle}
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Entity ID */}
              <div>
                <label className="block text-gray-400 text-xs mb-1.5 font-['Inter']">{t.entityId}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none w-5 h-full">
                    <i className="ri-building-2-line text-gray-600 text-sm" />
                  </div>
                  <input
                    type="text"
                    value={form.entityId}
                    onChange={(e) => setForm({ ...form, entityId: e.target.value })}
                    placeholder={t.entityIdPh}
                    className="w-full pl-9 pr-4 py-3 rounded-lg text-sm text-white placeholder-gray-700 outline-none transition-all font-['JetBrains_Mono']"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(181,142,60,0.5)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-gray-400 text-xs mb-1.5 font-['Inter']">{t.username}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none w-5 h-full">
                    <i className="ri-user-line text-gray-600 text-sm" />
                  </div>
                  <input
                    type="text"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    placeholder={t.usernamePh}
                    className="w-full pl-9 pr-4 py-3 rounded-lg text-sm text-white placeholder-gray-700 outline-none transition-all font-['Inter']"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(181,142,60,0.5)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-gray-400 text-xs font-['Inter']">{t.password}</label>
                  <button
                    type="button"
                    className="text-gold-400 text-xs hover:text-gold-300 cursor-pointer font-['Inter']"
                  >
                    {t.forgot}
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none w-5 h-full">
                    <i className="ri-lock-password-line text-gray-600 text-sm" />
                  </div>
                  <input
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder={t.passwordPh}
                    className="w-full pl-9 pr-10 py-3 rounded-lg text-sm text-white placeholder-gray-700 outline-none transition-all font-['Inter']"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(181,142,60,0.5)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute inset-y-0 right-3 flex items-center w-5 h-full cursor-pointer text-gray-600 hover:text-gray-400"
                  >
                    <i className={showPass ? "ri-eye-off-line text-sm" : "ri-eye-line text-sm"} />
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  className="flex items-center gap-2 p-3 rounded-lg border"
                  style={{ borderColor: "rgba(248,113,113,0.3)", background: "rgba(248,113,113,0.05)" }}
                >
                  <i className="ri-error-warning-line text-red-400 text-sm" />
                  <p className="text-red-400 text-xs font-['Inter']">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold hover:opacity-90 transition-all duration-200 cursor-pointer text-sm font-['Inter'] disabled:opacity-60 mt-2"
                style={{ background: "#D4A84B", color: "#0B1220" }}
              >
                {loading ? (
                  <>
                    <i className="ri-loader-4-line animate-spin" />
                    {t.logging}
                  </>
                ) : (
                  <>
                    <i className="ri-login-box-line" />
                    {t.login}
                  </>
                )}
              </button>
            </form>

            {/* Register link */}
            <div className="mt-5 text-center">
              <span className="text-gray-600 text-xs font-['Inter']">{t.newEntity} </span>
              <button
                onClick={() => navigate("/register")}
                className="text-gold-400 text-xs font-semibold hover:text-gold-300 transition-colors cursor-pointer font-['Inter']"
              >
                {t.register} <i className="ri-arrow-right-line" />
              </button>
            </div>

            {/* Hospitality note */}
            <div
              className="mt-4 p-3 rounded-lg border"
              style={{ background: "rgba(74,222,128,0.04)", borderColor: "rgba(74,222,128,0.15)" }}
            >
              <p className="text-green-400/80 text-xs font-['Inter'] text-center">
                <i className="ri-hotel-line mr-1" />
                {t.hospitality}
              </p>
              <p className="text-gray-600 text-xs font-['Inter'] text-center mt-0.5">
                {t.hospitalityNote}
              </p>
            </div>

            {/* Security footer */}
            <div className="mt-6 pt-5 border-t border-white/5 flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-1.5">
                <i className="ri-shield-check-line text-green-400 text-xs" />
                <span className="text-gray-600 text-xs font-['JetBrains_Mono']">{t.secure}</span>
              </div>
              <span className="text-gray-700 text-xs font-['Inter']">{t.operated}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LoginPage;
