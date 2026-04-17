export type EntityType =
  | "hotel" | "car-rental" | "mobile" | "municipality"
  | "payment" | "borders" | "health" | "utility"
  | "transport" | "education" | "employment" | "ecommerce" | "social";

export interface KpiCard {
  key: string;
  label: string;
  labelAr: string;
  value: string;
  delta: string;
  deltaUp: boolean;
  icon: string;
  color: string;
  action: string;
  actionAr: string;
}

export interface EventFeedItem {
  id: string;
  type: string;
  typeAr: string;
  color: string;
  ref: string;
  detail: string;
  detailAr: string;
  time: string;
  status: "accepted" | "pending" | "rejected";
}

export interface BranchOption {
  id: string;
  name: string;
  nameAr: string;
  location: string;
}

export const entityMeta: Record<EntityType, { name: string; nameAr: string; icon: string; color: string; category: string; categoryAr: string }> = {
  hotel:       { name: "Grand Palace Hotel",           nameAr: "فندق القصر الكبير",          icon: "ri-hotel-line",           color: "#D6B47E", category: "Hotel Intelligence",      categoryAr: "الاستخبارات الفندقية" },
  "car-rental":{ name: "National Car Rental Co.",      nameAr: "شركة الوطنية لتأجير السيارات",icon: "ri-car-line",             color: "#D6B47E", category: "Car Rental Monitoring",   categoryAr: "مراقبة تأجير السيارات" },
  mobile:      { name: "National Telecom",             nameAr: "الاتصالات الوطنية",           icon: "ri-sim-card-line",        color: "#D6B47E", category: "Mobile Operators",        categoryAr: "مشغلو الاتصالات" },
  municipality:{ name: "Capital Municipality",         nameAr: "بلدية العاصمة",               icon: "ri-government-line",      color: "#D6B47E", category: "Municipality Registry",   categoryAr: "سجل البلديات" },
  payment:     { name: "National Bank",                nameAr: "البنك الوطني",                icon: "ri-bank-card-line",       color: "#4ADE80", category: "Payment Intelligence",    categoryAr: "الاستخبارات المالية" },
  borders:     { name: "Border Control System",        nameAr: "نظام مراقبة الحدود",          icon: "ri-passport-line",        color: "#60A5FA", category: "Borders & Immigration",   categoryAr: "الحدود والهجرة" },
  health:      { name: "National Hospital",            nameAr: "المستشفى الوطني",             icon: "ri-heart-pulse-line",     color: "#C94A5E", category: "Health Interactions",     categoryAr: "التفاعلات الصحية" },
  utility:     { name: "National Electricity Co.",     nameAr: "شركة الكهرباء الوطنية",       icon: "ri-flashlight-line",      color: "#FACC15", category: "Utility Activation",      categoryAr: "تفعيل المرافق" },
  transport:   { name: "National Transport Authority", nameAr: "هيئة النقل الوطنية",          icon: "ri-bus-line",             color: "#C98A1B", category: "Public Transport",        categoryAr: "النقل العام" },
  education:   { name: "National University",          nameAr: "الجامعة الوطنية",             icon: "ri-graduation-cap-line",  color: "#A78BFA", category: "Educational Enrollment",  categoryAr: "التسجيل التعليمي" },
  employment:  { name: "Ministry of Labour",           nameAr: "وزارة العمل",                 icon: "ri-briefcase-line",       color: "#F9A8D4", category: "Employment Registry",     categoryAr: "سجل التوظيف" },
  ecommerce:   { name: "National Digital Commerce",    nameAr: "التجارة الرقمية الوطنية",     icon: "ri-shopping-cart-line",   color: "#34D399", category: "E-Commerce & Retail",     categoryAr: "التجارة الإلكترونية" },
  social:      { name: "Digital Intelligence Unit",    nameAr: "وحدة الاستخبارات الرقمية",   icon: "ri-global-line",          color: "#38BDF8", category: "Social Media Intelligence",categoryAr: "استخبارات وسائل التواصل" },
};

