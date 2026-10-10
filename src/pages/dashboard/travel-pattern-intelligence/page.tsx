import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import type { DashboardOutletContext } from '../DashboardLayout';
import PageHeader from '../components/PageHeader';
import {
  coTravelerPairs, routeSignatures, transitOverlapEvents, traffickingCases, documentAnomalies, tpiStats,
  type CoTravelerPair, type RouteSignature, type TransitOverlapEvent, type TraffickingCase, type DocumentAnomaly, type RiskLevel,
} from '@/mocks/travelPatternData';

type Tab = 'overview' | 'co-traveler' | 'route-sig' | 'transit-overlap' | 'trafficking' | 'doc-anomaly';

const RISK_COLOR: Record<RiskLevel, string> = {
  critical: '#C94A5E',
  high:     '#C98A1B',
  medium:   '#FACC15',
  low:      '#4ADE80',
};
const RISK_BG: Record<RiskLevel, string> = {
  critical: 'rgba(201,74,94,0.12)',
  high:     'rgba(201,138,27,0.12)',
  medium:   'rgba(250,204,21,0.08)',
  low:      'rgba(74,222,128,0.08)',
};
const STATUS_COLOR: Record<string, string> = {
  open: '#9CA3AF', investigating: '#60A5FA', escalated: '#F87171', confirmed: '#C94A5E', cleared: '#4ADE80',
};
const THREAT_ICON: Record<string, string> = {
  coordinated_courier: 'ri-exchange-line',
  trafficking_network: 'ri-user-forbid-line',
  document_swap_ring:  'ri-file-forbid-line',
  hawala_network:      'ri-money-dollar-circle-line',
};

// ── Shared UI helpers ──────────────────────────────────────────────────────────
function RiskBadge({ level }: { level: RiskLevel }) {
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide"
      style={{ background: RISK_BG[level], color: RISK_COLOR[level], border: `1px solid ${RISK_COLOR[level]}40` }}>
      {level}
    </span>
  );
}
function StatusBadge({ status }: { status: string }) {
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold capitalize"
      style={{ background: `${STATUS_COLOR[status]}18`, color: STATUS_COLOR[status], border: `1px solid ${STATUS_COLOR[status]}35` }}>
      {status.replace('-', ' ')}
    </span>
  );
}
function ScoreBar({ score, level }: { score: number; level: RiskLevel }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div className="h-1.5 rounded-full transition-all" style={{ width: `${score}%`, background: RISK_COLOR[level] }} />
      </div>
      <span className="text-xs font-bold font-['JetBrains_Mono']" style={{ color: RISK_COLOR[level] }}>{score}</span>
    </div>
  );
}
function SectionHeader({ icon, title, count, accentColor = '#D6B47E' }: { icon: string; title: string; count?: number; accentColor?: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 flex items-center justify-center rounded-lg" style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}30` }}>
          <i className={`${icon} text-sm`} style={{ color: accentColor }} />
        </div>
        <span className="text-white font-bold text-sm">{title}</span>
      </div>
      {count !== undefined && (
        <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: 'rgba(255,255,255,0.06)', color: '#9CA3AF' }}>{count}</span>
      )}
    </div>
  );
}
// ── Case creation modal ───────────────────────────────────────────────────────
interface CaseDraft {
  caseNumber: string;
  title: string;
  typeLabel: string;
  priority: RiskLevel;
  classification: string;
  description: string;
  subjects: { name: string; role: string; nationality: string; doc: string }[];
  evidence: string[];
  sourceRef: string;
}

function draftId(id: string) {
  const n = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return `INV-2026-0${70 + (n % 29)}`;
}

function draftFromCoTraveler(pair: CoTravelerPair): CaseDraft {
  return {
    caseNumber: draftId(pair.id),
    title: `Co-Traveler Network: ${pair.person1.name} + ${pair.person2.name}`,
    typeLabel: 'Organized Crime',
    priority: pair.riskLevel,
    classification: pair.riskLevel === 'critical' ? 'TOP SECRET' : 'SECRET',
    description: `${pair.coOccurrences} co-occurrences on ${pair.sharedRoute} at ~${pair.intervalWeeks}-week intervals. ${pair.analystNote}`,
    subjects: [
      { name: pair.person1.name, role: 'Primary', nationality: pair.person1.nationality, doc: pair.person1.passportNo },
      { name: pair.person2.name, role: 'Primary', nationality: pair.person2.nationality, doc: pair.person2.passportNo },
    ],
    evidence: [
      `Co-travel pattern data (${pair.coOccurrences} occurrences, ${pair.firstSeen}–${pair.lastSeen})`,
      `PNR booking records — ${pair.carrierCode}`,
      'Transit zone overlap logs — MCT T1 Gate G',
    ],
    sourceRef: pair.id.toUpperCase(),
  };
}

function draftFromTrafficking(tc: TraffickingCase): CaseDraft {
  const subjects: CaseDraft['subjects'] = [
    { name: tc.subject.name, role: 'Victim / Primary', nationality: tc.subject.nationality, doc: `Passport (issued ${tc.subject.passportAgeMonths}mo ago)` },
  ];
  if (tc.facilitator) {
    subjects.push({ name: tc.facilitator.name, role: 'Facilitator', nationality: tc.facilitator.nationality, doc: tc.facilitator.bookingRelation });
  }
  return {
    caseNumber: draftId(tc.id),
    title: `Human Trafficking Indicator: ${tc.subject.name} — ${tc.subject.route}`,
    typeLabel: 'Human Trafficking / Smuggling',
    priority: tc.riskLevel,
    classification: 'TOP SECRET',
    description: `UNODC 2025 composite score: ${tc.totalScore}/100. ${tc.notes}`,
    subjects,
    evidence: [
      `UNODC indicator composite: ${tc.totalScore}/100`,
      'Ticket-in-stages purchase record',
      tc.facilitator ? `Facilitator PNR contact match — ${tc.facilitator.name}` : 'PNR booking record',
      'Biometric entry record — MCT',
    ],
    sourceRef: tc.caseRef,
  };
}

