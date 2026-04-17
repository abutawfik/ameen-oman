import { useState, useEffect } from 'react';
import { hospitalityNavItems } from '@/mocks/hospitalityData';

interface Props {
  activeKey: string;
  onNav: (key: string) => void;
  lang: 'en' | 'ar';
  collapsed: boolean;
  isOffline: boolean;
  pendingSync: number;
}

const ROLE_COLORS: Record<string, string> = {
  Admin: '#D4A84B', Reception: '#4ADE80', Viewer: '#9CA3AF',
};

export default function HospitalitySidebar({ activeKey, onNav, lang, collapsed, isOffline, pendingSync }: Props) {
  const isAr = lang === 'ar';
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const user = (() => {
    try { return JSON.parse(sessionStorage.getItem('hosp_user') || '{}'); } catch { return {}; }
  })();

  const timeStr = time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = time.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' });

  const mainItems = hospitalityNavItems.filter(i => i.group === 'main');
  const systemItems = hospitalityNavItems.filter(i => i.group === 'system');

  const NavItem = ({ item }: { item: typeof hospitalityNavItems[0] }) => {
    const isActive = activeKey === item.key;
    return (
      <button
        key={item.key}
        onClick={() => onNav(item.key)}
        className="w-full flex items-center gap-3 px-3 py-2.5 transition-all cursor-pointer relative group"
        style={{
          background: isActive ? 'rgba(181,142,60,0.1)' : 'transparent',
          borderLeft: isAr ? 'none' : (isActive ? '2px solid #D4A84B' : '2px solid transparent'),
          borderRight: isAr ? (isActive ? '2px solid #D4A84B' : '2px solid transparent') : 'none',
        }}
        title={collapsed ? (isAr ? item.labelAr : item.labelEn) : undefined}
      >
        <div className="w-5 h-5 flex items-center justify-center shrink-0">
          <i className={`${item.icon} text-sm`} style={{ color: isActive ? '#D4A84B' : '#6B7280' }} />
        </div>
        {!collapsed && (
          <span className="text-xs font-medium truncate" style={{ color: isActive ? '#D4A84B' : '#9CA3AF' }}>
            {isAr ? item.labelAr : item.labelEn}
          </span>
        )}
        {/* Sync badge */}
        {item.key === 'sync' && pendingSync > 0 && !collapsed && (
          <span
            className="ml-auto text-xs px-1.5 py-0.5 rounded-full font-mono"
            style={{ background: 'rgba(250,204,21,0.15)', color: '#FACC15', fontSize: 10 }}
          >
            {pendingSync}
          </span>
        )}
        {item.key === 'sync' && pendingSync > 0 && collapsed && (
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: '#FACC15' }}
          />
        )}
      </button>
    );
  };

  return (
    <div
      className="flex flex-col h-full border-r border-gold-500/15 transition-all duration-300 shrink-0"
      style={{
        background: 'rgba(8,18,35,0.98)',
        width: collapsed ? 52 : 220,
        minWidth: collapsed ? 52 : 220,
        borderRight: isAr ? 'none' : undefined,
        borderLeft: isAr ? '1px solid rgba(181,142,60,0.15)' : undefined,
      }}
    >
      {/* User section */}
      <div className="px-3 pt-4 pb-3 border-b border-gold-500/10">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 border-2"
            style={{
              background: `${ROLE_COLORS[user.role] || '#9CA3AF'}18`,
              color: ROLE_COLORS[user.role] || '#9CA3AF',
              borderColor: `${ROLE_COLORS[user.role] || '#9CA3AF'}40`,
            }}
          >
            {user.initials || 'U'}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-white text-xs font-semibold truncate">{isAr ? user.nameAr : user.nameEn}</p>
              <span
                className="inline-block text-xs px-1.5 py-0.5 rounded mt-0.5 font-medium"
                style={{
                  background: `${ROLE_COLORS[user.role] || '#9CA3AF'}18`,
                  color: ROLE_COLORS[user.role] || '#9CA3AF',
                  fontSize: 10,
                }}
              >
                {user.role || 'User'}
              </span>
            </div>
          )}
        </div>

        {!collapsed && (
          <div className="mt-3 px-1">
            <p className="text-gold-400 font-mono text-xs tracking-wider">{timeStr}</p>
            <p className="text-gray-600 text-xs mt-0.5">{dateStr}</p>
          </div>
        )}
      </div>

      {/* Quick actions */}
      {!collapsed && (
        <div className="px-3 py-3 border-b border-gold-500/10">
          <p className="text-gray-600 text-xs uppercase tracking-widest mb-2" style={{ fontSize: 9 }}>
            {isAr ? 'إجراءات سريعة' : 'Quick Actions'}
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { key: 'checkin',     icon: 'ri-login-box-line',     color: '#4ADE80', en: 'Check-In',  ar: 'دخول' },
              { key: 'checkout',    icon: 'ri-logout-box-line',    color: '#FB923C', en: 'Check-Out', ar: 'خروج' },
              { key: 'new-booking', icon: 'ri-calendar-check-line',color: '#D4A84B', en: 'Booking',   ar: 'حجز' },
              { key: 'changeroom',  icon: 'ri-door-line',          color: '#FACC15', en: 'Change Rm', ar: 'تغيير' },
            ].map(a => (
              <button
                key={a.key}
                onClick={() => onNav(a.key)}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg cursor-pointer transition-all hover:opacity-90"
                style={{ background: `${a.color}12`, border: `1px solid ${a.color}25` }}
              >
                <i className={`${a.icon}`} style={{ color: a.color, fontSize: 11 }} />
                <span style={{ color: a.color, fontSize: 10 }} className="font-medium whitespace-nowrap">
                  {isAr ? a.ar : a.en}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto py-2">
        {!collapsed && (
          <p className="px-4 text-gray-700 text-xs uppercase tracking-widest mb-1" style={{ fontSize: 9 }}>
            {isAr ? 'القائمة الرئيسية' : 'Main Menu'}
          </p>
        )}
        {mainItems.map(item => <NavItem key={item.key} item={item} />)}

        {!collapsed && (
          <p className="px-4 text-gray-700 text-xs uppercase tracking-widest mt-3 mb-1" style={{ fontSize: 9 }}>
            {isAr ? 'النظام' : 'System'}
          </p>
        )}
        {collapsed && <div className="my-2 mx-3 h-px bg-gold-500/10" />}
        {systemItems.map(item => <NavItem key={item.key} item={item} />)}
      </div>

      {/* Status dots */}
      <div className="px-3 py-3 border-t border-gold-500/10 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full shrink-0 bg-green-400 animate-pulse" />
          {!collapsed && (
            <span className="text-gray-600 text-xs">
              {isAr ? 'الماسح: ' : 'Scanner: '}
              <span className="text-green-400">{isAr ? 'متصل' : 'Online'}</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full shrink-0"
            style={{ background: isOffline ? '#F87171' : '#4ADE80' }}
          />
          {!collapsed && (
            <span className="text-gray-600 text-xs">
              {isAr ? 'الشبكة: ' : 'Network: '}
              <span style={{ color: isOffline ? '#F87171' : '#4ADE80' }}>
                {isOffline ? (isAr ? 'غير متصل' : 'Offline') : (isAr ? 'متصل' : 'Online')}
              </span>
              {isOffline && pendingSync > 0 && (
                <span className="text-yellow-400 ml-1">({pendingSync})</span>
              )}
            </span>
          )}
        </div>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full shrink-0 bg-gold-400" />
            <span className="text-gray-600 text-xs">
              {isAr ? 'أمين: ' : 'Al-Ameen: '}
              <span className="text-gold-400">{isAr ? 'مزامنة' : 'Syncing'}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
