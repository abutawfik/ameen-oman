import { useState } from "react";

interface Props { isAr: boolean; }

interface KeywordGroup {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
  color: string;
  keywords: string[];
  matchesToday: number;
  enabled: boolean;
}

const INITIAL_GROUPS: KeywordGroup[] = [
  { id: "location", name: "Location Keywords", nameAr: "كلمات الموقع", icon: "ri-map-pin-line", color: "#D4A84B", keywords: ["Muscat", "Salalah", "Nizwa", "Sohar", "Buraimi", "Muttrah", "Qurum", "Seeb", "Ruwi", "Ibri"], matchesToday: 1842, enabled: true },
  { id: "threat", name: "Threat Keywords", nameAr: "كلمات التهديد", icon: "ri-alarm-warning-line", color: "#F87171", keywords: ["explosive", "weapon", "attack", "bomb", "threat", "danger", "كيميائي", "سلاح", "تفجير"], matchesToday: 23, enabled: true },
  { id: "event", name: "Event Keywords", nameAr: "كلمات الأحداث", icon: "ri-calendar-event-line", color: "#FACC15", keywords: ["National Day", "Royal Visit", "Sultan", "parade", "ceremony", "اليوم الوطني", "زيارة ملكية"], matchesToday: 341, enabled: true },
  { id: "entity", name: "Entity Keywords", nameAr: "كلمات الكيانات", icon: "ri-building-line", color: "#FB923C", keywords: ["Police", "Government", "Palace", "Airport", "Port", "حكومة", "قصر", "مطار", "ميناء"], matchesToday: 567, enabled: true },
  { id: "military", name: "Military/Sensitive", nameAr: "عسكري/حساس", icon: "ri-shield-star-line", color: "#A78BFA", keywords: ["military", "base", "barracks", "restricted", "classified", "عسكري", "قاعدة", "محظور"], matchesToday: 8, enabled: true },
  { id: "custom", name: "Custom Analyst Keywords", nameAr: "كلمات المحلل المخصصة", icon: "ri-user-settings-line", color: "#34D399", keywords: ["Reza Tehrani", "IR-3312-F", "YE-4421-M", "signal jammer"], matchesToday: 4, enabled: true },
];

const PLATFORMS = [
  { id: "twitter", name: "X / Twitter", icon: "ri-twitter-x-line", color: "#FFFFFF", enabled: true, postsToday: 8412 },
  { id: "telegram", name: "Telegram", icon: "ri-telegram-line", color: "#2AABEE", enabled: true, postsToday: 3241 },
  { id: "instagram", name: "Instagram", icon: "ri-instagram-line", color: "#E1306C", enabled: true, postsToday: 2891 },
  { id: "reddit", name: "Reddit", icon: "ri-reddit-line", color: "#FF4500", enabled: true, postsToday: 1203 },
  { id: "forums", name: "Public Forums", icon: "ri-discuss-line", color: "#FACC15", enabled: false, postsToday: 0 },
];

