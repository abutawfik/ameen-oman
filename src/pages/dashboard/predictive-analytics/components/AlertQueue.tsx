import { useState } from 'react';
import { alertQueue, streamLabels, type PatternAlert } from '@/mocks/predictiveAnalyticsData';

const priorityConfig = {
  critical: { color: '#F87171', border: '#F87171', label: 'CRITICAL', bg: 'rgba(248,113,113,0.12)' },
  high:     { color: '#FB923C', border: '#FB923C', label: 'HIGH',     bg: 'rgba(251,146,60,0.12)' },
  medium:   { color: '#FACC15', border: '#FACC15', label: 'MEDIUM',   bg: 'rgba(250,204,21,0.12)' },
  low:      { color: '#22D3EE', border: '#22D3EE', label: 'LOW',      bg: 'rgba(34,211,238,0.12)' },
};

const statusConfig = {
  open:      { color: '#F87171', label: 'Open',      bg: 'rgba(248,113,113,0.12)' },
  assigned:  { color: '#FACC15', label: 'Assigned',  bg: 'rgba(250,204,21,0.12)' },
  confirmed: { color: '#4ADE80', label: 'Confirmed', bg: 'rgba(74,222,128,0.12)' },
  dismissed: { color: '#9CA3AF', label: 'Dismissed', bg: 'rgba(156,163,175,0.12)' },
  escalated: { color: '#FB923C', label: 'Escalated', bg: 'rgba(251,146,60,0.12)' },
};

const escalationBanners = [
  null,
  { color: '#FACC15', bg: 'rgba(250,204,21,0.08)', icon: 'ri-time-line',         text: 'Auto-assigned to duty officer (>30 min unactioned)' },
  { color: '#FB923C', bg: 'rgba(251,146,60,0.08)', icon: 'ri-alarm-warning-line', text: 'Escalated to supervisor (>60 min unactioned)' },
  { color: '#F87171', bg: 'rgba(248,113,113,0.1)', icon: 'ri-alert-fill',         text: 'RED ESCALATION — Command notified (>120 min)' },
];

const streamIcons: Record<string, string> = {
  border: 'ri-passport-line', hotel: 'ri-hotel-line', mobile: 'ri-sim-card-line',
  car: 'ri-car-line', financial: 'ri-bank-card-line', employment: 'ri-briefcase-line',
  utility: 'ri-flashlight-line', transport: 'ri-bus-line', ecommerce: 'ri-shopping-cart-line',
  social: 'ri-global-line', municipality: 'ri-government-line', education: 'ri-graduation-cap-line',
  health: 'ri-heart-pulse-line', customs: 'ri-box-3-line',
};

type ActionFeedback = { id: string; action: string };

interface Props {
  filterPriority: string;
  filterStatus: string;
}

