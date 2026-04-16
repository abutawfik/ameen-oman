export interface FlaggedPerson {
  id: string;
  name: string;
  nameAr: string;
  docNumber: string;
  nationality: string;
  natCode: string;
  age: number;
  gender: "Male" | "Female";
  photo: string;
  riskScore: number;
  currentLocation: string;
  currentLocationAr: string;
  flagCategories: FlagCategory[];
  matchInfo: MatchInfo;
  timeline: TimelineEvent[];
  scoreBreakdown: StreamScore[];
  scoreHistory: ScorePoint[];
}

export interface FlagCategory {
  type: "watchlist" | "overstay" | "document" | "pattern" | "manual";
  label: string;
  labelAr: string;
  color: string;
  detail: string;
  detailAr: string;
}

export interface MatchInfo {
  database: string;
  databaseAr: string;
  confidence: "Exact" | "Partial" | "Alias";
  confidenceAr: string;
  matchedOn: string;
  matchedOnAr: string;
}

export interface TimelineEvent {
  id: string;
  stream: string;
  streamAr: string;
  icon: string;
  color: string;
  event: string;
  eventAr: string;
  detail: string;
  detailAr: string;
  timestamp: string;
  ref: string;
  risk: "clear" | "review" | "flagged";
}

export interface StreamScore {
  stream: string;
  streamAr: string;
  icon: string;
  color: string;
  weight: number;
  rawScore: number;
  contribution: number;
  multiplier: number;
  multiplierReason?: string;
}

export interface ScorePoint {
  date: string;
  score: number;
}

export interface StreamWeight {
  key: string;
  label: string;
  labelAr: string;
  icon: string;
  color: string;
  weight: number;
  defaultWeight: number;
}

export interface MultiplierRule {
  id: string;
  label: string;
  labelAr: string;
  multiplier: number;
  active: boolean;
  triggered: boolean;
  description: string;
  descriptionAr: string;
}

export const STREAM_WEIGHTS: StreamWeight[] = [
  { key: "hotel",        label: "Hotels",           labelAr: "الفنادق",              icon: "ri-hotel-line",           color: "#22D3EE", weight: 3,  defaultWeight: 3  },
  { key: "car",          label: "Car Rental",        labelAr: "تأجير السيارات",       icon: "ri-car-line",             color: "#4ADE80", weight: 4,  defaultWeight: 4  },
  { key: "mobile",       label: "Mobile / SIM",      labelAr: "الاتصالات",            icon: "ri-sim-card-line",        color: "#A78BFA", weight: 5,  defaultWeight: 5  },
  { key: "municipality", label: "Municipality",      labelAr: "البلديات",             icon: "ri-government-line",      color: "#FACC15", weight: 3,  defaultWeight: 3  },
  { key: "financial",    label: "Financial",         labelAr: "المالية",              icon: "ri-bank-card-line",       color: "#F87171", weight: 8,  defaultWeight: 8  },
  { key: "healthcare",   label: "Healthcare",        labelAr: "الرعاية الصحية",       icon: "ri-heart-pulse-line",     color: "#FB923C", weight: 2,  defaultWeight: 2  },
  { key: "tourism",      label: "Tourism",           labelAr: "السياحة",              icon: "ri-map-pin-line",         color: "#34D399", weight: 1,  defaultWeight: 1  },
  { key: "marine",       label: "Marine",            labelAr: "البحرية",              icon: "ri-ship-line",            color: "#60A5FA", weight: 6,  defaultWeight: 6  },
  { key: "postal",       label: "Postal",            labelAr: "البريد",               icon: "ri-mail-line",            color: "#F9A8D4", weight: 4,  defaultWeight: 4  },
  { key: "education",    label: "Education",         labelAr: "التعليم",              icon: "ri-graduation-cap-line",  color: "#C4B5FD", weight: 2,  defaultWeight: 2  },
  { key: "borders",      label: "Borders",           labelAr: "الحدود",               icon: "ri-passport-line",        color: "#38BDF8", weight: 7,  defaultWeight: 7  },
  { key: "utility",      label: "Utility",           labelAr: "المرافق",              icon: "ri-flashlight-line",      color: "#FDE68A", weight: 2,  defaultWeight: 2  },
  { key: "transport",    label: "Transport",         labelAr: "النقل",                icon: "ri-bus-line",             color: "#FB923C", weight: 3,  defaultWeight: 3  },
  { key: "employment",   label: "Employment",        labelAr: "التوظيف",              icon: "ri-briefcase-line",       color: "#F9A8D4", weight: 4,  defaultWeight: 4  },
  { key: "ecommerce",    label: "E-Commerce",        labelAr: "التجارة الإلكترونية",  icon: "ri-shopping-cart-line",   color: "#34D399", weight: 5,  defaultWeight: 5  },
  { key: "osint",        label: "OSINT / Social",    labelAr: "الاستخبارات الرقمية",  icon: "ri-global-line",          color: "#38BDF8", weight: 6,  defaultWeight: 6  },
  { key: "customs",      label: "Customs",           labelAr: "الجمارك",              icon: "ri-box-3-line",           color: "#FACC15", weight: 8,  defaultWeight: 8  },
];