export const kpiByType: Record<EntityType, KpiCard[]> = {
  hotel: [
    { key: "bookings",  label: "Total Bookings",  labelAr: "إجمالي الحجوزات",  value: "1,284", delta: "+12%", deltaUp: true,  icon: "ri-calendar-check-line",  color: "#D6B47E", action: "Submit Booking",   actionAr: "إرسال حجز" },
    { key: "checkins",  label: "Check-Ins Today", labelAr: "تسجيل دخول اليوم", value: "47",    delta: "+5",   deltaUp: true,  icon: "ri-login-box-line",       color: "#4ADE80", action: "Submit Check-In",  actionAr: "إرسال تسجيل دخول" },
    { key: "roomchg",   label: "Room Changes",    labelAr: "تغييرات الغرف",    value: "9",     delta: "-2",   deltaUp: false, icon: "ri-door-line",            color: "#FACC15", action: "Submit Change",    actionAr: "إرسال تغيير" },
    { key: "checkouts", label: "Check-Outs Today",labelAr: "تسجيل خروج اليوم", value: "38",    delta: "+3",   deltaUp: true,  icon: "ri-logout-box-line",      color: "#C98A1B", action: "Submit Check-Out", actionAr: "إرسال تسجيل خروج" },
  ],
  "car-rental": [
    { key: "bookings",  label: "Bookings Today",  labelAr: "حجوزات اليوم",     value: "203",   delta: "+18%", deltaUp: true,  icon: "ri-calendar-line",        color: "#D6B47E", action: "Submit Booking",   actionAr: "إرسال حجز" },
    { key: "active",    label: "Active Rentals",  labelAr: "تأجيرات نشطة",     value: "841",   delta: "+34",  deltaUp: true,  icon: "ri-car-line",             color: "#4ADE80", action: "Submit Pickup",    actionAr: "إرسال استلام" },
    { key: "extensions",label: "Extensions",      labelAr: "التمديدات",         value: "56",    delta: "+7",   deltaUp: true,  icon: "ri-time-line",            color: "#FACC15", action: "Submit Extension", actionAr: "إرسال تمديد" },
    { key: "returns",   label: "Returns Today",   labelAr: "إعادات اليوم",     value: "178",   delta: "-12",  deltaUp: false, icon: "ri-arrow-go-back-line",   color: "#C98A1B", action: "Submit Return",    actionAr: "إرسال إعادة" },
  ],
  mobile: [
    { key: "simsales",  label: "SIM Sales",       labelAr: "مبيعات الشريحة",   value: "3,412", delta: "+8%",  deltaUp: true,  icon: "ri-sim-card-line",        color: "#D6B47E", action: "Submit SIM Sale",  actionAr: "إرسال بيع شريحة" },
    { key: "activations",label:"Activations",     labelAr: "التفعيلات",         value: "2,891", delta: "+6%",  deltaUp: true,  icon: "ri-checkbox-circle-line", color: "#4ADE80", action: "Submit Activation",actionAr: "إرسال تفعيل" },
    { key: "deactivations",label:"Deactivations", labelAr: "إلغاء التفعيل",    value: "124",   delta: "-3%",  deltaUp: false, icon: "ri-close-circle-line",    color: "#C94A5E", action: "Submit Deactivation",actionAr:"إرسال إلغاء" },
    { key: "esim",      label: "eSIM Provisions", labelAr: "توفير eSIM",        value: "678",   delta: "+22%", deltaUp: true,  icon: "ri-wifi-line",            color: "#A78BFA", action: "Submit eSIM",      actionAr: "إرسال eSIM" },
  ],
  municipality: [
    { key: "leases",    label: "New Leases",      labelAr: "عقود جديدة",       value: "312",   delta: "+9%",  deltaUp: true,  icon: "ri-home-line",            color: "#D6B47E", action: "Submit Lease",     actionAr: "إرسال عقد" },
    { key: "renewals",  label: "Renewals",        labelAr: "التجديدات",         value: "891",   delta: "+14%", deltaUp: true,  icon: "ri-refresh-line",         color: "#4ADE80", action: "Submit Renewal",   actionAr: "إرسال تجديد" },
    { key: "terminations",label:"Terminations",   labelAr: "الإنهاءات",         value: "47",    delta: "-5",   deltaUp: false, icon: "ri-close-line",           color: "#C94A5E", action: "Submit Termination",actionAr:"إرسال إنهاء" },
    { key: "transfers", label: "Transfers",       labelAr: "التحويلات",         value: "23",    delta: "+2",   deltaUp: true,  icon: "ri-exchange-line",        color: "#FACC15", action: "Submit Transfer",  actionAr: "إرسال تحويل" },
  ],
  payment: [
    { key: "txtoday",   label: "Transactions Today",labelAr:"معاملات اليوم",   value: "24,891",delta: "+11%", deltaUp: true,  icon: "ri-exchange-dollar-line", color: "#4ADE80", action: "Submit Transaction",actionAr:"إرسال معاملة" },
    { key: "wire",      label: "Wire Transfers",  labelAr: "التحويلات البنكية", value: "1,203", delta: "+4%",  deltaUp: true,  icon: "ri-send-plane-line",      color: "#D6B47E", action: "Submit Transfer",  actionAr: "إرسال تحويل" },
    { key: "flagged",   label: "Flagged",         labelAr: "المُبلَّغ عنها",   value: "18",    delta: "+3",   deltaUp: false, icon: "ri-flag-line",            color: "#C94A5E", action: "Submit Flag",      actionAr: "إرسال تنبيه" },
    { key: "pending",   label: "Pending Review",  labelAr: "قيد المراجعة",     value: "94",    delta: "-7",   deltaUp: true,  icon: "ri-time-line",            color: "#FACC15", action: "Submit Pending",   actionAr: "إرسال معلق" },
  ],
  borders: [
    { key: "entries",   label: "Entries Today",   labelAr: "دخول اليوم",       value: "8,412", delta: "+6%",  deltaUp: true,  icon: "ri-login-circle-line",    color: "#60A5FA", action: "Submit Entry",     actionAr: "إرسال دخول" },
    { key: "exits",     label: "Exits Today",     labelAr: "خروج اليوم",       value: "7,891", delta: "+4%",  deltaUp: true,  icon: "ri-logout-circle-line",   color: "#4ADE80", action: "Submit Exit",      actionAr: "إرسال خروج" },
    { key: "visas",     label: "Visas Issued",    labelAr: "تأشيرات صادرة",    value: "1,234", delta: "+9%",  deltaUp: true,  icon: "ri-passport-line",        color: "#D6B47E", action: "Submit Visa",      actionAr: "إرسال تأشيرة" },
    { key: "overstay",  label: "Overstay Alerts", labelAr: "تنبيهات تجاوز",    value: "23",    delta: "+2",   deltaUp: false, icon: "ri-alarm-warning-line",   color: "#C94A5E", action: "Submit Alert",     actionAr: "إرسال تنبيه" },
  ],
  health: [
    { key: "patients",  label: "Registrations",   labelAr: "التسجيلات",        value: "1,847", delta: "+7%",  deltaUp: true,  icon: "ri-user-heart-line",      color: "#C94A5E", action: "Submit Patient",   actionAr: "إرسال مريض" },
    { key: "emergency", label: "Emergency Cases", labelAr: "حالات طارئة",      value: "34",    delta: "+5",   deltaUp: false, icon: "ri-heart-pulse-line",     color: "#C98A1B", action: "Submit Emergency", actionAr: "إرسال طارئ" },
    { key: "prescriptions",label:"Prescriptions", labelAr: "الوصفات الطبية",   value: "3,201", delta: "+12%", deltaUp: true,  icon: "ri-medicine-bottle-line", color: "#4ADE80", action: "Submit Prescription",actionAr:"إرسال وصفة" },
    { key: "discharges",label: "Discharges",      labelAr: "الخروج من المستشفى",value:"891",   delta: "+3%",  deltaUp: true,  icon: "ri-door-open-line",       color: "#D6B47E", action: "Submit Discharge", actionAr: "إرسال خروج" },
  ],
  utility: [
    { key: "connections",label:"New Connections", labelAr: "توصيلات جديدة",    value: "412",   delta: "+8%",  deltaUp: true,  icon: "ri-plug-line",            color: "#FACC15", action: "Submit Connection", actionAr:"إرسال توصيل" },
    { key: "modifications",label:"Modifications", labelAr: "التعديلات",         value: "234",   delta: "+3%",  deltaUp: true,  icon: "ri-settings-line",        color: "#D6B47E", action: "Submit Modification",actionAr:"إرسال تعديل" },
    { key: "terminations",label:"Terminations",   labelAr: "الإنهاءات",         value: "67",    delta: "-4",   deltaUp: false, icon: "ri-close-circle-line",    color: "#C94A5E", action: "Submit Termination",actionAr:"إرسال إنهاء" },
    { key: "linked",    label: "Addresses Linked",labelAr: "عناوين مرتبطة",    value: "1,203", delta: "+15%", deltaUp: true,  icon: "ri-map-pin-line",         color: "#4ADE80", action: "Submit Address",   actionAr: "إرسال عنوان" },
  ],
  transport: [
    { key: "journeys",  label: "Journeys Today",  labelAr: "رحلات اليوم",      value: "42,891",delta: "+9%",  deltaUp: true,  icon: "ri-bus-line",             color: "#C98A1B", action: "Submit Journey",   actionAr: "إرسال رحلة" },
    { key: "taxi",      label: "Taxi Bookings",   labelAr: "حجوزات تاكسي",     value: "8,234", delta: "+14%", deltaUp: true,  icon: "ri-taxi-line",            color: "#D6B47E", action: "Submit Taxi",      actionAr: "إرسال تاكسي" },
    { key: "flagged",   label: "Flagged Routes",  labelAr: "مسارات مُبلَّغة",  value: "12",    delta: "+2",   deltaUp: false, icon: "ri-flag-line",            color: "#C94A5E", action: "Submit Flag",      actionAr: "إرسال تنبيه" },
    { key: "crossgov",  label: "Cross-Gov Trips", labelAr: "رحلات بين المحافظات",value:"3,412",delta: "+6%",  deltaUp: true,  icon: "ri-route-line",           color: "#4ADE80", action: "Submit Trip",      actionAr: "إرسال رحلة" },
  ],
  education: [
    { key: "enrollments",label:"Enrollments",     labelAr: "التسجيلات",        value: "2,341", delta: "+11%", deltaUp: true,  icon: "ri-graduation-cap-line",  color: "#A78BFA", action: "Submit Enrollment",actionAr:"إرسال تسجيل" },
    { key: "visaext",   label: "Visa Extensions", labelAr: "تمديدات التأشيرة", value: "891",   delta: "+7%",  deltaUp: true,  icon: "ri-passport-line",        color: "#D6B47E", action: "Submit Extension", actionAr: "إرسال تمديد" },
    { key: "transfers", label: "Transfers",       labelAr: "التحويلات",         value: "134",   delta: "+3%",  deltaUp: true,  icon: "ri-exchange-line",        color: "#FACC15", action: "Submit Transfer",  actionAr: "إرسال تحويل" },
    { key: "dropouts",  label: "Dropout Flags",   labelAr: "تنبيهات الانسحاب", value: "23",    delta: "+1",   deltaUp: false, icon: "ri-alert-line",           color: "#C94A5E", action: "Submit Flag",      actionAr: "إرسال تنبيه" },
  ],
  employment: [
    { key: "permits",   label: "Permits Issued",  labelAr: "تصاريح صادرة",     value: "3,891", delta: "+8%",  deltaUp: true,  icon: "ri-file-text-line",       color: "#F9A8D4", action: "Submit Permit",    actionAr: "إرسال تصريح" },
    { key: "empchange", label: "Employer Changes",labelAr: "تغييرات صاحب العمل",value:"1,203", delta: "+5%",  deltaUp: true,  icon: "ri-exchange-line",        color: "#D6B47E", action: "Submit Change",    actionAr: "إرسال تغيير" },
    { key: "contracts", label: "Contracts Signed",labelAr: "عقود موقعة",       value: "2,341", delta: "+12%", deltaUp: true,  icon: "ri-pen-nib-line",         color: "#4ADE80", action: "Submit Contract",  actionAr: "إرسال عقد" },
    { key: "cancellations",label:"Cancellations", labelAr: "الإلغاءات",         value: "234",   delta: "-3%",  deltaUp: false, icon: "ri-close-circle-line",    color: "#C94A5E", action: "Submit Cancellation",actionAr:"إرسال إلغاء" },
    { key: "renewal",   label: "Renewal",         labelAr: "تجديد",             value: "67",    delta: "+22%", deltaUp: true,  icon: "ri-time-line",            color: "#A78BFA", action: "Submit Renewal",   actionAr: "إرسال تجديد" },
  ],
  ecommerce: [
    { key: "purchases", label: "Purchases Today", labelAr: "مشتريات اليوم",    value: "18,234",delta: "+16%", deltaUp: true,  icon: "ri-shopping-cart-line",   color: "#34D399", action: "Submit Purchase",  actionAr: "إرسال شراء" },
    { key: "bulk",      label: "Bulk Orders",     labelAr: "طلبات بالجملة",    value: "89",    delta: "+4",   deltaUp: false, icon: "ri-stack-line",           color: "#FACC15", action: "Submit Bulk",      actionAr: "إرسال جملة" },
    { key: "highvalue", label: "High-Value Tx",   labelAr: "معاملات عالية القيمة",value:"234", delta: "+7%",  deltaUp: false, icon: "ri-money-dollar-circle-line",color:"#C94A5E",action:"Submit High-Value",actionAr:"إرسال عالي القيمة" },
    { key: "merchants", label: "New Merchants",   labelAr: "تجار جدد",         value: "47",    delta: "+9%",  deltaUp: true,  icon: "ri-store-line",           color: "#D6B47E", action: "Submit Merchant",  actionAr: "إرسال تاجر" },
  ],
  social: [
    { key: "links",     label: "Phone-Social Links",labelAr:"روابط هاتف-اجتماعي",value:"8,412",delta:"+14%", deltaUp: true,  icon: "ri-links-line",           color: "#38BDF8", action: "Submit Link",      actionAr: "إرسال رابط" },
    { key: "keywords",  label: "Keyword Alerts",  labelAr: "تنبيهات الكلمات",  value: "234",   delta: "+18%", deltaUp: false, icon: "ri-search-eye-line",      color: "#C94A5E", action: "Submit Alert",     actionAr: "إرسال تنبيه" },
    { key: "accounts",  label: "Account Activity",labelAr: "نشاط الحسابات",    value: "12,891",delta: "+9%",  deltaUp: true,  icon: "ri-user-line",            color: "#4ADE80", action: "Submit Activity",  actionAr: "إرسال نشاط" },
    { key: "flagged",   label: "Posts Flagged",   labelAr: "منشورات مُبلَّغة", value: "67",    delta: "+5",   deltaUp: false, icon: "ri-flag-line",            color: "#FACC15", action: "Submit Flag",      actionAr: "إرسال تنبيه" },
  ],
};

