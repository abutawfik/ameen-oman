import { useState } from "react";

interface Props { isAr: boolean; }

interface SocialProfile {
  platform: string;
  platformAr: string;
  icon: string;
  color: string;
  handle: string;
  displayName: string;
  followers: number;
  isPublic: boolean;
  createdDate: string;
  bio: string;
  bioAr: string;
  verified: boolean;
  confidence: number;
}

interface LookupResult {
  phone: string;
  hitRate: number;
  personName: string;
  personNameAr: string;
  nationality: string;
  flag: string;
  docNumber: string;
  profiles: SocialProfile[];
  ref: string;
}

const MOCK_RESULTS: Record<string, LookupResult> = {
  "+96892345678": {
    phone: "+968 9234 5678",
    hitRate: 87,
    personName: "Reza Tehrani",
    personNameAr: "رضا طهراني",
    nationality: "Iran",
    flag: "🇮🇷",
    docNumber: "IR-3312-F",
    ref: "AMN-OSI-20260405-0089",
    profiles: [
      { platform: "WhatsApp", platformAr: "واتساب", icon: "ri-whatsapp-line", color: "#25D366", handle: "+96892345678", displayName: "Reza T.", followers: 0, isPublic: false, createdDate: "2024-11-14", bio: "Account linked to this number", bioAr: "حساب مرتبط بهذا الرقم", verified: false, confidence: 99 },
      { platform: "Telegram", platformAr: "تيليغرام", icon: "ri-telegram-line", color: "#2AABEE", handle: "@reza_t_official", displayName: "Reza Tehrani", followers: 1240, isPublic: true, createdDate: "2023-08-22", bio: "Trader | Muscat | DM for deals", bioAr: "تاجر | مسقط | راسلني للصفقات", verified: false, confidence: 91 },
      { platform: "Instagram", platformAr: "إنستغرام", icon: "ri-instagram-line", color: "#E1306C", handle: "@reza.tehrani.om", displayName: "Reza Tehrani 🇮🇷", followers: 3820, isPublic: true, createdDate: "2022-03-10", bio: "Living in Muscat 🇴🇲 | Business", bioAr: "أعيش في مسقط | أعمال", verified: false, confidence: 84 },
      { platform: "X / Twitter", platformAr: "إكس / تويتر", icon: "ri-twitter-x-line", color: "#FFFFFF", handle: "@reza_thr", displayName: "Reza T.", followers: 892, isPublic: true, createdDate: "2021-06-15", bio: "Opinions are my own", bioAr: "الآراء خاصة بي", verified: false, confidence: 72 },
    ],
  },
  "+96891234567": {
    phone: "+968 9123 4567",
    hitRate: 64,
    personName: "Mohammed Al-Rashidi",
    personNameAr: "محمد الراشدي",
    nationality: "Yemen",
    flag: "🇾🇪",
    docNumber: "YE-4421-M",
    ref: "AMN-OSI-20260405-0090",
    profiles: [
      { platform: "WhatsApp", platformAr: "واتساب", icon: "ri-whatsapp-line", color: "#25D366", handle: "+96891234567", displayName: "Mohammed", followers: 0, isPublic: false, createdDate: "2025-01-08", bio: "Account linked to this number", bioAr: "حساب مرتبط بهذا الرقم", verified: false, confidence: 99 },
      { platform: "Telegram", platformAr: "تيليغرام", icon: "ri-telegram-line", color: "#2AABEE", handle: "@m_rashidi_ye", displayName: "M. Rashidi", followers: 340, isPublic: false, createdDate: "2024-09-03", bio: "Private account", bioAr: "حساب خاص", verified: false, confidence: 68 },
    ],
  },
};

const RECENT_LOOKUPS = [
  { phone: "+968 9234 5678", name: "Reza Tehrani", flag: "🇮🇷", profiles: 4, time: "12 min ago", ref: "AMN-OSI-20260405-0089" },
  { phone: "+968 9123 4567", name: "Mohammed Al-Rashidi", flag: "🇾🇪", profiles: 2, time: "34 min ago", ref: "AMN-OSI-20260405-0090" },
  { phone: "+968 9876 5432", name: "Priya Nair", flag: "🇮🇳", profiles: 3, time: "1.2 hr ago", ref: "AMN-OSI-20260405-0088" },
  { phone: "+968 9001 2345", name: "Unknown", flag: "🏳️", profiles: 0, time: "2.4 hr ago", ref: "AMN-OSI-20260405-0087" },
];