export const MULTIPLIER_RULES: MultiplierRule[] = [
  { id: "m1", label: "Multiple SIMs within 7 days",      labelAr: "شرائح SIM متعددة خلال 7 أيام",      multiplier: 2.0, active: true, triggered: true,  description: "3+ SIM card purchases within 7 days on same IMEI device",                    descriptionAr: "3+ شرائح في 7 أيام على نفس الجهاز" },
  { id: "m2", label: "Hotel + Car + SIM within 24h",     labelAr: "فندق + سيارة + شريحة في 24 ساعة",  multiplier: 1.8, active: true, triggered: false, description: "Hotel check-in, car rental, and SIM activation all within 24 hours",          descriptionAr: "تسجيل فندق وتأجير سيارة وتفعيل شريحة في 24 ساعة" },
  { id: "m3", label: "Cash Deposit exceeds 5,000",       labelAr: "إيداع نقدي يتجاوز 5,000",           multiplier: 1.5, active: true, triggered: false, description: "Single cash deposit exceeding 5,000 local currency threshold",                 descriptionAr: "إيداع نقدي واحد يتجاوز حد 5,000" },
  { id: "m4", label: "Wire Transfer — High-Risk Country", labelAr: "تحويل بنكي — دولة عالية المخاطر",  multiplier: 2.5, active: true, triggered: true,  description: "Wire transfer to high-risk jurisdiction or previously flagged account",      descriptionAr: "تحويل إلى دولة عالية المخاطر أو حساب مُبلَّغ سابقاً" },
  { id: "m5", label: "No Hotel 24h After Border Entry",  labelAr: "لا فندق 24 ساعة بعد الدخول",        multiplier: 2.0, active: true, triggered: true,  description: "Border entry recorded with no hotel registration within 24 hours",          descriptionAr: "دخول حدودي مسجل بدون تسجيل فندقي في 24 ساعة" },
  { id: "m6", label: "Document Inconsistency",           labelAr: "تناقض في الوثائق",                  multiplier: 3.0, active: true, triggered: false, description: "Conflicting document data detected across two or more data streams",         descriptionAr: "بيانات وثائق متضاربة مكتشفة عبر مصدرين أو أكثر" },
  { id: "m7", label: "Absconding Worker",                labelAr: "عامل هارب",                         multiplier: 2.5, active: true, triggered: false, description: "Employment permit cancelled or expired with no exit record in border system", descriptionAr: "تصريح عمل ملغى أو منتهٍ بدون سجل خروج في نظام الحدود" },
];

