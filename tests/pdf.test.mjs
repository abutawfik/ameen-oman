import test from 'node:test';
import assert from 'node:assert/strict';
const { assemblePdf } = await import('../src/workflows/pdf.ts').catch(()=>({}));
test('PDF contains one page per image and byte-accurate object offsets',()=>{
 const pdf=assemblePdf?.([{bytes:new Uint8Array([255,216,255,217]),width:1240,height:1754},{bytes:new Uint8Array([255,216,255,217]),width:1240,height:1754}]);
 assert.ok(pdf instanceof Uint8Array);
 const text=new TextDecoder('latin1').decode(pdf);
 assert.ok(text.startsWith('%PDF-1.4'));assert.match(text,/\/Count 2/);
 const start=Number(text.match(/startxref\n(\d+)/)[1]);assert.equal(text.slice(start,start+4),'xref');
 const offsets=[...text.matchAll(/(\d{10}) 00000 n/g)].map(m=>Number(m[1]));
 offsets.forEach((n,i)=>assert.equal(text.slice(n,n+`${i+1} 0 obj`.length),`${i+1} 0 obj`));
});
test('empty export is rejected instead of returning a success-shaped file',()=>assert.throws(()=>assemblePdf?.([])));
