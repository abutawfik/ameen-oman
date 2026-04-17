import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const USERS = [
  { username: 'admin',     password: 'admin123',  role: 'Admin',     nameEn: 'Salim Al-Rashidi',  nameAr: 'سالم الراشدي',  initials: 'SR' },
  { username: 'reception', password: 'recep123',  role: 'Reception', nameEn: 'Maryam Al-Balushi', nameAr: 'مريم البلوشي',  initials: 'MB' },
  { username: 'viewer',    password: 'view123',   role: 'Viewer',    nameEn: 'Tariq Al-Amri',     nameAr: 'طارق العامري',  initials: 'TA' },
];

const ROLE_COLORS: Record<string, string> = {
  Admin: '#D4A84B', Reception: '#4ADE80', Viewer: '#9CA3AF',
};

export default function HospitalityLoginPage() {
  const navigate = useNavigate();
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isAr = lang === 'ar';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const user = USERS.find(u => u.username === username && u.password === password);
      if (user) {
        sessionStorage.setItem('hosp_user', JSON.stringify(user));
        navigate('/hospitality/app');
      } else {
        setError(isAr ? 'اسم المستخدم أو كلمة المرور غير صحيحة' : 'Invalid username or password');
      }
      setLoading(false);
    }, 900);
  };

  return (
    <div
      className="min-h-screen flex overflow-hidden"
      style={{ background: '#0B1220', fontFamily: "'Inter', sans-serif" }}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Grid texture */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(181,142,60,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(181,142,60,0.035) 1px, transparent 1px)
          `,
          backgroundSize: '44px 44px',
        }}
      />

      {/* Left panel — branding */}
      <div
        className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 relative z-10 p-10 border-r border-gold-500/10"
        style={{ background: 'rgba(20,29,46,0.6)' }}
      >
        {/* Top glow */}
        <div
          className="absolute top-0 left-0 right-0 h-1 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent, #D4A84B, transparent)' }}
        />

        <div>
          {/* Emblem */}
          <div className="flex items-center gap-4 mb-10">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center border-2 border-gold-500/30 shrink-0"
              style={{ background: 'rgba(181,142,60,0.08)' }}
            >
              <i className="ri-shield-star-fill text-gold-400 text-3xl" />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-tight">Al-Ameen</p>
              <p className="text-gold-400/80 text-sm" style={{ fontFamily: 'serif' }}>الأمين</p>
              <p className="text-gray-500 text-xs mt-0.5">National Police · iBorders</p>
            </div>
          </div>

          {/* Product name */}
          <div className="mb-8">
            <h1 className="text-white font-bold text-3xl leading-tight mb-1">
              Al-Ameen<br />
              <span className="text-gold-400">Hospitality</span>
            </h1>
            <p className="text-gold-400/60 text-xl" style={{ fontFamily: 'serif' }}>الأمين للضيافة</p>
            <p className="text-gray-500 text-sm mt-3 leading-relaxed">
              {isAr
                ? 'نظام إدارة الفنادق المتكامل — مقدم مجاناً من الشرطة الوطنية للفنادق المسجلة في برنامج أمين.'
                : 'Integrated Hotel Management System — provided free by National Police to all AMEEN-registered properties.'}
            </p>
          </div>

          {/* Feature pills */}
          <div className="space-y-2.5">
            {[
              { icon: 'ri-scan-line',        en: 'Passport & ID Scanner Integration',  ar: 'تكامل ماسح جوازات السفر والهويات' },
              { icon: 'ri-cloud-line',        en: 'Auto-sync to AMEEN Platform',        ar: 'مزامنة تلقائية مع منصة أمين' },
              { icon: 'ri-wifi-off-line',     en: 'Full Offline Mode',                  ar: 'وضع عدم الاتصال الكامل' },
              { icon: 'ri-translate-2',       en: 'Bilingual EN / AR',                  ar: 'ثنائي اللغة عربي / إنجليزي' },
              { icon: 'ri-hotel-line',        en: 'Complete PMS for 1-2 Star Hotels',   ar: 'نظام إدارة متكامل للفنادق الصغيرة' },
            ].map(f => (
              <div key={f.icon} className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(181,142,60,0.1)' }}
                >
                  <i className={`${f.icon} text-gold-400`} style={{ fontSize: 13 }} />
                </div>
                <span className="text-gray-400 text-sm">{isAr ? f.ar : f.en}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div>
          <div className="h-px bg-gold-500/10 mb-4" />
          <p className="text-gray-600 text-xs">
            {isAr ? 'إصدار' : 'Version'} 2.4.1 · {isAr ? 'جميع الحقوق محفوظة' : 'All rights reserved'} © 2025
          </p>
          <p className="text-gray-700 text-xs mt-0.5">National Police — National Intelligence Platform</p>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center relative z-10 p-6">
        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 50% 60% at 60% 50%, rgba(181,142,60,0.05) 0%, transparent 70%)' }}
        />

        {/* Lang toggle */}
        <button
          onClick={() => setLang(l => l === 'en' ? 'ar' : 'en')}
          className="absolute top-5 right-5 px-3 py-1.5 rounded-lg border border-gold-500/25 text-gold-400 text-xs cursor-pointer hover:bg-gold-500/10 transition-colors whitespace-nowrap z-10"
          style={{ background: 'rgba(20,29,46,0.8)' }}
        >
          {isAr ? 'English' : 'عربي'}
        </button>

        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center border border-gold-500/30"
              style={{ background: 'rgba(181,142,60,0.08)' }}
            >
              <i className="ri-shield-star-fill text-gold-400 text-xl" />
            </div>
            <div>
              <p className="text-gold-400 font-bold text-lg">Al-Ameen Hospitality</p>
              <p className="text-gold-400/60 text-sm" style={{ fontFamily: 'serif' }}>الأمين للضيافة</p>
            </div>
          </div>

          {/* Card */}
          <div
            className="rounded-2xl border border-gold-500/20 p-8 relative"
            style={{
              background: 'rgba(20,29,46,0.92)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 0 60px rgba(181,142,60,0.07), 0 0 120px rgba(181,142,60,0.03)',
            }}
          >
            {/* Top accent line */}
            <div
              className="absolute top-0 left-8 right-8 h-0.5 rounded-full"
              style={{ background: 'linear-gradient(90deg, transparent, #D4A84B, transparent)' }}
            />

            <div className="mb-6">
              <h2 className="text-white font-bold text-xl mb-0.5">
                {isAr ? 'تسجيل الدخول' : 'Sign In'}
              </h2>
              <p className="text-gray-500 text-sm">
                {isAr ? 'أدخل بيانات الدخول الخاصة بك' : 'Enter your credentials to continue'}
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-gray-400 text-xs mb-1.5 uppercase tracking-wider">
                  {isAr ? 'اسم المستخدم' : 'Username'}
                </label>
                <div className="relative">
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center ${isAr ? 'right-3' : 'left-3'}`}
                  >
                    <i className="ri-user-3-line text-gray-500 text-sm" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder={isAr ? 'أدخل اسم المستخدم' : 'Enter username'}
                    className="w-full rounded-xl border border-gold-500/20 bg-transparent text-white text-sm py-3 focus:outline-none focus:border-gold-500/50 placeholder-gray-600 transition-colors"
                    style={{ paddingLeft: isAr ? 12 : 38, paddingRight: isAr ? 38 : 12 }}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-400 text-xs mb-1.5 uppercase tracking-wider">
                  {isAr ? 'كلمة المرور' : 'Password'}
                </label>
                <div className="relative">
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center ${isAr ? 'right-3' : 'left-3'}`}
                  >
                    <i className="ri-lock-password-line text-gray-500 text-sm" />
                  </div>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder={isAr ? 'أدخل كلمة المرور' : 'Enter password'}
                    className="w-full rounded-xl border border-gold-500/20 bg-transparent text-white text-sm py-3 focus:outline-none focus:border-gold-500/50 placeholder-gray-600 transition-colors"
                    style={{ paddingLeft: isAr ? 38 : 38, paddingRight: isAr ? 38 : 38 }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(s => !s)}
                    className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-500 hover:text-gray-300 cursor-pointer ${isAr ? 'left-3' : 'right-3'}`}
                  >
                    <i className={`${showPass ? 'ri-eye-off-line' : 'ri-eye-line'} text-sm`} />
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs"
                  style={{ background: 'rgba(248,113,113,0.1)', color: '#F87171', border: '1px solid rgba(248,113,113,0.2)' }}
                >
                  <i className="ri-error-warning-line text-sm shrink-0" />
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer whitespace-nowrap mt-1"
                style={{
                  background: loading ? 'rgba(181,142,60,0.5)' : '#D4A84B',
                  color: '#0B1220',
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="ri-loader-4-line animate-spin" />
                    {isAr ? 'جارٍ تسجيل الدخول...' : 'Signing in...'}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <i className="ri-login-box-line" />
                    {isAr ? 'تسجيل الدخول' : 'Sign In'}
                  </span>
                )}
              </button>
            </form>

            {/* Role selector hint */}
            <div
              className="mt-5 rounded-xl p-3 border border-gold-500/10"
              style={{ background: 'rgba(181,142,60,0.03)' }}
            >
              <p className="text-gray-600 text-xs mb-2 uppercase tracking-wider">{isAr ? 'بيانات تجريبية' : 'Demo Credentials'}</p>
              <div className="space-y-1.5">
                {USERS.map(u => (
                  <button
                    key={u.username}
                    onClick={() => { setUsername(u.username); setPassword(u.password); }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-gold-500/5 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: `${ROLE_COLORS[u.role]}20`, color: ROLE_COLORS[u.role] }}
                      >
                        {u.initials[0]}
                      </div>
                      <span className="text-gray-400 text-xs font-mono group-hover:text-gray-300 transition-colors">{u.username}</span>
                    </div>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{ background: `${ROLE_COLORS[u.role]}15`, color: ROLE_COLORS[u.role] }}
                    >
                      {u.role}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom accent */}
            <div
              className="absolute bottom-0 left-8 right-8 h-0.5 rounded-full"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(181,142,60,0.3), transparent)' }}
            />
          </div>

          <p className="text-center text-gray-700 text-xs mt-4">
            {isAr ? 'مقدم من' : 'Provided by'}{' '}
            <span className="text-gold-600/60">National Police — iBorders</span>
            {' · '}v2.4.1
          </p>
        </div>
      </div>
    </div>
  );
}
