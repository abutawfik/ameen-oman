import { useState } from 'react';
import { bookings } from '@/mocks/hospitalityData';

interface Props { lang: 'en' | 'ar'; onCancel: () => void; }

export default function CheckOutForm({ lang, onCancel }: Props) {
  const isAr = lang === 'ar';
  const [bookingRef, setBookingRef] = useState('');
  const [found, setFound] = useState<typeof bookings[0] | null>(null);
  const [departureDate, setDepartureDate] = useState('2025-04-05');
  const [departureTime, setDepartureTime] = useState('12:00');
  const [balance, setBalance] = useState('0.000');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [saved, setSaved] = useState(false);

  const lookup = () => {
    const b = bookings.find(b => b.id === bookingRef || b.guestDoc === bookingRef || b.roomNumber === bookingRef);
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
        <h2 className="text-white font-bold text-lg">{isAr ? 'تسجيل مغادرة' : 'Check-Out'}</h2>
        <p className="text-gray-400 text-xs mt-0.5">{isAr ? 'ابحث عن الحجز لإتمام تسجيل المغادرة' : 'Look up booking to complete check-out'}</p>
      </div>

      {/* Amber tip */}
      <div className="flex items-start gap-2 px-4 py-2.5 rounded-lg mb-5 text-xs" style={{ background: 'rgba(250,204,21,0.08)', border: '1px solid rgba(250,204,21,0.2)', color: '#FACC15' }}>
        <i className="ri-information-line text-sm shrink-0 mt-0.5" />
        <span>{isAr ? 'بيانات المغادرة تُرسل تلقائياً إلى منصة أمين في الخلفية.' : 'Departure data is automatically sent to Al-Ameen Platform in the background.'}</span>
      </div>

      {/* Lookup */}
      <div className="rounded-xl border border-gold-500/20 p-5 mb-5" style={{ background: 'rgba(20,29,46,0.8)' }}>
        <h3 className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-4">{isAr ? 'بحث عن الحجز' : 'Booking Lookup'}</h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={bookingRef}
            onChange={e => setBookingRef(e.target.value)}
            placeholder="BK-2025-001 / Room No. / Doc No."
            className={`${inputCls} flex-1`}
          />
          <button onClick={lookup} className="px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap" style={{ background: '#D4A84B', color: '#0B1220' }}>
            {isAr ? 'بحث' : 'Lookup'}
          </button>
        </div>

        {found && (
          <div className="mt-4 rounded-lg border border-green-500/25 p-4" style={{ background: 'rgba(74,222,128,0.06)' }}>
            <div className="flex items-center gap-2 mb-3">
              <i className="ri-checkbox-circle-line text-green-400" />
              <span className="text-green-400 text-sm font-semibold">{isAr ? 'تم العثور على الحجز' : 'Booking found'}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {[
                [isAr ? 'النزيل' : 'Guest', found.guestName],
                [isAr ? 'الوثيقة' : 'Document', found.guestDoc],
                [isAr ? 'الغرفة' : 'Room', `${found.roomNumber} — ${found.roomType}`],
                [isAr ? 'تاريخ الدخول' : 'Check-In', found.checkIn],
                [isAr ? 'الليالي' : 'Nights', String(found.nights)],
                [isAr ? 'السعر/ليلة' : 'Rate/Night', `${found.rateOMR} OMR`],
                [isAr ? 'الإجمالي' : 'Total', `${found.totalOMR.toFixed(3)} OMR`],
                [isAr ? 'الدفع' : 'Payment', found.paymentStatus],
              ].map(([k, v]) => (
                <div key={k}>
                  <span className="text-gray-500">{k}: </span>
                  <span className="text-white font-medium">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Departure details */}
      <div className="rounded-xl border border-gold-500/20 p-5 mb-5 space-y-4" style={{ background: 'rgba(20,29,46,0.8)' }}>
        <h3 className="text-gold-400 font-semibold text-sm uppercase tracking-wider">{isAr ? 'تفاصيل المغادرة' : 'Departure Details'}</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>{isAr ? 'تاريخ المغادرة' : 'Departure Date'}</label>
            <input type="date" value={departureDate} onChange={e => setDepartureDate(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>{isAr ? 'وقت المغادرة' : 'Departure Time'}</label>
            <input type="time" value={departureTime} onChange={e => setDepartureTime(e.target.value)} className={inputCls} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>{isAr ? 'رصيد النزيل (OMR)' : 'Guest Balance (OMR)'}</label>
            <input type="text" value={balance} onChange={e => setBalance(e.target.value)} placeholder="0.000" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>{isAr ? 'طريقة الدفع' : 'Payment Method'}</label>
            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className={inputCls} style={{ background: 'rgba(20,29,46,0.9)' }}>
              {['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer'].map(p => <option key={p} value={p} style={{ background: '#141D2E' }}>{p}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gold-500/10">
        <div className="flex items-center gap-2 text-xs" style={{ color: '#4ADE80' }}>
          <i className="ri-cloud-line" />
          {isAr ? 'سيتم إرسال بيانات المغادرة إلى أمين تلقائياً' : 'Departure data will auto-sync to Al-Ameen'}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onCancel} className="px-5 py-2.5 rounded-lg text-sm border border-gray-600 text-gray-300 hover:border-gray-400 cursor-pointer transition-all whitespace-nowrap">
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>
          <button onClick={handleSave} className="px-6 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all whitespace-nowrap" style={{ background: saved ? '#4ADE80' : '#D4A84B', color: '#0B1220' }}>
            {saved ? <span className="flex items-center gap-2"><i className="ri-checkbox-circle-line" />{isAr ? 'تم!' : 'Done!'}</span> : <span><i className="ri-save-line mr-1" />{isAr ? 'حفظ + مزامنة أمين' : 'Save + Sync to Al-Ameen'}</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
