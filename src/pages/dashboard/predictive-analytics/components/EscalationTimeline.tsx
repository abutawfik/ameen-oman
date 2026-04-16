import { useState } from 'react';
import { alertQueue, feedbackStats } from '@/mocks/predictiveAnalyticsData';

const TIERS = [
  {
    tier: 1,
    label: 'Tier 1 — Dashboard Queue',
    icon: 'ri-dashboard-line',
    color: '#22D3EE',
    bg: 'rgba(34,211,238,0.1)',
    description: 'All pattern-triggered alerts land here. Analysts review and action within 30 minutes.',
    threshold: null,
    count: alertQueue.filter(a => a.tier === 1).length,
  },
  {
    tier: 2,
    label: 'Tier 2 — Mobile Push',
    icon: 'ri-smartphone-line',
    color: '#FB923C',
    bg: 'rgba(251,146,60,0.1)',
    description: 'Critical alerts (score >75) auto-push to field officers\' AMEEN Mobile app.',
    threshold: '>30 min unactioned',
    count: alertQueue.filter(a => a.tier === 2).length,
  },
  {
    tier: 3,
    label: 'Tier 3 — Command Escalation',
    icon: 'ri-alarm-warning-line',
    color: '#F87171',
    bg: 'rgba(248,113,113,0.1)',
    description: 'Unactioned alerts escalate through duty officer → supervisor → command.',
    threshold: '>120 min unactioned',
    count: alertQueue.filter(a => a.tier === 3).length,
  },
];

const ESCALATION_STEPS = [
  {
    time: '0 min',
    label: 'Alert Created',
    color: '#22D3EE',
    icon: 'ri-alert-line',
    desc: 'Pattern rule triggered, alert enters Tier 1 queue. Analyst notified.',
    action: 'Analyst reviews',
  },
  {
    time: 'T+30 min',
    label: 'Auto-Assign',
    color: '#FACC15',
    icon: 'ri-user-add-line',
    desc: 'Unactioned alert auto-assigned to duty officer. Amber status applied.',
    action: 'Duty officer assigned',
  },
  {
    time: 'T+60 min',
    label: 'Supervisor Escalation',
    color: '#FB923C',
    icon: 'ri-arrow-up-circle-line',
    desc: 'Amber banner raised. Supervisor notified via mobile push. SLA breach logged.',
    action: 'Supervisor notified',
  },
  {
    time: 'T+120 min',
    label: 'Command Escalation',
    color: '#F87171',
    icon: 'ri-alarm-warning-fill',
    desc: 'Red escalation — Command Center notified. Mandatory response required. Incident logged.',
    action: 'Command mandatory response',
  },
];

const ACTIVE_ESCALATIONS = alertQueue.filter(a => a.escalationLevel > 0);

