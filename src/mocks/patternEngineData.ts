export type RiskLevel = "low" | "medium" | "high" | "critical";
export type RuleCategory = "arrival" | "accommodation" | "financial" | "identity" | "employment" | "maritime" | "customs";

export interface PatternRule {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  category: RuleCategory;
  riskLevel: RiskLevel;
  streams: string[];
  conditions: string[];
  conditionsAr: string[];
  actions: string[];
  actionsAr: string[];
  enabled: boolean;
  hitCount: number;
  lastTriggered: string;
  timeframe: string;
  timeframeAr: string;
}

export interface CustomRule {
  id: string;
  name: string;
  conditions: RuleCondition[];
  timeframe: string;
  alertLevel: RiskLevel;
  actions: string[];
  enabled: boolean;
  hitCount: number;
}

export interface RuleCondition {
  id: string;
  stream: string;
  event: string;
  operator: string;
  value: string;
  logic?: "AND" | "OR";
}

export interface TestResult {
  ruleId: string;
  ruleName: string;
  ruleNameAr: string;
  triggered: boolean;
  riskLevel: RiskLevel;
  matchedConditions: string[];
  matchedConditionsAr: string[];
  timestamp: string;
}

export const CATEGORY_META: Record<RuleCategory, { label: string; labelAr: string; icon: string; color: string }> = {
  arrival:       { label: "Arrival Patterns",    labelAr: "أنماط الوصول",      icon: "ri-passport-line",        color: "#60A5FA" },
  accommodation: { label: "Accommodation",        labelAr: "الإقامة",            icon: "ri-hotel-line",           color: "#D4A84B" },
  financial:     { label: "Financial",            labelAr: "المالية",            icon: "ri-bank-card-line",       color: "#4ADE80" },
  identity:      { label: "Identity",             labelAr: "الهوية",             icon: "ri-fingerprint-line",     color: "#A78BFA" },
  employment:    { label: "Employment",           labelAr: "التوظيف",            icon: "ri-briefcase-line",       color: "#F9A8D4" },
  maritime:      { label: "Maritime",             labelAr: "البحرية",            icon: "ri-ship-line",            color: "#38BDF8" },
  customs:       { label: "Customs & Cargo",      labelAr: "الجمارك والشحن",     icon: "ri-box-3-line",           color: "#FACC15" },
};

export const RISK_CONFIG: Record<RiskLevel, { color: string; bg: string; border: string; label: string; labelAr: string }> = {
  low:      { color: "#4ADE80", bg: "rgba(74,222,128,0.08)",   border: "rgba(74,222,128,0.25)",   label: "Low",      labelAr: "منخفض" },
  medium:   { color: "#FACC15", bg: "rgba(250,204,21,0.08)",   border: "rgba(250,204,21,0.25)",   label: "Medium",   labelAr: "متوسط" },
  high:     { color: "#FB923C", bg: "rgba(251,146,60,0.08)",   border: "rgba(251,146,60,0.25)",   label: "High",     labelAr: "عالٍ"  },
  critical: { color: "#F87171", bg: "rgba(248,113,113,0.08)",  border: "rgba(248,113,113,0.25)",  label: "Critical", labelAr: "حرج"   },
};