export default function AlertQueue({ filterPriority, filterStatus }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [localStatuses, setLocalStatuses] = useState<Record<string, PatternAlert['status']>>({});
  const [feedback, setFeedback] = useState<ActionFeedback | null>(null);

  const filtered = alertQueue.filter(a => {
    if (filterPriority !== 'all' && a.priority !== filterPriority) return false;
    const status = localStatuses[a.id] || a.status;
    if (filterStatus !== 'all' && status !== filterStatus) return false;
    return true;
  });

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map(a => a.id)));
    }
  };

  const doAction = (id: string, status: PatternAlert['status'], actionLabel: string) => {
    setLocalStatuses(prev => ({ ...prev, [id]: status }));
    setFeedback({ id, action: actionLabel });
    setTimeout(() => setFeedback(null), 2500);
  };

  const bulkAction = (action: string) => {
    const newStatus: PatternAlert['status'] =
      action === 'Dismiss' ? 'dismissed' :
      action === 'Escalate' ? 'escalated' : 'assigned';
    const updates: Record<string, PatternAlert['status']> = {};
    selected.forEach(id => { updates[id] = newStatus; });
    setLocalStatuses(prev => ({ ...prev, ...updates }));
    setSelected(new Set());
    setFeedback({ id: 'bulk', action: `${action} applied to ${selected.size} alerts` });
    setTimeout(() => setFeedback(null), 2500);
  };

  return (
    <div className="space-y-3">
      {/* Feedback toast */}
      {feedback && (
        <div
          className="fixed top-16 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg border border-green-500/30 text-green-400 text-sm font-medium"
          style={{ background: 'rgba(10,22,40,0.98)' }}
        >
          <i className="ri-checkbox-circle-line" />
          {feedback.action}
        </div>
      )}

      {/* Bulk actions bar */}
      <div
        className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-cyan-500/15"
        style={{ background: 'rgba(10,22,40,0.8)' }}
      >
        <input
          type="checkbox"
          checked={selected.size === filtered.length && filtered.length > 0}
          onChange={selectAll}
          className="w-3.5 h-3.5 accent-cyan-400 cursor-pointer"
        />
        <span className="text-gray-400 text-xs">
          {selected.size > 0 ? `${selected.size} selected` : `${filtered.length} alerts`}
        </span>
        {selected.size > 0 && (
          <div className="flex items-center gap-2 ml-2">
            {['Assign', 'Dismiss', 'Escalate'].map(action => (
              <button
                key={action}
                onClick={() => bulkAction(action)}
                className="px-3 py-1 rounded-md text-xs border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 cursor-pointer transition-colors whitespace-nowrap"
              >
                {action} All
              </button>
            ))}
          </div>
        )}
        <div className="ml-auto flex items-center gap-2 text-xs text-gray-500">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Live · Auto-refresh 30s
        </div>
      </div>

      {filtered.length === 0 && (
        <div
          className="text-center py-16 rounded-xl border border-cyan-500/10"
          style={{ background: 'rgba(10,22,40,0.6)' }}
        >
          <i className="ri-shield-check-line text-4xl mb-3 block text-cyan-500/30" />
          <p className="text-gray-400 text-sm">No alerts match the current filters</p>
          <p className="text-gray-600 text-xs mt-1">Try adjusting priority or status filters</p>
        </div>
      )}

      {filtered.map(alert => {
        const pc = priorityConfig[alert.priority];
        const status = localStatuses[alert.id] || alert.status;
        const sc = statusConfig[status];
        const isExpanded = expanded === alert.id;
        const isSelected = selected.has(alert.id);
        const escalation = escalationBanners[alert.escalationLevel];

        return (
          <div
            key={alert.id}
            className="rounded-xl border transition-all duration-200"
            style={{
              background: isSelected ? 'rgba(34,211,238,0.05)' : 'rgba(10,22,40,0.8)',
              borderColor: isSelected ? '#22D3EE' : `${pc.border}35`,
              borderLeftWidth: 3,
              borderLeftColor: pc.border,
            }}
          >
            {/* Escalation banner */}
            {escalation && (
              <div
                className="flex items-center gap-2 px-4 py-1.5 rounded-t-xl text-xs font-semibold"
                style={{ background: escalation.bg, color: escalation.color }}
              >
                <i className={`${escalation.icon} text-sm`} />
                {escalation.text}
                <span className="ml-auto font-mono">{alert.minutesAgo} min ago</span>
              </div>
            )}

            {/* Main row */}
            <div className="flex items-center gap-3 px-4 py-3">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleSelect(alert.id)}
                className="w-3.5 h-3.5 accent-cyan-400 cursor-pointer shrink-0"
              />

              {/* Person avatar */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                style={{ background: `${alert.photoColor}20`, color: alert.photoColor }}
              >
                {alert.photoInitials}
              </div>

              {/* Priority badge */}
              <span
                className="text-xs font-bold px-2 py-0.5 rounded font-mono shrink-0"
                style={{ background: pc.bg, color: pc.color }}
              >
                {pc.label}
              </span>

              {/* Alert ID */}
              <span className="text-gray-600 font-mono text-xs shrink-0 hidden xl:block">{alert.id}</span>

              {/* Rule + person */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white text-sm font-semibold">{alert.ruleName}</span>
                  <span className="text-gray-500 text-xs hidden md:block">·</span>
                  <span className="text-gray-300 text-xs hidden md:block">{alert.personName}</span>
                  <span className="text-gray-600 text-xs font-mono hidden lg:block">{alert.personDoc}</span>
                  <span className="text-base hidden md:block">{alert.nationalityFlag}</span>
                </div>
                <p className="text-gray-500 text-xs mt-0.5 truncate hidden lg:block">{alert.location}</p>
              </div>

              {/* Streams */}
              <div className="flex items-center gap-0.5 shrink-0 hidden md:flex">
                {alert.streamsInvolved.slice(0, 4).map(s => {
                  const stream = streamLabels.find(sl => sl.key === s);
                  return (
                    <div
                      key={s}
                      className="w-5 h-5 flex items-center justify-center rounded"
                      style={{ background: `${stream?.color || '#9CA3AF'}15` }}
                      title={stream?.label || s}
                    >
                      <i className={`${streamIcons[s] || 'ri-database-line'} text-xs`} style={{ color: stream?.color || '#9CA3AF' }} />
                    </div>
                  );
                })}
                {alert.streamsInvolved.length > 4 && (
                  <span className="text-gray-600 text-xs ml-0.5">+{alert.streamsInvolved.length - 4}</span>
                )}
              </div>

              {/* Score */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 border-2"
                style={{
                  borderColor: alert.score >= 80 ? '#F87171' : alert.score >= 60 ? '#FB923C' : '#FACC15',
                  color: alert.score >= 80 ? '#F87171' : alert.score >= 60 ? '#FB923C' : '#FACC15',
                  background: 'transparent',
                }}
              >
                {alert.score}
              </div>

              {/* Time */}
              <span className="text-gray-500 text-xs shrink-0 hidden lg:block font-mono">{alert.triggeredAt}</span>

              {/* Status */}
              <span
                className="text-xs px-2 py-0.5 rounded-full shrink-0 hidden md:block font-medium"
                style={{ background: sc.bg, color: sc.color }}
              >
                {sc.label}
              </span>

              {/* Assigned */}
              <span className="text-gray-500 text-xs shrink-0 hidden xl:block w-20 truncate">
                {alert.assignedTo || '—'}
              </span>

              {/* Expand */}
              <button
                onClick={() => setExpanded(isExpanded ? null : alert.id)}
                className="text-gray-500 hover:text-cyan-400 cursor-pointer transition-colors shrink-0"
              >
                <i className={`${isExpanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} text-lg`} />
              </button>
            </div>

            {/* Expanded detail */}
            {isExpanded && (
              <div
                className="px-4 pb-4 border-t border-cyan-500/10 pt-4"
                style={{ background: 'rgba(34,211,238,0.02)' }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Left: trigger info */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1.5">Trigger Description</p>
                      <p className="text-gray-300 text-sm leading-relaxed">{alert.triggerDescription}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1.5">Suggested Action</p>
                      <div
                        className="rounded-lg p-3 border border-cyan-500/15"
                        style={{ background: 'rgba(34,211,238,0.05)' }}
                      >
                        <p className="text-cyan-300 text-sm">{alert.suggestedAction}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Location</p>
                        <div className="flex items-center gap-1.5">
                          <i className="ri-map-pin-line text-cyan-400 text-xs" />
                          <span className="text-white text-xs">{alert.location}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Rule Category</p>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(34,211,238,0.1)', color: '#22D3EE' }}
                        >
                          {alert.ruleCategory}
                        </span>
                      </div>
                    </div>

                    {/* Streams involved */}
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1.5">Streams Involved</p>
                      <div className="flex flex-wrap gap-1.5">
                        {alert.streamsInvolved.map(s => {
                          const stream = streamLabels.find(sl => sl.key === s);
                          return (
                            <span
                              key={s}
                              className="flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs"
                              style={{
                                borderColor: `${stream?.color || '#9CA3AF'}40`,
                                background: `${stream?.color || '#9CA3AF'}10`,
                                color: stream?.color || '#9CA3AF',
                              }}
                            >
                              <i className={`${streamIcons[s] || 'ri-database-line'}`} style={{ fontSize: 9 }} />
                              {stream?.label || s}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1.5">Analyst Notes</p>
                      <textarea
                        value={notes[alert.id] || ''}
                        onChange={e => {
                          if (e.target.value.length <= 500) {
                            setNotes(prev => ({ ...prev, [alert.id]: e.target.value }));
                          }
                        }}
                        placeholder="Add analyst notes (max 500 chars)..."
                        rows={2}
                        className="w-full rounded-lg border border-cyan-500/20 bg-transparent text-gray-300 text-xs px-3 py-2 resize-none focus:outline-none focus:border-cyan-500/50 placeholder-gray-600"
                      />
                      <p className="text-gray-600 text-xs mt-0.5 text-right">{(notes[alert.id] || '').length}/500</p>
                    </div>
                  </div>

                  {/* Right: actions */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Analyst Actions</p>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => doAction(alert.id, 'confirmed', 'Alert confirmed — case created')}
                          className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-all whitespace-nowrap"
                          style={{ background: '#22D3EE', color: '#060D1A' }}
                        >
                          <i className="ri-check-double-line" />Confirm (TP)
                        </button>
                        <button
                          onClick={() => doAction(alert.id, 'dismissed', 'Alert dismissed — false positive logged')}
                          className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium border border-gray-600 text-gray-300 hover:border-gray-400 cursor-pointer transition-all whitespace-nowrap"
                        >
                          <i className="ri-close-line" />Dismiss (FP)
                        </button>
                        <button
                          className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 cursor-pointer transition-all whitespace-nowrap"
                        >
                          <i className="ri-search-eye-line" />Investigate
                        </button>
                        <button
                          onClick={() => doAction(alert.id, 'escalated', 'Alert escalated to senior officer')}
                          className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium border cursor-pointer transition-all whitespace-nowrap"
                          style={{ borderColor: '#FB923C', color: '#FB923C', background: 'rgba(251,146,60,0.06)' }}
                        >
                          <i className="ri-arrow-up-circle-line" />Escalate
                        </button>
                        <button
                          className="col-span-2 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-all whitespace-nowrap"
                          style={{ background: 'rgba(248,113,113,0.12)', color: '#F87171', border: '1px solid rgba(248,113,113,0.3)' }}
                        >
                          <i className="ri-team-line" />Deploy Field Team
                        </button>
                      </div>
                    </div>

                    {/* Tier indicator */}
                    <div
                      className="rounded-lg p-3 border border-cyan-500/10"
                      style={{ background: 'rgba(10,22,40,0.6)' }}
                    >
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Escalation Tier</p>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3].map(t => (
                          <div key={t} className="flex-1 flex flex-col items-center gap-1">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2"
                              style={{
                                borderColor: alert.tier >= t ? (t === 3 ? '#F87171' : t === 2 ? '#FB923C' : '#22D3EE') : 'rgba(75,85,99,0.5)',
                                background: alert.tier >= t ? (t === 3 ? 'rgba(248,113,113,0.15)' : t === 2 ? 'rgba(251,146,60,0.15)' : 'rgba(34,211,238,0.15)') : 'transparent',
                                color: alert.tier >= t ? (t === 3 ? '#F87171' : t === 2 ? '#FB923C' : '#22D3EE') : '#4B5563',
                              }}
                            >
                              {t}
                            </div>
                            <span className="text-gray-600 text-center" style={{ fontSize: 9 }}>
                              {t === 1 ? 'Queue' : t === 2 ? 'Mobile' : 'Command'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Feedback loop note */}
                    <div
                      className="rounded-lg p-3 border border-cyan-500/10"
                      style={{ background: 'rgba(34,211,238,0.03)' }}
                    >
                      <div className="flex items-start gap-2">
                        <i className="ri-loop-left-line text-cyan-400 text-sm mt-0.5" />
                        <div>
                          <p className="text-cyan-400 text-xs font-medium">Feedback Loop Active</p>
                          <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">
                            Your decision (Confirm/Dismiss) feeds back into rule effectiveness tracking and improves model accuracy.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
