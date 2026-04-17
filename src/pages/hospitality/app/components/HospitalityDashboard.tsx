import { useState } from 'react';
import { recentActivities, bookings, rooms, syncLogs } from '@/mocks/hospitalityData';

interface Props {
  lang: 'en' | 'ar';
  onNav: (key: string) => void;
}

const activityTypeLabels: Record<string, { en: string; ar: string }> = {
  'check-in':    { en: 'Check-In',    ar: 'تسجيل دخول' },
  'check-out':   { en: 'Check-Out',   ar: 'تسجيل خروج' },
  'booking':     { en: 'New Booking', ar: 'حجز جديد' },
  'change-room': { en: 'Room Change', ar: 'تغيير غرفة' },
};

const syncStatusConfig = {
  success: { color: '#4ADE80', bg: 'rgba(74,222,128,0.1)',  icon: 'ri-cloud-fill',        label: 'Synced',  labelAr: 'تمت المزامنة' },
  pending: { color: '#FACC15', bg: 'rgba(250,204,21,0.1)',  icon: 'ri-cloud-line',         label: 'Pending', labelAr: 'معلق' },
  failed:  { color: '#F87171', bg: 'rgba(248,113,113,0.1)', icon: 'ri-cloud-off-line',     label: 'Failed',  labelAr: 'فشل' },
};

