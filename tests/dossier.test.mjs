import test from 'node:test';
import assert from 'node:assert/strict';
const { buildDossierText } = await import('../src/workflows/dossier.ts').catch(()=>({}));
test('dossier contains selected subject and explicitly marks missing linked evidence',()=>{
 const subject={id:'demo',nameEn:'Demo Guest',docNumber:'DEMO-1',nationality:'Oman',riskScore:20,riskLevel:'low',status:'unknown',lastSeen:'2026-10-10',streamCount:0,eventCount:0,alertCount:0};
 const text=buildDossierText?.({subject,classification:'RESTRICTED',sections:['identity_documents','hotel_stays'],purpose:'Demo review',caseRef:'DEMO-CASE'});
 assert.ok(text?.includes('DEMO-1'));assert.ok(text?.includes('DEMO-CASE'));assert.ok(text?.includes('No linked source records'));
 assert.ok(!text?.includes('Mikhail'));assert.ok(!text?.includes('deportation'));
});
