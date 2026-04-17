import { useState } from "react";

interface Props { isAr: boolean; entityType: string; }

interface CalEvent {
  id: string;
  day: number;
  endDay?: number;
  type: string;
  typeAr: string;
  color: string;
  ref: string;
  person: string;
  time: string;
  status: "accepted" | "pending" | "rejected";
  detail: string;
  detailAr: string;
  amount?: string;
  branch?: string;
}

const ENTITY_LEGENDS: Record<string, { label: string; labelAr: string; color: string; icon: string }[]> = {
  hotel: [
    { label: "Booking",     labelAr: "حجز",           color: "#D4A84B", icon: "ri-calendar-line" },
    { label: "Check-In",    labelAr: "تسجيل دخول",    color: "#4ADE80", icon: "ri-login-box-line" },
    { label: "Room Change", labelAr: "تغيير غرفة",    color: "#FACC15", icon: "ri-swap-line" },
    { label: "Check-Out",   labelAr: "تسجيل خروج",   color: "#F87171", icon: "ri-logout-box-line" },
  ],
  "car-rental": [
    { label: "Booking",    labelAr: "حجز",         color: "#D4A84B", icon: "ri-calendar-line" },
    { label: "Pickup",     labelAr: "استلام",       color: "#4ADE80", icon: "ri-car-line" },
    { label: "Extension",  labelAr: "تمديد",        color: "#FACC15", icon: "ri-time-line" },
    { label: "Return",     labelAr: "إعادة",        color: "#FB923C", icon: "ri-arrow-go-back-line" },
  ],
  mobile: [
    { label: "SIM Activation", labelAr: "تفعيل شريحة", color: "#4ADE80", icon: "ri-sim-card-line" },
    { label: "eSIM",           labelAr: "eSIM",          color: "#A78BFA", icon: "ri-smartphone-line" },
    { label: "Deactivation",   labelAr: "إلغاء",         color: "#F87171", icon: "ri-close-circle-line" },
    { label: "Roaming",        labelAr: "تجوال",         color: "#D4A84B", icon: "ri-global-line" },
  ],
  municipality: [
    { label: "Lease Start",  labelAr: "بدء إيجار",   color: "#4ADE80", icon: "ri-home-line" },
    { label: "Lease Renew",  labelAr: "تجديد إيجار", color: "#D4A84B", icon: "ri-refresh-line" },
    { label: "Lease End",    labelAr: "انتهاء إيجار",color: "#F87171", icon: "ri-home-2-line" },
  ],
  financial: [
    { label: "Wire Transfer",  labelAr: "تحويل بنكي",    color: "#4ADE80", icon: "ri-bank-line" },
    { label: "Large Cash",     labelAr: "نقد كبير",       color: "#FACC15", icon: "ri-money-dollar-circle-line" },
    { label: "Flagged",        labelAr: "مُبلَّغ",         color: "#F87171", icon: "ri-alert-line" },
    { label: "Account Opened", labelAr: "فتح حساب",       color: "#D4A84B", icon: "ri-bank-card-line" },
  ],
  border: [
    { label: "Entry",         labelAr: "دخول",         color: "#4ADE80", icon: "ri-login-circle-line" },
    { label: "Exit",          labelAr: "خروج",          color: "#FB923C", icon: "ri-logout-circle-line" },
    { label: "Overstay Alert",labelAr: "تجاوز إقامة",  color: "#F87171", icon: "ri-alarm-warning-line" },
    { label: "Visa Check",    labelAr: "فحص تأشيرة",   color: "#D4A84B", icon: "ri-passport-line" },
  ],
  utility: [
    { label: "New Connection", labelAr: "توصيل جديد",  color: "#4ADE80", icon: "ri-plug-line" },
    { label: "Disconnection",  labelAr: "قطع",          color: "#F87171", icon: "ri-close-circle-line" },
    { label: "Transfer",       labelAr: "نقل",          color: "#D4A84B", icon: "ri-swap-line" },
    { label: "Anomaly",        labelAr: "شذوذ",         color: "#FACC15", icon: "ri-alert-line" },
  ],
  transport: [
    { label: "Trip Recorded",  labelAr: "رحلة مسجلة",  color: "#4ADE80", icon: "ri-bus-line" },
    { label: "Anomaly",        labelAr: "شذوذ",         color: "#F87171", icon: "ri-alert-line" },
    { label: "Route Flag",     labelAr: "تنبيه مسار",  color: "#FACC15", icon: "ri-map-pin-line" },
  ],
  employment: [
    { label: "Permit Issued",  labelAr: "إصدار تصريح", color: "#D4A84B", icon: "ri-briefcase-line" },
    { label: "Employer Change",labelAr: "تغيير صاحب",  color: "#FACC15", icon: "ri-building-line" },
    { label: "Renewal",        labelAr: "تجديد",        color: "#4ADE80", icon: "ri-refresh-line" },
    { label: "Termination",    labelAr: "إنهاء",        color: "#F87171", icon: "ri-user-unfollow-line" },
  ],
  ecommerce: [
    { label: "Bulk Purchase",  labelAr: "شراء بالجملة", color: "#FACC15", icon: "ri-shopping-cart-line" },
    { label: "High-Value",     labelAr: "قيمة عالية",   color: "#FB923C", icon: "ri-money-dollar-circle-line" },
    { label: "Restricted Item",labelAr: "سلعة مقيدة",  color: "#F87171", icon: "ri-forbid-line" },
    { label: "Shipping Alert", labelAr: "تنبيه شحن",    color: "#D4A84B", icon: "ri-truck-line" },
  ],
  social: [
    { label: "Keyword Hit",    labelAr: "كلمة مفتاحية", color: "#F87171", icon: "ri-search-line" },
    { label: "Profile Flag",   labelAr: "ملف مُبلَّغ",  color: "#FACC15", icon: "ri-user-line" },
    { label: "OSINT Match",    labelAr: "تطابق OSINT",  color: "#D4A84B", icon: "ri-global-line" },
  ],
  default: [
    { label: "Event",     labelAr: "حدث",    color: "#D4A84B", icon: "ri-calendar-line" },
    { label: "Alert",     labelAr: "تنبيه",  color: "#F87171", icon: "ri-alert-line" },
    { label: "Pending",   labelAr: "معلق",   color: "#FACC15", icon: "ri-time-line" },
    { label: "Completed", labelAr: "مكتمل",  color: "#4ADE80", icon: "ri-check-line" },
  ],
};

