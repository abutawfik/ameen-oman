import { dossierSections, type SubjectSearchResult, type SectionKey } from '../mocks/dossierData.ts';
export function dossierSectionText(subject: SubjectSearchResult, key: SectionKey) {
  switch (key) {
    case 'cover_page': case 'identity_documents':
      return [`Subject: ${subject.nameEn}`, `Document: ${subject.docNumber}`, `Nationality: ${subject.nationality}`, `Status: ${subject.status}`, `Last seen (demo): ${subject.lastSeen}`].join('\n');
    case 'executive_summary':
      return `Demo subject: ${subject.nameEn} (${subject.docNumber}).\nThe selected fixture reports ${subject.eventCount} events across ${subject.streamCount} streams and ${subject.alertCount} alerts. These summary counts are simulated, and linked source records have not been supplied. No operational conclusion should be drawn from this demonstration.`;
    case 'risk_assessment':
      return `Demo risk score: ${subject.riskScore}/100 (${subject.riskLevel}).\nThis fixture score is not a verified assessment. No linked source records or scoring evidence have been supplied for this subject.`;
    default:
      return `No linked source records provided for ${subject.nameEn} (${subject.docNumber}) in this demo section.\nThis section is included to show the requested report structure; it does not substitute records from another subject.`;
  }
}
export function buildDossierText(config: { subject: SubjectSearchResult; classification: string; sections: SectionKey[]; purpose: string; caseRef: string }) {
  const header = `DEMONSTRATION DATA — UNENCRYPTED LOCAL EXPORT\nClassification label: ${config.classification}\nSubject ID: ${config.subject.id}\nPurpose: ${config.purpose || 'Demo review'}\nCase reference: ${config.caseRef || 'None'}\n`;
  return header + config.sections.map(key => {
    const section = dossierSections.find(s => s.key === key);
    return `\n${section?.label ?? key}\n${dossierSectionText(config.subject, key)}\n`;
  }).join('\n');
}