export const FLAGGED_PERSONS: FlaggedPerson[] = [
  {
    id: "PRS-001",
    name: "Reza Tehrani",
    nameAr: "رضا طهراني",
    docNumber: "IR-A8823401",
    nationality: "Iranian",
    natCode: "IR",
    age: 34,
    gender: "Male",
    photo: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20middle%20eastern%20man%20in%20his%2030s%2C%20neutral%20expression%2C%20dark%20background%2C%20passport%20style%20photo%2C%20high%20quality%20portrait&width=120&height=120&seq=rp001&orientation=squarish",
    riskScore: 87,
    currentLocation: "Capital Airport Terminal 1",
    currentLocationAr: "مطار العاصمة — المبنى 1",
    flagCategories: [
      { type: "watchlist", label: "Watchlist Match",    labelAr: "تطابق قائمة المراقبة", color: "#F87171", detail: "Interpol Red Notice — Financial Crimes Unit, Case #IC-2024-8821",       detailAr: "نشرة إنتربول حمراء — وحدة الجرائم المالية، القضية #IC-2024-8821" },
      { type: "pattern",   label: "Pattern Alert",      labelAr: "تنبيه نمط",            color: "#A78BFA", detail: "Structuring pattern detected — 12 sub-threshold transfers in 6 days",  detailAr: "نمط تجزئة مكتشف — 12 تحويل دون الحد في 6 أيام" },
    ],
    matchInfo: {
      database: "Interpol + National Security DB",
      databaseAr: "إنتربول + قاعدة الأمن الوطني",
      confidence: "Exact",
      confidenceAr: "مطابقة تامة",
      matchedOn: "Passport Number + Biometric Hash",
      matchedOnAr: "رقم الجواز + البصمة البيومترية",
    },
    timeline: [
      { id: "t1",  stream: "Border",      streamAr: "الحدود",       icon: "ri-passport-line",        color: "#38BDF8", event: "Entry Recorded",         eventAr: "تسجيل دخول",          detail: "Capital Airport T1 — Tourist Visa 30d",                  detailAr: "مطار العاصمة T1 — تأشيرة سياحية 30 يوم",              timestamp: "14:32:07", ref: "BRD-2026-44891", risk: "flagged" },
      { id: "t2",  stream: "Financial",   streamAr: "المالية",      icon: "ri-bank-card-line",       color: "#F87171", event: "Wire Transfer",          eventAr: "تحويل بنكي",          detail: "OMR 45,000 → HSBC London — Flagged jurisdiction",        detailAr: "45,000 ر.ع → HSBC لندن — دولة مُبلَّغة",              timestamp: "13:15:22", ref: "PAY-2026-88234", risk: "flagged" },
      { id: "t3",  stream: "Mobile",      streamAr: "الاتصالات",    icon: "ri-sim-card-line",        color: "#A78BFA", event: "SIM Activation",         eventAr: "تفعيل شريحة",         detail: "3rd SIM this month — same IMEI 35891234567890",          detailAr: "الشريحة الثالثة هذا الشهر — نفس الجهاز",              timestamp: "12:44:10", ref: "MOB-2026-19234", risk: "review"  },
      { id: "t4",  stream: "Financial",   streamAr: "المالية",      icon: "ri-bank-card-line",       color: "#F87171", event: "Cash Deposit",           eventAr: "إيداع نقدي",          detail: "OMR 980 — 4th sub-threshold deposit this week",          detailAr: "980 ر.ع — الإيداع الرابع دون الحد هذا الأسبوع",       timestamp: "11:30:05", ref: "PAY-2026-88201", risk: "review"  },
      { id: "t5",  stream: "Transport",   streamAr: "النقل",        icon: "ri-bus-line",             color: "#FB923C", event: "Taxi Booking",           eventAr: "حجز تاكسي",           detail: "Airport → City Center — 18.4 km, Careem",               detailAr: "المطار → مركز المدينة — 18.4 كم، كريم",               timestamp: "10:55:33", ref: "TRN-2026-55234", risk: "clear"   },
      { id: "t6",  stream: "E-Commerce",  streamAr: "التجارة",      icon: "ri-shopping-cart-line",   color: "#34D399", event: "Online Purchase",        eventAr: "شراء إلكتروني",       detail: "OMR 234 — Electronics, TechNational Store",             detailAr: "234 ر.ع — إلكترونيات، متجر TechNational",             timestamp: "09:22:18", ref: "ECM-2026-77234", risk: "clear"   },
      { id: "t7",  stream: "OSINT",       streamAr: "الاستخبارات", icon: "ri-global-line",          color: "#38BDF8", event: "Social Media Flag",      eventAr: "تنبيه وسائل التواصل", detail: "Telegram channel membership — flagged group",           detailAr: "عضوية قناة تيليغرام — مجموعة مُبلَّغة",               timestamp: "08:10:00", ref: "OSI-2026-11234", risk: "flagged" },
      { id: "t8",  stream: "Customs",     streamAr: "الجمارك",      icon: "ri-box-3-line",           color: "#FACC15", event: "Parcel Declared",        eventAr: "إعلان طرد",           detail: "Electronics declared — value mismatch with receipt",    detailAr: "إلكترونيات مُعلنة — تناقض في القيمة مع الإيصال",      timestamp: "07:45:00", ref: "CST-2026-22134", risk: "review"  },
      { id: "t9",  stream: "Border",      streamAr: "الحدود",       icon: "ri-passport-line",        color: "#38BDF8", event: "Previous Entry",         eventAr: "دخول سابق",           detail: "Capital Airport — 2024-11-12, 14-day stay",             detailAr: "مطار العاصمة — 2024-11-12، إقامة 14 يوم",             timestamp: "2024-11-12", ref: "BRD-2024-38821", risk: "review" },
    ],
    scoreBreakdown: [
      { stream: "Financial",  streamAr: "المالية",      icon: "ri-bank-card-line",     color: "#F87171", weight: 8, rawScore: 92, contribution: 29.4, multiplier: 2.5, multiplierReason: "Wire to high-risk jurisdiction" },
      { stream: "Mobile",     streamAr: "الاتصالات",    icon: "ri-sim-card-line",      color: "#A78BFA", weight: 5, rawScore: 78, contribution: 14.0, multiplier: 2.0, multiplierReason: "Multiple SIMs within 7 days" },
      { stream: "Border",     streamAr: "الحدود",       icon: "ri-passport-line",      color: "#38BDF8", weight: 7, rawScore: 85, contribution: 21.3, multiplier: 2.0, multiplierReason: "No hotel 24h after arrival" },
      { stream: "OSINT",      streamAr: "الاستخبارات", icon: "ri-global-line",        color: "#38BDF8", weight: 6, rawScore: 70, contribution: 9.8,  multiplier: 1.0, multiplierReason: undefined },
      { stream: "Customs",    streamAr: "الجمارك",      icon: "ri-box-3-line",         color: "#FACC15", weight: 8, rawScore: 55, contribution: 7.9,  multiplier: 1.0, multiplierReason: undefined },
      { stream: "Transport",  streamAr: "النقل",        icon: "ri-bus-line",           color: "#FB923C", weight: 3, rawScore: 45, contribution: 4.8,  multiplier: 1.0, multiplierReason: undefined },
    ],
    scoreHistory: [
      { date: "Jan", score: 12 }, { date: "Feb", score: 18 }, { date: "Mar", score: 15 },
      { date: "Apr", score: 22 }, { date: "May", score: 35 }, { date: "Jun", score: 41 },
      { date: "Jul", score: 38 }, { date: "Aug", score: 55 }, { date: "Sep", score: 62 },
      { date: "Oct", score: 71 }, { date: "Nov", score: 79 }, { date: "Dec", score: 87 },
    ],
  },
  {
    id: "PRS-002",
    name: "Mohammed Al-Balushi",
    nameAr: "محمد البلوشي",
    docNumber: "OM-C3312891",
    nationality: "National",
    natCode: "NAT",
    age: 41,
    gender: "Male",
    photo: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20middle%20eastern%20man%20in%20his%2040s%2C%20neutral%20expression%2C%20dark%20background%2C%20passport%20style%20photo%2C%20high%20quality%20portrait&width=120&height=120&seq=rp002&orientation=squarish",
    riskScore: 63,
    currentLocation: "City Center, Capital City",
    currentLocationAr: "مركز المدينة، العاصمة",
    flagCategories: [
      { type: "pattern",  label: "Pattern Alert",   labelAr: "تنبيه نمط",   color: "#A78BFA", detail: "Bulk medical supply purchase — 500 units, unusual quantity for individual", detailAr: "شراء مستلزمات طبية بالجملة — 500 وحدة، كمية غير معتادة لفرد" },
      { type: "manual",   label: "Manual Flag",     labelAr: "تنبيه يدوي",  color: "#9CA3AF", detail: "Flagged by Sgt. Al-Amri (Badge #4421) for further review",                 detailAr: "تنبيه من الرقيب العامري (شارة #4421) للمراجعة" },
    ],
    matchInfo: {
      database: "National Database",
      databaseAr: "قاعدة البيانات الوطنية",
      confidence: "Partial",
      confidenceAr: "مطابقة جزئية",
      matchedOn: "Purchase Pattern Analysis + Name",
      matchedOnAr: "تحليل نمط الشراء + الاسم",
    },
    timeline: [
      { id: "t1",  stream: "E-Commerce",  streamAr: "التجارة",      icon: "ri-shopping-cart-line",   color: "#34D399", event: "Bulk Order",             eventAr: "طلب بالجملة",         detail: "500 units medical supplies — flagged threshold",         detailAr: "500 وحدة مستلزمات طبية — تجاوز الحد المُبلَّغ",       timestamp: "14:30:52", ref: "ECM-2026-77233", risk: "flagged" },
      { id: "t2",  stream: "Financial",   streamAr: "المالية",      icon: "ri-bank-card-line",       color: "#F87171", event: "Large Payment",          eventAr: "دفعة كبيرة",          detail: "OMR 8,500 — single transaction, cash",                  detailAr: "8,500 ر.ع — معاملة واحدة، نقداً",                     timestamp: "14:28:10", ref: "PAY-2026-88220", risk: "review"  },
      { id: "t3",  stream: "Transport",   streamAr: "النقل",        icon: "ri-bus-line",             color: "#FB923C", event: "Cross-Region Trip",      eventAr: "رحلة بين مناطق",      detail: "Capital → Northern City — 3 trips this week",           detailAr: "العاصمة → المدينة الشمالية — 3 رحلات هذا الأسبوع",    timestamp: "11:15:00", ref: "TRN-2026-55210", risk: "review"  },
      { id: "t4",  stream: "Employment",  streamAr: "التوظيف",      icon: "ri-briefcase-line",       color: "#F9A8D4", event: "Employer Change",        eventAr: "تغيير صاحب عمل",      detail: "3rd employer change this year — pattern flagged",       detailAr: "تغيير صاحب العمل الثالث هذا العام — نمط مُبلَّغ",     timestamp: "08:00:00", ref: "EMP-2026-33210", risk: "review"  },
      { id: "t5",  stream: "Hotel",       streamAr: "الفنادق",      icon: "ri-hotel-line",           color: "#22D3EE", event: "Check-In",               eventAr: "تسجيل وصول",          detail: "Grand Muscat Hotel — Room 412, 3 nights",               detailAr: "فندق غراند مسقط — غرفة 412، 3 ليالٍ",                 timestamp: "07:30:00", ref: "HTL-2026-22100", risk: "clear"   },
      { id: "t6",  stream: "Postal",      streamAr: "البريد",       icon: "ri-mail-line",            color: "#F9A8D4", event: "Package Received",       eventAr: "استلام طرد",          detail: "2 packages from UAE — contents undeclared",             detailAr: "طردان من الإمارات — المحتويات غير مُعلنة",             timestamp: "06:45:00", ref: "PST-2026-55100", risk: "review"  },
    ],
    scoreBreakdown: [
      { stream: "E-Commerce", streamAr: "التجارة",   icon: "ri-shopping-cart-line", color: "#34D399", weight: 5, rawScore: 88, contribution: 19.8, multiplier: 1.0, multiplierReason: undefined },
      { stream: "Financial",  streamAr: "المالية",   icon: "ri-bank-card-line",     color: "#F87171", weight: 8, rawScore: 65, contribution: 18.6, multiplier: 1.5, multiplierReason: "Cash deposit > 5,000" },
      { stream: "Transport",  streamAr: "النقل",     icon: "ri-bus-line",           color: "#FB923C", weight: 3, rawScore: 55, contribution: 5.9,  multiplier: 1.0, multiplierReason: undefined },
      { stream: "Employment", streamAr: "التوظيف",   icon: "ri-briefcase-line",     color: "#F9A8D4", weight: 4, rawScore: 48, contribution: 6.9,  multiplier: 1.0, multiplierReason: undefined },
      { stream: "Postal",     streamAr: "البريد",    icon: "ri-mail-line",          color: "#F9A8D4", weight: 4, rawScore: 40, contribution: 5.7,  multiplier: 1.0, multiplierReason: undefined },
    ],
    scoreHistory: [
      { date: "Jan", score: 8 }, { date: "Feb", score: 10 }, { date: "Mar", score: 12 },
      { date: "Apr", score: 15 }, { date: "May", score: 18 }, { date: "Jun", score: 22 },
      { date: "Jul", score: 28 }, { date: "Aug", score: 35 }, { date: "Sep", score: 44 },
      { date: "Oct", score: 52 }, { date: "Nov", score: 58 }, { date: "Dec", score: 63 },
    ],
  },
  {
    id: "PRS-003",
    name: "Unknown Subject",
    nameAr: "شخص مجهول",
    docNumber: "PK-B8401XXX",
    nationality: "Pakistani",
    natCode: "PK",
    age: 28,
    gender: "Male",
    photo: "https://readdy.ai/api/search-image?query=silhouette%20of%20unknown%20person%2C%20dark%20background%2C%20anonymous%20identity%2C%20intelligence%20surveillance%20style%2C%20no%20face%20visible%2C%20mystery%20figure&width=120&height=120&seq=rp003&orientation=squarish",
    riskScore: 71,
    currentLocation: "City Center Area (Last Known)",
    currentLocationAr: "منطقة مركز المدينة (آخر موقع معروف)",
    flagCategories: [
      { type: "overstay",  label: "Overstay",         labelAr: "تجاوز مدة الإقامة", color: "#FB923C", detail: "Visa expired 3 days ago — no exit record in border system",  detailAr: "انتهت التأشيرة منذ 3 أيام — لا سجل خروج في نظام الحدود" },
      { type: "document",  label: "Document Anomaly", labelAr: "تناقض في الوثائق",  color: "#FACC15", detail: "Passport data inconsistency across hotel and border streams", detailAr: "تناقض بيانات الجواز بين تدفقي الفنادق والحدود" },
    ],
    matchInfo: {
      database: "Immigration Database",
      databaseAr: "قاعدة بيانات الهجرة",
      confidence: "Exact",
      confidenceAr: "مطابقة تامة",
      matchedOn: "Passport Number + Entry Stamp",
      matchedOnAr: "رقم جواز السفر + ختم الدخول",
    },
    timeline: [
      { id: "t1",  stream: "Border",      streamAr: "الحدود",       icon: "ri-passport-line",        color: "#38BDF8", event: "Overstay Alert",         eventAr: "تنبيه تجاوز إقامة",   detail: "Visa expired 3 days ago — no exit recorded",            detailAr: "انتهت التأشيرة منذ 3 أيام — لا خروج مسجل",            timestamp: "14:29:50", ref: "BRD-2026-44888", risk: "flagged" },
      { id: "t2",  stream: "Mobile",      streamAr: "الاتصالات",    icon: "ri-sim-card-line",        color: "#A78BFA", event: "SIM Activation",         eventAr: "تفعيل شريحة",         detail: "Prepaid SIM — City Center branch, 2nd SIM",             detailAr: "شريحة مدفوعة مسبقاً — فرع مركز المدينة، الثانية",     timestamp: "12:10:00", ref: "MOB-2026-19200", risk: "review"  },
      { id: "t3",  stream: "Hotel",       streamAr: "الفنادق",      icon: "ri-hotel-line",           color: "#22D3EE", event: "No Registration",        eventAr: "لا تسجيل فندقي",      detail: "No hotel record since entry — 33 days",                 detailAr: "لا سجل فندقي منذ الدخول — 33 يوماً",                  timestamp: "2026-01-01", ref: "HTL-NONE", risk: "flagged" },
      { id: "t4",  stream: "Transport",   streamAr: "النقل",        icon: "ri-bus-line",             color: "#FB923C", event: "Bus Trip",               eventAr: "رحلة حافلة",          detail: "City Center → Industrial Area — 3 trips",               detailAr: "مركز المدينة → المنطقة الصناعية — 3 رحلات",            timestamp: "10:00:00", ref: "TRN-2026-55188", risk: "review"  },
      { id: "t5",  stream: "Border",      streamAr: "الحدود",       icon: "ri-passport-line",        color: "#38BDF8", event: "Entry Recorded",         eventAr: "تسجيل دخول",          detail: "Capital Airport — Tourist Visa 30d, 2026-01-01",        detailAr: "مطار العاصمة — تأشيرة سياحية 30 يوم، 2026-01-01",     timestamp: "2026-01-01", ref: "BRD-2026-44001", risk: "clear" },
    ],
    scoreBreakdown: [
      { stream: "Border",  streamAr: "الحدود",    icon: "ri-passport-line", color: "#38BDF8", weight: 7, rawScore: 90, contribution: 28.4, multiplier: 2.0, multiplierReason: "No hotel 24h after arrival" },
      { stream: "Mobile",  streamAr: "الاتصالات", icon: "ri-sim-card-line", color: "#A78BFA", weight: 5, rawScore: 55, contribution: 9.8,  multiplier: 1.0, multiplierReason: undefined },
      { stream: "Hotel",   streamAr: "الفنادق",   icon: "ri-hotel-line",    color: "#22D3EE", weight: 3, rawScore: 80, contribution: 8.6,  multiplier: 1.0, multiplierReason: undefined },
    ],
    scoreHistory: [
      { date: "Jan", score: 5 }, { date: "Feb", score: 5 }, { date: "Mar", score: 5 },
      { date: "Apr", score: 5 }, { date: "May", score: 5 }, { date: "Jun", score: 5 },
      { date: "Jul", score: 5 }, { date: "Aug", score: 5 }, { date: "Sep", score: 5 },
      { date: "Oct", score: 5 }, { date: "Nov", score: 5 }, { date: "Dec", score: 71 },
    ],
  },
  {
    id: "PRS-004",
    name: "Fatima Al-Zahrawi",
    nameAr: "فاطمة الزهراوي",
    docNumber: "SY-D2291044",
    nationality: "Syrian",
    natCode: "SY",
    age: 32,
    gender: "Female",
    photo: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20middle%20eastern%20woman%20in%20her%2030s%2C%20neutral%20expression%2C%20dark%20background%2C%20passport%20style%20photo%2C%20high%20quality%20portrait%2C%20hijab&width=120&height=120&seq=rp004&orientation=squarish",
    riskScore: 54,
    currentLocation: "Northern Governorate, Sohar",
    currentLocationAr: "المحافظة الشمالية، صحار",
    flagCategories: [
      { type: "document",  label: "Document Anomaly", labelAr: "تناقض في الوثائق",  color: "#FACC15", detail: "Alias name detected — 2 different spellings across streams",  detailAr: "اسم مستعار مكتشف — تهجئتان مختلفتان عبر المصادر" },
      { type: "overstay",  label: "Overstay Risk",    labelAr: "خطر تجاوز الإقامة", color: "#FB923C", detail: "Visa expires in 2 days — no renewal application filed",       detailAr: "التأشيرة تنتهي خلال يومين — لا طلب تجديد مقدم" },
    ],
    matchInfo: {
      database: "Previous Flagged Records",
      databaseAr: "سجلات مُبلَّغة سابقة",
      confidence: "Alias",
      confidenceAr: "مطابقة اسم مستعار",
      matchedOn: "Name Alias + Date of Birth",
      matchedOnAr: "الاسم المستعار + تاريخ الميلاد",
    },
    timeline: [
      { id: "t1",  stream: "Education",   streamAr: "التعليم",      icon: "ri-graduation-cap-line",  color: "#C4B5FD", event: "Enrollment",             eventAr: "تسجيل",               detail: "Sohar University — Arabic Literature, Semester 2",      detailAr: "جامعة صحار — الأدب العربي، الفصل الثاني",             timestamp: "09:00:00", ref: "EDU-2026-11200", risk: "clear"   },
      { id: "t2",  stream: "Employment",  streamAr: "التوظيف",      icon: "ri-briefcase-line",       color: "#F9A8D4", event: "Work Permit",            eventAr: "تصريح عمل",           detail: "Part-time permit — Al-Noor Trading Co.",                detailAr: "تصريح عمل جزئي — شركة النور للتجارة",                  timestamp: "08:30:00", ref: "EMP-2026-33188", risk: "clear"   },
      { id: "t3",  stream: "Border",      streamAr: "الحدود",       icon: "ri-passport-line",        color: "#38BDF8", event: "Entry Recorded",         eventAr: "تسجيل دخول",          detail: "Sohar Port — Student Visa, 2025-09-01",                 detailAr: "ميناء صحار — تأشيرة طالب، 2025-09-01",                timestamp: "2025-09-01", ref: "BRD-2025-38100", risk: "clear" },
      { id: "t4",  stream: "Financial",   streamAr: "المالية",      icon: "ri-bank-card-line",       color: "#F87171", event: "Account Opened",         eventAr: "فتح حساب",            detail: "Bank Muscat — Savings account, alias name used",        detailAr: "بنك مسقط — حساب توفير، استخدام اسم مستعار",           timestamp: "2025-09-15", ref: "PAY-2025-88100", risk: "review" },
      { id: "t5",  stream: "Utility",     streamAr: "المرافق",      icon: "ri-flashlight-line",      color: "#FDE68A", event: "New Connection",         eventAr: "اشتراك جديد",         detail: "Electricity — Apartment 3B, Al-Noor Complex",           detailAr: "كهرباء — شقة 3B، مجمع النور",                         timestamp: "2025-09-20", ref: "UTL-2025-77100", risk: "clear"   },
    ],
    scoreBreakdown: [
      { stream: "Border",     streamAr: "الحدود",    icon: "ri-passport-line",      color: "#38BDF8", weight: 7, rawScore: 60, contribution: 15.1, multiplier: 1.0, multiplierReason: undefined },
      { stream: "Financial",  streamAr: "المالية",   icon: "ri-bank-card-line",     color: "#F87171", weight: 8, rawScore: 55, contribution: 13.2, multiplier: 1.0, multiplierReason: undefined },
      { stream: "Education",  streamAr: "التعليم",   icon: "ri-graduation-cap-line",color: "#C4B5FD", weight: 2, rawScore: 30, contribution: 2.1,  multiplier: 1.0, multiplierReason: undefined },
      { stream: "Employment", streamAr: "التوظيف",   icon: "ri-briefcase-line",     color: "#F9A8D4", weight: 4, rawScore: 40, contribution: 5.7,  multiplier: 1.0, multiplierReason: undefined },
    ],
    scoreHistory: [
      { date: "Jan", score: 5 }, { date: "Feb", score: 5 }, { date: "Mar", score: 5 },
      { date: "Apr", score: 5 }, { date: "May", score: 5 }, { date: "Jun", score: 5 },
      { date: "Jul", score: 5 }, { date: "Aug", score: 5 }, { date: "Sep", score: 18 },
      { date: "Oct", score: 28 }, { date: "Nov", score: 42 }, { date: "Dec", score: 54 },
    ],
  },
  {
    id: "PRS-005",
    name: "Tariq Al-Rashidi",
    nameAr: "طارق الراشدي",
    docNumber: "OM-A1122334",
    nationality: "National",
    natCode: "NAT",
    age: 38,
    gender: "Male",
    photo: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20omani%20man%20in%20his%20late%2030s%2C%20neutral%20expression%2C%20dark%20background%2C%20passport%20style%20photo%2C%20high%20quality%20portrait%2C%20formal%20attire&width=120&height=120&seq=rp005&orientation=squarish",
    riskScore: 38,
    currentLocation: "Muscat Governorate, Ruwi",
    currentLocationAr: "محافظة مسقط، الروي",
    flagCategories: [
      { type: "manual",   label: "Manual Flag",     labelAr: "تنبيه يدوي",  color: "#9CA3AF", detail: "Flagged by analyst for unusual marine activity pattern",  detailAr: "تنبيه من المحلل لنمط نشاط بحري غير معتاد" },
    ],
    matchInfo: {
      database: "Internal Watchlist",
      databaseAr: "قائمة المراقبة الداخلية",
      confidence: "Partial",
      confidenceAr: "مطابقة جزئية",
      matchedOn: "Behavioral Pattern Analysis",
      matchedOnAr: "تحليل النمط السلوكي",
    },
    timeline: [
      { id: "t1",  stream: "Marine",      streamAr: "البحرية",      icon: "ri-ship-line",            color: "#60A5FA", event: "Boat Rental",            eventAr: "استئجار قارب",        detail: "Al-Mouj Marina — 8h rental, night trip",                detailAr: "مرسى الموج — إيجار 8 ساعات، رحلة ليلية",              timestamp: "22:00:00", ref: "MAR-2026-33100", risk: "review"  },
      { id: "t2",  stream: "Marine",      streamAr: "البحرية",      icon: "ri-ship-line",            color: "#60A5FA", event: "Diving Registration",    eventAr: "تسجيل غوص",          detail: "Daymaniyat Islands — 3rd dive this month",              detailAr: "جزر الديمانيات — الغوصة الثالثة هذا الشهر",            timestamp: "08:00:00", ref: "MAR-2026-33088", risk: "review"  },
      { id: "t3",  stream: "Car Rental",  streamAr: "تأجير السيارات",icon: "ri-car-line",            color: "#4ADE80", event: "Vehicle Rental",         eventAr: "استئجار مركبة",       detail: "4WD SUV — 3 days, Muscat to Salalah route",             detailAr: "دفع رباعي — 3 أيام، مسار مسقط إلى صلالة",             timestamp: "07:00:00", ref: "CAR-2026-44100", risk: "clear"   },
      { id: "t4",  stream: "Financial",   streamAr: "المالية",      icon: "ri-bank-card-line",       color: "#F87171", event: "Cash Withdrawal",        eventAr: "سحب نقدي",            detail: "OMR 2,000 — ATM, Ruwi branch",                          detailAr: "2,000 ر.ع — صراف آلي، فرع الروي",                     timestamp: "06:30:00", ref: "PAY-2026-88188", risk: "clear"   },
      { id: "t5",  stream: "Tourism",     streamAr: "السياحة",      icon: "ri-map-pin-line",         color: "#34D399", event: "Tour Booking",           eventAr: "حجز جولة",            detail: "Musandam Peninsula — 2-day boat tour",                  detailAr: "شبه جزيرة مسندم — جولة قارب يومين",                   timestamp: "05:00:00", ref: "TOR-2026-66100", risk: "clear"   },
    ],
    scoreBreakdown: [
      { stream: "Marine",    streamAr: "البحرية",      icon: "ri-ship-line",    color: "#60A5FA", weight: 6, rawScore: 65, contribution: 14.0, multiplier: 1.0, multiplierReason: undefined },
      { stream: "Financial", streamAr: "المالية",      icon: "ri-bank-card-line",color: "#F87171", weight: 8, rawScore: 35, contribution: 7.9,  multiplier: 1.0, multiplierReason: undefined },
      { stream: "Car Rental",streamAr: "تأجير السيارات",icon: "ri-car-line",    color: "#4ADE80", weight: 4, rawScore: 40, contribution: 5.7,  multiplier: 1.0, multiplierReason: undefined },
    ],
    scoreHistory: [
      { date: "Jan", score: 10 }, { date: "Feb", score: 12 }, { date: "Mar", score: 14 },
      { date: "Apr", score: 16 }, { date: "May", score: 18 }, { date: "Jun", score: 20 },
      { date: "Jul", score: 22 }, { date: "Aug", score: 25 }, { date: "Sep", score: 28 },
      { date: "Oct", score: 32 }, { date: "Nov", score: 35 }, { date: "Dec", score: 38 },
    ],
  },
];

export const AVERAGE_RISK_SCORE = 23;
