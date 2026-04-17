export interface HsCodeEntry {
  code: string;
  descriptionEn: string;
  descriptionAr: string;
  category: string;
}

export interface CustomsOffice {
  id: string;
  nameEn: string;
  nameAr: string;
  type: "port" | "airport" | "land" | "postal" | "ftz";
  region: string;
}

export interface FreeZone {
  id: string;
  nameEn: string;
  nameAr: string;
  type: string;
}

export interface CustomsKpi {
  label: string;
  labelAr: string;
  value: string;
  delta: string;
  deltaUp: boolean;
  icon: string;
  color: string;
}

export interface RecentDeclaration {
  id: string;
  ref: string;
  type: "import" | "export" | "transit" | "freezone" | "seizure" | "personal";
  declarant: string;
  goods: string;
  value: string;
  channel: "green" | "yellow" | "red" | "pending";
  time: string;
  port: string;
}

export const customsOffices: CustomsOffice[] = [
  { id: "nca-hq",    nameEn: "National Customs Authority HQ",    nameAr: "المقر الرئيسي للجمارك الوطنية",   type: "port",    region: "Capital" },
  { id: "north-port",nameEn: "Northern Port Customs",            nameAr: "جمارك الميناء الشمالي",           type: "port",    region: "Northern" },
  { id: "south-port",nameEn: "Capital Seaport Customs",          nameAr: "جمارك الميناء البحري للعاصمة",    type: "port",    region: "Capital" },
  { id: "cap-air",   nameEn: "Capital International Airport",    nameAr: "مطار العاصمة الدولي",             type: "airport", region: "Capital" },
  { id: "south-air", nameEn: "Southern Airport Customs",         nameAr: "جمارك المطار الجنوبي",            type: "airport", region: "Southern" },
  { id: "east-land", nameEn: "Eastern Land Crossing",            nameAr: "المنفذ البري الشرقي",             type: "land",    region: "Eastern" },
  { id: "west-land", nameEn: "Western Land Crossing",            nameAr: "المنفذ البري الغربي",             type: "land",    region: "Western" },
  { id: "postal-hq", nameEn: "National Postal Customs",          nameAr: "جمارك البريد الوطني",             type: "postal",  region: "Capital" },
  { id: "csez",      nameEn: "Central Special Economic Zone",    nameAr: "المنطقة الاقتصادية الخاصة المركزية", type: "ftz", region: "Central" },
  { id: "south-ftz", nameEn: "Southern Airport Free Trade Zone", nameAr: "منطقة التجارة الحرة بالمطار الجنوبي", type: "ftz", region: "Southern" },
  { id: "north-ftz", nameEn: "Northern Free Trade Zone",         nameAr: "منطقة التجارة الحرة الشمالية",    type: "ftz",     region: "Northern" },
  { id: "border-ftz",nameEn: "Border Free Trade Zone",           nameAr: "منطقة التجارة الحرة الحدودية",    type: "ftz",     region: "Border" },
];

export const freeZones: FreeZone[] = [
  { id: "csez",      nameEn: "Central SEZ",                      nameAr: "المنطقة الاقتصادية الخاصة المركزية", type: "SEZ" },
  { id: "south-ftz", nameEn: "Southern Airport FTZ",             nameAr: "منطقة التجارة الحرة بالمطار الجنوبي", type: "FTZ" },
  { id: "north-ftz", nameEn: "Northern FTZ",                     nameAr: "منطقة التجارة الحرة الشمالية",    type: "FTZ" },
  { id: "border-ftz",nameEn: "Border FTZ",                       nameAr: "منطقة التجارة الحرة الحدودية",    type: "FTZ" },
];