const PhoneLookupEngine = ({ isAr }: Props) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LookupResult | null>(null);
  const [noResult, setNoResult] = useState(false);
  const [lookupType, setLookupType] = useState<"phone" | "email">("phone");

  const handleLookup = () => {
    setLoading(true);
    setResult(null);
    setNoResult(false);
    setTimeout(() => {
      const key = input.replace(/\s/g, "");
      const found = MOCK_RESULTS[key] || MOCK_RESULTS["+96892345678"];
      if (input.trim()) {
        setResult(found);
      } else {
        setNoResult(true);
      }
      setLoading(false);
    }, 1800);
  };

  return (
    <div className="space-y-5">
      {/* Lookup panel */}
      <div className="rounded-2xl border p-6" style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(34,211,238,0.2)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 flex items-center justify-center rounded-xl" style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.25)" }}>
            <i className="ri-search-eye-line text-cyan-400" />
          </div>
          <div>
            <h3 className="text-white font-bold">{isAr ? "محرك البحث عن الهوية الاجتماعية" : "Social Identity Lookup Engine"}</h3>
            <p className="text-gray-500 text-xs">{isAr ? "Tier 1 — ربط رقم الهاتف/البريد بالحسابات الاجتماعية" : "Tier 1 — Link phone/email to social accounts"}</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 px-2 py-1 rounded-full border" style={{ background: "rgba(74,222,128,0.08)", borderColor: "rgba(74,222,128,0.2)" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-['JetBrains_Mono']">API ONLINE</span>
          </div>
        </div>

        {/* Type toggle */}
        <div className="flex gap-2 mb-4">
          {(["phone", "email"] as const).map((t) => (
            <button key={t} type="button" onClick={() => setLookupType(t)}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all whitespace-nowrap"
              style={{
                background: lookupType === t ? "rgba(34,211,238,0.15)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${lookupType === t ? "rgba(34,211,238,0.35)" : "rgba(255,255,255,0.08)"}`,
                color: lookupType === t ? "#22D3EE" : "#6B7280",
              }}>
              <i className={`${t === "phone" ? "ri-phone-line" : "ri-mail-line"} mr-1.5`} />
              {t === "phone" ? (isAr ? "رقم الهاتف" : "Phone Number") : (isAr ? "البريد الإلكتروني" : "Email Address")}
            </button>
          ))}
        </div>

        {/* Input row */}
        <div className="flex gap-3">
          <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border" style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(34,211,238,0.2)" }}>
            <i className={`${lookupType === "phone" ? "ri-phone-line" : "ri-mail-line"} text-cyan-400 text-sm flex-shrink-0`} />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLookup()}
              placeholder={lookupType === "phone" ? (isAr ? "+968 XXXX XXXX" : "+968 XXXX XXXX") : (isAr ? "example@email.com" : "example@email.com")}
              className="flex-1 bg-transparent text-white text-sm outline-none font-['JetBrains_Mono'] placeholder-gray-600"
            />
          </div>
          <button type="button" onClick={handleLookup} disabled={loading}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold cursor-pointer whitespace-nowrap transition-all"
            style={{ background: loading ? "rgba(34,211,238,0.3)" : "#22D3EE", color: "#060D1A" }}>
            {loading ? <><i className="ri-loader-4-line animate-spin" />{isAr ? "جارٍ البحث..." : "Searching..."}</> : <><i className="ri-search-line" />{isAr ? "بحث" : "Lookup"}</>}
          </button>
        </div>

        {/* Hit rate note */}
        <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-lg" style={{ background: "rgba(250,204,21,0.06)", border: "1px solid rgba(250,204,21,0.15)" }}>
          <i className="ri-information-line text-yellow-400 text-xs" />
          <span className="text-yellow-400 text-xs">{isAr ? "معدل الإصابة ~70% — لا يمكن ضمان تطابق الهوية" : "~70% hit rate — identity match cannot be guaranteed"}</span>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="rounded-2xl border p-8 flex flex-col items-center gap-4" style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(34,211,238,0.12)" }}>
          <div className="w-12 h-12 flex items-center justify-center rounded-2xl" style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)" }}>
            <i className="ri-loader-4-line text-cyan-400 text-2xl animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-white font-semibold mb-1">{isAr ? "جارٍ الاستعلام عن قواعد البيانات..." : "Querying lookup databases..."}</p>
            <p className="text-gray-500 text-xs">{isAr ? "Pipl · SEON · قاعدة بيانات AMEEN" : "Pipl · SEON · AMEEN database"}</p>
          </div>
          <div className="flex gap-2">
            {["WhatsApp", "Telegram", "Instagram", "X"].map((p, i) => (
              <div key={p} className="px-2 py-1 rounded-lg text-xs font-['JetBrains_Mono'] animate-pulse" style={{ background: "rgba(34,211,238,0.08)", color: "#22D3EE", animationDelay: `${i * 0.2}s` }}>{p}</div>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-4">
          {/* Person header */}
          <div className="rounded-2xl border p-5" style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(34,211,238,0.2)", backdropFilter: "blur(12px)" }}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{result.flag}</span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-white text-lg font-bold">{isAr ? result.personNameAr : result.personName}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(34,211,238,0.12)", color: "#22D3EE", border: "1px solid rgba(34,211,238,0.25)" }}>
                      {result.profiles.length} {isAr ? "حساب مكتشف" : "profiles found"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-gray-400 text-xs font-['JetBrains_Mono']">{result.phone}</span>
                    <span className="text-gray-600 text-xs">·</span>
                    <span className="text-gray-400 text-xs font-['JetBrains_Mono']">{result.docNumber}</span>
                    <span className="text-gray-600 text-xs">·</span>
                    <span className="text-gray-400 text-xs">{result.nationality}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)" }}>
                  <span className="text-green-400 text-sm font-black font-['JetBrains_Mono']">{result.hitRate}%</span>
                  <span className="text-green-400 text-xs">{isAr ? "ثقة" : "confidence"}</span>
                </div>
                <span className="text-gray-600 text-xs font-['JetBrains_Mono']">{result.ref}</span>
              </div>
            </div>
          </div>

          {/* Profile cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.profiles.map((profile) => (
              <div key={profile.platform} className="rounded-2xl border p-5" style={{ background: "rgba(10,22,40,0.8)", borderColor: `${profile.color}20`, backdropFilter: "blur(12px)" }}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-xl" style={{ background: `${profile.color}15`, border: `1px solid ${profile.color}30` }}>
                      <i className={`${profile.icon} text-lg`} style={{ color: profile.color }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold text-sm">{isAr ? profile.platformAr : profile.platform}</span>
                        {profile.verified && <i className="ri-verified-badge-fill text-xs" style={{ color: profile.color }} />}
                      </div>
                      <span className="text-xs font-['JetBrains_Mono']" style={{ color: profile.color }}>{profile.handle}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{
                      background: profile.isPublic ? "rgba(74,222,128,0.12)" : "rgba(156,163,175,0.12)",
                      color: profile.isPublic ? "#4ADE80" : "#9CA3AF",
                      fontSize: "9px",
                    }}>
                      {profile.isPublic ? (isAr ? "عام" : "PUBLIC") : (isAr ? "خاص" : "PRIVATE")}
                    </span>
                    <span className="text-xs font-['JetBrains_Mono']" style={{ color: profile.confidence >= 90 ? "#4ADE80" : profile.confidence >= 70 ? "#FACC15" : "#FB923C" }}>
                      {profile.confidence}% {isAr ? "ثقة" : "conf."}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs w-20 flex-shrink-0">{isAr ? "الاسم:" : "Name:"}</span>
                    <span className="text-gray-300 text-xs">{profile.displayName}</span>
                  </div>
                  {profile.followers > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-xs w-20 flex-shrink-0">{isAr ? "المتابعون:" : "Followers:"}</span>
                      <span className="text-white text-xs font-bold font-['JetBrains_Mono']">{profile.followers.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs w-20 flex-shrink-0">{isAr ? "أُنشئ:" : "Created:"}</span>
                    <span className="text-gray-300 text-xs font-['JetBrains_Mono']">{profile.createdDate}</span>
                  </div>
                  {profile.isPublic && (
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500 text-xs w-20 flex-shrink-0 mt-0.5">{isAr ? "النبذة:" : "Bio:"}</span>
                      <span className="text-gray-400 text-xs italic">&ldquo;{isAr ? profile.bioAr : profile.bio}&rdquo;</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* AMN ref */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: "rgba(34,211,238,0.06)", border: "1px solid rgba(34,211,238,0.15)" }}>
            <i className="ri-qr-code-line text-cyan-400 text-sm" />
            <span className="text-cyan-400 text-xs font-bold font-['JetBrains_Mono']">{result.ref}</span>
            <span className="text-gray-500 text-xs ml-2">{isAr ? "مرجع AMEEN — مرتبط بملف الشخص" : "AMEEN reference — attached to person profile"}</span>
          </div>
        </div>
      )}

      {/* Recent lookups */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(34,211,238,0.1)", backdropFilter: "blur(12px)" }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(34,211,238,0.08)" }}>
          <h3 className="text-white font-bold text-sm">{isAr ? "عمليات البحث الأخيرة" : "Recent Lookups"}</h3>
        </div>
        <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
          {RECENT_LOOKUPS.map((r) => (
            <div key={r.ref} className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer"
              onClick={() => { setInput(r.phone.replace(/\s/g, "")); }}>
              <div className="flex items-center gap-3">
                <span className="text-xl">{r.flag}</span>
                <div>
                  <p className="text-white text-sm font-semibold">{r.name}</p>
                  <p className="text-gray-500 text-xs font-['JetBrains_Mono']">{r.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold" style={{ color: r.profiles > 0 ? "#22D3EE" : "#6B7280" }}>
                  {r.profiles} {isAr ? "حساب" : "profiles"}
                </span>
                <span className="text-gray-600 text-xs font-['JetBrains_Mono']">{r.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhoneLookupEngine;