function draftFromDocAnomaly(da: DocumentAnomaly): CaseDraft {
  const subjects: CaseDraft['subjects'] = [
    { name: da.entryName, role: 'Primary (Entry)', nationality: da.entryNationality, doc: da.entryDocument },
  ];
  if (da.exitName && da.exitDocument) {
    subjects.push({ name: da.exitName, role: 'Primary (Exit)', nationality: da.exitNationality ?? '', doc: da.exitDocument });
  }
  return {
    caseNumber: draftId(da.id),
    title: `Document Fraud — ${da.typeLabel}: ${da.entryName}`,
    typeLabel: 'Identity Fraud / Document Forgery',
    priority: da.riskLevel,
    classification: 'TOP SECRET',
    description: `${da.details} Confidence: ${da.confidence}%. Action: ${da.actionTaken}`,
    subjects,
    evidence: [
      da.biometricSimilarity !== undefined ? `Biometric facial comparison: ${da.biometricSimilarity}%` : 'Biometric capture record',
      `Entry passport scan — ${da.entryDocument}`,
      da.exitDocument ? `Exit passport scan — ${da.exitDocument}` : 'Transit CCTV timestamp reference',
      `Flight manifest records — ${da.flightIn} / ${da.flightOut}`,
    ],
    sourceRef: da.id.toUpperCase(),
  };
}

const P_COLOR: Record<RiskLevel, string> = { critical: '#C94A5E', high: '#C98A1B', medium: '#FACC15', low: '#4ADE80' };
const P_BG:    Record<RiskLevel, string> = { critical: 'rgba(201,74,94,0.12)', high: 'rgba(201,138,27,0.12)', medium: 'rgba(250,204,21,0.08)', low: 'rgba(74,222,128,0.08)' };