export const eventFeedByType: Record<EntityType, EventFeedItem[]> = {
  hotel: [
    { id: "e1", type: "Check-In",       typeAr: "تسجيل دخول",    color: "#4ADE80", ref: "HTL-2025-04891", detail: "Guest Ahmed Al-Rashidi — Room 204, Al Bustan Palace", detailAr: "نزيل أحمد الراشدي — غرفة 204، البستان بالاس", time: "2 min ago",  status: "accepted" },
    { id: "e2", type: "Booking Created",typeAr: "إنشاء حجز",     color: "#D6B47E", ref: "HTL-2025-04890", detail: "Reservation for Sarah Johnson — 3 nights, Suite 512",  detailAr: "حجز لسارة جونسون — 3 ليالٍ، جناح 512",          time: "8 min ago",  status: "accepted" },
    { id: "e3", type: "Room Change",    typeAr: "تغيير غرفة",    color: "#FACC15", ref: "HTL-2025-04889", detail: "Room 118 → 220, Guest: Mohammed Al-Balushi",          detailAr: "غرفة 118 → 220، نزيل: محمد البلوشي",            time: "15 min ago", status: "accepted" },
    { id: "e4", type: "Check-Out",      typeAr: "تسجيل خروج",    color: "#C98A1B", ref: "HTL-2025-04888", detail: "Guest Fatima Al-Zadjali — Room 301, Early Departure",  detailAr: "نزيلة فاطمة الزدجالية — غرفة 301، مغادرة مبكرة", time: "22 min ago", status: "accepted" },
    { id: "e5", type: "Booking Modified",typeAr:"تعديل حجز",     color: "#A78BFA", ref: "HTL-2025-04887", detail: "Extended stay +2 nights — Reservation #BK-88234",     detailAr: "تمديد الإقامة +2 ليلتين — حجز #BK-88234",        time: "31 min ago", status: "pending"  },
    { id: "e6", type: "Check-In",       typeAr: "تسجيل دخول",    color: "#4ADE80", ref: "HTL-2025-04886", detail: "Group check-in: 8 guests — Conference Block C",        detailAr: "تسجيل دخول جماعي: 8 نزلاء — مجمع المؤتمرات C",  time: "45 min ago", status: "accepted" },
    { id: "e7", type: "Booking Cancelled",typeAr:"إلغاء حجز",    color: "#C94A5E", ref: "HTL-2025-04885", detail: "Cancellation: Reservation #BK-88190, Refund Pending",  detailAr: "إلغاء: حجز #BK-88190، استرداد معلق",            time: "1 hr ago",   status: "rejected" },
    { id: "e8", type: "Extended Stay",  typeAr: "تمديد إقامة",   color: "#38BDF8", ref: "HTL-2025-04884", detail: "Room 407 extended 1 night — Guest: Khalid Al-Amri",    detailAr: "غرفة 407 ممتدة ليلة — نزيل: خالد العامري",      time: "1.5 hr ago", status: "accepted" },
  ],
  "car-rental": [
    { id: "e1", type: "Vehicle Pickup", typeAr: "استلام مركبة",  color: "#4ADE80", ref: "CAR-2025-07234", detail: "Toyota Camry (OM-12345) — Ahmed Al-Rashidi, 3 days",   detailAr: "تويوتا كامري (OM-12345) — أحمد الراشدي، 3 أيام", time: "3 min ago",  status: "accepted" },
    { id: "e2", type: "Rental Booking", typeAr: "حجز تأجير",     color: "#D6B47E", ref: "CAR-2025-07233", detail: "Nissan Patrol (OM-67890) — 7 days, Muscat Airport",    detailAr: "نيسان باترول (OM-67890) — 7 أيام، مطار مسقط",   time: "11 min ago", status: "accepted" },
    { id: "e3", type: "Rental Extension",typeAr:"تمديد تأجير",   color: "#FACC15", ref: "CAR-2025-07232", detail: "Contract #RC-44521 extended +2 days",                  detailAr: "عقد #RC-44521 ممتد +يومين",                      time: "28 min ago", status: "accepted" },
    { id: "e4", type: "Vehicle Drop-off",typeAr:"إعادة مركبة",   color: "#C98A1B", ref: "CAR-2025-07231", detail: "Honda Accord (OM-33221) returned — Damage Report Filed",detailAr: "هوندا أكورد (OM-33221) أُعيدت — تقرير أضرار",    time: "42 min ago", status: "pending"  },
    { id: "e5", type: "Contract Modified",typeAr:"تعديل عقد",    color: "#A78BFA", ref: "CAR-2025-07230", detail: "Driver change on Contract #RC-44498",                  detailAr: "تغيير السائق في عقد #RC-44498",                  time: "1 hr ago",   status: "accepted" },
    { id: "e6", type: "Vehicle Pickup", typeAr: "استلام مركبة",  color: "#4ADE80", ref: "CAR-2025-07229", detail: "Kia Sportage (OM-55678) — Corporate client, 14 days",  detailAr: "كيا سبورتاج (OM-55678) — عميل مؤسسي، 14 يوماً", time: "1.5 hr ago", status: "accepted" },
  ],
  mobile: [
    { id: "e1", type: "SIM Activation", typeAr: "تفعيل شريحة",  color: "#4ADE80", ref: "MOB-2025-19234", detail: "Prepaid SIM — IMEI: 358234091234567, Muscat Branch",   detailAr: "شريحة مدفوعة مسبقاً — IMEI: 358234091234567",    time: "1 min ago",  status: "accepted" },
    { id: "e2", type: "eSIM Provision", typeAr: "توفير eSIM",    color: "#A78BFA", ref: "MOB-2025-19233", detail: "eSIM activated — iPhone 15 Pro, EID: 89357...",        detailAr: "تفعيل eSIM — آيفون 15 برو، EID: 89357...",       time: "5 min ago",  status: "accepted" },
    { id: "e3", type: "SIM Swap",       typeAr: "استبدال شريحة", color: "#FACC15", ref: "MOB-2025-19232", detail: "SIM replacement — Number: +968 9234 5678",            detailAr: "استبدال شريحة — رقم: +968 9234 5678",            time: "14 min ago", status: "pending"  },
    { id: "e4", type: "Roaming Active", typeAr: "تفعيل تجوال",   color: "#D6B47E", ref: "MOB-2025-19231", detail: "International roaming enabled — UAE, KSA, UK",         detailAr: "تفعيل التجوال الدولي — الإمارات، السعودية، UK",  time: "29 min ago", status: "accepted" },
    { id: "e5", type: "SIM Deactivation",typeAr:"إلغاء شريحة",  color: "#C94A5E", ref: "MOB-2025-19230", detail: "Postpaid SIM deactivated — Account #AC-88234",         detailAr: "إلغاء شريحة مدفوعة — حساب #AC-88234",           time: "47 min ago", status: "accepted" },
    { id: "e6", type: "Number Porting", typeAr: "نقل رقم",       color: "#38BDF8", ref: "MOB-2025-19229", detail: "Port-in from Ooredoo — +968 9876 5432",               detailAr: "نقل من أوريدو — +968 9876 5432",                 time: "1 hr ago",   status: "accepted" },
  ],
  municipality: [
    { id: "e1", type: "Lease Start",    typeAr: "بدء إيجار",     color: "#4ADE80", ref: "MUN-2025-03421", detail: "New lease — Villa 12, Al Khuwair, 12 months",         detailAr: "إيجار جديد — فيلا 12، الخوير، 12 شهراً",        time: "4 min ago",  status: "accepted" },
    { id: "e2", type: "Lease Renewal",  typeAr: "تجديد إيجار",   color: "#D6B47E", ref: "MUN-2025-03420", detail: "Renewal — Apt 4B, Ruwi, Tenant: Al-Farsi Family",     detailAr: "تجديد — شقة 4B، الروي، مستأجر: عائلة الفارسي",  time: "18 min ago", status: "accepted" },
    { id: "e3", type: "Tenant Change",  typeAr: "تغيير مستأجر",  color: "#FACC15", ref: "MUN-2025-03419", detail: "Tenant change — Shop 7, Muttrah Souq",                detailAr: "تغيير مستأجر — محل 7، سوق مطرح",                time: "35 min ago", status: "pending"  },
    { id: "e4", type: "Lease Termination",typeAr:"إنهاء إيجار",  color: "#C94A5E", ref: "MUN-2025-03418", detail: "Early termination — Office 3F, CBD, Muscat",          detailAr: "إنهاء مبكر — مكتب 3F، المركز التجاري، مسقط",    time: "52 min ago", status: "accepted" },
    { id: "e5", type: "Address Update", typeAr: "تحديث عنوان",   color: "#38BDF8", ref: "MUN-2025-03417", detail: "Address correction — Plot 88, Seeb District",         detailAr: "تصحيح عنوان — قطعة 88، منطقة السيب",            time: "1.2 hr ago", status: "accepted" },
  ],
  payment: [
    { id: "e1", type: "Wire Transfer",  typeAr: "تحويل بنكي",    color: "#4ADE80", ref: "PAY-2025-88234", detail: "OMR 45,000 — Al Rashidi Trading → HSBC London",       detailAr: "45,000 ريال — الراشدي للتجارة → HSBC لندن",      time: "2 min ago",  status: "accepted" },
    { id: "e2", type: "Large Cash Deposit",typeAr:"إيداع نقدي كبير",color:"#FACC15",ref:"PAY-2025-88233",detail:"OMR 12,500 cash deposit — Account #AC-44521",          detailAr: "إيداع نقدي 12,500 ريال — حساب #AC-44521",        time: "9 min ago",  status: "pending"  },
    { id: "e3", type: "Currency Exchange",typeAr:"صرف عملات",     color: "#D6B47E", ref: "PAY-2025-88232", detail: "USD 50,000 → OMR — Exchange rate 0.385",              detailAr: "50,000 دولار → ريال — سعر الصرف 0.385",          time: "21 min ago", status: "accepted" },
    { id: "e4", type: "Flagged Transaction",typeAr:"معاملة مُبلَّغة",color:"#C94A5E",ref:"PAY-2025-88231",detail:"Suspicious pattern — Multiple small transfers",        detailAr: "نمط مشبوه — تحويلات صغيرة متعددة",               time: "38 min ago", status: "rejected" },
    { id: "e5", type: "Account Opening",typeAr: "فتح حساب",       color: "#A78BFA", ref: "PAY-2025-88230", detail: "Corporate account — Al Balushi Group LLC",            detailAr: "حساب مؤسسي — مجموعة البلوشي المحدودة",           time: "55 min ago", status: "accepted" },
  ],
  borders: [
    { id: "e1", type: "Entry Recorded", typeAr: "تسجيل دخول",    color: "#60A5FA", ref: "BRD-2025-44891", detail: "Passport: UK — Muscat International Airport, T1",     detailAr: "جواز سفر: بريطاني — مطار مسقط الدولي، T1",       time: "1 min ago",  status: "accepted" },
    { id: "e2", type: "Exit Recorded",  typeAr: "تسجيل خروج",    color: "#4ADE80", ref: "BRD-2025-44890", detail: "Passport: OM — Seeb Airport, Flight WY-101",          detailAr: "جواز سفر: عُماني — مطار السيب، رحلة WY-101",     time: "4 min ago",  status: "accepted" },
    { id: "e3", type: "Visa Issued",    typeAr: "إصدار تأشيرة",  color: "#D6B47E", ref: "BRD-2025-44889", detail: "Tourist visa — 30 days, Passport: IN-4523891",        detailAr: "تأشيرة سياحية — 30 يوماً، جواز: IN-4523891",     time: "12 min ago", status: "accepted" },
    { id: "e4", type: "Overstay Alert", typeAr: "تنبيه تجاوز",   color: "#C94A5E", ref: "BRD-2025-44888", detail: "Visa expired 3 days ago — Passport: PK-8823401",      detailAr: "انتهت التأشيرة منذ 3 أيام — جواز: PK-8823401",   time: "28 min ago", status: "pending"  },
    { id: "e5", type: "eVisa Activation",typeAr:"تفعيل تأشيرة إلكترونية",color:"#A78BFA",ref:"BRD-2025-44887",detail:"eVisa activated on arrival — Ref: EV-2025-88234",detailAr:"تفعيل تأشيرة إلكترونية عند الوصول — Ref: EV-2025-88234",time:"41 min ago",status:"accepted"},
  ],
  health: [
    { id: "e1", type: "Patient Registration",typeAr:"تسجيل مريض",color:"#C94A5E",ref:"HLT-2025-22341",detail:"New patient — Ahmed Al-Rashidi, DOB: 1985-03-12",       detailAr: "مريض جديد — أحمد الراشدي، تاريخ الميلاد: 1985-03-12",time:"3 min ago", status:"accepted"},
    { id: "e2", type: "Emergency Admission",typeAr:"قبول طارئ",  color: "#C98A1B", ref: "HLT-2025-22340", detail: "Trauma case — Male, 34, Road accident, ICU",          detailAr: "حالة صدمة — ذكر، 34 عاماً، حادث طريق، العناية",  time: "11 min ago", status: "accepted" },
    { id: "e3", type: "Prescription Issued",typeAr:"إصدار وصفة", color: "#4ADE80", ref: "HLT-2025-22339", detail: "Rx #PR-88234 — Dr. Al-Zadjali, Patient: F.Al-Amri",   detailAr: "وصفة #PR-88234 — د. الزدجالية، مريضة: ف. العامري",time: "24 min ago", status: "accepted" },
    { id: "e4", type: "Patient Discharge",  typeAr:"خروج مريض",  color: "#D6B47E", ref: "HLT-2025-22338", detail: "Discharged after 4 days — Ward 3B, Bed 12",           detailAr: "خروج بعد 4 أيام — جناح 3B، سرير 12",             time: "39 min ago", status: "accepted" },
    { id: "e5", type: "Lab Test Ordered",   typeAr:"طلب فحص",    color: "#A78BFA", ref: "HLT-2025-22337", detail: "CBC + Metabolic Panel — Patient #PT-44521",           detailAr: "فحص دم شامل + لوحة التمثيل الغذائي — مريض #PT-44521",time:"51 min ago",status:"accepted"},
  ],
  utility: [
    { id: "e1", type: "Electricity Connected",typeAr:"توصيل كهرباء",color:"#FACC15",ref:"UTL-2025-11234",detail:"New connection — Villa 45, Al Azaiba, 3-phase",        detailAr: "توصيل جديد — فيلا 45، العذيبة، ثلاثي الطور",     time: "6 min ago",  status: "accepted" },
    { id: "e2", type: "Service Modified",   typeAr: "تعديل خدمة", color: "#D6B47E", ref: "UTL-2025-11233", detail: "Tariff upgrade — Account #AC-77234, Commercial",      detailAr: "ترقية التعريفة — حساب #AC-77234، تجاري",          time: "19 min ago", status: "accepted" },
    { id: "e3", type: "Internet Activated", typeAr: "تفعيل إنترنت",color:"#4ADE80", ref: "UTL-2025-11232", detail: "Fiber 1Gbps — Apt 7C, Qurum Heights",                detailAr: "ألياف 1 جيجابت — شقة 7C، مرتفعات القرم",         time: "33 min ago", status: "accepted" },
    { id: "e4", type: "Service Terminated", typeAr: "إنهاء خدمة", color: "#C94A5E", ref: "UTL-2025-11231", detail: "Disconnection — Shop 12, Muttrah, Non-payment",       detailAr: "قطع الخدمة — محل 12، مطرة، عدم الدفع",           time: "48 min ago", status: "accepted" },
    { id: "e5", type: "Address Linked",     typeAr: "ربط عنوان",  color: "#38BDF8", ref: "UTL-2025-11230", detail: "Address verified — Plot 234, Barka Industrial",       detailAr: "تحقق من العنوان — قطعة 234، صناعية بركاء",        time: "1 hr ago",   status: "pending"  },
  ],
  transport: [
    { id: "e1", type: "Bus Journey",    typeAr: "رحلة حافلة",    color: "#C98A1B", ref: "TRN-2025-55234", detail: "Route 1 — Muscat → Seeb, 47 passengers",             detailAr: "خط 1 — مسقط → السيب، 47 راكباً",                 time: "2 min ago",  status: "accepted" },
    { id: "e2", type: "Taxi Booking",   typeAr: "حجز تاكسي",     color: "#D6B47E", ref: "TRN-2025-55233", detail: "Taxi #TX-8823 — Airport to Qurum, 18.4 km",          detailAr: "تاكسي #TX-8823 — المطار إلى القرم، 18.4 كم",     time: "8 min ago",  status: "accepted" },
    { id: "e3", type: "Route Flagged",  typeAr: "مسار مُبلَّغ",  color: "#C94A5E", ref: "TRN-2025-55232", detail: "Unusual pattern — Route 7, repeated stops",           detailAr: "نمط غير معتاد — خط 7، توقفات متكررة",            time: "22 min ago", status: "pending"  },
    { id: "e4", type: "Cross-Gov Trip", typeAr: "رحلة بين المحافظات",color:"#4ADE80",ref:"TRN-2025-55231",detail:"Muscat → Dhofar — Bus #BUS-441, 8 hrs",              detailAr: "مسقط → ظفار — حافلة #BUS-441، 8 ساعات",          time: "35 min ago", status: "accepted" },
    { id: "e5", type: "Bus Journey",    typeAr: "رحلة حافلة",    color: "#C98A1B", ref: "TRN-2025-55230", detail: "Route 5 — Ruwi → Qurum, 62 passengers",              detailAr: "خط 5 — الروي → القرم، 62 راكباً",                 time: "51 min ago", status: "accepted" },
  ],
  education: [
    { id: "e1", type: "Student Enrolled",typeAr:"تسجيل طالب",    color: "#A78BFA", ref: "EDU-2025-08234", detail: "BSc Computer Science — Ahmed Al-Rashidi, ID: 2025001",detailAr: "بكالوريوس علوم الحاسوب — أحمد الراشدي، ID: 2025001",time:"5 min ago", status:"accepted"},
    { id: "e2", type: "Visa Extension", typeAr: "تمديد تأشيرة",  color: "#D6B47E", ref: "EDU-2025-08233", detail: "Student visa extended 1 year — Passport: IN-7823401", detailAr: "تمديد تأشيرة طالب سنة — جواز: IN-7823401",        time: "17 min ago", status: "accepted" },
    { id: "e3", type: "Institution Transfer",typeAr:"نقل مؤسسة", color: "#FACC15", ref: "EDU-2025-08232", detail: "Transfer from CAS to SQU — Student #ST-44521",        detailAr: "نقل من CAS إلى SQU — طالب #ST-44521",            time: "34 min ago", status: "pending"  },
    { id: "e4", type: "Graduation",     typeAr: "تخرج",           color: "#4ADE80", ref: "EDU-2025-08231", detail: "MBA Graduate — Fatima Al-Zadjali, Class of 2025",     detailAr: "خريجة ماجستير — فاطمة الزدجالية، دفعة 2025",     time: "52 min ago", status: "accepted" },
    { id: "e5", type: "Dropout Flagged",typeAr: "تنبيه انسحاب",  color: "#C94A5E", ref: "EDU-2025-08230", detail: "No attendance 30+ days — Student #ST-33219",          detailAr: "غياب 30+ يوماً — طالب #ST-33219",                 time: "1.1 hr ago", status: "pending"  },
  ],
  employment: [
    { id: "e1", type: "Work Permit Issued",typeAr:"إصدار تصريح", color: "#F9A8D4", ref: "EMP-2025-33234", detail: "Permit #WP-88234 — Construction sector, 2 years",     detailAr: "تصريح #WP-88234 — قطاع البناء، سنتان",           time: "4 min ago",  status: "accepted" },
    { id: "e2", type: "Employer Change", typeAr: "تغيير صاحب عمل",color:"#D6B47E", ref: "EMP-2025-33233", detail: "Transfer — Al-Rashidi Group → Oman Oil Company",      detailAr: "نقل — مجموعة الراشدي → شركة النفط العُمانية",     time: "16 min ago", status: "accepted" },
    { id: "e3", type: "Contract Signed", typeAr: "توقيع عقد",    color: "#4ADE80", ref: "EMP-2025-33232", detail: "2-year contract — IT Specialist, Muscat",              detailAr: "عقد سنتين — متخصص تقنية معلومات، مسقط",          time: "29 min ago", status: "accepted" },
    { id: "e4", type: "Permit Cancellation",typeAr:"إلغاء تصريح", color: "#C94A5E", ref: "EMP-2025-33231", detail: "Permit cancelled — Employer request, #WP-77891",      detailAr: "إلغاء تصريح — طلب صاحب العمل، #WP-77891",        time: "44 min ago", status: "accepted" },
    { id: "e5", type: "Permit Renewal", typeAr: "تجديد تصريح",   color: "#FACC15", ref: "EMP-2025-33230", detail: "Renewal — Hospitality sector, +2 years, #WP-55234",   detailAr: "تجديد — قطاع الضيافة، +سنتان، #WP-55234",        time: "58 min ago", status: "accepted" },
  ],
  ecommerce: [
    { id: "e1", type: "Online Purchase", typeAr: "شراء إلكتروني", color: "#34D399", ref: "ECM-2025-77234", detail: "OMR 234.500 — Electronics, Merchant: TechOman",       detailAr: "234.500 ريال — إلكترونيات، تاجر: TechOman",       time: "1 min ago",  status: "accepted" },
    { id: "e2", type: "Bulk Order",      typeAr: "طلب بالجملة",   color: "#FACC15", ref: "ECM-2025-77233", detail: "500 units — Medical supplies, Flagged for review",    detailAr: "500 وحدة — مستلزمات طبية، مُبلَّغ للمراجعة",     time: "9 min ago",  status: "pending"  },
    { id: "e3", type: "High-Value Tx",   typeAr: "معاملة عالية القيمة",color:"#C94A5E",ref:"ECM-2025-77232",detail:"OMR 8,500 — Jewelry purchase, single transaction",   detailAr: "8,500 ريال — شراء مجوهرات، معاملة واحدة",         time: "23 min ago", status: "pending"  },
    { id: "e4", type: "Merchant Registration",typeAr:"تسجيل تاجر",color:"#D6B47E", ref: "ECM-2025-77231", detail: "New merchant — Al-Amri Dates LLC, Category: Food",    detailAr: "تاجر جديد — شركة العامري للتمور، فئة: غذاء",      time: "37 min ago", status: "accepted" },
    { id: "e5", type: "Refund Processed",typeAr:"معالجة استرداد", color: "#4ADE80", ref: "ECM-2025-77230", detail: "OMR 89.000 refund — Order #ORD-44521, Approved",      detailAr: "استرداد 89.000 ريال — طلب #ORD-44521، موافق",     time: "51 min ago", status: "accepted" },
  ],
  social: [
    { id: "e1", type: "Phone-Social Link",typeAr:"ربط هاتف-اجتماعي",color:"#38BDF8",ref:"SOC-2025-99234",detail:"+968 9234 5678 linked to 3 social accounts",          detailAr: "+968 9234 5678 مرتبط بـ 3 حسابات اجتماعية",      time: "2 min ago",  status: "accepted" },
    { id: "e2", type: "Keyword Alert",   typeAr: "تنبيه كلمة مفتاحية",color:"#C94A5E",ref:"SOC-2025-99233",detail:"High-priority keyword detected — Public post",       detailAr: "كلمة مفتاحية عالية الأولوية — منشور عام",         time: "7 min ago",  status: "pending"  },
    { id: "e3", type: "Account Activity",typeAr:"نشاط حساب",      color: "#4ADE80", ref: "SOC-2025-99232", detail: "Unusual activity pattern — Account #ACC-88234",       detailAr: "نمط نشاط غير معتاد — حساب #ACC-88234",            time: "18 min ago", status: "accepted" },
    { id: "e4", type: "Post Flagged",    typeAr: "منشور مُبلَّغ", color: "#FACC15", ref: "SOC-2025-99231", detail: "Public post flagged — Keyword match level 2",         detailAr: "منشور عام مُبلَّغ — مطابقة كلمة مفتاحية مستوى 2", time: "31 min ago", status: "pending"  },
    { id: "e5", type: "Network Analysis",typeAr:"تحليل شبكة",     color: "#A78BFA", ref: "SOC-2025-99230", detail: "Network cluster identified — 12 connected accounts",  detailAr: "مجموعة شبكة محددة — 12 حساباً مترابطاً",          time: "45 min ago", status: "accepted" },
  ],
};

