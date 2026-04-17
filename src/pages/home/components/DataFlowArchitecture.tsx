import { useEffect, useRef, useState } from "react";
import { useBrandFonts } from "@/brand/typography";
import { STREAMS, STREAM_CATEGORIES } from "@/mocks/streamsCatalog";

// ─── Brand tokens ────────────────────────────────────────────────────────────
const C = {
  midnight800: "#051428",
  midnight900: "#020A14",
  ivory100:    "#F8F5F0",
  ivory200:    "#EFE8D7",
  gold400:     "#D6B47E",
};

interface Stage {
  num: string;
  eyebrow: string;
  title: string;
  titleAr: string;
  icon: string;
  blurbs: Array<{ en: string; ar: string }>;
}

const STAGES: Stage[] = [
  {
    num: "01",
    eyebrow: "INGEST",
    title: "Ingest",
    titleAr: "استيعاب",
    icon: "ri-broadcast-line",
    blurbs: [
      { en: "16 streams · OSINT + Internal",        ar: "16 تيارًا · مصادر مفتوحة + داخلية" },
      { en: "Adapter pattern · same schema",        ar: "نمط المحوّل · مخطط موحّد" },
      { en: "DLQ + retry on failure",               ar: "طابور خطأ + إعادة محاولة عند الفشل" },
    ],
  },
  {
    num: "02",
    eyebrow: "NORMALISE",
    title: "Normalise",
    titleAr: "تطبيع",
    icon: "ri-database-2-line",
    blurbs: [
      { en: "Unified schema · Events, Entities, Signals", ar: "مخطط موحّد · أحداث وكيانات وإشارات" },
      { en: "Entity resolution · rapidfuzz + metaphone",  ar: "مطابقة الكيانات · rapidfuzz و metaphone" },
      { en: "Classification travels end-to-end",          ar: "التصنيف يسري من البداية للنهاية" },
    ],
  },
  {
    num: "03",
    eyebrow: "SCORE",
    title: "Score",
    titleAr: "تقييم",
    icon: "ri-radar-line",
    blurbs: [
      { en: "9 sub-scores · weighted fusion",             ar: "9 درجات فرعية · اندماج موزون" },
      { en: "Rules baseline + ML overlay",                ar: "قواعد أساسية مع طبقة تعلم آلي" },
      { en: "SHAP attributions per record",               ar: "تفسير SHAP لكل سجل" },
    ],
  },
  {
    num: "04",
    eyebrow: "DELIVER",
    title: "Deliver",
    titleAr: "تسليم",
    icon: "ri-shield-check-line",
    blurbs: [
      { en: "Secure API · mTLS + audit log",              ar: "واجهة آمنة · mTLS وسجل تدقيق" },
      { en: "Explainability payload · every score",       ar: "حمولة قابلة للتفسير مع كل درجة" },
      { en: "Reproducible via feature snapshot",          ar: "قابلة للتكرار عبر لقطة السمات" },
    ],
  },
];

// ─── Dashed arrow keyframes (injected once per mount; harmless if duplicated) ─
const ARROW_KEYFRAMES = `
@keyframes ameen-arrow-dash {
  to { background-position: 1000px 0; }
}
@keyframes ameen-arrow-dash-rtl {
  to { background-position: -1000px 0; }
}
`;

