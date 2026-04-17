import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { DashboardOutletContext } from '../DashboardLayout';
import { mergeCandidates, personRecords, matchingRules } from '@/mocks/identityFusionData';
import FusionDashboard from './components/FusionDashboard';
import CandidateReviewQueue from './components/CandidateReviewQueue';
import IdentityGraph from './components/IdentityGraph';
import AliasManagement from './components/AliasManagement';
import FusionStatistics from './components/FusionStatistics';

type Tab = 'dashboard' | 'queue' | 'graph' | 'aliases' | 'statistics';

const kpiStats = [
  {
    labelEn: 'Total Persons Resolved',
    labelAr: 'إجمالي الأشخاص المحلولين',
    value: '284,912',
    delta: '+1,247 today',
    deltaAr: '+1,247 اليوم',
    color: '#22D3EE',
    icon: 'ri-user-follow-line',
  },
  {
    labelEn: 'Merge Candidates Today',
    labelAr: 'مرشحو الدمج اليوم',
    value: '184',
    delta: '+23 new',
    deltaAr: '+23 جديد',
    color: '#FACC15',
    icon: 'ri-user-2-line',
  },
  {
    labelEn: 'Auto-Merged',
    labelAr: 'دمج تلقائي',
    value: '127',
    delta: '69% of candidates',
    deltaAr: '69% من المرشحين',
    color: '#4ADE80',
    icon: 'ri-merge-cells-horizontal',
  },
  {
    labelEn: 'Manual Review Queue',
    labelAr: 'قائمة المراجعة اليدوية',
    value: String(mergeCandidates.filter(c => c.status === 'pending').length),
    delta: 'Awaiting analyst',
    deltaAr: 'بانتظار المحلل',
    color: '#FB923C',
    icon: 'ri-time-line',
  },
  {
    labelEn: 'Confidence Score Avg',
    labelAr: 'متوسط درجة الثقة',
    value: '87.4%',
    delta: '+2.1% vs last week',
    deltaAr: '+2.1% مقارنة بالأسبوع الماضي',
    color: '#A78BFA',
    icon: 'ri-bar-chart-grouped-line',
  },
];

const tabs: { key: Tab; labelEn: string; labelAr: string; icon: string }[] = [
  { key: 'dashboard', labelEn: 'Matching Rules',    labelAr: 'قواعد المطابقة',    icon: 'ri-settings-3-line' },
  { key: 'queue',     labelEn: 'Review Queue',      labelAr: 'قائمة المراجعة',    icon: 'ri-list-check-2' },
  { key: 'graph',     labelEn: 'Identity Graph',    labelAr: 'رسم الهوية',        icon: 'ri-share-circle-line' },
  { key: 'aliases',   labelEn: 'Alias Management',  labelAr: 'إدارة الأسماء',     icon: 'ri-user-2-line' },
  { key: 'statistics',labelEn: 'Statistics',        labelAr: 'الإحصائيات',        icon: 'ri-bar-chart-2-line' },
];

export default function IdentityFusionPage() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const { isAr } = useOutletContext<DashboardOutletContext>();

  const pendingCount = mergeCandidates.filter(c => c.status === 'pending').length;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#060D1A', fontFamily: "'Inter', sans-serif" }}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Grid texture */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-15"
        style={{
          backgroundImage: 'linear-gradient(rgba(34,211,238,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.12) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Header */}
      <div
        className="relative z-10 border-b border-cyan-500/15 px-6 py-5"
        style={{ background: 'rgba(6,13,26,0.98)' }}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)' }}
              >
                <i className="ri-fingerprint-line text-cyan-400 text-xl" />
              </div>
              <div>
                <h1 className="text-cyan-400 font-black text-2xl tracking-wide font-['Inter']">
                  {isAr ? 'مركز دمج الهويات' : 'Identity Fusion Center'}
                </h1>
                <p className="text-gray-500 text-xs font-['JetBrains_Mono'] mt-0.5">
                  {isAr
                    ? 'محرك تحليل وحل الهويات عبر 14 تيار بيانات'
                    : 'Entity Resolution & Identity Fusion Engine — 14 Data Streams'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Engine status */}
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-green-500/25"
              style={{ background: 'rgba(74,222,128,0.05)' }}
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-xs font-['JetBrains_Mono']">
                {isAr ? 'المحرك: نشط' : 'Engine: Active'}
              </span>
            </div>
            {/* Active rules */}
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-cyan-500/20"
              style={{ background: 'rgba(34,211,238,0.04)' }}
            >
              <i className="ri-git-branch-line text-cyan-400 text-xs" />
              <span className="text-cyan-400 text-xs font-['JetBrains_Mono']">
                {matchingRules.filter(r => r.enabled).length} {isAr ? 'قواعد نشطة' : 'active rules'}
              </span>
            </div>
          </div>
        </div>

        {/* KPI stats row */}
        <div className="grid grid-cols-5 gap-3 mt-5">
          {kpiStats.map(kpi => (
            <div
              key={kpi.labelEn}
              className="rounded-xl border p-3 flex items-center gap-3"
              style={{ background: 'rgba(10,22,40,0.7)', borderColor: `${kpi.color}18` }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${kpi.color}12` }}
              >
                <i className={`${kpi.icon} text-base`} style={{ color: kpi.color }} />
              </div>
              <div className="min-w-0">
                <p className="font-mono font-black text-xl leading-none" style={{ color: kpi.color }}>
                  {kpi.value}
                </p>
                <p className="text-gray-500 text-xs mt-0.5 font-['Inter'] truncate">
                  {isAr ? kpi.labelAr : kpi.labelEn}
                </p>
                <p className="text-gray-600 text-xs font-['JetBrains_Mono'] truncate">
                  {isAr ? kpi.deltaAr : kpi.delta}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab bar */}
      <div
        className="relative z-10 flex items-center gap-1 px-6 border-b border-cyan-500/10"
        style={{ background: 'rgba(6,13,26,0.95)' }}
      >
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="relative flex items-center gap-2 px-4 py-3.5 text-sm font-medium cursor-pointer transition-all whitespace-nowrap font-['Inter']"
            style={{ color: activeTab === tab.key ? '#22D3EE' : '#6B7280' }}
          >
            <i className={`${tab.icon} text-sm`} />
            {isAr ? tab.labelAr : tab.labelEn}
            {tab.key === 'queue' && pendingCount > 0 && (
              <span
                className="px-1.5 py-0.5 rounded-full text-xs font-mono"
                style={{ background: 'rgba(251,146,60,0.15)', color: '#FB923C' }}
              >
                {pendingCount}
              </span>
            )}
            {activeTab === tab.key && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-cyan-400" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="relative z-10 flex-1 overflow-y-auto">
        {activeTab === 'dashboard'  && <FusionDashboard isAr={isAr} />}
        {activeTab === 'queue'      && <CandidateReviewQueue isAr={isAr} />}
        {activeTab === 'graph'      && <IdentityGraph isAr={isAr} />}
        {activeTab === 'aliases'    && <AliasManagement isAr={isAr} />}
        {activeTab === 'statistics' && <FusionStatistics isAr={isAr} />}
      </div>
    </div>
  );
}
