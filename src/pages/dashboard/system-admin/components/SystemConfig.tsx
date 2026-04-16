import { useState } from "react";

interface ToggleProps { value: boolean; onChange: (v: boolean) => void; label?: string; }
const CyanToggle = ({ value, onChange }: ToggleProps) => (
  <button
    onClick={() => onChange(!value)}
    className="relative inline-flex items-center w-11 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0"
    style={{ background: value ? "#22D3EE" : "rgba(255,255,255,0.1)" }}
  >
    <span className="inline-block w-4 h-4 rounded-full bg-white transition-transform" style={{ transform: value ? "translateX(24px)" : "translateX(4px)" }} />
  </button>
);

interface InputProps { label: string; value: string; onChange: (v: string) => void; type?: string; mono?: boolean; placeholder?: string; readOnly?: boolean; }
const DarkInput = ({ label, value, onChange, type = "text", mono, placeholder, readOnly }: InputProps) => (
  <div>
    <label className="block text-xs text-gray-500 mb-1 font-['Inter'] uppercase tracking-wider">{label}</label>
    <input
      type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} readOnly={readOnly}
      className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-colors"
      style={{ background: readOnly ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)", border: "1px solid rgba(34,211,238,0.2)", color: readOnly ? "#6B7280" : "#D1D5DB", fontFamily: mono ? "'JetBrains Mono', monospace" : "'Inter', sans-serif" }}
      onFocus={(e) => { if (!readOnly) e.target.style.borderColor = "rgba(34,211,238,0.6)"; }}
      onBlur={(e) => { e.target.style.borderColor = "rgba(34,211,238,0.2)"; }}
    />
  </div>
);

