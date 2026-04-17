import { useState, useEffect } from "react";

interface Props { isAr: boolean; }

type Sentiment = "positive" | "neutral" | "negative" | "threat";
type Platform = "twitter" | "telegram" | "instagram" | "reddit";
type FilterType = "all" | Platform | "elevated";

interface Post {
  id: string;
  platform: Platform;
  handle: string;
  content: string;
  contentAr: string;
  matchedKeywords: string[];
  timestamp: string;
  sentiment: Sentiment;
  location: string | null;
  locationAr: string | null;
  elevated: boolean;
  elevatedReason?: string;
  elevatedReasonAr?: string;
  ref: string;
}

const PLATFORM_CONFIG: Record<Platform, { icon: string; color: string; name: string }> = {
  twitter:   { icon: "ri-twitter-x-line",  color: "#FFFFFF",  name: "X / Twitter" },
  telegram:  { icon: "ri-telegram-line",   color: "#2AABEE",  name: "Telegram" },
  instagram: { icon: "ri-instagram-line",  color: "#E1306C",  name: "Instagram" },
  reddit:    { icon: "ri-reddit-line",     color: "#FF4500",  name: "Reddit" },
};

const SENTIMENT_CONFIG: Record<Sentiment, { color: string; label: string; labelAr: string; icon: string }> = {
  positive: { color: "#4ADE80", label: "Positive", labelAr: "إيجابي", icon: "ri-emotion-happy-line" },
  neutral:  { color: "#9CA3AF", label: "Neutral",  labelAr: "محايد",  icon: "ri-emotion-normal-line" },
  negative: { color: "#FACC15", label: "Negative", labelAr: "سلبي",   icon: "ri-emotion-unhappy-line" },
  threat:   { color: "#F87171", label: "Threat",   labelAr: "تهديد",  icon: "ri-alarm-warning-line" },
};

const INITIAL_POSTS: Post[] = [
  { id: "p1", platform: "telegram", handle: "@reza_t_official", content: "Anyone know where to get signal boosters in Muscat? Need for my shop in Muttrah area.", contentAr: "هل يعرف أحد أين يمكن الحصول على مقويات إشارة في مسقط؟ أحتاجها لمحلي في منطقة مطرح.", matchedKeywords: ["Muscat", "Muttrah", "signal"], timestamp: "4 min ago", sentiment: "threat", location: "Muttrah, Muscat", locationAr: "مطرح، مسقط", elevated: true, elevatedReason: "Keyword 'signal' + location match + flagged person account", elevatedReasonAr: "كلمة 'إشارة' + تطابق الموقع + حساب شخص مُبلَّغ", ref: "AMN-OSI-20260405-0091" },
  { id: "p2", platform: "twitter", handle: "@oman_news_daily", content: "Heavy traffic near Muscat International Airport today due to VIP arrival. Expect delays on Sultan Qaboos Street.", contentAr: "ازدحام مروري شديد بالقرب من مطار مسقط الدولي اليوم بسبب وصول شخصية مهمة. توقع تأخيرات في شارع السلطان قابوس.", matchedKeywords: ["Muscat", "Airport", "VIP"], timestamp: "11 min ago", sentiment: "neutral", location: "Muscat Airport", locationAr: "مطار مسقط", elevated: false, ref: "AMN-OSI-20260405-0092" },
  { id: "p3", platform: "instagram", handle: "@muscat_explorer", content: "Beautiful sunset at Qurum Beach today! 🌅 #Muscat #Oman #travel", contentAr: "غروب شمس رائع في شاطئ القرم اليوم! #مسقط #عُمان #سفر", matchedKeywords: ["Muscat", "Qurum"], timestamp: "18 min ago", sentiment: "positive", location: "Qurum Beach, Muscat", locationAr: "شاطئ القرم، مسقط", elevated: false, ref: "AMN-OSI-20260405-0093" },
  { id: "p4", platform: "telegram", handle: "@m_rashidi_ye", content: "Meeting at the usual place near Nizwa tomorrow. Bring the items we discussed.", contentAr: "اجتماع في المكان المعتاد بالقرب من نزوى غداً. أحضر العناصر التي ناقشناها.", matchedKeywords: ["Nizwa", "items"], timestamp: "29 min ago", sentiment: "threat", location: "Nizwa", locationAr: "نزوى", elevated: true, elevatedReason: "Flagged person account + vague language + location match", elevatedReasonAr: "حساب شخص مُبلَّغ + لغة غامضة + تطابق الموقع", ref: "AMN-OSI-20260405-0094" },
  { id: "p5", platform: "reddit", handle: "u/oman_expat_2024", content: "Anyone else notice increased police presence near Buraimi crossing this week? Seems like something is going on.", contentAr: "هل لاحظ أحد آخر زيادة في تواجد الشرطة بالقرب من معبر البريمي هذا الأسبوع؟ يبدو أن هناك شيئاً ما.", matchedKeywords: ["Buraimi", "police", "crossing"], timestamp: "41 min ago", sentiment: "negative", location: "Buraimi", locationAr: "البريمي", elevated: false, ref: "AMN-OSI-20260405-0095" },
  { id: "p6", platform: "twitter", handle: "@tech_oman", content: "New fiber internet packages from Omantel launching next week in Seeb and Qurum areas. Great speeds!", contentAr: "حزم إنترنت ألياف جديدة من عُمانتل تُطلق الأسبوع القادم في مناطق السيب والقرم. سرعات رائعة!", matchedKeywords: ["Seeb", "Qurum", "Omantel"], timestamp: "55 min ago", sentiment: "positive", location: "Seeb, Muscat", locationAr: "السيب، مسقط", elevated: false, ref: "AMN-OSI-20260405-0096" },
  { id: "p7", platform: "telegram", handle: "@anonymous_ch_99", content: "Police checkpoint on highway 1 near Muscat. Avoid if possible.", contentAr: "نقطة تفتيش للشرطة على الطريق السريع 1 بالقرب من مسقط. تجنبها إن أمكن.", matchedKeywords: ["Police", "Muscat", "checkpoint"], timestamp: "1.1 hr ago", sentiment: "negative", location: "Muscat Highway", locationAr: "طريق مسقط السريع", elevated: true, elevatedReason: "Police keyword + checkpoint warning + anonymous account", elevatedReasonAr: "كلمة الشرطة + تحذير نقطة تفتيش + حساب مجهول", ref: "AMN-OSI-20260405-0097" },
  { id: "p8", platform: "instagram", handle: "@salalah_vibes", content: "Khareef season is amazing this year! Salalah is so green 🌿 #Salalah #Oman #Khareef", contentAr: "موسم الخريف رائع هذا العام! صلالة خضراء جداً 🌿 #صلالة #عُمان #خريف", matchedKeywords: ["Salalah"], timestamp: "1.4 hr ago", sentiment: "positive", location: "Salalah, Dhofar", locationAr: "صلالة، ظفار", elevated: false, ref: "AMN-OSI-20260405-0098" },
];

