import { useState } from 'react';

interface Props {
  isAr: boolean;
}

const importSources = [
  { id: 'interpol', name: 'Interpol MIND Database', nameAr: 'قاعدة بيانات الإنتربول MIND', icon: 'ri-global-line', color: '#A78BFA', status: 'connected', lastSync: '2025-04-06 06:00', records: 234 },
  { id: 'immigration', name: 'Immigration System', nameAr: 'نظام الهجرة', icon: 'ri-passport-line', color: '#60A5FA', status: 'connected', lastSync: '2025-04-06 08:30', records: 1203 },
  { id: 'gcc', name: 'GCC Security Network', nameAr: 'شبكة أمن دول الخليج', icon: 'ri-shield-line', color: '#4ADE80', status: 'connected', lastSync: '2025-04-05 22:00', records: 89 },
  { id: 'un', name: 'UN Sanctions List', nameAr: 'قائمة عقوبات الأمم المتحدة', icon: 'ri-building-line', color: '#FACC15', status: 'pending', lastSync: '2025-04-04 12:00', records: 45 },
  { id: 'fatf', name: 'FATF High-Risk Countries', nameAr: 'دول FATF عالية المخاطر', icon: 'ri-money-dollar-circle-line', color: '#FB923C', status: 'connected', lastSync: '2025-04-06 00:00', records: 12 },
];

const exportFormats = [
  { id: 'pdf', label: 'Redacted PDF (Field Ops)', labelAr: 'PDF مُعدَّل (عمليات الميدان)', icon: 'ri-file-pdf-line', color: '#F87171' },
  { id: 'csv', label: 'CSV Export (Document Numbers)', labelAr: 'تصدير CSV (أرقام الوثائق)', icon: 'ri-file-excel-line', color: '#4ADE80' },
  { id: 'json', label: 'JSON (API Integration)', labelAr: 'JSON (تكامل API)', icon: 'ri-code-s-slash-line', color: '#22D3EE' },
  { id: 'encrypted', label: 'Encrypted Package (Secure Share)', labelAr: 'حزمة مشفرة (مشاركة آمنة)', icon: 'ri-lock-line', color: '#A78BFA' },
];

const syncHistory = [
  { source: 'Interpol MIND', time: '2025-04-06 06:00', added: 3, updated: 12, removed: 1, status: 'success' },
  { source: 'Immigration System', time: '2025-04-06 08:30', added: 28, updated: 45, removed: 0, status: 'success' },
  { source: 'GCC Security Network', time: '2025-04-05 22:00', added: 0, updated: 5, removed: 2, status: 'success' },
  { source: 'UN Sanctions List', time: '2025-04-04 12:00', added: 0, updated: 0, removed: 0, status: 'failed' },
  { source: 'FATF High-Risk Countries', time: '2025-04-06 00:00', added: 0, updated: 2, removed: 0, status: 'success' },
];

