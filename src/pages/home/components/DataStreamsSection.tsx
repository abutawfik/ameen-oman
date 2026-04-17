import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

// ─── Brand tokens (inline to avoid JIT utility misses) ───────────────────────
const C = {
  midnight800: "#0B1220",
  midnight900: "#05080F",
  ivory100:    "#F5EFE3",
  ivory200:    "#EFE7D3",
  gold400:     "#D4A84B",
};

const FF_DISPLAY = "'Cormorant Garamond', Georgia, serif";
const FF_ARABIC  = "'Cairo', 'Tajawal', 'IBM Plex Sans Arabic', sans-serif";
const FF_SANS    = "'Inter', ui-sans-serif, system-ui, sans-serif";
const FF_MONO    = "'JetBrains Mono', ui-monospace, monospace";

// ─── Category palette — per style-guide `--cat-*` tokens ─────────────────────
const CAT = {
  core:      { color: "#2466A3", label: "Core Intelligence",   labelAr: "الاستخبارات الأساسية" },
  mobility:  { color: "#D25A2A", label: "Mobility",             labelAr: "التنقل" },
  commerce:  { color: "#1F7A8C", label: "Commerce",             labelAr: "التجارة" },
  financial: { color: "#0E7C66", label: "Financial",            labelAr: "المالية" },
  health:    { color: "#B32830", label: "Health",               labelAr: "الصحة" },
  utility:   { color: "#C98A1B", label: "Utility",              labelAr: "المرافق" },
  education: { color: "#6B4FAE", label: "Education",            labelAr: "التعليم" },
  labor:     { color: "#4F9A35", label: "Labor",                labelAr: "العمل" },
  customs:   { color: "#9A1F24", label: "Customs",              labelAr: "الجمارك" },
  maritime:  { color: "#2C5F8F", label: "Maritime",             labelAr: "البحرية" },
  postal:    { color: "#A8547A", label: "Postal",               labelAr: "البريد" },
  digital:   { color: "#8A6C1B", label: "Digital",              labelAr: "رقمي" },
} as const;

type Cat = keyof typeof CAT;

interface Stream {
  num: string;
  title: string;
  titleAr: string;
  cat: Cat;
  icon: string;
  desc: string;
  descAr: string;
  metric: string;
}

// Assignments per task brief:
//   Hotel/Municipality/Borders → core
//   Car Rental/Transport       → mobility
//   Mobile Ops/E-Commerce      → commerce
//   Payment                    → financial
//   Health                     → health
//   Utility                    → utility
//   Education                  → education
//   Employment                 → labor
//   Customs                    → customs
//   Marine                     → maritime
//   Postal                     → postal
//   Social                     → digital
const streams: Stream[] = [
  { num: "01", title: "Hotel",              titleAr: "فنادق",              cat: "core",      icon: "ri-hotel-line",          desc: "Check-in / out, room changes, guest movement.",          descAr: "تسجيل الدخول والخروج وحركة النزلاء.",          metric: "2.4k/h" },
  { num: "02", title: "Car Rental",         titleAr: "تأجير السيارات",     cat: "mobility",  icon: "ri-car-line",            desc: "Bookings, extensions, drop-offs.",                       descAr: "الحجوزات والتمديدات والتسليم.",               metric: "812/h" },
  { num: "03", title: "Mobile Ops",         titleAr: "الاتصالات",          cat: "commerce",  icon: "ri-sim-card-line",       desc: "SIM lifecycle, IMEI tracking, roaming.",                 descAr: "دورة حياة الشريحة وتتبع IMEI والتجوال.",        metric: "18k/h" },
  { num: "04", title: "Municipality",       titleAr: "البلديات",           cat: "core",      icon: "ri-government-line",     desc: "Lease registrations, renewals, terminations.",           descAr: "تسجيل الإيجارات والتجديدات والإنهاء.",          metric: "340/h" },
  { num: "05", title: "Payment",            titleAr: "المدفوعات",          cat: "financial", icon: "ri-bank-card-line",      desc: "Currency exchange, wires, large-cash flags.",            descAr: "تحويلات، معاملات نقدية كبيرة.",                metric: "6.1k/h" },
  { num: "06", title: "Borders",            titleAr: "الحدود والهجرة",     cat: "core",      icon: "ri-passport-line",       desc: "Entry/exit, visa compliance, overstay detection.",       descAr: "الدخول والخروج والامتثال للتأشيرة.",           metric: "4.2k/h" },
  { num: "07", title: "Health",             titleAr: "التفاعلات الصحية",   cat: "health",    icon: "ri-heart-pulse-line",    desc: "Admissions, prescriptions, facility interactions.",      descAr: "الإدخالات والوصفات وتفاعلات المرافق.",         metric: "3.8k/h" },
  { num: "08", title: "Utility",            titleAr: "تفعيل المرافق",      cat: "utility",   icon: "ri-flashlight-line",     desc: "Electricity, water, internet activations.",              descAr: "الكهرباء والماء وتفعيل الإنترنت.",             metric: "920/h" },
  { num: "09", title: "Transport",          titleAr: "النقل العام",        cat: "mobility",  icon: "ri-bus-line",            desc: "Bus and taxi usage, route pattern flags.",               descAr: "استخدام الحافلات وسيارات الأجرة.",             metric: "2.0k/h" },
  { num: "10", title: "Education",          titleAr: "التعليم",            cat: "education", icon: "ri-graduation-cap-line", desc: "Enrollment, visa extensions, transfers.",                descAr: "التسجيل وتمديدات التأشيرة والتحويلات.",        metric: "280/h" },
  { num: "11", title: "Employment",         titleAr: "التوظيف",            cat: "labor",     icon: "ri-briefcase-line",      desc: "Work permits, contract events, employer changes.",       descAr: "تصاريح العمل وأحداث العقود.",                  metric: "540/h" },
  { num: "12", title: "E-Commerce",         titleAr: "التجارة الإلكترونية",cat: "commerce",  icon: "ri-shopping-cart-line",  desc: "Online transactions, bulk-purchase detection.",          descAr: "المعاملات عبر الإنترنت واكتشاف الشراء الجماعي.", metric: "7.3k/h" },
  { num: "13", title: "Social",             titleAr: "وسائل التواصل",      cat: "digital",   icon: "ri-global-line",         desc: "Phone-account linkage, public-keyword monitoring.",      descAr: "ربط الأرقام بالحسابات ومراقبة الكلمات العامة.",  metric: "15k/h" },
  { num: "14", title: "Customs",            titleAr: "الجمارك والشحن",     cat: "customs",   icon: "ri-ship-line",           desc: "Declarations, cargo manifests, restricted goods.",       descAr: "الإقرارات وبيانات الشحن والبضائع المقيدة.",     metric: "1.1k/h" },
  { num: "15", title: "Marine",             titleAr: "البحرية",            cat: "maritime",  icon: "ri-anchor-line",         desc: "Marina docking, boat rentals, vessel movement.",         descAr: "رسو المارينا وتأجير القوارب.",                  metric: "420/h" },
  { num: "16", title: "Postal",             titleAr: "البريد",             cat: "postal",    icon: "ri-mail-send-line",      desc: "PO Box registrations, parcels, international mail.",     descAr: "تسجيل صناديق البريد والطرود والبريد الدولي.",  metric: "190/h" },
];

