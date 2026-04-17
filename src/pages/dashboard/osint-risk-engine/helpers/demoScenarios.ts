// Demo scenario cards (F2). Each card maps to a ScoredRecord via
// `scenarioKey` === `record.demoScenario`. Used by the Queue tab to render
// the scrollable demo selector, and by the page shell to build the
// "scenario loaded" toast when a card is clicked.

export interface DemoScenarioCard {
  scenarioKey: string;
  titleEn: string;
  titleAr: string;
  narrativeEn: string;
  narrativeAr: string;
  teachingEn: string;
  teachingAr: string;
  icon: string;
  color: string;
}

export const DEMO_SCENARIO_CARDS: DemoScenarioCard[] = [
  {
    scenarioKey: "low-risk-routine",
    titleEn: "Low-risk routine",
    titleAr: "منخفض المخاطر — روتيني",
    narrativeEn: "Frequent business traveler, clean across every dimension.",
    narrativeAr: "مسافر أعمال متكرر — نظيف في كل الأبعاد.",
    teachingEn: "Baseline — shows what a calm record looks like end-to-end.",
    teachingAr: "خط الأساس — يُظهر الشكل النهائي لسجل خالٍ من الإشارات.",
    icon: "ri-check-double-line",
    color: "#4ADE80",
  },
  {
    scenarioKey: "borderline-context",
    titleEn: "Borderline — context-driven",
    titleAr: "حدّي — يعتمد على السياق",
    narrativeEn: "Origin advisory just escalated; context lifts score into review territory.",
    narrativeAr: "تحذير المنشأ تصاعد حديثاً؛ السياق يرفع الدرجة إلى منطقة المراجعة.",
    teachingEn: "Context layering — not the traveler, the moment.",
    teachingAr: "تراكم السياق — ليس المسافر بل التوقيت.",
    icon: "ri-scales-2-line",
    color: "#FACC15",
  },
  {
    scenarioKey: "high-risk-sponsor",
    titleEn: "High-risk — sponsor exposure",
    titleAr: "مرتفع — تعرّض الكفيل",
    narrativeEn: "Sponsor graph 2 hops from EU-sanctioned entity + 3 prior denials.",
    narrativeAr: "الكفيل ضمن درجتين من كيان خاضع للعقوبات + 3 رفضات سابقة.",
    teachingEn: "Entity + behavioral stack — why we insist on graph + history.",
    teachingAr: "الكيان + السلوك — يبرزان أهمية الرسم البياني والتاريخ.",
    icon: "ri-shield-cross-line",
    color: "#C94A5E",
  },
  {
    scenarioKey: "anomaly-driven",
    titleEn: "Anomaly-driven",
    titleAr: "مدفوع بالشذوذ",
    narrativeEn: "Routing + 62h APIS → hotel gap trigger Model 3 presence anomaly.",
    narrativeAr: "المسار + فجوة 62 ساعة بين APIS والفندق تُفعّل شذوذ النموذج الثالث.",
    teachingEn: "ML + sequence coherence together surface what rules miss.",
    teachingAr: "تعاون ML مع تماسك التسلسل يكشف ما تتجاوزه القواعد.",
    icon: "ri-radar-line",
    color: "#6B4FAE",
  },
  {
    scenarioKey: "health-overlap",
    titleEn: "Health overlap",
    titleAr: "تداخل صحي",
    narrativeEn: "Origin country in active WHO outbreak window at scan time.",
    narrativeAr: "بلد المنشأ ضمن نافذة تفشّ نشطة عند الفحص.",
    teachingEn: "Biosecurity dominance with everything else clean.",
    teachingAr: "هيمنة الأمن الحيوي مع نظافة باقي الإشارات.",
    icon: "ri-heart-pulse-line",
    color: "#FACC15",
  },
];
