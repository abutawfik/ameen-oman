import { useState, useEffect } from 'react';
import { livePatternStats, alertQueue } from '@/mocks/predictiveAnalyticsData';
import PatternHeatmap from './components/PatternHeatmap';
import TrendCharts from './components/TrendCharts';
import TopRulesTable from './components/TopRulesTable';
import AlertQueue from './components/AlertQueue';
import MobilePushPanel from './components/MobilePushPanel';
import EscalationTimeline from './components/EscalationTimeline';

type Tab = 'analytics' | 'workflow';
type WorkflowTab = 'queue' | 'mobile' | 'escalation';

const DATE_RANGES = ['Last 24h', 'Last 7d', 'Last 30d', 'Custom'];

const PRIORITY_FILTERS = [
  { key: 'all',      label: 'All',      color: '#9CA3AF' },
  { key: 'critical', label: 'Critical', color: '#F87171' },
  { key: 'high',     label: 'High',     color: '#FB923C' },
  { key: 'medium',   label: 'Medium',   color: '#FACC15' },
  { key: 'low',      label: 'Low',      color: '#22D3EE' },
];

const STATUS_FILTERS = [
  { key: 'all',       label: 'All Status' },
  { key: 'open',      label: 'Open' },
  { key: 'assigned',  label: 'Assigned' },
  { key: 'escalated', label: 'Escalated' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'dismissed', label: 'Dismissed' },
];