function CaseCreationModal({ draft, onClose, onConfirm }: { draft: CaseDraft; onClose: () => void; onConfirm: () => void }) {
  const [confirmed, setConfirmed] = useState(false);

  function handleConfirm() {
    setConfirmed(true);
    setTimeout(onConfirm, 1500);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}>
      <div className="w-full max-w-xl rounded-2xl border flex flex-col"
        style={{ background: '#071830', borderColor: 'rgba(184,138,60,0.25)', maxHeight: '90vh' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0"
          style={{ background: 'rgba(184,138,60,0.05)', borderColor: 'rgba(184,138,60,0.12)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg"
              style={{ background: 'rgba(214,180,126,0.1)', border: '1px solid rgba(214,180,126,0.2)' }}>
              <i className="ri-folder-add-line text-sm" style={{ color: '#D6B47E' }} />
            </div>
            <div>
              <div className="text-white font-bold text-sm">Create Investigation Case</div>
              <div className="text-gray-500 text-xs">Source: TPI — {draft.sourceRef}</div>
            </div>
          </div>
          {!confirmed && (
            <button type="button" onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = ''; }}>
              <i className="ri-close-line text-sm" />
            </button>
          )}
        </div>

        {confirmed ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)' }}>
              <i className="ri-checkbox-circle-fill text-green-400 text-2xl" />
            </div>
            <div className="text-white font-bold text-base">Case {draft.caseNumber} created</div>
            <div className="text-gray-400 text-xs">Opening Case Management…</div>
          </div>
        ) : (
          <div className="overflow-y-auto p-5 space-y-4 flex-1">
            {/* Case number */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Case number:</span>
              <span className="text-xs font-black font-['JetBrains_Mono']" style={{ color: '#D6B47E' }}>{draft.caseNumber}</span>
              <span className="px-2 py-0.5 rounded text-xs font-semibold"
                style={{ background: 'rgba(255,255,255,0.05)', color: '#9CA3AF' }}>DRAFT</span>
            </div>

            {/* Title */}
            <div>
              <div className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wide">Case Title</div>
              <div className="rounded-lg px-3 py-2 text-sm text-white font-semibold border"
                style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
                {draft.title}
              </div>
            </div>

            {/* Type / Priority / Classification */}
            <div className="grid grid-cols-3 gap-3">
              {([
                { label: 'Type',           value: draft.typeLabel,               color: '#9CA3AF',   bg: 'rgba(255,255,255,0.05)' },
                { label: 'Priority',       value: draft.priority.toUpperCase(),  color: P_COLOR[draft.priority], bg: P_BG[draft.priority] },
                { label: 'Classification', value: draft.classification,          color: '#C94A5E',   bg: 'rgba(201,74,94,0.1)' },
              ] as const).map(f => (
                <div key={f.label}>
                  <div className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wide">{f.label}</div>
                  <div className="rounded-lg px-2 py-1.5 text-xs font-bold border text-center"
                    style={{ background: f.bg, color: f.color, borderColor: `${f.color}30` }}>
                    {f.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <div className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wide">Description</div>
              <div className="rounded-lg px-3 py-2 text-xs text-gray-300 leading-relaxed border"
                style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
                {draft.description}
              </div>
            </div>

            {/* Subjects */}
            <div>
              <div className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">Subjects ({draft.subjects.length})</div>
              <div className="space-y-1.5">
                {draft.subjects.map((s, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg px-3 py-2 border"
                    style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
                    <div>
                      <div className="text-white text-xs font-semibold">{s.name}</div>
                      <div className="text-gray-500 text-xs">{s.nationality} · {s.doc}</div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.06)', color: '#9CA3AF' }}>{s.role}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Evidence */}
            <div>
              <div className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">Evidence Items ({draft.evidence.length})</div>
              <div className="space-y-1.5">
                {draft.evidence.map((e, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                    <i className="ri-attachment-2 text-gray-600 flex-shrink-0" />
                    {e}
                  </div>
                ))}
              </div>
            </div>

            {/* Lead officer */}
            <div>
              <div className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wide">Lead Officer</div>
              <div className="rounded-lg px-3 py-2 text-xs text-white border flex items-center justify-between"
                style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
                <span>OFC-2024-0042 — Ahmed Al-Amri (Current Session)</span>
                <i className="ri-arrow-down-s-line text-gray-500" />
              </div>
            </div>
          </div>
        )}

        {!confirmed && (
          <div className="flex items-center gap-3 px-5 py-4 border-t flex-shrink-0"
            style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <button type="button" onClick={onClose}
              className="flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors"
              style={{ background: 'transparent', borderColor: 'rgba(255,255,255,0.1)', color: '#6B7280' }}>
              Cancel
            </button>
            <button type="button" onClick={handleConfirm}
              className="flex-1 py-2 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 border"
              style={{ background: 'rgba(214,180,126,0.1)', borderColor: 'rgba(214,180,126,0.3)', color: '#D6B47E' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(214,180,126,0.2)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(214,180,126,0.1)'; }}>
              <i className="ri-folder-add-line" />
              Create Case {draft.caseNumber}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SubjectLink({ name }: { name: string }) {
  const navigate = useNavigate();
  return (
    <button type="button"
      onClick={() => navigate('/dashboard/person-360', { state: { tpiQuery: name } })}
      className="text-left transition-colors"
      style={{ color: '#7AB3E8' }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#93C5FD'; (e.currentTarget as HTMLButtonElement).style.textDecoration = 'underline'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#7AB3E8'; (e.currentTarget as HTMLButtonElement).style.textDecoration = 'none'; }}>
      {name}
    </button>
  );
}

function CreateCaseButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border font-bold text-sm transition-all"
      style={{ background: 'rgba(214,180,126,0.08)', borderColor: 'rgba(214,180,126,0.25)', color: '#D6B47E' }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(214,180,126,0.15)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(214,180,126,0.08)'; }}>
      <i className="ri-folder-add-line" />
      {label}
    </button>
  );
}

// ── Tab: Overview ─────────────────────────────────────────────────────────────
function OverviewTab() {
  const criticalCount = tpiStats.criticalAlerts;
  const statItems = [
    { icon: 'ri-git-branch-line',       label: 'Co-Traveler Networks', value: String(tpiStats.coTravelerPairsMonitored),  color: '#C94A5E', sub: 'active pairs' },
    { icon: 'ri-route-line',            label: 'Route Signatures',     value: String(tpiStats.routeSignatureAlerts),      color: '#C98A1B', sub: 'flagged corridors' },
    { icon: 'ri-user-forbid-line',      label: 'Trafficking Cases',    value: String(tpiStats.traffickingCasesOpen),      color: '#F87171', sub: 'open / active' },
    { icon: 'ri-file-forbid-line',      label: 'Document Anomalies',   value: String(tpiStats.documentAnomaliesOpen),     color: '#A78BFA', sub: 'under review' },
    { icon: 'ri-alarm-warning-line',    label: 'Critical Alerts',      value: String(criticalCount),                      color: '#EF4444', sub: 'require action' },
    { icon: 'ri-database-2-line',       label: 'Records Analyzed',     value: tpiStats.totalTravelerRecordsAnalyzed,      color: '#4ADE80', sub: '5-year span' },
  ];

  const detectionEngines = [
    { key: 'co-traveler',    icon: 'ri-git-branch-line',    title: 'Co-Traveler Network Detection',    desc: 'Identifies persons who repeatedly appear in the same transit zone across separate PNRs — detecting couriers, handlers, and networked actors.', source: 'arXiv 1305.4429 methodology', color: '#60A5FA' },
    { key: 'route-sig',      icon: 'ri-route-line',         title: 'Route Signature Analysis',         desc: 'Detects rare origin–transit–destination triplets shared by unrelated travelers, revealing corridor exploitation and organized routing.', source: 'SAS PNR Analytics, IATA TIP Guidelines', color: '#C98A1B' },
    { key: 'transit-overlap',icon: 'ri-time-line',          title: 'Transit Overlap Mapping',          desc: 'Maps temporal co-presence windows in transit zones, flagging simultaneous dwell periods as potential handoff or document exchange opportunities.', source: 'ICAO iAPI Best Practice 2024', color: '#4ADE80' },
    { key: 'trafficking',    icon: 'ri-user-forbid-line',   title: 'Human Trafficking Indicator Engine', desc: 'Scores travelers against UNODC 2025 key indicators, IATA TIP guidelines, and DHS victim/facilitator differentiation criteria.', source: 'UNODC 2025, IATA, DHS/FBI, US DOT', color: '#C94A5E' },
    { key: 'doc-anomaly',    icon: 'ri-file-forbid-line',   title: 'Document Anomaly Detection',       desc: 'Cross-references biometric captures, MRZ data, and transit manifests to detect passport swaps, lookalike fraud, and document number reuse.', source: 'UNODC Document Fraud 2025, INTERPOL SLTD', color: '#A78BFA' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {statItems.map(s => (
          <div key={s.label} className="rounded-xl p-4 border flex flex-col gap-1"
            style={{ background: 'rgba(255,255,255,0.03)', borderColor: `${s.color}25` }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-1" style={{ background: `${s.color}15` }}>
              <i className={`${s.icon} text-sm`} style={{ color: s.color }} />
            </div>
            <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
            <div className="text-white text-xs font-semibold leading-tight">{s.label}</div>
            <div className="text-gray-500 text-xs">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Detection engines grid */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <i className="ri-cpu-line text-gold-400 text-sm" />
          <span className="text-white font-bold text-sm">Detection Engine Coverage</span>
          <span className="ml-2 px-2 py-0.5 rounded-full text-xs" style={{ background: 'rgba(74,222,128,0.1)', color: '#4ADE80', border: '1px solid rgba(74,222,128,0.2)' }}>
            {tpiStats.patternDetectionEngines} engines active
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {detectionEngines.map(e => (
            <div key={e.key} className="rounded-xl p-4 border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: `${e.color}20` }}>
              <div className="flex items-center gap-2 mb-2">
                <i className={`${e.icon} text-sm`} style={{ color: e.color }} />
                <span className="text-white font-bold text-sm">{e.title}</span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed mb-3">{e.desc}</p>
              <div className="flex items-center gap-1.5 pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <i className="ri-shield-check-line text-xs text-gray-600" />
                <span className="text-gray-600 text-xs">{e.source}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Intelligence basis */}
      <div className="rounded-xl p-4 border" style={{ background: 'rgba(184,138,60,0.04)', borderColor: 'rgba(184,138,60,0.15)' }}>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 mt-0.5" style={{ background: 'rgba(184,138,60,0.12)', border: '1px solid rgba(184,138,60,0.2)' }}>
            <i className="ri-book-open-line text-gold-400 text-sm" />
          </div>
          <div>
            <div className="text-white font-bold text-sm mb-1">Intelligence Basis</div>
            <p className="text-gray-400 text-xs leading-relaxed">
              Detection logic is grounded in authoritative border security frameworks: <strong className="text-gray-300">UNODC 2025 Key Indicators for Trafficking</strong> ·
              <strong className="text-gray-300"> IATA Human Trafficking Guidelines v1</strong> · <strong className="text-gray-300">ICAO iAPI Best Practice 2024</strong> ·
              <strong className="text-gray-300"> US DHS/DOT/FBI Trafficking Indicators</strong> · <strong className="text-gray-300">INTERPOL SLTD / I-24/7</strong> ·
              <strong className="text-gray-300"> Europol EMPACT PNR Analytics</strong> · arXiv co-travel network inference methodology.
              All indicators are multi-factor scored — no single signal is determinative.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Tab: Co-Traveler Network ───────────────────────────────────────────────────
function CoTravelerTab() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<CoTravelerPair | null>(coTravelerPairs[0]);
  const [modal, setModal] = useState<CaseDraft | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      {/* List */}
      <div className="lg:col-span-2 space-y-2">
        <SectionHeader icon="ri-git-branch-line" title="Co-Traveler Pairs" count={coTravelerPairs.length} />
        {coTravelerPairs.map(pair => (
          <button key={pair.id} onClick={() => setSelected(pair)}
            className="w-full text-left rounded-xl p-4 border transition-all"
            style={{
              background: selected?.id === pair.id ? `${RISK_BG[pair.riskLevel]}` : 'rgba(255,255,255,0.02)',
              borderColor: selected?.id === pair.id ? `${RISK_COLOR[pair.riskLevel]}50` : 'rgba(255,255,255,0.06)',
            }}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <i className={`${THREAT_ICON[pair.threatType]} text-xs`} style={{ color: RISK_COLOR[pair.riskLevel] }} />
                <span className="text-white text-xs font-bold">{pair.id.toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RiskBadge level={pair.riskLevel} />
              </div>
            </div>
            <div className="text-xs text-gray-300 font-semibold truncate">{pair.person1.name}</div>
            <div className="text-xs text-gray-500">+ {pair.person2.name}</div>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs text-gray-500"><i className="ri-repeat-line mr-1" />{pair.coOccurrences}× co-present</span>
              <span className="text-xs font-semibold" style={{ color: RISK_COLOR[pair.riskLevel] }}>Score {pair.riskScore}</span>
            </div>
            <div className="mt-1 text-xs text-gray-600 truncate">{pair.sharedRoute}</div>
          </button>
        ))}
      </div>

      {/* Detail */}
      <div className="lg:col-span-3">
        {selected && (
          <div className="space-y-4">
            <div className="rounded-xl p-4 border" style={{ background: RISK_BG[selected.riskLevel], borderColor: `${RISK_COLOR[selected.riskLevel]}30` }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <i className={`${THREAT_ICON[selected.threatType]} text-sm`} style={{ color: RISK_COLOR[selected.riskLevel] }} />
                  <span className="text-white font-bold">{selected.id.toUpperCase()}</span>
                  <RiskBadge level={selected.riskLevel} />
                  <StatusBadge status={selected.status} />
                </div>
                <ScoreBar score={selected.riskScore} level={selected.riskLevel} />
              </div>
              <div className="text-sm font-semibold mb-1" style={{ color: RISK_COLOR[selected.riskLevel] }}>{selected.threatLabel}</div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {[selected.person1, selected.person2].map((p, i) => (
                  <div key={i} className="rounded-lg p-3 border" style={{ background: 'rgba(0,0,0,0.2)', borderColor: 'rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <i className="ri-user-line text-xs text-gray-400" />
                      <span className="text-xs text-gray-400 font-semibold">Person {i + 1}</span>
                    </div>
                    <div className="text-sm font-bold"><SubjectLink name={p.name} /></div>
                    <div className="text-gray-400 text-xs mt-0.5">{p.nationality} · {p.passportNo}</div>
                    <div className="text-gray-500 text-xs">Origin: {p.origin}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pattern data */}
            <div className="rounded-xl p-4 border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
              <SectionHeader icon="ri-bar-chart-2-line" title="Pattern Analysis" accentColor="#60A5FA" />
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'Co-occurrences', value: String(selected.coOccurrences), icon: 'ri-repeat-line', color: '#60A5FA' },
                  { label: 'Avg interval', value: `~${selected.intervalWeeks}w`, icon: 'ri-calendar-line', color: '#D6B47E' },
                  { label: 'PNR contact match', value: selected.pnrContactMatch ? 'YES' : 'NO', icon: 'ri-phone-line', color: selected.pnrContactMatch ? '#C94A5E' : '#4ADE80' },
                ].map(m => (
                  <div key={m.label} className="rounded-lg p-3 text-center border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
                    <i className={`${m.icon} text-sm mb-1`} style={{ color: m.color }} />
                    <div className="text-lg font-black" style={{ color: m.color }}>{m.value}</div>
                    <div className="text-xs text-gray-500">{m.label}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                <div><span className="text-gray-500">Shared route:</span> <span className="text-gray-300 font-semibold">{selected.sharedRoute}</span></div>
                <div><span className="text-gray-500">Carrier:</span> <span className="text-gray-300 font-semibold">{selected.carrierCode}</span></div>
                <div><span className="text-gray-500">First seen:</span> <span className="text-gray-300">{selected.firstSeen}</span></div>
                <div><span className="text-gray-500">Last seen:</span> <span className="text-gray-300 font-semibold">{selected.lastSeen}</span></div>
              </div>
              {/* Recent occurrences */}
              <div className="text-xs text-gray-500 mb-2 font-semibold">Recent co-occurrences (last 7 of {selected.coOccurrences})</div>
              <div className="space-y-1">
                {selected.occurrences.map((occ, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 px-2 rounded-lg text-xs" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <span className="text-gray-300 font-['JetBrains_Mono']">{occ.date}</span>
                    <span className="text-gray-400">{occ.flightIn} → {occ.flightOut}</span>
                    <span className="text-gray-500">{occ.transitZone}</span>
                    <span className="font-bold" style={{ color: RISK_COLOR[selected.riskLevel] }}>{occ.overlapHours}h dwell</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Analyst note */}
            <div className="rounded-xl p-4 border" style={{ background: 'rgba(167,139,250,0.04)', borderColor: 'rgba(167,139,250,0.15)' }}>
              <div className="flex items-center gap-1.5 mb-2">
                <i className="ri-spy-line text-purple-400 text-sm" />
                <span className="text-purple-400 font-bold text-xs">Analyst Note</span>
              </div>
              <p className="text-gray-300 text-xs leading-relaxed">{selected.analystNote}</p>
            </div>

            <CreateCaseButton
              label={`Create Case from ${selected.id.toUpperCase()}`}
              onClick={() => setModal(draftFromCoTraveler(selected))}
            />
          </div>
        )}
      </div>
      {modal && (
        <CaseCreationModal
          draft={modal}
          onClose={() => setModal(null)}
          onConfirm={() => { setModal(null); navigate('/dashboard/case-management'); }}
        />
      )}
    </div>
  );
}

// ── Tab: Route Signatures ──────────────────────────────────────────────────────
function RouteSignatureTab() {
  const [selected, setSelected] = useState<RouteSignature | null>(routeSignatures[0]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="space-y-3">
        <SectionHeader icon="ri-route-line" title="Flagged Route Signatures" count={routeSignatures.length} accentColor="#C98A1B" />
        {routeSignatures.map(rs => (
          <button key={rs.id} onClick={() => setSelected(rs)}
            className="w-full text-left rounded-xl p-4 border transition-all"
            style={{
              background: selected?.id === rs.id ? RISK_BG[rs.riskLevel] : 'rgba(255,255,255,0.02)',
              borderColor: selected?.id === rs.id ? `${RISK_COLOR[rs.riskLevel]}50` : 'rgba(255,255,255,0.06)',
            }}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-black text-base tracking-wide" style={{ color: RISK_COLOR[rs.riskLevel] }}>{rs.route}</span>
              <div className="flex items-center gap-1.5">
                <RiskBadge level={rs.riskLevel} />
                <StatusBadge status={rs.status} />
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-gray-400"><i className="ri-user-3-line mr-1" />{rs.unrelatedTravelers} unrelated travelers</span>
              <span className="text-gray-400"><i className="ri-flight-land-line mr-1" />{rs.carrier} {rs.flightNumbers.join(' / ')}</span>
              <span style={{ color: RISK_COLOR[rs.riskLevel] }}>Score {rs.riskScore}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1.5">Rarity: {rs.rarityScore} passengers / 6-month period</div>
          </button>
        ))}
      </div>

      <div>
        {selected && (
          <div className="space-y-3">
            <div className="rounded-xl p-4 border" style={{ background: RISK_BG[selected.riskLevel], borderColor: `${RISK_COLOR[selected.riskLevel]}30` }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg font-black" style={{ color: RISK_COLOR[selected.riskLevel] }}>{selected.route}</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <RiskBadge level={selected.riskLevel} />
                <StatusBadge status={selected.status} />
                <span className="text-xs text-gray-400">{selected.carrier} · {selected.flightNumbers.join(' / ')}</span>
              </div>
              <ScoreBar score={selected.riskScore} level={selected.riskLevel} />
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-gray-500">Route rarity:</span> <span className="font-bold" style={{ color: RISK_COLOR[selected.riskLevel] }}>{selected.rarityScore} pax / 6mo</span></div>
                <div><span className="text-gray-500">Unrelated travelers:</span> <span className="text-white font-bold">{selected.unrelatedTravelers}</span></div>
                <div><span className="text-gray-500">First alert:</span> <span className="text-gray-300">{selected.firstAlert}</span></div>
                <div><span className="text-gray-500">Last alert:</span> <span className="text-gray-300">{selected.lastAlert}</span></div>
              </div>
            </div>

            <div className="rounded-xl p-4 border" style={{ background: 'rgba(201,74,94,0.04)', borderColor: 'rgba(201,74,94,0.15)' }}>
              <div className="flex items-center gap-1.5 mb-2">
                <i className="ri-alert-line text-red-400 text-sm" />
                <span className="text-red-400 font-bold text-xs">Threat Indicator</span>
              </div>
              <p className="text-gray-300 text-xs leading-relaxed">{selected.threatIndicator}</p>
            </div>

            <div className="rounded-xl p-4 border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
              <SectionHeader icon="ri-user-3-line" title="Traveler Cluster" count={selected.travelers.length} />
              <div className="space-y-2">
                {selected.travelers.map((t, i) => (
                  <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <div>
                      <div className="text-white text-xs font-semibold">{t.name}</div>
                      <div className="text-gray-500 text-xs">{t.nationality} · {t.passportNo}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-400 text-xs">{t.travelDates.join(', ')}</div>
                      <div className="text-gray-600 text-xs">{t.bookingAgency}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Tab: Transit Overlap ───────────────────────────────────────────────────────
function TransitOverlapTab() {
  const [selected, setSelected] = useState<TransitOverlapEvent | null>(transitOverlapEvents[0]);
  const typeColor: Record<string, string> = {
    co_presence: '#60A5FA',
    document_swap_window: '#C94A5E',
    handoff_suspected: '#C98A1B',
  };
  const typeLabel: Record<string, string> = {
    co_presence: 'Co-Presence',
    document_swap_window: 'Swap Window',
    handoff_suspected: 'Handoff Suspected',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="space-y-2">
        <SectionHeader icon="ri-time-line" title="Transit Overlap Events" count={transitOverlapEvents.length} accentColor="#4ADE80" />
        {transitOverlapEvents.map(ev => (
          <button key={ev.id} onClick={() => setSelected(ev)}
            className="w-full text-left rounded-xl p-4 border transition-all"
            style={{
              background: selected?.id === ev.id ? RISK_BG[ev.riskLevel] : 'rgba(255,255,255,0.02)',
              borderColor: selected?.id === ev.id ? `${RISK_COLOR[ev.riskLevel]}50` : 'rgba(255,255,255,0.06)',
            }}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-['JetBrains_Mono'] text-gray-300">{ev.date}</span>
                <span className="px-1.5 py-0.5 rounded text-xs font-semibold" style={{ background: `${typeColor[ev.overlapType]}18`, color: typeColor[ev.overlapType] }}>{typeLabel[ev.overlapType]}</span>
              </div>
              <RiskBadge level={ev.riskLevel} />
            </div>
            <div className="text-gray-500 text-xs mb-1">{ev.zone}</div>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-gray-400"><i className="ri-user-3-line mr-1" />{ev.persons.length} persons</span>
              <span style={{ color: typeColor[ev.overlapType] }}><i className="ri-time-line mr-1" />{ev.overlapMinutes}min overlap</span>
              <StatusBadge status={ev.status} />
            </div>
          </button>
        ))}
      </div>

      <div>
        {selected && (
          <div className="space-y-3">
            {/* Timeline visual */}
            <div className="rounded-xl p-4 border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
              <SectionHeader icon="ri-calendar-line" title={`Transit Timeline — ${selected.date}`} accentColor={typeColor[selected.overlapType]} />
              <div className="text-xs text-gray-500 mb-3">{selected.zone}</div>
              {/* Visual timeline bars */}
              <div className="space-y-3">
                {selected.persons.map((p, i) => {
                  const [arrH, arrM] = p.arrivalTime.split(':').map(Number);
                  const [depH, depM] = p.departureTime.split(':').map(Number);
                  const startPct = ((arrH * 60 + arrM) / (24 * 60)) * 100;
                  const widthPct = ((depH * 60 + depM - (arrH * 60 + arrM)) / (24 * 60)) * 100;
                  const barColor = i === 0 ? '#60A5FA' : '#C98A1B';
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <span className="text-xs text-white font-semibold">{p.name}</span>
                          <span className="ml-2 text-xs text-gray-500">{p.nationality} · {p.passportNo}</span>
                        </div>
                        <div className="text-xs text-gray-400 font-['JetBrains_Mono']">{p.arrivalTime} – {p.departureTime}</div>
                      </div>
                      <div className="h-5 rounded-full relative" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <div className="absolute top-0 h-5 rounded-full flex items-center justify-center text-xs font-semibold"
                          style={{ left: `${Math.max(startPct - 3, 0)}%`, width: `${Math.max(widthPct + 3, 8)}%`, background: `${barColor}40`, border: `1px solid ${barColor}80`, color: barColor, minWidth: '60px' }}>
                          {p.arrivalFlight}
                        </div>
                      </div>
                      {p.riskFlag && <div className="text-xs mt-0.5" style={{ color: RISK_COLOR[selected.riskLevel] }}><i className="ri-flag-line mr-1" />{p.riskFlag}</div>}
                    </div>
                  );
                })}
                {/* Overlap indicator */}
                <div className="mt-2 pt-2 border-t flex items-center gap-2" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: `${typeColor[selected.overlapType]}18`, border: `1px solid ${typeColor[selected.overlapType]}30` }}>
                    <i className="ri-time-line text-xs" style={{ color: typeColor[selected.overlapType] }} />
                    <span className="text-xs font-bold" style={{ color: typeColor[selected.overlapType] }}>{selected.overlapMinutes} min overlap window</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Persons in zone */}
            <div className="rounded-xl p-4 border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
              <SectionHeader icon="ri-user-3-line" title="Persons in Zone" />
              {selected.persons.map((p, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b last:border-b-0" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                  <div>
                    <div className="text-white text-xs font-semibold">{p.name}</div>
                    <div className="text-gray-500 text-xs">{p.nationality} · {p.passportNo}</div>
                  </div>
                  <div className="text-right text-xs text-gray-400">
                    <div className="font-['JetBrains_Mono']">{p.arrivalFlight} → {p.departureFlight}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Flag reason */}
            <div className="rounded-xl p-4 border" style={{ background: 'rgba(201,74,94,0.04)', borderColor: 'rgba(201,74,94,0.15)' }}>
              <div className="flex items-center gap-1.5 mb-2">
                <i className="ri-flag-2-line text-red-400 text-sm" />
                <span className="text-red-400 font-bold text-xs">Flag Reason</span>
              </div>
              <p className="text-gray-300 text-xs leading-relaxed">{selected.flagReason}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Tab: Trafficking Indicators ────────────────────────────────────────────────
function TraffickingTab() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<TraffickingCase | null>(traffickingCases[0]);
  const [modal, setModal] = useState<CaseDraft | null>(null);
  const sourceColor: Record<string, string> = { UNODC: '#60A5FA', IATA: '#D6B47E', DHS: '#C94A5E', ICAO: '#A78BFA' };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <div className="lg:col-span-2 space-y-2">
        <SectionHeader icon="ri-user-forbid-line" title="Trafficking Cases" count={traffickingCases.length} accentColor="#C94A5E" />
        {traffickingCases.map(c => (
          <button key={c.id} onClick={() => setSelected(c)}
            className="w-full text-left rounded-xl p-4 border transition-all"
            style={{
              background: selected?.id === c.id ? RISK_BG[c.riskLevel] : 'rgba(255,255,255,0.02)',
              borderColor: selected?.id === c.id ? `${RISK_COLOR[c.riskLevel]}50` : 'rgba(255,255,255,0.06)',
            }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-gray-400">{c.caseRef}</span>
              <div className="flex items-center gap-1"><RiskBadge level={c.riskLevel} /><StatusBadge status={c.status} /></div>
            </div>
            <div className="text-white text-sm font-bold">{c.subject.name}</div>
            <div className="text-gray-500 text-xs">{c.subject.nationality} · {c.subject.age}{c.subject.gender} · {c.subject.route}</div>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-1 rounded-full" style={{ width: `${c.totalScore}%`, background: RISK_COLOR[c.riskLevel] }} />
              </div>
              <span className="text-xs font-bold" style={{ color: RISK_COLOR[c.riskLevel] }}>{c.totalScore}/100</span>
            </div>
          </button>
        ))}
      </div>

      <div className="lg:col-span-3">
        {selected && (
          <div className="space-y-3">
            <div className="rounded-xl p-4 border" style={{ background: RISK_BG[selected.riskLevel], borderColor: `${RISK_COLOR[selected.riskLevel]}30` }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-400">{selected.caseRef}</span>
                    <RiskBadge level={selected.riskLevel} />
                    <StatusBadge status={selected.status} />
                  </div>
                  <div className="font-bold text-base"><SubjectLink name={selected.subject.name} /></div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black" style={{ color: RISK_COLOR[selected.riskLevel] }}>{selected.totalScore}</div>
                  <div className="text-xs text-gray-500">/ 100 risk score</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div><span className="text-gray-500">Nationality:</span> <span className="text-gray-200 font-semibold">{selected.subject.nationality}</span></div>
                <div><span className="text-gray-500">Age/Sex:</span> <span className="text-gray-200 font-semibold">{selected.subject.age}{selected.subject.gender}</span></div>
                <div><span className="text-gray-500">Passport age:</span> <span className="font-semibold" style={{ color: selected.subject.passportAgeMonths < 4 ? '#C94A5E' : '#9CA3AF' }}>{selected.subject.passportAgeMonths}mo</span></div>
                <div><span className="text-gray-500">Route:</span> <span className="text-gray-200 font-semibold">{selected.subject.route}</span></div>
                <div><span className="text-gray-500">Ticket:</span> <span className="text-gray-200 font-semibold">{selected.subject.ticketType.replace('_', ' ')}</span></div>
                <div><span className="text-gray-500">Lead time:</span> <span className="font-semibold" style={{ color: selected.subject.bookingLeadHours < 6 ? '#C94A5E' : '#9CA3AF' }}>{selected.subject.bookingLeadHours}h</span></div>
              </div>
              {selected.facilitator && (
                <div className="mt-3 p-2 rounded-lg border" style={{ background: 'rgba(201,74,94,0.08)', borderColor: 'rgba(201,74,94,0.2)' }}>
                  <span className="text-xs text-red-400 font-bold"><i className="ri-user-follow-line mr-1" />Facilitator: </span>
                  <span className="text-xs text-gray-300">{selected.facilitator.name} ({selected.facilitator.nationality}) — {selected.facilitator.bookingRelation}</span>
                </div>
              )}
            </div>

            {/* Indicators checklist */}
            <div className="rounded-xl p-4 border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
              <SectionHeader icon="ri-checkbox-circle-line" title="Indicator Scoring" accentColor="#C94A5E" />
              <div className="space-y-1.5">
                {selected.indicators.map(ind => (
                  <div key={ind.code} className="flex items-start gap-2 py-1.5 px-2 rounded-lg" style={{ background: ind.detected ? `${RISK_BG[ind.severity]}` : 'rgba(255,255,255,0.01)' }}>
                    <i className={`${ind.detected ? 'ri-checkbox-circle-fill' : 'ri-checkbox-blank-circle-line'} text-sm flex-shrink-0 mt-0.5`}
                      style={{ color: ind.detected ? RISK_COLOR[ind.severity] : '#374151' }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-300 leading-snug">{ind.label}</div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: `${sourceColor[ind.source]}18`, color: sourceColor[ind.source] }}>{ind.source}</span>
                      {ind.detected && <RiskBadge level={ind.severity} />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="rounded-xl p-4 border" style={{ background: 'rgba(167,139,250,0.04)', borderColor: 'rgba(167,139,250,0.15)' }}>
              <div className="flex items-center gap-1.5 mb-2">
                <i className="ri-spy-line text-purple-400 text-sm" />
                <span className="text-purple-400 font-bold text-xs">Analyst Note · {selected.analyst}</span>
              </div>
              <p className="text-gray-300 text-xs leading-relaxed">{selected.notes}</p>
            </div>

            <CreateCaseButton
              label={`Create Case from ${selected.caseRef}`}
              onClick={() => setModal(draftFromTrafficking(selected))}
            />
          </div>
        )}
      </div>
      {modal && (
        <CaseCreationModal
          draft={modal}
          onClose={() => setModal(null)}
          onConfirm={() => { setModal(null); navigate('/dashboard/case-management'); }}
        />
      )}
    </div>
  );
}

// ── Tab: Document Anomaly ──────────────────────────────────────────────────────
function DocAnomalyTab() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<DocumentAnomaly | null>(documentAnomalies[0]);
  const [modal, setModal] = useState<CaseDraft | null>(null);
  const typeColor: Record<string, string> = {
    passport_swap: '#C94A5E',
    number_reuse: '#EF4444',
    biometric_mismatch: '#C98A1B',
    new_stamp_old_travel: '#FACC15',
    staged_doc_acquisition: '#A78BFA',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="space-y-2">
        <SectionHeader icon="ri-file-forbid-line" title="Document Anomalies" count={documentAnomalies.length} accentColor="#A78BFA" />
        {documentAnomalies.map(d => (
          <button key={d.id} onClick={() => setSelected(d)}
            className="w-full text-left rounded-xl p-4 border transition-all"
            style={{
              background: selected?.id === d.id ? RISK_BG[d.riskLevel] : 'rgba(255,255,255,0.02)',
              borderColor: selected?.id === d.id ? `${RISK_COLOR[d.riskLevel]}50` : 'rgba(255,255,255,0.06)',
            }}>
            <div className="flex items-center justify-between mb-1">
              <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ background: `${typeColor[d.type]}18`, color: typeColor[d.type] }}>{d.typeLabel}</span>
              <div className="flex items-center gap-1"><RiskBadge level={d.riskLevel} /><StatusBadge status={d.status} /></div>
            </div>
            <div className="text-white text-sm font-bold">{d.entryName}</div>
            <div className="text-gray-500 text-xs">{d.entryDocument} · {d.entryNationality}</div>
            {d.biometricSimilarity !== undefined && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500">Biometric similarity:</span>
                <span className="text-xs font-bold" style={{ color: d.biometricSimilarity > 85 ? '#C94A5E' : d.biometricSimilarity < 40 ? '#4ADE80' : '#C98A1B' }}>
                  {d.biometricSimilarity}%
                </span>
              </div>
            )}
            <div className="text-xs text-gray-600 mt-1 font-['JetBrains_Mono']">{d.detectedAt.replace('T', ' ')}</div>
          </button>
        ))}
      </div>

      <div>
        {selected && (
          <div className="space-y-3">
            <div className="rounded-xl p-4 border" style={{ background: RISK_BG[selected.riskLevel], borderColor: `${RISK_COLOR[selected.riskLevel]}30` }}>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded text-sm font-bold" style={{ background: `${typeColor[selected.type]}18`, color: typeColor[selected.type] }}>{selected.typeLabel}</span>
                <div className="flex items-center gap-2"><RiskBadge level={selected.riskLevel} /><StatusBadge status={selected.status} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg p-3 border" style={{ background: 'rgba(0,0,0,0.2)', borderColor: 'rgba(255,255,255,0.06)' }}>
                  <div className="text-xs text-gray-500 mb-1 font-semibold">Entry Document</div>
                  <div className="text-sm font-bold"><SubjectLink name={selected.entryName} /></div>
                  <div className="text-xs text-gray-400">{selected.entryDocument}</div>
                  <div className="text-xs text-gray-500">{selected.entryNationality} · Flight {selected.flightIn}</div>
                </div>
                {selected.exitDocument ? (
                  <div className="rounded-lg p-3 border" style={{ background: 'rgba(201,74,94,0.08)', borderColor: 'rgba(201,74,94,0.2)' }}>
                    <div className="text-xs text-red-400 mb-1 font-semibold">Exit Document</div>
                    <div className="text-sm font-bold">{selected.exitName && <SubjectLink name={selected.exitName} />}</div>
                    <div className="text-xs text-gray-400">{selected.exitDocument}</div>
                    <div className="text-xs text-gray-500">{selected.exitNationality} · Flight {selected.flightOut}</div>
                  </div>
                ) : (
                  <div className="rounded-lg p-3 border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
                    <div className="text-xs text-gray-500 mb-1 font-semibold">Zone / Flight Out</div>
                    <div className="text-white text-sm font-bold">{selected.transitZone}</div>
                    <div className="text-xs text-gray-400">Flight {selected.flightOut}</div>
                  </div>
                )}
              </div>
              {selected.biometricSimilarity !== undefined && (
                <div className="mt-3 p-3 rounded-lg border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">Biometric Similarity Score</span>
                    <span className="font-black text-lg" style={{ color: selected.biometricSimilarity > 85 ? '#C94A5E' : selected.biometricSimilarity < 40 ? '#4ADE80' : '#C98A1B' }}>{selected.biometricSimilarity}%</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-2 rounded-full" style={{ width: `${selected.biometricSimilarity}%`, background: selected.biometricSimilarity > 85 ? '#C94A5E' : selected.biometricSimilarity < 40 ? '#4ADE80' : '#C98A1B' }} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mt-0.5"><span>0%</span><span>75% threshold</span><span>100%</span></div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div><span className="text-gray-500">Confidence:</span> <span className="font-bold" style={{ color: RISK_COLOR[selected.riskLevel] }}>{selected.confidence}%</span></div>
                <div><span className="text-gray-500">Score:</span> <span className="font-bold" style={{ color: RISK_COLOR[selected.riskLevel] }}>{selected.riskScore}</span></div>
                <div className="col-span-2"><span className="text-gray-500">Detected:</span> <span className="text-gray-300 font-['JetBrains_Mono']">{selected.detectedAt.replace('T', ' ')}</span></div>
              </div>
            </div>

            <div className="rounded-xl p-4 border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-1.5 mb-2">
                <i className="ri-information-line text-blue-400 text-sm" />
                <span className="text-blue-400 font-bold text-xs">Detection Details</span>
              </div>
              <p className="text-gray-300 text-xs leading-relaxed">{selected.details}</p>
            </div>

            <div className="rounded-xl p-4 border" style={{ background: 'rgba(74,222,128,0.04)', borderColor: 'rgba(74,222,128,0.15)' }}>
              <div className="flex items-center gap-1.5 mb-2">
                <i className="ri-shield-check-line text-green-400 text-sm" />
                <span className="text-green-400 font-bold text-xs">Action Taken</span>
              </div>
              <p className="text-gray-300 text-xs leading-relaxed">{selected.actionTaken}</p>
            </div>

            <CreateCaseButton
              label={`Create Case from ${selected.id.toUpperCase()}`}
              onClick={() => setModal(draftFromDocAnomaly(selected))}
            />
          </div>
        )}
      </div>
      {modal && (
        <CaseCreationModal
          draft={modal}
          onClose={() => setModal(null)}
          onConfirm={() => { setModal(null); navigate('/dashboard/case-management'); }}
        />
      )}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function TravelPatternIntelligencePage() {
  const navigate = useNavigate();
  const { isAr } = useOutletContext<DashboardOutletContext>();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const tabs: { key: Tab; label: string; labelAr: string; icon: string; badge?: number }[] = [
    { key: 'overview',        label: 'Overview',                labelAr: 'نظرة عامة',          icon: 'ri-dashboard-line' },
    { key: 'co-traveler',     label: 'Co-Traveler Networks',    labelAr: 'شبكات المرافقين',     icon: 'ri-git-branch-line',  badge: coTravelerPairs.filter(p => p.riskLevel === 'critical').length },
    { key: 'route-sig',       label: 'Route Signatures',        labelAr: 'توقيعات المسارات',    icon: 'ri-route-line',       badge: routeSignatures.filter(r => r.riskLevel === 'critical').length },
    { key: 'transit-overlap', label: 'Transit Overlap',         labelAr: 'تداخل العبور',        icon: 'ri-time-line',        badge: transitOverlapEvents.filter(t => t.riskLevel === 'critical').length },
    { key: 'trafficking',     label: 'Trafficking Indicators',  labelAr: 'مؤشرات الاتجار',      icon: 'ri-user-forbid-line', badge: traffickingCases.filter(c => c.status === 'escalated').length },
    { key: 'doc-anomaly',     label: 'Document Anomaly',        labelAr: 'شذوذ الوثائق',        icon: 'ri-file-forbid-line', badge: documentAnomalies.filter(d => d.riskLevel === 'critical').length },
  ];

  return (
    <div className="min-h-screen font-['Inter']" style={{ background: '#051428' }} dir={isAr ? 'rtl' : 'ltr'}>
      {/* Grid texture */}
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(rgba(184,138,60,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(184,138,60,0.03) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      <PageHeader
        title={isAr ? 'استخبارات أنماط السفر' : 'Travel Pattern Intelligence'}
        icon="ri-node-tree"
        iconColor="#C94A5E"
        badge="Al-Ameen TPI"
        badgeColor="#C94A5E"
        crumbs={[{ label: isAr ? 'لوحة التحكم' : 'Dashboard', route: '/dashboard' }]}
        action={
          <div className="flex items-center gap-3">
            {tpiStats.criticalAlerts > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border" style={{ background: 'rgba(201,74,94,0.08)', borderColor: 'rgba(201,74,94,0.25)' }}>
                <i className="ri-alarm-warning-line text-red-400 text-xs" />
                <span className="text-red-400 text-xs font-bold">{tpiStats.criticalAlerts} CRITICAL</span>
              </div>
            )}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border" style={{ background: 'rgba(167,139,250,0.06)', borderColor: 'rgba(167,139,250,0.2)' }}>
              <i className="ri-shield-star-line text-purple-400 text-xs" />
              <span className="text-purple-400 text-xs font-semibold font-['JetBrains_Mono']">Police Internal</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border" style={{ background: 'rgba(74,222,128,0.06)', borderColor: 'rgba(74,222,128,0.2)' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-xs font-semibold font-['JetBrains_Mono']">LIVE</span>
            </div>
          </div>
        }
        isAr={isAr}
      />

      {/* Tab bar */}
      <div className="sticky top-[57px] z-30 flex items-center gap-1 px-6 py-2 border-b overflow-x-auto" style={{ background: 'rgba(5,20,40,0.9)', borderColor: 'rgba(184,138,60,0.08)', backdropFilter: 'blur(12px)' }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all relative"
            style={{
              background: activeTab === tab.key ? 'rgba(201,74,94,0.12)' : 'transparent',
              color: activeTab === tab.key ? '#C94A5E' : '#6B7280',
              border: `1px solid ${activeTab === tab.key ? 'rgba(201,74,94,0.3)' : 'transparent'}`,
            }}>
            <i className={tab.icon} />
            {isAr ? tab.labelAr : tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-xs font-black" style={{ background: '#C94A5E', color: 'white' }}>{tab.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-6 py-6 relative">
        {activeTab === 'overview'        && <OverviewTab />}
        {activeTab === 'co-traveler'     && <CoTravelerTab />}
        {activeTab === 'route-sig'       && <RouteSignatureTab />}
        {activeTab === 'transit-overlap' && <TransitOverlapTab />}
        {activeTab === 'trafficking'     && <TraffickingTab />}
        {activeTab === 'doc-anomaly'     && <DocAnomalyTab />}
      </div>
    </div>
  );
}
