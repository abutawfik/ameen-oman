import { useState } from 'react';
import { rooms } from '@/mocks/hospitalityData';

interface Props { lang: 'en' | 'ar'; onCancel: () => void; }

const COUNTRIES = ['Oman', 'Saudi Arabia', 'UAE', 'India', 'Pakistan', 'UK', 'USA', 'Germany', 'France', 'China', 'Egypt', 'Jordan'];
const DOC_TYPES = ['Passport', 'National ID', 'Residence Card', 'Diplomatic Passport'];
const HOLDER_STATUS = ['Primary Holder', 'Spouse', 'Child', 'Dependent'];
const PAYMENT_METHODS = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Corporate Account'];
const CARD_TYPES = ['Visa', 'Mastercard', 'Amex', 'Mada'];

const SCANNER_DATA = {
  holderName: 'AHMED AL-RASHIDI',
  docNumber: 'OM-4412891',
  nationality: 'Oman',
  dob: '1985-03-12',
  gender: 'Male',
  issueDate: '2020-01-15',
  expiryDate: '2030-01-14',
  issuingCountry: 'Oman',
  issuingPlace: 'Muscat',
  issuingAuthority: 'National Police',
  birthPlace: 'Muscat',
};

export default function CheckInForm({ lang, onCancel }: Props) {
  const isAr = lang === 'ar';
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [saved, setSaved] = useState(false);

  // Event Info
  const [branch] = useState('Main Branch — Muscat');
  const [bookingRef, setBookingRef] = useState('');
  const [room, setRoom] = useState('');
  const [payment, setPayment] = useState('Cash');
  const [cardType, setCardType] = useState('Visa');
  const [arrivalDate, setArrivalDate] = useState('2025-04-05');
  const [arrivalTime, setArrivalTime] = useState('14:00');
  const [departureDate, setDepartureDate] = useState('2025-04-08');
  const [departureTime, setDepartureTime] = useState('12:00');

  // Travel Doc
  const [holderStatus, setHolderStatus] = useState('Primary Holder');
  const [docType, setDocType] = useState('Passport');
  const [docNumber, setDocNumber] = useState('');
  const [issuingCountry, setIssuingCountry] = useState('');
  const [issuingPlace, setIssuingPlace] = useState('');
  const [issuingAuthority, setIssuingAuthority] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  // Personal
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('Male');
  const [dob, setDob] = useState('');
  const [nationality, setNationality] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [residence, setResidence] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      const d = SCANNER_DATA;
      const parts = d.holderName.split(' ');
      setFirstName(parts[0]);
      setLastName(parts.slice(1).join(' '));
      setDocNumber(d.docNumber);
      setNationality(d.nationality);
      setDob(d.dob);
      setGender(d.gender);
      setIssueDate(d.issueDate);
      setExpiryDate(d.expiryDate);
      setIssuingCountry(d.issuingCountry);
      setIssuingPlace(d.issuingPlace);
      setIssuingAuthority(d.issuingAuthority);
      setBirthPlace(d.birthPlace);
      setScanning(false);
      setScanned(true);
    }, 1800);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); onCancel(); }, 1500);
  };

  const inputCls = (filled?: boolean) =>
    `w-full rounded-lg border text-white text-sm px-3 py-2.5 focus:outline-none placeholder-gray-600 transition-colors ${
      filled && scanned ? 'border-green-500/40 bg-green-500/5' : 'border-gold-500/20 bg-transparent focus:border-gold-500/50'
    }`;

  const labelCls = 'block text-gray-400 text-xs mb-1.5 uppercase tracking-wider';

  return (
    <div className="p-5 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-white font-bold text-lg">{isAr ? 'تسجيل وصول جديد' : 'New Check-In'}</h2>
          <p className="text-gray-400 text-xs mt-0.5">{isAr ? 'أدخل بيانات النزيل أو امسح وثيقة السفر' : 'Enter guest details or scan travel document'}</p>
        </div>
        <button
          onClick={handleScan}
          disabled={scanning}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-all whitespace-nowrap border border-gold-500/40 text-gold-400 hover:bg-gold-500/10 disabled:opacity-50"
        >
          {scanning ? (
            <><i className="ri-loader-4-line animate-spin" />{isAr ? 'جارٍ المسح...' : 'Scanning...'}</>
          ) : (
            <><i className="ri-scan-line" />{isAr ? 'مسح الوثيقة' : 'Scan Document'}</>
          )}
        </button>
      </div>

      {/* Amber tip */}
      <div
        className="flex items-start gap-2 px-4 py-2.5 rounded-lg mb-5 text-xs"
        style={{ background: 'rgba(250,204,21,0.08)', border: '1px solid rgba(250,204,21,0.2)', color: '#FACC15' }}
      >
        <i className="ri-information-line text-sm shrink-0 mt-0.5" />
        <span>
          {isAr
            ? 'جميع بيانات تسجيل الوصول تُرسل تلقائياً إلى منصة أمين في الخلفية. لا يحتاج الموظف للتفاعل مع أمين مباشرة.'
            : 'All check-in data is automatically queued and sent to Al-Ameen Platform in the background. Staff do not interact with Al-Ameen directly.'}
        </span>
      </div>

      {scanned && (
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg mb-4 text-xs"
          style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.25)', color: '#4ADE80' }}
        >
          <i className="ri-checkbox-circle-line text-sm" />
          {isAr ? 'تم مسح الوثيقة بنجاح — تم ملء الحقول تلقائياً' : 'Document scanned successfully — fields auto-filled'}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* LEFT — Event Info */}
        <div
          className="rounded-xl border border-gold-500/20 p-5 space-y-4"
          style={{ background: 'rgba(10,37,64,0.8)' }}
        >
          <h3 className="text-gold-400 font-semibold text-sm uppercase tracking-wider">
            {isAr ? 'معلومات الحدث' : 'Event Info'}
          </h3>

          <div>
            <label className={labelCls}>{isAr ? 'الفرع' : 'Branch'}</label>
            <input type="text" value={branch} readOnly className={`${inputCls()} cursor-not-allowed opacity-60`} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>{isAr ? 'رقم الحجز' : 'Booking Ref'}</label>
              <input type="text" value={bookingRef} onChange={e => setBookingRef(e.target.value)} placeholder="BK-2025-006" className={inputCls()} />
            </div>
            <div>
              <label className={labelCls}>{isAr ? 'الغرفة' : 'Room'}</label>
              <select value={room} onChange={e => setRoom(e.target.value)} className={inputCls()} style={{ background: 'rgba(10,37,64,0.9)' }}>
                <option value="" style={{ background: '#0A2540' }}>{isAr ? 'اختر غرفة' : 'Select room'}</option>
                {rooms.filter(r => r.status === 'available' || r.status === 'reserved').map(r => (
                  <option key={r.id} value={r.number} style={{ background: '#0A2540' }}>
                    {r.number} — {r.type} ({r.rateOMR} OMR)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>{isAr ? 'طريقة الدفع' : 'Payment'}</label>
              <select value={payment} onChange={e => setPayment(e.target.value)} className={inputCls()} style={{ background: 'rgba(10,37,64,0.9)' }}>
                {PAYMENT_METHODS.map(p => <option key={p} value={p} style={{ background: '#0A2540' }}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>{isAr ? 'نوع البطاقة' : 'Card Type'}</label>
              <select value={cardType} onChange={e => setCardType(e.target.value)} className={inputCls()} style={{ background: 'rgba(10,37,64,0.9)' }}
                disabled={payment === 'Cash' || payment === 'Bank Transfer' || payment === 'Corporate Account'}
              >
                {CARD_TYPES.map(c => <option key={c} value={c} style={{ background: '#0A2540' }}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>{isAr ? 'تاريخ الوصول' : 'Arrival Date'}</label>
              <input type="date" value={arrivalDate} onChange={e => setArrivalDate(e.target.value)} className={inputCls()} />
            </div>
            <div>
              <label className={labelCls}>{isAr ? 'وقت الوصول' : 'Arrival Time'}</label>
              <input type="time" value={arrivalTime} onChange={e => setArrivalTime(e.target.value)} className={inputCls()} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>{isAr ? 'تاريخ المغادرة' : 'Departure Date'}</label>
              <input type="date" value={departureDate} onChange={e => setDepartureDate(e.target.value)} className={inputCls()} />
            </div>
            <div>
              <label className={labelCls}>{isAr ? 'وقت المغادرة' : 'Departure Time'}</label>
              <input type="time" value={departureTime} onChange={e => setDepartureTime(e.target.value)} className={inputCls()} />
            </div>
          </div>
        </div>

        {/* RIGHT — Travel Document */}
        <div
          className="rounded-xl border border-gold-500/20 p-5 space-y-4"
          style={{ background: 'rgba(10,37,64,0.8)' }}
        >
          <h3 className="text-gold-400 font-semibold text-sm uppercase tracking-wider">
            {isAr ? 'وثيقة السفر' : 'Travel Document'}
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>{isAr ? 'حالة الحامل' : 'Holder Status'}</label>
              <select value={holderStatus} onChange={e => setHolderStatus(e.target.value)} className={inputCls()} style={{ background: 'rgba(10,37,64,0.9)' }}>
                {HOLDER_STATUS.map(s => <option key={s} value={s} style={{ background: '#0A2540' }}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>{isAr ? 'نوع الوثيقة' : 'Doc Type'}</label>
              <select value={docType} onChange={e => setDocType(e.target.value)} className={inputCls()} style={{ background: 'rgba(10,37,64,0.9)' }}>
                {DOC_TYPES.map(d => <option key={d} value={d} style={{ background: '#0A2540' }}>{d}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>{isAr ? 'رقم الوثيقة' : 'Document Number'}</label>
            <input type="text" value={docNumber} onChange={e => setDocNumber(e.target.value)} placeholder="OM-4412891" className={inputCls(!!docNumber)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>{isAr ? 'دولة الإصدار' : 'Issuing Country'}</label>
              <select value={issuingCountry} onChange={e => setIssuingCountry(e.target.value)} className={inputCls(!!issuingCountry)} style={{ background: 'rgba(10,37,64,0.9)' }}>
                <option value="" style={{ background: '#0A2540' }}>—</option>
                {COUNTRIES.map(c => <option key={c} value={c} style={{ background: '#0A2540' }}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>{isAr ? 'مكان الإصدار' : 'Issuing Place'}</label>
              <input type="text" value={issuingPlace} onChange={e => setIssuingPlace(e.target.value)} placeholder="Muscat" className={inputCls(!!issuingPlace)} />
            </div>
          </div>

          <div>
            <label className={labelCls}>{isAr ? 'جهة الإصدار' : 'Issuing Authority'}</label>
            <input type="text" value={issuingAuthority} onChange={e => setIssuingAuthority(e.target.value)} placeholder="National Police" className={inputCls(!!issuingAuthority)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>{isAr ? 'تاريخ الإصدار' : 'Issue Date'}</label>
              <input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} className={inputCls(!!issueDate)} />
            </div>
            <div>
              <label className={labelCls}>{isAr ? 'تاريخ الانتهاء' : 'Expiry Date'}</label>
              <input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} className={inputCls(!!expiryDate)} />
            </div>
          </div>
        </div>
      </div>

      {/* Personal Details */}
      <div
        className="rounded-xl border border-gold-500/20 p-5 mt-5 space-y-4"
        style={{ background: 'rgba(10,37,64,0.8)' }}
      >
        <h3 className="text-gold-400 font-semibold text-sm uppercase tracking-wider">
          {isAr ? 'البيانات الشخصية' : 'Personal Details'}
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className={labelCls}>{isAr ? 'الاسم الأول' : 'First Name'}</label>
            <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Ahmed" className={inputCls(!!firstName)} />
          </div>
          <div>
            <label className={labelCls}>{isAr ? 'اسم العائلة' : 'Last Name'}</label>
            <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Al-Rashidi" className={inputCls(!!lastName)} />
          </div>
          <div>
            <label className={labelCls}>{isAr ? 'الجنس' : 'Gender'}</label>
            <select value={gender} onChange={e => setGender(e.target.value)} className={inputCls(!!gender)} style={{ background: 'rgba(10,37,64,0.9)' }}>
              {['Male', 'Female'].map(g => <option key={g} value={g} style={{ background: '#0A2540' }}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>{isAr ? 'تاريخ الميلاد' : 'Date of Birth'}</label>
            <input type="date" value={dob} onChange={e => setDob(e.target.value)} className={inputCls(!!dob)} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className={labelCls}>{isAr ? 'الجنسية' : 'Nationality'}</label>
            <select value={nationality} onChange={e => setNationality(e.target.value)} className={inputCls(!!nationality)} style={{ background: 'rgba(10,37,64,0.9)' }}>
              <option value="" style={{ background: '#0A2540' }}>—</option>
              {COUNTRIES.map(c => <option key={c} value={c} style={{ background: '#0A2540' }}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>{isAr ? 'مكان الميلاد' : 'Birth Place'}</label>
            <input type="text" value={birthPlace} onChange={e => setBirthPlace(e.target.value)} placeholder="Muscat" className={inputCls(!!birthPlace)} />
          </div>
          <div>
            <label className={labelCls}>{isAr ? 'مكان الإقامة' : 'Residence'}</label>
            <input type="text" value={residence} onChange={e => setResidence(e.target.value)} placeholder="Muscat, Oman" className={inputCls()} />
          </div>
          <div>
            <label className={labelCls}>{isAr ? 'البريد الإلكتروني' : 'Email'}</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="guest@email.com" className={inputCls()} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 max-w-sm">
          <div>
            <label className={labelCls}>{isAr ? 'رقم الهاتف' : 'Phone'}</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+968 9234 5678" className={inputCls()} />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-gold-500/10">
        <div
          className="flex items-center gap-2 text-xs"
          style={{ color: '#4ADE80' }}
        >
          <i className="ri-cloud-line" />
          {isAr ? 'سيتم إرسال البيانات تلقائياً إلى أمين عند الحفظ' : 'Data will auto-sync to Al-Ameen on save'}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-lg text-sm border border-gray-600 text-gray-300 hover:border-gray-400 cursor-pointer transition-all whitespace-nowrap"
          >
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all whitespace-nowrap"
            style={{ background: saved ? '#4ADE80' : '#D6B47E', color: '#051428' }}
          >
            {saved ? (
              <span className="flex items-center gap-2"><i className="ri-checkbox-circle-line" />{isAr ? 'تم الحفظ!' : 'Saved!'}</span>
            ) : (
              <span><i className="ri-save-line mr-1" />{isAr ? 'حفظ + مزامنة أمين' : 'Save + Sync to Al-Ameen'}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