const OSINTPostFeed = ({ isAr }: Props) => {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [filter, setFilter] = useState<FilterType>("all");
  const [counter, setCounter] = useState(99);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((v) => v + 1);
      const platforms: Platform[] = ["twitter", "telegram", "instagram", "reddit"];
      const sentiments: Sentiment[] = ["positive", "neutral", "negative"];
      const newPost: Post = {
        id: `p-${Date.now()}`,
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        handle: `@user_${Math.floor(Math.random() * 9000 + 1000)}`,
        content: ["Muscat traffic is heavy today near Ruwi.", "Beautiful day in Qurum!", "Anyone near Seeb area?", "Salalah weather is perfect."][Math.floor(Math.random() * 4)],
        contentAr: ["حركة مرور كثيفة في مسقط اليوم بالقرب من الروي.", "يوم جميل في القرم!", "هل هناك أحد بالقرب من منطقة السيب؟", "طقس صلالة مثالي."][Math.floor(Math.random() * 4)],
        matchedKeywords: [["Muscat", "Ruwi"], ["Qurum"], ["Seeb"], ["Salalah"]][Math.floor(Math.random() * 4)],
        timestamp: "just now",
        sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
        location: ["Muscat", "Qurum", "Seeb", "Salalah"][Math.floor(Math.random() * 4)],
        locationAr: ["مسقط", "القرم", "السيب", "صلالة"][Math.floor(Math.random() * 4)],
        elevated: false,
        ref: `AMN-OSI-20260405-0${counter}`,
      };
      setPosts((prev) => [newPost, ...prev.slice(0, 24)]);
    }, 8000);
    return () => clearInterval(interval);
  }, [counter]);

  const FILTERS: { id: FilterType; label: string; labelAr: string }[] = [
    { id: "all", label: "All", labelAr: "الكل" },
    { id: "elevated", label: "Elevated", labelAr: "مرتفع" },
    { id: "twitter", label: "X / Twitter", labelAr: "إكس" },
    { id: "telegram", label: "Telegram", labelAr: "تيليغرام" },
    { id: "instagram", label: "Instagram", labelAr: "إنستغرام" },
    { id: "reddit", label: "Reddit", labelAr: "ريديت" },
  ];

  const filtered = filter === "all" ? posts : filter === "elevated" ? posts.filter((p) => p.elevated) : posts.filter((p) => p.platform === filter);

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button key={f.id} type="button" onClick={() => setFilter(f.id)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all whitespace-nowrap"
            style={{
              background: filter === f.id ? (f.id === "elevated" ? "rgba(248,113,113,0.15)" : "rgba(181,142,60,0.15)") : "rgba(255,255,255,0.04)",
              border: `1px solid ${filter === f.id ? (f.id === "elevated" ? "rgba(248,113,113,0.35)" : "rgba(181,142,60,0.35)") : "rgba(255,255,255,0.08)"}`,
              color: filter === f.id ? (f.id === "elevated" ? "#F87171" : "#D4A84B") : "#6B7280",
            }}>
            {isAr ? f.labelAr : f.label}
            {f.id === "elevated" && <span className="ml-1.5 px-1 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(248,113,113,0.2)", color: "#F87171", fontSize: "9px" }}>
              {posts.filter((p) => p.elevated).length}
            </span>}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg border" style={{ background: "rgba(74,222,128,0.06)", borderColor: "rgba(74,222,128,0.2)" }}>
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400 text-xs font-semibold font-['JetBrains_Mono']">LIVE</span>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-3">
        {filtered.map((post) => {
          const pc = PLATFORM_CONFIG[post.platform];
          const sc = SENTIMENT_CONFIG[post.sentiment];
          return (
            <div key={post.id} className="rounded-2xl border p-5 transition-all"
              style={{
                background: post.elevated ? "rgba(248,113,113,0.04)" : "rgba(20,29,46,0.8)",
                borderColor: post.elevated ? "rgba(248,113,113,0.3)" : "rgba(181,142,60,0.1)",
                backdropFilter: "blur(12px)",
                borderLeft: post.elevated ? "4px solid #F87171" : "4px solid transparent",
              }}>
              {/* Elevated alert */}
              {post.elevated && (
                <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl" style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}>
                  <i className="ri-alarm-warning-line text-red-400 text-xs" />
                  <span className="text-red-400 text-xs font-semibold">{isAr ? "تنبيه مرتفع:" : "Elevated Alert:"} {isAr ? post.elevatedReasonAr : post.elevatedReason}</span>
                </div>
              )}

              <div className="flex items-start gap-4">
                {/* Platform icon */}
                <div className="w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0" style={{ background: `${pc.color}12`, border: `1px solid ${pc.color}20` }}>
                  <i className={`${pc.icon} text-base`} style={{ color: pc.color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="text-white text-sm font-bold">{post.handle}</span>
                    <span className="text-gray-600 text-xs">·</span>
                    <span className="text-gray-500 text-xs">{pc.name}</span>
                    <span className="text-gray-600 text-xs">·</span>
                    <span className="text-gray-500 text-xs font-['JetBrains_Mono']">{post.timestamp}</span>
                  </div>

                  {/* Post content */}
                  <p className="text-gray-300 text-sm leading-relaxed mb-3">{isAr ? post.contentAr : post.content}</p>

                  {/* Keywords + metadata */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex gap-1.5 flex-wrap">
                      {post.matchedKeywords.map((kw) => (
                        <span key={kw} className="px-2 py-0.5 rounded-full text-xs font-bold font-['JetBrains_Mono']"
                          style={{ background: "rgba(181,142,60,0.12)", color: "#D4A84B", border: "1px solid rgba(181,142,60,0.2)" }}>
                          {kw}
                        </span>
                      ))}
                    </div>
                    {post.location && (
                      <div className="flex items-center gap-1">
                        <i className="ri-map-pin-line text-gray-500 text-xs" />
                        <span className="text-gray-500 text-xs">{isAr ? post.locationAr : post.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 ml-auto">
                      <i className={`${sc.icon} text-xs`} style={{ color: sc.color }} />
                      <span className="text-xs font-semibold" style={{ color: sc.color }}>{isAr ? sc.labelAr : sc.label}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ref */}
              <div className="mt-3 pt-2 border-t flex items-center justify-between" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                <span className="text-gray-700 text-xs font-['JetBrains_Mono']" style={{ fontSize: "9px" }}>{post.ref}</span>
                <span className="text-gray-600 text-xs">{isAr ? "منشور عام — OSINT Tier 2" : "Public post — OSINT Tier 2"}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OSINTPostFeed;