const ImportExport = ({ isAr }: Props) => {
  const [activeTab, setActiveTab] = useState<'import' | 'export' | 'sync'>('import');
  const [dragOver, setDragOver] = useState(false);
  const [selectedExport, setSelectedExport] = useState<string[]>([]);
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [exportWatchlist, setExportWatchlist] = useState('all');

  const toggleExportWl = (id: string) => {
    setSelectedExport(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit"
        style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(34,211,238,0.1)' }}>
        {[
          { key: 'import', label: 'Import Sources', labelAr: 'مصادر الاستيراد' },
          { key: 'export', label: 'Export', labelAr: 'التصدير' },
          { key: 'sync', label: 'Sync History', labelAr: 'سجل المزامنة' },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key as 'import' | 'export' | 'sync')}
            className="px-4 py-2 rounded-lg text-sm font-semibold font-['Inter'] whitespace-nowrap cursor-pointer transition-all"
            style={{
              background: activeTab === tab.key ? '#22D3EE' : 'transparent',
              color: activeTab === tab.key ? '#060D1A' : '#9CA3AF',
            }}>
            {isAr ? tab.labelAr : tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'import' && (
        <div className="space-y-4">
          {/* CSV Upload */}
          <div
            className="rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all"
            style={{
              background: dragOver ? 'rgba(34,211,238,0.08)' : 'rgba(10,22,40,0.6)',
              border: `2px dashed ${dragOver ? '#22D3EE' : 'rgba(34,211,238,0.2)'}`,
            }}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={() => setDragOver(false)}>
            <div className="w-14 h-14 flex items-center justify-center rounded-2xl mb-4"
              style={{ background: 'rgba(34,211,238,0.1)' }}>
              <i className="ri-upload-cloud-2-line text-2xl text-cyan-400" />
            </div>
            <p className="text-white font-semibold font-['Inter'] text-base mb-1">
              {isAr ? 'رفع ملف CSV' : 'Upload CSV File'}
            </p>
            <p className="text-gray-400 text-sm font-['Inter'] mb-4">
              {isAr ? 'اسحب وأفلت ملف CSV يحتوي على أرقام الوثائق' : 'Drag & drop a CSV file with document numbers'}
            </p>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-xl text-sm font-semibold font-['Inter'] whitespace-nowrap cursor-pointer"
                style={{ background: '#22D3EE', color: '#060D1A' }}>
                <i className="ri-folder-open-line mr-2" />{isAr ? 'اختر ملفاً' : 'Browse File'}
              </button>
              <button className="px-4 py-2 rounded-xl text-sm font-semibold font-['Inter'] whitespace-nowrap cursor-pointer"
                style={{ border: '1px solid rgba(34,211,238,0.3)', color: '#22D3EE' }}>
                <i className="ri-download-line mr-2" />{isAr ? 'تحميل القالب' : 'Download Template'}
              </button>
            </div>
            <p className="text-gray-600 text-xs font-['JetBrains_Mono'] mt-3">
              {isAr ? 'الحقول المطلوبة: document_number, doc_type, reason' : 'Required fields: document_number, doc_type, reason'}
            </p>
          </div>

          {/* External Sources */}
          <h3 className="text-white font-semibold font-['Inter'] text-sm">
            {isAr ? 'المصادر الخارجية' : 'External Import Sources'}
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {importSources.map(src => (
              <div key={src.id} className="rounded-xl p-4 flex items-center gap-4"
                style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(34,211,238,0.12)' }}>
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
                    style={{ background: 'rgba(34,211,238,0.1)', color: '#22D3EE', border: '1px solid rgba(34,211,238,0.2)' }}>
                    <i className="ri-refresh-line mr-1" />{isAr ? 'مزامنة' : 'Sync Now'}
                  </button>
                  <button className="px-3 py-1.5 rounded-lg text-xs font-semibold font-['Inter'] whitespace-nowrap cursor-pointer"
                    style={{ border: '1px solid rgba(34,211,238,0.15)', color: '#9CA3AF' }}>
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
              style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(34,211,238,0.12)' }}>
              <h3 className="text-white font-semibold font-['Inter'] text-sm mb-3">
                {isAr ? 'تنسيق التصدير' : 'Export Format'}
              </h3>
              <div className="space-y-2">
                {exportFormats.map(fmt => (
                  <button key={fmt.id} onClick={() => setSelectedFormat(fmt.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all text-left"
                    style={{
                      background: selectedFormat === fmt.id ? `${fmt.color}12` : 'rgba(6,13,26,0.5)',
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
              style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(34,211,238,0.12)' }}>
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
                    style={{ background: 'rgba(6,13,26,0.8)', border: '1px solid rgba(34,211,238,0.15)', color: '#D1D5DB' }}>
                    <option value="all">All Watchlists</option>
                    <option value="wl-001">National Security</option>
                    <option value="wl-002">Overstay Monitoring</option>
                    <option value="wl-003">Financial Watchlist</option>
                    <option value="wl-004">Employment Violation</option>
                    <option value="wl-005">Interpol / International</option>
                    <option value="wl-006">Operation Falcon</option>
                  </select>
                </div>

                {selectedFormat === 'pdf' && (
                  <div className="p-3 rounded-xl"
                    style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.15)' }}>
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
                        style={{ background: opt.default ? '#22D3EE' : 'rgba(255,255,255,0.1)' }}>
                        <div className="absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all"
                          style={{ left: opt.default ? '18px' : '2px' }} />
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full py-3 rounded-xl text-sm font-bold font-['Inter'] cursor-pointer whitespace-nowrap transition-all"
                  style={{ background: '#22D3EE', color: '#060D1A' }}>
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
          style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(34,211,238,0.12)' }}>
          <div className="px-4 py-3 border-b flex items-center justify-between"
            style={{ borderColor: 'rgba(34,211,238,0.08)' }}>
            <h3 className="text-white font-semibold font-['Inter'] text-sm">
              {isAr ? 'سجل المزامنة' : 'Sync History'}
            </h3>
            <button className="px-3 py-1.5 rounded-lg text-xs font-semibold font-['Inter'] whitespace-nowrap cursor-pointer"
              style={{ background: 'rgba(34,211,238,0.1)', color: '#22D3EE', border: '1px solid rgba(34,211,238,0.2)' }}>
              <i className="ri-refresh-line mr-1" />{isAr ? 'مزامنة الكل' : 'Sync All'}
            </button>
          </div>
          <div className="divide-y" style={{ borderColor: 'rgba(34,211,238,0.05)' }}>
            {syncHistory.map((s, i) => (
              <div key={i} className="px-4 py-3 flex items-center gap-4">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0"
                  style={{ background: s.status === 'success' ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)' }}>
                  <i className={`text-sm ${s.status === 'success' ? 'ri-check-line text-green-400' : 'ri-close-line text-red-400'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold font-['Inter']">{s.source}</p>
                  <p className="text-gray-500 text-xs font-['JetBrains_Mono']">{s.time}</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-['JetBrains_Mono']">
                  <span className="text-green-400">+{s.added} added</span>
                  <span className="text-cyan-400">~{s.updated} updated</span>
                  <span className="text-red-400">-{s.removed} removed</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full font-['JetBrains_Mono']"
                  style={{
                    background: s.status === 'success' ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)',
                    color: s.status === 'success' ? '#4ADE80' : '#F87171',
                  }}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportExport;
