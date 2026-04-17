import { useMemo, useState } from "react";
import { useBrandFonts } from "@/brand/typography";
import {
  STREAMS,
  STREAM_CATEGORIES,
  CORE_STREAMS,
  EXTENDED_STREAMS,
  isCoreStream,
  type Stream,
} from "@/mocks/streamsCatalog";

// ─── Brand tokens (inline — same pattern used across the public landing) ─────
const C = {
  midnight800: "#051428",
  midnight900: "#020A14",
  ivory100:    "#F8F5F0",
  ivory200:    "#EFE8D7",
  gold400:     "#D6B47E",
  omanRed:     "#8A1F3C",
};

type TabKey = "core" | "extended" | "all";

const IntelligenceLayer = () => {
  const { display, sans, mono, isAr } = useBrandFonts();
  const [tab, setTab] = useState<TabKey>("all");

  const filtered = useMemo<Stream[]>(() => {
    if (tab === "core") return CORE_STREAMS;
    if (tab === "extended") return EXTENDED_STREAMS;
    return STREAMS;
  }, [tab]);

  const tabs: Array<{ key: TabKey; label: string; labelAr: string; count: number }> = [
    { key: "core",     label: "Core",     labelAr: "الأساسية", count: CORE_STREAMS.length },
    { key: "extended", label: "Extended", labelAr: "الموسعة",  count: EXTENDED_STREAMS.length },
    { key: "all",      label: "All",      labelAr: "الكل",     count: STREAMS.length },
  ];

  return (
    <section
      id="intelligence-layers"
      className="py-20 md:py-28 relative"
      style={{
        background: `linear-gradient(180deg, ${C.midnight800} 0%, ${C.midnight900} 100%)`,
      }}
    >
      {/* Gold grid tracery — matches Hero style at 5% opacity */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(184,138,60,1) 1px, transparent 1px), linear-gradient(90deg, rgba(184,138,60,1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.05,
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 mb-4"
            style={{
              padding: "0.25rem 0.875rem",
              borderRadius: 9999,
              border: "1px solid rgba(184,138,60,0.35)",
              background: "rgba(184,138,60,0.08)",
              fontFamily: mono,
              fontSize: "0.6875rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: C.gold400,
            }}
          >
            {isAr ? "16 تيارات استخبارات" : "16 Intelligence Streams"}
          </div>

          <h2
            style={{
              fontFamily: display,
              fontSize: "clamp(2rem, 4vw, 2.5rem)",
              fontWeight: 500,
              letterSpacing: isAr ? "0" : "-0.02em",
              color: C.ivory100,
              marginBottom: "0.75rem",
              lineHeight: 1.1,
              direction: isAr ? "rtl" : "ltr",
            }}
          >
            {isAr ? "طبقات الاستخبارات" : "Intelligence Layers"}
          </h2>

          <div style={{ width: 60, height: 1, background: C.gold400, margin: "0 auto 1rem" }} />

          <p
            style={{
              fontFamily: sans,
              fontSize: "0.9375rem",
              color: C.ivory200,
              maxWidth: 680,
              margin: "0 auto",
              lineHeight: 1.6,
              direction: isAr ? "rtl" : "ltr",
            }}
          >
            {isAr
              ? "يدمج الأمين ستة عشر تيارًا لحظيًا في عرض واحد للمخاطر. أربعة منها أساسية واثنا عشر توسّع التغطية السياقية."
              : "Al-Ameen fuses sixteen real-time streams into one risk view. Four are core. Twelve extend contextual coverage."}
          </p>
        </div>

        {/* Tab row */}
        <div
          role="tablist"
          aria-label={isAr ? "تصفية الطبقات" : "Filter layers"}
          className="flex items-center justify-center gap-2 mb-8 flex-wrap"
        >
          {tabs.map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.key)}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: 9999,
                  cursor: "pointer",
                  fontFamily: sans,
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                  transition: "all 150ms",
                  background: active ? "rgba(201,74,94,0.1)" : "transparent",
                  border: active
                    ? "1px solid rgba(201,74,94,0.3)"
                    : "1px solid rgba(184,138,60,0.2)",
                  color: active ? C.omanRed : C.gold400,
                }}
              >
                {(isAr ? t.labelAr : t.label)} <span style={{ opacity: 0.7 }}>· {t.count}</span>
              </button>
            );
          })}
        </div>

        {/* Stream card grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1rem",
          }}
          dir={isAr ? "rtl" : "ltr"}
        >
          {filtered.map((s) => {
            const cat = STREAM_CATEGORIES[s.cat];
            const core = isCoreStream(s);
            const ariaLabel = `${isAr ? s.titleAr : s.title} · ${isAr ? cat.labelAr : cat.label}${core ? (isAr ? " · أساسية" : " · Core") : ""}`;
            return (
              <button
                key={s.num}
                type="button"
                aria-label={ariaLabel}
                style={{
                  position: "relative",
                  textAlign: isAr ? "right" : "left",
                  background: "rgba(10,37,64,0.7)",
                  // Category rail flips to the logical leading edge in RTL.
                  borderInlineStart: `3px solid ${cat.color}`,
                  borderTop: "1px solid rgba(184,138,60,0.08)",
                  borderInlineEnd: "1px solid rgba(184,138,60,0.08)",
                  borderBottom: "1px solid rgba(184,138,60,0.08)",
                  borderRadius: 8,
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  color: "inherit",
                  cursor: "pointer",
                  transition: "transform 150ms, border-color 150ms, box-shadow 150ms",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 12px 20px rgba(2,10,20,0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                {/* Head — num + icon tile */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontFamily: mono, fontSize: "0.6875rem", color: C.gold400 }}>
                    {s.num}
                  </span>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 6,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: cat.color + "14", // ~8% alpha
                      border: `1px solid ${cat.color}4D`, // ~30% alpha
                      color: cat.color,
                    }}
                  >
                    <i className={s.icon} style={{ fontSize: "1rem" }} />
                  </div>
                </div>

                {/* Category eyebrow */}
                <div
                  style={{
                    fontFamily: sans,
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: cat.color,
                  }}
                >
                  {isAr ? cat.labelAr : cat.label}
                </div>

                {/* Title — active language only, never both */}
                <div
                  style={{
                    fontFamily: display,
                    fontSize: "1.125rem",
                    fontWeight: 500,
                    color: C.ivory100,
                    lineHeight: 1.2,
                    direction: isAr ? "rtl" : "ltr",
                  }}
                >
                  {isAr ? s.titleAr : s.title}
                </div>

                {/* Description */}
                <p
                  style={{
                    fontFamily: sans,
                    fontSize: "0.8125rem",
                    color: C.ivory200,
                    lineHeight: 1.5,
                    margin: 0,
                    direction: isAr ? "rtl" : "ltr",
                  }}
                >
                  {isAr ? s.descAr : s.desc}
                </p>

                {/* Foot — events link + metric */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "auto",
                    paddingTop: "0.5rem",
                    borderTop: "1px solid rgba(184,138,60,0.12)",
                  }}
                >
                  <span style={{ fontFamily: sans, fontSize: "0.75rem", fontWeight: 500, color: C.gold400 }}>
                    {isAr ? "الأحداث ←" : "Events →"}
                  </span>
                  <span style={{ fontFamily: mono, fontSize: "0.75rem", color: C.ivory200 }}>
                    {s.metric}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default IntelligenceLayer;