const DataFlowArchitecture = () => {
  const { display, sans, mono, isAr } = useBrandFonts();

  // ── IntersectionObserver — stagger-fade the 4 stage cards on scroll ────────
  const [visible, setVisible] = useState<boolean[]>(() => STAGES.map(() => false));
  const stageRefs = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    stageRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                setVisible((prev) => {
                  if (prev[i]) return prev;
                  const next = [...prev];
                  next[i] = true;
                  return next;
                });
              }, i * 200);
              obs.disconnect();
            }
          });
        },
        { threshold: 0.2 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <section
      id="data-flow-architecture"
      className="py-20 md:py-28 relative"
      style={{
        background: `linear-gradient(180deg, ${C.midnight900} 0%, ${C.midnight800} 100%)`,
      }}
    >
      <style>{ARROW_KEYFRAMES}</style>

      {/* Gold grid tracery */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(184,138,60,1) 1px, transparent 1px), linear-gradient(90deg, rgba(184,138,60,1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.04,
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
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
            {isAr ? "كيف يعمل الأمين" : "How Al-Ameen Works"}
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
            {isAr ? "من البيانات إلى القرار" : "From Stream to Decision"}
          </h2>

          <div style={{ width: 60, height: 1, background: C.gold400, margin: "0 auto 1rem" }} />

          <p
            style={{
              fontFamily: sans,
              fontSize: "0.9375rem",
              color: C.ivory200,
              maxWidth: 760,
              margin: "0 auto",
              lineHeight: 1.6,
              direction: isAr ? "rtl" : "ltr",
            }}
          >
            {isAr
              ? "يدخل كل حدث في خط معالجة حتمي. الاستيعاب يحفظ المصدر. التطبيع يوحّد المخطط. التقييم يدمج القواعد مع التعلم الآلي. التسليم يضمن التدقيق."
              : "Every event enters a deterministic pipeline. Ingestion preserves provenance. Normalisation unifies the schema. Scoring fuses rules and ML. Delivery guarantees audit."}
          </p>
        </div>

        {/* 4-stage pipeline — semantic <ol> that is ALSO the grid container.
            Decorative arrow connectors sit between <li>s with aria-hidden so
            they never enter the accessibility tree. */}
        <ol
          className="grid gap-4 md:!grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]"
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
          }}
          dir={isAr ? "rtl" : "ltr"}
        >
          {STAGES.map((stage, i) => {
            const isOn = visible[i];
            return (
              <div key={stage.num} style={{ display: "contents" }}>
                <li
                  ref={(el) => { stageRefs.current[i] = el; }}
                  style={{
                    listStyle: "none",
                    background: "rgba(5,20,40,0.7)",
                    border: "1px solid rgba(184,138,60,0.25)",
                    borderRadius: 8,
                    padding: 20,
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.875rem",
                    opacity: isOn ? 1 : 0,
                    transform: isOn ? "translateY(0)" : "translateY(12px)",
                    transition: "opacity 500ms ease, transform 500ms ease",
                    textAlign: isAr ? "right" : "left",
                  }}
                >
                  {/* Eyebrow */}
                  <div
                    style={{
                      fontFamily: mono,
                      fontSize: "0.6875rem",
                      color: C.gold400,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                    }}
                  >
                    {stage.num} · {stage.eyebrow}
                  </div>

                  {/* Icon tile */}
                  <div
                    aria-hidden
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      background: "rgba(184,138,60,0.1)",
                      color: C.gold400,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <i className={stage.icon} style={{ fontSize: "1.25rem" }} />
                  </div>

                  {/* Title */}
                  <div
                    style={{
                      fontFamily: display,
                      fontSize: "1.25rem",
                      fontWeight: 500,
                      color: C.ivory100,
                      lineHeight: 1.2,
                    }}
                  >
                    {isAr ? stage.titleAr : stage.title}
                  </div>

                  {/* Blurbs */}
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    {stage.blurbs.map((b, bi) => (
                      <li
                        key={bi}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "0.5rem",
                          fontFamily: sans,
                          fontSize: "0.8125rem",
                          color: C.ivory200,
                          lineHeight: 1.5,
                        }}
                      >
                        <span
                          aria-hidden
                          style={{
                            display: "inline-block",
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: C.gold400,
                            marginTop: "0.5rem",
                            flexShrink: 0,
                          }}
                        />
                        <span>{isAr ? b.ar : b.en}</span>
                      </li>
                    ))}
                  </ul>
                </li>

                {/* Connector arrow — hidden after the last stage */}
                {i < STAGES.length - 1 && (
                  <div
                    aria-hidden
                    className="hidden md:flex"
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: 40,
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: 2,
                        backgroundImage: `repeating-linear-gradient(90deg, ${C.gold400} 0, ${C.gold400} 6px, transparent 6px, transparent 12px)`,
                        backgroundSize: "12px 2px",
                        animation: `${isAr ? "ameen-arrow-dash-rtl" : "ameen-arrow-dash"} 10s linear infinite`,
                        opacity: 0.6,
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        [isAr ? "left" : "right"]: -2,
                        color: C.gold400,
                        fontSize: "1rem",
                        lineHeight: 1,
                      }}
                    >
                      {isAr ? "←" : "→"}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </ol>

        {/* Compact 16-stream strip */}
        <div
          style={{
            marginTop: "2.5rem",
            background: "rgba(5,20,40,0.5)",
            border: "1px solid rgba(184,138,60,0.15)",
            borderRadius: 12,
            padding: 16,
          }}
        >
          <div
            style={{
              fontFamily: mono,
              fontSize: "0.6875rem",
              color: C.gold400,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              textAlign: "center",
              marginBottom: "0.75rem",
            }}
          >
            {isAr ? "16 تيارًا يغذّون خط المعالجة" : "16 Streams Feeding the Pipeline"}
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "0.5rem",
            }}
            dir={isAr ? "rtl" : "ltr"}
          >
            {STREAMS.map((s) => {
              const cat = STREAM_CATEGORIES[s.cat];
              const tip = `${isAr ? s.titleAr : s.title} · ${isAr ? cat.labelAr : cat.label}`;
              return (
                <button
                  key={s.num}
                  type="button"
                  title={tip}
                  aria-label={tip}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    background: cat.color + "14", // 8%
                    border: `1px solid ${cat.color}4D`, // 30%
                    color: cat.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "transform 150ms, box-shadow 150ms",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = `0 6px 12px ${cat.color}33`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.boxShadow = "";
                  }}
                >
                  <i className={s.icon} style={{ fontSize: "0.875rem" }} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Trust line */}
        <p
          style={{
            fontFamily: sans,
            fontSize: "0.75rem",
            textAlign: "center",
            color: C.ivory200,
            opacity: 0.7,
            marginTop: "2rem",
            lineHeight: 1.6,
            direction: isAr ? "rtl" : "ltr",
          }}
        >
          {isAr
            ? "التصنيف يسري من البداية للنهاية · قابلية التكرار مضمونة عبر لقطات السمات · تفسيرات SHAP معروضة لكل درجة"
            : "Classification travels end-to-end · reproducibility guaranteed via feature snapshots · SHAP attributions exposed per score"}
        </p>
      </div>
    </section>
  );
};

export default DataFlowArchitecture;