export default function EscalationTimeline() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {/* 3-tier overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {TIERS.map((tier, i) => (
          <div
            key={tier.tier}
            className="rounded-xl border p-5 relative overflow-hidden"
            style={{ background: 'rgba(10,22,40,0.8)', borderColor: `${tier.color}30` }}
          >
            <div
              className="absolute top-0 left-0 w-1 h-full rounded-l-xl"
              style={{ background: tier.color }}
            />
            <div className="pl-2">
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ background: tier.bg }}
                >
                  <i className={`${tier.icon} text-base`} style={{ color: tier.color }} />
                </div>
                <span className="font-mono font-bold text-2xl" style={{ color: tier.color }}>
                  {tier.count}
                </span>
              </div>
              <h4 className="text-white font-semibold text-sm mb-1">{tier.label}</h4>
              <p className="text-gray-400 text-xs leading-relaxed mb-2">{tier.description}</p>
              {tier.threshold && (
                <div
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs"
                  style={{ background: `${tier.color}15`, color: tier.color }}
                >
                  <i className="ri-time-line text-xs" />
                  Triggers: {tier.threshold}
                </div>
              )}
              {i < 2 && (
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 hidden lg:block z-10">
                  <i className="ri-arrow-right-line text-gray-600 text-xl" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Active escalations */}
      {ACTIVE_ESCALATIONS.length > 0 && (
        <div
          className="rounded-xl border border-orange-500/25 p-5"
          style={{ background: 'rgba(10,22,40,0.8)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            <h3 className="text-white font-semibold text-sm">Active Escalations</h3>
            <span
              className="px-2 py-0.5 rounded-full text-xs font-bold"
              style={{ background: 'rgba(251,146,60,0.15)', color: '#FB923C' }}
            >
              {ACTIVE_ESCALATIONS.length}
            </span>
          </div>
          <div className="space-y-2">
            {ACTIVE_ESCALATIONS.map(alert => {
              const levelColors = ['', '#FACC15', '#FB923C', '#F87171'];
              const levelLabels = ['', 'Auto-Assigned', 'Supervisor', 'Command'];
              const color = levelColors[alert.escalationLevel];
              return (
                <div
                  key={alert.id}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg border"
                  style={{ background: `${color}08`, borderColor: `${color}30` }}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: `${color}20`, color }}
                  >
                    {alert.escalationLevel}
                  </div>
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: `${alert.photoColor}20`, color: alert.photoColor }}
                  >
                    {alert.photoInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-xs font-medium">{alert.personName}</span>
                      <span className="text-gray-500 text-xs font-mono">{alert.personDoc}</span>
                    </div>
                    <p className="text-gray-500 text-xs">{alert.ruleName} · {alert.minutesAgo} min ago</p>
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
                    style={{ background: `${color}15`, color }}
                  >
                    {levelLabels[alert.escalationLevel]}
                  </span>
                  <span
                    className="font-mono font-bold text-sm shrink-0"
                    style={{ color: alert.score >= 80 ? '#F87171' : '#FB923C' }}
                  >
                    {alert.score}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Escalation timeline */}
      <div
        className="rounded-xl border border-cyan-500/20 p-5"
        style={{ background: 'rgba(10,22,40,0.8)' }}
      >
        <h3 className="text-white font-semibold text-sm mb-5">Auto-Escalation Timeline</h3>
        <div className="relative">
          {/* Timeline line */}
          <div
            className="absolute left-6 top-6 bottom-6 w-0.5"
            style={{ background: 'linear-gradient(to bottom, #22D3EE, #FACC15, #FB923C, #F87171)' }}
          />

          <div className="space-y-5">
            {ESCALATION_STEPS.map((step, i) => (
              <div
                key={i}
                className="flex items-start gap-4 relative cursor-pointer"
                onClick={() => setActiveStep(activeStep === i ? null : i)}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 z-10 border-2 transition-all"
                  style={{
                    background: activeStep === i ? `${step.color}20` : 'rgba(10,22,40,0.95)',
                    borderColor: step.color,
                  }}
                >
                  <i className={`${step.icon} text-base`} style={{ color: step.color }} />
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span
                      className="font-mono font-bold text-xs px-2 py-0.5 rounded"
                      style={{ background: `${step.color}20`, color: step.color }}
                    >
                      {step.time}
                    </span>
                    <span className="text-white font-semibold text-sm">{step.label}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full border"
                      style={{ borderColor: `${step.color}30`, color: step.color, background: `${step.color}08` }}
                    >
                      {step.action}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback loop */}
      <div
        className="rounded-xl border border-cyan-500/20 p-5"
        style={{ background: 'rgba(10,22,40,0.8)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white font-semibold text-sm">Analyst Feedback Loop</h3>
            <p className="text-gray-400 text-xs mt-0.5">Every analyst decision improves rule effectiveness tracking</p>
          </div>
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{ background: 'rgba(74,222,128,0.15)', color: '#4ADE80', border: '1px solid rgba(74,222,128,0.2)' }}
          >
            <i className="ri-brain-line" />
            Model Accuracy: {feedbackStats.modelAccuracy}%
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Total Decisions', value: feedbackStats.totalDecisions.toLocaleString(), color: '#22D3EE', icon: 'ri-checkbox-multiple-line' },
            { label: 'Confirmed (TP)', value: `${feedbackStats.confirmed} (${feedbackStats.confirmedPct}%)`, color: '#4ADE80', icon: 'ri-check-double-line' },
            { label: 'Dismissed (FP)', value: `${feedbackStats.dismissed} (${feedbackStats.dismissedPct}%)`, color: '#9CA3AF', icon: 'ri-close-circle-line' },
            { label: 'Escalated', value: `${feedbackStats.escalated} (${feedbackStats.escalatedPct}%)`, color: '#FB923C', icon: 'ri-arrow-up-circle-line' },
          ].map(stat => (
            <div
              key={stat.label}
              className="rounded-lg p-3 border border-cyan-500/10"
              style={{ background: 'rgba(34,211,238,0.04)' }}
            >
              <div className="flex items-center gap-2 mb-1">
                <i className={`${stat.icon} text-sm`} style={{ color: stat.color }} />
                <span className="font-mono font-bold text-sm" style={{ color: stat.color }}>{stat.value}</span>
              </div>
              <p className="text-gray-500 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Decision breakdown bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
            <span>Decision Breakdown</span>
            <span className="font-mono">{feedbackStats.totalDecisions.toLocaleString()} total decisions</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden flex">
            <div className="h-full transition-all" style={{ width: `${feedbackStats.confirmedPct}%`, background: '#4ADE80' }} />
            <div className="h-full transition-all" style={{ width: `${feedbackStats.dismissedPct}%`, background: '#6B7280' }} />
            <div className="h-full transition-all" style={{ width: `${feedbackStats.escalatedPct}%`, background: '#FB923C' }} />
          </div>
          <div className="flex items-center gap-4 mt-1.5 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-400" />Confirmed TP</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gray-500" />Dismissed FP</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-400" />Escalated</span>
          </div>
        </div>

        {/* Weekly decisions sparkline */}
        <div className="mb-4">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Weekly Decision Volume</p>
          <div className="flex items-end gap-1.5 h-12">
            {feedbackStats.weeklyDecisions.map((val, i) => {
              const maxV = Math.max(...feedbackStats.weeklyDecisions);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                  <div
                    className="w-full rounded-t-sm"
                    style={{
                      height: `${(val / maxV) * 40}px`,
                      background: i === feedbackStats.weeklyDecisions.length - 1 ? '#22D3EE' : 'rgba(34,211,238,0.3)',
                    }}
                  />
                  <span className="text-gray-600 font-mono" style={{ fontSize: 8 }}>
                    {feedbackStats.weeklyLabels[i]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div
            className="rounded-lg p-3 border border-green-500/20"
            style={{ background: 'rgba(74,222,128,0.05)' }}
          >
            <p className="text-gray-500 mb-1">Top True Positive Rule</p>
            <p className="text-green-400 font-semibold">{feedbackStats.topTruePositiveRule}</p>
            <p className="text-gray-600 mt-0.5">94% TP rate — highest accuracy</p>
          </div>
          <div
            className="rounded-lg p-3 border border-gray-500/20"
            style={{ background: 'rgba(156,163,175,0.05)' }}
          >
            <p className="text-gray-500 mb-1">Top False Positive Rule</p>
            <p className="text-gray-300 font-semibold">{feedbackStats.topFalsePositiveRule}</p>
            <p className="text-gray-600 mt-0.5">35% FP rate — needs tuning</p>
          </div>
        </div>
      </div>
    </div>
  );
}
