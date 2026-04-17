// ============================================================================
// Al-Ameen · Operator Portal Login
// ----------------------------------------------------------------------------
// One door, two paths:
//   1. SSO via Government Identity Provider (primary — 2FA handled upstream)
//   2. Officer-ID + Passcode fallback → advances to OTP 2FA screen
//
// Layout: split canvas. Dark ceremonial left pane, ivory form right pane.
// No "Back to Home" chrome — this is a restricted portal.
// ============================================================================

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import i18n from "@/i18n";
import BrandLogo from "@/brand/BrandLogo";
import { useBrandFonts } from "@/brand/typography";

// ── Inline brand tokens (hex from tokens.css) ───────────────────────────────
// Midnight/ocean ramp resolves via CSS vars so the runtime palette switcher
// (src/brand/PaletteSwitcher.tsx) flips v1.0 ↔ v1.1 live. All other families
// remain inline hex.
const C = {
  midnight900: "var(--alm-ocean-900)",
  midnight800: "var(--alm-ocean-800)",
  midnight700: "var(--alm-ocean-700)",
  midnight600: "var(--alm-ocean-600)",
  midnight500: "var(--alm-ocean-500)",
  midnight400: "var(--alm-ocean-400)",
  midnight300: "var(--alm-ocean-300)",
  midnight200: "var(--alm-ocean-200)",

  ivory000: "#FFFFFF",
  ivory100: "#F8F5F0",
  ivory200: "#EFE8D7",
  ivory300: "#EAE2CF",
  ivory400: "#E0D8C5",
  ivory700: "#8A8374",
  ivory800: "#6B6457",

  gold400: "#D6B47E",
  gold500: "#C99C48",
  gold600: "#B88A3C",
  gold700: "#96732C",

  omanRed500: "#A52844",
  omanRed600: "#8A1F3C",
  omanRed700: "#701832",
} as const;

const LOCALE_KEY = "ameen:locale";

type Mode = "credentials" | "otp";