export const branches: BranchOption[] = [
  { id: "main",    name: "Main Branch — Capital",        nameAr: "الفرع الرئيسي — العاصمة",  location: "Capital" },
  { id: "south",   name: "Southern Branch",              nameAr: "الفرع الجنوبي",             location: "Southern Region" },
  { id: "north",   name: "Northern Branch",              nameAr: "الفرع الشمالي",             location: "Northern Region" },
  { id: "central", name: "Central Branch",               nameAr: "الفرع المركزي",             location: "Central Region" },
];

export const navItems = [
  { key: "home",            icon: "ri-home-5-line",          labelEn: "Home",               labelAr: "الرئيسية",          route: "/dashboard",                   group: "main"  },
  { key: "risk",            icon: "ri-shield-cross-line",    labelEn: "Risk Assessment",    labelAr: "تقييم المخاطر",     route: "/dashboard/risk-assessment",   group: "admin" },
  { key: "osint-engine",    icon: "ri-radar-line",           labelEn: "OSINT Risk Engine",  labelAr: "محرّك المخاطر OSINT", route: "/dashboard/osint-risk-engine", group: "admin" },
  { key: "watchlist",       icon: "ri-eye-line",             labelEn: "Watchlist & Targets",labelAr: "قوائم المراقبة",    route: "/dashboard/watchlist",         group: "admin" },
  { key: "case-management", icon: "ri-folder-shield-2-line", labelEn: "Case Management",    labelAr: "إدارة القضايا",     route: "/dashboard/case-management",   group: "admin" },
  { key: "person360",       icon: "ri-user-search-line",     labelEn: "Person 360°",        labelAr: "ملف الشخص 360°",    route: "/dashboard/person-360",        group: "admin" },
  { key: "notifications",   icon: "ri-notification-3-line",  labelEn: "Notifications",      labelAr: "الإشعارات",         route: "/dashboard/notifications",     group: "admin" },
  { key: "reports",         icon: "ri-bar-chart-2-line",     labelEn: "Reports",            labelAr: "التقارير",          route: "/dashboard/reports",           group: "admin" },
  { key: "users",           icon: "ri-team-line",            labelEn: "Manage Users",       labelAr: "إدارة المستخدمين", route: "/dashboard/manage-users",      group: "admin" },
  { key: "audit-log",       icon: "ri-archive-line",         labelEn: "Audit Log",          labelAr: "سجل التدقيق",       route: "/dashboard/audit-log",         group: "admin" },
  { key: "system-admin",    icon: "ri-shield-keyhole-line",  labelEn: "System Admin",       labelAr: "إدارة النظام",      route: "/dashboard/system-admin",      group: "admin" },
  { key: "help",            icon: "ri-question-line",        labelEn: "Help",               labelAr: "المساعدة",          route: "/dashboard/help",              group: "admin" },
];