export const hsCodes: HsCodeEntry[] = [
  { code: "8471.30", descriptionEn: "Portable automatic data processing machines", descriptionAr: "أجهزة معالجة البيانات المحمولة", category: "Electronics" },
  { code: "8703.23", descriptionEn: "Motor vehicles, cylinder capacity 1500-3000cc", descriptionAr: "سيارات، سعة أسطوانة 1500-3000 سم³", category: "Vehicles" },
  { code: "2710.19", descriptionEn: "Petroleum oils, not crude", descriptionAr: "زيوت بترولية، غير خام", category: "Petroleum" },
  { code: "3004.90", descriptionEn: "Medicaments, mixed or unmixed", descriptionAr: "أدوية، مخلوطة أو غير مخلوطة", category: "Pharmaceuticals" },
  { code: "8517.12", descriptionEn: "Telephones for cellular networks", descriptionAr: "هواتف للشبكات الخلوية", category: "Electronics" },
  { code: "6110.20", descriptionEn: "Jerseys, pullovers of cotton", descriptionAr: "سترات وبلوزات من القطن", category: "Textiles" },
  { code: "0901.11", descriptionEn: "Coffee, not roasted, not decaffeinated", descriptionAr: "قهوة، غير محمصة، غير منزوعة الكافيين", category: "Food" },
  { code: "7208.51", descriptionEn: "Flat-rolled products of iron, hot-rolled", descriptionAr: "منتجات مدلفنة مسطحة من الحديد", category: "Steel" },
  { code: "2204.21", descriptionEn: "Wine of fresh grapes, in containers ≤2L", descriptionAr: "نبيذ من عنب طازج، في حاويات ≤2 لتر", category: "Beverages" },
  { code: "9403.20", descriptionEn: "Other metal furniture", descriptionAr: "أثاث معدني آخر", category: "Furniture" },
  { code: "8544.42", descriptionEn: "Electric conductors, fitted with connectors", descriptionAr: "موصلات كهربائية مزودة بموصلات", category: "Electrical" },
  { code: "3926.90", descriptionEn: "Other articles of plastics", descriptionAr: "مواد بلاستيكية أخرى", category: "Plastics" },
];

export const countries: string[] = [
  "United Arab Emirates", "Saudi Arabia", "China", "India", "United States",
  "Germany", "United Kingdom", "Japan", "South Korea", "Turkey",
  "Italy", "France", "Netherlands", "Singapore", "Malaysia",
  "Pakistan", "Bangladesh", "Sri Lanka", "Egypt", "Jordan",
];

export const customsKpis: CustomsKpi[] = [
  { label: "Declarations Today",   labelAr: "إقرارات اليوم",        value: "1,847", delta: "+12%", deltaUp: true,  icon: "ri-file-list-3-line",     color: "#D6B47E" },
  { label: "Import Declarations",  labelAr: "إقرارات الاستيراد",    value: "1,203", delta: "+8%",  deltaUp: true,  icon: "ri-download-2-line",      color: "#4ADE80" },
  { label: "Export Declarations",  labelAr: "إقرارات التصدير",      value: "489",   delta: "+5%",  deltaUp: true,  icon: "ri-upload-2-line",        color: "#A78BFA" },
  { label: "Transit Movements",    labelAr: "حركات العبور",          value: "134",   delta: "+3%",  deltaUp: true,  icon: "ri-arrow-left-right-line",color: "#FACC15" },
  { label: "Free Zone Movements",  labelAr: "حركات المناطق الحرة",  value: "312",   delta: "+18%", deltaUp: true,  icon: "ri-store-2-line",         color: "#38BDF8" },
  { label: "Seizures Today",       labelAr: "ضبوط اليوم",           value: "7",     delta: "+2",   deltaUp: false, icon: "ri-shield-cross-line",    color: "#C94A5E" },
  { label: "Red Channel",          labelAr: "القناة الحمراء",        value: "43",    delta: "+6",   deltaUp: false, icon: "ri-alarm-warning-line",   color: "#C98A1B" },
  { label: "Duty Collected (LCY)", labelAr: "الرسوم المحصلة",       value: "284,500", delta: "+9%", deltaUp: true, icon: "ri-money-dollar-circle-line", color: "#FACC15" },
];

