import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HospitalitySidebar from './components/HospitalitySidebar';
import HospitalityDashboard from './components/HospitalityDashboard';
import CheckInForm from './components/CheckInForm';
import CheckOutForm from './components/CheckOutForm';
import BookingForm from './components/BookingForm';
import ChangeRoomForm from './components/ChangeRoomForm';
import HospitalityCalendar from './components/HospitalityCalendar';
import BatchUpload from './components/BatchUpload';
import { hotelProfile, bookings, rooms, syncLogs } from '@/mocks/hospitalityData';

type ActiveView =
  | 'dashboard' | 'rooms' | 'calendar' | 'upload' | 'eventlist' | 'sync'
  | 'users' | 'help'
  | 'checkin' | 'checkout' | 'new-booking' | 'changeroom';

const BRANCHES = ['Main Branch — Muscat', 'Salalah Branch', 'Sohar Branch'];

const statusConfig = {
  confirmed:   { color: '#22D3EE', bg: 'rgba(34,211,238,0.1)',  label: 'Confirmed',   labelAr: 'مؤكد' },
  checked_in:  { color: '#4ADE80', bg: 'rgba(74,222,128,0.1)',  label: 'Checked In',  labelAr: 'مسجل دخول' },
  checked_out: { color: '#9CA3AF', bg: 'rgba(156,163,175,0.1)', label: 'Checked Out', labelAr: 'مسجل خروج' },
  cancelled:   { color: '#F87171', bg: 'rgba(248,113,113,0.1)', label: 'Cancelled',   labelAr: 'ملغي' },
  no_show:     { color: '#FB923C', bg: 'rgba(251,146,60,0.1)',  label: 'No Show',     labelAr: 'لم يحضر' },
};

const syncStatusConfig = {
  success: { color: '#4ADE80', bg: 'rgba(74,222,128,0.1)',  icon: 'ri-cloud-fill',     label: 'Synced',  labelAr: 'تمت المزامنة' },
  pending: { color: '#FACC15', bg: 'rgba(250,204,21,0.1)',  icon: 'ri-cloud-line',     label: 'Pending', labelAr: 'معلق' },
  failed:  { color: '#F87171', bg: 'rgba(248,113,113,0.1)', icon: 'ri-cloud-off-line', label: 'Failed',  labelAr: 'فشل' },
};

const roomStatusConfig = {
  available:   { color: '#4ADE80', bg: 'rgba(74,222,128,0.12)',  label: 'Available',   labelAr: 'متاحة' },
  occupied:    { color: '#22D3EE', bg: 'rgba(34,211,238,0.12)',  label: 'Occupied',    labelAr: 'مشغولة' },
  reserved:    { color: '#FACC15', bg: 'rgba(250,204,21,0.12)',  label: 'Reserved',    labelAr: 'محجوزة' },
  maintenance: { color: '#F87171', bg: 'rgba(248,113,113,0.12)', label: 'Maintenance', labelAr: 'صيانة' },
};

