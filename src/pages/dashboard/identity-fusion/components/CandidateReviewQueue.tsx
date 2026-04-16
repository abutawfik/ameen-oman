import { useState } from 'react';
import { mergeCandidates, type MergeCandidate } from '@/mocks/identityFusionData';

interface Props { isAr: boolean; }

const confidenceColor = (c: number) => {
  if (c >= 95) return '#4ADE80';
  if (c >= 85) return '#22D3EE';
  if (c >= 75) return '#FACC15';
  return '#FB923C';
};

const statusConfig: Record<string, { label: string; labelAr: string; color: string; bg: string }> = {
  pending:  { label: 'Pending Review', labelAr: 'قيد المراجعة', color: '#FACC15', bg: 'rgba(250,204,21,0.1)' },
  merged:   { label: 'Merged',         labelAr: 'تم الدمج',     color: '#4ADE80', bg: 'rgba(74,222,128,0.1)' },
  rejected: { label: 'Rejected',       labelAr: 'مرفوض',        color: '#F87171', bg: 'rgba(248,113,113,0.1)' },
  flagged:  { label: 'Flagged',        labelAr: 'مُبلَّغ',      color: '#FB923C', bg: 'rgba(251,146,60,0.1)' },
};

function PersonCard({ person, isAr, highlight }: { person: MergeCandidate['personA']; isAr: boolean; highlight?: string[] }) {
  return (
    <div
      className="flex-1 rounded-xl border p-4"
      style={{ background: 'rgba(6,13,26,0.6)', borderColor: 'rgba(34,211,238,0.12)' }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
          style={{ background: 'rgba(34,211,238,0.12)', color: '#22D3EE', border: '2px solid rgba(34,211,238,0.3)' }}
        >
          {person.initials}
        </div>
        <div>
          <p className="text-white font-semibold text-sm font-['Inter']">{isAr ? person.nameAr : person.nameEn}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span>{person.nationalityFlag}</span>
            <span className="text-gray-500 text-xs font-['JetBrains_Mono']">{person.nationality} · {person.dob}</span>
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        {person.documents.map((doc, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
            style={{
              background: highlight?.includes(doc.number) ? 'rgba(34,211,238,0.1)' : 'rgba(255,255,255,0.03)',
              border: highlight?.includes(doc.number) ? '1px solid rgba(34,211,238,0.3)' : '1px solid transparent',
            }}
          >
            <i className="ri-file-text-line text-xs" style={{ color: highlight?.includes(doc.number) ? '#22D3EE' : '#6B7280' }} />
            <span className="text-xs font-['JetBrains_Mono']" style={{ color: highlight?.includes(doc.number) ? '#22D3EE' : '#9CA3AF' }}>
              {doc.type}: {doc.number}
            </span>
            {highlight?.includes(doc.number) && (
              <i className="ri-check-double-line text-cyan-400 text-xs ml-auto" />
            )}
          </div>
        ))}
        {person.phones.map((ph, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
            style={{
              background: highlight?.includes(ph) ? 'rgba(34,211,238,0.1)' : 'rgba(255,255,255,0.03)',
              border: highlight?.includes(ph) ? '1px solid rgba(34,211,238,0.3)' : '1px solid transparent',
            }}
          >
            <i className="ri-phone-line text-xs" style={{ color: highlight?.includes(ph) ? '#22D3EE' : '#6B7280' }} />
            <span className="text-xs font-['JetBrains_Mono']" style={{ color: highlight?.includes(ph) ? '#22D3EE' : '#9CA3AF' }}>
              {ph}
            </span>
            {highlight?.includes(ph) && (
              <i className="ri-check-double-line text-cyan-400 text-xs ml-auto" />
            )}
          </div>
        ))}
        <div className="flex flex-wrap gap-1 mt-2">
          {person.streams.map(s => (
            <span
              key={s}
              className="text-xs px-1.5 py-0.5 rounded font-['JetBrains_Mono']"
              style={{ background: 'rgba(34,211,238,0.08)', color: '#22D3EE', fontSize: 9 }}
            >
              {s.toUpperCase()}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function MergePreviewModal({ candidate, isAr, onClose, onConfirm }: {
  candidate: MergeCandidate; isAr: boolean; onClose: () => void; onConfirm: () => void;
}) {
  const merged = candidate.personA;
  const allDocs = [...candidate.personA.documents, ...candidate.personB.documents];
  const allPhones = [...new Set([...candidate.personA.phones, ...candidate.personB.phones])];
  const allStreams = [...new Set([...candidate.personA.streams, ...candidate.personB.streams])];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div
        className="w-full max-w-2xl rounded-2xl border border-cyan-500/25 overflow-hidden"
        style={{ background: 'rgba(10,22,40,0.98)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/15">
          <div>
            <h3 className="text-white font-bold text-base font-['Inter']">
              {isAr ? 'معاينة الدمج' : 'Merge Preview'}
            </h3>
            <p className="text-gray-500 text-xs mt-0.5 font-['JetBrains_Mono']">
              {isAr ? 'الملف الموحد بعد الدمج' : 'Unified profile after merge'}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 cursor-pointer">
            <i className="ri-close-line text-xl" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Canonical record */}
          <div className="flex items-center gap-4 p-4 rounded-xl border border-cyan-500/20" style={{ background: 'rgba(34,211,238,0.04)' }}>
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg shrink-0"
              style={{ background: 'rgba(34,211,238,0.15)', color: '#22D3EE', border: '2px solid rgba(34,211,238,0.4)' }}
            >
              {merged.initials}
            </div>
            <div className="flex-1">
              <p className="text-cyan-400 text-xs font-['JetBrains_Mono'] mb-0.5">CANONICAL RECORD</p>
              <p className="text-white font-bold text-lg font-['Inter']">{isAr ? merged.nameAr : merged.nameEn}</p>
              <p className="text-gray-400 text-sm font-['JetBrains_Mono']">{merged.nationality} · DOB: {merged.dob}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-xs font-['JetBrains_Mono']">Confidence</p>
              <p className="font-mono font-bold text-2xl" style={{ color: confidenceColor(candidate.confidence) }}>
                {candidate.confidence}%
              </p>
            </div>
          </div>

          {/* Merged data */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/8 p-3" style={{ background: 'rgba(6,13,26,0.5)' }}>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-2 font-['JetBrains_Mono']">
                {isAr ? 'الوثائق المدمجة' : 'Merged Documents'}
              </p>
              {allDocs.map((d, i) => (
                <div key={i} className="flex items-center gap-2 py-1">
                  <i className="ri-file-text-line text-cyan-400/60 text-xs" />
                  <span className="text-gray-300 text-xs font-['JetBrains_Mono']">{d.type}: {d.number}</span>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-white/8 p-3" style={{ background: 'rgba(6,13,26,0.5)' }}>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-2 font-['JetBrains_Mono']">
                {isAr ? 'أرقام الهاتف' : 'Phone Numbers'}
              </p>
              {allPhones.map((ph, i) => (
                <div key={i} className="flex items-center gap-2 py-1">
                  <i className="ri-phone-line text-cyan-400/60 text-xs" />
                  <span className="text-gray-300 text-xs font-['JetBrains_Mono']">{ph}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Streams */}
          <div className="rounded-xl border border-white/8 p-3" style={{ background: 'rgba(6,13,26,0.5)' }}>
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-2 font-['JetBrains_Mono']">
              {isAr ? 'التيارات المدمجة' : 'Combined Streams'} ({allStreams.length})
            </p>
            <div className="flex flex-wrap gap-1.5">
              {allStreams.map(s => (
                <span
                  key={s}
                  className="text-xs px-2 py-0.5 rounded-full font-['JetBrains_Mono']"
                  style={{ background: 'rgba(34,211,238,0.1)', color: '#22D3EE', border: '1px solid rgba(34,211,238,0.2)' }}
                >
                  {s.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm border border-cyan-500/25 text-cyan-400 hover:bg-cyan-500/8 cursor-pointer transition-colors whitespace-nowrap font-['Inter']"
          >
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap font-['Inter']"
            style={{ background: '#22D3EE', color: '#060D1A' }}
          >
            <i className="ri-merge-cells-horizontal mr-1.5" />
            {isAr ? 'تأكيد الدمج' : 'Confirm Merge'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CandidateReviewQueue({ isAr }: Props) {
  const [candidates, setCandidates] = useState(mergeCandidates);
  const [filter, setFilter] = useState<'all' | 'pending' | 'merged' | 'rejected'>('all');
  const [previewCandidate, setPreviewCandidate] = useState<MergeCandidate | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = filter === 'all' ? candidates : candidates.filter(c => c.status === filter);

  const handleAction = (id: string, action: 'merged' | 'rejected' | 'flagged') => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, status: action, reviewedBy: 'Analyst' } : c));
    setPreviewCandidate(null);
  };

  const counts = {
    all: candidates.length,
    pending: candidates.filter(c => c.status === 'pending').length,
    merged: candidates.filter(c => c.status === 'merged').length,
    rejected: candidates.filter(c => c.status === 'rejected').length,
  };

  return (
    <div className="p-5">
      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-5">
        {(['all', 'pending', 'merged', 'rejected'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border cursor-pointer transition-all whitespace-nowrap font-['Inter']"
            style={{
              borderColor: filter === f ? 'rgba(34,211,238,0.5)' : 'rgba(34,211,238,0.15)',
              color: filter === f ? '#22D3EE' : '#6B7280',
              background: filter === f ? 'rgba(34,211,238,0.08)' : 'transparent',
            }}
          >
            {f === 'all' ? (isAr ? 'الكل' : 'All') :
             f === 'pending' ? (isAr ? 'قيد المراجعة' : 'Pending') :
             f === 'merged' ? (isAr ? 'تم الدمج' : 'Merged') :
             (isAr ? 'مرفوض' : 'Rejected')}
            <span
              className="px-1.5 py-0.5 rounded-full font-mono text-xs"
              style={{ background: 'rgba(255,255,255,0.08)', color: '#9CA3AF' }}
            >
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {/* Candidate rows */}
      <div className="space-y-3">
        {filtered.map(candidate => {
          const sc = statusConfig[candidate.status];
          const cc = confidenceColor(candidate.confidence);
          const isExpanded = expandedId === candidate.id;

          return (
            <div
              key={candidate.id}
              className="rounded-xl border overflow-hidden transition-all"
              style={{ background: 'rgba(10,22,40,0.8)', borderColor: 'rgba(34,211,238,0.12)' }}
            >
              {/* Row header */}
              <div
                className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-cyan-500/3 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : candidate.id)}
              >
                {/* Confidence ring */}
                <div className="relative w-12 h-12 shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                    <circle
                      cx="20" cy="20" r="16" fill="none"
                      stroke={cc} strokeWidth="3" strokeLinecap="round"
                      strokeDasharray={`${candidate.confidence * 1.005} 100.5`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-mono font-bold text-xs" style={{ color: cc }}>{candidate.confidence}</span>
                  </div>
                </div>

                {/* Person A → B */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-semibold text-sm font-['Inter'] truncate">
                      {isAr ? candidate.personA.nameAr : candidate.personA.nameEn}
                    </span>
                    <i className="ri-arrow-right-line text-cyan-400/60 text-xs shrink-0" />
                    <span className="text-white font-semibold text-sm font-['Inter'] truncate">
                      {isAr ? candidate.personB.nameAr : candidate.personB.nameEn}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-['Inter']"
                      style={{ background: 'rgba(34,211,238,0.08)', color: '#22D3EE' }}
                    >
                      {isAr ? candidate.matchingRuleAr : candidate.matchingRule}
                    </span>
                    {candidate.matchingFields.slice(0, 2).map((f, i) => (
                      <span key={i} className="text-gray-500 text-xs font-['JetBrains_Mono']">· {f}</span>
                    ))}
                  </div>
                </div>

                {/* Streams */}
                <div className="hidden lg:flex items-center gap-1 shrink-0">
                  {candidate.sourceStreams.map(s => (
                    <span
                      key={s}
                      className="text-xs px-1.5 py-0.5 rounded font-['JetBrains_Mono']"
                      style={{ background: 'rgba(255,255,255,0.05)', color: '#6B7280', fontSize: 9 }}
                    >
                      {s.toUpperCase()}
                    </span>
                  ))}
                </div>

                {/* Status */}
                <span
                  className="text-xs px-2.5 py-1 rounded-full font-['Inter'] whitespace-nowrap shrink-0"
                  style={{ background: sc.bg, color: sc.color }}
                >
                  {isAr ? sc.labelAr : sc.label}
                </span>

                {/* Expand */}
                <i className={isExpanded ? 'ri-arrow-up-s-line text-gray-500 shrink-0' : 'ri-arrow-down-s-line text-gray-500 shrink-0'} />
              </div>

              {/* Expanded: side-by-side cards + actions */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-white/5">
                  <div className="flex gap-3 mt-4">
                    <PersonCard
                      person={candidate.personA}
                      isAr={isAr}
                      highlight={candidate.matchingFields}
                    />
                    {/* Merge arrow */}
                    <div className="flex flex-col items-center justify-center gap-2 shrink-0">
                      <div className="w-px flex-1 bg-cyan-500/20" />
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)' }}
                      >
                        <i className="ri-merge-cells-horizontal text-cyan-400 text-sm" />
                      </div>
                      <div className="w-px flex-1 bg-cyan-500/20" />
                    </div>
                    <PersonCard
                      person={candidate.personB}
                      isAr={isAr}
                      highlight={candidate.matchingFields}
                    />
                  </div>

                  {/* Action buttons */}
                  {candidate.status === 'pending' && (
                    <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/5">
                      <button
                        onClick={() => setPreviewCandidate(candidate)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap transition-all font-['Inter']"
                        style={{ background: '#22D3EE', color: '#060D1A' }}
                      >
                        <i className="ri-eye-line" />
                        {isAr ? 'معاينة الدمج' : 'Preview Merge'}
                      </button>
                      <button
                        onClick={() => handleAction(candidate.id, 'merged')}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap border border-green-500/30 text-green-400 hover:bg-green-500/8 transition-all font-['Inter']"
                      >
                        <i className="ri-check-line" />
                        {isAr ? 'دمج' : 'Merge'}
                      </button>
                      <button
                        onClick={() => handleAction(candidate.id, 'rejected')}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap border border-red-500/30 text-red-400 hover:bg-red-500/8 transition-all font-['Inter']"
                      >
                        <i className="ri-close-line" />
                        {isAr ? 'رفض' : 'Reject'}
                      </button>
                      <button
                        onClick={() => handleAction(candidate.id, 'flagged')}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap border border-orange-500/30 text-orange-400 hover:bg-orange-500/8 transition-all font-['Inter']"
                      >
                        <i className="ri-flag-line" />
                        {isAr ? 'تبليغ' : 'Flag'}
                      </button>
                      <span className="text-gray-600 text-xs font-['JetBrains_Mono'] ml-auto">{candidate.createdAt}</span>
                    </div>
                  )}
                  {candidate.status !== 'pending' && (
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/5">
                      <i className="ri-user-line text-gray-600 text-xs" />
                      <span className="text-gray-500 text-xs font-['Inter']">
                        {isAr ? 'راجعه:' : 'Reviewed by:'} {candidate.reviewedBy}
                      </span>
                      <span className="text-gray-600 text-xs font-['JetBrains_Mono'] ml-auto">{candidate.createdAt}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Merge preview modal */}
      {previewCandidate && (
        <MergePreviewModal
          candidate={previewCandidate}
          isAr={isAr}
          onClose={() => setPreviewCandidate(null)}
          onConfirm={() => handleAction(previewCandidate.id, 'merged')}
        />
      )}
    </div>
  );
}
