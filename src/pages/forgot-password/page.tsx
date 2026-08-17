import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BrandLogo from "@/brand/BrandLogo";
import { useBrandFonts } from "@/brand/typography";

const C = {
  ocean900: "var(--alm-ocean-900)",
  ocean800: "var(--alm-ocean-800)",
  ocean700: "var(--alm-ocean-700)",
  ocean600: "var(--alm-ocean-600)",
  ocean400: "var(--alm-ocean-400)",
  gold400:  "#D6B47E",
  gold600:  "#B88A3C",
  ivory000: "#FFFFFF",
  ivory100: "#F8F5F0",
  ivory200: "#EFE8D7",
  ivory700: "#8A8374",
} as const;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const fonts = useBrandFonts();

  const [identifier, setIdentifier] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!identifier.trim()) { setError("Enter your officer ID or email address."); return; }
    setError("");
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1200);
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: fonts.sans }}>
      {/* Left brand pane */}
      <div
        style={{
          width: "42%",
          background: C.ocean800,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem 2rem",
          gap: "2rem",
          flexShrink: 0,
        }}
      >
        <BrandLogo variant="stacked" size="lg" />
        <div
          style={{
            color: C.gold400,
            fontFamily: fonts.mono,
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            textAlign: "center",
            opacity: 0.7,
          }}
        >
          Al-Ameen Operator Portal · Secure Access Recovery
        </div>
        <div
          style={{
            width: 60,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${C.gold400}, transparent)`,
          }}
        />
        <p
          style={{
            color: C.ocean400,
            fontSize: "0.8rem",
            textAlign: "center",
            lineHeight: 1.7,
            maxWidth: 260,
          }}
        >
          A time-limited recovery link will be sent to your registered email address. Links expire after 15 minutes.
        </p>
      </div>

      {/* Right form pane */}
      <div
        style={{
          flex: 1,
          background: C.ivory100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem 2rem",
        }}
      >
        <div style={{ width: "100%", maxWidth: 420 }}>
          {!submitted ? (
            <>
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: "0.65rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: C.gold600,
                  marginBottom: "0.5rem",
                }}
              >
                Password Recovery
              </div>
              <h1
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 700,
                  color: C.ocean800,
                  margin: "0 0 0.4rem",
                }}
              >
                Forgot your password?
              </h1>
              <p style={{ color: C.ivory700, fontSize: "0.875rem", margin: "0 0 2rem" }}>
                Enter your Officer ID or registered email below and we'll send you a recovery link.
              </p>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label
                    htmlFor="identifier"
                    style={{ display: "block", fontSize: "0.78rem", color: C.ocean700, marginBottom: "0.4rem", fontWeight: 600 }}
                  >
                    Officer ID or Email
                  </label>
                  <input
                    id="identifier"
                    type="text"
                    value={identifier}
                    onChange={e => { setIdentifier(e.target.value); setError(""); }}
                    placeholder="ROP-0024 or name@rop.gov.om"
                    style={{
                      width: "100%",
                      padding: "0.7rem 1rem",
                      borderRadius: 6,
                      border: error ? `1.5px solid #C94A5E` : `1.5px solid ${C.ivory200}`,
                      background: C.ivory000,
                      color: C.ocean800,
                      fontSize: "0.9rem",
                      fontFamily: fonts.sans,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  {error && (
                    <p style={{ color: "#C94A5E", fontSize: "0.78rem", margin: "0.3rem 0 0" }}>{error}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: "0.75rem",
                    background: loading ? C.ocean700 : C.ocean800,
                    color: C.gold400,
                    border: "none",
                    borderRadius: 6,
                    fontSize: "0.9rem",
                    fontFamily: fonts.mono,
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "background 0.2s",
                    marginTop: "0.5rem",
                  }}
                >
                  {loading ? "Sending…" : "Send Recovery Link"}
                </button>
              </form>

              <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                <button
                  onClick={() => navigate("/login")}
                  style={{
                    background: "none",
                    border: "none",
                    color: C.gold600,
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    textDecoration: "underline",
                    fontFamily: fonts.sans,
                  }}
                >
                  ← Back to Login
                </button>
              </div>
            </>
          ) : (
            /* Success state */
            <div style={{ textAlign: "center", padding: "1rem 0" }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "#162F1C",
                  border: "2px solid #4A8E5A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                  fontSize: "1.8rem",
                }}
              >
                <i className="ri-mail-check-line" style={{ color: "#4A8E5A" }} />
              </div>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: C.ocean800, marginBottom: "0.5rem" }}>
                Check your inbox
              </h2>
              <p style={{ color: C.ivory700, fontSize: "0.875rem", lineHeight: 1.7, marginBottom: "2rem" }}>
                If an account matches <strong>{identifier}</strong>, a recovery link has been sent. The link expires in 15 minutes.
              </p>
              <p style={{ color: C.ivory700, fontSize: "0.78rem", marginBottom: "2rem" }}>
                Didn't receive it? Check your spam folder, or contact your system administrator.
              </p>
              <button
                onClick={() => navigate("/login")}
                style={{
                  padding: "0.7rem 2rem",
                  background: C.ocean800,
                  color: C.gold400,
                  border: "none",
                  borderRadius: 6,
                  fontSize: "0.875rem",
                  fontFamily: fonts.mono,
                  cursor: "pointer",
                }}
              >
                Return to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
