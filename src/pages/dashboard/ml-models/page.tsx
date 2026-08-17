import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { DashboardOutletContext } from '../DashboardLayout';
import type { MLModel, ModelStatus, ModelType, TrainingDataExport } from '@/mocks/mlModelsData';
import { ML_MODELS, STATUS_COLORS, MODEL_TYPE_CONFIG } from '@/mocks/mlModelsData';

// ── Confusion Matrix ──────────────────────────────────────────
function ConfusionMatrix({ m, isAr }: { m: { tp: number; fp: number; fn: number; tn: number }; isAr: boolean }) {
  const total = m.tp + m.fp + m.fn + m.tn;
  const cell = (val: number, bg: string, label: string) => (
    <div style={{ padding: '10px 8px', textAlign: 'center', background: bg, borderRadius: 4, flex: 1 }}>
      <div style={{ fontSize: 18, fontFamily: "'JetBrains Mono', monospace", color: '#CBD5E1', fontWeight: 700, lineHeight: 1 }}>{val}</div>
      <div style={{ fontSize: 9, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ fontSize: 9, color: '#374B61', fontFamily: "'JetBrains Mono', monospace", marginTop: 1 }}>{(val / total * 100).toFixed(1)}%</div>
    </div>
  );
  return (
    <div>
      <div style={{ fontSize: 10, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
        {isAr ? 'مصفوفة الارتباك' : 'Confusion Matrix'}
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
        {cell(m.tp, 'rgba(74,142,90,0.12)',  isAr ? 'إيجابي صحيح' : 'True Pos')}
        {cell(m.fp, 'rgba(212,146,42,0.12)', isAr ? 'إيجابي خاطئ' : 'False Pos')}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {cell(m.fn, 'rgba(201,74,94,0.12)',  isAr ? 'سلبي خاطئ' : 'False Neg')}
        {cell(m.tn, 'rgba(74,122,168,0.12)', isAr ? 'سلبي صحيح' : 'True Neg')}
      </div>
    </div>
  );
}

// ── Metric Bar ────────────────────────────────────────────────
function MetricBar({ label, value, color = '#B8893C' }: { label: string; value: number; color?: string }) {
  const pct = Math.round(value * 100);
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontSize: 10, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
        <span style={{ fontSize: 11, color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{pct}%</span>
      </div>
      <div style={{ height: 5, borderRadius: 2.5, background: 'rgba(255,255,255,0.06)' }}>
        <div style={{ width: `${pct}%`, height: '100%', borderRadius: 2.5, background: color }} />
      </div>
    </div>
  );
}

// ── Export Row ────────────────────────────────────────────────
function ExportRow({ exp, isAr }: { exp: TrainingDataExport; isAr: boolean }) {
  const STATUS_ICON: Record<string, string> = { DONE: 'ri-check-line', RUNNING: 'ri-loader-4-line', PENDING: 'ri-time-line', ERROR: 'ri-error-warning-line', IDLE: 'ri-circle-line' };
  const STATUS_COLOR: Record<string, string> = { DONE: '#4A8E5A', RUNNING: '#D4922A', PENDING: '#5B7494', ERROR: '#C94A5E', IDLE: '#374B61' };
  const col = STATUS_COLOR[exp.status];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
      <i className={STATUS_ICON[exp.status]} style={{ color: col, fontSize: 13, flexShrink: 0, animation: exp.status === 'RUNNING' ? 'spin 1s linear infinite' : 'none' }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, color: '#CBD5E1', fontFamily: "'JetBrains Mono', monospace" }}>{exp.requestedBy} · {exp.requestedAt.slice(0, 10)}</div>
        {exp.recordCount && (
          <div style={{ fontSize: 10, color: '#374B61', fontFamily: "'JetBrains Mono', monospace", marginTop: 1 }}>
            {exp.recordCount.toLocaleString()} {isAr ? 'سجل' : 'records'} · {exp.fileSizeMb} MB
          </div>
        )}
      </div>
      <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, background: `${col}18`, color: col, fontFamily: "'JetBrains Mono', monospace", border: `1px solid ${col}33`, textTransform: 'uppercase', flexShrink: 0 }}>{exp.status}</span>
    </div>
  );
}

