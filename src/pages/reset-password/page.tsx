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

type Req = { label: string; met: (pw: string) => boolean };
const REQS: Req[] = [
  { label: "At least 8 characters",      met: pw => pw.length >= 8 },
  { label: "One uppercase letter (A–Z)",  met: pw => /[A-Z]/.test(pw) },
  { label: "One number (0–9)",            met: pw => /\d/.test(pw) },
  { label: "One special character (!@#…)", met: pw => /[^A-Za-z0-9]/.test(pw) },
];

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const fonts = useBrandFonts();

  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [done, setDone]           = useState(false);
  const [error, setError]         = useState("");

  const allMet = REQS.every(r => r.met(password));
  const strength = REQS.filter(r => r.met(password)).length;
  const strengthColor = strength === 0 ? "#374B61" : strength === 1 ? "#C94A5E" : strength === 2 ? "#D4922A" : strength === 3 ? "#D6B47E" : "#4A8E5A";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!allMet) { setError("Password does not meet all requirements."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setError("");
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 1400);
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
          Al-Ameen Operator Portal · Password Reset
        </div>
        <div
          style={{
            width: 60,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${C.gold400}, transparent)`,
          }}
        />
        <div style={{ color: C.ocean400, fontSize: "0.8rem", textAlign: "center", lineHeight: 1.7, maxWidth: 260 }}>
          <p style={{ margin: "0 0 0.5rem", fontWeight: 600, color: C.gold400, fontSize: "0.78rem" }}>
            Password Policy
          </p>
          {REQS.map(r => (
            <p key={r.label} style={{ margin: "0.25rem 0", fontSize: "0.76rem" }}>· {r.label}</p>
          ))}
        </div>
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
          {!done ? (
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
                Reset Password
              </div>
              <h1 style={{ fontSize: "1.6rem", fontWeight: 700, color: C.ocean800, margin: "0 0 0.4rem" }}>
                Create a new password
              </h1>
              <p style={{ color: C.ivory700, fontSize: "0.875rem", margin: "0 0 2rem" }}>
                Choose a strong password that meets the policy requirements shown on the left.
              </p>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {/* New password */}
                <div>
                  <label
                    htmlFor="new-pw"
                    style={{ display: "block", fontSize: "0.78rem", color: C.ocean700, marginBottom: "0.4rem", fontWeight: 600 }}
                  >
                    New Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      id="new-pw"
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={e => { setPassword(e.target.value); setError(""); }}
                      placeholder="New password"
                      style={{
                        width: "100%",
                        padding: "0.7rem 2.8rem 0.7rem 1rem",
                        borderRadius: 6,
                        border: `1.5px solid ${C.ivory200}`,
                        background: C.ivory000,
                        color: C.ocean800,
                        fontSize: "0.9rem",
                        fontFamily: fonts.sans,
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(v => !v)}
                      style={{
                        position: "absolute",
                        right: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: C.ivory700,
                        fontSize: "1.1rem",
                      }}
                    >
                      <i className={showPw ? "ri-eye-off-line" : "ri-eye-line"} />
                    </button>
                  </div>

                  {/* Strength bar */}
                  {password.length > 0 && (
                    <div style={{ marginTop: "0.5rem" }}>
                      <div style={{ display: "flex", gap: 4, marginBottom: "0.3rem" }}>
                        {[1, 2, 3, 4].map(i => (
                          <div
                            key={i}
                            style={{
                              flex: 1,
                              height: 4,
                              borderRadius: 2,
                              background: i <= strength ? strengthColor : C.ivory200,
                              transition: "background 0.2s",
                            }}
                          />
                        ))}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                        {REQS.map(r => (
                          <div key={r.label} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.72rem" }}>
                            <i
                              className={r.met(password) ? "ri-checkbox-circle-line" : "ri-circle-line"}
                              style={{ color: r.met(password) ? "#4A8E5A" : C.ivory700, fontSize: "0.85rem" }}
                            />
                            <span style={{ color: r.met(password) ? "#4A8E5A" : C.ivory700 }}>{r.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <label
                    htmlFor="confirm-pw"
                    style={{ display: "block", fontSize: "0.78rem", color: C.ocean700, marginBottom: "0.4rem", fontWeight: 600 }}
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirm-pw"
                    type={showPw ? "text" : "password"}
                    value={confirm}
                    onChange={e => { setConfirm(e.target.value); setError(""); }}
                    placeholder="Repeat new password"
                    style={{
                      width: "100%",
                      padding: "0.7rem 1rem",
                      borderRadius: 6,
                      border: `1.5px solid ${confirm && confirm !== password ? "#C94A5E" : C.ivory200}`,
                      background: C.ivory000,
                      color: C.ocean800,
                      fontSize: "0.9rem",
                      fontFamily: fonts.sans,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  {confirm && confirm !== password && (
                    <p style={{ color: "#C94A5E", fontSize: "0.75rem", margin: "0.3rem 0 0" }}>Passwords do not match.</p>
                  )}
                </div>

                {error && (
                  <p style={{ color: "#C94A5E", fontSize: "0.8rem", margin: 0 }}>{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading || !allMet}
                  style={{
                    padding: "0.75rem",
                    background: !allMet ? C.ocean600 : loading ? C.ocean700 : C.ocean800,
                    color: C.gold400,
                    border: "none",
                    borderRadius: 6,
                    fontSize: "0.9rem",
                    fontFamily: fonts.mono,
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    cursor: !allMet || loading ? "not-allowed" : "pointer",
                    marginTop: "0.5rem",
                  }}
                >
                  {loading ? "Updating…" : "Set New Password"}
                </button>
              </form>
            </>
          ) : (
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
                <i className="ri-shield-check-line" style={{ color: "#4A8E5A" }} />
              </div>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: C.ocean800, marginBottom: "0.5rem" }}>
                Password updated
              </h2>
              <p style={{ color: C.ivory700, fontSize: "0.875rem", lineHeight: 1.7, marginBottom: "2rem" }}>
                Your new password has been set. You can now log in with your updated credentials.
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
                Go to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