export const PRE_BUILT_RULES: PatternRule[] = [
  // ARRIVAL
  {
    id: "R001", name: "Ghost Arrival",          nameAr: "وصول خفي",
    description: "Person arrives at border with no hotel check-in within 24 hours",
    descriptionAr: "شخص يصل الحدود دون تسجيل فندقي خلال 24 ساعة",
    category: "arrival", riskLevel: "high", streams: ["Border", "Hotel"],
    conditions: ["Border: Entry Recorded", "Hotel: No check-in EXISTS within 24h"],
    conditionsAr: ["الحدود: تسجيل دخول", "الفندق: لا يوجد تسجيل خلال 24 ساعة"],
    actions: ["Create Alert", "Assign to Team"],
    actionsAr: ["إنشاء تنبيه", "تعيين لفريق"],
    enabled: true, hitCount: 47, lastTriggered: "14:32:07", timeframe: "24 hours", timeframeAr: "24 ساعة",
  },
  {
    id: "R002", name: "Rapid Setup",            nameAr: "إعداد سريع",
    description: "Arrival + SIM activation + car rental within 6 hours, no hotel",
    descriptionAr: "وصول + تفعيل شريحة + تأجير سيارة خلال 6 ساعات بدون فندق",
    category: "arrival", riskLevel: "medium", streams: ["Border", "Mobile", "Car Rental"],
    conditions: ["Border: Entry Recorded", "Mobile: SIM Activation within 6h", "Car Rental: Booking within 6h", "Hotel: No check-in EXISTS"],
    conditionsAr: ["الحدود: دخول", "الاتصالات: تفعيل شريحة خلال 6 ساعات", "السيارات: حجز خلال 6 ساعات", "الفندق: لا يوجد تسجيل"],
    actions: ["Create Alert"],
    actionsAr: ["إنشاء تنبيه"],
    enabled: true, hitCount: 23, lastTriggered: "13:15:44", timeframe: "6 hours", timeframeAr: "6 ساعات",
  },
  {
    id: "R003", name: "Frequent Crosser",       nameAr: "عابر متكرر",
    description: "More than 5 border crossings within 30 days",
    descriptionAr: "أكثر من 5 عبورات حدودية خلال 30 يوماً",
    category: "arrival", riskLevel: "medium", streams: ["Border"],
    conditions: ["Border: Entry/Exit COUNT > 5 within 30 days"],
    conditionsAr: ["الحدود: عدد الدخول/الخروج > 5 خلال 30 يوماً"],
    actions: ["Create Alert", "Add to Watchlist"],
    actionsAr: ["إنشاء تنبيه", "إضافة لقائمة المراقبة"],
    enabled: true, hitCount: 112, lastTriggered: "12:44:10", timeframe: "30 days", timeframeAr: "30 يوماً",
  },
  // ACCOMMODATION
  {
    id: "R004", name: "Hotel Hopping",          nameAr: "تنقل فندقي",
    description: "Hotel check-out and new check-in at different hotel within 1-2 days, 3+ times",
    descriptionAr: "مغادرة فندق وتسجيل في فندق آخر خلال 1-2 يوم، 3 مرات أو أكثر",
    category: "accommodation", riskLevel: "medium", streams: ["Hotel"],
    conditions: ["Hotel: Check-out → Check-in different property within 48h", "COUNT >= 3"],
    conditionsAr: ["الفندق: خروج → دخول فندق مختلف خلال 48 ساعة", "العدد >= 3"],
    actions: ["Create Alert"],
    actionsAr: ["إنشاء تنبيه"],
    enabled: true, hitCount: 31, lastTriggered: "11:30:05", timeframe: "7 days", timeframeAr: "7 أيام",
  },
  {
    id: "R005", name: "Unregistered Stay",      nameAr: "إقامة غير مسجلة",
    description: "Active car rental with no hotel registration for 48+ hours",
    descriptionAr: "تأجير سيارة نشط بدون تسجيل فندقي لمدة 48 ساعة أو أكثر",
    category: "accommodation", riskLevel: "high", streams: ["Car Rental", "Hotel"],
    conditions: ["Car Rental: Active rental EXISTS", "Hotel: No active registration", "Duration > 48h"],
    conditionsAr: ["السيارات: تأجير نشط", "الفندق: لا يوجد تسجيل نشط", "المدة > 48 ساعة"],
    actions: ["Create Alert", "Assign to Team"],
    actionsAr: ["إنشاء تنبيه", "تعيين لفريق"],
    enabled: true, hitCount: 18, lastTriggered: "10:55:33", timeframe: "48 hours", timeframeAr: "48 ساعة",
  },
  {
    id: "R006", name: "Address Mismatch",       nameAr: "تعارض العنوان",
    description: "Utility service active at address with no rental agreement registered",
    descriptionAr: "خدمة مرافق نشطة في عنوان بدون عقد إيجار مسجل",
    category: "accommodation", riskLevel: "medium", streams: ["Utility", "Municipality"],
    conditions: ["Utility: Active connection at address", "Municipality: No lease agreement for address"],
    conditionsAr: ["المرافق: توصيل نشط في العنوان", "البلدية: لا يوجد عقد إيجار للعنوان"],
    actions: ["Create Alert"],
    actionsAr: ["إنشاء تنبيه"],
    enabled: true, hitCount: 64, lastTriggered: "09:22:18", timeframe: "Current", timeframeAr: "حالي",
  },
  // FINANCIAL
  {
    id: "R007", name: "Arrival Cash",           nameAr: "نقد عند الوصول",
    description: "Cash deposit exceeding 5,000 local currency within 48 hours of border arrival",
    descriptionAr: "إيداع نقدي يتجاوز 5000 خلال 48 ساعة من الوصول",
    category: "financial", riskLevel: "high", streams: ["Border", "Financial"],
    conditions: ["Border: Entry Recorded", "Financial: Cash deposit > 5,000 within 48h"],
    conditionsAr: ["الحدود: تسجيل دخول", "المالية: إيداع نقدي > 5000 خلال 48 ساعة"],
    actions: ["Create Alert", "Auto-Escalate"],
    actionsAr: ["إنشاء تنبيه", "تصعيد تلقائي"],
    enabled: true, hitCount: 9, lastTriggered: "08:14:22", timeframe: "48 hours", timeframeAr: "48 ساعة",
  },
  {
    id: "R008", name: "Suspicious Transfer",    nameAr: "تحويل مشبوه",
    description: "Wire transfer to high-risk country within 7 days of border arrival",
    descriptionAr: "تحويل بنكي لدولة عالية المخاطر خلال 7 أيام من الوصول",
    category: "financial", riskLevel: "critical", streams: ["Border", "Financial"],
    conditions: ["Border: Entry Recorded within 7d", "Financial: Wire transfer to high-risk jurisdiction"],
    conditionsAr: ["الحدود: دخول خلال 7 أيام", "المالية: تحويل لدولة عالية المخاطر"],
    actions: ["Create Alert", "Auto-Escalate", "Push to Mobile"],
    actionsAr: ["إنشاء تنبيه", "تصعيد تلقائي", "إشعار موبايل"],
    enabled: true, hitCount: 4, lastTriggered: "14:28:33", timeframe: "7 days", timeframeAr: "7 أيام",
  },
  {
    id: "R009", name: "Exchange Pattern",       nameAr: "نمط صرف العملات",
    description: "3 or more currency exchange transactions within the same week",
    descriptionAr: "3 معاملات صرف عملات أو أكثر في نفس الأسبوع",
    category: "financial", riskLevel: "medium", streams: ["Financial"],
    conditions: ["Financial: Currency exchange COUNT >= 3 within 7 days"],
    conditionsAr: ["المالية: عدد معاملات الصرف >= 3 خلال 7 أيام"],
    actions: ["Create Alert"],
    actionsAr: ["إنشاء تنبيه"],
    enabled: true, hitCount: 28, lastTriggered: "13:44:12", timeframe: "7 days", timeframeAr: "7 أيام",
  },
  {
    id: "R010", name: "Structuring Pattern",    nameAr: "نمط التجزئة",
    description: "10+ cash transactions each under 1,000 local currency within 48 hours",
    descriptionAr: "10+ معاملات نقدية كل منها أقل من 1000 خلال 48 ساعة",
    category: "financial", riskLevel: "critical", streams: ["Financial"],
    conditions: ["Financial: Cash transactions COUNT > 10 within 48h", "Each transaction amount < 1,000"],
    conditionsAr: ["المالية: عدد المعاملات النقدية > 10 خلال 48 ساعة", "كل معاملة < 1000"],
    actions: ["Create Alert", "Auto-Escalate", "Add to Watchlist"],
    actionsAr: ["إنشاء تنبيه", "تصعيد تلقائي", "إضافة لقائمة المراقبة"],
    enabled: true, hitCount: 3, lastTriggered: "14:28:33", timeframe: "48 hours", timeframeAr: "48 ساعة",
  },
  // IDENTITY
  {
    id: "R011", name: "SIM Swapping",           nameAr: "تبديل الشريحة",
    description: "Same IMEI device used with different SIM cards within 48 hours",
    descriptionAr: "نفس جهاز IMEI مع شرائح مختلفة خلال 48 ساعة",
    category: "identity", riskLevel: "high", streams: ["Mobile"],
    conditions: ["Mobile: Same IMEI", "Mobile: Different SIM activated within 48h", "COUNT >= 2"],
    conditionsAr: ["الاتصالات: نفس IMEI", "الاتصالات: شريحة مختلفة خلال 48 ساعة", "العدد >= 2"],
    actions: ["Create Alert", "Push to Mobile"],
    actionsAr: ["إنشاء تنبيه", "إشعار موبايل"],
    enabled: true, hitCount: 15, lastTriggered: "12:10:00", timeframe: "48 hours", timeframeAr: "48 ساعة",
  },
  {
    id: "R012", name: "Identity Conflict",      nameAr: "تعارض الهوية",
    description: "Document data inconsistency detected across 2+ streams",
    descriptionAr: "تناقض في بيانات الوثائق عبر مصدرين أو أكثر",
    category: "identity", riskLevel: "critical", streams: ["Border", "Hotel", "Employment", "Municipality"],
    conditions: ["Cross-stream: Document field mismatch", "Streams affected >= 2"],
    conditionsAr: ["عبر المصادر: تناقض في حقل الوثيقة", "المصادر المتأثرة >= 2"],
    actions: ["Create Alert", "Auto-Escalate", "Add to Watchlist"],
    actionsAr: ["إنشاء تنبيه", "تصعيد تلقائي", "إضافة لقائمة المراقبة"],
    enabled: true, hitCount: 7, lastTriggered: "11:15:00", timeframe: "Current", timeframeAr: "حالي",
  },
  {
    id: "R013", name: "OSINT Alert",            nameAr: "تنبيه OSINT",
    description: "Phone number linked to flagged social media content or keyword match",
    descriptionAr: "رقم هاتف مرتبط بمحتوى مُبلَّغ أو تطابق كلمة مفتاحية",
    category: "identity", riskLevel: "high", streams: ["Mobile", "Social"],
    conditions: ["Mobile: Phone number registered", "Social: Linked account flagged OR keyword match"],
    conditionsAr: ["الاتصالات: رقم هاتف مسجل", "التواصل: حساب مرتبط مُبلَّغ أو تطابق كلمة مفتاحية"],
    actions: ["Create Alert", "Assign to Team"],
    actionsAr: ["إنشاء تنبيه", "تعيين لفريق"],
    enabled: true, hitCount: 22, lastTriggered: "14:30:28", timeframe: "Current", timeframeAr: "حالي",
  },
  {
    id: "R014", name: "Multiple Identities",    nameAr: "هويات متعددة",
    description: "Same biometric linked to 2+ different document numbers",
    descriptionAr: "نفس البيومترية مرتبطة بـ 2+ أرقام وثائق مختلفة",
    category: "identity", riskLevel: "critical", streams: ["Border", "Employment"],
    conditions: ["Biometric: Same fingerprint/face", "Documents: Different ID numbers >= 2"],
    conditionsAr: ["البيومترية: نفس البصمة/الوجه", "الوثائق: أرقام هوية مختلفة >= 2"],
    actions: ["Create Alert", "Auto-Escalate", "Push to Mobile"],
    actionsAr: ["إنشاء تنبيه", "تصعيد تلقائي", "إشعار موبايل"],
    enabled: false, hitCount: 2, lastTriggered: "2026-01-10", timeframe: "All time", timeframeAr: "كل الوقت",
  },
  // EMPLOYMENT
  {
    id: "R015", name: "Overstay Worker",        nameAr: "عامل متجاوز",
    description: "Work permit terminated with no exit record after 30 days",
    descriptionAr: "إلغاء تصريح عمل بدون سجل خروج بعد 30 يوماً",
    category: "employment", riskLevel: "high", streams: ["Employment", "Border"],
    conditions: ["Employment: Permit cancelled/terminated", "Border: No exit record within 30d"],
    conditionsAr: ["التوظيف: إلغاء/إنهاء التصريح", "الحدود: لا سجل خروج خلال 30 يوماً"],
    actions: ["Create Alert", "Assign to Team", "Add to Watchlist"],
    actionsAr: ["إنشاء تنبيه", "تعيين لفريق", "إضافة لقائمة المراقبة"],
    enabled: true, hitCount: 38, lastTriggered: "10:00:00", timeframe: "30 days", timeframeAr: "30 يوماً",
  },
  {
    id: "R016", name: "Visa Misuse",            nameAr: "إساءة استخدام التأشيرة",
    description: "Student visa holder with no course attendance but active employment activity",
    descriptionAr: "حامل تأشيرة طالب بدون حضور دراسي مع نشاط توظيف",
    category: "employment", riskLevel: "critical", streams: ["Education", "Employment", "Border"],
    conditions: ["Border: Student visa active", "Education: No attendance record 30d", "Employment: Work activity detected"],
    conditionsAr: ["الحدود: تأشيرة طالب نشطة", "التعليم: لا سجل حضور 30 يوماً", "التوظيف: نشاط عمل مكتشف"],
    actions: ["Create Alert", "Auto-Escalate"],
    actionsAr: ["إنشاء تنبيه", "تصعيد تلقائي"],
    enabled: true, hitCount: 11, lastTriggered: "09:00:00", timeframe: "30 days", timeframeAr: "30 يوماً",
  },
  {
    id: "R017", name: "Employer Churn",         nameAr: "تغيير متكرر للعمل",
    description: "3+ employer changes within 6 months",
    descriptionAr: "3+ تغييرات لصاحب عمل خلال 6 أشهر",
    category: "employment", riskLevel: "medium", streams: ["Employment"],
    conditions: ["Employment: Employer change COUNT >= 3 within 180 days"],
    conditionsAr: ["التوظيف: عدد تغييرات صاحب العمل >= 3 خلال 180 يوماً"],
    actions: ["Create Alert"],
    actionsAr: ["إنشاء تنبيه"],
    enabled: true, hitCount: 19, lastTriggered: "08:00:00", timeframe: "6 months", timeframeAr: "6 أشهر",
  },
  // MARITIME
  {
    id: "R018", name: "Maritime Risk",          nameAr: "مخاطر بحرية",
    description: "Boat rental with no hotel registration and recent border arrival",
    descriptionAr: "تأجير قارب بدون تسجيل فندقي ووصول حدودي حديث",
    category: "maritime", riskLevel: "high", streams: ["Border", "Hotel", "Transport"],
    conditions: ["Border: Entry within 72h", "Transport: Boat/vessel rental", "Hotel: No registration EXISTS"],
    conditionsAr: ["الحدود: دخول خلال 72 ساعة", "النقل: تأجير قارب/سفينة", "الفندق: لا يوجد تسجيل"],
    actions: ["Create Alert", "Assign to Team"],
    actionsAr: ["إنشاء تنبيه", "تعيين لفريق"],
    enabled: true, hitCount: 5, lastTriggered: "2026-01-08", timeframe: "72 hours", timeframeAr: "72 ساعة",
  },
  {
    id: "R019", name: "Undocumented Maritime",  nameAr: "بحري غير موثق",
    description: "Vessel with unregistered passengers detected at port",
    descriptionAr: "سفينة بركاب غير مسجلين مكتشفة في الميناء",
    category: "maritime", riskLevel: "critical", streams: ["Border", "Transport"],
    conditions: ["Transport: Vessel manifest", "Border: Passenger count mismatch", "Unregistered persons > 0"],
    conditionsAr: ["النقل: بيان السفينة", "الحدود: تناقض في عدد الركاب", "أشخاص غير مسجلين > 0"],
    actions: ["Create Alert", "Auto-Escalate", "Push to Mobile"],
    actionsAr: ["إنشاء تنبيه", "تصعيد تلقائي", "إشعار موبايل"],
    enabled: true, hitCount: 1, lastTriggered: "2026-01-05", timeframe: "Real-time", timeframeAr: "فوري",
  },
  {
    id: "R020", name: "Night Crossing",         nameAr: "عبور ليلي",
    description: "Border crossing between 00:00–04:00 with no prior booking",
    descriptionAr: "عبور حدودي بين 00:00-04:00 بدون حجز مسبق",
    category: "arrival", riskLevel: "medium", streams: ["Border", "Hotel"],
    conditions: ["Border: Entry time between 00:00–04:00", "Hotel: No advance booking"],
    conditionsAr: ["الحدود: وقت الدخول بين 00:00-04:00", "الفندق: لا حجز مسبق"],
    actions: ["Create Alert"],
    actionsAr: ["إنشاء تنبيه"],
    enabled: true, hitCount: 44, lastTriggered: "04:12:33", timeframe: "Real-time", timeframeAr: "فوري",
  },
  {
    id: "R021", name: "Bulk Purchase + Arrival",nameAr: "شراء بالجملة + وصول",
    description: "Bulk e-commerce purchase within 48h of border arrival",
    descriptionAr: "شراء بالجملة إلكتروني خلال 48 ساعة من الوصول",
    category: "financial", riskLevel: "high", streams: ["Border", "E-Commerce"],
    conditions: ["Border: Entry within 48h", "E-Commerce: Bulk order quantity > 50 units"],
    conditionsAr: ["الحدود: دخول خلال 48 ساعة", "التجارة: طلب جملة > 50 وحدة"],
    actions: ["Create Alert", "Assign to Team"],
    actionsAr: ["إنشاء تنبيه", "تعيين لفريق"],
    enabled: true, hitCount: 8, lastTriggered: "14:30:52", timeframe: "48 hours", timeframeAr: "48 ساعة",
  },
  {
    id: "R022", name: "Utility Ghost",          nameAr: "مرافق خفية",
    description: "Utility connected at address with no person registered at that address",
    descriptionAr: "مرافق موصلة في عنوان بدون شخص مسجل في ذلك العنوان",
    category: "accommodation", riskLevel: "medium", streams: ["Utility", "Municipality", "Employment"],
    conditions: ["Utility: Active at address", "Municipality: No resident registered", "Employment: No work address match"],
    conditionsAr: ["المرافق: نشطة في العنوان", "البلدية: لا مقيم مسجل", "التوظيف: لا تطابق عنوان عمل"],
    actions: ["Create Alert"],
    actionsAr: ["إنشاء تنبيه"],
    enabled: false, hitCount: 14, lastTriggered: "2026-01-12", timeframe: "Current", timeframeAr: "حالي",
  },
  {
    id: "R023", name: "Coordinated Entry",      nameAr: "دخول منسق",
    description: "3+ persons with same nationality arriving within 2h, no prior connection",
    descriptionAr: "3+ أشخاص بنفس الجنسية يصلون خلال ساعتين بدون صلة سابقة",
    category: "arrival", riskLevel: "high", streams: ["Border"],
    conditions: ["Border: 3+ entries same nationality within 2h", "No shared booking/employer"],
    conditionsAr: ["الحدود: 3+ دخول نفس الجنسية خلال ساعتين", "لا حجز/صاحب عمل مشترك"],
    actions: ["Create Alert", "Auto-Escalate"],
    actionsAr: ["إنشاء تنبيه", "تصعيد تلقائي"],
    enabled: true, hitCount: 6, lastTriggered: "2026-01-14", timeframe: "2 hours", timeframeAr: "ساعتان",
  },
  {
    id: "R024", name: "Permit + No Exit",       nameAr: "تصريح + لا خروج",
    description: "Residence permit expired with no exit or renewal within 14 days",
    descriptionAr: "تصريح إقامة منتهٍ بدون خروج أو تجديد خلال 14 يوماً",
    category: "employment", riskLevel: "high", streams: ["Employment", "Border", "Municipality"],
    conditions: ["Employment: Permit expiry date passed", "Border: No exit within 14d", "Municipality: No renewal filed"],
    conditionsAr: ["التوظيف: انتهاء صلاحية التصريح", "الحدود: لا خروج خلال 14 يوماً", "البلدية: لا تجديد مقدم"],
    actions: ["Create Alert", "Add to Watchlist"],
    actionsAr: ["إنشاء تنبيه", "إضافة لقائمة المراقبة"],
    enabled: true, hitCount: 29, lastTriggered: "2026-01-13", timeframe: "14 days", timeframeAr: "14 يوماً",
  },
  {
    id: "R025", name: "Social + Financial Link",nameAr: "ربط اجتماعي-مالي",
    description: "Flagged social media account linked to financial transactions > 10,000 local currency",
    descriptionAr: "حساب تواصل اجتماعي مُبلَّغ مرتبط بمعاملات مالية > 10,000",
    category: "identity", riskLevel: "critical", streams: ["Social", "Financial"],
    conditions: ["Social: Account flagged", "Financial: Transactions > 10,000 within 30d"],
    conditionsAr: ["التواصل: حساب مُبلَّغ", "المالية: معاملات > 10,000 خلال 30 يوماً"],
    actions: ["Create Alert", "Auto-Escalate", "Assign to Team"],
    actionsAr: ["إنشاء تنبيه", "تصعيد تلقائي", "تعيين لفريق"],
    enabled: true, hitCount: 3, lastTriggered: "14:15:20", timeframe: "30 days", timeframeAr: "30 يوماً",
  },
  // CUSTOMS & CARGO
  {
    id: "R026", name: "Invoice Manipulation",   nameAr: "تلاعب بالفاتورة",
    description: "Declared cargo value vs estimated market value variance exceeds 50%",
    descriptionAr: "تباين بين القيمة المُعلنة للبضاعة والقيمة السوقية يتجاوز 50%",
    category: "customs", riskLevel: "high", streams: ["Customs", "Financial"],
    conditions: ["Customs: Import declaration filed", "Declared value vs market value variance > 50%"],
    conditionsAr: ["الجمارك: إعلان استيراد مقدم", "تباين القيمة المُعلنة مقابل السوقية > 50%"],
    actions: ["Create Alert", "Assign to Team"],
    actionsAr: ["إنشاء تنبيه", "تعيين لفريق"],
    enabled: true, hitCount: 17, lastTriggered: "13:22:10", timeframe: "Per declaration", timeframeAr: "لكل إعلان",
  },
  {
    id: "R027", name: "Coordinated Logistics",  nameAr: "لوجستيات منسقة",
    description: "Person arrives at border and cargo from same origin country arrives within 7 days",
    descriptionAr: "شخص يصل الحدود وبضاعة من نفس دولة المنشأ تصل خلال 7 أيام",
    category: "customs", riskLevel: "medium", streams: ["Border", "Customs"],
    conditions: ["Border: Person entry recorded", "Customs: Cargo from same origin country within 7d"],
    conditionsAr: ["الحدود: تسجيل دخول شخص", "الجمارك: بضاعة من نفس دولة المنشأ خلال 7 أيام"],
    actions: ["Create Alert"],
    actionsAr: ["إنشاء تنبيه"],
    enabled: true, hitCount: 24, lastTriggered: "12:05:44", timeframe: "7 days", timeframeAr: "7 أيام",
  },
  {
    id: "R028", name: "Sensitive Cargo",        nameAr: "بضاعة حساسة",
    description: "Restricted HS codes declared by first-time importer with no commercial history",
    descriptionAr: "رموز HS مقيدة مُعلنة من مستورد لأول مرة بدون تاريخ تجاري",
    category: "customs", riskLevel: "critical", streams: ["Customs", "Employment"],
    conditions: ["Customs: Restricted HS code in declaration", "Importer: First-time import (no prior record)", "Employment: No commercial registration"],
    conditionsAr: ["الجمارك: رمز HS مقيد في الإعلان", "المستورد: استيراد لأول مرة", "التوظيف: لا سجل تجاري"],
    actions: ["Create Alert", "Auto-Escalate", "Push to Mobile"],
    actionsAr: ["إنشاء تنبيه", "تصعيد تلقائي", "إشعار موبايل"],
    enabled: true, hitCount: 6, lastTriggered: "11:48:30", timeframe: "Per declaration", timeframeAr: "لكل إعلان",
  },
  {
    id: "R029", name: "Cargo Structuring",      nameAr: "تجزئة الشحنات",
    description: "5+ small shipments to same consignee within 30 days — possible structuring to avoid thresholds",
    descriptionAr: "5+ شحنات صغيرة لنفس المستلم خلال 30 يوماً — تجزئة محتملة لتجنب الحدود",
    category: "customs", riskLevel: "high", streams: ["Customs", "Financial"],
    conditions: ["Customs: Shipments to same consignee COUNT >= 5 within 30d", "Each shipment value < threshold"],
    conditionsAr: ["الجمارك: شحنات لنفس المستلم >= 5 خلال 30 يوماً", "قيمة كل شحنة < الحد"],
    actions: ["Create Alert", "Add to Watchlist"],
    actionsAr: ["إنشاء تنبيه", "إضافة لقائمة المراقبة"],
    enabled: true, hitCount: 11, lastTriggered: "10:33:15", timeframe: "30 days", timeframeAr: "30 يوماً",
  },
  {
    id: "R030", name: "FTZ Anomaly",            nameAr: "شذوذ المنطقة الحرة",
    description: "Cargo routed to Free Trade Zone with no commercial registration for consignee",
    descriptionAr: "بضاعة موجهة للمنطقة الحرة بدون سجل تجاري للمستلم",
    category: "customs", riskLevel: "high", streams: ["Customs", "Employment", "Financial"],
    conditions: ["Customs: Destination = Free Trade Zone", "Employment: Consignee has no commercial registration", "Financial: No prior trade transactions"],
    conditionsAr: ["الجمارك: الوجهة = المنطقة الحرة", "التوظيف: المستلم بدون سجل تجاري", "المالية: لا معاملات تجارية سابقة"],
    actions: ["Create Alert", "Assign to Team"],
    actionsAr: ["إنشاء تنبيه", "تعيين لفريق"],
    enabled: true, hitCount: 8, lastTriggered: "09:55:00", timeframe: "Per shipment", timeframeAr: "لكل شحنة",
  },
];

