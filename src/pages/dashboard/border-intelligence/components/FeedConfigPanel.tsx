import { useState, useEffect } from "react";

interface Props {
  isAr: boolean;
}

interface SourceSystem {
  id: string;
  name: string;
  nameAr: string;
  type: string;
  typeAr: string;
  icon: string;
  status: "online" | "offline";
  lastSync: string;
  eventsToday: number;
  color: string;
}

interface EventTypeRow {
  code: string;
  label: string;
  labelAr: string;
  count: number;
  color: string;
  icon: string;
  enabled: boolean;
}

const SOURCE_SYSTEMS: SourceSystem[] = [
  { id: "iborders-air", name: "iBorders — Air", nameAr: "iBorders — جوي", type: "Land/Sea/Air Border Control", typeAr: "مراقبة الحدود البرية/البحرية/الجوية", icon: "ri-flight-takeoff-line", status: "online", lastSync: "2026-04-05 14:32:07", eventsToday: 4821, color: "#D6B47E" },
  { id: "iborders-land", name: "iBorders — Land", nameAr: "iBorders — بري", type: "Land Border Crossings", typeAr: "المنافذ البرية", icon: "ri-road-map-line", status: "online", lastSync: "2026-04-05 14:31:55", eventsToday: 1247, color: "#4ADE80" },
  { id: "iborders-sea", name: "iBorders — Sea", nameAr: "iBorders — بحري", type: "Sea Ports & Vessels", typeAr: "الموانئ البحرية والسفن", icon: "ri-ship-line", status: "online", lastSync: "2026-04-05 14:30:12", eventsToday: 389, color: "#C98A1B" },
  { id: "evisa", name: "eVisa Portal", nameAr: "بوابة التأشيرة الإلكترونية", type: "Visa Issuance & Management", typeAr: "إصدار وإدارة التأشيرات", icon: "ri-passport-line", status: "online", lastSync: "2026-04-05 14:32:01", eventsToday: 2156, color: "#A78BFA" },
];

const EVENT_TYPES: EventTypeRow[] = [
  { code: "ENTRY", label: "Entry (Arrival)", labelAr: "دخول (وصول)", count: 3241, color: "#4ADE80", icon: "ri-login-box-line", enabled: true },
  { code: "EXIT", label: "Exit (Departure)", labelAr: "خروج (مغادرة)", count: 2987, color: "#D6B47E", icon: "ri-logout-box-line", enabled: true },
  { code: "VISA_ISSUED", label: "Visa Issued", labelAr: "تأشيرة صادرة", count: 1432, color: "#A78BFA", icon: "ri-file-check-line", enabled: true },
  { code: "VISA_EXTENDED", label: "Visa Extended", labelAr: "تأشيرة ممتدة", count: 287, color: "#FACC15", icon: "ri-time-line", enabled: true },
  { code: "VISA_EXPIRED", label: "Visa Expired", labelAr: "تأشيرة منتهية", count: 94, color: "#C98A1B", icon: "ri-calendar-close-line", enabled: true },
  { code: "OVERSTAY", label: "Overstay Detected", labelAr: "تجاوز مدة الإقامة", count: 31, color: "#C94A5E", icon: "ri-alarm-warning-line", enabled: true },
  { code: "DEPORTATION", label: "Deportation", labelAr: "ترحيل", count: 7, color: "#C94A5E", icon: "ri-user-unfollow-line", enabled: true },
  { code: "TRANSIT", label: "Transit", labelAr: "عبور", count: 512, color: "#9CA3AF", icon: "ri-route-line", enabled: true },
  { code: "REENTRY", label: "Re-Entry", labelAr: "إعادة دخول", count: 198, color: "#D6B47E", icon: "ri-refresh-line", enabled: true },
];