const KeywordMonitor = ({ isAr }: Props) => {
  const [groups, setGroups] = useState<KeywordGroup[]>(INITIAL_GROUPS);
  const [platforms, setPlatforms] = useState(PLATFORMS);
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [newKeyword, setNewKeyword] = useState("");

  const toggleGroup = (id: string) => setGroups((prev) => prev.map((g) => g.id === id ? { ...g, enabled: !g.enabled } : g));
  const togglePlatform = (id: string) => setPlatforms((prev) => prev.map((p) => p.id === id ? { ...p, enabled: !p.enabled } : p));

  const addKeyword = (groupId: string) => {
    if (!newKeyword.trim()) return;
    setGroups((prev) => prev.map((g) => g.id === groupId ? { ...g, keywords: [...g.keywords, newKeyword.trim()] } : g));
    setNewKeyword("");
  };

  const removeKeyword = (groupId: string, kw: string) => {
    setGroups((prev) => prev.map((g) => g.id === groupId ? { ...g, keywords: g.keywords.filter((k) => k !== kw) } : g));
  };

  const totalMatches = groups.filter((g) => g.enabled).reduce((a, g) => a + g.matchesToday, 0);

  return (
    <div className="space-y-5">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: isAr ? "إجمالي التطابقات اليوم" : "Total Matches Today", value: totalMatches.toLocaleString(), color: "#D4A84B", icon: "ri-search-eye-line" },
          { label: isAr ? "مجموعات الكلمات" : "Keyword Groups", value: groups.filter((g) => g.enabled).length, color: "#4ADE80", icon: "ri-price-tag-3-line" },
          { label: isAr ? "المنصات النشطة" : "Active Platforms", value: platforms.filter((p) => p.enabled).length, color: "#FACC15", icon: "ri-global-line" },
          { label: isAr ? "تنبيهات عالية الأولوية" : "High-Priority Alerts", value: 31, color: "#F87171", icon: "ri-alarm-warning-line" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border p-4" style={{ background: "rgba(20,29,46,0.8)", borderColor: `${s.color}20`, backdropFilter: "blur(12px)" }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 flex items-center justify-center rounded-lg" style={{ background: `${s.color}12` }}>
                <i className={`${s.icon} text-xs`} style={{ color: s.color }} />
              </div>
            </div>
            <div className="text-2xl font-black font-['JetBrains_Mono']" style={{ color: s.color }}>{s.value}</div>
            <div className="text-gray-500 text-xs mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Keyword groups */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-widest font-['JetBrains_Mono'] px-1">
            {isAr ? "مجموعات الكلمات المفتاحية" : "Keyword Groups"}
          </h3>
          {groups.map((group) => (
            <div key={group.id} className="rounded-2xl border overflow-hidden transition-all"
              style={{ background: "rgba(20,29,46,0.8)", borderColor: group.enabled ? `${group.color}25` : "rgba(255,255,255,0.06)", backdropFilter: "blur(12px)" }}>
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 flex items-center justify-center rounded-xl" style={{ background: `${group.color}15`, border: `1px solid ${group.color}30`, opacity: group.enabled ? 1 : 0.4 }}>
                    <i className={`${group.icon} text-base`} style={{ color: group.color }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-sm" style={{ opacity: group.enabled ? 1 : 0.5 }}>{isAr ? group.nameAr : group.name}</span>
                      <span className="text-xs font-bold font-['JetBrains_Mono']" style={{ color: group.color }}>{group.matchesToday.toLocaleString()} {isAr ? "تطابق" : "matches"}</span>
                    </div>
                    <div className="flex gap-1 flex-wrap mt-1">
                      {group.keywords.slice(0, 4).map((kw) => (
                        <span key={kw} className="px-1.5 py-0.5 rounded text-xs font-['JetBrains_Mono']"
                          style={{ background: `${group.color}10`, color: group.color, fontSize: "9px" }}>{kw}</span>
                      ))}
                      {group.keywords.length > 4 && (
                        <span className="text-gray-600 text-xs">+{group.keywords.length - 4} {isAr ? "أكثر" : "more"}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setEditingGroup(editingGroup === group.id ? null : group.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
                    <i className="ri-settings-3-line text-gray-400 text-sm" />
                  </button>
                  {/* Toggle */}
                  <button type="button" onClick={() => toggleGroup(group.id)}
                    className="relative w-10 h-5 rounded-full cursor-pointer transition-all flex-shrink-0"
                    style={{ background: group.enabled ? group.color : "rgba(255,255,255,0.1)" }}>
                    <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                      style={{ left: group.enabled ? "calc(100% - 18px)" : "2px" }} />
                  </button>
                </div>
              </div>

              {/* Edit panel */}
              {editingGroup === group.id && (
                <div className="px-5 pb-4 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                  <div className="pt-3 space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      {group.keywords.map((kw) => (
                        <div key={kw} className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: `${group.color}10`, border: `1px solid ${group.color}20` }}>
                          <span className="text-xs font-['JetBrains_Mono']" style={{ color: group.color }}>{kw}</span>
                          <button type="button" onClick={() => removeKeyword(group.id, kw)} className="cursor-pointer hover:opacity-70">
                            <i className="ri-close-line text-xs" style={{ color: group.color }} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input type="text" value={newKeyword} onChange={(e) => setNewKeyword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addKeyword(group.id)}
                        placeholder={isAr ? "أضف كلمة مفتاحية..." : "Add keyword..."}
                        className="flex-1 px-3 py-2 rounded-lg text-xs text-white bg-transparent outline-none font-['JetBrains_Mono'] placeholder-gray-600"
                        style={{ border: "1px solid rgba(255,255,255,0.1)" }} />
                      <button type="button" onClick={() => addKeyword(group.id)}
                        className="px-3 py-2 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap"
                        style={{ background: `${group.color}20`, color: group.color, border: `1px solid ${group.color}30` }}>
                        {isAr ? "إضافة" : "Add"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Platform toggles */}
        <div className="space-y-3">
          <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-widest font-['JetBrains_Mono'] px-1">
            {isAr ? "المنصات المراقبة" : "Monitored Platforms"}
          </h3>
          {platforms.map((p) => (
            <div key={p.id} className="rounded-xl border p-4 flex items-center justify-between"
              style={{ background: "rgba(20,29,46,0.8)", borderColor: p.enabled ? `${p.color}20` : "rgba(255,255,255,0.06)", backdropFilter: "blur(12px)" }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center rounded-xl" style={{ background: `${p.color}12`, border: `1px solid ${p.color}20`, opacity: p.enabled ? 1 : 0.4 }}>
                  <i className={`${p.icon} text-base`} style={{ color: p.color }} />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold" style={{ opacity: p.enabled ? 1 : 0.5 }}>{p.name}</p>
                  <p className="text-xs font-['JetBrains_Mono']" style={{ color: p.enabled ? p.color : "#6B7280" }}>
                    {p.enabled ? `${p.postsToday.toLocaleString()} ${isAr ? "منشور" : "posts"}` : (isAr ? "معطّل" : "disabled")}
                  </p>
                </div>
              </div>
              <button type="button" onClick={() => togglePlatform(p.id)}
                className="relative w-10 h-5 rounded-full cursor-pointer transition-all flex-shrink-0"
                style={{ background: p.enabled ? p.color : "rgba(255,255,255,0.1)" }}>
                <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                  style={{ left: p.enabled ? "calc(100% - 18px)" : "2px" }} />
              </button>
            </div>
          ))}

          {/* Refresh interval */}
          <div className="rounded-xl border p-4" style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.12)", backdropFilter: "blur(12px)" }}>
            <p className="text-gray-400 text-xs font-semibold mb-3">{isAr ? "فترة التحديث" : "Refresh Interval"}</p>
            <div className="flex gap-2 flex-wrap">
              {["5m", "15m", "30m", "1h"].map((t) => (
                <button key={t} type="button"
                  className="px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all"
                  style={{
                    background: t === "15m" ? "rgba(181,142,60,0.15)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${t === "15m" ? "rgba(181,142,60,0.35)" : "rgba(255,255,255,0.08)"}`,
                    color: t === "15m" ? "#D4A84B" : "#6B7280",
                  }}>
                  {t}
                </button>
              ))}
            </div>
            <p className="text-gray-600 text-xs mt-2">{isAr ? "ليس في الوقت الفعلي — حدود API تنطبق" : "Not real-time — API rate limits apply"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeywordMonitor;
