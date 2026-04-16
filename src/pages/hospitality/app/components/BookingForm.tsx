import { useState } from 'react';
import { rooms } from '@/mocks/hospitalityData';

interface Props { lang: 'en' | 'ar'; onCancel: () => void; }

const COUNTRIES = ['Oman', 'Saudi Arabia', 'UAE', 'India', 'Pakistan', 'UK', 'USA', 'Germany', 'France', 'China', 'Egypt', 'Jordan'];
const DOC_TYPES = ['Passport', 'National ID', 'Residence Card'];
const PAYMENT_METHODS = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Corporate Account'];

export default function BookingForm({ lang, onCancel }: Props) {
  const isAr = lang === 'ar';
  const [isCorporate, setIsCorporate] = useState(false);
  const [saved, setSaved] = useState(false);

  // Part 1 — Personal
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('Male');
  const [dob, setDob] = useState('');
  const [nationality, setNationality] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Corporate
  const [orgMocNo, setOrgMocNo] = useState('');
  const [orgName, setOrgName] = useState('');
  const [jobTitle, setJobTitle] = useState('');

  // Part 2 — Event
  const [room, setRoom] = useState('');
  const [checkIn, setCheckIn] = useState('2025-04-06');
  const [checkOut, setCheckOut] = useState('2025-04-09');
  const [adults, setAdults] = useState('1');
  const [children, setChildren] = useState('0');
  const [payment, setPayment] = useState('Cash');

  // Travel Doc
  const [docType, setDocType] = useState('Passport');
  const [docNumber, setDocNumber] = useState('');
  const [issuingCountry, setIssuingCountry] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const inputCls = 'w-full rounded-lg border border-cyan-500/20 bg-transparent text-white text-sm px-3 py-2.5 focus:outline-none focus:border-cyan-500/50 placeholder-gray-600 transition-colors';
  const labelCls = 'block text-gray-400 text-xs mb-1.5 uppercase tracking-wider';

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); onCancel(); }, 1500);
  };

  return (
    <div className="p-5 max-w-5xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-white font-bold text-lg">{isAr ? 'حجز جديد' : 'New Booking'}</h2>
          <p className="text-gray-400 text-xs mt-0.5">{isAr ? 'أدخل بيانات الحجز والنزيل' : 'Enter booking and guest details'}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-xs">{isAr ? 'حجز مؤسسي' : 'Corporate'}</span>
          <button
            onClick={() => setIsCorporate(c => !c)}
            className="relative w-10 h-5 rounded-full transition-colors cursor-pointer"
            style={{ background: isCorporate ? '#22D3EE' : '#374151' }}
          >
            <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all" style={{ left: isCorporate ? '22px' : '2px' }} />
          </button>
        </div>
      </div>

      <div className="flex items-start gap-2 px-4 py-2.5 rounded-lg mb-5 text-xs" style={{ background: 'rgba(250,204,21,0.08)', border: '1px solid rgba(250,204,21,0.2)', color: '#FACC15' }}>
        <i className="ri-information-line text-sm shrink-0 mt-0.5" />
        <span>{isAr ? 'بيانات الحجز تُرسل تلقائياً إلى منصة أمين في الخلفية.' : 'Booking data is automatically queued and sent to AMEEN Platform in the background.'}</span>
      </div>

      {/* Part 1 — Personal + Corporate */}
      <div className="rounded-xl border border-cyan-500/20 p-5 mb-5 space-y-4" style={{ background: 'rgba(10,22,40,0.8)' }}>
        <h3 className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">{isAr ? 'الجزء الأول — البيانات الشخصية' : 'Part 1 — Personal Details'}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className={labelCls}>{isAr ? 'الاسم الأول' : 'First Name'}</label>
            <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Ahmed" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>{isAr ? 'اسم العائلة' : 'Last Name'}</label>
            <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Al-Rashidi" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>{isAr ? 'الجنس' : 'Gender'}</label>
            <select value={gender} onChange={e => setGender(e.target.value)} className={inputCls} style={{ background: 'rgba(10,22,40,0.9)' }}>
              {['Male', 'Female'].map(g => <option key={g} value={g} style={{ background: '#0A1628' }}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>{isAr ? 'تاريخ الميلاد' : 'Date of Birth'}</label>
            <input type="date" value={dob} onChange={e => setDob(e.target.value)} className={inputCls} />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div>
            <label className={labelCls}>{isAr ? 'الجنسية' : 'Nationality'}</label>
            <select value={nationality} onChange={e => setNationality(e.target.value)} className={inputCls} style={{ background: 'rgba(10,22,40,0.9)' }}>
              <option value="" style={{ background: '#0A1628' }}>—</option>
              {COUNTRIES.map(c => <option key={c} value={c} style={{ background: '#0A1628' }}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>{isAr ? 'البريد الإلكتروني' : 'Email'}</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="guest@email.com" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>{isAr ? 'الهاتف' : 'Phone'}</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+968 9234 5678" className={inputCls} />
          </div>
        </div>

        {isCorporate && (
          <div className="pt-3 border-t border-cyan-500/10">
            <p className="text-cyan-400/70 text-xs uppercase tracking-wider mb-3">{isAr ? 'بيانات المؤسسة' : 'Corporate Details'}</p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelCls}>{isAr ? 'رقم MOC' : 'Org MOC No.'}</label>
                <input type="text" value={orgMocNo} onChange={e => setOrgMocNo(e.target.value)} placeholder="MOC-2024-00123" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>{isAr ? 'اسم المؤسسة' : 'Org Name'}</label>
                <input type="text" value={orgName} onChange={e => setOrgName(e.target.value)} placeholder="Al-Rashidi Trading LLC" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>{isAr ? 'المسمى الوظيفي' : 'Job Title'}</label>
                <input type="text" value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="General Manager" className={inputCls} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Part 2 — Event + Travel Doc */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="rounded-xl border border-cyan-500/20 p-5 space-y-4" style={{ background: 'rgba(10,22,40,0.8)' }}>
          <h3 className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">{isAr ? 'الجزء الثاني — تفاصيل الحجز' : 'Part 2 — Booking Details'}</h3>
          <div>
            <label className={labelCls}>{isAr ? 'الغرفة' : 'Room'}</label>
            <select value={room} onChange={e => setRoom(e.target.value)} className={inputCls} style={{ background: 'rgba(10,22,40,0.9)' }}>
              <option value="" style={{ background: '#0A1628' }}>{isAr ? 'اختر غرفة' : 'Select room'}</option>
              {rooms.filter(r => r.status === 'available').map(r => (
                <option key={r.id} value={r.number} style={{ background: '#0A1628' }}>{r.number} — {r.type} ({r.rateOMR} OMR/night)</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>{isAr ? 'تاريخ الدخول' : 'Check-In'}</label>
              <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{isAr ? 'تاريخ الخروج' : 'Check-Out'}</label>
              <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>{isAr ? 'بالغون' : 'Adults'}</label>
              <input type="number" min="1" value={adults} onChange={e => setAdults(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{isAr ? 'أطفال' : 'Children'}</label>
              <input type="number" min="0" value={children} onChange={e => setChildren(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{isAr ? 'الدفع' : 'Payment'}</label>
              <select value={payment} onChange={e => setPayment(e.target.value)} className={inputCls} style={{ background: 'rgba(10,22,40,0.9)' }}>
                {PAYMENT_METHODS.map(p => <option key={p} value={p} style={{ background: '#0A1628' }}>{p}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-cyan-500/20 p-5 space-y-4" style={{ background: 'rgba(10,22,40,0.8)' }}>
          <h3 className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">{isAr ? 'وثيقة السفر' : 'Travel Document'}</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>{isAr ? 'نوع الوثيقة' : 'Doc Type'}</label>
              <select value={docType} onChange={e => setDocType(e.target.value)} className={inputCls} style={{ background: 'rgba(10,22,40,0.9)' }}>
                {DOC_TYPES.map(d => <option key={d} value={d} style={{ background: '#0A1628' }}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>{isAr ? 'رقم الوثيقة' : 'Doc Number'}</label>
              <input type="text" value={docNumber} onChange={e => setDocNumber(e.target.value)} placeholder="OM-4412891" className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>{isAr ? 'دولة الإصدار' : 'Issuing Country'}</label>
            <select value={issuingCountry} onChange={e => setIssuingCountry(e.target.value)} className={inputCls} style={{ background: 'rgba(10,22,40,0.9)' }}>
              <option value="" style={{ background: '#0A1628' }}>—</option>
              {COUNTRIES.map(c => <option key={c} value={c} style={{ background: '#0A1628' }}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>{isAr ? 'تاريخ الانتهاء' : 'Expiry Date'}</label>
            <input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} className={inputCls} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-cyan-500/10">
        <div className="flex items-center gap-2 text-xs" style={{ color: '#4ADE80' }}>
          <i className="ri-cloud-line" />
          {isAr ? 'سيتم إرسال بيانات الحجز إلى أمين تلقائياً' : 'Booking data will auto-sync to AMEEN'}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onCancel} className="px-5 py-2.5 rounded-lg text-sm border border-gray-600 text-gray-300 hover:border-gray-400 cursor-pointer transition-all whitespace-nowrap">{isAr ? 'إلغاء' : 'Cancel'}</button>
          <button onClick={handleSave} className="px-6 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all whitespace-nowrap" style={{ background: saved ? '#4ADE80' : '#22D3EE', color: '#060D1A' }}>
            {saved ? <span className="flex items-center gap-2"><i className="ri-checkbox-circle-line" />{isAr ? 'تم!' : 'Saved!'}</span> : <span><i className="ri-save-line mr-1" />{isAr ? 'حفظ + مزامنة أمين' : 'Save + Sync to AMEEN'}</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