const DataStreamsSection = () => {
  const { t } = useTranslation();
  const isAr = i18n.language === "ar";

  return (
    <section
      id="data-streams"
      className="py-20 md:py-28 relative"
      style={{
        background: `linear-gradient(180deg, ${C.midnight800} 0%, ${C.midnight900} 100%)`,
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(181,142,60,1) 1px, transparent 1px), linear-gradient(90deg, rgba(181,142,60,1) 1px, transparent 1px)",
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
              border: "1px solid rgba(181,142,60,0.35)",
              background: "rgba(181,142,60,0.08)",
              fontFamily: FF_MONO,
              fontSize: "0.6875rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: C.gold400,
            }}
          >
            16 Data Streams
          </div>
          <h2
            style={{
              fontFamily: FF_DISPLAY,
              fontSize: "clamp(2rem, 4vw, 2.25rem)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              color: C.ivory100,
              marginBottom: "0.5rem",
              lineHeight: 1.1,
            }}
          >
            {t("architecture.title")}
          </h2>
          <p style={{ fontFamily: FF_ARABIC, fontSize: "0.9375rem", color: C.ivory200, marginBottom: "0.75rem" }}>
            {isAr ? "بنية تدفق البيانات" : "بنية تدفق البيانات"}
          </p>
          <div style={{ width: 60, height: 1, background: C.gold400, margin: "0 auto 0.75rem" }} />
          <p style={{ fontFamily: FF_SANS, fontSize: "0.9375rem", color: C.ivory200, maxWidth: 640, margin: "0 auto" }}>
            {t("architecture.subtitle")}
          </p>
        </div>

        {/* Streams grid — stream-card treatment per template */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "1rem",
          }}
        >
          {streams.map((s) => {
            const cat = CAT[s.cat];
            return (
              <div
                key={s.num}
                style={{
                  position: "relative",
                  background: "rgba(20,29,46,0.7)",
                  borderLeft: `3px solid ${cat.color}`,
                  borderTop: "1px solid rgba(181,142,60,0.08)",
                  borderRight: "1px solid rgba(181,142,60,0.08)",
                  borderBottom: "1px solid rgba(181,142,60,0.08)",
                  borderRadius: 8,
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  transition: "transform 200ms, border-color 200ms, box-shadow 200ms",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 12px 20px rgba(5,8,15,0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                {/* Head — num + icon */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: FF_MONO, fontSize: "0.6875rem", color: "rgba(239,231,211,0.45)" }}>
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
                      background: cat.color + "1A",
                      color: cat.color,
                    }}
                  >
                    <i className={s.icon} style={{ fontSize: "1rem" }} />
                  </div>
                </div>

                {/* Body — category + title + arabic */}
                <div>
                  <div
                    style={{
                      fontFamily: FF_SANS,
                      fontSize: "0.6875rem",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: cat.color,
                      marginBottom: "0.25rem",
                    }}
                  >
                    {isAr ? cat.labelAr : cat.label}
                  </div>
                  <div
                    style={{
                      fontFamily: isAr ? FF_ARABIC : FF_DISPLAY,
                      fontSize: "1.125rem",
                      fontWeight: 500,
                      color: C.ivory100,
                      lineHeight: 1.2,
                      direction: isAr ? "rtl" : "ltr",
                    }}
                  >
                    {isAr ? s.titleAr : s.title}
                  </div>
                </div>

                {/* Description */}
                <p style={{ fontFamily: FF_SANS, fontSize: "0.8125rem", color: C.ivory200, lineHeight: 1.5, margin: 0 }}>
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
                    borderTop: "1px solid rgba(181,142,60,0.12)",
                  }}
                >
                  <span style={{ fontFamily: FF_SANS, fontSize: "0.75rem", fontWeight: 500, color: C.gold400 }}>
                    {isAr ? "الأحداث ←" : "Events →"}
                  </span>
                  <span style={{ fontFamily: FF_MONO, fontSize: "0.75rem", color: C.ivory200 }}>
                    {s.metric}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DataStreamsSection;
