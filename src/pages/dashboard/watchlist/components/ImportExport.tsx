import { useState, useRef } from 'react';

interface Props {
  isAr: boolean;
}

interface Attachment {
  id: string;
  name: string;
  type: 'WARRANT' | 'PHOTO' | 'REPORT' | 'COURT_ORDER';
  targetId: string;
  uploaded: string;
  size: string;
  status: 'VERIFIED' | 'PENDING' | 'REJECTED';
}

const importSources = [
  { id: 'nl-sanctions', name: 'Netherlands Sanctions List', nameAr: 'قائمة العقوبات الهولندية', icon: 'ri-flag-line', color: '#F97316', status: 'connected', lastSync: '2026-08-18 06:00', records: 485 },
  { id: 'interpol-rn', name: 'Interpol Red Notices', nameAr: 'نشرات الإنتربول الحمراء', icon: 'ri-alarm-warning-line', color: '#EF4444', status: 'connected', lastSync: '2026-08-18 08:00', records: 6842 },
  { id: 'interpol', name: 'Interpol MIND Database', nameAr: 'قاعدة بيانات الإنتربول MIND', icon: 'ri-global-line', color: '#A78BFA', status: 'connected', lastSync: '2025-04-06 06:00', records: 234 },
  { id: 'immigration', name: 'Immigration System', nameAr: 'نظام الهجرة', icon: 'ri-passport-line', color: '#60A5FA', status: 'connected', lastSync: '2025-04-06 08:30', records: 1203 },
  { id: 'gcc', name: 'GCC Security Network', nameAr: 'شبكة أمن دول الخليج', icon: 'ri-shield-line', color: '#4ADE80', status: 'connected', lastSync: '2025-04-05 22:00', records: 89 },
  { id: 'un', name: 'UN Sanctions List', nameAr: 'قائمة عقوبات الأمم المتحدة', icon: 'ri-building-line', color: '#FACC15', status: 'pending', lastSync: '2025-04-04 12:00', records: 45 },
  { id: 'fatf', name: 'FATF High-Risk Countries', nameAr: 'دول FATF عالية المخاطر', icon: 'ri-money-dollar-circle-line', color: '#C98A1B', status: 'connected', lastSync: '2025-04-06 00:00', records: 12 },
];

const exportFormats = [
  { id: 'pdf', label: 'Redacted PDF (Field Ops)', labelAr: 'PDF مُعدَّل (عمليات الميدان)', icon: 'ri-file-pdf-line', color: '#C94A5E' },
  { id: 'csv', label: 'CSV Export (Document Numbers)', labelAr: 'تصدير CSV (أرقام الوثائق)', icon: 'ri-file-excel-line', color: '#4ADE80' },
  { id: 'json', label: 'JSON (API Integration)', labelAr: 'JSON (تكامل API)', icon: 'ri-code-s-slash-line', color: '#D6B47E' },
  { id: 'encrypted', label: 'Encrypted Package (Secure Share)', labelAr: 'حزمة مشفرة (مشاركة آمنة)', icon: 'ri-lock-line', color: '#A78BFA' },
];

const syncHistory = [
  { source: 'Netherlands Sanctions List', time: '2026-08-18 06:00', added: 5, updated: 480, removed: 0, status: 'success' },
  { source: 'Interpol Red Notices', time: '2026-08-18 08:00', added: 5, updated: 6837, removed: 0, status: 'success' },
  { source: 'Interpol MIND', time: '2025-04-06 06:00', added: 3, updated: 12, removed: 1, status: 'success' },
  { source: 'Immigration System', time: '2025-04-06 08:30', added: 28, updated: 45, removed: 0, status: 'success' },
  { source: 'GCC Security Network', time: '2025-04-05 22:00', added: 0, updated: 5, removed: 2, status: 'success' },
  { source: 'UN Sanctions List', time: '2025-04-04 12:00', added: 0, updated: 0, removed: 0, status: 'failed' },
  { source: 'FATF High-Risk Countries', time: '2025-04-06 00:00', added: 0, updated: 2, removed: 0, status: 'success' },
];

const initialAttachments: Attachment[] = [
  { id: 'ATT-001', name: 'interpol_notice_TGT0047.pdf', type: 'WARRANT',     targetId: 'TGT-0047', uploaded: '2026-08-17 09:14', size: '842 KB',  status: 'VERIFIED' },
  { id: 'ATT-002', name: 'photo_evidence_TGT0089.jpg',  type: 'PHOTO',       targetId: 'TGT-0089', uploaded: '2026-08-17 14:22', size: '1.2 MB',  status: 'VERIFIED' },
  { id: 'ATT-003', name: 'court_order_TGT0112.pdf',     type: 'COURT_ORDER', targetId: 'TGT-0112', uploaded: '2026-08-18 08:05', size: '315 KB',  status: 'PENDING' },
];