export const STREAM_OPTIONS = [
  "Border", "Hotel", "Car Rental", "Mobile", "Financial",
  "Municipality", "Utility", "Transport", "Employment",
  "Education", "E-Commerce", "Social", "Health", "Customs",
];

export const EVENT_OPTIONS: Record<string, string[]> = {
  "Border":     ["Entry Recorded", "Exit Recorded", "Visa Issued", "Overstay Alert", "Permit Expired"],
  "Hotel":      ["Check-In", "Check-Out", "Booking Created", "Booking Cancelled", "Room Change"],
  "Car Rental": ["Vehicle Pickup", "Vehicle Return", "Booking Created", "Extension"],
  "Mobile":     ["SIM Activation", "SIM Deactivation", "SIM Swap", "eSIM Provision", "Roaming Active"],
  "Financial":  ["Wire Transfer", "Cash Deposit", "Currency Exchange", "Account Opening", "Flagged Transaction"],
  "Municipality":["Lease Start", "Lease Renewal", "Lease Termination", "Address Update"],
  "Utility":    ["New Connection", "Disconnection", "Service Modified"],
  "Transport":  ["Journey", "Taxi Booking", "Route Flagged", "Vessel Rental"],
  "Employment": ["Permit Issued", "Permit Cancelled", "Employer Change", "Contract Signed"],
  "Education":  ["Enrollment", "Attendance Record", "Dropout Flag", "Visa Extension"],
  "E-Commerce": ["Purchase", "Bulk Order", "High-Value Transaction", "Merchant Registration"],
  "Social":     ["Account Flagged", "Keyword Alert", "Phone-Social Link", "Network Analysis"],
  "Health":     ["Patient Registration", "Emergency Admission", "Prescription Issued"],
  "Customs":    ["Import Declaration", "Export Declaration", "Cargo Manifest Filed", "Restricted Goods Alert", "TBML Pattern Detected", "Customs Clearance"],
};

