interface Props {
  isAr: boolean;
}

interface CrossStreamEvent {
  id: string;
  personName: string;
  personNameAr: string;
  nationality: string;
  flag: string;
  entryTime: string;
  entryPoint: string;
  hotelCheckIn: string | null;
  hotelName: string | null;
  hotelNameAr: string | null;
  hoursElapsed: number;
  status: "checked-in" | "flagged" | "monitoring";
  linkedEvents: string[];
}

const CROSS_STREAM: CrossStreamEvent[] = [
  { id: "CS-001", personName: "Amir Al-Farsi", personNameAr: "أمير الفارسي", nationality: "UAE", flag: "🇦🇪", entryTime: "08:14", entryPoint: "Capital Int'l Airport", hotelCheckIn: "09:47", hotelName: "W Capital Hotel", hotelNameAr: "فندق W العاصمة", hoursElapsed: 1.5, status: "checked-in", linkedEvents: ["ENTRY", "HOTEL_CHECKIN"] },
  { id: "CS-002", personName: "Sarah Mitchell", personNameAr: "سارة ميتشل", nationality: "UK", flag: "🇬🇧", entryTime: "10:22", entryPoint: "Capital Int'l Airport", hotelCheckIn: null, hotelName: null, hotelNameAr: null, hoursElapsed: 26, status: "flagged", linkedEvents: ["ENTRY"] },
  { id: "CS-003", personName: "Raj Patel", personNameAr: "راج باتيل", nationality: "India", flag: "🇮🇳", entryTime: "06:55", entryPoint: "Southern Airport", hotelCheckIn: "08:30", hotelName: "Hilton Southern City", hotelNameAr: "هيلتون المدينة الجنوبية", hoursElapsed: 1.6, status: "checked-in", linkedEvents: ["ENTRY", "HOTEL_CHECKIN", "CAR_RENTAL"] },
  { id: "CS-004", personName: "Chen Jing", personNameAr: "تشن جينغ", nationality: "China", flag: "🇨🇳", entryTime: "14:10", entryPoint: "Capital Int'l Airport", hotelCheckIn: null, hotelName: null, hotelNameAr: null, hoursElapsed: 18, status: "monitoring", linkedEvents: ["ENTRY"] },
  { id: "CS-005", personName: "Omar Khalid", personNameAr: "عمر خالد", nationality: "Jordan", flag: "🇯🇴", entryTime: "11:30", entryPoint: "Eastern Land Crossing", hotelCheckIn: "13:15", hotelName: "Radisson Blu Capital", hotelNameAr: "راديسون بلو العاصمة", hoursElapsed: 1.75, status: "checked-in", linkedEvents: ["ENTRY", "HOTEL_CHECKIN", "SIM_PURCHASE"] },
];

const statusColor = (s: CrossStreamEvent["status"]) => {
  if (s === "checked-in") return "#4ADE80";
  if (s === "flagged") return "#F87171";
  return "#FACC15";
};

const statusLabel = (s: CrossStreamEvent["status"], isAr: boolean) => {
  if (s === "checked-in") return isAr ? "تسجيل دخول" : "Checked In";
  if (s === "flagged") return isAr ? "مُبلَّغ" : "Flagged";
  return isAr ? "مراقبة" : "Monitoring";
};

const eventBadgeColor = (e: string) => {
  if (e === "ENTRY") return "#D4A84B";
  if (e === "HOTEL_CHECKIN") return "#4ADE80";
  if (e === "CAR_RENTAL") return "#FB923C";
  if (e === "SIM_PURCHASE") return "#A78BFA";
  return "#9CA3AF";
};

const CrossStreamPanel = ({ isAr }: Props) => {
  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(20,29,46,0.8)", borderColor: "rgba(181,142,60,0.15)", backdropFilter: "blur(12px)" }}>
      <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(181,142,60,0.1)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(181,142,60,0.1)", border: "1px solid rgba(181,142,60,0.2)" }}>
            <i className="ri-links-line text-gold-400 text-sm" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">{isAr ? "قيمة التدفق المتقاطع" : "Cross-Stream Intelligence"}</h3>
            <p className="text-gray-500 text-xs">{isAr ? "ربط دخول الحدود بجميع الأحداث اللاحقة داخل البلاد" : "Linking border entry to all subsequent in-country events"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border" style={{ background: "rgba(248,113,113,0.08)", borderColor: "rgba(248,113,113,0.2)" }}>
          <i className="ri-alarm-warning-line text-red-400 text-xs" />
          <span className="text-red-400 text-xs font-bold font-['JetBrains_Mono']">
            {CROSS_STREAM.filter(c => c.status === "flagged").length} {isAr ? "تنبيه" : "FLAGGED"}
          </span>
        </div>
      </div>

      {/* Rule banner */}
      <div className="flex items-center gap-3 px-6 py-3 border-b" style={{ background: "rgba(248,113,113,0.04)", borderColor: "rgba(248,113,113,0.1)" }}>
        <i className="ri-information-line text-red-400 text-sm flex-shrink-0" />
        <p className="text-gray-400 text-xs">
          {isAr
            ? "عند وصول شخص → يراقب Al-Ameen تلقائياً أول تسجيل دخول فندقي. عدم تسجيل الدخول خلال 24 ساعة → تنبيه."
            : "When person arrives → Al-Ameen auto-monitors for first hotel check-in. No check-in within 24h → flag."}
        </p>
      </div>

      <div className="divide-y" style={{ borderColor: "rgba(181,142,60,0.06)" }}>
        {CROSS_STREAM.map((rec) => {
          const color = statusColor(rec.status);
          return (
            <div key={rec.id} className="flex items-start gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors">
              <div className="flex-shrink-0 text-xl mt-0.5">{rec.flag}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-white font-semibold text-sm">{isAr ? rec.personNameAr : rec.personName}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
                    {statusLabel(rec.status, isAr)}
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <div className="flex items-center gap-1">
                    <i className="ri-login-box-line text-gold-400 text-xs" />
                    <span className="text-gray-400 text-xs">{rec.entryPoint}</span>
                    <span className="text-gray-600 text-xs font-['JetBrains_Mono']">@ {rec.entryTime}</span>
                  </div>
                  {rec.hotelCheckIn && (
                    <>
                      <i className="ri-arrow-right-line text-gray-600 text-xs" />
                      <div className="flex items-center gap-1">
                        <i className="ri-hotel-line text-green-400 text-xs" />
                        <span className="text-gray-400 text-xs">{isAr ? rec.hotelNameAr : rec.hotelName}</span>
                        <span className="text-gray-600 text-xs font-['JetBrains_Mono']">@ {rec.hotelCheckIn}</span>
                      </div>
                    </>
                  )}
                  {rec.status === "flagged" && (
                    <>
                      <i className="ri-arrow-right-line text-gray-600 text-xs" />
                      <span className="text-red-400 text-xs font-semibold">{isAr ? `لا يوجد تسجيل دخول بعد ${rec.hoursElapsed}h` : `No check-in after ${rec.hoursElapsed}h`}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {rec.linkedEvents.map((evt) => (
                    <span key={evt} className="px-1.5 py-0.5 rounded text-xs font-bold font-['JetBrains_Mono']"
                      style={{ background: `${eventBadgeColor(evt)}12`, color: eventBadgeColor(evt), border: `1px solid ${eventBadgeColor(evt)}25`, fontSize: "9px" }}>
                      {evt}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs font-['JetBrains_Mono'] text-gray-500">{rec.id}</div>
                <div className="text-xs text-gray-600 mt-0.5">{rec.hoursElapsed}h {isAr ? "مضت" : "ago"}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CrossStreamPanel;
