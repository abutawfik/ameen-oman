// ============================================================================
// Al-Ameen · Intelligence Streams Catalog (shared mock)
// ----------------------------------------------------------------------------
// Canonical source for the 16 intelligence streams that feed the Al-Ameen
// engine. Consumed by the public landing `<IntelligenceLayer />` and
// `<DataFlowArchitecture />` sections. Extracted from
// `src/pages/home/components/DataStreamsSection.tsx` so the legacy component
// can be removed without re-declaring the shape.
// ============================================================================

// Category palette — aligned with `--cat-*` tokens in al-ameen-brand/style-guide.
export const STREAM_CATEGORIES = {
  core:      { color: "#2C5F8F", label: "Core Intelligence",   labelAr: "الاستخبارات الأساسية" },
  mobility:  { color: "#C94A5E", label: "Mobility",             labelAr: "التنقل" },
  commerce:  { color: "#1F7A8C", label: "Commerce",             labelAr: "التجارة" },
  financial: { color: "#14786A", label: "Financial",            labelAr: "المالية" },
  health:    { color: "#A52844", label: "Health",               labelAr: "الصحة" },
  utility:   { color: "#C98A1B", label: "Utility",              labelAr: "المرافق" },
  education: { color: "#6B4FAE", label: "Education",            labelAr: "التعليم" },
  labor:     { color: "#4A8E3A", label: "Labor",                labelAr: "العمل" },
  customs:   { color: "#8A1F3C", label: "Customs",              labelAr: "الجمارك" },
  maritime:  { color: "#2C5F8F", label: "Maritime",             labelAr: "البحرية" },
  postal:    { color: "#A8547A", label: "Postal",               labelAr: "البريد" },
  digital:   { color: "#8A6C1B", label: "Digital",              labelAr: "رقمي" },
} as const;

export type StreamCat = keyof typeof STREAM_CATEGORIES;

export interface Stream {
  num: string;
  title: string;
  titleAr: string;
  cat: StreamCat;
  icon: string;
  desc: string;
  descAr: string;
  metric: string;
}

// Core vs Extended follows the product brief: 01-04 core, 05-16 extended.
// The `cat` field is the domain tag (mobility, commerce, etc.) — see
// DataStreamsSection for history.
export const STREAMS: Stream[] = [
  { num: "01", title: "Hotel",        titleAr: "فنادق",              cat: "core",      icon: "ri-hotel-line",          desc: "Check-in / out, room changes, guest movement.",          descAr: "تسجيل الدخول والخروج وحركة النزلاء.",          metric: "2.4k/h" },
  { num: "02", title: "Car Rental",   titleAr: "تأجير السيارات",     cat: "mobility",  icon: "ri-car-line",            desc: "Bookings, extensions, drop-offs.",                       descAr: "الحجوزات والتمديدات والتسليم.",               metric: "812/h" },
  { num: "03", title: "Mobile Ops",   titleAr: "الاتصالات",          cat: "commerce",  icon: "ri-sim-card-line",       desc: "SIM lifecycle, IMEI tracking, roaming.",                 descAr: "دورة حياة الشريحة وتتبع IMEI والتجوال.",        metric: "18k/h" },
  { num: "04", title: "Municipality", titleAr: "البلديات",           cat: "core",      icon: "ri-government-line",     desc: "Lease registrations, renewals, terminations.",           descAr: "تسجيل الإيجارات والتجديدات والإنهاء.",          metric: "340/h" },
  { num: "05", title: "Payment",      titleAr: "المدفوعات",          cat: "financial", icon: "ri-bank-card-line",      desc: "Currency exchange, wires, large-cash flags.",            descAr: "تحويلات، معاملات نقدية كبيرة.",                metric: "6.1k/h" },
  { num: "06", title: "Borders",      titleAr: "الحدود والهجرة",     cat: "core",      icon: "ri-passport-line",       desc: "Entry/exit, visa compliance, overstay detection.",       descAr: "الدخول والخروج والامتثال للتأشيرة.",           metric: "4.2k/h" },
  { num: "07", title: "Health",       titleAr: "التفاعلات الصحية",   cat: "health",    icon: "ri-heart-pulse-line",    desc: "Admissions, prescriptions, facility interactions.",      descAr: "الإدخالات والوصفات وتفاعلات المرافق.",         metric: "3.8k/h" },
  { num: "08", title: "Utility",      titleAr: "تفعيل المرافق",      cat: "utility",   icon: "ri-flashlight-line",     desc: "Electricity, water, internet activations.",              descAr: "الكهرباء والماء وتفعيل الإنترنت.",             metric: "920/h" },
  { num: "09", title: "Transport",    titleAr: "النقل العام",        cat: "mobility",  icon: "ri-bus-line",            desc: "Bus and taxi usage, route pattern flags.",               descAr: "استخدام الحافلات وسيارات الأجرة.",             metric: "2.0k/h" },
  { num: "10", title: "Education",    titleAr: "التعليم",            cat: "education", icon: "ri-graduation-cap-line", desc: "Enrollment, visa extensions, transfers.",                descAr: "التسجيل وتمديدات التأشيرة والتحويلات.",        metric: "280/h" },
  { num: "11", title: "Employment",   titleAr: "التوظيف",            cat: "labor",     icon: "ri-briefcase-line",      desc: "Work permits, contract events, employer changes.",       descAr: "تصاريح العمل وأحداث العقود.",                  metric: "540/h" },
  { num: "12", title: "E-Commerce",   titleAr: "التجارة الإلكترونية",cat: "commerce",  icon: "ri-shopping-cart-line",  desc: "Online transactions, bulk-purchase detection.",          descAr: "المعاملات عبر الإنترنت واكتشاف الشراء الجماعي.", metric: "7.3k/h" },
  { num: "13", title: "Social",       titleAr: "وسائل التواصل",      cat: "digital",   icon: "ri-global-line",         desc: "Phone-account linkage, public-keyword monitoring.",      descAr: "ربط الأرقام بالحسابات ومراقبة الكلمات العامة.",  metric: "15k/h" },
  { num: "14", title: "Customs",      titleAr: "الجمارك والشحن",     cat: "customs",   icon: "ri-ship-line",           desc: "Declarations, cargo manifests, restricted goods.",       descAr: "الإقرارات وبيانات الشحن والبضائع المقيدة.",     metric: "1.1k/h" },
  { num: "15", title: "Marine",       titleAr: "البحرية",            cat: "maritime",  icon: "ri-anchor-line",         desc: "Marina docking, boat rentals, vessel movement.",         descAr: "رسو المارينا وتأجير القوارب.",                  metric: "420/h" },
  { num: "16", title: "Postal",       titleAr: "البريد",             cat: "postal",    icon: "ri-mail-send-line",      desc: "PO Box registrations, parcels, international mail.",     descAr: "تسجيل صناديق البريد والطرود والبريد الدولي.",  metric: "190/h" },
];

// Helpers ─────────────────────────────────────────────────────────────────────
export const isCoreStream = (s: Stream): boolean =>
  ["01", "02", "03", "04"].includes(s.num);

export const CORE_STREAMS: Stream[]     = STREAMS.filter(isCoreStream);
export const EXTENDED_STREAMS: Stream[] = STREAMS.filter((s) => !isCoreStream(s));