export const OPERATOR_OPTIONS = [
  "equals", "not equals", "contains", "greater than", "less than",
  "in list", "not exists", "count >", "count <", "time since <", "time since >",
];

export const ACTION_OPTIONS = [
  "Create Alert", "Assign to Team", "Push to Mobile", "Auto-Escalate", "Add to Watchlist",
];

export const TEST_PERSON_RESULTS: Record<string, TestResult[]> = {
  "PRS-001": [
    { ruleId: "R001", ruleName: "Ghost Arrival",       ruleNameAr: "وصول خفي",         triggered: true,  riskLevel: "high",     matchedConditions: ["Border entry at 14:32:07", "No hotel check-in found within 24h"],                         matchedConditionsAr: ["دخول حدودي 14:32:07", "لا تسجيل فندقي خلال 24 ساعة"],                         timestamp: "14:32:07" },
    { ruleId: "R008", ruleName: "Suspicious Transfer", ruleNameAr: "تحويل مشبوه",      triggered: true,  riskLevel: "critical", matchedConditions: ["Border entry within 7 days", "Wire transfer 45,000 to HSBC London (high-risk)"],       matchedConditionsAr: ["دخول حدودي خلال 7 أيام", "تحويل 45,000 إلى HSBC لندن"],                   timestamp: "13:15:22" },
    { ruleId: "R010", ruleName: "Structuring Pattern", ruleNameAr: "نمط التجزئة",      triggered: true,  riskLevel: "critical", matchedConditions: ["12 cash transactions detected", "All under 1,000 threshold", "Within 48h window"],      matchedConditionsAr: ["12 معاملة نقدية مكتشفة", "جميعها أقل من 1000", "خلال 48 ساعة"],           timestamp: "11:30:05" },
    { ruleId: "R011", ruleName: "SIM Swapping",        ruleNameAr: "تبديل الشريحة",    triggered: true,  riskLevel: "high",     matchedConditions: ["Same IMEI: 358234091234567", "3 different SIMs activated within 30 days"],                  matchedConditionsAr: ["نفس IMEI: 358234091234567", "3 شرائح مختلفة خلال 30 يوماً"],                    timestamp: "12:44:10" },
    { ruleId: "R002", ruleName: "Rapid Setup",         ruleNameAr: "إعداد سريع",       triggered: false, riskLevel: "medium",   matchedConditions: ["Border entry matched", "SIM activation matched", "Car rental: NOT FOUND within 6h"],         matchedConditionsAr: ["دخول حدودي مطابق", "تفعيل شريحة مطابق", "تأجير سيارة: غير موجود خلال 6 ساعات"], timestamp: "14:32:07" },
    { ruleId: "R025", ruleName: "Social + Financial",  ruleNameAr: "ربط اجتماعي-مالي", triggered: false, riskLevel: "critical", matchedConditions: ["Financial transactions > 10,000 matched", "Social: No linked flagged account found"],       matchedConditionsAr: ["معاملات > 10,000 مطابقة", "التواصل: لا حساب مُبلَّغ مرتبط"],               timestamp: "—" },
  ],
  "PRS-002": [
    { ruleId: "R021", ruleName: "Bulk Purchase + Arrival", ruleNameAr: "شراء بالجملة + وصول", triggered: true, riskLevel: "high", matchedConditions: ["E-Commerce bulk order: 500 units", "No recent border entry — rule not fully triggered"], matchedConditionsAr: ["طلب جملة: 500 وحدة", "لا دخول حدودي حديث"], timestamp: "14:30:52" },
    { ruleId: "R017", ruleName: "Employer Churn",      ruleNameAr: "تغيير متكرر للعمل", triggered: true,  riskLevel: "medium",   matchedConditions: ["3 employer changes detected within 6 months"],                                               matchedConditionsAr: ["3 تغييرات لصاحب عمل خلال 6 أشهر"],                                            timestamp: "08:00:00" },
    { ruleId: "R009", ruleName: "Exchange Pattern",    ruleNameAr: "نمط صرف العملات",  triggered: false, riskLevel: "medium",   matchedConditions: ["Only 1 currency exchange found — threshold not met"],                                         matchedConditionsAr: ["معاملة صرف واحدة فقط — لم يُستوفَ الحد"],                                        timestamp: "—" },
  ],
};
