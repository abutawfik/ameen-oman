import { useState } from 'react';
import { bookings, rooms } from '@/mocks/hospitalityData';

interface Props { lang: 'en' | 'ar'; onCancel: () => void; }

export default function ChangeRoomForm({ lang, onCancel }: Props) {
  const isAr = lang === 'ar';
  const [bookingRef, setBookingRef] = useState('');
  const [found, setFound] = useState<typeof bookings[0] | null>(null);
  const [newRoom, setNewRoom] = useState('');
  const [changeDate, setChangeDate] = useState('2025-04-05');
  const [changeTime, setChangeTime] = useState('14:00');
  const [reason, setReason] = useState('');
  const [saved, setSaved] = useState(false);

  const lookup = () => {
    const b = bookings.find(b => b.id === bookingRef || b.roomNumber === bookingRef || b.guestDoc === bookingRef);
    if (b) setFound(b);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); onCancel(); }, 1500);
  };

  const inputCls = 'w-full rounded-lg border border-gold-500/20 bg-transparent text-white text-sm px-3 py-2.5 focus:outline-none focus:border-gold-500/50 placeholder-gray-600 transition-colors';
  const labelCls = 'block text-gray-400 text-xs mb-1.5 uppercase tracking-wider';

  return (
    <div className="p-5 max-w-3xl">
      <div className="mb-4">
        <h2 className="text-white font-bold text-lg">{isAr ? 'تغيير الغرفة' : 'Change Room'}</h2>
        <p className="text-gray-400 text-xs mt-0.5">{isAr ? 'ابحث عن الحجز ثم حدد الغرفة الجديدة' : 'Look up booking then select new room'}</p>
      </div>

      <div className="flex items-start gap-2 px-4 py-2.5 rounded-lg mb-5 text-xs" style={{ background: 'rgba(250,204,21,0.08)', border: '1px solid rgba(250,204,21,0.2)', color: '#FACC15' }}>
        <i className="ri-information-line text-sm shrink-0 mt-0.5" />
        <span>{isAr ? 'بيانات تغيير الغرفة تُرسل تلقائياً إلى منصة أمين.' : 'Room change data is automatically sent to Al-Ameen Platform.'}</span>
      </div>

      {/* Lookup */}
      <div className="rounded-xl border border-gold-500/20 p-5 mb-5" style={{ background: 'rgba(20,29,46,0.8)' }}>
        <h3 className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-4">{isAr ? 'بحث عن الحجز' : 'Booking Lookup'}</h3>
        <div className="flex gap-3">
          <input type="text" value={bookingRef} onChange={e => setBookingRef(e.target.value)} placeholder="BK-2025-001 / Room No. / Doc No." className={`${inputCls} flex-1`} />
          <button onClick={lookup} className="px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap" style={{ background: '#D4A84B', color: '#0B1220' }}>
            {isAr ? 'بحث' : 'Lookup'}
          </button>
        </div>
        {found && (
          <div className="mt-4 rounded-lg border border-green-500/25 p-4" style={{ background: 'rgba(74,222,128,0.06)' }}>
            <div className="flex items-center gap-2 mb-2">
              <i className="ri-checkbox-circle-line text-green-400 text-sm" />
              <span className="text-green-400 text-sm font-semibold">{found.guestName}</span>
              <span className="text-gray-500 text-xs font-mono">{found.guestDoc}</span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-gray-400">{isAr ? 'الغرفة الحالية:' : 'Current Room:'} <span className="text-white font-mono">{found.roomNumber} — {found.roomType}</span></span>
              <span className="text-gray-400">{isAr ? 'حتى:' : 'Until:'} <span className="text-white font-mono">{found.checkOut}</span></span>
            </div>
          </div>
        )}
      </div>

      {/* New room + details */}
      <div className="rounded-xl border border-gold-500/20 p-5 mb-5 space-y-4" style={{ background: 'rgba(20,29,46,0.8)' }}>
        <h3 className="text-gold-400 font-semibold text-sm uppercase tracking-wider">{isAr ? 'تفاصيل التغيير' : 'Change Details'}</h3>
        <div>
          <label className={labelCls}>{isAr ? 'الغرفة الجديدة' : 'New Room'}</label>
          <select value={newRoom} onChange={e => setNewRoom(e.target.value)} className={inputCls} style={{ background: 'rgba(20,29,46,0.9)' }}>
            <option value="" style={{ background: '#141D2E' }}>{isAr ? 'اختر غرفة' : 'Select new room'}</option>
            {rooms.filter(r => r.status === 'available').map(r => (
              <option key={r.id} value={r.number} style={{ background: '#141D2E' }}>{r.number} — {r.type} — Floor {r.floor} ({r.rateOMR} OMR)</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>{isAr ? 'تاريخ التغيير' : 'Change Date'}</label>
            <input type="date" value={changeDate} onChange={e => setChangeDate(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>{isAr ? 'وقت التغيير' : 'Change Time'}</label>
            <input type="time" value={changeTime} onChange={e => setChangeTime(e.target.value)} className={inputCls} />
          </div>
        </div>
        <div>
          <label className={labelCls}>{isAr ? 'سبب التغيير' : 'Reason'}</label>
          <input type="text" value={reason} onChange={e => setReason(e.target.value)} placeholder={isAr ? 'مثال: طلب النزيل، صيانة...' : 'e.g. Guest request, maintenance...'} className={inputCls} />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gold-500/10">
        <div className="flex items-center gap-2 text-xs" style={{ color: '#4ADE80' }}>
          <i className="ri-cloud-line" />
          {isAr ? 'سيتم إرسال بيانات التغيير إلى أمين تلقائياً' : 'Change data will auto-sync to Al-Ameen'}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onCancel} className="px-5 py-2.5 rounded-lg text-sm border border-gray-600 text-gray-300 hover:border-gray-400 cursor-pointer transition-all whitespace-nowrap">{isAr ? 'إلغاء' : 'Cancel'}</button>
          <button onClick={handleSave} className="px-6 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all whitespace-nowrap" style={{ background: saved ? '#4ADE80' : '#D4A84B', color: '#0B1220' }}>
            {saved ? <span className="flex items-center gap-2"><i className="ri-checkbox-circle-line" />{isAr ? 'تم!' : 'Done!'}</span> : <span><i className="ri-save-line mr-1" />{isAr ? 'حفظ + مزامنة أمين' : 'Save + Sync to Al-Ameen'}</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