const FeedConfigPanel = ({ isAr }: Props) => {
  const [eventTypes, setEventTypes] = useState<EventTypeRow[]>(EVENT_TYPES);
  const [syncPulse, setSyncPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSyncPulse(true);
      setTimeout(() => setSyncPulse(false), 600);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleEvent = (code: string) => {
    setEventTypes((prev) => prev.map((e) => e.code === code ? { ...e, enabled: !e.enabled } : e));
  };

  const totalToday = SOURCE_SYSTEMS.reduce((s, x) => s + x.eventsToday, 0);

  return (
    <div className="space-y-6">
      {/* Header stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: isAr ? "إجمالي الأحداث اليوم" : "Total Events Today", value: totalToday.toLocaleString(), icon: "ri-pulse-line", color: "#D6B47E" },
          { label: isAr ? "المصادر النشطة" : "Active Sources", value: `${SOURCE_SYSTEMS.filter(s => s.status === "online").length}/${SOURCE_SYSTEMS.length}`, icon: "ri-server-line", color: "#4ADE80" },
          { label: isAr ? "أنواع الأحداث المفعّلة" : "Event Types Enabled", value: `${eventTypes.filter(e => e.enabled).length}/${eventTypes.length}`, icon: "ri-toggle-line", color: "#A78BFA" },
          { label: isAr ? "آخر مزامنة" : "Last Sync", value: "14:32:07", icon: "ri-refresh-line", color: "#FACC15" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border p-4" style={{ background: "rgba(10,37,64,0.8)", borderColor: "rgba(184,138,60,0.12)", backdropFilter: "blur(12px)" }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 flex items-center justify-center rounded-lg" style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}30` }}>
                <i className={`${stat.icon} text-xs`} style={{ color: stat.color }} />
              </div>
              <span className="text-gray-500 text-xs">{stat.label}</span>
            </div>
            <div className="text-2xl font-black font-['JetBrains_Mono']" style={{ color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Source Systems */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(10,37,64,0.8)", borderColor: "rgba(184,138,60,0.15)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(184,138,60,0.1)" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(184,138,60,0.1)", border: "1px solid rgba(184,138,60,0.2)" }}>
              <i className="ri-server-line text-gold-400 text-sm" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">{isAr ? "أنظمة المصدر" : "Source Systems"}</h3>
              <p className="text-gray-500 text-xs">{isAr ? "تغذية تلقائية من الشرطة — لا إدخال يدوي" : "Automated feed from Police — no manual entry"}</p>
            </div>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${syncPulse ? "opacity-100" : "opacity-70"}`} style={{ background: "rgba(74,222,128,0.06)", borderColor: "rgba(74,222,128,0.2)" }}>
            <div className={`w-1.5 h-1.5 rounded-full bg-green-400 ${syncPulse ? "animate-ping" : "animate-pulse"}`} />
            <span className="text-green-400 text-xs font-semibold font-['JetBrains_Mono']">{isAr ? "مزامنة مباشرة" : "LIVE SYNC"}</span>
          </div>
        </div>
        <div className="divide-y" style={{ borderColor: "rgba(184,138,60,0.06)" }}>
          {SOURCE_SYSTEMS.map((sys) => (
            <div key={sys.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0" style={{ background: `${sys.color}12`, border: `1px solid ${sys.color}25` }}>
                <i className={`${sys.icon} text-base`} style={{ color: sys.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-white font-semibold text-sm">{isAr ? sys.nameAr : sys.name}</span>
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${sys.status === "online" ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
                  <span className="text-xs font-semibold" style={{ color: sys.status === "online" ? "#4ADE80" : "#C94A5E" }}>
                    {sys.status === "online" ? (isAr ? "متصل" : "ONLINE") : (isAr ? "غير متصل" : "OFFLINE")}
                  </span>
                </div>
                <p className="text-gray-500 text-xs">{isAr ? sys.typeAr : sys.type}</p>
              </div>
              <div className="hidden md:block text-center">
                <div className="text-white font-bold text-sm font-['JetBrains_Mono']">{sys.eventsToday.toLocaleString()}</div>
                <div className="text-gray-500 text-xs">{isAr ? "أحداث اليوم" : "events today"}</div>
              </div>
              <div className="hidden lg:block text-right">
                <div className="text-gray-400 text-xs font-['JetBrains_Mono']">{isAr ? "آخر مزامنة" : "Last sync"}</div>
                <div className="text-gold-400 text-xs font-['JetBrains_Mono']">{sys.lastSync.split(" ")[1]}</div>
              </div>
              <div className="flex-shrink-0 px-3 py-1 rounded-lg text-xs font-bold font-['JetBrains_Mono']" style={{ background: `${sys.color}12`, color: sys.color, border: `1px solid ${sys.color}25` }}>
                {sys.id.toUpperCase().replace("-", "_")}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event Types */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(10,37,64,0.8)", borderColor: "rgba(184,138,60,0.15)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(184,138,60,0.1)" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(184,138,60,0.1)", border: "1px solid rgba(184,138,60,0.2)" }}>
              <i className="ri-list-settings-line text-gold-400 text-sm" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">{isAr ? "أنواع الأحداث المستلمة" : "Event Types Received"}</h3>
              <p className="text-gray-500 text-xs">{isAr ? "تفعيل/تعطيل أنواع الأحداث لمعالجة Al-Ameen" : "Toggle event types for Al-Ameen processing"}</p>
            </div>
          </div>
          <span className="text-gray-500 text-xs">{isAr ? "اليوم" : "Today's counts"}</span>
        </div>
        <div className="divide-y" style={{ borderColor: "rgba(184,138,60,0.06)" }}>
          {eventTypes.map((evt) => (
            <div key={evt.code} className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/[0.02] transition-colors">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${evt.color}12`, border: `1px solid ${evt.color}25` }}>
                <i className={`${evt.icon} text-sm`} style={{ color: evt.color }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-semibold">{isAr ? evt.labelAr : evt.label}</span>
                  <span className="px-1.5 py-0.5 rounded text-xs font-bold font-['JetBrains_Mono']" style={{ background: `${evt.color}12`, color: evt.color }}>{evt.code}</span>
                </div>
              </div>
              <div className="text-right mr-4">
                <span className="text-white font-bold text-sm font-['JetBrains_Mono']">{evt.count.toLocaleString()}</span>
              </div>
              {/* Toggle */}
              <button type="button" onClick={() => toggleEvent(evt.code)}
                className="relative w-10 h-5 rounded-full transition-all duration-300 flex-shrink-0 cursor-pointer"
                style={{ background: evt.enabled ? "#D6B47E" : "rgba(255,255,255,0.1)" }}>
                <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm"
                  style={{ left: evt.enabled ? "calc(100% - 18px)" : "2px" }} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Data Fields Info */}
      <div className="rounded-2xl border p-6" style={{ background: "rgba(10,37,64,0.8)", borderColor: "rgba(184,138,60,0.15)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: "rgba(184,138,60,0.1)", border: "1px solid rgba(184,138,60,0.2)" }}>
            <i className="ri-database-2-line text-gold-400 text-sm" />
          </div>
          <h3 className="text-white font-bold text-sm">{isAr ? "حقول البيانات لكل حدث" : "Data Fields Per Event"}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { icon: "ri-id-card-line", label: isAr ? "وثيقة الشخص + النوع + الجنسية" : "Person Document + Type + Nationality", color: "#D6B47E" },
            { icon: "ri-map-pin-line", label: isAr ? "نقطة الدخول/الخروج (مطار/ميناء/معبر)" : "Entry/Exit Point (airport/port/land crossing)", color: "#4ADE80" },
            { icon: "ri-calendar-event-line", label: isAr ? "التاريخ والوقت" : "Date / Time", color: "#FACC15" },
            { icon: "ri-file-text-line", label: isAr ? "نوع التأشيرة + الرقم + الصلاحية" : "Visa Type + Number + Validity", color: "#A78BFA" },
            { icon: "ri-flight-takeoff-line", label: isAr ? "الناقل (شركة طيران/سفينة)" : "Carrier (airline/vessel)", color: "#C98A1B" },
            { icon: "ri-ticket-line", label: isAr ? "مرجع الحجز + المقعد/الكابينة" : "Booking Reference + Seat/Cabin", color: "#D6B47E" },
            { icon: "ri-history-line", label: isAr ? "سجل السفر (آخر 3 دول)" : "Travel History (previous 3 countries)", color: "#4ADE80" },
            { icon: "ri-group-line", label: isAr ? "المسافرون المرافقون (نفس مرجع الحجز)" : "Companion Travelers (same booking ref)", color: "#FACC15" },
          ].map((field) => (
            <div key={field.label} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="w-6 h-6 flex items-center justify-center rounded flex-shrink-0" style={{ background: `${field.color}12` }}>
                <i className={`${field.icon} text-xs`} style={{ color: field.color }} />
              </div>
              <span className="text-gray-300 text-xs">{field.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Al-Ameen Note */}
      <div className="flex items-start gap-3 px-5 py-4 rounded-xl border" style={{ background: "rgba(184,138,60,0.04)", borderColor: "rgba(184,138,60,0.15)" }}>
        <i className="ri-information-line text-gold-400 text-sm mt-0.5 flex-shrink-0" />
        <p className="text-gray-400 text-sm">
          {isAr
            ? "Al-Ameen لا يتحكم في أنظمة الحدود. هذه تغذية نظام إلى نظام من منصات iBorders وeVisa. يقوم Al-Ameen بإثراء هذه البيانات بتحليلات متعددة التدفقات."
            : "Al-Ameen does NOT control border systems. This is a system-to-system feed from iBorders and eVisa platforms. Al-Ameen enriches this data with cross-stream analytics."}
        </p>
      </div>
    </div>
  );
};

export default FeedConfigPanel;