const LoginPage = () => {
  const navigate = useNavigate();
  const fonts = useBrandFonts();

  // Persisted locale — read from localStorage on mount, fall back to i18n.
  const [lang, setLang] = useState<string>(() => {
    try {
      const stored = typeof window !== "undefined" ? localStorage.getItem(LOCALE_KEY) : null;
      return stored || i18n.language || "en";
    } catch {
      return i18n.language || "en";
    }
  });
  const isAr = lang === "ar";

  // Form state
  const [mode, setMode] = useState<Mode>("credentials");
  const [officerId, setOfficerId] = useState("");
  const [passcode, setPasscode]   = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [otp, setOtp]             = useState("");
  const [loading, setLoading]     = useState(false);
  const [ssoRedirecting, setSsoRedirecting] = useState(false);
  const [error, setError]         = useState("");
  const otpRef = useRef<HTMLInputElement | null>(null);

  // ── Language sync ─────────────────────────────────────────────────────────
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.documentElement.dir = isAr ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    if (i18n.language !== lang) i18n.changeLanguage(lang);
    try { localStorage.setItem(LOCALE_KEY, lang); } catch { /* ignore */ }
  }, [lang, isAr]);

  const toggleLang = () => setLang(isAr ? "en" : "ar");

  // ── Copy table ────────────────────────────────────────────────────────────
  const t = {
    // Left pane
    restricted:       isAr ? "وصول مقيّد · للمخوّلين فقط" : "RESTRICTED ACCESS · AUTHORIZED PERSONNEL ONLY",
    brand:            isAr ? "الأمين" : "Al-Ameen",
    brandCounterpart: isAr ? "Al-Ameen" : "الأمين",
    taglinePrimary:   isAr ? "الحارس الأمين للوطن" : "The Nation's Trusted Guardian",
    taglineCounter:   isAr ? "The Nation's Trusted Guardian" : "الحارس الأمين للوطن",
    legal:            isAr
      ? "يتم تسجيل كل وصول وتدقيقه. يُلاحق الاستخدام غير المصرّح به قانونياً وفق قوانين الأمن السيبراني."
      : "Access is logged and audited. Unauthorized use is prosecuted under applicable cybersecurity law.",

    // Right pane — credentials
    signInEyebrow:    isAr ? "تسجيل الدخول" : "SIGN IN",
    title:            isAr ? "بوابة المشغّل" : "Operator Portal",
    ssoBtn:           isAr ? "المتابعة عبر مزوّد الهوية الحكومي" : "Continue with Government Identity Provider",
    ssoRedirecting:   isAr ? "جارٍ التوجيه..." : "Redirecting...",
    divider:          isAr ? "أو سجّل الدخول بمعرّف الضابط" : "OR SIGN IN WITH OFFICER ID",
    officerIdLabel:   isAr ? "معرّف الضابط" : "Officer ID",
    passcodeLabel:    isAr ? "رمز المرور" : "Passcode",
    passcodePh:       "••••••••",
    submit:           isAr ? "تسجيل الدخول" : "Sign in",
    submitLoading:    isAr ? "جارٍ التحقق..." : "Verifying...",
    errorRequired:    isAr ? "يرجى إدخال المعرّف ورمز المرور." : "Enter your Officer ID and passcode.",
    adminNote:        isAr ? "مشكلة في كلمة المرور؟ تواصل مع مسؤول النظام." : "Password trouble? Contact System Administrator.",
    ackNote:          isAr
      ? "بتسجيل الدخول فإنك تقرّ بتسجيل الجلسة وسلسلة القرارات لكل الأحكام."
      : "By signing in, you acknowledge session recording and lineage logging of all adjudications.",

    // Right pane — OTP
    otpEyebrow:       isAr ? "التحقق بخطوتين" : "TWO-STEP VERIFICATION",
    otpTitle:         isAr ? "أدخل رمز التحقق" : "Enter verification code",
    otpSubtitle:      isAr
      ? "تم إرسال رمز مكوّن من ٦ أرقام إلى جهاز المصادقة المسجّل."
      : "A 6-digit code was sent to your registered authenticator.",
    otpPh:            "• • • • • •",
    otpVerify:        isAr ? "تحقّق" : "Verify",
    otpBack:          isAr ? "العودة إلى بيانات الاعتماد" : "Back to credentials",
    otpResend:        isAr ? "إعادة إرسال الرمز" : "Resend code",
  };

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSSO = () => {
    setSsoRedirecting(true);
    setError("");
    // Simulates browser redirect to the Government IdP then back to /dashboard.
    setTimeout(() => navigate("/dashboard"), 700);
  };

  const handleCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerId.trim() || !passcode) {
      setError(t.errorRequired);
      return;
    }
    setError("");
    setLoading(true);
    // Simulate server call then advance to OTP 2FA.
    setTimeout(() => {
      setLoading(false);
      setMode("otp");
      setOtp("");
      setTimeout(() => otpRef.current?.focus(), 50);
    }, 700);
  };

  const handleOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 500);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen w-full flex"
      style={{
        background: C.midnight800,
        direction: isAr ? "rtl" : "ltr",
        fontFamily: fonts.sans,
      }}
    >
      {/* ────────── LEFT PANE — ceremonial ────────── */}
      <div
        data-narrate-id="login-ceremonial-pane"
        className="hidden md:flex relative overflow-hidden flex-col justify-between"
        style={{
          flexBasis: "50%",
          padding: "4rem 3rem",
          color: C.ivory100,
          background:
            `radial-gradient(ellipse at top, rgba(201,74,94,0.22), transparent 70%), ` +
            `linear-gradient(180deg, ${C.midnight800}, ${C.midnight900})`,
        }}
      >
        {/* Gold tracery grid */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              `linear-gradient(rgba(184,138,60,0.06) 1px, transparent 1px), ` +
              `linear-gradient(90deg, rgba(184,138,60,0.06) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
            pointerEvents: "none",
          }}
        />

        {/* Top content */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Pulsing gold eyebrow pill */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "0.375rem 0.875rem",
              borderRadius: 9999,
              border: `1px solid rgba(184,138,60,0.45)`,
              background: "rgba(184,138,60,0.1)",
              color: C.gold400,
              fontFamily: fonts.mono,
              fontSize: "0.6875rem",
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: isAr ? "none" : "uppercase",
              marginBottom: "2.5rem",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: 9999,
                background: C.gold400,
                boxShadow: `0 0 10px ${C.gold400}`,
                animation: "pulseGold 2.2s ease-in-out infinite",
              }}
            />
            {t.restricted}
          </div>

          {/* Stacked logo */}
          <div style={{ marginBottom: "2rem" }}>
            <BrandLogo variant="stacked" tone="light" size="lg" isAr={isAr} />
          </div>

          {/* Tagline — primary in display italic (EN) or Cairo 500 (AR) */}
          <div style={{ maxWidth: 440 }}>
            <div
              style={{
                fontFamily: isAr ? "'Cairo', 'Tajawal', 'IBM Plex Sans Arabic', sans-serif" : fonts.display,
                fontStyle: isAr ? "normal" : "italic",
                fontWeight: isAr ? 500 : 400,
                color: C.ivory100,
                fontSize: "1.375rem",
                lineHeight: 1.4,
                marginBottom: "0.375rem",
                direction: isAr ? "rtl" : "ltr",
              }}
            >
              {t.taglinePrimary}
            </div>
            {/* Counterpart — smaller, opposite language */}
            <div
              style={{
                fontFamily: isAr ? fonts.display : "'Cairo', 'Tajawal', 'IBM Plex Sans Arabic', sans-serif",
                fontStyle: isAr ? "italic" : "normal",
                color: C.midnight200,
                fontSize: "0.9375rem",
                direction: isAr ? "ltr" : "rtl",
                opacity: 0.9,
              }}
            >
              {t.taglineCounter}
            </div>
          </div>
        </div>

        {/* Bottom legal */}
        <div
          data-narrate-id="login-legal-footer"
          style={{
            position: "relative",
            zIndex: 1,
            paddingTop: "2rem",
            borderTop: `1px solid rgba(184,138,60,0.2)`,
            color: C.midnight200,
            fontFamily: fonts.sans,
            fontSize: "0.75rem",
            lineHeight: 1.7,
            maxWidth: 520,
          }}
        >
          {t.legal}
        </div>
      </div>

      {/* ────────── RIGHT PANE — form ────────── */}
      <div
        className="flex-1 flex items-center justify-center relative"
        style={{
          background: C.ivory100,
          color: C.midnight800,
          padding: "4rem 2rem",
        }}
      >
        {/* Top-right locale toggle (flips to top-left in RTL) */}
        <button
          type="button"
          onClick={toggleLang}
          style={{
            position: "absolute",
            top: "1.5rem",
            insetInlineEnd: "1.5rem",
            padding: "0.375rem 0.75rem",
            fontFamily: fonts.mono,
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.12em",
            color: C.gold700,
            background: "transparent",
            border: `1px solid ${C.gold600}`,
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          {isAr ? "EN" : "AR"}
        </button>

        <div style={{ width: "100%", maxWidth: 420 }}>
          {mode === "credentials" ? (
            <>
              {/* Eyebrow */}
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  color: C.gold700,
                  textTransform: isAr ? "none" : "uppercase",
                  marginBottom: "0.75rem",
                }}
              >
                {t.signInEyebrow}
              </div>

              {/* Title */}
              <h1
                style={{
                  fontFamily: fonts.display,
                  fontSize: "2rem",
                  fontWeight: isAr ? 600 : 500,
                  letterSpacing: "-0.01em",
                  color: C.midnight800,
                  marginBottom: "2rem",
                  lineHeight: 1.15,
                }}
              >
                {t.title}
              </h1>

              {/* SSO — primary */}
              <button
                data-narrate-id="login-sso-button"
                type="button"
                onClick={handleSSO}
                disabled={ssoRedirecting}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.625rem",
                  padding: "0.875rem 1rem",
                  borderRadius: 8,
                  background: C.midnight800,
                  color: C.ivory100,
                  fontFamily: fonts.sans,
                  fontSize: "0.9375rem",
                  fontWeight: 500,
                  border: "none",
                  cursor: ssoRedirecting ? "wait" : "pointer",
                  opacity: ssoRedirecting ? 0.8 : 1,
                  transition: "filter 150ms",
                  boxShadow: "0 2px 6px rgba(2,10,20,0.15)",
                }}
                onMouseEnter={(e) => { if (!ssoRedirecting) e.currentTarget.style.filter = "brightness(1.15)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.filter = "none"; }}
              >
                {/* Gold ministry shield icon */}
                <svg width="20" height="20" viewBox="0 0 120 120" aria-hidden>
                  <path
                    d="M60 6 L104 18 L104 62 C104 86 86 104 60 114 C34 104 16 86 16 62 L16 18 Z"
                    fill="none" stroke={C.gold400} strokeWidth={6}
                  />
                  <circle cx="60" cy="46" r="12" fill={C.gold400} />
                  <rect x="57" y="62" width="6" height="30" rx="3" fill={C.gold400} />
                </svg>
                <span>{ssoRedirecting ? t.ssoRedirecting : t.ssoBtn}</span>
                {!ssoRedirecting && <span aria-hidden>{isAr ? "←" : "→"}</span>}
              </button>

              {/* Divider */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  margin: "1.75rem 0",
                }}
              >
                <div style={{ flex: 1, height: 1, background: C.ivory400 }} />
                <span
                  style={{
                    fontFamily: fonts.mono,
                    fontSize: "0.6875rem",
                    letterSpacing: "0.15em",
                    color: C.ivory800,
                    textTransform: isAr ? "none" : "uppercase",
                  }}
                >
                  {t.divider}
                </span>
                <div style={{ flex: 1, height: 1, background: C.ivory400 }} />
              </div>

              {/* Credentials form */}
              <form onSubmit={handleCredentials} noValidate>
                {/* Officer ID */}
                <label
                  style={{
                    display: "block",
                    fontFamily: fonts.sans,
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: C.midnight600,
                    marginBottom: "0.375rem",
                  }}
                >
                  {t.officerIdLabel}
                </label>
                <input
                  type="text"
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value)}
                  placeholder="OPR-•••••"
                  autoComplete="username"
                  spellCheck={false}
                  style={{
                    width: "100%",
                    padding: "0.75rem 0.875rem",
                    marginBottom: "1rem",
                    fontFamily: fonts.mono,
                    fontSize: "0.9375rem",
                    color: C.midnight800,
                    background: C.ivory000,
                    border: `1px solid ${C.ivory400}`,
                    borderRadius: 6,
                    outline: "none",
                    transition: "border-color 150ms",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = C.gold500)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = C.ivory400)}
                />

                {/* Passcode */}
                <label
                  style={{
                    display: "block",
                    fontFamily: fonts.sans,
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: C.midnight600,
                    marginBottom: "0.375rem",
                  }}
                >
                  {t.passcodeLabel}
                </label>
                <div style={{ position: "relative", marginBottom: "1.25rem" }}>
                  <input
                    type={showPass ? "text" : "password"}
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder={t.passcodePh}
                    autoComplete="current-password"
                    style={{
                      width: "100%",
                      padding: "0.75rem 2.5rem 0.75rem 0.875rem",
                      fontFamily: fonts.sans,
                      fontSize: "0.9375rem",
                      color: C.midnight800,
                      background: C.ivory000,
                      border: `1px solid ${C.ivory400}`,
                      borderRadius: 6,
                      outline: "none",
                      transition: "border-color 150ms",
                      paddingInlineEnd: "2.5rem",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = C.gold500)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = C.ivory400)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    aria-label={showPass ? "Hide passcode" : "Show passcode"}
                    style={{
                      position: "absolute",
                      insetBlockStart: 0,
                      insetBlockEnd: 0,
                      insetInlineEnd: 8,
                      padding: "0 0.5rem",
                      background: "transparent",
                      border: "none",
                      color: C.ivory800,
                      cursor: "pointer",
                      fontFamily: fonts.mono,
                      fontSize: "0.7rem",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {showPass ? (isAr ? "إخفاء" : "HIDE") : (isAr ? "إظهار" : "SHOW")}
                  </button>
                </div>

                {error && (
                  <div
                    role="alert"
                    style={{
                      padding: "0.625rem 0.875rem",
                      marginBottom: "1rem",
                      fontFamily: fonts.sans,
                      fontSize: "0.8125rem",
                      color: C.omanRed600,
                      background: "rgba(201,74,94,0.08)",
                      border: `1px solid rgba(201,74,94,0.3)`,
                      borderRadius: 6,
                    }}
                  >
                    {error}
                  </div>
                )}

                {/* Submit — oman red gradient */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    padding: "0.875rem 1rem",
                    borderRadius: 8,
                    background: `linear-gradient(180deg, ${C.omanRed500} 0%, ${C.omanRed600} 100%)`,
                    color: C.ivory100,
                    fontFamily: fonts.sans,
                    fontSize: "0.9375rem",
                    fontWeight: 600,
                    border: "none",
                    cursor: loading ? "wait" : "pointer",
                    opacity: loading ? 0.85 : 1,
                    boxShadow: "0 2px 8px rgba(201,74,94,0.28)",
                    transition: "filter 150ms, box-shadow 150ms",
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.filter = "brightness(1.08)";
                      e.currentTarget.style.boxShadow = "0 4px 14px rgba(201,74,94,0.38)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = "none";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(201,74,94,0.28)";
                  }}
                >
                  {loading ? t.submitLoading : t.submit}
                  {!loading && <span aria-hidden>{isAr ? "←" : "→"}</span>}
                </button>
              </form>

              {/* Admin note */}
              <p
                style={{
                  marginTop: "1.25rem",
                  fontFamily: fonts.sans,
                  fontSize: "0.75rem",
                  color: C.ivory800,
                  lineHeight: 1.5,
                }}
              >
                {t.adminNote}
              </p>

              {/* Ack note */}
              <p
                style={{
                  marginTop: "0.75rem",
                  fontFamily: fonts.sans,
                  fontSize: "0.6875rem",
                  color: C.ivory700,
                  lineHeight: 1.6,
                }}
              >
                {t.ackNote}
              </p>
            </>
          ) : (
            /* ────────── OTP SCREEN ────────── */
            <>
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  color: C.gold700,
                  textTransform: isAr ? "none" : "uppercase",
                  marginBottom: "0.75rem",
                }}
              >
                {t.otpEyebrow}
              </div>
              <h1
                style={{
                  fontFamily: fonts.display,
                  fontSize: "2rem",
                  fontWeight: isAr ? 600 : 500,
                  letterSpacing: "-0.01em",
                  color: C.midnight800,
                  marginBottom: "0.5rem",
                  lineHeight: 1.15,
                }}
              >
                {t.otpTitle}
              </h1>
              <p
                style={{
                  fontFamily: fonts.sans,
                  fontSize: "0.875rem",
                  color: C.midnight600,
                  marginBottom: "2rem",
                  lineHeight: 1.55,
                }}
              >
                {t.otpSubtitle}
              </p>

              <form onSubmit={handleOtp} noValidate>
                <input
                  ref={otpRef}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setOtp(digits);
                  }}
                  placeholder={t.otpPh}
                  autoComplete="one-time-code"
                  style={{
                    width: "100%",
                    padding: "1rem 1.25rem",
                    textAlign: "center",
                    letterSpacing: "0.5em",
                    fontFamily: fonts.mono,
                    fontSize: "1.5rem",
                    color: C.midnight800,
                    background: C.ivory000,
                    border: `1px solid ${C.ivory400}`,
                    borderRadius: 8,
                    outline: "none",
                    marginBottom: "1.25rem",
                    transition: "border-color 150ms",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = C.gold500)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = C.ivory400)}
                />

                <button
                  type="submit"
                  disabled={otp.length !== 6 || loading}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    padding: "0.875rem 1rem",
                    borderRadius: 8,
                    background: otp.length === 6
                      ? `linear-gradient(180deg, ${C.omanRed500} 0%, ${C.omanRed600} 100%)`
                      : C.ivory300,
                    color: otp.length === 6 ? C.ivory100 : C.ivory800,
                    fontFamily: fonts.sans,
                    fontSize: "0.9375rem",
                    fontWeight: 600,
                    border: "none",
                    cursor: otp.length === 6 && !loading ? "pointer" : "not-allowed",
                    boxShadow: otp.length === 6 ? "0 2px 8px rgba(201,74,94,0.28)" : "none",
                    transition: "filter 150ms",
                  }}
                >
                  {loading ? t.submitLoading : t.otpVerify}
                  {otp.length === 6 && !loading && <span aria-hidden>{isAr ? "←" : "→"}</span>}
                </button>
              </form>

              {/* Back + resend */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "1.25rem",
                }}
              >
                <button
                  type="button"
                  onClick={() => { setMode("credentials"); setError(""); }}
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    color: C.midnight600,
                    fontFamily: fonts.sans,
                    fontSize: "0.8125rem",
                    cursor: "pointer",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = C.omanRed600)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = C.midnight600)}
                >
                  {isAr ? "→" : "←"} {t.otpBack}
                </button>
                <button
                  type="button"
                  onClick={() => { setOtp(""); otpRef.current?.focus(); }}
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    color: C.gold700,
                    fontFamily: fonts.sans,
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = C.gold600)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = C.gold700)}
                >
                  {t.otpResend}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Keyframes — pulsing gold dot on the eyebrow pill */}
      <style>{`
        @keyframes pulseGold {
          0%, 100% { opacity: 1;   transform: scale(1); }
          50%      { opacity: 0.4; transform: scale(0.85); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
