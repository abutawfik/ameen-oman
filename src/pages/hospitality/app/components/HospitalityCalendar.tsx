import { useState } from 'react';
import { bookings } from '@/mocks/hospitalityData';

interface Props { lang: 'en' | 'ar'; onNav: (key: string) => void; }

const EVENT_COLORS: Record<string, string> = {
  confirmed: '#D6B47E',
  checked_in: '#4ADE80',
  checked_out: '#C98A1B',
};

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function HospitalityCalendar({ lang, onNav }: Props) {
  const isAr = lang === 'ar';
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(3); // April = 3
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [popup, setPopup] = useState(false);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return bookings.filter(b => b.checkIn === dateStr || b.checkOut === dateStr);
  };

  const selectedEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-white font-bold text-lg">{isAr ? 'التقويم' : 'Calendar'}</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            {[
              { color: '#D6B47E', label: isAr ? 'مؤكد' : 'Confirmed' },
              { color: '#4ADE80', label: isAr ? 'دخول' : 'Check-In' },
              { color: '#C98A1B', label: isAr ? 'خروج' : 'Check-Out' },
            ].map(l => (
              <span key={l.label} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                <span className="text-gray-400">{l.label}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gold-500/20 overflow-hidden" style={{ background: 'rgba(10,37,64,0.8)' }}>
        {/* Month nav */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gold-500/10">
          <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gold-500/20 text-gold-400 hover:bg-gold-500/10 cursor-pointer transition-colors">
            <i className="ri-arrow-left-s-line" />
          </button>
          <h3 className="text-white font-semibold">{MONTHS[month]} {year}</h3>
          <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gold-500/20 text-gold-400 hover:bg-gold-500/10 cursor-pointer transition-colors">
            <i className="ri-arrow-right-s-line" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-gold-500/10">
          {DAYS_SHORT.map(d => (
            <div key={d} className="text-center text-gray-500 text-xs py-2 font-medium uppercase tracking-wider">{d}</div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="h-20 border-b border-r border-gold-500/5" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const events = getEventsForDay(day);
            const isToday = day === 5 && month === 3 && year === 2025;
            const isSelected = selectedDay === day;

            return (
              <div
                key={day}
                onClick={() => { setSelectedDay(day); if (events.length > 0) setPopup(true); }}
                className="h-20 border-b border-r border-gold-500/5 p-1.5 cursor-pointer hover:bg-gold-500/5 transition-colors relative"
                style={{ background: isSelected ? 'rgba(184,138,60,0.08)' : undefined }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="text-xs font-mono font-medium w-6 h-6 flex items-center justify-center rounded-full"
                    style={{
                      background: isToday ? '#D6B47E' : 'transparent',
                      color: isToday ? '#051428' : '#9CA3AF',
                    }}
                  >
                    {day}
                  </span>
                </div>
                <div className="space-y-0.5">
                  {events.slice(0, 2).map(ev => (
                    <div
                      key={ev.id}
                      className="flex items-center gap-1 px-1 py-0.5 rounded text-xs truncate"
                      style={{ background: `${EVENT_COLORS[ev.status] || '#9CA3AF'}20`, color: EVENT_COLORS[ev.status] || '#9CA3AF' }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: EVENT_COLORS[ev.status] || '#9CA3AF' }} />
                      <span className="truncate" style={{ fontSize: 9 }}>{ev.guestName.split(' ')[0]}</span>
                    </div>
                  ))}
                  {events.length > 2 && (
                    <p className="text-gray-600 text-xs pl-1">+{events.length - 2}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Day popup */}
      {popup && selectedDay && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(5,20,40,0.85)' }}
          onClick={() => setPopup(false)}
        >
          <div
            className="rounded-2xl border border-gold-500/30 p-6 w-full max-w-md"
            style={{ background: 'rgba(10,37,64,0.98)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">
                {MONTHS[month]} {selectedDay}, {year}
              </h3>
              <button onClick={() => setPopup(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <i className="ri-close-line text-lg" />
              </button>
            </div>

            <div className="space-y-2 mb-4">
              {selectedEvents.map(ev => (
                <div key={ev.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-gold-500/10" style={{ background: 'rgba(184,138,60,0.04)' }}>
                  <span className="text-lg">{ev.nationalityFlag}</span>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{ev.guestName}</p>
                    <p className="text-gray-500 text-xs">Room {ev.roomNumber} · {ev.checkIn === `${year}-${String(month+1).padStart(2,'0')}-${String(selectedDay).padStart(2,'0')}` ? 'Check-In' : 'Check-Out'}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${EVENT_COLORS[ev.status]}20`, color: EVENT_COLORS[ev.status] }}>
                    {ev.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { label: isAr ? 'تسجيل دخول' : 'Check-In', key: 'checkin', icon: 'ri-login-box-line' },
                { label: isAr ? 'حجز جديد' : 'New Booking', key: 'new-booking', icon: 'ri-calendar-check-line' },
                { label: isAr ? 'تسجيل خروج' : 'Check-Out', key: 'checkout', icon: 'ri-logout-box-line' },
                { label: isAr ? 'تغيير غرفة' : 'Change Room', key: 'changeroom', icon: 'ri-door-line' },
              ].map(action => (
                <button
                  key={action.key}
                  onClick={() => { setPopup(false); onNav(action.key); }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm border border-gold-500/20 text-gold-400 hover:bg-gold-500/10 cursor-pointer transition-all whitespace-nowrap"
                >
                  <i className={`${action.icon} text-sm`} />
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
