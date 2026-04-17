import { useState, useRef } from 'react';

interface Props { lang: 'en' | 'ar'; }

interface UploadRow {
  id: string;
  filename: string;
  rows: number;
  status: 'processing' | 'success' | 'error' | 'pending';
  synced: number;
  errors: number;
  uploadedAt: string;
}

const MOCK_HISTORY: UploadRow[] = [
  { id: 'UPL001', filename: 'checkins_april_01.csv',  rows: 45, status: 'success', synced: 45, errors: 0, uploadedAt: '2025-04-01 09:12' },
  { id: 'UPL002', filename: 'bookings_march.xlsx',    rows: 120, status: 'success', synced: 118, errors: 2, uploadedAt: '2025-03-31 16:44' },
  { id: 'UPL003', filename: 'checkouts_march.csv',    rows: 98, status: 'error',   synced: 0,   errors: 98, uploadedAt: '2025-03-30 11:20' },
  { id: 'UPL004', filename: 'events_march_week3.xls', rows: 67, status: 'success', synced: 67, errors: 0, uploadedAt: '2025-03-22 14:05' },
];

export default function BatchUpload({ lang }: Props) {
  const isAr = lang === 'ar';
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedFile, setProcessedFile] = useState<string | null>(null);
  const [history, setHistory] = useState<UploadRow[]>(MOCK_HISTORY);

  const handleFile = (file: File) => {
    const allowed = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!allowed.includes(file.type) && !file.name.match(/\.(csv|xls|xlsx)$/i)) return;
    if (file.size > 5 * 1024 * 1024) return;

    setProcessedFile(file.name);
    setProcessing(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setProcessing(false);
          const newRow: UploadRow = {
            id: `UPL${Date.now()}`,
            filename: file.name,
            rows: Math.floor(Math.random() * 80) + 20,
            status: 'success',
            synced: Math.floor(Math.random() * 70) + 15,
            errors: Math.floor(Math.random() * 3),
            uploadedAt: new Date().toLocaleString('en-GB').slice(0, 16),
          };
          setHistory(prev => [newRow, ...prev]);
          return 100;
        }
        return p + 8;
      });
    }, 150);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const statusConfig = {
    success:    { color: '#4ADE80', label: 'Success',    labelAr: 'نجح' },
    error:      { color: '#C94A5E', label: 'Error',      labelAr: 'خطأ' },
    processing: { color: '#D6B47E', label: 'Processing', labelAr: 'جارٍ' },
    pending:    { color: '#FACC15', label: 'Pending',    labelAr: 'معلق' },
  };

  return (
    <div className="p-5 max-w-4xl">
      <div className="mb-5">
        <h2 className="text-white font-bold text-lg">{isAr ? 'رفع ملف الأحداث' : 'Upload Events File'}</h2>
        <p className="text-gray-400 text-xs mt-0.5">{isAr ? 'ارفع ملف CSV أو Excel يحتوي على أحداث متعددة' : 'Upload a CSV or Excel file containing multiple events'}</p>
      </div>

      {/* Template download */}
      <div className="rounded-xl border border-gold-500/20 p-4 mb-5 flex items-center justify-between" style={{ background: 'rgba(10,37,64,0.8)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(184,138,60,0.1)' }}>
            <i className="ri-file-excel-2-line text-gold-400 text-lg" />
          </div>
          <div>
            <p className="text-white text-sm font-medium">{isAr ? 'قالب الرفع' : 'Upload Template'}</p>
            <p className="text-gray-500 text-xs">{isAr ? 'حمّل القالب لضمان التنسيق الصحيح' : 'Download template to ensure correct format'}</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border border-gold-500/30 text-gold-400 hover:bg-gold-500/10 cursor-pointer transition-all whitespace-nowrap">
          <i className="ri-download-line" />{isAr ? 'تحميل القالب' : 'Download Template'}
        </button>
      </div>

      {/* Drop zone */}
      <div
        className="rounded-xl border-2 border-dashed p-10 text-center mb-5 cursor-pointer transition-all"
        style={{
          borderColor: dragging ? '#D6B47E' : 'rgba(184,138,60,0.2)',
          background: dragging ? 'rgba(184,138,60,0.06)' : 'rgba(10,37,64,0.5)',
        }}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".csv,.xls,.xlsx"
          className="hidden"
          onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
        />
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(184,138,60,0.1)' }}>
          <i className="ri-upload-cloud-2-line text-gold-400 text-3xl" />
        </div>
        <p className="text-white font-semibold mb-1">
          {isAr ? 'اسحب الملف هنا أو انقر للاختيار' : 'Drag & drop file here or click to browse'}
        </p>
        <p className="text-gray-500 text-sm">
          {isAr ? 'CSV / XLS / XLSX · الحد الأقصى 5MB' : 'CSV / XLS / XLSX · Max 5MB'}
        </p>
      </div>

      {/* Processing modal */}
      {processing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(5,20,40,0.85)' }}
        >
          <div className="rounded-2xl border border-gold-500/30 p-8 w-full max-w-sm text-center" style={{ background: 'rgba(10,37,64,0.98)' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(184,138,60,0.1)' }}>
              <i className="ri-loader-4-line text-gold-400 text-3xl animate-spin" />
            </div>
            <h3 className="text-white font-semibold mb-1">{isAr ? 'جارٍ المعالجة...' : 'Processing...'}</h3>
            <p className="text-gray-400 text-sm mb-4 truncate">{processedFile}</p>
            <div className="h-2 rounded-full overflow-hidden mb-2" style={{ background: 'rgba(184,138,60,0.1)' }}>
              <div className="h-full rounded-full transition-all duration-150" style={{ width: `${progress}%`, background: '#D6B47E' }} />
            </div>
            <p className="text-gold-400 font-mono text-sm">{progress}%</p>
          </div>
        </div>
      )}

      {/* Upload history */}
      <div className="rounded-xl border border-gold-500/20 overflow-hidden" style={{ background: 'rgba(10,37,64,0.8)' }}>
        <div className="px-5 py-3 border-b border-gold-500/10">
          <h3 className="text-white font-semibold text-sm">{isAr ? 'سجل الرفع' : 'Upload History'}</h3>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gold-500/10">
              {[isAr ? 'الملف' : 'File', isAr ? 'الصفوف' : 'Rows', isAr ? 'مُزامن' : 'Synced', isAr ? 'أخطاء' : 'Errors', isAr ? 'الحالة' : 'Status', isAr ? 'التاريخ' : 'Uploaded'].map(h => (
                <th key={h} className="text-left text-gray-500 font-medium py-3 px-4 uppercase tracking-wider" style={{ fontSize: 10 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.map(row => {
              const sc = statusConfig[row.status];
              return (
                <tr key={row.id} className="border-b border-gold-500/5 hover:bg-gold-500/5 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <i className="ri-file-excel-2-line text-green-400 text-sm" />
                      <span className="text-white">{row.filename}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-gray-300">{row.rows}</td>
                  <td className="py-3 px-4 font-mono text-green-400">{row.synced}</td>
                  <td className="py-3 px-4 font-mono" style={{ color: row.errors > 0 ? '#C94A5E' : '#6B7280' }}>{row.errors}</td>
                  <td className="py-3 px-4">
                    <span className="flex items-center gap-1.5 text-xs" style={{ color: sc.color }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: sc.color }} />
                      {isAr ? sc.labelAr : sc.label}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-gray-500">{row.uploadedAt}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
