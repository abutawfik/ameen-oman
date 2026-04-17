import { useState } from "react";
import type { SocialProfile } from "@/mocks/person360Data";

interface Props {
  profiles: SocialProfile[];
  isAr: boolean;
}

const statusConfig: Record<string, { label: string; labelAr: string; color: string }> = {
  active:    { label: "Active",    labelAr: "نشط",   color: "#4ADE80" },
  suspended: { label: "Suspended", labelAr: "موقوف", color: "#F87171" },
  private:   { label: "Private",   labelAr: "خاص",   color: "#FACC15" },
};

const SocialProfiles = ({ profiles, isAr }: Props) => {
  const [expandedProfile, setExpandedProfile] = useState<string | null>(null);

  const flaggedCount = profiles.filter(p => p.flagged).length;

  return (
    <div
      className="rounded-xl p-5"
      style={{ background: "rgba(20,29,46,0.8)", border: "1px solid rgba(181,142,60,0.15)", backdropFilter: "blur(12px)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-white font-bold font-['Inter'] text-sm uppercase tracking-wider">
            {isAr ? "الملفات الاجتماعية (OSINT)" : "Social Profiles (OSINT)"}
          </h3>
          <span
            className="px-2 py-0.5 rounded-full text-xs font-['JetBrains_Mono']"
            style={{ background: "rgba(181,142,60,0.1)", color: "#D4A84B", border: "1px solid rgba(181,142,60,0.2)" }}
          >
            {profiles.length} {isAr ? "منصة" : "platforms"}
          </span>
          {flaggedCount > 0 && (
            <span
              className="px-2 py-0.5 rounded-full text-xs font-['JetBrains_Mono'] font-bold"
              style={{ background: "rgba(248,113,113,0.1)", color: "#F87171", border: "1px solid rgba(248,113,113,0.2)" }}
            >
              {flaggedCount} {isAr ? "مُبلَّغ" : "flagged"}
            </span>
          )}
        </div>
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-['JetBrains_Mono']"
          style={{ background: "rgba(251,146,60,0.08)", color: "#FB923C", border: "1px solid rgba(251,146,60,0.2)" }}
        >
          <i className="ri-eye-line text-xs" />
          {isAr ? "مراقبة نشطة" : "Active Monitoring"}
        </div>
      </div>

      {/* OSINT disclaimer */}
      <div
        className="flex items-start gap-2 p-3 rounded-lg mb-4"
        style={{ background: "rgba(250,204,21,0.05)", border: "1px solid rgba(250,204,21,0.15)" }}
      >
        <i className="ri-information-line text-yellow-400 text-sm mt-0.5 flex-shrink-0" />
        <p className="text-yellow-400/80 text-xs font-['Inter'] leading-relaxed">
          {isAr
            ? "البيانات مستخرجة من المصادر المفتوحة (OSINT). المحتوى الخاص أو المشفر غير متاح. يُستخدم للأغراض الاستخباراتية فقط."
            : "Data sourced from open-source intelligence (OSINT). Private or encrypted content is not accessible. For intelligence purposes only."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {profiles.map((profile) => {
          const status = statusConfig[profile.status];
          const isExpanded = expandedProfile === profile.platform;

          return (
            <div
              key={profile.platform}
              className="rounded-xl p-4 flex flex-col gap-3 relative cursor-pointer transition-all"
              style={{
                background: profile.flagged ? "rgba(248,113,113,0.06)" : "rgba(11,18,32,0.6)",
                border: profile.flagged
                  ? "1px solid rgba(248,113,113,0.3)"
                  : isExpanded
                    ? "1px solid rgba(181,142,60,0.3)"
                    : "1px solid rgba(255,255,255,0.06)",
              }}
              onClick={() => setExpandedProfile(isExpanded ? null : profile.platform)}
            >
              {/* Flagged badge */}
              {profile.flagged && (
                <div
                  className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold font-['JetBrains_Mono'] flex items-center gap-1"
                  style={{ background: "rgba(248,113,113,0.2)", color: "#F87171" }}
                >
                  <i className="ri-flag-fill" style={{ fontSize: 9 }} />
                  {isAr ? "مُبلَّغ" : "FLAGGED"}
                </div>
              )}

              {/* Platform icon + name */}
              <div className="flex items-center gap-2">
                <div
                  className="w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{ background: `${profile.color}18`, border: `1px solid ${profile.color}44` }}
                >
                  <i className={`${profile.icon} text-base`} style={{ color: profile.color }} />
                </div>
                <div>
                  <p className="text-white text-xs font-bold font-['Inter']">{profile.platform}</p>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: status.color }} />
                    <span className="text-[10px] font-['JetBrains_Mono']" style={{ color: status.color }}>
                      {isAr ? status.labelAr : status.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Display name + handle */}
              <div>
                <p className="text-white text-xs font-['Inter'] font-semibold">{profile.displayName}</p>
                <p className="text-gray-500 text-[10px] font-['JetBrains_Mono'] mt-0.5">{profile.handle}</p>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between">
                {profile.followers > 0 && (
                  <div>
                    <p className="text-gray-600 text-[9px] font-['JetBrains_Mono'] uppercase">{isAr ? "متابعون" : "Followers"}</p>
                    <p className="text-gold-400 text-xs font-bold font-['JetBrains_Mono']">{profile.followers.toLocaleString()}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-600 text-[9px] font-['JetBrains_Mono'] uppercase">{isAr ? "آخر نشاط" : "Last Active"}</p>
                  <p className="text-gray-400 text-[10px] font-['JetBrains_Mono']">{profile.lastActivity}</p>
                </div>
              </div>

              {/* Flagged reason + post preview */}
              {profile.flagged && isExpanded && profile.flagReason && (
                <div
                  className="rounded-lg p-2.5 border border-red-500/20"
                  style={{ background: "rgba(248,113,113,0.06)" }}
                >
                  <p className="text-red-400 text-[10px] font-bold font-['JetBrains_Mono'] mb-1 uppercase tracking-wider">
                    {isAr ? "سبب التبليغ" : "Flag Reason"}
                  </p>
                  <p className="text-gray-300 text-[10px] font-['Inter'] leading-relaxed">{profile.flagReason}</p>
                  {profile.recentPost && (
                    <>
                      <p className="text-gray-500 text-[9px] font-['JetBrains_Mono'] uppercase mt-2 mb-1">
                        {isAr ? "ملاحظة الاستخبارات" : "Intelligence Note"}
                      </p>
                      <p className="text-gray-400 text-[10px] font-['Inter'] leading-relaxed italic">{profile.recentPost}</p>
                    </>
                  )}
                </div>
              )}

              {/* View button */}
              <a
                href={profile.profileUrl}
                className="flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-['JetBrains_Mono'] cursor-pointer transition-colors"
                style={{
                  background: "rgba(181,142,60,0.05)",
                  color: "#D4A84B",
                  border: "1px solid rgba(181,142,60,0.2)",
                  textDecoration: "none",
                }}
                onClick={e => e.stopPropagation()}
              >
                <i className="ri-external-link-line text-[10px]" />
                {isAr ? "عرض الملف" : "View Profile"}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SocialProfiles;
