interface Props { isAr: boolean; }

const OSINTLimitations = ({ isAr }: Props) => {
  const limitations = [
    { icon: "ri-lock-line", color: "#9CA3AF", title: isAr ? "الحسابات الخاصة غير متاحة" : "Private Accounts Not Accessible", desc: isAr ? "لا يمكن الوصول إلى المحتوى الخاص. Tier 1+2 يعمل فقط على البيانات العامة والمرتبطة بالهاتف." : "Private content cannot be accessed. Tier 1+2 operates only on public data and phone-linked metadata." },
    { icon: "ri-time-line", color: "#FACC15", title: isAr ? "حدود معدل API" : "Platform API Rate Limits", desc: isAr ? "المنصات تفرض حدوداً على الاستعلامات. ليس في الوقت الفعلي — فترة التحديث قابلة للتهيئة (5 دقائق - 1 ساعة)." : "Platforms impose query limits. Not real-time — refresh interval configurable (5min–1hr)." },
    { icon: "ri-user-unfollow-line", color: "#FB923C", title: isAr ? "معدل إصابة ~70%" : "~70% Phone Lookup Hit Rate", desc: isAr ? "لا يمكن ضمان تطابق الهوية. بعض الأرقام لا تُربط بحسابات اجتماعية. التحقق اليدوي مطلوب." : "Identity match cannot be guaranteed. Some numbers don't link to social accounts. Manual verification required." },
    { icon: "ri-eye-off-line", color: "#F87171", title: isAr ? "لا تعرف على الوجه" : "No Facial Recognition", desc: isAr ? "Tier 1+2 لا يتضمن تعرفاً على الوجه. صور الملف الشخصي لا تُحلَّل تلقائياً." : "Tier 1+2 does not include facial recognition. Profile photos are not automatically analyzed." },
    { icon: "ri-shield-check-line", color: "#4ADE80", title: isAr ? "البيانات العامة فقط" : "Public Data Only", desc: isAr ? "جميع البيانات المجمّعة من مصادر عامة أو مرتبطة بأرقام هواتف مُقدَّمة من تدفق SIM. لا اختراق للخصوصية." : "All data collected from public sources or linked to phone numbers provided by SIM stream. No privacy breach." },
    { icon: "ri-database-2-line", color: "#D4A84B", title: isAr ? "تحليل استرجاعي" : "Retrospective Analysis", desc: isAr ? "التحليل يعمل على البيانات التاريخية. لا مراقبة في الوقت الفعلي لحسابات بعينها." : "Analysis operates on historical data. No real-time surveillance of specific accounts." },
  ];

  const apiSources = [
    { name: "Pipl API", desc: isAr ? "بحث هوية الأشخاص" : "People identity search", status: "active" as const, hitRate: "68%" },
    { name: "SEON", desc: isAr ? "استخبارات الاحتيال الرقمي" : "Digital fraud intelligence", status: "active" as const, hitRate: "71%" },
    { name: "X/Twitter API v2", desc: isAr ? "بحث المنشورات العامة" : "Public post search", status: "active" as const, hitRate: "N/A" },
    { name: "Telegram Bot API", desc: isAr ? "مراقبة القنوات العامة" : "Public channel monitoring", status: "active" as const, hitRate: "N/A" },
    { name: "Instagram Graph API", desc: isAr ? "المنشورات العامة فقط" : "Public posts only", status: "limited" as const, hitRate: "N/A" },
    { name: "Custom Al-Ameen Lookup", desc: isAr ? "قاعدة بيانات داخلية" : "Internal database", status: "active" as const, hitRate: "84%" },
  ];

  return (
    <div className="space-y-6">
      {/* Limitations grid */}
      <div className="rounded-2xl border p-6" style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.12)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 flex items-center justify-center rounded-xl" style={{ background: "rgba(250,204,21,0.1)", border: "1px solid rgba(250,204,21,0.2)" }}>
            <i className="ri-information-line text-yellow-400" />
          </div>
          <div>
            <h3 className="text-white font-bold">{isAr ? "القيود والحدود التقنية" : "System Limitations & Technical Boundaries"}</h3>
            <p className="text-gray-500 text-xs">{isAr ? "Tier 1+2 OSINT فقط — لا مراقبة شاملة" : "Tier 1+2 OSINT only — not mass surveillance"}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {limitations.map((lim) => (
            <div key={lim.title} className="flex items-start gap-3 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${lim.color}15` }}>
              <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${lim.color}12` }}>
                <i className={`${lim.icon} text-sm`} style={{ color: lim.color }} />
              </div>
              <div>
                <p className="text-white text-xs font-bold mb-1">{lim.title}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{lim.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API sources */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.12)", backdropFilter: "blur(12px)" }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: "rgba(181,142,60,0.08)" }}>
          <h3 className="text-white font-bold text-sm">{isAr ? "مصادر API المتكاملة" : "Integrated API Sources"}</h3>
          <p className="text-gray-500 text-xs mt-0.5">{isAr ? "خدمات البحث والمراقبة المستخدمة" : "Lookup and monitoring services in use"}</p>
        </div>
        <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
          {apiSources.map((api) => (
            <div key={api.name} className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ background: api.status === "active" ? "#4ADE80" : "#FACC15" }} />
                <div>
                  <p className="text-white text-sm font-semibold">{api.name}</p>
                  <p className="text-gray-500 text-xs">{api.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {api.hitRate !== "N/A" && (
                  <div className="text-right">
                    <p className="text-gray-500 text-xs">{isAr ? "معدل الإصابة" : "Hit Rate"}</p>
                    <p className="text-gold-400 text-sm font-bold font-['JetBrains_Mono']">{api.hitRate}</p>
                  </div>
                )}
                <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{
                  background: api.status === "active" ? "rgba(74,222,128,0.12)" : "rgba(250,204,21,0.12)",
                  color: api.status === "active" ? "#4ADE80" : "#FACC15",
                  fontSize: "9px",
                }}>
                  {api.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legal note */}
      <div className="rounded-2xl border p-5" style={{ background: "rgba(74,222,128,0.04)", borderColor: "rgba(74,222,128,0.2)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0" style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)" }}>
            <i className="ri-shield-check-line text-green-400" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm mb-2">{isAr ? "الإطار القانوني والأخلاقي" : "Legal & Ethical Framework"}</h3>
            <div className="space-y-1.5">
              {[
                isAr ? "جميع البيانات المجمّعة من مصادر عامة أو مُقدَّمة طوعاً من خلال تدفقات البيانات المرخّصة." : "All data collected from public sources or voluntarily provided through licensed data streams.",
                isAr ? "لا يتم الوصول إلى الحسابات الخاصة أو المحتوى المشفّر." : "No access to private accounts or encrypted content.",
                isAr ? "عمليات البحث مسجّلة ومراجَعة — كل استعلام له مرجع AMN-OSI." : "All lookups are logged and audited — every query has an AMN-OSI reference.",
                isAr ? "يُستخدم فقط للتحقيق في الأشخاص المُبلَّغ عنهم أو قائمة المراقبة — ليس مراقبة شاملة." : "Used only for investigating flagged persons or watchlist — not mass surveillance.",
              ].map((point, i) => (
                <div key={i} className="flex items-start gap-2">
                  <i className="ri-check-line text-green-400 text-xs mt-0.5 flex-shrink-0" />
                  <p className="text-gray-400 text-xs">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OSINTLimitations;