export const recentDeclarations: RecentDeclaration[] = [
  { id: "d1", ref: "AMN-CUS-2025-04891", type: "import",   declarant: "Al-Rashidi Trading LLC",      goods: "Electronic Components (HS: 8471.30)",  value: "OMR 45,200",  channel: "green",   time: "2 min ago",  port: "Capital International Airport" },
  { id: "d2", ref: "AMN-CUS-2025-04890", type: "export",   declarant: "Oman Fisheries Co.",          goods: "Frozen Fish (HS: 0303.89)",            value: "OMR 12,800",  channel: "green",   time: "5 min ago",  port: "Capital Seaport" },
  { id: "d3", ref: "AMN-CUS-2025-04889", type: "seizure",  declarant: "Unknown Consignee",           goods: "Undeclared Currency + Narcotics",       value: "OMR 85,000",  channel: "red",     time: "11 min ago", port: "Eastern Land Crossing" },
  { id: "d4", ref: "AMN-CUS-2025-04888", type: "transit",  declarant: "Gulf Logistics FZE",          goods: "Industrial Machinery (HS: 8479.89)",   value: "OMR 234,000", channel: "yellow",  time: "18 min ago", port: "Northern Port" },
  { id: "d5", ref: "AMN-CUS-2025-04887", type: "freezone", declarant: "Central SEZ Manufacturing",   goods: "Steel Coils (HS: 7208.51)",            value: "OMR 67,400",  channel: "green",   time: "24 min ago", port: "Central SEZ" },
  { id: "d6", ref: "AMN-CUS-2025-04886", type: "import",   declarant: "National Pharma Distribution",goods: "Medicaments (HS: 3004.90)",            value: "OMR 189,300", channel: "yellow",  time: "31 min ago", port: "Capital International Airport" },
  { id: "d7", ref: "AMN-CUS-2025-04885", type: "personal", declarant: "Ahmed Khalid Al-Balushi",     goods: "Personal Effects — Unaccompanied",     value: "OMR 3,200",   channel: "green",   time: "38 min ago", port: "Capital International Airport" },
  { id: "d8", ref: "AMN-CUS-2025-04884", type: "export",   declarant: "Oman Cement Company",         goods: "Portland Cement (HS: 2523.29)",        value: "OMR 28,900",  channel: "green",   time: "45 min ago", port: "Capital Seaport" },
  { id: "d9", ref: "AMN-CUS-2025-04883", type: "import",   declarant: "Al-Amri Automotive Group",    goods: "Motor Vehicles (HS: 8703.23)",         value: "OMR 412,000", channel: "red",     time: "52 min ago", port: "Capital Seaport" },
  { id: "d10",ref: "AMN-CUS-2025-04882", type: "transit",  declarant: "Trans-Gulf Shipping LLC",     goods: "Petroleum Products (HS: 2710.19)",     value: "OMR 1,240,000",channel:"green",   time: "1 hr ago",   port: "Northern Port" },
];

export const seizureReasons = [
  { id: "prohibited",   labelEn: "Prohibited Goods",          labelAr: "بضائع محظورة" },
  { id: "restricted",   labelEn: "Restricted Without Permit", labelAr: "مقيدة بدون تصريح" },
  { id: "misdeclared",  labelEn: "Misdeclared Goods",         labelAr: "بضائع مُصرَّح عنها بشكل خاطئ" },
  { id: "ipr",          labelEn: "IPR Violation (Counterfeit)",labelAr: "انتهاك حقوق الملكية الفكرية" },
  { id: "undeclared",   labelEn: "Undeclared Goods",          labelAr: "بضائع غير مُصرَّح عنها" },
  { id: "currency",     labelEn: "Undeclared Currency",       labelAr: "عملة غير مُصرَّح عنها" },
  { id: "narcotics",    labelEn: "Narcotics / Controlled Substances", labelAr: "مخدرات / مواد خاضعة للرقابة" },
  { id: "weapons",      labelEn: "Weapons / Ammunition",      labelAr: "أسلحة / ذخيرة" },
];

export const shippingMethods = [
  { id: "sea",  labelEn: "Sea Freight",  labelAr: "شحن بحري" },
  { id: "air",  labelEn: "Air Freight",  labelAr: "شحن جوي" },
  { id: "land", labelEn: "Land/Road",    labelAr: "بري / طريق" },
  { id: "post", labelEn: "Postal",       labelAr: "بريدي" },
  { id: "rail", labelEn: "Rail",         labelAr: "سكة حديد" },
];

export const fzPurposes = [
  { id: "manufacturing", labelEn: "Manufacturing",  labelAr: "تصنيع" },
  { id: "storage",       labelEn: "Storage/Warehousing", labelAr: "تخزين / مستودع" },
  { id: "reexport",      labelEn: "Re-Export",      labelAr: "إعادة تصدير" },
  { id: "local-sale",    labelEn: "Local Sale",     labelAr: "بيع محلي" },
  { id: "processing",    labelEn: "Processing",     labelAr: "معالجة" },
  { id: "exhibition",    labelEn: "Exhibition",     labelAr: "معرض" },
];