interface SelectProps { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; }
const DarkSelect = ({ label, value, onChange, options }: SelectProps) => (
  <div>
    <label className="block text-xs text-gray-500 mb-1 font-['Inter'] uppercase tracking-wider">{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm outline-none cursor-pointer"
      style={{ background: "rgba(10,22,40,0.9)", border: "1px solid rgba(34,211,238,0.2)", color: "#D1D5DB", fontFamily: "'Inter', sans-serif" }}>
      {options.map((o) => <option key={o.value} value={o.value} style={{ background: "#0A1628" }}>{o.label}</option>)}
    </select>
  </div>
);

interface SectionProps { title: string; titleAr?: string; icon: string; children: React.ReactNode; badge?: string; badgeColor?: string; }
const ConfigSection = ({ title, icon, children, badge, badgeColor }: SectionProps) => (
  <div className="rounded-xl p-5 mb-4" style={{ background: "rgba(10,22,40,0.8)", border: "1px solid rgba(34,211,238,0.12)" }}>
    <div className="flex items-center gap-2 mb-4">
      <div className="w-7 h-7 flex items-center justify-center rounded-lg" style={{ background: "rgba(34,211,238,0.1)" }}>
        <i className={`${icon} text-cyan-400 text-sm`} />
      </div>
      <h3 className="text-white font-semibold text-sm font-['Inter']">{title}</h3>
      {badge && (
        <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-['JetBrains_Mono'] font-semibold" style={{ background: `${badgeColor}18`, color: badgeColor, border: `1px solid ${badgeColor}30` }}>{badge}</span>
      )}
    </div>
    {children}
  </div>
);

const SystemConfig = () => {
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // General
  const [systemName, setSystemName] = useState("Al-Ameen Intelligence Platform");
  const [environment, setEnvironment] = useState("production");
  const [timezone, setTimezone] = useState("Asia/Muscat");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [debugLogging, setDebugLogging] = useState(false);

  // Security
  const [sessionTimeout, setSessionTimeout] = useState("45");
  const [minPasswordLength, setMinPasswordLength] = useState("12");
  const [passwordExpiry, setPasswordExpiry] = useState("90");
  const [twoFactor, setTwoFactor] = useState(true);
  const [ipRestriction, setIpRestriction] = useState(true);
  const [ipWhitelist, setIpWhitelist] = useState("10.0.0.0/8, 172.16.0.0/12, 192.168.1.0/24");
  const [rateLimit, setRateLimit] = useState("1000");
  const [maxLoginAttempts, setMaxLoginAttempts] = useState("5");
  const [lockoutDuration, setLockoutDuration] = useState("30");
  const [requireUppercase, setRequireUppercase] = useState(true);
  const [requireSpecialChar, setRequireSpecialChar] = useState(true);
  const [auditAllActions, setAuditAllActions] = useState(true);

  // Integration — Security Dept 1 + 2
  const [sd1Name, setSd1Name] = useState("Security Dept 1 — Royal Oman Police");
  const [sd1Url, setSd1Url] = useState("https://vis-rl1.rop.gov.om/api/v2");
  const [sd1ApiKey, setSd1ApiKey] = useState("••••••••••••••••••••••••••••••••");
  const [sd1Heartbeat, setSd1Heartbeat] = useState("30");
  const [sd1RepTimeout, setSd1RepTimeout] = useState("300");
  const [sd1Enabled, setSd1Enabled] = useState(true);

  const [sd2Name, setSd2Name] = useState("Security Dept 2 — State Security");
  const [sd2Url, setSd2Url] = useState("https://vis-rl2.iss.gov.om/api/v2");
  const [sd2ApiKey, setSd2ApiKey] = useState("••••••••••••••••••••••••••••••••");
  const [sd2Heartbeat, setSd2Heartbeat] = useState("30");
  const [sd2RepTimeout, setSd2RepTimeout] = useState("300");
  const [sd2Enabled, setSd2Enabled] = useState(true);

  const [apiVersion, setApiVersion] = useState("v2.1");
  const [encryptTransit, setEncryptTransit] = useState(true);
  const [mutualTls, setMutualTls] = useState(true);

  // Notifications
  const [smtpHost, setSmtpHost] = useState("smtp.alameen.gov.om");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUser, setSmtpUser] = useState("notify@alameen.gov.om");
  const [smtpTls, setSmtpTls] = useState(true);
  const [smsGateway, setSmsGateway] = useState("https://sms.alameen.gov.om/api/send");
  const [smsApiKey, setSmsApiKey] = useState("••••••••••••••••••••");
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [criticalAlertEmail, setCriticalAlertEmail] = useState("soc@alameen.gov.om");
  const [alertThrottle, setAlertThrottle] = useState("5");

  const [testingConn, setTestingConn] = useState<string | null>(null);
  const [connResults, setConnResults] = useState<Record<string, "ok" | "fail" | null>>({ sd1: null, sd2: null, smtp: null, sms: null });

  const testConnection = (key: string) => {
    setTestingConn(key);
    setTimeout(() => {
      setConnResults((prev) => ({ ...prev, [key]: "ok" }));
      setTestingConn(null);
    }, 1800);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const ConnStatus = ({ connKey }: { connKey: string }) => {
    const r = connResults[connKey];
    if (!r) return null;
    return (
      <span className="flex items-center gap-1 text-xs font-['JetBrains_Mono']" style={{ color: r === "ok" ? "#4ADE80" : "#F87171" }}>
        <i className={r === "ok" ? "ri-check-line" : "ri-close-line"} />
        {r === "ok" ? "Connected" : "Failed"}
      </span>
    );
  };

  return (
    <div className="space-y-0">
      {/* General */}
      <ConfigSection title="General Settings" icon="ri-settings-3-line">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <DarkInput label="System Name" value={systemName} onChange={setSystemName} />
          <DarkInput label="Version" value="v4.2.1" onChange={() => {}} mono readOnly />
          <DarkSelect label="Environment" value={environment} onChange={setEnvironment}
            options={[{ value: "production", label: "Production" }, { value: "staging", label: "Staging" }, { value: "development", label: "Development" }]} />
          <DarkSelect label="Timezone" value={timezone} onChange={setTimezone}
            options={[{ value: "Asia/Muscat", label: "Asia/Muscat (GMT+4)" }, { value: "UTC", label: "UTC" }, { value: "Asia/Dubai", label: "Asia/Dubai (GMT+4)" }, { value: "Asia/Riyadh", label: "Asia/Riyadh (GMT+3)" }]} />
        </div>
        <div className="space-y-2">
          {[
            { label: "Maintenance Mode", desc: "Restrict access to admins only during maintenance", value: maintenanceMode, onChange: setMaintenanceMode, warn: true },
            { label: "Debug Logging", desc: "Enable verbose logging — impacts performance", value: debugLogging, onChange: setDebugLogging, warn: true },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: item.value && item.warn ? "1px solid rgba(250,204,21,0.2)" : "1px solid transparent" }}>
              <div>
                <p className="text-white text-sm font-['Inter']">{item.label}</p>
                <p className="text-gray-500 text-xs font-['Inter']">{item.desc}</p>
              </div>
              <div className="flex items-center gap-3">
                {item.value && item.warn && <span className="text-yellow-400 text-xs font-['JetBrains_Mono']">⚠ Active</span>}
                <CyanToggle value={item.value} onChange={item.onChange} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-3 p-3 rounded-lg" style={{ background: "rgba(34,211,238,0.05)", border: "1px solid rgba(34,211,238,0.1)" }}>
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
          <span className="text-green-400 text-xs font-['JetBrains_Mono']">PRODUCTION — All systems operational</span>
          <span className="ml-auto text-gray-500 text-xs font-['JetBrains_Mono']">Build: 20260406-0832</span>
        </div>
      </ConfigSection>

      {/* Security */}
      <ConfigSection title="Security Configuration" icon="ri-shield-keyhole-line" badge="CLASSIFIED" badgeColor="#F87171">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <DarkInput label="Session Timeout (min)" value={sessionTimeout} onChange={setSessionTimeout} type="number" mono />
          <DarkInput label="Min Password Length" value={minPasswordLength} onChange={setMinPasswordLength} type="number" mono />
          <DarkInput label="Password Expiry (days)" value={passwordExpiry} onChange={setPasswordExpiry} type="number" mono />
          <DarkInput label="Max Login Attempts" value={maxLoginAttempts} onChange={setMaxLoginAttempts} type="number" mono />
          <DarkInput label="Lockout Duration (min)" value={lockoutDuration} onChange={setLockoutDuration} type="number" mono />
          <DarkInput label="API Rate Limit (req/min)" value={rateLimit} onChange={setRateLimit} type="number" mono />
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { label: "Two-Factor Authentication", desc: "Require 2FA for all admin accounts", value: twoFactor, onChange: setTwoFactor },
            { label: "IP Restriction", desc: "Restrict access to whitelisted IPs only", value: ipRestriction, onChange: setIpRestriction },
            { label: "Require Uppercase in Password", desc: "At least one uppercase character required", value: requireUppercase, onChange: setRequireUppercase },
            { label: "Require Special Characters", desc: "At least one special character required", value: requireSpecialChar, onChange: setRequireSpecialChar },
            { label: "Audit All Actions", desc: "Log every user action to immutable audit trail", value: auditAllActions, onChange: setAuditAllActions },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div>
                <p className="text-white text-sm font-['Inter']">{item.label}</p>
                <p className="text-gray-500 text-xs font-['Inter']">{item.desc}</p>
              </div>
              <CyanToggle value={item.value} onChange={item.onChange} />
            </div>
          ))}
        </div>
        {ipRestriction && (
          <DarkInput label="IP Whitelist (CIDR, comma-separated)" value={ipWhitelist} onChange={setIpWhitelist} mono placeholder="10.0.0.0/8, 192.168.1.0/24" />
        )}
      </ConfigSection>

      {/* Integration — Security Dept 1 */}
      <ConfigSection title="Security Dept 1 Integration" icon="ri-shield-star-line" badge="ROP" badgeColor="#22D3EE">
        <div className="mb-3 flex items-center justify-between">
          <DarkInput label="Department Name" value={sd1Name} onChange={setSd1Name} />
          <div className="ml-4 flex items-center gap-2 flex-shrink-0 mt-5">
            <span className="text-gray-500 text-xs font-['Inter']">Enabled</span>
            <CyanToggle value={sd1Enabled} onChange={setSd1Enabled} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 mb-3">
          <DarkInput label="Endpoint URL" value={sd1Url} onChange={setSd1Url} mono />
          <DarkInput label="API Key" value={sd1ApiKey} onChange={setSd1ApiKey} mono type="password" />
        </div>
        <div className="grid grid-cols-3 gap-3 mb-3">
          <DarkInput label="Heartbeat Interval (sec)" value={sd1Heartbeat} onChange={setSd1Heartbeat} type="number" mono />
          <DarkInput label="Replication Timeout (sec)" value={sd1RepTimeout} onChange={setSd1RepTimeout} type="number" mono />
          <DarkInput label="API Version" value={apiVersion} onChange={setApiVersion} mono />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => testConnection("sd1")} disabled={testingConn === "sd1"}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all"
            style={{ background: "transparent", border: "1px solid rgba(34,211,238,0.4)", color: "#22D3EE" }}>
            {testingConn === "sd1" ? <><i className="ri-loader-4-line animate-spin" />Testing...</> : <><i className="ri-wifi-line" />Test Connection</>}
          </button>
          <ConnStatus connKey="sd1" />
          <div className="ml-auto flex items-center gap-2 p-2 rounded-lg" style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.15)" }}>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-['JetBrains_Mono']">Connected — 42ms latency</span>
          </div>
        </div>
      </ConfigSection>

      {/* Integration — Security Dept 2 */}
      <ConfigSection title="Security Dept 2 Integration" icon="ri-shield-flash-line" badge="ISS" badgeColor="#A78BFA">
        <div className="mb-3 flex items-center justify-between">
          <DarkInput label="Department Name" value={sd2Name} onChange={setSd2Name} />
          <div className="ml-4 flex items-center gap-2 flex-shrink-0 mt-5">
            <span className="text-gray-500 text-xs font-['Inter']">Enabled</span>
            <CyanToggle value={sd2Enabled} onChange={setSd2Enabled} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 mb-3">
          <DarkInput label="Endpoint URL" value={sd2Url} onChange={setSd2Url} mono />
          <DarkInput label="API Key" value={sd2ApiKey} onChange={setSd2ApiKey} mono type="password" />
        </div>
        <div className="grid grid-cols-3 gap-3 mb-3">
          <DarkInput label="Heartbeat Interval (sec)" value={sd2Heartbeat} onChange={setSd2Heartbeat} type="number" mono />
          <DarkInput label="Replication Timeout (sec)" value={sd2RepTimeout} onChange={setSd2RepTimeout} type="number" mono />
          <DarkInput label="API Version" value={apiVersion} onChange={setApiVersion} mono readOnly />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          {[
            { label: "Encrypt Data in Transit (TLS 1.3)", value: encryptTransit, onChange: setEncryptTransit },
            { label: "Mutual TLS (mTLS) Authentication", value: mutualTls, onChange: setMutualTls },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
              <p className="text-white text-xs font-['Inter']">{item.label}</p>
              <CyanToggle value={item.value} onChange={item.onChange} />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => testConnection("sd2")} disabled={testingConn === "sd2"}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all"
            style={{ background: "transparent", border: "1px solid rgba(167,139,250,0.4)", color: "#A78BFA" }}>
            {testingConn === "sd2" ? <><i className="ri-loader-4-line animate-spin" />Testing...</> : <><i className="ri-wifi-line" />Test Connection</>}
          </button>
          <ConnStatus connKey="sd2" />
          <div className="ml-auto flex items-center gap-2 p-2 rounded-lg" style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.15)" }}>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-['JetBrains_Mono']">Connected — 67ms latency</span>
          </div>
        </div>
      </ConfigSection>

      {/* Notifications */}
      <ConfigSection title="Notification Channels" icon="ri-notification-3-line">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <DarkInput label="SMTP Host" value={smtpHost} onChange={setSmtpHost} mono />
          <DarkInput label="SMTP Port" value={smtpPort} onChange={setSmtpPort} type="number" mono />
          <DarkInput label="SMTP Username" value={smtpUser} onChange={setSmtpUser} mono />
          <DarkInput label="Critical Alert Email" value={criticalAlertEmail} onChange={setCriticalAlertEmail} mono />
          <DarkInput label="SMS Gateway URL" value={smsGateway} onChange={setSmsGateway} mono />
          <DarkInput label="SMS API Key" value={smsApiKey} onChange={setSmsApiKey} mono type="password" />
          <DarkInput label="Alert Throttle (min between same alert)" value={alertThrottle} onChange={setAlertThrottle} type="number" mono />
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { label: "SMTP TLS Encryption", desc: "Use TLS for SMTP connections", value: smtpTls, onChange: setSmtpTls },
            { label: "Push Notifications", desc: "In-app real-time alerts", value: pushEnabled, onChange: setPushEnabled },
            { label: "Email Notifications", desc: "SMTP email delivery", value: emailEnabled, onChange: setEmailEnabled },
            { label: "SMS Notifications", desc: "SMS gateway delivery", value: smsEnabled, onChange: setSmsEnabled },
          ].map((ch) => (
            <div key={ch.label} className="flex items-center justify-between p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div>
                <p className="text-white text-sm font-['Inter']">{ch.label}</p>
                <p className="text-gray-500 text-xs font-['Inter']">{ch.desc}</p>
              </div>
              <CyanToggle value={ch.value} onChange={ch.onChange} />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => testConnection("smtp")} disabled={testingConn === "smtp"}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap"
            style={{ background: "transparent", border: "1px solid rgba(34,211,238,0.4)", color: "#22D3EE" }}>
            {testingConn === "smtp" ? <><i className="ri-loader-4-line animate-spin" />Testing...</> : <><i className="ri-mail-line" />Test SMTP</>}
          </button>
          <button onClick={() => testConnection("sms")} disabled={testingConn === "sms"}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap"
            style={{ background: "transparent", border: "1px solid rgba(34,211,238,0.4)", color: "#22D3EE" }}>
            {testingConn === "sms" ? <><i className="ri-loader-4-line animate-spin" />Testing...</> : <><i className="ri-message-line" />Test SMS</>}
          </button>
          <ConnStatus connKey="smtp" />
          <ConnStatus connKey="sms" />
        </div>
      </ConfigSection>

      {/* Save */}
      <div className="flex items-center gap-3 pt-2 pb-4">
        <button onClick={handleSave}
          className="px-6 py-2.5 rounded-lg text-sm font-semibold font-['Inter'] whitespace-nowrap cursor-pointer transition-all"
          style={{ background: "#22D3EE", color: "#060D1A" }}>
          <i className="ri-save-line mr-2" />Save Configuration
        </button>
        <button className="px-6 py-2.5 rounded-lg text-sm font-semibold font-['Inter'] whitespace-nowrap cursor-pointer transition-all"
          style={{ background: "transparent", border: "1px solid rgba(34,211,238,0.4)", color: "#22D3EE" }}>
          <i className="ri-refresh-line mr-2" />Reset to Defaults
        </button>
        {saved && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)" }}>
            <i className="ri-check-line text-green-400 text-sm" />
            <span className="text-green-400 text-sm font-['Inter']">Configuration saved successfully</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemConfig;