const typeBadgeColors: Record<Attachment['type'], string> = {
  WARRANT:     '#A78BFA',
  PHOTO:       '#60A5FA',
  REPORT:      '#D6B47E',
  COURT_ORDER: '#2DD4BF',
};

const statusBadgeColors: Record<Attachment['status'], string> = {
  VERIFIED: '#4A8E5A',
  PENDING:  '#D4922A',
  REJECTED: '#C94A5E',
};

type UploadState = 'idle' | 'processing' | 'done';
interface UploadResult { fileName: string; total: number; added: number; updated: number; errors: number; source: string; }

const ImportExport = ({ isAr }: Props) => {
  const [activeTab, setActiveTab] = useState<'import' | 'export' | 'sync' | 'attachments'>('import');
  const [dragOver, setDragOver] = useState(false);
  const [attachDragOver, setAttachDragOver] = useState(false);
  const [selectedExport, setSelectedExport] = useState<string[]>([]);
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [exportWatchlist, setExportWatchlist] = useState('all');
  const [attachments, setAttachments] = useState<Attachment[]>(initialAttachments);
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateUpload = (fileName: string) => {
    setUploadState('processing');
    setUploadProgress(0);
    const nameLower = fileName.toLowerCase();
    const isNL = nameLower.includes('nether') || nameLower.includes('sanction') || nameLower.includes('nl_') || nameLower.includes('nl-');
    const isInterpol = nameLower.includes('interpol') || nameLower.includes('red_notice') || nameLower.includes('red-notice');
    const result: UploadResult = isNL
      ? { fileName, total: 485, added: 5, updated: 480, errors: 0, source: 'Netherlands Sanctions List' }
      : isInterpol
      ? { fileName, total: 6842, added: 5, updated: 6837, errors: 0, source: 'Interpol Red Notices' }
      : { fileName, total: 312, added: 12, updated: 298, errors: 2, source: 'External List' };
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.floor(Math.random() * 18) + 8;
      if (prog >= 100) {
        prog = 100;
        clearInterval(interval);
        setUploadProgress(100);
        setTimeout(() => { setUploadState('done'); setUploadResult(result); }, 300);
      } else {
        setUploadProgress(prog);
      }
    }, 120);
  };

  // Validation rule toggles
  const [validationRules, setValidationRules] = useState({
    docNumberFormat: true,
    duplicateDetection: true,
    fuzzyMatchThreshold: 85,
    mandatoryFields: true,
  });

  const toggleExportWl = (id: string) => {
    setSelectedExport(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleRule = (key: 'docNumberFormat' | 'duplicateDetection' | 'mandatoryFields') => {
    setValidationRules(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAttachDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setAttachDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    addAttachmentFiles(files);
  };

  const addAttachmentFiles = (files: File[]) => {
    const newAttachments: Attachment[] = files
      .filter(f => /\.(pdf|jpg|jpeg|png|docx)$/i.test(f.name))
      .filter(f => f.size <= 25 * 1024 * 1024)
      .map((f, i) => ({
        id: `ATT-${String(attachments.length + i + 1).padStart(3, '0')}`,
        name: f.name,
        type: f.name.toLowerCase().endsWith('.jpg') || f.name.toLowerCase().endsWith('.jpeg') || f.name.toLowerCase().endsWith('.png') ? 'PHOTO' : 'REPORT',
        targetId: 'TGT-XXXX',
        uploaded: new Date().toISOString().slice(0, 16).replace('T', ' '),
        size: f.size > 1024 * 1024 ? `${(f.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(f.size / 1024)} KB`,
        status: 'PENDING',
      }));
    if (newAttachments.length > 0) {
      setAttachments(prev => [...prev, ...newAttachments]);
    }
  };

  const deleteAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const tabs = [
    { key: 'import',       label: 'Import Sources',  labelAr: 'مصادر الاستيراد' },
    { key: 'export',       label: 'Export',           labelAr: 'التصدير' },
    { key: 'sync',         label: 'Sync History',     labelAr: 'سجل المزامنة' },
    { key: 'attachments',  label: 'Attachments',      labelAr: 'المرفقات' },
  ];

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit"
        style={{ background: 'rgba(10,37,64,0.8)', border: '1px solid rgba(184,138,60,0.1)' }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className="px-4 py-2 rounded-lg text-sm font-semibold font-['Inter'] whitespace-nowrap cursor-pointer transition-all"
            style={{
              background: activeTab === tab.key ? '#D6B47E' : 'transparent',
              color: activeTab === tab.key ? '#051428' : '#9CA3AF',
            }}>
            {isAr ? tab.labelAr : tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'import' && (
        <div className="space-y-4">
          {/* CSV Upload */}
          {uploadState === 'idle' && (
            <div
              className="rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all"
              style={{
                background: dragOver ? 'rgba(184,138,60,0.08)' : 'rgba(10,37,64,0.6)',
                border: `2px dashed ${dragOver ? '#D6B47E' : 'rgba(184,138,60,0.2)'}`,
              }}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) simulateUpload(f.name); }}>
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl mb-4"
                style={{ background: 'rgba(184,138,60,0.1)' }}>
                <i className="ri-upload-cloud-2-line text-2xl" style={{ color: '#D6B47E' }} />
              </div>
              <p className="text-white font-semibold font-['Inter'] text-base mb-1">
                {isAr ? 'رفع قائمة الأهداف' : 'Upload Target List'}
              </p>
              <p className="text-gray-400 text-sm font-['Inter'] mb-1">
                {isAr ? 'اسحب وأفلت ملف قائمة العقوبات أو نشرات الإنتربول (CSV / XML / JSON)' : 'Drag & drop a sanctions list or Interpol Red Notices file (CSV / XML / JSON)'}
              </p>
              <p className="text-gray-600 text-xs font-['JetBrains_Mono'] mb-4">
                Netherlands Sanctions List · Interpol Red Notices · UN Consolidated List · Custom CSV
              </p>
              <div className="flex items-center gap-3">
                <label className="px-4 py-2 rounded-xl text-sm font-semibold font-['Inter'] whitespace-nowrap cursor-pointer"
                  style={{ background: '#D6B47E', color: '#051428' }}>
                  <i className="ri-folder-open-line mr-2" />{isAr ? 'اختر ملفاً' : 'Browse File'}
                  <input ref={fileInputRef} type="file" accept=".csv,.xml,.json" className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) simulateUpload(f.name); e.target.value = ''; }} />
                </label>
                <button className="px-4 py-2 rounded-xl text-sm font-semibold font-['Inter'] whitespace-nowrap cursor-pointer"
                  style={{ border: '1px solid rgba(184,138,60,0.3)', color: '#D6B47E' }}>
                  <i className="ri-download-line mr-2" />{isAr ? 'تحميل القالب' : 'Download Template'}
                </button>
              </div>
              <p className="text-gray-600 text-xs font-['JetBrains_Mono'] mt-3">
                {isAr ? 'الحقول المطلوبة: document_number, doc_type, reason' : 'Required fields: document_number, doc_type, reason'}
              </p>
            </div>
          )}

          {uploadState === 'processing' && (
            <div className="rounded-2xl p-8 flex flex-col items-center justify-center text-center"
              style={{ background: 'rgba(10,37,64,0.6)', border: '2px dashed rgba(184,138,60,0.3)' }}>
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl mb-4"
                style={{ background: 'rgba(184,138,60,0.1)' }}>
                <i className="ri-loader-4-line text-2xl animate-spin" style={{ color: '#D6B47E' }} />
              </div>
              <p className="text-white font-semibold font-['Inter'] text-base mb-1">
                {isAr ? 'جارٍ المعالجة…' : 'Processing list…'}
              </p>
              <p className="text-gray-400 text-sm font-['Inter'] mb-4">
                {isAr ? 'التحقق من السجلات وتطبيق قواعد التحقق' : 'Validating records and applying validation rules'}
              </p>
              <div className="w-64 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full transition-all duration-200"
                  style={{ width: `${uploadProgress}%`, background: 'linear-gradient(to right, rgba(214,180,126,0.6), #D6B47E)' }} />
              </div>
              <p className="text-xs font-['JetBrains_Mono'] mt-2" style={{ color: '#D6B47E' }}>{uploadProgress}%</p>
            </div>
          )}

          {uploadState === 'done' && uploadResult && (
            <div className="rounded-2xl p-6 space-y-4"
              style={{ background: 'rgba(10,37,64,0.6)', border: '2px solid rgba(74,222,128,0.3)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{ background: 'rgba(74,222,128,0.1)' }}>
                  <i className="ri-check-double-line text-xl text-green-400" />
                </div>
                <div>
                  <p className="text-white font-semibold font-['Inter'] text-sm">
                    {isAr ? 'اكتمل الاستيراد' : 'Import Complete'}
                  </p>
                  <p className="text-gray-400 text-xs font-['JetBrains_Mono']">{uploadResult.fileName}</p>
                </div>
                <button onClick={() => { setUploadState('idle'); setUploadResult(null); setUploadProgress(0); }}
                  className="ml-auto px-3 py-1.5 rounded-lg text-xs font-semibold font-['Inter'] cursor-pointer"
                  style={{ border: '1px solid rgba(184,138,60,0.3)', color: '#D6B47E' }}>
                  {isAr ? 'رفع جديد' : 'Upload Another'}
                </button>
              </div>
              <div className="rounded-xl p-4 grid grid-cols-4 gap-4" style={{ background: 'rgba(5,20,40,0.6)' }}>
                {[
                  { label: isAr ? 'إجمالي السجلات' : 'Total Records', value: uploadResult.total.toLocaleString(), color: '#D6B47E' },
                  { label: isAr ? 'أهداف جديدة' : 'New Targets', value: `+${uploadResult.added}`, color: '#4ADE80' },
                  { label: isAr ? 'محدَّث' : 'Updated', value: `~${uploadResult.updated.toLocaleString()}`, color: '#60A5FA' },
                  { label: isAr ? 'أخطاء' : 'Errors', value: String(uploadResult.errors), color: uploadResult.errors > 0 ? '#C94A5E' : '#6B7280' },
                ].map(stat => (
                  <div key={stat.label} className="text-center">
                    <p className="text-lg font-black font-['JetBrains_Mono']" style={{ color: stat.color }}>{stat.value}</p>
                    <p className="text-gray-500 text-xs font-['Inter'] mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.15)' }}>
                <i className="ri-shield-check-line text-green-400 text-sm" />
                <p className="text-green-400 text-xs font-['Inter']">
                  {isAr
                    ? `تمت إضافة ${uploadResult.added} هدفاً جديداً إلى ${uploadResult.source} بنجاح`
                    : `${uploadResult.added} new targets added to ${uploadResult.source} successfully`}
                </p>
              </div>
            </div>
          )}

          {/* External Sources */}
          <h3 className="text-white font-semibold font-['Inter'] text-sm">
            {isAr ? 'المصادر الخارجية' : 'External Import Sources'}
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {importSources.map(src => (
              <div key={src.id} className="rounded-xl p-4 flex items-center gap-4"
                style={{ background: 'rgba(10,37,64,0.8)', border: '1px solid rgba(184,138,60,0.12)' }}>
                <div className="w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{ background: `${src.color}18` }}>
                  <i className={`${src.icon} text-lg`} style={{ color: src.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white text-sm font-semibold font-['Inter']">
                      {isAr ? src.nameAr : src.name}
                    </p>
                    <span className="text-xs px-2 py-0.5 rounded-full font-['JetBrains_Mono']"
                      style={{
                        background: src.status === 'connected' ? 'rgba(74,222,128,0.15)' : 'rgba(250,204,21,0.15)',
                        color: src.status === 'connected' ? '#4ADE80' : '#FACC15',
                      }}>
                      {src.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500 font-['JetBrains_Mono']">
                    <span><i className="ri-time-line mr-1" />{src.lastSync}</span>
                    <span><i className="ri-user-line mr-1" />{src.records} records</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-lg text-xs font-semibold font-['Inter'] whitespace-nowrap cursor-pointer"
                    style={{ background: 'rgba(184,138,60,0.1)', color: '#D6B47E', border: '1px solid rgba(184,138,60,0.2)' }}>
                    <i className="ri-refresh-line mr-1" />{isAr ? 'مزامنة' : 'Sync Now'}
                  </button>
                  <button className="px-3 py-1.5 rounded-lg text-xs font-semibold font-['Inter'] whitespace-nowrap cursor-pointer"
                    style={{ border: '1px solid rgba(184,138,60,0.15)', color: '#9CA3AF' }}>
                    <i className="ri-settings-line mr-1" />{isAr ? 'إعداد' : 'Config'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'export' && (
        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-4">
            <div className="rounded-xl p-4"
              style={{ background: 'rgba(10,37,64,0.8)', border: '1px solid rgba(184,138,60,0.12)' }}>
              <h3 className="text-white font-semibold font-['Inter'] text-sm mb-3">
                {isAr ? 'تنسيق التصدير' : 'Export Format'}
              </h3>
              <div className="space-y-2">
                {exportFormats.map(fmt => (
                  <button key={fmt.id} onClick={() => setSelectedFormat(fmt.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all text-left"
                    style={{
                      background: selectedFormat === fmt.id ? `${fmt.color}12` : 'rgba(5,20,40,0.5)',
                      border: `1px solid ${selectedFormat === fmt.id ? `${fmt.color}40` : 'rgba(255,255,255,0.05)'}`,
                    }}>
                    <i className={`${fmt.icon} text-lg`} style={{ color: fmt.color }} />
                    <span className="text-sm font-['Inter']"
                      style={{ color: selectedFormat === fmt.id ? '#FFFFFF' : '#9CA3AF' }}>
                      {isAr ? fmt.labelAr : fmt.label}
                    </span>
                    {selectedFormat === fmt.id && (
                      <i className="ri-check-line ml-auto text-sm" style={{ color: fmt.color }} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl p-4"
              style={{ background: 'rgba(10,37,64,0.8)', border: '1px solid rgba(184,138,60,0.12)' }}>
              <h3 className="text-white font-semibold font-['Inter'] text-sm mb-3">
                {isAr ? 'خيارات التصدير' : 'Export Options'}
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-gray-400 text-xs font-['Inter'] block mb-1">
                    {isAr ? 'القائمة' : 'Watchlist'}
                  </label>
                  <select value={exportWatchlist} onChange={e => setExportWatchlist(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm font-['Inter'] cursor-pointer"
                    style={{ background: 'rgba(5,20,40,0.8)', border: '1px solid rgba(184,138,60,0.15)', color: '#D1D5DB' }}>
                    <option value="all">All Watchlists</option>
                    <option value="wl-001">National Security</option>
                    <option value="wl-002">Overstay Monitoring</option>
                    <option value="wl-003">Financial Watchlist</option>
                    <option value="wl-004">Employment Violation</option>
                    <option value="wl-005">Interpol / International</option>
                    <option value="wl-006">Operation Falcon</option>
                    <option value="wl-007">Netherlands Sanctions</option>
                  </select>
                </div>

                {selectedFormat === 'pdf' && (
                  <div className="p-3 rounded-xl"
                    style={{ background: 'rgba(201,74,94,0.05)', border: '1px solid rgba(201,74,94,0.15)' }}>
                    <p className="text-red-400 text-xs font-semibold font-['Inter'] mb-1">
                      <i className="ri-lock-line mr-1" />
                      {isAr ? 'تصدير مُعدَّل للميدان' : 'Redacted Field Export'}
                    </p>
                    <p className="text-gray-400 text-xs font-['Inter']">
                      {isAr ? 'سيتم إخفاء المعلومات الحساسة. مناسب لضباط الميدان.' : 'Sensitive information will be redacted. Suitable for field officers.'}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  {[
                    { label: 'Include Photos', labelAr: 'تضمين الصور', default: true },
                    { label: 'Include Alert History', labelAr: 'تضمين سجل التنبيهات', default: false },
                    { label: 'Include Last Known Location', labelAr: 'تضمين آخر موقع', default: true },
                    { label: 'Encrypt Output', labelAr: 'تشفير الملف', default: selectedFormat === 'encrypted' },
                  ].map(opt => (
                    <div key={opt.label} className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs font-['Inter']">{isAr ? opt.labelAr : opt.label}</span>
                      <div className="w-8 h-4 rounded-full cursor-pointer relative"
                        style={{ background: opt.default ? '#D6B47E' : 'rgba(255,255,255,0.1)' }}>
                        <div className="absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all"
                          style={{ left: opt.default ? '18px' : '2px' }} />
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full py-3 rounded-xl text-sm font-bold font-['Inter'] cursor-pointer whitespace-nowrap transition-all"
                  style={{ background: '#D6B47E', color: '#051428' }}>
                  <i className="ri-download-2-line mr-2" />
                  {isAr ? 'تصدير الآن' : 'Export Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sync' && (
        <div className="rounded-xl overflow-hidden"
          style={{ background: 'rgba(10,37,64,0.8)', border: '1px solid rgba(184,138,60,0.12)' }}>
          <div className="px-4 py-3 border-b flex items-center justify-between"
            style={{ borderColor: 'rgba(184,138,60,0.08)' }}>
            <h3 className="text-white font-semibold font-['Inter'] text-sm">
              {isAr ? 'سجل المزامنة' : 'Sync History'}
            </h3>
            <button className="px-3 py-1.5 rounded-lg text-xs font-semibold font-['Inter'] whitespace-nowrap cursor-pointer"
              style={{ background: 'rgba(184,138,60,0.1)', color: '#D6B47E', border: '1px solid rgba(184,138,60,0.2)' }}>
              <i className="ri-refresh-line mr-1" />{isAr ? 'مزامنة الكل' : 'Sync All'}
            </button>
          </div>
          <div className="divide-y" style={{ borderColor: 'rgba(184,138,60,0.05)' }}>
            {syncHistory.map((s, i) => (
              <div key={i} className="px-4 py-3 flex items-center gap-4">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0"
                  style={{ background: s.status === 'success' ? 'rgba(74,222,128,0.1)' : 'rgba(201,74,94,0.1)' }}>
                  <i className={`text-sm ${s.status === 'success' ? 'ri-check-line text-green-400' : 'ri-close-line text-red-400'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold font-['Inter']">{s.source}</p>
                  <p className="text-gray-500 text-xs font-['JetBrains_Mono']">{s.time}</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-['JetBrains_Mono']">
                  <span className="text-green-400">+{s.added} added</span>
                  <span className="text-gold-400">~{s.updated} updated</span>
                  <span className="text-red-400">-{s.removed} removed</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full font-['JetBrains_Mono']"
                  style={{
                    background: s.status === 'success' ? 'rgba(74,222,128,0.15)' : 'rgba(201,74,94,0.15)',
                    color: s.status === 'success' ? '#4ADE80' : '#C94A5E',
                  }}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'attachments' && (
        <div className="space-y-5">
          {/* Drag-and-drop upload zone */}
          <div
            className="rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all"
            style={{
              background: attachDragOver ? 'rgba(184,138,60,0.08)' : 'rgba(10,37,64,0.6)',
              border: `2px dashed ${attachDragOver ? '#D6B47E' : 'rgba(184,138,60,0.2)'}`,
            }}
            onDragOver={e => { e.preventDefault(); setAttachDragOver(true); }}
            onDragLeave={() => setAttachDragOver(false)}
            onDrop={handleAttachDrop}>
            <div className="w-14 h-14 flex items-center justify-center rounded-2xl mb-4"
              style={{ background: 'rgba(184,138,60,0.1)' }}>
              <i className="ri-attachment-2 text-2xl" style={{ color: '#D6B47E' }} />
            </div>
            <p className="text-white font-semibold font-['Inter'] text-base mb-1">
              {isAr ? 'رفع المرفقات' : 'Upload Supporting Documents'}
            </p>
            <p className="text-gray-400 text-sm font-['Inter'] mb-1">
              {isAr
                ? 'اسحب وأفلت المستندات الداعمة (أوامر اعتقال، صور، قرارات قضائية، تقارير استخباراتية)'
                : 'Drag & drop supporting evidence — warrants, photos, court orders, intelligence reports'}
            </p>
            <p className="text-gray-600 text-xs font-['JetBrains_Mono'] mb-4">
              {isAr ? 'الصيغ المقبولة: PDF, JPG, PNG, DOCX — الحجم الأقصى: 25 ميغابايت' : 'Accepted: PDF, JPG, PNG, DOCX — Max 25 MB per file'}
            </p>
            <label className="px-4 py-2 rounded-xl text-sm font-semibold font-['Inter'] whitespace-nowrap cursor-pointer"
              style={{ background: '#D6B47E', color: '#051428' }}>
              <i className="ri-folder-open-line mr-2" />{isAr ? 'اختر ملفاً' : 'Browse Files'}
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.docx"
                className="hidden"
                onChange={e => {
                  if (e.target.files) addAttachmentFiles(Array.from(e.target.files));
                  e.target.value = '';
                }}
              />
            </label>
          </div>

          {/* Attachment list */}
          <div className="rounded-xl overflow-hidden"
            style={{ background: 'rgba(10,37,64,0.8)', border: '1px solid rgba(184,138,60,0.12)' }}>
            <div className="px-4 py-3 border-b flex items-center justify-between"
              style={{ borderColor: 'rgba(184,138,60,0.08)' }}>
              <h3 className="text-white font-semibold font-['Inter'] text-sm">
                {isAr ? 'المرفقات المرفوعة' : 'Uploaded Attachments'}
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-['JetBrains_Mono']"
                  style={{ background: 'rgba(184,138,60,0.12)', color: '#D6B47E' }}>
                  {attachments.length}
                </span>
              </h3>
            </div>

            {/* Table header */}
            <div className="px-4 py-2 grid text-xs font-semibold font-['Inter'] text-gray-500"
              style={{
                gridTemplateColumns: '2fr 100px 100px 130px 70px 90px 80px',
                borderBottom: '1px solid rgba(184,138,60,0.05)',
              }}>
              <span>{isAr ? 'اسم الملف' : 'File Name'}</span>
              <span>{isAr ? 'النوع' : 'Type'}</span>
              <span>{isAr ? 'رقم الهدف' : 'Target ID'}</span>
              <span>{isAr ? 'وقت الرفع' : 'Uploaded'}</span>
              <span>{isAr ? 'الحجم' : 'Size'}</span>
              <span>{isAr ? 'الحالة' : 'Status'}</span>
              <span>{isAr ? 'إجراءات' : 'Actions'}</span>
            </div>

            <div className="divide-y" style={{ borderColor: 'rgba(184,138,60,0.05)' }}>
              {attachments.length === 0 && (
                <div className="px-4 py-8 text-center text-gray-600 text-sm font-['Inter']">
                  {isAr ? 'لا توجد مرفقات بعد' : 'No attachments yet'}
                </div>
              )}
              {attachments.map(att => (
                <div key={att.id} className="px-4 py-3 grid items-center gap-2"
                  style={{ gridTemplateColumns: '2fr 100px 100px 130px 70px 90px 80px' }}>
                  {/* File name */}
                  <div className="flex items-center gap-2 min-w-0">
                    <i className={`text-sm flex-shrink-0 ${
                      att.name.endsWith('.pdf') ? 'ri-file-pdf-line' :
                      att.name.endsWith('.docx') ? 'ri-file-word-line' :
                      'ri-image-line'
                    }`} style={{ color: '#9CA3AF' }} />
                    <span className="text-white text-xs font-['JetBrains_Mono'] truncate" title={att.name}>
                      {att.name}
                    </span>
                  </div>

                  {/* Type badge */}
                  <span className="text-xs px-2 py-0.5 rounded-full font-['JetBrains_Mono'] font-bold w-fit"
                    style={{
                      background: `${typeBadgeColors[att.type]}18`,
                      color: typeBadgeColors[att.type],
                      border: `1px solid ${typeBadgeColors[att.type]}30`,
                    }}>
                    {att.type.replace('_', ' ')}
                  </span>

                  {/* Target ID */}
                  <span className="text-xs font-['JetBrains_Mono'] font-bold" style={{ color: '#D6B47E' }}>
                    {att.targetId}
                  </span>

                  {/* Uploaded */}
                  <span className="text-xs text-gray-500 font-['JetBrains_Mono']">{att.uploaded}</span>

                  {/* Size */}
                  <span className="text-xs text-gray-400 font-['JetBrains_Mono']">{att.size}</span>

                  {/* Status badge */}
                  <span className="text-xs px-2 py-0.5 rounded-full font-['JetBrains_Mono'] font-bold w-fit"
                    style={{
                      background: `${statusBadgeColors[att.status]}18`,
                      color: statusBadgeColors[att.status],
                      border: `1px solid ${statusBadgeColors[att.status]}30`,
                    }}>
                    {att.status}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      title={isAr ? 'عرض' : 'View'}
                      className="w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer transition-all"
                      style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.15)' }}>
                      <i className="ri-eye-line text-xs" style={{ color: '#60A5FA' }} />
                    </button>
                    <button
                      title={isAr ? 'حذف' : 'Delete'}
                      onClick={() => deleteAttachment(att.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer transition-all"
                      style={{ background: 'rgba(201,74,94,0.08)', border: '1px solid rgba(201,74,94,0.15)' }}>
                      <i className="ri-delete-bin-line text-xs" style={{ color: '#C94A5E' }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Import Validation Rules */}
          <div className="rounded-xl overflow-hidden"
            style={{ background: 'rgba(10,37,64,0.8)', border: '1px solid rgba(184,138,60,0.12)' }}>
            <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(184,138,60,0.08)' }}>
              <h3 className="text-white font-semibold font-['Inter'] text-sm">
                {isAr ? 'قواعد التحقق من الاستيراد' : 'Import Validation Rules'}
              </h3>
              <p className="text-gray-500 text-xs mt-0.5 font-['Inter']">
                {isAr ? 'تُطبَّق على جميع الاستيرادات الدفعية' : 'Applied to all bulk imports'}
              </p>
            </div>

            <div className="p-4 space-y-4">
              {/* Rule 1: Document Number Format Check */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-white text-sm font-semibold font-['Inter']">
                    {isAr ? 'التحقق من تنسيق رقم الوثيقة' : 'Document Number Format Check'}
                  </p>
                  <p className="text-gray-500 text-xs font-['Inter'] mt-0.5">
                    {isAr ? 'يتحقق من أن رقم الوثيقة يطابق أنماط الهوية الوطنية المعروفة' : 'Validates doc number matches known national ID patterns'}
                  </p>
                </div>
                <button
                  onClick={() => toggleRule('docNumberFormat')}
                  className="relative flex-shrink-0 cursor-pointer"
                  style={{ width: '38px', height: '22px' }}>
                  <div className="absolute inset-0 rounded-full transition-colors"
                    style={{
                      background: validationRules.docNumberFormat ? 'rgba(184,138,60,0.2)' : 'rgba(255,255,255,0.06)',
                      border: `1px solid ${validationRules.docNumberFormat ? 'rgba(184,138,60,0.4)' : 'rgba(255,255,255,0.08)'}`,
                    }} />
                  <div className="absolute top-0.5 rounded-full transition-all"
                    style={{
                      width: '18px', height: '18px',
                      left: validationRules.docNumberFormat ? '18px' : '2px',
                      background: validationRules.docNumberFormat ? '#D6B47E' : '#374151',
                    }} />
                </button>
              </div>

              <div className="h-px" style={{ background: 'rgba(184,138,60,0.06)' }} />

              {/* Rule 2: Duplicate Detection */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-white text-sm font-semibold font-['Inter']">
                    {isAr ? 'كشف التكرار' : 'Duplicate Detection'}
                  </p>
                  <p className="text-gray-500 text-xs font-['Inter'] mt-0.5">
                    {isAr ? 'يُبلِّغ عن الإدخالات الموجودة بالفعل في قائمة المراقبة' : 'Flags entries already present in the watchlist'}
                  </p>
                </div>
                <button
                  onClick={() => toggleRule('duplicateDetection')}
                  className="relative flex-shrink-0 cursor-pointer"
                  style={{ width: '38px', height: '22px' }}>
                  <div className="absolute inset-0 rounded-full transition-colors"
                    style={{
                      background: validationRules.duplicateDetection ? 'rgba(184,138,60,0.2)' : 'rgba(255,255,255,0.06)',
                      border: `1px solid ${validationRules.duplicateDetection ? 'rgba(184,138,60,0.4)' : 'rgba(255,255,255,0.08)'}`,
                    }} />
                  <div className="absolute top-0.5 rounded-full transition-all"
                    style={{
                      width: '18px', height: '18px',
                      left: validationRules.duplicateDetection ? '18px' : '2px',
                      background: validationRules.duplicateDetection ? '#D6B47E' : '#374151',
                    }} />
                </button>
              </div>

              <div className="h-px" style={{ background: 'rgba(184,138,60,0.06)' }} />

              {/* Rule 3: Name Fuzzy Match Threshold */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-semibold font-['Inter']">
                      {isAr ? 'حد التشابه في الأسماء' : 'Name Fuzzy Match Threshold'}
                    </p>
                    <p className="text-gray-500 text-xs font-['Inter'] mt-0.5">
                      {isAr ? 'النسبة الدنيا للتشابه اللازمة للإبلاغ عن تطابق محتمل' : 'Minimum similarity percentage to flag a potential name match'}
                    </p>
                  </div>
                  <span className="text-sm font-black font-['JetBrains_Mono']" style={{ color: '#D6B47E' }}>
                    {validationRules.fuzzyMatchThreshold}%
                  </span>
                </div>
                <div className="relative h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div className="absolute top-0 left-0 h-full rounded-full"
                    style={{
                      width: `${((validationRules.fuzzyMatchThreshold - 70) / 30) * 100}%`,
                      background: 'linear-gradient(to right, rgba(214,180,126,0.5), #D6B47E)',
                    }} />
                  <input
                    type="range" min={70} max={100} value={validationRules.fuzzyMatchThreshold}
                    onChange={e => setValidationRules(prev => ({ ...prev, fuzzyMatchThreshold: parseInt(e.target.value) }))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    style={{ zIndex: 10 }}
                  />
                  <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 pointer-events-none"
                    style={{
                      left: `calc(${((validationRules.fuzzyMatchThreshold - 70) / 30) * 100}% - 8px)`,
                      background: '#051428',
                      borderColor: '#D6B47E',
                      boxShadow: '0 0 8px rgba(214,180,126,0.6)',
                    }} />
                </div>
                <div className="flex justify-between text-xs text-gray-600 font-['JetBrains_Mono']">
                  <span>70%</span>
                  <span>85%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="h-px" style={{ background: 'rgba(184,138,60,0.06)' }} />

              {/* Rule 4: Mandatory Fields Check */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-white text-sm font-semibold font-['Inter']">
                    {isAr ? 'التحقق من الحقول الإلزامية' : 'Mandatory Fields Check'}
                  </p>
                  <p className="text-gray-500 text-xs font-['Inter'] mt-0.5">
                    {isAr ? 'يشترط توافر الاسم والجنسية وتاريخ الميلاد' : 'Requires name, nationality, and date of birth to be present'}
                  </p>
                </div>
                <button
                  onClick={() => toggleRule('mandatoryFields')}
                  className="relative flex-shrink-0 cursor-pointer"
                  style={{ width: '38px', height: '22px' }}>
                  <div className="absolute inset-0 rounded-full transition-colors"
                    style={{
                      background: validationRules.mandatoryFields ? 'rgba(184,138,60,0.2)' : 'rgba(255,255,255,0.06)',
                      border: `1px solid ${validationRules.mandatoryFields ? 'rgba(184,138,60,0.4)' : 'rgba(255,255,255,0.08)'}`,
                    }} />
                  <div className="absolute top-0.5 rounded-full transition-all"
                    style={{
                      width: '18px', height: '18px',
                      left: validationRules.mandatoryFields ? '18px' : '2px',
                      background: validationRules.mandatoryFields ? '#D6B47E' : '#374151',
                    }} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportExport;
