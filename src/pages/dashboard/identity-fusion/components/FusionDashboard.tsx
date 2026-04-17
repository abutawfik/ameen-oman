import { useState } from 'react';
import { matchingRules, streamResolutionStats } from '@/mocks/identityFusionData';

interface Props { isAr: boolean; }

const actionConfig: Record<string, { label: string; labelAr: string; color: string; bg: string }> = {
  'auto-merge': { label: 'Auto-Merge', labelAr: 'دمج تلقائي', color: '#4ADE80', bg: 'rgba(74,222,128,0.1)' },
  'candidate':  { label: 'Candidate', labelAr: 'مرشح', color: '#FACC15', bg: 'rgba(250,204,21,0.1)' },
  'household':  { label: 'Household', labelAr: 'مجموعة منزلية', color: '#A78BFA', bg: 'rgba(167,139,250,0.1)' },
};

export default function FusionDashboard({ isAr }: Props) {
  const [editingRule, setEditingRule] = useState<string | null>(null);
  const [rules, setRules] = useState(matchingRules);

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const maxRate = Math.max(...streamResolutionStats.map(s => s.resolved));

  return (
    <div className="p-5 space-y-5">
      {/* Matching Rules Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white font-bold text-base font-['Inter']">
              {isAr ? 'قواعد المطابقة' : 'Matching Rules'}
            </h3>
            <p className="text-gray-500 text-xs mt-0.5 font-['JetBrains_Mono']">
              {isAr ? 'قواعد قابلة للتكوين لدمج الهويات' : 'Configurable rules for identity fusion'}
            </p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap transition-all"
            style={{ background: '#D6B47E', color: '#051428' }}
          >
            <i className="ri-add-line" />
            {isAr ? 'إضافة قاعدة' : 'Add Rule'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
          {rules.map(rule => {
            const ac = actionConfig[rule.action];
            const isEditing = editingRule === rule.id;
            return (
              <div
                key={rule.id}
                className="rounded-xl border p-4 transition-all"
                style={{
                  background: 'rgba(10,37,64,0.8)',
                  borderColor: rule.enabled ? `${rule.color}25` : 'rgba(255,255,255,0.06)',
                  opacity: rule.enabled ? 1 : 0.55,
                }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${rule.color}15` }}
                    >
                      <i className={`${rule.icon} text-base`} style={{ color: rule.color }} />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm font-['Inter']">
                        {isAr ? rule.nameAr : rule.name}
                      </p>
                      <span
                        className="text-xs px-1.5 py-0.5 rounded font-['JetBrains_Mono']"
                        style={{ background: ac.bg, color: ac.color }}
                      >
                        {isAr ? ac.labelAr : ac.label}
                      </span>
                    </div>
                  </div>
                  {/* Toggle */}
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className="relative w-10 h-5 rounded-full transition-all cursor-pointer shrink-0 mt-1"
                    style={{ background: rule.enabled ? '#D6B47E' : 'rgba(255,255,255,0.1)' }}
                  >
                    <div
                      className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                      style={{ left: rule.enabled ? '22px' : '2px' }}
                    />
                  </button>
                </div>

                {/* Description */}
                <p className="text-gray-500 text-xs leading-relaxed mb-3 font-['Inter']"
                  dangerouslySetInnerHTML={{ __html: isAr ? rule.descriptionAr : rule.description }}
                />

                {/* Confidence bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-600 text-xs font-['JetBrains_Mono']">
                      {isAr ? 'الثقة' : 'Confidence'}
                    </span>
                    <span className="font-mono font-bold text-sm" style={{ color: rule.color }}>
                      {rule.confidence}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${rule.confidence}%`, background: rule.color }}
                    />
                  </div>
                </div>

                {/* Stats row */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <div className="text-center">
                    <p className="text-white font-mono font-bold text-sm">{rule.triggeredToday}</p>
                    <p className="text-gray-600 text-xs font-['Inter']">{isAr ? 'اليوم' : 'Today'}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-mono font-bold text-sm">{rule.totalMerges.toLocaleString()}</p>
                    <p className="text-gray-600 text-xs font-['Inter']">{isAr ? 'إجمالي' : 'Total'}</p>
                  </div>
                  <button
                    onClick={() => setEditingRule(isEditing ? null : rule.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border cursor-pointer transition-all whitespace-nowrap"
                    style={{
                      borderColor: 'rgba(184,138,60,0.25)',
                      color: '#D6B47E',
                      background: isEditing ? 'rgba(184,138,60,0.1)' : 'transparent',
                    }}
                  >
                    <i className={isEditing ? 'ri-check-line' : 'ri-settings-3-line'} />
                    {isAr ? 'تعديل' : 'Edit'}
                  </button>
                </div>

                {/* Inline edit panel */}
                {isEditing && (
                  <div
                    className="mt-3 pt-3 border-t border-gold-500/15 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs font-['Inter']">
                        {isAr ? 'حد الثقة' : 'Confidence Threshold'}
                      </span>
                      <span className="text-gold-400 font-mono text-xs">{rule.confidence}%</span>
                    </div>
                    <input
                      type="range" min={50} max={100} defaultValue={rule.confidence}
                      className="w-full h-1 rounded-full cursor-pointer accent-gold-400"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs font-['Inter']">
                        {isAr ? 'الإجراء' : 'Action'}
                      </span>
                      <select
                        defaultValue={rule.action}
                        className="text-xs rounded-lg px-2 py-1 cursor-pointer font-['Inter']"
                        style={{ background: 'rgba(10,37,64,0.9)', color: '#D1D5DB', border: '1px solid rgba(184,138,60,0.2)' }}
                      >
                        <option value="auto-merge">Auto-Merge</option>
                        <option value="candidate">Candidate</option>
                        <option value="household">Household</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Stream Resolution Stats */}
      <div
        className="rounded-xl border border-gold-500/15 p-5"
        style={{ background: 'rgba(10,37,64,0.8)' }}
      >
        <h3 className="text-white font-bold text-sm font-['Inter'] mb-4">
          {isAr ? 'معدل الدقة لكل تيار' : 'Resolution Rate per Stream'}
        </h3>
        <div className="space-y-3">
          {streamResolutionStats.map(s => (
            <div key={s.code} className="flex items-center gap-4">
              <div className="w-32 shrink-0">
                <p className="text-gray-300 text-xs font-['Inter'] truncate">{isAr ? s.streamAr : s.stream}</p>
                <p className="text-gray-600 text-xs font-['JetBrains_Mono']">{s.code}</p>
              </div>
              <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(s.resolved / maxRate) * 100}%`,
                    background: s.rate >= 97 ? '#4ADE80' : s.rate >= 95 ? '#D6B47E' : s.rate >= 93 ? '#FACC15' : '#C98A1B',
                  }}
                />
              </div>
              <div className="w-20 text-right shrink-0">
                <span className="text-white font-mono text-xs">{s.resolved.toLocaleString()}</span>
              </div>
              <div className="w-14 text-right shrink-0">
                <span
                  className="font-mono font-bold text-xs"
                  style={{ color: s.rate >= 97 ? '#4ADE80' : s.rate >= 95 ? '#D6B47E' : s.rate >= 93 ? '#FACC15' : '#C98A1B' }}
                >
                  {s.rate}%
                </span>
              </div>
              <div className="w-16 text-right shrink-0">
                <span className="text-red-400/70 font-mono text-xs">{s.duplicates} dups</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