export default function HospitalityAppPage() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [collapsed, setCollapsed] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [pendingSync] = useState(3);
  const [branch, setBranch] = useState(BRANCHES[0]);
  const [branchOpen, setBranchOpen] = useState(false);
  const [eventFilter, setEventFilter] = useState('All');
  const isAr = lang === 'ar';

  const user = (() => {
    try { return JSON.parse(sessionStorage.getItem('hosp_user') || '{}'); } catch { return {}; }
  })();

  useEffect(() => {
    const handler = () => setIsOffline(!navigator.onLine);
    window.addEventListener('online', handler);
    window.addEventListener('offline', handler);
    return () => { window.removeEventListener('online', handler); window.removeEventListener('offline', handler); };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('hosp_user');
    navigate('/hospitality/login');
  };

  const handleNav = (key: string) => setActiveView(key as ActiveView);

  const viewTitles: Record<string, { en: string; ar: string }> = {
    dashboard:    { en: 'Home',               ar: 'الرئيسية' },
    rooms:        { en: 'Room Status',         ar: 'حالة الغرف' },
    calendar:     { en: 'Calendar',            ar: 'التقويم' },
    upload:       { en: 'Upload Events File',  ar: 'رفع ملف الأحداث' },
    eventlist:    { en: 'Event List',          ar: 'قائمة الأحداث' },
    sync:         { en: 'AMEEN Sync Log',      ar: 'سجل مزامنة أمين' },
    users:        { en: 'Manage Users',        ar: 'إدارة المستخدمين' },
    help:         { en: 'Help',                ar: 'المساعدة' },
    checkin:      { en: 'New Check-In',        ar: 'تسجيل وصول جديد' },
    checkout:     { en: 'Check-Out',           ar: 'تسجيل مغادرة' },
    'new-booking':{ en: 'New Booking',         ar: 'حجز جديد' },
    changeroom:   { en: 'Change Room',         ar: 'تغيير الغرفة' },
  };

  const filteredBookings = eventFilter === 'All'
    ? bookings
    : bookings.filter(b => {
        if (eventFilter === 'Check-In')   return b.status === 'checked_in';
        if (eventFilter === 'Check-Out')  return b.status === 'checked_out';
        if (eventFilter === 'Booking')    return b.status === 'confirmed';
        return true;
      });

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ background: '#060D1A', fontFamily: "'Inter', sans-serif" }}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Grid texture */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(34,211,238,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.022) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Offline banner */}
      {isOffline && (
        <div
          className="relative z-30 flex items-center justify-center gap-3 px-4 py-2 text-xs font-semibold"
          style={{ background: 'rgba(250,204,21,0.12)', borderBottom: '1px solid rgba(250,204,21,0.25)', color: '#FACC15' }}
        >
          <i className="ri-wifi-off-line text-sm" />
          {isAr
            ? `وضع عدم الاتصال — ${pendingSync} أحداث في انتظار المزامنة. ستتم المزامنة تلقائياً عند استعادة الاتصال.`
            : `Working Offline — ${pendingSync} events pending sync. Will auto-sync on reconnect.`}
          <button
            onClick={() => setIsOffline(false)}
            className="ml-4 px-2 py-0.5 rounded border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 cursor-pointer transition-colors whitespace-nowrap"
          >
            {isAr ? 'محاكاة الاتصال' : 'Simulate Online'}
          </button>
        </div>
      )}

      {/* Title bar */}
      <div
        className="relative z-20 flex items-center justify-between px-4 py-0 border-b border-cyan-500/15 shrink-0"
        style={{ background: 'rgba(6,13,26,0.99)', minHeight: 46 }}
      >
        <div className="flex items-center gap-3 h-full">
          {/* Window controls */}
          <div className="flex gap-1.5 items-center">
            <button
              onClick={handleLogout}
              className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 cursor-pointer transition-colors"
              title="Quit"
            />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <div className="w-px h-5 bg-gray-800" />

          {/* Hamburger */}
          <button
            onClick={() => setCollapsed(c => !c)}
            className="text-gray-500 hover:text-gray-300 cursor-pointer transition-colors"
          >
            <i className="ri-menu-line text-sm" />
          </button>
          <div className="w-px h-5 bg-gray-800" />

          {/* Shield + title */}
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: 'rgba(34,211,238,0.1)' }}
            >
              <i className="ri-shield-star-fill text-cyan-400" style={{ fontSize: 12 }} />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-white font-bold text-sm">Al-Ameen Hospitality</span>
              <span className="text-gray-700 text-sm">|</span>
              <span className="text-cyan-400/60 text-xs" style={{ fontFamily: 'serif' }}>الأمين للضيافة</span>
            </div>
          </div>

          <div className="w-px h-5 bg-gray-800 hidden lg:block" />

          {/* Hotel name */}
          <div className="hidden lg:flex items-center gap-1.5">
            <i className="ri-hotel-line text-gray-600" style={{ fontSize: 12 }} />
            <span className="text-gray-400 text-xs">{isAr ? hotelProfile.nameAr : hotelProfile.nameEn}</span>
            <span
              className="px-1.5 py-0.5 rounded text-xs font-mono"
              style={{ background: 'rgba(250,204,21,0.1)', color: '#FACC15', fontSize: 9 }}
            >
              {'★'.repeat(hotelProfile.starRating)}
            </span>
          </div>

          {/* Branch dropdown */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setBranchOpen(o => !o)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-cyan-500/15 text-gray-400 text-xs hover:border-cyan-500/30 cursor-pointer transition-colors whitespace-nowrap"
              style={{ background: 'rgba(10,22,40,0.8)' }}
            >
              <i className="ri-map-pin-line text-cyan-400" style={{ fontSize: 10 }} />
              {branch.split(' — ')[0]}
              <i className="ri-arrow-down-s-line text-gray-600" style={{ fontSize: 12 }} />
            </button>
            {branchOpen && (
              <div
                className="absolute top-full mt-1 left-0 rounded-xl border border-cyan-500/20 py-1 z-50 min-w-52"
                style={{ background: 'rgba(10,22,40,0.98)', backdropFilter: 'blur(12px)' }}
              >
                {BRANCHES.map(b => (
                  <button
                    key={b}
                    onClick={() => { setBranch(b); setBranchOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-cyan-500/8 cursor-pointer transition-colors whitespace-nowrap flex items-center gap-2"
                    style={{ color: b === branch ? '#22D3EE' : '#9CA3AF' }}
                  >
                    {b === branch && <i className="ri-check-line text-cyan-400" style={{ fontSize: 11 }} />}
                    {b !== branch && <span className="w-3" />}
                    {b}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Breadcrumb */}
          <span className="text-gray-600 text-xs hidden md:block">
            {isAr ? viewTitles[activeView]?.ar : viewTitles[activeView]?.en}
          </span>

          {/* AMEEN sync indicator */}
          <div
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs"
            style={{
              borderColor: 'rgba(34,211,238,0.2)',
              background: 'rgba(34,211,238,0.05)',
              color: '#22D3EE',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            {isAr ? 'أمين: نشط' : 'AMEEN: Active'}
          </div>

          {/* Offline toggle */}
          <button
            onClick={() => setIsOffline(o => !o)}
            className="flex items-center gap-1.5 px-2 py-1 rounded border text-xs cursor-pointer transition-all whitespace-nowrap"
            style={{
              borderColor: isOffline ? 'rgba(248,113,113,0.35)' : 'rgba(74,222,128,0.25)',
              color: isOffline ? '#F87171' : '#4ADE80',
              background: isOffline ? 'rgba(248,113,113,0.07)' : 'rgba(74,222,128,0.05)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: isOffline ? '#F87171' : '#4ADE80' }} />
            {isOffline ? (isAr ? 'غير متصل' : 'Offline') : (isAr ? 'متصل' : 'Online')}
          </button>

          {/* Lang toggle */}
          <button
            onClick={() => setLang(l => l === 'en' ? 'ar' : 'en')}
            className="px-2 py-1 rounded border border-cyan-500/20 text-cyan-400 text-xs cursor-pointer hover:bg-cyan-500/8 transition-colors whitespace-nowrap"
          >
            {isAr ? 'EN' : 'عربي'}
          </button>

          {/* User avatar */}
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: 'rgba(34,211,238,0.12)', color: '#22D3EE', border: '1px solid rgba(34,211,238,0.25)' }}
            >
              {user.initials || 'U'}
            </div>
            <span className="text-gray-500 text-xs hidden lg:block">{user.role || 'User'}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="relative z-10 flex flex-1 overflow-hidden">
        <HospitalitySidebar
          activeKey={activeView}
          onNav={handleNav}
          lang={lang}
          collapsed={collapsed}
          isOffline={isOffline}
          pendingSync={pendingSync}
        />

        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          {activeView === 'dashboard' && <HospitalityDashboard lang={lang} onNav={handleNav} />}
          {activeView === 'checkin' && <CheckInForm lang={lang} onCancel={() => setActiveView('dashboard')} />}
          {activeView === 'checkout' && <CheckOutForm lang={lang} onCancel={() => setActiveView('dashboard')} />}
          {activeView === 'new-booking' && <BookingForm lang={lang} onCancel={() => setActiveView('dashboard')} />}
          {activeView === 'changeroom' && <ChangeRoomForm lang={lang} onCancel={() => setActiveView('dashboard')} />}
          {activeView === 'calendar' && <HospitalityCalendar lang={lang} onNav={handleNav} />}
          {activeView === 'upload' && <BatchUpload lang={lang} />}

          {/* ROOM STATUS VIEW */}
          {activeView === 'rooms' && (
            <div className="p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-white font-bold text-lg">{isAr ? 'حالة الغرف' : 'Room Status'}</h2>
                <div className="flex items-center gap-2">
                  {Object.entries(roomStatusConfig).map(([k, v]) => (
                    <div key={k} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border" style={{ borderColor: `${v.color}25`, background: v.bg }}>
                      <div className="w-2 h-2 rounded-sm" style={{ background: v.color }} />
                      <span className="text-xs" style={{ color: v.color }}>{isAr ? v.labelAr : v.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {[1, 2, 3].map(floor => {
                const floorRooms = rooms.filter(r => r.floor === floor);
                return (
                  <div key={floor} className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-gray-400 text-sm font-semibold">{isAr ? `الطابق ${floor}` : `Floor ${floor}`}</span>
                      <div className="flex-1 h-px bg-cyan-500/10" />
                      <span className="text-gray-600 text-xs">{floorRooms.length} {isAr ? 'غرفة' : 'rooms'}</span>
                    </div>
                    <div className="grid grid-cols-6 gap-3">
                      {floorRooms.map(room => {
                        const sc = roomStatusConfig[room.status];
                        const booking = bookings.find(b => b.roomId === room.id && (b.status === 'checked_in' || b.status === 'reserved' || b.status === 'confirmed'));
                        return (
                          <div
                            key={room.id}
                            className="rounded-xl border p-3 cursor-pointer transition-all hover:scale-105"
                            style={{ background: sc.bg, borderColor: `${sc.color}30` }}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white font-mono font-bold text-base">{room.number}</span>
                              <div className="w-2 h-2 rounded-full" style={{ background: sc.color }} />
                            </div>
                            <p className="text-xs capitalize mb-1" style={{ color: sc.color }}>{isAr ? sc.labelAr : sc.label}</p>
                            <p className="text-gray-500 text-xs capitalize">{room.type}</p>
                            {booking && (
                              <p className="text-gray-400 text-xs mt-1 truncate">{booking.guestName.split(' ')[0]}</p>
                            )}
                            <p className="text-gray-600 font-mono text-xs mt-1">{room.rateOMR.toFixed(3)} OMR</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* EVENT LIST VIEW */}
          {activeView === 'eventlist' && (
            <div className="p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-white font-bold text-lg">{isAr ? 'قائمة الأحداث' : 'Event List'}</h2>
                <div className="flex items-center gap-2">
                  {['All', 'Check-In', 'Check-Out', 'Booking'].map(f => (
                    <button
                      key={f}
                      onClick={() => setEventFilter(f)}
                      className="px-3 py-1.5 rounded-lg text-xs border cursor-pointer transition-all whitespace-nowrap"
                      style={{
                        borderColor: eventFilter === f ? 'rgba(34,211,238,0.5)' : 'rgba(34,211,238,0.15)',
                        color: eventFilter === f ? '#22D3EE' : '#6B7280',
                        background: eventFilter === f ? 'rgba(34,211,238,0.08)' : 'transparent',
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-cyan-500/15 overflow-hidden" style={{ background: 'rgba(10,22,40,0.8)' }}>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-cyan-500/10">
                      {[isAr ? 'رقم الحجز' : 'Booking ID', isAr ? 'النزيل' : 'Guest', isAr ? 'الغرفة' : 'Room', isAr ? 'الدخول' : 'Check-In', isAr ? 'الخروج' : 'Check-Out', isAr ? 'الإجمالي' : 'Total', isAr ? 'الحالة' : 'Status', isAr ? 'أمين' : 'AMEEN'].map(h => (
                        <th key={h} className="text-left text-gray-600 font-medium py-3 px-4 uppercase tracking-wider" style={{ fontSize: 10 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map(b => {
                      const sc = statusConfig[b.status];
                      return (
                        <tr key={b.id} className="border-b border-cyan-500/5 hover:bg-cyan-500/4 cursor-pointer transition-colors">
                          <td className="py-3 px-4 font-mono text-cyan-400/70">{b.id}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span>{b.nationalityFlag}</span>
                              <div>
                                <p className="text-white font-medium">{b.guestName}</p>
                                <p className="text-gray-600 font-mono">{b.guestDoc}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-300">{b.roomNumber} — {b.roomType}</td>
                          <td className="py-3 px-4 font-mono text-gray-400">{b.checkIn}</td>
                          <td className="py-3 px-4 font-mono text-gray-400">{b.checkOut}</td>
                          <td className="py-3 px-4 font-mono text-white">{b.totalOMR.toFixed(3)}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: sc.bg, color: sc.color }}>
                              {isAr ? sc.labelAr : sc.label}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {b.ameenSynced
                              ? <span className="flex items-center gap-1 text-green-400 text-xs"><i className="ri-cloud-fill" />{isAr ? 'تمت' : 'Synced'}</span>
                              : <span className="flex items-center gap-1 text-yellow-400 text-xs"><i className="ri-cloud-line" />{isAr ? 'معلق' : 'Pending'}</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SYNC LOG VIEW */}
          {activeView === 'sync' && (
            <div className="p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-white font-bold text-lg">{isAr ? 'سجل مزامنة أمين' : 'AMEEN Sync Log'}</h2>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {isAr ? 'جميع الأحداث المرسلة إلى منصة أمين' : 'All events transmitted to AMEEN Platform'}
                  </p>
                </div>
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-cyan-500/20"
                  style={{ background: 'rgba(34,211,238,0.05)' }}
                >
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-cyan-400 text-xs">{isAr ? 'الخادم: api.ameen.ameen.gov' : 'Server: api.ameen.ameen.gov'}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: isAr ? 'تمت المزامنة' : 'Synced',  value: syncLogs.filter(l => l.status === 'success').length, color: '#4ADE80' },
                  { label: isAr ? 'معلق' : 'Pending',          value: syncLogs.filter(l => l.status === 'pending').length, color: '#FACC15' },
                  { label: isAr ? 'فشل' : 'Failed',            value: syncLogs.filter(l => l.status === 'failed').length,  color: '#F87171' },
                ].map(s => (
                  <div key={s.label} className="rounded-xl border border-cyan-500/10 px-4 py-3 text-center" style={{ background: 'rgba(10,22,40,0.8)' }}>
                    <p className="font-mono font-bold text-2xl" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-cyan-500/15 overflow-hidden" style={{ background: 'rgba(10,22,40,0.8)' }}>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-cyan-500/10">
                      {[isAr ? 'الوقت' : 'Time', isAr ? 'النزيل' : 'Guest', isAr ? 'نوع الحدث' : 'Event Type', isAr ? 'مرجع أمين' : 'AMEEN Ref', isAr ? 'الحالة' : 'Status'].map(h => (
                        <th key={h} className="text-left text-gray-600 font-medium py-3 px-4 uppercase tracking-wider" style={{ fontSize: 10 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {syncLogs.map(log => {
                      const sc = syncStatusConfig[log.status];
                      return (
                        <tr key={log.id} className="border-b border-cyan-500/5 hover:bg-cyan-500/4 transition-colors">
                          <td className="py-3 px-4 font-mono text-gray-400">{log.timestamp}</td>
                          <td className="py-3 px-4 text-white font-medium">{log.guestName}</td>
                          <td className="py-3 px-4 text-gray-300">{log.eventType}</td>
                          <td className="py-3 px-4 font-mono text-cyan-500/60">{log.ameenRef || '—'}</td>
                          <td className="py-3 px-4">
                            <span className="flex items-center gap-1.5 w-fit px-2 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.color }}>
                              <i className={`${sc.icon} text-xs`} />
                              {isAr ? sc.labelAr : sc.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* USERS VIEW */}
          {activeView === 'users' && (
            <div className="p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-white font-bold text-lg">{isAr ? 'إدارة المستخدمين' : 'Manage Users'}</h2>
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer whitespace-nowrap"
                  style={{ background: '#22D3EE', color: '#060D1A' }}
                >
                  <i className="ri-user-add-line" />
                  {isAr ? 'إضافة مستخدم' : 'Add User'}
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { name: 'Salim Al-Rashidi',  nameAr: 'سالم الراشدي',  role: 'Admin',     initials: 'SR', color: '#22D3EE', lastLogin: '14:32 Today',  status: 'active' },
                  { name: 'Maryam Al-Balushi', nameAr: 'مريم البلوشي',  role: 'Reception', initials: 'MB', color: '#4ADE80', lastLogin: '13:15 Today',  status: 'active' },
                  { name: 'Tariq Al-Amri',     nameAr: 'طارق العامري',  role: 'Viewer',    initials: 'TA', color: '#9CA3AF', lastLogin: '09:00 Today',  status: 'active' },
                  { name: 'Huda Al-Farsi',     nameAr: 'هدى الفارسية',  role: 'Reception', initials: 'HF', color: '#4ADE80', lastLogin: '2 days ago',   status: 'inactive' },
                ].map(u => (
                  <div key={u.initials} className="rounded-xl border border-cyan-500/15 p-4" style={{ background: 'rgba(10,22,40,0.8)' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm border-2"
                        style={{ background: `${u.color}15`, color: u.color, borderColor: `${u.color}35` }}
                      >
                        {u.initials}
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{isAr ? u.nameAr : u.name}</p>
                        <span
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{ background: `${u.color}15`, color: u.color }}
                        >
                          {u.role}
                        </span>
                      </div>
                      <div className="ml-auto">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ background: u.status === 'active' ? '#4ADE80' : '#6B7280' }}
                        />
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs">{isAr ? 'آخر دخول:' : 'Last login:'} {u.lastLogin}</p>
                    <div className="flex gap-2 mt-3">
                      <button className="flex-1 py-1.5 rounded-lg text-xs border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/8 cursor-pointer transition-colors whitespace-nowrap">
                        {isAr ? 'تعديل' : 'Edit'}
                      </button>
                      <button className="flex-1 py-1.5 rounded-lg text-xs border border-red-500/20 text-red-400 hover:bg-red-500/8 cursor-pointer transition-colors whitespace-nowrap">
                        {isAr ? 'تعطيل' : 'Disable'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HELP VIEW */}
          {activeView === 'help' && (
            <div className="p-5 max-w-2xl">
              <h2 className="text-white font-bold text-lg mb-5">{isAr ? 'المساعدة والدعم' : 'Help & Support'}</h2>
              <div className="space-y-3">
                {[
                  { q: isAr ? 'كيف أسجل وصول نزيل؟' : 'How do I check in a guest?', a: isAr ? 'انقر على "تسجيل دخول" من القائمة الجانبية أو الإجراءات السريعة.' : 'Click "Check-In" from the sidebar quick actions or main menu.' },
                  { q: isAr ? 'ماذا يحدث عند انقطاع الإنترنت؟' : 'What happens when internet is lost?', a: isAr ? 'يعمل النظام بشكل كامل دون اتصال. تُحفظ الأحداث محلياً وتُزامن تلقائياً عند استعادة الاتصال.' : 'The system works fully offline. Events are saved locally and auto-synced when connection is restored.' },
                  { q: isAr ? 'كيف تعمل مزامنة أمين؟' : 'How does AMEEN sync work?', a: isAr ? 'تتم المزامنة تلقائياً في الخلفية. لا يحتاج الموظف للتفاعل مع أمين مباشرة.' : 'Sync happens automatically in the background. Staff never interact with AMEEN directly.' },
                  { q: isAr ? 'كيف أوصل الماسح الضوئي؟' : 'How do I connect the scanner?', a: isAr ? 'وصّل ماسح Regula عبر USB. سيتم الكشف عنه تلقائياً. يمكن إعادة الإعداد من إعدادات النظام.' : 'Connect the Regula scanner via USB. It will be auto-detected. Re-setup is available in system settings.' },
                  { q: isAr ? 'كيف أرفع ملف أحداث؟' : 'How do I upload a batch file?', a: isAr ? 'انتقل إلى "رفع ملف الأحداث"، حمّل القالب، ثم ارفع ملف CSV أو Excel.' : 'Go to "Upload Events File", download the template, then upload your CSV or Excel file.' },
                ].map((item, i) => (
                  <div key={i} className="rounded-xl border border-cyan-500/15 p-4" style={{ background: 'rgba(10,22,40,0.8)' }}>
                    <p className="text-white font-semibold text-sm mb-1.5">{item.q}</p>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-xl border border-cyan-500/20 p-4" style={{ background: 'rgba(34,211,238,0.04)' }}>
                <p className="text-cyan-400 font-semibold text-sm mb-2">{isAr ? 'الدعم الفني' : 'Technical Support'}</p>
                <div className="space-y-1">
                  <p className="text-gray-400 text-xs"><i className="ri-mail-line mr-2 text-cyan-500/60" />support@ameen.ameen.gov</p>
                  <p className="text-gray-400 text-xs"><i className="ri-phone-line mr-2 text-cyan-500/60" />+968 2400 0000</p>
                  <p className="text-gray-500 text-xs mt-1">{isAr ? 'متاح 24/7 لجميع الفنادق المسجلة' : 'Available 24/7 for all registered hotels'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside branch dropdown */}
      {branchOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setBranchOpen(false)} />
      )}
    </div>
  );
}