export default function PredictiveAnalyticsPage() {
  const [tab, setTab] = useState<Tab>('analytics');
  const [workflowTab, setWorkflowTab] = useState<WorkflowTab>('queue');
  const [dateRange, setDateRange] = useState('Last 7d');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState(livePatternStats);
  const [lang, setLang] = useState<'en' | 'ar'>('en');

  const openAlerts = alertQueue.filter(a => a.status === 'open' || a.status === 'assigned').length;
  const criticalAlerts = alertQueue.filter(a => a.priority === 'critical').length;
  const tier2Alerts = alertQueue.filter(a => a.tier === 2 || a.score > 75).length;
  const tier3Alerts = alertQueue.filter(a => a.tier === 3).length;

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        triggeredToday: prev.triggeredToday + (Math.random() > 0.7 ? 1 : 0),
        uniquePersonsFlagged: prev.uniquePersonsFlagged + (Math.random() > 0.85 ? 1 : 0),
      }));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="min-h-screen relative"
      style={{ background: '#060D1A', fontFamily: "'Inter', sans-serif" }}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Grid texture */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34,211,238,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,211,238,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Classification banner */}
      <div className="relative z-10 bg-red-700 text-white text-center py-1.5 text-xs font-bold tracking-widest uppercase">
        RESTRICTED — Authorized Personnel Only &nbsp;·&nbsp; مقيد — للأفراد المصرح لهم فقط
      </div>

      <div className="relative z-10 px-6 py-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(34,211,238,0.15)', border: '1px solid rgba(34,211,238,0.3)' }}
              >
                <i className="ri-brain-line text-cyan-400 text-lg" />
              </div>
              <div>
                <h1 className="text-white font-bold text-xl leading-none">
                  {lang === 'en' ? 'Al-Ameen Predictive Intelligence' : 'الاستخبارات التنبؤية للأمين'}
                </h1>
                <p className="text-cyan-400 text-xs mt-0.5 font-mono">
                  {lang === 'en' ? 'Pattern Detection Engine & Alert Workflow' : 'محرك اكتشاف الأنماط وسير عمل التنبيهات'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Date range */}
            <div className="flex items-center gap-1 p-1 rounded-lg border border-cyan-500/20" style={{ background: 'rgba(10,22,40,0.8)' }}>
              {DATE_RANGES.map(r => (
                <button
                  key={r}
                  onClick={() => setDateRange(r)}
                  className="px-3 py-1.5 rounded-md text-xs transition-all cursor-pointer whitespace-nowrap"
                  style={{
                    background: dateRange === r ? '#22D3EE' : 'transparent',
                    color: dateRange === r ? '#060D1A' : '#9CA3AF',
                    fontWeight: dateRange === r ? 600 : 400,
                  }}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Lang toggle */}
            <button
              onClick={() => setLang(l => l === 'en' ? 'ar' : 'en')}
              className="px-3 py-1.5 rounded-lg border border-cyan-500/20 text-cyan-400 text-xs cursor-pointer hover:bg-cyan-500/10 transition-colors whitespace-nowrap"
              style={{ background: 'rgba(10,22,40,0.8)' }}
            >
              {lang === 'en' ? 'عربي' : 'EN'}
            </button>

            {/* Alert badge */}
            {openAlerts > 0 && (
              <button
                onClick={() => { setTab('workflow'); setWorkflowTab('queue'); }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-500/40 cursor-pointer hover:bg-red-500/10 transition-colors whitespace-nowrap"
                style={{ background: 'rgba(248,113,113,0.1)' }}
              >
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                <span className="text-red-400 text-xs font-semibold">{openAlerts} Open Alerts</span>
              </button>
            )}
          </div>
        </div>

        {/* Live stats row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          {[
            {
              label: lang === 'en' ? 'Active Rules' : 'القواعد النشطة',
              value: `${stats.activeRules} / ${stats.totalRules}`,
              sub: `${stats.totalRules - stats.activeRules} disabled`,
              icon: 'ri-git-branch-line',
              color: '#22D3EE',
            },
            {
              label: lang === 'en' ? 'Triggered Today' : 'مُفعَّلة اليوم',
              value: stats.triggeredToday,
              sub: `+${stats.triggeredTrendPct}% vs yesterday`,
              icon: 'ri-flashlight-line',
              color: '#4ADE80',
              trend: 'up',
            },
            {
              label: lang === 'en' ? 'Persons Flagged' : 'أشخاص مُبلَّغون',
              value: stats.uniquePersonsFlagged,
              sub: `${criticalAlerts} critical`,
              icon: 'ri-user-unfollow-line',
              color: '#F87171',
            },
            {
              label: lang === 'en' ? 'Avg Time to Action' : 'متوسط وقت الاستجابة',
              value: `${stats.avgTimeToAction}m`,
              sub: 'Target: <30 min',
              icon: 'ri-time-line',
              color: stats.avgTimeToAction < 30 ? '#4ADE80' : '#FACC15',
            },
            {
              label: lang === 'en' ? 'False Positive Rate' : 'معدل الإيجابيات الكاذبة',
              value: `${stats.falsePositiveRate}%`,
              sub: 'Based on dismissals',
              icon: 'ri-percent-line',
              color: stats.falsePositiveRate < 20 ? '#4ADE80' : '#FB923C',
            },
          ].map(stat => (
            <div
              key={stat.label}
              className="rounded-xl border border-cyan-500/15 p-4"
              style={{ background: 'rgba(10,22,40,0.8)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: `${stat.color}20` }}
                >
                  <i className={`${stat.icon} text-sm`} style={{ color: stat.color }} />
                </div>
                {stat.trend && (
                  <i className="ri-arrow-up-line text-green-400 text-xs" />
                )}
              </div>
              <p
                className="font-mono font-bold text-xl leading-none mb-1"
                style={{ color: stat.color }}
              >
                {stat.value}
              </p>
              <p className="text-gray-400 text-xs leading-tight">{stat.label}</p>
              <p className="text-gray-600 text-xs mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Tier status strip */}
        <div
          className="rounded-xl border border-cyan-500/15 p-4 mb-5 flex items-center gap-6 flex-wrap"
          style={{ background: 'rgba(10,22,40,0.8)' }}
        >
          <div className="flex items-center gap-2">
            <i className="ri-shield-line text-cyan-400 text-sm" />
            <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">Alert Workflow Status</span>
          </div>
          {[
            { tier: 1, label: 'Tier 1 — Queue', count: openAlerts, color: '#22D3EE', icon: 'ri-list-check-2' },
            { tier: 2, label: 'Tier 2 — Mobile Push', count: tier2Alerts, color: '#FB923C', icon: 'ri-smartphone-line' },
            { tier: 3, label: 'Tier 3 — Escalated', count: tier3Alerts, color: '#F87171', icon: 'ri-alarm-warning-line' },
          ].map((t, i) => (
            <div key={t.tier} className="flex items-center gap-4">
              {i > 0 && <i className="ri-arrow-right-line text-gray-700 text-sm" />}
              <button
                onClick={() => { setTab('workflow'); setWorkflowTab(t.tier === 1 ? 'queue' : t.tier === 2 ? 'mobile' : 'escalation'); }}
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: `${t.color}20` }}
                >
                  <i className={`${t.icon} text-xs`} style={{ color: t.color }} />
                </div>
                <div>
                  <p className="font-mono font-bold text-sm leading-none" style={{ color: t.color }}>{t.count}</p>
                  <p className="text-gray-500 text-xs">{t.label}</p>
                </div>
              </button>
            </div>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-medium">Engine Active</span>
            <span className="text-gray-600 text-xs font-mono">· Refresh: 30s</span>
          </div>
        </div>

        {/* Main tabs */}
        <div className="flex items-center gap-1 mb-5 p-1 rounded-xl border border-cyan-500/15 w-fit" style={{ background: 'rgba(10,22,40,0.8)' }}>
          {[
            { key: 'analytics', label: lang === 'en' ? 'Analytics Dashboard' : 'لوحة التحليلات', icon: 'ri-bar-chart-2-line' },
            { key: 'workflow',  label: lang === 'en' ? 'Alert Workflow' : 'سير عمل التنبيهات', icon: 'ri-flow-chart', badge: openAlerts },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as Tab)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap"
              style={{
                background: tab === t.key ? '#22D3EE' : 'transparent',
                color: tab === t.key ? '#060D1A' : '#9CA3AF',
              }}
            >
              <i className={`${t.icon} text-sm`} />
              {t.label}
              {t.badge ? (
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    background: tab === t.key ? '#060D1A' : '#F87171',
                    color: tab === t.key ? '#22D3EE' : '#fff',
                  }}
                >
                  {t.badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {/* Analytics Dashboard */}
        {tab === 'analytics' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              <PatternHeatmap />
              <TrendCharts />
            </div>
            <TopRulesTable />
          </div>
        )}

        {/* Alert Workflow */}
        {tab === 'workflow' && (
          <div>
            {/* Workflow sub-tabs */}
            <div className="flex items-center gap-1 mb-5 p-1 rounded-xl border border-cyan-500/15 w-fit" style={{ background: 'rgba(10,22,40,0.8)' }}>
              {[
                { key: 'queue',      label: lang === 'en' ? 'Tier 1 — Queue' : 'المستوى 1 — القائمة',       icon: 'ri-list-check-2',       badge: openAlerts },
                { key: 'mobile',     label: lang === 'en' ? 'Tier 2 — Mobile Push' : 'المستوى 2 — الجوال',  icon: 'ri-smartphone-line',    badge: tier2Alerts },
                { key: 'escalation', label: lang === 'en' ? 'Tier 3 — Escalation' : 'المستوى 3 — التصعيد', icon: 'ri-alarm-warning-line', badge: tier3Alerts },
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => setWorkflowTab(t.key as WorkflowTab)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap"
                  style={{
                    background: workflowTab === t.key ? '#22D3EE' : 'transparent',
                    color: workflowTab === t.key ? '#060D1A' : '#9CA3AF',
                  }}
                >
                  <i className={`${t.icon} text-sm`} />
                  {t.label}
                  {t.badge > 0 && (
                    <span
                      className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{
                        background: workflowTab === t.key ? '#060D1A' : (t.key === 'escalation' ? '#F87171' : '#FB923C'),
                        color: workflowTab === t.key ? '#22D3EE' : '#fff',
                      }}
                    >
                      {t.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Queue filters */}
            {workflowTab === 'queue' && (
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <div className="flex items-center gap-1">
                  {PRIORITY_FILTERS.map(f => (
                    <button
                      key={f.key}
                      onClick={() => setPriorityFilter(f.key)}
                      className="px-3 py-1.5 rounded-md text-xs border transition-all cursor-pointer whitespace-nowrap"
                      style={{
                        borderColor: priorityFilter === f.key ? f.color : 'rgba(34,211,238,0.15)',
                        background: priorityFilter === f.key ? `${f.color}20` : 'transparent',
                        color: priorityFilter === f.key ? f.color : '#9CA3AF',
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1 ml-auto flex-wrap">
                  {STATUS_FILTERS.map(f => (
                    <button
                      key={f.key}
                      onClick={() => setStatusFilter(f.key)}
                      className="px-2.5 py-1.5 rounded-md text-xs border transition-all cursor-pointer whitespace-nowrap"
                      style={{
                        borderColor: statusFilter === f.key ? '#22D3EE' : 'rgba(34,211,238,0.15)',
                        background: statusFilter === f.key ? 'rgba(34,211,238,0.1)' : 'transparent',
                        color: statusFilter === f.key ? '#22D3EE' : '#9CA3AF',
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {workflowTab === 'queue' && (
              <AlertQueue filterPriority={priorityFilter} filterStatus={statusFilter} />
            )}
            {workflowTab === 'mobile' && <MobilePushPanel />}
            {workflowTab === 'escalation' && <EscalationTimeline />}
          </div>
        )}
      </div>
    </div>
  );
}
