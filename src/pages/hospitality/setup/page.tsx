import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ROOM_TYPES = ['Single', 'Double', 'Twin', 'Suite', 'Family'];
const AMENITIES = ['WiFi', 'AC', 'TV', 'Minibar', 'Safe', 'Bathtub', 'Balcony', 'Lounge', 'Parking'];
const STAR_RATINGS = [1, 2, 3, 4, 5];
const CITIES = ['Muscat', 'Salalah', 'Sohar', 'Nizwa', 'Sur', 'Duqm', 'Khasab', 'Ibri', 'Buraimi'];

interface RoomEntry {
  id: string;
  number: string;
  floor: string;
  type: string;
  maxOccupancy: string;
  rateOMR: string;
  amenities: string[];
}

export default function SetupWizardPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const isAr = lang === 'ar';

  // Step 1
  const [hotelNameEn, setHotelNameEn] = useState('');
  const [hotelNameAr, setHotelNameAr] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [starRating, setStarRating] = useState(2);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Muscat');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [totalRooms, setTotalRooms] = useState('');
  const [ameenRegNumber, setAmeenRegNumber] = useState('');
  const [isChain, setIsChain] = useState(false);
  const [brand, setBrand] = useState('');
  const [branchCode, setBranchCode] = useState('');

  // Step 2
  const [rooms, setRooms] = useState<RoomEntry[]>([
    { id: '1', number: '101', floor: '1', type: 'Single', maxOccupancy: '1', rateOMR: '18', amenities: ['WiFi', 'AC'] },
    { id: '2', number: '102', floor: '1', type: 'Double', maxOccupancy: '2', rateOMR: '25', amenities: ['WiFi', 'AC', 'TV'] },
    { id: '3', number: '201', floor: '2', type: 'Suite',  maxOccupancy: '2', rateOMR: '55', amenities: ['WiFi', 'AC', 'TV', 'Minibar', 'Safe'] },
  ]);
  const [bulkCount, setBulkCount] = useState('');
  const [bulkFloor, setBulkFloor] = useState('1');
  const [bulkType, setBulkType] = useState('Single');

  // Step 3
  const [scannerStatus, setScannerStatus] = useState<'idle' | 'detecting' | 'connected' | 'failed'>('idle');
  const [testScanDone, setTestScanDone] = useState(false);

  // Step 4
  const [serverUrl] = useState('https://api.ameen.ameen.gov/v2');
  const [apiKey, setApiKey] = useState('');
  const [connStatus, setConnStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');

  const STEPS = [
    { n: 1, labelEn: 'Hotel Profile',  labelAr: 'ملف الفندق',    icon: 'ri-hotel-line',   descEn: 'Basic hotel information', descAr: 'معلومات الفندق الأساسية' },
    { n: 2, labelEn: 'Rooms',          labelAr: 'الغرف',          icon: 'ri-door-line',    descEn: 'Configure room inventory', descAr: 'إعداد مخزون الغرف' },
    { n: 3, labelEn: 'Scanner',        labelAr: 'الماسح الضوئي', icon: 'ri-scan-line',    descEn: 'Connect document scanner', descAr: 'توصيل الماسح الضوئي' },
    { n: 4, labelEn: 'AMEEN Sync',     labelAr: 'مزامنة أمين',   icon: 'ri-cloud-line',   descEn: 'Connect to AMEEN Platform', descAr: 'الاتصال بمنصة أمين' },
  ];

  const addRoom = () => {
    setRooms(prev => [...prev, { id: String(Date.now()), number: '', floor: '1', type: 'Single', maxOccupancy: '1', rateOMR: '18', amenities: [] }]);
  };

  const removeRoom = (id: string) => setRooms(prev => prev.filter(r => r.id !== id));

  const updateRoom = (id: string, field: keyof RoomEntry, value: string | string[]) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const toggleAmenity = (roomId: string, amenity: string) => {
    setRooms(prev => prev.map(r => {
      if (r.id !== roomId) return r;
      const has = r.amenities.includes(amenity);
      return { ...r, amenities: has ? r.amenities.filter(a => a !== amenity) : [...r.amenities, amenity] };
    }));
  };

  const bulkAdd = () => {
    const count = parseInt(bulkCount);
    if (!count || count < 1) return;
    const newRooms: RoomEntry[] = Array.from({ length: count }, (_, i) => ({
      id: String(Date.now() + i),
      number: `${bulkFloor}${String(i + 1).padStart(2, '0')}`,
      floor: bulkFloor,
      type: bulkType,
      maxOccupancy: bulkType === 'Suite' ? '3' : bulkType === 'Family' ? '4' : bulkType === 'Single' ? '1' : '2',
      rateOMR: '20',
      amenities: ['WiFi', 'AC'],
    }));
    setRooms(prev => [...prev, ...newRooms]);
    setBulkCount('');
  };

  const detectScanner = () => {
    setScannerStatus('detecting');
    setTimeout(() => setScannerStatus('connected'), 2200);
  };

  const testScan = () => {
    setTimeout(() => setTestScanDone(true), 1500);
  };

  const testConnection = () => {
    setConnStatus('testing');
    setTimeout(() => setConnStatus(apiKey.length > 8 ? 'success' : 'failed'), 2000);
  };

  const finish = () => {
    sessionStorage.setItem('hosp_setup_done', 'true');
    navigate('/hospitality/app');
  };

  const inputCls = "w-full rounded-xl border border-gold-500/20 bg-transparent text-white text-sm px-3 py-2.5 focus:outline-none focus:border-gold-500/50 placeholder-gray-600 transition-colors";
  const labelCls = "block text-gray-400 text-xs mb-1.5 uppercase tracking-wider";

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#0B1220', fontFamily: "'Inter', sans-serif" }}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Grid texture */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(181,142,60,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(181,142,60,0.025) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Title bar */}
      <div
        className="relative z-10 flex items-center justify-between px-5 py-3 border-b border-gold-500/15 shrink-0"
        style={{ background: 'rgba(11,18,32,0.98)' }}
      >
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <div className="w-px h-4 bg-gray-700" />
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(181,142,60,0.1)' }}
          >
            <i className="ri-shield-star-fill text-gold-400" style={{ fontSize: 12 }} />
          </div>
          <span className="text-white text-sm font-bold">Al-Ameen Hospitality</span>
          <span className="text-gold-400/50 text-sm">|</span>
          <span className="text-gold-400/50 text-sm" style={{ fontFamily: 'serif' }}>الأمين للضيافة</span>
          <span
            className="px-2 py-0.5 rounded-lg text-xs font-mono"
            style={{ background: 'rgba(181,142,60,0.1)', color: '#D4A84B' }}
          >
            SETUP WIZARD
          </span>
        </div>
        <button
          onClick={() => setLang(l => l === 'en' ? 'ar' : 'en')}
          className="px-2.5 py-1 rounded-lg border border-gold-500/20 text-gold-400 text-xs cursor-pointer hover:bg-gold-500/8 transition-colors whitespace-nowrap"
        >
          {isAr ? 'EN' : 'عربي'}
        </button>
      </div>

      <div className="relative z-10 flex flex-1">
        {/* Left sidebar — steps */}
        <div
          className="w-72 shrink-0 border-r border-gold-500/10 p-6 flex flex-col"
          style={{ background: 'rgba(8,18,35,0.8)' }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center border-2 border-gold-500/25 shrink-0"
              style={{ background: 'rgba(181,142,60,0.08)' }}
            >
              <i className="ri-hotel-line text-gold-400 text-xl" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">{isAr ? 'معالج الإعداد' : 'Setup Wizard'}</p>
              <p className="text-gray-500 text-xs">{isAr ? 'أعد نظامك في 4 خطوات' : '4 steps to get started'}</p>
            </div>
          </div>

          {/* Steps list */}
          <div className="space-y-2 flex-1">
            {STEPS.map((s, idx) => {
              const isDone = step > s.n;
              const isActive = step === s.n;
              return (
                <div
                  key={s.n}
                  className="flex items-start gap-3 p-3 rounded-xl transition-all"
                  style={{
                    background: isActive ? 'rgba(181,142,60,0.08)' : 'transparent',
                    border: isActive ? '1px solid rgba(181,142,60,0.2)' : '1px solid transparent',
                  }}
                >
                  {/* Step circle */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 mt-0.5 transition-all"
                    style={{
                      background: isDone ? '#D4A84B' : isActive ? 'rgba(181,142,60,0.15)' : 'rgba(20,29,46,0.8)',
                      borderColor: isDone || isActive ? '#D4A84B' : 'rgba(181,142,60,0.15)',
                    }}
                  >
                    {isDone ? (
                      <i className="ri-check-line text-sm font-bold" style={{ color: '#0B1220' }} />
                    ) : (
                      <i className={`${s.icon} text-sm`} style={{ color: isActive ? '#D4A84B' : '#4B5563' }} />
                    )}
                  </div>

                  {/* Connector line */}
                  <div className="flex-1">
                    <p
                      className="text-sm font-semibold"
                      style={{ color: isDone || isActive ? '#FFFFFF' : '#6B7280' }}
                    >
                      {isAr ? s.labelAr : s.labelEn}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: isDone ? '#4ADE80' : isActive ? '#9CA3AF' : '#4B5563' }}>
                      {isDone ? (isAr ? 'مكتمل' : 'Completed') : (isAr ? s.descAr : s.descEn)}
                    </p>
                  </div>

                  {isDone && (
                    <i className="ri-checkbox-circle-fill text-green-400 text-sm shrink-0 mt-1" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom note */}
          <div
            className="mt-6 rounded-xl p-3 border border-gold-500/15"
            style={{ background: 'rgba(181,142,60,0.04)' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <i className="ri-information-line text-gold-400 text-sm" />
              <p className="text-gold-400 text-xs font-semibold">{isAr ? 'مجاني تماماً' : 'Completely Free'}</p>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed">
              {isAr
                ? 'هذا النظام مقدم مجاناً من الشرطة الوطنية لجميع الفنادق المسجلة في برنامج أمين.'
                : 'This system is provided free by National Police to all AMEEN-registered hotels.'}
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex items-start justify-center py-10 px-8 overflow-y-auto">
          <div className="w-full max-w-xl">
            {/* Step panel */}
            <div
              className="rounded-2xl border border-gold-500/20 p-7 relative"
              style={{ background: 'rgba(20,29,46,0.85)', backdropFilter: 'blur(12px)' }}
            >
              {/* Top accent */}
              <div
                className="absolute top-0 left-8 right-8 h-0.5 rounded-full"
                style={{ background: 'linear-gradient(90deg, transparent, #D4A84B, transparent)' }}
              />

              {/* Step header */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center border border-gold-500/30"
                  style={{ background: 'rgba(181,142,60,0.1)' }}
                >
                  <i className={`${STEPS[step - 1].icon} text-gold-400 text-lg`} />
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg">
                    {isAr ? STEPS[step - 1].labelAr : STEPS[step - 1].labelEn}
                  </h2>
                  <p className="text-gray-500 text-xs">
                    {isAr ? `الخطوة ${step} من 4` : `Step ${step} of 4`}
                    {' · '}
                    {isAr ? STEPS[step - 1].descAr : STEPS[step - 1].descEn}
                  </p>
                </div>
              </div>

              {/* STEP 1 — Hotel Profile */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>{isAr ? 'اسم الفندق (إنجليزي)' : 'Hotel Name (English)'}</label>
                      <input type="text" value={hotelNameEn} onChange={e => setHotelNameEn(e.target.value)} placeholder="Al Wadi Guesthouse" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>{isAr ? 'اسم الفندق (عربي)' : 'Hotel Name (Arabic)'}</label>
                      <input type="text" value={hotelNameAr} onChange={e => setHotelNameAr(e.target.value)} placeholder="استراحة الوادي" className={inputCls} dir="rtl" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>{isAr ? 'رقم الترخيص' : 'License Number'}</label>
                      <input type="text" value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} placeholder="TL-2024-08234" className={`${inputCls} font-mono`} />
                    </div>
                    <div>
                      <label className={labelCls}>{isAr ? 'تصنيف النجوم' : 'Star Rating'}</label>
                      <div className="flex items-center gap-2 pt-2">
                        {STAR_RATINGS.map(s => (
                          <button key={s} onClick={() => setStarRating(s)} className="cursor-pointer transition-all hover:scale-110">
                            <i className="ri-star-fill text-xl" style={{ color: s <= starRating ? '#FACC15' : '#374151' }} />
                          </button>
                        ))}
                        <span className="text-gray-500 text-xs ml-1">{starRating} {isAr ? 'نجوم' : 'stars'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>{isAr ? 'العنوان' : 'Address'}</label>
                    <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Building 12, Al Khuwair Street" className={inputCls} />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className={labelCls}>{isAr ? 'المدينة' : 'City'}</label>
                      <select value={city} onChange={e => setCity(e.target.value)} className={`${inputCls} cursor-pointer`} style={{ background: 'rgba(20,29,46,0.9)' }}>
                        {CITIES.map(c => <option key={c} value={c} style={{ background: '#141D2E' }}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>{isAr ? 'الهاتف' : 'Phone'}</label>
                      <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+968 2441 2345" className={`${inputCls} font-mono`} />
                    </div>
                    <div>
                      <label className={labelCls}>{isAr ? 'إجمالي الغرف' : 'Total Rooms'}</label>
                      <input type="number" value={totalRooms} onChange={e => setTotalRooms(e.target.value)} placeholder="24" className={`${inputCls} font-mono`} />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>
                      {isAr ? 'رقم تسجيل أمين' : 'AMEEN Registration Number'}
                      <span className="text-gold-500/50 ml-2 normal-case">{isAr ? '(من الشرطة الوطنية)' : '(obtained from National Police)'}</span>
                    </label>
                    <div className="relative">
                      <i className={`ri-shield-star-line absolute top-1/2 -translate-y-1/2 text-gold-500/50 text-sm ${isAr ? 'right-3' : 'left-3'}`} />
                      <input
                        type="text"
                        value={ameenRegNumber}
                        onChange={e => setAmeenRegNumber(e.target.value)}
                        placeholder="AMN-HTL-2024-00891"
                        className={`${inputCls} font-mono`}
                        style={{ paddingLeft: isAr ? 12 : 36, paddingRight: isAr ? 36 : 12, color: '#D4A84B' }}
                      />
                    </div>
                  </div>

                  {/* Chain toggle */}
                  <div className="rounded-xl border border-gold-500/15 p-4" style={{ background: 'rgba(181,142,60,0.03)' }}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-white text-sm font-medium">{isAr ? 'فندق سلسلة' : 'Chain Hotel'}</p>
                        <p className="text-gray-500 text-xs">{isAr ? 'هل هذا الفندق جزء من سلسلة؟' : 'Is this hotel part of a chain?'}</p>
                      </div>
                      <button
                        onClick={() => setIsChain(c => !c)}
                        className="relative w-10 h-5 rounded-full transition-colors cursor-pointer shrink-0"
                        style={{ background: isChain ? '#D4A84B' : '#374151' }}
                      >
                        <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all" style={{ left: isChain ? '22px' : '2px' }} />
                      </button>
                    </div>
                    {isChain && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-gray-500 text-xs mb-1">{isAr ? 'العلامة التجارية' : 'Brand'}</label>
                          <input type="text" value={brand} onChange={e => setBrand(e.target.value)} placeholder="Oman Hotels Group" className={inputCls} />
                        </div>
                        <div>
                          <label className="block text-gray-500 text-xs mb-1">{isAr ? 'رمز الفرع' : 'Branch Code'}</label>
                          <input type="text" value={branchCode} onChange={e => setBranchCode(e.target.value)} placeholder="MCT-001" className={`${inputCls} font-mono`} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2 — Rooms */}
              {step === 2 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-gray-400 text-sm">{isAr ? 'أضف غرف فندقك' : 'Add your hotel rooms'}</p>
                    <span
                      className="px-2.5 py-1 rounded-lg font-mono text-sm"
                      style={{ background: 'rgba(181,142,60,0.1)', color: '#D4A84B' }}
                    >
                      {rooms.length} {isAr ? 'غرفة' : 'rooms'}
                    </span>
                  </div>

                  {/* Bulk add */}
                  <div className="rounded-xl border border-gold-500/15 p-4 mb-4" style={{ background: 'rgba(181,142,60,0.03)' }}>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">{isAr ? 'إضافة جماعية' : 'Bulk Add'}</p>
                    <div className="flex items-end gap-3">
                      <div className="flex-1">
                        <label className="block text-gray-600 text-xs mb-1">{isAr ? 'العدد' : 'Count'}</label>
                        <input type="number" value={bulkCount} onChange={e => setBulkCount(e.target.value)} placeholder="10" className={`${inputCls} font-mono`} />
                      </div>
                      <div className="flex-1">
                        <label className="block text-gray-600 text-xs mb-1">{isAr ? 'الطابق' : 'Floor'}</label>
                        <input type="text" value={bulkFloor} onChange={e => setBulkFloor(e.target.value)} placeholder="2" className={`${inputCls} font-mono`} />
                      </div>
                      <div className="flex-1">
                        <label className="block text-gray-600 text-xs mb-1">{isAr ? 'النوع' : 'Type'}</label>
                        <select value={bulkType} onChange={e => setBulkType(e.target.value)} className={`${inputCls} cursor-pointer`} style={{ background: 'rgba(20,29,46,0.9)' }}>
                          {ROOM_TYPES.map(t => <option key={t} value={t} style={{ background: '#141D2E' }}>{t}</option>)}
                        </select>
                      </div>
                      <button
                        onClick={bulkAdd}
                        className="px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer whitespace-nowrap transition-all"
                        style={{ background: '#D4A84B', color: '#0B1220' }}
                      >
                        <i className="ri-add-line mr-1" />{isAr ? 'إضافة' : 'Add'}
                      </button>
                    </div>
                  </div>

                  {/* Room list */}
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {rooms.map(room => (
                      <div key={room.id} className="rounded-xl border border-gold-500/12 p-3" style={{ background: 'rgba(20,29,46,0.6)' }}>
                        <div className="grid grid-cols-5 gap-2 mb-2">
                          {[
                            { label: isAr ? 'رقم' : 'No.', value: room.number, field: 'number' as const, placeholder: '101' },
                            { label: isAr ? 'طابق' : 'Floor', value: room.floor, field: 'floor' as const, placeholder: '1' },
                            { label: isAr ? 'إشغال' : 'Max Occ.', value: room.maxOccupancy, field: 'maxOccupancy' as const, placeholder: '2' },
                            { label: isAr ? 'السعر OMR' : 'Rate OMR', value: room.rateOMR, field: 'rateOMR' as const, placeholder: '25' },
                          ].map(f => (
                            <div key={f.field}>
                              <label className="block text-gray-600 text-xs mb-1">{f.label}</label>
                              <input
                                type="text"
                                value={f.value}
                                onChange={e => updateRoom(room.id, f.field, e.target.value)}
                                placeholder={f.placeholder}
                                className="w-full rounded-lg border border-gold-500/15 bg-transparent text-white text-xs px-2 py-1.5 focus:outline-none focus:border-gold-500/35 placeholder-gray-700 font-mono"
                              />
                            </div>
                          ))}
                          <div>
                            <label className="block text-gray-600 text-xs mb-1">{isAr ? 'النوع' : 'Type'}</label>
                            <select
                              value={room.type}
                              onChange={e => updateRoom(room.id, 'type', e.target.value)}
                              className="w-full rounded-lg border border-gold-500/15 text-white text-xs px-2 py-1.5 focus:outline-none cursor-pointer"
                              style={{ background: 'rgba(20,29,46,0.9)' }}
                            >
                              {ROOM_TYPES.map(t => <option key={t} value={t} style={{ background: '#141D2E' }}>{t}</option>)}
                            </select>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {AMENITIES.map(a => (
                              <button
                                key={a}
                                onClick={() => toggleAmenity(room.id, a)}
                                className="px-1.5 py-0.5 rounded text-xs cursor-pointer transition-all whitespace-nowrap"
                                style={{
                                  background: room.amenities.includes(a) ? 'rgba(181,142,60,0.12)' : 'rgba(75,85,99,0.15)',
                                  color: room.amenities.includes(a) ? '#D4A84B' : '#6B7280',
                                  border: `1px solid ${room.amenities.includes(a) ? 'rgba(181,142,60,0.25)' : 'transparent'}`,
                                }}
                              >
                                {a}
                              </button>
                            ))}
                          </div>
                          <button onClick={() => removeRoom(room.id)} className="text-gray-600 hover:text-red-400 cursor-pointer transition-colors ml-2 shrink-0">
                            <i className="ri-delete-bin-line text-sm" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={addRoom}
                    className="mt-3 w-full py-2.5 rounded-xl border border-dashed border-gold-500/25 text-gold-400 text-sm cursor-pointer hover:bg-gold-500/5 transition-colors"
                  >
                    <i className="ri-add-line mr-1" />{isAr ? 'إضافة غرفة' : 'Add Room'}
                  </button>
                </div>
              )}

              {/* STEP 3 — Scanner */}
              {step === 3 && (
                <div className="space-y-5">
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {isAr
                      ? 'يتيح ماسح Regula قراءة جوازات السفر والهويات تلقائياً عند تسجيل الوصول، مما يوفر الوقت ويضمن دقة البيانات.'
                      : 'The Regula scanner enables automatic passport and ID reading at check-in, saving time and ensuring data accuracy.'}
                  </p>

                  <div className="rounded-2xl border border-gold-500/20 p-6 text-center" style={{ background: 'rgba(181,142,60,0.03)' }}>
                    <div
                      className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 transition-all duration-500"
                      style={{
                        background: scannerStatus === 'connected' ? 'rgba(74,222,128,0.12)' : scannerStatus === 'failed' ? 'rgba(248,113,113,0.12)' : 'rgba(181,142,60,0.08)',
                        borderColor: scannerStatus === 'connected' ? '#4ADE80' : scannerStatus === 'failed' ? '#F87171' : '#D4A84B',
                        boxShadow: scannerStatus === 'connected' ? '0 0 20px rgba(74,222,128,0.2)' : scannerStatus === 'detecting' ? '0 0 20px rgba(181,142,60,0.2)' : 'none',
                      }}
                    >
                      <i
                        className={`ri-scan-line text-4xl ${scannerStatus === 'detecting' ? 'animate-pulse' : ''}`}
                        style={{ color: scannerStatus === 'connected' ? '#4ADE80' : scannerStatus === 'failed' ? '#F87171' : '#D4A84B' }}
                      />
                    </div>

                    <p className="text-white font-semibold text-base mb-1">Regula Document Scanner</p>
                    <p className="text-gray-500 text-sm mb-5">
                      {scannerStatus === 'idle' && (isAr ? 'وصّل الماسح عبر USB ثم اضغط الكشف' : 'Connect scanner via USB then click Detect')}
                      {scannerStatus === 'detecting' && (isAr ? 'جارٍ الكشف عن الأجهزة...' : 'Detecting USB devices...')}
                      {scannerStatus === 'connected' && (isAr ? 'تم الاتصال — Regula 7000 Series' : 'Connected — Regula 7000 Series detected')}
                      {scannerStatus === 'failed' && (isAr ? 'لم يتم الكشف عن أي جهاز' : 'No device detected')}
                    </p>

                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={detectScanner}
                        disabled={scannerStatus === 'detecting'}
                        className="px-6 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all whitespace-nowrap"
                        style={{ background: '#D4A84B', color: '#0B1220', opacity: scannerStatus === 'detecting' ? 0.6 : 1 }}
                      >
                        {scannerStatus === 'detecting' ? (
                          <span className="flex items-center gap-2"><i className="ri-loader-4-line animate-spin" />{isAr ? 'جارٍ الكشف...' : 'Detecting...'}</span>
                        ) : (
                          <span><i className="ri-usb-line mr-1" />{isAr ? 'كشف الماسح' : 'Detect Scanner'}</span>
                        )}
                      </button>

                      {scannerStatus === 'connected' && !testScanDone && (
                        <button
                          onClick={testScan}
                          className="px-6 py-2.5 rounded-xl text-sm font-medium border border-gold-500/30 text-gold-400 hover:bg-gold-500/8 cursor-pointer transition-all whitespace-nowrap"
                        >
                          <i className="ri-scan-2-line mr-1" />{isAr ? 'مسح تجريبي' : 'Test Scan'}
                        </button>
                      )}
                    </div>

                    {testScanDone && (
                      <div className="mt-5 rounded-xl p-4 border border-green-500/25 text-left" style={{ background: 'rgba(74,222,128,0.06)' }}>
                        <p className="text-green-400 text-sm font-semibold mb-3">
                          <i className="ri-checkbox-circle-line mr-1" />{isAr ? 'نجح المسح التجريبي' : 'Test scan successful'}
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {[['Name', 'AHMED AL-RASHIDI'], ['DOB', '1985-03-12'], ['Nationality', 'OMN'], ['Doc No.', 'OM-4412891'], ['Expiry', '2030-03-11'], ['MRZ', 'Valid ✓']].map(([k, v]) => (
                            <div key={k} className="flex gap-2">
                              <span className="text-gray-500">{k}:</span>
                              <span className="text-white font-mono">{v}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setStep(4)}
                    className="w-full py-2.5 rounded-xl border border-gray-700 text-gray-500 text-sm cursor-pointer hover:border-gray-600 hover:text-gray-400 transition-colors"
                  >
                    {isAr ? 'تخطي — سأوصل الماسح لاحقاً' : 'Skip — I\'ll connect the scanner later'}
                  </button>
                </div>
              )}

              {/* STEP 4 — AMEEN Sync */}
              {step === 4 && (
                <div className="space-y-5">
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {isAr
                      ? 'يتصل هذا التطبيق بمنصة أمين لإرسال بيانات الأحداث تلقائياً في الخلفية. لا يحتاج الموظف للتفاعل مع أمين مباشرة.'
                      : 'This app connects to AMEEN Platform to automatically send event data in the background. Staff never interact with AMEEN directly.'}
                  </p>

                  <div className="rounded-xl border border-gold-500/20 p-4" style={{ background: 'rgba(181,142,60,0.04)' }}>
                    <div className="flex items-start gap-3">
                      <i className="ri-information-line text-gold-400 text-base mt-0.5 shrink-0" />
                      <p className="text-gold-300 text-xs leading-relaxed">
                        {isAr
                          ? 'مفتاح API مقدم من الشرطة الوطنية عند التسجيل في برنامج أمين. إذا لم يكن لديك مفتاح، تواصل مع مركز قيادة أمين على الرقم 2400-0000.'
                          : 'API Key is provided by National Police upon AMEEN program registration. If you don\'t have a key, contact AMEEN Command Center at 2400-0000.'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>{isAr ? 'عنوان الخادم' : 'Server URL'}</label>
                    <div className="relative">
                      <i className={`ri-server-line absolute top-1/2 -translate-y-1/2 text-gray-600 text-sm ${isAr ? 'right-3' : 'left-3'}`} />
                      <input
                        type="text"
                        value={serverUrl}
                        readOnly
                        className={`${inputCls} font-mono cursor-not-allowed`}
                        style={{ paddingLeft: isAr ? 12 : 36, paddingRight: isAr ? 36 : 12, color: '#D4A84B', opacity: 0.7 }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>
                      {isAr ? 'مفتاح API' : 'API Key'}
                      <span className="text-red-400 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <i className={`ri-key-line absolute top-1/2 -translate-y-1/2 text-gray-600 text-sm ${isAr ? 'right-3' : 'left-3'}`} />
                      <input
                        type="password"
                        value={apiKey}
                        onChange={e => setApiKey(e.target.value)}
                        placeholder={isAr ? 'أدخل مفتاح API المقدم من الشرطة الوطنية' : 'Enter API Key provided by National Police'}
                        className={`${inputCls} font-mono`}
                        style={{ paddingLeft: isAr ? 12 : 36, paddingRight: isAr ? 36 : 12 }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={testConnection}
                    disabled={connStatus === 'testing' || !apiKey}
                    className="w-full py-2.5 rounded-xl text-sm font-medium border border-gold-500/35 text-gold-400 hover:bg-gold-500/8 cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {connStatus === 'testing' ? (
                      <span className="flex items-center justify-center gap-2">
                        <i className="ri-loader-4-line animate-spin" />
                        {isAr ? 'جارٍ الاختبار...' : 'Testing connection...'}
                      </span>
                    ) : (
                      <span><i className="ri-wifi-line mr-1" />{isAr ? 'اختبار الاتصال' : 'Test Connection'}</span>
                    )}
                  </button>

                  {connStatus === 'success' && (
                    <div className="rounded-xl p-4 border border-green-500/25" style={{ background: 'rgba(74,222,128,0.06)' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <i className="ri-checkbox-circle-line text-green-400 text-base" />
                        <span className="text-green-400 font-semibold text-sm">{isAr ? 'تم الاتصال بنجاح' : 'Connection successful'}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {[
                          [isAr ? 'الخادم' : 'Server', 'api.ameen.ameen.gov'],
                          [isAr ? 'الكمون' : 'Latency', '42ms'],
                          [isAr ? 'الإصدار' : 'API Version', 'v2.4'],
                          [isAr ? 'الحالة' : 'Status', 'Authorized ✓'],
                        ].map(([k, v]) => (
                          <div key={k} className="flex gap-2">
                            <span className="text-gray-500">{k}:</span>
                            <span className="text-white font-mono">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {connStatus === 'failed' && (
                    <div className="rounded-xl p-3 border border-red-500/25 text-sm" style={{ background: 'rgba(248,113,113,0.07)' }}>
                      <i className="ri-error-warning-line text-red-400 mr-2" />
                      <span className="text-red-400">{isAr ? 'فشل الاتصال. تحقق من مفتاح API.' : 'Connection failed. Check your API Key.'}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-7 pt-5 border-t border-gold-500/10">
                <button
                  onClick={() => setStep(s => Math.max(1, s - 1))}
                  disabled={step === 1}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm border border-gold-500/20 text-gray-400 hover:text-white hover:border-gold-500/40 cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  <i className="ri-arrow-left-line" />{isAr ? 'السابق' : 'Back'}
                </button>

                <div className="flex gap-1.5">
                  {STEPS.map(s => (
                    <div
                      key={s.n}
                      className="w-2 h-2 rounded-full transition-all"
                      style={{ background: step === s.n ? '#D4A84B' : step > s.n ? '#4ADE80' : '#374151' }}
                    />
                  ))}
                </div>

                {step < 4 ? (
                  <button
                    onClick={() => setStep(s => Math.min(4, s + 1))}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all whitespace-nowrap"
                    style={{ background: '#D4A84B', color: '#0B1220' }}
                  >
                    {isAr ? 'التالي' : 'Next'}<i className="ri-arrow-right-line" />
                  </button>
                ) : (
                  <button
                    onClick={finish}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-all whitespace-nowrap"
                    style={{ background: '#D4A84B', color: '#0B1220' }}
                  >
                    <i className="ri-check-line" />{isAr ? 'إنهاء الإعداد' : 'Finish Setup'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
