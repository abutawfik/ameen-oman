import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { DashboardOutletContext } from '../DashboardLayout';
import WatchlistDashboard from './components/WatchlistDashboard';
import WatchlistManager from './components/WatchlistManager';
import TargetDetail from './components/TargetDetail';
import AlertBehavior from './components/AlertBehavior';
import WatchlistAnalytics from './components/WatchlistAnalytics';
import ImportExport from './components/ImportExport';

type Tab = 'dashboard' | 'manage' | 'target' | 'alerts' | 'analytics' | 'import';

const tabs = [
  { key: 'dashboard', label: 'Overview', labelAr: 'نظرة عامة', icon: 'ri-dashboard-line' },
  { key: 'manage', label: 'Manage Watchlists', labelAr: 'إدارة القوائم', icon: 'ri-list-check-2' },
  { key: 'alerts', label: 'Alert Behavior', labelAr: 'سلوك التنبيهات', icon: 'ri-alarm-warning-line' },
  { key: 'analytics', label: 'Analytics', labelAr: 'التحليلات', icon: 'ri-bar-chart-2-line' },
  { key: 'import', label: 'Import / Export', labelAr: 'استيراد / تصدير', icon: 'ri-upload-2-line' },
] as const;

const WatchlistPage = () => {
  const { isAr } = useOutletContext<DashboardOutletContext>();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [selectedWatchlistId, setSelectedWatchlistId] = useState<string | null>(null);
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [liveAlerts, setLiveAlerts] = useState(3);

  // Simulate live alert counter
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveAlerts(prev => prev + (Math.random() > 0.7 ? 1 : 0));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectWatchlist = (id: string) => {
    setSelectedWatchlistId(id);
    setActiveTab('manage');
  };

  const handleSelectTarget = (id: string) => {
    setSelectedTargetId(id);
    setActiveTab('target');
  };

  const handleBackFromTarget = () => {
    setSelectedTargetId(null);
    setActiveTab('manage');
  };

  return (
    <div className="flex flex-col h-full" style={{ background: '#051428' }}>
      {/* Grid texture */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(184,138,60,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(184,138,60,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Page header */}
        <div className="flex-shrink-0 px-6 pt-5 pb-4 border-b"
          style={{ borderColor: 'rgba(184,138,60,0.08)' }}>
          <div className="flex items-center justify-between mb-4" data-narrate-id="watchlist-header-kpis">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 flex items-center justify-center rounded-xl"
                  style={{ background: 'rgba(201,74,94,0.15)' }}>
                  <i className="ri-eye-line text-red-400 text-base" />
                </div>
                <h1 className="text-white font-black font-['Inter'] text-xl tracking-tight">
                  {isAr ? 'إدارة قوائم المراقبة والأهداف' : 'Watchlist & Target Management'}
                </h1>
              </div>
              <p className="text-gray-400 text-sm font-['Inter'] ml-11">
                {isAr
                  ? 'مراقبة استباقية للأشخاص المعروفين عبر 14 تدفقاً للبيانات'
                  : 'Proactive monitoring of known persons of interest across 14 data streams'}
              </p>
            </div>

            {/* Live alert badge */}
            {liveAlerts > 0 && (
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl animate-pulse"
                style={{ background: 'rgba(201,74,94,0.1)', border: '1px solid rgba(201,74,94,0.3)' }}>
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <span className="text-red-400 font-bold font-['JetBrains_Mono'] text-sm">
                  {liveAlerts} {isAr ? 'تنبيهات جديدة' : 'NEW ALERTS'}
                </span>
                <button onClick={() => { setActiveTab('alerts'); setLiveAlerts(0); }}
                  className="text-xs font-['Inter'] cursor-pointer underline text-red-300">
                  {isAr ? 'عرض' : 'View'}
                </button>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1">
            {tabs.map(tab => (
              <button key={tab.key}
                onClick={() => setActiveTab(tab.key as Tab)}
                data-narrate-id={
                  tab.key === 'manage'
                    ? 'watchlist-target-list'
                    : tab.key === 'import'
                    ? 'watchlist-import-export'
                    : undefined
                }
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold font-['Inter'] whitespace-nowrap cursor-pointer transition-all"
                style={{
                  background: activeTab === tab.key ? '#D6B47E' : 'rgba(10,37,64,0.6)',
                  color: activeTab === tab.key ? '#051428' : '#9CA3AF',
                  border: activeTab === tab.key ? 'none' : '1px solid rgba(184,138,60,0.08)',
                }}>
                <i className={`${tab.icon} text-sm`} />
                {isAr ? tab.labelAr : tab.label}
              </button>
            ))}
            {activeTab === 'target' && (
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold font-['Inter'] whitespace-nowrap cursor-pointer"
                style={{ background: '#D6B47E', color: '#051428' }}>
                <i className="ri-user-search-line text-sm" />
                {isAr ? 'تفاصيل الهدف' : 'Target Detail'}
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6" data-narrate-id="watchlist-empty-state">
          {activeTab === 'dashboard' && (
            <WatchlistDashboard
              isAr={isAr}
              onSelectWatchlist={handleSelectWatchlist}
              onCreateNew={() => setActiveTab('manage')}
            />
          )}
          {activeTab === 'manage' && (
            <WatchlistManager
              isAr={isAr}
              selectedWatchlistId={selectedWatchlistId}
              onSelectTarget={handleSelectTarget}
            />
          )}
          {activeTab === 'target' && (
            <TargetDetail
              isAr={isAr}
              targetId={selectedTargetId}
              onBack={handleBackFromTarget}
            />
          )}
          {activeTab === 'alerts' && (
            <AlertBehavior isAr={isAr} />
          )}
          {activeTab === 'analytics' && (
            <WatchlistAnalytics isAr={isAr} />
          )}
          {activeTab === 'import' && (
            <ImportExport isAr={isAr} />
          )}
        </div>
      </div>
    </div>
  );
};

export default WatchlistPage;
