interface Props {
  isAr: boolean;
}

interface OverstayRecord {
  id: string;
  name: string;
  nameAr: string;
  nationality: string;
  flag: string;
  docNumber: string;
  visaType: string;
  expiredDate: string;
  daysOverdue: number;
  lastKnownHotel: string;
  lastKnownHotelAr: string;
  entryPoint: string;
  status: "amber" | "red" | "critical";
}

const OVERSTAY_DATA: OverstayRecord[] = [
  { id: "OS-001", name: "Mohammed Al-Rashidi", nameAr: "محمد الراشدي", nationality: "Yemen", flag: "🇾🇪", docNumber: "YE-4821-X", visaType: "Tourist", expiredDate: "2026-03-28", daysOverdue: 8, lastKnownHotel: "Al Falaj Hotel, Muscat", lastKnownHotelAr: "فندق الفلج، مسقط", entryPoint: "Muscat Int'l", status: "amber" },
  { id: "OS-002", name: "Priya Nair", nameAr: "بريا ناير", nationality: "India", flag: "🇮🇳", docNumber: "IN-7734-K", visaType: "Visit", expiredDate: "2026-03-22", daysOverdue: 14, lastKnownHotel: "Crowne Plaza Muscat", lastKnownHotelAr: "كراون بلازا مسقط", entryPoint: "Muscat Int'l", status: "red" },
  { id: "OS-003", name: "Abdi Hassan", nameAr: "عبدي حسن", nationality: "Somalia", flag: "🇸🇴", docNumber: "SO-1122-M", visaType: "Transit", expiredDate: "2026-03-10", daysOverdue: 26, lastKnownHotel: "Unknown", lastKnownHotelAr: "غير معروف", entryPoint: "Salalah Airport", status: "critical" },
  { id: "OS-004", name: "Zhang Wei", nameAr: "تشانغ وي", nationality: "China", flag: "🇨🇳", docNumber: "CN-9901-P", visaType: "Business", expiredDate: "2026-03-30", daysOverdue: 6, lastKnownHotel: "Sheraton Oman Hotel", lastKnownHotelAr: "شيراتون عُمان", entryPoint: "Muscat Int'l", status: "amber" },
  { id: "OS-005", name: "Fatima Osman", nameAr: "فاطمة عثمان", nationality: "Ethiopia", flag: "🇪🇹", docNumber: "ET-5543-R", visaType: "Work", expiredDate: "2026-03-15", daysOverdue: 21, lastKnownHotel: "Ruwi Budget Inn", lastKnownHotelAr: "فندق الروي", entryPoint: "Muscat Int'l", status: "red" },
  { id: "OS-006", name: "Reza Tehrani", nameAr: "رضا طهراني", nationality: "Iran", flag: "🇮🇷", docNumber: "IR-3312-F", visaType: "Tourist", expiredDate: "2026-03-05", daysOverdue: 31, lastKnownHotel: "Unknown", lastKnownHotelAr: "غير معروف", entryPoint: "Hatta Crossing", status: "critical" },
];

const statusColor = (status: OverstayRecord["status"]) => {
  if (status === "amber") return "#FACC15";
  if (status === "red") return "#FB923C";
  return "#F87171";
};

const statusLabel = (status: OverstayRecord["status"], isAr: boolean) => {
  if (status === "amber") return isAr ? "تحذير" : "Warning";
  if (status === "red") return isAr ? "تنبيه" : "Alert";
  return isAr ? "حرج" : "Critical";
};

const OverstayTracker = ({ isAr }: Props) => {
  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(10,22,40,0.8)", borderColor: "rgba(248,113,113,0.2)", backdropFilter: "blur(12px)" }}>
      <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(248,113,113,0.12)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)" }}>
            <i className="ri-alarm-warning-line text-red-400 text-sm" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">{isAr ? "متتبع تجاوز الإقامة" : "Overstay Tracker"}</h3>
            <p className="text-gray-500 text-xs">{isAr ? "أشخاص تجاوزوا صلاحية التأشيرة" : "Persons past visa expiry date"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border" style={{ background: "rgba(248,113,113,0.08)", borderColor: "rgba(248,113,113,0.2)" }}>
          <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
          <span className="text-red-400 text-xs font-bold font-['JetBrains_Mono']">{OVERSTAY_DATA.length} {isAr ? "حالة" : "CASES"}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              {[
                isAr ? "الحالة" : "Status",
                isAr ? "الشخص" : "Person",
                isAr ? "الجنسية" : "Nationality",
                isAr ? "نوع التأشيرة" : "Visa Type",
                isAr ? "انتهت في" : "Expired",
                isAr ? "أيام التجاوز" : "Days Overdue",
                isAr ? "آخر فندق معروف" : "Last Known Hotel",
                isAr ? "نقطة الدخول" : "Entry Point",
              ].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
            {OVERSTAY_DATA.map((rec) => {
              const color = statusColor(rec.status);
              return (
                <tr key={rec.id} className="hover:bg-white/[0.02] transition-colors" style={{ borderLeft: `3px solid ${color}` }}>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap" style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
                      {statusLabel(rec.status, isAr)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-white text-sm font-semibold whitespace-nowrap">{isAr ? rec.nameAr : rec.name}</div>
                    <div className="text-gray-500 text-xs font-['JetBrains_Mono']">{rec.docNumber}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <span className="text-base">{rec.flag}</span>
                      <span className="text-gray-300 text-xs">{isAr ? rec.nationality : rec.nationality}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-300 text-xs whitespace-nowrap">{rec.visaType}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-400 text-xs font-['JetBrains_Mono'] whitespace-nowrap">{rec.expiredDate}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black font-['JetBrains_Mono']" style={{ color }}>{rec.daysOverdue}</span>
                      <span className="text-gray-500 text-xs">{isAr ? "يوم" : "days"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      {rec.lastKnownHotel === "Unknown" ? (
                        <span className="text-red-400 text-xs font-semibold">{isAr ? "غير معروف" : "Unknown"}</span>
                      ) : (
                        <>
                          <i className="ri-hotel-line text-cyan-400 text-xs" />
                          <span className="text-gray-300 text-xs">{isAr ? rec.lastKnownHotelAr : rec.lastKnownHotel}</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-400 text-xs whitespace-nowrap">{rec.entryPoint}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OverstayTracker;