const ENTITY_QUICK_ACTIONS: Record<string, { label: string; labelAr: string; icon: string }[]> = {
  hotel: [
    { label: "New Booking",  labelAr: "حجز جديد",       icon: "ri-add-line" },
    { label: "Check-In",     labelAr: "تسجيل دخول",     icon: "ri-login-box-line" },
    { label: "Check-Out",    labelAr: "تسجيل خروج",    icon: "ri-logout-box-line" },
  ],
  "car-rental": [
    { label: "New Booking",  labelAr: "حجز جديد",       icon: "ri-add-line" },
    { label: "Vehicle Pickup",labelAr: "استلام مركبة",  icon: "ri-car-line" },
    { label: "Return",       labelAr: "إعادة مركبة",    icon: "ri-arrow-go-back-line" },
  ],
  mobile: [
    { label: "Activate SIM", labelAr: "تفعيل شريحة",   icon: "ri-sim-card-line" },
    { label: "Deactivate",   labelAr: "إلغاء تفعيل",   icon: "ri-close-circle-line" },
  ],
  financial: [
    { label: "Wire Transfer", labelAr: "تحويل بنكي",   icon: "ri-bank-line" },
    { label: "Flag Transaction",labelAr: "تبليغ معاملة",icon: "ri-alert-line" },
  ],
  default: [
    { label: "Add Event",    labelAr: "إضافة حدث",      icon: "ri-add-line" },
    { label: "View All",     labelAr: "عرض الكل",       icon: "ri-list-check-2" },
  ],
};