export default function HospitalityDashboard({ lang, onNav }: Props) {
  const isAr = lang === 'ar';
  const [activeTab, setActiveTab] = useState<'activity' | 'sync'>('activity');

  const inHouse = bookings.filter(b => b.status === 'checked_in').length;
  const arrivals = bookings.filter(b => b.status === 'confirmed').length;
  const departures = bookings.filter(b => b.status === 'checked_in' && b.checkOut === '2025-04-06').length;
  const available = rooms.filter(r => r.status === 'available').length;
  const occupied = rooms.filter(r => r.status === 'occupied').length;
  const maintenance = rooms.filter(r => r.status === 'maintenance').length;
  const reserved = rooms.filter(r => r.status === 'reserved').length;
  const occupancyPct = Math.round((occupied / rooms.length) * 100);

  const KPI_DATA = [
    { key: 'checkin',     labelEn: 'New Check-In',      labelAr: 'تسجيل وصول جديد',  value: inHouse,    icon: 'ri-login-box-line',     color: '#4ADE80', navKey: 'checkin',     actionEn: 'Check-In',  actionAr: 'تسجيل دخول' },
    { key: 'checkout',    labelEn: 'Check-Out',          labelAr: 'تسجيل مغادرة',     value: departures, icon: 'ri-logout-box-line',    color: '#FB923C', navKey: 'checkout',    actionEn: 'Check-Out', actionAr: 'تسجيل خروج' },
    { key: 'booking',     labelEn: 'New Booking',        labelAr: 'حجز جديد',          value: arrivals,   icon: 'ri-calendar-check-line',color: '#D4A84B', navKey: 'new-booking', actionEn: 'New Booking',actionAr: 'حجز جديد' },
    { key: 'changeroom',  labelEn: 'Change Room',        labelAr: 'تغيير الغرفة',      value: 2,          icon: 'ri-door-line',          color: '#FACC15', navKey: 'changeroom',  actionEn: 'Change Room',actionAr: 'تغيير غرفة' },
  ];

  const roomStatusConfig = {
    available:   { color: '#4ADE80', bg: 'rgba(74,222,128,0.15)',  label: 'Available',    labelAr: 'متاحة' },
    occupied:    { color: '#D4A84B', bg: 'rgba(181,142,60,0.15)',  label: 'Occupied',     labelAr: 'مشغولة' },
    reserved:    { color: '#FACC15', bg: 'rgba(250,204,21,0.15)',  label: 'Reserved',     labelAr: 'محجوزة' },
    maintenance: { color: '#F87171', bg: 'rgba(248,113,113,0.15)', label: 'Maintenance',  labelAr: 'صيانة' },
  };

  return (
    <div className="p-5 space-y-4">
      {/* Top KPI row */}
      <div className="grid grid-cols-4 gap-3">
        {KPI_DATA.map(kpi => (
          <div
            key={kpi.key}
            className="rounded-xl border border-gold-500/15 p-4 flex flex-col gap-3"
            style={{ background: 'rgba(20,29,46,0.8)' }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-xs mb-1">{isAr ? kpi.labelAr : kpi.labelEn}</p>
                <p className="font-mono font-bold text-3xl leading-none" style={{ color: kpi.color }}>
                  {kpi.value}
                </p>
              </div>
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${kpi.color}15` }}
              >
                <i className={`${kpi.icon} text-lg`} style={{ color: kpi.color }} />
              </div>
            </div>
            <button
              onClick={() => onNav(kpi.navKey)}
              className="w-full py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all whitespace-nowrap"
              style={{ background: '#D4A84B', color: '#0B1220' }}
            >
              {isAr ? kpi.actionAr : kpi.actionEn}
            </button>
          </div>
        ))}
      </div>

      {/* Middle row: Occupancy + Room Grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Occupancy gauge */}
        <div
          className="rounded-xl border border-gold-500/15 p-4"
          style={{ background: 'rgba(20,29,46,0.8)' }}
        >
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">
            {isAr ? 'نسبة الإشغال' : 'Occupancy Rate'}
          </p>

          {/* Circular gauge */}
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-28 h-28">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(181,142,60,0.1)" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke="#D4A84B" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${occupancyPct * 2.51} 251`}
                  style={{ transition: 'stroke-dasharray 1s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-white font-mono font-bold text-2xl">{occupancyPct}%</span>
                <span className="text-gray-500 text-xs">{isAr ? 'إشغال' : 'Occupied'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {[
              { label: isAr ? 'متاحة' : 'Available',   value: available,    color: '#4ADE80' },
              { label: isAr ? 'مشغولة' : 'Occupied',   value: occupied,     color: '#D4A84B' },
              { label: isAr ? 'محجوزة' : 'Reserved',   value: reserved,     color: '#FACC15' },
              { label: isAr ? 'صيانة' : 'Maintenance', value: maintenance,  color: '#F87171' },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                  <span className="text-gray-400 text-xs">{s.label}</span>
                </div>
                <span className="text-white font-mono text-xs font-semibold">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Room grid */}
        <div
          className="col-span-2 rounded-xl border border-gold-500/15 p-4"
          style={{ background: 'rgba(20,29,46,0.8)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-400 text-xs uppercase tracking-wider">
              {isAr ? 'خريطة الغرف' : 'Room Map'}
            </p>
            <div className="flex items-center gap-3">
              {Object.entries(roomStatusConfig).map(([k, v]) => (
                <div key={k} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: v.color }} />
                  <span className="text-gray-600 text-xs">{isAr ? v.labelAr : v.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Floor groups */}
          <div className="space-y-3">
            {[1, 2, 3].map(floor => {
              const floorRooms = rooms.filter(r => r.floor === floor);
              return (
                <div key={floor}>
                  <p className="text-gray-600 text-xs mb-1.5">
                    {isAr ? `الطابق ${floor}` : `Floor ${floor}`}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {floorRooms.map(room => {
                      const sc = roomStatusConfig[room.status];
                      return (
                        <div
                          key={room.id}
                          className="relative group cursor-pointer"
                          title={`Room ${room.number} — ${room.type} — ${room.status}`}
                        >
                          <div
                            className="w-12 h-10 rounded-lg flex flex-col items-center justify-center border transition-all hover:scale-105"
                            style={{ background: sc.bg, borderColor: `${sc.color}40` }}
                          >
                            <span className="text-white font-mono font-bold text-xs">{room.number}</span>
                            <span className="text-xs capitalize" style={{ color: sc.color, fontSize: 9 }}>
                              {room.type.slice(0, 3)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom row: Activity + Sync log */}
      <div
        className="rounded-xl border border-gold-500/20"
        style={{ background: 'rgba(20,29,46,0.8)' }}
      >
        {/* Tab header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-0 border-b border-gold-500/10">
          <div className="flex gap-1">
            {[
              { key: 'activity', en: 'Recent Activity', ar: 'آخر الأنشطة' },
              { key: 'sync',     en: 'AMEEN Sync Log',  ar: 'سجل مزامنة أمين' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'activity' | 'sync')}
                className="px-4 py-2 text-xs font-medium cursor-pointer transition-all whitespace-nowrap border-b-2"
                style={{
                  color: activeTab === tab.key ? '#D4A84B' : '#6B7280',
                  borderBottomColor: activeTab === tab.key ? '#D4A84B' : 'transparent',
                }}
              >
                {isAr ? tab.ar : tab.en}
              </button>
            ))}
          </div>
          <button
            onClick={() => onNav(activeTab === 'activity' ? 'eventlist' : 'sync')}
            className="text-gold-400 text-xs hover:text-gold-300 cursor-pointer transition-colors whitespace-nowrap pb-2"
          >
            {isAr ? 'عرض الكل' : 'View All'} <i className="ri-arrow-right-line" />
          </button>
        </div>

        <div className="p-4">
          {activeTab === 'activity' && (
            <div className="space-y-2">
              {recentActivities.map(act => (
                <div
                  key={act.id}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-transparent hover:border-gold-500/15 cursor-pointer transition-all"
                  style={{ background: 'rgba(181,142,60,0.02)' }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${act.color}15` }}
                  >
                    <i className={`${act.icon} text-sm`} style={{ color: act.color }} />
                  </div>
                  <span className="text-base shrink-0">{act.flag}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{act.guestName}</p>
                    <p className="text-gray-500 text-xs">
                      {isAr ? activityTypeLabels[act.type].ar : activityTypeLabels[act.type].en}
                      {' · '}{isAr ? 'غرفة' : 'Room'} {act.room}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-gray-400 font-mono text-xs">{act.time}</p>
                    <div className="flex items-center justify-end gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      <span className="text-gray-600 text-xs">{isAr ? 'تمت المزامنة' : 'Synced'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'sync' && (
            <div className="space-y-2">
              {syncLogs.map(log => {
                const sc = syncStatusConfig[log.status];
                return (
                  <div
                    key={log.id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                    style={{ background: 'rgba(181,142,60,0.02)', border: '1px solid rgba(181,142,60,0.06)' }}
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: sc.bg }}
                    >
                      <i className={`${sc.icon} text-sm`} style={{ color: sc.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium">{log.guestName}</p>
                      <p className="text-gray-500 text-xs">{log.eventType}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-gray-400 font-mono text-xs">{log.timestamp}</p>
                      {log.ameenRef && (
                        <p className="text-gold-500/60 font-mono text-xs mt-0.5">{log.ameenRef}</p>
                      )}
                    </div>
                    <span
                      className="px-2 py-0.5 rounded-full text-xs whitespace-nowrap"
                      style={{ background: sc.bg, color: sc.color }}
                    >
                      {isAr ? sc.labelAr : sc.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
