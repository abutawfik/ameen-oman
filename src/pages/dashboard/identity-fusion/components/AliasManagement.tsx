import { useState } from 'react';
import { aliasLinks, personRecords, type AliasLink } from '@/mocks/identityFusionData';

interface Props { isAr: boolean; }

const linkTypeConfig: Record<string, { label: string; labelAr: string; color: string; bg: string; icon: string }> = {
  known_alias: { label: 'Known Alias',  labelAr: 'اسم مستعار معروف', color: '#D4A84B', bg: 'rgba(181,142,60,0.1)',  icon: 'ri-user-2-line' },
  family:      { label: 'Family',       labelAr: 'عائلة',             color: '#4ADE80', bg: 'rgba(74,222,128,0.1)',  icon: 'ri-group-line' },
  associate:   { label: 'Associate',    labelAr: 'مرتبط',             color: '#FACC15', bg: 'rgba(250,204,21,0.1)',  icon: 'ri-links-line' },
  suspected:   { label: 'Suspected',    labelAr: 'مشتبه به',          color: '#F87171', bg: 'rgba(248,113,113,0.1)', icon: 'ri-alert-line' },
};

export default function AliasManagement({ isAr }: Props) {
  const [links, setLinks] = useState<AliasLink[]>(aliasLinks);
  const [selectedPerson, setSelectedPerson] = useState(personRecords[0]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAlias, setNewAlias] = useState({ name: '', type: 'known_alias', notes: '' });

  const personLinks = links.filter(l => l.primaryId === selectedPerson.id || l.aliasId === selectedPerson.id);

  const handleAddAlias = () => {
    if (!newAlias.name.trim()) return;
    const link: AliasLink = {
      id: `AL-${Date.now()}`,
      primaryId: selectedPerson.id,
      aliasId: `${selectedPerson.id}-NEW`,
      primaryName: selectedPerson.nameEn,
      aliasName: newAlias.name,
      linkType: newAlias.type as AliasLink['linkType'],
      confidence: 70,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      notes: newAlias.notes,
    };
    setLinks(prev => [...prev, link]);
    setNewAlias({ name: '', type: 'known_alias', notes: '' });
    setShowAddModal(false);
  };

  return (
    <div className="p-5 flex gap-5">
      {/* Person selector */}
      <div className="w-64 shrink-0 space-y-2">
        <p className="text-gray-500 text-xs uppercase tracking-wider mb-3 font-['JetBrains_Mono']">
          {isAr ? 'اختر شخصاً' : 'Select Person'}
        </p>
        {personRecords.map(person => {
          const isSelected = selectedPerson.id === person.id;
          const personLinkCount = links.filter(l => l.primaryId === person.id || l.aliasId === person.id).length;
          return (
            <button
              key={person.id}
              onClick={() => setSelectedPerson(person)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all text-left"
              style={{
                background: isSelected ? 'rgba(181,142,60,0.08)' : 'rgba(20,29,46,0.6)',
                borderColor: isSelected ? 'rgba(181,142,60,0.4)' : 'rgba(255,255,255,0.06)',
              }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
                style={{
                  background: `rgba(181,142,60,0.12)`,
                  color: '#D4A84B',
                  border: `1.5px solid ${isSelected ? '#D4A84B' : 'rgba(181,142,60,0.2)'}`,
                }}
              >
                {person.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-semibold font-['Inter'] truncate">
                  {isAr ? person.nameAr : person.nameEn}
                </p>
                <p className="text-gray-600 text-xs font-['JetBrains_Mono']">{person.id}</p>
              </div>
              {personLinkCount > 0 && (
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full font-mono shrink-0"
                  style={{ background: 'rgba(181,142,60,0.1)', color: '#D4A84B' }}
                >
                  {personLinkCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Alias detail panel */}
      <div className="flex-1 space-y-4">
        {/* Person header */}
        <div
          className="rounded-xl border border-gold-500/20 p-5"
          style={{ background: 'rgba(20,29,46,0.8)' }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg shrink-0"
                style={{ background: 'rgba(181,142,60,0.12)', color: '#D4A84B', border: '2px solid rgba(181,142,60,0.35)' }}
              >
                {selectedPerson.initials}
              </div>
              <div>
                <p className="text-white font-bold text-lg font-['Inter']">{isAr ? selectedPerson.nameAr : selectedPerson.nameEn}</p>
                <p className="text-gray-500 text-sm font-['JetBrains_Mono']">{selectedPerson.canonicalId}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span>{selectedPerson.nationalityFlag}</span>
                  <span className="text-gray-400 text-xs font-['Inter']">{selectedPerson.nationality} · DOB: {selectedPerson.dob}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap transition-all font-['Inter']"
              style={{ background: '#D4A84B', color: '#0B1220' }}
            >
              <i className="ri-add-line" />
              {isAr ? 'إضافة اسم مستعار' : 'Add Alias'}
            </button>
          </div>

          {/* Documents */}
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedPerson.documents.map((doc, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{ background: 'rgba(181,142,60,0.06)', border: '1px solid rgba(181,142,60,0.15)' }}
              >
                <i className="ri-file-text-line text-gold-400/60 text-xs" />
                <span className="text-gold-400/80 text-xs font-['JetBrains_Mono']">{doc.type}: {doc.number}</span>
              </div>
            ))}
            {selectedPerson.phones.map((ph, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{ background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.15)' }}
              >
                <i className="ri-phone-line text-green-400/60 text-xs" />
                <span className="text-green-400/80 text-xs font-['JetBrains_Mono']">{ph}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alias links */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-bold text-sm font-['Inter']">
              {isAr ? 'الأسماء المستعارة والروابط' : 'Aliases & Links'}
              <span className="text-gray-500 font-normal ml-2">({personLinks.length})</span>
            </h3>
          </div>

          {personLinks.length === 0 ? (
            <div
              className="rounded-xl border border-dashed border-gold-500/20 p-8 text-center"
              style={{ background: 'rgba(20,29,46,0.4)' }}
            >
              <i className="ri-user-unfollow-line text-gray-600 text-3xl mb-2 block" />
              <p className="text-gray-500 text-sm font-['Inter']">
                {isAr ? 'لا توجد أسماء مستعارة أو روابط لهذا الشخص' : 'No aliases or links for this person'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {personLinks.map(link => {
                const tc = linkTypeConfig[link.linkType];
                const isPrimary = link.primaryId === selectedPerson.id;
                return (
                  <div
                    key={link.id}
                    className="rounded-xl border p-4 transition-all"
                    style={{ background: 'rgba(20,29,46,0.8)', borderColor: `${tc.color}20` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: tc.bg }}
                        >
                          <i className={`${tc.icon} text-sm`} style={{ color: tc.color }} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-white font-semibold text-sm font-['Inter']">
                              {isPrimary ? link.aliasName : link.primaryName}
                            </span>
                            <span
                              className="text-xs px-2 py-0.5 rounded-full font-['Inter']"
                              style={{ background: tc.bg, color: tc.color }}
                            >
                              {isAr ? tc.labelAr : tc.label}
                            </span>
                          </div>
                          <p className="text-gray-500 text-xs font-['Inter']">{link.notes}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1 justify-end mb-1">
                          <span className="text-gray-500 text-xs font-['JetBrains_Mono']">
                            {isAr ? 'الثقة' : 'Confidence'}
                          </span>
                          <span className="font-mono font-bold text-sm" style={{ color: tc.color }}>
                            {link.confidence}%
                          </span>
                        </div>
                        <p className="text-gray-600 text-xs font-['JetBrains_Mono']">{link.createdAt}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add alias modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
          <div
            className="w-full max-w-md rounded-2xl border border-gold-500/25 overflow-hidden"
            style={{ background: 'rgba(20,29,46,0.98)' }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gold-500/15">
              <h3 className="text-white font-bold text-base font-['Inter']">
                {isAr ? 'إضافة اسم مستعار أو رابط' : 'Add Alias or Link'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-300 cursor-pointer">
                <i className="ri-close-line text-xl" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-gray-400 text-xs mb-1.5 uppercase tracking-wider font-['Inter']">
                  {isAr ? 'الاسم المستعار' : 'Alias Name'}
                </label>
                <input
                  type="text"
                  value={newAlias.name}
                  onChange={e => setNewAlias(p => ({ ...p, name: e.target.value }))}
                  placeholder={isAr ? 'أدخل الاسم المستعار' : 'Enter alias name'}
                  className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 outline-none font-['Inter']"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(181,142,60,0.2)' }}
                />
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-1.5 uppercase tracking-wider font-['Inter']">
                  {isAr ? 'نوع الرابط' : 'Link Type'}
                </label>
                <select
                  value={newAlias.type}
                  onChange={e => setNewAlias(p => ({ ...p, type: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none cursor-pointer font-['Inter']"
                  style={{ background: 'rgba(20,29,46,0.9)', border: '1px solid rgba(181,142,60,0.2)' }}
                >
                  {Object.entries(linkTypeConfig).map(([k, v]) => (
                    <option key={k} value={k}>{isAr ? v.labelAr : v.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-1.5 uppercase tracking-wider font-['Inter']">
                  {isAr ? 'ملاحظات' : 'Notes'}
                </label>
                <textarea
                  value={newAlias.notes}
                  onChange={e => setNewAlias(p => ({ ...p, notes: e.target.value }))}
                  placeholder={isAr ? 'سبب الرابط...' : 'Reason for link...'}
                  rows={3}
                  maxLength={500}
                  className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 outline-none resize-none font-['Inter']"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(181,142,60,0.2)' }}
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/5">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg text-sm border border-gold-500/25 text-gold-400 hover:bg-gold-500/8 cursor-pointer transition-colors whitespace-nowrap font-['Inter']"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={handleAddAlias}
                className="px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap font-['Inter']"
                style={{ background: '#D4A84B', color: '#0B1220' }}
              >
                {isAr ? 'إضافة' : 'Add Link'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