// ── Model Detail Panel ────────────────────────────────────────
function ModelDetail({ model, isAr, onClose }: { model: MLModel; isAr: boolean; onClose: () => void }) {
  const [exportLoading, setExportLoading] = useState(false);
  const statusCol = STATUS_COLORS[model.status];
  const typeCfg   = MODEL_TYPE_CONFIG[model.type];

  const requestExport = () => {
    setExportLoading(true);
    setTimeout(() => setExportLoading(false), 1000);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', borderLeft: '1px solid rgba(184,138,60,0.08)', background: 'rgba(5,20,40,0.6)' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(184,138,60,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 13, color: '#CBD5E1', fontFamily: "'Inter', sans-serif", fontWeight: 600, marginBottom: 4 }}>
            {isAr && model.nameAr ? model.nameAr : model.name}
          </div>
          <div style={{ display: 'flex', gap: 7, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 3, background: `${typeCfg.color}18`, color: typeCfg.color, fontFamily: "'JetBrains Mono', monospace", border: `1px solid ${typeCfg.color}33` }}>
              <i className={typeCfg.icon} style={{ marginRight: 4 }} />{typeCfg.labelEn}
            </span>
            <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, background: `${statusCol}18`, color: statusCol, fontFamily: "'JetBrains Mono', monospace", border: `1px solid ${statusCol}33`, textTransform: 'uppercase' }}>
              {model.status}
            </span>
            <span style={{ fontSize: 10, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace" }}>v{model.version}</span>
            <span style={{ fontSize: 10, color: '#374B61', fontFamily: "'JetBrains Mono', monospace" }}>{model.framework}</span>
          </div>
        </div>
        <button onClick={onClose} style={{ padding: '5px 8px', borderRadius: 4, background: 'transparent', border: '1px solid rgba(184,138,60,0.15)', color: '#5B7494', cursor: 'pointer', fontSize: 14 }}>
          <i className="ri-close-line" />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Description */}
        <div style={{ fontSize: 12, color: '#8FA8C0', fontFamily: "'Inter', sans-serif", lineHeight: 1.6 }}>{model.description}</div>

        {/* Features */}
        <div>
          <div style={{ fontSize: 10, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7 }}>
            {isAr ? 'المدخلات' : 'Input Features'} ({model.inputFeatures.length})
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {model.inputFeatures.map(f => (
              <span key={f} style={{ padding: '2px 7px', borderRadius: 3, fontSize: 10, background: 'rgba(184,138,60,0.08)', color: '#D6B47E', fontFamily: "'JetBrains Mono', monospace", border: '1px solid rgba(184,138,60,0.15)' }}>{f}</span>
            ))}
          </div>
          <div style={{ marginTop: 6, fontSize: 10, color: '#374B61', fontFamily: "'JetBrains Mono', monospace" }}>
            {isAr ? 'المتغير المستهدف: ' : 'Target: '}<span style={{ color: '#B8893C' }}>{model.targetVariable}</span>
          </div>
        </div>

        {/* Metrics */}
        {model.metrics ? (
          <div>
            <div style={{ fontSize: 10, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
              {isAr ? 'مقاييس الأداء' : 'Performance Metrics'}
            </div>
            <MetricBar label="Accuracy"  value={model.metrics.accuracy}  color="#4A8E5A" />
            <MetricBar label="Precision" value={model.metrics.precision} color="#D4922A" />
            <MetricBar label="Recall"    value={model.metrics.recall}    color="#4A7AA8" />
            <MetricBar label="F1 Score"  value={model.metrics.f1}        color="#A78BFA" />
            <MetricBar label="AUC"       value={model.metrics.auc}       color="#B8893C" />

            <div style={{ display: 'flex', gap: 12, margin: '8px 0', fontSize: 10, color: '#374B61', fontFamily: "'JetBrains Mono', monospace" }}>
              <span>{isAr ? 'تدريب: ' : 'Train: '}{model.metrics.trainingSamples.toLocaleString()}</span>
              <span>{isAr ? 'اختبار: ' : 'Test: '}{model.metrics.testSamples.toLocaleString()}</span>
              <span>{isAr ? 'تقييم: ' : 'Evaluated: '}{model.metrics.evaluatedAt.slice(0, 10)}</span>
            </div>

            <ConfusionMatrix m={model.metrics.matrix} isAr={isAr} />
          </div>
        ) : (
          <div style={{ padding: '14px', borderRadius: 6, background: 'rgba(212,146,42,0.06)', border: '1px solid rgba(212,146,42,0.15)', fontSize: 12, color: '#D4922A', fontFamily: "'Inter', sans-serif" }}>
            <i className="ri-loader-4-line" style={{ marginRight: 8 }} />
            {isAr ? 'التدريب جارٍ — المقاييس ستتوفر بعد الانتهاء' : 'Model in training — metrics will be available after training completes'}
            {model.notes && <div style={{ marginTop: 6, color: '#5B7494', fontSize: 11 }}>{model.notes}</div>}
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'flex', gap: 14, padding: '8px 0', borderTop: '1px solid rgba(184,138,60,0.06)' }}>
          <span style={{ fontSize: 11, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace" }}>
            <i className="ri-cpu-line" style={{ color: '#B8893C', marginRight: 5 }} />{model.predictionCount.toLocaleString()} {isAr ? 'تنبؤ' : 'predictions'}
          </span>
          {model.deployedAt && (
            <span style={{ fontSize: 11, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace" }}>
              <i className="ri-rocket-line" style={{ marginRight: 5 }} />{model.deployedAt.slice(0, 10)}
            </span>
          )}
        </div>

        {/* Training Data Exports */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ fontSize: 10, color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              {isAr ? 'تصدير بيانات التدريب' : 'Training Data Exports'}
            </div>
            <button
              onClick={requestExport}
              disabled={exportLoading}
              style={{ padding: '4px 10px', borderRadius: 3, background: 'rgba(74,122,168,0.1)', border: '1px solid rgba(74,122,168,0.25)', color: '#4A7AA8', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, cursor: exportLoading ? 'default' : 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 5 }}
            >
              {exportLoading ? <><i className="ri-loader-4-line" style={{ animation: 'spin 1s linear infinite' }} />{isAr ? 'جاري…' : 'Requesting…'}</> : <><i className="ri-download-cloud-line" />{isAr ? 'طلب تصدير' : 'Request Export'}</>}
            </button>
          </div>
          {model.exports.length === 0 ? (
            <div style={{ fontSize: 11, color: '#374B61', fontFamily: "'JetBrains Mono', monospace" }}>{isAr ? 'لا يوجد' : 'No exports yet'}</div>
          ) : (
            model.exports.map(e => <ExportRow key={e.id} exp={e} isAr={isAr} />)
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(184,138,60,0.08)', display: 'flex', gap: 6 }}>
        <button style={{ flex: 1, padding: '7px', borderRadius: 4, background: 'rgba(74,122,168,0.1)', border: '1px solid rgba(74,122,168,0.25)', color: '#4A7AA8', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <i className="ri-edit-line" style={{ marginRight: 5 }} />{isAr ? 'تعديل' : 'Edit Settings'}
        </button>
        {model.status === 'DEPLOYED' && (
          <button style={{ flex: 1, padding: '7px', borderRadius: 4, background: 'rgba(55,75,97,0.2)', border: '1px solid rgba(55,75,97,0.3)', color: '#5B7494', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <i className="ri-shut-down-line" style={{ marginRight: 5 }} />{isAr ? 'إيقاف' : 'Retire'}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function MLModelsPage() {
  const { isAr } = useOutletContext<DashboardOutletContext>();
  const [selected,   setSelected]   = useState<MLModel | null>(null);
  const [typeFilter, setTypeFilter] = useState<ModelType | ''>('');
  const [statusFilter, setStatusFilter] = useState<ModelStatus | ''>('');

  const filtered = ML_MODELS.filter(m => {
    if (typeFilter   && m.type   !== typeFilter)   return false;
    if (statusFilter && m.status !== statusFilter) return false;
    return true;
  });

  const chipStyle = (active: boolean, color = '#B8893C'): React.CSSProperties => ({
    padding: '4px 10px', borderRadius: 4, fontSize: 10, cursor: 'pointer', background: 'transparent',
    fontFamily: "'JetBrains Mono', monospace", border: `1px solid ${active ? color : 'rgba(184,138,60,0.15)'}`,
    color: active ? color : '#5B7494', textTransform: 'uppercase',
  });

  const deployed  = ML_MODELS.filter(m => m.status === 'DEPLOYED').length;
  const training  = ML_MODELS.filter(m => m.status === 'TRAINING').length;
  const totalPred = ML_MODELS.reduce((s, m) => s + m.predictionCount, 0);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#051428', overflow: 'hidden', position: 'relative' }}>
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: 'linear-gradient(rgba(184,138,60,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(184,138,60,0.025) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '16px 24px 12px', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <i className="ri-brain-line" style={{ color: '#B8893C', fontSize: 16 }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#B8893C', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                {isAr ? 'نماذج ML لتقييم المخاطر' : 'ML Risk Assessment Models'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 18, marginTop: 8 }}>
              {[
                { val: ML_MODELS.length, label: isAr ? 'نماذج' : 'models',      icon: 'ri-cpu-line',         color: '#5B7494' },
                { val: deployed,         label: isAr ? 'مُنشر' : 'deployed',     icon: 'ri-rocket-line',      color: '#4A8E5A' },
                { val: training,         label: isAr ? 'يتدرب' : 'training',     icon: 'ri-loader-4-line',    color: '#D4922A' },
                { val: totalPred.toLocaleString(), label: isAr ? 'تنبؤ' : 'predictions', icon: 'ri-flashlight-line', color: '#B8893C' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <i className={s.icon} style={{ color: s.color, fontSize: 13 }} />
                  <span style={{ fontSize: typeof s.val === 'string' ? 14 : 17, fontFamily: "'JetBrains Mono', monospace", color: s.color, fontWeight: 700, lineHeight: 1 }}>{s.val}</span>
                  <span style={{ fontSize: 10, color: '#374B61', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase' }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
          <button style={{ padding: '8px 14px', borderRadius: 4, background: 'rgba(184,138,60,0.12)', border: '1px solid rgba(184,138,60,0.3)', color: '#D6B47E', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 6 }}>
            <i className="ri-add-line" />{isAr ? 'نموذج جديد' : 'Add Model'}
          </button>
        </div>

        {/* Filters */}
        <div style={{ padding: '8px 24px', borderBottom: '1px solid rgba(184,138,60,0.08)', flexShrink: 0, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {(['CLASSIFICATION', 'REGRESSION', 'ANOMALY', 'NLP'] as ModelType[]).map(t => {
            const cfg = MODEL_TYPE_CONFIG[t];
            return <button key={t} onClick={() => setTypeFilter(prev => prev === t ? '' : t)} style={chipStyle(typeFilter === t, cfg.color)}><i className={cfg.icon} style={{ marginRight: 4 }} />{cfg.labelEn}</button>;
          })}
          {(['DEPLOYED', 'TRAINING', 'DRAFT', 'RETIRED', 'FAILED'] as ModelStatus[]).map(s => (
            <button key={s} onClick={() => setStatusFilter(prev => prev === s ? '' : s)} style={chipStyle(statusFilter === s, STATUS_COLORS[s])}>{s}</button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Model cards */}
          <div style={{ flex: selected ? '0 0 44%' : 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map(m => {
              const statusCol = STATUS_COLORS[m.status];
              const typeCfg   = MODEL_TYPE_CONFIG[m.type];
              const isSel     = selected?.id === m.id;
              return (
                <div key={m.id} onClick={() => setSelected(prev => prev?.id === m.id ? null : m)} style={{ padding: '14px', borderRadius: 6, background: isSel ? 'rgba(184,138,60,0.06)' : 'rgba(255,255,255,0.02)', border: `1px solid ${isSel ? 'rgba(184,138,60,0.3)' : 'rgba(184,138,60,0.08)'}`, cursor: 'pointer', transition: 'border-color 0.15s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div>
                      <div style={{ fontSize: 12, color: '#CBD5E1', fontFamily: "'Inter', sans-serif", fontWeight: 600, marginBottom: 3 }}>
                        {isAr && m.nameAr ? m.nameAr : m.name}
                      </div>
                      <div style={{ display: 'flex', gap: 7, alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 3, background: `${typeCfg.color}18`, color: typeCfg.color, fontFamily: "'JetBrains Mono', monospace", border: `1px solid ${typeCfg.color}33` }}>
                          <i className={typeCfg.icon} style={{ marginRight: 3 }} />{typeCfg.labelEn}
                        </span>
                        <span style={{ fontSize: 10, color: '#374B61', fontFamily: "'JetBrains Mono', monospace" }}>v{m.version}</span>
                        <span style={{ fontSize: 10, color: '#374B61', fontFamily: "'JetBrains Mono', monospace" }}>{m.framework}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 3, background: `${statusCol}18`, color: statusCol, fontFamily: "'JetBrains Mono', monospace", border: `1px solid ${statusCol}33`, textTransform: 'uppercase', alignSelf: 'flex-start', whiteSpace: 'nowrap' }}>
                      {m.status}
                    </span>
                  </div>

                  {/* Metrics mini-row */}
                  {m.metrics && (
                    <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
                      {[
                        { label: 'ACC', val: m.metrics.accuracy },
                        { label: 'PREC', val: m.metrics.precision },
                        { label: 'REC', val: m.metrics.recall },
                        { label: 'AUC', val: m.metrics.auc },
                      ].map(s => (
                        <div key={s.label} style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 13, fontFamily: "'JetBrains Mono', monospace", color: '#B8893C', fontWeight: 700, lineHeight: 1 }}>{(s.val * 100).toFixed(0)}%</div>
                          <div style={{ fontSize: 8, color: '#374B61', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', marginTop: 2 }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {m.status === 'TRAINING' && m.notes && (
                    <div style={{ fontSize: 10, color: '#D4922A', fontFamily: "'JetBrains Mono', monospace", marginBottom: 6 }}>
                      <i className="ri-loader-4-line" style={{ marginRight: 5 }} />{m.notes}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#374B61', fontFamily: "'JetBrains Mono', monospace" }}>
                    <span><i className="ri-cpu-line" style={{ marginRight: 4 }} />{m.predictionCount.toLocaleString()} {isAr ? 'تنبؤ' : 'predictions'}</span>
                    {m.lastPrediction && <span>{isAr ? 'آخر: ' : 'last: '}{m.lastPrediction.slice(0, 10)}</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detail panel */}
          {selected && (
            <div style={{ flex: '0 0 56%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <ModelDetail model={selected} isAr={isAr} onClose={() => setSelected(null)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