const MOCK_EVENTS: CalEvent[] = [
  { id: "c1",  day: 1,  type: "Check-In",    typeAr: "تسجيل دخول",  color: "#4ADE80", ref: "HTL-2025-04891", person: "Ahmed Al-Rashidi",    time: "09:14", status: "accepted", detail: "Room 204, Al Bustan Palace",       detailAr: "غرفة 204، البستان بالاس",       amount: "OMR 245.000" },
  { id: "c2",  day: 1,  type: "Booking",     typeAr: "حجز",          color: "#D4A84B", ref: "HTL-2025-04890", person: "Sarah Johnson",       time: "10:30", status: "accepted", detail: "Suite 512, 3 nights",             detailAr: "جناح 512، 3 ليالٍ",             amount: "OMR 890.000", endDay: 4 },
  { id: "c3",  day: 3,  type: "Check-Out",   typeAr: "تسجيل خروج",  color: "#F87171", ref: "HTL-2025-04888", person: "Fatima Al-Zadjali",  time: "11:00", status: "accepted", detail: "Room 301, Early Departure",       detailAr: "غرفة 301، مغادرة مبكرة",        amount: "OMR 1,200.000" },
  { id: "c4",  day: 5,  type: "Room Change", typeAr: "تغيير غرفة",  color: "#FACC15", ref: "HTL-2025-04889", person: "Mohammed Al-Balushi",time: "14:22", status: "accepted", detail: "Room 118 → 220",                  detailAr: "غرفة 118 → 220" },
  { id: "c5",  day: 5,  type: "Booking",     typeAr: "حجز",          color: "#D4A84B", ref: "HTL-2025-04887", person: "Khalid Al-Amri",     time: "16:45", status: "pending",  detail: "Extended stay +2 nights",        detailAr: "تمديد الإقامة +2 ليلتين",       amount: "OMR 340.000", endDay: 8 },
  { id: "c6",  day: 7,  type: "Check-In",    typeAr: "تسجيل دخول",  color: "#4ADE80", ref: "HTL-2025-04886", person: "Group Booking",      time: "15:00", status: "accepted", detail: "8 guests, Conference Block C",   detailAr: "8 نزلاء، مجمع المؤتمرات C",     amount: "OMR 3,200.000" },
  { id: "c7",  day: 9,  type: "Check-Out",   typeAr: "تسجيل خروج",  color: "#F87171", ref: "HTL-2025-04885", person: "Reza Tehrani",       time: "10:00", status: "rejected", detail: "Booking Cancelled, Refund",      detailAr: "إلغاء الحجز، استرداد" },
  { id: "c8",  day: 10, type: "Booking",     typeAr: "حجز",          color: "#D4A84B", ref: "HTL-2025-04884", person: "Priya Nair",         time: "08:30", status: "accepted", detail: "Room 407, 1 night extension",    detailAr: "غرفة 407، تمديد ليلة",          amount: "OMR 120.000", endDay: 12 },
  { id: "c9",  day: 12, type: "Check-In",    typeAr: "تسجيل دخول",  color: "#4ADE80", ref: "HTL-2025-04883", person: "Omar Al-Farsi",      time: "13:15", status: "accepted", detail: "Room 115, Business trip",        detailAr: "غرفة 115، رحلة عمل",            amount: "OMR 180.000" },
  { id: "c10", day: 14, type: "Room Change", typeAr: "تغيير غرفة",  color: "#FACC15", ref: "HTL-2025-04882", person: "Layla Al-Hinai",     time: "11:30", status: "pending",  detail: "Room 302 → 410, Upgrade",       detailAr: "غرفة 302 → 410، ترقية" },
  { id: "c11", day: 15, type: "Check-Out",   typeAr: "تسجيل خروج",  color: "#F87171", ref: "HTL-2025-04881", person: "James Wilson",       time: "09:00", status: "accepted", detail: "Room 208, 5-night stay",         detailAr: "غرفة 208، إقامة 5 ليالٍ",       amount: "OMR 750.000" },
  { id: "c12", day: 17, type: "Booking",     typeAr: "حجز",          color: "#D4A84B", ref: "HTL-2025-04880", person: "Nadia Al-Rashidi",   time: "17:00", status: "accepted", detail: "Suite 601, VIP booking",         detailAr: "جناح 601، حجز VIP",             amount: "OMR 2,400.000", endDay: 21 },
  { id: "c13", day: 19, type: "Check-In",    typeAr: "تسجيل دخول",  color: "#4ADE80", ref: "HTL-2025-04879", person: "Carlos Mendez",      time: "14:00", status: "accepted", detail: "Room 312, Conference guest",     detailAr: "غرفة 312، ضيف مؤتمر",           amount: "OMR 320.000" },
  { id: "c14", day: 21, type: "Check-Out",   typeAr: "تسجيل خروج",  color: "#F87171", ref: "HTL-2025-04878", person: "Aisha Al-Balushi",   time: "11:00", status: "accepted", detail: "Room 220, Extended stay",        detailAr: "غرفة 220، إقامة ممتدة",         amount: "OMR 560.000" },
  { id: "c15", day: 22, type: "Room Change", typeAr: "تغيير غرفة",  color: "#FACC15", ref: "HTL-2025-04877", person: "Tariq Al-Amri",      time: "15:30", status: "accepted", detail: "Room 105 → 205, Sea view",      detailAr: "غرفة 105 → 205، إطلالة بحرية" },
  { id: "c16", day: 24, type: "Booking",     typeAr: "حجز",          color: "#D4A84B", ref: "HTL-2025-04876", person: "Elena Petrov",       time: "10:00", status: "pending",  detail: "Room 318, 2 nights",            detailAr: "غرفة 318، ليلتان",              amount: "OMR 280.000", endDay: 26 },
  { id: "c17", day: 26, type: "Check-In",    typeAr: "تسجيل دخول",  color: "#4ADE80", ref: "HTL-2025-04875", person: "Hamad Al-Zadjali",   time: "16:00", status: "accepted", detail: "Room 401, Family suite",         detailAr: "غرفة 401، جناح عائلي",          amount: "OMR 480.000" },
  { id: "c18", day: 28, type: "Check-Out",   typeAr: "تسجيل خروج",  color: "#F87171", ref: "HTL-2025-04874", person: "Mei Lin",            time: "10:30", status: "accepted", detail: "Room 509, Business trip",        detailAr: "غرفة 509، رحلة عمل",            amount: "OMR 390.000" },
  { id: "c19", day: 2,  type: "Check-In",    typeAr: "تسجيل دخول",  color: "#4ADE80", ref: "HTL-2025-04892", person: "Yusuf Al-Maqbali",   time: "12:00", status: "accepted", detail: "Room 110, 2 nights",             detailAr: "غرفة 110، ليلتان",              amount: "OMR 160.000" },
  { id: "c20", day: 6,  type: "Booking",     typeAr: "حجز",          color: "#D4A84B", ref: "HTL-2025-04893", person: "Hana Yamamoto",      time: "09:00", status: "accepted", detail: "Room 215, 4 nights",             detailAr: "غرفة 215، 4 ليالٍ",             amount: "OMR 520.000", endDay: 10 },
  { id: "c21", day: 11, type: "Room Change", typeAr: "تغيير غرفة",  color: "#FACC15", ref: "HTL-2025-04894", person: "Bader Al-Siyabi",    time: "13:45", status: "pending",  detail: "Room 201 → 305, Noise complaint",detailAr: "غرفة 201 → 305، شكوى ضوضاء" },
  { id: "c22", day: 16, type: "Check-Out",   typeAr: "تسجيل خروج",  color: "#F87171", ref: "HTL-2025-04895", person: "Amira Al-Lawati",    time: "10:00", status: "accepted", detail: "Room 408, 3-night stay",         detailAr: "غرفة 408، إقامة 3 ليالٍ",       amount: "OMR 420.000" },
  { id: "c23", day: 20, type: "Check-In",    typeAr: "تسجيل دخول",  color: "#4ADE80", ref: "HTL-2025-04896", person: "Faisal Al-Kindi",    time: "15:30", status: "accepted", detail: "Suite 502, VIP guest",           detailAr: "جناح 502، ضيف VIP",             amount: "OMR 1,100.000" },
  { id: "c24", day: 25, type: "Booking",     typeAr: "حجز",          color: "#D4A84B", ref: "HTL-2025-04897", person: "Lena Müller",        time: "11:00", status: "accepted", detail: "Room 307, 5 nights",             detailAr: "غرفة 307، 5 ليالٍ",             amount: "OMR 650.000", endDay: 30 },
  { id: "c25", day: 29, type: "Room Change", typeAr: "تغيير غرفة",  color: "#FACC15", ref: "HTL-2025-04898", person: "Rashid Al-Habsi",    time: "14:00", status: "accepted", detail: "Room 103 → 203, Sea view",      detailAr: "غرفة 103 → 203، إطلالة بحرية" },
];

const DAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYS_AR = ["أحد", "اثن", "ثلا", "أرب", "خمي", "جمع", "سبت"];
const MONTHS_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTHS_AR = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];

const statusColor = (s: string) => s === "accepted" ? "#4ADE80" : s === "pending" ? "#FACC15" : "#F87171";
const statusLabel = (s: string, ar: boolean) => {
  if (s === "accepted") return ar ? "مقبول" : "Success";
  if (s === "pending") return ar ? "معلق" : "Pending";
  return ar ? "مرفوض" : "Failed";
};

const CalendarGrid = ({ isAr, entityType }: Props) => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const legend = ENTITY_LEGENDS[entityType] || ENTITY_LEGENDS.default;
  const quickActions = ENTITY_QUICK_ACTIONS[entityType] || ENTITY_QUICK_ACTIONS.default;

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else setViewMonth((m) => m + 1);
  };
  const goToday = () => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); setSelectedDay(today.getDate()); };

  const eventsForDay = (day: number) => MOCK_EVENTS.filter((e) => e.day === day);
  const multiDayForDay = (day: number) => MOCK_EVENTS.filter((e) => e.endDay && e.day <= day && (e.endDay || e.day) >= day && e.day !== day);
  const selectedEvents = selectedDay ? eventsForDay(selectedDay) : [];

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.12)", backdropFilter: "blur(12px)" }}>
      {/* Calendar header */}
      <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(181,142,60,0.08)" }}>
        <div className="flex items-center gap-2">
          <button type="button" onClick={prevMonth}
            className="w-8 h-8 flex items-center justify-center rounded-lg border cursor-pointer transition-colors"
            style={{ background: "transparent", borderColor: "rgba(181,142,60,0.2)", color: "#D4A84B" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(181,142,60,0.1)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>
            <i className="ri-arrow-left-s-line text-sm" />
          </button>
          <div className="text-center min-w-[180px]">
            <span className="text-white font-bold text-lg font-['JetBrains_Mono']">
              {isAr ? MONTHS_AR[viewMonth] : MONTHS_EN[viewMonth]} {viewYear}
            </span>
          </div>
          <button type="button" onClick={nextMonth}
            className="w-8 h-8 flex items-center justify-center rounded-lg border cursor-pointer transition-colors"
            style={{ background: "transparent", borderColor: "rgba(181,142,60,0.2)", color: "#D4A84B" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(181,142,60,0.1)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>
            <i className="ri-arrow-right-s-line text-sm" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button type="button" onClick={goToday}
            className="px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer whitespace-nowrap transition-colors"
            style={{ background: "rgba(181,142,60,0.08)", borderColor: "rgba(181,142,60,0.25)", color: "#D4A84B" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(181,142,60,0.15)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(181,142,60,0.08)"; }}>
            {isAr ? "اليوم" : "Today"}
          </button>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
            style={{ background: "rgba(74,222,128,0.06)", borderColor: "rgba(74,222,128,0.2)" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-bold font-['JetBrains_Mono']">LIVE</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-6 py-3 border-b" style={{ borderColor: "rgba(181,142,60,0.06)", background: "rgba(0,0,0,0.15)" }}>
        {legend.map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: l.color, boxShadow: `0 0 6px ${l.color}60` }} />
            <span className="text-gray-400 text-xs">{isAr ? l.labelAr : l.label}</span>
          </div>
        ))}
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full border-2 flex-shrink-0" style={{ borderColor: "#D4A84B" }} />
            <span className="text-gray-400 text-xs">{isAr ? "اليوم" : "Today"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-1.5 rounded-full flex-shrink-0" style={{ background: "rgba(181,142,60,0.4)" }} />
            <span className="text-gray-400 text-xs">{isAr ? "متعدد الأيام" : "Multi-day"}</span>
          </div>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 border-b" style={{ borderColor: "rgba(181,142,60,0.06)" }}>
        {(isAr ? DAYS_AR : DAYS_EN).map((d) => (
          <div key={d} className="py-2.5 text-center text-gray-500 text-xs font-bold font-['JetBrains_Mono'] uppercase tracking-wider">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="min-h-[100px] border-b border-r" style={{ borderColor: "rgba(181,142,60,0.04)", background: "rgba(0,0,0,0.15)" }} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayEvents = eventsForDay(day);
          const spanEvents = multiDayForDay(day);
          const isToday = isCurrentMonth && day === today.getDate();
          const isSelected = selectedDay === day;
          const hasEvents = dayEvents.length > 0 || spanEvents.length > 0;

          return (
            <div key={day}
              onClick={() => setSelectedDay(isSelected ? null : day)}
              className="min-h-[100px] border-b border-r p-2 cursor-pointer transition-all relative overflow-hidden"
              style={{
                borderColor: "rgba(181,142,60,0.06)",
                background: isSelected
                  ? "rgba(181,142,60,0.08)"
                  : isToday
                  ? "rgba(181,142,60,0.03)"
                  : "rgba(20,29,46,0.4)",
                outline: isSelected ? "1px solid rgba(181,142,60,0.3)" : "none",
              }}
              onMouseEnter={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "rgba(181,142,60,0.04)"; }}
              onMouseLeave={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = isToday ? "rgba(181,142,60,0.03)" : "rgba(20,29,46,0.4)"; }}>

              {/* Day number */}
              <div className="flex items-center justify-between mb-1.5">
                <div className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold font-['JetBrains_Mono'] transition-all ${isToday ? "text-black" : "text-white"}`}
                  style={{
                    background: isToday ? "#D4A84B" : "transparent",
                    boxShadow: isToday ? "0 0 12px rgba(181,142,60,0.5)" : "none",
                    border: isToday ? "none" : isSelected ? "1px solid rgba(181,142,60,0.4)" : "1px solid transparent",
                  }}>
                  {day}
                </div>
                {hasEvents && (
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#D4A84B", opacity: 0.6 }} />
                )}
              </div>

              {/* Multi-day span bars (from previous days) */}
              {spanEvents.slice(0, 1).map((ev) => (
                <div key={`span-${ev.id}`} className="mb-0.5 px-1.5 py-0.5 rounded-sm text-xs"
                  style={{ background: `${ev.color}20`, borderLeft: `2px solid ${ev.color}60` }}>
                  <span className="text-gray-500" style={{ fontSize: "9px" }}>···</span>
                </div>
              ))}

              {/* Event bars */}
              <div className="space-y-0.5">
                {dayEvents.slice(0, 3).map((ev) => (
                  <div key={ev.id} className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs truncate transition-opacity hover:opacity-80"
                    style={{
                      background: `${ev.color}15`,
                      borderLeft: `2px solid ${ev.color}`,
                      borderRight: ev.endDay ? `0px` : undefined,
                    }}>
                    <span className="truncate font-['Inter'] text-gray-300" style={{ fontSize: "9px" }}>
                      {isAr ? ev.typeAr : ev.type}
                    </span>
                    {ev.endDay && <i className="ri-arrow-right-line text-gray-600 flex-shrink-0" style={{ fontSize: "8px" }} />}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-center px-1 py-0.5 rounded" style={{ background: "rgba(181,142,60,0.08)", fontSize: "9px", color: "#D4A84B" }}>
                    +{dayEvents.length - 3} {isAr ? "أكثر" : "more"}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Day detail popup */}
      {selectedDay && (
        <div className="border-t" style={{ borderColor: "rgba(181,142,60,0.15)" }}>
          <div className="p-6">
            {/* Popup header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl font-bold font-['JetBrains_Mono'] text-black text-sm"
                  style={{ background: "#D4A84B", boxShadow: "0 0 16px rgba(181,142,60,0.4)" }}>
                  {selectedDay}
                </div>
                <div>
                  <div className="text-white font-bold text-sm">
                    {isAr
                      ? `${selectedDay} ${MONTHS_AR[viewMonth]} ${viewYear}`
                      : `${MONTHS_EN[viewMonth]} ${selectedDay}, ${viewYear}`}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {selectedEvents.length > 0
                      ? `${selectedEvents.length} ${isAr ? "أحداث مسجلة" : "events recorded"}`
                      : isAr ? "لا توجد أحداث" : "No events recorded"}
                  </div>
                </div>
              </div>
              <button type="button" onClick={() => setSelectedDay(null)}
                className="w-7 h-7 flex items-center justify-center rounded-full cursor-pointer text-gray-500 hover:text-white transition-colors"
                style={{ background: "rgba(255,255,255,0.05)" }}>
                <i className="ri-close-line text-sm" />
              </button>
            </div>

            {selectedEvents.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
                {selectedEvents.map((ev) => (
                  <div key={ev.id} className="flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer"
                    style={{ background: "rgba(11,18,32,0.6)", borderColor: `${ev.color}20` }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${ev.color}40`; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${ev.color}20`; }}>
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: ev.color, boxShadow: `0 0 6px ${ev.color}80` }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-white text-xs font-bold">{isAr ? ev.typeAr : ev.type}</span>
                        <span className="text-gray-600 text-xs font-['JetBrains_Mono']">{ev.ref}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                          style={{ background: `${statusColor(ev.status)}15`, color: statusColor(ev.status) }}>
                          {statusLabel(ev.status, isAr)}
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs mb-1">{isAr ? ev.detailAr : ev.detail}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-600 text-xs font-['JetBrains_Mono']">{ev.time}</span>
                        <span className="text-gray-600 text-xs">{ev.person}</span>
                        {ev.amount && <span className="text-gold-400 text-xs font-['JetBrains_Mono']">{ev.amount}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 mb-4 rounded-xl border"
                style={{ background: "rgba(11,18,32,0.4)", borderColor: "rgba(181,142,60,0.08)" }}>
                <i className="ri-calendar-line text-gray-700 text-3xl mb-2" />
                <p className="text-gray-600 text-sm">{isAr ? "لا توجد أحداث في هذا اليوم" : "No events on this day"}</p>
              </div>
            )}

            {/* Quick actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-gray-600 text-xs font-['JetBrains_Mono'] uppercase tracking-wider mr-1">
                {isAr ? "إجراءات سريعة:" : "Quick Actions:"}
              </span>
              {quickActions.map((action) => (
                <button key={action.label} type="button"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors"
                  style={{ background: "#D4A84B", color: "#0B1220" }}>
                  <i className={`${action.icon} text-xs`} />
                  {isAr ? action.labelAr : action.label}
                </button>
              ))}
              <button type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors"
                style={{ background: "transparent", borderColor: "rgba(181,142,60,0.3)", color: "#D4A84B" }}>
                <i className="ri-list-check-2 text-xs" />
                {isAr ? "عرض الكل" : "View All"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarGrid;
